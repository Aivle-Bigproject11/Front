import React, { useState, useEffect } from 'react';
import { Button, Alert, Card, Form, Row, Col } from 'react-bootstrap';
import { ArrowLeft, Save, User, Users, FileText, MapPin, Phone, Calendar, Building, Briefcase, Heart, Home, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { customerService, customerUtils } from '../services/customerService';

const newFormGroups = {
    상조회사정보: ['상조회사이름', '담당장례지도사이름', '담당장례지도사연락처'],
    고인기본정보: ['상조회사고객ID', '고인성명한글', '고인성명한자', '고인주민등록번호', '고인나이', '고인생일', '고인성별', '고인돌아가신날짜', '고인종교', '고인등록기준지', '고인주소', '고인과세대주와의관계'],
    사망신고서정보: ['사망신고서시스템등록일자', '사망장소', '사망장소구분', '사망장소기타사항', '사망신고서기타사항', '사망신고서상의제출인이름', '제출인주민등록번호'],
    신고인정보: ['신고인이름', '신고인주민등록번호', '신고인자격', '신고인과고인의관계', '신고인주소', '신고인전화번호', '신고인이메일'],
    장례정보: ['장례식장이름', '장례식장주소', '장례식장주소URL', '장례기간', '빈소정보', '발인일시', '장지정보', '상주목록', '상주연락처', '상주예금주', '상주은행명', '상주계좌번호', '사용자선택고인키워드'],
};

const fieldLabels = {
    상조회사이름: '상조회사 이름', 담당장례지도사이름: '담당 장례지도사 이름', 담당장례지도사연락처: '담당 장례지도사 연락처',
    상조회사고객ID: '상조회사 고객 ID', 고인성명한글: '고인 성명 (한글)', 고인성명한자: '고인 성명 (한자)', 고인주민등록번호: '고인 주민등록번호', 고인나이: '고인 나이', 고인생일: '고인 생일', 고인성별: '고인 성별', 고인돌아가신날짜: '고인 돌아가신 날짜', 고인종교: '고인 종교', 고인등록기준지: '고인 등록기준지', 고인주소: '고인 주소', 고인과세대주와의관계: '고인과 세대주의 관계',
    사망신고서시스템등록일자: '사망신고서 시스템 등록일자', 사망장소: '사망 장소', 사망장소구분: '사망 장소 (구분)', 사망장소기타사항: '사망 장소 기타사항', 사망신고서기타사항: '사망신고서 기타사항', 사망신고서상의제출인이름: '사망신고서 상의 제출인 이름', 제출인주민등록번호: '제출인 주민등록번호',
    신고인이름: '신고인 이름', 신고인주민등록번호: '신고인 주민등록번호', 신고인자격: '신고인 자격 (1~4)', 신고인과고인의관계: '신고인과 고인의 관계', 신고인주소: '신고인 주소', 신고인전화번호: '신고인 전화번호', 신고인이메일: '신고인 이메일',
    장례식장이름: '장례식장 이름', 장례식장주소: '장례식장 주소', 장례식장주소URL: '장례식장 주소 URL (QR코드)', 장례기간: '장례 기간', 빈소정보: '빈소 정보', 발인일시: '발인 일시', 장지정보: '장지 정보', 상주목록: '상주 목록', 상주연락처: '상주 연락처', 상주예금주: '상주 예금주', 상주은행명: '상주 은행명', 상주계좌번호: '상주 계좌번호', 사용자선택고인키워드: '사용자가 선택한 고인의 키워드',
};

const initialFormData = Object.values(newFormGroups).flat().reduce((acc, field) => ({ ...acc, [field]: '' }), {});

const Menu1_2 = () => {
    const [formData, setFormData] = useState(initialFormData);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [saving, setSaving] = useState(false);
    const [animateCard, setAnimateCard] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    const navigate = useNavigate();

    useEffect(() => {
        const customerData = localStorage.getItem('selectedCustomer');
        if (customerData) {
            const customer = JSON.parse(customerData);
            setSelectedCustomer(customer);
            
            setFormData(prev => ({
                ...prev,
                상조회사고객ID: customer.id || '',
                고인성명한글: customer.name || '',
                고인나이: customer.age || '',
                고인전화번호: customer.phone || '',
                고인주소: customer.location || '',
                고인돌아가신날짜: customer.funeralDate || '',
            }));
        } else {
            navigate('/menu1-1');
            return;
        }
        setAnimateCard(true);
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setSuccessMessage('');
        setErrorMessage('');
        try {
            setSaving(true);
            await customerService.updateCustomer(selectedCustomer.id, {
                ...selectedCustomer,
                formData: formData
            });
            setSuccessMessage('장례 정보가 성공적으로 저장되었습니다.');
            setTimeout(() => navigate('/menu1-1'), 2000);
        } catch (error) {
            console.error('Error saving form data:', error);
            setErrorMessage('저장 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => navigate('/menu1-1');
    const getGroupIcon = (groupName) => ({
        상조회사정보: <Building size={20} color="#B8860B"/>,
        고인기본정보: <User size={20} color="#B8860B"/>,
        사망신고서정보: <FileText size={20} color="#B8860B"/>,
        신고인정보: <Briefcase size={20} color="#B8860B"/>,
        장례정보: <MapPin size={20} color="#B8860B"/>
    }[groupName] || <FileText size={20} color="#B8860B"/>);

    if (!selectedCustomer) { return <div>고객 정보를 불러오는 중...</div>; }

    return (
        <div className="page-wrapper" style={{
            '--navbar-height': '62px', height: 'calc(100vh - var(--navbar-height))',
            background: 'linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%)',
            padding: '20px', boxSizing: 'border-box', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
        }}>
            <div className={`dashboard-container ${animateCard ? 'animate-in' : ''}`} style={{
                position: 'relative', zIndex: 1, width: '100%', maxWidth: '1600px', height: '100%',
                margin: '0 auto', display: 'flex', boxSizing: 'border-box',
                background: 'rgba(255, 251, 235, 0.95)',
                boxShadow: '0 20px 60px rgba(44, 31, 20, 0.4)',
                backdropFilter: 'blur(15px)', border: '2px solid rgba(184, 134, 11, 0.35)',
                borderRadius: '28px', padding: '20px', gap: '20px', overflow: 'hidden',
            }}>
                <div style={{ flex: '0 0 400px', display: 'flex', flexDirection: 'column' }}>
                    <h4 className="mb-3" style={{ fontSize: '30px', fontWeight: '700', color: '#2C1F14', paddingLeft: '10px' }}>
                        장례정보 등록
                    </h4>
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.12) 0%, rgba(205, 133, 63, 0.08) 100%)', 
                        borderRadius: '15px', padding: '20px',
                        height: 'min-content', position: 'sticky', top: '20px',
                        border: '1px solid rgba(184, 134, 11, 0.2)'
                    }}>
                        <div style={{ width: '120px', height: '120px', background: 'rgba(184, 134, 11, 0.15)', borderRadius: '50%', margin: '0 auto 30px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(44, 31, 20, 0.2)' }}>
                            <FileText size={48} style={{ color: '#B8860B' }} />
                        </div>
                        <h2 style={{ fontWeight: '700', fontSize: '1.8rem', textAlign: 'center', color: '#2C1F14' }}>
                            {selectedCustomer.name}님 정보
                        </h2>
                        <p style={{ fontSize: '16px', lineHeight: '1.6', opacity: 0.9, textAlign: 'center', color: '#4A3728' }}>
                            고객님의 장례정보를<br/>정확하게 입력해주세요.
                        </p>
                        <div style={{ marginTop: '30px', borderTop: '1px solid rgba(184, 134, 11, 0.2)', paddingTop: '20px'}}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}><User size={16} style={{ color: '#B8860B', marginRight: '10px' }} /><span style={{fontWeight: 500, color: '#4A3728'}}>{selectedCustomer.name} (향년 {selectedCustomer.age}세)</span></div>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}><Phone size={16} style={{ color: '#B8860B', marginRight: '10px' }} /><span style={{fontWeight: 500, color: '#4A3728'}}>{selectedCustomer.phone}</span></div>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}><Calendar size={16} style={{ color: '#B8860B', marginRight: '10px' }} /><span style={{fontWeight: 500, color: '#4A3728'}}>별세일: {customerUtils.formatDate(selectedCustomer.funeralDate)}</span></div>
                            <div style={{ display: 'flex', alignItems: 'center' }}><Home size={16} style={{ color: '#B8860B', marginRight: '10px' }} /><span style={{fontWeight: 500, color: '#4A3728'}}>주소 : {selectedCustomer.location}</span></div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-right" style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0 20px 0', borderBottom: '1px solid rgba(184, 134, 11, 0.2)', marginBottom: '20px', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <button
                                onClick={handleCancel}
                                className="back-btn"
                            >
                                <ArrowLeft size={16} style={{ marginRight: '6px' }} />
                                돌아가기
                            </button>
                            <h3 style={{ color: '#2C1F14', fontWeight: '600', fontSize: '1.5rem', margin: 0 }}>
                                상세 정보 입력
                            </h3>
                        </div>
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="save-btn"
                        >
                            {saving ? '저장 중...' : <><Save size={16} style={{ marginRight: '8px' }} /> 저장</>}
                        </Button>
                    </div>
                    
                    {successMessage && <Alert variant="success" className="mb-4 flex-shrink-0">{successMessage}</Alert>}
                    {errorMessage && <Alert variant="danger" className="mb-4 flex-shrink-0">{errorMessage}</Alert>}

                    <div className="form-scroll-area" style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
                        {Object.entries(newFormGroups).map(([groupName, fields]) => (
                            <Card key={groupName} className="mb-4" style={{ background: 'rgba(253, 251, 243, 0.92)', border: '1px solid rgba(184, 134, 11, 0.2)' }}>
                                <Card.Header style={{ background: 'rgba(184, 134, 11, 0.08)', borderBottom: '1px solid rgba(184, 134, 11, 0.15)'}}><h5 style={{ margin: 0, display: 'flex', alignItems: 'center', color: '#2C1F14', fontWeight: '600' }}>{getGroupIcon(groupName)}<span style={{ marginLeft: '8px' }}>{groupName}</span></h5></Card.Header>
                                <Card.Body>
                                    <Row className="g-3">
                                        {fields.map((fieldName) => (
                                            <Col md={4} key={fieldName}>
                                                <Form.Group>
                                                    <Form.Label style={{ color: '#4A3728' }}>{fieldLabels[fieldName] || fieldName}</Form.Label>
                                                    <Form.Control
                                                        type="text" 
                                                        name={fieldName} 
                                                        value={formData[fieldName]}
                                                        onChange={handleInputChange} 
                                                        placeholder={`${fieldLabels[fieldName] || fieldName} 입력`}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        ))}
                                    </Row>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .dashboard-container { opacity: 0; }
                .dashboard-container.animate-in { opacity: 1; animation: fadeIn 0.6s ease-out; }
                .form-scroll-area::-webkit-scrollbar { width: 6px; }
                .form-scroll-area::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); border-radius: 10px; }
                .form-scroll-area::-webkit-scrollbar-thumb { background-color: rgba(184, 134, 11, 0.5); border-radius: 10px; }
                .form-control:focus { box-shadow: 0 0 0 3px rgba(184, 134, 11, 0.2) !important; border-color: #B8860B !important; }

                .back-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 20px;
                    background: linear-gradient(135deg, #4A3728, #8B5A2B);
                    border: none;
                    color: white;
                    font-weight: 700;
                    font-size: 14px;
                    box-shadow: 0 2px 8px rgba(74, 55, 40, 0.35);
                    transition: all 0.3s ease;
                    border-radius: 12px;
                    cursor: pointer;
                }
                .back-btn:hover {
                    background: linear-gradient(135deg, #3c2d20, #7a4e24);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(74, 55, 40, 0.45);
                }

                .save-btn {
                    padding: 10px 24px;
                    font-size: 16px;
                    font-weight: 700;
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    color: #2C1F14;
                    background: linear-gradient(135deg, #D4AF37, #F5C23E);
                    box-shadow: 0 4px 15px rgba(184, 134, 11, 0.35);
                }
                .save-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(184, 134, 11, 0.45);
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
                    .dashboard-left {
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
        </div>
    );
};

export default Menu1_2;
