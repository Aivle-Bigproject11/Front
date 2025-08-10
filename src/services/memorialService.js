// src/services/memorialService.js - 추모관 관련 서비스 (Mock 전용)
// 이 파일은 Mock 모드에서만 사용될 데이터를 정의합니다.

// --- Mock 서비스 구현 ---
export const mockMemorialService = (() => {
  const generateUUID = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

  const names = ['박수연', '김시훈', '양성현', '김민서', '오현종', '안도형', '류근우', '이헌준'];
  let mockMemorials = names.map((name, index) => {
    const birthYear = 1930 + Math.floor(Math.random() * 30);
    const deceasedYear = birthYear + 60 + Math.floor(Math.random() * 30);
    return {
      memorialId: generateUUID(), customerId: 1000 + index, profileImageUrl: `https://picsum.photos/seed/${name}/200/200`,
      name: name, age: deceasedYear - birthYear, birthDate: `${birthYear}-01-01`, deceasedDate: `${deceasedYear}-01-01`,
      gender: Math.random() > 0.5 ? '남성' : '여성', tribute: `고 ${name}님을 기리며.`,
      tributeGeneratedAt: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      familyList: [{ name: '김가족', relation: '자녀' }]
    };
  });

  let mockPhotos = [
    { photoId: 1, memorialId: mockMemorials[0].memorialId, title: '가족사진', description: '행복했던 시절', photoUrl: 'https://picsum.photos/seed/photo1/400/300', uploadedAt: new Date().toISOString() },
  ];
  let mockComments = [
    { commentId: 1, memorialId: mockMemorials[0].memorialId, name: '김친구', relationship: '친구', content: '보고싶다 친구야', createdAt: new Date().toISOString() },
  ];

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const getMemorials = async () => {
    await delay(300);
    return { _embedded: { memorials: mockMemorials }, page: { size: 20, totalElements: mockMemorials.length, totalPages: 1, number: 0 } };
  };
  const getMemorialById = async (id) => {
    await delay(300);
    return mockMemorials.find(m => m.memorialId === id) || null;
  };
  const getMemorialDetails = async (id) => { await delay(400); const m = mockMemorials.find(m=>m.memorialId===id); if(!m) return null; return { memorialInfo: m, photos: mockPhotos.filter(p=>p.memorialId===id), videos:[], comments: mockComments.filter(c=>c.memorialId===id)}; };
  const createMemorial = async (data) => { await delay(500); const newM = { memorialId: generateUUID(), customerId: 2000+mockMemorials.length, ...data }; mockMemorials.push(newM); return newM; };
  const updateMemorial = async (id, data) => { await delay(500); const i = mockMemorials.findIndex(m=>m.memorialId===id); if(i>-1){ mockMemorials[i] = {...mockMemorials[i], ...data}; return mockMemorials[i];} return null; };
  const deleteMemorial = async (id) => { await delay(500); const i = mockMemorials.findIndex(m=>m.memorialId===id); if(i>-1){ mockMemorials.splice(i,1); return {success:true};} return {success:false};}; 
  const getPhotos = async (id) => { await delay(200); return {_embedded: {photos: mockPhotos.filter(p=>p.memorialId===id)}}; };
  const addPhoto = async (id, data) => { await delay(600); const newP = {photoId: mockPhotos.length+1, memorialId:id, ...data}; mockPhotos.push(newP); return newP; };
  const getComments = async (id) => { await delay(150); return {_embedded: {comments: mockComments.filter(c=>c.memorialId===id)}}; };
  const addComment = async (id, data) => { await delay(400); const newC = {commentId: mockComments.length+1, memorialId:id, ...data}; mockComments.push(newC); return newC; };

  // API 명세와 다른 팀의 realApiService 함수 이름 사이의 간극을 맞추기 위한 별칭(alias)
  const getMemorial = getMemorialById;
  const getPhotosForMemorial = getPhotos;

  return { getMemorials, getMemorial, getMemorialById, getMemorialDetails, createMemorial, updateMemorial, deleteMemorial, getPhotos, getPhotosForMemorial, addPhoto, getComments, addComment };
})();
