# 추모관 API 명세서 (v3.0)

---
# 추모관 전체 조회

API Path: /memorials
HTTP Method: GET
개발현황: 개발 완료
설명: 추모관 전체 목록 조회
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

### 🔹 HTTP 200 OK / 201 Created

|  |  |
| --- | --- |
|  |  |
|  |  |

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| _embedded.memorials
 | Array | 추모관 객체들 리스트 |
| ↳ ._links.memorial.href | String | 해당 추모관 리소스의 링크 |
| ↳ ._links.self.href | String | 해당 추모관 리소스의 자기참조 링크 |
| ↳ .name | String | 고인의 이름 |
| ↳ .customerId | Number | 고객ID |
| ↳ .profileImageUrl | String or null | 추모관 대표 이미지 url |
| ↳ .age | Number | 고인의 나이 |
| ↳ .birthDate | String(YYYY-MM-DD) | 고인의 생년월일 |
| ↳ .deceasedDate | String | 고인의 사망일 |
| ↳ .gender | String | 고인의 성별(남성 or 여성) |
| ↳ .createdAt | String(timestamp) | 추모관 생성일시 |
| ↳ .updatedAt | String(timestamp) | 추모관 수정일시 |
| ↳ .tribute | String or null | 추모사 내용 |
| ↳ .tributeGeneratedAt | String(timestamp) | 추모사 생성 일시 |
| ↳ .familyList | Array | 가족정보 리스트(처음엔 빈배열) |

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
                    "self": {
                        "href": "http://localhost:8085/memorials/1c337344-ad3c-4785-a5f8-0054698c3ebe"
                    },
                    "memorial": {
                        "href": "http://localhost:8085/memorials/1c337344-ad3c-4785-a5f8-0054698c3ebe"
                    }
                }
            },
            {
                "customerId": 1005,
                "profileImageUrl": null,
                "name": "정수현",
                "age": 60,
                "birthDate": "1964-05-27",
                "deceasedDate": "2024-06-15",
                "gender": "남성",
                "tribute": null,
                "tributeGeneratedAt": null,
                "createdAt": "2025-08-08T16:45:55.193759",
                "updatedAt": null,
                "familyList": [],
                "_links": {
                    "self": {
                        "href": "http://localhost:8085/memorials/aa23ff9e-770f-4292-a3dd-bd4061e74b9c"
                    },
                    "memorial": {
                        "href": "http://localhost:8085/memorials/aa23ff9e-770f-4292-a3dd-bd4061e74b9c"
                    }
                }
            }
        ]
    },
    "_links": {
        "self": {
            "href": "http://localhost:8085/memorials"
        },
        "profile": {
            "href": "http://localhost:8085/profile/memorials"
        }
    },
    "page": {
        "size": 20,
        "totalElements": 5,
        "totalPages": 1,
        "number": 0
    }
}
```
---
# 추모관 단건 조회

API Path: /memorials/{memorialId}
HTTP Method: GET
개발현황: 개발 완료
설명: 추모관 단건 조회(기본정보)
토큰: O

# 📥 Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| memorialId | String(UUID) | ✅ | 추모관 ID |

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
| Content-Type | ✅ | application/json |  |

# 📤 Response

### 🔹 HTTP 200 OK

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| customerId | Number | 고객 ID |
| profileImageUrl | String | 프로필 이미지 Url |
| name | String  | 고인의 이름 |
| age | Number | 고인의 나이 |
| birthDate | String(YYYY-MM-DD) | 고인의 생년월일 |
| deceasedDate | String(YYYY-MM-DD) | 고인의 사망일 |
| gender | String | 고인의 성별(남성 or 여성) |
| tribute | String | 추모사 |
| tributeGeneratedAt | String(timestamp) | 추모사 생성 시간 |
| createdAt | String(timestamp) | 추모관 생성 일시 |
| updatedAt | String(timestamp) | 추모관 수정 일시 |
| familyList | Array | 유가족 ID리스트 |
| _links.memorial.href | String | 추모관 리소스의 링크 |

```json
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
        "self": {
            "href": "http://localhost:8085/memorials/1c337344-ad3c-4785-a5f8-0054698c3ebe"
        },
        "memorial": {
            "href": "http://localhost:8085/memorials/1c337344-ad3c-4785-a5f8-0054698c3ebe"
        }
    }
}
```
---
# 추모관 상세조회

API Path: /memorials/{memorialId}/detail
HTTP Method: GET
개발현황: 개발 완료
설명: memorialId에 해당하는 추모관의 상세 정보(추모관 이름, 대표 이미지, 생성일, 관련 영상/이미지/댓글 등 포함)를 조회합니다.

토큰: X

# 📥 Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| memorialId | String(UUID) | O | 찾고싶은 memorialId |

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
| Content-Type | ✅ | application/json |  |

# 📤 Response

### 🔹 HTTP 200 OK

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| _embedded.memorials
 | Array | 추모관 객체들 리스트 |
| ↳ ._links.memorial.href | String | 해당 추모관 리소스의 링크 |
| ↳ ._links.self.href | String | 해당 추모관 리소스의 자기참조 링크 |
| ↳ .age | Number | 고인의 나이 |
| ↳ .birthDate | String(YYYY-MM-DD) | 고인의 생년월일 |
| ↳ .createdAt | String(timestamp) | 추모관 생성일시 |
| ↳ .customerId | Number | 고객ID |
| ↳ .deceasedDate | String | 고인의 사망일 |
| ↳ .familyList | Array | 가족정보 리스트(처음엔 빈배열) |
| ↳ .gender | String | 고인의 성별(남성 or 여성) |
| ↳ .imageUrl | String or null | 추모관 프로필 이미지 url |
| ↳ .name | String | 고인의 이름 |
| ↳ .tribute | String or null | 추모사 내용 |
| ↳ .videos |  |  |

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
                    "self": {
                        "href": "http://localhost:8085/memorials/1c337344-ad3c-4785-a5f8-0054698c3ebe"
                    },
                    "memorial": {
                        "href": "http://localhost:8085/memorials/1c337344-ad3c-4785-a5f8-0054698c3ebe"
                    }
                }
            },
            {
                "customerId": 1005,
                "profileImageUrl": null,
                "name": "정수현",
                "age": 60,
                "birthDate": "1964-05-27",
                "deceasedDate": "2024-06-15",
                "gender": "남성",
                "tribute": null,
                "tributeGeneratedAt": null,
                "createdAt": "2025-08-08T16:45:55.193759",
                "updatedAt": null,
                "familyList": [],
                "_links": {
                    "self": {
                        "href": "http://localhost:8085/memorials/aa23ff9e-770f-4292-a3dd-bd4061e74b9c"
                    },
                    "memorial": {
                        "href": "http://localhost:8085/memorials/aa23ff9e-770f-4292-a3dd-bd4061e74b9c"
                    }
                }
            },
            {
                "customerId": 1001,
                "profileImageUrl": null,
                "name": "김철수",
                "age": 75,
                "birthDate": "1949-01-01",
                "deceasedDate": "2024-07-25",
                "gender": "남성",
                "tribute": null,
                "tributeGeneratedAt": null,
                "createdAt": "2025-08-08T16:45:52.672106",
                "updatedAt": null,
                "familyList": [],
                "_links": {
                    "self": {
                        "href": "http://localhost:8085/memorials/b26b8169-b829-4b73-b29c-02f9da6d8672"
                    },
                    "memorial": {
                        "href": "http://localhost:8085/memorials/b26b8169-b829-4b73-b29c-02f9da6d8672"
                    }
                }
            },
            {
                "customerId": 1002,
                "profileImageUrl": null,
                "name": "이영희",
                "age": 82,
                "birthDate": "1942-03-15",
                "deceasedDate": "2024-06-30",
                "gender": "여성",
                "tribute": null,
                "tributeGeneratedAt": null,
                "createdAt": "2025-08-08T16:45:53.318204",
                "updatedAt": null,
                "familyList": [],
                "_links": {
                    "self": {
                        "href": "http://localhost:8085/memorials/c3645cd0-8c09-4ce2-82ac-780085f3340d"
                    },
                    "memorial": {
                        "href": "http://localhost:8085/memorials/c3645cd0-8c09-4ce2-82ac-780085f3340d"
                    }
                }
            },
            {
                "customerId": 1003,
                "profileImageUrl": null,
                "name": "박철수",
                "age": 68,
                "birthDate": "1956-09-20",
                "deceasedDate": "2024-08-01",
                "gender": "남성",
                "tribute": null,
                "tributeGeneratedAt": null,
                "createdAt": "2025-08-08T16:45:53.956373",
                "updatedAt": null,
                "familyList": [],
                "_links": {
                    "self": {
                        "href": "http://localhost:8085/memorials/ef17d0b4-0f69-443a-b660-4891c522d64b"
                    },
                    "memorial": {
                        "href": "http://localhost:8085/memorials/ef17d0b4-0f69-443a-b660-4891c522d64b"
                    }
                }
            }
        ]
    },
    "_links": {
        "self": {
            "href": "http://localhost:8085/memorials"
        },
        "profile": {
            "href": "http://localhost:8085/profile/memorials"
        }
    },
    "page": {
        "size": 20,
        "totalElements": 5,
        "totalPages": 1,
        "number": 0
    }
}
```
---
# 추모관 프로필 이미지 업로드

API Path: /memorials/{memorialId}/profile-image
HTTP Method: PATCH
개발현황: 개발 완료
설명: 특정 추모관 ID의 프로필 이미지를 설정합니다.
토큰: O

# 📥 Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| memorialId | String(UUID) | ✅ | 프로필 업로드할 추모관 ID |

### 🔹 Headers

| 이름 | 값 | 필수 | 설명 |
| --- | --- | --- | --- |
| Authorization | Bearer {accessToken}
 | ✅ | 인증토큰 |
| Content-Type | multipart/form-data | ✅ | 파일 업로드시 자동 설정됨 |

### 🔹 Form Data

| 필드명 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| **photo** | file | ✅ | 업로드할 이미지 파일 (jpg, png 등) |

# 📤 Response

### 🔹 HTTP 200 OK / 201 Created

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| memorialId | String(UUID) | 추모관 ID |
| photoUrl | String(url) | 프로필사진 URL |

```json
{
    "memorialId": "1c337344-ad3c-4785-a5f8-0054698c3ebe",
    "photoUrl": "https://aivles.blob.core.windows.net/memorial-content/1c337344-ad3c-4785-a5f8-0054698c3ebe%2Fprofile%2Fprofile.jpg"
}
```
---
# 추모사 생성

API Path: /memorials/{memorialId}/tribute
HTTP Method: POST
개발현황: 개발 완료
설명: 특정 추모관 ID에 대해 AI 기반 추모사를 생성합니다.
토큰: O

# 📥 Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| memorialId | String | ✅ | 추모관 ID |

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
| Authorization | ✅ | Bearer {token} | 사용자 인증 토큰 |
| Content-Type | ✅ | application/json |  |

### 🔹 Body or Form Data

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| keywords | String | ✅ | 추모사 생성에 필요한 키워드 |
| tributeRequest | String | ✅ | 추모사 생성에 필요한 요청사항 |

# 📤 Response

### 🔹 HTTP 200 OK / 201 Created

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| `memorialId` | String | 추모관 ID |
| `tribute` | String | AI가 생성해낸 추모사 |
| `tributeGeneratedAt` | String(timestamp) | 생성된 일시 |

```json
{
    "memorialId": "1c337344-ad3c-4785-a5f8-0054698c3ebe",
    "tribute": "사랑하는 이들이 모인 자리에서, 우리는 오늘 최지은님의 삶을 되새기며 그 눈부신 발자취를 기억하고자 합니다. 지은님은 1934년 11월 2일, 우리에게 온 세상의 사랑을 담은 분이셨습니다. 2024년 7월 10일, 그 삶의 여정은 마침표를 찍었지만, 우리는 여전히 그녀의 따뜻한 뒷모습이 우리의 마음속에 깊이 새겨져 있음을 느낍니다.

지은님은 언제나 가족을 먼저 생각하시는 분이었습니다. 그녀의 눈빛 속에는 무한한 사랑과 자애로움이 가득했습니다. 언제나 자식들과 손주들 곁에 있어주며 따뜻한 미소로 우리를 품어주셨던 그 기억이, 지금도 생생하게 떠오릅니다. 주말마다 마련되던 가족 모임에서 지은님은 늘 맛있는 음식과 따뜻한 이야기를 나누어 주시며, 우리를 더욱 가까이 모아주셨습니다. 그 작은 식탁 위에서 나눈 웃음과 대화는 언제나 우리가 함께하는 행복의 원천이었고, 그 자리에 지은님이 계셨기에 더욱 특별했습니다.

또한, 지은님은 인생의 소소한 것들 속에서도 감사함을 찾으셨던 분이었습니다. 햇빛이 잘 드는 창가에서 곱게 피어난 꽃들을 보며 기뻐하시고, 작은 일상 속에서 감사의 노래를 부르셨습니다. 지은님께서는 주변의 모든 것에 고마움을 느끼며 살아가는 모습을 통해 우리에게 진정한 사랑의 의미를 가르쳐 주셨습니다.

이제 우리는 그녀를 다시 볼 수 없지만, 그녀의 사랑은 우리의 마음 속에 영원히 살아 있을 것입니다. 최지은님의 따뜻한 미소와 사랑의 기억이 우리를 붙잡아 줄 것입니다. 비록 그녀가 떠나갔지만, 그녀가 남긴 사랑의 가치는 결코 지워지지 않을 것입니다.

사랑하는 지은님, 그곳에서 평안히 쉬세요. 당신의 사랑은 결코 잊지 않겠습니다. 모두가 그리워할 당신에게, 마지막 인사를 전합니다. 고맙습니다, 지은님. 영원히 사랑합니다.",
    "tributeGeneratedAt": "2025-08-08T16:46:54.896217"
}
```
---
# 추모사 수정

API Path: /memorials/{memorialId}/tribute
HTTP Method: PATCH
개발현황: 개발 완료
설명: 추모사를 수정합니다.
토큰: O

# 📥 Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| memorialId | String | ✅ | 추모관 ID |

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
| Content-Type | ✅ | application/json |  |

### 🔹 Body or Form Data

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| tribute | String | ✅ | 수정한 추모사내용 |

# 📤 Response

### 🔹 HTTP 200 OK / 201 Created

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| `memorialId` | String | 추모관 ID |
| `tribute` | String | 추모사 |
| `tributeGeneratedAt` | String | AI가 생성한 시간 |

```json
{
    "memorialId": "1c337344-ad3c-4785-a5f8-0054698c3ebe",
    "tribute": "(추모사수정본)사랑하는 이들이 모인 자리에서, 우리는 오늘 최지은님의 삶을 되새기며 그 눈부신 발자취를 기억하고자 합니다. 지은님은 1934년 11월 2일, 우리에게 온 세상의 사랑을 담은 분이셨습니다. 2024년 7월 10일, 그 삶의 여정은 마침표를 찍었지만, 우리는 여전히 그녀의 따뜻한 뒷모습이 우리의 마음속에 깊이 새겨져 있음을 느낍니다.

지은님은 언제나 가족을 먼저 생각하시는 분이었습니다. 그녀의 눈빛 속에는 무한한 사랑과 자애로움이 가득했습니다. 언제나 자식들과 손주들 곁에 있어주며 따뜻한 미소로 우리를 품어주셨던 그 기억이, 지금도 생생하게 떠오릅니다. 주말마다 마련되던 가족 모임에서 지은님은 늘 맛있는 음식과 따뜻한 이야기를 나누어 주시며, 우리를 더욱 가까이 모아주셨습니다. 그 작은 식탁 위에서 나눈 웃음과 대화는 언제나 우리가 함께하는 행복의 원천이었고, 그 자리에 지은님이 계셨기에 더욱 특별했습니다.

또한, 지은님은 인생의 소소한 것들 속에서도 감사함을 찾으셨던 분이었습니다. 햇빛이 잘 드는 창가에서 곱게 피어난 꽃들을 보며 기뻐하시고, 작은 일상 속에서 감사의 노래를 부르셨습니다. 지은님께서는 주변의 모든 것에 고마움을 느끼며 살아가는 모습을 통해 우리에게 진정한 사랑의 의미를 가르쳐 주셨습니다.

이제 우리는 그녀를 다시 볼 수 없지만, 그녀의 사랑은 우리의 마음 속에 영원히 살아 있을 것입니다. 최지은님의 따뜻한 미소와 사랑의 기억이 우리를 붙잡아 줄 것입니다. 비록 그녀가 떠나갔지만, 그녀가 남긴 사랑의 가치는 결코 지워지지 않을 것입니다.

사랑하는 지은님, 그곳에서 평안히 쉬세요. 당신의 사랑은 결코 잊지 않겠습니다. 모두가 그리워할 당신에게, 마지막 인사를 전합니다. 고맙습니다, 지은님. 영원히 사랑합니다.",
    "tributeGeneratedAt": "2025-08-08T16:47:11.750694"
}
```
---
# 추모사 삭제

API Path: /memorials/{memorialId}/tribute
HTTP Method: DELETE
개발현황: 개발 완료
설명: 추모사를 삭제합니다.
토큰: O

# 📥 Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
|  |  |  |  |

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
|  |  |  |  |

### 🔹 Body or Form Data

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
|  |  |  |  |

# 📤 Response

### 🔹 HTTP 200 OK / 201 Created

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| `memorialId` | String(url) | 추모관 ID |
| `tribute` | String | null |
| `tributeGeneratedAt` | String | null |

```json
{
    "memorialId": "bd818cbb-9394-456e-9f7c-6432140cff43",
    "tribute": null,
    "tributeGeneratedAt": null
}
```
---
# 추모사진 전체 조회

API Path: /photos
HTTP Method: GET
개발현황: 개발 완료
설명: 추모사진 전체 조회

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

### 🔹 HTTP 200 OK / 201 Created

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| _embedded.photos
 | Array | 추모사진 리스트 |
| ↳ ._links.photo.href | String | 해당 추모사진 리소스의 링크 |
| ↳ .memorialId | String | 해당 추모관 ID |
| ↳ .title | String | 추모사진 제목 |
| ↳ .description | String | 추모사진 설명 |
| ↳ .photoUrl | String | 추모사진 URL |
| ↳ .uploadedAt | String(timestamp) | 추모사진 업로드 일시 |

```json
{
    "_embedded": {
        "photos": [
            {
                "memorialId": "68ac5bcb-1886-4333-89ce-dce8739f449a",
                "title": "으하하 첫번째 제목이다.",
                "description": "으하하 첫번째 설명이다.",
                "photoUrl": "https://aivles.blob.core.windows.net/memorial-content/68ac5bcb-1886-4333-89ce-dce8739f449a%2Fphoto-album%2F5dd30bbe-070d-4a55-8963-52575852dc10.jpeg",
                "uploadedAt": "2025-08-08T17:33:58.755743",
                "_links": {
                    "self": {
                        "href": "http://localhost:8085/photos/1"
                    },
                    "photo": {
                        "href": "http://localhost:8085/photos/1"
                    }
                }
            }
        ]
    },
    "_links": {
        "self": {
            "href": "http://localhost:8085/photos"
        },
        "profile": {
            "href": "http://localhost:8085/profile/photos"
        },
        "search": {
            "href": "http://localhost:8085/photos/search"
        }
    },
    "page": {
        "size": 20,
        "totalElements": 1,
        "totalPages": 1,
        "number": 0
    }
}
```
---
# 추모사진 조회

API Path: /photos/{photoId}
HTTP Method: GET
개발현황: 개발 완료
설명: 추모사진 한장 조회

# 📥 Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| photoId | Long | ✅ | 추모사진 ID |

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
| Content-Type | ✅ | application/json |  |

### 🔹 Body or Form Data

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
|  |  |  |  |

# 📤 Response

### 🔹 HTTP 200 OK / 201 Created

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| memorialId | String | 해당 추모관 ID |
| title | String | 추모사진 제목 |
| description | String | 추모사진 설명 |
| photoUrl | String | 추모사진 URL |
| uploadedAt | String(timestamp) | 추모사진 생성 일시 |
| _links.self.href | String | 해당 추모사진 리소스 |

```json
{
    "memorialId": "68ac5bcb-1886-4333-89ce-dce8739f449a",
    "title": "으하하 첫번째 제목이다.",
    "description": "으하하 첫번째 설명이다.",
    "photoUrl": "https://aivles.blob.core.windows.net/memorial-content/68ac5bcb-1886-4333-89ce-dce8739f449a%2Fphoto-album%2F5dd30bbe-070d-4a55-8963-52575852dc10.jpeg",
    "uploadedAt": "2025-08-08T17:33:58.755743",
    "_links": {
        "self": {
            "href": "http://localhost:8085/photos/1"
        },
        "photo": {
            "href": "http://localhost:8085/photos/1"
        }
    }
}
```
---
# 추모사진 업로드

API Path: /memorials/{memorialId)/photos
HTTP Method: POST
개발현황: 개발 완료
설명: 추모사진 한장 업로드

# 📥 Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| memorialId | String(UUID) | ✅ | 해당 추모관 ID |

### 🔹 Headers

| 이름 | 값 | 필수 | 설명 |
| --- | --- | --- | --- |
| Authorization | Bearer {token} | ✅ | 사용자 인증 토큰 |
| Content-Type | multipart/form-data | ✅ |  |

### 🔹 Form

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| photo | File | ✅ | 업로드할 사진 |
| title | String | ✅ | 추모사진 제목 |
| description | String | ✅ | 추모사진 내용 |

# 📤 Response

### 🔹 HTTP 200 OK / 201 Created

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| photoId | Number | 추모사진 ID |
| memorialId | String | 추모관 ID |
| title | String | 추모사진 제목 |
| description | String | 추모사진 내용 |
| photoUrl | String | 추모사진 Url |
| uploadedAt | String | 추모사진 업로드 일시 |

```json
{
    "photoId": 1,
    "memorialId": "1c337344-ad3c-4785-a5f8-0054698c3ebe",
    "title": "으하하 첫번째 제목이다.",
    "description": "으하하 첫번째 설명이다.",
    "photoUrl": "https://aivles.blob.core.windows.net/memorial-content/1c337344-ad3c-4785-a5f8-0054698c3ebe%2Fphoto-album%2F4a2913c7-4dd5-4cfa-82da-01c169f05c1b.jpeg",
    "uploadedAt": "2025-08-08T16:47:22.040435"
}
```
---
# 추모사진 수정

API Path: /photos/{photoId}
HTTP Method: PATCH
개발현황: 개발 완료
설명: 추모사진 수정

# 📥 Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| photoId | Long | ✅ | 추모사진 ID |

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
|  |  |  |  |

### 🔹 Body or Form Data

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| title | String | ❌ | 추모사진 제목 |
| description | String | ❌ | 추모사진 설명 |

# 📤 Response

### 🔹 HTTP 200 OK / 201 Created

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| _links.photo.href
 | String | 해당 추모관 리소스의 링크 |
| memorialId | String(UUID) | 해당 추모관 ID |
| title | String | 추모사진 제목 |
| description | String | 추모사진 설명 |
| photoUrl | String | 추모사진 URL |
| uploadedAt | String(timestamp) | 추모사진 생성 일시 |

```json
{
    "memorialId": "68ac5bcb-1886-4333-89ce-dce8739f449a",
    "title": "(수정본)으하하 첫번째 제목이다.",
    "description": "으하하 첫번째 설명이다.",
    "photoUrl": "https://aivles.blob.core.windows.net/memorial-content/68ac5bcb-1886-4333-89ce-dce8739f449a%2Fphoto-album%2F5dd30bbe-070d-4a55-8963-52575852dc10.jpeg",
    "uploadedAt": "2025-08-08T17:33:58.755743",
    "_links": {
        "self": {
            "href": "http://localhost:8085/photos/1"
        },
        "photo": {
            "href": "http://localhost:8085/photos/1"
        }
    }
}
```
---
# 추모사진 삭제

API Path: /photos/{photoId}
HTTP Method: DELETE
개발현황: 개발 완료
설명: 추모사진 전체 조회

# 📥 Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| photoId | Long | ✅ | 추모사진 ID |

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
|  |  |  |  |

### 🔹 Body or Form Data

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
|  |  |  |  |

# 📤 Response

### 🔹 HTTP 204 No content

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
|  |  |  |
|  |  |  |
---
# 추모영상 전체조회

API Path: /videos
HTTP Method: GET
개발현황: 개발 완료
설명: 추모영상 전체 조회
토큰: O

# 📥 Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
|  |  |  |  |

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
|  |  |  |  |

### 🔹 Body or Form Data

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
|  |  |  |  |

# 📤 Response

### 🔹 HTTP 200 OK / 201 Created

|  |  |
| --- | --- |
|  |  |
|  |  |

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| _embedded.videos
 | Array | 추모영상 리스트 |
| ↳ ._links.video.href | String | 해당 추모 영상 리소스 조회 |
| ↳ .memorialId | String | 해당 추모관 ID |
| ↳ .videoTitle | String | 추모영상 제목 |
| ↳ .videoUrl | String | 추모영상 url - azure |
| ↳ .keywords | String | 추모영상 생성에 쓰일 키워드 |
| ↳ .status | String | 상태(REQUESTED, COMPLETED) |
| ↳ .createdAt | String(timestamp) | 생성 일시 |
| ↳ .completedAt | String(timestamp) | 생성 완료 일시 |
---
# 특정 추모영상 조회

API Path: /videos/{videoId}
HTTP Method: GET
개발현황: 개발 완료
설명: 추모영상 조회
토큰: X

# 📥 Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| videoId | String | ✅ | 영상 ID |

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
|  |  |  |  |

### 🔹 Body or Form Data

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
|  |  |  |  |

# 📤 Response

### 🔹 HTTP 200 OK / 201 Created

|  |  |
| --- | --- |
|  |  |
|  |  |

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| ._links.video.href | String | 해당 추모영상 리소스의 링크 |
| memorialId | String | 해당 추모관 ID |
| videoTitle | String | 추모영상 제목 |
| videoUrl | String | 추모영상 url - azure |
| keywords | String | 추모영상 생성에 쓰일 키워드 |
| status | String | 상태(REQUESTED, COMPLETED) |
| createdAt | String(timestamp) | 생성 일시 |
| completedAt | String(timestamp) | 생성 완료 일시 |

```json
{
    "memorialId": "21081c9c-791e-4ce5-af5c-dc296d8d5cbb",
    "videoTitle": "이영희님의 추모영상",
    "videoUrl": "",
    "keywords": "키워드",
    "status": "REQUESTED",
    "createdAt": "2025-08-11T09:49:29.711929",
    "completedAt": null,
    "_links": {
        "self": {
            "href": "http://localhost:8085/videos/1"
        },
        "video": {
            "href": "http://localhost:8085/videos/1"
        }
    }
}
```
---
# 추모영상 생성

API Path: /memorials/{memorialId}/videos
HTTP Method: POST
개발현황: 개발 완료
설명: AI 기반 추모영상 생성(API 명세 변경됨)
토큰: O

# 📥 Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| memorialId | String(UUID) | ✅ | 추모관 ID |

### 🔹 Headers

| 이름 | 값 | 필수 | 설명 |
| --- | --- | --- | --- |
| Authorization | Bearer {token} | ✅ | 사용자 인증 토큰 |
| Content-Type | multipart/form-data | ✅ |  |

### 🔹 Body

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| memorialId | String | ✅ | 추모관 ID |
| keywords | String | ✅ | 추모영상을 위한 키워드 문장 |
| images | File[] | ✅ | 추모영상에 사용될 이미지들 |
| imagesCount | Number | ✅ | 추모영상에 사용될 이미지들 개수 |
| outroImage | File | ✅ | 영상 마지막 장면용 별도 이미지  |

# 📤 Response

### 🔹 HTTP 200 OK / 201 Created

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
|  ._links.video.href | String | 해당 추모관 비디오의 링크 |
| memorialId | String | 해당 추모관 ID |
| keywords | String | 추모영상에 쓰일 키워드 |
| status | String | 비디오 생성 상태(REQUESTED / COMPLETED) |
---
# 추모영상 삭제

API Path: /videos/{videoId}
HTTP Method: DELETE
개발현황: 개발 완료
설명: 추모영상 삭제
토큰: O

# 📥 Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
|  |  |  |  |

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
|  |  |  |  |

### 🔹 Body or Form Data

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
|  |  |  |  |

# 📤 Response

### 🔹 HTTP 200 OK / 201 Created

|  |  |
| --- | --- |
|  |  |
|  |  |

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| ↳ ._links.video.href | String | 해당 추모관 리소스 링크 |
| memorialId | String | 해당 추모관 ID |
|  |  |  |
|  |  |  |
---
# 추모댓글 조회

API Path: /comments/{commentId}
HTTP Method: GET
개발현황: 개발 완료
토큰: X

# 📥 Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| commentId | Long | ✅ | 추모댓글 ID |

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
| Content-Type | ✅ | application/json |  |

### 🔹 Body or Form Data

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
|  |  |  |  |

# 📤 Response

### 🔹 HTTP 200 OK / 201 Created

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| ._links.href | String | 추모댓글 리소스 조회(링크) |
| `memorialId` | String | 추모관 ID |
| `name` | String | 추모댓글 작성자 |
| `relationship` | String | 추모 댓글 작성자와 고인의 관계 |
| `content` | String | 추모 댓글 내용 |
| `createdAt` | String(timestamp) | 추모 댓글 생성 일시 |

```json
{
    "memorialId": "1c337344-ad3c-4785-a5f8-0054698c3ebe",
    "name": "(수정본)첫번째 작성자 이름",
    "relationship": "첫번째 작성자와 고인의 관계",
    "content": "첫번째 댓글 내용",
    "createdAt": "2025-08-08T16:47:39.688176",
    "_links": {
        "self": {
            "href": "http://localhost:8085/comments/1"
        },
        "comment": {
            "href": "http://localhost:8085/comments/1"
        }
    }
}
```
---
# 추모댓글 생성

API Path: /memorials/{memorialId}/comments
HTTP Method: POST
개발현황: 개발 완료
설명: 추모댓글을 작성합니다.
토큰: X

# 📥 Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `memorialId` | String(UUID) | ✅ | 추모관 ID |

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
| Content-Type | ✅ | application/json |  |

### 🔹 Body

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `name` | String | ✅ | 추모댓글 작성자 |
| `relationship` | String | ✅ | 추모 댓글 작성자와 고인의 관계 |
| `content` | String | ✅ | 추모 댓글 내용 |

# 📤 Response

### 🔹 HTTP 200 OK / 201 Created

|  |  |
| --- | --- |
|  |  |
|  |  |

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| `commentId` | String | 해당 댓글 ID |
| `memorialId` | String(UUID) | 추모관 ID |
| `name` | String | 추모댓글 작성자 |
| `relationship` | String | 추모 댓글 작성자와 고인의 관계 |
| `content` | String | 추모 댓글 내용 |
| `createdAt` | String(timestamp) | 추모 댓글 생성 일시 |

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
---
# 추모댓글 수정

API Path: /comments/{commentId}
HTTP Method: PATCH
개발현황: 개발 완료
설명: 추모댓글을 수정합니다.
토큰: O

# 📥 Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| commentId | Number | ✅ | 수정하고 싶은 추모 댓글 ID |

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
| Content-Type |  |  |  |

### 🔹 Body or Form Data

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `name` | String | ❌ | 추모댓글 작성자 |
| `relationship` | String | ❌ | 추모 댓글 작성자와 고인의 관계 |
| `content` | String | ❌ | 추모 댓글 내용 |

# 📤 Response

### 🔹 HTTP 200 OK / 201 Created

|  |  |
| --- | --- |
|  |  |
|  |  |

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| ._links.href | String | 추모댓글 리소스 조회(링크) |
| `memorialId` | String | 추모관 ID |
| `name` | String | 추모댓글 작성자 |
| `relationship` | String | 추모 댓글 작성자와 고인의 관계 |
| `content` | String | 추모 댓글 내용 |
| `createdAt` | String(timestamp) | 추모 댓글 생성 일시 |

```json
{
    "memorialId": "1c337344-ad3c-4785-a5f8-0054698c3ebe",
    "name": "(수정본)첫번째 작성자 이름",
    "relationship": "첫번째 작성자와 고인의 관계",
    "content": "첫번째 댓글 내용",
    "createdAt": "2025-08-08T16:47:39.688176",
    "_links": {
        "self": {
            "href": "http://localhost:8085/comments/1"
        },
        "comment": {
            "href": "http://localhost:8085/comments/1"
        }
    }
}
```
---
# 추모댓글 삭제

API Path: /comments/{commentId}
HTTP Method: DELETE
개발현황: 개발 완료
설명: 추모댓글을 삭제합니다.
토큰: O

# 📥 Request

### 🔹 Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| commentId | Long | ✅ | 댓글 ID |

### 🔹 Headers

| 이름 | 필수 | 값 | 설명 |
| --- | --- | --- | --- |
| Authorization | ✅ | Bearer {token} |  |
| Content-Type | ✅ | application/json |  |

### 🔹 Body or Form Data

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
|  |  |  |  |

# 📤 Response

### 🔹 HTTP 200 OK / 201 Created

|  |  |
| --- | --- |
|  |  |
|  |  |

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |

```json

```