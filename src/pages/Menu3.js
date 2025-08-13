import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Modal, Spinner } from 'react-bootstrap';
import { Mail, Send, Search, Edit, CheckCircle } from 'lucide-react'; 
import { recommendationService } from '../services/api';


const Menu3 = () => {
    // === 상태 관리 ===
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [animateCard, setAnimateCard] = useState(false);
    const [isSearched, setIsSearched] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const [filters, setFilters] = useState({
        id: '', name: '', age: '', gender: [], disease: [], isMarried: [], hasChildren: []
    });

    const [selectedCustomerForHistory, setSelectedCustomerForHistory] = useState(null);
    const [messageHistory, setMessageHistory] = useState([]);
    const [messagePreview, setMessagePreview] = useState('');
    const [generatedMessageData, setGeneratedMessageData] = useState(null);
    const [showTransmissionCompletePopup, setShowTransmissionCompletePopup] = useState(false);
    
    const [isEditing, setIsEditing] = useState(false);

    // === 데이터 로딩 및 필터링 로직 (useEffect) ===
    useEffect(() => {
        setAnimateCard(true);
    }, []);

    // === 핸들러 및 헬퍼 함수 ===
    const handleInputChange = (e) => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleCheckboxChange = (e) => {
        const { name, value, checked } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: checked ? [value] : []
        }));
    };

    const isDetailedFilterEmpty = (filters) => {
        if (filters.id || filters.name || filters.age) return false;
        if (filters.gender.length > 0 || filters.disease.length > 0 || filters.isMarried.length > 0 || filters.hasChildren.length > 0) return false;
        return true;
    };

    const formatKST = (dateString) => {
        if (!dateString) return '';
        
        const utcDateString = dateString.endsWith('Z') ? dateString : dateString + 'Z';
        const date = new Date(utcDateString);

        const formatter = new Intl.DateTimeFormat('ko-KR', {
            timeZone: 'Asia/Seoul',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        });

        return formatter.format(date);
    };

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        setFilteredCustomers([]);
        try {
            let response;
            if (isDetailedFilterEmpty(filters)) {
                response = await recommendationService.getAllCustomers();
            } else {
                const apiParams = {
                    ageGroup: filters.age || undefined,
                    gender: filters.gender.length > 0 ? (filters.gender[0] === '남' ? '남성' : '여성') : undefined,
                    disease: filters.disease.length > 0 ? filters.disease[0] : undefined,
                    isMarried: filters.isMarried.length > 0 ? (filters.isMarried[0] === '기혼') : undefined,
                    hasChildren: filters.hasChildren.length > 0 ? (filters.hasChildren[0] === '유') : undefined,
                };
                Object.keys(apiParams).forEach(key => apiParams[key] === undefined && delete apiParams[key]);
                response = await recommendationService.getFilteredCustomers(apiParams);
            }
            let customers = response.data;
            if (filters.id) {
                customers = customers.filter(c => String(c.id).includes(filters.id));
            }
            if (filters.name) {
                customers = customers.filter(c => c.name.toLowerCase().includes(filters.name.toLowerCase()));
            }
            setFilteredCustomers(customers);
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

    const handleHistoryClick = async (customer) => {
        setSelectedCustomerForHistory(customer);
        setMessageHistory([]);
        try {
            const response = await recommendationService.getLatestCustomerHistory(customer.id);
            if (response.data && Object.keys(response.data).length > 0) {
                setMessageHistory([response.data]);
            } else {
                setMessageHistory([]);
            }
        } catch (err) {
            console.error("발송 기록 로딩에 실패했습니다.", err);
            setMessageHistory([]);
        }
    };

    const handleGenerateMessage = async () => {
        if (filteredCustomers.length === 0) {
            alert("메시지를 생성할 고객이 없습니다. 먼저 고객을 조회해주세요.");
            return;
        }
        setIsGenerating(true);
        setMessagePreview('');
        setGeneratedMessageData(null);
        setIsEditing(false); 

        try {
            let familyValue;
            if (filters.hasChildren.includes('유')) familyValue = '자녀';
            else if (filters.isMarried.includes('기혼')) familyValue = '기혼';
            else if (filters.isMarried.includes('미혼')) familyValue = '미혼';

            const requestData = {
                ageGroup: filters.age || undefined,
                gender: filters.gender.length > 0 ? (filters.gender[0] === '남' ? '남성' : '여성') : undefined,
                disease: filters.disease[0] || undefined,
                family: familyValue,
            };
            
            const response = await recommendationService.generatePreviewMessage(requestData);
            setGeneratedMessageData(response.data);

            const { service1, service2, service1DetailedUrl, service2DetailedUrl, message } = response.data;
            let formattedMessage = `[추천된 전환서비스]\n- ${service1 || '추천 서비스 없음'}`;
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
    
    const handleToggleEdit = () => {
        setIsEditing(!isEditing);
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
            const filterCriteria = {
                ageGroup: filters.age || undefined,
                gender: filters.gender.length > 0 ? (filters.gender[0] === '남' ? '남성' : '여성') : undefined,
                disease: filters.disease[0] || undefined,
                family: generatedMessageData.family || undefined,
            };
            Object.keys(filterCriteria).forEach(key => filterCriteria[key] === undefined && delete filterCriteria[key]);

            const requestBody = {
                message: messagePreview,
                serviceId1: generatedMessageData.serviceId1,
                serviceId2: generatedMessageData.serviceId2,
                imageUrl1: generatedMessageData.service1ImageUrl, 
                imageUrl2: generatedMessageData.service2ImageUrl, 
                detailedUrl1: generatedMessageData.detailedUrl1,
                detailedUrl2: generatedMessageData.detailedUrl2,
                filterCriteria: filterCriteria,
            };

            await recommendationService.sendGroupMessage(requestBody);

            setShowTransmissionCompletePopup(true);
            setMessagePreview('');
            setGeneratedMessageData(null);
            setIsEditing(false);

        } catch (err) {
            console.error("메시지 전송에 실패했습니다.", err);
            alert("메시지 전송 중 오류가 발생했습니다.");
        }
    };

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
                                <div className="d-flex align-items-center mb-2"><strong className="me-3" style={{minWidth: '40px', color: '#4A3728'}}>성별:</strong><Form.Check inline type="checkbox" label="남" name="gender" value="남" checked={filters.gender.includes('남')} onChange={handleCheckboxChange} /><Form.Check inline type="checkbox" label="여" name="gender" value="여" checked={filters.gender.includes('여')} onChange={handleCheckboxChange} /></div>
                                <div className="d-flex align-items-center mb-2"><strong className="me-3" style={{minWidth: '40px', color: '#4A3728'}}>질병:</strong><Form.Check inline type="checkbox" label="유" name="disease" value="유" checked={filters.disease.includes('유')} onChange={handleCheckboxChange} /><Form.Check inline type="checkbox" label="무" name="disease" value="무" checked={filters.disease.includes('무')} onChange={handleCheckboxChange} /></div>
                                <div className="d-flex align-items-center mb-2"><strong className="me-3" style={{minWidth: '40px', color: '#4A3728'}}>결혼:</strong><Form.Check inline type="checkbox" label="기혼" name="isMarried" value="기혼" checked={filters.isMarried.includes('기혼')} onChange={handleCheckboxChange} /><Form.Check inline type="checkbox" label="미혼" name="isMarried" value="미혼" checked={filters.isMarried.includes('미혼')} onChange={handleCheckboxChange} /></div>
                                <div className="d-flex align-items-center mb-3"><strong className="me-3" style={{minWidth: '40px', color: '#4A3728'}}>자녀:</strong><Form.Check inline type="checkbox" label="유" name="hasChildren" value="유" checked={filters.hasChildren.includes('유')} onChange={handleCheckboxChange} /><Form.Check inline type="checkbox" label="무" name="hasChildren" value="무" checked={filters.hasChildren.includes('무')} onChange={handleCheckboxChange} /></div>
                                <Row className="g-3">
                                    <Col xs={12}>
                                        <Form.Label style={{color: '#4A3728'}}>나이대</Form.Label>
                                        <Form.Select name="age" value={filters.age} onChange={handleInputChange}>
                                            <option value="">전체</option>
                                            <option value="20대">20대</option>
                                            <option value="30대">30대</option>
                                            <option value="40대">40대</option>
                                            <option value="50대">50대</option>
                                            <option value="60대 이상">60대 이상</option>
                                        </Form.Select>
                                    </Col>
                                </Row>
                                <Button className="btn-search" onClick={handleSearch}><Search size={18} className="me-2" />고객 조회</Button>
                            </Form>
                        </div>
                    </div>

                    <div className="dashboard-right" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, paddingBottom: '10px' }}>
                            <h5 style={{ fontWeight: '600', color: '#2C1F14', margin: 0 }}>고객 목록 ({isSearched ? filteredCustomers.length : 0}명)</h5>
                            <Button className="btn-golden" onClick={handleGenerateMessage} disabled={!isSearched || filteredCustomers.length === 0}><Send size={16} className="me-2"/>메시지 생성</Button>
                        </div>
                        
                        <div className="content-scroll-area" style={{ flex: 1, overflowY: 'auto', paddingRight: '10px', background: 'rgba(0,0,0,0.02)', borderRadius: '12px' }}>
                           {/* 고객 목록 렌더링 */}
                           {loading ? (
                                <div className="d-flex justify-content-center align-items-center h-100"><Spinner animation="border" style={{ color: '#B8860B' }}/></div>
                            ) : !isSearched ? (
                                <div className="d-flex justify-content-center align-items-center h-100 text-center text-muted">
                                    <div><Search size={48} className="mb-3" /><p>좌측 필터에서 조건을 선택하고<br/>'고객 조회' 버튼을 눌러주세요.</p></div>
                                </div>
                            ) : filteredCustomers.length > 0 ? (
                                filteredCustomers.map(customer => (
                                    <Card key={customer.id} className="mb-3" style={{ background: 'rgba(253, 251, 243, 0.92)', border: '1px solid rgba(184, 134, 11, 0.2)' }}>
                                        <Card.Body>
                                            <Row className="align-items-center">
                                                <Col md={3} className="text-center text-md-start mb-3 mb-md-0 border-end pe-md-3"><p className="text-muted mb-1" style={{ fontSize: '0.85rem' }}>고객ID: {customer.id}</p><h5 className="fw-bold mb-0" style={{color: '#2C1F14'}}>{customer.name}</h5></Col>
                                                <Col>
                                                    <Row>
                                                        <Col sm={6} className="mb-2"><strong>생년월일:</strong> {customer.birthDate?.split('T')[0]}</Col>
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
                                        <div><p>선택하신 조건에 맞는 고객 정보가 없습니다.</p></div>
                                    </div>
                            )}
                        </div>
                        
                        <div className="mt-3" style={{ flexShrink: 0, height: '350px' }}>
                            <Row style={{ height: '100%' }}>
                                <Col lg={6} className="mb-3 mb-lg-0" style={{ height: '100%' }}>
                                    <Card style={{ background: 'rgba(253, 251, 243, 0.92)', border: '1px solid rgba(184, 134, 11, 0.2)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <Card.Header as="h5" style={{color: '#2C1F14', background: 'rgba(184, 134, 11, 0.1)', flexShrink: 0}}>메시지 미리보기</Card.Header>
                                        <Card.Body className="d-flex flex-column" style={{ flexGrow: 1, overflowY: 'auto' }}>
                                            <Form.Control as="textarea" rows={8} value={messagePreview} onChange={(e) => setMessagePreview(e.target.value)} readOnly={!isEditing} className="mb-3 flex-grow-1" style={{whiteSpace: 'pre-wrap', backgroundColor: isEditing ? '#fff' : '#f8f9fa'}} />
                                            <div className="d-flex justify-content-end gap-2">
                                                <Button variant="secondary" onClick={handleToggleEdit} disabled={!messagePreview}>
                                                    {isEditing ? <CheckCircle size={16} className="me-2"/> : <Edit size={16} className="me-2"/>}
                                                    {isEditing ? '수정 완료' : '메시지 수정'}
                                                </Button>
                                                <Button className="btn-golden" onClick={handleSendMessage} disabled={!messagePreview || isEditing}>
                                                    <Send size={16} className="me-2"/>
                                                    메시지 전송
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col lg={6} style={{ height: '100%' }}>
                                    <Card style={{ background: 'rgba(253, 251, 243, 0.92)', border: '1px solid rgba(184, 134, 11, 0.2)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <Card.Header as="h5" style={{color: '#2C1F14', background: 'rgba(184, 134, 11, 0.1)', flexShrink: 0}}>
                                            {selectedCustomerForHistory ? `${selectedCustomerForHistory.name}님의 메시지 발송 기록` : '메시지 발송 기록'}
                                        </Card.Header>
                                        <Card.Body style={{flexGrow: 1, overflowY: 'auto'}}>
                                            {selectedCustomerForHistory ? (
                                                messageHistory.length > 0 ? (
                                                    messageHistory.map(history => {
                                                        const recommendedServices = [];
                                                        if (history.imageUrl1) {
                                                            recommendedServices.push({ 
                                                                serviceName: `추천 서비스 1 (ID: ${history.serviceId1})`, 
                                                                imageUrl: history.imageUrl1 
                                                            });
                                                        }
                                                        if (history.imageUrl2) {
                                                            recommendedServices.push({ 
                                                                serviceName: `추천 서비스 2 (ID: ${history.serviceId2})`, 
                                                                imageUrl: history.imageUrl2 
                                                            });
                                                        }

                                                        return (
                                                            <div key={history.id} className="mb-4">
                                                                <h6><strong>발송일시:</strong> {formatKST(history.createMessageDate)}</h6>
                                                                {recommendedServices.length > 0 && (
                                                                    <div className="d-flex gap-2 my-2">
                                                                        {recommendedServices.map(service => (
                                                                            <img key={service.serviceName} src={service.imageUrl} alt={service.serviceName} style={{width: '40%', borderRadius: '8px', border: '1px solid #ddd'}} //이미지 크기 
                                                                                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/300x200/EEE/333?text=Image+Error'; }} />
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                <p style={{whiteSpace: 'pre-wrap', fontSize: '0.9rem', background: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #eee'}}>{history.message}</p>
                                                                <hr/>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <p className="text-muted"><strong>{selectedCustomerForHistory.name}</strong>님의 발송 기록이 없습니다.</p>
                                                )
                                            ) : (
                                                <p className="text-muted">고객 목록에서 '발송기록' 버튼을 클릭하여 확인하세요.</p>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
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

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } 
                .dashboard-container.animate-in { animation: fadeIn 0.6s ease-out forwards; }
                .content-scroll-area::-webkit-scrollbar, .sidebar-scroll-area::-webkit-scrollbar, .card-body::-webkit-scrollbar { width: 6px; }
                .content-scroll-area::-webkit-scrollbar-track, .sidebar-scroll-area::-webkit-scrollbar-track, .card-body::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); border-radius: 10px; }
                .content-scroll-area::-webkit-scrollbar-thumb, .sidebar-scroll-area::-webkit-scrollbar-thumb, .card-body::-webkit-scrollbar-thumb { background-color: rgba(184, 134, 11, 0.5); border-radius: 10px; }
                .btn-golden { background: linear-gradient(135deg, #D4AF37, #F5C23E); border: none; color: #2C1F14; font-weight: 700; box-shadow: 0 4px 15px rgba(184, 134, 11, 0.35); transition: all 0.3s ease; display: inline-flex; align-items: center; justify-content: center; }
                .btn-golden:hover { background: linear-gradient(135deg, #CAA230, #E8B530); color: #2C1F14; transform: translateY(-2px); box-shadow: 0 8px 25px rgba(184, 134, 11, 0.45); }
                .btn-golden:disabled { background: #ccc; box-shadow: none; transform: none; }
                
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
