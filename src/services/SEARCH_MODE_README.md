# 유가족 검색 방식 설정 가이드

## 개요
유가족 검색 기능은 두 가지 방식을 지원합니다:

1. **백엔드 직접 검색** (USE_BACKEND_SEARCH = true)
2. **프론트엔드 필터링** (USE_BACKEND_SEARCH = false)

## 설정 방법

### 1. 코드에서 설정
```javascript
// api.js 파일에서
apiService.USE_BACKEND_SEARCH = true;  // 백엔드 검색
apiService.USE_BACKEND_SEARCH = false; // 프론트엔드 필터링
```

### 2. UI에서 설정
Menu4.js의 유가족 관리 모달에서 스위치를 통해 실시간 변경 가능

## 각 방식의 특징

### 백엔드 직접 검색 (추천 - 운영 환경)
- **엔드포인트**: `/families/search-name`, `/families/search-email`, `/families/search-phone`
- **장점**: 
  - 서버에서 최적화된 검색
  - 대용량 데이터에 효율적
  - 네트워크 트래픽 최소화
- **단점**: 
  - 백엔드에 해당 API가 구현되어야 함
  - 현재 미구현으로 500/404 에러 발생

### 프론트엔드 필터링 (현재 백엔드 상태에 맞춤)
- **엔드포인트**: `/families` (전체 조회)
- **장점**: 
  - 현재 백엔드 상태와 호환
  - 즉시 사용 가능
  - 클라이언트 사이드 필터링으로 빠른 응답
- **단점**: 
  - 전체 데이터를 가져와야 함
  - 대용량 데이터시 성능 이슈

## 전환 시점

### 현재 → 백엔드 검색으로 전환
백엔드에 다음 API가 구현되면 전환:
- `GET /families/search-name?name={name}`
- `GET /families/search-email?email={email}`  
- `GET /families/search-phone?phone={phone}`

### 확인 방법
```bash
curl -X GET "http://localhost:8080/families/search-name?name=test"
```
응답이 200 OK면 백엔드 구현 완료

## 개발 팁

1. **에러 모니터링**: 콘솔에서 검색 방식과 결과를 확인 가능
2. **자동 전환**: 백엔드 검색 실패시 알림으로 프론트엔드 방식 권장
3. **성능 최적화**: 유가족 수가 많아지면 백엔드 검색으로 전환 필요

## 삭제 가이드

백엔드 구현 완료시 다음 함수들 삭제 가능:
- `searchFamiliesByNameFrontend`
- `searchFamiliesByEmailFrontend` 
- `searchFamiliesByPhoneFrontend`

그리고 통합 함수들을 Backend 함수로 직접 변경.
