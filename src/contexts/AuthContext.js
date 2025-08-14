// src/contexts/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
    getUserByCredentials, 
    getEmployeeByCredentials,
    getUserByNameAndEmail,
    getEmployeeByNameAndEmail,
    updateUserPasswordByLoginId,
    updateEmployeePasswordByLoginId } 
from '../services/userService';
import { apiService } from '../services/api'; // Added for direct API calls

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("사용자 정보를 불러오는 데 실패했습니다.", error);
    }
    setLoading(false);
  }, []);

  /**
   * @description 사용자 타입에 따른 로그인을 처리합니다. 
   */
  const loginByType = async (loginId, loginPassword, userType) => {
    // Mock 모드 분기 처리
    const useMock = process.env.REACT_APP_API_MOCKING === 'true';

    if (useMock) {
        return new Promise((resolve) => {
            setTimeout(() => {
                let mockUser = null;
                if (userType === 'employee' && loginId === 'admin' && loginPassword === 'password') {
                    mockUser = { id: 99, loginId: 'admin', name: '테스트관리자', userType: 'employee' };
                } else if (userType === 'user' && loginId === 'user' && loginPassword === 'password') {
                    mockUser = { id: 0, loginId: 'user', name: '테스트', userType: 'user' };
                }

                if (mockUser) {
                    const token = 'dummy-mock-auth-token';
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(mockUser));
                    setIsAuthenticated(true);
                    setUser(mockUser);
                    resolve({ success: true });
                } else {
                    resolve({ success: false, message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
                }
            }, 500);
        });
    }

    // 기존 Real 모드 로직
    try {
      let foundUser;
      let token;
      let userData;

      if (userType === 'employee') {
        const credentials = { loginId, loginPassword };
        const response = await apiService.loginManager(credentials);
        // Assuming response.data contains user info and token
        foundUser = response.data; // The user object is directly in response.data
        token = response.data.token; // The token is directly in response.data.token
        userData = {
          id: foundUser.id,
          loginId: loginId, // Use the loginId passed into loginByType
          name: foundUser.name,
          userType: 'employee' // Set userType explicitly
        };
      } else { // userType === 'user'
        const credentials = { loginId, loginPassword };
        const response = await apiService.loginUser(credentials);
        // Assuming response.data contains user info and token
        foundUser = response.data; // The user object is directly in response.data
        token = response.data.token; // The token is directly in response.data.token
        userData = {
          id: foundUser.id,
          loginId: loginId, // Use the loginId passed into loginByType
          name: foundUser.name,
          userType: 'user' // Set userType explicitly
        };
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setIsAuthenticated(true);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, message: error.message };
    }
  };

  /**
   * @description 기존 로그인 (하위 호환성을 위해 유지)
   */
  const login = async (loginId, loginPassword) => {
    try {
      const foundUser = await getUserByCredentials(loginId, loginPassword);
      
      const userData = {                // 백엔드 연동시 데이터에 맞춰야됨
        id: foundUser.id, 
        loginId: foundUser.loginId, 
        name: foundUser.name,
        userType: foundUser.userType   // 서비스에서 자동으로 설정됨
      };
      const token = 'dummy-auth-token'; // 백엔드 연동시 수정 필요

        // ex =================================================================
        // const foundUser = await getUserByCredentials(loginId, loginPassword);

        // // 백엔드가 { user: {...}, token: '...' } 형태로 응답한다고 가정
        // const userData = foundUser.user;
        // const token = foundUser.token; //  더미 데이터 대신 실제 응답에서 받은 토큰 사용

        // localStorage.setItem('token', token);
        // ==============================================================
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setIsAuthenticated(true);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, message: error.message };
    }
  };

  /**
   * @description 사용자 타입에 따른 아이디 찾기를 처리합니다.
   */
  const findIdByType = async (name, email, userType) => {
    try {
      const findFunction = userType === 'employee' ? getEmployeeByNameAndEmail : getUserByNameAndEmail;
      const foundUser = await findFunction(name, email);
      return { success: true, loginId: foundUser.loginId };
    } catch (error) {
      console.error(error);
      return { success: false, message: error.message };
    }
  };

  /**
   * @description 아이디 찾기를 처리합니다. (하위 호환성을 위해 유지)
   */
  const findId = async (name, email) => {
    try {
      const foundUser = await getUserByNameAndEmail(name, email);
      return { success: true, loginId: foundUser.loginId };
    } catch (error) {
      console.error(error);
      return { success: false, message: error.message };
    }
  };

  /**
   * @description 로그아웃을 처리합니다.
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

    /**
   * @description 사용자 타입에 따른 비밀번호 변경을 처리합니다.
   */
  const changePasswordByType = async (loginId, newPassword, userType) => {
    try {
      const updateFunction = userType === 'employee' ? updateEmployeePasswordByLoginId : updateUserPasswordByLoginId;
      const result = await updateFunction(loginId, newPassword);
      return result; // { success: true, message: '...' }
    } catch (error) {
      console.error(error);
      return { success: false, message: error.message };
    }
  };

    /**
   * @description 비밀번호 변경을 처리합니다. (하위 호환성을 위해 유지)
   */
  const changePassword = async (loginId, newPassword) => {
    try {
      const result = await updateUserPasswordByLoginId(loginId, newPassword);
      return result; // { success: true, message: '...' }
    } catch (error) {
      console.error(error);
      return { success: false, message: error.message };
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    loginByType,
    logout,
    findId,
    findIdByType,
    changePassword,
    changePasswordByType
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};