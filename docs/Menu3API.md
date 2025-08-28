# 추천 메시지 API 명세서 (v1.0)

---
# 1. 고객 정보 전체 조회

API Path: /customer-infos
HTTP Method: GET
개발현황: 개발 완료
설명: 전체 고객 정보를 조회합니다.
토큰: O

# 📥 Request

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
| Content-Type | ✅ | application/json | |

# 📤 Response

### 🔹 HTTP 200 OK

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| id | Number | 고객 ID |
| name | String | 이름 |
| age | Number | 나이 |
| birthDate | String | 생년월일 |
| gender | String | 성별 |
| phone | String | 연락처 |
| address | String | 주소 |
| isMarried | Boolean | 결혼 여부 |
| hasChildren | Boolean | 자녀 여부 |
| job | String | 직업 |
| disease | Array | 질병 이력 |

```json
[
    {
        "id": 1,
        "name": "홍길동",
        "age": 45,
        "birthDate": "1970-01-01T00:00:00.000+00:00",
        "gender": "여성",
        "phone": "01012345678",
        "address": "서울시 강남구",
        "isMarried": true,
        "hasChildren": true,
        "job": "의사",
        "disease": []
    }
]
```

---
# 2. 필터링된 고객 목록 조회

API Path: /customer-infos/filter
HTTP Method: GET
개발현황: 개발 완료
설명: 조건에 맞는 고객 정보를 필터링하여 조회합니다.
토큰: O

# 📥 Request

### 🔹 Query Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| ageGroup | String | ❌ | 연령대 (예: "40대") |
| gender | String | ❌ | 성별 (예: "여성") |
| disease | String | ❌ | 질병 (예: "무") |
| isMarried | Boolean | ❌ | 결혼 여부 (예: true) |
| hasChildren | Boolean | ❌ | 자녀 여부 (예: true) |

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
| Content-Type | ✅ | application/json | |

# 📤 Response

### 🔹 HTTP 200 OK

(고객 정보 전체 조회와 동일한 응답 구조)

```json
[
    {
        "id": 1,
        "name": "홍길동",
        "age": 45,
        "birthDate": "1970-01-01T00:00:00.000+00:00",
        "gender": "여성",
        "phone": "01012345678",
        "address": "서울시 강남구",
        "isMarried": true,
        "hasChildren": true,
        "job": "의사",
        "disease": []
    }
]
```

---
# 3. 추천 메시지 미리보기 생성

API Path: /recommendMessages/preview-message
HTTP Method: POST
개발현황: 개발 완료
설명: 필터링 조건에 맞는 추천 메시지를 미리 생성하여 확인합니다.
토큰: O

# 📥 Request

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
| Content-Type | ✅ | application/json | |

### 🔹 Body

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| ageGroup | String | ✅ | 연령대 |
| gender | String | ✅ | 성별 |
| disease | String | ✅ | 질병 |
| family | String | ✅ | 가족 관계 |

```json
{
    "ageGroup": "40대",
    "gender": "여성",
    "disease": "무",
    "family": "자녀"
}
```

# 📤 Response

### 🔹 HTTP 200 OK

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| message | String | 생성된 추천 메시지 |
| service1 | String | 추천 서비스 1 이름 |
| service1DetailedUrl | String | 추천 서비스 1 상세 URL |
| service1ImageUrl | String | 추천 서비스 1 이미지 URL |
| service2 | String | 추천 서비스 2 이름 |
| service2DetailedUrl | String | 추천 서비스 2 상세 URL |
| service2ImageUrl | String | 추천 서비스 2 이미지 URL |

```json
{
    "message": "40대 여성 고객님과 가족분들을 위한 특별한 전환 서비스를 소개합니다. 가족과 함께하는 소중한 추억, 여행 서비스로 특별한 시간을 만들어보세요. 또한 자녀의 첫 생일을 더욱 빛나게 할 돌잔치 서비스도 준비되어 있습니다.",
    "service1": "여행 서비스",
    "service1DetailedUrl": "https://naver.com",
    "service1ImageUrl": "/images/tour.jpg",
    "service2": "돌잔치 서비스",
    "service2DetailedUrl": "https://naver.com",
    "service2ImageUrl": "/images/baby.jpg"
}
```

---
# 4. 그룹 메시지 전송

API Path: /recommendMessages/generate-group-message
HTTP Method: POST
개발현황: 개발 완료
설명: 필터링된 고객 그룹에게 생성된 메시지를 전송합니다.
토큰: O

# 📥 Request

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
| Content-Type | ✅ | application/json | |

### 🔹 Body

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| message | String | ✅ | 전송할 메시지 내용 |
| serviceId1 | Number | ✅ | 추천 서비스 1 ID |
| serviceId2 | Number | ✅ | 추천 서비스 2 ID |
| imageUrl1 | String | ✅ | 추천 서비스 1 이미지 URL |
| imageUrl2 | String | ✅ | 추천 서비스 2 이미지 URL |
| detailedUrl1 | String | ✅ | 추천 서비스 1 상세 URL |
| detailedUrl2 | String | ✅ | 추천 서비스 2 상세 URL |
| filterCriteria | Object | ✅ | 메시지 전송 대상 필터링 조건 |
| ↳ .ageGroup | String | ✅ | 연령대 |
| ↳ .gender | String | ✅ | 성별 |
| ↳ .disease | String | ✅ | 질병 |
| ↳ .family | String | ✅ | 가족 관계 |

```json
{
    "message": "추천 메시지 예시입니다.",
    "serviceId1": 1,
    "serviceId2": 2,
    "imageUrl1": "https://image1.com",
    "imageUrl2": "https://image2.com",
    "detailedUrl1": "https://detail1.com",
    "detailedUrl2": "https://detail2.com",
    "filterCriteria": {
        "ageGroup": "40대",
        "gender": "여성",
        "disease": "무",
        "family": "자녀"
    }
}
```

# 📤 Response

### 🔹 HTTP 200 OK

(성공 여부만 반환, 별도 Body 없음)

---
# 5. 특정 고객의 최신 추천 메시지 조회

API Path: /recommendMessages/customer/{customerId}/latest
HTTP Method: GET
개발현황: 개발 완료
설명: 특정 고객에게 보낸 가장 최신의 추천 메시지를 조회합니다.
토큰: O

# 📥 Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| customerId | Number | ✅ | 고객 ID |

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
| Content-Type | ✅ | application/json | |

# 📤 Response

### 🔹 HTTP 200 OK

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| id | Number | 메시지 ID |
| customerId | Number | 고객 ID |
| message | String | 전송된 메시지 내용 |
| serviceId1 | Number | 추천 서비스 1 ID |
| serviceId2 | Number | 추천 서비스 2 ID |
| imageUrl1 | String | 추천 서비스 1 이미지 URL |
| imageUrl2 | String | 추천 서비스 2 이미지 URL |
| detailedUrl1 | String | 추천 서비스 1 상세 URL |
| detailedUrl2 | String | 추천 서비스 2 상세 URL |
| createMessageDate | String | 메시지 생성 날짜 |
| ageGroup | String | 연령대 |
| gender | String | 성별 |
| disease | String | 질병 |
| family | String | 가족 관계 |

```json
{
    "id": 2,
    "customerId": 1,
    "message": "추천 메시지 예시입니다.",
    "serviceId1": 1,
    "serviceId2": 2,
    "imageUrl1": "https://image1.com",
    "imageUrl2": "https://image2.com",
    "detailedUrl1": "https://detail1.com",
    "detailedUrl2": "https://detail2.com",
    "createMessageDate": "2025-08-05T10:47:32.532615",
    "ageGroup": "40대",
    "gender": "여성",
    "disease": "무",
    "family": "자녀"
}
```