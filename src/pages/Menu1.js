import React, {useEffect, useState} from 'react';
import {Badge, Button, ButtonGroup, Card, Col, Container, Form, Modal, Row} from 'react-bootstrap';
import { Users, FileText, Calendar, User, Phone, MapPin, Clock, Check, X, Plus, Eye, Printer, Download, Heart } from 'lucide-react';
import { dummyData } from '../services/api';
import './Menu3.css';

const Menu1 = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState('');
  const [currentView, setCurrentView] = useState('customerList');
  const [animateCard, setAnimateCard] = useState(false);

  const handleMessageEdit = () => {
    setIsEditing(true);
  };

  const saveMessage = () => {
    setGeneratedMessage(editedMessage);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditedMessage(generatedMessage);
    setIsEditing(false);
  };

  const filterCustomers = (filterType) => {
    setActiveFilter(filterType);
    if (filterType === 'all') {
      setFilteredCustomers(customers);
    } else {
      setFilteredCustomers(customers.filter(customer => customer.status === filterType));
    }
  };

  useEffect(() => {
    // 카드 애니메이션 효과
    setAnimateCard(true);

    // TODO: 실제 API 호출로 교체
    setTimeout(() => {
      const mockCustomers = [
        {
          id: 1,
          name: '김철수',
          phone: '010-1234-5678',
          relationship: '본인',
          type: '고인',
          status: 'pending',
          documents: {
            obituary: false,
            schedule: false,
            deathCertificate: false
          },
          funeralDate: '2025-07-30',
          location: '서울시 강남구'
        },
        {
          id: 2,
          name: '박영희',
          phone: '010-9876-5432',
          relationship: '딸',
          type: '유족',
          status: 'inProgress',
          documents: {
            obituary: true,
            schedule: true,
            deathCertificate: false
          },
          funeralDate: '2025-07-29',
          location: '부산시 해운대구',
          deceasedName: '박만수',
          deceasedAge: '78'
        },
        {
          id: 3,
          name: '이민수',
          phone: '010-5555-7777',
          relationship: '아들',
          type: '유족',
          status: 'completed',
          documents: {
            obituary: true,
            schedule: true,
            deathCertificate: true
          },
          funeralDate: '2025-07-28',
          location: '대구시 중구',
          deceasedName: '이정호',
          deceasedAge: '82'
        }
      ];
      setCustomers(mockCustomers);
      setFilteredCustomers(mockCustomers);
      setLoading(false);
    }, 1000);
  }, []);

  const [formData, setFormData] = useState({
    상조회사이름: '',
    담당장례지도사이름: '',
    담당장례지도사연락처: '',
    장례의대상고인ID: '',
    상조회사고객ID: '',
    상조회사고객이름: '',
    상조회사고객전화번호: '',
    고인성명한글: '',
    고인성명한자: '',
    고인주민등록번호: '',
    고인나이: '',
    고인돌아가신날짜: '',
    고인생일: '',
    고인성별: '',
    고인종교: '',
    고인과세대주의관계: '',
    사망신고서시설등록자: '',
    신고인이름: '',
    신고인주민등록번호: '',
    신고인전화번호: '',
    신고인과고인의관계: '',
    신고인주소: '',
    신고인이메일: '',
    제출인이름: '',
    제출인주민등록번호: '',
    회원정보: '',
    장례식장이름: '',
    빈소정보: '',
    장례식장주소: '',
    장례시간: '',
    발인일시: '',
    장지정보: '',
    상주목록: '',
    고인의키워드: ''
  });

  const updateCustomerDocuments = (customerId, docType) => {
    setCustomers(customers.map(customer =>
        customer.id === customerId
            ? {
              ...customer,
              documents: {
                ...customer.documents,
                [docType]: true
              },
              status: customer.status === 'pending' ? 'inProgress' : customer.status
            }
            : customer
    ));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-warning text-dark';
      case 'inProgress': return 'bg-info text-white';
      case 'completed': return 'bg-success text-white';
      default: return 'bg-secondary text-white';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return '대기중';
      case 'inProgress': return '진행중';
      case 'completed': return '완료';
      default: return '알수없음';
    }
  };

  const getUrgencyLevel = (funeralDate) => {
    const today = new Date();
    const funeral = new Date(funeralDate);
    const diffTime = funeral.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) return 'urgent';
    if (diffDays <= 2) return 'warning';
    return 'normal';
  };

  const getUrgencyBorder = (level) => {
    switch(level) {
      case 'urgent': return '3px solid #dc3545';
      case 'warning': return '3px solid #ffc107';
      default: return '3px solid #6f42c1';
    }
  };

  if (loading) {
    return (
        <Container className="mt-4">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">장례서류작성 시스템을 불러오는 중...</p>
          </div>
        </Container>
    );
  }

  // 고객 리스트 화면
  const CustomerListView = () => (
      <Container fluid className="funeral-management-wrapper" style={{
        background: '#f8f9fa',
        minHeight: '100vh',
        padding: '24px'
      }}>
        {/* 헤더 섹션 */}
        <Row className="mb-4">
          <Col>
            <div className="funeral-header-section p-4" style={{
              background: 'linear-gradient(135deg, #6f42c1 0%, #495057 100%)',
              borderRadius: '15px',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div className="footer-action" style={{
                textAlign: 'center',
                marginTop: '32px',
                paddingTop: '24px',
                borderTop: '2px solid rgba(102, 126, 234, 0.1)'
              }}>
                <button style={{
                  padding: '16px 32px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(107, 70, 193, 0.39)'
                }} onClick={() => setCurrentView('newDocument')}>
                  새 서류 작성하기 <i className="fas fa-arrow-right ms-2"></i>
                </button>
              </div>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
                opacity: 0.1
              }}></div>
              <div className="position-relative">
                <h1 className="mb-2" style={{ fontWeight: '700', fontSize: '2.5rem' }}>
                  <i className="fas fa-file-alt me-3"></i>
                  장례서류작성
                </h1>
                <p className="lead mb-0" style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                  장례 관련 서류를 체계적으로 관리하고 작성하세요
                </p>
              </div>
            </div>
          </Col>
        </Row>

        {/* 메인 콘텐츠 카드 */}
        <Row>
          <Col>
            <Card style={{
              border: 'none',
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              borderRadius: '20px',
              height: 'calc(100vh - 200px)',
              minHeight: '600px'
            }}>
              <Card.Header style={{
                background: 'linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100%)',
                border: 'none',
                borderRadius: '20px 20px 0 0',
                padding: '1.5rem'
              }}>
                <div className="d-flex align-items-center">
                  <div className="funeral-icon-bg me-3" style={{
                    width: '50px',
                    height: '50px',
                    background: 'linear-gradient(135deg, #6f42c1 0%, #495057 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="fas fa-users text-white" style={{ fontSize: '1.2rem' }}></i>
                  </div>
                  <div>
                    <h4 className="mb-1" style={{ fontWeight: '600' }}>고객 목록</h4>
                    <small className="text-muted">총 {customers.length}명의 고객</small>
                  </div>
                </div>
              </Card.Header>

              <Card.Body style={{
                padding: '0',
                height: 'calc(100% - 100px)',
                overflow: 'hidden'
              }}>
                {/* 고객 카드 스크롤 영역 */}
                <div style={{
                  height: '100%',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  padding: '1.5rem'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px'
                  }}>
                    {customers.map((customer, index) => {
                      const urgency = getUrgencyLevel(customer.funeralDate);
                      const isDeceased = customer.type === '고인';
                      return (
                          <div key={customer.id} style={{
                            background: 'white',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                            border: '1px solid rgba(229, 231, 235, 0.8)',
                            borderLeft: getUrgencyBorder(urgency),
                            transform: animateCard ? 'translateY(0)' : 'translateY(30px)',
                            opacity: animateCard ? 1 : 0,
                            transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`,
                            display: 'flex',
                            minHeight: '180px',
                            position: 'relative',
                            cursor: 'pointer'
                          }}
                               onClick={() => setSelectedCustomer(customer)}
                               onMouseEnter={(e) => {
                                 e.currentTarget.style.transform = 'translateY(-5px)';
                                 e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
                               }}
                               onMouseLeave={(e) => {
                                 e.currentTarget.style.transform = 'translateY(0)';
                                 e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.08)';
                               }}
                          >
                            {/* 긴급도 표시 배지 */}
                            {urgency === 'urgent' && (
                                <div style={{
                                  position: 'absolute',
                                  top: '16px',
                                  right: '16px',
                                  background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                                  color: 'white',
                                  padding: '6px 12px',
                                  borderRadius: '20px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  zIndex: 10,
                                  boxShadow: '0 4px 12px rgba(220, 53, 69, 0.3)'
                                }}>
                                  <Clock size={14} style={{ marginRight: '4px' }} />
                                  긴급
                                </div>
                            )}

                            {/* 왼쪽: 고객 정보 섹션 */}
                            <div style={{
                              background: urgency === 'urgent'
                                  ? 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)'
                                  : urgency === 'warning'
                                      ? 'linear-gradient(135deg, #ffc107 0%, #e0a800 100%)'
                                      : 'linear-gradient(135deg, #6f42c1 0%, #5a32a3 100%)',
                              padding: '24px',
                              color: 'white',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              minWidth: '240px',
                              position: 'relative'
                            }}>
                              <div style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                bottom: 0,
                                width: '1px',
                                background: 'rgba(255, 255, 255, 0.2)'
                              }}></div>

                              <div style={{ marginBottom: '16px' }}>
                                <h3 style={{
                                  fontSize: '1.5rem',
                                  fontWeight: '700',
                                  margin: '0 0 8px 0',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}>
                                  {isDeceased ? (
                                      <>
                                        <span>고 {customer.name}</span>
                                        <Badge bg="light" text="dark" className="ms-2" style={{ fontSize: '0.7rem' }}>
                                          고인
                                        </Badge>
                                      </>
                                  ) : (
                                      customer.name
                                  )}
                                </h3>

                                <Badge className={getStatusColor(customer.status)}>
                                  {getStatusText(customer.status)}
                                </Badge>
                              </div>

                              {!isDeceased && (
                                  <div style={{
                                    background: 'rgba(255, 255, 255, 0.15)',
                                    padding: '12px',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255, 255, 255, 0.2)'
                                  }}>
                                    <h4 style={{
                                      fontSize: '1rem',
                                      fontWeight: '600',
                                      margin: '0 0 4px 0'
                                    }}>
                                      고인: {customer.deceasedName || '고 홍길동'}
                                    </h4>
                                    <p style={{
                                      fontSize: '0.9rem',
                                      margin: 0,
                                      opacity: 0.9
                                    }}>
                                      향년 {customer.deceasedAge || '75'}세
                                    </p>
                                  </div>
                              )}
                            </div>

                            {/* 가운데: 세부 정보 섹션 */}
                            <div style={{
                              flex: 1,
                              padding: '24px',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between'
                            }}>
                              {/* 연락처 및 기본 정보 */}
                              <div>
                                <div style={{
                                  display: 'grid',
                                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                  gap: '12px',
                                  marginBottom: '20px'
                                }}>
                                  <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '12px',
                                    background: 'rgba(111, 66, 193, 0.05)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(111, 66, 193, 0.1)'
                                  }}>
                                    <Phone size={18} style={{ color: '#6f42c1', marginRight: '8px' }} />
                                    <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#374151' }}>
                                  {customer.phone}
                                </span>
                                  </div>

                                  <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '12px',
                                    background: 'rgba(111, 66, 193, 0.05)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(111, 66, 193, 0.1)'
                                  }}>
                                    <User size={18} style={{ color: '#6f42c1', marginRight: '8px' }} />
                                    <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#374151' }}>
                                  {!isDeceased ? `${customer.relationship} (유족)` : '본인'}
                                </span>
                                  </div>

                                  <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '12px',
                                    background: 'rgba(111, 66, 193, 0.05)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(111, 66, 193, 0.1)'
                                  }}>
                                    <Calendar size={18} style={{ color: '#6f42c1', marginRight: '8px' }} />
                                    <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#374151' }}>
                                  {customer.funeralDate}
                                </span>
                                  </div>

                                  <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '12px',
                                    background: 'rgba(111, 66, 193, 0.05)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(111, 66, 193, 0.1)'
                                  }}>
                                    <MapPin size={18} style={{ color: '#6f42c1', marginRight: '8px' }} />
                                    <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#374151' }}>
                                  {customer.location}
                                </span>
                                  </div>
                                </div>

                                {/* 서류 작성 상태 */}
                                <div>
                                  <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: '12px'
                                  }}>
                                    <FileText size={18} style={{ color: '#6f42c1', marginRight: '8px' }} />
                                    <span style={{
                                      fontSize: '0.95rem',
                                      fontWeight: '600',
                                      color: '#374151'
                                    }}>
                                  서류 작성 상태
                                </span>
                                  </div>

                                  <div style={{
                                    display: 'flex',
                                    gap: '8px',
                                    flexWrap: 'wrap'
                                  }}>
                                    {Object.entries(customer.documents).map(([docType, isCompleted]) => {
                                      const docNames = {
                                        obituary: '부고장',
                                        schedule: '일정표',
                                        deathCertificate: '사망신고서'
                                      };

                                      return (
                                          <Badge
                                              key={docType}
                                              bg={isCompleted ? 'success' : 'danger'}
                                              style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '6px 12px',
                                                fontSize: '0.85rem'
                                              }}
                                          >
                                            {isCompleted ?
                                                <Check size={14} style={{ marginRight: '4px' }} /> :
                                                <X size={14} style={{ marginRight: '4px' }} />
                                            }
                                            {docNames[docType]}
                                          </Badge>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* 오른쪽: 액션 버튼 섹션 */}
                            <div style={{
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: '24px 20px',
                              background: 'rgba(248, 250, 252, 0.8)',
                              borderLeft: '1px solid rgba(229, 231, 235, 0.5)',
                              minWidth: '180px',
                              gap: '12px'
                            }}>
                              <Button
                                  variant="primary"
                                  style={{
                                    width: '100%',
                                    borderRadius: '12px',
                                    fontWeight: '600',
                                    padding: '12px'
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentView('register');
                                  }}
                              >
                                <FileText size={16} style={{ marginRight: '8px' }} />
                                서류 작성
                              </Button>

                              <Button
                                  variant="outline-primary"
                                  style={{
                                    width: '100%',
                                    borderRadius: '12px',
                                    fontWeight: '600',
                                    padding: '12px'
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    alert('상세 정보를 확인합니다.');
                                  }}
                              >
                                <Eye size={16} style={{ marginRight: '8px' }} />
                                상세 보기
                              </Button>
                            </div>
                          </div>
                      );
                    })}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
  );

  // 장례정보 등록 화면
  const RegisterView = () => (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start'
      }}>
        <div style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '1400px',
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          boxShadow: '0 32px 64px rgba(0, 0, 0, 0.12)',
          padding: '32px',
          transform: animateCard ? 'translateY(0)' : 'translateY(30px)',
          opacity: animateCard ? 1 : 0,
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '32px',
            paddingBottom: '24px',
            borderBottom: '2px solid rgba(102, 126, 234, 0.1)'
          }}>
            <button
                onClick={() => setCurrentView('customerList')}
                style={{
                  marginRight: '20px',
                  background: 'rgba(102, 126, 234, 0.1)',
                  color: '#667eea',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(102, 126, 234, 0.15)';
                  e.target.style.transform = 'translateX(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                  e.target.style.transform = 'translateX(0)';
                }}
            >
              ← 돌아가기
            </button>
            <h1 style={{
              fontSize: '2.2rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
            }}>
              장례정보 등록 - {selectedCustomer?.name}
            </h1>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '32px',
            maxHeight: '70vh',
            overflowY: 'auto',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
            border: '1px solid rgba(229, 231, 235, 0.8)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px'
            }}>
              {Object.entries(formData).map(([key, value]) => (
                  <div key={key}>
                    <label style={{
                      display: 'block',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => setFormData({...formData, [key]: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '12px',
                          fontSize: '0.95rem',
                          backgroundColor: '#fafafa',
                          transition: 'all 0.3s ease',
                          outline: 'none'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#667eea';
                          e.target.style.backgroundColor = 'white';
                          e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e5e7eb';
                          e.target.style.backgroundColor = '#fafafa';
                          e.target.style.boxShadow = 'none';
                        }}
                        placeholder={`${key} 입력`}
                    />
                  </div>
              ))}
            </div>

            <div style={{
              marginTop: '40px',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '16px'
            }}>
              <button style={{
                background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                border: 'none',
                boxShadow: '0 4px 16px rgba(156, 163, 175, 0.25)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer'
              }}
                      onClick={() => setCurrentView('customerList')}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 25px rgba(156, 163, 175, 0.35)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 16px rgba(156, 163, 175, 0.25)';
                      }}
              >
                취소
              </button>

              <button style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                border: 'none',
                boxShadow: '0 4px 16px rgba(102, 126, 234, 0.25)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer'
              }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.35)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.25)';
                      }}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      </div>
  );

  return (
      <div>
        {currentView === 'customerList' && <CustomerListView />}
        {currentView === 'register' && <RegisterView />}
        {currentView === 'newDocument' && (
            <Container className="mt-4">
              <Card>
                <Card.Header>
                  <div className="d-flex justify-content-between align-items-center">
                    <h4>새 서류 작성</h4>
                    <Button variant="secondary" onClick={() => setCurrentView('customerList')}>
                      목록으로 돌아가기
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  <p>새 서류 작성 기능은 개발 중입니다.</p>
                </Card.Body>
              </Card>
            </Container>
        )}
      </div>
  );
};

export default Menu1;