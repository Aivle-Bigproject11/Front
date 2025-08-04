import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';
import { Mail, Send } from 'lucide-react';
// [실제 백엔드 연동 시] axios가 설치되어 있는지 확인하세요. (npm install axios)
import axios from 'axios';

// =================================================================
// [테스트용] Mock 데이터
// =================================================================
const mockApiData = [
    { customerId: 'SB2001', name: '김말똥', birthOfDate: '1950.01.01', age: 74, gender: '남', phone: '010-1234-5678', address: '서울시 강남구', job: '의사', isMarried: true, hasChildren: true, hasDisease: true },
    { customerId: 'SB2002', name: '김진우', birthOfDate: '1990.01.01', age: 34, gender: '남', phone: '010-2345-6789', address: '경기도 김포시', job: '무직', isMarried: false, hasChildren: false, hasDisease: false },
    { customerId: 'SB2003', name: '최개똥', birthOfDate: '2000.01.01', age: 24, gender: '남', phone: '010-3456-7890', address: '인천시 서구', job: '정비사', isMarried: false, hasChildren: false, hasDisease: false },
    { customerId: 'SB2004', name: '이철수', birthOfDate: '1975.01.01', age: 49, gender: '남', phone: '010-4567-8901', address: '서울시 마포구', job: '개발자', isMarried: true, hasChildren: true, hasDisease: true },
    { customerId: 'SB2005', name: '박영희', birthOfDate: '1982.05.10', age: 42, gender: '여', phone: '010-5678-9012', address: '경기도 성남시', job: '주부', isMarried: true, hasChildren: false, hasDisease: false },
];

// [테스트용] 특정 고객(김말똥)의 발송 기록 Mock 데이터
const mockHistoryData = [
    {
        messageId: 101,
        createMessageDate: '2025.07.20',
        recommendedServices: [
            { serviceName: '결혼 서비스', imageUrl: 'https://placehold.co/600x400/FFF4E0/333?text=Wedding+Service', detailedUrl: 'http://example.com/wedding' },
            { serviceName: '여행 서비스', imageUrl: 'https://placehold.co/600x400/D4EFFF/333?text=Travel+Service', detailedUrl: 'http://example.com/travel' }
        ],
        messageContent: `[○○상조] 김말똥님, 요즘 자녀가 결혼할 시기시죠? 
아니면 은퇴 후 여행 생각 있으신가요? OO상조에서 맞춤 패키지를 추천드립니다!
[🔍 상품 자세히 보기]`,
    }
];


const Menu3 = () => {
    // === 상태 관리 ===
    const [allCustomers, setAllCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [animateCard, setAnimateCard] = useState(false);

    const [filters, setFilters] = useState({
        id: '', name: '', age: '', gender: [], disease: [], isMarried: [], hasChildren: []
    });

    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [selectedCustomerForHistory, setSelectedCustomerForHistory] = useState(null);
    const [messageHistory, setMessageHistory] = useState([]);
    const [messagePreview, setMessagePreview] = useState('');
    const [showTransmissionCompletePopup, setShowTransmissionCompletePopup] = useState(false);
    const [showEditCompletePopup, setShowEditCompletePopup] = useState(false);
    const [showResendCompletePopup, setShowResendCompletePopup] = useState(false); // 재전송 완료 팝업

    // === 데이터 로딩 및 필터링 로직 (useEffect) ===

    // 1. 최초 데이터 로딩
    useEffect(() => {
        const fetchInitialDataWithMock = () => {
            setLoading(true);
            setTimeout(() => {
                try {
                    setAllCustomers(mockApiData);
                    setFilteredCustomers(mockApiData);
                    setError(null);
                } catch (err) {
                    setError("Mock 데이터 로딩에 실패했습니다.");
                    console.error(err);
                } finally {
                    setLoading(false);
                    setAnimateCard(true);
                }
            }, 500);
        };
        fetchInitialDataWithMock();
    }, []);

    // 2. 필터링 로직
    useEffect(() => {
        if (loading) return;
        let result = [...allCustomers];
        if (filters.id) { result = result.filter(c => String(c.customerId).toLowerCase().includes(filters.id.toLowerCase())); }
        if (filters.name) { result = result.filter(c => c.name.toLowerCase().includes(filters.name.toLowerCase())); }
        if (filters.age) {
            const [minAge, maxAge] = filters.age.split('-').map(Number);
            result = result.filter(c => c.age >= minAge && c.age <= maxAge);
        }
        if (filters.gender.length > 0) { result = result.filter(c => filters.gender.includes(c.gender)); }
        if (filters.disease.length > 0) {
            const hasDisease = filters.disease.includes('유');
            const noDisease = filters.disease.includes('무');
            if (hasDisease && !noDisease) result = result.filter(c => c.hasDisease);
            if (!hasDisease && noDisease) result = result.filter(c => !c.hasDisease);
        }
        if (filters.isMarried.length > 0) {
            const isMarried = filters.isMarried.includes('기혼');
            const isNotMarried = filters.isMarried.includes('미혼');
            result = result.filter(c => {
                if (isMarried && !isNotMarried) return c.isMarried;
                if (!isMarried && isNotMarried) return !c.isMarried;
                return true;
            });
        }
        if (filters.hasChildren.length > 0) {
            const hasChildren = filters.hasChildren.includes('유');
            const noChildren = filters.hasChildren.includes('무');
            result = result.filter(c => {
                if (hasChildren && !noChildren) return c.hasChildren;
                if (!hasChildren && noChildren) return !c.hasChildren;
                return true;
            });
        }
        setFilteredCustomers(result);
    }, [filters, allCustomers, loading]);

    // === 핸들러 및 헬퍼 함수 ===
    const handleInputChange = (e) => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleCheckboxChange = (e) => {
        const { name, value, checked } = e.target;
        setFilters(prev => {
            const currentValues = prev[name] || [];
            const newValues = checked ? [...currentValues, value] : currentValues.filter(v => v !== value);
            return { ...prev, [name]: newValues };
        });
    };
    const handleCustomerSelect = (customerId) => setSelectedCustomers(prev => prev.includes(customerId) ? prev.filter(id => id !== customerId) : [...prev, customerId]);
    const handleSelectAll = (e) => setSelectedCustomers(e.target.checked ? filteredCustomers.map(c => c.customerId) : []);
    const getFamilyInfo = (customer) => `${customer.isMarried ? '기혼' : '미혼'}, ${customer.hasChildren ? '자녀 있음' : '자녀 없음'}`;
    
    const handleHistoryClick = (customer) => {
        setSelectedCustomerForHistory(customer);
        setMessageHistory([]); // 기록을 초기화

        // --- [테스트용] Mock 데이터로 발송 기록 표시 ---
        // '김말똥' 고객일 경우에만 예시 기록을 보여줍니다.
        if (customer.customerId === 'SB2001') {
            setMessageHistory(mockHistoryData);
        } else {
            // 다른 고객은 기록이 없는 것으로 표시
            setMessageHistory([]);
        }

        // --- [실제 백엔드 연동 시] 발송 기록 API 호출 ---
        /*
        const fetchHistory = async () => {
            try {
                const response = await axios.get(`/api/messages/history/${customer.customerId}`);
                setMessageHistory(response.data);
            } catch (err) {
                console.error("발송 기록 로딩에 실패했습니다.", err);
                setMessageHistory([]); // 에러 발생 시 빈 배열로 설정
            }
        };
        fetchHistory();
        */
    };

    const handleGenerateMessage = () => {
        if (selectedCustomers.length === 0) {
            alert("메시지를 생성할 고객을 먼저 선택해주세요.");
            return;
        }

        // --- [테스트용] 임시 메시지 생성 로직 ---
        const firstCustomer = allCustomers.find(c => c.customerId === selectedCustomers[0]);
        const mockAiResponse = {
            recommendedServices: [
                { serviceName: '결혼 서비스' },
                { serviceName: '여행 서비스' }
            ],
            messageContent: `[○○상조] ${firstCustomer.name}님, 요즘 자녀가 결혼할 시기시죠? \n아니면 은퇴 후 여행 생각 있으신가요? OO상조에서 맞춤 패키지를 추천드립니다!`,
            detailedUrlText: `[🔍 상품 자세히 보기]`
        };
        
        const formattedMessage = `[추천된 전환서비스]
- ${mockAiResponse.recommendedServices[0].serviceName}
- ${mockAiResponse.recommendedServices[1].serviceName}

[메시지 내용]
${mockAiResponse.messageContent}
${mockAiResponse.detailedUrlText}`;
        setMessagePreview(formattedMessage);

        // --- [실제 백엔드 연동 시] AI 메시지 생성 API 호출 ---
        /*
        const generateMessage = async () => {
            try {
                const response = await axios.post('/api/generate-message', { customerIds: selectedCustomers });
                const { recommendedServices, messageContent, detailedUrlText } = response.data;
                const formattedMessage = `[추천된 전환서비스]
${recommendedServices.map(s => `- ${s.serviceName}`).join('\n')}

[메시지 내용]
${messageContent}
${detailedUrlText}`;
                setMessagePreview(formattedMessage);
            } catch (err) {
                console.error("메시지 생성에 실패했습니다.", err);
                setMessagePreview("오류: 메시지를 생성하지 못했습니다.");
            }
        };
        generateMessage();
        */
    };
    
    const handleEditMessage = () => {
        if (!messagePreview) { alert("수정할 메시지가 없습니다."); return; }
        console.log("수정된 메시지 저장:", messagePreview);
        setShowEditCompletePopup(true);
    };

    const handleSendMessage = () => {
        if (!messagePreview) { alert("전송할 메시지가 없습니다."); return; }
        console.log("메시지 전송:", messagePreview);
        setShowTransmissionCompletePopup(true);
    };

    const handleResendMessage = (messageId) => {
        console.log(`${messageId} 메시지 재전송`);
        // 실제 재전송 API 호출 로직
        setShowResendCompletePopup(true);
    };

    // === 렌더링(JSX) ===
    if (loading) {
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
        <div className="page-wrapper" style={{'--navbar-height': '62px', height: 'calc(100vh - var(--navbar-height))', background: 'linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%)', padding: '20px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div className={`dashboard-container ${animateCard ? 'animate-in' : ''}`} style={{width: '100%', maxWidth: '1600px', height: '100%', margin: '0 auto', display: 'flex', boxSizing: 'border-box', background: 'rgba(255, 251, 235, 0.95)', boxShadow: '0 20px 60px rgba(44, 31, 20, 0.4)', backdropFilter: 'blur(15px)', border: '2px solid rgba(184, 134, 11, 0.35)', borderRadius: '28px', padding: '20px', gap: '20px', overflow: 'hidden'}}>
                {/* 좌측 필터링 UI */}
                <div style={{ flex: '0 0 400px', display: 'flex', flexDirection: 'column' }}>
                    <h4 className="mb-3" style={{ fontSize: '30px', fontWeight: '700', color: '#2C1F14', paddingLeft: '10px', flexShrink: 0 }}>전환서비스 추천</h4>
                    <div className="sidebar-scroll-area" style={{background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.12) 0%, rgba(205, 133, 63, 0.08) 100%)', borderRadius: '15px', padding: '20px', flex: 1, overflowY: 'auto', minHeight: 0, border: '1px solid rgba(184, 134, 11, 0.2)'}}>
                        <div style={{width: '120px', height: '120px', background: 'rgba(184, 134, 11, 0.15)', borderRadius: '50%', margin: '0 auto 30px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(44, 31, 20, 0.2)'}}><Mail size={48} style={{ color: '#B8860B' }} /></div>
                        <h2 style={{fontWeight: '700', marginBottom: '15px', fontSize: '1.8rem', textAlign: 'center', color: '#2C1F14'}}>고객 조회</h2>
                        <p style={{fontSize: '16px', lineHeight: '1.6', margin: 0, opacity: 0.7, textAlign: 'center', color: '#4A3728'}}>조건별로 고객을 검색하고<br/>메시지를 발송하세요.</p>
                        <hr className="my-4"/>
                        <Form>
                            <Row className="g-3 mb-3"><Col xs={6}><Form.Label style={{color: '#4A3728'}}>고객 고유번호</Form.Label><Form.Control name="id" value={filters.id} onChange={handleInputChange} placeholder="고유번호" /></Col><Col xs={6}><Form.Label style={{color: '#4A3728'}}>이름</Form.Label><Form.Control name="name" value={filters.name} onChange={handleInputChange} placeholder="이름" /></Col></Row>
                            <Row className="g-3 mb-3"><Col xs={12}><Form.Label style={{color: '#4A3728'}}>나이대</Form.Label><Form.Select name="age" value={filters.age} onChange={handleInputChange}><option value="">전체</option><option value="20-29">20대</option><option value="30-39">30대</option><option value="40-49">40대</option><option value="50-59">50대</option><option value="60-150">60대 이상</option></Form.Select></Col></Row>
                            <hr /><Form.Label style={{color: '#4A3728'}}>상세 조건</Form.Label>
                            <div className="d-flex align-items-center mb-2"><strong className="me-3" style={{minWidth: '40px', color: '#4A3728'}}>성별:</strong><Form.Check inline type="checkbox" label="남" name="gender" value="남" onChange={handleCheckboxChange} /><Form.Check inline type="checkbox" label="여" name="gender" value="여" onChange={handleCheckboxChange} /></div>
                            <div className="d-flex align-items-center mb-2"><strong className="me-3" style={{minWidth: '40px', color: '#4A3728'}}>질병:</strong><Form.Check inline type="checkbox" label="유" name="disease" value="유" onChange={handleCheckboxChange} /><Form.Check inline type="checkbox" label="무" name="disease" value="무" onChange={handleCheckboxChange} /></div>
                            <div className="d-flex align-items-center mb-2"><strong className="me-3" style={{minWidth: '40px', color: '#4A3728'}}>결혼:</strong><Form.Check inline type="checkbox" label="기혼" name="isMarried" value="기혼" onChange={handleCheckboxChange} /><Form.Check inline type="checkbox" label="미혼" name="isMarried" value="미혼" onChange={handleCheckboxChange} /></div>
                            <div className="d-flex align-items-center"><strong className="me-3" style={{minWidth: '40px', color: '#4A3728'}}>자녀:</strong><Form.Check inline type="checkbox" label="유" name="hasChildren" value="유" onChange={handleCheckboxChange} /><Form.Check inline type="checkbox" label="무" name="hasChildren" value="무" onChange={handleCheckboxChange} /></div>
                        </Form>
                    </div>
                </div>

                {/* 오른쪽 메인 콘텐츠 */}
                <div className="dashboard-right" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, paddingBottom: '10px' }}>
                        <div className="d-flex align-items-center"><h5 style={{ fontWeight: '600', color: '#2C1F14', margin: 0 }}>고객 목록 ({filteredCustomers.length}명)</h5><Form.Check type="checkbox" label={`전체 선택 (${selectedCustomers.length}명)`} className="ms-3" checked={filteredCustomers.length > 0 && selectedCustomers.length === filteredCustomers.length} onChange={handleSelectAll}/></div>
                        <Button className="btn-golden" onClick={handleGenerateMessage}>선택 고객 메시지 생성</Button>
                    </div>
                    
                    <div className="content-scroll-area" style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
                        {filteredCustomers.map(customer => (
                            <Card key={customer.customerId} className="mb-3" style={{ background: 'rgba(253, 251, 243, 0.92)', border: '1px solid rgba(184, 134, 11, 0.2)' }}>
                                <Card.Body>
                                    <Row className="align-items-center">
                                        <Col xs="auto" className="pe-0"><Form.Check type="checkbox" checked={selectedCustomers.includes(customer.customerId)} onChange={() => handleCustomerSelect(customer.customerId)} /></Col>
                                        <Col md={3} className="text-center text-md-start mb-3 mb-md-0 border-end pe-md-3"><p className="text-muted mb-1" style={{ fontSize: '0.85rem' }}>{customer.customerId}</p><h5 className="fw-bold mb-0" style={{color: '#2C1F14'}}>{customer.name}</h5></Col>
                                        <Col>
                                            <Row>
                                                <Col sm={6} className="mb-2"><strong>생년월일:</strong> {customer.birthOfDate} (만 {customer.age}세)</Col>
                                                <Col sm={6} className="mb-2"><strong>성별:</strong> {customer.gender}</Col>
                                                <Col sm={6} className="mb-2"><strong>연락처:</strong> {customer.phone}</Col>
                                                <Col sm={6} className="mb-2"><strong>직업:</strong> {customer.job}</Col>
                                                <Col sm={12} className="mb-2"><strong>주소:</strong> {customer.address}</Col>
                                                <Col sm={12} className="mb-2"><strong>가족:</strong> {getFamilyInfo(customer)}</Col>
                                            </Row>
                                        </Col>
                                        <Col md="auto" className="text-center text-md-end"><Button variant="secondary" size="sm" onClick={() => handleHistoryClick(customer)}>발송기록</Button></Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        ))}
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
                                            <div className="text-end">
                                                <Button className="btn-golden" size="sm" onClick={() => handleResendMessage(history.messageId)}>
                                                    <Send size={16} className="me-1" /> 재전송
                                                </Button>
                                            </div>
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
            
            <Modal show={showTransmissionCompletePopup} onHide={() => setShowTransmissionCompletePopup(false)} centered><Modal.Header closeButton><Modal.Title>알림</Modal.Title></Modal.Header><Modal.Body>메시지 전송이 완료되었습니다.</Modal.Body><Modal.Footer><Button className="btn-golden" onClick={() => setShowTransmissionCompletePopup(false)}>확인</Button></Modal.Footer></Modal>
            <Modal show={showEditCompletePopup} onHide={() => setShowEditCompletePopup(false)} centered><Modal.Header closeButton><Modal.Title>알림</Modal.Title></Modal.Header><Modal.Body>메시지 수정이 완료되었습니다.</Modal.Body><Modal.Footer><Button className="btn-golden" onClick={() => setShowEditCompletePopup(false)}>확인</Button></Modal.Footer></Modal>
            <Modal show={showResendCompletePopup} onHide={() => setShowResendCompletePopup(false)} centered><Modal.Header closeButton><Modal.Title>알림</Modal.Title></Modal.Header><Modal.Body>메시지 재전송이 완료되었습니다.</Modal.Body><Modal.Footer><Button className="btn-golden" onClick={() => setShowResendCompletePopup(false)}>확인</Button></Modal.Footer></Modal>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .dashboard-container.animate-in { animation: fadeIn 0.6s ease-out forwards; }
                .content-scroll-area::-webkit-scrollbar, .sidebar-scroll-area::-webkit-scrollbar, .card-body::-webkit-scrollbar { width: 6px; }
                .content-scroll-area::-webkit-scrollbar-track, .sidebar-scroll-area::-webkit-scrollbar-track, .card-body::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); border-radius: 10px; }
                .content-scroll-area::-webkit-scrollbar-thumb, .sidebar-scroll-area::-webkit-scrollbar-thumb, .card-body::-webkit-scrollbar-thumb { background-color: rgba(184, 134, 11, 0.5); border-radius: 10px; }
                .btn-golden { background: linear-gradient(135deg, #D4AF37, #F5C23E); border: none; color: #2C1F14; font-weight: 700; box-shadow: 0 4px 15px rgba(184, 134, 11, 0.35); transition: all 0.3s ease; display: inline-flex; align-items: center; justify-content: center; }
                .btn-golden:hover { background: linear-gradient(135deg, #CAA230, #E8B530); color: #2C1F14; transform: translateY(-2px); box-shadow: 0 8px 25px rgba(184, 134, 11, 0.45); }
            `}</style>
        </div>
    );
};

export default Menu3;
