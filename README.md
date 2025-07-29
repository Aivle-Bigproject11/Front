# Memorial Service - React Frontend

Saja boys 사자보이즈 서비스 개발


상조서비스를 위한 React 기반 프론트엔드 애플리케이션입니다.


## 🎯 프로젝트 개요

- **프론트엔드**: React 19.1.0 SPA 애플리케이션 (포트 3000)
- **백엔드 API**: Spring Boot API 서버 연동 준비 (포트 8080)
- **4개 메뉴 페이지**: 장례서류작성, 대시보드, 전환서비스추천, 디지털 추모관
- **API 통신**: Axios를 통한 RESTful API 호출 (현재 더미 데이터 사용)
- **UI 프레임워크**: React Bootstrap 5 + Chart.js

## 🚀 실행 방법

### 필수 요구사항
- Node.js 16+ (프론트엔드)
- npm 또는 yarn 패키지 매니저

### 프론트엔드 실행 (React)
```bash
# 프로젝트 루트에서
npm install  # 최초 실행시만
npm start    # 개발 서버 시작
```

React 앱이 `http://localhost:3000`에서 시작됩니다.

### 프로덕션 빌드
```bash
npm run build  # 최적화된 프로덕션 빌드 생성
npm run test   # 테스트 실행
```

## 🔧 프로젝트 구조

```
c:\Github\Front/                    # React 프론트엔드 프로젝트
├── public/                         # 정적 파일
│   ├── index.html                  # HTML 템플릿
│   ├── favicon.ico                 # 파비콘
│   └── manifest.json               # PWA 설정
├── src/                           # 소스 코드
│   ├── components/                # 재사용 가능한 컴포넌트
│   │   └── Layout/
│   │       └── Navbar.js          # 네비게이션 바
│   ├── contexts/                  # React Context
│   │   └── AuthContext.js         # 인증 상태 관리
│   ├── pages/                     # 페이지 컴포넌트
│   │   ├── Home.js                # 메인 페이지 (/)
│   │   ├── Login.js               # 로그인 페이지 (/login)
│   │   ├── Menu1.js               # 장례서류작성 (/menu1)
│   │   ├── Menu2.js               # 대시보드 (/menu2)
│   │   ├── Menu3.js               # 전환서비스추천 (/menu3)
│   │   └── Menu4.js               # 디지털 추모관 (/menu4)
│   ├── services/                  # API 서비스 레이어
│   │   └── api.js                 # API 통신 + 더미 데이터
│   ├── App.js                     # 메인 애플리케이션 컴포넌트
│   ├── App.css                    # 커스텀 스타일
│   └── index.js                   # React 진입점
├── package.json                   # npm 의존성 및 스크립트
├── .env                          # 환경 변수 설정
└── README.md                     # 프로젝트 문서
```
## 🎨 주요 기능

### 1. 로그인/인증
- JWT 기반 토큰 인증 (개발 중)
- 세션 관리
- 보호된 라우트

### 2. 4개 메뉴 페이지
- **Menu 1 (장례서류작성)**: 사망신고서 등 장례 관련 서류 자동 작성
- **Menu 2 (대시보드)**: 추모관 통계, 실시간 활동 로그, Chart.js 시각화
- **Menu 3 (전환서비스추천)**: AI 기반 맞춤 서비스 추천 시스템
- **Menu 4 (디지털 추모관)**: 추모관 CRUD, AI 추모영상/추모사 생성

### 3. React 기능
- React Router 기반 SPA 라우팅
- Context API를 이용한 상태 관리
- React Bootstrap UI 컴포넌트
- Chart.js와 React-chartjs-2를 이용한 데이터 시각화
- Axios를 이용한 HTTP 통신

## 🛠️ 기술 스택

**Frontend (React)**
- React 19.1.0
- React Router DOM 7.7.1 (SPA 라우팅)
- React Bootstrap 2.10.10 (UI 컴포넌트)
- Bootstrap 5.3.7 (CSS 프레임워크)
- Chart.js 4.5.0 & react-chartjs-2 5.3.0 (데이터 시각화)
- Axios 1.11.0 (HTTP 클라이언트)
- Font Awesome 6.0.0 (아이콘)

**Development Tools**
- Create React App (개발 환경)
- React Testing Library (테스팅)
- Jest (단위 테스트)

**Backend Integration Ready**
- Spring Boot REST API 연동 준비
- JWT 토큰 인증 구조
- HAL 포맷 API 응답 지원

## 📝 로그인 정보

개발용 테스트 계정:
- **Username**: `user`
- **Password**: `password`

## 🔄 개발 상태

### ✅ 완료된 기능
- ✨ **React SPA 구조**: React Router 기반 단일 페이지 애플리케이션 완성
- 🔐 **인증 시스템**: localStorage 기반 토큰 관리 (더미 로그인: user/password)
- 🎨 **반응형 UI**: Bootstrap 5 기반 모바일 친화적 디자인
- 📊 **데이터 시각화**: Chart.js 라인/도넛 차트 구현
- 🗂️ **4개 핵심 페이지**: 모든 주요 기능 페이지 구현 완료
- 🔄 **상태 관리**: Context API를 통한 전역 상태 관리
- 📡 **API 서비스**: Axios 기반 HTTP 클라이언트 + 더미 데이터
- 🎯 **완전한 프론트엔드**: 백엔드 없이도 모든 기능 테스트 가능

### 🚧 개발 중인 기능
- 🔌 **백엔드 API 연동**: Spring Boot REST API 연결
- 🔑 **JWT 인증**: 실제 토큰 기반 보안 인증
- 🤖 **AI 기능**: 추모영상/추모사 생성 API 통합
- 📁 **파일 업로드**: 이미지 업로드 및 관리

### 📋 향후 계획
- 📱 **PWA 지원**: 모바일 앱처럼 설치 가능
- 🔔 **실시간 알림**: WebSocket 기반 실시간 기능
- ⚡ **성능 최적화**: 코드 스플리팅, 이미지 최적화
- 🧪 **테스트 코드**: Jest, React Testing Library 도입

## 🧪 프론트엔드 테스트 방법

### 1. 🚀 빠른 시작 (더미 데이터 모드)

#### 1단계: 의존성 설치 및 실행
```bash
# 프로젝트 루트에서
npm install    # 의존성 설치
npm start      # 개발 서버 시작
```
- 브라우저가 자동으로 `http://localhost:3000` 열림
- 더미 데이터로 모든 기능 테스트 가능

#### 2단계: 로그인 테스트
```
URL: http://localhost:3000/login
아이디: user
비밀번호: password
```

### 2. 📋 기능별 테스트 시나리오

#### 🏠 **홈페이지 테스트** (`/`)
- [ ] 4개 메뉴 카드가 정상 표시되는지 확인
- [ ] 각 메뉴 버튼 클릭 시 해당 페이지로 이동 확인
- [ ] 반응형 디자인 테스트 (모바일/태블릿 화면)

#### � **장례서류작성 테스트** (`/menu1`)
- [ ] 사망신고서 폼 입력 테스트
- [ ] 필수 항목 유효성 검사 확인
- [ ] 저장 버튼 클릭 시 성공 알림 표시
- [ ] 문서 생성 버튼 기능 확인

#### 📊 **대시보드 테스트** (`/menu2`)
- [ ] 통계 카드 4개 정상 표시 (총 추모관, 활성 추모관, 시스템 가동률, 알림)
- [ ] 월별 추이 라인 차트 렌더링 확인
- [ ] 성별 분포 도넛 차트 렌더링 확인
- [ ] 최근 활동 테이블 데이터 표시 확인
- [ ] 시스템 상태 진행바 표시 확인

#### 🎯 **전환서비스추천 테스트** (`/menu3`)
- [ ] 고객 정보 입력 폼 테스트
- [ ] "추천 서비스 찾기" 버튼 클릭 시 추천 목록 표시
- [ ] 추천 서비스 "자세히 보기" 모달 창 테스트
- [ ] 서비스 유형별 필터링 확인

#### 💝 **디지털 추모관 테스트** (`/menu4`)
- [ ] 추모관 목록 테이블 표시 확인
- [ ] "새 추모관 만들기" 모달 폼 테스트
- [ ] 추모관 생성/수정/삭제 기능 테스트
- [ ] AI 추모영상/추모사 생성 버튼 기능 확인
- [ ] 상세보기 모달의 탭 전환 기능 테스트

### 3. � 개발자 테스트 도구

#### React Developer Tools 설치
```bash
# Chrome 확장 프로그램 설치
# React Developer Tools
# Redux DevTools (상태 관리 디버깅용)
```

#### 브라우저 개발자 도구 활용
```javascript
// 콘솔에서 API 더미 데이터 확인
import { dummyData } from './src/services/api.js';
console.log(dummyData);

// 로컬 스토리지 토큰 확인
console.log(localStorage.getItem('token'));
console.log(localStorage.getItem('user'));
```

#### Network 탭에서 API 호출 확인
- 개발자 도구 → Network 탭
- API 호출 시 요청/응답 확인
- CORS 오류 체크

### 4. 🐛 일반적인 문제 해결

#### 문제 1: npm start 실행 안됨
```bash
# 해결책
rm -rf node_modules package-lock.json
npm install
npm start
```

#### 문제 2: CORS 오류 발생
```bash
# 백엔드가 실행 중인지 확인
http://localhost:8080/api/dashboard

# application.properties 확인
cors.allowed-origins=http://localhost:3000
```

#### 문제 3: 차트가 표시되지 않음
```bash
# Chart.js 의존성 확인
npm list chart.js react-chartjs-2

# 브라우저 콘솔에서 오류 메시지 확인
```

#### 문제 4: 로그인 후 페이지 이동 안됨
```javascript
// 브라우저 콘솔에서 인증 상태 확인
console.log('Is Authenticated:', localStorage.getItem('token'));
console.log('User Data:', localStorage.getItem('user'));
```

### 5. 📱 모바일/반응형 테스트

#### 브라우저에서 모바일 뷰 테스트
```
1. F12 개발자 도구 열기
2. 모바일 아이콘 클릭 (Ctrl+Shift+M)
3. 다양한 기기 사이즈로 테스트
   - iPhone 12 Pro (390x844)
   - iPad (768x1024)
   - Desktop (1920x1080)
```

#### 터치 기능 테스트
- [ ] 모바일에서 버튼 터치 반응성
- [ ] 스크롤 및 스와이프 동작
- [ ] 모달 창 터치 조작

### 6. 🔗 백엔드와 함께 테스트

#### 백엔드 API 연결 준비
현재 프로젝트는 프론트엔드만 구현되어 있습니다. 백엔드 연결을 위해서는:

```bash
# API 서비스에서 더미 데이터 → 실제 API 호출로 변경
# src/services/api.js 파일 수정 필요

# 환경 변수 설정 확인
REACT_APP_API_URL=http://localhost:8080/api
```

#### 백엔드 API 명세 (구현 필요)
```bash
# 예상되는 백엔드 엔드포인트
GET  /api/memorials     # 추모관 목록
POST /api/memorials     # 추모관 생성
GET  /api/dashboard     # 대시보드 데이터
GET  /api/analytics     # 분석 데이터
POST /api/auth/login    # 로그인 인증
```

#### 통합 테스트 시나리오
1. **데이터 흐름 테스트**
   - 프론트엔드에서 API 요청 → 백엔드 응답 → UI 업데이트
   - 브라우저 Network 탭에서 HTTP 요청/응답 확인

2. **인증 플로우 테스트**
   - 로그인 → JWT 토큰 발급 → API 인증 → 데이터 접근

3. **CRUD 작업 테스트**
   - 추모관 생성 → DB 저장 → 목록 새로고침
   - 수정/삭제 작업 → 실시간 UI 반영

### 7. 🎯 성능 테스트

#### React 앱 성능 분석
```bash
# Lighthouse 성능 점수 확인
# Chrome 개발자 도구 → Lighthouse 탭 → 분석 실행

# Bundle 크기 분석
npm run build
npx serve -s build -l 3000
```

#### 메모리 사용량 모니터링
```bash
# Chrome 개발자 도구 → Performance 탭
# 메모리 누수 체크
# React 컴포넌트 렌더링 성능 확인
```

## 🔧 API 설정

### 환경 변수 설정
현재 프로젝트의 환경 변수 (.env 파일):

```bash
# 현재 설정
REACT_APP_API_URL=http://localhost:8080/api
BROWSER=none  # 자동 브라우저 실행 방지
```

### API 서비스 구조
프로젝트는 실제 백엔드 연동을 위한 구조를 갖추고 있습니다:

```javascript
// src/services/api.js
export const apiService = {
  // 추모관 관리
  getMemorials: () => api.get('/memorials'),
  createMemorial: (data) => api.post('/memorials', data),
  
  // 대시보드 데이터
  getDashboardData: () => api.get('/dashboard'),
  
  // 분석 데이터
  getAnalyticsData: () => api.get('/analytics')
};

// 현재는 더미 데이터 사용
export const dummyData = { /* ... */ };
```

#### 환경별 설정 파일
```bash
# 개발 환경 (.env.development)
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_ENV=development

# 프로덕션 환경 (.env.production)
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_ENV=production

# 테스트 환경 (.env.test)
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_ENV=test
```

#### 환경 변수 사용법
```javascript
// React 컴포넌트에서 사용
const apiUrl = process.env.REACT_APP_API_URL;
const environment = process.env.REACT_APP_ENV;

console.log('API URL:', apiUrl);
console.log('Environment:', environment);
```

## 📋 추가 정보

### 현재 구현된 API 엔드포인트 (더미 데이터)
프론트엔드에서 사용 중인 API 구조:

- `GET /api/memorials` - 추모관 목록 조회
- `GET /api/memorials/{id}` - 특정 추모관 조회
- `POST /api/memorials` - 추모관 생성
- `PUT /api/memorials/{id}` - 추모관 수정
- `DELETE /api/memorials/{id}` - 추모관 삭제
- `GET /api/dashboard` - 대시보드 통계 데이터
- `GET /api/analytics` - 분석 데이터 (차트용)

### 프로젝트 특징
- ✅ **완전한 SPA 구조**: React Router 기반 단일 페이지 애플리케이션
- ✅ **더미 데이터 지원**: 백엔드 없이도 완전한 기능 테스트 가능
- ✅ **백엔드 연동 준비**: Spring Boot REST API 연결 구조 완비
- ✅ **반응형 디자인**: Bootstrap 5 기반 모바일 친화적 UI
- ✅ **컴포넌트 기반**: 재사용 가능한 모듈러 설계
- ✅ **상태 관리**: Context API 기반 전역 상태 관리
- ✅ **보안 준비**: JWT 토큰 인증 구조 설계
- ✅ **개발자 친화적**: 상세한 문서화 및 테스트 가이드

### 🎯 테스트 커버리지

#### UI 컴포넌트 테스트 현황
- ✅ **로그인 페이지**: 폼 입력, 유효성 검사, 인증 플로우
- ✅ **홈페이지**: 메뉴 카드, 네비게이션, 반응형 레이아웃
- ✅ **장례서류작성**: 다단계 폼, 탭 인터페이스, 문서 생성
- ✅ **대시보드**: 차트 렌더링, 데이터 시각화, 실시간 업데이트
- ✅ **서비스추천**: 조건부 렌더링, 모달 인터페이스, 필터링
- ✅ **디지털추모관**: CRUD 작업, 테이블 조작, 상세 뷰

#### API 통신 테스트 준비
- ✅ **HTTP 클라이언트**: Axios 기반 API 서비스 레이어
- ✅ **에러 핸들링**: 네트워크 오류, 타임아웃, 인증 실패 처리
- ✅ **로딩 상태**: 스피너, 스켈레톤 UI, 사용자 피드백
- ✅ **데이터 변환**: HAL 포맷 → React 컴포넌트 데이터 매핑

## 🤝 백엔드 개발자를 위한 가이드

### API 명세 (Spring Data REST HAL 포맷)
백엔드에서 구현해야 할 API 엔드포인트:

#### 1. 추모관 관리
```json
GET /memorials
Response: {
  "_embedded": {
    "memorials": [
      {
        "_links": {
          "memorial": {"href": "http://localhost:8085/memorials/1"},
          "self": {"href": "http://localhost:8085/memorials/1"}
        },
        "name": "민서",
        "age": 25,
        "birthOfDate": "1998-03-15",
        "deceasedDate": "2023-12-01",
        "gender": "FEMALE",
        "imageUrl": "/images/memorial1.jpg",
        "customerId": 1001
      }
    ]
  },
  "_links": {
    "profile": {"href": "http://localhost:8085/profile/memorials"},
    "self": {"href": "http://localhost:8085/memorials"}
  },
  "page": {
    "number": 0,
    "size": 20,
    "totalElements": 2,
    "totalPages": 1
  }
}

GET /memorials/{id}
Response: {
  "_links": {
    "memorial": {"href": "http://localhost:8085/memorials/1"},
    "self": {"href": "http://localhost:8085/memorials/1"}
  },
  "name": "민서",
  "age": 25,
  "birthOfDate": "1998-03-15",
  "deceasedDate": "2023-12-01",
  "gender": "FEMALE",
  "imageUrl": "/images/memorial1.jpg",
  "customerId": 1001
}

POST /memorials
Request: {
  "name": "새로운 추모관",
  "age": 30,
  "birthOfDate": "1993-07-22",
  "deceasedDate": "2024-01-15",
  "gender": "MALE",
  "customerId": 1002
}
Response: {"message": "Memorial created successfully"}
```

#### 2. 대시보드 데이터
```json
GET /dashboard
Response: {
  "totalMemorials": 150,
  "activeMemorials": 120,
  "systemUptime": 89,
  "notifications": 12,
  "recentActivities": [
    {"time": "10:30", "user": "홍길동", "action": "추모관 생성", "status": "성공"},
    {"time": "10:25", "user": "김철수", "action": "방명록 작성", "status": "완료"}
  ]
}
```

#### 3. 분석 데이터
```json
GET /analytics
Response: {
  "monthlyMemorials": [65, 78, 90, 81, 56, 75],
  "memorialsByGender": {"male": 80, "female": 70},
  "dailyVisits": [120, 190, 300, 500, 200, 300, 150]
}
```

### 설정 요구사항
1. **Spring Data REST** 사용 권장
2. **HAL 포맷** 응답 (Hypertext Application Language)
3. **CORS 설정**을 허용해주세요 (프론트엔드: localhost:3000)
4. **페이징 지원** (기본 20개씩)
5. **HATEOAS 링크** 포함

## 🔧 문제 해결 가이드

### 자주 발생하는 문제와 해결책

#### 1. React 앱 실행 오류
```bash
# 문제: npm start 실행 시 오류
# 해결책: 의존성 재설치
cd frontend-react
rm -rf node_modules package-lock.json
npm install
npm start
```

#### 2. 포트 충돌 오류
```bash
# 문제: Port 3000 is already in use
# 해결책: 다른 포트 사용 또는 기존 프로세스 종료
netstat -ano | findstr :3000  # Windows
lsof -ti:3000 | xargs kill -9  # Mac/Linux
```

#### 3. CORS 오류
```javascript
// 문제: Access to fetch blocked by CORS policy
// 해결책: 백엔드 CORS 설정 확인
// application.properties에서 설정 확인:
cors.allowed-origins=http://localhost:3000
```

#### 4. 환경 변수 인식 안됨
```bash
# 문제: process.env.REACT_APP_API_URL이 undefined
# 해결책: .env 파일 위치 및 내용 확인
# frontend-react/.env 파일이 올바른 위치에 있는지 확인
# 변수명이 REACT_APP_ 접두사로 시작하는지 확인
```

#### 5. 차트가 렌더링되지 않음
```javascript
// 문제: Chart.js 차트가 표시되지 않음
// 해결책: Chart.js 등록 확인
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  // ... 필요한 스케일들 import
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, /* ... */);
```

### 개발 환경 설정 체크리스트

#### ✅ 필수 요구사항 확인
- [ ] Node.js 16+ 설치됨
- [ ] npm 또는 yarn 패키지 매니저 설치
- [ ] Git 설치됨 (버전 관리용)

#### ✅ 프로젝트 설정 확인
- [ ] `.env` 파일이 프로젝트 루트에 존재
- [ ] `package.json` 의존성이 정상 설치됨
- [ ] 포트 3000이 사용 가능

#### ✅ 의존성 설치 확인
```bash
# React 의존성 확인
npm list react react-dom react-router-dom axios bootstrap react-bootstrap chart.js

# 모든 의존성 설치 확인
npm install
```

### 🆘 도움 요청 시 제공할 정보

문제 발생 시 다음 정보를 함께 제공해주세요:

1. **환경 정보**
   ```bash
   node --version
   npm --version
   java --version
   ```

2. **오류 메시지**
   - 콘솔 전체 오류 로그
   - 브라우저 개발자 도구 에러 메시지

3. **실행 단계**
   - 어떤 명령어를 실행했는지
   - 어느 시점에서 오류가 발생했는지

4. **프로젝트 상태**
   ```bash
   # 프로젝트 구조 확인
   ls -la
   ls -la frontend-react/
   ```