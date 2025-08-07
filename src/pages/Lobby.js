// src/pages/Lobby.js - 사용자용 로비 페이지

import React, { useState, useEffect } from 'react';
import { Button, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Heart, Calendar, Users, Search, LogOut, User, ArrowRight, FileText, Check, X, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserMemorialHalls, getMemorialByCode } from '../services/memorialService';
import { customerService, customerUtils } from '../services/customerService';

const Lobby = () => {
  const [memorialHalls, setMemorialHalls] = useState([]);
  const [customerDocuments, setCustomerDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [documentsLoading, setDocumentsLoading] = useState(true);
  const [error, setError] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [animateCard, setAnimateCard] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadMemorialHalls();
    loadCustomerDocuments();
    setTimeout(() => setAnimateCard(true), 100);
  }, [user]);

  const loadMemorialHalls = async () => {
    try {
      setLoading(true);
      setError('');
      
      // 실제 서비스 사용 - 현재 사용자가 유가족으로 등록된 추모관들 가져오기
      const userMemorials = await getUserMemorialHalls(user?.id || user?.loginId);
      setMemorialHalls(userMemorials);
      setLoading(false);
      
    } catch (err) {
      setError('추모관 목록을 불러오는데 실패했습니다.');
      setLoading(false);
    }
  };

  const loadCustomerDocuments = async () => {
    try {
      setDocumentsLoading(true);
      
      // 모든 고객 정보를 가져와서 현재 사용자가 유가족으로 등록된 고인들 필터링
      const allCustomers = await customerService.getAllCustomers();
      const userMemorials = await getUserMemorialHalls(user?.id || user?.loginId);
      
      // 추모관에 등록된 고인의 이름과 매칭되는 고객 정보 필터링
      const userRelatedCustomers = allCustomers.filter(customer => 
        userMemorials.some(memorial => memorial.name === customer.name)
      );
      
      setCustomerDocuments(userRelatedCustomers);
      setDocumentsLoading(false);
      
    } catch (err) {
      console.error('Error loading customer documents:', err);
      setDocumentsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleJoinByCode = async () => {
    if (!joinCode.trim()) {
      setError('고유 번호를 입력해주세요.');
      return;
    }
    
    try {
      setError('');
      // 고유번호로 추모관 검증
      const memorial = await getMemorialByCode(joinCode);
      
      if (memorial) {
        navigate(`/user-memorial/${memorial.id}`);
      } else {
        setError('유효하지 않은 고유번호입니다.');
      }
    } catch (err) {
      setError('추모관을 찾는데 실패했습니다.');
    }
  };

  const handleMemorialClick = (memorial) => {
    navigate(`/user-memorial/${memorial.id}`);
  };

  const getStatusBadge = (status) => {
    if (status === 'active') {
      return <Badge bg="success">진행중</Badge>;
    } else if (status === 'completed') {
      return <Badge bg="secondary">완료</Badge>;
    }
    return <Badge bg="warning">예정</Badge>;
  };

  const getDocumentStatusBadge = (status) => {
    if (status === 'pending') {
      return <Badge bg="warning">대기중</Badge>;
    } else if (status === 'inProgress') {
      return <Badge bg="primary">진행중</Badge>;
    } else if (status === 'completed') {
      return <Badge bg="success">완료</Badge>;
    }
    return <Badge bg="secondary">미정</Badge>;
  };

  const statusBackgrounds = {
    pending: 'linear-gradient(135deg, #E5B83A, #E5B83A)',
    inProgress: 'linear-gradient(135deg, #133d6cff, #133d6cff)', 
    completed: 'linear-gradient(135deg, #146c43 0%, #146c43 100%)', 
  };
  const defaultBackground = 'linear-gradient(135deg, #B8860B, #B8860B)';

  return (
    <div className="lobby-wrapper" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%)',
      padding: '20px'
    }}>
      {/* 헤더 */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '20px 30px',
        marginBottom: '30px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Heart size={32} style={{ color: '#B8860B', marginRight: '12px' }} />
          <h1 style={{
            margin: 0,
            fontSize: '2rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #B8860B 0%, #CD853F 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            추모관 로비
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{
            background: 'rgba(184, 134, 11, 0.1)',
            padding: '8px 16px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <User size={16} style={{ marginRight: '8px', color: '#B8860B' }} />
            <span style={{ fontWeight: '600', color: '#333' }}>{user?.name || '사용자'}님</span>
          </div>
          <Button
            variant="outline-secondary"
            onClick={handleLogout}
            style={{
              borderRadius: '12px',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <LogOut size={16} style={{ marginRight: '6px' }} />
            로그아웃
          </Button>
        </div>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '30px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* 메인 콘텐츠 - 추모관 목록 */}
        <div className={`memorial-section ${animateCard ? 'animate-in' : ''}`} style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          transform: animateCard ? 'translateY(0)' : 'translateY(30px)',
          opacity: animateCard ? 1 : 0,
          transition: 'all 0.6s ease-out'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '25px',
            paddingBottom: '20px',
            borderBottom: '2px solid rgba(184, 134, 11, 0.1)'
          }}>
            <Calendar size={24} style={{ color: '#B8860B', marginRight: '12px' }} />
            <h2 style={{
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#333'
            }}>
              내 추모관 목록
            </h2>
          </div>

          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          {loading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '300px'
            }}>
              <Spinner animation="border" size="lg" style={{ color: '#B8860B' }} />
              <span style={{ marginLeft: '15px', fontSize: '1.1rem' }}>추모관을 불러오는 중...</span>
            </div>
          ) : memorialHalls.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#6c757d'
            }}>
              <Heart size={64} style={{ opacity: 0.3, marginBottom: '20px' }} />
              <h4>등록된 추모관이 없습니다</h4>
              <p>아래 고유번호로 추모관에 참여하시거나, 관리자에게 문의해주세요.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px'
            }}>
              {memorialHalls.map((memorial, index) => (
                <Card
                  key={memorial.id}
                  style={{
                    border: 'none',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transform: animateCard ? 'translateY(0)' : 'translateY(30px)',
                    opacity: animateCard ? 1 : 0,
                    transition: `all 0.6s ease-out ${index * 0.1}s`,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                  }}
                  onClick={() => handleMemorialClick(memorial)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                  }}
                >
                  <div style={{
                    background: memorial.status === 'active' 
                      ? 'linear-gradient(135deg, #B8860B 0%, #CD853F 100%)'
                      : memorial.status === 'completed'
                      ? 'linear-gradient(135deg, #6c757d 0%, #495057 100%)'
                      : 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)',
                    padding: '20px',
                    color: 'white'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '15px'
                    }}>
                      <div>
                        <h5 style={{ margin: '0 0 5px 0', fontSize: '1.3rem', fontWeight: '700' }}>
                          {memorial.name}
                        </h5>
                        <p style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem' }}>
                          {memorial.description}
                        </p>
                      </div>
                      {getStatusBadge(memorial.status)}
                    </div>
                    
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      padding: '12px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                          {memorial.period}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Card.Body style={{ padding: '20px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <small className="text-muted" style={{ fontSize: '0.8rem' }}>추모관 고유번호</small>
                        <div 
                          className="fw-bold" 
                          style={{ 
                            color: '#B8860B', 
                            fontSize: '1rem', 
                            letterSpacing: '0.5px' 
                          }}
                        >
                          {memorial.joinCode}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', color: '#B8860B' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: '600', marginRight: '5px' }}>
                          입장하기
                        </span>
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* 사이드바 - 고유번호 입장 */}
        <div className={`sidebar-section ${animateCard ? 'animate-in' : ''}`} style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          height: 'fit-content',
          transform: animateCard ? 'translateY(0)' : 'translateY(30px)',
          opacity: animateCard ? 1 : 0,
          transition: 'all 0.6s ease-out 0.2s'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '25px',
            paddingBottom: '20px',
            borderBottom: '2px solid rgba(184, 134, 11, 0.1)'
          }}>
            <Search size={24} style={{ color: '#B8860B', marginRight: '12px' }} />
            <h3 style={{
              margin: 0,
              fontSize: '1.3rem',
              fontWeight: '700',
              color: '#333'
            }}>
              고유번호로 입장
            </h3>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              fontWeight: '600',
              color: '#555'
            }}>
              추모관 고유번호
            </label>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="예: MEM001"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#B8860B';
                e.target.style.boxShadow = '0 0 0 3px rgba(184, 134, 11, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <Button
            onClick={handleJoinByCode}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              fontWeight: '600',
              background: 'linear-gradient(135deg, #B8860B 0%, #CD853F 100%)',
              border: 'none',
              boxShadow: '0 4px 15px rgba(184, 134, 11, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(184, 134, 11, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(184, 134, 11, 0.3)';
            }}
          >
            <Search size={16} style={{ marginRight: '8px' }} />
            추모관 입장
          </Button>

          <div style={{
            marginTop: '30px',
            padding: '20px',
            background: 'rgba(184, 134, 11, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(184, 134, 11, 0.1)'
          }}>
            <h6 style={{ color: '#B8860B', marginBottom: '10px', fontWeight: '600' }}>
              안내사항
            </h6>
            <ul style={{
              fontSize: '0.85rem',
              color: '#6c757d',
              paddingLeft: '15px',
              margin: 0
            }}>
              <li>추모관 고유번호는 관리자에게 문의하세요</li>
              <li>유가족 등록이 필요한 경우 관리자가 도움을 드립니다</li>
              <li>추모관 참여 후 조문 글을 남기실 수 있습니다</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 고인 문서 작성 현황 섹션 */}
      <div className={`documents-section ${animateCard ? 'animate-in' : ''}`} style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '30px',
        marginTop: '30px',
        maxWidth: '1400px',
        margin: '30px auto 0',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        transform: animateCard ? 'translateY(0)' : 'translateY(30px)',
        opacity: animateCard ? 1 : 0,
        transition: 'all 0.6s ease-out 0.4s'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '25px',
          paddingBottom: '20px',
          borderBottom: '2px solid rgba(184, 134, 11, 0.1)'
        }}>
          <FileText size={24} style={{ color: '#B8860B', marginRight: '12px' }} />
          <h2 style={{
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#333'
          }}>
            고인 문서 작성 현황
          </h2>
        </div>

        {documentsLoading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px'
          }}>
            <Spinner animation="border" size="lg" style={{ color: '#B8860B' }} />
            <span style={{ marginLeft: '15px', fontSize: '1.1rem' }}>문서 현황을 불러오는 중...</span>
          </div>
        ) : customerDocuments.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#6c757d'
          }}>
            <FileText size={64} style={{ opacity: 0.3, marginBottom: '20px' }} />
            <h4>문서 작성이 필요한 고인이 없습니다</h4>
            <p>현재 유가족으로 등록된 고인의 문서 작성 현황이 없습니다.</p>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {customerDocuments.map((customer, index) => (
              <div key={customer.id} style={{
                background: 'rgba(253, 251, 243, 0.92)',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(44, 31, 20, 0.1)',
                border: '1px solid rgba(184, 134, 11, 0.2)',
                display: 'flex',
                minHeight: '140px',
                position: 'relative',
                transform: animateCard ? 'translateY(0)' : 'translateY(30px)',
                opacity: animateCard ? 1 : 0,
                transition: `all 0.6s ease-out ${(index * 0.1) + 0.5}s`
              }}>
                <div style={{
                  background: statusBackgrounds[customer.status] || defaultBackground,
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
                    {getDocumentStatusBadge(customer.status)}
                  </div>
                  
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.15)', 
                    padding: '10px',
                    borderRadius: '10px', 
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    <p style={{ fontSize: '0.95rem', fontWeight: '600', margin: '0 0 2px 0' }}>
                      향년 {customer.age}세
                    </p>
                    <p style={{ fontSize: '0.85rem', margin: 0, opacity: 0.9 }}>
                      {customerUtils.formatDate(customer.funeralDate)}
                    </p>
                  </div>
                </div>

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
                        background: 'rgba(184, 134, 11, 0.08)', 
                        borderRadius: '8px', 
                        border: '1px solid rgba(184, 134, 11, 0.15)' 
                      }}>
                        <Phone size={14} style={{ color: '#B8860B', marginRight: '6px' }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: '500', color: '#2C1F14' }}>
                          {customer.phone}
                        </span>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        padding: '8px', 
                        background: 'rgba(184, 134, 11, 0.08)', 
                        borderRadius: '8px', 
                        border: '1px solid rgba(184, 134, 11, 0.15)' 
                      }}>
                        <MapPin size={14} style={{ color: '#B8860B', marginRight: '6px' }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: '500', color: '#2C1F14' }}>
                          {customer.location}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <FileText size={14} style={{ color: '#B8860B', marginRight: '6px' }} />
                        <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#2C1F14' }}>
                          서류 작성 상태
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {Object.entries(customer.documents).map(([docType, isCompleted]) => {
                          const docNames = { obituary: '부고장', schedule: '일정표', deathCertificate: '사망신고서' };
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
                              {isCompleted ? <Check size={12} style={{ marginRight: '3px' }} /> : <X size={12} style={{ marginRight: '3px' }} />}
                              {docNames[docType]}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center',
                  alignItems: 'center', 
                  padding: '20px 16px',
                  background: 'rgba(253, 251, 243, 0.92)',
                  borderLeft: '1px solid rgba(184, 134, 11, 0.2)',
                  minWidth: '140px', 
                  gap: '8px'
                }}>
                  <Button
                    onClick={() => {
                      localStorage.setItem('selectedCustomer', JSON.stringify(customer));
                      navigate('/menu1-2');
                    }}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      background: 'linear-gradient(135deg, #D4AF37, #F5C23E)',
                      border: 'none',
                      color: '#2C1F14',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #CAA230, #E8B530)';
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 15px rgba(184, 134, 11, 0.25)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #D4AF37, #F5C23E)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <FileText size={14} style={{ marginRight: '4px' }} />
                    정보등록
                  </Button>

                  <Button 
                    onClick={() => {
                      localStorage.setItem('selectedCustomer', JSON.stringify(customer));
                      navigate('/menu1-3');
                    }}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      backgroundColor: 'transparent',
                      border: '1px solid #B8860B',
                      color: '#B8860B',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#B8860B';
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#B8860B';
                    }}
                  >
                    <Users size={14} style={{ marginRight: '4px' }} />
                    서류관리
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-in {
          animation: fadeInUp 0.6s ease-out;
        }

        @media (max-width: 768px) {
          .lobby-wrapper > div {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          
          .memorial-section > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Lobby;