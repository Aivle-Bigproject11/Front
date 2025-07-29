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

export const apiService = {
  // 추모관 관련 API
  getMemorials: () => api.get('/memorials'),
  getMemorial: (id) => api.get(`/memorials/${id}`),
  createMemorial: (data) => api.post('/memorials', data),
  updateMemorial: (id, data) => api.put(`/memorials/${id}`, data),
  deleteMemorial: (id) => api.delete(`/memorials/${id}`),

  // 대시보드 데이터
  getDashboardData: () => api.get('/dashboard'),

  // 분석 데이터
  getAnalyticsData: () => api.get('/analytics'),

  // 사용자 관리 (기존 기능 유지)
  getUsers: () => api.get('/users'),
  createUser: (data) => api.post('/users', data),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// 더미 데이터 (백엔드 연결 전 테스트용)
export const dummyData = {
  memorials: {
    _embedded: {
      memorials: [
        {
          id: 1,
          name: "민서",
          age: 25,
          birthOfDate: "1998-03-15",
          deceasedDate: "2023-12-01",
          gender: "FEMALE",
          imageUrl: "/images/memorial1.jpg",
          customerId: 1001,
          _links: {
            memorial: { href: "http://localhost:8080/memorials/1" },
            self: { href: "http://localhost:8080/memorials/1" }
          }
        },
        {
          id: 2,
          name: "준호",
          age: 32,
          birthOfDate: "1991-08-22",
          deceasedDate: "2024-01-15",
          gender: "MALE",
          imageUrl: "/images/memorial2.jpg",
          customerId: 1002,
          _links: {
            memorial: { href: "http://localhost:8080/memorials/2" },
            self: { href: "http://localhost:8080/memorials/2" }
          }
        }
      ]
    },
    _links: {
      profile: { href: "http://localhost:8080/profile/memorials" },
      self: { href: "http://localhost:8080/memorials" }
    },
    page: {
      number: 0,
      size: 20,
      totalElements: 2,
      totalPages: 1
    }
  },

  dashboard: {
    totalMemorials: 150,
    activeMemorials: 120,
    systemUptime: 89,
    notifications: 12,
    recentActivities: [
      { time: "10:30", user: "홍길동", action: "추모관 생성", status: "성공" },
      { time: "10:25", user: "김철수", action: "방명록 작성", status: "완료" },
      { time: "10:20", user: "이영희", action: "추모영상 업로드", status: "진행중" },
      { time: "10:15", user: "박민수", action: "추모사 작성", status: "완료" }
    ]
  },

  analytics: {
    monthlyMemorials: [65, 78, 90, 81, 56, 75],
    memorialsByGender: { male: 80, female: 70 },
    dailyVisits: [120, 190, 300, 500, 200, 300, 150]
  }
};

export default api;
