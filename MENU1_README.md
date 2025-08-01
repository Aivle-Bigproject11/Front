# 장례서류작성 시스템 - Menu1 분리 구조

## 📋 개요
기존 Menu1.js 3개의 독립적인 페이지로 분리:
- **Menu1-1**: 고객 목록 페이지
- **Menu1-2**: 장례정보 등록 페이지  
- **Menu1-3**: 서류관리 페이지

## 🗂️ 파일 구조

```
src/
├── pages/
│   ├── Menu1.js          # 메인 라우터 (네비게이션 관리)
│   ├── Menu1-1.js        # 고객 목록 페이지
│   ├── Menu1-2.js        # 장례정보 등록 페이지
│   └── Menu1-3.js        # 서류관리 페이지
├── services/
│   ├── customerService.js    # 고객 데이터 API 서비스
│   └── documentService.js    # 서류 생성/관리 API 서비스
└── data/
    └── formData.js          # 폼 데이터 구조 및 유효성 검사 규칙
```

## 🔗 페이지 흐름

```
Menu1-1 (고객 목록)
    ├── "정보등록" 버튼 → Menu1-2 (정보 등록)
    └── "서류관리" 버튼 → Menu1-3 (서류 관리)

Menu1-2 (정보 등록)
    └── "돌아가기" → Menu1-1

Menu1-3 (서류 관리)
    └── "돌아가기" → Menu1-1
```

## 📊 데이터 구조

### 고객 데이터 (Customer)
```javascript
{
  id: number,
  name: string,
  phone: string,
  type: '고인',
  status: 'pending' | 'inProgress' | 'completed',
  age: string,
  documents: {
    obituary: boolean,
    schedule: boolean,
    deathCertificate: boolean
  },
  funeralDate: string,
  location: string,
  createdAt: string,
  updatedAt: string,
  formData?: object  // 등록된 상세 정보
}
```

### 폼 데이터 (FormData)
```javascript
{
  // 상조회사 정보
  상조회사이름: string,
  담당장례지도사이름: string,
  담당장례지도사연락처: string,
  
  // 고객 정보
  장례의대상고인ID: string,
  상조회사고객ID: string,
  상조회사고객이름: string,
  상조회사고객전화번호: string,
  
  // 고인 기본 정보
  고인성명한글: string,
  고인성명한자: string,
  고인주민등록번호: string,
  고인나이: string,
  고인돌아가신날짜: string,
  고인생일: string,
  고인성별: string,
  고인종교: string,
  고인과세대주의관계: string,
  
  // 신고인 정보
  사망신고서시설등록자: string,
  신고인이름: string,
  신고인주민등록번호: string,
  신고인전화번호: string,
  신고인과고인의관계: string,
  신고인주소: string,
  신고인이메일: string,
  
  // 제출인 정보
  제출인이름: string,
  제출인주민등록번호: string,
  
  // 장례 관련 정보
  회원정보: string,
  장례식장이름: string,
  빈소정보: string,
  장례식장주소: string,
  장례시간: string,
  발인일시: string,
  장지정보: string,
  상주목록: string,
  고인의키워드: string
}
```

## 🔧 API 서비스

### customerService
- `getAllCustomers()`: 모든 고객 조회
- `getCustomerById(id)`: 특정 고객 조회
- `createCustomer(data)`: 새 고객 생성
- `updateCustomer(id, data)`: 고객 정보 업데이트
- `deleteCustomer(id)`: 고객 삭제
- `updateDocumentStatus(customerId, docType, isCompleted)`: 서류 상태 업데이트

### documentService
- `generateDocument(customerId, docType, formData)`: 서류 생성
- `previewDocument(docType, formData)`: 서류 미리보기
- `downloadDocument(documentId)`: 서류 다운로드
- `printDocument(documentId)`: 서류 인쇄
- `getCustomerDocuments(customerId)`: 고객의 모든 서류 조회

## 🎯 주요 기능

### Menu1-1 (고객 목록)
- ✅ 고객 목록 표시 (카드 형태)
- ✅ 상태별 필터링 (전체/대기중/진행중/완료)
- ✅ 긴급도 표시 (장례일 기준)
- ✅ 서류 작성 상태 표시
- ✅ 실시간 데이터 로딩
- ✅ 반응형 디자인

### Menu1-2 (정보 등록)
- ✅ 그룹별 폼 필드 구성
- ✅ 실시간 유효성 검사
- ✅ 필수 필드 표시
- ✅ 자동 저장 기능
- ✅ 에러 처리
- ✅ 고객 정보 자동 입력

### Menu1-3 (서류 관리)
- ✅ 서류별 생성/미리보기/다운로드/인쇄
- ✅ 실시간 서류 미리보기
- ✅ 일괄 처리 기능
- ✅ 서류 상태 표시
- ✅ 템플릿 기반 서류 생성

## 🔄 백엔드 연동 준비사항

### 환경 변수 설정
```env
REACT_APP_API_URL=http://localhost:8080/api
```

### API 엔드포인트 구조
```
GET    /api/customers           # 고객 목록 조회
GET    /api/customers/:id       # 특정 고객 조회
POST   /api/customers           # 새 고객 생성
PUT    /api/customers/:id       # 고객 정보 업데이트
DELETE /api/customers/:id       # 고객 삭제
PATCH  /api/customers/:id/documents  # 서류 상태 업데이트

POST   /api/documents/generate  # 서류 생성
GET    /api/documents/:id/download  # 서류 다운로드
POST   /api/documents/:id/print     # 서류 인쇄
GET    /api/customers/:id/documents # 고객 서류 목록
```

## 🚀 개발 모드

현재 Mock 데이터로 동작하며, 백엔드 연동 시 다음 파일들의 주석 처리된 API 코드를 활성화하면 됩니다:
- `src/services/customerService.js`
- `src/services/documentService.js`

## 📱 라우팅

React Router를 사용하여 페이지 간 네비게이션을 관리합니다:
- `/menu1-1` - 고객 목록
- `/menu1-2` - 정보 등록  
- `/menu1-3` - 서류 관리

페이지 간 데이터 전달은 localStorage를 통해 이루어집니다 (향후 Context API 또는 상태 관리 라이브러리로 개선 가능).

## ⚠️ 주의사항

1. **React Router 설정**: 프로젝트의 메인 App.js에서 React Router가 올바르게 설정되어 있는지 확인
2. **네비게이션**: 직접 URL 접근 시 selectedCustomer 데이터가 없을 수 있음
3. **데이터 일관성**: localStorage 사용으로 인한 데이터 동기화 이슈 가능성
4. **백엔드 연동**: Mock 데이터에서 실제 API로 전환 시 에러 처리 검증 필요
