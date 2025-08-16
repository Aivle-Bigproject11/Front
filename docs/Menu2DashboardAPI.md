# 대시보드 API 명세서 (v2.0)

---
# 날짜별 사망률 통계 조회

API Path: /by-date
HTTP Method: GET
개발현황: 개발 완료
설명: 특정 날짜의 지역별 사망률 통계 조회
토큰: O

# 📥 Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
|  |  |  |  |

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
| Content-Type | ✅ | application/json |  |
| Authorization | ✅ | Bearer {token} | JWT 인증 토큰 |

### 🔹 Query Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| date | String | ❌ | 조회할 날짜 (YYYY-MM 형식, 기본값: 현재 월) |

# 📤 Response

### 🔹 HTTP 200 OK

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| Array | Array | 지역별 사망률 통계 배열 |
| ↳ .date | String | 날짜 (YYYY-MM 형식) |
| ↳ .deaths | Number | 사망자 수 |
| ↳ .region | String | 지역명 |
| ↳ .id.date | String | 복합키 - 날짜 |
| ↳ .id.region | String | 복합키 - 지역 |

### 🔹 Example Response

```json
[
  {
    "date": "2025-01",
    "deaths": 1269,
    "id": {
      "date": "2025-01",
      "region": "강원도"
    },
    "region": "강원도"
  },
  {
    "date": "2025-01",
    "deaths": 6730,
    "id": {
      "date": "2025-01",
      "region": "경기도"
    },
    "region": "경기도"
  },
  {
    "date": "2025-01",
    "deaths": 4581,
    "id": {
      "date": "2025-01",
      "region": "서울특별시"
    },
    "region": "서울특별시"
  }
]
```

---
# 지역별 사망률 통계 조회

API Path: /by-region
HTTP Method: GET
개발현황: 개발 완료
설명: 특정 지역의 월별 사망률 통계 조회
토큰: O

# 📥 Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
|  |  |  |  |

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
| Content-Type | ✅ | application/json |  |
| Authorization | ✅ | Bearer {token} | JWT 인증 토큰 |

### 🔹 Query Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| region | String | ❌ | 조회할 지역명 (기본값: 전체 지역) |

# 📤 Response

### 🔹 HTTP 200 OK

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| Array | Array | 월별 사망률 통계 배열 |
| ↳ .date | String | 날짜 (YYYY-MM 형식) |
| ↳ .deaths | Number | 사망자 수 |
| ↳ .region | String | 지역명 |
| ↳ .id.date | String | 복합키 - 날짜 |
| ↳ .id.region | String | 복합키 - 지역 |

### 🔹 Example Response

```json
[
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
  }
]
```

---
# 인구 사망률 예측 조회

API Path: /predict-check
HTTP Method: GET
개발현황: 개발 완료
설명: 예측된 인구 사망률 데이터 조회
토큰: O

# 📥 Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
|  |  |  |  |

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
| Content-Type | ✅ | application/json |  |
| Authorization | ✅ | Bearer {token} | JWT 인증 토큰 |

# 📤 Response

### 🔹 HTTP 200 OK

예측된 사망률 데이터 반환

---
# 인구 사망률 예측 요청

API Path: /predict-request
HTTP Method: POST
개발현황: 개발 완료
설명: 새로운 인구 사망률 예측 요청
토큰: O

# 📥 Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
|  |  |  |  |

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
| Content-Type | ✅ | application/json |  |
| Authorization | ✅ | Bearer {token} | JWT 인증 토큰 |

### 🔹 Body or Form Data

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| region | String | ❌ | 예측할 지역 |
| period | String | ❌ | 예측 기간 |

# 📤 Response

### 🔹 HTTP 201 Created

예측 요청 성공 응답

---
# 인구 사망률 예측 업데이트

API Path: /predict-request-update
HTTP Method: PUT
개발현황: 개발 완료
설명: 기존 예측 요청 정보 업데이트
토큰: O

# 📥 Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
|  |  |  |  |

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
| Content-Type | ✅ | application/json |  |
| Authorization | ✅ | Bearer {token} | JWT 인증 토큰 |

### 🔹 Body or Form Data

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| requestId | String | ✅ | 업데이트할 예측 요청 ID |
| region | String | ❌ | 예측할 지역 |
| period | String | ❌ | 예측 기간 |

# 📤 Response

### 🔹 HTTP 200 OK

업데이트된 예측 요청 정보 반환

---
# 예측 응답 조회

API Path: /predict-response
HTTP Method: GET
개발현황: 개발 완료
설명: 예측 결과 응답 조회
토큰: O

# 📥 Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
|  |  |  |  |

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
| Content-Type | ✅ | application/json |  |
| Authorization | ✅ | Bearer {token} | JWT 인증 토큰 |

# 📤 Response

### 🔹 HTTP 200 OK

예측 결과 데이터 반환

---
# 예측 응답 업데이트

API Path: /predict-response-update
HTTP Method: PUT
개발현황: 개발 완료
설명: 예측 결과 응답 업데이트
토큰: O

# 📥 Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
|  |  |  |  |

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
| Content-Type | ✅ | application/json |  |
| Authorization | ✅ | Bearer {token} | JWT 인증 토큰 |

### 🔹 Body or Form Data

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| responseId | String | ✅ | 업데이트할 응답 ID |
| data | Object | ❌ | 업데이트할 예측 데이터 |

# 📤 Response

### 🔹 HTTP 200 OK

업데이트된 예측 응답 데이터 반환
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
```

--- C:\Users\User\Downloads\API명세서\대시보드-로그인 API명세\predictCheck (1) 251518971cba80b4a832f133451da222.md ---

# predictCheck (1)

body

```json
{
	'date':'2025-01'
	'region':'seoul'
}
```

--- C:\Users\User\Downloads\API명세서\대시보드-로그인 API명세\predictResponse (1) 251518971cba80ad97c2e1ba5aed2366.md ---

# predictResponse (1)

![image.png](image.png)

--- C:\Users\User\Downloads\API명세서\대시보드-로그인 API명세\predictResponseUpdate (1) 251518971cba804584b1c21f76b360c9.md ---

# predictResponseUpdate (1)

![image.png](image%201.png)

--- C:\Users\User\Downloads\API명세서\대시보드-로그인 API명세\predictResponseUpdateCheck (1) 251518971cba80af8c9ec66e2da601db.md ---

# predictResponseUpdateCheck (1)

body

```json
{
	'eventType' : 'DeathPredictionEvent'
	'date':'2025-01'
	'region':'서울특별시'
	'predictedDeaths':'2189.1'
}
```

--- C:\Users\User\Downloads\API명세서\대시보드-로그인 API명세\predictrequest (1) 251518971cba80dd8503dceaa8546196.md ---

# predictrequest (1)

body

```json
{
	'date':'2025-01'
}
```

--- C:\Users\User\Downloads\API명세서\대시보드-로그인 API명세\predictrequestupdate (1) 251518971cba80608b69e19b859b01cf.md ---

# predictrequestupdate (1)

body

```json
{
	'date':'2025-01'
}
```

--- C:\Users\User\Downloads\API명세서\대시보드-로그인 API명세\고객 프로필 단건 조회 251518971cba812ea4cbec3de9c673e0.md ---

# 고객 프로필 단건 조회

API: /customerProfiles/{id}
HTTP 메서드: GET
reponse: https://www.notion.so/noahbibi/res-24d18731459c8004912fe17a4fae6b94
상태: 완료

--- C:\Users\User\Downloads\API명세서\대시보드-로그인 API명세\고객 프로필 목록 조회 251518971cba81bfac86c48028ae2548.md ---

# 고객 프로필 목록 조회

API: /customerProfiles
HTTP 메서드: GET
reponse: https://www.notion.so/noahbibi/res-24d18731459c8004912fe17a4fae6b94
상태: 완료

--- C:\Users\User\Downloads\API명세서\대시보드-로그인 API명세\고객 프로필 삭제 251518971cba81bc8fdee29f25f161b7.md ---

# 고객 프로필 삭제

API: /customerProfiles/{id}
HTTP 메서드: DELETE
상태: 완료

--- C:\Users\User\Downloads\API명세서\대시보드-로그인 API명세\고객 프로필 생성 -res (1) 251518971cba809db2a7e288e34d4796.md ---

# 고객 프로필 생성 -res (1)

```json
{
"_links": {
"customerProfile": {
"href": "[http://localhost:8084/customerProfiles/3](http://localhost:8084/customerProfiles/3)"
},
"self": {
"href": "[http://localhost:8084/customerProfiles/3](http://localhost:8084/customerProfiles/3)"
}
},
"address": null,
"age": null,
"birthDate": null,
"diseaseList": null,
"gender": null,
"hasChildren": null,
"isMarried": null,
"job": "개발자",
"name": "홍길동",
"phone": "010-9999-8888",
"rrn": "123456-1234567"
}
```

--- C:\Users\User\Downloads\API명세서\대시보드-로그인 API명세\고객 프로필 생성 251518971cba814db28ef5bf3ba78845.md ---

# 고객 프로필 생성

API: /customerProfiles
HTTP 메서드: POST
reponse: https://www.notion.so/noahbibi/res-24d18731459c809ba9c8fc43e9095dd5
request: https://www.notion.so/noahbibi/req-24d18731459c803698f3f84eb484a33e
상태: 완료

--- C:\Users\User\Downloads\API명세서\대시보드-로그인 API명세\고객 프로필 수정 251518971cba81d1b96ec6f3af4918d3.md ---

# 고객 프로필 수정

API: /customerProfiles/{id}
HTTP 메서드: PATCH
request: https://www.notion.so/noahbibi/req-24d18731459c803698f3f84eb484a33e
상태: 완료

--- C:\Users\User\Downloads\API명세서\대시보드-로그인 API명세\고객 프로필 조회 -res (1) 251518971cba806db1a8c53d442c5ada.md ---

# 고객 프로필 조회 -res (1)

```json
{
"_embedded": {
"customerProfiles": [
{
"_links": {
"customerProfile": {
"href": "[http://localhost:8084/customerProfiles/3](http://localhost:8084/customerProfiles/3)"
},
"self": {
"href": "[http://localhost:8084/customerProfiles/3](http://localhost:8084/customerProfiles/3)"
}
},
"address": null,
"age": null,
"birthDate": null,
"diseaseList": [],
"gender": null,
"hasChildren": null,
"isMarried": null,
"job": "개발자",
"name": "홍길동",
"phone": "010-9999-8888",
"rrn": "123456-1234567"
}
]
},
"_links": {
"profile": {
"href": "[http://localhost:8084/profile/customerProfiles](http://localhost:8084/profile/customerProfiles)"
},
"self": {
"href": "[http://localhost:8084/customerProfiles](http://localhost:8084/customerProfiles)"
}
},
"page": {
"number": 0,
"size": 20,
"totalElements": 1,
"totalPages": 1
}
}
```

--- C:\Users\User\Downloads\API명세서\대시보드-로그인 API명세\고객프로필 생성 -req (1) 251518971cba80659440e8d359157d87.md ---

# 고객프로필 생성 -req (1)

```json
{"name":"홍길동" ,
"phone":"010-9999-8888",
"rrn":"123456-1234567" ,
"job":"개발자"}
```

--- C:\Users\User\Downloads\API명세서\대시보드-로그인 API명세\인구 사망율 예측 251518971cba816f8b1ed042eb3a3386.md ---

# 인구 사망율 예측

API: /deathPredictions/request-prediction
HTTP 메서드: POST
reponse: https://www.notion.so/noahbibi/predictResponse-24618731459c802b9a39f055ee055fd1
request: https://www.notion.so/noahbibi/predictrequest-24618731459c801792e9e662b34f3ec3
상태: 완료

--- C:\Users\User\Downloads\API명세서\대시보드-로그인 API명세\인구 사망율 예측 업데이트 251518971cba818bb419c24be6bdbd71.md ---

# 인구 사망율 예측 업데이트

API: /deathPredictions/request-prediction
HTTP 메서드: POST
reponse: https://www.notion.so/noahbibi/predictResponseUpdate-24618731459c80349a4efb48746064ee
request: https://www.notion.so/noahbibi/predictrequestupdate-24618731459c80199e49e52f585afe7d
상태: 완료

--- C:\Users\User\Downloads\API명세서\대시보드-로그인 API명세\인구 사망율 예측 조회 251518971cba81ac8974da301f029b7a.md ---

# 인구 사망율 예측 조회

API: /deathPredictions/{date}/{region}
HTTP 메서드: GET
reponse: https://www.notion.so/noahbibi/predictResponseUpdateCheck-24618731459c80c3ba7fd4c5d64e612d
request: https://www.notion.so/noahbibi/predictCheck-24618731459c807ebd3febe7b967dd21
상태: 완료

--- C:\Users\User\Downloads\API명세서\대시보드-로그인 API명세\인구 사망율 월 조회 251518971cba8168a4bdc7c4f64b3bf3.md ---

# 인구 사망율 월 조회

API: /deathPredictions/by-date/{region}
HTTP 메서드: GET
reponse: https://www.notion.so/noahbibi/by-date-24618731459c80558cc2ebfb5230c8d2
request: { 'date':'2025-01'  }
상태: 완료

--- C:\Users\User\Downloads\API명세서\대시보드-로그인 API명세\인구 사망율 지역 조회 251518971cba8108a012ed7a16468505.md ---

# 인구 사망율 지역 조회

API: /deathPredictions/by-region/{region}
HTTP 메서드: GET
reponse: https://www.notion.so/noahbibi/by-region-24718731459c807a96ede359a3687d75
request: {'region':'seoul' }
상태: 완료
