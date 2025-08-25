# ========================================
# aivlebigproject/Front/Dockerfile
# 역할: 리액트 코드를 빌드하여 정적 파일(HTML, CSS, JS)로 변환
# ========================================

# 1. Node.js 14 버전을 기반으로 빌드 환경을 시작합니다.
FROM node:14-alpine as builder

# 2. 컨테이너 내부에 작업 디렉토리를 생성합니다.
WORKDIR /app

# 3. package.json과 package-lock.json을 먼저 복사합니다.
#    (이 파일들이 변경되지 않으면, 다음 단계는 캐시를 사용해 빌드 속도가 빨라집니다.)
COPY package.json ./
COPY package-lock.json ./

# 4. 의존성 라이브러리를 설치합니다.
RUN npm install

# 5. 나머지 모든 소스 코드를 복사합니다.
COPY . .

# 👇 [추가] 빌드 시 주입받을 환경 변수를 선언합니다.
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# 6. 'npm run build' 명령어를 실행하여 /app/build 폴더에 최종 결과물을 생성합니다.
RUN npm run build

# ========================================
# STAGE 2: Serve
# 역할: 빌드된 정적 파일을 서빙하는 가벼운 웹 서버 실행
# ========================================

# 1. Nginx라는 매우 가볍고 빠른 웹 서버를 기반으로 최종 실행 환경을 시작합니다.
FROM nginx:alpine

# 2. 1단계(builder)의 빌드 결과물(/app/build)을 Nginx 서버의 기본 웹 폴더로 복사합니다.
COPY --from=builder /app/build /usr/share/nginx/html

# 👇 [추가] 우리가 만든 Nginx 설정 파일을 서버의 설정 폴더에 복사합니다.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 3. 80 포트를 외부에 공개합니다.
EXPOSE 80

# 4. Nginx 서버를 실행합니다.
CMD ["nginx", "-g", "daemon off;"]