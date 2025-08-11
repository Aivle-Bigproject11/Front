import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal, Form, Badge } from 'react-bootstrap';
import { ArrowLeft } from 'lucide-react';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const MemorialDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // 모든 useState 훅을 먼저 호출
  const [memorial, setMemorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGuestbookModal, setShowGuestbookModal] = useState(false);
  const [guestbookEntry, setGuestbookEntry] = useState({
    name: '',
    content: '',
    relationship: ''
  });
  const [guestbookList, setGuestbookList] = useState([]);
  const [activeTab, setActiveTab] = useState('video'); // 'video' 또는 'photos'
  const [videoUrl, setVideoUrl] = useState('');
  const [photos, setPhotos] = useState([]);
  const [ribbonScrollIndex, setRibbonScrollIndex] = useState(0);
  const ribbonItemsPerView = 4; // 화면에 보이는 리본 개수
  const ribbonItemWidth = 220; // 리본 너비 + 간격
  const [selectedRibbon, setSelectedRibbon] = useState(null);
  const [showRibbonDetailModal, setShowRibbonDetailModal] = useState(false);
  const [animateCard, setAnimateCard] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  
  // 사진 업로드 관련 상태
  const [showPhotoUploadModal, setShowPhotoUploadModal] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoForm, setPhotoForm] = useState({
    photo: null,
    title: '',
    description: ''
  });
  const [photoPreview, setPhotoPreview] = useState(null);

  // 접근 모드 확인: 고유번호 접근(guest), 유저 로그인(user), 관리자 로그인(admin)
  const isGuestAccess = !user; // 로그인하지 않고 고유번호로 접근
  const isUserAccess = user && user.userType === 'user'; // 유저로 로그인 (유가족)
  const isAdminAccess = user && user.userType === 'employee'; // 관리자로 로그인
  
  // 관리 페이지 접근 권한: 유저(유가족) 또는 관리자
  const canAccessSettings = !isGuestAccess; // 고유번호 접근이 아닌 경우

  // useEffect 훅
  useEffect(() => {
    setAnimateCard(true);
    const fetchMemorialDetails = async () => {
      try {
        // ID 검증은 여기서 수행
        if (!id) {
          console.error('❌ Memorial ID가 URL에서 추출되지 않음!');
          navigate('/menu4');
          return;
        }

        // UUID 형태인지 확인 (예: 1c337344-ad3c-4785-a5f8-0054698c3ebe)
        const isValidUUID = id && id.includes('-') && id.length >= 36;
        console.log('🔍 Is Valid UUID:', isValidUUID);
        
        if (!isValidUUID) {
          console.error('❌ Memorial ID가 올바른 UUID 형태가 아님:', id);
          // navigate('/menu4'); // 일단 주석처리해서 계속 진행
        }

        console.log('🔍 Final Memorial ID:', id);
        
        console.log('🔗 MemorialDetail API 호출 시작 - ID:', id);
        console.log('🔗 API URL:', process.env.REACT_APP_API_URL || 'http://localhost:8088');
        const response = await apiService.getMemorialDetails(id);
        console.log('✅ MemorialDetail API 응답 성공:', response);
        
        // API 명세에 따른 응답 구조 처리
        setMemorial(response); // 응답 자체가 memorial 정보
        
        // 사진 목록 로드
        try {
          await loadPhotos(id);
        } catch (photoError) {
          console.warn("사진 목록 로드 실패 (CORS 문제):", photoError.response?.status);
          // 사진 목록 로드 실패는 전체 페이지 로드를 방해하지 않음
          setPhotos([]);
        }
        
        // 댓글 목록 로드 (현재 API 명세에 없음 - 백엔드 구현 후 활성화)
        // try {
        //   const commentsResponse = await apiService.getComments(id);
        //   setGuestbookList(commentsResponse || []);
        // } catch (commentError) {
        //   console.warn("댓글 목록 로드 실패 (백엔드 미지원):", commentError.response?.status);
        //   // 댓글 목록 로드 실패는 전체 페이지 로드를 방해하지 않음
        //   setGuestbookList([]);
        // }
        
        // 비디오 URL은 명세에 없으므로 임시 처리
        // if (videos && videos.length > 0) {
        //   setVideoUrl(videos[0].videoUrl);
        // }
      } catch (error) {
        console.error("❌ MemorialDetail API 호출 실패:", error);
        console.error("에러 상세:", error.response?.data, error.response?.status);
        console.error("요청 URL:", error.config?.url);
        
        // CORS 에러인지 확인
        if (error.message === 'Network Error' && error.code === 'ERR_NETWORK') {
          console.warn("🔧 CORS 문제 감지: 백엔드 설정 확인 필요");
          alert("네트워크 연결 문제가 발생했습니다. (CORS 설정 확인 필요)");
        } else {
          alert("추모관 정보를 불러오는 데 실패했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMemorialDetails();
  }, [id, navigate]); // id와 navigate를 의존성으로 추가

  // 사진 목록 로드 함수
  const loadPhotos = async (memorialId) => {
    try {
      console.log('🔗 사진 목록 로드 시작 - Memorial ID:', memorialId);
      const photosResponse = await apiService.getPhotosForMemorial(memorialId);
      console.log('✅ 사진 목록 로드 성공:', photosResponse);
      
      // API 명세에 따라 _embedded.photos 구조로 응답이 올 수 있음
      const photosList = photosResponse._embedded?.photos || photosResponse || [];
      setPhotos(photosList);
    } catch (error) {
      console.error('❌ 사진 목록 로드 실패:', error);
      // 사진 로드 실패는 치명적이지 않으므로 에러 메시지만 로그
    }
  };

  // 사진 업로드 함수
  const handlePhotoUpload = async (e) => {
    e.preventDefault();
    
    if (!photoForm.photo || !photoForm.title.trim()) {
      alert('사진과 제목을 모두 입력해주세요.');
      return;
    }

    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('photo', photoForm.photo);
      formData.append('title', photoForm.title.trim());
      formData.append('description', photoForm.description.trim());

      console.log('🔗 사진 업로드 시작 - Memorial ID:', id);
      const response = await apiService.uploadPhoto(id, formData);
      console.log('✅ 사진 업로드 성공:', response);

      // 사진 목록 다시 로드
      await loadPhotos(id);
      
      // 폼 초기화
      setPhotoForm({ photo: null, title: '', description: '' });
      setPhotoPreview(null);
      setShowPhotoUploadModal(false);
      
      alert('사진이 성공적으로 업로드되었습니다.');
    } catch (error) {
      console.error('❌ 사진 업로드 실패:', error);
      alert('사진 업로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  // 파일 선택 핸들러
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 파일 타입 검증
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드할 수 있습니다.');
        return;
      }
      
      // 파일 크기 검증 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.');
        return;
      }

      setPhotoForm({ ...photoForm, photo: file });
      
      // 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // 업로드 모달 닫기
  const handleCloseUploadModal = () => {
    setShowPhotoUploadModal(false);
    setPhotoForm({ photo: null, title: '', description: '' });
    setPhotoPreview(null);
  };

  // 사진 삭제 함수
  const handleDeletePhoto = async (photoId) => {
    try {
      console.log('🔗 사진 삭제 시작 - Photo ID:', photoId);
      await apiService.deletePhoto(photoId);
      console.log('✅ 사진 삭제 성공');
      
      // 사진 목록 다시 로드
      await loadPhotos(id);
      setShowPhotoModal(false);
      
      alert('사진이 삭제되었습니다.');
    } catch (error) {
      console.error('❌ 사진 삭제 실패:', error);
      alert('사진 삭제에 실패했습니다.');
    }
  };

  const handleGuestbookSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.createComment(id, guestbookEntry);
      setGuestbookList([response, ...guestbookList]);
      setGuestbookEntry({ name: '', content: '', relationship: '' });
      setShowGuestbookModal(false);
      alert('소중한 위로의 말씀이 등록되었습니다.');
    } catch (error) {
      console.error("Error creating comment:", error);
      
      // CORS 에러인지 확인
      if (error.message === 'Network Error' && error.code === 'ERR_NETWORK') {
        alert("네트워크 연결 문제가 발생했습니다. (CORS 설정 확인 필요)");
      } else {
        alert("방명록 작성에 실패했습니다.");
      }
    }
  };

  // 댓글 수정 함수
  const handleEditComment = (comment) => {
    setGuestbookEntry({
      name: comment.name,
      content: comment.content,
      relationship: comment.relationship
    });
    setSelectedRibbon(null); // 상세보기 모달 닫기
    setShowGuestbookModal(true); // 편집 모달 열기
    // TODO: 수정 모드 상태 추가 (새로 생성 vs 수정 구분)
  };

  // 댓글 삭제 함수
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await apiService.deleteComment(commentId);
      
      // 댓글 목록에서 삭제된 댓글 제거
      setGuestbookList(guestbookList.filter(comment => comment.commentId !== commentId));
      setSelectedRibbon(null); // 상세보기 모달 닫기
      
      alert('댓글이 삭제되었습니다.');
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
    setShowPhotoModal(true);
  };

  // 탭 전환 함수들
  const switchToVideo = () => setActiveTab('video');
  const switchToPhotos = () => setActiveTab('photos');

  // 마우스 휠 이벤트 핸들러
  const handleRibbonWheel = (e) => {
    // 방명록이 비어있거나 스크롤할 필요가 없는 경우 무시
    if (!guestbookList || guestbookList.length <= ribbonItemsPerView) {
      return;
    }

    const maxIndex = Math.max(0, guestbookList.length - ribbonItemsPerView);
    
    if (e.deltaY > 0) {
      // 아래로 스크롤 - 다음 리본으로
      setRibbonScrollIndex(prev => Math.min(maxIndex, prev + 1));
    } else {
      // 위로 스크롤 - 이전 리본으로
      setRibbonScrollIndex(prev => Math.max(0, prev - 1));
    }
  };

  // 관리페이지 이동
  const goToSettings = () => {
    if (isUserAccess) {
      navigate(`/user-memorial/${id}/settings`);
    } else {
      navigate(`/memorial/${id}/settings`);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper" style={{
        '--navbar-height': '62px',
        height: 'calc(100vh - var(--navbar-height))',
        background: 'linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23B8860B" fill-opacity="0.12"%3E%3Cpath d="M40 40L20 20v40h40V20L40 40zm0-20L60 0H20l20 20zm0 20L20 60h40L40 40z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
          opacity: 0.7
        }}></div>
        <div className="text-center" style={{ position: 'relative', zIndex: 1 }}>
          <div className="spinner-border" role="status" style={{ color: '#b8860b' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2" style={{ color: '#2C1F14', fontWeight: '600' }}>추모 페이지를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!memorial) {
    return (
      <div className="page-wrapper" style={{
        '--navbar-height': '62px',
        height: 'calc(100vh - var(--navbar-height))',
        background: 'linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23B8860B" fill-opacity="0.12"%3E%3Cpath d="M40 40L20 20v40h40V20L40 40zm0-20L60 0H20l20 20zm0 20L20 60h40L40 40z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
          opacity: 0.7
        }}></div>
        <div className="text-center" style={{ position: 'relative', zIndex: 1 }}>
          <h4 style={{ color: '#2C1F14', marginBottom: '20px' }}>추모관을 찾을 수 없습니다.</h4>
          <Button 
            style={{
              background: 'linear-gradient(135deg, #b8860b, #965a25)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              fontWeight: '600',
              borderRadius: '12px',
              padding: '12px 24px'
            }}
            onClick={() => navigate('/menu4')}
          >
            목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper" style={{
      '--navbar-height': '62px',
      height: 'calc(100vh - var(--navbar-height))',
      background: 'linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>

      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23B8860B" fill-opacity="0.12"%3E%3Cpath d="M40 40L20 20v40h40V20L40 40zm0-20L60 0H20l20 20zm0 20L20 60h40L40 40z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
        opacity: 0.7
      }}></div>

      <div className={`memorial-container ${animateCard ? 'animate-in' : ''}`} style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '1600px',
        height: '100%', 
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        background: 'rgba(255, 251, 235, 0.95)',
        boxShadow: '0 20px 60px rgba(44, 31, 20, 0.4)',
        backdropFilter: 'blur(15px)',
        padding: '24px',
        borderRadius: '28px',
        border: '2px solid rgba(184, 134, 11, 0.35)',
        overflow: 'hidden'
      }}>
               {/* 프로필 섹션 (수정됨) */}
        <div style={{ marginBottom: '20px' }}>
          <div className="memorial-profile-section p-3" style={{
            background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.12) 0%, rgba(205, 133, 63, 0.08) 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(184, 134, 11, 0.2)',
            boxShadow: '0 4px 20px rgba(44, 31, 20, 0.12)',
            color: '#2C1F14',
            position: 'relative'
          }}>
            {canAccessSettings && (
              <Button
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'linear-gradient(135deg, #b8860b, #965a25)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  fontWeight: '600',
                  borderRadius: '10px',
                  padding: '6px 20px',
                  fontSize: '14px',
                  boxShadow: '0 4px 15px rgba(44, 31, 20, 0.2)',
                  zIndex: 10
                }}
                onClick={goToSettings}
              >
                관리 페이지
              </Button>
            )}
            <button
              type="button"
              className="back-btn"
              onClick={() => {
                if (isGuestAccess) { window.history.back(); }
                else if (isUserAccess) { navigate('/lobby'); }
                else if (isAdminAccess) { navigate('/menu4'); }
              }}
              style={{ height: '40px', padding: '0 16px', fontSize: '14px' }} // 버튼 크기 조정
            >
              <ArrowLeft size={14} style={{ marginRight: '5px' }} />
              돌아가기
            </button>
            
            <Row className="align-items-center">
              <Col md={3} className="text-center">
                <div className="memorial-profile-image" style={{
                  width: '140px', // 크기 축소
                  height: '175px', // 크기 축소
                  background: memorial.imageUrl 
                    ? `url(${memorial.imageUrl})` 
                    : 'linear-gradient(135deg, rgba(184, 134, 11, 0.15) 0%, rgba(205, 133, 63, 0.1) 100%)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '15px',
                  border: '3px solid rgba(184, 134, 11, 0.3)',
                  margin: '0 auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {!memorial.imageUrl && (
                    <i className="fas fa-user fa-3x" style={{ color: '#b8860b' }}></i>
                  )}
                </div>
                <h5 className="mt-2 mb-0" style={{ color: '#2C1F14', fontWeight: '600', fontSize: '0.9rem' }}>프로필사진01</h5>
              </Col>
              
              <Col md={9}>
                <div className="memorial-info-text">
                  <h1 style={{ fontSize: '2.0rem', fontWeight: '700', color: '#2C1F14', marginBottom: '0.30rem' }}>
                    삼가 故人의 冥福을 빕니다
                  </h1>
                  <div className="memorial-basic-info mb-3">
                    <Row>
                      <Col md={6}>
                        <div className="info-item" style={{ color: '#495057', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                          <strong>성함:</strong> {memorial.name}
                        </div>
                        <div className="info-item" style={{ color: '#495057', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                          <strong>나이:</strong> {memorial.age}세
                        </div>
                        <div className="info-item" style={{ color: '#495057', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                          <strong>성별:</strong> {memorial.gender === 'MALE' ? '남성' : '여성'}
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="info-item" style={{ color: '#495057', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                          <strong>생년월일:</strong> {memorial.birthOfDate}
                        </div>
                        <div className="info-item" style={{ color: '#495057', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                          <strong>별세일:</strong> {memorial.deceasedDate}
                        </div>
                        <div className="info-item" style={{ color: '#495057', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                          <strong>고객ID:</strong> {memorial.customerId}
                        </div>
                      </Col>
                    </Row>
                  </div>
                  
                  <div className="memorial-description" style={{ color: '#495057' }}>
                    <p className="lead" style={{ fontSize: '1rem' }}>
                      사랑하는 가족과 친구들에게 많은 사랑을 받았던 고인의 생전 모습과 
                      추억들을 이곳에서 영원히 기억하며 보존하겠습니다.
                    </p>
                    <p style={{ fontSize: '0.9rem' }}>
                      따뜻한 마음과 밝은 미소로 주변 사람들에게 기쁨을 주었던 분입니다. 
                      가족들과 함께한 소중한 시간들, 친구들과의 즐거운 추억들이 
                      이곳에서 계속해서 이어져 나갈 것입니다.
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div className="memorial-detail-scroll-area" style={{ flex: '1', overflowY: 'auto', overflowX: 'hidden', height: '100%' }}>
          <Row>
          {/* 좌측: 영상/사진첩 + 방명록 리본 */}
          <Col lg={8}>
            <Row>
              {/* 상단: 추모영상과 사진첩 - 겹쳐진 탭 구조 */}
              <Col lg={12}>
                <div className="memorial-tabs-container position-relative mb-4" style={{ 
                  borderRadius: '16px', 
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.12) 0%, rgba(205, 133, 63, 0.08) 100%)',
                  boxShadow: '0 4px 20px rgba(44, 31, 20, 0.12)',
                  border: '1px solid rgba(184, 134, 11, 0.2)'
                }}>
                  
                  {/* 탭 헤더들 */}
                  <div className="memorial-tabs-header" style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    right: '0',
                    zIndex: 10,
                    padding: '20px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}>
                    {/* 추모영상 탭 헤더 */}
                    <div
                      className={`tab-header ${activeTab === 'video' ? 'active' : ''}`}
                      style={{
                        flex: '1 1 auto',
                        textAlign: 'center',
                        background: activeTab === 'video'
                          ? 'rgba(255, 251, 235, 0.95)'
                          : 'rgba(248, 249, 250, 0.7)',
                        borderRadius: '15px',
                        padding: '15px 20px',
                        border: 'none',
                        boxShadow: activeTab === 'video' ? '0 2px 10px rgba(44, 31, 20, 0.15)' : 'none',
                        zIndex: activeTab === 'video' ? 12 : 11,
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                      }}
                      onClick={switchToVideo}
                    >
                      <h5 className="mb-0" style={{ color: '#2C1F14', fontSize: '1rem' }}>
                        <i className="fas fa-play me-2"></i>
                        추모영상 01
                      </h5>
                    </div>

                    {/* 사진첩 탭 헤더 */}
                    <div
                      className={`tab-header ${activeTab === 'photos' ? 'active' : ''}`}
                      style={{
                        flex: '1 1 auto',
                        textAlign: 'center',
                        background: activeTab === 'photos'
                          ? 'rgba(255, 251, 235, 0.95)'
                          : 'rgba(248, 249, 250, 0.7)',
                        borderRadius: '15px',
                        padding: '15px 20px',
                        border: 'none',
                        boxShadow: activeTab === 'photos' ? '0 2px 10px rgba(44, 31, 20, 0.15)' : 'none',
                        zIndex: activeTab === 'photos' ? 12 : 11,
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                      }}
                      onClick={switchToPhotos}
                    >
                      <div className="d-flex align-items-center justify-content-center">
                        <h5 className="mb-0 me-2" style={{ color: '#2C1F14', fontSize: '1rem' }}>
                          <i className="fas fa-images me-2"></i>
                          사진첩
                        </h5>
                        <small className="text-muted d-none d-sm-inline">(스크롤 형식)</small>
                      </div>
                    </div>
                  </div>

                  {/* 탭 콘텐츠 영역 */}
                  <div className="memorial-tabs-content" style={{ 
                    background: 'rgba(255, 251, 235, 0.95)',
                    borderRadius: '16px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    
                    {/* 추모영상 콘텐츠 */}
                    <div 
                      className={`tab-content ${activeTab === 'video' ? 'active' : ''}`}
                      style={{
                        display: activeTab === 'video' ? 'block' : 'none',
                        padding: '120px 20px 20px',
                        minHeight: '350px'
                      }}
                    >
                      {videoUrl ? (
                          <video src={videoUrl} controls style={{ width: '100%', borderRadius: '12px' }} />
                      ) : (
                          <div className="memorial-video-container" style={{
                            width: '100%',
                            aspectRatio: '16 / 9',
                            background: 'linear-gradient(135deg, #b8860b 0%, #965a25 100%)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                          }}>
                            <div className="text-center">
                              <i className="fas fa-play-circle fa-3x mb-2" style={{ opacity: 0.8 }}></i>
                              <h5>추모영상</h5>
                              <p className="small">AI로 생성된 추모영상</p>
                              <Button 
                                variant="light"
                                style={{
                                  background: 'rgba(255, 251, 235, 0.9)',
                                  color: '#2C1F14',
                                  border: 'none'
                                }}
                              >
                                <i className="fas fa-play me-2"></i>
                                재생하기
                              </Button>
                            </div>
                          </div>
                      )}
                    </div>

                    {/* 사진첩 콘텐츠 */}
                    <div 
                      className={`tab-content ${activeTab === 'photos' ? 'active' : ''}`}
                      style={{
                        display: activeTab === 'photos' ? 'block' : 'none',
                        padding: '120px 20px 20px',
                        minHeight: '450px',
                        overflowY: 'auto'
                      }}
                    >
                      {/* 사진 업로드 버튼 (유가족/관리자만) */}
                      {canAccessSettings && (
                        <div className="mb-4 text-end">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => setShowPhotoUploadModal(true)}
                            style={{
                              borderColor: '#B8860B',
                              color: '#B8860B',
                              background: 'rgba(184, 134, 11, 0.1)'
                            }}
                            className="hover-golden"
                          >
                            <i className="fas fa-plus me-2"></i>
                            사진 추가
                          </Button>
                        </div>
                      )}

                      {photos && photos.length > 0 ? (
                        <Row xs={1} sm={2} md={2} lg={2} className="g-4">
                          {photos.map((photo, index) => (
                            <Col key={photo.photoId || index}>
                              <Card 
                                className="h-100 photo-card" 
                                onClick={() => handlePhotoClick(photo)}
                                style={{ 
                                  cursor: 'pointer', 
                                  overflow: 'hidden',
                                  transition: 'transform 0.3s ease'
                                }}
                              >
                                <Card.Img 
                                  variant="top" 
                                  src={photo.photoUrl} 
                                  alt={photo.title}
                                  style={{ 
                                    height: '200px', 
                                    objectFit: 'cover', 
                                    transition: 'transform 0.3s ease' 
                                  }}
                                />
                                <Card.Body className="p-3">
                                  <Card.Title 
                                    className="h6 mb-1" 
                                    style={{ 
                                      fontSize: '0.9rem',
                                      color: '#2C1F14',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap'
                                    }}
                                  >
                                    {photo.title}
                                  </Card.Title>
                                  {photo.description && (
                                    <Card.Text 
                                      className="small text-muted mb-2"
                                      style={{
                                        fontSize: '0.8rem',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                      }}
                                    >
                                      {photo.description}
                                    </Card.Text>
                                  )}
                                  <small className="text-muted">
                                    {new Date(photo.uploadedAt).toLocaleDateString('ko-KR')}
                                  </small>
                                </Card.Body>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      ) : (
                        <div className="text-center text-muted p-5">
                          <i className="fas fa-images fa-3x mb-3" style={{ opacity: 0.5 }}></i>
                          <p className="mb-3">등록된 사진이 없습니다.</p>
                          {canAccessSettings && (
                            <Button
                              variant="outline-primary"
                              onClick={() => setShowPhotoUploadModal(true)}
                              style={{
                                borderColor: '#B8860B',
                                color: '#B8860B',
                                background: 'rgba(184, 134, 11, 0.1)'
                              }}
                            >
                              <i className="fas fa-plus me-2"></i>
                              첫 번째 사진 추가하기
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </Col>
            </Row>

            {/* 하단: 리본 방명록 */}
            <Row className="mt-4">
              <Col lg={12}>
                <div className="ribbon-guestbook-container" style={{
                  background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.12) 0%, rgba(205, 133, 63, 0.08) 100%)',
                  borderRadius: '16px',
                  padding: '2rem',
                  minHeight: '380px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(44, 31, 20, 0.12)',
                  border: '1px solid rgba(184, 134, 11, 0.2)'
                }}>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0" style={{ color: '#2C1F14' }}>
                      <i className="fas fa-ribbon me-2"></i>
                      방명록 리본
                    </h5>
                    {guestbookList.length > ribbonItemsPerView && (
                      <div className="ribbon-controls">
                        <button 
                          className="btn btn-sm me-2"
                          onClick={() => setRibbonScrollIndex(Math.max(0, ribbonScrollIndex - 1))}
                          disabled={ribbonScrollIndex === 0}
                          style={{ 
                            border: 'none', 
                            background: 'linear-gradient(135deg, #b8860b, #965a25)',
                            color: '#fff',
                            borderRadius: '8px'
                          }}
                        >
                          <i className="fas fa-chevron-left"></i>
                        </button>
                        <span className="text-muted small mx-2">
                          {ribbonScrollIndex + 1}-{Math.min(ribbonScrollIndex + ribbonItemsPerView, guestbookList.length)} / {guestbookList.length}
                        </span>
                        <button 
                          className="btn btn-sm ms-2"
                          onClick={() => setRibbonScrollIndex(Math.min(guestbookList.length - ribbonItemsPerView, ribbonScrollIndex + 1))}
                          disabled={ribbonScrollIndex >= guestbookList.length - ribbonItemsPerView}
                          style={{ 
                            border: 'none', 
                            background: 'linear-gradient(135deg, #b8860b, #965a25)',
                            color: '#fff',
                            borderRadius: '8px'
                          }}
                        >
                          <i className="fas fa-chevron-right"></i>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div 
                    className="ribbon-scroll-container" 
                    style={{
                      height: '300px',
                      perspective: '1200px',
                      position: 'relative',
                      overflow: 'hidden',
                      maxWidth: '1200px',
                      margin: '0 auto',
                      padding: '10px 0'
                    }}
                    onWheel={handleRibbonWheel}
                  >
                    <div className="ribbon-items-wrapper" style={{
                      display: 'flex',
                      gap: '20px',
                      transform: `translateX(-${ribbonScrollIndex * ribbonItemWidth}px)`,
                      transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      height: '100%',
                      alignItems: 'flex-start',
                      paddingTop: '20px',
                      justifyContent: 'flex-start'
                    }}>
                      {guestbookList.map((entry, index) => (
                        <div
                          key={entry.id}
                          className="ribbon-item"
                          style={{
                            width: '200px',
                            minWidth: '200px',
                            maxWidth: '200px',
                            height: '350px',
                            position: 'relative',
                            cursor: 'pointer',
                            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: `rotateY(${Math.max(0, index - ribbonScrollIndex) * -5}deg) translateZ(${Math.max(0, index - ribbonScrollIndex) * -15}px)`,
                            zIndex: guestbookList.length - Math.abs(index - ribbonScrollIndex),
                            transformOrigin: 'center top',
                            flexShrink: 0
                          }}
                          onClick={() => {
                            setSelectedRibbon(entry);
                            setShowRibbonDetailModal(true);
                          }}
                          onMouseEnter={(e) => {
                            const ribbonItem = e.currentTarget;
                            const ribbonBody = ribbonItem.querySelector('.ribbon-body');
                            const ribbonTailWrapper = ribbonItem.querySelector('.ribbon-tail-wrapper');
                            
                            ribbonItem.style.transform = `rotateY(${Math.max(0, index - ribbonScrollIndex) * -5}deg) translateZ(${Math.max(0, index - ribbonScrollIndex) * -15 + 15}px) scale(1.05)`;
                            ribbonItem.style.filter = 'brightness(1.1)';
                            
                            if (ribbonBody) {
                              ribbonBody.style.transform = 'translateY(-5px)';
                            }
                            if (ribbonTailWrapper) {
                              ribbonTailWrapper.style.transform = 'translateY(-5px)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            const ribbonItem = e.currentTarget;
                            const ribbonBody = ribbonItem.querySelector('.ribbon-body');
                            const ribbonTailWrapper = ribbonItem.querySelector('.ribbon-tail-wrapper');
                            
                            ribbonItem.style.transform = `rotateY(${Math.max(0, index - ribbonScrollIndex) * -5}deg) translateZ(${Math.max(0, index - ribbonScrollIndex) * -15}px)`;
                            ribbonItem.style.filter = 'brightness(1)';
                            
                            if (ribbonBody) {
                              ribbonBody.style.transform = 'translateY(0)';
                            }
                            if (ribbonTailWrapper) {
                              ribbonTailWrapper.style.transform = 'translateY(0)';
                            }
                          }}
                        >
                          {/* 실제 리본 모양 */}
                          <div className="ribbon-body" style={{
                            width: '100%',
                            height: '280px',
                            background: `linear-gradient(135deg, 
                              ${index % 4 === 0 ? '#b8860b' : index % 4 === 1 ? '#965a25' : index % 4 === 2 ? '#cd853f' : '#daa520'} 0%, 
                              ${index % 4 === 0 ? '#965a25' : index % 4 === 1 ? '#b8860b' : index % 4 === 2 ? '#b8860b' : '#cd853f'} 100%)`,
                            borderRadius: '12px',
                            color: 'white',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            padding: '25px 20px',
                            boxShadow: '0 8px 25px rgba(44, 31, 20, 0.3)',
                            border: 'none',
                            position: 'relative',
                            overflow: 'visible',
                            textAlign: 'center'
                          }}>
                            {/* 헤더 영역 */}
                            <div className="ribbon-header" style={{
                              textAlign: 'center',
                              marginBottom: '20px',
                              borderBottom: '1px solid rgba(255,255,255,0.3)',
                              paddingBottom: '15px'
                            }}>
                              <div style={{ 
                                fontSize: '1.25rem',
                                fontWeight: 'bold',
                                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                marginBottom: '8px',
                                lineHeight: '1.3'
                              }}>
                                {entry.name}
                              </div>
                              <div style={{ 
                                fontSize: '0.95rem',
                                opacity: 0.9,
                                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                                marginBottom: '5px',
                                lineHeight: '1.2'
                              }}>
                                {entry.relationship}
                              </div>
                              <div style={{ 
                                fontSize: '0.8rem',
                                opacity: 0.8,
                                marginTop: '5px',
                                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                                lineHeight: '1.2'
                              }}>
                                {entry.date}
                              </div>
                            </div>
                            
                            {/* 메시지 영역 */}
                            <div className="ribbon-message" style={{
                              flex: 1,
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              textAlign: 'center',
                              padding: '10px 0'
                            }}>
                              <div style={{
                                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                                lineHeight: '1.5',
                                fontSize: '0.95rem',
                                overflow: 'visible',
                                display: '-webkit-box',
                                WebkitLineClamp: 5,
                                WebkitBoxOrient: 'vertical',
                                wordWrap: 'break-word'
                              }}>
                                {entry.content}
                              </div>
                              
                              {entry.content.length > 80 && (
                                <div style={{
                                  marginTop: '10px',
                                  fontSize: '0.75rem',
                                  opacity: 0.8,
                                  fontStyle: 'italic'
                                }}>
                                  클릭하여 전체보기
                                </div>
                              )}
                            </div>
                            
                            {/* 하단 아이콘 */}
                            <div className="ribbon-footer" style={{
                              textAlign: 'center',
                              marginTop: '15px'
                            }}>
                              <div style={{
                                width: '30px',
                                height: '30px',
                                background: 'rgba(255,255,255,0.25)',
                                borderRadius: '50%',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid rgba(255,255,255,0.4)'
                              }}>
                                <i className="fas fa-heart" style={{ 
                                  fontSize: '0.8rem',
                                  color: 'white',
                                  textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                                }}></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {guestbookList.length === 0 && (
                      <div className="text-center" style={{ 
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: '#b8860b'
                      }}>
                        <i className="fas fa-ribbon fa-3x mb-3 opacity-50"></i>
                        <p>첫 번째 리본을 남겨주세요</p>
                      </div>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </Col>

          {/* 우측: 추모사 + 위로의 말 전하기 */}
          <Col lg={4}>
            {/* 추모사 */}
            <Card className="mb-4" style={{ 
              borderRadius: '16px', 
              border: '1px solid rgba(184, 134, 11, 0.2)', 
              background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.12) 0%, rgba(205, 133, 63, 0.08) 100%)',
              boxShadow: '0 4px 20px rgba(44, 31, 20, 0.12)' 
            }}>
              <Card.Header style={{ 
                background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.15) 0%, rgba(205, 133, 63, 0.1) 100%)',
                borderRadius: '16px 16px 0 0',
                border: 'none'
              }}>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0" style={{ color: '#2C1F14' }}>
                    <i className="fas fa-heart me-2"></i>
                    추모사
                  </h5>
                </div>
              </Card.Header>
              <Card.Body className="p-4" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <div className="memorial-eulogy">
                  {memorial.eulogy ? (
                      <div className="eulogy-content" style={{ 
                        lineHeight: '1.8', 
                        fontSize: '0.9rem',
                        color: '#495057',
                        whiteSpace: 'pre-line'
                      }}>
                          {memorial.eulogy}
                      </div>
                  ) : (
                      <div className="text-center text-muted">
                          <p>등록된 추모사가 없습니다.</p>
                      </div>
                  )}
                </div>
              </Card.Body>
            </Card>

            {/* 위로의 말 전하기 */}
            <Card className="mb-4" style={{ 
              borderRadius: '16px', 
              border: '1px solid rgba(184, 134, 11, 0.2)', 
              background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.12) 0%, rgba(205, 133, 63, 0.08) 100%)',
              boxShadow: '0 4px 20px rgba(44, 31, 20, 0.12)' 
            }}>
              <Card.Header style={{ 
                background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.15) 0%, rgba(205, 133, 63, 0.1) 100%)',
                borderRadius: '16px 16px 0 0',
                border: 'none'
              }}>
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0" style={{ color: '#2C1F14' }}>
                    <i className="fas fa-book me-2"></i>
                    위로의 말 전하기
                  </h6>
                  <Button 
                    size="sm"
                    onClick={() => setShowGuestbookModal(true)}
                    style={{
                      background: 'linear-gradient(135deg, #b8860b, #965a25)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#fff',
                      fontWeight: '600',
                      borderRadius: '8px'
                    }}
                  >
                    <i className="fas fa-edit me-1"></i>
                    작성
                  </Button>
                </div>
              </Card.Header>
              <Card.Body className="p-3">
                <div className="text-center text-muted">
                  <i className="fas fa-ribbon fa-2x mb-2" style={{ color: '#b8860b' }}></i>
                  <p className="small mb-0">소중한 추억과 위로의 말을<br/>아름다운 리본으로 남겨주세요</p>
                </div>
              </Card.Body>
            </Card>

            {/* 공유 버튼 */}
            <Card style={{ 
              borderRadius: '16px', 
              border: '1px solid rgba(184, 134, 11, 0.2)', 
              background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.12) 0%, rgba(205, 133, 63, 0.08) 100%)',
              boxShadow: '0 4px 20px rgba(44, 31, 20, 0.12)' 
            }}>
              <Card.Body className="text-center p-3">
                <Button 
                  className="w-100"
                  style={{
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #b8860b, #965a25)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    fontWeight: '600',
                    padding: '12px'
                  }}
                >
                  <i className="fas fa-share-alt me-2"></i>
                  공유하기
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        </div>
      </div>

      {/* 방명록 작성 모달 */}
      <Modal show={showGuestbookModal} onHide={() => setShowGuestbookModal(false)}>
        <Modal.Header closeButton style={{ background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.12) 0%, rgba(205, 133, 63, 0.08) 100%)' }}>
          <Modal.Title style={{ color: '#2C1F14' }}>
            <i className="fas fa-ribbon me-2"></i>
            위로의 리본 남기기
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: 'rgba(255, 251, 235, 0.95)' }}>
          <div className="text-center mb-3">
            <p className="text-muted">
              <i className="fas fa-heart me-2"></i>
              작성하신 위로의 말씀이 아름다운 리본으로 표시됩니다
            </p>
          </div>
          <Form onSubmit={handleGuestbookSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>성명</Form.Label>
              <Form.Control
                type="text"
                value={guestbookEntry.name}
                onChange={(e) => setGuestbookEntry({
                  ...guestbookEntry,
                  name: e.target.value
                })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>관계</Form.Label>
              <Form.Select
                value={guestbookEntry.relationship}
                onChange={(e) => setGuestbookEntry({
                  ...guestbookEntry,
                  relationship: e.target.value
                })}
                required
              >
                <option value="">선택하세요</option>
                <option value="가족">가족</option>
                <option value="친구">친구</option>
                <option value="동료">동료</option>
                <option value="지인">지인</option>
                <option value="기타">기타</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>위로의 말</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={guestbookEntry.content}
                onChange={(e) => setGuestbookEntry({
                  ...guestbookEntry,
                  content: e.target.value
                })}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ background: 'rgba(255, 251, 235, 0.95)' }}>
          <Button variant="secondary" onClick={() => setShowGuestbookModal(false)}>
            취소
          </Button>
          <Button 
            onClick={handleGuestbookSubmit}
            style={{
              background: 'linear-gradient(135deg, #b8860b, #965a25)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              fontWeight: '600'
            }}
          >
            <i className="fas fa-ribbon me-2"></i>
            리본으로 등록하기
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 리본 상세보기 모달 */}
      <Modal 
        show={showRibbonDetailModal} 
        onHide={() => setShowRibbonDetailModal(false)}
        size="lg"
        centered
      >
        <Modal.Header 
          closeButton
          style={{
            background: selectedRibbon ? `linear-gradient(135deg, 
              ${selectedRibbon.id % 4 === 1 ? '#b8860b' : selectedRibbon.id % 4 === 2 ? '#965a25' : selectedRibbon.id % 4 === 3 ? '#cd853f' : '#daa520'} 0%, 
              ${selectedRibbon.id % 4 === 1 ? '#965a25' : selectedRibbon.id % 4 === 2 ? '#b8860b' : selectedRibbon.id % 4 === 3 ? '#b8860b' : '#cd853f'} 100%)` : '#f8f9fa',
            color: 'white',
            border: 'none'
          }}
        >
          <Modal.Title style={{ display: 'flex', alignItems: 'center' }}>
            <i className="fas fa-ribbon me-2"></i>
            {selectedRibbon?.name}님의 위로의 말
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ 
          padding: '2rem',
          background: 'rgba(255, 251, 235, 0.95)'
        }}>
          {selectedRibbon && (
            <>
              <div className="ribbon-detail-header mb-4">
                <Row>
                  <Col md={8}>
                    <h5 className="mb-2" style={{ color: '#b8860b' }}>
                      <i className="fas fa-user me-2"></i>
                      {selectedRibbon.name}
                    </h5>
                    <p className="text-muted mb-1">
                      <i className="fas fa-heart me-2"></i>
                      관계: {selectedRibbon.relationship}
                    </p>
                    <p className="text-muted">
                      <i className="fas fa-calendar-alt me-2"></i>
                      작성일: {selectedRibbon.date}
                    </p>
                  </Col>
                  <Col md={4} className="text-end">
                    <div style={{
                      width: '80px',
                      height: '80px',
                      background: selectedRibbon ? `linear-gradient(135deg, 
                        ${selectedRibbon.id % 4 === 1 ? '#b8860b' : selectedRibbon.id % 4 === 2 ? '#965a25' : selectedRibbon.id % 4 === 3 ? '#cd853f' : '#daa520'} 0%, 
                        ${selectedRibbon.id % 4 === 1 ? '#965a25' : selectedRibbon.id % 4 === 2 ? '#b8860b' : selectedRibbon.id % 4 === 3 ? '#b8860b' : '#cd853f'} 100%)` : '#f8f9fa',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      boxShadow: '0 4px 15px rgba(44, 31, 20, 0.2)'
                    }}>
                      <i className="fas fa-heart fa-2x" style={{ color: 'white' }}></i>
                    </div>
                  </Col>
                </Row>
              </div>
              
              <hr style={{ margin: '2rem 0' }} />
              
              <div className="ribbon-detail-message">
                <h6 className="text-secondary mb-3">
                  <i className="fas fa-quote-left me-2"></i>
                  위로의 말씀
                </h6>
                <div 
                  style={{
                    background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.12) 0%, rgba(205, 133, 63, 0.08) 100%)',
                    borderLeft: '4px solid #b8860b',
                    padding: '1.5rem',
                    borderRadius: '0 8px 8px 0',
                    lineHeight: '1.8',
                    fontSize: '1.1rem',
                    color: '#495057',
                    fontStyle: 'italic'
                  }}
                >
                  {selectedRibbon.content}
                </div>
              </div>
              
              <div className="text-center mt-4">
                <small className="text-muted">
                  <i className="fas fa-heart me-1"></i>
                  따뜻한 마음으로 전해진 위로의 말씀입니다
                </small>
                
                {/* 댓글 작성자만 수정/삭제 가능 (임시로 모든 사용자가 가능하도록 설정) */}
                <div className="mt-3">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEditComment(selectedRibbon)}
                  >
                    <i className="fas fa-edit me-1"></i>
                    수정
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteComment(selectedRibbon.commentId)}
                  >
                    <i className="fas fa-trash me-1"></i>
                    삭제
                  </Button>
                </div>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer style={{ background: 'rgba(255, 251, 235, 0.95)', border: 'none' }}>
          <Button 
            variant="secondary" 
            onClick={() => setShowRibbonDetailModal(false)}
          >
            닫기
          </Button>
          <Button 
            style={{
              background: selectedRibbon ? `linear-gradient(135deg, 
                ${selectedRibbon.id % 4 === 1 ? '#b8860b' : selectedRibbon.id % 4 === 2 ? '#965a25' : selectedRibbon.id % 4 === 3 ? '#cd853f' : '#daa520'} 0%, 
                ${selectedRibbon.id % 4 === 1 ? '#965a25' : selectedRibbon.id % 4 === 2 ? '#b8860b' : selectedRibbon.id % 4 === 3 ? '#b8860b' : '#cd853f'} 100%)` : '#b8860b',
              border: 'none',
              color: '#fff'
            }}
            onClick={() => {
              // 공유 기능 구현 예정
              alert('공유 기능은 곧 구현될 예정입니다.');
            }}
          >
            <i className="fas fa-share-alt me-2"></i>
            공유하기
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 사진 업로드 모달 */}
      <Modal 
        show={showPhotoUploadModal} 
        onHide={handleCloseUploadModal}
        size="lg"
        centered
        backdrop="static"
      >
        <Modal.Header 
          closeButton
          style={{ 
            background: 'linear-gradient(135deg, #b8860b 0%, #965a25 100%)',
            color: 'white',
            border: 'none'
          }}
        >
          <Modal.Title style={{ display: 'flex', alignItems: 'center' }}>
            <i className="fas fa-camera me-2"></i>
            사진 업로드
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ 
          padding: '2rem',
          background: 'rgba(255, 251, 235, 0.95)'
        }}>
          <Form onSubmit={handlePhotoUpload}>
            {/* 파일 선택 */}
            <Form.Group className="mb-4">
              <Form.Label style={{ color: '#2C1F14', fontWeight: '600' }}>
                <i className="fas fa-image me-2"></i>
                사진 선택
              </Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                required
                style={{
                  border: '2px dashed #B8860B',
                  borderRadius: '8px',
                  padding: '1rem'
                }}
              />
              <Form.Text className="text-muted">
                JPG, PNG, GIF 파일만 업로드 가능 (최대 5MB)
              </Form.Text>
            </Form.Group>

            {/* 미리보기 */}
            {photoPreview && (
              <div className="mb-4 text-center">
                <img 
                  src={photoPreview} 
                  alt="미리보기" 
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }}
                />
              </div>
            )}

            {/* 제목 입력 */}
            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#2C1F14', fontWeight: '600' }}>
                <i className="fas fa-heading me-2"></i>
                사진 제목 *
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="사진의 제목을 입력하세요"
                value={photoForm.title}
                onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
                required
                maxLength={100}
                style={{
                  borderColor: '#B8860B',
                  boxShadow: 'none'
                }}
              />
            </Form.Group>

            {/* 설명 입력 */}
            <Form.Group className="mb-4">
              <Form.Label style={{ color: '#2C1F14', fontWeight: '600' }}>
                <i className="fas fa-comment me-2"></i>
                사진 설명
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="사진에 대한 설명을 입력하세요 (선택사항)"
                value={photoForm.description}
                onChange={(e) => setPhotoForm({ ...photoForm, description: e.target.value })}
                maxLength={500}
                style={{
                  borderColor: '#B8860B',
                  boxShadow: 'none',
                  resize: 'vertical'
                }}
              />
            </Form.Group>

            {/* 버튼들 */}
            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="outline-secondary"
                onClick={handleCloseUploadModal}
                disabled={uploadingPhoto}
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={uploadingPhoto || !photoForm.photo || !photoForm.title.trim()}
                style={{
                  background: uploadingPhoto ? '#ccc' : 'linear-gradient(135deg, #b8860b 0%, #965a25 100%)',
                  border: 'none',
                  color: 'white'
                }}
              >
                {uploadingPhoto ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    업로드 중...
                  </>
                ) : (
                  <>
                    <i className="fas fa-upload me-2"></i>
                    업로드
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* 사진 상세보기 모달 */}
      <Modal 
        show={showPhotoModal} 
        onHide={() => setShowPhotoModal(false)} 
        size="xl" 
        centered
      >
        <Modal.Header 
          closeButton
          style={{ 
            background: 'linear-gradient(135deg, #b8860b 0%, #965a25 100%)',
            color: 'white',
            border: 'none'
          }}
        >
          <Modal.Title style={{ display: 'flex', alignItems: 'center' }}>
            <i className="fas fa-image me-2"></i>
            {selectedPhoto?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ 
          padding: '2rem',
          background: 'rgba(255, 251, 235, 0.95)'
        }}>
          {selectedPhoto && (
            <>
              <div className="text-center mb-4">
                <img 
                  src={selectedPhoto.photoUrl} 
                  alt={selectedPhoto.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '60vh',
                    borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}
                />
              </div>
              
              <div className="photo-details">
                <h5 style={{ color: '#2C1F14', fontWeight: '600' }}>
                  {selectedPhoto.title}
                </h5>
                
                {selectedPhoto.description && (
                  <p className="text-muted mb-3" style={{ lineHeight: '1.6' }}>
                    {selectedPhoto.description}
                  </p>
                )}
                
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    <i className="fas fa-calendar-alt me-1"></i>
                    업로드: {selectedPhoto.uploadedAt && new Date(selectedPhoto.uploadedAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </small>
                  
                  {canAccessSettings && (
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          if (window.confirm('이 사진을 삭제하시겠습니까?')) {
                            handleDeletePhoto(selectedPhoto.photoId);
                          }
                        }}
                      >
                        <i className="fas fa-trash me-1"></i>
                        삭제
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .memorial-container {
            opacity: 0;
        }

        .animate-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          height: 45px;
          padding: 0 20px;
          margin-bottom: 1rem;
          box-sizing: border-box;
          background: linear-gradient(135deg, #4A3728, #8B5A2B);
          border: none;
          color: white;
          font-weight: 700;
          font-size: 14px;
          box-shadow: 0 2px 8px rgba(74, 55, 40, 0.35);
          transition: all 0.3s ease;
          border-radius: 8px;
          cursor: pointer;
          white-space: nowrap;
        }

        .back-btn:hover {
          background: linear-gradient(135deg, #3c2d20, #7a4e24);
          transform: scale(1.03);
          box-shadow: 0 4px 12px rgba(74, 55, 40, 0.45);
        }

        .memorial-detail-scroll-area::-webkit-scrollbar {
          width: 6px;
        }
        .memorial-detail-scroll-area::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
        .memorial-detail-scroll-area::-webkit-scrollbar-thumb {
          background-color: rgba(184, 134, 11, 0.5);
          border-radius: 10px;
        }

        .photo-card:hover img {
            transform: scale(1.1);
        }

        /* --- 수정된 반응형 코드 --- */
        @media (max-width: 1200px) {
          .page-wrapper {
            height: auto !important; /* 고정 높이 해제제 */
            min-height: calc(100vh - var(--navbar-height));
            overflow-y: auto !important; /* 전체 페이지 스크롤이 가능하도록 변경 */
            align-items: flex-start !important; /* 컨텐츠를 위쪽으로 정렬 */
          }
          .memorial-container {
            height: auto !important; 
            overflow: visible !important; /* 내용이 넘쳐도 보이도록 설정 */
          }
          .memorial-detail-scroll-area {
            height: auto !important; 
            overflow: visible !important; /* 내부 스크롤을 제거,전체 스크롤을 따르도록 함 */
            flex: none !important; /* flex-grow 속성 제거 */
          }
        }

        
      `}</style>
    </div>
  );
};

export default MemorialDetail;