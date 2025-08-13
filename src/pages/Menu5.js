import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { customerService } from '../services/customerService'; 

const Menu5 = () => {
    const navigate = useNavigate();

    // === 상태 관리 ===
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [animateCard, setAnimateCard] = useState(false);
    const [isSearched, setIsSearched] = useState(false);
    const [filters, setFilters] = useState({
        customerId: '', name: '', age: '', gender: [], disease: [], isMarried: [], hasChildren: [],
    });

    useEffect(() => {
        setAnimateCard(true);
    }, []);

    // === 데이터 처리 및 헬퍼 함수 ===

    // HATEOAS 형식의 API 응답에서 ID를 추출하는 함수
    const getIdFromUrl = (url) => {
        if (!url) return null;
        const parts = url.split('/');
        return parts[parts.length - 1];
    };

    const formatDate = (dateString) => {
        if (!dateString) return '정보 없음';
        return dateString.split('T')[0];
    };

    const maskRrn = (rrn) => {
        if (!rrn || typeof rrn !== 'string' || !rrn.includes('-')) return '정보 없음';
        const parts = rrn.split('-');
      if (parts.length !== 2 || parts[0].length !== 6 || parts[1].length < 1) {
            return rrn; 
        }
        const firstDigitOfBack = parts[1].substring(0, 1);
        return `${parts[0]}-${firstDigitOfBack}******`;
    };

    const handleSearch = async () => {
        if (loading) return;
        setLoading(true);
        setError(null);
        
        try {
            const response = await customerService.getAllCustomers();
            const allCustomers = (response.data._embedded?.customerProfiles || []).map(c => ({
                ...c,
                id: getIdFromUrl(c._links.self.href),
                hasDisease: c.diseaseList && c.diseaseList.length > 0,
            }));

            let result = [...allCustomers];

            if (filters.customerId) {
                result = result.filter(c => String(c.id).includes(filters.customerId));
            }
            if (filters.name) {
                result = result.filter(c => c.name.toLowerCase().includes(filters.name.toLowerCase()));
            }
            if (filters.age) {
                const [minAge, maxAge] = filters.age.split('-').map(Number);
                result = result.filter(c => c.age >= minAge && c.age <= maxAge);
            }

            if (filters.gender.length > 0) {
                result = result.filter(c => {
                    if (!c.gender) return false;
                    // '남' 또는 '여'로 시작하는지 확인하여 '남성', '여성'도 포함
                    return filters.gender.some(filterGender => c.gender.startsWith(filterGender));
                });
            }
            if (filters.disease.length > 0) {
                const hasDisease = filters.disease.includes('유');
                const noDisease = filters.disease.includes('무');
                if (hasDisease && !noDisease) result = result.filter(c => c.hasDisease);
                if (!hasDisease && noDisease) result = result.filter(c => !c.hasDisease);
            }
            if (filters.isMarried.length > 0) {
                result = result.filter(c => {
                    const wantsMarried = filters.isMarried.includes('기혼');
                    const wantsNotMarried = filters.isMarried.includes('미혼');
                    if (wantsMarried && !wantsNotMarried) return c.isMarried;
                    if (!wantsMarried && wantsNotMarried) return !c.isMarried;
                    return true;
                });
            }
            if (filters.hasChildren.length > 0) {
                result = result.filter(c => {
                    const wantsChildren = filters.hasChildren.includes('유');
                    const wantsNoChildren = filters.hasChildren.includes('무');
                    if (wantsChildren && !wantsNoChildren) return c.hasChildren;
                    if (!wantsChildren && wantsNoChildren) return !c.hasChildren;
                    return true;
                });
            }

            setFilteredCustomers(result);

        } catch (err) {
            setError("데이터 조회에 실패했습니다. 서버 상태를 확인해주세요.");
            console.error(err);
            setFilteredCustomers([]);
        } finally {
            setLoading(false);
            setIsSearched(true);
        }
    };

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
    
    const getFamilyInfo = (customer) => {
        const marriedText = customer.isMarried ? '기혼' : '미혼';
        const childrenText = customer.hasChildren ? '자녀 있음' : '자녀 없음';
        return `${marriedText}, ${childrenText}`;
    };

    // === 렌더링(JSX) ===
    return (
       <div className="page-wrapper" style={{'--navbar-height': '62px', height: 'calc(100vh - var(--navbar-height))', background: 'linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%)', padding: '20px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
           <div className={`dashboard-container ${animateCard ? 'animate-in' : ''}`} style={{width: '100%', maxWidth: '1600px', height: '100%', margin: '0 auto', display: 'flex', boxSizing: 'border-box', background: 'rgba(255, 251, 235, 0.95)', boxShadow: '0 20px 60px rgba(44, 31, 20, 0.4)', backdropFilter: 'blur(15px)', border: '2px solid rgba(184, 134, 11, 0.35)', borderRadius: '28px', padding: '20px', gap: '20px', overflow: 'hidden'}}>
               {/* 좌측 필터링 UI 영역 */}
               <div style={{ flex: '0 0 400px', display: 'flex', flexDirection: 'column' }}>
                   <h4 className="mb-3" style={{ fontSize: '30px', fontWeight: '700', color: '#2C1F14', paddingLeft: '10px', flexShrink: 0 }}>고객 관리</h4>
                   <div className="sidebar-scroll-area" style={{ background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.12) 0%, rgba(205, 133, 63, 0.08) 100%)', borderRadius: '15px', padding: '20px', flex: 1, overflowY: 'auto', minHeight: 0, border: '1px solid rgba(184, 134, 11, 0.2)' }}>
                       <div style={{width: '100px', height: '100px', background: 'rgba(184, 134, 11, 0.15)', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(44, 31, 20, 0.2)' }}><Search size={40} style={{ color: '#B8860B' }} /></div>
                       <h2 style={{fontWeight: '700', marginBottom: '15px', fontSize: '1.8rem', textAlign: 'center', color: '#2C1F14'}}>고객 조회</h2>
                       <p style={{fontSize: '16px', lineHeight: '1.6', margin: 0, opacity: 0.7, textAlign: 'center', color: '#4A3728'}}>조건별로 고객을 검색하고<br/>상세 정보를 확인하세요.</p>
                       <hr className="my-4"/>
                       <Form>
                           <Row className="g-3 mb-3">
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

                           <Button className="btn-search" onClick={handleSearch} disabled={loading}>
                               {loading ? <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> : <Search size={18} className="me-2" />}
                               {loading ? '조회 중...' : '고객 조회'}
                           </Button>
                       </Form>
                   </div>
               </div>

               {/* 우측 고객 목록 UI 영역 */}
               <div className="dashboard-right" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, paddingBottom: '10px' }}>
                       <h5 style={{ fontWeight: '600', color: '#2C1F14' }}>고객 목록 ({isSearched ? filteredCustomers.length : 0}명)</h5>
                       <Button className="btn-golden" onClick={() => navigate('/menu5_2')}>고객 추가</Button>
                   </div>
                   <div className="content-scroll-area" style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
                       {error ? (
                           <div className="d-flex justify-content-center align-items-center h-100 text-center text-danger">
                               <p>{error}</p>
                           </div>
                       ) :!isSearched ? (
                           <div className="d-flex justify-content-center align-items-center h-100 text-center text-muted">
                               <div>
                                   <Search size={48} className="mb-3" />
                                   <p>좌측 필터에서 조건을 선택하고<br/>'고객 조회' 버튼을 눌러주세요.</p>
                               </div>
                           </div>
                       ) : filteredCustomers.length > 0 ? (
                           filteredCustomers.map(customer => (
                               <Card key={customer.id} className="mb-3" style={{ background: 'rgba(253, 251, 243, 0.92)', border: '1px solid rgba(184, 134, 11, 0.2)' }}>
                                   <Card.Body>
                                       <Row className="align-items-center">
                                           <Col md={3} className="text-center text-md-start mb-3 mb-md-0 border-end pe-md-3">
                                               <p className="text-muted mb-1" style={{ fontSize: '0.85rem' }}>{customer.id}</p>
                                               <h5 className="fw-bold mb-0" style={{color: '#2C1F14'}}>{customer.name}</h5>
                                           </Col>
                                           <Col md={7}>
                                               <Row>
                                                   <Col sm={6} className="mb-2"><strong>생년월일:</strong> {formatDate(customer.birthDate)} (만 {customer.age}세)</Col>
                                                   <Col sm={6} className="mb-2"><strong>주민등록번호:</strong> {maskRrn(customer.rrn)}</Col>
                                                   <Col sm={6} className="mb-2"><strong>성별:</strong> {customer.gender}</Col>
                                                   <Col sm={6} className="mb-2"><strong>연락처:</strong> {customer.phone}</Col>
                                                   <Col sm={6} className="mb-2"><strong>이메일:</strong> {customer.email || '정보 없음'}</Col>
                                                   <Col sm={6} className="mb-2"><strong>직업:</strong> {customer.job}</Col>
                                                   <Col sm={12} className="mb-2"><strong>주소:</strong> {customer.address}</Col>
                                                   <Col sm={12} className="mb-2"><strong>가족:</strong> {getFamilyInfo(customer)}</Col>
                                                   <Col sm={12}><strong>보유 질병:</strong> {customer.diseaseList && customer.diseaseList.length > 0 ? customer.diseaseList.join(', ') : '없음'}</Col>
                                               </Row>
                                           </Col>
                                           <Col md={2} className="text-center text-md-end">
                                               <Button variant="secondary" size="sm" onClick={() => navigate(`/menu5_1/${customer.id}`)}>상세정보/수정</Button>
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
               /* ... (기존 스타일은 동일) ... */
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
               .btn-search:active {
                   transform: translateY(0);
                   box-shadow: 0 4px 15px rgba(44, 31, 20, 0.2);
               }
               
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
                       flex: 1 1 auto;
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
       </div>
   );
};

export default Menu5;
