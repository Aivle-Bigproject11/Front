import React, { useEffect, useState } from 'react';
import { Badge, Button } from 'react-bootstrap';
import { Users, FileText, Home, MapPin, Check, X, Eye, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

// Helper functions formerly in customerUtils
const getStatusText = (status) => {
  switch(status) {
    case 'pending': return '대기중';
    case 'inProgress': return '진행중';
    case 'completed': return '완료';
    default: return '알수없음';
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '날짜 정보 없음';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const Menu1_1 = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [animateCard, setAnimateCard] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    let result = customers;

    if (activeFilter !== 'all') {
      result = result.filter(customer => customer.status === activeFilter);
    }

    if (searchTerm) {
      result = result.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCustomers(result);
  }, [searchTerm, activeFilter, customers]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      setAnimateCard(true);
      
      const [funeralInfosResponse, obituariesResponse, deathReportsResponse, schedulesResponse] = await Promise.all([
        apiService.getFuneralInfos(),
        apiService.getObituaries(),
        apiService.getDeathReports(),
        apiService.getSchedules()
      ]);

      if (!funeralInfosResponse.data?._embedded?.funeralInfos) {
        console.error("API response is missing expected '_embedded.funeralInfos' data.", funeralInfosResponse.data);
        setCustomers([]);
        return;
      }

      const funeralInfos = funeralInfosResponse.data._embedded.funeralInfos;
      const obituaries = obituariesResponse.data?._embedded?.obituaries || [];
      const deathReports = deathReportsResponse.data?._embedded?.deathReports || [];
      const schedules = schedulesResponse.data?._embedded?.schedules || [];

      // Create maps for quick lookup of document statuses by funeralInfoId
      const obituaryStatusMap = new Map();
      obituaries.forEach(obituary => {
        obituaryStatusMap.set(obituary.funeralInfoId, obituary.obituaryStatus);
      });

      const deathReportStatusMap = new Map();
      deathReports.forEach(deathReport => {
        deathReportStatusMap.set(deathReport.funeralInfoId, deathReport.deathReportStatus);
      });

      const scheduleStatusMap = new Map();
      schedules.forEach(schedule => {
        scheduleStatusMap.set(schedule.funeralInfoId, schedule.scheduleStatus);
      });

      const transformedData = funeralInfos.map(info => {
        const isObituaryCompleted = obituaryStatusMap.get(info.funeralInfoId) === 'COMPLETED';
        const isDeathCertificateCompleted = deathReportStatusMap.get(info.funeralInfoId) === 'COMPLETED';
        const isScheduleCompleted = scheduleStatusMap.get(info.funeralInfoId) === 'COMPLETED';

        const documents = {
          obituary: isObituaryCompleted,
          deathCertificate: isDeathCertificateCompleted,
          schedule: isScheduleCompleted,
        };

        const allCompleted = Object.values(documents).every(status => status);
        const someCompleted = Object.values(documents).some(status => status);
        let status = 'pending';
        if (allCompleted) status = 'completed';
        else if (someCompleted) status = 'inProgress';

        return {
          id: info.customerId,
          name: info.deceasedName,
          phone: info.funeralHomeName || '장례식장 정보 없음', // Changed to funeral home name
          type: '고인',
          status: status,
          age: info.deceasedAge,
          documents: documents,
          funeralDate: info.deceasedDate,
          location: info.funeralHomeAddress || '주소 정보 없음', // Changed to funeral home address
          originalData: info 
        };
      });
      
      setCustomers(transformedData);
    } catch (err) {
      setError('고객 데이터를 불러오는데 실패했습니다.');
      console.error('Error loading customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType) => {
    setActiveFilter(filterType);
  };

  const handleCustomerSelect = (customer) => {
    // Store the original, untransformed data for subsequent pages
    localStorage.setItem('selectedCustomer', JSON.stringify(customer.originalData));
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
  
  const statusBackgrounds = {
    pending: 'linear-gradient(135deg, #E5B83A, #E5B83A)',
    inProgress: 'linear-gradient(135deg, #133d6cff, #133d6cff', 
    completed: 'linear-gradient(135deg, #146c43 0%, #146c43 100%)', 
  };
  const defaultBackground = 'linear-gradient(135deg, #B8860B, #B8860B)'; 

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
                    onClick={() => handleFilterChange(filter.key)}
                    style={{
                      background: activeFilter === filter.key
                        ? (statusBackgrounds[filter.key] || defaultBackground) : 'transparent', 
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

            <div style={{ marginTop: '20px' }}>
              <h6 style={{ color: '#4A3728', marginBottom: '15px', fontSize: '14px', fontWeight: '600' }}>
                고객 검색
              </h6>
              <div className="search-bar-wrapper">
                <Search className="search-icon" size={18} />
                <input 
                  type="text"
                  placeholder="고객 이름으로 검색..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

          </div>
        </div>

        <div className="dashboard-right" style={{
          flex: '1',
          overflowY: 'auto',
          height: '100%', 
          paddingRight: '10px'
        }}>
          <div style={{
            padding: '0 0 20px 0',
            borderBottom: '1px solid rgba(184, 134, 11, 0.2)',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <h3 style={{
                  color: '#2C1F14',
                  fontWeight: '600',
                  margin: 0,
                  fontSize: '1.5rem'
                }}>
                  {activeFilter === 'all' ? '전체' : getStatusText(activeFilter)} 고객 목록
                </h3>
                <Button
                  onClick={loadCustomers}
                  className="btn-outline-golden"
                  size="sm"
                  style={{
                      padding: '8px 16px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      borderRadius: '8px',
                      marginLeft: '10px'
                  }}
                >
                  새로고침
                </Button>
              </div>
              <Button
                onClick={() => navigate('/menu1-4')}
                className="save-btn"
                style={{
                    padding: '10px 24px',
                    fontSize: '16px',
                    fontWeight: '700',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    color: '#2C1F14',
                    background: 'linear-gradient(135deg, #D4AF37, #F5C23E)',
                    boxShadow: '0 4px 15px rgba(184, 134, 11, 0.35)'
                }}
              >
                고인 등록
              </Button>
            </div>
            <p style={{
              color: '#4A3728',
              fontSize: '14px',
              margin: 0
            }}>총 {filteredCustomers.length}명의 고객</p>
          </div>

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
              <h4>검색 결과가 없습니다</h4>
              <p>입력하신 고객 이름을 다시 확인해주세요.</p>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {filteredCustomers.map((customer) => {
                return (
                  <div key={customer.id} className="customer-card" style={{
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
                          {getStatusText(customer.status)}
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
                          {formatDate(customer.funeralDate)}
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
                            <Home size={14} style={{ color: '#B8860B', marginRight: '6px' }} />
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
                              const docNames = { obituary: '부고장', schedule: '장례일정표', deathCertificate: '사망신고서' };
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
            .search-bar-wrapper {
                position: relative;
            }
            .search-icon {
                position: absolute;
                left: 12px;
                top: 50%;
                transform: translateY(-50%);
                color: #B8860B;
            }
            .search-input {
                width: 100%;
                padding: 8px 12px 8px 38px;
                border-radius: 8px;
                border: 1px solid rgba(184, 134, 11, 0.2);
                background-color: rgba(255, 255, 255, 0.8);
                color: #4A3728;
                transition: all 0.3s ease;
            }
            .search-input:focus {
                outline: none;
                border-color: #B8860B;
                box-shadow: 0 0 0 3px rgba(184, 134, 11, 0.2);
            }
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
                background-color: transparent !important;
                border: 1px solid #B8860B !important;
                color: #B8860B !important;
                font-weight: 600;
                transition: all 0.3s ease;
                box-shadow: none !important;
            }
            .btn-outline-golden:hover {
                background-color: #B8860B !important;
                border-color: #B8860B !important;
                color: white !important;
            }
            .btn-outline-golden:active,
            .btn-outline-golden:focus,
            .btn-check:focus+.btn-outline-golden, .btn-outline-golden:focus {
                background-color: transparent !important;
                border-color: #B8860B !important;
                color: #B8860B !important;
                box-shadow: 0 0 0 0.25rem rgba(184, 134, 11, 0.2) !important; 
            }

            .btn-outline-golden.active {
                background-color: #B8860B !important;
                border-color: #B8860B !important;
                color: white !important;
            }
                 /* 반응형 레이아웃 */
                @media (max-width: 1200px) {
                    .page-wrapper {
                        height: auto !important;
                        min-height: calc(100vh - var(--navbar-height));
                        align-items: flex-start !important;
                    }
                    .dashboard-container {
                        flex-direction: column;
                        height: auto !important;
                        overflow: visible;
                    }
                    .dashboard-left {
                        flex: 1 1 auto; /* 세로로 쌓일 때 너비 제약을 해제하고 전체 너비를 차지하도록 함 */
                        margin-bottom: 20px;
                    }
                }
                
                @media (max-width: 768px) {
                    .customer-card {
                        flex-direction: column;
                    }
                    .customer-card > div {
                        min-width: 100% !important;
                        border-left: none !important;
                        border-bottom: 1px solid rgba(184, 134, 11, 0.2);
                    }
                    .customer-card > div:last-child {
                        border-bottom: none;
                    }
                    .dashboard-container {
                        padding: 10px;
                        gap: 15px;
                    }
                    .customer-id-name-row {
                        flex-direction: column;
                    }
                    .customer-id-name-row > .col-6 {
                        width: 100%;
                        padding-left: 12px;
                        padding-right: 12px;
                    }
                     .customer-id-name-row > .col-6:first-of-type {
                        margin-bottom: 1rem;
                    }
                }
        `}</style>
    </div>
  );
};

export default Menu1_1;
