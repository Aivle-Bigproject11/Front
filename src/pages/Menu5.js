import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
// [실제 백엔드 연동 시] axios가 설치되어 있는지 확인하세요. (npm install axios)
import axios from 'axios';

// =================================================================
// [테스트용] Mock 데이터
// 실제 백엔드 연동 시 이 부분은 전체를 제거하거나 주석 처리해도 됩니다.
// =================================================================
const mockApiData = [
    { customerId: 2001, name: '김말똥', age: 74, phone: '010-1234-5678', job: '의사', address: '서울시 강남구', gender: '남', birthOfDate: '1950.01.01', hasChildren: true, isMarried: true, term: '2020.01.03 ~ 2025.07.18', hasDisease: true },
    { customerId: 2002, name: '김진우', age: 34, phone: '010-2345-6789', job: '무직', address: '경기도 김포시', gender: '남', birthOfDate: '1990.01.01', hasChildren: false, isMarried: false, term: '2020.01.03 ~ 2025.07.18', hasDisease: false },
    { customerId: 2003, name: '최개똥', age: 24, phone: '010-3456-7890', job: '정비사', address: '인천시 서구', gender: '남', birthOfDate: '2000.01.01', hasChildren: false, isMarried: false, term: '2020.01.03 ~ 2025.07.18', hasDisease: false },
    { customerId: 2004, name: '이철수', age: 49, phone: '010-4567-8901', job: '개발자', address: '서울시 마포구', gender: '남', birthOfDate: '1975.01.01', hasChildren: true, isMarried: true, term: '2020.01.03 ~ 2025.07.18', hasDisease: true },
    { customerId: 2005, name: '박영희', age: 42, phone: '010-5678-9012', job: '주부', address: '경기도 성남시', gender: '여', birthOfDate: '1982.05.10', hasChildren: false, isMarried: true, term: '2021.03.15 ~ 2026.03.14', hasDisease: false },
];

const Menu5 = () => {
    const navigate = useNavigate();

    // === 상태 관리 (공통) ===
    const [allCustomers, setAllCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [animateCard, setAnimateCard] = useState(false);
    const [isSearched, setIsSearched] = useState(false); // 조회 버튼 클릭 여부 상태 추가
    const [filters, setFilters] = useState({
        customerId: '', name: '', age: '', gender: [], disease: [], isMarried: [], hasChildren: [],
    });

    // =================================================================
    // [테스트용 함수]: 가상으로 API 통신을 흉내 냅니다.
    // =================================================================
    const fetchInitialDataWithMock = () => {
        setLoading(true);
        setError(null);
        setTimeout(() => {
            try {
                setAllCustomers(mockApiData);
                setFilteredCustomers([]); // [수정] 처음에는 빈 배열로 설정
            } catch (err) {
                setError("Mock 데이터 로딩에 실패했습니다.");
                console.error(err);
            } finally {
                setLoading(false);
                setAnimateCard(true);
            }
        }, 500);
    };

    // === 데이터 로딩 (useEffect) ===
    // 1. 최초 데이터 로딩: 컴포넌트가 처음 마운트될 때 한 번만 실행
    useEffect(() => {
        // [실제 백엔드 연동 시 사용할 함수]
        /*
        const fetchAllCustomers = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('/api/customers/all'); 
                setAllCustomers(response.data);
                setFilteredCustomers([]); // [수정] 처음에는 빈 배열로 설정
            } catch (err) {
                setError("데이터 로딩에 실패했습니다.");
                console.error(err);
            } finally {
                setLoading(false);
                setAnimateCard(true);
            }
        };
        */

        // --- 함수 호출 ---
        // 실제 연동 시: fetchAllCustomers();
        fetchInitialDataWithMock(); // 현재는 테스트용 함수를 호출합니다.

    }, []); // 빈 배열: 최초 1회만 실행


    // === 핸들러 및 헬퍼 함수 (공통) ===
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
        const { name, value, checked } = e.target;
        setFilters(prev => {
            const currentValues = prev[name] || [];
            const newValues = checked
                ? [...currentValues, value]
                : currentValues.filter(v => v !== value);
            return { ...prev, [name]: newValues };
        });
    };

    // 조회 버튼 클릭 시 필터링을 수행하는 함수
    const handleSearch = () => {
        if (loading) return;

        let result = [...allCustomers];

        // 고객 고유번호 필터
        if (filters.customerId) {
            result = result.filter(c => String(c.customerId).includes(filters.customerId));
        }
        // 이름 필터
        if (filters.name) {
            result = result.filter(c => c.name.toLowerCase().includes(filters.name.toLowerCase()));
        }
        // 나이대 필터
        if (filters.age) {
            const [minAge, maxAge] = filters.age.split('-').map(Number);
            result = result.filter(c => c.age >= minAge && c.age <= maxAge);
        }
        // 성별 필터
        if (filters.gender.length > 0) {
            result = result.filter(c => filters.gender.includes(c.gender));
        }
        // 질병 필터
        if (filters.disease.length > 0) {
            const hasDisease = filters.disease.includes('유');
            const noDisease = filters.disease.includes('무');
            if (hasDisease && !noDisease) result = result.filter(c => c.hasDisease);
            if (!hasDisease && noDisease) result = result.filter(c => !c.hasDisease);
        }
        // 결혼 여부 필터
        if (filters.isMarried.length > 0) {
            result = result.filter(c => {
                const isMarried = filters.isMarried.includes('기혼');
                const isNotMarried = filters.isMarried.includes('미혼');
                if (isMarried && !isNotMarried) return c.isMarried;
                if (!isMarried && isNotMarried) return !c.isMarried;
                return true;
            });
        }
        // 자녀 유무 필터
        if (filters.hasChildren.length > 0) {
            result = result.filter(c => {
                const hasChildren = filters.hasChildren.includes('유');
                const noChildren = filters.hasChildren.includes('무');
                if (hasChildren && !noChildren) return c.hasChildren;
                if (!hasChildren && noChildren) return !c.hasChildren;
                return true;
            });
        }

        setFilteredCustomers(result);
        setIsSearched(true); // 조회가 수행되었음을 표시
    };
    
    const getFamilyInfo = (customer) => {
        const marriedText = customer.isMarried ? '기혼' : '미혼';
        const childrenText = customer.hasChildren ? '자녀 있음' : '자녀 없음';
        return `${marriedText}, ${childrenText}`;
    };

    // === 렌더링(JSX) (공통) ===
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

    if (error) {
        return (
            <div className="page-wrapper" style={{'--navbar-height': '62px', height: 'calc(100vh - var(--navbar-height))', display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%)'}}>
                <h3 style={{color: '#d9534f'}}>오류가 발생했습니다</h3>
                <p style={{color: '#4A3728'}}>{error}</p>
                <Button className="btn-golden" onClick={fetchInitialDataWithMock}>다시 시도</Button>
            </div>
        );
    }

    return (
        <div className="page-wrapper" style={{'--navbar-height': '62px', height: 'calc(100vh - var(--navbar-height))', background: 'linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%)', padding: '20px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div className={`dashboard-container ${animateCard ? 'animate-in' : ''}`} style={{width: '100%', maxWidth: '1600px', height: '100%', margin: '0 auto', display: 'flex', boxSizing: 'border-box', background: 'rgba(255, 251, 235, 0.95)', boxShadow: '0 20px 60px rgba(44, 31, 20, 0.4)', backdropFilter: 'blur(15px)', border: '2px solid rgba(184, 134, 11, 0.35)', borderRadius: '28px', padding: '20px', gap: '20px', overflow: 'hidden'}}>
                {/* 좌측 필터링 UI 영역 */}
                <div className="dashboard-left">
                    <h4 className="mb-3" style={{ fontSize: '30px', fontWeight: '700', color: '#2C1F14', paddingLeft: '10px', flexShrink: 0 }}>고객 관리</h4>
                    <div className="sidebar-scroll-area" style={{ background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.12) 0%, rgba(205, 133, 63, 0.08) 100%)', borderRadius: '15px', padding: '20px', flex: 1, overflowY: 'auto', minHeight: 0, border: '1px solid rgba(184, 134, 11, 0.2)' }}>
                        <div style={{width: '100px', height: '100px', background: 'rgba(184, 134, 11, 0.15)', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(44, 31, 20, 0.2)' }}><Search size={40} style={{ color: '#B8860B' }} /></div>
                        <h2 style={{fontWeight: '700', marginBottom: '15px', fontSize: '1.8rem', textAlign: 'center', color: '#2C1F14'}}>고객 조회</h2>
                        <p style={{fontSize: '16px', lineHeight: '1.6', margin: 0, opacity: 0.7, textAlign: 'center', color: '#4A3728'}}>조건별로 고객을 검색하고<br/>상세 정보를 확인하세요.</p>
                        <hr className="my-4"/>
                        <Form>
                            <Row className="g-3 mb-3 customer-id-name-row">
                                <Col xs={6}><Form.Label style={{color: '#4A3728'}}>고객 고유번호</Form.Label><Form.Control name="customerId" value={filters.customerId} onChange={handleInputChange} placeholder="고유번호" /></Col>
                                <Col xs={6}><Form.Label style={{color: '#4A3728'}}>이름</Form.Label><Form.Control name="name" value={filters.name} onChange={handleInputChange} placeholder="이름" /></Col>
                            </Row>
                            <Row className="g-3 mb-3">
                                <Col xs={12}><Form.Label style={{color: '#4A3728'}}>나이대</Form.Label><Form.Select name="age" value={filters.age} onChange={handleInputChange}><option value="">전체</option><option value="20-29">20대</option><option value="30-39">30대</option><option value="40-49">40대</option><option value="50-59">50대</option><option value="60-150">60대 이상</option></Form.Select></Col>
                            </Row>
                            <hr /><Form.Label style={{color: '#4A3728'}}>상세 조건</Form.Label>
                            <div className="d-flex align-items-center mb-2"><strong className="me-3" style={{minWidth: '40px', color: '#4A3728'}}>성별:</strong><Form.Check inline type="checkbox" label="남" name="gender" value="남" onChange={handleCheckboxChange} /><Form.Check inline type="checkbox" label="여" name="gender" value="여" onChange={handleCheckboxChange} /></div>
                            <div className="d-flex align-items-center mb-2"><strong className="me-3" style={{minWidth: '40px', color: '#4A3728'}}>질병:</strong><Form.Check inline type="checkbox" label="유" name="disease" value="유" onChange={handleCheckboxChange} /><Form.Check inline type="checkbox" label="무" name="disease" value="무" onChange={handleCheckboxChange} /></div>
                            <div className="d-flex align-items-center mb-2"><strong className="me-3" style={{minWidth: '40px', color: '#4A3728'}}>결혼:</strong><Form.Check inline type="checkbox" label="기혼" name="isMarried" value="기혼" onChange={handleCheckboxChange} /><Form.Check inline type="checkbox" label="미혼" name="isMarried" value="미혼" onChange={handleCheckboxChange} /></div>
                            <div className="d-flex align-items-center"><strong className="me-3" style={{minWidth: '40px', color: '#4A3728'}}>자녀:</strong><Form.Check inline type="checkbox" label="유" name="hasChildren" value="유" onChange={handleCheckboxChange} /><Form.Check inline type="checkbox" label="무" name="hasChildren" value="무" onChange={handleCheckboxChange} /></div>

                            <Button className="btn-search" onClick={handleSearch}>
                                <Search size={18} className="me-2" />
                                고객 조회
                            </Button>
                        </Form>
                    </div>
                </div>

                {/* 우측 고객 목록 UI 영역 */}
                <div className="dashboard-right" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, paddingBottom: '10px' }}>
                        {/* 조회 후 결과 카운트 표시 */}
                        <h5 style={{ fontWeight: '600', color: '#2C1F14' }}>고객 목록 ({isSearched ? filteredCustomers.length : 0}명)</h5>
                        <Button className="btn-golden" onClick={() => navigate('/menu5_2')}>고객 추가</Button>
                    </div>
                    <div className="content-scroll-area" style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
                        {/* 조회 여부에 따른 조건부 렌더링 */}
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
                                                    <Col sm={6} className="mb-2"><strong>생년월일:</strong> {customer.birthOfDate} (만 {customer.age}세)</Col>
                                                    <Col sm={6} className="mb-2"><strong>성별:</strong> {customer.gender}</Col>
                                                    <Col sm={6} className="mb-2"><strong>연락처:</strong> {customer.phone}</Col>
                                                    <Col sm={6} className="mb-2"><strong>직업:</strong> {customer.job}</Col>
                                                    <Col sm={12} className="mb-2"><strong>주소:</strong> {customer.address}</Col>
                                                    <Col sm={12} className="mb-2"><strong>가족:</strong> {getFamilyInfo(customer)}</Col>
                                                </Row>
                                            </Col>
                                            <Col md={2} className="text-center text-md-end">
                                                <Button variant="secondary" size="sm" onClick={() => navigate('/menu5_1')}>상세정보/수정</Button>
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

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
           
                 .dashboard-container { 
                    opacity: 0;
                    display: flex;
                    overflow: hidden;
                }
                .dashboard-container.animate-in { animation: fadeIn 0.6s ease-out forwards; }

                /* [추가] 좌측 패널 기본 스타일 */
                .dashboard-left {
                    flex: 0 1 400px;
                    display: flex;
                    flex-direction: column;
                }

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

                /* 조회 버튼 스타일 */
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
                .btn-search:active {
                    transform: translateY(0);
                    box-shadow: 0 4px 15px rgba(44, 31, 20, 0.2);
                }
            `}</style>
        </div>
    );
};

export default Menu5;