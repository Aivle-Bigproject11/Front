
import React, {useEffect, useState} from 'react';
import {Badge, Button, ButtonGroup, Card, Col, Container, Form, Modal, Row} from 'react-bootstrap';
import { Users, FileText, Calendar, User, Phone, MapPin, Clock, Check, X, Plus, Eye, Printer, Download, Heart } from 'lucide-react';
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
  const [selectedDoc, setSelectedDoc] = useState('obituary');

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

  // Mock customers 데이터 - 여러 고인 표시
  const mockCustomers = [
    {
      id: 1,
      name: '양성현',
      phone: '010-1234-5678',
      type: '고인',
      status: 'pending',
      age: '75',
      documents: {
        obituary: false,
        schedule: false,
        deathCertificate: false
      },
      funeralDate: '2025-08-02',
      location: '서울시 강남구 삼성동'
    },
    {
      id: 2,
      name: '김시훈',
      phone: '010-2345-6789',
      type: '고인',
      status: 'inProgress',
      age: '96',
      documents: {
        obituary: true,
        schedule: false,
        deathCertificate: false
      },
      funeralDate: '2025-08-01',
      location: '부산시 해운대구'
    },
    {
      id: 3,
      name: '박수연',
      phone: '010-3456-7890',
      type: '고인',
      status: 'completed',
      age: '88',
      documents: {
        obituary: true,
        schedule: true,
        deathCertificate: true
      },
      funeralDate: '2025-07-30',
      location: '대구시 중구'
    },
    {
      id: 4,
      name: '류근우',
      phone: '010-4567-8901',
      type: '고인',
      status: 'pending',
      age: '94',
      documents: {
        obituary: false,
        schedule: true,
        deathCertificate: false
      },
      funeralDate: '2025-08-03',
      location: '인천시 남동구'
    },
    {
      id: 5,
      name: '이헌준',
      phone: '010-5678-1234',
      type: '고인',
      status: 'pending',
      age: '95',
      documents: {
        obituary: false,
        schedule: false,
        deathCertificate: false
      },
      funeralDate: '2025-08-04',
      location: '서울시 성동구 왕십리'
    },
    {
      id: 6,
      name: '이현종',
      phone: '010-6789-2345',
      type: '고인',
      status: 'inProgress',
      age: '82',
      documents: {
        obituary: true,
        schedule: false,
        deathCertificate: false
      },
      funeralDate: '2025-08-05',
      location: '경기도 수원시 영통구'
    },
    {
      id: 7,
      name: '안도형',
      phone: '010-7890-3456',
      type: '고인',
      status: 'completed',
      age: '78',
      documents: {
        obituary: true,
        schedule: true,
        deathCertificate: true
      },
      funeralDate: '2025-07-29',
      location: '강원도 춘천시'
    },
    {
      id: 8,
      name: '김민서',
      phone: '010-8901-4567',
      type: '고인',
      status: 'pending',
      age: '89',
      documents: {
        obituary: false,
        schedule: false,
        deathCertificate: false
      },
      funeralDate: '2025-08-06',
      location: '충청북도 청주시'
    }
  ];

  useEffect(() => {
    setAnimateCard(true);

    setTimeout(() => {
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

  // 서류 미리보기 콘텐츠
  const getPreviewContent = (docType) => {
    const docTitles = {
      obituary: '부고장',
      deathCertificate: '사망신고서',
      schedule: '장례일정표'
    };

    const docContent = {
      obituary: {
        title: '부고장',
        content: `
          고 ${selectedCustomer?.name} 별세

          향년 ${selectedCustomer?.age}세
          
          발인일시: ${selectedCustomer?.funeralDate}
          장례식장: ${selectedCustomer?.location}
          
          삼가 고인의 명복을 빕니다.
        `
      },
      deathCertificate: {
        title: '사망신고서',
        content: `
          사망신고서
          
          성명: ${selectedCustomer?.name}
          나이: ${selectedCustomer?.age}세
          사망일: ${selectedCustomer?.funeralDate}
          신고인: [신고인 정보]
          
          위와 같이 사망신고를 합니다.
        `
      },
      schedule: {
        title: '장례일정표',
        content: `
          장례일정표
          
          고인: ${selectedCustomer?.name}
          
          입관: ${selectedCustomer?.funeralDate} 오전 10시
          발인: ${selectedCustomer?.funeralDate} 오후 2시
          장례식장: ${selectedCustomer?.location}
          
          세부 일정은 상황에 따라 변경될 수 있습니다.
        `
      }
    };

    if (!selectedCustomer || !docContent[docType]) {
      return (
          <div style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'white',
            borderRadius: '8px',
            margin: '16px'
          }}>
            <div style={{ textAlign: 'center', color: '#6b7280' }}>
              <FileText size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <h3>서류를 선택해주세요</h3>
              <p>왼쪽에서 서류를 선택하면 미리보기가 표시됩니다</p>
            </div>
          </div>
      );
    }

    return (
        <div style={{
          height: '100%',
          background: 'white',
          borderRadius: '8px',
          margin: '16px',
          padding: '24px',
          overflow: 'auto'
        }}>
          <div style={{
            background: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '32px',
            minHeight: '500px',
            fontFamily: 'serif'
          }}>
            <h2 style={{
              textAlign: 'center',
              marginBottom: '32px',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#111827'
            }}>
              {docContent[docType].title}
            </h2>
            <div style={{
              whiteSpace: 'pre-line',
              lineHeight: '1.8',
              fontSize: '16px',
              color: '#374151'
            }}>
              {docContent[docType].content}
            </div>
          </div>
        </div>
    );
  };

  if (loading) {
    return (
        <div style={{
          minHeight: 'calc(100vh - 56px)',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="text-center" style={{ color: 'white' }}>
            <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3" style={{ fontSize: '1.2rem' }}>장례서류작성 시스템을 불러오는 중...</p>
          </div>
        </div>
    );
  }

  // 고객 리스트 화면
  const CustomerListView = () => (
      <div style={{
        '--navbar-height': '56px',
        height: 'calc(100vh - var(--navbar-height))',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}>
        {/* 배경 패턴 */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat'
        }}></div>

        <div className={`login-container ${animateCard ? 'animate-in' : ''}`} style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '1200px',
          height: '100%',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          background: '#f8f9fa',
          boxShadow: '0 8px 32px rgba(102,126,234,0.08)',
          padding: '24px',
          borderRadius: '28px',
          transform: animateCard ? 'translateY(0)' : 'translateY(30px)',
          opacity: animateCard ? 1 : 0,
          transition: 'all 0.6s ease-out',
          overflow: 'hidden'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            backdropFilter: 'blur(10px)',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.2)',
            width: '100%',
            height: '100%'
          }}>
            <div style={{
              display: 'flex',
              minHeight: '75vh',
              height: '100%'
            }}>
              
              {/* 오른쪽 콘텐츠 영역 */}
              <div style={{
                flex: 1,
                padding: '0',
                display: 'flex',
                flexDirection: 'column',
                background: '#fafafa'
              }}>
                {/* 서브 헤더 */}
                <div style={{
                  padding: '30px 40px 20px',
                  borderBottom: '1px solid rgba(229, 231, 235, 0.5)'
                }}>
                  <h3 style={{
                    color: '#374151',
                    fontWeight: '600',
                    marginBottom: '8px',
                    fontSize: '1.5rem'
                  }}>장례서류 관리 시스템</h3>
                  <p style={{
                    color: '#6c757d',
                    fontSize: '14px',
                    margin: 0
                  }}>총 {customers.length}명의 고객</p>
                </div>

                {/* 고객 카드 리스트 */}
                <div style={{
                  flex: 1,
                  padding: '20px 40px',
                  overflowY: 'auto',
                  height: 'calc(100% - 100px)'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }}>
                    {customers.map((customer, index) => {
                      const urgency = getUrgencyLevel(customer.funeralDate);
                      return (
                          <div key={customer.id} style={{
                            background: 'white',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                            border: '1px solid rgba(229, 231, 235, 0.8)',
                            borderLeft: getUrgencyBorder(urgency),
                            transform: animateCard ? 'translateY(0)' : 'translateY(30px)',
                            opacity: animateCard ? 1 : 0,
                            transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`,
                            display: 'flex',
                            minHeight: '140px',
                            position: 'relative',
                            cursor: 'pointer'
                          }}
                               onClick={() => setSelectedCustomer(customer)}
                               onMouseEnter={(e) => {
                                 e.currentTarget.style.transform = 'translateY(-2px)';
                                 e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
                               }}
                               onMouseLeave={(e) => {
                                 e.currentTarget.style.transform = 'translateY(0)';
                                 e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.06)';
                               }}
                          >
                            {/* 긴급도 표시 배지 */}
                            {urgency === 'urgent' && (
                                <div style={{
                                  position: 'absolute',
                                  top: '12px',
                                  right: '12px',
                                  background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                                  color: 'white',
                                  padding: '4px 8px',
                                  borderRadius: '12px',
                                  fontSize: '11px',
                                  fontWeight: '600',
                                  zIndex: 10,
                                  boxShadow: '0 2px 8px rgba(220, 53, 69, 0.3)'
                                }}>
                                  <Clock size={12} style={{ marginRight: '2px' }} />
                                  긴급
                                </div>
                            )}

                            {/* 왼쪽: 고객 정보 */}
                            <div style={{
                              background: urgency === 'urgent'
                                  ? 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)'
                                  : urgency === 'warning'
                                      ? 'linear-gradient(135deg, #ffc107 0%, #e0a800 100%)'
                                      : 'linear-gradient(135deg, #6f42c1 0%, #5a32a3 100%)',
                              padding: '20px',
                              color: 'white',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              minWidth: '200px',
                              position: 'relative'
                            }}>
                              <div style={{ marginBottom: '12px' }}>
                                <h4 style={{
                                  fontSize: '1.3rem',
                                  fontWeight: '700',
                                  margin: '0 0 6px 0',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}>
                                  {customer.name}
                                  <Badge bg="light" text="dark" className="ms-2" style={{ fontSize: '0.7rem' }}>
                                    고인
                                  </Badge>
                                </h4>

                                <Badge className={getStatusColor(customer.status)} style={{ fontSize: '0.8rem', padding: '4px 8px' }}>
                                  {getStatusText(customer.status)}
                                </Badge>
                              </div>

                              <div style={{
                                background: 'rgba(255, 255, 255, 0.15)',
                                padding: '10px',
                                borderRadius: '10px',
                                border: '1px solid rgba(255, 255, 255, 0.2)'
                              }}>
                                <p style={{
                                  fontSize: '0.95rem',
                                  fontWeight: '600',
                                  margin: '0 0 2px 0'
                                }}>
                                  향년 {customer.age}세
                                </p>
                                <p style={{
                                  fontSize: '0.85rem',
                                  margin: 0,
                                  opacity: 0.9
                                }}>
                                  {customer.funeralDate}
                                </p>
                              </div>
                            </div>

                            {/* 가운데: 세부 정보 */}
                            <div style={{
                              flex: 1,
                              padding: '20px',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between'
                            }}>
                              <div>
                                <div style={{
                                  display: 'grid',
                                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                  gap: '8px',
                                  marginBottom: '12px'
                                }}>
                                  <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '8px',
                                    background: 'rgba(111, 66, 193, 0.05)',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(111, 66, 193, 0.1)'
                                  }}>
                                    <Phone size={14} style={{ color: '#6f42c1', marginRight: '6px' }} />
                                    <span style={{ fontSize: '0.85rem', fontWeight: '500', color: '#374151' }}>
                                      {customer.phone}
                                    </span>
                                  </div>

                                  <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '8px',
                                    background: 'rgba(111, 66, 193, 0.05)',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(111, 66, 193, 0.1)'
                                  }}>
                                    <MapPin size={14} style={{ color: '#6f42c1', marginRight: '6px' }} />
                                    <span style={{ fontSize: '0.85rem', fontWeight: '500', color: '#374151' }}>
                                      {customer.location}
                                    </span>
                                  </div>
                                </div>

                                {/* 서류 작성 상태 */}
                                <div>
                                  <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: '8px'
                                  }}>
                                    <FileText size={14} style={{ color: '#6f42c1', marginRight: '6px' }} />
                                    <span style={{
                                      fontSize: '0.9rem',
                                      fontWeight: '600',
                                      color: '#374151'
                                    }}>
                                      서류 작성 상태
                                    </span>
                                  </div>

                                  <div style={{
                                    display: 'flex',
                                    gap: '6px',
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
                                                padding: '4px 8px',
                                                fontSize: '0.75rem'
                                              }}
                                          >
                                            {isCompleted ?
                                                <Check size={12} style={{ marginRight: '3px' }} /> :
                                                <X size={12} style={{ marginRight: '3px' }} />
                                            }
                                            {docNames[docType]}
                                          </Badge>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* 오른쪽: 버튼 */}
                            <div style={{
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: '20px 16px',
                              background: 'rgba(248, 250, 252, 0.8)',
                              borderLeft: '1px solid rgba(229, 231, 235, 0.5)',
                              minWidth: '140px',
                              gap: '8px'
                            }}>
                              <Button
                                  variant="primary"
                                  size="sm"
                                  style={{
                                    width: '100%',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    padding: '8px',
                                    fontSize: '0.85rem'
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCustomer(customer);
                                    setCurrentView('register');
                                  }}
                              >
                                <FileText size={14} style={{ marginRight: '4px' }} />
                                정보등록
                              </Button>

                              <Button
                                  variant="outline-primary"
                                  size="sm"
                                  style={{
                                    width: '100%',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    padding: '8px',
                                    fontSize: '0.85rem'
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCustomer(customer);
                                    setCurrentView('documents');
                                  }}
                              >
                                <Eye size={14} style={{ marginRight: '4px' }} />
                                서류관리
                              </Button>
                            </div>
                          </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );

  // 장례정보 등록 화면
  const RegisterView = () => (
      <div style={{
        '--navbar-height': '56px',
        height: 'calc(100vh - var(--navbar-height))',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        boxSizing: 'border-box'
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

  // 서류관리 화면
  const DocumentsView = () => (
      <div style={{
        '--navbar-height': '56px',
        height: 'calc(100vh - var(--navbar-height))',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '24px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          boxShadow: '0 32px 64px rgba(0, 0, 0, 0.12)',
          padding: '24px',
          height: 'calc(100vh - 48px)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <button
                onClick={() => setCurrentView('customerList')}
                style={{
                  marginRight: '16px',
                  background: 'rgba(102, 126, 234, 0.1)',
                  color: '#667eea',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
            >
              ← 돌아가기
            </button>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#374151',
              margin: 0
            }}>
              만드실 서류를 선택해 주세요 - {selectedCustomer?.name}
            </h1>
          </div>

          <div style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: '1fr 3fr',
            gap: '24px'
          }}>
            {/* 왼쪽 서류 선택 영역 */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {/* 부고장 */}
              <div
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    padding: '16px',
                    cursor: 'pointer',
                    border: selectedDoc === 'obituary' ? '2px solid #3b82f6' : '2px solid transparent',
                    backgroundColor: selectedDoc === 'obituary' ? '#eff6ff' : 'white',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setSelectedDoc('obituary')}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '100%',
                    height: '128px',
                    background: '#f3f4f6',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FileText size={48} style={{ color: '#9ca3af' }} />
                  </div>
                  <h3 style={{
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '8px',
                    fontSize: '1.1rem'
                  }}>부고장</h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '4px'
                  }}>
                    <button style={{
                      background: '#3b82f6',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}>
                      <Eye size={12} style={{ marginRight: '4px' }} />
                      미리보기
                    </button>
                    <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateCustomerDocuments(selectedCustomer.id, 'obituary');
                        }}
                        style={{
                          background: '#10b981',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                    >
                      제작하기
                    </button>
                    <button style={{
                      background: '#6b7280',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}>
                      <Download size={12} style={{ marginRight: '4px' }} />
                      다운로드
                    </button>
                    <button style={{
                      background: '#8b5cf6',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}>
                      <Printer size={12} style={{ marginRight: '4px' }} />
                      인쇄하기
                    </button>
                  </div>
                </div>
              </div>

              {/* 사망신고서 */}
              <div
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    padding: '16px',
                    cursor: 'pointer',
                    border: selectedDoc === 'deathCertificate' ? '2px solid #3b82f6' : '2px solid transparent',
                    backgroundColor: selectedDoc === 'deathCertificate' ? '#eff6ff' : 'white',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setSelectedDoc('deathCertificate')}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '100%',
                    height: '128px',
                    background: '#f3f4f6',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FileText size={48} style={{ color: '#9ca3af' }} />
                  </div>
                  <h3 style={{
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '8px',
                    fontSize: '1.1rem'
                  }}>사망신고서</h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '4px'
                  }}>
                    <button style={{
                      background: '#3b82f6',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}>
                      <Eye size={12} style={{ marginRight: '4px' }} />
                      미리보기
                    </button>
                    <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateCustomerDocuments(selectedCustomer.id, 'deathCertificate');
                        }}
                        style={{
                          background: '#10b981',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                    >
                      제작하기
                    </button>
                    <button style={{
                      background: '#6b7280',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}>
                      <Download size={12} style={{ marginRight: '4px' }} />
                      다운로드
                    </button>
                    <button style={{
                      background: '#8b5cf6',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}>
                      <Printer size={12} style={{ marginRight: '4px' }} />
                      인쇄하기
                    </button>
                  </div>
                </div>
              </div>

              {/* 장례일정표 */}
              <div
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    padding: '16px',
                    cursor: 'pointer',
                    border: selectedDoc === 'schedule' ? '2px solid #3b82f6' : '2px solid transparent',
                    backgroundColor: selectedDoc === 'schedule' ? '#eff6ff' : 'white',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setSelectedDoc('schedule')}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '100%',
                    height: '128px',
                    background: '#f3f4f6',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Calendar size={48} style={{ color: '#9ca3af' }} />
                  </div>
                  <h3 style={{
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '8px',
                    fontSize: '1.1rem'
                  }}>장례일정표</h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '4px'
                  }}>
                    <button style={{
                      background: '#3b82f6',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}>
                      <Eye size={12} style={{ marginRight: '4px' }} />
                      미리보기
                    </button>
                    <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateCustomerDocuments(selectedCustomer.id, 'schedule');
                        }}
                        style={{
                          background: '#10b981',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                    >
                      제작하기
                    </button>
                    <button style={{
                      background: '#6b7280',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}>
                      <Download size={12} style={{ marginRight: '4px' }} />
                      다운로드
                    </button>
                    <button style={{
                      background: '#8b5cf6',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}>
                      <Printer size={12} style={{ marginRight: '4px' }} />
                      인쇄하기
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 오른쪽 미리보기 영역 */}
            <div style={{
              background: '#f9fafb',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}>
              {getPreviewContent(selectedDoc)}
            </div>
          </div>

          {/* 하단 일괄 처리 버튼 */}
          <div style={{
            marginTop: '24px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            padding: '16px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '16px'
            }}>
              <button
                  onClick={() => {
                    updateCustomerDocuments(selectedCustomer.id, 'obituary');
                    updateCustomerDocuments(selectedCustomer.id, 'deathCertificate');
                    updateCustomerDocuments(selectedCustomer.id, 'schedule');
                    setCustomers(customers.map(c =>
                        c.id === selectedCustomer.id
                            ? {...c, status: 'completed'}
                            : c
                    ));
                  }}
                  style={{
                    background: '#8b5cf6',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
              >
                <FileText size={16} style={{ marginRight: '8px' }} />
                전체 서류 일괄 제작
              </button>
              <button style={{
                background: '#6b7280',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}>
                <Printer size={16} style={{ marginRight: '8px' }} />
                완성된 서류 일괄 인쇄
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
        {currentView === 'documents' && <DocumentsView />}
      </div>
  );
};

export default Menu1;