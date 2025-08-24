import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Modal, Form, Badge, Dropdown, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

// This component will now have the design of Menu2.js but the functionality of the original Menu4.js.
const Menu4 = () => {
  const navigate = useNavigate();
  const { user, userType, isAuthenticated } = useAuth();
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
    console.log('🔍 Menu4 권한 확인 시작...');
    console.log('🔍 현재 인증 상태:', { isAuthenticated, user, userType });
    
    // 로딩이 완료되지 않았으면 대기
    if (!user && !isAuthenticated) {
      console.log('🔄 인증 정보 로딩 중...');
      return;
    }
    
    // 인증되지 않은 사용자는 로그인 페이지로
    if (!isAuthenticated || !user) {
      console.error('❌ 인증되지 않은 사용자입니다.');
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    // 관리자 권한 확인 - Login.js처럼 user.userType을 우선적으로 확인
    const currentUserType = user.userType || userType;
    console.log('🔍 사용자 타입 최종 확인:', { 
      finalUserType: currentUserType,
      fromUserObject: user.userType, 
      fromContext: userType,
      user: user 
    });
    
    if (currentUserType !== 'employee') {
      console.error('❌ 관리자 권한이 필요합니다. 현재 사용자 타입:', currentUserType);
      alert('관리자만 접근할 수 있는 페이지입니다.');
      // Login.js처럼 직원이 아니면 로비로, 로그인 안 됐으면 로그인으로
      navigate('/lobby');
      return;
    }
    
    console.log('✅ 관리자 권한 확인 완료. 페이지 로딩 시작...');
    setAnimateCard(true);
    const fetchMemorials = async () => {
      try {
        console.log('🔗 백엔드 API 호출 시작 - URL:', process.env.REACT_APP_API_URL || 'http://localhost:8088');
        console.log('👤 현재 사용자:', user?.name || 'Unknown', '/ 타입:', userType);
        const response = await apiService.getMemorials();
        console.log('✅ 백엔드 API 응답 성공:', response);
        console.log('✅ response._embedded:', response._embedded);
        console.log('✅ response._embedded.memorials:', response._embedded.memorials);
        
        if (response._embedded && response._embedded.memorials) {
          const memorialsList = response._embedded.memorials.map(memorial => {
            // API 명세에 따라 UUID 형태의 ID 추출
            let memorialId = memorial.id;
            
            console.log(`🔍 처리 중인 추모관:`, memorial.name, `/ 원본 ID:`, memorial.id);
            
            // _links.self.href에서 UUID 추출 (예: "http://localhost:8085/memorials/1c337344-ad3c-4785-a5f8-0054698c3ebe")
            if (memorial._links && memorial._links.self && memorial._links.self.href) {
              const hrefParts = memorial._links.self.href.split('/');
              const uuidFromHref = hrefParts[hrefParts.length - 1];
              console.log(`🔗 href에서 추출한 ID:`, uuidFromHref);
              if (uuidFromHref && uuidFromHref.includes('-')) {
                memorialId = uuidFromHref;
                console.log(`✅ UUID 형식 ID로 변경:`, memorialId);
              }
            }
            
            // UUID 형식 검증
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(memorialId)) {
              console.warn(`⚠️ UUID 형식이 아닌 ID 발견:`, memorialId, `추모관:`, memorial.name);
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
                  tribute: detailData.tribute || null, 

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
  }, [user, userType, isAuthenticated, navigate]);

  // All handler functions from the original Menu4.js
  

  const openFamilyModal = async (memorial) => {
    setSelectedMemorial(memorial);
    console.log(`🔍 유가족 조회 시작 - 추모관 ID: ${memorial.id}, 검색 방식: 추모관 기본 조회 API`);
    
    // Memorial ID 유효성 검사
    if (!memorial.id) {
      console.error('❌ Memorial ID가 없습니다');
      alert('추모관 ID가 유효하지 않습니다.');
      return;
    }
    
    // UUID 형식 검사
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(memorial.id)) {
      console.error(`❌ 잘못된 UUID 형식: ${memorial.id}`);
      alert('추모관 ID 형식이 올바르지 않습니다.');
      return;
    }
    
    try {
      // 추모관 기본 조회 API에서 familyList 가져오기
      const memorialResponse = await apiService.getMemorial(memorial.id);
      
      if (memorialResponse.familyList && Array.isArray(memorialResponse.familyList)) {
        console.log(`✅ 유가족 조회 성공 - ${memorialResponse.familyList.length}명`);
        
        // familyList는 유가족 ID 배열이므로, 각 ID로 유가족 상세 정보 조회
        if (memorialResponse.familyList.length > 0) {
          const familyDetailsPromises = memorialResponse.familyList.map(familyId => 
            apiService.getFamilyById(familyId)
          );
          
          try {
            const familyDetails = await Promise.all(familyDetailsPromises);
            setFamilyMembers(familyDetails);
            console.log(`✅ 유가족 상세 정보 조회 성공 - ${familyDetails.length}명`);
          } catch (detailError) {
            console.error("❌ 유가족 상세 정보 조회 실패:", detailError);
            // ID만 있는 경우라도 모달은 표시
            const familyWithIds = memorialResponse.familyList.map(id => ({ id, name: `유가족 ${id}` }));
            setFamilyMembers(familyWithIds);
          }
        } else {
          setFamilyMembers([]);
        }
      } else {
        console.log('ℹ️ 등록된 유가족이 없습니다');
        setFamilyMembers([]);
      }
    } catch (error) {
      console.error("❌ 추모관 조회 에러:", error);
      alert("유가족 조회에 실패했습니다. 네트워크 연결을 확인해주세요.");
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
        console.warn("⚠️ 백엔드 API 검색 실패, 프론트엔드 검색으로 폴백 시도");
        try {
          // 프론트엔드 검색으로 폴백
          let fallbackResults = [];
          switch (searchType) {
            case 'name':
              fallbackResults = await apiService.searchFamiliesByNameFrontend(keyword.trim());
              break;
            case 'email':
              const emailResult = await apiService.searchFamiliesByEmailFrontend(keyword.trim());
              fallbackResults = emailResult ? [emailResult] : [];
              break;
            case 'phone':
              fallbackResults = await apiService.searchFamiliesByPhoneFrontend(keyword.trim());
              break;
          }
          
          const processedFallback = fallbackResults.map(family => {
            const id = (family._links?.self?.href)?.split('/').pop() || family.id;
            return { ...family, id };
          }).filter(family => family.id);
          
          console.log(`✅ 프론트엔드 검색으로 복구 성공 - 결과: ${processedFallback.length}개`);
          setSearchResults(processedFallback);
        } catch (fallbackError) {
          console.error("❌ 프론트엔드 검색도 실패:", fallbackError);
          alert("검색에 실패했습니다. 네트워크 연결을 확인해주세요.");
          setSearchResults([]);
        }
      } else {
        alert("검색에 실패했습니다. 네트워크 연결을 확인해주세요.");
        setSearchResults([]);
      }
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
    // 검색 결과를 유지하여 다른 유가족도 선택할 수 있도록 함
    // setSearchResults([]);
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
        console.log(`➕ 유가족 등록 시작 - 유가족 ID: ${selectedMember.id}, 추모관 ID: ${selectedMemorial.id}`);
        
        // 유가족 approve API 호출 (백엔드에서 자동으로 familyList에 추가됨)
        await apiService.approveFamily(selectedMember.id, { memorialId: selectedMemorial.id });
        console.log(`✅ 유가족 approve 완료 (백엔드에서 familyList 자동 추가됨)`);
        
        // UI 갱신을 위해 새로운 방식으로 유가족 목록 조회
        const updatedMemorialResponse = await apiService.getMemorial(selectedMemorial.id);
        if (updatedMemorialResponse.familyList && Array.isArray(updatedMemorialResponse.familyList)) {
          if (updatedMemorialResponse.familyList.length > 0) {
            const familyDetailsPromises = updatedMemorialResponse.familyList.map(familyId => 
              apiService.getFamilyById(familyId)
            );
            
            try {
              const familyDetails = await Promise.all(familyDetailsPromises);
              setFamilyMembers(familyDetails);
              console.log(`✅ 유가족 목록 갱신 완료 - ${familyDetails.length}명`);
            } catch (detailError) {
              console.error("❌ 유가족 상세 정보 조회 실패:", detailError);
              setFamilyMembers([]);
            }
          } else {
            setFamilyMembers([]);
          }
        } else {
          setFamilyMembers([]);
        }
        
        setSelectedMember(null);
        // 검색어와 결과는 유지하여 추가 등록이 용이하도록 함
        // setSearchKeyword('');
        // setSearchResults([]);
        alert('유가족이 등록되었습니다.');
      } catch (error) {
        console.error("❌ 유가족 등록 에러:", error);
        alert("유가족 등록에 실패했습니다.");
      }
    } else {
      alert('유가족을 선택해주세요.');
    }
  };

  const removeFamilyMember = async (familyToRemove) => {
    try {
      const familyId = familyToRemove._links?.self?.href?.split('/').pop() || familyToRemove.id;
      console.log(`🗑️ 유가족 삭제 시작 - 유가족 ID: ${familyId}, 추모관 ID: ${selectedMemorial.id}`);
      
      // 추모관의 familyList에서 해당 유가족 ID 제거 (유가족 테이블은 그대로 유지)
      const memorialResponse = await apiService.getMemorial(selectedMemorial.id);
      if (memorialResponse.familyList && Array.isArray(memorialResponse.familyList)) {
        // familyList에서 해당 familyId 모두 제거 (중복된 ID도 처리)
        const updatedFamilyList = memorialResponse.familyList.filter(id => id !== parseInt(familyId));
        console.log(`🔄 familyList 업데이트: [${memorialResponse.familyList}] → [${updatedFamilyList}]`);
        
        // 추모관의 familyList 업데이트
        await apiService.updateMemorial(selectedMemorial.id, { familyList: updatedFamilyList });
        console.log(`✅ 추모관 familyList 업데이트 완료`);
        
        // 유가족의 memorialId를 null로 설정 (선택사항 - 필요에 따라 제거 가능)
        // await apiService.updateFamilyMemorialId(familyId, null);
        // console.log(`✅ 유가족 memorialId null 설정 완료`);
      } else {
        console.warn('⚠️ 추모관에 familyList가 없습니다');
      }
      
      // UI 갱신을 위해 새로운 방식으로 유가족 목록 조회
      const updatedMemorialResponse = await apiService.getMemorial(selectedMemorial.id);
      if (updatedMemorialResponse.familyList && Array.isArray(updatedMemorialResponse.familyList)) {
        if (updatedMemorialResponse.familyList.length > 0) {
          const familyDetailsPromises = updatedMemorialResponse.familyList.map(familyId => 
            apiService.getFamilyById(familyId)
          );
          
          try {
            const familyDetails = await Promise.all(familyDetailsPromises);
            setFamilyMembers(familyDetails);
            console.log(`✅ 유가족 목록 갱신 완료 - ${familyDetails.length}명`);
          } catch (detailError) {
            console.error("❌ 유가족 상세 정보 조회 실패:", detailError);
            setFamilyMembers([]);
          }
        } else {
          setFamilyMembers([]);
        }
      } else {
        setFamilyMembers([]);
      }
      
      alert('유가족이 삭제되었습니다.');
    } catch (error) {
      console.error("❌ 유가족 삭제 에러:", error);
      alert("유가족 삭제에 실패했습니다.");
    }
  };

  const handleCardClick = (memorial) => {
    const memorialId = memorial?.id;
    if (!memorialId) {
      console.error('❌ Memorial ID가 undefined입니다!');
      alert('추모관 ID가 유효하지 않습니다.');
      return;
    }
    
    // UUID 형식 검사
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(memorialId)) {
      console.error(`❌ 잘못된 UUID 형식: ${memorialId}`);
      alert('추모관 ID 형식이 올바르지 않습니다.');
      return;
    }
    
    console.log(`🔗 추모관 상세보기로 이동: /memorial/${memorialId}`);
    navigate(`/memorial/${memorialId}`);
  };

  const deleteMemorial = async (id) => {
    if (window.confirm('정말로 이 추모관을 삭제하시겠습니까?')) {
      try {
        console.log(`🗑️ 추모관 삭제 시작 - ID: ${id}`);
        await apiService.deleteMemorial(id);
        console.log('✅ 추모관 삭제 완료');
        
        // 서버에서 최신 목록을 다시 불러오기
        const response = await apiService.getMemorials();
        if (response._embedded && response._embedded.memorials) {
          const memorialsList = response._embedded.memorials;
          
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
                  tribute: detailData.tribute || null, 
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
          
          setMemorials(memorialsWithStatus);
          console.log(`✅ 추모관 목록 갱신 완료 - ${memorialsWithStatus.length}개`);
        } else {
          setMemorials([]);
        }
        
        alert('추모관이 삭제되었습니다.');
      } catch (error) {
        console.error("❌ 추모관 삭제 에러:", error);
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
                                <div>{memorial.birthOfDate || memorial.birthDate}</div>
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
                          <div style={{ flex: 1, marginRight: '10px' }}>
                            <small className="text-muted" style={{ fontSize: '0.75rem' }}>추모관 고유번호</small>
                            <div 
                              className="fw-bold" 
                              style={{ 
                                color: '#b8860b', 
                                fontSize: '0.75rem',
                                letterSpacing: '0.3px',
                                cursor: 'pointer',
                                wordBreak: 'break-all',
                                lineHeight: '1.2',
                                padding: '2px 4px',
                                borderRadius: '4px',
                                backgroundColor: 'rgba(184, 134, 11, 0.1)',
                                border: '1px dashed rgba(184, 134, 11, 0.3)',
                                transition: 'all 0.2s ease'
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(memorial.id);
                                // 복사 완료 표시
                                const element = e.target;
                                const originalText = element.textContent;
                                element.textContent = '복사완료!';
                                element.style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
                                element.style.borderColor = 'rgba(40, 167, 69, 0.3)';
                                element.style.color = '#28a745';
                                setTimeout(() => {
                                  element.textContent = originalText;
                                  element.style.backgroundColor = 'rgba(184, 134, 11, 0.1)';
                                  element.style.borderColor = 'rgba(184, 134, 11, 0.3)';
                                  element.style.color = '#b8860b';
                                }, 1500);
                              }}
                              title="클릭하여 복사"
                            >
                              {memorial.id}
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
        <Modal.Header 
          closeButton 
          style={{
            background: 'linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%)',
            borderBottom: '2px solid rgba(184, 134, 11, 0.2)'
          }}
        >
          <Modal.Title style={{ color: '#2C1F14', fontWeight: '700' }}>
            <i className="fas fa-users me-2" style={{ color: '#b8860b' }}></i> 
            유가족 관리 - {selectedMemorial?.name}
            <br />
            <small className="text-muted" style={{ fontSize: '0.8rem', fontWeight: '400' }}>
              <i className="fas fa-id-card me-1"></i>
              추모관 고유번호: {selectedMemorial?.id}
            </small>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{
          background: 'linear-gradient(135deg, rgba(247, 243, 233, 0.3) 0%, rgba(232, 226, 213, 0.3) 100%)',
          padding: '24px'
        }}>
          <div className="row mb-4">
            <div className="col-12">
              <div 
                className="search-section p-4 mb-4" 
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '16px',
                  border: '1px solid rgba(184, 134, 11, 0.2)',
                  boxShadow: '0 4px 15px rgba(44, 31, 20, 0.1)'
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0" style={{ color: '#2C1F14', fontWeight: '600' }}>
                    <i className="fas fa-search me-2" style={{ color: '#b8860b' }}></i> 
                    회원 검색 및 유가족 등록
                  </h6>
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
                  <h6 className="mb-3" style={{ color: '#2C1F14', fontWeight: '600' }}>
                    <i className="fas fa-list me-2" style={{ color: '#b8860b' }}></i> 
                    검색 결과 ({searchResults.length}명)
                  </h6>
                  <div className="card" style={{ 
                    border: '1px solid rgba(184, 134, 11, 0.3)',
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}>
                    <div className="card-body p-0">
                      <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        <table className="table table-hover mb-0">
                          <thead className="sticky-top" style={{ 
                            background: 'linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%)',
                            color: '#2C1F14'
                          }}>
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
                                  <Badge bg="success">
                                    <i className="fas fa-check me-1"></i>활성
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
          </div>
          <hr style={{ border: '1px solid rgba(184, 134, 11, 0.2)', margin: '24px 0' }} />
          <div className="row">
            <div className="col-12">
              <div 
                className="family-list-section p-4" 
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '16px',
                  border: '1px solid rgba(184, 134, 11, 0.2)',
                  boxShadow: '0 4px 15px rgba(44, 31, 20, 0.1)'
                }}
              >
                <h6 className="mb-3" style={{ color: '#2C1F14', fontWeight: '600' }}>
                  <i className="fas fa-list me-2" style={{ color: '#b8860b' }}></i> 
                  등록된 유가족 목록 ({familyMembers.length}명)
                </h6>
              {familyMembers.length === 0 ? (
                <div className="text-center p-4" style={{ background: '#f8f9fa', borderRadius: '8px', border: '2px dashed #dee2e6' }}>
                  <p className="text-muted mb-0">등록된 유가족이 없습니다</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead style={{ 
                      background: 'linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%)',
                      color: '#2C1F14'
                    }}>
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
                              <Badge bg="success">
                                <i className="fas fa-check me-1"></i>활성
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
          </div>
        </Modal.Body>
        <Modal.Footer style={{
          background: 'linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%)',
          borderTop: '2px solid rgba(184, 134, 11, 0.2)'
        }}>
          <Button 
            variant="secondary" 
            onClick={() => setShowFamilyModal(false)}
            style={{
              borderRadius: '8px',
              padding: '8px 16px',
              fontWeight: '500'
            }}
          >
            <i className="fas fa-times me-2"></i>닫기
          </Button>
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
