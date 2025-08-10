import axios from 'axios';
import { mockMemorialService } from './memorialService'; // Menu4의 Mock 서비스를 가져옵니다.
import { mockLoginService } from './loginService';       // Lobby, Login 등 사용자 관련 Mock 서비스

// API 기본 설정
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8088';

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
    if (error.response?.status === 401) {
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
  getMemorialDetails: async (id) => (await api.get(`/memorials/${id}/details`)).data,
  uploadMemorialProfileImage: async (id, formData) => (await api.patch(`/memorials/${id}/profile-image`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data,
  
  createTribute: async (id, data) => (await api.post(`/memorials/${id}/tribute`, data)).data,
  updateTribute: async (id, data) => (await api.patch(`/memorials/${id}/tribute`, data)).data,
  deleteTribute: async (id) => (await api.delete(`/memorials/${id}/tribute`)).data,

  uploadPhoto: async (id, formData) => (await api.post(`/memorials/${id}/photos`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data,
  getPhotosForMemorial: async (id) => (await api.get(`/memorials/${id}/photos`)).data,
  updatePhoto: async (photoId, data) => (await api.patch(`/photos/${photoId}`, data)).data,
  deletePhoto: async (photoId) => (await api.delete(`/photos/${photoId}`)).data,

  createVideo: async (formData) => (await api.post('/videos', formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data,
  getVideo: async (videoId) => (await api.get(`/videos/${videoId}`)).data,
  deleteVideo: async (videoId) => (await api.delete(`/videos/${videoId}`)).data,

  createComment: async (id, data) => (await api.post(`/memorials/${id}/comments`, data)).data,
  getComments: async (id) => (await api.get(`/memorials/${id}/comments`)).data,
  updateComment: async (commentId, data) => (await api.patch(`/comments/${commentId}`, data)).data,
  deleteComment: async (commentId) => (await api.delete(`/comments/${commentId}`)).data,

  // Login/User-related Service
  // 참고: API 명세에 없어 추측하여 작성되었습니다. 실제 엔드포인트로 수정이 필요할 수 있습니다.
  getUserMemorialHalls: async (userId) => (await api.get(`/users/${userId}/memorials`)).data,
  getMemorialByCode: async (code) => (await api.get(`/memorials?code=${code}`)).data,

  // Other Services
  getFuneralInfos: async () => (await api.get('/funeralInfos')).data,
  getDashboardData: async () => (await api.get('/dashboard')).data,
  getAnalyticsData: async () => (await api.get('/analytics')).data,
  getUsers: async () => (await api.get('/users')).data,
  createUser: async (data) => (await api.post('/users', data)).data,
  updateUser: async (id, data) => (await api.put(`/users/${id}`, data)).data,
  deleteUser: async (id) => (await api.delete(`/users/${id}`)).data,
};

// --- 최종 서비스 객체 내보내기 ---
const useMock = process.env.REACT_APP_API_MOCKING === 'true';

// Mock 모드일 경우, 실제 API 서비스의 함수들 위에 Mock 서비스 함수들을 덮어씁니다.
const hybridService = { 
  ...realApiService, 
  ...mockMemorialService,
  ...mockLoginService
};

export const apiService = useMock ? hybridService : realApiService;

export default api;
