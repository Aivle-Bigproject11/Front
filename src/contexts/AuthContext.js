// src/contexts/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
    getUserByCredentials, 
    getEmployeeByCredentials,
    getUserByNameAndEmail,
    getEmployeeByNameAndEmail
} 
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
      
      console.log('🔍 localStorage에서 불러온 데이터:', { token: !!token, userData });
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        console.log('🔍 파싱된 사용자 데이터:', parsedUser);
        console.log('🔍 사용자 타입:', parsedUser.userType);
        
        setIsAuthenticated(true);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("사용자 정보를 불러오는 데 실패했습니다.", error);
      // localStorage 데이터가 손상된 경우 정리
      localStorage.removeItem('token');
      localStorage.removeItem('user');
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

      console.log(`🔍 ${userType} 로그인 시도:`, { loginId, userType });

      if (userType === 'employee') {
        const credentials = { loginId, loginPassword };
        console.log('🔍 관리자 로그인 API 호출 중...', credentials);
        
        const response = await apiService.loginManager(credentials);
        console.log('🔍 관리자 로그인 API 응답:', response);
        
        // response는 이제 직접 데이터 객체입니다 (response.data가 아님)
        foundUser = response;
        token = response.token;
        
        console.log('🔍 추출된 토큰:', token);
        console.log('🔍 사용자 정보:', foundUser);
        
        userData = {
          id: foundUser.id,
          loginId: loginId,
          name: foundUser.name,
          userType: 'employee'
        };
      } else { // userType === 'user'
        const credentials = { loginId, loginPassword };
        console.log('🔍 사용자 로그인 API 호출 중...', credentials);
        
        const response = await apiService.loginUser(credentials);
        console.log('🔍 사용자 로그인 API 응답:', response);
        
        // response는 이제 직접 데이터 객체입니다 (response.data가 아님)
        foundUser = response;
        token = response.token;
        userData = {
          id: foundUser.id,
          loginId: loginId,
          name: foundUser.name,
          userType: 'user'
        };
      }
      
      console.log('🔍 최종 사용자 데이터:', userData);
      console.log('🔍 저장할 토큰:', token);
      
      if (!token) {
        console.error('❌ 토큰이 없습니다!');
        return { success: false, message: '토큰을 받지 못했습니다.' };
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      console.log('✅ localStorage에 저장 완료');
      console.log('✅ 저장된 토큰:', localStorage.getItem('token'));
      console.log('✅ 저장된 사용자:', localStorage.getItem('user'));
      
      setIsAuthenticated(true);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      console.error('❌ 로그인 오류:', error);
      console.error('❌ 오류 상세:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
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
      const updateFunction = userType === 'employee' ? apiService.changeEmployeePassword : apiService.changeUserPassword;
      await updateFunction(loginId, newPassword);
      return { success: true, message: '비밀번호가 성공적으로 변경되었습니다.' };
    } catch (error) {
      console.error("Password change error:", error);
      // Axios 에러인 경우, 백엔드에서 보낸 커스텀 메시지(error.response.data)를 우선적으로 사용합니다.
      const message = error.response?.data || error.message;
      return { success: false, message: message };
    }
  };

    /**
   * @description 비밀번호 변경을 처리합니다. (하위 호환성을 위해 유지)
   */
  const changePassword = async (loginId, newPassword) => {
    try {
      // 기본값을 사용자 비밀번호 변경으로 설정
      await apiService.changeUserPassword(loginId, newPassword);
      return { success: true, message: '비밀번호가 성공적으로 변경되었습니다.' };
    } catch (error) {
      console.error("Password change error:", error);
      // Axios 에러인 경우, 백엔드에서 보낸 커스텀 메시지(error.response.data)를 우선적으로 사용합니다.
      const message = error.response?.data || error.message;
      return { success: false, message: message };
    }
  };

  const value = {
    isAuthenticated,
    user,
    userType: user?.userType, // userType 추가
    loading,
    login,
    loginByType,
    logout,
    findId,
    findIdByType,
    changePassword,
    changePasswordByType
  };

  // 디버깅을 위한 로그
  console.log('🔍 AuthContext value:', { 
    isAuthenticated, 
    user: user ? { ...user, loginPassword: '[HIDDEN]' } : null, 
    userType: user?.userType 
  });

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};