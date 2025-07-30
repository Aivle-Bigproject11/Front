// import React, { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // localStorage에서 토큰 확인
//     const token = localStorage.getItem('token');
//     const userData = localStorage.getItem('user');
    
//     if (token && userData) {
//       setIsAuthenticated(true);
//       setUser(JSON.parse(userData));
//     }
//     setLoading(false);
//   }, []);

//   const login = async (username, password) => {
//     try {
//       // TODO: 실제 API 호출로 교체
//       // const response = await axios.post('/api/auth/login', { username, password });
      
//       // 임시 로그인 처리
//       if (username === 'user' && password === 'password') {
//         const userData = { username: 'user', name: '관리자' };
//         const token = 'dummy-token';
        
//         localStorage.setItem('token', token);
//         localStorage.setItem('user', JSON.stringify(userData));
        
//         setIsAuthenticated(true);
//         setUser(userData);
//         return { success: true };
//       } else {
//         return { success: false, message: '잘못된 사용자명 또는 비밀번호입니다.' };
//       }
//     } catch (error) {
//       return { success: false, message: '로그인 중 오류가 발생했습니다.' };
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setIsAuthenticated(false);
//     setUser(null);
//   };

//   const value = {
//     isAuthenticated,
//     user,
//     loading,
//     login,
//     logout
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
