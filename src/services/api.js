import axios from 'axios';

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

  // 장례서류 관련 API
  getFuneralInfos: () => api.get('/funeralInfos'),
  getObituaries: () => api.get('/obituaries'),
  getDeathReports: () => api.get('/deathReports'),
  getSchedules: () => api.get('/schedules'),
  createObituary: (funeralInfoId) => api.put(`/funeralInfos/${funeralInfoId}/createobituary`),
  createDeathReport: (funeralInfoId) => api.put(`/funeralInfos/${funeralInfoId}/createdeathreport`),
  createSchedule: (funeralInfoId) => api.put(`/funeralInfos/${funeralInfoId}/createschedule`),
  getObituaryByCustomerId: (customerId) => api.get(`/obituaries/search/findFirstByCustomerIdOrderByObituaryIdDesc?customerId=${customerId}`),
  getDeathReportByCustomerId: (customerId) => api.get(`/deathReports/search/findFirstByCustomerIdOrderByDeathReportIdDesc?customerId=${customerId}`),
  getScheduleByCustomerId: (customerId) => api.get(`/schedules/search/findFirstByCustomerIdOrderByScheduleIdDesc?customerId=${customerId}`),
//   getObituaryByCustomerId: () => api.get('/obituaries-detail'),
//   getDeathReportByCustomerId: () => api.get('/deathReports-detail'),
//   getScheduleByCustomerId: () => api.get('/schedules-detail'),

  // 고객 관련 API
  getCustomers: () => api.get('/customerProfiles'),

  // 장례 정보 생성
  createFuneralInfo: (data) => api.post('/funeralInfos', data),

  // 장례 서류 검토 요청
  validateFuneralInfo: (data) => api.post('/funeralInfos/validate-fields', data),
//   validateFuneralInfo: (data) => api.get('/validationWarnings'),

  // 장례 정보 수정
  updateFuneralInfo: (id, data) => api.put(`/funeralInfos/${id}/updatefuneralinfo`, data),


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
          imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop&crop=face",
          customerId: 1001,
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          eulogy: '민서님, 당신과 함께한 모든 순간이 소중했습니다. 하늘에서 편안히 쉬세요.',
          photos: [
            { id: 1, url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop&crop=face", title: "프로필 사진", description: "고인의 아름다운 미소" },
          ],
          _links: {
            memorial: { href: "http://localhost:8080/memorials/1" },
            self: { href: "http://localhost:8080/memorials/1" }
          }
        },
        {
          id: 2,
          name: "현종",
          age: 32,
          birthOfDate: "1991-08-22",
          deceasedDate: "2024-01-15",
          gender: "MALE",
          imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face",
          customerId: 1002,
          photos: [],
          _links: {
            memorial: { href: "http://localhost:8080/memorials/2" },
            self: { href: "http://localhost:8080/memorials/2" }
          }
        },
        {
          id: 3,
          name: "도형",
          age: 28,
          birthOfDate: "1995-11-08",
          deceasedDate: "2024-02-20",
          gender: "MALE",
          imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop&crop=face",
          customerId: 1003,
          photos: [],
          _links: {
            memorial: { href: "http://localhost:8080/memorials/3" },
            self: { href: "http://localhost:8080/memorials/3" }
          }
        },
        {
          id: 4,
          name: "시훈",
          age: 30,
          birthOfDate: "1993-07-12",
          deceasedDate: "2024-03-10",
          gender: "MALE",
          imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=300&fit=crop&crop=face",
          customerId: 1004,
          photos: [],
          _links: {
            memorial: { href: "http://localhost:8080/memorials/4" },
            self: { href: "http://localhost:8080/memorials/4" }
          }
        },
        {
          id: 5,
          name: "수연",
          age: 27,
          birthOfDate: "1996-04-18",
          deceasedDate: "2024-01-25",
          gender: "FEMALE",
          imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b17c?w=400&h=300&fit=crop&crop=face",
          customerId: 1005,
          photos: [],
          _links: {
            memorial: { href: "http://localhost:8080/memorials/5" },
            self: { href: "http://localhost:8080/memorials/5" }
          }
        },
        {
          id: 6,
          name: "성현",
          age: 31,
          birthOfDate: "1992-09-03",
          deceasedDate: "2024-02-14",
          gender: "MALE",
          imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=300&fit=crop&crop=face",
          customerId: 1006,
          photos: [],
          _links: {
            memorial: { href: "http://localhost:8080/memorials/6" },
            self: { href: "http://localhost:8080/memorials/6" }
          }
        },
        {
          id: 7,
          name: "근우",
          age: 29,
          birthOfDate: "1994-12-25",
          deceasedDate: "2024-03-05",
          gender: "MALE",
          imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=300&fit=crop&crop=face",
          customerId: 1007,
          photos: [],
          _links: {
            memorial: { href: "http://localhost:8080/memorials/7" },
            self: { href: "http://localhost:8080/memorials/7" }
          }
        },
        {
          id: 8,
          name: "헌준",
          age: 26,
          birthOfDate: "1997-05-14",
          deceasedDate: "2024-04-12",
          gender: "MALE",
          imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=300&fit=crop&crop=face",
          customerId: 1008,
          photos: [],
          _links: {
            memorial: { href: "http://localhost:8080/memorials/8" },
            self: { href: "http://localhost:8080/memorials/8" }
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
      totalElements: 8,
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
  },

  // 전체 회원 목록 (유가족 검색용)
  members: [
    {
      id: 1001,
      name: "김철수",
      phone: "010-1234-5678",
      email: "kim.chulsoo@example.com",
      address: "서울시 강남구 역삼동",
      birthDate: "1985-03-15",
      gender: "MALE",
      joinDate: "2023-01-10"
    },
    {
      id: 1002,
      name: "이영희",
      phone: "010-9876-5432",
      email: "lee.younghee@example.com",
      address: "서울시 서초구 서초동",
      birthDate: "1990-07-22",
      gender: "FEMALE",
      joinDate: "2023-02-15"
    },
    {
      id: 1003,
      name: "박민수",
      phone: "010-5555-1234",
      email: "park.minsu@example.com",
      address: "서울시 송파구 잠실동",
      birthDate: "1988-12-08",
      gender: "MALE",
      joinDate: "2023-03-20"
    },
    {
      id: 1004,
      name: "최수정",
      phone: "010-7777-8888",
      email: "choi.sujung@example.com",
      address: "서울시 마포구 홍대입구",
      birthDate: "1992-05-30",
      gender: "FEMALE",
      joinDate: "2023-04-05"
    },
    {
      id: 1005,
      name: "정현우",
      phone: "010-3333-9999",
      email: "jung.hyunwoo@example.com",
      address: "경기도 성남시 분당구",
      birthDate: "1987-09-14",
      gender: "MALE",
      joinDate: "2023-05-12"
    },
    {
      id: 1006,
      name: "윤미라",
      phone: "010-1111-2222",
      email: "yoon.mira@example.com",
      address: "인천시 연수구 송도동",
      birthDate: "1993-11-25",
      gender: "FEMALE",
      joinDate: "2023-06-18"
    },
    {
      id: 1007,
      name: "강동혁",
      phone: "010-4444-5555",
      email: "kang.donghyuk@example.com",
      address: "부산시 해운대구 우동",
      birthDate: "1989-04-17",
      gender: "MALE",
      joinDate: "2023-07-22"
    },
    {
      id: 1008,
      name: "송지은",
      phone: "010-6666-7777",
      email: "song.jieun@example.com",
      address: "대구시 수성구 범어동",
      birthDate: "1991-08-03",
      gender: "FEMALE",
      joinDate: "2023-08-15"
    },
    {
      id: 1009,
      name: "임태호",
      phone: "010-8888-9999",
      email: "lim.taeho@example.com",
      address: "대전시 유성구 도룡동",
      birthDate: "1986-02-28",
      gender: "MALE",
      joinDate: "2023-09-10"
    },
    {
      id: 1010,
      name: "한소영",
      phone: "010-2222-3333",
      email: "han.soyoung@example.com",
      address: "광주시 북구 일곡동",
      birthDate: "1994-06-12",
      gender: "FEMALE",
      joinDate: "2023-10-05"
    }
  ]
};

export default api;