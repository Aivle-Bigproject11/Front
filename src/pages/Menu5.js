// src/pages/Menu5.js

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';

// 실제로는 서버에서 받아올 고객 데이터 예시입니다.
const allCustomers = [
  { id: 'SB2001', name: '김말똥', birth: '1950.01.01', age: 74, gender: '남', family: '자녀 2', job: '의사', term: '2020.01.03 ~ 2025.07.18', hasDisease: true },
  { id: 'SB2002', name: '김진우', birth: '1990.01.01', age: 34, gender: '남', family: '미혼', job: '무직', term: '2020.01.03 ~ 2025.07.18', hasDisease: false },
  { id: 'SB2003', name: '최개똥', birth: '2000.01.01', age: 24, gender: '남', family: 'X', job: '정비사', term: '2020.01.03 ~ 2025.07.18', hasDisease: false },
  { id: 'SB2004', name: '이철수', birth: '1975.01.01', age: 49, gender: '남', family: '자녀 5', job: '개발자', term: '2020.01.03 ~ 2025.07.18', hasDisease: true },
  { id: 'SB2005', name: '박영희', birth: '1982.05.10', age: 42, gender: '여', family: '기혼', job: '주부', term: '2021.03.15 ~ 2026.03.14', hasDisease: false },
];

const Menu5 = () => {
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

  useEffect(() => {
    setAnimateCard(true);
  }, []);

  useEffect(() => {
    let result = allCustomers;

    if (filters.id) {
      result = result.filter(c => c.id.toLowerCase().includes(filters.id.toLowerCase()));
    }
    if (filters.name) {
      result = result.filter(c => c.name.toLowerCase().includes(filters.name.toLowerCase()));
    }
    if (filters.age) {
      const [minAge, maxAge] = filters.age.split('-').map(Number);
      result = result.filter(c => c.age >= minAge && c.age <= maxAge);
    }
    if (filters.gender.length > 0) {
        result = result.filter(c => filters.gender.includes(c.gender));
    }
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
        const newValues = checked 
            ? [...prev[name], value]
            : prev[name].filter(v => v !== value);
        return { ...prev, [name]: newValues };
    });
  };

  const baseButtonStyle = {
    border: 'none',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  const detailButtonStyle = {
    ...baseButtonStyle,
    background: '#6c757d', 
    color: 'white',
    padding: '8px 16px',
    fontSize: '14px',
  };

  const addButtonStyle = {
    ...baseButtonStyle,
    background: 'linear-gradient(135deg, #667eea, #764ba2)', 
    color: 'white',
    padding: '12px 28px',
    fontSize: '16px',
  };

  const handleMouseEnter = (e) => {
    e.target.style.transform = 'translateY(-2px)';
    e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
  };

  const handleMouseLeave = (e) => {
    e.target.style.transform = 'translateY(0)';
    e.target.style.boxShadow = 'none';
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
          >
            고객 추가
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .dashboard-container {
          opacity: 0;
        }

        .dashboard-container.animate-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .customer-list-wrapper::-webkit-scrollbar {
          width: 6px;
        }
        .customer-list-wrapper::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
        .customer-list-wrapper::-webkit-scrollbar-thumb {
          background-color: rgba(108, 117, 125, 0.5);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default Menu5;