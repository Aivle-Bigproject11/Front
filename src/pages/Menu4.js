import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Table, Badge, Tab, Tabs } from 'react-bootstrap';
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
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1>디지털 추모관</h1>
              <p className="lead">소중한 분들을 영원히 기억할 수 있는 디지털 공간입니다.</p>
            </div>
            <Button variant="primary" onClick={openCreateModal}>
              <i className="fas fa-plus"></i> 새 추모관 만들기
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header>
              <h5>추모관 목록</h5>
            </Card.Header>
            <Card.Body>
              {memorials.length === 0 ? (
                <div className="text-center p-5">
                  <i className="fas fa-heart fa-3x text-muted mb-3"></i>
                  <h5>등록된 추모관이 없습니다</h5>
                  <p className="text-muted">첫 번째 추모관을 만들어보세요.</p>
                </div>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>이름</th>
                      <th>나이</th>
                      <th>성별</th>
                      <th>생년월일</th>
                      <th>별세일</th>
                      <th>고객ID</th>
                      <th>상태</th>
                      <th>작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    {memorials.map(memorial => (
                      <tr key={memorial.id}>
                        <td>
                          <strong>{memorial.name}</strong>
                        </td>
                        <td>{memorial.age}세</td>
                        <td>
                          <Badge bg={memorial.gender === 'MALE' ? 'primary' : 'danger'}>
                            {memorial.gender === 'MALE' ? '남성' : '여성'}
                          </Badge>
                        </td>
                        <td>{memorial.birthOfDate}</td>
                        <td>{memorial.deceasedDate}</td>
                        <td>{memorial.customerId}</td>
                        <td>
                          <Badge bg="success">활성</Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button
                              size="sm"
                              variant="outline-info"
                              onClick={() => openViewModal(memorial)}
                            >
                              보기
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => openEditModal(memorial)}
                            >
                              수정
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => deleteMemorial(memorial.id)}
                            >
                              삭제
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
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
