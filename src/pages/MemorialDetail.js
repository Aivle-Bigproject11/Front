import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal, Form, Badge, Carousel } from 'react-bootstrap';
import { ArrowLeft } from 'lucide-react';
import { dummyData } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const MemorialDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [memorial, setMemorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGuestbookModal, setShowGuestbookModal] = useState(false);
  const [guestbookEntry, setGuestbookEntry] = useState({
    name: '',
    message: '',
    relationship: ''
  });
  const [guestbookList, setGuestbookList] = useState([]);
  const [activeTab, setActiveTab] = useState('video'); // 'video' 또는 'photos'
  const [videoUrl, setVideoUrl] = useState('');
  const [ribbonScrollIndex, setRibbonScrollIndex] = useState(0);
  const ribbonItemsPerView = 4; // 화면에 보이는 리본 개수
  const ribbonItemWidth = 220; // 리본 너비 + 간격
  const [selectedRibbon, setSelectedRibbon] = useState(null);
  const [showRibbonDetailModal, setShowRibbonDetailModal] = useState(false);
  const [animateCard, setAnimateCard] = useState(false);

  // 접근 모드 확인: 고유번호 접근(guest), 유저 로그인(user), 관리자 로그인(admin)
  const isGuestAccess = !user; // 로그인하지 않고 고유번호로 접근
  const isUserAccess = user && user.userType === 'user'; // 유저로 로그인 (유가족)
  const isAdminAccess = user && user.userType === 'employee'; // 관리자로 로그인
  
  // 관리 페이지 접근 권한: 유저(유가족) 또는 관리자
  const canAccessSettings = !isGuestAccess; // 고유번호 접근이 아닌 경우

  useEffect(() => {
    setAnimateCard(true);
    // TODO: 실제 API 호출로 교체
    setTimeout(() => {
      const foundMemorial = dummyData.memorials._embedded.memorials.find(
        m => m.id === parseInt(id)
      );
      setMemorial(foundMemorial);
      if (foundMemorial && foundMemorial.videoUrl) {
        setVideoUrl(foundMemorial.videoUrl);
      }
      
      // 더미 방명록 데이터
      setGuestbookList([
        {
          id: 1,
          name: '김철수',
          message: '좋은 곳에서 편히 쉬세요. 항상 기억하겠습니다. 따뜻한 미소와 친절함을 잊지 못하겠습니다.',
          relationship: '친구',
          date: '2024-01-20'
        },
        {
          id: 2,
          name: '이영희',
          message: '따뜻했던 미소를 잊지 못하겠습니다. 삼가 고인의 명복을 빕니다.',
          relationship: '동료',
          date: '2024-01-18'
        },
        {
          id: 3,
          name: '박민수',
          message: '항상 밝고 긍정적이셨던 모습을 기억하겠습니다. 하늘에서 편히 쉬시길 바랍니다.',
          relationship: '가족',
          date: '2024-01-17'
        },
        {
          id: 4,
          name: '최지원',
          message: '함께했던 소중한 추억들을 가슴에 간직하겠습니다. 감사했습니다.',
          relationship: '지인',
          date: '2024-01-16'
        },
        {
          id: 5,
          name: '강현우',
          message: '언제나 다른 사람을 먼저 생각하시던 모습이 기억에 남습니다. 영원히 기억하겠습니다.',
          relationship: '동료',
          date: '2024-01-15'
        },
        {
          id: 6,
          name: '윤서연',
          message: '고인의 인품과 마음씨를 본받아 살겠습니다. 삼가 고인의 명복을 빕니다.',
          relationship: '친구',
          date: '2024-01-14'
        }
      ]);

      setLoading(false);
    }, 1000);
  }, [id]);

  const handleGuestbookSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      id: guestbookList.length + 1,
      ...guestbookEntry,
      date: new Date().toISOString().split('T')[0]
    };
    setGuestbookList([newEntry, ...guestbookList]);
    setGuestbookEntry({ name: '', message: '', relationship: '' });
    setShowGuestbookModal(false);
  };

  // 탭 전환 함수들
  const switchToVideo = () => setActiveTab('video');
  const switchToPhotos = () => setActiveTab('photos');

  // 마우스 휠 이벤트 핸들러
  const handleRibbonWheel = (e) => {
    e.preventDefault();
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
        {/* 프로필 섹션 */}
        <div style={{ marginBottom: '24px' }}>
          <div className="memorial-profile-section p-4" style={{
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
                  top: '24px',
                  right: '24px',
                  background: 'linear-gradient(135deg, #b8860b, #965a25)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  fontWeight: '600',
                  borderRadius: '12px',
                  padding: '8px 24px',
                  fontSize: '16px',
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
                if (isGuestAccess) {
                  window.history.back();
                } else if (isUserAccess) {
                  navigate('/lobby');
                } else if (isAdminAccess) {
                  navigate('/menu4');
                }
              }}
            >
              <ArrowLeft size={16} style={{ marginRight: '6px' }} />
              돌아가기
            </button>
            
            <Row className="align-items-center">
              <Col md={3} className="text-center">
                <div className="memorial-profile-image" style={{
                  width: '200px',
                  height: '250px',
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
                    <i className="fas fa-user fa-4x" style={{ color: '#b8860b' }}></i>
                  )}
                </div>
                <h5 className="mt-3 mb-0" style={{ color: '#2C1F14', fontWeight: '600' }}>프로필사진01</h5>
              </Col>
              
              <Col md={9}>
                <div className="memorial-info-text">
                  <h1 className="display-4 mb-3" style={{ 
                    fontWeight: '700', 
                    color: '#2C1F14'
                  }}>
                    삼가 故人의 冥福을 빕니다
                  </h1>
                  <div className="memorial-basic-info mb-4">
                    <Row>
                      <Col md={6}>
                        <div className="info-item mb-2" style={{ color: '#495057' }}>
                          <strong>성함:</strong> {memorial.name}
                        </div>
                        <div className="info-item mb-2" style={{ color: '#495057' }}>
                          <strong>나이:</strong> {memorial.age}세
                        </div>
                        <div className="info-item mb-2" style={{ color: '#495057' }}>
                          <strong>성별:</strong> {memorial.gender === 'MALE' ? '남성' : '여성'}
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="info-item mb-2" style={{ color: '#495057' }}>
                          <strong>생년월일:</strong> {memorial.birthOfDate}
                        </div>
                        <div className="info-item mb-2" style={{ color: '#495057' }}>
                          <strong>별세일:</strong> {memorial.deceasedDate}
                        </div>
                        <div className="info-item mb-2" style={{ color: '#495057' }}>
                          <strong>고객ID:</strong> {memorial.customerId}
                        </div>
                      </Col>
                    </Row>
                  </div>
                  
                  <div className="memorial-description" style={{ color: '#495057' }}>
                    <p className="lead">
                      사랑하는 가족과 친구들에게 많은 사랑을 받았던 고인의 생전 모습과 
                      추억들을 이곳에서 영원히 기억하며 보존하겠습니다.
                    </p>
                    <p>
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
                  <div className="memorial-tabs-header position-absolute" style={{ 
                    top: '0', 
                    left: '0', 
                    right: '0', 
                    zIndex: 10,
                    background: 'rgba(184, 134, 11, 0.1)',
                    padding: '0'
                  }}>
                    {/* 추모영상 탭 헤더 */}
                    <div 
                      className={`tab-header ${activeTab === 'video' ? 'active' : ''}`}
                      style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        background: activeTab === 'video' 
                          ? 'rgba(255, 251, 235, 0.95)' 
                          : 'rgba(248, 249, 250, 0.7)',
                        borderRadius: '15px 15px 0 0',
                        padding: '15px 20px',
                        border: 'none',
                        boxShadow: activeTab === 'video' ? '0 -2px 10px rgba(44, 31, 20, 0.1)' : 'none',
                        zIndex: activeTab === 'video' ? 12 : 11,
                        transform: activeTab === 'video' ? 'translateY(0)' : 'translateY(5px)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <h5 className="mb-0" style={{ color: '#2C1F14' }}>
                        <i className="fas fa-play me-2"></i>
                        추모영상 01
                      </h5>
                    </div>

                    {/* 사진첩 탭 헤더 */}
                    <div 
                      className={`tab-header ${activeTab === 'photos' ? 'active' : ''}`}
                      style={{
                        position: 'absolute',
                        top: '20px',
                        left: '180px',
                        background: activeTab === 'photos' 
                          ? 'rgba(255, 251, 235, 0.95)' 
                          : 'rgba(248, 249, 250, 0.7)',
                        borderRadius: '15px 15px 0 0',
                        padding: '15px 20px',
                        border: 'none',
                        boxShadow: activeTab === 'photos' ? '0 -2px 10px rgba(44, 31, 20, 0.1)' : 'none',
                        zIndex: activeTab === 'photos' ? 12 : 11,
                        transform: activeTab === 'photos' ? 'translateY(0)' : 'translateY(5px)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <h5 className="mb-0 me-3" style={{ color: '#2C1F14' }}>
                          <i className="fas fa-images me-2"></i>
                          사진첩
                        </h5>
                        <small className="text-muted">(스크롤 형식)</small>
                      </div>
                    </div>
                  </div>

                  {/* 좌우 전환 버튼들 */}
                  <Button
                    style={{
                      position: 'absolute',
                      left: '20px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 15,
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      border: 'none',
                      background: 'linear-gradient(135deg, #b8860b, #965a25)',
                      color: '#fff',
                      boxShadow: '0 4px 15px rgba(44, 31, 20, 0.2)',
                      opacity: activeTab === 'video' ? 0.5 : 1,
                      pointerEvents: activeTab === 'video' ? 'none' : 'auto'
                    }}
                    onClick={switchToVideo}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </Button>

                  <Button
                    style={{
                      position: 'absolute',
                      right: '20px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 15,
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      border: 'none',
                      background: 'linear-gradient(135deg, #b8860b, #965a25)',
                      color: '#fff',
                      boxShadow: '0 4px 15px rgba(44, 31, 20, 0.2)',
                      opacity: activeTab === 'photos' ? 0.5 : 1,
                      pointerEvents: activeTab === 'photos' ? 'none' : 'auto'
                    }}
                    onClick={switchToPhotos}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </Button>

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
                        padding: '80px 20px 20px',
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
                        padding: '80px 20px 20px',
                        minHeight: '350px'
                      }}
                    >
                      <div className="memorial-photos-grid">
                        <Row>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(index => (
                            <Col md={3} sm={4} xs={6} key={index} className="mb-3">
                              <div 
                                className="memorial-photo-item"
                                style={{
                                  aspectRatio: '1',
                                  background: 'rgba(184, 134, 11, 0.1)',
                                  borderRadius: '8px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  border: '2px solid rgba(184, 134, 11, 0.2)',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.transform = 'scale(1.05)';
                                  e.target.style.boxShadow = '0 4px 15px rgba(44, 31, 20, 0.2)';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.transform = 'scale(1)';
                                  e.target.style.boxShadow = 'none';
                                }}
                              >
                                <small style={{ color: '#b8860b' }}>사진</small>
                              </div>
                            </Col>
                          ))}
                        </Row>
                        <div className="text-center mt-3">
                          <Button 
                            style={{
                              background: 'linear-gradient(135deg, #b8860b, #965a25)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              color: '#fff',
                              fontWeight: '600',
                              borderRadius: '8px'
                            }}
                            size="sm"
                          >
                            사진 등록하기
                          </Button>
                        </div>
                      </div>
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
                                {entry.message}
                              </div>
                              
                              {entry.message.length > 80 && (
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
                value={guestbookEntry.message}
                onChange={(e) => setGuestbookEntry({
                  ...guestbookEntry,
                  message: e.target.value
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
                  {selectedRibbon.message}
                </div>
              </div>
              
              <div className="text-center mt-4">
                <small className="text-muted">
                  <i className="fas fa-heart me-1"></i>
                  따뜻한 마음으로 전해진 위로의 말씀입니다
                </small>
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

        @media (max-width: 1200px) {
          .page-wrapper {
            height: auto;
            min-height: calc(100vh - var(--navbar-height));
          }
          .memorial-container {
            flex-direction: column;
            height: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default MemorialDetail;
