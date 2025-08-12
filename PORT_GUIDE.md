# 포트 설정 가이드

## 환경별 포트 설정

### 로컬 개발 환경
```
전환서비스: 8082
장례서류: 8083 (Python/FastAPI)
유저: 8084
추모관: 8085 (Python/FastAPI)
인구분석: 8086
Gateway: 8088
```

### Docker 환경
```
모든 서비스 + Gateway: 8080
```

### Python 서비스 (uvicorn)
```
장례서류, Fast API, 추모관: 8000 (고정)
```

## 실행 방법

### 로컬 환경에서 실행
```bash
npm run start:local
```
API URL: http://localhost:8088

### Docker 환경에서 실행
```bash
npm run start:docker
```
API URL: http://localhost:8080

### Mock 데이터로 실행
```bash
npm run start:mock
```

## 문제 해결

### MemorialDetail.js 통신 문제
1. 브라우저 콘솔에서 API 호출 로그 확인
2. Network 탭에서 실제 요청 URL 확인
3. 백엔드 서비스 상태 확인

### 포트 충돌 시
```bash
PORT=3001 npm run start:local
```

## 환경변수 설정

### .env.local (로컬 개발용)
```
REACT_APP_API_URL=http://localhost:8088
```

### .env.docker (Docker용)
```
REACT_APP_API_URL=http://localhost:8080
```
