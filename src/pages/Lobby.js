// src/pages/Lobby.js - 사용자용 로비 페이지

import React, { useState, useEffect } from 'react';
import { Button, Card, Badge, Spinner, Alert, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Heart, Calendar, Search, LogOut, User, ArrowRight, Check, X, Printer, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { customerService } from '../services/customerService';
import { documentService } from '../services/documentService';

const Lobby = () => {
  const [memorialHalls, setMemorialHalls] = useState([]);
  const [memorialDetails, setMemorialDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [documentsLoading, setDocumentsLoading] = useState(true);
  const [error, setError] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [animateCard, setAnimateCard] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewContent, setPreviewContent] = useState({ title: '', content: '' });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      loadMemorialHalls();
    }
    setTimeout(() => setAnimateCard(true), 100);
  }, [user]);

  useEffect(() => {
    if (memorialHalls.length > 0) {
      loadCustomerDocuments(); 
    } else if (!loading) {
      setDocumentsLoading(false);
    }
  }, [memorialHalls, loading]);

  const loadMemorialHalls = async () => {
    try {
      setLoading(true);
      setError('');
      setMemorialHalls([]); 

      // 1단계: 로그인한 유저(유가족)의 정보를 조회하여 memorialId를 가져오기
      console.log('로그인한 사용자 ID:', user.id);
      const familyInfo = await apiService.getFamily(user.id);
      console.log('유가족 정보:', familyInfo);
      const memorialId = familyInfo.memorialId; 

      // 2단계: memorialId가 존재할 경우, 해당 ID로 추모관의 상세 정보 조회
      if (memorialId) {
        try {
          const memorialData = await apiService.getMemorial(memorialId);
          console.log('추모관 정보:', memorialData);

          let customerStatus = 'active'; 
          if (memorialData.customerId) {
            try {
              // customerId로 고객 정보를 가져오기
              const customerInfo = await customerService.getCustomerById(memorialData.customerId);
              
              // customerInfo.status 값에 따라 진행상태 상태값
              if (customerInfo && customerInfo.status) {
                switch (customerInfo.status) {
                  case 'inProgress':
                    customerStatus = 'active'; 
                    break;
                  case 'completed':
                    customerStatus = 'completed'; 
                    break;
                  case 'pending':
                  default:
                    customerStatus = 'scheduled'; 
                }
              }
            } catch (e) {
              console.error("고객 상태 정보를 불러오는데 실패했습니다:", e);
            }
          }
          
          // 화면에 표시할 데이터 형태로 가공
          const formattedMemorial = {
            id: memorialId,
            name: `故 ${memorialData.name || '고인'} 추모관`, // API 응답에 맞게 필드명 수정
            period: `${memorialData.birthDate || '미상'} ~ ${memorialData.deceasedDate || '미상'}`,
            joinCode: memorialId, // 추모관 고유번호는 memorialId를 사용
            status: customerStatus, 
            customerId: memorialData.customerId 
          };

          setMemorialHalls([formattedMemorial]);
        } catch (memorialError) {
          console.error('추모관 상세 정보 조회 실패:', memorialError);
          setError(`추모관 정보를 불러올 수 없습니다 (ID: ${memorialId}). 관리자에게 문의하세요.`);
        }
      } else {
        console.log('연결된 추모관이 없습니다.');
        setError('아직 추모관이 생성되지 않았습니다. 관리자에게 추모관 생성을 요청하세요.');
        setMemorialHalls([]);
      }

    } catch (err) {
      console.error('추모관 정보를 불러오는 중 오류 발생:', err);
      
      // 상세한 에러 메시지 제공
      if (err.response) {
        if (err.response.status === 404) {
          setError('유가족 정보를 찾을 수 없습니다. 관리자에게 문의하세요.');
        } else if (err.response.status === 401) {
          setError('인증이 만료되었습니다. 다시 로그인해주세요.');
        } else {
          setError(`서버 오류가 발생했습니다 (${err.response.status}). 잠시 후 다시 시도해주세요.`);
        }
      } else if (err.request) {
        setError('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
      } else {
        setError('알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
      
      setMemorialHalls([]);
    } finally {
      setLoading(false);
    }
  };

  // 각 추모관에 대한 고객 정보 및 서류 상태를 가져오는 함수
 const loadCustomerDocuments = async () => {
    try {
      setDocumentsLoading(true);
      const detailsPromises = memorialHalls.map(async (memorial) => {
        if (!memorial.customerId) {
          return [memorial.id, { customer: null, statuses: {} }];
        }

        let customer = null;
        try {
            const response = await customerService.getCustomerById(memorial.customerId);
            customer = response.data; 
        } catch (e) {
            console.error(`Failed to fetch customer ${memorial.customerId}`, e);
        }

        const statusPromises = [
          apiService.getObituaryByCustomerId(memorial.customerId),
          apiService.getScheduleByCustomerId(memorial.customerId),
          apiService.getDeathReportByCustomerId(memorial.customerId)
        ];
        
        const results = await Promise.allSettled(statusPromises);
        
        const statuses = {
          obituary: results[0].status === 'fulfilled' && results[0].value?.data,
          schedule: results[1].status === 'fulfilled' && results[1].value?.data,
          deathCertificate: results[2].status === 'fulfilled' && results[2].value?.data,
        };
        
        return [memorial.id, { customer, statuses }];
      });
      
      const detailsArray = await Promise.all(detailsPromises);
      setMemorialDetails(Object.fromEntries(detailsArray));
    } catch (err) {
      console.error('Error loading customer documents status:', err);
      setError('서류 상태를 불러오는 중 오류가 발생했습니다.');
    } finally {
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
      const memorial = await apiService.getMemorialByCode(joinCode);
      if (memorial) {
        navigate(`/user-memorial/${memorial.id}`);
      } else {
        setError('유효하지 않은 고유번호입니다.');
      }
    } catch (err) {
      setError('추모관을 찾는데 실패했습니다.');
    }
  };

  const handleMemorialClick = async (memorial) => {
    try {
      setError('');
      const details = await apiService.getMemorialDetails(memorial.id);
      if (details) {
        navigate(`/user-memorial/${details.id}`);
      } else {
        setError('추모관 정보를 불러올 수 없습니다.');
      }
    } catch (err) {
      setError('추모관 정보를 불러오는 중 오류가 발생했습니다.');
    }
  };

  const handlePreview = async (docType, customer) => {
    if (!customer || !customer.formData) {
        setPreviewContent({ title: '오류', content: '미리보기를 위한 데이터가 없습니다.' });
        setShowPreviewModal(true);
        return;
    }
    try {
        const preview = await documentService.previewDocument(docType, customer.formData);
        setPreviewContent(preview);
        setShowPreviewModal(true);
    } catch (error) {
        setPreviewContent({ title: '미리보기 오류', content: '미리보기를 불러올 수 없습니다.' });
        setShowPreviewModal(true);
    }
  };

  
  // 카드 목록에서 바로 인쇄 버튼을 눌렀을 때 실행되는 함수
  const handlePrintDocument = async (docType, customer) => {
    if (!customer || !customer.formData) {
      setError("인쇄할 서류 데이터를 불러올 수 없습니다.");
      return;
    }
    try {
      const documentToPrint = await documentService.previewDocument(docType, customer.formData);
      const printArea = document.getElementById('printable-area');
      
      if (printArea) {
        printArea.innerHTML = `
          <div style="background: white; font-family: serif; padding: 32px;">
            <h2 style="text-align: center; margin-bottom: 32px; font-size: 24px; font-weight: bold;">${documentToPrint.title}</h2>
            <div style="white-space: pre-line; line-height: 1.8; font-size: 16px;">${documentToPrint.content}</div>
          </div>
        `;
        
        window.print(); 
        printArea.innerHTML = ''; 
      } else {
        setError("인쇄 영역을 찾을 수 없습니다.");
      }
    } catch (error) {
      setError("서류를 인쇄하는 중 오류가 발생했습니다.");
      console.error("Error during printing:", error);
    }
  };

  const handlePrintFromModal = () => {
    const printArea = document.getElementById('printable-area');
    if (printArea && previewContent.content) {
      printArea.innerHTML = `
        <div style="background: white; font-family: serif; padding: 32px;">
          <h2 style="text-align: center; margin-bottom: 32px; font-size: 24px; font-weight: bold;">${previewContent.title}</h2>
          <div style="white-space: pre-line; line-height: 1.8; font-size: 16px;">${previewContent.content}</div>
        </div>
      `;
      window.print();
      printArea.innerHTML = '';
    } else {
      setError("인쇄할 미리보기 내용이 없습니다.");
    }
  };


  const getStatusBadge = (status) => {
    if (status === 'active') {
      return <Badge bg="success">진행중</Badge>;
    } else if (status === 'completed') {
      return <Badge bg="secondary">완료</Badge>;
    }
    return <Badge bg="warning">예정</Badge>;
  };

  const maskName = (name) => {
    if (!name || name.length < 2) {
      return name;
    }
    return name.slice(0, -1) + '*';
  };

  const documentsInfo = [
    { type: 'obituary', name: '부고장' },
    { type: 'schedule', name: '일정표' },
    { type: 'deathCertificate', name: '사망신고서' },
  ];

  return (
    <div className="lobby-wrapper" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%)',
      padding: '20px'
    }}>
      {/* Header */}
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
            <span style={{ fontWeight: '600', color: '#333' }}>{maskName(user?.name) || '사용자'}님</span>
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
        {/* Memorial Halls List */}
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

          {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
              <Spinner animation="border" size="lg" style={{ color: '#B8860B' }} />
              <span style={{ marginLeft: '15px', fontSize: '1.1rem' }}>추모관을 불러오는 중...</span>
            </div>
          ) : memorialHalls.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6c757d' }}>
              <Heart size={64} style={{ opacity: 0.3, marginBottom: '20px' }} />
              <h4>등록된 추모관이 없습니다</h4>
              <p>아래 추모관 고유번호로 추모관에 참여하시거나, 관리자에게 문의해주세요.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px'
            }}>
              {memorialHalls.map((memorial, index) => {
                const details = memorialDetails[memorial.id];
                const customer = details?.customer;
                const statuses = details?.statuses;

                return (
                  <Card
                    key={memorial.id}
                    style={{
                      border: 'none',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      transform: animateCard ? 'translateY(0)' : 'translateY(30px)',
                      opacity: animateCard ? 1 : 0,
                      transition: `all 0.6s ease-out ${index * 0.1}s`,
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                    }}
                  >
                    <div 
                      onClick={() => handleMemorialClick(memorial)}
                      style={{
                        cursor: 'pointer',
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
                    
                    <Card.Body onClick={() => handleMemorialClick(memorial)} style={{ padding: '20px', cursor: 'pointer', flexGrow: 1 }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div style={{ flex: 1, marginRight: '10px' }}>
                          <small className="text-muted" style={{ fontSize: '0.75rem' }}>추모관 고유번호</small>
                          <div 
                            className="fw-bold" 
                            style={{ 
                              color: '#B8860B', 
                              fontSize: '0.75rem', 
                              letterSpacing: '0.3px',
                              cursor: 'pointer',
                              wordBreak: 'break-all',
                              lineHeight: '1.2',
                              padding: '2px 4px',
                              borderRadius: '4px',
                              backgroundColor: 'rgba(184, 134, 11, 0.1)',
                              border: '1px dashed rgba(184, 134, 11, 0.3)',
                              transition: 'all 0.2s ease'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(memorial.joinCode);
                              // 복사 완료 표시
                              const element = e.target;
                              const originalText = element.textContent;
                              element.textContent = '복사완료!';
                              element.style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
                              element.style.borderColor = 'rgba(40, 167, 69, 0.3)';
                              element.style.color = '#28a745';
                              setTimeout(() => {
                                element.textContent = originalText;
                                element.style.backgroundColor = 'rgba(184, 134, 11, 0.1)';
                                element.style.borderColor = 'rgba(184, 134, 11, 0.3)';
                                element.style.color = '#B8860B';
                              }, 1500);
                            }}
                            title="클릭하여 복사"
                          >
                            {memorial.joinCode}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', color: '#B8860B', flexShrink: 0 }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: '600', marginRight: '5px' }}>
                            입장하기
                          </span>
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </Card.Body>
                    <Card.Footer style={{ background: 'rgba(0,0,0,0.02)', borderTop: '1px solid rgba(0,0,0,0.05)', padding: '15px 20px' }}>
                      <div style={{ fontWeight: '600', color: '#555', marginBottom: '12px', fontSize: '0.9rem' }}>서류 작성 상태</div>
                      {documentsLoading ? <Spinner animation="border" size="sm" /> :
                      !customer ? <div style={{fontSize: '0.85rem', color: '#888'}}>서류 정보 없음</div> :
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {documentsInfo.map(docInfo => {
                          const isCompleted = statuses && statuses[docInfo.type];
                          return (
                            <div key={docInfo.type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                {isCompleted ? <Check size={16} style={{ color: '#28a745', marginRight: '6px' }} /> : <X size={16} style={{ color: '#dc3545', marginRight: '6px' }} />}
                                <span style={{ fontWeight: 500, color: isCompleted ? '#333' : '#888' }}>{docInfo.name}</span>
                              </div>
                              {isCompleted && (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <Button variant="outline-secondary" size="sm" style={{ padding: '2px 6px', fontSize: '0.75rem' }} onClick={(e) => { e.stopPropagation(); handlePreview(docInfo.type, customer); }}>
                                    <Eye size={12} />
                                  </Button>
                                  <Button variant="outline-secondary" size="sm" style={{ padding: '2px 6px', fontSize: '0.75rem' }} onClick={(e) => { e.stopPropagation(); handlePrintDocument(docInfo.type, customer); }}>
                                     <Printer size={12} />
                                  </Button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      }
                    </Card.Footer>
                  </Card>
                )})}
            </div>
          )}
        </div>

        {/* Sidebar */}
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
              추모관 고유번호로 입장
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

      <Modal show={showPreviewModal} onHide={() => setShowPreviewModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{previewContent.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: '#f9f9f9', maxHeight: '70vh', overflowY: 'auto' }}>
            <div style={{ background: 'white', fontFamily: 'serif', padding: '32px', border: '1px solid #ddd' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '32px', fontSize: '24px', fontWeight: 'bold' }}>{previewContent.title}</h2>
                <div style={{ whiteSpace: 'pre-line', lineHeight: '1.8', fontSize: '16px' }} dangerouslySetInnerHTML={{ __html: previewContent.content }} />
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreviewModal(false)}>
            닫기
          </Button>
          <Button variant="primary" onClick={handlePrintFromModal}>
            <Printer size={16} style={{ marginRight: '6px' }} />
            인쇄
          </Button>
        </Modal.Footer>
      </Modal>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in { animation: fadeInUp 0.6s ease-out; }
        @media (max-width: 768px) {
          .lobby-wrapper > div { grid-template-columns: 1fr !important; gap: 20px !important; }
          .memorial-section > div:last-child { grid-template-columns: 1fr !important; }
        }
        .printable-content { display: none; }
        @media print {
            body * { visibility: hidden; }
            .printable-content, .printable-content * { visibility: visible; }
            .printable-content { 
                position: absolute; 
                left: 0; 
                top: 0; 
                width: 100%;
                height: 100%;
            }
        }
      `}</style>
    </div>
  );
};

export default Lobby;