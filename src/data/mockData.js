// src/data/mockData.js - 중앙화된 Mock 데이터

const generateUUID = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
  return v.toString(16);
});

const names = ['박수연', '김시훈', '양성현', '김민서', '오현종', '안도형', '류근우', '이헌준'];

export const mockMemorials = names.map((name, index) => {
  const birthYear = 1930 + Math.floor(Math.random() * 30);
  const deceasedYear = birthYear + 60 + Math.floor(Math.random() * 30);
  const id = generateUUID();
  return {
    id: id,
    customerId: 1000 + index,
    userId: `user${index+1}`,
    profileImageUrl: `https://picsum.photos/seed/${name}/200/200`,
    imageUrl: `https://picsum.photos/seed/${name}/200/200`, // MemorialConfig.js에서 사용하는 속성명
    name: name,
    age: deceasedYear - birthYear,
    birthDate: `${birthYear}-01-01`,
    birthOfDate: `${birthYear}-01-01`, // MemorialConfig.js에서 사용하는 속성명
    deceasedDate: `${deceasedYear}-01-01`,
    gender: Math.random() > 0.5 ? '남성' : '여성',
    eulogy: `고 ${name}님을 기리며... 

가족들의 사랑 속에서 행복한 삶을 사셨습니다.`,
    tribute: `고 ${name}님을 기리며.`,
    tributeGeneratedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    familyList: [{ name: '김가족', relation: '자녀' }],
    joinCode: `MEM${String(index + 1).padStart(3, '0')}`,
    description: `${name}님의 소중한 추억을 기리는 공간입니다.`,
    period: '2024.01.01 ~ 2024.01.03',
    status: ['active', 'completed', 'scheduled'][index % 3],
  };
});

export const mockPhotos = [
  { id: 1, memorialId: mockMemorials[0].id, title: '가족사진', description: '행복했던 시절', url: 'https://picsum.photos/seed/photo1/400/300', uploadedAt: new Date().toISOString() },
  { id: 2, memorialId: mockMemorials[0].id, title: '여행', description: '제주도에서', url: 'https://picsum.photos/seed/photo2/400/300', uploadedAt: new Date().toISOString() },
  { id: 3, memorialId: mockMemorials[1].id, title: '첫 돌', description: '첫 생일날', url: 'https://picsum.photos/seed/photo3/400/300', uploadedAt: new Date().toISOString() },
];

export const mockComments = [
  { id: 1, memorialId: mockMemorials[0].id, name: '김친구', relationship: '친구', message: '보고싶다 친구야', date: '2024-08-01' },
  { id: 2, memorialId: mockMemorials[0].id, name: '박동료', relationship: '동료', message: '좋은 곳에서 편히 쉬세요.', date: '2024-08-02' },
  { id: 3, memorialId: mockMemorials[1].id, name: '이가족', relationship: '가족', message: '사랑합니다.', date: '2024-08-03' },
];

export const mockVideos = [
    { id: 1, memorialId: mockMemorials[0].id, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
];
