# 사용자 관리 API 명세서 (v2.0)

---
# 관리자 전체 조회

API Path: /managers
HTTP Method: GET
개발현황: 개발 완료
설명: 관리자 전체 목록 조회
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

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| _embedded.managers | Array | 관리자 객체들 리스트 |
| ↳ ._links.manager.href | String | 해당 관리자 리소스의 링크 |
| ↳ ._links.self.href | String | 해당 관리자 리소스의 자기참조 링크 |
| ↳ .loginId | String | 관리자 로그인 ID |
| ↳ .name | String | 관리자 이름 |
| ↳ .email | String | 관리자 이메일 |
| ↳ .phone | String | 관리자 전화번호 |

---
# 관리자 단건 조회

API Path: /managers/{id}
HTTP Method: GET
개발현황: 개발 완료
설명: 특정 관리자 정보 조회
토큰: O

# 📥 Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| id | Number | ✅ | 관리자 ID |

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
| Content-Type | ✅ | application/json |  |
| Authorization | ✅ | Bearer {token} | JWT 인증 토큰 |

# 📤 Response

### 🔹 HTTP 200 OK

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| _links.manager.href | String | 해당 관리자 리소스의 링크 |
| _links.self.href | String | 해당 관리자 리소스의 자기참조 링크 |
| loginId | String | 관리자 로그인 ID |
| name | String | 관리자 이름 |
| email | String | 관리자 이메일 |
| phone | String | 관리자 전화번호 |

---
# 관리자 생성

API Path: /managers
HTTP Method: POST
개발현황: 개발 완료
설명: 새로운 관리자 계정 생성
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
| loginId | String | ✅ | 관리자 로그인 ID |
| loginPassword | String | ✅ | 관리자 로그인 비밀번호 |
| name | String | ✅ | 관리자 이름 |
| email | String | ✅ | 관리자 이메일 |
| phone | String | ✅ | 관리자 전화번호 |

### 🔹 Example Request

```json
{
  "loginId": "manager001",
  "loginPassword": "1111",
  "name": "관리자1",
  "email": "manager1@example.com",
  "phone": "010-0000-0000"
}
```

# 📤 Response

### 🔹 HTTP 201 Created

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| _links.manager.href | String | 해당 관리자 리소스의 링크 |
| _links.self.href | String | 해당 관리자 리소스의 자기참조 링크 |
| loginId | String | 관리자 로그인 ID |
| loginPassword | String | 관리자 로그인 비밀번호 |
| name | String | 관리자 이름 |
| email | String | 관리자 이메일 |
| phone | String | 관리자 전화번호 |

### 🔹 Example Response

```json
{
  "_links": {
    "manager": {
      "href": "http://localhost:8084/managers/1"
    },
    "self": {
      "href": "http://localhost:8084/managers/1"
    }
  },
  "email": "manager1@example.com",
  "loginId": "manager001",
  "loginPassword": "1111",
  "name": "관리자1",
  "phone": "010-0000-0000"
}
```

---
# 관리자 수정

API Path: /managers/{id}
HTTP Method: PUT
개발현황: 개발 완료
설명: 관리자 정보 수정
토큰: O

# 📥 Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| id | Number | ✅ | 관리자 ID |

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
| Content-Type | ✅ | application/json |  |
| Authorization | ✅ | Bearer {token} | JWT 인증 토큰 |

### 🔹 Body or Form Data

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| loginId | String | ❌ | 관리자 로그인 ID |
| loginPassword | String | ❌ | 관리자 로그인 비밀번호 |
| name | String | ❌ | 관리자 이름 |
| email | String | ❌ | 관리자 이메일 |
| phone | String | ❌ | 관리자 전화번호 |

# 📤 Response

### 🔹 HTTP 200 OK

수정된 관리자 정보 반환

---
# 관리자 삭제

API Path: /managers/{id}
HTTP Method: DELETE
개발현황: 개발 완료
설명: 관리자 계정 삭제
토큰: O

# 📥 Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| id | Number | ✅ | 관리자 ID |

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
| Content-Type | ✅ | application/json |  |
| Authorization | ✅ | Bearer {token} | JWT 인증 토큰 |

# 📤 Response

### 🔹 HTTP 204 No Content

삭제 성공 (응답 본문 없음)

---
# 고객 프로필 전체 조회

API Path: /customerProfiles
HTTP Method: GET
개발현황: 개발 완료
설명: 고객 프로필 전체 목록 조회
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

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| _embedded.customerProfiles | Array | 고객 프로필 객체들 리스트 |
| ↳ ._links.customerProfile.href | String | 해당 고객 프로필 리소스의 링크 |
| ↳ ._links.self.href | String | 해당 고객 프로필 리소스의 자기참조 링크 |
| ↳ .name | String | 고객 이름 |
| ↳ .phone | String | 고객 전화번호 |
| ↳ .rrn | String | 주민등록번호 |
| ↳ .job | String | 직업 |
| ↳ .address | String or null | 주소 |
| ↳ .age | Number or null | 나이 |
| ↳ .birthDate | String or null | 생년월일 |
| ↳ .diseaseList | Array | 보유 질병 목록 |
| ↳ .gender | String or null | 성별 |
| ↳ .hasChildren | Boolean or null | 자녀 유무 |
| ↳ .isMarried | Boolean or null | 결혼 여부 |
| _links.profile.href | String | 프로필 링크 |
| _links.self.href | String | 자기참조 링크 |
| page.number | Number | 현재 페이지 번호 |
| page.size | Number | 페이지 크기 |
| page.totalElements | Number | 전체 요소 수 |
| page.totalPages | Number | 전체 페이지 수 |

### 🔹 Example Response

```json
{
  "_embedded": {
    "customerProfiles": [
      {
        "_links": {
          "customerProfile": {
            "href": "http://localhost:8084/customerProfiles/3"
          },
          "self": {
            "href": "http://localhost:8084/customerProfiles/3"
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
      "href": "http://localhost:8084/profile/customerProfiles"
    },
    "self": {
      "href": "http://localhost:8084/customerProfiles"
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
# 고객 프로필 단건 조회

API Path: /customerProfiles/{id}
HTTP Method: GET
개발현황: 개발 완료
설명: 특정 고객 프로필 정보 조회
토큰: O

# 📥 Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| id | Number | ✅ | 고객 프로필 ID |

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
| Content-Type | ✅ | application/json |  |
| Authorization | ✅ | Bearer {token} | JWT 인증 토큰 |

# 📤 Response

### 🔹 HTTP 200 OK

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| _links.customerProfile.href | String | 해당 고객 프로필 리소스의 링크 |
| _links.self.href | String | 해당 고객 프로필 리소스의 자기참조 링크 |
| name | String | 고객 이름 |
| phone | String | 고객 전화번호 |
| rrn | String | 주민등록번호 |
| job | String | 직업 |
| address | String or null | 주소 |
| age | Number or null | 나이 |
| birthDate | String or null | 생년월일 |
| diseaseList | Array | 보유 질병 목록 |
| gender | String or null | 성별 |
| hasChildren | Boolean or null | 자녀 유무 |
| isMarried | Boolean or null | 결혼 여부 |

---
# 고객 프로필 생성

API Path: /customerProfiles
HTTP Method: POST
개발현황: 개발 완료
설명: 새로운 고객 프로필 생성
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
| name | String | ✅ | 고객 이름 |
| phone | String | ✅ | 고객 전화번호 |
| rrn | String | ✅ | 주민등록번호 |
| job | String | ✅ | 직업 |
| address | String | ❌ | 주소 |
| age | Number | ❌ | 나이 |
| birthDate | String | ❌ | 생년월일 |
| diseaseList | Array | ❌ | 보유 질병 목록 |
| gender | String | ❌ | 성별 |
| hasChildren | Boolean | ❌ | 자녀 유무 |
| isMarried | Boolean | ❌ | 결혼 여부 |

### 🔹 Example Request

```json
{
  "name": "홍길동",
  "phone": "010-9999-8888",
  "rrn": "123456-1234567",
  "job": "개발자"
}
```

# 📤 Response

### 🔹 HTTP 201 Created

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| _links.customerProfile.href | String | 해당 고객 프로필 리소스의 링크 |
| _links.self.href | String | 해당 고객 프로필 리소스의 자기참조 링크 |
| name | String | 고객 이름 |
| phone | String | 고객 전화번호 |
| rrn | String | 주민등록번호 |
| job | String | 직업 |
| address | String or null | 주소 |
| age | Number or null | 나이 |
| birthDate | String or null | 생년월일 |
| diseaseList | Array | 보유 질병 목록 |
| gender | String or null | 성별 |
| hasChildren | Boolean or null | 자녀 유무 |
| isMarried | Boolean or null | 결혼 여부 |

### 🔹 Example Response

```json
{
  "_links": {
    "customerProfile": {
      "href": "http://localhost:8084/customerProfiles/3"
    },
    "self": {
      "href": "http://localhost:8084/customerProfiles/3"
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

---
# 고객 프로필 수정

API Path: /customerProfiles/{id}
HTTP Method: PUT
개발현황: 개발 완료
설명: 고객 프로필 정보 수정
토큰: O

# 📥 Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| id | Number | ✅ | 고객 프로필 ID |

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
| Content-Type | ✅ | application/json |  |
| Authorization | ✅ | Bearer {token} | JWT 인증 토큰 |

### 🔹 Body or Form Data

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| name | String | ❌ | 고객 이름 |
| phone | String | ❌ | 고객 전화번호 |
| rrn | String | ❌ | 주민등록번호 |
| job | String | ❌ | 직업 |
| address | String | ❌ | 주소 |
| age | Number | ❌ | 나이 |
| birthDate | String | ❌ | 생년월일 |
| diseaseList | Array | ❌ | 보유 질병 목록 |
| gender | String | ❌ | 성별 |
| hasChildren | Boolean | ❌ | 자녀 유무 |
| isMarried | Boolean | ❌ | 결혼 여부 |

# 📤 Response

### 🔹 HTTP 200 OK

수정된 고객 프로필 정보 반환

---
# 고객 프로필 삭제

API Path: /customerProfiles/{id}
HTTP Method: DELETE
개발현황: 개발 완료
설명: 고객 프로필 삭제
토큰: O

# 📥 Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| id | Number | ✅ | 고객 프로필 ID |

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
| Content-Type | ✅ | application/json |  |
| Authorization | ✅ | Bearer {token} | JWT 인증 토큰 |

# 📤 Response

### 🔹 HTTP 204 No Content

삭제 성공 (응답 본문 없음)

--- C:\Users\User\Downloads\API명세서\대시보드-로그인 API명세\관리자 생성-res (1) 251518971cba80b6ad99e5ee5e5383e9.md ---

# 관리자 생성-res (1)

```json
{
"_links": {
"manager": {
"href": "[http://localhost:8084/managers/1](http://localhost:8084/managers/1)"
},
"self": {
"href": "[http://localhost:8084/managers/1](http://localhost:8084/managers/1)"
}
},
"email": "[manager1@example.com](mailto:manager1@example.com)",
"loginId": "manager001",
"loginPassword": "1111",
"name": "관리자1",
"phone": "010-0000-0000"
}
```

--- C:\Users\User\Downloads\API명세서\대시보드-로그인 API명세\관리자 수정 251518971cba81ee8d1dfd83975a69de.md ---

# 관리자 수정

API: /managers/{id}
HTTP 메서드: PATCH
request: https://www.notion.so/noahbibi/req-24d18731459c8064b9a3c527851e61fd
상태: 완료

--- C:\Users\User\Downloads\API명세서\대시보드-로그인 API명세\관리자 조회-res (1) 251518971cba80c3a0c6cf1f7f95845b.md ---

# 관리자 조회-res (1)

```json
{
"_embedded": {
"managers": [
{
"_links": {
"manager": {
"href": "[http://localhost:8084/managers/1](http://localhost:8084/managers/1)"
},
"self": {
"href": "[http://localhost:8084/managers/1](http://localhost:8084/managers/1)"
}
},
"email": "[manager1@example.com](mailto:manager1@example.com)",
"loginId": "manager001",
"loginPassword": "1111",
"name": "관리자1",
"phone": "010-0000-0000"
}
]
},
"_links": {
"profile": {
"href": "[http://localhost:8084/profile/managers](http://localhost:8084/profile/managers)"
},
"search": {
"href": "[http://localhost:8084/managers/search](http://localhost:8084/managers/search)"
},
"self": {
"href": "[http://localhost:8084/managers](http://localhost:8084/managers)"
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

--- C:\Users\User\Downloads\API명세서\대시보드-로그인 API명세\유가족 목록 조회 251518971cba81f0a501d39e9d4ff3a2.md ---

# 유가족 목록 조회

API: /families
HTTP 메서드: GET
reponse: https://www.notion.so/noahbibi/res-24d18731459c80f18a6cd4320900738f
상태: 완료

--- C:\Users\User\Downloads\API명세서\대시보드-로그인 API명세\유가족 번호로 정보찾기 251518971cba817e8b89f8d2931de2ac.md ---

# 유가족 번호로 정보찾기

API: /families/search-phone
HTTP 메서드: GET
reponse: https://www.notion.so/noahbibi/res-24d18731459c80f18a6cd4320900738f
request: "phone":"{phone}"
상태: 완료

--- C:\Users\User\Downloads\API명세서\대시보드-로그인 API명세\유가족 삭제 251518971cba815ea01ecbe10a116163.md ---

# 유가족 삭제

API: /families/{id}
HTTP 메서드: DELETE
상태: 완료

--- C:\Users\User\Downloads\API명세서\대시보드-로그인 API명세\유가족 생성 -req (1) 251518971cba8041985cd9b1beeef8d1.md ---

# 유가족 생성 -req (1)

```json
{"name":"이순신" ,
"loginId":"leess" ,
"loginPassword":"password",
"email":"leess@example.com",
"phone":"010-5555-6666",
 "status":"PENDING",
 "deceasedName":"홍길동"
 "memorialID":"ahsfjkhasdkjf-asdhjkfajk"
 }
```

--- C:\Users\User\Downloads\API명세서\대시보드-로그인 API명세\유가족 생성 -res (1) 251518971cba8094a82cf2362b0654cc.md ---

# 유가족 생성 -res (1)

```json
{
"_links": {
"approvefamily": {
"href": "[http://localhost:8084/families/4/approvefamily](http://localhost:8084/families/4/approvefamily)"
},
"family": {
"href": "[http://localhost:8084/families/4](http://localhost:8084/families/4)"
},
"self": {
"href": "[http://localhost:8084/families/4](http://localhost:8084/families/4)"
}
},
"createdAt": null,
"email": "[leess@example.com](mailto:leess@example.com)",
"loginId": "leess",
"loginPassword": "password",
"memorialId": null,
"name": "이순신",
"phone": "010-5555-6666",
"status": "PENDING",
"updatedAt": null
}
```

--- C:\Users\User\Downloads\API명세서\대시보드-로그인 API명세\유가족 생성 251518971cba8152a958dcaef1e8ea64.md ---

# 유가족 생성

API: /families
HTTP 메서드: POST
reponse: https://www.notion.so/noahbibi/res-24d18731459c80ac9740d2cc9348b06a
request: https://www.notion.so/noahbibi/req-24d18731459c80de8f1fefda29e2ac48
상태: 완료

--- C:\Users\User\Downloads\API명세서\대시보드-로그인 API명세\유가족 수정 251518971cba8195b29ec63f54934ade.md ---

# 유가족 수정

API: /families/{id}
HTTP 메서드: PATCH
request: https://www.notion.so/noahbibi/req-24d18731459c80de8f1fefda29e2ac48
상태: 완료

--- C:\Users\User\Downloads\API명세서\대시보드-로그인 API명세\유가족 승인 251518971cba810cb542f4c49c3e094b.md ---

# 유가족 승인

API: /families/{familyId}/approve
HTTP 메서드: POST
request: "memorialId":"{memorialId}"
상태: 완료

--- C:\Users\User\Downloads\API명세서\대시보드-로그인 API명세\유가족 아이디로 정보찾기 251518971cba818abc78ecd718386cc3.md ---

# 유가족 아이디로 정보찾기

API: /families/search-loginId
HTTP 메서드: GET
reponse: https://www.notion.so/noahbibi/res-24d18731459c80f18a6cd4320900738f
request: "loginId":"{loginId}"
상태: 완료

--- C:\Users\User\Downloads\API명세서\대시보드-로그인 API명세\유가족 이름 이메일로 → 아이디찾기 251518971cba81d59db8de939bf9f058.md ---

# 유가족 이름/이메일로 → 아이디찾기

API: /families/find-id
HTTP 메서드: GET
reponse: "loginId":"{loginId}"
request: "name":"{name}" ,"email":"{email}" 
상태: 완료

--- C:\Users\User\Downloads\API명세서\대시보드-로그인 API명세\유가족 이름으로 정보찾기 251518971cba818a9058d8228bf83cba.md ---

# 유가족 이름으로 정보찾기

API: /families/search-name
HTTP 메서드: GET
reponse: https://www.notion.so/noahbibi/res-24d18731459c80f18a6cd4320900738f
request: "name":"{name}"
상태: 완료

--- C:\Users\User\Downloads\API명세서\대시보드-로그인 API명세\유가족 이메일로 정보찾기 251518971cba81be8f1af334bc828ef9.md ---

# 유가족 이메일로 정보찾기

API: /families/search-email
HTTP 메서드: GET
reponse: https://www.notion.so/noahbibi/res-24d18731459c80f18a6cd4320900738f
request: "email":"{email}"
상태: 완료

--- C:\Users\User\Downloads\API명세서\대시보드-로그인 API명세\유가족 조회 - res (1) 251518971cba809383d3de75c2098513.md ---

# 유가족 조회 - res (1)

```json
{
"_embedded": {
"families": [
{
"_links": {
"approvefamily": {
"href": "[http://localhost:8084/families/4/approvefamily](http://localhost:8084/families/4/approvefamily)"
},
"family": {
"href": "[http://localhost:8084/families/4](http://localhost:8084/families/4)"
},
"self": {
"href": "[http://localhost:8084/families/4](http://localhost:8084/families/4)"
}
},
"createdAt": null,
"email": "[leess@example.com](mailto:leess@example.com)",
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
"href": "[http://localhost:8084/profile/families](http://localhost:8084/profile/families)"
},
"search": {
"href": "[http://localhost:8084/families/search](http://localhost:8084/families/search)"
},
"self": {
"href": "[http://localhost:8084/families](http://localhost:8084/families)"
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

--- C:\Users\User\Downloads\API명세서\대시보드-로그인 API명세\유가족 조회 251518971cba81ba806bc6babb4c1cf7.md ---

# 유가족  조회

API: /families/{id}
HTTP 메서드: GET
reponse: https://www.notion.so/noahbibi/res-24d18731459c80f18a6cd4320900738f
상태: 완료

--- C:\Users\User\Downloads\API명세서\대시보드-로그인 API명세\추모관id로 등록된 유가족 찾기 251518971cba8121a383d2f09aa55f35.md ---

# 추모관id로 등록된 유가족 찾기

API: /families/memorial
HTTP 메서드: GET
reponse: https://www.notion.so/noahbibi/res-24d18731459c80f18a6cd4320900738f
request: "memorialId":"{memorialId}"
상태: 완료
