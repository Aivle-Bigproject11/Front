# 추모관 API 명세서

## 종합

## 1. 추모관

| 기능 | HTTP Method | API Path | 인증 | 개발 현황 | 설명 |
| --- | --- | --- | --- | --- | --- |
| 추모관 전체 조회 | GET | /memorials | X | 개발 완료 | 모든 추모관 목록을 조회합니다. |
| 추모관 단건 조회 | GET | /memorials/{id} | X | 개발 완료 | 특정 ID의 추모관 정보를 조회합니다. |
| 추모관 상세 조회 | GET | /memorials/{id}/details | X | 개발 완료 | 추모관의 상세 정보(사진, 영상, 댓글 포함)를 조회합니다. |
| 추모관 프로필 이미지 업로드 | PATCH | /memorials/{id}/profile-image | O | 개발 완료 | 특정 추모관의 프로필 이미지를 업로드(수정)합니다. `multipart/form-data` 형식을 사용합니다. |

## 2. 추모사

| 기능 | HTTP Method | API Path | 인증 | 개발 현황 | 설명 |
| --- | --- | --- | --- | --- | --- |
| 추모사 생성 | POST | /memorials/{id}/tributes | O | 개발 완료 | 특정 추모관에 대한 추모사를 생성합니다. AI를 사용하여 생성할 수도 있습니다. |
| 추모사 수정 | PATCH | /memorials/{id}/tribute | O | 개발 완료 | 특정 추모관의 추모사를 수정합니다. |
| 추모사 삭제 | DELETE | /memorials/{id}/tribute | O | 개발 완료 | 특정 추모관의 추모사를 삭제합니다. |

## 3. 추모 사진

| 기능 | HTTP Method | API Path | 인증 | 개발 현황 | 설명 |
| --- | --- | --- | --- | --- | --- |
| 추모사진 업로드 | POST | /memorials/{id}/photos | O | 개발 완료 | 특정 추모관에 사진을 업로드합니다. `multipart/form-data` 형식을 사용합니다. |
| 추모사진 전체 조회 | GET | /photos | X | 개발 완료 | 모든 추모 사진을 조회합니다. |
| 특정 추모관의 사진 전체 조회 | GET | /memorials/{id}/photos | X | 개발 완료 | 특정 추모관에 속한 모든 사진을 조회합니다. |
| 추모사진 단건 조회 | GET | /photos/{photoId} | X | 개발 완료 | 특정 ID의 추모 사진 정보를 조회합니다. |
| 추모사진 수정 | PATCH | /photos/{photoId} | O | 개발 완료 | 특정 추모 사진의 정보(제목, 설명)를 수정합니다. |
| 추모사진 삭제 | DELETE | /photos/{photoId} | O | 개발 완료 | 특정 추모 사진을 삭제합니다. |

## 4. 추모 영상

| 기능 | HTTP Method | API Path | 인증 | 개발 현황 | 설명 |
| --- | --- | --- | --- | --- | --- |
| 추모영상 생성 | POST | /videos | O | **개발중** | 추모 영상을 생성합니다. AI를 사용하여 생성할 수 있습니다. |
| 추모영상 전체 조회 | GET | /videos | X | **개발중** | 모든 추모 영상을 조회합니다. |
| 특정 추모영상 조회 | GET | /videos/{videoId} | X | **개발중** | 특정 ID의 추모 영상 정보를 조회합니다. |
| 추모영상 삭제 | DELETE | /videos/{videoId} | O | **개발중** | 특정 추모 영상을 삭제합니다. |

## 5. 추모 댓글

| 기능 | HTTP Method | API Path | 인증 | 개발 현황 | 설명 |
| --- | --- | --- | --- | --- | --- |
| 추모댓글 생성 | POST | /memorials/{id}/comments | X | 개발 완료 | 특정 추모관에 댓글을 작성합니다. |
| 특정 추모관의 댓글 전체 조회 | GET | /memorials/{id}/comments | X | 개발 완료 | 특정 추모관의 모든 댓글을 조회합니다. |
| 추모댓글 수정 | PATCH | /comments/{commentId} | O | 개발 완료 | 특정 댓글의 내용을 수정합니다. |
| 추모댓글 삭제 | DELETE | /comments/{commentId} | O | 개발 완료 | 특정 댓글을 삭제합니다. |

## 상세 명세
## 1. 추모관

### 1.1. 추모관 전체 조회
- **Method:** `GET`
- **Path:** `/memorials`
- **설명:** 모든 추모관 목록을 페이지네이션하여 조회합니다.
- **Response (200 OK):**
  ```json
  {
      "_embedded": {
          "memorials": [
              {
                  "customerId": 1004,
                  "profileImageUrl": null,
                  "name": "최지은",
                  "age": 90,
                  "birthDate": "1934-11-02",
                  "deceasedDate": "2024-07-10",
                  "gender": "여성",
                  "tribute": null,
                  "tributeGeneratedAt": null,
                  "createdAt": "2025-08-08T16:45:54.568149",
                  "updatedAt": null,
                  "familyList": [],
                  "_links": {
                      "self": { "href": "http://localhost:8085/memorials/1c337344-ad3c-4785-a5f8-0054698c3ebe" }
                  }
              }
          ]
      },
      "page": { "size": 20, "totalElements": 5, "totalPages": 1, "number": 0 }
  }
  ```

### 1.2. 추모관 단건 조회
- **Method:** `GET`
- **Path:** `/memorials/{memorialId}`
- **설명:** 특정 ID의 추모관 정보를 조회합니다.
- **Request:**
    - **Path Parameters:** `memorialId` (string, UUID)
- **Response (200 OK):**
  ```json
  {
      "memorialId": "1c337344-ad3c-4785-a5f8-0054698c3ebe",
      "customerId": 1004,
      "profileImageUrl": null,
      "name": "최지은",
      "age": 90,
      "birthDate": "1934-11-02",
      "deceasedDate": "2024-07-10",
      "gender": "여성",
      "tribute": null,
      "tributeGeneratedAt": null,
      "createdAt": "2025-08-08T16:45:54.568149",
      "updatedAt": null,
      "familyList": []
  }
  ```

### 1.3. 추모관 상세 조회
- **Method:** `GET`
- **Path:** `/memorials/{memorialId}/detail`
- **설명:** 추모관의 모든 정보(사진, 영상, 댓글 등)를 한번에 조회합니다.
- **Request:**
    - **Path Parameters:** `memorialId` (string, UUID)
- **Response (200 OK):**
  ```json
  // memorial, photos, videos, comments 등 모든 정보 포함
  {
    "memorialInfo": { ... },
    "photos": [ ... ],
    "videos": [ ... ],
    "comments": [ ... ]
  }
  ```

### 1.4. 추모관 프로필 이미지 업로드
- **Method:** `PATCH`
- **Path:** `/memorials/{memorialId}/profile-image`
- **설명:** 특정 추모관의 프로필 이미지를 업로드(수정)합니다.
- **Request:**
    - **Path Parameters:** `memorialId` (string, UUID)
    - **Body:** `multipart/form-data`
        - `profileImage`: (file)
- **Response (200 OK):**
  ```json
  {
      "memorialId": "1c337344-ad3c-4785-a5f8-0054698c3ebe",
      "photoUrl": "https://.../profile.jpg"
  }
  ```

---

## 2. 추모사

### 2.1. 추모사 생성
- **Method:** `POST`
- **Path:** `/memorials/{memorialId}/tribute`
- **설명:** 특정 추모관에 대한 추모사를 생성합니다.
- **Request:**
    - **Path Parameters:** `memorialId` (string, UUID)
    - **Body:**
      ```json
      {
        "keywords": ["가족", "사랑", "감사"],
        "prompt": "- 고인의 삶과 성품을 존중하며 회고하는 내용..."
      }
      ```
- **Response (200 OK):**
  ```json
  {
      "memorialId": "1c337344-ad3c-4785-a5f8-0054698c3ebe",
      "tribute": "사랑하는 이들이 모인 자리에서...",
      "tributeGeneratedAt": "2025-08-08T16:46:54.896217"
  }
  ```

### 2.2. 추모사 수정
- **Method:** `PATCH`
- **Path:** `/memorials/{memorialId}/tribute`
- **설명:** 특정 추모관의 추모사를 수정합니다.
- **Request:**
    - **Path Parameters:** `memorialId` (string, UUID)
    - **Body:**
      ```json
      {
        "tribute": "(수정본)사랑하는 이들이 모인 자리에서..."
      }
      ```
- **Response (200 OK):**
  ```json
  {
      "memorialId": "1c337344-ad3c-4785-a5f8-0054698c3ebe",
      "tribute": "(수정본)사랑하는 이들이 모인 자리에서...",
      "tributeGeneratedAt": "2025-08-08T16:47:11.750694"
  }
  ```

### 2.3. 추모사 삭제
- **Method:** `DELETE`
- **Path:** `/memorials/{memorialId}/tribute`
- **설명:** 특정 추모관의 추모사를 삭제합니다.
- **Request:**
    - **Path Parameters:** `memorialId` (string, UUID)
- **Response (200 OK):**
  ```json
  {
      "memorialId": "bd818cbb-9394-456e-9f7c-6432140cff43",
      "tribute": null,
      "tributeGeneratedAt": null
  }
  ```

---

## 3. 추모 사진

### 3.1. 추모사진 업로드
- **Method:** `POST`
- **Path:** `/memorials/{memorialId}/photos`
- **설명:** 특정 추모관에 사진을 업로드합니다.
- **Request:**
    - **Path Parameters:** `memorialId` (string, UUID)
    - **Body:** `multipart/form-data`
        - `title`: (string)
        - `description`: (string)
        - `photo`: (file)
- **Response (201 Created):**
  ```json
  {
      "photoId": 1,
      "memorialId": "1c337344-ad3c-4785-a5f8-0054698c3ebe",
      "title": "으하하 첫번째 제목이다.",
      "description": "으하하 첫번째 설명이다.",
      "photoUrl": "https://.../4a2913c7.jpeg",
      "uploadedAt": "2025-08-08T16:47:22.040435"
  }
  ```

### 3.2. 특정 추모관의 사진 전체 조회
- **Method:** `GET`
- **Path:** `/memorials/{memorialId}/photos`
- **설명:** 특정 추모관에 속한 모든 사진을 조회합니다.
- **Request:**
    - **Path Parameters:** `memorialId` (string, UUID)
- **Response (200 OK):**
  ```json
  {
      "_embedded": {
          "photos": [
              {
                  "memorialId": "68ac5bcb-1886-4333-89ce-dce8739f449a",
                  "title": "으하하 첫번째 제목이다.",
                  "description": "으하하 첫번째 설명이다.",
                  "photoUrl": "https://.../5dd30bbe.jpeg",
                  "uploadedAt": "2025-08-08T17:33:58.755743"
              }
          ]
      }
  }
  ```

### 3.3. 추모사진 수정
- **Method:** `PATCH`
- **Path:** `/photos/{photoId}`
- **설명:** 특정 추모 사진의 정보(제목, 설명)를 수정합니다.
- **Request:**
    - **Path Parameters:** `photoId` (integer)
    - **Body:**
      ```json
      {
        "title": "(수정본)으하하 첫번째 제목이다.",
        "description": "으하하 첫번째 설명이다."
      }
      ```
- **Response (200 OK):**
  ```json
  {
      "photoId": 1,
      "memorialId": "68ac5bcb-1886-4333-89ce-dce8739f449a",
      "title": "(수정본)으하하 첫번째 제목이다.",
      "description": "으하하 첫번째 설명이다.",
      "photoUrl": "https://.../5dd30bbe.jpeg",
      "uploadedAt": "2025-08-08T17:33:58.755743"
  }
  ```

### 3.4. 추모사진 삭제
- **Method:** `DELETE`
- **Path:** `/photos/{photoId}`
- **설명:** 특정 추모 사진을 삭제합니다.
- **Request:**
    - **Path Parameters:** `photoId` (integer)
- **Response (204 No Content):**

---

## 4. 추모 영상

### 4.1. 추모영상 생성
- **Method:** `POST`
- **Path:** `/videos`
- **설명:** 추모 영상을 생성합니다.
- **Request:**
    - **Body:** `multipart/form-data`
        - `memorialId`: (string, UUID)
        - `title`: (string)
        - `description`: (string)
        - `video`: (file)
- **Response (201 Created):**
  ```json
  // Response body example
  ```

### 4.2. 특정 추모영상 조회
- **Method:** `GET`
- **Path:** `/videos/{videoId}`
- **설명:** 특정 ID의 추모 영상 정보를 조회합니다.
- **Request:**
    - **Path Parameters:** `videoId` (integer)
- **Response (200 OK):**
  ```json
  // Response body example
  ```

### 4.3. 추모영상 삭제
- **Method:** `DELETE`
- **Path:** `/videos/{videoId}`
- **설명:** 특정 추모 영상을 삭제합니다.
- **Request:**
    - **Path Parameters:** `videoId` (integer)
- **Response (204 No Content):**

---

## 5. 추모 댓글

### 5.1. 추모댓글 생성
- **Method:** `POST`
- **Path:** `/memorials/{memorialId}/comments`
- **설명:** 특정 추모관에 댓글을 작성합니다.
- **Request:**
    - **Path Parameters:** `memorialId` (string, UUID)
    - **Body:**
      ```json
      {
        "name": "작성자 이름",
        "relationship": "고인과의 관계",
        "content": "댓글 내용"
      }
      ```
- **Response (201 Created):**
  ```json
  {
      "commentId": 2,
      "memorialId": "1c337344-ad3c-4785-a5f8-0054698c3ebe",
      "name": "두번째 작성자 이름",
      "relationship": "두번째 작성자와 고인의 관계",
      "content": "두번째 댓글 내용",
      "createdAt": null
  }
  ```

### 5.2. 특정 추모관의 댓글 전체 조회
- **Method:** `GET`
- **Path:** `/memorials/{memorialId}/comments`
- **설명:** 특정 추모관의 모든 댓글을 조회합니다.
- **Request:**
    - **Path Parameters:** `memorialId` (string, UUID)
- **Response (200 OK):**
  ```json
  {
      "_embedded": {
          "comments": [
              {
                  "commentId": 1,
                  "memorialId": "1c337344-ad3c-4785-a5f8-0054698c3ebe",
                  "name": "(수정본)첫번째 작성자 이름",
                  "relationship": "첫번째 작성자와 고인의 관계",
                  "content": "첫번째 댓글 내용",
                  "createdAt": "2025-08-08T16:47:39.688176"
              }
          ]
      }
  }
  ```

### 5.3. 추모댓글 수정
- **Method:** `PATCH`
- **Path:** `/comments/{commentId}`
- **설명:** 특정 댓글의 내용을 수정합니다.
- **Request:**
    - **Path Parameters:** `commentId` (integer)
    - **Body:**
      ```json
      {
        "name": "(수정본)첫번째 작성자 이름"
      }
      ```
- **Response (200 OK):**
  ```json
  {
      "commentId": 1,
      "memorialId": "1c337344-ad3c-4785-a5f8-0054698c3ebe",
      "name": "(수정본)첫번째 작성자 이름",
      "relationship": "첫번째 작성자와 고인의 관계",
      "content": "첫번째 댓글 내용",
      "createdAt": "2025-08-08T16:47:39.688176"
  }
  ```

### 5.4. 추모댓글 삭제
- **Method:** `DELETE`
- **Path:** `/comments/{commentId}`
- **설명:** 특정 댓글을 삭제합니다.
- **Request:**
    - **Path Parameters:** `commentId` (integer)
- **Response (204 No Content):**
