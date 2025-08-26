# 대시보드 API 명세서 - DeathPrediction Service

이 API는 AI 모델을 활용한 사망률 예측 서비스입니다. main.py의 AI 모델과 연동되어 사망자 수 예측을 수행합니다.

---
# 1. 예측 요청 및 조회

API Path: /deathPredictions/request-prediction
HTTP Method: POST
개발현황: 개발 완료
설명: 예측이 없으면 AI 모델에 요청하고, 있으면 기존 데이터 반환
토큰: O

## 📥 Request

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
| Content-Type | ✅ | application/json |  |
| Authorization | ✅ | Bearer {token} | JWT 인증 토큰 |

### 🔹 Request Body (AiRequestDto)

| 필드명 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| date | String | ✅ | 예측할 날짜 (YYYY-MM 형식) |
| region | String | ✅ | 예측할 지역명 |
| previousYearDeaths | Number | ✅ | 전년도 동월 사망자 수 |

### 🔹 Example Request

```json
{
  "date": "2024-01",
  "region": "서울특별시",
  "previousYearDeaths": 1234
}
```

## 📤 Response

### 🔹 HTTP 200 OK - DeathPrediction 객체

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| id.date | String | 날짜 (YYYY-MM 형식) |
| id.region | String | 지역명 |
| deaths | Number | 예측된 사망자 수 |
| growthRate | Number | 증가율 (%) |
| regionalPercentage | Number | 지역 비율 (%) |
| previousYearDeaths | Number | 전년도 동월 사망자 수 |
| date | String | 날짜 (YYYY-MM 형식) |
| region | String | 지역명 |

### 🔹 HTTP 204 No Content
예측 요청이 처리되었지만 반환할 데이터가 없는 경우

### 🔹 Example Response

```json
{
  "id": {
    "date": "2024-01",
    "region": "서울특별시"
  },
  "deaths": 1500,
  "growthRate": 5.2,
  "regionalPercentage": 18.5,
  "previousYearDeaths": 1423,
  "date": "2024-01",
  "region": "서울특별시"
}
```

---
# 2. 특정 날짜/지역 예측 조회

API Path: /deathPredictions/{date}/{region}
HTTP Method: GET
개발현황: 개발 완료
설명: 특정 날짜와 지역의 예측 데이터 조회
토큰: O

## 📥 Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| date | String | ✅ | 조회할 날짜 (YYYY-MM 형식) |
| region | String | ✅ | 조회할 지역명 |

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
| Authorization | ✅ | Bearer {token} | JWT 인증 토큰 |

### 🔹 Example Request
```
GET /deathPredictions/2024-01/서울특별시
```

## 📤 Response

### 🔹 HTTP 200 OK
위의 DeathPrediction 객체와 동일한 구조

### 🔹 HTTP 404 Not Found
해당 날짜/지역의 예측 데이터가 없는 경우

---
# 3. 특정 날짜의 모든 지역 예측 조회

API Path: /deathPredictions/by-date/{date}
HTTP Method: GET
개발현황: 개발 완료
설명: 특정 날짜의 모든 지역 예측 데이터 조회
토큰: O

## � Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| date | String | ✅ | 조회할 날짜 (YYYY-MM 형식) |

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
| Authorization | ✅ | Bearer {token} | JWT 인증 토큰 |

### 🔹 Example Request
```
GET /deathPredictions/by-date/2024-01
```

## 📤 Response

### 🔹 HTTP 200 OK

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| Array | Array | DeathPrediction 객체 배열 |

### 🔹 HTTP 404 Not Found
해당 날짜의 예측 데이터가 없는 경우

### 🔹 Example Response

```json
[
  {
    "id": {
      "date": "2024-01",
      "region": "서울특별시"
    },
    "deaths": 1500,
    "growthRate": 5.2,
    "regionalPercentage": 18.5,
    "previousYearDeaths": 1423,
    "date": "2024-01",
    "region": "서울특별시"
  },
  {
    "id": {
      "date": "2024-01",
      "region": "경기도"
    },
    "deaths": 2800,
    "growthRate": 3.1,
    "regionalPercentage": 25.7,
    "previousYearDeaths": 2715,
    "date": "2024-01",
    "region": "경기도"
  }
]
```

---
# 4. 특정 지역의 모든 날짜 예측 조회

API Path: /deathPredictions/by-region/{region}
HTTP Method: GET
개발현황: 개발 완료
설명: 특정 지역의 모든 날짜 예측 데이터 조회
토큰: O

## 📥 Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| region | String | ✅ | 조회할 지역명 |

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
| Authorization | ✅ | Bearer {token} | JWT 인증 토큰 |

### 🔹 Example Request
```
GET /deathPredictions/by-region/서울특별시
```

## 📤 Response

### 🔹 HTTP 200 OK

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| Array | Array | DeathPrediction 객체 배열 |

### 🔹 HTTP 404 Not Found
해당 지역의 예측 데이터가 없는 경우

### 🔹 Example Response

```json
[
  {
    "id": {
      "date": "2024-01",
      "region": "서울특별시"
    },
    "deaths": 1500,
    "growthRate": 5.2,
    "regionalPercentage": 18.5,
    "previousYearDeaths": 1423,
    "date": "2024-01",
    "region": "서울특별시"
  },
  {
    "id": {
      "date": "2024-02",
      "region": "서울특별시"
    },
    "deaths": 1420,
    "growthRate": 2.8,
    "regionalPercentage": 17.9,
    "previousYearDeaths": 1382,
    "date": "2024-02",
    "region": "서울특별시"
  }
# 대시보드 API 명세서 (v3.0) - DeathPrediction Service

이 API는 AI 모델을 활용한 사망률 예측 서비스입니다. main.py의 AI 모델과 연동되어 사망자 수 예측을 수행합니다.

---
# 기타 API (레거시)

## predict-check
API Path: /predict-check
HTTP Method: GET
설명: 예측 확인 (레거시 API)

## predict-request
API Path: /predict-request
HTTP Method: POST
설명: 예측 요청 (레거시 API)

## predict-request-update
API Path: /predict-request-update
HTTP Method: PUT
설명: 예측 요청 업데이트 (레거시 API)

## predict-response
API Path: /predict-response
HTTP Method: GET
설명: 예측 응답 조회 (레거시 API)

## predict-response-update
API Path: /predict-response-update
HTTP Method: PUT
설명: 예측 응답 업데이트 (레거시 API)

---
# 에러 코드

| 상태 코드 | 설명 |
| --- | --- |
| 200 | 성공 |
| 204 | 성공 (응답 데이터 없음) |
| 400 | 잘못된 요청 |
| 401 | 인증 필요 |
| 403 | 권한 없음 |
| 404 | 데이터 없음 |
| 500 | 서버 내부 오류 |

---
# 참고사항

- 모든 API는 JWT 토큰 인증이 필요합니다.
- 날짜 형식은 `YYYY-MM` (예: `2024-01`)을 사용합니다.
- 지역명은 한글 전체명을 사용합니다 (예: `서울특별시`, `경기도`).
- AI 모델과의 연동으로 실시간 예측이 가능합니다.
- 500 에러가 발생하는 경우 백엔드 서버의 외부 서비스 연결을 확인해주세요.
        "id": {
            "date": "2025-01",
            "region": "서울특별시"
        },
        "region": "서울특별시"
    },
    {
        "date": "2025-01",
        "deaths": 143,
        "id": {
            "date": "2025-01",
            "region": "세종특별자치시"
        },
        "region": "세종특별자치시"
    },
    {
        "date": "2025-01",
        "deaths": 534,
        "id": {
            "date": "2025-01",
            "region": "울산광역시"
        },
        "region": "울산광역시"
    },
    {
        "date": "2025-01",
        "deaths": 1615,
        "id": {
            "date": "2025-01",
            "region": "인천광역시"
        },
        "region": "인천광역시"
    },
    {
        "date": "2025-01",
        "deaths": 1765,
        "id": {
            "date": "2025-01",
            "region": "전라남도"
        },
        "region": "전라남도"
    },
    {
        "date": "2025-01",
        "deaths": 1545,
        "id": {
            "date": "2025-01",
            "region": "전라북도"
        },
        "region": "전라북도"
    },
    {
        "date": "2025-01",
        "deaths": 422,
        "id": {
            "date": "2025-01",
            "region": "제주도"
        },
        "region": "제주도"
    },
    {
        "date": "2025-01",
        "deaths": 1662,
        "id": {
            "date": "2025-01",
            "region": "충청남도"
        },
        "region": "충청남도"
    },
    {
        "date": "2025-01",
        "deaths": 1205,
        "id": {
            "date": "2025-01",
            "region": "충청북도"
        },
        "region": "충청북도"
    }
]
request: { 'date':'2025-01'  }
상태: 완료

--- C:\Users\User\Downloads\API명세서\대시보드-로그인 API명세\인구 사망율 지역 조회 251518971cba8108a012ed7a16468505.md ---

# 인구 사망율 지역 조회

API: /deathPredictions/by-region/{region}
HTTP 메서드: GET
reponse: [
    {
        "date": "2025-01",
        "deaths": 4581,
        "id": {
            "date": "2025-01",
            "region": "서울특별시"
        },
        "region": "서울특별시"
    },
    {
        "date": "2025-02",
        "deaths": 4541,
        "id": {
            "date": "2025-02",
            "region": "서울특별시"
        },
        "region": "서울특별시"
    },
    {
        "date": "2025-03",
        "deaths": 4710,
        "id": {
            "date": "2025-03",
            "region": "서울특별시"
        },
        "region": "서울특별시"
    },
    {
        "date": "2025-04",
        "deaths": 4408,
        "id": {
            "date": "2025-04",
            "region": "서울특별시"
        },
        "region": "서울특별시"
    },
    {
        "date": "2025-05",
        "deaths": 4280,
        "id": {
            "date": "2025-05",
            "region": "서울특별시"
        },
        "region": "서울특별시"
    },
    {
        "date": "2025-06",
        "deaths": 4171,
        "id": {
            "date": "2025-06",
            "region": "서울특별시"
        },
        "region": "서울특별시"
    },
    {
        "date": "2025-07",
        "deaths": 4217,
        "id": {
            "date": "2025-07",
            "region": "서울특별시"
        },
        "region": "서울특별시"
    },
    {
        "date": "2025-08",
        "deaths": 4333,
        "id": {
            "date": "2025-08",
            "region": "서울특별시"
        },
        "region": "서울특별시"
    },
    {
        "date": "2025-09",
        "deaths": 4377,
        "id": {
            "date": "2025-09",
            "region": "서울특별시"
        },
        "region": "서울특별시"
    },
    {
        "date": "2025-10",
        "deaths": 4554,
        "id": {
            "date": "2025-10",
            "region": "서울특별시"
        },
        "region": "서울특별시"
    },
    {
        "date": "2025-11",
        "deaths": 4620,
        "id": {
            "date": "2025-11",
            "region": "서울특별시"
        },
        "region": "서울특별시"
    },
    {
        "date": "2025-12",
        "deaths": 4758,
        "id": {
            "date": "2025-12",
            "region": "서울특별시"
        },
        "region": "서울특별시"
    }
]
request: {'region':'seoul' }
상태: 완료
