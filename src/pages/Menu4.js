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
  const [searchType, setSearchType] = useState('name'); // 'name', 'email', 'phone'
  
  const [animateCard, setAnimateCard] = useState(false);

  useEffect(() => {
    setAnimateCard(true);
    const fetchMemorials = async () => {
      try {
        console.log('🔗 백엔드 API 호출 시작 - URL:', process.env.REACT_APP_API_URL || 'http://localhost:8088');
        const response = await apiService.getMemorials();
        console.log('✅ 백엔드 API 응답 성공:', response);
        console.log('✅ response._embedded:', response._embedded);
        console.log('✅ response._embedded.memorials:', response._embedded.memorials);
        
        if (response._embedded && response._embedded.memorials) {
          const memorialsList = response._embedded.memorials.map(memorial => {
            // API 명세에 따라 UUID 형태의 ID 추출
            let memorialId = memorial.id;
            
            // _links.self.href에서 UUID 추출 (예: "http://localhost:8085/memorials/1c337344-ad3c-4785-a5f8-0054698c3ebe")
            if (memorial._links && memorial._links.self && memorial._links.self.href) {
              const hrefParts = memorial._links.self.href.split('/');
              const uuidFromHref = hrefParts[hrefParts.length - 1];
              if (uuidFromHref && uuidFromHref.includes('-')) {
                memorialId = uuidFromHref;
              }
            }
            
            return {
              ...memorial,
              id: memorialId // UUID 형태의 ID로 설정
            };
          });
          
          // 각 추모관에 대해 영상 및 추모사 상태를 API로 확인
          const memorialsWithStatus = await Promise.all(
            memorialsList.map(async (memorial) => {
              try {
                const detailData = await apiService.getMemorialDetails(memorial.id);
                
                // 상세 정보(detailData)를 기존 memorial 정보와 합칩니다.
                return {
                  ...memorial,
                  ...detailData,
                  hasVideo: detailData.videos && detailData.videos.length > 0,
                };
              } catch (error) {
                console.error(`❌ ${memorial.id} 상태 조회 실패:`, error);
                return {
                  ...memorial,
                  hasVideo: false,
                  tribute: null
                };
              }
            })
          );
          
          console.log('📋 추모관 리스트 길이:', memorialsWithStatus.length);
          console.log('📋 첫 번째 추모관 구조:', memorialsWithStatus[0]);
          console.log('📋 첫 번째 추모관 ID:', memorialsWithStatus[0]?.id);
          console.log('📋 첫 번째 추모관 키들:', Object.keys(memorialsWithStatus[0] || {}));
          
          setMemorials(memorialsWithStatus);
        } else {
          console.error('❌ 예상하지 못한 응답 구조:', response);
          setMemorials([]);
        }
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
    console.log(`[현재 모드: 백엔드 API 검색] 서버의 전용 검색 API를 사용합니다. (/families/search-name, /families/search-email, /families/search-phone)`);
    console.log(`🔍 유가족 조회 시작 - 추모관 ID: ${memorial.id}, 검색 방식: 백엔드 API`);
    
    try {
      // 해당 추모관에 등록된 유가족 목록 조회
      const familyResponse = await apiService.getFamiliesByMemorialId(memorial.id);
      if (familyResponse._embedded && familyResponse._embedded.families) {
        console.log(`✅ 유가족 조회 성공 - ${familyResponse._embedded.families.length}명`);
        setFamilyMembers(familyResponse._embedded.families);
      } else {
        console.log('ℹ️ 등록된 유가족이 없습니다');
        setFamilyMembers([]);
      }
    } catch (error) {
      console.error("❌ 유가족 조회 에러:", error);
      
      if (error.response?.status >= 400) {
        alert("백엔드 유가족 조회가 실패했습니다.\n\n현재 백엔드에는 findByMemorialId API가 구현되지 않았을 수 있습니다.");
      }
      
      setFamilyMembers([]);
    }
    setSearchKeyword('');
    setSearchResults([]);
    setSelectedMember(null);
    setSearchType('name');
    setShowFamilyModal(true);
  };

  const searchMembers = async (keyword) => {
    if (!keyword.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    console.log(`🔍 검색 시작 - 방식: 백엔드 API 검색, 타입: ${searchType}, 키워드: ${keyword}`);
    
    try {
      let rawResults = [];
      
      switch (searchType) {
        case 'name':
          const nameResponse = await apiService.searchFamiliesByName(keyword.trim());
          if (Array.isArray(nameResponse)) {
            rawResults = nameResponse;
          } else if (nameResponse._embedded && nameResponse._embedded.families) {
            rawResults = nameResponse._embedded.families;
          }
          break;
        case 'email':
          const emailResponse = await apiService.searchFamiliesByEmail(keyword.trim());
          if (emailResponse && !emailResponse._embedded) {
            rawResults = [emailResponse];
          } else if (emailResponse._embedded && emailResponse._embedded.families) {
            rawResults = emailResponse._embedded.families;
          }
          break;
        case 'phone':
          const phoneResponse = await apiService.searchFamiliesByPhone(keyword.trim());
          if (Array.isArray(phoneResponse)) {
            rawResults = phoneResponse;
          } else if (phoneResponse._embedded && phoneResponse._embedded.families) {
            rawResults = phoneResponse._embedded.families;
          }
          break;
        default:
          rawResults = [];
      }
      
      // [수정] 데이터 정규화: API 응답 형식이 다르더라도 일관된 'id' 속성을 갖도록 보장합니다.
      const processedResults = rawResults.map(family => {
        const id = (family._links?.self?.href)?.split('/').pop() || family.id;
        return { ...family, id };
      }).filter(family => family.id); // id가 없는 데이터는 필터링

      // [수정] 정규화된 'id'를 사용하여 중복을 제거합니다.
      const uniqueResults = processedResults.filter((family, index, self) => 
        index === self.findIndex(f => f.id === family.id)
      );
      
      console.log(`✅ 검색 완료 - 결과: ${uniqueResults.length}개`);
      setSearchResults(uniqueResults);
    } catch (error) {
      console.error("❌ 검색 에러:", error);
      
      if (error.response?.status >= 400) {
        alert("백엔드 API 검색이 실패했습니다.\n\n현재 백엔드에는 다음 API가 구현되지 않았을 수 있습니다:\n- /families/search-name\n- /families/search-email\n- /families/search-phone");
      }
      
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchKeyword.trim()) {
      searchMembers(searchKeyword);
    }
  };

  const selectMember = (family) => {
    // family 객체에는 이미 정규화된 id가 있으므로 바로 사용
    setSelectedMember(family);
    setSearchKeyword(family.name);
    setSearchResults([]);
  };

  const addFamilyMember = async () => {
    if (selectedMember) {
      const isAlreadyRegistered = familyMembers.some(fm => {
        const familyId = fm._links?.self?.href?.split('/').pop() || fm.id;
        return familyId === selectedMember.id;
      });
      
      if (isAlreadyRegistered) {
        alert('이미 등록된 유가족입니다.');
        return;
      }

      try {
        await apiService.updateFamilyMemorialId(selectedMember.id, selectedMemorial.id);
        
        const familyResponse = await apiService.getFamiliesByMemorialId(selectedMemorial.id);
        if (familyResponse._embedded && familyResponse._embedded.families) {
          setFamilyMembers(familyResponse._embedded.families);
        }
        
        setSelectedMember(null);
        setSearchKeyword('');
        setSearchResults([]);
        alert('유가족이 등록되었습니다.');
      } catch (error) {
        console.error("Error adding family member:", error);
        alert("유가족 등록에 실패했습니다.");
      }
    } else {
      alert('유가족을 선택해주세요.');
    }
  };

  const removeFamilyMember = async (familyToRemove) => {
    try {
      const familyId = familyToRemove._links?.self?.href?.split('/').pop() || familyToRemove.id;
      await apiService.updateFamilyMemorialId(familyId, null);
      
      const familyResponse = await apiService.getFamiliesByMemorialId(selectedMemorial.id);
      if (familyResponse._embedded && familyResponse._embedded.families) {
        setFamilyMembers(familyResponse._embedded.families);
      } else {
        setFamilyMembers([]);
      }
      
      alert('유가족이 삭제되었습니다.');
    } catch (error) {
      console.error("Error removing family member:", error);
      alert("유가족 삭제에 실패했습니다.");
    }
  };

  const handleCardClick = (memorial) => {
    const memorialId = memorial?.id;
    if (!memorialId) {
      console.error('❌ Memorial ID가 undefined입니다!');
      return;
    }
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
        background: 'url("data:image/svg+xml,%3Csvg width="80" height="80" viewBox="0 0 80" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23B8860B" fill-opacity="0.12"%3E%3Cpath d="M40 40L20 20v40h40V20L40 40zm0-20L60 0H20l20 20zm0 20L20 60h40L40 40z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
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
        flexDirection: 'column',
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
                    onClick={() => handleCardClick(memorial)}
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
                        <Badge bg={memorial.hasVideo ? 'success' : 'danger'} className="px-2 py-1 me-1">
                          <i className={`fas ${memorial.hasVideo ? 'fa-check' : 'fa-times'} me-1`}></i> AI 영상
                        </Badge>
                        <Badge bg={memorial.tribute ? 'success' : 'danger'} className="px-2 py-1">
                          <i className={`fas ${memorial.tribute ? 'fa-check' : 'fa-times'} me-1`}></i> 추모사
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
        <Modal.Header closeButton>
          <Modal.Title><i className="fas fa-users me-2"></i> 유가족 관리 - {selectedMemorial?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0"><i className="fas fa-search me-2"></i> 회원 검색 및 유가족 등록</h6>
              </div>
              
              <div className="row g-3 mb-3">
                <div className="col-md-3">
                  <Form.Select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                    <option value="name">이름으로 검색</option>
                    <option value="email">이메일로 검색</option>
                    <option value="phone">전화번호로 검색</option>
                  </Form.Select>
                </div>
                <div className="col-md-6">
                  <div className="d-flex">
                    <Form.Control 
                      type="text" 
                      placeholder={
                        searchType === 'name' ? '이름을 입력하세요...' :
                        searchType === 'email' ? '이메일을 입력하세요...' :
                        '전화번호를 입력하세요...'
                      }
                      value={searchKeyword} 
                      onChange={handleSearchChange}
                      onKeyPress={handleKeyPress}
                      className="me-2"
                    />
                    <Button 
                      variant="outline-primary" 
                      onClick={() => searchMembers(searchKeyword)}
                      disabled={isSearching || !searchKeyword.trim()}
                    >
                      {isSearching ? (
                        <div className="spinner-border spinner-border-sm" role="status">
                          <span className="visually-hidden">검색 중...</span>
                        </div>
                      ) : (
                        <i className="fas fa-search"></i>
                      )}
                    </Button>
                  </div>
                </div>
                <div className="col-md-3">
                  <Button variant="primary" onClick={addFamilyMember} disabled={!selectedMember} className="w-100">
                    <i className="fas fa-user-plus me-2"></i> 유가족 등록
                  </Button>
                </div>
              </div>
              
              {searchResults.length > 0 && (
                <div className="mb-4">
                  <h6 className="mb-3"><i className="fas fa-list me-2"></i> 검색 결과 ({searchResults.length}명)</h6>
                  <div className="card">
                    <div className="card-body p-0">
                      <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        <table className="table table-hover mb-0">
                          <thead className="table-light sticky-top">
                            <tr>
                              <th>이름</th>
                              <th>전화번호</th>
                              <th>이메일</th>
                              <th>상태</th>
                              <th width="100">선택</th>
                            </tr>
                          </thead>
                          <tbody>
                            {searchResults.map(family => (
                              // 정규화된 family.id를 key로 사용합니다.
                              <tr key={family.id} className={selectedMember?.id === family.id ? 'table-primary' : ''}>
                                <td>{family.name}</td>
                                <td>{family.phone}</td>
                                <td>{family.email}</td>
                                <td>
                                  <Badge bg={family.status === 'APPROVED' ? 'success' : 'warning'}>
                                    {family.status === 'APPROVED' ? '승인됨' : '대기중'}
                                  </Badge>
                                </td>
                                <td>
                                  <Button 
                                    size="sm" 
                                    variant={selectedMember?.id === family.id ? 'success' : 'outline-primary'}
                                    onClick={() => selectMember(family)}
                                  >
                                    {selectedMember?.id === family.id ? (
                                      <><i className="fas fa-check me-1"></i>선택됨</>
                                    ) : (
                                      '선택'
                                    )}
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {searchKeyword && searchResults.length === 0 && !isSearching && (
                <div className="alert alert-info">
                  <i className="fas fa-info-circle me-2"></i>
                  검색 결과가 없습니다. 다른 키워드로 검색해보세요.
                </div>
              )}
            </div>
          </div>
          <hr />
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
                        <th>상태</th>
                        <th width="100">관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {familyMembers.map(family => {
                        const familyId = family._links?.self?.href?.split('/').pop() || family.id;
                        return (
                          <tr key={familyId}>
                            <td>{family.name}</td>
                            <td>{family.phone}</td>
                            <td>{family.email || '-'}</td>
                            <td>
                              <Badge bg={family.status === 'APPROVED' ? 'success' : 'warning'}>
                                {family.status === 'APPROVED' ? '승인됨' : '대기중'}
                              </Badge>
                            </td>
                            <td>
                              <Button size="sm" variant="outline-danger" onClick={() => removeFamilyMember(family)}>
                                <i className="fas fa-trash"></i>
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
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

        .table-responsive {
          border-radius: 8px;
        }
        
        .table-responsive::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .table-responsive::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        
        .table-responsive::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        
        .table-responsive::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
        
        .table-hover tbody tr:hover {
          background-color: rgba(184, 134, 11, 0.1);
        }
        
        .sticky-top {
          position: sticky;
          top: 0;
          z-index: 10;
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
