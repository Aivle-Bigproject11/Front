
import React, { useState, useEffect } from 'react';
import { Users, FileText, Calendar, User, Phone, MapPin, Clock, Check, X, Plus, Eye, Printer, Download, Heart } from 'lucide-react';

const FuneralManagementSystem = () => {
  const [currentView, setCurrentView] = useState('customerList');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [animateCard, setAnimateCard] = useState(false);

  useEffect(() => {
    // 카드 애니메이션 효과
    setAnimateCard(true);
  }, []);

  const [customers, setCustomers] = useState([
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
  ]);

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
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'inProgress': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'completed': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
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
      case 'urgent': return '3px solid #ef4444';
      case 'warning': return '3px solid #f59e0b';
      default: return '3px solid #8b5cf6';
    }
  };

  // 고객 리스트 화면
  const CustomerListView = () => (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '24px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start'
    }}>
      {/* 배경 장식 효과 */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0
      }}>
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '30%',
          left: '5%',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.03)',
          animation: 'float 8s ease-in-out infinite reverse'
        }}></div>
      </div>

      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '1200px',
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        boxShadow: '0 32px 64px rgba(0, 0, 0, 0.12)',
        padding: '32px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        transform: animateCard ? 'translateY(0)' : 'translateY(30px)',
        opacity: animateCard ? 1 : 0,
        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* 헤더 섹션 */}
        <div style={{
          marginBottom: '32px',
          paddingBottom: '24px',
          borderBottom: '2px solid rgba(102, 126, 234, 0.1)'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            margin: 0,
            textShadow: 'none'
          }}>
            <Users style={{
              marginRight: '16px', 
              color: '#667eea',
              filter: 'drop-shadow(0 2px 4px rgba(102, 126, 234, 0.2))'
            }} size={40} />
            고객 관리
          </h1>
          <p style={{
            color: '#64748b',
            fontSize: '1.1rem',
            marginTop: '8px',
            marginLeft: '56px',
            fontWeight: '500'
          }}>
            장례 고객 정보를 체계적으로 관리하고 서류를 처리하세요
          </p>
        </div>

        {/* 고객 카드 리스트 */}
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
                position: 'relative'
              }}>
                {/* 긴급도 표시 배지 */}
                {urgency === 'urgent' && (
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    zIndex: 10,
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                  }}>
                    <Clock size={14} style={{ marginRight: '4px' }} />
                    긴급
                  </div>
                )}

                {/* 왼쪽: 고객 정보 섹션 */}
                <div style={{
                  background: urgency === 'urgent' 
                    ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                    : urgency === 'warning'
                    ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                    : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
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
                          <span style={{
                            fontSize: '0.8rem',
                            background: 'rgba(255, 255, 255, 0.2)',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            marginLeft: '8px'
                          }}>고인</span>
                        </>
                      ) : (
                        customer.name
                      )}
                    </h3>
                    
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      background: 'rgba(255, 255, 255, 0.2)',
                      padding: '6px 12px',
                      borderRadius: '16px',
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}>
                      {getStatusText(customer.status)}
                    </div>
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
                        background: 'rgba(102, 126, 234, 0.05)',
                        borderRadius: '12px',
                        border: '1px solid rgba(102, 126, 234, 0.1)'
                      }}>
                        <Phone size={18} style={{ color: '#667eea', marginRight: '8px' }} />
                        <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#374151' }}>
                          {customer.phone}
                        </span>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px',
                        background: 'rgba(102, 126, 234, 0.05)',
                        borderRadius: '12px',
                        border: '1px solid rgba(102, 126, 234, 0.1)'
                      }}>
                        <User size={18} style={{ color: '#667eea', marginRight: '8px' }} />
                        <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#374151' }}>
                          {!isDeceased ? `${customer.relationship} (유족)` : '본인'}
                        </span>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px',
                        background: 'rgba(102, 126, 234, 0.05)',
                        borderRadius: '12px',
                        border: '1px solid rgba(102, 126, 234, 0.1)'
                      }}>
                        <Calendar size={18} style={{ color: '#667eea', marginRight: '8px' }} />
                        <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#374151' }}>
                          {customer.funeralDate}
                        </span>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px',
                        background: 'rgba(102, 126, 234, 0.05)',
                        borderRadius: '12px',
                        border: '1px solid rgba(102, 126, 234, 0.1)'
                      }}>
                        <MapPin size={18} style={{ color: '#667eea', marginRight: '8px' }} />
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
                        <FileText size={18} style={{ color: '#8b5cf6', marginRight: '8px' }} />
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
                            <div key={docType} style={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: '6px 12px',
                              borderRadius: '20px',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              background: isCompleted 
                                ? 'rgba(34, 197, 94, 0.1)' 
                                : 'rgba(239, 68, 68, 0.1)',
                              border: isCompleted 
                                ? '1px solid rgba(34, 197, 94, 0.2)' 
                                : '1px solid rgba(239, 68, 68, 0.2)',
                              color: isCompleted ? '#166534' : '#dc2626'
                            }}>
                              {isCompleted ? 
                                <Check size={14} style={{ marginRight: '4px' }} /> : 
                                <X size={14} style={{ marginRight: '4px' }} />
                              }
                              {docNames[docType]}
                            </div>
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
                  <button 
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setCurrentView('register');
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      boxShadow: '0 4px 16px rgba(102, 126, 234, 0.25)',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
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
                    <Plus size={16} style={{ marginRight: '6px' }} />
                    정보 등록
                  </button>
                  
                  <button 
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setCurrentView('documents');
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      boxShadow: '0 4px 16px rgba(16, 185, 129, 0.25)',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.35)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 16px rgba(16, 185, 129, 0.25)';
                    }}
                  >
                    <FileText size={16} style={{ marginRight: '6px' }} />
                    서류 관리
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 추가 고객 등록 버튼 */}
        <div style={{
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
            borderRadius: '16px',
            fontSize: '1rem',
            fontWeight: '600',
            boxShadow: '0 8px 24px rgba(139, 92, 246, 0.25)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 12px 32px rgba(139, 92, 246, 0.35)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.25)';
          }}>
            <Plus size={20} style={{ marginRight: '8px' }} />
            새 고객 등록
          </button>
        </div>
      </div>

      {/* CSS 애니메이션 */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
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
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(156, 163, 175, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 16px rgba(156, 163, 175, 0.25)';
            }}>
              임시저장
            </button>
            <button 
              onClick={() => {
                setCurrentView('documents');
              // 상태 업데이트
                setCustomers(customers.map(c => 
                  c.id === selectedCustomer.id 
                    ? {...c, status: c.status === 'pending' ? 'inProgress' : c.status}
                    : c
                ));
              }}
              style={{
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
              저장 후 서류관리로
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // 서류 관리 화면
  const DocumentsView = () => {
    const [selectedDoc, setSelectedDoc] = useState('obituary');
    
    const getDocumentTitle = (docType) => {
      switch(docType) {
        case 'obituary': return '부고장';
        case 'deathCertificate': return '사망신고서';
        case 'schedule': return '장례일정표';
        default: return '';
      }
    };

    const getPreviewContent = (docType) => {
      if (!selectedCustomer?.documents[docType]) {
        return (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#6b7280'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 20px',
                borderRadius: '50%',
                background: 'rgba(102, 126, 234, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileText size={40} style={{ color: '#cbd5e0' }} />
              </div>
              <p style={{ fontWeight: '600', fontSize: '1.1rem' }}>아직 제작되지 않은 문서입니다</p>
              <p style={{ color: '#9ca3af', fontSize: '0.95rem', marginTop: '8px' }}>
                제작하기 버튼을 눌러 문서를 생성하세요
              </p>
            </div>
          </div>
        );
      }

      return (
        <div style={{ padding: '24px', height: '100%', overflowY: 'auto' }}>
          <div style={{
            background: 'white',
            border: '1px solid rgba(203, 213, 224, 0.5)',
            borderRadius: '16px',
            padding: '32px',
            minHeight: '100%',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '16px' }}>
                {getDocumentTitle(docType)}
              </h2>
            </div>
            
            {docType === 'obituary' && (
              <div style={{ lineHeight: '1.8' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '700' }}>부고</h3>
                  <p style={{ marginTop: '16px', fontSize: '1.1rem' }}>
                    고 {selectedCustomer?.name || selectedCustomer?.deceasedName}님께서
                  </p>
                  <p style={{ fontSize: '1.1rem' }}>
                    2025년 7월 28일 향년 75세로 영면하셨습니다.
                  </p>
                </div>
                <div style={{ marginTop: '32px', fontSize: '1rem' }}>
                  <p style={{ marginBottom: '8px' }}>
                    <strong>장례일시:</strong> {selectedCustomer?.funeralDate}
                  </p>
                  <p style={{ marginBottom: '8px' }}>
                    <strong>장례장소:</strong> {selectedCustomer?.location}
                  </p>
                  <p style={{ marginBottom: '8px' }}>
                    <strong>상주:</strong> {selectedCustomer?.name}
                  </p>
                </div>
              </div>
            )}
            
            {docType === 'deathCertificate' && (
              <div style={{ lineHeight: '1.8' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '700' }}>사망신고서</h3>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '16px',
                  marginTop: '32px',
                  fontSize: '1rem'
                }}>
                  <div><strong>성명:</strong> 고 {selectedCustomer?.deceasedName || selectedCustomer?.name}</div>
                  <div><strong>생년월일:</strong> 1950.03.15</div>
                  <div><strong>사망일시:</strong> 2025.07.28</div>
                  <div><strong>신고인:</strong> {selectedCustomer?.name}</div>
                </div>
              </div>
            )}
            
            {docType === 'schedule' && (
              <div style={{ lineHeight: '1.8' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '700' }}>장례일정표</h3>
                </div>
                <div style={{ marginTop: '32px' }}>
                  <div style={{
                    border: '2px solid #e5e7eb', 
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      background: '#f9fafb',
                      padding: '16px',
                      borderBottom: '2px solid #e5e7eb',
                      fontWeight: '700',
                      fontSize: '1.1rem'
                    }}>
                      장례 일정
                    </div>
                    <div style={{ padding: '20px', fontSize: '1rem' }}>
                      <p style={{ marginBottom: '12px' }}>
                        <strong>빈소:</strong> {selectedCustomer?.location}
                      </p>
                      <p style={{ marginBottom: '12px' }}>
                        <strong>발인:</strong> {selectedCustomer?.funeralDate} 오전 10시
                      </p>
                      <p style={{ marginBottom: '12px' }}>
                        <strong>화장:</strong> {selectedCustomer?.funeralDate} 오후 2시
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    };

    return (
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
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
          height: '90vh'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '24px'
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
              서류 관리 - {selectedCustomer?.name}
            </h1>
          </div>

          <div style={{
            display: 'flex',
            flex: 1,
            gap: '24px',
            height: '100%'
          }}>
            {/* 왼쪽: 서류 목록 */}
            <div style={{
              width: '320px',
              background: 'white',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
              border: '1px solid rgba(229, 231, 235, 0.8)'
            }}>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: '700',
                marginBottom: '20px',
                color: '#374151'
              }}>
                서류 목록
              </h3>
              
              {Object.entries(selectedCustomer?.documents || {}).map(([docType, isCompleted]) => {
                const docNames = {
                  obituary: '부고장',
                  schedule: '장례일정표',
                  deathCertificate: '사망신고서'
                };
                
                return (
                  <div key={docType} style={{
                    marginBottom: '12px',
                    padding: '16px',
                    borderRadius: '12px',
                    border: selectedDoc === docType ? '2px solid #667eea' : '2px solid #e5e7eb',
                    background: selectedDoc === docType ? 'rgba(102, 126, 234, 0.05)' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setSelectedDoc(docType)}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <span style={{
                        fontWeight: '600',
                        fontSize: '1rem',
                        color: selectedDoc === docType ? '#667eea' : '#374151'
                      }}>
                        {docNames[docType]}
                      </span>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        background: isCompleted 
                          ? 'rgba(34, 197, 94, 0.1)' 
                          : 'rgba(239, 68, 68, 0.1)',
                        color: isCompleted ? '#166534' : '#dc2626'
                      }}>
                        {isCompleted ? 
                          <Check size={12} style={{ marginRight: '4px' }} /> : 
                          <X size={12} style={{ marginRight: '4px' }} />
                        }
                        {isCompleted ? '완료' : '미완료'}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              <div style={{ marginTop: '24px' }}>
                <button
                  onClick={() => updateCustomerDocuments(selectedCustomer.id, selectedDoc)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.25)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 16px rgba(16, 185, 129, 0.25)';
                  }}
                >
                  {selectedCustomer?.documents[selectedDoc] ? '문서 재생성' : '문서 제작하기'}
                </button>
              </div>
            </div>

            {/* 오른쪽: 문서 미리보기 */}
            <div style={{
              flex: 1,
              background: 'white',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
              border: '1px solid rgba(229, 231, 235, 0.8)',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '24px 32px',
                borderBottom: '2px solid rgba(229, 231, 235, 0.5)',
                background: 'rgba(248, 250, 252, 0.5)'
              }}>
                <h3 style={{
                  fontSize: '1.4rem',
                  fontWeight: '700',
                  color: '#374151',
                  margin: 0
                }}>
                  {getDocumentTitle(selectedDoc)} 미리보기
                </h3>
              </div>
              <div style={{ height: 'calc(100% - 80px)' }}>
                {getPreviewContent(selectedDoc)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 메인 렌더링
  switch(currentView) {
    case 'register':
      return <RegisterView />;
    case 'documents':
      return <DocumentsView />;
    default:
      return <CustomerListView />;
  }
};

export default FuneralManagementSystem;