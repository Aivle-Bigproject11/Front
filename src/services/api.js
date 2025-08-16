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
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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

// --- 실제 API 서비스 정의 (Axios 응답에서 data를 추출하여 반환하도록 수정) ---
const realApiService = {
  // Memorial Service
  getMemorials: async () => (await api.get('/memorials')).data,
  getMemorial: async (id) => (await api.get(`/memorials/${id}`)).data,
  updateMemorial: async (id, data) => (await api.patch(`/memorials/${id}`, data)).data,
  getMemorialDetails: async (id) => (await api.get(`/memorials/${id}/detail`)).data, // API 명세에 맞게 수정
  uploadMemorialProfileImage: async (id, formData) => (await api.patch(`/memorials/${id}/profile-image`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data,
  
  createTribute: async (id, data) => {
    // AI 추모사 생성은 시간이 오래 걸릴 수 있으므로 타임아웃을 60초로 설정
    const config = { 
      timeout: 60000
    };
    return (await api.post(`/memorials/${id}/tribute`, data, config)).data;
  },
  updateTribute: async (id, data) => (await api.patch(`/memorials/${id}/tribute`, data)).data,
  deleteTribute: async (id) => (await api.delete(`/memorials/${id}/tribute`)).data,

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
    const config = { 
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000
    };
    return (await api.post(`/memorials/${memorialId}/videos`, formData, config)).data;
  },
  getVideo: async (videoId) => (await api.get(`/videos/${videoId}`)).data,
  deleteVideo: async (videoId) => (await api.delete(`/videos/${videoId}`)).data,

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
  USE_BACKEND_SEARCH: false, // 나중에 백엔드 API 구현 완료시 true로 변경
  
  // 백엔드 API 직접 검색 방식 (문서 명세대로)
  // 엔드포인트: /families/search-name, /families/search-email, /families/search-phone
  searchFamiliesByNameBackend: async (name) => (await api.get(`/families/search-name?name=${name}`)).data,
  searchFamiliesByEmailBackend: async (email) => (await api.get(`/families/search-email?email=${email}`)).data,
  searchFamiliesByPhoneBackend: async (phone) => (await api.get(`/families/search-phone?phone=${phone}`)).data,
  
  // 프론트엔드 필터링 방식 (현재 백엔드 상태에 맞춤 - 안정적)
  // 엔드포인트: /families 전체 조회 후 브라우저에서 필터링
  searchFamiliesByNameFrontend: async (name) => {
    const allFamilies = await (await api.get('/families')).data;
    if (allFamilies._embedded && allFamilies._embedded.families) {
      const filtered = allFamilies._embedded.families.filter(family => 
        family.name && family.name.toLowerCase().includes(name.toLowerCase())
      );
      return {
        ...allFamilies,
        _embedded: { families: filtered }
      };
    }
    return allFamilies;
  },
  searchFamiliesByEmailFrontend: async (email) => {
    const allFamilies = await (await api.get('/families')).data;
    if (allFamilies._embedded && allFamilies._embedded.families) {
      const filtered = allFamilies._embedded.families.filter(family => 
        family.email && family.email.toLowerCase().includes(email.toLowerCase())
      );
      return {
        ...allFamilies,
        _embedded: { families: filtered }
      };
    }
    return allFamilies;
  },
  searchFamiliesByPhoneFrontend: async (phone) => {
    const allFamilies = await (await api.get('/families')).data;
    if (allFamilies._embedded && allFamilies._embedded.families) {
      const filtered = allFamilies._embedded.families.filter(family => 
        family.phone && family.phone.includes(phone)
      );
      return {
        ...allFamilies,
        _embedded: { families: filtered }
      };
    }
    return allFamilies;
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
  getFamiliesByMemorialIdBackend: async (memorialId) => (await api.get(`/families/search/findByMemorialId?memorialId=${memorialId}`)).data,
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
  // 참고: API 명세에 없어 추측하여 작성되었습니다. 실제 엔드포인트로 수정이 필요할 수 있습니다.
  getUserMemorialHalls: async (userId) => (await api.get(`/users/${userId}/memorials`)).data,
  getMemorialByCode: async (code) => (await api.get(`/memorials?code=${code}`)).data,

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
  // Manager login
  loginManager: (credentials) => api.post('/managers/login', credentials, { headers: { 'X-Skip-Auth-Redirect': 'true' } }),


  // 사용자 관련 API
  createFamily: (data) => api.post('/families', data),
  getFamilyById: async (id) => (await api.get(`/families/${id}`)).data,
  updateFamilyPatch: async (id, data) => (await api.patch(`/families/${id}`, data)).data,
  // User login
  loginUser: (credentials) => api.post('/families/login', credentials, { headers: { 'X-Skip-Auth-Redirect': 'true' } }),

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
