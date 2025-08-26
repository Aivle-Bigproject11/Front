# Backend API 테스트 가이드 (Menu2F)

이 문서는 `Menu2F.js` 기능과 관련된 백엔드 API를 직접 테스트하는 방법을 안내합니다. 모든 요청에는 JWT 토큰 기반의 인증이 필요합니다.

## 사전 준비: 인증 토큰(JWT) 얻기

API를 호출하려면 먼저 유효한 JWT 토큰을 획득해야 합니다. 토큰은 로그인 시 발급되어 브라우저의 로컬 스토리지에 저장됩니다.

1.  웹 애플리케이션에 로그인합니다.
2.  브라우저의 개발자 도구(F12)를 열고 'Application' (또는 '저장소') 탭으로 이동합니다.
3.  왼쪽 메뉴에서 **로컬 스토리지(Local Storage)**를 선택하고 해당 사이트의 주소를 클릭합니다.
4.  `token` 키를 찾아 값(Value)을 복사합니다. 이 값이 API 요청에 사용할 `YOUR_JWT_TOKEN`입니다.

---

## API 테스트 목록

### 1. 예측 데이터 생성 요청

특정 월의 예측 데이터를 생성하도록 백엔드에 요청합니다. `Menu2F` 페이지 로딩 시 `2025-01`, `2026-01` 데이터 생성을 위해 호출됩니다.

-   **Method**: `POST`
-   **URL**: `http://localhost:8080/deathPredictions/request-prediction`

#### Headers

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {YOUR_JWT_TOKEN}"
}
```

#### Body

```json
{
  "date": "2025-01"
}
```

> **참고**: `date` 값을 `"2026-01"` 등으로 변경하여 다른 기간의 데이터 생성을 요청할 수 있습니다.

---

### 2. 특정 월의 전체 지역 데이터 조회

특정 월의 모든 지역에 대한 예측 데이터를 조회합니다. `Menu2F`의 '주요지역 현황' 카드 데이터를 위해 호출됩니다.

-   **Method**: `GET`
-   **URL**: `http://localhost:8080/deathPredictions/by-date/{date}`

> **URL 설정**: `{date}` 부분을 `2025-08`과 같은 `YYYY-MM` 형식으로 변경하여 요청하세요.
> **예시**: `http://localhost:8080/deathPredictions/by-date/2025-08`

#### Headers

```json
{
  "Authorization": "Bearer {YOUR_JWT_TOKEN}"
}
```

#### Body

(없음)

---

### 3. 특정 지역의 모든 기간 데이터 조회

특정 지역을 지정하여 해당 지역의 모든 기간(2024, 2025, 2026년 등)에 대한 예측 데이터를 한 번에 조회합니다. 지도에서 지역을 선택했을 때 차트와 테이블 데이터를 위해 호출됩니다.

-   **Method**: `GET`
-   **URL**: `http://localhost:8080/deathPredictions/by-region/{region}`

> **URL 설정**: `{region}` 부분을 `서울특별시`, `부산광역시`, `전국` 등과 같이 실제 지역명으로 변경하여 요청하세요. (URL 인코딩 필요할 수 있음)
> **예시**: `http://localhost:8080/deathPredictions/by-region/서울특별시`

#### Headers

```json
{
  "Authorization": "Bearer {YOUR_JWT_TOKEN}"
}
```

#### Body

(없음)
