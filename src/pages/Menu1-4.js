import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, ArrowLeft } from 'lucide-react';
import { apiService } from '../services/api';

const Menu1_4 = () => {
    const navigate = useNavigate();

    const [allCustomers, setAllCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [animateCard, setAnimateCard] = useState(false);
    const [isSearched, setIsSearched] = useState(false);
    const [filters, setFilters] = useState({
        customerId: '', name: '',
    });

    useEffect(() => {
        const fetchAllCustomers = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await apiService.getCustomers();
                setAllCustomers(response.data._embedded.customerProfiles || []);
                setFilteredCustomers([]);
            } catch (err) {
                setError("데이터 로딩에 실패했습니다.");
                console.error(err);
            } finally {
                setLoading(false);
                setAnimateCard(true);
            }
        };
        fetchAllCustomers();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        if (loading) return;

        let result = [...allCustomers];

        if (filters.customerId) {
            result = result.filter(c => String(c.customerId).includes(filters.customerId));
        }
        if (filters.name) {
            result = result.filter(c => c.name.toLowerCase().includes(filters.name.toLowerCase()));
        }

        setFilteredCustomers(result);
        setIsSearched(true);
    };

    const handleRegisterDeceased = (customer) => {
        localStorage.setItem('selectedCustomer', JSON.stringify(customer));
        navigate('/menu1-5');
    };

    const getFamilyInfo = (customer) => {
        const marriedText = customer.isMarried ? '기혼' : '미혼';
        const childrenText = customer.hasChildren ? '자녀 있음' : '자녀 없음';
        return `${marriedText}, ${childrenText}`;
    };

    const formatDateForDisplay = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}.${month}.${day}`;
    };

    if (loading && !animateCard) {
        return (
            <div className="page-wrapper" style={{'--navbar-height': '62px', height: 'calc(100vh - var(--navbar-height))', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%)'}}>
                <div className="text-center" style={{ color: '#4A3728' }}>
                    <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem', color: '#B8860B' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3" style={{ fontSize: '1.2rem' }}>고객 정보를 불러오는 중입니다...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="page-wrapper" style={{'--navbar-height': '62px', height: 'calc(100vh - var(--navbar-height))', background: 'linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%)', padding: '20px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div className={`dashboard-container ${animateCard ? 'animate-in' : ''}`} style={{width: '100%', maxWidth: '1600px', height: '100%', margin: '0 auto', display: 'flex', boxSizing: 'border-box', background: 'rgba(255, 251, 235, 0.95)', boxShadow: '0 20px 60px rgba(44, 31, 20, 0.4)', backdropFilter: 'blur(15px)', border: '2px solid rgba(184, 134, 11, 0.35)', borderRadius: '28px', padding: '20px', gap: '20px', overflow: 'hidden'}}>
                    <div style={{ flex: '0 0 400px', display: 'flex', flexDirection: 'column' }}>
                        <h4 className="mb-3" style={{ fontSize: '30px', fontWeight: '700', color: '#2C1F14', paddingLeft: '10px', flexShrink: 0 }}>고인 등록</h4>
                        <div className="sidebar-scroll-area" style={{ background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.12) 0%, rgba(205, 133, 63, 0.08) 100%)', borderRadius: '15px', padding: '20px', flex: 1, overflowY: 'auto', minHeight: 0, border: '1px solid rgba(184, 134, 11, 0.2)' }}>
                            <div style={{width: '100px', height: '100px', background: 'rgba(184, 134, 11, 0.15)', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(44, 31, 20, 0.2)' }}><Search size={40} style={{ color: '#B8860B' }} /></div>
                            <h2 style={{fontWeight: '700', marginBottom: '15px', fontSize: '1.8rem', textAlign: 'center', color: '#2C1F14'}}>고객 조회</h2>
                            <p style={{fontSize: '16px', lineHeight: '1.6', margin: 0, opacity: 0.7, textAlign: 'center', color: '#4A3728'}}>등록할 고객을 검색하세요.</p>
                            <hr className="my-4"/>
                            <Form>
                                <Row className="g-3 mb-3">
                                    <Col xs={6}><Form.Label style={{color: '#4A3728'}}>고객 고유번호</Form.Label><Form.Control name="customerId" value={filters.customerId} onChange={handleInputChange} placeholder="고유번호" /></Col>
                                    <Col xs={6}><Form.Label style={{color: '#4A3728'}}>이름</Form.Label><Form.Control name="name" value={filters.name} onChange={handleInputChange} placeholder="이름" /></Col>
                                </Row>
                                <Button className="btn-search" onClick={handleSearch}>
                                    <Search size={18} className="me-2" />
                                    고객 조회
                                </Button>
                            </Form>
                        </div>
                    </div>

                    <div className="dashboard-right" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, paddingBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <button
                                    onClick={() => navigate(-1)}
                                    className="back-btn"
                                >
                                    <ArrowLeft size={16} style={{ marginRight: '6px' }} />
                                    돌아가기
                                </button>
                                <h5 style={{ fontWeight: '600', color: '#2C1F14' }}>고객 목록 ({isSearched ? filteredCustomers.length : 0}명)</h5>
                            </div>
                        </div>
                        <div className="content-scroll-area" style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
                            {!isSearched ? (
                                <div className="d-flex justify-content-center align-items-center h-100 text-center text-muted">
                                    <div>
                                        <Search size={48} className="mb-3" />
                                        <p>좌측 필터에서 조건을 선택하고<br/>'고객 조회' 버튼을 눌러주세요.</p>
                                    </div>
                                </div>
                            ) : filteredCustomers.length > 0 ? (
                                filteredCustomers.map(customer => (
                                    <Card key={customer.customerId} className="mb-3" style={{ background: 'rgba(253, 251, 243, 0.92)', border: '1px solid rgba(184, 134, 11, 0.2)' }}>
                                        <Card.Body>
                                            <Row className="align-items-center">
                                                <Col md={3} className="text-center text-md-start mb-3 mb-md-0 border-end pe-md-3">
                                                    <p className="text-muted mb-1" style={{ fontSize: '0.85rem' }}>{customer.customerId}</p>
                                                    <h5 className="fw-bold mb-0" style={{color: '#2C1F14'}}>{customer.name}</h5>
                                                </Col>
                                                <Col md={7}>
                                                    <Row>
                                                        <Col sm={6} className="mb-2"><strong>생년월일:</strong> {formatDateForDisplay(customer.birthOfDate)} (만 {customer.age}세)</Col>
                                                        <Col sm={6} className="mb-2"><strong>성별:</strong> {customer.gender}</Col>
                                                        <Col sm={6} className="mb-2"><strong>연락처:</strong> {customer.phone}</Col>
                                                        <Col sm={6} className="mb-2"><strong>직업:</strong> {customer.job}</Col>
                                                        <Col sm={12} className="mb-2"><strong>주소:</strong> {customer.address}</Col>
                                                        <Col sm={12} className="mb-2"><strong>가족:</strong> {getFamilyInfo(customer)}</Col>
                                                    </Row>
                                                </Col>
                                                <Col md={2} className="text-center text-md-end">
                                                    <Button className="btn-golden" size="sm" onClick={() => handleRegisterDeceased(customer)}>
                                                        <UserPlus size={14} className="me-2" />
                                                        고인 등록
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                ))
                            ) : (
                                <div className="d-flex justify-content-center align-items-center h-100 text-center text-muted">
                                    <p>선택하신 조건에 맞는 고객 정보가 없습니다.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .dashboard-container { opacity: 0; }
                .dashboard-container.animate-in { animation: fadeIn 0.6s ease-out forwards; }
                .content-scroll-area::-webkit-scrollbar,
                .sidebar-scroll-area::-webkit-scrollbar { width: 6px; }
                .content-scroll-area::-webkit-scrollbar-track,
                .sidebar-scroll-area::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); border-radius: 10px; }
                .content-scroll-area::-webkit-scrollbar-thumb,
                .sidebar-scroll-area::-webkit-scrollbar-thumb { background-color: rgba(184, 134, 11, 0.5); border-radius: 10px; }
                
                .btn-golden {
                    background: linear-gradient(135deg, #D4AF37, #F5C23E);
                    border: none;
                    color: #2C1F14;
                    font-weight: 700;
                    box-shadow: 0 4px 15px rgba(184, 134, 11, 0.35);
                    transition: all 0.3s ease;
                }
                .btn-golden:hover {
                    background: linear-gradient(135deg, #CAA230, #E8B530);
                    color: #2C1F14;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(184, 134, 11, 0.45);
                }

                .btn-search {
                    width: 100%;
                    margin-top: 20px;
                    padding: 10px 15px;
                    font-size: 15px;
                    font-weight: 600;
                    color: #fff;
                    background: linear-gradient(135deg, #b8860b, #965a25);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 12px;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(44, 31, 20, 0.2);
                    transition: all 0.3s ease;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .btn-search:hover {
                    background: linear-gradient(135deg, #c9971c, #a86b36);
                    box-shadow: 0 6px 20px rgba(44, 31, 20, 0.3);
                    transform: translateY(-2px);
                    color: #fff;
                }
                .back-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 20px;
                    background: linear-gradient(135deg, #4A3728, #8B5A2B);
                    border: none;
                    color: white;
                    font-weight: 700;
                    font-size: 14px;
                    box-shadow: 0 2px 8px rgba(74, 55, 40, 0.35);
                    transition: all 0.3s ease;
                    border-radius: 12px;
                    cursor: pointer;
                }
                .back-btn:hover {
                    background: linear: linear-gradient(135deg, #3c2d20, #7a4e24);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(74, 55, 40, 0.45);
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
        </>
    );
};

export default Menu1_4;