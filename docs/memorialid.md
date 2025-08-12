# Memorial ID 전달 방안 문서

## 📋 개요

로그인 관리팀에서 요청한 "고인 등록 후 자동 생성된 Memorial ID를 로그인 관리 시스템으로 전달하는 방안"에 대한 분석 및 구현 가능성을 검토합니다.

---

## 🔍 현재 구조 분석

### 1. Memorial 생성 프로세스
```
고인 등록 → 추모관 자동 생성 → Memorial ID (UUID) 생성
```

### 2. Memorial ID 특성
- **형식**: UUID (예: `20da177a-b465-4559-9905-b1235b00bca5`)
- **생성 위치**: 백엔드 서버
- **사용 범위**: 추모관 접근, 콘텐츠 관리, 권한 제어

### 3. 현재 구현된 Memorial API 구조
- **Memorial 전체 조회**: `/memorials` (GET) - ✅ 구현 완료
- **Memorial 단건 조회**: `/memorials/{memorialId}` (GET) - ✅ 구현 완료
- **Memorial 상세 조회**: `/memorials/{memorialId}/detail` (GET) - ✅ 구현 완료

---

## 🚀 구현 방안

### 방안 1: Memorial 전체 조회 API 활용

#### 구현 방법
현재 구현된 `/memorials` API를 통해 모든 추모관 정보를 조회하고, customerId로 필터링하여 특정 고객의 Memorial ID를 찾는 방식입니다.

```javascript
// Memorial 전체 조회 API 응답 예시
GET /memorials
Response: {
  "_embedded": {
    "memorials": [
      {
        "customerId": 1004,
        "name": "최지은",
        "age": 90,
        "createdAt": "2025-08-08T16:45:54.568149",
        "_links": {
          "memorial": {
            "href": "http://localhost:8085/memorials/20da177a-b465-4559-9905-b1235b00bca5"
          }
        }
      }
    ]
  }
}

// Memorial ID 추출 방법
const memorialId = memorial._links.memorial.href.split('/').pop();
// 결과: "20da177a-b465-4559-9905-b1235b00bca5"
```

#### Frontend 구현 코드
```javascript
// src/services/api.js 확장
getMemorialByCustomerId: async (customerId) => {
  const response = await api.get('/memorials');
  const memorials = response.data._embedded.memorials;
  
  // customerId로 필터링
  const customerMemorial = memorials.find(m => m.customerId === customerId);
  
  if (customerMemorial) {
    // Memorial ID 추출
    const memorialId = customerMemorial._links.memorial.href.split('/').pop();
    return {
      memorialId: memorialId,
      customerId: customerMemorial.customerId,
      name: customerMemorial.name,
      createdAt: customerMemorial.createdAt
    };
  }
  
  return null;
}
```

### 방안 2: Backend에서 customerId 기반 조회 API 추가

#### 새로운 API 엔드포인트 추가 (백엔드 개발 필요)
```javascript
// 제안하는 새 API
GET /memorials?customerId={customerId}
Response: {
  "_embedded": {
    "memorials": [
      {
        "memorialId": "20da177a-b465-4559-9905-b1235b00bca5",
        "customerId": 1004,
        "name": "최지은",
        "status": "active",
        "createdAt": "2025-08-08T16:45:54.568149"
      }
    ]
  }
}
```

### 방안 3: Memorial 생성 시 Callback 방식 (미래 구현)

#### 구현 방법
Memorial이 생성될 때 자동으로 로그인 관리 시스템에 알림을 보내는 방식입니다. 이는 Memorial 생성 API가 구현되어야 가능합니다.

```javascript
// Memorial 생성 시 로그인 관리 시스템으로 알림
POST /auth/memorial-created (로그인 관리팀 API)
Body: {
  "customerId": 1004,
  "memorialId": "20da177a-b465-4559-9905-b1235b00bca5",
  "createdAt": "2025-08-08T16:45:54.568149"
}
```

---

## 📊 구현 우선순위 및 복잡도

| 방안 | 구현 복잡도 | 개발 시간 | 의존성 | 추천도 |
|------|-------------|-----------|--------|--------|
| 방안 1 (전체 조회 + 필터링) | ⭐ 낮음 | 1일 | 없음 | ⭐⭐⭐⭐⭐ |
| 방안 2 (새 API 추가) | ⭐⭐ 중간 | 2-3일 | 백엔드 개발 | ⭐⭐⭐⭐ |
| 방안 3 (Callback 방식) | ⭐⭐⭐ 높음 | 3-5일 | Memorial 생성 API + 로그인팀 API | ⭐⭐⭐ |

---

## 💡 권장 솔루션

### 🥇 1단계: 전체 조회 API 활용 (즉시 구현)

**로그인 관리팀에서 사용할 수 있는 현재 API:**

```javascript
// Frontend에서 제공하는 API 호출 방법
import { apiService } from './api.js';

// 모든 추모관을 조회한 후 customerId로 필터링
const getMemorialByCustomerId = async (customerId) => {
  const response = await apiService.getMemorials();
  const memorials = response._embedded.memorials;
  const memorial = memorials.find(m => m.customerId === customerId);
  
  if (memorial) {
    const memorialId = memorial._links.memorial.href.split('/').pop();
    return { memorialId, customerId, name: memorial.name };
  }
  return null;
};
```

### 🥈 2단계: Backend API 확장 (중기 계획)

customerId 파라미터를 지원하는 전용 엔드포인트 추가:
```javascript
GET /memorials?customerId={customerId}
```

### 🥉 3단계: Callback 방식 구현 (장기 계획)

Memorial 생성 시 자동으로 로그인 관리 시스템에 알림을 보내는 방식으로 업그레이드.

---

## 🔧 즉시 구현 가능한 코드

### 1. API 서비스 확장
```javascript
// src/services/api.js에 추가
export const memorialIntegrationService = {
  // 고객 ID로 추모관 조회 (현재 API 활용)
  getMemorialByCustomerId: async (customerId) => {
    const response = await apiService.getMemorials();
    const memorials = response._embedded.memorials;
    
    const memorial = memorials.find(m => m.customerId === customerId);
    if (memorial) {
      const memorialId = memorial._links.memorial.href.split('/').pop();
      return {
        memorialId: memorialId,
        customerId: memorial.customerId,
        name: memorial.name,
        age: memorial.age,
        createdAt: memorial.createdAt
      };
    }
    return null;
  },
  
  // 고객 ID 배열로 여러 추모관 조회
  getMemorialsByCustomerIds: async (customerIds) => {
    const response = await apiService.getMemorials();
    const memorials = response._embedded.memorials;
    
    return customerIds.map(customerId => {
      const memorial = memorials.find(m => m.customerId === customerId);
      if (memorial) {
        const memorialId = memorial._links.memorial.href.split('/').pop();
        return {
          memorialId: memorialId,
          customerId: memorial.customerId,
          name: memorial.name,
          age: memorial.age,
          createdAt: memorial.createdAt
        };
      }
      return { customerId, memorialId: null, error: 'Memorial not found' };
    });
  }
};
```

### 2. 통합 Hook 제공
```javascript
// src/hooks/useMemorialIntegration.js (새 파일)
import { useState, useCallback } from 'react';
import { memorialIntegrationService } from '../services/api';

export const useMemorialIntegration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getMemorialByCustomerId = useCallback(async (customerId) => {
    setLoading(true);
    setError(null);
    
    try {
      const memorial = await memorialIntegrationService.getMemorialByCustomerId(customerId);
      return memorial;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMultipleMemorials = useCallback(async (customerIds) => {
    setLoading(true);
    setError(null);
    
    try {
      const memorials = await memorialIntegrationService.getMemorialsByCustomerIds(customerIds);
      return memorials;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getMemorialByCustomerId,
    getMultipleMemorials,
    loading,
    error
  };
};
```

---

## 🔗 로그인 관리팀 연동 가이드

### 필요한 정보 교환

1. **로그인 관리팀에서 Frontend팀으로 요청할 때**
   - 조회할 고객 ID (customerId)
   - 필요한 Memorial 정보 (ID, 이름, 생성일 등)

2. **Frontend팀에서 로그인 관리팀으로 제공할 수 있는 정보**
   - Memorial ID (UUID 형식)
   - 고객 ID (customerId)
   - 고인 이름
   - 추모관 생성일시
   - 추모관 상태 정보

### 현재 사용 가능한 API 호출 방법

```javascript
// 1. 특정 고객의 Memorial ID 조회
const memorial = await memorialIntegrationService.getMemorialByCustomerId(1004);
// 결과: { memorialId: "20da177a-b465-4559-9905-b1235b00bca5", customerId: 1004, name: "최지은" }

// 2. 여러 고객의 Memorial ID 일괄 조회
const memorials = await memorialIntegrationService.getMemorialsByCustomerIds([1004, 1005, 1006]);
// 결과: [{ memorialId: "...", customerId: 1004 }, { memorialId: "...", customerId: 1005 }, ...]

// 3. Memorial 상세 정보 조회
const details = await apiService.getMemorialDetails(memorialId);
```

### 데이터 형식 예시
```json
{
  "customerId": 1004,
  "memorialId": "20da177a-b465-4559-9905-b1235b00bca5",
  "name": "최지은",
  "age": 90,
  "createdAt": "2025-08-08T16:45:54.568149",
  "directUrl": "http://localhost:3000/memorial/20da177a-b465-4559-9905-b1235b00bca5"
}
```

---

## 📈 결론 및 제안

### ✅ 구현 가능성: **높음**

1. **즉시 구현 가능**: 현재 구현된 `/memorials` API를 활용한 방법 (권장)
2. **단계적 개선**: customerId 파라미터 지원 API 추가
3. **유지보수성**: 기존 코드베이스와 높은 호환성

### 🎯 다음 단계

1. **로그인 관리팀과 협의**: 필요한 데이터 형식 및 호출 방식 확정
2. **POC 개발**: 전체 조회 API를 활용한 프로토타입 구현 (1일 소요)
3. **테스트**: customerId → Memorial ID 조회 테스트
4. **배포**: 단계적 rollout 및 모니터링

### ⚠️ 주의사항

1. **성능 고려**: 전체 조회 후 필터링 방식은 데이터가 많아질 경우 비효율적
2. **API 확장 필요**: 장기적으로는 `GET /memorials?customerId={customerId}` API 추가 권장
3. **에러 처리**: Memorial이 존재하지 않는 고객 ID에 대한 예외 처리 필요

### 📞 문의 사항
기술적 세부사항이나 구현 관련 문의는 Frontend팀으로 연락 바랍니다.

---
*문서 작성일: 2025-08-12*
*작성자: Frontend 개발팀*
*버전: 1.0*
