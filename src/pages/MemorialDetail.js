import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal, Form, Badge, Carousel } from 'react-bootstrap';
import { dummyData } from '../services/api';

const MemorialDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const [ribbonScrollIndex, setRibbonScrollIndex] = useState(0);
  const ribbonItemsPerView = 4; // 화면에 보이는 리본 개수
  const ribbonItemWidth = 220; // 리본 너비 + 간격
  const [selectedRibbon, setSelectedRibbon] = useState(null);
  const [showRibbonDetailModal, setShowRibbonDetailModal] = useState(false);

  useEffect(() => {
    // TODO: 실제 API 호출로 교체
    setTimeout(() => {
      const foundMemorial = dummyData.memorials._embedded.memorials.find(
        m => m.id === parseInt(id)
      );
      setMemorial(foundMemorial);
      
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

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">추모 페이지를 불러오는 중...</p>
        </div>
      </Container>
    );
  }

  if (!memorial) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <h4>추모관을 찾을 수 없습니다.</h4>
          <Button variant="primary" onClick={() => navigate('/menu4')}>
            목록으로 돌아가기
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="memorial-detail-page">
      {/* 헤더 섹션 (1-1) */}
      <Row className="mb-4">
        <Col>
          <div className="memorial-profile-section p-4" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '15px',
            color: 'white',
            position: 'relative'
          }}>
            <Button 
              variant="light" 
              size="sm" 
              onClick={() => navigate('/menu4')}
              className="mb-3"
            >
              <i className="fas fa-arrow-left me-2"></i>
              목록으로
            </Button>
            
            <Row className="align-items-center">
              <Col md={3} className="text-center">
                <div className="memorial-profile-image" style={{
                  width: '200px',
                  height: '250px',
                  background: memorial.imageUrl 
                    ? `url(${memorial.imageUrl})` 
                    : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '15px',
                  border: '4px solid rgba(255,255,255,0.3)',
                  margin: '0 auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {!memorial.imageUrl && (
                    <i className="fas fa-user fa-4x" style={{ color: '#6c757d' }}></i>
                  )}
                </div>
                <h5 className="mt-3 mb-0">프로필사진01</h5>
              </Col>
              
              <Col md={9}>
                <div className="memorial-info-text">
                  <h1 className="display-4 mb-3" style={{ fontWeight: '700' }}>
                    삼가 故人의 冥福을 빕니다
                  </h1>
                  <div className="memorial-basic-info mb-4">
                    <Row>
                      <Col md={6}>
                        <div className="info-item mb-2">
                          <strong>성함:</strong> {memorial.name}
                        </div>
                        <div className="info-item mb-2">
                          <strong>나이:</strong> {memorial.age}세
                        </div>
                        <div className="info-item mb-2">
                          <strong>성별:</strong> {memorial.gender === 'MALE' ? '남성' : '여성'}
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="info-item mb-2">
                          <strong>생년월일:</strong> {memorial.birthOfDate}
                        </div>
                        <div className="info-item mb-2">
                          <strong>별세일:</strong> {memorial.deceasedDate}
                        </div>
                        <div className="info-item mb-2">
                          <strong>고객ID:</strong> {memorial.customerId}
                        </div>
                      </Col>
                    </Row>
                  </div>
                  
                  <div className="memorial-description">
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
        </Col>
      </Row>

      {/* 메인 콘텐츠 영역 - 새로운 레이아웃 */}
      <Row>
        {/* 좌측: 영상/사진첩 + 방명록 리본 */}
        <Col lg={8}>
          <Row>
            {/* 상단: 추모영상과 사진첩 - 겹쳐진 탭 구조 */}
            <Col lg={12}>
              <div className="memorial-tabs-container position-relative mb-4" style={{ 
                borderRadius: '15px', 
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}>
                
                {/* 탭 헤더들 */}
                <div className="memorial-tabs-header position-absolute" style={{ 
                  top: '0', 
                  left: '0', 
                  right: '0', 
                  zIndex: 10,
                  background: 'rgba(0,0,0,0.1)',
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
                        ? 'linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100%)' 
                        : 'rgba(248, 249, 250, 0.9)',
                      borderRadius: '15px 15px 0 0',
                      padding: '15px 20px',
                      border: 'none',
                      boxShadow: activeTab === 'video' ? '0 -2px 10px rgba(0,0,0,0.1)' : 'none',
                      zIndex: activeTab === 'video' ? 12 : 11,
                      transform: activeTab === 'video' ? 'translateY(0)' : 'translateY(5px)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <h5 className="mb-0" style={{ color: '#333' }}>
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
                        ? 'linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100())' 
                        : 'rgba(248, 249, 250, 0.9)',
                      borderRadius: '15px 15px 0 0',
                      padding: '15px 20px',
                      border: 'none',
                      boxShadow: activeTab === 'photos' ? '0 -2px 10px rgba(0,0,0,0.1)' : 'none',
                      zIndex: activeTab === 'photos' ? 12 : 11,
                      transform: activeTab === 'photos' ? 'translateY(0)' : 'translateY(5px)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div className="d-flex align-items-center">
                      <h5 className="mb-0 me-3" style={{ color: '#333' }}>
                        <i className="fas fa-images me-2"></i>
                        사진첩
                      </h5>
                      <small className="text-muted">(스크롤 형식)</small>
                    </div>
                  </div>
                </div>

                {/* 좌우 전환 버튼들 */}
                <Button
                  variant="light"
                  className="position-absolute"
                  style={{
                    left: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 15,
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    opacity: activeTab === 'video' ? 0.5 : 1,
                    pointerEvents: activeTab === 'video' ? 'none' : 'auto'
                  }}
                  onClick={switchToVideo}
                >
                  <i className="fas fa-chevron-left"></i>
                </Button>

                <Button
                  variant="light"
                  className="position-absolute"
                  style={{
                    right: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 15,
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    opacity: activeTab === 'photos' ? 0.5 : 1,
                    pointerEvents: activeTab === 'photos' ? 'none' : 'auto'
                  }}
                  onClick={switchToPhotos}
                >
                  <i className="fas fa-chevron-right"></i>
                </Button>

                {/* 탭 콘텐츠 영역 */}
                <div className="memorial-tabs-content" style={{ 
                  background: '#fff',
                  borderRadius: '15px',
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
                    <div className="memorial-video-container" style={{
                      width: '100%',
                      aspectRatio: '16 / 9',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                        <Button variant="light">
                          <i className="fas fa-play me-2"></i>
                          재생하기
                        </Button>
                      </div>
                    </div>
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
                                background: '#f8f9fa',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid #e9ecef',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.transform = 'scale(1.05)';
                                e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.transform = 'scale(1)';
                                e.target.style.boxShadow = 'none';
                              }}
                            >
                              <small className="text-muted">사진</small>
                            </div>
                          </Col>
                        ))}
                      </Row>
                      <div className="text-center mt-3">
                        <Button variant="outline-primary" size="sm">
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
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                borderRadius: '15px',
                padding: '2rem',
                minHeight: '380px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0" style={{ color: '#495057' }}>
                    <i className="fas fa-ribbon me-2"></i>
                    방명록 리본
                  </h5>
                  {guestbookList.length > ribbonItemsPerView && (
                    <div className="ribbon-controls">
                      <button 
                        className="btn btn-outline-primary btn-sm me-2"
                        onClick={() => setRibbonScrollIndex(Math.max(0, ribbonScrollIndex - 1))}
                        disabled={ribbonScrollIndex === 0}
                        style={{ border: 'none', background: 'none', color: '#007bff' }}
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      <span className="text-muted small mx-2">
                        {ribbonScrollIndex + 1}-{Math.min(ribbonScrollIndex + ribbonItemsPerView, guestbookList.length)} / {guestbookList.length}
                      </span>
                      <button 
                        className="btn btn-outline-primary btn-sm ms-2"
                        onClick={() => setRibbonScrollIndex(Math.min(guestbookList.length - ribbonItemsPerView, ribbonScrollIndex + 1))}
                        disabled={ribbonScrollIndex >= guestbookList.length - ribbonItemsPerView}
                        style={{ border: 'none', background: 'none', color: '#007bff' }}
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  )}
                </div>
                
                <div 
                  className="ribbon-scroll-container" 
                  style={{
                    height: '300px', // 리본 카드에 맞춘 높이
                    perspective: '1200px',
                    position: 'relative',
                    overflow: 'hidden',
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '10px 0' // 상하 패딩만 약간
                  }}
                  onWheel={handleRibbonWheel}
                >
                  <div className="ribbon-items-wrapper" style={{
                    display: 'flex',
                    gap: '20px', // 고정된 간격
                    transform: `translateX(-${ribbonScrollIndex * ribbonItemWidth}px)`, // 고정된 스크롤 단위
                    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    height: '100%',
                    alignItems: 'flex-start',
                    paddingTop: '20px',
                    justifyContent: 'flex-start' // 좌측 정렬
                  }}>
                    {guestbookList.map((entry, index) => (
                      <div
                        key={entry.id}
                        className="ribbon-item"
                        style={{
                          width: '200px', // 고정 너비
                          minWidth: '200px', // 최소 너비도 고정
                          maxWidth: '200px', // 최대 너비도 고정
                          height: '350px',
                          position: 'relative',
                          cursor: 'pointer',
                          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                          transform: `rotateY(${Math.max(0, index - ribbonScrollIndex) * -5}deg) translateZ(${Math.max(0, index - ribbonScrollIndex) * -15}px)`,
                          zIndex: guestbookList.length - Math.abs(index - ribbonScrollIndex),
                          transformOrigin: 'center top',
                          flexShrink: 0 // 크기 변경 방지
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
                            ${index % 4 === 0 ? '#667eea' : index % 4 === 1 ? '#764ba2' : index % 4 === 2 ? '#52c234' : '#e74c3c'} 0%, 
                            ${index % 4 === 0 ? '#764ba2' : index % 4 === 1 ? '#667eea' : index % 4 === 2 ? '#b83dba' : '#c0392b'} 100%)`,
                          borderRadius: '12px', // 전체 모서리 둥글게
                          color: 'white',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          padding: '25px 20px',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
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
                              fontSize: '1.25rem', // 폰트 크기 증가
                              fontWeight: 'bold',
                              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                              marginBottom: '8px',
                              lineHeight: '1.3'
                            }}>
                              {entry.name}
                            </div>
                            <div style={{ 
                              fontSize: '0.95rem', // 폰트 크기 증가
                              opacity: 0.9,
                              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                              marginBottom: '5px',
                              lineHeight: '1.2'
                            }}>
                              {entry.relationship}
                            </div>
                            <div style={{ 
                              fontSize: '0.8rem', // 폰트 크기 증가
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
                            padding: '10px 0' // 패딩 추가
                          }}>
                            <div style={{
                              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                              lineHeight: '1.5',
                              fontSize: '0.95rem', // 폰트 크기 증가
                              overflow: 'visible', // visible로 변경
                              display: '-webkit-box',
                              WebkitLineClamp: 5, // 줄 수 증가
                              WebkitBoxOrient: 'vertical',
                              wordWrap: 'break-word'
                            }}>
                              {entry.message}
                            </div>
                            
                            {entry.message.length > 80 && ( // 글자 수 조정
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
                      color: '#6c757d'
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
          <Card className="mb-4" style={{ borderRadius: '15px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <Card.Header style={{ 
              background: 'linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100%)',
              borderRadius: '15px 15px 0 0',
              border: 'none'
            }}>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="fas fa-heart me-2"></i>
                  추모사
                </h5>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                >
                  <i className="fas fa-robot me-1"></i>
                  AI 생성
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="p-4" style={{ maxHeight: '500px', overflowY: 'auto' }}>
              <div className="memorial-eulogy">
                <div className="eulogy-title mb-3 text-center">
                  <h6 className="text-primary mb-2" style={{ fontWeight: '600' }}>
                    사랑하고 존경하는 우리 아버지, {memorial.name}님.
                  </h6>
                </div>
                
                <div className="eulogy-content" style={{ 
                  lineHeight: '1.8', 
                  fontSize: '0.9rem',
                  color: '#495057'
                }}>
                  <p className="mb-3">
                    늘 저희의 든든한 버팀목이 되어 주셨던 아버지를 이렇게 보내드려야 한다는 사실이 
                    아직도 실감 나지 않습니다. 아버지는 저희에게 세상에서 가장 크고 단단한 산과 같은 분이셨습니다.
                  </p>
                  
                  <p className="mb-3">
                    언제나 말없이 묵묵히 가족을 위해 헌신하셨던 아버지의 깊은 사랑을 이제야 더 절실히 깨닫게 됩니다. 
                    저희에게 보여주셨던 정직함과 성실함은 앞으로 저희가 세상을 살아가는 데 가장 큰 가르침이 될 것입니다.
                  </p>
                  
                  <p className="mb-3">
                    아버지, 이제 모든 무거운 짐을 내려놓으시고 하늘에서는 부디 평안히 쉬십시오. 
                    저희에게 베풀어주신 크나큰 사랑, 가슴 깊이 간직하며 열심히 살아가겠습니다.
                  </p>
                  
                  <div className="text-center mt-4">
                    <p className="mb-0" style={{ 
                      fontStyle: 'italic', 
                      fontWeight: '500',
                      color: '#6c757d'
                    }}>
                      영원히 사랑하고 기억하겠습니다.
                    </p>
                  </div>
                </div>
                
                <div className="eulogy-footer mt-4 pt-3" style={{ 
                  borderTop: '1px solid #e9ecef',
                  textAlign: 'right'
                }}>
                  <small className="text-muted">
                    <i className="fas fa-calendar-alt me-1"></i>
                    작성일: {new Date().toLocaleDateString('ko-KR')}
                  </small>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* 위로의 말 전하기 */}
          <Card className="mb-4" style={{ borderRadius: '15px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <Card.Header style={{ 
              background: 'linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100%)',
              borderRadius: '15px 15px 0 0',
              border: 'none'
            }}>
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">
                  <i className="fas fa-book me-2"></i>
                  위로의 말 전하기
                </h6>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => setShowGuestbookModal(true)}
                >
                  <i className="fas fa-edit me-1"></i>
                  작성
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="p-3">
              <div className="text-center text-muted">
                <i className="fas fa-ribbon fa-2x mb-2"></i>
                <p className="small mb-0">소중한 추억과 위로의 말을<br/>아름다운 리본으로 남겨주세요</p>
              </div>
            </Card.Body>
          </Card>

          {/* 공유 버튼 */}
          <Card style={{ borderRadius: '15px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <Card.Body className="text-center p-3">
              <Button 
                variant="primary" 
                className="w-100"
                style={{
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
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

      {/* 방명록 작성 모달 */}
      <Modal show={showGuestbookModal} onHide={() => setShowGuestbookModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-ribbon me-2"></i>
            위로의 리본 남기기
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowGuestbookModal(false)}>
            취소
          </Button>
          <Button 
            variant="primary" 
            onClick={handleGuestbookSubmit}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none'
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
              ${selectedRibbon.id % 4 === 1 ? '#667eea' : selectedRibbon.id % 4 === 2 ? '#764ba2' : selectedRibbon.id % 4 === 3 ? '#52c234' : '#e74c3c'} 0%, 
              ${selectedRibbon.id % 4 === 1 ? '#764ba2' : selectedRibbon.id % 4 === 2 ? '#667eea' : selectedRibbon.id % 4 === 3 ? '#b83dba' : '#c0392b'} 100%)` : '#f8f9fa',
            color: 'white',
            border: 'none'
          }}
        >
          <Modal.Title style={{ display: 'flex', alignItems: 'center' }}>
            <i className="fas fa-ribbon me-2"></i>
            {selectedRibbon?.name}님의 위로의 말
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '2rem' }}>
          {selectedRibbon && (
            <>
              <div className="ribbon-detail-header mb-4">
                <Row>
                  <Col md={8}>
                    <h5 className="text-primary mb-2">
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
                        ${selectedRibbon.id % 4 === 1 ? '#667eea' : selectedRibbon.id % 4 === 2 ? '#764ba2' : selectedRibbon.id % 4 === 3 ? '#52c234' : '#e74c3c'} 0%, 
                        ${selectedRibbon.id % 4 === 1 ? '#764ba2' : selectedRibbon.id % 4 === 2 ? '#667eea' : selectedRibbon.id % 4 === 3 ? '#b83dba' : '#c0392b'} 100%)` : '#f8f9fa',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
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
                    background: '#f8f9fa',
                    borderLeft: '4px solid #007bff',
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
        <Modal.Footer style={{ background: '#f8f9fa', border: 'none' }}>
          <Button 
            variant="secondary" 
            onClick={() => setShowRibbonDetailModal(false)}
          >
            닫기
          </Button>
          <Button 
            variant="primary"
            style={{
              background: selectedRibbon ? `linear-gradient(135deg, 
                ${selectedRibbon.id % 4 === 1 ? '#667eea' : selectedRibbon.id % 4 === 2 ? '#764ba2' : selectedRibbon.id % 4 === 3 ? '#52c234' : '#e74c3c'} 0%, 
                ${selectedRibbon.id % 4 === 1 ? '#764ba2' : selectedRibbon.id % 4 === 2 ? '#667eea' : selectedRibbon.id % 4 === 3 ? '#b83dba' : '#c0392b'} 100%)` : '#007bff',
              border: 'none'
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
    </Container>
  );
};

export default MemorialDetail;
