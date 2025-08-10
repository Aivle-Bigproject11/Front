import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Modal, Spinner } from 'react-bootstrap';
import { Mail, Send, Search } from 'lucide-react';
import { recommendationService } from '../services/api_menu3';
// [실제 백엔드 연동 시] axios가 설치되어 있는지 확인하세요. (npm install axios)
//import axios from 'axios';


// [테스트용] Mock 데이터
// const mockApiData = [
//     { customerId: 'SB2001', name: '김말똥', birthOfDate: '1950.01.01', age: 74, gender: '남', phone: '010-1234-5678', address: '서울시 강남구', job: '의사', isMarried: true, hasChildren: true, hasDisease: true },
//     { customerId: 'SB2002', name: '김진우', birthOfDate: '1990.01.01', age: 34, gender: '남', phone: '010-2345-6789', address: '경기도 김포시', job: '무직', isMarried: false, hasChildren: false, hasDisease: false },
//     { customerId: 'SB2003', name: '최개똥', birthOfDate: '2000.01.01', age: 24, gender: '남', phone: '010-3456-7890', address: '인천시 서구', job: '정비사', isMarried: false, hasChildren: false, hasDisease: false },
//     { customerId: 'SB2004', name: '이철수', birthOfDate: '1975.01.01', age: 49, gender: '남', phone: '010-4567-8901', address: '서울시 마포구', job: '개발자', isMarried: true, hasChildren: true, hasDisease: true },
//     { customerId: 'SB2005', name: '박영희', birthOfDate: '1982.05.10', age: 42, gender: '여', phone: '010-5678-9012', address: '경기도 성남시', job: '주부', isMarried: true, hasChildren: false, hasDisease: false },
// ];

// [테스트용] 특정 고객(김말똥)의 발송 기록 Mock 데이터
// const mockHistoryData = [
//     {
//         messageId: 101,
//         createMessageDate: '2025.07.20',
//         recommendedServices: [
//             { serviceName: '결혼 서비스', imageUrl: 'https://placehold.co/600x400/FFF4E0/333?text=Wedding+Service', detailedUrl: 'http://example.com/wedding' },
//             { serviceName: '여행 서비스', imageUrl: 'https://placehold.co/600x400/D4EFFF/333?text=Travel+Service', detailedUrl: 'http://example.com/travel' }
//         ],
//         messageContent: `[○○상조] 김말똥님, 요즘 자녀가 결혼할 시기시죠? 
// 아니면 은퇴 후 여행 생각 있으신가요? OO상조에서 맞춤 패키지를 추천드립니다!
// [🔍 상품 자세히 보기]`,
//     }
// ];


const Menu3 = () => {
    // === 상태 관리 ===
    //onst [allCustomers, setAllCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [animateCard, setAnimateCard] = useState(false);
    const [isSearched, setIsSearched] = useState(false); // 조회 버튼 클릭 여부 상태
    const [isGenerating, setIsGenerating] = useState(false); // 메시지 생성 로딩 상태

    const [filters, setFilters] = useState({
        id: '', name: '', age: '', gender: [], disease: [], isMarried: [], hasChildren: []
    });

    const [selectedCustomerForHistory, setSelectedCustomerForHistory] = useState(null);
    const [messageHistory, setMessageHistory] = useState([]);
    const [messagePreview, setMessagePreview] = useState('');
    const [generatedMessageData, setGeneratedMessageData] = useState(null); //생성된 메시지의 원본 데이터 저장할 상태 추가
    const [showTransmissionCompletePopup, setShowTransmissionCompletePopup] = useState(false);
    const [showEditCompletePopup, setShowEditCompletePopup] = useState(false);

    // === 데이터 로딩 및 필터링 로직 (useEffect) ===

     useEffect(() => {
        setAnimateCard(true);
    }, []);

    // === 핸들러 및 헬퍼 함수 ===
    const handleInputChange = (e) => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleCheckboxChange = (e) => {
         const { name, value, checked } = e.target;
        setFilters(prev => {
            const currentValues = prev[name] || [];
            // [주석] 체크박스는 단일 선택처럼 동작하도록 로직 수정 (API 스펙에 맞춤)
            const newValues = checked ? [value] : [];
            return { ...prev, [name]: newValues };
        });
    };

    // 필터 객체가 비어있는지 확인하는 헬퍼 함수
    const isFilterEmpty = (filters) => {
        if (filters.id || filters.name || filters.age) return false;
        if (filters.gender.length > 0 || filters.disease.length > 0 || filters.isMarried.length > 0 || filters.hasChildren.length > 0) return false;
        return true;
    };

    // 2. 조회 버튼 클릭 시 필터링 수행
       const handleSearch = async () => {
        setLoading(true);
        setError(null);
        setFilteredCustomers([]);

        try {
            let response;
            if (isFilterEmpty(filters)) {
                response = await recommendationService.getAllCustomers();
            } else {
                // [수정] API 요청 전, 프론트엔드 필터 상태를 백엔드 파라미터 형식에 맞게 변환
                const apiParams = {
                    name: filters.name || undefined,
                    ageGroup: filters.age || undefined, // 'age'를 'ageGroup'으로 변경
                    gender: filters.gender.length > 0 ? filters.gender[0] : undefined,
                    disease: filters.disease.length > 0 ? filters.disease[0] : undefined,
                    // '기혼'/'미혼'을 boolean 값으로 변환
                    isMarried: filters.isMarried.length > 0 ? (filters.isMarried[0] === '기혼') : undefined,
                    // '유'/'무'를 boolean 값으로 변환
                    hasChildren: filters.hasChildren.length > 0 ? (filters.hasChildren[0] === '유') : undefined,
                };

                // undefined 값을 가진 속성은 제외하여 깔끔한 파라미터 객체 생성
                Object.keys(apiParams).forEach(key => apiParams[key] === undefined && delete apiParams[key]);

                response = await recommendationService.getFilteredCustomers(apiParams);
            }
            
            setFilteredCustomers(response.data);

        } catch (err) {
            setError("데이터 조회에 실패했습니다. 잠시 후 다시 시도해주세요.");
            console.error(err);
            setFilteredCustomers([]);
        } finally {
            setLoading(false);
            setIsSearched(true);
        }
    };

    const getFamilyInfo = (customer) => `${customer.isMarried ? '기혼' : '미혼'}, ${customer.hasChildren ? '자녀 있음' : '자녀 없음'}`;
    
    const handleHistoryClick = (customer) => {
        setSelectedCustomerForHistory(customer);
        setMessageHistory([]);
        alert(`'${customer.name}'님의 발송 기록 조회 API 연동이 필요합니다.`);
    };

     const handleGenerateMessage = async() => {
        if (filteredCustomers.length === 0) {
            alert("메시지를 생성할 고객이 없습니다. 먼저 고객을 조회해주세요.");
            return;
        }
         setIsGenerating(true);
         setMessagePreview('');
         setGeneratedMessageData(null); //메시지 생성 시, 이전 원본 데이터 초기화


        try {
            let familyValue;
            if (filters.hasChildren.includes('유')) {
                familyValue = '자녀';
            } else if (filters.isMarried.includes('기혼')) {
                familyValue = '기혼';
            } else if (filters.isMarried.includes('미혼')) {
                familyValue = '미혼';
            }

            const requestData = {
                ageGroup: filters.age || undefined,
                gender: filters.gender[0] || undefined,
                disease: filters.disease[0] || undefined,
                family: familyValue,
            };
            
            const response = await recommendationService.generatePreviewMessage(requestData);

             // [수정] 응답 데이터 전체를 원본 데이터 상태에 저장
            setGeneratedMessageData(response.data);

            const { service1, service2, service1DetailedUrl, service2DetailedUrl, message } = response.data;
            let formattedMessage = `[대상 고객: ${filteredCustomers.length}명]\n\n[추천된 전환서비스]\n- ${service1 || '추천 서비스 없음'}`;
            if (service2) { formattedMessage += `\n- ${service2}`; }
            formattedMessage += `\n\n[메시지 내용]\n${message || '생성된 메시지가 없습니다.'}`;
            const detailsSection = [];
            if (service1 && service1DetailedUrl) { detailsSection.push(`- ${service1} 자세히 보기: ${service1DetailedUrl}`); }
            if (service2 && service2DetailedUrl) { detailsSection.push(`- ${service2} 자세히 보기: ${service2DetailedUrl}`); }
            if (detailsSection.length > 0) { formattedMessage += `\n\n[서비스 바로가기]\n${detailsSection.join('\n')}`; }
            setMessagePreview(formattedMessage.trim());

        } catch (err) {
            console.error("메시지 생성에 실패했습니다.", err);
            setMessagePreview("오류: 메시지를 생성하지 못했습니다. 다시 시도해주세요.");
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleEditMessage = () => {
        if (!messagePreview) { alert("수정할 메시지가 없습니다."); return; }
        console.log("수정된 메시지 저장:", messagePreview);
        setShowEditCompletePopup(true);
    };

    const handleSendMessage = async () => {
        if (!messagePreview) {
            alert("전송할 메시지가 없습니다.");
            return;
        }
        if (!generatedMessageData) {
            alert("전송할 원본 메시지 데이터가 없습니다. 메시지를 다시 생성해주세요.");
            return;
        }

        try {
            // API에 보낼 요청(Request) 데이터 준비
            const filterCriteria = {
                ageGroup: filters.age || undefined,
                gender: filters.gender[0] || undefined,
                disease: filters.disease[0] || undefined,
                family: generatedMessageData.family || undefined, // 생성 시점의 family 값을 사용
            };
            Object.keys(filterCriteria).forEach(key => filterCriteria[key] === undefined && delete filterCriteria[key]);

            const requestBody = {
                // 사용자가 수정한 최종 메시지 내용을 전송
                message: messagePreview,
                // '메시지 생성' 시 받아온 원본 데이터를 함께 전송
                serviceId1: generatedMessageData.serviceId1,
                serviceId2: generatedMessageData.serviceId2,
                imageUrl1: generatedMessageData.imageUrl1,
                imageUrl2: generatedMessageData.imageUrl2,
                detailedUrl1: generatedMessageData.detailedUrl1,
                detailedUrl2: generatedMessageData.detailedUrl2,
                filterCriteria: filterCriteria,
            };

            // [주석] 그룹 메시지 전송 API 호출
            await recommendationService.sendGroupMessage(requestBody);

            // [주석] 성공 시 알림 팝업 표시 및 상태 초기화
            setShowTransmissionCompletePopup(true);
            setMessagePreview('');
            setGeneratedMessageData(null);

        } catch (err) {
            console.error("메시지 전송에 실패했습니다.", err);
            alert("메시지 전송 중 오류가 발생했습니다.");
        }
    };

    
    // === 렌더링(JSX) ===
    if (loading && !animateCard) {
        return (
            <div className="page-wrapper" style={{'--navbar-height': '62px', height: 'calc(100vh - var(--navbar-height))', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%)'}}>
                <div className="text-center" style={{ color: '#4A3728' }}>
                    <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem', color: '#B8860B' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3" style={{ fontSize: '1.2rem' }}>데이터를 불러오는 중입니다...</p>
                </div>
            </div>
        );
    }
    if (error) return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}><h2 style={{color: 'red'}}>{error}</h2></div>;

    return (
        <>
            <div className="page-wrapper" style={{'--navbar-height': '62px', height: 'calc(100vh - var(--navbar-height))', background: 'linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%)', padding: '20px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div className={`dashboard-container ${animateCard ? 'animate-in' : ''}`} style={{width: '100%', maxWidth: '1600px', height: '100%', margin: '0 auto', display: 'flex', boxSizing: 'border-box', background: 'rgba(255, 251, 235, 0.95)', boxShadow: '0 20px 60px rgba(44, 31, 20, 0.4)', backdropFilter: 'blur(15px)', border: '2px solid rgba(184, 134, 11, 0.35)', borderRadius: '28px', padding: '20px', gap: '20px', overflow: 'hidden'}}>
                    {/* 좌측 필터링 UI */} 
                    <div style={{ flex: '0 0 400px', display: 'flex', flexDirection: 'column' }}>
                        <h4 className="mb-3" style={{ fontSize: '30px', fontWeight: '700', color: '#2C1F14', paddingLeft: '10px', flexShrink: 0 }}>전환서비스 추천</h4>
                        <div className="sidebar-scroll-area" style={{background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.12) 0%, rgba(205, 133, 63, 0.08) 100%)', borderRadius: '15px', padding: '20px', flex: 1, overflowY: 'auto', minHeight: 0, border: '1px solid rgba(184, 134, 11, 0.2)'}}>
                            <div style={{width: '100px', height: '100px', background: 'rgba(184, 134, 11, 0.15)', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(44, 31, 20, 0.2)'}}><Mail size={40} style={{ color: '#B8860B' }} /></div>
                            <h2 style={{fontWeight: '700', marginBottom: '15px', fontSize: '1.8rem', textAlign: 'center', color: '#2C1F14'}}>고객 조회</h2>
                            <p style={{fontSize: '16px', lineHeight: '1.6', margin: 0, opacity: 0.7, textAlign: 'center', color: '#4A3728'}}>조건별로 고객을 검색하고<br/>메시지를 발송하세요.</p>
                            <hr className="my-4"/>
                            <Form>
                                <Row className="g-3 mb-3"><Col xs={6}><Form.Label style={{color: '#4A3728'}}>고객 고유번호</Form.Label><Form.Control name="id" value={filters.id} onChange={handleInputChange} placeholder="고유번호" /></Col><Col xs={6}><Form.Label style={{color: '#4A3728'}}>이름</Form.Label><Form.Control name="name" value={filters.name} onChange={handleInputChange} placeholder="이름" /></Col></Row>
                                <hr className="my-4"/><Form.Label style={{color: '#4A3728'}}>상세 조건</Form.Label>
                                <div className="d-flex align-items-center mb-2"><strong className="me-3" style={{minWidth: '40px', color: '#4A3728'}}>성별:</strong><Form.Check inline type="checkbox" label="남" name="gender" value="남" onChange={handleCheckboxChange} /><Form.Check inline type="checkbox" label="여" name="gender" value="여" onChange={handleCheckboxChange} /></div>
                                <div className="d-flex align-items-center mb-2"><strong className="me-3" style={{minWidth: '40px', color: '#4A3728'}}>질병:</strong><Form.Check inline type="checkbox" label="유" name="disease" value="유" onChange={handleCheckboxChange} /><Form.Check inline type="checkbox" label="무" name="disease" value="무" onChange={handleCheckboxChange} /></div>
                                <div className="d-flex align-items-center mb-2"><strong className="me-3" style={{minWidth: '40px', color: '#4A3728'}}>결혼:</strong><Form.Check inline type="checkbox" label="기혼" name="isMarried" value="기혼" onChange={handleCheckboxChange} /><Form.Check inline type="checkbox" label="미혼" name="isMarried" value="미혼" onChange={handleCheckboxChange} /></div>
                                <div className="d-flex align-items-center mb-3"><strong className="me-3" style={{minWidth: '40px', color: '#4A3728'}}>자녀:</strong><Form.Check inline type="checkbox" label="유" name="hasChildren" value="유" onChange={handleCheckboxChange} /><Form.Check inline type="checkbox" label="무" name="hasChildren" value="무" onChange={handleCheckboxChange} /></div>
                                <Row className="g-3"><Col xs={12}><Form.Label style={{color: '#4A3728'}}>나이대</Form.Label><Form.Select name="age" value={filters.age} onChange={handleInputChange}><option value="">전체</option><option value="20-29">20대</option><option value="30-39">30대</option><option value="40-49">40대</option><option value="50-59">50대</option><option value="60-150">60대 이상</option></Form.Select></Col></Row>
                                
                                <Button className="btn-search" onClick={handleSearch}>
                                    <Search size={18} className="me-2" />
                                    고객 조회
                                </Button>
                            </Form>
                        </div>
                    </div>

                    {/* 오른쪽 메인 콘텐츠 */} 
                    <div className="dashboard-right" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, paddingBottom: '10px' }}>
                            <div className="d-flex align-items-center">
                               <h5 style={{ fontWeight: '600', color: '#2C1F14', margin: 0 }}>고객 목록 ({isSearched ? filteredCustomers.length : 0}명)</h5>
                            </div>
                            <Button className="btn-golden" onClick={handleGenerateMessage} disabled={!isSearched || filteredCustomers.length === 0}>메시지 생성</Button>
                        </div>
                        
                        <div className="content-scroll-area" style={{ flex: 1, overflowY: 'auto', paddingRight: '10px', background: 'rgba(0,0,0,0.02)', borderRadius: '12px' }}>
                            {!isSearched ? (
                                <div className="d-flex justify-content-center align-items-center h-100 text-center text-muted">
                                    <div>
                                        <Search size={48} className="mb-3" />
                                        <p>좌측 필터에서 조건을 선택하고<br/>'고객 조회' 버튼을 눌러주세요.</p>
                                    </div>
                                </div>
                            ) : filteredCustomers.length > 0 ? (
                                filteredCustomers.map(customer => (
                                    <Card key={customer.customerId} className="mb-3" style={{ background: 'rgba(253, 251, 243, 0.92)', border: '1px solid rgba(184, 134, 11, 0.2)' }}>
                                        <Card.Body>
                                            <Row className="align-items-center">
                                                <Col md={3} className="text-center text-md-start mb-3 mb-md-0 border-end pe-md-3"><p className="text-muted mb-1" style={{ fontSize: '0.85rem' }}>{customer.customerId}</p><h5 className="fw-bold mb-0" style={{color: '#2C1F14'}}>{customer.name}</h5></Col>
                                                <Col>
                                                    <Row>
                                                        <Col sm={6} className="mb-2"><strong>생년월일:</strong> {customer.birthOfDate} (만 {customer.age}세)</Col>
                                                        <Col sm={6} className="mb-2"><strong>성별:</strong> {customer.gender}</Col>
                                                        <Col sm={6} className="mb-2"><strong>연락처:</strong> {customer.phone}</Col>
                                                        <Col sm={6} className="mb-2"><strong>직업:</strong> {customer.job}</Col>
                                                        <Col sm={12} className="mb-2"><strong>주소:</strong> {customer.address}</Col>
                                                        <Col sm={12} className="mb-2"><strong>가족:</strong> {getFamilyInfo(customer)}</Col>
                                                        <Col sm={12}><strong>질병:</strong> {customer.disease && customer.disease.length > 0 ? customer.disease.join(', ') : '없음'}</Col>
                                                    </Row>
                                                </Col>
                                                <Col md="auto" className="text-center text-md-end"><Button variant="secondary" size="sm" onClick={() => handleHistoryClick(customer)}>발송기록</Button></Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                ))
                            ) : (
                                 <div className="d-flex justify-content-center align-items-center h-100 text-center text-muted">
                                    <div>
                                        <p>선택하신 조건에 맞는 고객 정보가 없습니다.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-3" style={{ flexShrink: 0 }}>
                            <Row><Col lg={6} className="mb-3 mb-lg-0"><Card style={{ background: 'rgba(253, 251, 243, 0.92)', border: '1px solid rgba(184, 134, 11, 0.2)', height: '100%' }}><Card.Header as="h5" style={{color: '#2C1F14', background: 'rgba(184, 134, 11, 0.1)'}}>메시지 미리보기</Card.Header><Card.Body className="d-flex flex-column"><Form.Control as="textarea" rows={8} value={messagePreview} onChange={(e) => setMessagePreview(e.target.value)} className="mb-3 flex-grow-1" style={{whiteSpace: 'pre-wrap'}} /><div className="d-flex justify-content-end gap-2"><Button variant="secondary" onClick={handleEditMessage}>메시지 수정</Button><Button className="btn-golden" onClick={handleSendMessage}>메시지 전송</Button></div></Card.Body></Card></Col>
                            <Col lg={6}><Card style={{ background: 'rgba(253, 251, 243, 0.92)', border: '1px solid rgba(184, 134, 11, 0.2)', height: '100%' }}><Card.Header as="h5" style={{color: '#2C1F14', background: 'rgba(184, 134, 11, 0.1)'}}>메시지 발송 기록</Card.Header>
                            <Card.Body style={{overflowY: 'auto'}}>
                                {selectedCustomerForHistory ? (
                                    messageHistory.length > 0 ? (
                                        messageHistory.map(history => (
                                            <div key={history.messageId} className="mb-4">
                                                <h6><strong>발송일시:</strong> {history.createMessageDate}</h6>
                                                <div className="d-flex gap-2 my-2">
                                                    {history.recommendedServices.map(service => (
                                                        <img key={service.serviceName} src={service.imageUrl} alt={service.serviceName} style={{width: '50%', borderRadius: '8px'}} />
                                                    ))}
                                                </div>
                                                <p style={{whiteSpace: 'pre-wrap', fontSize: '0.9rem'}}>{history.messageContent}</p>
                                                
                                                <hr/>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted"><strong>{selectedCustomerForHistory.name}</strong>님의 발송 기록이 없습니다.</p>
                                    )
                                ) : (
                                    <p className="text-muted">고객 목록에서 '발송기록' 버튼을 클릭하여 확인하세요.</p>
                                )}
                            </Card.Body></Card></Col></Row>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* 모달 영역 */} 
            <Modal show={isGenerating} centered backdrop="static" keyboard={false}> 
                <Modal.Body className="text-center p-4">
                    <Spinner animation="border" variant="primary" className="mb-3" />
                    <h4>메시지가 생성 중입니다...</h4>
                    <p className="text-muted mb-0">AI가 고객 맞춤 메시지를 만들고 있습니다. 잠시만 기다려 주세요.</p>
                </Modal.Body>
            </Modal>
            <Modal show={showTransmissionCompletePopup} onHide={() => setShowTransmissionCompletePopup(false)} centered><Modal.Header closeButton><Modal.Title>알림</Modal.Title></Modal.Header><Modal.Body>메시지 전송이 완료되었습니다.</Modal.Body><Modal.Footer><Button className="btn-golden" onClick={() => setShowTransmissionCompletePopup(false)}>확인</Button></Modal.Footer></Modal>
            <Modal show={showEditCompletePopup} onHide={() => setShowEditCompletePopup(false)} centered><Modal.Header closeButton><Modal.Title>알림</Modal.Title></Modal.Header><Modal.Body>메시지 수정이 완료되었습니다.</Modal.Body><Modal.Footer><Button className="btn-golden" onClick={() => setShowEditCompletePopup(false)}>확인</Button></Modal.Footer></Modal>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } 
                .dashboard-container.animate-in { animation: fadeIn 0.6s ease-out forwards; }
                .content-scroll-area::-webkit-scrollbar, .sidebar-scroll-area::-webkit-scrollbar, .card-body::-webkit-scrollbar { width: 6px; }
                .content-scroll-area::-webkit-scrollbar-track, .sidebar-scroll-area::-webkit-scrollbar-track, .card-body::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); border-radius: 10px; }
                .content-scroll-area::-webkit-scrollbar-thumb, .sidebar-scroll-area::-webkit-scrollbar-thumb, .card-body::-webkit-scrollbar-thumb { background-color: rgba(184, 134, 11, 0.5); border-radius: 10px; }
                .btn-golden { background: linear-gradient(135deg, #D4AF37, #F5C23E); border: none; color: #2C1F14; font-weight: 700; box-shadow: 0 4px 15px rgba(184, 134, 11, 0.35); transition: all 0.3s ease; display: inline-flex; align-items: center; justify-content: center; }
                .btn-golden:hover { background: linear-gradient(135deg, #CAA230, #E8B530); color: #2C1F14; transform: translateY(-2px); box-shadow: 0 8px 25px rgba(184, 134, 11, 0.45); }
                
                /* 조회 버튼 스타일 추가 */
                .btn-search {
                    width: 100%;
                    margin-top: 20px; /* 필터 항목과의 간격 */
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
                     /* 반응형 레이아웃 */
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
                    .dashboard-left { /* Renamed from dashboard-left to match the structure */
                        flex: 1 1 auto; /* 세로로 쌓일 때 너비 제약을 해제하고 전체 너비를 차지하도록 함 */
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
        </>
    );
};

export default Menu3;
