# Golden Gate 황금 혼문 - React Frontend

*프론트 총괄 및 개발 : 김시훈*
*프론트 개발 팀원 : 양성현, 박수연*

## 🎯 프로젝트 개요

- **프론트엔드**: React 18.3.1 SPA 애플리케이션 (포트 3000)
- **백엔드 API**: Spring Boot API 서버 연동 준비 (포트 8080)
- **주요 페이지**: 장례서류작성, 대시보드, 전환서비스추천, 디지털 추모관
- **API 통신**: Axios를 통한 RESTful API 호출 (현재 더미 데이터 사용)
- **UI 프레임워크**: React Bootstrap 5 + Chart.js
- **라우팅**: React Router DOM 6.28.0 기반 SPA
- **상태관리**: React Context API + Local Storage
- **스타일링**: Bootstrap 5.3.7 + Font Awesome + 커스텀 CSS

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
프로젝트 루트/                      # React 프론트엔드 프로젝트
├── public/                         # 정적 파일
│   ├── index.html                  # HTML 템플릿
│   ├── favicon.ico                 # 파비콘
│   └── manifest.json               # PWA 설정
├── src/                           # 소스 코드
│   ├── components/                # 재사용 가능한 컴포넌트
│   │   ├── Layout/                # 레이아웃 컴포넌트
│   │   │   └── Navbar.js          # 네비게이션 바
│   │   ├── InteractiveMap.js      # 인터랙티브 지도 컴포넌트
│   │   └── RegionDataDisplay.js   # 지역 데이터 표시 컴포넌트
│   ├── contexts/                  # React Context
│   │   └── AuthContext.js         # 인증 상태 관리
│   ├── pages/                     # 페이지 컴포넌트
│   │   ├── Home.js                # 메인 페이지 (/)
│   │   ├── Login.js               # 로그인 페이지 (/login)
│   │   ├── SignUp.js              # 회원가입 페이지 (/signup)
│   │   ├── FindId.js              # 아이디 찾기 페이지
│   │   ├── FindPassword.js        # 비밀번호 찾기 페이지
│   │   ├── Menu1.js               # 장례서류작성 (/menu1)
│   │   ├── Menu2.js               # 대시보드 (/menu2)
│   │   ├── Menu2.css              # 대시보드 스타일
│   │   ├── Menu2 copy.js          # 대시보드 백업 파일
│   │   ├── Menu3.js               # 전환서비스추천 (/menu3)
│   │   ├── Menu4.js               # 디지털 추모관 (/menu4)
│   │   └── MemorialDetail.js      # 개별 추모관 상세 페이지
│   ├── services/                  # API 서비스 레이어
│   │   └── api.js                 # API 통신 + 더미 데이터
│   ├── App.js                     # 메인 애플리케이션 컴포넌트
│   ├── App.css                    # 커스텀 스타일
│   ├── App.test.js                # App 컴포넌트 테스트
│   ├── index.js                   # React 진입점
│   ├── index.css                  # 전역 스타일
│   ├── logo.svg                   # React 로고
│   ├── reportWebVitals.js         # 성능 측정
│   └── setupTests.js              # 테스트 설정
├── package.json                   # npm 의존성 및 스크립트
├── package-lock.json              # 의존성 잠금 파일
├── .gitignore                     # Git 무시 파일
├── .env                          # 환경 변수 설정 (생성 필요)
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
- React 18.3.1 (UI 라이브러리)
- React Router DOM 6.28.0 (SPA 라우팅)
- React Bootstrap 2.10.10 (UI 컴포넌트)
- Bootstrap 5.3.7 (CSS 프레임워크)
- Chart.js 4.5.0 & react-chartjs-2 5.3.0 (데이터 시각화)
- Axios 1.11.0 (HTTP 클라이언트)
- Font Awesome 6.0.0 (아이콘 라이브러리)
- PapaParse 5.4.1 (CSV 파싱)

**Development Tools**
- Create React App 5.0.1 (개발 환경)
- React Scripts 5.0.1 (빌드 도구)
- React Testing Library (테스팅)
- Jest (단위 테스트)
- Web Vitals (성능 측정)

**CSS & Styling**
- CSS3 (커스텀 스타일)
- Bootstrap Icons
- 반응형 디자인 (모바일 퍼스트)
- CSS Grid & Flexbox

**State Management & Routing**
- React Context API (전역 상태 관리)
- React Hooks (useState, useEffect, useContext)
- Protected Routes (인증 기반 라우팅)
- Local Storage (토큰 저장)

**Backend Integration Ready**
- Spring Boot REST API 연동 준비
- JWT 토큰 인증 구조
- HAL 포맷 API 응답 지원
- CORS 설정 준비

## 📝 로그인 정보

개발용 테스트 계정:
- **Username**: `user`
- **Password**: `password`

## 🔄 개발 상태

### 개발 진척상황 공유

- menu 2,3,4 개발 진행중
- menu 1 부분 개발 대기중

#### 🏠 **홈페이지 테스트** (`/`)
- [ ] 4개 메뉴 카드가 정상 표시되는지 확인
- [ ] 각 메뉴 버튼 클릭 시 해당 페이지로 이동 확인
- [ ] 반응형 디자인 테스트 (모바일/태블릿 화면)

####  **장례서류작성 테스트** (`/menu1`)
- [ ] 
- [ ] 
- [ ] 
- [ ] 

#### 📊 **대시보드 테스트** (`/menu2`)
- [ ] 지역별 선택 버튼 기능 테스트
- [ ] 주요지역 현황 요약
- [ ] CSV, JSON 데이터 시각화
- [ ] 예측 통계 검증
- [ ] 

#### 🎯 **전환서비스추천 테스트** (`/menu3`)
- [ ] 고객 정보 필터링 조회
- [ ] 고객 샘플 더미 데이터
- [ ] 메시지 자동 생성 미리보기, 수정
- [ ] 고객 이름 클릭 시 고객 정보 및 메시지 발송 기록 팝업 화면
- [ ] (수정예정) CSS 재구성 필요, 메시지 수정 시 폼 변하지 않도록 수정 필요

#### 💝 **디지털 추모관 테스트** (`/menu4`)
- [ ] 추모관 목록 표시 확인
- [ ] 드롭다운 메뉴 개발 
- [ ] 추모관 수정/진입 기능 테스트
- [ ] 유가족 관리 메뉴 개발
- [ ] 개인추모관 개발 (`/MemorialDetail.js`)


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



### 3.  개발자 테스트 도구

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
프로젝트는 실제 백엔드 연동을 위한 구조를 임시로 제작한 API 구조입니다:

```javascript
// src/services/api.js
export const apiService = {
  // 추모관 관리
  getMemorials: () => api.get('/memorials'),
  createMemorial: (data) => api.post('/memorials', data),
  
  // 대시보드 데이터
  getDashboardData: () => api.get('/dashboard'),
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


### API 통신 테스트 준비
- ✅ **HTTP 클라이언트**: Axios 기반 API 서비스 레이어
- ✅ **에러 핸들링**: 네트워크 오류, 타임아웃, 인증 실패 처리
- ✅ **로딩 상태**: 스피너, 스켈레톤 UI, 사용자 피드백
- ✅ **데이터 변환**: HAL 포맷 → React 컴포넌트 데이터 매핑

## 🤝 백엔드 가이드

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

#### 2. 대시보드 데이터 (임의로 생성한 규격)
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
