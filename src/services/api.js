import axios from 'axios';
import { mockMemorialService } from './memorialService'; // Menu4의 Mock 서비스를 가져옵니다.
import { mockLoginService } from './loginService';       // Lobby, Login 등 사용자 관련 Mock 서비스

// API 기본 설정
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// 요청 인터셉터 - 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('🔗 API 요청:', config.method?.toUpperCase(), config.url);
    console.log('🔗 토큰 존재:', !!token);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('⚠️ 토큰이 없습니다. 인증이 필요한 API 호출에서 오류가 발생할 수 있습니다.');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the request was for login and if it has a custom header to skip redirect
    const originalRequest = error.config;
    if (error.response?.status === 401 && originalRequest.headers['X-Skip-Auth-Redirect'] !== 'true') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 지역명 매핑 함수 (백엔드 실제 DB 데이터에 맞춤)
const mapRegionName = (region) => {
  const regionMapping = {
    // 전체 선택 시 전국으로 매핑
    '전체': '전국',
    
    // 백엔드 실제 지역 데이터 기준 매핑
    '서울': '서울특별시',
    '부산': '부산광역시', 
    '대구': '대구광역시',
    '인천': '인천광역시',
    '광주': '광주광역시',
    '대전': '대전광역시',
    '울산': '울산광역시',
    '세종': '세종특별자치시',
    '경기': '경기도',
    '강원': '강원특별자치도',
    '충북': '충청북도',
    '충남': '충청남도',
    '전북': '전북특별자치도',
    '전남': '전라남도',
    '경북': '경상북도',
    '경남': '경상남도',
    '제주': '제주특별자치도',
    
    // 기존 UI에서 사용하는 축약형들도 지원
    '강원특별자치도': '강원특별자치도',
    '전북특별자치도': '전북특별자치도',
    '세종특별자치시': '세종특별자치시'
  };
  
  return regionMapping[region] || region;
};

// --- 실제 API 서비스 정의 (Axios 응답에서 data를 추출하여 반환하도록 수정) ---
const realApiService = {
  // Memorial Service
  getMemorials: async () => {
    const token = localStorage.getItem('token');
    const config = { headers: {} };
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return (await api.get('/memorials', config)).data;
  },
  getMemorial: async (id) => {
    const token = localStorage.getItem('token');
    const config = { headers: {} };
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return (await api.get(`/memorials/${id}`, config)).data;
  },
  updateMemorial: async (id, data) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return (await api.patch(`/memorials/${id}`, data, config)).data;
  },
  getMemorialDetails: async (id) => {
    try {
      // detail 엔드포인트로 사진과 댓글이 포함된 전체 정보 가져오기
      const token = localStorage.getItem('token');
      const config = { headers: {} };
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      const response = await api.get(`/memorials/${id}/detail`, config);
      return response.data;
    } catch (error) {
      console.error('getMemorialDetails 에러:', error);
      throw error;
    }
  },
  uploadMemorialProfileImage: async (id, formData) => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'multipart/form-data'
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return (await api.patch(`/memorials/${id}/profile-image`, formData, { headers })).data;
  },
  
  createTribute: async (id, data) => {
    // AI 추모사 생성은 시간이 오래 걸릴 수 있으므로 타임아웃을 60초로 설정
    const token = localStorage.getItem('token');
    const config = { 
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return (await api.post(`/memorials/${id}/tribute`, data, config)).data;
  },
  updateTribute: async (id, data) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return (await api.patch(`/memorials/${id}/tribute`, data, config)).data;
  },
  deleteTribute: async (id) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {}
    };
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return (await api.delete(`/memorials/${id}/tribute`, config)).data;
  },

  // 장례서류 관련 API
  getFuneralInfos: async () => (await api.get('/funeralInfos')).data,
  getObituaries: async () => (await api.get('/obituaries')).data,
  getDeathReports: async () => (await api.get('/deathReports')).data,
  getSchedules: async () => (await api.get('/schedules')).data,
  createObituary: (funeralInfoId) => api.put(`/funeralInfos/${funeralInfoId}/createobituary`),
  createDeathReport: (funeralInfoId) => api.put(`/funeralInfos/${funeralInfoId}/createdeathreport`),
  createSchedule: (funeralInfoId) => api.put(`/funeralInfos/${funeralInfoId}/createschedule`),
  updateFuneralInfo: async (funeralInfoId, data) => (await api.put(`/funeralInfos/${funeralInfoId}/updatefuneralinfo`, data)).data,
  getObituaryByCustomerId: (customerId) => api.get(`/obituaries/search/findFirstByCustomerIdOrderByObituaryIdDesc?customerId=${customerId}`),
  getDeathReportByCustomerId: (customerId) => api.get(`/deathReports/search/findFirstByCustomerIdOrderByDeathReportIdDesc?customerId=${customerId}`),
  getScheduleByCustomerId: (customerId) => api.get(`/schedules/search/findFirstByCustomerIdOrderByScheduleIdDesc?customerId=${customerId}`),
  checkExistingFuneralInfo: (customerId) => api.get(`/funeralInfos/search/findFirstByCustomerIdOrderByFuneralInfoIdDesc?customerId=${customerId}`),

  // 고객 관련 API
  getCustomers: () => api.get('/customerProfiles'),

  // 장례 정보 생성
  createFuneralInfo: (data) => api.post('/funeralInfos', data),

  // 장례 서류 검토 요청
  validateFuneralInfo: (data) => api.post('/funeralInfos/validate-fields', data),
//   validateFuneralInfo: (data) => api.get('/validationWarnings'),

  // 장례 정보 수정
  updateFuneralInfo: (id, data) => api.put(`/funeralInfos/${id}/updatefuneralinfo`, data),
  uploadPhoto: async (id, formData) => (await api.post(`/memorials/${id}/photos`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data,
  getPhotosForMemorial: async (id) => (await api.get(`/memorials/${id}/photos`)).data,
  updatePhoto: async (photoId, data) => (await api.patch(`/photos/${photoId}`, data)).data,
  deletePhoto: async (photoId) => (await api.delete(`/photos/${photoId}`)).data,

  createVideo: async (memorialId, formData) => {
    // 영상 생성은 시간이 오래 걸릴 수 있으므로 타임아웃을 30초로 설정
    const token = localStorage.getItem('token');
    const config = { 
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000
    };
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return (await api.post(`/memorials/${memorialId}/videos`, formData, config)).data;
  },
  getVideo: async (videoId) => {
    const token = localStorage.getItem('token');
    const config = { headers: {} };
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return (await api.get(`/videos/${videoId}`, config)).data;
  },
  deleteVideo: async (videoId) => {
    const token = localStorage.getItem('token');
    const config = { headers: {} };
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return (await api.delete(`/videos/${videoId}`, config)).data;
  },

  createComment: async (id, data) => (await api.post(`/memorials/${id}/comments`, data)).data,
  getComments: async (id) => (await api.get(`/memorials/${id}/comments`)).data,
  updateComment: async (commentId, data) => (await api.patch(`/comments/${commentId}`, data)).data,
  deleteComment: async (commentId) => (await api.delete(`/comments/${commentId}`)).data,

  // 유가족 관리 Service
  getFamilies: async () => (await api.get('/families')).data,
  getFamily: async (id) => (await api.get(`/families/${id}`)).data,
  createFamily: async (data) => (await api.post('/families', data)).data,
  approveFamily: async (familyId, data) => (await api.post(`/families/${familyId}/approve`, data)).data,
  deleteFamily: async (id) => (await api.delete(`/families/${id}`)).data,
  
  // 유가족 검색 관련 API
  // 검색 방식 선택: true = 백엔드 API 직접 검색, false = 프론트엔드 필터링
  USE_BACKEND_SEARCH: true, // 백엔드 API가 올바른 경로로 구현되어 기본값을 true로 변경
  
  // 백엔드 API 직접 검색 방식 (실제 Spring Data REST 메서드 사용)
  // 엔드포인트: /families/search/findByNameContaining, /families/search/findByEmail, /families/search/findByPhoneContaining
  searchFamiliesByNameBackend: async (name) => (await api.get(`/families/search/findByNameContaining?name=${name}`)).data,
  searchFamiliesByEmailBackend: async (email) => (await api.get(`/families/search/findByEmail?email=${email}`)).data,
  searchFamiliesByPhoneBackend: async (phone) => (await api.get(`/families/search/findByPhoneContaining?phone=${phone}`)).data,
  
  // 프론트엔드 필터링 방식 (현재 백엔드 상태에 맞춤 - 안정적)
  // 엔드포인트: /families 전체 조회 후 브라우저에서 필터링
  searchFamiliesByNameFrontend: async (name) => {
    const allFamilies = await (await api.get('/families')).data;
    if (allFamilies._embedded && allFamilies._embedded.families) {
      const filtered = allFamilies._embedded.families.filter(family => 
        family.name && family.name.toLowerCase().includes(name.toLowerCase())
      );
      // 백엔드 응답 형식에 맞게 반환 (List 형태)
      return filtered;
    }
    return [];
  },
  searchFamiliesByEmailFrontend: async (email) => {
    const allFamilies = await (await api.get('/families')).data;
    if (allFamilies._embedded && allFamilies._embedded.families) {
      const filtered = allFamilies._embedded.families.filter(family => 
        family.email && family.email.toLowerCase().includes(email.toLowerCase())
      );
      // 백엔드는 Optional<Family>를 반환하므로 첫 번째 결과만 반환
      return filtered.length > 0 ? filtered[0] : null;
    }
    return null;
  },
  searchFamiliesByPhoneFrontend: async (phone) => {
    const allFamilies = await (await api.get('/families')).data;
    if (allFamilies._embedded && allFamilies._embedded.families) {
      const filtered = allFamilies._embedded.families.filter(family => 
        family.phone && family.phone.includes(phone)
      );
      // 백엔드 응답 형식에 맞게 반환 (List 형태)
      return filtered;
    }
    return [];
  },
  
  // 통합 검색 함수들 (설정에 따라 백엔드 API vs 프론트엔드 필터링 자동 선택)
  searchFamiliesByName: async function(name) {
    return this.USE_BACKEND_SEARCH ? 
      this.searchFamiliesByNameBackend(name) : 
      this.searchFamiliesByNameFrontend(name);
  },
  searchFamiliesByEmail: async function(email) {
    return this.USE_BACKEND_SEARCH ? 
      this.searchFamiliesByEmailBackend(email) : 
      this.searchFamiliesByEmailFrontend(email);
  },
  searchFamiliesByPhone: async function(phone) {
    return this.USE_BACKEND_SEARCH ? 
      this.searchFamiliesByPhoneBackend(phone) : 
      this.searchFamiliesByPhoneFrontend(phone);
  },
  
  // 추모관 ID로 유가족 조회 - 백엔드/프론트엔드 방식 모두 지원
  getFamiliesByMemorialIdBackend: async (memorialId) => {
    // UUID 형식 검증
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(memorialId)) {
      console.warn(`⚠️ 잘못된 UUID 형식: ${memorialId}`);
      throw new Error(`Invalid UUID format: ${memorialId}`);
    }
    return (await api.get(`/families/search/findByMemorialId?memorialId=${memorialId}`)).data;
  },
  getFamiliesByMemorialIdFrontend: async (memorialId) => {
    const allFamilies = await (await api.get('/families')).data;
    if (allFamilies._embedded && allFamilies._embedded.families) {
      const filtered = allFamilies._embedded.families.filter(family => 
        family.memorialId === memorialId
      );
      return {
        ...allFamilies,
        _embedded: { families: filtered }
      };
    }
    return allFamilies;
  },
  getFamiliesByMemorialId: async function(memorialId) {
    return this.USE_BACKEND_SEARCH ? 
      this.getFamiliesByMemorialIdBackend(memorialId) : 
      this.getFamiliesByMemorialIdFrontend(memorialId);
  },
  updateFamilyMemorialId: async (familyId, memorialId) => (await api.patch(`/families/${familyId}`, { memorialId })).data,

  // Login/User-related Service
  // 고유번호(memorialId)로 추모관 직접 접근
  getMemorialById: async (memorialId) => (await api.get(`/memorials/${memorialId}`)).data,

  // Other Services
  getDashboardData: async () => (await api.get('/dashboard')).data,
  getAnalyticsData: async () => (await api.get('/analytics')).data,
  getUsers: async () => (await api.get('/users')).data,
  createUser: async (data) => (await api.post('/users', data)).data,
  getUserById: async (id) => (await api.get(`/users/${id}`)).data, 
  updateUser: async (id, data) => (await api.put(`/users/${id}`, data)).data,
  updateUserPatch: async (id, data) => (await api.patch(`/users/${id}`, data)).data,
  deleteUser: async (id) => (await api.delete(`/users/${id}`)).data,


  // 직원 관련 API
  createManager: (data) => api.post('/managers', data),
  getManagerById: async (id) => (await api.get(`/managers/${id}`)).data, 
  updateManagerPatch: async (id, managerData) => (await api.patch(`/managers/${id}`, managerData)).data,
  checkManagerId: async (loginId) => (await api.get(`/managers/check/id?loginId=${loginId}`)).data,
  findManagerId: async (name, email) => (await api.get(`/managers/find-id?name=${name}&email=${email}`)).data,
  // Manager login
  loginManager: async (credentials) => (await api.post('/managers/login', credentials, { headers: { 'X-Skip-Auth-Redirect': 'true' } })).data,


  // 사용자 관련 API
  createFamily: (data) => api.post('/families', data),
  getFamilyById: async (id) => (await api.get(`/families/${id}`)).data,
  updateFamilyPatch: async (id, data) => (await api.patch(`/families/${id}`, data)).data,
  checkFamilyId: async (loginId) => (await api.get(`/families/check/id?loginId=${loginId}`)).data,
  findFamilyId: async (name, email) => (await api.get(`/families/find-id?name=${name}&email=${email}`)).data,
  // User login
  loginUser: async (credentials) => (await api.post('/families/login', credentials, { headers: { 'X-Skip-Auth-Redirect': 'true' } })).data,

  // 직원 비밀번호 변경
  changeEmployeePassword: async (loginId, newPassword) => {
    // 1. loginId로 직원 정보를 GET 요청하여 id 값을 얻습니다.
    const searchResponse = await api.get(`/managers/search/loginId?loginId=${loginId}`);
    const manager = searchResponse.data;

    if (!manager || !manager.id) {
      throw new Error('해당 아이디를 가진 직원을 찾을 수 없습니다.');
    }
    const managerId = manager.id;

    // 2. 얻어온 id를 사용하여 비밀번호를 PATCH 요청으로 업데이트합니다.
    return await api.patch(`/managers/${managerId}`, {
      loginPassword: newPassword,
    });
  },

  // 사용자 비밀번호 변경
  changeUserPassword: async (loginId, newPassword) => {
    // 1. loginId로 사용자 정보를 GET 요청하여 id 값을 얻습니다.
    const searchResponse = await api.get(`/families/search/loginId?loginId=${loginId}`);
    const user = searchResponse.data;

    if (!user || !user.id) {
      throw new Error('해당 아이디를 가진 사용자를 찾을 수 없습니다.');
    }
    const userId = user.id;

    // 2. 얻어온 id를 사용하여 비밀번호를 PATCH 요청으로 업데이트합니다.
    return await api.patch(`/families/${userId}`, {
      loginPassword: newPassword,
    });
  },

 // Password verification
  verifyPassword: async (loginId, password, userType) => {
    try {
      const credentials = { loginId, loginPassword: password }; // Use loginPassword for the key
      let response;
      if (userType === 'employee') {
        response = await api.post('/managers/login', credentials, { headers: { 'X-Skip-Auth-Redirect': 'true' } });
      } else if (userType === 'user') {
        response = await api.post('/families/login', credentials, { headers: { 'X-Skip-Auth-Redirect': 'true' } });
      } else {
        // Handle unexpected userType or throw an error
        console.error("Unknown userType for password verification:", userType);
        return false;
      }
      // If the login endpoint returns 200 OK, it means the password is correct
      return true;
    } catch (error) {
      // If the login endpoint returns an error (e.g., 401), it means the password is incorrect
      console.error("Password verification failed using login endpoint:", error);
      return false;
    }
  },

  // Dashboard API - 백엔드 실제 엔드포인트에 맞게 수정
  getDashboardByDate: async (date) => {
    // 백엔드: GET /deathPredictions/by-date/{date}
    console.log(`🔗 API 호출: GET /deathPredictions/by-date/${date}`);
    try {
      const response = await api.get(`/deathPredictions/by-date/${date}`);
      console.log(`✅ API 응답 성공 (${date}):`, response.data);
      console.log(`   응답 타입: ${typeof response.data}, 배열 여부: ${Array.isArray(response.data)}, 길이: ${Array.isArray(response.data) ? response.data.length : 'N/A'}`);
      if (Array.isArray(response.data) && response.data.length > 0) {
        console.log(`   첫 번째 항목:`, response.data[0]);
        console.log(`   마지막 항목:`, response.data[response.data.length - 1]);
      }
      return response.data;
    } catch (error) {
      console.error(`❌ API 호출 실패 (${date}):`, error.response?.status, error.response?.data || error.message);
      throw error;
    }
  },
  getDashboardByRegion: async (region) => {
    // 백엔드: GET /deathPredictions/by-region/{region}
    const mappedRegion = mapRegionName(region);
    console.log(`🔗 API 호출: GET /deathPredictions/by-region/${mappedRegion} (원본: ${region})`);
    try {
      const response = await api.get(`/deathPredictions/by-region/${encodeURIComponent(mappedRegion)}`);
      console.log(`✅ API 응답 성공 (${mappedRegion}):`, response.data);
      console.log(`   응답 타입: ${typeof response.data}, 배열 여부: ${Array.isArray(response.data)}, 길이: ${Array.isArray(response.data) ? response.data.length : 'N/A'}`);
      return response.data;
    } catch (error) {
      console.error(`❌ API 호출 실패 (${mappedRegion}):`, error.response?.status, error.response?.data || error.message);
      throw error;
    }
  },
  getDeathPrediction: async (date, region) => {
    // 백엔드: GET /deathPredictions/{date}/{region}
    console.log(`🔗 API 호출: GET /deathPredictions/${date}/${region}`);
    try {
      const response = await api.get(`/deathPredictions/${date}/${region}`);
      console.log(`✅ API 응답 성공 (${date}/${region}):`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ API 호출 실패 (${date}/${region}):`, error.response?.status, error.response?.data || error.message);
      throw error;
    }
  },
  requestPrediction: async (data) => {
    // 백엔드: POST /deathPredictions/request-prediction
    const mappedData = {
      ...data,
      region: mapRegionName(data.region)
    };
    console.log('🔗 API 호출: POST /deathPredictions/request-prediction', mappedData);
    return (await api.post('/deathPredictions/request-prediction', mappedData)).data;
  },
  // 기존 API들은 다른 서비스용이므로 유지
  getPredictCheck: async () => (await api.get('/predict-check')).data,
  updatePredictionRequest: async (data) => (await api.put('/predict-request-update', data)).data,
  getPredictResponse: async () => (await api.get('/predict-response')).data,
  updatePredictResponse: async (data) => (await api.put('/predict-response-update', data)).data,
}

// --- 최종 서비스 객체 내보내기 ---
const useMock = process.env.REACT_APP_API_MOCKING === 'true';

// Mock 모드일 경우, 실제 API 서비스의 함수들 위에 Mock 서비스 함수들을 덮어씁니다.
const hybridService = { 
  ...realApiService, 
  ...mockMemorialService,
  ...mockLoginService
};

export const recommendationService = {
  // 1. 전체 고객 목록 조회
  getAllCustomers: () => api.get('/customer-infos'),

  // 2. 메시지 미리보기 생성 
  generatePreviewMessage: (data) => api.post('/recommendMessages/preview-message', data),

  // 3. 특정 고객(개인)에게 생성된 메시지 전송 ->아마 사용 x:4번만으로 가능
  //sendPreviewMessageToCustomer: (data) => api.post('/recommendMessages/save-preview', data),

  // 4. 필터링된 그룹에게 생성된 메시지 전송
  sendGroupMessage: (data) => api.post('/recommendMessages/generate-group-message', data),

  // 5. 전송된 모든 추천 메시지 확인 ->전체 발송내역확인 화면 없어 아마 사용 x:6번만으로 가능
  //getAllSentMessages: () => api.get('/recommendMessages'),

  // 6. 특정 고객에게 보낸 추천 메시지 확인 (발송 기록)->현재 가장 마지막 메시지 1개만 보여줌 :7번만 사용 효율
  //getCustomerHistory: (customerId) => api.get(`/recommendMessages/customer/${customerId}`),

  // 7. 특정 고객에게 보낸 가장 최신의 추천 메시지 확인(발송기록)
  getLatestCustomerHistory: (customerId) => api.get(`/recommendMessages/customer/${customerId}/latest`),

  // 8. 필터링된 고객들 목록 보기 
  getFilteredCustomers: (filters) => api.get('/customer-infos/filter', { params: filters }),
};

export const apiService = useMock ? hybridService : realApiService;

export default api;
