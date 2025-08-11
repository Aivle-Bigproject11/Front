# Mock 서비스 가이드

## 개요

본 프로젝트는 프론트엔드 개발 및 테스트를 위해 Mock 서비스를 제공합니다. 실제 백엔드 서버 없이도 독립적으로 개발할 수 있도록 설계되었습니다.

## 실행 모드

### 1. Real 모드 (기본)
```bash
npm start
```
- 모든 API 요청을 실제 백엔드 서버로 전송
- 백엔드 서버가 실행 중이어야 함

### 2. Mock 모드
```bash
npm run start:mock
```
- `REACT_APP_API_MOCKING=true` 환경 변수 설정
- Menu4(추모관) 관련 기능은 Mock 데이터 사용
- 다른 기능들은 실제 API 호출 (하이브리드 모드)

## Mock 서비스 구조

### 파일 구조
```
src/
├── services/
│   ├── api.js              # API 서비스 진입점
│   ├── memorialService.js  # Menu4 Mock 서비스
│   └── loginService.js     # Lobby Mock 서비스
└── data/
    └── mockData.js         # Mock 데이터 정의
```

### 서비스별 Mock 지원 현황

| 서비스 | Mock 지원 | 파일 위치 | 설명 |
|--------|-----------|-----------|------|
| Lobby (로비) | ✅ 완료 | `loginService.js` | 사용자 추모관 목록, 코드 조회 |
| Menu1 (서류) | ❌ 미지원 | - | 실제 API 호출 |
| Menu2 (통계) | ❌ 미지원 | - | 실제 API 호출 |
| Menu3 (전환) | ❌ 미지원 | - | 실제 API 호출 |
| Menu4 (추모관) | ✅ 완료 | `memorialService.js` | 추모관 CRUD, 사진/영상/댓글 관리 |

## Mock 데이터 속성

### Memorial 객체
```javascript
{
  id: "UUID",                    // 추모관 ID
  customerId: 1000,              // 고객 ID
  name: "고인명",                // 고인 이름
  age: 85,                       // 나이
  birthDate: "1939-01-01",       // 생년월일 (일반용)
  birthOfDate: "1939-01-01",     // 생년월일 (MemorialConfig용)
  deceasedDate: "2024-01-01",    // 사망일
  gender: "남성",                // 성별
  profileImageUrl: "URL",        // 프로필 이미지 (일반용)
  imageUrl: "URL",               // 프로필 이미지 (MemorialConfig용)
  eulogy: "추도문",              // 추도문
  tribute: "추모사",             // 추모사
  familyList: [...],             // 가족 목록
  joinCode: "MEM001",            // 참여 코드
  status: "active"               // 상태
}
```

## API 응답 구조

### 단건 조회
```javascript
// Real API 응답
{
  "memorialId": "uuid",
  "name": "고인명",
  // ... 기타 속성
}

// Mock API 응답 (MemorialConfig.js 호환)
{
  "data": {
    "id": "uuid",
    "name": "고인명",
    // ... 기타 속성
  }
}
```

### 목록 조회
```javascript
// Real & Mock API 응답 (동일)
{
  "_embedded": {
    "memorials": [...]
  },
  "page": {
    "size": 20,
    "totalElements": 8,
    "totalPages": 1,
    "number": 0
  }
}
```

## 문제 해결 이력

### v2.1 (2025-08-10)

**문제**: MemorialConfig.js에서 `Cannot read properties of undefined (reading 'name')` 오류 발생

**원인**: Mock 서비스의 응답 구조가 실제 API와 달라서 `response.data.name` 접근 불가

**해결책**:
1. `memorialService.js`의 `getMemorialById` 함수 수정:
   ```javascript
   // 기존
   return memorial;
   
   // 수정
   return { data: memorial };
   ```

2. `mockData.js`에 호환성 속성 추가:
   ```javascript
   birthOfDate: birthDate,  // MemorialConfig.js 호환
   imageUrl: profileImageUrl // MemorialConfig.js 호환
   ```

## 개발 가이드

### 새로운 Mock 서비스 추가

1. `src/services/` 폴더에 서비스 파일 생성
2. `src/data/mockData.js`에 필요한 Mock 데이터 추가
3. `src/services/api.js`의 `hybridService`에 Mock 서비스 추가

### Mock 데이터 수정

`src/data/mockData.js` 파일을 수정하여 테스트에 필요한 데이터를 추가하거나 변경할 수 있습니다.

### 응답 구조 확인

Real API와 Mock API의 응답 구조가 일치하는지 항상 확인해주세요. 특히 `response.data` 접근 패턴을 사용하는 컴포넌트들과의 호환성을 체크해야 합니다.

## 테스트 방법

1. Mock 모드로 애플리케이션 시작:
   ```bash
   npm run start:mock
   ```

2. 브라우저 개발자 도구에서 네트워크 탭 확인:
   - Mock 요청은 실제 HTTP 요청이 발생하지 않음
   - 콘솔에 Mock 관련 로그 출력

3. 주요 테스트 경로:
   - `/` - 홈페이지
   - `/lobby` - 로비 (사용자 추모관 목록)
   - `/memorial/{id}` - 추모관 상세
   - `/memorial/{id}/config` - 추모관 설정

## 주의사항

- Mock 모드에서는 실제 파일 업로드가 작동하지 않습니다
- 데이터 변경 사항은 새로고침 시 초기화됩니다
- 네트워크 지연 시뮬레이션을 위해 의도적인 delay가 추가되어 있습니다
