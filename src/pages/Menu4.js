import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Badge, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { dummyData } from '../services/api';

const Menu4 = () => {
  const navigate = useNavigate();
  const [memorials, setMemorials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // create, edit, view
  const [selectedMemorial, setSelectedMemorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [relationship, setRelationship] = useState('');
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

  const openFamilyModal = (memorial) => {
    setSelectedMemorial(memorial);
    // TODO: 실제 API에서 해당 추모관의 유가족 목록 조회
    setFamilyMembers([
      {
        id: 1,
        memberId: 1001,
        name: '김철수',
        phone: '010-1234-5678',
        email: 'kim.chulsoo@example.com',
        relationship: '아들'
      },
      {
        id: 2,
        memberId: 1002,
        name: '이영희',
        phone: '010-9876-5432',
        email: 'lee.younghee@example.com',
        relationship: '딸'
      }
    ]);
    setSearchKeyword('');
    setSearchResults([]);
    setSelectedMember(null);
    setRelationship('');
    setShowFamilyModal(true);
  };

  // 회원 검색 함수
  const searchMembers = async (keyword) => {
    if (!keyword.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // TODO: 실제 API 호출로 교체
    setTimeout(() => {
      const results = dummyData.members.filter(member =>
        member.name.toLowerCase().includes(keyword.toLowerCase()) ||
        member.phone.includes(keyword) ||
        member.email.toLowerCase().includes(keyword.toLowerCase())
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);
    searchMembers(keyword);
  };

  // 회원 선택 핸들러
  const selectMember = (member) => {
    setSelectedMember(member);
    setSearchKeyword(member.name);
    setSearchResults([]);
  };

  // 유가족 등록 함수
  const addFamilyMember = () => {
    if (selectedMember && relationship) {
      // 이미 등록된 회원인지 확인
      const isAlreadyRegistered = familyMembers.some(fm => fm.memberId === selectedMember.id);
      
      if (isAlreadyRegistered) {
        alert('이미 등록된 회원입니다.');
        return;
      }

      const newFamilyMember = {
        id: familyMembers.length + 1,
        memberId: selectedMember.id,
        name: selectedMember.name,
        phone: selectedMember.phone,
        email: selectedMember.email,
        relationship: relationship
      };
      
      setFamilyMembers([...familyMembers, newFamilyMember]);
      setSelectedMember(null);
      setSearchKeyword('');
      setRelationship('');
    }
  };

  const removeFamilyMember = (id) => {
    setFamilyMembers(familyMembers.filter(member => member.id !== id));
  };

  // 추모관 카드 클릭 시 상세 페이지로 이동
  const handleCardClick = (memorialId) => {
    navigate(`/memorial/${memorialId}`);
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
                      <Card 
                        className="h-100 memorial-card" 
                        style={{ 
                          transition: 'all 0.3s ease', 
                          border: '1px solid #e0e0e0',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleCardClick(memorial.id)}
                      >
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
                            <div className="d-flex justify-content-end align-items-center">
                              {/* 더보기 메뉴 */}
                              <Dropdown align="end" onClick={(e) => e.stopPropagation()}>
                                <Dropdown.Toggle
                                  size="sm"
                                  variant="outline-secondary"
                                  style={{
                                    width: '40px',
                                    height: '32px',
                                    padding: '0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid #dee2e6'
                                  }}
                                >
                                  <i className="fas fa-ellipsis-v"></i>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                  {/* <Dropdown.Item onClick={(e) => {
                                    e.stopPropagation();
                                    openEditModal(memorial);
                                  }}>
                                    <i className="fas fa-edit me-2"></i>
                                    수정
                                  </Dropdown.Item> */}
                                  <Dropdown.Item onClick={(e) => {
                                    e.stopPropagation();
                                    openFamilyModal(memorial);
                                  }}>
                                    <i className="fas fa-users me-2"></i>
                                    유가족 관리
                                  </Dropdown.Item>
                                  <Dropdown.Divider />
                                  <Dropdown.Item 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteMemorial(memorial.id);
                                    }}
                                    className="text-danger"
                                  >
                                    <i className="fas fa-trash me-2"></i>
                                    삭제
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
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

      {/* 추모관 생성/수정/보기 모달 */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === 'create' && '새 추모관 만들기'}
            {/* {modalMode === 'edit' && '추모관 정보 수정'} */}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            취소
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            새 추모관 만들기
            {/* {modalMode === 'create' ? '추모관 만들기' : '수정 완료'} */}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 유가족 관리 모달 */}
      <Modal 
        show={showFamilyModal} 
        onHide={() => setShowFamilyModal(false)} 
        size="lg"
        className="family-management-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-users me-2"></i>
            유가족 관리 - {selectedMemorial?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">
                  <i className="fas fa-search me-2"></i>
                  회원 검색 및 유가족 등록
                </h6>
              </div>
              
              {/* 회원 검색 */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <div className="position-relative">
                    <Form.Control
                      type="text"
                      placeholder="이름, 전화번호, 이메일로 검색..."
                      value={searchKeyword}
                      onChange={handleSearchChange}
                      className="pe-5"
                    />
                    <div className="position-absolute top-50 end-0 translate-middle-y pe-3">
                      {isSearching ? (
                        <div className="spinner-border spinner-border-sm" role="status">
                          <span className="visually-hidden">검색 중...</span>
                        </div>
                      ) : (
                        <i className="fas fa-search text-muted"></i>
                      )}
                    </div>
                  </div>
                  
                  {/* 검색 결과 드롭다운 */}
                  {searchResults.length > 0 && (
                    <div className="position-absolute w-100" style={{ zIndex: 1050 }}>
                      <div className="card mt-1 shadow-sm">
                        <div className="card-body p-0">
                          <div className="list-group list-group-flush">
                            {searchResults.slice(0, 5).map(member => (
                              <button
                                key={member.id}
                                type="button"
                                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                onClick={() => selectMember(member)}
                              >
                                <div>
                                  <div className="fw-bold">{member.name}</div>
                                  <small className="text-muted">{member.phone} | {member.email}</small>
                                </div>
                                <Badge bg="secondary">{member.gender === 'MALE' ? '남' : '여'}</Badge>
                              </button>
                            ))}
                            {searchResults.length > 5 && (
                              <div className="list-group-item text-center text-muted">
                                <small>더 많은 결과가 있습니다. 검색어를 더 구체적으로 입력해주세요.</small>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="col-md-3">
                  <Form.Select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    disabled={!selectedMember}
                  >
                    <option value="">관계 선택</option>
                    <option value="배우자">배우자</option>
                    <option value="아들">아들</option>
                    <option value="딸">딸</option>
                    <option value="부모">부모</option>
                    <option value="형제자매">형제자매</option>
                    <option value="기타">기타</option>
                  </Form.Select>
                </div>
                
                <div className="col-md-3">
                  <Button 
                    variant="primary" 
                    onClick={addFamilyMember}
                    disabled={!selectedMember || !relationship}
                    className="w-100"
                  >
                    <i className="fas fa-user-plus me-2"></i>
                    유가족 등록
                  </Button>
                </div>
              </div>

              {/* 선택된 회원 정보 표시 */}
              {selectedMember && (
                <div className="alert alert-info d-flex align-items-center">
                  <div className="me-3" style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="fas fa-user text-white"></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-bold">{selectedMember.name}</div>
                    <small>{selectedMember.phone} | {selectedMember.email}</small>
                  </div>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => {
                      setSelectedMember(null);
                      setSearchKeyword('');
                    }}
                  >
                    <i className="fas fa-times"></i>
                  </Button>
                </div>
              )}
            </div>
          </div>

          <hr />

          <div className="row">
            <div className="col-12">
              <h6 className="mb-3">
                <i className="fas fa-list me-2"></i>
                등록된 유가족 목록 ({familyMembers.length}명)
              </h6>
              
              {familyMembers.length === 0 ? (
                <div className="text-center p-4" style={{
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  border: '2px dashed #dee2e6'
                }}>
                  <i className="fas fa-users fa-2x text-muted mb-2"></i>
                  <p className="text-muted mb-0">등록된 유가족이 없습니다</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>이름</th>
                        <th>전화번호</th>
                        <th>이메일</th>
                        <th>관계</th>
                        <th width="100">관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {familyMembers.map(member => (
                        <tr key={member.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="me-2" style={{
                                width: '32px',
                                height: '32px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <i className="fas fa-user text-white" style={{ fontSize: '0.8rem' }}></i>
                              </div>
                              <span className="fw-bold">{member.name}</span>
                            </div>
                          </td>
                          <td>{member.phone}</td>
                          <td>{member.email || '-'}</td>
                          <td>
                            <Badge bg="info" className="px-2">
                              {member.relationship || '미지정'}
                            </Badge>
                          </td>
                          <td>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => removeFamilyMember(member.id)}
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFamilyModal(false)}>
            닫기
          </Button>
          <Button variant="primary">
            <i className="fas fa-save me-2"></i>
            변경사항 저장
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Menu4;
