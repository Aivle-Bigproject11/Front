// src/services/loginService.js - 로그인 및 사용자 세션 관련 서비스 (Mock 포함)
import { mockMemorials } from '../data/mockData';

export const mockLoginService = (() => {
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // 사용자의 추모관 목록을 가져옵니다. (Mock)
  const getUserMemorialHalls = async (userId) => {
    await delay(300);
    // 테스트 사용자는 أول 3개의 추모관에 접근 가능하다고 가정합니다.
    if (userId === 'user' || userId === 0) { 
        return mockMemorials.slice(0, 3);
    }
    // 다른 사용자 ID에 대한 필터링 로직 (필요시 확장)
    const userMemorials = mockMemorials.filter(m => m.userId === userId || m.customerId === userId);
    return userMemorials.length > 0 ? userMemorials : mockMemorials.slice(0,1); // 없으면 1개라도 반환
  };

  // 고유 코드로 추모관을 찾습니다. (Mock)
  const getMemorialByCode = async (code) => {
    await delay(300);
    return mockMemorials.find(m => m.joinCode === code) || null;
  };

  return {
    getUserMemorialHalls,
    getMemorialByCode,
  };
})();

export const realLoginService = {
  // 실제 API 호출은 api.js에서 정의됩니다.
};
