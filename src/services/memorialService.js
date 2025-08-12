// src/services/memorialService.js - 추모관 관련 서비스 (Mock 전용)
import { mockMemorials, mockPhotos, mockComments, mockVideos } from '../data/mockData';

// --- Mock 서비스 구현 ---
export const mockMemorialService = (() => {
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const getMemorials = async () => {
    await delay(300);
    return { _embedded: { memorials: mockMemorials }, page: { size: 20, totalElements: mockMemorials.length, totalPages: 1, number: 0 } };
  };
  
  const getMemorialById = async (id) => {
    await delay(300);
    const memorial = mockMemorials.find(m => m.id === id) || null;
    // MemorialConfig.js는 response.data를 기대하므로, API 응답 형태로 반환
    return { data: memorial };
  };

  const getMemorialDetails = async (id) => {
    await delay(400);
    const memorial = mockMemorials.find(m => m.id === id);
    if (!memorial) return null;
    
    const photos = mockPhotos.filter(p => p.memorialId === id);
    const videos = mockVideos.filter(v => v.memorialId === id);
    const comments = mockComments.filter(c => c.memorialId === id);

    // 새로운 API 명세에 따른 응답 형식으로 반환
    return {
      memorialId: memorial.id,
      profileImageUrl: memorial.profileImageUrl,
      deceasedName: memorial.deceasedName || memorial.name,
      deceasedAge: memorial.deceasedAge || memorial.age,
      gender: memorial.gender,
      birthDate: memorial.birthDate,
      deceasedDate: memorial.deceasedDate,
      tribute: memorial.tribute,
      createdAt: memorial.createdAt,
      photos: photos,
      videos: videos,
      comments: comments
    };
  };

  const createMemorial = async (data) => { 
    await delay(500); 
    const newM = { id: `mock-${mockMemorials.length + 1}`, customerId: 2000 + mockMemorials.length, ...data }; 
    mockMemorials.push(newM); 
    return newM; 
  };
  
  const updateMemorial = async (id, data) => { 
    await delay(500); 
    const i = mockMemorials.findIndex(m => m.id === id); 
    if (i > -1) { 
      mockMemorials[i] = { ...mockMemorials[i], ...data }; 
      return { data: mockMemorials[i] }; 
    } 
    return { data: null }; 
  };
  
  const deleteMemorial = async (id) => { 
    await delay(500); 
    const i = mockMemorials.findIndex(m => m.id === id); 
    if (i > -1) { 
      mockMemorials.splice(i, 1); 
      return { success: true }; 
    } 
    return { success: false };
  }; 
  
  const getPhotos = async (id) => { 
    await delay(200); 
    return { _embedded: { photos: mockPhotos.filter(p => p.memorialId === id) } }; 
  };
  
  const addPhoto = async (id, data) => { 
    await delay(600); 
    const newP = { id: mockPhotos.length + 1, memorialId: id, ...data }; 
    mockPhotos.push(newP); 
    return newP; 
  };
  
  const getComments = async (id) => { 
    await delay(150); 
    return { _embedded: { comments: mockComments.filter(c => c.memorialId === id) } }; 
  };
  
  const addComment = async (id, data) => { 
    await delay(400); 
    const newC = { id: mockComments.length + 1, memorialId: id, ...data }; 
    mockComments.push(newC); 
    return newC; 
  };

  const createVideo = async (memorialId, formData) => {
    await delay(1000); // 영상 생성은 시간이 오래 걸림
    const newVideo = {
      id: mockVideos.length + 1,
      videoId: mockVideos.length + 1,
      memorialId: parseInt(memorialId),
      title: `추모 영상 ${mockVideos.length + 1}`,
      description: '새로운 추모 영상',
      status: 'REQUESTED',
      videoUrl: null,
      thumbnailUrl: null,
      outroImageUrl: 'https://picsum.photos/seed/outro/400/300',
      keywords: ['추억', '사랑'],
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    mockVideos.push(newVideo);
    return newVideo;
  };

  const getVideo = async (videoId) => {
    await delay(200);
    const video = mockVideos.find(v => v.videoId === parseInt(videoId));
    return video || null;
  };

  const deleteVideo = async (videoId) => {
    await delay(300);
    const index = mockVideos.findIndex(v => v.videoId === parseInt(videoId));
    if (index > -1) {
      mockVideos.splice(index, 1);
      return { success: true };
    }
    return { success: false };
  };

  // API 명세와 다른 팀의 realApiService 함수 이름 사이의 간극을 맞추기 위한 별칭(alias)
  const getMemorial = getMemorialById;
  const getPhotosForMemorial = getPhotos;

  return { 
    getMemorials, 
    getMemorial, 
    getMemorialById, 
    getMemorialDetails, 
    createMemorial, 
    updateMemorial, 
    deleteMemorial, 
    getPhotos, 
    getPhotosForMemorial, 
    addPhoto, 
    getComments, 
    addComment,
    createVideo,
    getVideo,
    deleteVideo
  };
})();
