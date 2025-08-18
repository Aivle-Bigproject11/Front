# 유가족 검색 방식 설정 가이드

## 🔄 두 가지 검색 방식

유가족 검색 기능은 백엔드 개발 상황에 따라 두 가지 방식을 지원합니다:

### 1. 🚀 백엔드 API 직접 검색 (권장 - 운영 환경용)
- **설정**: `USE_BACKEND_SEARCH = true`
- **방식**: 서버의 전용 검색 API를 직접 호출
- **엔드포인트**: 
  - `/families/search-name?name={이름}`
  - `/families/search-email?email={이메일}`
  - `/families/search-phone?phone={전화번호}`

### 2. 🔧 프론트엔드 필터링 (현재 기본값 - 개발/임시용)
- **설정**: `USE_BACKEND_SEARCH = false` 
- **방식**: 전체 유가족 목록을 가져와서 브라우저에서 필터링
- **엔드포인트**: `/families` (전체 조회)

## ⚙️ 설정 방법

### 1. 💻 코드에서 직접 설정
```javascript
// api.js 파일에서
apiService.USE_BACKEND_SEARCH = true;  // 백엔드 API 직접 검색
apiService.USE_BACKEND_SEARCH = false; // 프론트엔드 필터링 (기본값)
```

### 2. 🖱️ UI에서 실시간 설정
- Menu4.js → 유가족 관리 모달 → 우상단 스위치 토글
- 실시간으로 검색 방식 변경 가능
- 현재 모드와 상세 설명이 표시됨

## 📊 각 방식의 비교

| 구분 | 백엔드 API 검색 | 프론트엔드 필터링 |
|------|----------------|------------------|
| **성능** | ⭐⭐⭐⭐⭐ 최적화된 검색 | ⭐⭐⭐ 전체 데이터 로드 필요 |
| **네트워크** | ⭐⭐⭐⭐⭐ 최소 트래픽 | ⭐⭐ 전체 데이터 전송 |
| **안정성** | ⭐⭐ 백엔드 구현 필요 | ⭐⭐⭐⭐⭐ 현재 호환 |
| **확장성** | ⭐⭐⭐⭐⭐ 대용량 데이터 OK | ⭐⭐ 데이터 증가시 한계 |

## 🚨 현재 상황

- ✅ **현재 기본값**: 프론트엔드 필터링 (`USE_BACKEND_SEARCH = false`)
- ❌ **백엔드 API**: 아직 구현되지 않음 (500/404 에러 발생)
- 🔄 **UI 전환**: 언제든지 스위치로 방식 변경 가능

## 🔄 전환 가이드

### 백엔드 API 구현 완료시
1. **API 테스트**:
```bash
curl -X GET "http://localhost:8080/families/search-name?name=test"
```
2. **응답 확인**: 200 OK면 구현 완료
3. **설정 변경**: `USE_BACKEND_SEARCH = true`
4. **기본값 변경**: api.js에서 기본값을 true로 수정

### 개발 중 에러 발생시
- UI에서 스위치를 "프론트 필터링"으로 변경
- 또는 콘솔에서 `apiService.USE_BACKEND_SEARCH = false`

## 🧹 정리 및 삭제 가이드

백엔드 API 구현 완료 후 불필요한 코드 정리:

### 삭제 가능한 함수들:
```javascript
// api.js에서 삭제
searchFamiliesByNameFrontend
searchFamiliesByEmailFrontend  
searchFamiliesByPhoneFrontend
```

### 통합 함수 단순화:
```javascript
// 기존 (조건부)
searchFamiliesByName: async function(name) {
  return this.USE_BACKEND_SEARCH ? 
    this.searchFamiliesByNameBackend(name) : 
    this.searchFamiliesByNameFrontend(name);
}

// 변경후 (직접 호출)
searchFamiliesByName: async (name) => 
  (await api.get(`/families/search-name?name=${name}`)).data
```
