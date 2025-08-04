import React, { useEffect, useState } from 'react';
import { Badge, Button } from 'react-bootstrap';
import { Users, FileText, Phone, MapPin, Clock, Check, X, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { customerService, customerUtils } from '../services/customerService';

const Menu1_1 = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [animateCard, setAnimateCard] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      setAnimateCard(true);
      
      const data = await customerService.getAllCustomers();
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (err) {
      setError('고객 데이터를 불러오는데 실패했습니다.');
      console.error('Error loading customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = (filterType) => {
    setActiveFilter(filterType);
    if (filterType === 'all') {
      setFilteredCustomers(customers);
    } else {
      setFilteredCustomers(customers.filter(customer => customer.status === filterType));
    }
  };

  const handleCustomerSelect = (customer) => {
    localStorage.setItem('selectedCustomer', JSON.stringify(customer));
  };

  const handleRegisterClick = (e, customer) => {
    e.stopPropagation();
    handleCustomerSelect(customer);
    navigate('/menu1-2');
  };

  const handleDocumentsClick = (e, customer) => {
    e.stopPropagation();
    handleCustomerSelect(customer);
    navigate('/menu1-3');
  };

  if (loading) {
    return (
      <div className="page-wrapper" style={{
        '--navbar-height': '62px',
        height: 'calc(100vh - var(--navbar-height))',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div className="text-center" style={{ color: '#374151' }}>
          <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3" style={{ fontSize: '1.2rem' }}>장례서류작성 시스템을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper" style={{
        '--navbar-height': '62px',
        height: 'calc(100vh - var(--navbar-height))',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div className="text-center" style={{ color: '#dc3545' }}>
          <h3>오류가 발생했습니다</h3>
          <p>{error}</p>
          <Button variant="primary" onClick={loadCustomers}>
            다시 시도
          </Button>
        </div>
      </div>
    );
  }
  
  // Define background colors based on status
  const statusBackgrounds = {
    pending: 'linear-gradient(135deg, #ffc107 0%, #e0a800 100%)',      
    inProgress: 'linear-gradient(135deg, #0c61e0ff 0%, #0a58ca 100%)',  
    completed: 'linear-gradient(135deg, #198754 0%, #146c43 100%)',   
  };
  const defaultBackground = 'linear-gradient(135deg, #6f42c1 0%, #5a32a3 100%)'; 

  return (
    <div className="page-wrapper" style={{
      '--navbar-height': '62px',
      height: 'calc(100vh - var(--navbar-height))', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '20px',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div className={`dashboard-container ${animateCard ? 'animate-in' : ''}`} style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '1600px',
        height: '100%', 
        margin: '0 auto',
        display: 'flex',
        boxSizing: 'border-box',
        background: 'rgba(255, 255, 255, 0.7)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        borderRadius: '20px',
        padding: '20px',
        gap: '20px',
        overflow: 'hidden',
      }}>
        {/* 왼쪽 사이드바 */}
        <div style={{ flex: '0 0 400px', display: 'flex', flexDirection: 'column' }}>
          <h4 className="mb-3" style={{ fontSize: '30px', fontWeight: '700', color: '#343a40', paddingLeft: '10px' }}>
            장례서류작성
          </h4>
          <div className="dashboard-left" style={{
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '15px',
            padding: '20px',
            height: 'min-content',
            position: 'sticky',
            top: '20px'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              background: 'rgba(111, 66, 193, 0.2)',
              borderRadius: '50%',
              margin: '0 auto 30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}>
              <FileText size={48} style={{ color: '#6f42c1' }} />
            </div>
            <h2 style={{
              fontWeight: '700',
              marginBottom: '15px',
              fontSize: '1.8rem',
              textAlign: 'center',
              color: '#343a40'
            }}>고객 목록</h2>
            <p style={{
              fontSize: '16px',
              lineHeight: '1.6',
              margin: 0,
              opacity: 0.7,
              textAlign: 'center',
              color: '#6c757d'
            }}>
              장례 서비스가 필요한<br/>
              고객들을 관리하고<br/>
              확인하세요
            </p>

            {/* 필터 버튼들 */}
            <div style={{ marginTop: '30px' }}>
              <h6 style={{ color: '#6c757d', marginBottom: '15px', fontSize: '14px', fontWeight: '600' }}>
                상태별 필터
              </h6>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { key: 'all', label: '전체', count: customers.length },
                  { key: 'pending', label: '대기중', count: customers.filter(c => c.status === 'pending').length },
                  { key: 'inProgress', label: '진행중', count: customers.filter(c => c.status === 'inProgress').length },
                  { key: 'completed', label: '완료', count: customers.filter(c => c.status === 'completed').length }
                ].map(filter => (
                  <button
                    key={filter.key}
                    onClick={() => filterCustomers(filter.key)}
                    style={{
                      background: activeFilter === filter.key ? '#6f42c1' : 'transparent',
                      color: activeFilter === filter.key ? 'white' : '#6c757d',
                      border: '1px solid rgba(111, 66, 193, 0.2)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span>{filter.label}</span>
                    <Badge bg={activeFilter === filter.key ? 'light' : 'secondary'} 
                           text={activeFilter === filter.key ? 'dark' : 'white'}>
                      {filter.count}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 메인 콘텐츠 */}
        <div className="dashboard-right" style={{
          flex: '1',
          overflowY: 'auto',
          height: '100%', 
          paddingRight: '10px'
        }}>
          {/* 서브 헤더 */}
          <div style={{
            padding: '0 0 20px 0',
            borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
            marginBottom: '20px'
          }}>
            <h3 style={{
              color: '#374151',
              fontWeight: '600',
              marginBottom: '8px',
              fontSize: '1.5rem'
            }}>
              {activeFilter === 'all' ? '전체' : customerUtils.getStatusText(activeFilter)} 고객 목록
            </h3>
            <p style={{
              color: '#6c757d',
              fontSize: '14px',
              margin: 0
            }}>총 {filteredCustomers.length}명의 고객</p>
          </div>

          {/* 고객 카드 리스트 */}
          {filteredCustomers.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '400px',
              color: '#6c757d'
            }}>
              <Users size={64} style={{ opacity: 0.3, marginBottom: '16px' }} />
              <h4>표시할 고객이 없습니다</h4>
              <p>다른 필터를 선택하거나 새로운 고객을 추가해보세요.</p>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {filteredCustomers.map((customer) => {
                return (
                  <div key={customer.id} style={{
                    background: 'white',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                    border: '1px solid rgba(229, 231, 235, 0.8)',
                    display: 'flex',
                    minHeight: '140px',
                    position: 'relative',
                  }}
                  >
                    <div style={{
                      background: statusBackgrounds[customer.status] || defaultBackground,
                      padding: '20px', color: 'white', display: 'flex', flexDirection: 'column',
                      justifyContent: 'center', minWidth: '200px', position: 'relative'
                    }}>
                      <div style={{ marginBottom: '12px' }}>
                        <h4 style={{
                          fontSize: '1.3rem', fontWeight: '700', margin: '0 0 6px 0',
                          display: 'flex', alignItems: 'center'
                        }}>
                          {customer.name}
                          <Badge bg="light" text="dark" className="ms-2" style={{ fontSize: '0.7rem' }}>
                            고인
                          </Badge>
                        </h4>
                        <Badge 
                            className={`${customerUtils.getStatusColor(customer.status)} text-white`} 
                            style={{ 
                                fontSize: '0.8rem', 
                                padding: '4px 8px',
                                border: '1px solid white'
                            }}>
                            {customerUtils.getStatusText(customer.status)}
                        </Badge>
                      </div>
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.15)', padding: '10px',
                        borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.2)'
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
                      flex: 1, padding: '20px', display: 'flex',
                      flexDirection: 'column', justifyContent: 'space-between'
                    }}>
                      <div>
                        <div style={{
                          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                          gap: '8px', marginBottom: '12px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', padding: '8px', background: 'rgba(111, 66, 193, 0.05)', borderRadius: '8px', border: '1px solid rgba(111, 66, 193, 0.1)' }}>
                            <Phone size={14} style={{ color: '#6f42c1', marginRight: '6px' }} />
                            <span style={{ fontSize: '0.85rem', fontWeight: '500', color: '#374151' }}>
                              {customer.phone}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', padding: '8px', background: 'rgba(111, 66, 193, 0.05)', borderRadius: '8px', border: '1px solid rgba(111, 66, 193, 0.1)' }}>
                            <MapPin size={14} style={{ color: '#6f42c1', marginRight: '6px' }} />
                            <span style={{ fontSize: '0.85rem', fontWeight: '500', color: '#374151' }}>
                              {customer.location}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                            <FileText size={14} style={{ color: '#6f42c1', marginRight: '6px' }} />
                            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#374151' }}>
                              서류 작성 상태
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {Object.entries(customer.documents).map(([docType, isCompleted]) => {
                              const docNames = { obituary: '부고장', schedule: '일정표', deathCertificate: '사망신고서' };
                              return (
                                <Badge key={docType} bg={isCompleted ? 'success' : 'danger'}
                                  style={{ display: 'flex', alignItems: 'center', padding: '4px 8px', fontSize: '0.75rem' }}>
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
                      display: 'flex', flexDirection: 'column', justifyContent: 'center',
                      alignItems: 'center', padding: '20px 16px',
                      background: 'rgba(248, 250, 252, 0.8)',
                      borderLeft: '1px solid rgba(229, 231, 235, 0.5)',
                      minWidth: '140px', gap: '8px'
                    }}>
                    <Button
                        variant="primary"
                        size="sm"
                        style={{ width: '100%', borderRadius: '8px', fontWeight: '600', padding: '8px', fontSize: '0.85rem' }}
                        onClick={(e) => handleRegisterClick(e, customer)}
                    >
                    <FileText size={14} style={{ marginRight: '4px' }} />
                        정보등록
                    </Button>

                    <Button 
                        variant="outline-primary"
                        size="sm"
                        style={{ width: '100%', borderRadius: '8px', fontWeight: '600', padding: '8px', fontSize: '0.85rem' }}
                        onClick={(e) => handleDocumentsClick(e, customer)}
                    >
                    <Eye size={14} style={{ marginRight: '4px' }} />
                        서류관리
                    </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .dashboard-container { opacity: 0; }
        .dashboard-container.animate-in {
          opacity: 1;
          animation: fadeIn 0.6s ease-out;
        }
        .dashboard-right::-webkit-scrollbar { width: 6px; }
        .dashboard-right::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); border-radius: 10px; }
        .dashboard-right::-webkit-scrollbar-thumb { background-color: rgba(108, 117, 125, 0.5); border-radius: 10px; }
        @media (max-width: 1200px) {
          .page-wrapper { height: auto; min-height: calc(100vh - var(--navbar-height)); }
          .dashboard-container { flex-direction: column; height: auto; }
          .dashboard-left { position: static; width: 100%; flex: 0 0 auto; }
          .dashboard-right { height: auto; max-height: none; }
        }

        .btn-purple {
            background-color: #6f42c1;
            border-color: #6f42c1;
            color: white;
            }
            .btn-purple:hover {
                        background-color: transparent;
            background-color: #5a32a3;
            border-color: #5a32a3;
            color: white;
            }

            .btn-outline-purple {
            background-color: transparent;
            border-color: #6f42c1;
            color: #6f42c1;
            }
            .btn-outline-purple:hover {
            background-color: #6f42c1;
            border-color: #6f42c1;
            color: white;
            }
        }
        `}</style>
    </div>
  );
};

export default Menu1_1;