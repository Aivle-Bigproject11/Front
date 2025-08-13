# 유가족 관리 API 명세서 (v1.0)

---
# 유가족 전체 조회

API Path: /families
HTTP Method: GET
개발현황: 개발 완료
설명: 유가족 전체 목록 조회
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

### 🔹 Body or Form Data

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
|  |  |  |  |

# 📤 Response

### 🔹 HTTP 200 OK

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| _embedded.families | Array | 유가족 객체들 리스트 |
| ↳ ._links.approvefamily.href | String | 유가족 승인 리소스 링크 |
| ↳ ._links.family.href | String | 해당 유가족 리소스의 링크 |
| ↳ ._links.self.href | String | 해당 유가족 리소스의 자기참조 링크 |
| ↳ .name | String | 유가족 이름 |
| ↳ .loginId | String | 로그인 ID |
| ↳ .loginPassword | String | 로그인 비밀번호 |
| ↳ .email | String | 이메일 주소 |
| ↳ .phone | String | 전화번호 |
| ↳ .status | String | 승인 상태 (PENDING, APPROVED) |
| ↳ .memorialId | String or null | 연결된 추모관 ID |
| ↳ .createdAt | String or null | 생성일시 |
| ↳ .updatedAt | String or null | 수정일시 |
| _links.profile.href | String | 프로필 링크 |
| _links.search.href | String | 검색 링크 |
| _links.self.href | String | 자기참조 링크 |
| page.number | Number | 현재 페이지 번호 |
| page.size | Number | 페이지 크기 |
| page.totalElements | Number | 전체 요소 수 |
| page.totalPages | Number | 전체 페이지 수 |

### 🔹 Example Response

```json
{
  "_embedded": {
    "families": [
      {
        "_links": {
          "approvefamily": {
            "href": "http://localhost:8084/families/4/approvefamily"
          },
          "family": {
            "href": "http://localhost:8084/families/4"
          },
          "self": {
            "href": "http://localhost:8084/families/4"
          }
        },
        "createdAt": null,
        "email": "leess@example.com",
        "loginId": "leess",
        "loginPassword": "password",
        "memorialId": null,
        "name": "이순신",
        "phone": "010-5555-6666",
        "status": "PENDING",
        "updatedAt": null
      }
    ]
  },
  "_links": {
    "profile": {
      "href": "http://localhost:8084/profile/families"
    },
    "search": {
      "href": "http://localhost:8084/families/search"
    },
    "self": {
      "href": "http://localhost:8084/families"
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

---
# 유가족 단건 조회

API Path: /families/{id}
HTTP Method: GET
개발현황: 개발 완료
설명: 특정 유가족 정보 조회
토큰: O

# 📥 Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| id | Number | ✅ | 유가족 ID |

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
| Content-Type | ✅ | application/json |  |

### 🔹 Body or Form Data

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
|  |  |  |  |

# 📤 Response

### 🔹 HTTP 200 OK

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| _links.approvefamily.href | String | 유가족 승인 리소스 링크 |
| _links.family.href | String | 해당 유가족 리소스의 링크 |
| _links.self.href | String | 해당 유가족 리소스의 자기참조 링크 |
| name | String | 유가족 이름 |
| loginId | String | 로그인 ID |
| loginPassword | String | 로그인 비밀번호 |
| email | String | 이메일 주소 |
| phone | String | 전화번호 |
| status | String | 승인 상태 (PENDING, APPROVED) |
| memorialId | String or null | 연결된 추모관 ID |
| createdAt | String or null | 생성일시 |
| updatedAt | String or null | 수정일시 |

---
# 유가족 생성

API Path: /families
HTTP Method: POST
개발현황: 개발 완료
설명: 새로운 유가족 등록 (승인 대기 상태로 생성)
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

### 🔹 Body or Form Data

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| name | String | ✅ | 유가족 이름 |
| loginId | String | ✅ | 로그인 ID |
| loginPassword | String | ✅ | 로그인 비밀번호 |
| email | String | ✅ | 이메일 주소 |
| phone | String | ✅ | 전화번호 |
| status | String | ✅ | 승인 상태 (기본값: PENDING) |
| deceasedName | String | ✅ | 고인 이름 |
| memorialID | String | ✅ | 추모관 ID |

### 🔹 Example Request

```json
{
  "name": "이순신",
  "loginId": "leess",
  "loginPassword": "password",
  "email": "leess@example.com",
  "phone": "010-5555-6666",
  "status": "PENDING",
  "deceasedName": "홍길동",
  "memorialID": "ahsfjkhasdkjf-asdhjkfajk"
}
```

# 📤 Response

### 🔹 HTTP 201 Created

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| _links.approvefamily.href | String | 유가족 승인 리소스 링크 |
| _links.family.href | String | 해당 유가족 리소스의 링크 |
| _links.self.href | String | 해당 유가족 리소스의 자기참조 링크 |
| name | String | 유가족 이름 |
| loginId | String | 로그인 ID |
| loginPassword | String | 로그인 비밀번호 |
| email | String | 이메일 주소 |
| phone | String | 전화번호 |
| status | String | 승인 상태 (PENDING) |
| memorialId | String or null | 연결된 추모관 ID |
| createdAt | String or null | 생성일시 |
| updatedAt | String or null | 수정일시 |

### 🔹 Example Response

```json
{
  "_links": {
    "approvefamily": {
      "href": "http://localhost:8084/families/4/approvefamily"
    },
    "family": {
      "href": "http://localhost:8084/families/4"
    },
    "self": {
      "href": "http://localhost:8084/families/4"
    }
  },
  "createdAt": null,
  "email": "leess@example.com",
  "loginId": "leess",
  "loginPassword": "password",
  "memorialId": null,
  "name": "이순신",
  "phone": "010-5555-6666",
  "status": "PENDING",
  "updatedAt": null
}
```

---
# 유가족 승인

API Path: /families/{familyId}/approve
HTTP Method: POST
개발현황: 개발 완료
설명: 유가족 승인 처리 및 추모관 연결
토큰: O

# 📥 Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| familyId | Number | ✅ | 유가족 ID |

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
| Content-Type | ✅ | application/json |  |

### 🔹 Body or Form Data

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| memorialId | String | ✅ | 연결할 추모관 ID |

### 🔹 Example Request

```json
{
  "memorialId": "db1a189d-8436-4cdd-96f0-f62670d38b3d"
}
```

# 📤 Response

### 🔹 HTTP 200 OK

승인 완료 후 업데이트된 유가족 정보 반환

---
# 유가족 삭제

API Path: /families/{id}
HTTP Method: DELETE
개발현황: 개발 완료
설명: 유가족 정보 삭제
토큰: O

# 📥 Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| id | Number | ✅ | 유가족 ID |

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
| Content-Type | ✅ | application/json |  |

### 🔹 Body or Form Data

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
|  |  |  |  |

# 📤 Response

### 🔹 HTTP 204 No Content

삭제 성공 (응답 본문 없음)
