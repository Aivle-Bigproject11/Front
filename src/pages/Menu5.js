import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; 

import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Search } from 'lucide-react';

// Mock 데이터
const allCustomers = [
    { id: 'SB2001', name: '김말똥', birth: '1950.01.01', age: 74, gender: '남', family: '자녀 2', job: '의사', term: '2020.01.03 ~ 2025.07.18', hasDisease: true, payment: 680 },
    { id: 'SB2002', name: '김진우', birth: '1990.01.01', age: 34, gender: '남', family: '미혼', job: '무직', term: '2020.01.03 ~ 2025.07.18', hasDisease: false, payment: 420 },
    { id: 'SB2003', name: '최개똥', birth: '2000.01.01', age: 24, gender: '남', family: 'X', job: '정비사', term: '2020.01.03 ~ 2025.07.18', hasDisease: false, payment: 480 },
    { id: 'SB2004', name: '이철수', birth: '1975.01.01', age: 49, gender: '남', family: '자녀 5', job: '개발자', term: '2020.01.03 ~ 2025.07.18', hasDisease: true, payment: 750 },
    { id: 'SB2005', name: '박영희', birth: '1982.05.10', age: 42, gender: '여', family: '기혼', job: '주부', term: '2021.03.15 ~ 2026.03.14', hasDisease: false, payment: 550 },
];

const Menu5 = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    id: '',
    name: '',
    age: '',
    gender: [],
    disease: [],
    family: [],
  });
  const [filteredCustomers, setFilteredCustomers] = useState(allCustomers);
  const [animateCard, setAnimateCard] = useState(false);
    const [filters, setFilters] = useState({
        id: '', name: '', age: '', payment: '', gender: [], disease: [], family: [],
    });
    const [filteredCustomers, setFilteredCustomers] = useState(allCustomers);
    const [animateCard, setAnimateCard] = useState(false);

    useEffect(() => { setAnimateCard(true); }, []);
    useEffect(() => {
        let result = allCustomers;
        if (filters.id) { result = result.filter(c => c.id.toLowerCase().includes(filters.id.toLowerCase())); }
        if (filters.name) { result = result.filter(c => c.name.toLowerCase().includes(filters.name.toLowerCase())); }
        if (filters.age) {
            const [minAge, maxAge] = filters.age.split('-').map(Number);
            result = result.filter(c => c.age >= minAge && c.age <= maxAge);
        }
        if (filters.payment) {
            if (filters.payment === '600-99999') {
                result = result.filter(c => c.payment >= 600);
            } else {
                const [minPay, maxPay] = filters.payment.split('-').map(Number);
                result = result.filter(c => c.payment >= minPay && c.payment <= maxPay);
            }
        }
        if (filters.gender.length > 0) { result = result.filter(c => filters.gender.includes(c.gender)); }
        if (filters.disease.length > 0) {
            const hasDisease = filters.disease.includes('유');
            const noDisease = filters.disease.includes('무');
            if (hasDisease && !noDisease) result = result.filter(c => c.hasDisease);
            if (!hasDisease && noDisease) result = result.filter(c => !c.hasDisease);
        }
        if (filters.family.length > 0) {
            result = result.filter(c => {
                if (filters.family.includes('미혼') && c.family === '미혼') return true;
                if (filters.family.includes('기혼') && c.family === '기혼') return true;
                if (filters.family.includes('자녀') && c.family.includes('자녀')) return true;
                return false;
            });
        }
        setFilteredCustomers(result);
    }, [filters]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
        const { name, value, checked } = e.target;
        setFilters(prev => {
            const newValues = checked ? [...prev[name], value] : prev[name].filter(v => v !== value);
            return { ...prev, [name]: newValues };
        });
    };

  return (
    <div className="page-wrapper" style={{
      '--navbar-height': '62px',
      height: 'calc(100vh - var(--navbar-height))', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '20px',
      boxSizing: 'border-box',
    }}>
      <div className={`dashboard-container ${animateCard ? 'animate-in' : ''}`} style={{
        width: '100%',
        maxWidth: '1600px',
        height: '100%',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
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
        <h2 className="mb-3" style={{ fontSize: '30px', fontWeight: '700', color: '#343a40', flexShrink: 0 }}>
          고객 관리
        </h2>

        <Card className="mb-3" style={{ flexShrink: 0, background: 'rgba(255, 255, 255, 0.8)', border: 'none' }}>
          <Card.Body>
            <Form>
              <Row className="align-items-center g-3">
                <Col md={2}>
                  <InputGroup>
                    <Form.Control name="id" value={filters.id} onChange={handleInputChange} placeholder="고객 고유번호" />
                  </InputGroup>
                </Col>
                <Col md={2}>
                  <InputGroup>
                    <Form.Control name="name" value={filters.name} onChange={handleInputChange} placeholder="이름" />
                  </InputGroup>
                </Col>
                <Col md={2}>
                  <Form.Select name="age" value={filters.age} onChange={handleInputChange}>
                    <option value="">나이대</option>
                    <option value="20-29">20대</option>
                    <option value="30-39">30대</option>
                    <option value="40-49">40대</option>
                    <option value="50-59">50대</option>
                    <option value="60-150">60대 이상</option>
                  </Form.Select>
                </Col>
                <Col md={6}>
                  <div className="d-flex align-items-center flex-wrap">
                    <strong className="me-2">성별:</strong>
                    <Form.Check inline type="checkbox" label="남" name="gender" value="남" onChange={handleCheckboxChange} />
                    <Form.Check inline type="checkbox" label="여" name="gender" value="여" onChange={handleCheckboxChange} />
                    
                    <strong className="ms-3 me-2">질병:</strong>
                    <Form.Check inline type="checkbox" label="유" name="disease" value="유" onChange={handleCheckboxChange} />
                    <Form.Check inline type="checkbox" label="무" name="disease" value="무" onChange={handleCheckboxChange} />
                    
                    <strong className="ms-3 me-2">가족:</strong>
                    <Form.Check inline type="checkbox" label="미혼" name="family" value="미혼" onChange={handleCheckboxChange} />
                    <Form.Check inline type="checkbox" label="기혼" name="family" value="기혼" onChange={handleCheckboxChange} />
                    <Form.Check inline type="checkbox" label="자녀" name="family" value="자녀" onChange={handleCheckboxChange} />
                  </div>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        <div className="customer-list-wrapper" style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
          {filteredCustomers.map(customer => (
            <Card key={customer.id} className="mb-3" style={{ background: 'rgba(255, 255, 255, 0.9)' }}>
              <Card.Body>
                <Row className="align-items-center">
                  <Col>
                    <Row>
                      <Col md={4}><strong>고유번호:</strong> {customer.id}</Col>
                      <Col md={4}><strong>생년월일:</strong> {customer.birth} (만 {customer.age}세)</Col>
                      <Col md={4}><strong>성별:</strong> {customer.gender}</Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={4}><strong>이름:</strong> {customer.name}</Col>
                      <Col md={4}><strong>직업:</strong> {customer.job}</Col>
                      <Col md={4}><strong>가족구성원:</strong> {customer.family}</Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={12}><strong>납입기간:</strong> {customer.term}</Col>
                    </Row>
                  </Col>
                  <Col md="auto">
                    <button 
                      style={detailButtonStyle}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => navigate('/menu5_1')}
                    >
                      상세정보/수정
                    </button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </div>

        <div className="text-end mt-3" style={{ flexShrink: 0 }}>
          <button 
            style={addButtonStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => navigate('/menu5_2')}
          >
            고객 추가
          </button>
        </div>
      </div>
    return (
        <div className="page-wrapper" style={{
            '--navbar-height': '62px', height: 'calc(100vh - var(--navbar-height))',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            padding: '20px', boxSizing: 'border-box', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
        }}>
            <div className={`dashboard-container ${animateCard ? 'animate-in' : ''}`} style={{
                width: '100%', maxWidth: '1600px', height: '100%', margin: '0 auto',
                display: 'flex', boxSizing: 'border-box', background: 'rgba(255, 255, 255, 0.7)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.18)', borderRadius: '20px',
                padding: '20px', gap: '20px', overflow: 'hidden',
            }}>
                <div style={{ flex: '0 0 400px', display: 'flex', flexDirection: 'column' }}>
                    <h4 className="mb-3" style={{ fontSize: '30px', fontWeight: '700', color: '#343a40', paddingLeft: '10px', flexShrink: 0 }}>
                        고객 관리
                    </h4>
                    <div className="sidebar-scroll-area" style={{
                        background: 'rgba(255, 255, 255, 0.8)', borderRadius: '15px', padding: '20px',
                        flex: 1, overflowY: 'auto', minHeight: 0
                    }}>
                        <div style={{
                            width: '120px', height: '120px', background: 'rgba(111, 66, 193, 0.2)',
                            borderRadius: '50%', margin: '0 auto 30px', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                        }}><Search size={48} style={{ color: '#6f42c1' }} /></div>
                        <h2 style={{fontWeight: '700', marginBottom: '15px', fontSize: '1.8rem', textAlign: 'center', color: '#343a40'}}>고객 조회</h2>
                        <p style={{fontSize: '16px', lineHeight: '1.6', margin: 0, opacity: 0.7, textAlign: 'center', color: '#6c757d'}}>
                            조건별로 고객을 검색하고<br/>목록을 확인하세요.
                        </p>
                        <hr className="my-4"/>
                        <Form>
                            <Row className="g-3 mb-3"><Col xs={6}><Form.Label>고객 고유번호</Form.Label><Form.Control name="id" value={filters.id} onChange={handleInputChange} placeholder="고유번호" /></Col><Col xs={6}><Form.Label>이름</Form.Label><Form.Control name="name" value={filters.name} onChange={handleInputChange} placeholder="이름" /></Col></Row>
                            <Row className="g-3"><Col xs={6}><Form.Label>나이대</Form.Label><Form.Select name="age" value={filters.age} onChange={handleInputChange}><option value="">전체</option><option value="20-29">20대</option><option value="30-39">30대</option><option value="40-49">40대</option><option value="50-59">50대</option><option value="60-150">60대 이상</option></Form.Select></Col><Col xs={6}><Form.Label>납입금</Form.Label><Form.Select name="payment" value={filters.payment} onChange={handleInputChange}><option value="">전체</option><option value="400-499">400 ~ 499 만원</option><option value="500-599">500 ~ 599 만원</option><option value="600-99999">600만원 이상</option></Form.Select></Col></Row>
                            <hr /><Form.Label>상세 조건</Form.Label>
                            <div className="d-flex align-items-center mb-2"><strong className="me-3" style={{minWidth: '40px'}}>성별:</strong><Form.Check inline type="checkbox" label="남" name="gender" value="남" onChange={handleCheckboxChange} /><Form.Check inline type="checkbox" label="여" name="gender" value="여" onChange={handleCheckboxChange} /></div>
                            <div className="d-flex align-items-center mb-2"><strong className="me-3" style={{minWidth: '40px'}}>질병:</strong><Form.Check inline type="checkbox" label="유" name="disease" value="유" onChange={handleCheckboxChange} /><Form.Check inline type="checkbox" label="무" name="disease" value="무" onChange={handleCheckboxChange} /></div>
                            <div className="d-flex align-items-center"><strong className="me-3" style={{minWidth: '40px'}}>가족:</strong><Form.Check inline type="checkbox" label="미혼" name="family" value="미혼" onChange={handleCheckboxChange} /><Form.Check inline type="checkbox" label="기혼" name="family" value="기혼" onChange={handleCheckboxChange} /><Form.Check inline type="checkbox" label="자녀" name="family" value="자녀" onChange={handleCheckboxChange} /></div>
                        </Form>
                    </div>
                </div>

                <div className="dashboard-right" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, paddingBottom: '10px' }}>
                        <h5 style={{ fontWeight: '600', color: '#343a40' }}>고객 목록 ({filteredCustomers.length}명)</h5>
                        <Button className="btn-purple">고객 추가</Button>
                    </div>
                    <div className="content-scroll-area" style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
                        {filteredCustomers.map(customer => (
                            <Card key={customer.id} className="mb-3" style={{ background: 'rgba(255, 255, 255, 0.9)' }}>
                                <Card.Body>
                                    <Row className="align-items-center">
                                        {/* 좌측: 고유번호, 이름 */}
                                        <Col md={3} className="text-center text-md-start mb-3 mb-md-0 border-end pe-md-3">
                                            <p className="text-muted mb-1" style={{ fontSize: '0.85rem' }}>{customer.id}</p>
                                            <h5 className="fw-bold mb-0">{customer.name}</h5>
                                        </Col>
                                        
                                        {/* 우측: 나머지 정보 */}
                                        <Col md={7}>
                                            <Row>
                                                <Col sm={6} className="mb-2"><strong>생년월일:</strong> {customer.birth} (만 {customer.age}세)</Col>
                                                <Col sm={6} className="mb-2"><strong>성별:</strong> {customer.gender}</Col>
                                                <Col sm={6} className="mb-2"><strong>직업:</strong> {customer.job}</Col>
                                                <Col sm={6} className="mb-2"><strong>가족:</strong> {customer.family}</Col>
                                                <Col sm={6} className="mb-2"><strong>납입금:</strong> {customer.payment.toLocaleString()}만원</Col>
                                                <Col sm={6} className="mb-2"><strong>납입기간:</strong> {customer.term}</Col>
                                            </Row>
                                        </Col>

                                        <Col md={2} className="text-center text-md-end">
                                            <Button variant="secondary" size="sm">상세정보/수정</Button>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        ))}
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
                .sidebar-scroll-area::-webkit-scrollbar-thumb { background-color: rgba(108, 117, 125, 0.5); border-radius: 10px; }
                .btn-purple { background-color: #6f42c1; border-color: #6f42c1; color: white; }
                .btn-purple:hover { background-color: #5a32a3; border-color: #5a32a3; color: white; }
            `}</style>
        </div>
    );
};

export default Menu5;