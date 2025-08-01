// src/services/memorialService.js - 추모관 관련 서비스

// Mock 추모관 데이터
const mockMemorials = [
  {
    id: 1,
    name: '양성현',
    period: '2025.07.25 ~ 2025.08.05',
    status: 'active',
    description: '향년 75세',
    participants: 24,
    joinCode: 'MEM001',
    familyMembers: [
      { id: 1, memberId: 'user', name: '김철수', relation: '아들', phone: '010-0000-0000' },
      { id: 2, memberId: 'user01', name: '이영희', relation: '딸', phone: '010-0000-0001' }
    ]
  },
  {
    id: 2,
    name: '김시훈',
    period: '2025.07.28 ~ 2025.08.08',
    status: 'active',
    description: '향년 96세',
    participants: 18,
    joinCode: 'MEM002',
    familyMembers: [
      { id: 3, memberId: 'user02', name: '박민수', relation: '친구', phone: '010-1111-2222' }
    ]
  },
  {
    id: 3,
    name: '박수연',
    period: '2025.07.20 ~ 2025.07.30',
    status: 'completed',
    description: '향년 88세',
    participants: 35,
    joinCode: 'MEM003',
    familyMembers: [
      { id: 4, memberId: 'user', name: '김철수', relation: '가족', phone: '010-0000-0000' },
      { id: 5, memberId: 'user03', name: '최정호', relation: '조카', phone: '010-3333-4444' }
    ]
  }
];

/**
 * 사용자가 유가족으로 등록된 추모관 목록을 가져옵니다
 * @param {string} userId - 사용자 ID
 * @returns {Promise<Array>} 사용자의 추모관 목록
 */
export const getUserMemorialHalls = async (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 사용자가 유가족으로 등록된 추모관들 필터링
      const userMemorials = mockMemorials.filter(memorial => 
        memorial.familyMembers.some(member => member.memberId === userId)
      ).map(memorial => {
        // 해당 사용자의 역할 정보 추가
        const userRole = memorial.familyMembers.find(member => member.memberId === userId);
        return {
          ...memorial,
          role: userRole ? userRole.relation : '참여자'
        };
      });
      
      resolve(userMemorials);
    }, 500); // API 호출 시뮬레이션
  });
};

/**
 * 고유번호로 추모관을 조회합니다
 * @param {string} joinCode - 추모관 고유번호
 * @returns {Promise<Object|null>} 추모관 정보 또는 null
 */
export const getMemorialByCode = async (joinCode) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const memorial = mockMemorials.find(m => m.joinCode === joinCode);
      resolve(memorial || null);
    }, 300);
  });
};

/**
 * 추모관 ID로 상세 정보를 가져옵니다
 * @param {number} memorialId - 추모관 ID
 * @returns {Promise<Object|null>} 추모관 상세 정보
 */
export const getMemorialById = async (memorialId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const memorial = mockMemorials.find(m => m.id === parseInt(memorialId));
      resolve(memorial || null);
    }, 300);
  });
};

/**
 * 사용자를 추모관의 유가족으로 등록합니다
 * @param {number} memorialId - 추모관 ID
 * @param {Object} familyMemberData - 유가족 정보
 * @returns {Promise<boolean>} 등록 성공 여부
 */
export const addFamilyMember = async (memorialId, familyMemberData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const memorial = mockMemorials.find(m => m.id === memorialId);
      if (memorial) {
        const newMember = {
          id: Date.now(),
          ...familyMemberData
        };
        memorial.familyMembers.push(newMember);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 500);
  });
};

/**
 * 모든 추모관 목록을 가져옵니다 (관리자용)
 * @returns {Promise<Array>} 전체 추모관 목록
 */
export const getAllMemorials = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockMemorials);
    }, 300);
  });
};

/**
 * 새로운 추모관을 생성합니다
 * @param {Object} memorialData - 추모관 정보
 * @returns {Promise<Object>} 생성된 추모관 정보
 */
export const createMemorial = async (memorialData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMemorial = {
        id: mockMemorials.length + 1,
        joinCode: `MEM${String(mockMemorials.length + 1).padStart(3, '0')}`,
        participants: 0,
        familyMembers: [],
        status: 'active',
        ...memorialData
      };
      mockMemorials.push(newMemorial);
      resolve(newMemorial);
    }, 500);
  });
};

export default {
  getUserMemorialHalls,
  getMemorialByCode,
  getMemorialById,
  addFamilyMember,
  getAllMemorials,
  createMemorial
};
