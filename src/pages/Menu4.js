import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Modal, Form, Badge, Dropdown, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

// This component will now have the design of Menu2.js but the functionality of the original Menu4.js.
const Menu4 = () => {
  const navigate = useNavigate();
  const [memorials, setMemorials] = useState([]);
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [selectedMemorial, setSelectedMemorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [relationship, setRelationship] = useState('');
  
  const [animateCard, setAnimateCard] = useState(false);

  useEffect(() => {
    setAnimateCard(true);
    const fetchMemorials = async () => {
      try {
        console.log('🔗 백엔드 API 호출 시작 - URL:', process.env.REACT_APP_API_URL || 'http://localhost:8088');
        const response = await apiService.getMemorials();
        console.log('✅ 백엔드 API 응답 성공:', response);
        const memorialsWithCode = response._embedded.memorials.map(m => ({
          ...m,
          joinCode: `MEM${String(m.id).padStart(3, '0')}`
        }));
        setMemorials(response._embedded.memorials);
        console.log('📋 추모관 데이터 설정 완료:', response._embedded.memorials);
      } catch (error) {
        console.error("❌ 백엔드 API 호출 실패:", error);
        console.error("에러 상세:", error.response?.data, error.response?.status);
        alert("추모관 정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMemorials();
  }, []);

  // All handler functions from the original Menu4.js
  

  const openFamilyModal = async (memorial) => {
    setSelectedMemorial(memorial);
    try {
      // NOTE: API 명세에 유가족 목록 조회는 없어서 임시로 familyList를 사용합니다.
      // 추후 해당 API가 추가되면 수정해야 합니다.
      if (memorial.familyList) {
        setFamilyMembers(memorial.familyList);
      }
    } catch (error) {
      console.error("Error fetching family members:", error);
      alert("유가족 정보를 불러오는 데 실패했습니다.");
    }
    setSearchKeyword('');
    setSearchResults([]);
    setSelectedMember(null);
    setRelationship('');
    setShowFamilyModal(true);
  };

  const searchMembers = async (keyword) => {
    if (!keyword.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const response = await apiService.getUsers();
      const allUsers = response.data._embedded.users; // 실제 데이터 구조에 따라 변경 필요
      const results = allUsers.filter(user =>
        user.name.toLowerCase().includes(keyword.toLowerCase()) ||
        user.phone.includes(keyword) ||
        user.email.toLowerCase().includes(keyword.toLowerCase())
      );
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching members:", error);
      alert("회원 검색에 실패했습니다.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);
    searchMembers(keyword);
  };

  const selectMember = (member) => {
    setSelectedMember(member);
    setSearchKeyword(member.name);
    setSearchResults([]);
  };

  const addFamilyMember = async () => {
    if (selectedMember && relationship) {
      const isAlreadyRegistered = familyMembers.some(fm => fm.memberId === selectedMember.id);
      if (isAlreadyRegistered) {
        alert('이미 등록된 회원입니다.');
        return;
      }
      const newFamilyMember = {
        // API 명세에 따라 필요한 정보 추가
        memberId: selectedMember.id,
        name: selectedMember.name,
        relationship: relationship
      };

      const updatedFamilyList = [...familyMembers, newFamilyMember];

      try {
        await apiService.updateMemorial(selectedMemorial.id, { familyList: updatedFamilyList });
        setFamilyMembers(updatedFamilyList);
        setSelectedMember(null);
        setSearchKeyword('');
        setRelationship('');
        alert('유가족이 등록되었습니다.');
      } catch (error) {
        console.error("Error adding family member:", error);
        alert("유가족 등록에 실패했습니다.");
      }
    }
  };

  const removeFamilyMember = async (memberIdToRemove) => {
    const updatedFamilyList = familyMembers.filter(member => member.memberId !== memberIdToRemove);
    try {
      await apiService.updateMemorial(selectedMemorial.id, { familyList: updatedFamilyList });
      setFamilyMembers(updatedFamilyList);
      alert('유가족이 삭제되었습니다.');
    } catch (error) {
      console.error("Error removing family member:", error);
      alert("유가족 삭제에 실패했습니다.");
    }
  };

  const handleCardClick = (memorialId) => {
    navigate(`/memorial/${memorialId}`);
  };

  

  const deleteMemorial = async (id) => {
    if (window.confirm('정말로 이 추모관을 삭제하시겠습니까?')) {
      try {
        await apiService.deleteMemorial(id);
        setMemorials(memorials.filter(memorial => memorial.id !== id));
        alert('추모관이 삭제되었습니다.');
      } catch (error) {
        console.error("Error deleting memorial:", error);
        alert('추모관 삭제에 실패했습니다.');
      }
    }
  };

  // The main return statement uses the structure and styling from Menu2.js
  return (
    <div className="page-wrapper" style={{
      '--navbar-height': '62px',
      height: 'calc(100vh - var(--navbar-height))',
      background: 'linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>

      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23B8860B" fill-opacity="0.12"%3E%3Cpath d="M40 40L20 20v40h40V20L40 40zm0-20L60 0H20l20 20zm0 20L20 60h40L40 40z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
        opacity: 0.7
      }}></div>

      <div className={`dashboard-container ${animateCard ? 'animate-in' : ''}`} style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '1600px',
        height: '100%',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column', // Changed to column for Menu4 layout
        boxSizing: 'border-box',
        background: 'rgba(255, 251, 235, 0.95)',
        boxShadow: '0 20px 60px rgba(44, 31, 20, 0.4)',
        backdropFilter: 'blur(15px)',
        padding: '24px',
        borderRadius: '28px',
        border: '2px solid rgba(184, 134, 11, 0.35)',
        gap: '20px',
        overflow: 'hidden'
      }}>
        <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-3" style={{ 
                fontSize: '30px', 
                fontWeight: '700', 
                color: '#2C1F14',
                paddingLeft: '10px' 
            }}>
                디지털 추모관
            </h4>
        </div>

        {/* Main Content Area */}
        <div className="dashboard-main-content" style={{
          flex: '1',
          overflowY: 'auto',
          overflowX: 'hidden',
          height: '100%',
          padding: '10px',
          background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.12) 0%, rgba(205, 133, 63, 0.08) 100%)',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(44, 31, 20, 0.12)',
          border: '1px solid rgba(184, 134, 11, 0.2)'
        }}>
          {loading ? (
             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
              <Spinner animation="border" role="status" className="me-2" />
              <span>추모관 목록을 불러오는 중...</span>
            </div>
          ) : memorials.length === 0 ? (
            <div className="text-center p-5">
              <i className="fas fa-heart fa-3x mb-3" style={{color: '#b8860b'}}></i>
              <h5 style={{ color: '#2C1F14', fontWeight: '600' }}>등록된 추모관이 없습니다</h5>
              <p className="text-muted mb-4">소중한 분을 기리는 첫 번째 추모관을 만들어보세요.</p>
            </div>
          ) : (
            <Row>
              {memorials.map(memorial => (
                <Col key={memorial.id} lg={4} md={6} sm={12} className="mb-4">
                  <Card 
                    className="h-100 memorial-card" 
                    style={{ 
                      transition: 'all 0.3s ease', 
                      border: '1px solid rgba(184, 134, 11, 0.2)',
                      borderRadius: '16px',
                      backgroundColor: 'rgba(255, 255, 255, 0.7)',
                      boxShadow: '0 4px 15px rgba(44, 31, 20, 0.1)',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleCardClick(memorial.id)}
                  >
                    <div 
                      className="memorial-header"
                      style={{
                        height: '180px',
                        background: memorial.imageUrl 
                          ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${memorial.imageUrl})`
                          : 'linear-gradient(135deg, #b8860b, #965a25)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                        position: 'relative',
                        borderRadius: '16px 16px 0 0'
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
                      <div className="position-absolute top-0 end-0 m-2">
                        <Badge bg={memorial.videoUrl ? 'success' : 'danger'} className="px-2 py-1 me-1">
                          <i className={`fas ${memorial.videoUrl ? 'fa-check' : 'fa-times'} me-1`}></i> AI 영상
                        </Badge>
                        <Badge bg={memorial.eulogy ? 'success' : 'danger'} className="px-2 py-1">
                          <i className={`fas ${memorial.eulogy ? 'fa-check' : 'fa-times'} me-1`}></i> 추모사
                        </Badge>
                      </div>
                    </div>

                    <Card.Body className="d-flex flex-column p-3">
                      <div className="memorial-info mb-3">
                         <Row className="mb-2 g-2">
                            <Col xs={6}>
                                <small className="text-muted"><i className="fas fa-birthday-cake me-1"></i> 생년월일</small>
                                <div>{memorial.birthOfDate}</div>
                            </Col>
                            <Col xs={6}>
                                <small className="text-muted"><i className="fas fa-cross me-1"></i> 별세일</small>
                                <div>{memorial.deceasedDate}</div>
                            </Col>
                         </Row>
                      </div>
                      <div className="mt-auto">
                        <hr className="my-2" />
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <small className="text-muted" style={{ fontSize: '0.8rem' }}>참여코드</small>
                            <div className="fw-bold" style={{ color: '#b8860b', letterSpacing: '0.5px' }}>
                              {memorial.joinCode}
                            </div>
                          </div>
                          <Dropdown align="end" onClick={(e) => e.stopPropagation()}>
                            <Dropdown.Toggle size="sm" variant="outline-secondary" style={{ borderRadius: '8px' }}>
                              <i className="fas fa-ellipsis-v"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={(e) => { e.stopPropagation(); openFamilyModal(memorial); }}>
                                <i className="fas fa-users me-2"></i> 유가족 관리
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item onClick={(e) => { e.stopPropagation(); deleteMemorial(memorial.id); }} className="text-danger">
                                <i className="fas fa-trash me-2"></i> 삭제
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
        </div>
      </div>

      

      <Modal show={showFamilyModal} onHide={() => setShowFamilyModal(false)} size="lg">
        {/* Family modal content remains the same as in original Menu4.js */}
        <Modal.Header closeButton>
          <Modal.Title><i className="fas fa-users me-2"></i> 유가족 관리 - {selectedMemorial?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Search and Add Section */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0"><i className="fas fa-search me-2"></i> 회원 검색 및 유가족 등록</h6>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <div className="position-relative">
                    <Form.Control type="text" placeholder="이름, 전화번호, 이메일로 검색..." value={searchKeyword} onChange={handleSearchChange} className="pe-5" />
                    <div className="position-absolute top-50 end-0 translate-middle-y pe-3">
                      {isSearching ? <div className="spinner-border spinner-border-sm" role="status"><span className="visually-hidden">검색 중...</span></div> : <i className="fas fa-search text-muted"></i>}
                    </div>
                  </div>
                  {searchResults.length > 0 && (
                    <div className="position-absolute w-100" style={{ zIndex: 1050 }}>
                      <div className="card mt-1 shadow-sm">
                        <div className="card-body p-0">
                          <div className="list-group list-group-flush">
                            {searchResults.slice(0, 5).map(member => (
                              <button key={member.id} type="button" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center" onClick={() => selectMember(member)}>
                                <div>
                                  <div className="fw-bold">{member.name}</div>
                                  <small className="text-muted">{member.phone} | {member.email}</small>
                                </div>
                                <Badge bg="secondary">{member.gender === 'MALE' ? '남' : '여'}</Badge>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="col-md-3">
                  <Form.Select value={relationship} onChange={(e) => setRelationship(e.target.value)} disabled={!selectedMember}>
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
                  <Button variant="primary" onClick={addFamilyMember} disabled={!selectedMember || !relationship} className="w-100">
                    <i className="fas fa-user-plus me-2"></i> 유가족 등록
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <hr />
          {/* Registered Family List */}
          <div className="row">
            <div className="col-12">
              <h6 className="mb-3"><i className="fas fa-list me-2"></i> 등록된 유가족 목록 ({familyMembers.length}명)</h6>
              {familyMembers.length === 0 ? (
                <div className="text-center p-4" style={{ background: '#f8f9fa', borderRadius: '8px', border: '2px dashed #dee2e6' }}>
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
                          <td>{member.name}</td>
                          <td>{member.phone}</td>
                          <td>{member.email || '-'}</td>
                          <td><Badge bg="info">{member.relationship || '미지정'}</Badge></td>
                          <td><Button size="sm" variant="outline-danger" onClick={() => removeFamilyMember(member.id)}><i className="fas fa-trash"></i></Button></td>
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
          <Button variant="secondary" onClick={() => setShowFamilyModal(false)}>닫기</Button>
        </Modal.Footer>
      </Modal>

      {/* Global styles from Menu2.js */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .dashboard-container {
            opacity: 0;
        }

        .animate-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .refresh-btn {
          padding: 12px 20px;
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          background: linear-gradient(135deg, #b8860b, #965a25);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(44, 31, 20, 0.2);
          transition: all 0.3s ease;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
        }

        .refresh-btn:hover {
          background: linear-gradient(135deg, #c9971c, #a86b36);
          box-shadow: 0 6px 20px rgba(44, 31, 20, 0.3);
          transform: translateY(-2px);
        }
        
        .refresh-btn:active {
          transform: translateY(0);
          box-shadow: 0 4px 15px rgba(44, 31, 20, 0.2);
        }

        .dashboard-main-content::-webkit-scrollbar {
          width: 6px;
        }
        .dashboard-main-content::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
        .dashboard-main-content::-webkit-scrollbar-thumb {
          background-color: rgba(184, 134, 11, 0.5);
          border-radius: 10px;
        }
        
        .memorial-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(44, 31, 20, 0.15);
        }

        @media (max-width: 1200px) {
          .page-wrapper {
            height: auto;
            min-height: calc(100vh - var(--navbar-height));
          }
          .dashboard-container {
            height: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default Menu4;