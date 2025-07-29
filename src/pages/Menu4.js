import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Badge, Tab, Tabs } from 'react-bootstrap';
import { dummyData } from '../services/api';

const Menu4 = () => {
  const [memorials, setMemorials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // create, edit, view
  const [selectedMemorial, setSelectedMemorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    birthOfDate: '',
    deceasedDate: '',
    gender: '',
    imageUrl: '',
    customerId: ''
  });

  useEffect(() => {
    // TODO: 실제 API 호출로 교체
    setTimeout(() => {
      setMemorials(dummyData.memorials._embedded.memorials);
      setLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({
      name: '',
      age: '',
      birthOfDate: '',
      deceasedDate: '',
      gender: '',
      imageUrl: '',
      customerId: ''
    });
    setShowModal(true);
  };

  const openEditModal = (memorial) => {
    setModalMode('edit');
    setSelectedMemorial(memorial);
    setFormData({
      name: memorial.name,
      age: memorial.age,
      birthOfDate: memorial.birthOfDate,
      deceasedDate: memorial.deceasedDate,
      gender: memorial.gender,
      imageUrl: memorial.imageUrl || '',
      customerId: memorial.customerId
    });
    setShowModal(true);
  };

  const openViewModal = (memorial) => {
    setModalMode('view');
    setSelectedMemorial(memorial);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (modalMode === 'create') {
      // TODO: API 호출로 새 추모관 생성
      const newMemorial = {
        id: memorials.length + 1,
        ...formData,
        age: parseInt(formData.age),
        customerId: parseInt(formData.customerId)
      };
      setMemorials([...memorials, newMemorial]);
    } else if (modalMode === 'edit') {
      // TODO: API 호출로 추모관 수정
      const updatedMemorials = memorials.map(memorial =>
        memorial.id === selectedMemorial.id
          ? { ...memorial, ...formData, age: parseInt(formData.age) }
          : memorial
      );
      setMemorials(updatedMemorials);
    }
    
    setShowModal(false);
  };

  const deleteMemorial = (id) => {
    if (window.confirm('정말로 이 추모관을 삭제하시겠습니까?')) {
      // TODO: API 호출로 추모관 삭제
      setMemorials(memorials.filter(memorial => memorial.id !== id));
    }
  };

  const generateAIContent = (type) => {
    // TODO: AI 서비스 호출
    alert(`AI ${type} 생성 기능을 호출합니다.`);
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">추모관 목록을 불러오는 중...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <div className="memorial-header-section p-4 mb-4" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '15px',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
              opacity: 0.1
            }}></div>
            <div className="d-flex justify-content-between align-items-center position-relative">
              <div>
                <h1 className="mb-2" style={{ fontWeight: '700', fontSize: '2.5rem' }}>
                  <i className="fas fa-heart me-3"></i>
                  디지털 추모관
                </h1>
                <p className="lead mb-0" style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                  소중한 분들을 영원히 기억할 수 있는 디지털 공간입니다
                </p>
              </div>
              <Button 
                size="lg"
                variant="light" 
                onClick={openCreateModal}
                style={{
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontWeight: '600',
                  boxShadow: '0 4px 15px rgba(255,255,255,0.2)'
                }}
              >
                <i className="fas fa-plus me-2"></i> 새 추모관 만들기
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card style={{ border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', borderRadius: '15px' }}>
            <Card.Header style={{
              background: 'linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100%)',
              border: 'none',
              borderRadius: '15px 15px 0 0',
              padding: '1.5rem'
            }}>
              <div className="d-flex align-items-center">
                <div className="memorial-icon-bg me-3" style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <i className="fas fa-list text-white" style={{ fontSize: '1.2rem' }}></i>
                </div>
                <div>
                  <h5 className="mb-1" style={{ fontWeight: '600', color: '#333' }}>
                    추모관 목록
                  </h5>
                  <small className="text-muted">
                    총 {memorials.length}개의 추모관이 등록되어 있습니다
                  </small>
                </div>
              </div>
            </Card.Header>
            <Card.Body style={{ padding: '2rem' }}>
              {memorials.length === 0 ? (
                <div className="text-center p-5" style={{
                  background: 'linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)',
                  borderRadius: '12px',
                  border: '2px dashed #e0e7ff'
                }}>
                  <div className="memorial-empty-icon mb-4" style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
                  }}>
                    <i className="fas fa-heart text-white" style={{ fontSize: '2rem' }}></i>
                  </div>
                  <h5 style={{ color: '#4c51bf', fontWeight: '600' }}>
                    등록된 추모관이 없습니다
                  </h5>
                  <p className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>
                    소중한 분을 기리는 첫 번째 추모관을 만들어보세요
                  </p>
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={openCreateModal}
                    style={{
                      borderRadius: '12px',
                      padding: '12px 32px',
                      fontWeight: '600',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none'
                    }}
                  >
                    <i className="fas fa-plus me-2"></i>
                    새 추모관 만들기
                  </Button>
                </div>
              ) : (
                <Row>
                  {memorials.map(memorial => (
                    <Col key={memorial.id} lg={4} md={6} sm={12} className="mb-4">
                      <Card className="h-100 memorial-card" style={{ transition: 'all 0.3s ease', border: '1px solid #e0e0e0' }}>
                        {/* 추모관 헤더 이미지 */}
                        <div 
                          className="memorial-header"
                          style={{
                            height: '200px',
                            background: memorial.imageUrl 
                              ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${memorial.imageUrl})`
                              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: 'white',
                            position: 'relative'
                          }}
                        >
                          {!memorial.imageUrl && (
                            <i className="fas fa-user-circle fa-4x mb-2" style={{ opacity: 0.8 }}></i>
                          )}
                          <h4 className="mb-0" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                            {memorial.name}
                          </h4>
                          <p className="mb-0" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
                            {memorial.age}세
                          </p>
                          
                          {/* 상태 배지 */}
                          <div className="position-absolute top-0 end-0 m-2">
                            <Badge bg="success" className="px-2 py-1">
                              <i className="fas fa-circle me-1" style={{ fontSize: '0.6rem' }}></i>
                              활성
                            </Badge>
                          </div>
                        </div>

                        <Card.Body className="d-flex flex-column">
                          {/* 기본 정보 */}
                          <div className="memorial-info mb-3">
                            <Row className="mb-2">
                              <Col xs={6}>
                                <small className="text-muted">
                                  <i className="fas fa-venus-mars me-1"></i>성별
                                </small>
                                <div>
                                  <Badge bg={memorial.gender === 'MALE' ? 'primary' : 'danger'} className="px-2">
                                    {memorial.gender === 'MALE' ? '남성' : '여성'}
                                  </Badge>
                                </div>
                              </Col>
                              <Col xs={6}>
                                <small className="text-muted">
                                  <i className="fas fa-id-card me-1"></i>고객ID
                                </small>
                                <div className="fw-bold">{memorial.customerId}</div>
                              </Col>
                            </Row>
                            
                            <Row className="mb-2">
                              <Col xs={12}>
                                <small className="text-muted">
                                  <i className="fas fa-birthday-cake me-1"></i>생년월일
                                </small>
                                <div>{memorial.birthOfDate}</div>
                              </Col>
                            </Row>
                            
                            <Row>
                              <Col xs={12}>
                                <small className="text-muted">
                                  <i className="fas fa-cross me-1"></i>별세일
                                </small>
                                <div>{memorial.deceasedDate}</div>
                              </Col>
                            </Row>
                          </div>

                          {/* 하단 버튼들 */}
                          <div className="mt-auto">
                            <hr className="mb-3" />
                            <div className="d-flex justify-content-between gap-1">
                              <Button
                                size="sm"
                                variant="outline-info"
                                className="flex-fill"
                                onClick={() => openViewModal(memorial)}
                              >
                                <i className="fas fa-eye me-1"></i>
                                보기
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-primary"
                                className="flex-fill"
                                onClick={() => openEditModal(memorial)}
                              >
                                <i className="fas fa-edit me-1"></i>
                                수정
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                className="flex-fill"
                                onClick={() => deleteMemorial(memorial.id)}
                              >
                                <i className="fas fa-trash me-1"></i>
                                삭제
                              </Button>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* AI 서비스 섹션 */}
      <Row className="mt-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>AI 추모영상 생성</h5>
            </Card.Header>
            <Card.Body>
              <p>AI 기술을 활용하여 감동적인 추모영상을 자동으로 생성합니다.</p>
              <Button 
                variant="success"
                onClick={() => generateAIContent('추모영상')}
              >
                <i className="fas fa-video"></i> AI 추모영상 생성
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>AI 추모사 생성</h5>
            </Card.Header>
            <Card.Body>
              <p>AI가 고인의 삶과 추억을 바탕으로 따뜻한 추모사를 작성합니다.</p>
              <Button 
                variant="info"
                onClick={() => generateAIContent('추모사')}
              >
                <i className="fas fa-pen"></i> AI 추모사 생성
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 추모관 생성/수정/보기 모달 */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === 'create' && '새 추모관 만들기'}
            {modalMode === 'edit' && '추모관 정보 수정'}
            {modalMode === 'view' && '추모관 상세 정보'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalMode === 'view' ? (
            <Tabs defaultActiveKey="info" className="mb-3">
              <Tab eventKey="info" title="기본 정보">
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>이름:</strong> {selectedMemorial?.name}</p>
                    <p><strong>나이:</strong> {selectedMemorial?.age}세</p>
                    <p><strong>성별:</strong> {selectedMemorial?.gender === 'MALE' ? '남성' : '여성'}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>생년월일:</strong> {selectedMemorial?.birthOfDate}</p>
                    <p><strong>별세일:</strong> {selectedMemorial?.deceasedDate}</p>
                    <p><strong>고객ID:</strong> {selectedMemorial?.customerId}</p>
                  </div>
                </div>
              </Tab>
              <Tab eventKey="memorial" title="추모 콘텐츠">
                <div className="text-center p-4">
                  <i className="fas fa-image fa-3x text-muted mb-3"></i>
                  <p>추모 콘텐츠가 준비 중입니다.</p>
                </div>
              </Tab>
              <Tab eventKey="guestbook" title="방명록">
                <div className="text-center p-4">
                  <i className="fas fa-book fa-3x text-muted mb-3"></i>
                  <p>방명록 기능이 준비 중입니다.</p>
                </div>
              </Tab>
            </Tabs>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>이름 *</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>나이 *</Form.Label>
                    <Form.Control
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>성별 *</Form.Label>
                    <Form.Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">선택하세요</option>
                      <option value="MALE">남성</option>
                      <option value="FEMALE">여성</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>생년월일 *</Form.Label>
                    <Form.Control
                      type="date"
                      name="birthOfDate"
                      value={formData.birthOfDate}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>별세일 *</Form.Label>
                    <Form.Control
                      type="date"
                      name="deceasedDate"
                      value={formData.deceasedDate}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>고객ID *</Form.Label>
                    <Form.Control
                      type="number"
                      name="customerId"
                      value={formData.customerId}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>사진 URL (선택사항)</Form.Label>
                <Form.Control
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {modalMode === 'view' ? '닫기' : '취소'}
          </Button>
          {modalMode !== 'view' && (
            <Button variant="primary" onClick={handleSubmit}>
              {modalMode === 'create' ? '추모관 만들기' : '수정 완료'}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Menu4;
