// src/services/userService.js

/**
 * @description 가상 사용자 데이터베이스.
 */
const mockUserDB = [
    { 
        id: 0, 
        loginId: 'user', 
        loginPassword: 'password', 
        name: '유저00', 
        email: 'user00@example.com',
        phone: '010-0000-0000'
    },
    { 
        id: 1, 
        loginId: 'user01', 
        loginPassword: 'user01', 
        name: '유저01', 
        email: 'user01@example.com',
        phone: '010-0000-0001'
    },
    { 
        id: 2, 
        loginId: 'user02', 
        loginPassword: 'user02', 
        name: '유저02', 
        email: 'user02@example.com',
        phone: '010-1111-2222'
    },
    { 
        id: 3, 
        loginId: 'user03', 
        loginPassword: 'user03', 
        name: '유저03', 
        email: 'user03@example.com',
        phone: '010-3333-4444'
    }  
];

/**
 * @description 아이디와 비밀번호로 사용자를 조회합니다.
 * @param {string} loginId - 사용자 로그인 아이디
 * @param {string} loginPassword - 사용자 비밀번호
 * @returns {Promise<object>} 일치하는 사용자 객체를 반환하는 프로미스
 */
export const getUserByCredentials = (loginId, loginPassword) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUserDB.find(u => u.loginId === loginId && u.loginPassword === loginPassword);
      if (user) {
        resolve(user);
      } else {
        reject(new Error('아이디 또는 비밀번호가 일치하지 않습니다.'));
      }
    }, 500);
  });
};

/**
 * @description 이름과 이메일로 사용자를 조회합니다.
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
 * @description 아이디로 사용자를 찾아 비밀번호를 업데이트(하는 척)합니다.
 * @param {string} loginId - 사용자 로그인 아이디
 * @param {string} newPassword - 새로운 비밀번호
 * @returns {Promise<object>} 성공 여부를 반환하는 프로미스
 */
export const updatePasswordByLoginId = (loginId, newPassword) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUserDB.find(u => u.loginId === loginId);
      if (user) {
        // 실제 DB에서는 이 부분에서 UPDATE 쿼리를 실행합니다.
        // 지금은 콘솔에 로그를 남겨서 변경을 흉내 냅니다.
        console.log(`[시뮬레이션] 사용자 '${loginId}'의 비밀번호를 '${newPassword}'(으)로 변경 요청`);
        resolve({ success: true, message: '비밀번호가 성공적으로 변경되었습니다.' });
      } else {
        reject(new Error('해당 아이디를 찾을 수 없습니다.'));
      }
    }, 500);
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