# Lobby API 명세서

## 개요

본 문서는 사용자 로비 페이지(`src/pages/Lobby.js`)에서 사용되는 API의 명세를 정의합니다. 로비 페이지는 여러 서비스의 API를 조합하여 사용자의 추모관 목록, 서류 작성 상태 등을 표시합니다.

- **Menu4 (추모관):** 사용자의 추모관 정보를 가져오는 핵심 기능입니다. (본 문서에서 명세 정의)
- **Menu1 (고객/서류):** 추모관과 연관된 고객의 서류 작성 현황을 표시하기 위한 기능입니다. (구현 예정)

---

## API 목록

| 기능 | HTTP Method | API Path | 인증 | 개발 현황 | 서비스 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| 내 추모관 목록 조회 | GET | `/users/{userId}/memorials` | O | 개발 완료 | Menu4 | 현재 로그인된 사용자가 접근 가능한 모든 추모관 목록을 조회합니다. |
| 코드로 추모관 조회 | GET | `/memorials` | X | 개발 완료 | Menu4 | 쿼리 파라미터 `code`를 사용하여 특정 추모관 정보를 조회합니다. |
| 전체 고객 목록 조회 | GET | `/customers` | O | **구현 예정** | Menu1 | 서류 작성 상태를 표시하기 위해 전체 고객 목록을 가져옵니다. |
| 서류 미리보기 생성 | POST | `/documents/preview` | O | **구현 예정** | Menu1 | 특정 고객의 서류 데이터로 미리보기 HTML을 생성합니다. |

---

## 상세 명세 (Menu4)

### 1. 내 추모관 목록 조회

- **Method:** `GET`
- **Path:** `/users/{userId}/memorials`
- **설명:** 현재 로그인된 사용자가 접근 가능한 모든 추모관 목록을 조회합니다. `userId`는 로그인 시 발급된 유저의 고유 ID입니다.
- **Request:**
    - **Path Parameters:** `userId` (string or integer)
- **Response (200 OK):**
  ```json
  [
    {
      "id": "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx",
      "memorialId": "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx",
      "name": "박수연",
      "description": "박수연님의 소중한 추억을 기리는 공간입니다.",
      "period": "2024.01.01 ~ 2024.01.03",
      "status": "active",
      "joinCode": "MEM001",
      "profileImageUrl": "https://..."
    },
    {
      "id": "...",
      "name": "김시훈",
      "...": "..."
    }
  ]
  ```

### 2. 코드로 추모관 조회

- **Method:** `GET`
- **Path:** `/memorials`
- **설명:** 고유 참여 코드를 사용하여 특정 추모관 정보를 조회합니다. 로그인하지 않은 사용자도 접근 가능합니다.
- **Request:**
    - **Query Parameters:** `code` (string, e.g., "MEM001")
- **Response (200 OK):**
  ```json
  {
    "id": "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx",
    "memorialId": "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx",
    "name": "박수연",
    "description": "박수연님의 소중한 추억을 기리는 공간입니다.",
    "period": "2024.01.01 ~ 2024.01.03",
    "status": "active",
    "joinCode": "MEM001",
    "profileImageUrl": "https://..."
  }
  ```
- **Response (404 Not Found):**
  ```json
  {
    "error": "Memorial not found"
  }
  ```

---

## 상세 명세 (Menu1 - 구현 예정)

`<!-- TODO: Menu1 담당자의 API 명세가 확정되면 아래 내용을 구체화해야 합니다. -->`

### 3. 전체 고객 목록 조회

- **Method:** `GET`
- **Path:** `/customers`
- **설명:** 로비에서 각 추모관에 연결된 서류의 작성 상태를 확인하기 위해, 시스템에 등록된 전체 고객 목록을 조회합니다.
- **Response (200 OK):**
  ```json
  // 추후 명세 확정 필요
  [
    {
      "customerId": 1001,
      "name": "박수연",
      "documents": {
        "obituary": true,
        "schedule": true,
        "deathCertificate": false
      },
      "formData": { ... }
    }
  ]
  ```

### 4. 서류 미리보기 생성

- **Method:** `POST`
- **Path:** `/documents/preview`
- **설명:** 특정 서류(부고장, 일정표 등)의 데이터를 받아 미리보기용 HTML 컨텐츠를 생성하여 반환합니다.
- **Request:**
    - **Body:**
      ```json
      {
        "docType": "obituary",
        "formData": {
          "name": "박수연",
          "age": 90,
          // ... other form fields
        }
      }
      ```
- **Response (200 OK):**
  ```json
  {
    "title": "부고장",
    "content": "<html>...미리보기 HTML...</html>"
  }
  ```
