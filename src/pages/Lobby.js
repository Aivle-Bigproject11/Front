import React, { useState, useEffect } from 'react';
import { Button, Card, Badge, Spinner, Alert, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Heart, Calendar, Search, LogOut, User, ArrowRight, Check, X, Printer, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { customerService } from '../services/customerService';

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

      const familyInfo = await apiService.getFamily(user.id);
      const memorialId = familyInfo.memorialId; 

      if (memorialId) {
        const memorialData = await apiService.getMemorial(memorialId);
        
        let customerStatus = 'active'; 
        if (memorialData.customerId) {
          try {
            const customerInfo = await customerService.getCustomerById(memorialData.customerId);
            if (customerInfo && customerInfo.status) {
              switch (customerInfo.status) {
                case 'inProgress': customerStatus = 'active'; break;
                case 'completed': customerStatus = 'completed'; break;
                case 'pending': default: customerStatus = 'scheduled'; break;
              }
            }
          } catch (e) {
            console.error("고객 상태 정보를 불러오는데 실패했습니다:", e);
          }
        }
        
        const formattedMemorial = {
          id: memorialId,
          name: `故 ${memorialData.name || '고인'} 추모관`,
          description: memorialData.tribute || '',
          period: `${memorialData.birthDate || '미상'} ~ ${memorialData.deceasedDate || '미상'}`,
          joinCode: memorialId,
          status: customerStatus, 
          customerId: memorialData.customerId 
        };

        setMemorialHalls([formattedMemorial]);
      } else {
        setMemorialHalls([]);
      }
    } catch (err) {
      console.error('추모관 정보를 불러오는 중 오류 발생:', err);
      setError('추모관 정보를 불러오는데 실패했습니다.');
      setMemorialHalls([]); 
    } finally {
      setLoading(false);
    }
  };

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
          obituary: results[0].status === 'fulfilled' ? results[0].value?.data : null,
          schedule: results[1].status === 'fulfilled' ? results[1].value?.data : null,
          deathCertificate: results[2].status === 'fulfilled' ? results[2].value?.data : null,
        };
        
        return [memorial.id, { customer, statuses }];
      });
      
      const detailsArray = await Promise.all(detailsPromises);
      setMemorialDetails(Object.fromEntries(detailsArray));
    } catch (err)
    {
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

  const handlePreview = (docType, documentData) => {
    const urlKeys = {
      obituary: 'obituaryFileUrl',
      schedule: 'scheduleFileUrl', 
      deathCertificate: 'deathReportFileUrl' 
    };
    const documentUrl = documentData ? documentData[urlKeys[docType]] : null;

    if (documentUrl) {
      const docName = documentsInfo.find(d => d.type === docType)?.name || '문서';
      setPreviewContent({
        title: `${docName} 미리보기`,
        // PDF를 모달 안에 보여주기 위해 iframe을 사용
        content: `<iframe src="${documentUrl}#toolbar=0" style="width: 100%; height: 65vh; border: none;"></iframe>`

      });
      setShowPreviewModal(true);
    } else {
      alert('미리보기할 서류 파일을 찾을 수 없습니다.');
      console.error("Document URL not found for:", docType, documentData);
    }
  };

  const handlePrint = (docType, documentData) => {
    const urlKeys = {
      obituary: 'obituaryFileUrl',
      schedule: 'scheduleFileUrl',
      deathCertificate: 'deathReportFileUrl'
    };
    const documentUrl = documentData ? documentData[urlKeys[docType]] : null;

    if (documentUrl) {
      // 인쇄는 새 탭에서 PDF를 열어 브라우저의 인쇄 사용
      window.open(documentUrl, '_blank');
    } else {
      alert('인쇄할 서류 파일을 찾을 수 없습니다.');
    }
  };
  
  const getStatusBadge = (status) => {
    if (status === 'active') return <Badge bg="success">진행중</Badge>;
    if (status === 'completed') return <Badge bg="secondary">완료</Badge>;
    return <Badge bg="warning">예정</Badge>;
  };

  const maskName = (name) => {
    if (!name || name.length < 2) return name;
    return name.slice(0, -1) + '*';
  };

  const documentsInfo = [
    { type: 'obituary', name: '부고장' },
    { type: 'schedule', name: '일정표' },
    { type: 'deathCertificate', name: '사망신고서' },
  ];

  return (
    <div className="lobby-wrapper" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%)', padding: '20px' }}>
      <header style={{
        background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)',
        borderRadius: '20px', padding: '20px 30px', marginBottom: '30px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Heart size={32} style={{ color: '#B8860B', marginRight: '12px' }} />
          <h1 style={{
            margin: 0, fontSize: '2rem', fontWeight: '700',
            background: 'linear-gradient(135deg, #B8860B 0%, #CD853F 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>추모관 로비</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{
            background: 'rgba(184, 134, 11, 0.1)', padding: '8px 16px',
            borderRadius: '12px', display: 'flex', alignItems: 'center'
          }}>
            <User size={16} style={{ marginRight: '8px', color: '#B8860B' }} />
            <span style={{ fontWeight: '600', color: '#333' }}>{maskName(user?.name) || '사용자'}님</span>
          </div>
          <Button variant="outline-secondary" onClick={handleLogout} style={{
            borderRadius: '12px', padding: '8px 16px', display: 'flex', alignItems: 'center'
          }}>
            <LogOut size={16} style={{ marginRight: '6px' }} /> 로그아웃
          </Button>
        </div>
      </header>
      <div style={{
        display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px',
        maxWidth: '1400px', margin: '0 auto'
      }}>
        <div className={`memorial-section ${animateCard ? 'animate-in' : ''}`} style={{
          background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)',
          borderRadius: '20px', padding: '30px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          transform: animateCard ? 'translateY(0)' : 'translateY(30px)',
          opacity: animateCard ? 1 : 0, transition: 'all 0.6s ease-out'
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', marginBottom: '25px',
            paddingBottom: '20px', borderBottom: '2px solid rgba(184, 134, 11, 0.1)'
          }}>
            <Calendar size={24} style={{ color: '#B8860B', marginRight: '12px' }} />
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#333' }}>내 추모관 목록</h2>
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
              <p>아래 고유번호로 추모관에 참여하시거나, 관리자에게 문의해주세요.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {memorialHalls.map((memorial, index) => {
                const details = memorialDetails[memorial.id];
                const customer = details?.customer;
                const statuses = details?.statuses;
                return (
                  <Card key={memorial.id} style={{
                      border: 'none', borderRadius: '16px', overflow: 'hidden',
                      display: 'flex', flexDirection: 'column',
                      transform: animateCard ? 'translateY(0)' : 'translateY(30px)',
                      opacity: animateCard ? 1 : 0, transition: `all 0.6s ease-out ${index * 0.1}s`,
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                    }}>
                    <div onClick={() => handleMemorialClick(memorial)} style={{
                        cursor: 'pointer', color: 'white', padding: '20px',
                        background: 'linear-gradient(135deg, #b8860b, #965a25)'
                      }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                        <div>
                          <h5 style={{ margin: '0 0 5px 0', fontSize: '1.3rem', fontWeight: '700' }}>{memorial.name}</h5>
                          <p style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem' }}>{memorial.description}</p>
                        </div>
                        {getStatusBadge(memorial.status)}
                      </div>
                      <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{memorial.period}</span>
                        </div>
                      </div>
                    </div>
                    <Card.Body onClick={() => handleMemorialClick(memorial)} style={{ padding: '20px', cursor: 'pointer', flexGrow: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <small className="text-muted" style={{ fontSize: '0.8rem' }}>추모관 고유번호</small>
                          <div className="fw-bold" style={{ color: '#B8860B', fontSize: '1rem', letterSpacing: '0.5px' }}>{memorial.joinCode}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', color: '#B8860B' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: '600', marginRight: '5px' }}>입장하기</span>
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </Card.Body>
                    <Card.Footer style={{ background: 'rgba(0,0,0,0.02)', borderTop: '1px solid rgba(0,0,0,0.05)', padding: '15px 20px' }}>
                      <div style={{ fontWeight: '600', color: '#555', marginBottom: '12px', fontSize: '0.9rem' }}>서류 작성 상태</div>
                      {documentsLoading ? <Spinner animation="border" size="sm" /> :
                      !customer ? <div style={{fontSize: '0.85rem', color: '#888'}}>서류 정보 없음</div> :
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {documentsInfo.map(docInfo => {
                          const documentData = statuses ? statuses[docInfo.type] : null;
                          const isCompleted = !!documentData;
                          return (
                            <div key={docInfo.type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                {isCompleted ? <Check size={16} style={{ color: '#28a745', marginRight: '6px' }} /> : <X size={16} style={{ color: '#dc3545', marginRight: '6px' }} />}
                                <span style={{ fontWeight: 500, color: isCompleted ? '#333' : '#888' }}>{docInfo.name}</span>
                              </div>
                              {isCompleted && (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <Button variant="outline-secondary" size="sm" style={{ padding: '2px 6px', fontSize: '0.75rem' }} onClick={(e) => { e.stopPropagation(); handlePreview(docInfo.type, documentData); }}>
                                    <Eye size={12} />
                                  </Button>
                                  <Button variant="outline-secondary" size="sm" style={{ padding: '2px 6px', fontSize: '0.75rem' }} onClick={(e) => { e.stopPropagation(); handlePrint(docInfo.type, documentData); }}>
                                    <Printer size={12} />
                                  </Button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>}
                    </Card.Footer>
                  </Card>
                )})}
            </div>
          )}
        </div>
        {/* Sidebar */}
        <div className={`sidebar-section ${animateCard ? 'animate-in' : ''}`} style={{
          background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)',
          borderRadius: '20px', padding: '30px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          height: 'fit-content', transform: animateCard ? 'translateY(0)' : 'translateY(30px)',
          opacity: animateCard ? 1 : 0, transition: 'all 0.6s ease-out 0.2s'
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', marginBottom: '25px',
            paddingBottom: '20px', borderBottom: '2px solid rgba(184, 134, 11, 0.1)'
          }}>
            <Search size={24} style={{ color: '#B8860B', marginRight: '12px' }} />
            <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '700', color: '#333' }}>고유번호로 입장</h3>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#555' }}>추모관 고유번호</label>
            <input type="text" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} placeholder="예: MEM001" style={{
                width: '100%', padding: '12px 16px', border: '2px solid #e5e7eb',
                borderRadius: '12px', fontSize: '1rem', transition: 'all 0.3s ease', outline: 'none'
              }}/>
          </div>
          <Button onClick={handleJoinByCode} style={{
              width: '100%', padding: '12px', borderRadius: '12px', fontWeight: '600',
              background: 'linear-gradient(135deg, #B8860B 0%, #CD853F 100%)', border: 'none',
              boxShadow: '0 4px 15px rgba(184, 134, 11, 0.3)', transition: 'all 0.3s ease'
            }}>
            <Search size={16} style={{ marginRight: '8px' }} /> 추모관 입장
          </Button>
          <div style={{
            marginTop: '30px', padding: '20px', background: 'rgba(184, 134, 11, 0.05)',
            borderRadius: '12px', border: '1px solid rgba(184, 134, 11, 0.1)'
          }}>
            <h6 style={{ color: '#B8860B', marginBottom: '10px', fontWeight: '600' }}>안내사항</h6>
            <ul style={{ fontSize: '0.85rem', color: '#6c757d', paddingLeft: '15px', margin: 0 }}>
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
        <Modal.Body>
            {/* dangerouslySetInnerHTML을 사용하여 iframe을 렌더링합니다. */}
            <div dangerouslySetInnerHTML={{ __html: previewContent.content }} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreviewModal(false)}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in { animation: fadeInUp 0.6s ease-out; }
        @media (max-width: 992px) {
          div[style*="grid-template-columns: 2fr 1fr"] { 
            grid-template-columns: 1fr !important; 
            gap: 20px !important; 
          }
        }
      `}</style>
    </div>
  );
};

export default Lobby;
