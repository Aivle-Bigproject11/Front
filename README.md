# LUMORA 루모라 - React Frontend ✅ 개발 완료

- 프론트 총괄 및 개발 : 김시훈
- 프론트 개발 팀원 : 양성현, 박수연

## 🎉 프로젝트 완료 공지

**🎊 개발 완료 일자: 2025년 8월 28일**

이 프로젝트는 **성공적으로 개발이 완료**되었습니다. 모든 주요 기능이 구현되었으며, 프로덕션 환경에서 사용할 수 있는 상태입니다.

## 🎯 프로젝트 개요

- **프론트엔드**: React 18.3.1 SPA 애플리케이션 (포트 3000) ✅ **완료**
- **백엔드 API**: Spring Boot API 서버 연동 ✅ **완료**
- **주요 페이지**: 장례서류작성, 대시보드, 전환서비스추천, 디지털 추모관 ✅ **모든 페이지 완료**
- **API 통신**: Axios를 통한 RESTful API 호출 ✅ **완료**
- **UI 프레임워크**: React Bootstrap 5 + Chart.js ✅ **완료**
- **라우팅**: React Router DOM 6.28.0 기반 SPA ✅ **완료**
- **상태관리**: React Context API + Local Storage ✅ **완료**
- **스타일링**: Bootstrap 5.3.7 + Lucid React + 커스텀 CSS ✅ **완료**

## 🚀 실행 방법

### 필수 요구사항
- Node.js 16+ (프론트엔드)
- npm 또는 yarn 패키지 매니저

### 프론트엔드 실행 (React)

#### 1. Real 모드 (기본)
```bash
# 프로젝트 루트에서
npm install  # 최초 실행시만
npm start    # 개발 서버 시작 (실제 API 서버 필요)
```

#### 2. Mock 모드 (독립 개발용)
```bash
# 프로젝트 루트에서
npm install     # 최초 실행시만
npm run start:mock  # Mock 서비스로 개발 서버 시작
```

#### 2. docker 모드 (독립 개발용)
```bash
# 프로젝트 루트에서
npm install     # 최초 실행시만
npm run start:docker  # 8080 게이트웨이 서비스로 개발 서버 시작
```

React 앱이 `http://localhost:3000`에서 시작됩니다.

### 기본/도커 모드. (실제 웹 배포시엔 다른 포트)

| 모드 | 실행 명령 | 설명 | 용도 |
|------|-----------|------|------|
| Basic | `npm start` | 8088 백엔드 서버와 통신 | 프로덕션 환경 |
| Docker | `npm run start:docker` | 개발/테스트 환경, 8080포트. |

상세한 Mock 서비스 가이드는 [`docs/MockServiceGuide.md`](./docs/MockServiceGuide.md)를 참조하세요.

### 프로덕션 빌드
```bash
npm run build  # 최적화된 프로덕션 빌드 생성
npm run test   # 테스트 실행
```

## 🔧 프로젝트 구조

```
프로젝트 루트/                      # React 프론트엔드 프로젝트
├── .env                           # API키를 비롯한 환경 변수 (8088 백엔드)
├── .env.docker                    # Docker 환경 변수 (8080 게이트웨이)
├── .env.local                     # 로컬 환경 변수
├── .gitignore                     # Git 무시 파일
├── .idea/                         # IntelliJ IDEA 설정
├── build/                         # 프로덕션 빌드 결과물
├── db.json                        # Mock 데이터베이스
├── Dockerfile                     # Docker 이미지 빌드 설정
├── nginx.conf                     # Nginx 웹서버 설정
├── package.json                   # npm 의존성 및 스크립트
├── package-lock.json              # 의존성 잠금 파일
├── README.md                      # 프로젝트 문서
├── public/                        # 정적 파일
│   ├── index.html                 # HTML 템플릿
│   ├── favicon.ico                # 파비콘
│   ├── manifest.json              # PWA 설정
│   ├── 15년치_월별.csv            # 통계 데이터
│   ├── monthly_predictions.json   # 예측 데이터
│   ├── SouthKoreaGreyMap.png     # 한국 지도 이미지
│   └── logo192.png, logo512.png  # 앱 로고
├── src/                           # 소스 코드
│   ├── components/                # 재사용 가능한 컴포넌트
│   │   ├── Layout/                # 레이아웃 컴포넌트
│   │   │   └── Navbar.js          # 네비게이션 바
│   │   ├── InteractiveMap.js      # 인터랙티브 지도 컴포넌트
│   │   ├── KoreaMap.js            # 한국 지도 컴포넌트
│   │   ├── PrivateRoute.js        # 인증된 라우트 컴포넌트
│   │   └── RegionDataDisplay.js   # 지역 데이터 표시 컴포넌트
│   ├── contexts/                  # React Context
│   │   └── AuthContext.js         # 인증 상태 관리
│   ├── assets/                    # 정적 자산
│   │   ├── dataset/               # 데이터셋 파일들
│   │   ├── images/                # 이미지 파일들
│   │   └── logo/                  # 로고 파일들
│   ├── pages/                     # 페이지 컴포넌트
│   │   ├── Home.js                # 메인 페이지 (/)
│   │   ├── Lobby.js               # 로비 페이지
│   │   ├── Login.js               # 로그인 페이지 (/login)
│   │   ├── SignUp.js              # 회원가입 페이지 (/signup)
│   │   ├── FindId.js              # 아이디 찾기 페이지
│   │   ├── FindPassword.js        # 비밀번호 찾기 페이지
│   │   ├── PasswordCheck.js       # 비밀번호 확인 페이지
│   │   ├── UserConfig.js          # 사용자 설정 페이지
│   │   ├── privacyPolicy.js       # 개인정보 처리방침
│   │   ├── termsOfService.js      # 서비스 이용약관
│   │   ├── Menu1-1.js ~ Menu1-5.js # 장례서류작성 단계별 페이지
│   │   ├── Menu2F.js              # 대시보드 (장례식장)
│   │   ├── Menu2N.js              # 대시보드 (일반)
│   │   ├── Menu3.js               # 전환서비스추천 (/menu3)
│   │   ├── Menu4.js               # 디지털 추모관 (/menu4)
│   │   ├── Menu5.js               # 추가 메뉴
│   │   ├── Menu5_1.js, Menu5_2.js # 추가 메뉴 서브페이지
│   │   ├── MemorialConfig.js      # 추모관 설정
│   │   └── MemorialDetail.js      # 개별 추모관 상세 페이지
│   ├── services/                  # API 서비스 레이어
│   │   ├── api.js                 # API 서비스 진입점
│   │   ├── customerService.js     # 고객 서비스
│   │   ├── documentService.js     # 문서 서비스
│   │   ├── loginService.js        # 로그인 서비스
│   │   ├── memorialService.js     # 추모관 서비스
│   │   ├── QRservice.js           # QR 코드 서비스
│   │   ├── userService.js         # 사용자 서비스
│   │   └── SEARCH_MODE_README.md  # 검색 모드 가이드
│   ├── data/                      # Mock 데이터
│   │   ├── mockData.js            # 중앙화된 Mock 데이터
│   │   └── formData.js            # 폼 데이터
│   ├── App.js                     # 메인 애플리케이션 컴포넌트
│   ├── App.css                    # 커스텀 스타일
│   ├── App.test.js                # App 컴포넌트 테스트
│   ├── index.js                   # React 진입점
│   ├── index.css                  # 전역 스타일
│   ├── logo.svg                   # React 로고
│   ├── reportWebVitals.js         # 성능 측정
│   └── setupTests.js              # 테스트 설정
├── docs/                          # 프로젝트 문서
│   ├── apitest.md                 # API 테스트 문서
│   ├── PORT_GUIDE.md              # 포트 가이드 문서
│   ├── FamilyAPI.md               # 가족 관리 API 명세서
│   ├── dashboardflow.md           # 대시보드 플로우 문서
│   ├── LobbyAPI.md                # 로비 API 명세서
│   ├── LoginAPI.md                # 로그인 API 명세서
│   ├── Menu1API.md                # 장례서류작성 API 명세서
│   ├── Menu2API.md                # 대시보드 API 명세서
│   ├── Menu3API.md                # 전환서비스 API 명세서
│   ├── Menu4API.md                # 디지털 추모관 API 명세서
│   └── UserManagementAPI.md       # 사용자 관리 API 명세서
└── kubernetes/                    # Kubernetes 배포 설정
    ├── deployment.yaml            # 디플로이먼트 설정
    └── service.yaml               # 서비스 설정
```

## 📚 문서

- **[가족 관리 API 명세서](./docs/FamilyAPI.md)**: 가족 구성원 관리 관련 API 명세
- **[로비 API 명세서](./docs/LobbyAPI.md)**: 로비 페이지 기능 API 명세
- **[로그인 API 명세서](./docs/LoginAPI.md)**: 인증 및 로그인 시스템 API 명세
- **[Menu1 API 명세서](./docs/Menu1API.md)**: 장례서류작성 기능 API 명세
- **[Menu2 API 명세서](./docs/Menu2API.md)**: 대시보드 및 통계 API 명세
- **[Menu3 API 명세서](./docs/Menu3API.md)**: 전환서비스추천 시스템 API 명세
- **[Menu4 API 명세서](./docs/Menu4API.md)**: 디지털 추모관 관련 API 명세
- **[사용자 관리 API 명세서](./docs/UserManagementAPI.md)**: 사용자 계정 관리 API 명세
## 🎨 완료된 주요 기능

### ✅ 1. 로그인/인증 시스템 (완료)
- JWT 기반 토큰 인증 ✅ **구현 완료**
- 세션 관리 ✅ **구현 완료**
- 보호된 라우트 ✅ **구현 완료**

### ✅ 2. 4개 메뉴 페이지 (모든 기능 완료)
- **Menu 1 (장례서류작성)**: 사망신고서 등 장례 관련 서류 자동 작성 ✅ **완료**
- **Menu 2 (인력배치/대시보드)**: 사망자 통계, 인력자원 배치, Chart.js 시각화 ✅ **완료**
- **Menu 3 (Upselling-전환서비스)**: AI 기반 맞춤 서비스 추천 시스템 ✅ **완료**
- **Menu 4 (디지털 추모관)**: 추모관 CRUD, AI 추모영상/추모사 생성 ✅ **완료**

### ✅ 3. React 핵심 기능 (모든 기능 안정화)
- React Router 기반 SPA 라우팅 ✅ **완료**
- Context API를 이용한 상태 관리 ✅ **완료**
- React Bootstrap UI 컴포넌트 ✅ **완료**
- Chart.js와 React-chartjs-2를 이용한 데이터 시각화 ✅ **완료**
- Axios를 이용한 HTTP 통신 ✅ **완료**

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


## 🔄 개발 완료 현황

### 🎉 모든 기능 개발 완료 (2025.08.28 기준)

#### 🏠 **홈페이지** (`/`) ✅ **완료**
- ✅ 4개 메뉴 카드 정상 표시
- ✅ 각 메뉴 버튼 클릭 시 해당 페이지 이동
- ✅ 반응형 디자인 (모바일/태블릿 화면 완벽 대응)

#### 📋 **장례서류작성** (`/menu1`) ✅ **완료**
- ✅ 장례서류 등록시 추모관 자동 생성
- ✅ 장례서류 오탈자 검토 기능
- ✅ 장례서류 자동 작성 및 생성 기능
- ✅ PDF 다운로드 기능


#### 📊 **대시보드** (`/menu2`) ✅ **완료**
- ✅ 지역별 선택 버튼 기능
- ✅ 주요지역 현황 요약 시각화
- ✅ CSV, JSON 데이터 Chart.js 연동
- ✅ 예측 통계 및 실시간 모니터링
- ✅ 반응형 차트 디자인

#### 🎯 **전환서비스추천** (`/menu3`) ✅ **완료**
- ✅ 고객 정보 필터링 및 조회 시스템
- ✅ 고객 데이터베이스 연동
- ✅ AI 기반 메시지 자동 생성 및 편집
- ✅ 고객 상세 정보 팝업 및 발송 기록 관리
- ✅ 완전히 개선된 CSS 및 UI/UX

#### 💝 **디지털 추모관** (`/menu4`) ✅ **완료**
- ✅ 추모관 목록 표시 및 관리
- ✅ 고급 드롭다운 메뉴 시스템
- ✅ 추모관 생성/수정/삭제 (CRUD) 완전 구현
- ✅ 유가족 관리 시스템
- ✅ 개인추모관 상세 페이지 (`/MemorialDetail.js`) 완성
- ✅ AI 추모영상 및 추모사 생성 기능

#### 👨‍👩‍👧‍👦 **고객관리** (`/menu5`) ✅ **완료**
- ✅ 고객 조회 구현
- ✅ 고객 추가 구현
- ✅ 고객 상세정보 조회, 수정 및 삭제


### 🚀 품질 보증
- ✅ **전체 코드 리뷰 완료**
- ✅ **크로스 브라우저 테스트 완료**
- ✅ **모바일 반응형 테스트 완료**
- ✅ **API 연동 테스트 완료**
- ✅ **성능 최적화 완료**
- ✅ **보안 검증 완료**


## 🧪 프로덕션 준비 완료

### 1. 🚀 배포 준비 완료

#### 프로덕션 빌드 및 배포
```bash
# 최적화된 프로덕션 빌드 생성
npm run build

# 프로덕션 서버 실행 (예시)
npm install -g serve
serve -s build -l 3000
```

### 2. ✅ 품질 검증 완료

#### React Developer Tools 호환성 확인
- ✅ Chrome React Developer Tools 완벽 호환
- ✅ Redux DevTools 상태 관리 디버깅 지원
- ✅ 모든 컴포넌트 정상 렌더링 확인

#### 브라우저 호환성 테스트 완료
- ✅ Chrome 최신 버전
- ✅ Safari 최신 버전
- ✅ Edge 최신 버전

#### API 통신 검증 완료
- 모든 API 엔드포인트 정상 작동 확인

### 📱 다중 플랫폼 테스트 완료

#### 데스크톱 환경
- ✅ Windows (Chrome, Edge, Firefox)
- ✅ macOS (Safari, Chrome, Firefox)
- ✅ Linux (Chrome, Firefox)

#### 모바일 환경 
- ✅ iOS Safari (iPhone 12, 13, 14 Pro)
- ✅ Android Chrome (Galaxy S21, Pixel 6)
- ✅ 태블릿 (iPad Pro, Galaxy Tab)


### 5. 🔗 백엔드 연동 완료

#### ✅ 백엔드 API 완전 연동 완료
프로젝트의 모든 기능이 백엔드와 성공적으로 연동되었습니다

### ✅ API 서비스 구조 완성
모든 API 서비스가 완전히 구현되었습니다:


**개발팀**: Lumora FE Development Team  
**완료일**: 2025년 8월 28일  
**버전**: v1.0.0 (프로덕션 릴리스)

> 💝 이 프로젝트는 디지털 추모 서비스의 새로운 패러다임을 제시하며, 유가족들에게 따뜻한 위로와 편의를 제공하는 것을 목표로 개발되었습니다.
