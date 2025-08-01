// src/services/userService.js

/**
 * @description 일반 사용자 데이터베이스 (새로운 구조)
 */
const mockUserDB = [
  { 
        id: 0, 
        loginId: 'user', 
        loginPassword: 'password', 
        name: '테스트', 
        email: 'user00@example.com',
        phone: '010-0000-0000',
        status: 'active',
        memorialId: null,
        createdAt: new Date('2024-01-15T09:00:00Z'),
        updatedAt: new Date('2024-07-20T14:30:00Z')
    },
    { 
        id: 1, 
        loginId: 'user01', 
        loginPassword: 'user01', 
        name: '김시훈', 
        email: 'user01@example.com',
        phone: '010-0000-0001',
        status: 'active',
        memorialId: null,
        createdAt: new Date('2024-01-15T09:00:00Z'),
        updatedAt: new Date('2024-07-20T14:30:00Z')
    },
    { 
        id: 2, 
        loginId: 'user02', 
        loginPassword: 'user02', 
        name: '양성현', 
        email: 'user02@example.com',
        phone: '010-0000-0002',
        status: 'active',
        memorialId: 1,
        createdAt: new Date('2024-02-10T10:15:00Z'),
        updatedAt: new Date('2024-07-25T16:45:00Z')
    },
    { 
        id: 3, 
        loginId: 'user03', 
        loginPassword: 'user03', 
        name: '박수연', 
        email: 'user03@example.com',
        phone: '010-1111-2222',
        status: 'active',
        memorialId: 2,
        createdAt: new Date('2024-03-05T11:20:00Z'),
        updatedAt: new Date('2024-07-28T09:10:00Z')
    },
    { 
        id: 4, 
        loginId: 'user04', 
        loginPassword: 'user04', 
        name: '김민서', 
        email: 'user04@example.com',
        phone: '010-3333-4444',
        status: 'active',
        memorialId: 3,
        createdAt: new Date('2024-04-12T08:30:00Z'),
        updatedAt: new Date('2024-07-22T13:25:00Z')
    },
    { 
        id: 5, 
        loginId: 'user05', 
        loginPassword: 'user05', 
        name: '오현종', 
        email: 'user05@example.com',
        phone: '010-5555-6666',
        status: 'inactive',
        memorialId: null,
        createdAt: new Date('2024-05-08T15:45:00Z'),
        updatedAt: new Date('2024-06-15T12:00:00Z')
    }
];

/**
 * @description 관리자(상조사 직원) 데이터베이스 (기존 구조 유지)
 */
const mockEmployeeDB = [
    {
        id: 99,
        loginId: 'admin',
        loginPassword: 'password',
        name: '테스트관리자',
        email: 'admin00@company.com',
        phone: '010-1000-1000',
        department: '사자보이즈',
        position: '사장'
    },
    { 
        id: 100, 
        loginId: 'admin', 
        loginPassword: 'admin', 
        name: '류근우', 
        email: 'admin@company.com',
        phone: '010-1000-1000',
        department: '관리부',
        position: '팀장'
    },
    { 
        id: 101, 
        loginId: 'admin02', 
        loginPassword: 'emp123', 
        name: '이헌준', 
        email: 'emp01@company.com',
        phone: '010-1000-1001',
        department: '영업부',
        position: '대리'
    },
    { 
        id: 102, 
        loginId: 'admin03', 
        loginPassword: 'staff123', 
        name: '안도형', 
        email: 'staff01@company.com',
        phone: '010-1000-1002',
        department: '고객서비스부',
        position: '사원'
    },
    { 
        id: 103, 
        loginId: 'manager01', 
        loginPassword: 'manager123', 
        name: '이정하', 
        email: 'manager01@company.com',
        phone: '010-1000-1003',
        department: '운영부',
        position: '매니저'
    }
];

/**
 * @description 일반 사용자 로그인 (사용자 DB에서만 검색)
 * @param {string} loginId - 사용자 로그인 아이디
 * @param {string} loginPassword - 사용자 비밀번호
 * @returns {Promise<object>} 일치하는 사용자 객체를 반환하는 프로미스
 */
export const getUserByCredentials = (loginId, loginPassword) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUserDB.find(u => u.loginId === loginId && u.loginPassword === loginPassword);
      
      if (user) {
        resolve({ ...user, userType: 'user' });
      } else {
        reject(new Error('아이디 또는 비밀번호가 일치하지 않습니다.'));
      }
    }, 500);
  });
};

/**
 * @description 관리자(직원) 로그인 (직원 DB에서만 검색)
 * @param {string} loginId - 직원 로그인 아이디
 * @param {string} loginPassword - 직원 비밀번호
 * @returns {Promise<object>} 일치하는 직원 객체를 반환하는 프로미스
 */
export const getEmployeeByCredentials = (loginId, loginPassword) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const employee = mockEmployeeDB.find(u => u.loginId === loginId && u.loginPassword === loginPassword);
      
      if (employee) {
        resolve({ ...employee, userType: 'employee' });
      } else {
        reject(new Error('아이디 또는 비밀번호가 일치하지 않습니다.'));
      }
    }, 500);
  });
};

/**
 * @description 일반 사용자 DB에서 이름과 이메일로 사용자를 조회합니다.
 * @param {string} name - 사용자 이름
 * @param {string} email - 사용자 이메일
 * @returns {Promise<object>} 일치하는 사용자 객체를 반환하는 프로미스
 */
export const getUserByNameAndEmail = (name, email) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUserDB.find(u => u.name === name && u.email === email);
      
      if (user) {
        resolve(user);
      } else {
        reject(new Error('일치하는 사용자 정보가 없습니다.'));
      }
    }, 500);
  });
};

/**
 * @description 직원 DB에서 이름과 이메일로 직원을 조회합니다.
 * @param {string} name - 직원 이름
 * @param {string} email - 직원 이메일
 * @returns {Promise<object>} 일치하는 직원 객체를 반환하는 프로미스
 */
export const getEmployeeByNameAndEmail = (name, email) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const employee = mockEmployeeDB.find(u => u.name === name && u.email === email);
      
      if (employee) {
        resolve(employee);
      } else {
        reject(new Error('일치하는 직원 정보가 없습니다.'));
      }
    }, 500);
  });
};

/**
 * @description 일반 사용자 DB에서 아이디로 사용자를 찾아 비밀번호를 업데이트합니다.
 * @param {string} loginId - 사용자 로그인 아이디
 * @param {string} newPassword - 새로운 비밀번호
 * @returns {Promise<object>} 성공 여부를 반환하는 프로미스
 */
export const updateUserPasswordByLoginId = (loginId, newPassword) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUserDB.find(u => u.loginId === loginId);
      
      if (user) {
        console.log(`[시뮬레이션] 일반 사용자 '${loginId}'의 비밀번호를 '${newPassword}'(으)로 변경 요청`);
        // 실제로는 user.loginPassword = newPassword; 및 DB 업데이트
        user.updatedAt = new Date();
        resolve({ success: true, message: '비밀번호가 성공적으로 변경되었습니다.' });
      } else {
        reject(new Error('해당 아이디를 찾을 수 없습니다.'));
      }
    }, 500);
  });
};

/**
 * @description 직원 DB에서 아이디로 직원을 찾아 비밀번호를 업데이트합니다.
 * @param {string} loginId - 직원 로그인 아이디
 * @param {string} newPassword - 새로운 비밀번호
 * @returns {Promise<object>} 성공 여부를 반환하는 프로미스
 */
export const updateEmployeePasswordByLoginId = (loginId, newPassword) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const employee = mockEmployeeDB.find(u => u.loginId === loginId);
      
      if (employee) {
        console.log(`[시뮬레이션] 직원 '${loginId}'의 비밀번호를 '${newPassword}'(으)로 변경 요청`);
        // 실제로는 employee.loginPassword = newPassword; 및 DB 업데이트
        resolve({ success: true, message: '비밀번호가 성공적으로 변경되었습니다.' });
      } else {
        reject(new Error('해당 아이디를 찾을 수 없습니다.'));
      }
    }, 500);
  });
};

/**
 * @description 모든 일반 사용자 목록을 조회합니다.
 * @returns {Promise<Array>} 일반 사용자 목록
 */
export const getAllUsers = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUserDB);
    }, 300);
  });
};

/**
 * @description 모든 직원 목록을 조회합니다.
 * @returns {Promise<Array>} 직원 목록
 */
export const getAllEmployees = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockEmployeeDB);
    }, 300);
  });
};

/**
 * @description 사용자 ID로 사용자 정보를 조회합니다.
 * @param {number} userId - 사용자 ID
 * @returns {Promise<object|null>} 사용자 정보 또는 null
 */
export const getUserById = (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 먼저 일반 사용자 DB에서 검색
      let user = mockUserDB.find(u => u.id === userId);
      
      // 일반 사용자에서 찾지 못하면 직원 DB에서 검색
      if (!user) {
        user = mockEmployeeDB.find(u => u.id === userId);
      }
      
      resolve(user || null);
    }, 300);
  });
};


// import axios from 'axios';

// // 1. API 명세서에서 받은 기본 주소로 변경합니다.
// const API_BASE_URL = 'https://api.example.com/api'; 

// /**
//  * 아이디 찾기: 이름과 이메일을 서버에 보내 아이디를 요청합니다.
//  */
// export const getUserByNameAndEmail = async (name, email) => {
//   // 2. 가짜 데이터 검색 로직을 API 호출로 변경합니다.
//   const response = await axios.post(`${API_BASE_URL}/users/find-id`, {
//     name,
//     email,
//   });
//   return response.data;
// };

// /**
//  * 비밀번호 변경: 아이디와 새 비밀번호를 서버에 보내 변경을 요청합니다.
//  */
// export const updatePasswordByLoginId = async (loginId, newPassword) => {
//   // 3. 비밀번호 변경 시뮬레이션 로직을 API 호출로 변경합니다.
//   const response = await axios.put(`${API_BASE_URL}/users/password`, {
//     loginId,
//     newPassword,
//   });
//   return response.data;
// };

// /**
//  * 로그인: 아이디와 비밀번호를 서버에 보내 로그인을 요청합니다.
//  * (기존 로그인 함수도 동일하게 수정합니다)
//  */
// export const getUserByCredentials = async (loginId, loginPassword) => {
//   const response = await axios.post(`${API_BASE_URL}/auth/login`, {
//     loginId,
//     loginPassword,
//   });
//   return response.data;
// };