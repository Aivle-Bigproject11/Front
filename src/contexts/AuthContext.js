// src/contexts/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
    getUserByCredentials, 
    getUserByNameAndEmail,
    updatePasswordByLoginId } 
from '../services/userService';

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
   * @description 로그인을 처리합니다. 
   */
  const login = async (loginId, loginPassword) => {
    try {
      const foundUser = await getUserByCredentials(loginId, loginPassword);
      
      const userData = {                // 백엔드 연동시 데이터에 맞춰야됨
        id: foundUser.id, 
        loginId: foundUser.loginId, 
        name: foundUser.name            
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
   * @description 아이디 찾기를 처리합니다. (반환값의 키 변경)
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
   * @description 비밀번호 변경을 처리합니다.
   */
  const changePassword = async (loginId, newPassword) => {
    try {
      const result = await updatePasswordByLoginId(loginId, newPassword);
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
    logout,
    findId,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};