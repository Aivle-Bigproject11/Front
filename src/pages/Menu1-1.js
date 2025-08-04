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
      <div className="page-wrapper" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%)'}}>
        <div className="text-center" style={{ color: '#4A3728' }}>
          <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem', color: '#B8860B' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3" style={{ fontSize: '1.2rem' }}>장례서류작성 시스템을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper" style={{display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%)'}}>
        <h3 style={{color: '#d9534f'}}>오류가 발생했습니다</h3>
        <p style={{color: '#4A3728'}}>{error}</p>
        <Button className="btn-golden" onClick={loadCustomers}>다시 시도</Button>
      </div>
    );
  }
  
  // Define background colors based on status 
  const statusBackgrounds = {
    pending: 'linear-gradient(135deg, #E5B83A, #E5B83A)',
    inProgress: 'linear-gradient(135deg, #133d6cff, #133d6cff', 
    completed: 'linear-gradient(135deg, #146c43 0%, #146c43 100%)', 
  };
  const defaultBackground = 'linear-gradient(135deg, #b08d57, #a8814f)'; 

  return (
    <div className="page-wrapper" style={{
      '--navbar-height': '62px',
      height: 'calc(100vh - var(--navbar-height))', 
      background: 'linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%)',
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
        background: 'rgba(255, 251, 235, 0.95)',
        boxShadow: '0 20px 60px rgba(44, 31, 20, 0.4)',
        backdropFilter: 'blur(15px)',
        border: '2px solid rgba(184, 134, 11, 0.35)',
        borderRadius: '28px',
        padding: '20px',
        gap: '20px',
        overflow: 'hidden',
      }}>
        {/* 왼쪽 사이드바 */}
        <div style={{ flex: '0 0 400px', display: 'flex', flexDirection: 'column' }}>
          <h4 className="mb-3" style={{ fontSize: '30px', fontWeight: '700', color: '#2C1F14', paddingLeft: '10px' }}>
            장례서류작성
          </h4>
          <div className="dashboard-left" style={{
            background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.12) 0%, rgba(205, 133, 63, 0.08) 100%)',
            border: '1px solid rgba(184, 134, 11, 0.2)',
            borderRadius: '15px',
            padding: '20px',
            height: 'min-content',
            position: 'sticky',
            top: '20px'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              background: 'rgba(184, 134, 11, 0.15)',
              borderRadius: '50%',
              margin: '0 auto 30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(44, 31, 20, 0.2)'
            }}>
              <FileText size={48} style={{ color: '#B8860B' }} />
            </div>
            <h2 style={{
              fontWeight: '700',
              marginBottom: '15px',
              fontSize: '1.8rem',
              textAlign: 'center',
              color: '#2C1F14'
            }}>고객 목록</h2>
            <p style={{
              fontSize: '16px',
              lineHeight: '1.6',
              margin: 0,
              opacity: 0.9,
              textAlign: 'center',
              color: '#4A3728'
            }}>
              장례 서비스가 필요한<br/>
              고객들을 관리하고<br/>
              확인하세요
            </p>

            {/* 필터 버튼들 */}
            <div style={{ marginTop: '30px' }}>
              <h6 style={{ color: '#4A3728', marginBottom: '15px', fontSize: '14px', fontWeight: '600' }}>
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
                      background: activeFilter === filter.key ? '#B8860B' : 'transparent',
                      color: activeFilter === filter.key ? 'white' : '#4A3728',
                      border: `1px solid ${activeFilter === filter.key ? '#B8860B' : 'rgba(184, 134, 11, 0.2)'}`,
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
                    <Badge 
                    bg=""
                    style={{
                        backgroundColor: activeFilter === filter.key ? 'rgba(255,255,255,0.8)' : 'rgba(184, 134, 11, 0.5)', 
                        color: activeFilter === filter.key ? '#B8860B' : 'white'
                     }}>
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
            borderBottom: '1px solid rgba(184, 134, 11, 0.2)',
            marginBottom: '20px'
          }}>
            <h3 style={{
              color: '#2C1F14',
              fontWeight: '600',
              marginBottom: '8px',
              fontSize: '1.5rem'
            }}>
              {activeFilter === 'all' ? '전체' : customerUtils.getStatusText(activeFilter)} 고객 목록
            </h3>
            <p style={{
              color: '#4A3728',
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
              color: '#4A3728'
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
                    background: 'rgba(253, 251, 243, 0.92)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(44, 31, 20, 0.1)',
                    border: '1px solid rgba(184, 134, 11, 0.2)',
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
                          bg="transparent"
                          className="text-white" 
                          style={{ 
                            fontSize: '0.8rem', 
                            padding: '4px 8px',
                            border: '1px solid white',
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
                          <div style={{ display: 'flex', alignItems: 'center', padding: '8px', background: 'rgba(184, 134, 11, 0.08)', borderRadius: '8px', border: '1px solid rgba(184, 134, 11, 0.15)' }}>
                            <Phone size={14} style={{ color: '#B8860B', marginRight: '6px' }} />
                            <span style={{ fontSize: '0.85rem', fontWeight: '500', color: '#2C1F14' }}>
                              {customer.phone}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', padding: '8px', background: 'rgba(184, 134, 11, 0.08)', borderRadius: '8px', border: '1px solid rgba(184, 134, 11, 0.15)' }}>
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
                      background: 'rgba(253, 251, 243, 0.92)',
                      borderLeft: '1px solid rgba(184, 134, 11, 0.2)',
                      minWidth: '140px', gap: '8px'
                    }}>
                    <Button
                        className="btn-golden"
                        size="sm"
                        style={{ width: '100%', borderRadius: '8px', padding: '8px', fontSize: '0.85rem' }}
                        onClick={(e) => handleRegisterClick(e, customer)}
                    >
                    <FileText size={14} style={{ marginRight: '4px' }} />
                        정보등록
                    </Button>

                    <Button 
                        className="btn-outline-golden"
                        size="sm"
                        style={{ width: '100%', borderRadius: '8px', padding: '8px', fontSize: '0.85rem' }}
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
          animation: fadeIn 0.6s ease-out forwards;
        }
        .dashboard-right::-webkit-scrollbar { width: 6px; }
        .dashboard-right::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); border-radius: 10px; }
        .dashboard-right::-webkit-scrollbar-thumb { background-color: rgba(184, 134, 11, 0.5); border-radius: 10px; }
        @media (max-width: 1200px) {
          .page-wrapper { height: auto; min-height: calc(100vh - var(--navbar-height)); }
          .dashboard-container { flex-direction: column; height: auto; }
          .dashboard-left { position: static; width: 100%; flex: 0 0 auto; }
          .dashboard-right { height: auto; max-height: none; }
        }

        .btn-golden {
            background: linear-gradient(135deg, #D4AF37, #F5C23E);
            border: none;
            color: #2C1F14;
            font-weight: 700;
            transition: all 0.3s ease;
        }
        .btn-golden:hover {
            background: linear-gradient(135deg, #CAA230, #E8B530);
            color: #2C1F14;
            transform: translateY(-1px);
            box-shadow: 0 4px 15px rgba(184, 134, 11, 0.25);
        }
        .btn-outline-golden {
            background-color: transparent;
            border: 1px solid #B8860B;
            color: #B8860B;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        .btn-outline-golden:hover {
            background-color: #B8860B;
            border-color: #B8860B;
            color: white;
        }
        `}</style>
    </div>
  );
};

export default Menu1_1;