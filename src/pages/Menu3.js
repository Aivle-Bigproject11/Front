import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup, Badge, Modal } from 'react-bootstrap';

const Menu3 = () => {
  const [selectedService, setSelectedService] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    age: '',
    budget: '',
    preferences: '',
    timeline: ''
  });
  const [recommendations, setRecommendations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);

  const services = [
    { id: 'funeral', name: '장례식 서비스', description: '전통 또는 현대식 장례식 진행' },
    { id: 'memorial', name: '추모 서비스', description: '디지털 추모관 및 기념 서비스' },
    { id: 'counseling', name: '상담 서비스', description: '유족 상담 및 심리 지원' },
    { id: 'legal', name: '법무 서비스', description: '상속 및 법적 절차 지원' },
    { id: 'cleanup', name: '정리 서비스', description: '유품 정리 및 집 정리' }
  ];

  const handleInputChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const generateRecommendations = () => {
    // 더미 추천 데이터 생성 (실제로는 AI/ML 서비스 호출)
    const dummyRecommendations = [
      {
        id: 1,
        title: '프리미엄 장례식 패키지',
        type: '장례식 서비스',
        price: '300-500만원',
        rating: 4.8,
        features: ['전용 빈소', '꽃장식', '음향시설', '접수대행'],
        description: '품격있는 장례식을 위한 종합 서비스입니다.',
        urgency: 'high'
      },
      {
        id: 2,
        title: '디지털 추모관 서비스',
        type: '추모 서비스',
        price: '50-100만원',
        rating: 4.6,
        features: ['온라인 추모관', 'AI 추모영상', '방명록', '추모사 작성'],
        description: '영원히 기억될 디지털 추모 공간을 제공합니다.',
        urgency: 'medium'
      },
      {
        id: 3,
        title: '유족 상담 프로그램',
        type: '상담 서비스',
        price: '20-50만원',
        rating: 4.9,
        features: ['개인 상담', '그룹 상담', '24시간 지원', '전문 상담사'],
        description: '상실감 극복을 위한 전문적인 심리 상담 서비스입니다.',
        urgency: 'low'
      }
    ];

    setRecommendations(dummyRecommendations);
  };

  const showRecommendationDetail = (recommendation) => {
    setSelectedRecommendation(recommendation);
    setShowModal(true);
  };

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'high':
        return <Badge bg="danger">긴급</Badge>;
      case 'medium':
        return <Badge bg="warning">보통</Badge>;
      default:
        return <Badge bg="success">여유</Badge>;
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h1>전환 서비스 추천</h1>
          <p className="lead">고객 상황에 맞는 최적의 서비스를 추천해드립니다.</p>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={4}>
          <Card>
            <Card.Header>
              <h5>고객 정보 입력</h5>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>서비스 유형</Form.Label>
                  <Form.Select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                  >
                    <option value="">선택하세요</option>
                    {services.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>고객명</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    placeholder="고객명을 입력하세요"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>연령대</Form.Label>
                  <Form.Select
                    name="age"
                    value={customerInfo.age}
                    onChange={handleInputChange}
                  >
                    <option value="">선택하세요</option>
                    <option value="20-30">20-30대</option>
                    <option value="30-40">30-40대</option>
                    <option value="40-50">40-50대</option>
                    <option value="50-60">50-60대</option>
                    <option value="60+">60대 이상</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>예산 범위</Form.Label>
                  <Form.Select
                    name="budget"
                    value={customerInfo.budget}
                    onChange={handleInputChange}
                  >
                    <option value="">선택하세요</option>
                    <option value="100">100만원 이하</option>
                    <option value="300">100-300만원</option>
                    <option value="500">300-500만원</option>
                    <option value="500+">500만원 이상</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>특별 요구사항</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="preferences"
                    value={customerInfo.preferences}
                    onChange={handleInputChange}
                    placeholder="특별한 요구사항이 있으시면 입력해주세요"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>진행 시급성</Form.Label>
                  <Form.Select
                    name="timeline"
                    value={customerInfo.timeline}
                    onChange={handleInputChange}
                  >
                    <option value="">선택하세요</option>
                    <option value="urgent">긴급 (1-2일)</option>
                    <option value="soon">빠른 시일 (3-7일)</option>
                    <option value="flexible">여유 (1주일 이상)</option>
                  </Form.Select>
                </Form.Group>

                <Button 
                  variant="primary" 
                  onClick={generateRecommendations}
                  className="w-100"
                >
                  <i className="fas fa-search"></i> 추천 서비스 찾기
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card>
            <Card.Header>
              <h5>추천 서비스 목록</h5>
            </Card.Header>
            <Card.Body>
              {recommendations.length === 0 ? (
                <div className="text-center p-5">
                  <i className="fas fa-lightbulb fa-3x text-muted mb-3"></i>
                  <h5>추천 서비스가 없습니다</h5>
                  <p className="text-muted">
                    좌측에서 고객 정보를 입력하고 "추천 서비스 찾기"를 클릭하세요.
                  </p>
                </div>
              ) : (
                <ListGroup>
                  {recommendations.map(recommendation => (
                    <ListGroup.Item 
                      key={recommendation.id}
                      className="d-flex justify-content-between align-items-start"
                    >
                      <div className="ms-2 me-auto">
                        <div className="fw-bold d-flex align-items-center gap-2">
                          {recommendation.title}
                          {getUrgencyBadge(recommendation.urgency)}
                        </div>
                        <p className="mb-1">{recommendation.description}</p>
                        <small className="text-muted">
                          {recommendation.type} | {recommendation.price} | 
                          ⭐ {recommendation.rating}
                        </small>
                        <div className="mt-2">
                          <Button 
                            size="sm" 
                            variant="outline-primary"
                            onClick={() => showRecommendationDetail(recommendation)}
                          >
                            자세히 보기
                          </Button>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 서비스 상세 정보 모달 */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedRecommendation?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRecommendation && (
            <div>
              <Row>
                <Col md={6}>
                  <h6>서비스 정보</h6>
                  <ul>
                    <li><strong>유형:</strong> {selectedRecommendation.type}</li>
                    <li><strong>가격:</strong> {selectedRecommendation.price}</li>
                    <li><strong>평점:</strong> ⭐ {selectedRecommendation.rating}</li>
                  </ul>
                </Col>
                <Col md={6}>
                  <h6>포함 서비스</h6>
                  <ul>
                    {selectedRecommendation.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </Col>
              </Row>
              <div className="mt-3">
                <h6>상세 설명</h6>
                <p>{selectedRecommendation.description}</p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            닫기
          </Button>
          <Button variant="primary">
            상담 신청
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Menu3;
