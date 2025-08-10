// src/services/loginService.js - 로그인 및 사용자 세션 관련 서비스 (Mock 포함)

export const mockLoginService = (() => {
  const generateUUID = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

  const names = ['박수연', '김시훈', '양성현', '김민서', '오현종', '안도형', '류근우', '이헌준'];
  const mockMemorials = names.map((name, index) => {
    const birthYear = 1930 + Math.floor(Math.random() * 30);
    const deceasedYear = birthYear + 60 + Math.floor(Math.random() * 30);
    return {
      id: generateUUID(), // 'memorialId' -> 'id' for consistency
      memorialId: generateUUID(),
      customerId: 1000 + index,
      userId: `user${index+1}`, // Mock user id
      profileImageUrl: `https://picsum.photos/seed/${name}/200/200`,
      name: name,
      age: deceasedYear - birthYear,
      birthDate: `${birthYear}-01-01`,
      deceasedDate: `${deceasedYear}-01-01`,
      gender: Math.random() > 0.5 ? '남성' : '여성',
      tribute: `고 ${name}님을 기리며.`,
      tributeGeneratedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      familyList: [{ name: '김가족', relation: '자녀' }],
      joinCode: `MEM${String(index + 1).padStart(3, '0')}`, // 고유 참여 코드
      description: `${name}님의 소중한 추억을 기리는 공간입니다.`,
      period: '2024.01.01 ~ 2024.01.03',
      status: ['active', 'completed', 'scheduled'][index % 3],
    };
  });

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // 사용자의 추모관 목록을 가져옵니다. (Mock)
  const getUserMemorialHalls = async (userId) => {
    await delay(300);
    // In a real scenario, you would filter by userId.
    // For this mock, we'll assume 'user' (the test user) has access to the first few.
    // The loginId for the test user is 'user'.
    if (userId === 'user' || userId === 'user1' || userId === 1001) { // loginId, id 등 다양한 케이스 대응
        return mockMemorials.slice(0, 3);
    }
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
