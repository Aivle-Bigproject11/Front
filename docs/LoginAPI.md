# 로그인 API 명세서 (v2.0)

---
# 관리자 로그인

API Path: /managers/login
HTTP Method: POST
개발현황: 개발 완료
설명: 관리자 계정 로그인
토큰: X

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
| loginId | String | ✅ | 관리자 로그인 ID |
| loginPassword | String | ✅ | 관리자 로그인 비밀번호 |

### 🔹 Example Request

```json
{
  "loginId": "manager001",
  "loginPassword": "1111"
}
```

# 📤 Response

### 🔹 HTTP 200 OK

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| id | Number | 관리자 ID |
| name | String | 관리자 이름 |
| token | String | JWT 인증 토큰 |

### 🔹 Example Response

```json
{
  "id": 1,
  "name": "관리자1",
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtYW5hZ2VyMDAxIiwiaWF0IjoxNzU1MDEzNzM2LCJleHAiOjE3NTUwMTczMzZ9.CP8B_e4MmHuGWLYFNWg3KaiOHrqoqfhQTpKWwIQESDY"
}
```

---
# 유가족 로그인

API Path: /families/login
HTTP Method: POST
개발현황: 개발 완료
설명: 유가족 계정 로그인
토큰: X

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
| loginId | String | ✅ | 유가족 로그인 ID |
| loginPassword | String | ✅ | 유가족 로그인 비밀번호 |

### 🔹 Example Request

```json
{
  "loginId": "leess",
  "loginPassword": "password"
}
```

# 📤 Response

### 🔹 HTTP 200 OK

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| id | Number | 유가족 ID |
| name | String | 유가족 이름 |
| token | String | JWT 인증 토큰 |

### 🔹 Example Response

```json
{
  "id": 4,
  "name": "이순신",
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJsZWVzcyIsImlhdCI6MTc1NTAxNDUzOSwiZXhwIjoxNzU1MDE4MTM5fQ.WS3KDJQApKOlVUzCKYvjggfb-rsQRf05j71Q_UOIo6I"
}
```

---
# 유가족 아이디 찾기

API Path: /families/find-id
HTTP Method: GET
개발현황: 개발 완료
설명: 이름과 이메일로 유가족 아이디 찾기
토큰: X

# 📥 Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
|  |  |  |  |

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
| Content-Type | ✅ | application/json |  |

### 🔹 Query Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| name | String | ✅ | 유가족 이름 |
| email | String | ✅ | 유가족 이메일 |

# 📤 Response

### 🔹 HTTP 200 OK

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| loginId | String | 찾은 로그인 ID |

### 🔹 Example Response

```json
{
  "loginId": "leess"
}
```