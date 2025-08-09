import axios from 'axios';

// API 기본 설정
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

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

// 더미 데이터 (백엔드 연결 전 테스트용)
import { dummyData } from './api_dummy.js';

const createDummyApiService = (dummyData) => {
  const memorials = dummyData.memorials._embedded.memorials;

  return {
    getMemorials: () => Promise.resolve({ data: dummyData.memorials }),
    getMemorial: (id) => {
      const memorial = memorials.find(m => m.id === parseInt(id));
      return memorial ? Promise.resolve({ data: memorial }) : Promise.reject(new Error("Memorial not found"));
    },
    getMemorialDetails: (id) => {
       const memorial = memorials.find(m => m.id === parseInt(id));
       // 상세 조회는 사진, 영상, 댓글 등 모든 정보를 포함해야 함
       if (!memorial) return Promise.reject(new Error("Memorial not found"));
       
       const response = {
         memorialInfo: memorial,
         photos: dummyData.photos?.filter(p => p.memorialId === memorial.id) || [],
         videos: dummyData.videos?.filter(v => v.memorialId === memorial.id) || [],
         comments: dummyData.comments?.filter(c => c.memorialId === memorial.id) || [],
       };
       return Promise.resolve({ data: response });
    },
    uploadMemorialProfileImage: (id, formData) => {
      const memorial = memorials.find(m => m.id === parseInt(id));
      if (!memorial) return Promise.reject(new Error("Memorial not found"));
      // FormData에서 파일 정보를 직접 읽는 것은 복잡하므로, URL을 생성하는 것으로 대체
      memorial.imageUrl = 'https://via.placeholder.com/400x300';
      return Promise.resolve({ data: { memorialId: id, photoUrl: memorial.imageUrl } });
    },
    createTribute: (id, data) => {
        const memorial = memorials.find(m => m.id === parseInt(id));
        if (!memorial) return Promise.reject(new Error("Memorial not found"));
        memorial.eulogy = `[AI 생성 추모사] ${data.keywords.join(', ')}에 대한 추억...`;
        return Promise.resolve({ data: { memorialId: id, tribute: memorial.eulogy, tributeGeneratedAt: new Date().toISOString() } });
    },
    updateTribute: (id, data) => {
        const memorial = memorials.find(m => m.id === parseInt(id));
        if (!memorial) return Promise.reject(new Error("Memorial not found"));
        memorial.eulogy = data.tribute;
        return Promise.resolve({ data: { memorialId: id, tribute: memorial.eulogy, tributeGeneratedAt: new Date().toISOString() } });
    },
    deleteTribute: (id) => {
        const memorial = memorials.find(m => m.id === parseInt(id));
        if (!memorial) return Promise.reject(new Error("Memorial not found"));
        memorial.eulogy = null;
        return Promise.resolve({ data: { memorialId: id, tribute: null, tributeGeneratedAt: null } });
    },
    // ... 다른 API들에 대한 더미 구현 추가
  };
};


const realApiService = {
  // ===================================================================
  // 추모관 API (인증 불필요: 전체/단건/상세 조회, 인증 필요: 수정/삭제)
  // ===================================================================
  getMemorials: () => api.get('/memorials'),
  getMemorial: (id) => api.get(`/memorials/${id}`),
  getMemorialDetails: (id) => api.get(`/memorials/${id}/details`),
  uploadMemorialProfileImage: (id, formData) => api.patch(`/memorials/${id}/profile-image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' } // 인증 필요
  }),

  // ===================================================================
  // 추모사 API (인증 필요)
  // ===================================================================
  createTribute: (id, data) => api.post(`/memorials/${id}/tribute`, data),
  updateTribute: (id, data) => api.patch(`/memorials/${id}/tribute`, data),
  deleteTribute: (id) => api.delete(`/memorials/${id}/tribute`),

  // ===================================================================
  // 추모 사진 API (인증 필요: 업로드, 수정, 삭제)
  // ===================================================================
  uploadPhoto: (id, formData) => api.post(`/memorials/${id}/photos`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' } // 인증 필요
  }),
  getPhotosForMemorial: (id) => api.get(`/memorials/${id}/photos`), // 인증 불필요
  updatePhoto: (photoId, data) => api.patch(`/photos/${photoId}`, data), // 인증 필요
  deletePhoto: (photoId) => api.delete(`/photos/${photoId}`), // 인증 필요

  // ===================================================================
  // 추모 영상 API (인증 필요: 생성, 삭제 / !! 개발중 !!)
  // ===================================================================
  createVideo: (formData) => api.post('/videos', formData, { // !! 개발중 !!
    headers: { 'Content-Type': 'multipart/form-data' } // 인증 필요
  }),
  getVideo: (videoId) => api.get(`/videos/${videoId}`), // !! 개발중 !!, 인증 불필요
  deleteVideo: (videoId) => api.delete(`/videos/${videoId}`), // !! 개발중 !!, 인증 필요

  // ===================================================================
  // 추모 댓글 API (인증 필요: 수정, 삭제)
  // ===================================================================
  createComment: (id, data) => api.post(`/memorials/${id}/comments`, data), // 인증 불필요
  getComments: (id) => api.get(`/memorials/${id}/comments`), // 인증 불필요
  updateComment: (commentId, data) => api.patch(`/comments/${commentId}`, data), // 인증 필요
  deleteComment: (commentId) => api.delete(`/comments/${commentId}`), // 인증 필요

  // ===================================================================
  // 기타 API
  // ===================================================================
  getFuneralInfos: () => api.get('/funeralInfos'),
  getDashboardData: () => api.get('/dashboard'),
  getAnalyticsData: () => api.get('/analytics'),
  getUsers: () => api.get('/users'),
  createUser: (data) => api.post('/users', data),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export const apiService = process.env.REACT_APP_USE_DUMMY_DATA === 'true'
  ? createDummyApiService(dummyData)
  : realApiService;

export default api;
