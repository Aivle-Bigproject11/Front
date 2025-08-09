import React, { useState, useEffect } from 'react';
import { Button, Alert, Card, Form, Row, Col } from 'react-bootstrap';
import { ArrowLeft, Save, User, FileText, MapPin, Building, Briefcase, Phone, Calendar, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { customerService, customerUtils } from '../services/customerService';

const fieldSpecs = {
    funeralCompanyName: { label: '이용 상조회사 이름', type: 'text', group: '상조회사정보', required: true },
    directorName: { label: '담당 장례지도사 이름', type: 'text', disabled: true, group: '상조회사정보' },
    directorPhone: { label: '담당 장례지도사 연락처', type: 'text', disabled: true, group: '상조회사정보' },
    customerId: { label: '상조회사 고객 ID', type: 'text', disabled: true, group: '고인기본정보' },
    deceasedName: { label: '고인 성명 (한글)', type: 'text', disabled: true, group: '고인기본정보', required: true },
    deceasedNameHanja: { label: '고인 성명 (한자)', type: 'text', group: '고인기본정보' },
    deceasedRrn: { label: '고인 주민등록번호', type: 'text', disabled: true, group: '고인기본정보', required: true },
    deceasedAge: { label: '고인 나이', type: 'number', disabled: true, group: '고인기본정보', required: true },
    deceasedBirthOfDate: { label: '고인 생일', type: 'date', disabled: true, group: '고인기본정보', required: true },
    deceasedGender: { label: '고인 성별', type: 'text', disabled: true, group: '고인기본정보', required: true },
    deceasedDate: { label: '고인 돌아가신 날짜', type: 'datetime-local', group: '고인기본정보', required: true },
    deceasedReligion: { label: '고인 종교', type: 'select', group: '고인기본정보', options: ['기독교', '불교', '천주교', '개신교', '무교', '기타'] },
    deceasedRegisteredAddress: { label: '고인 등록기준지', type: 'text', group: '고인기본정보' },
    deceasedAddress: { label: '고인 주소', type: 'text', group: '고인기본정보', required: true },
    deceasedRelationToHouseholdHead: { label: '고인과 세대주와의 관계', type: 'text', group: '고인기본정보', required: true },
    reportRegistrationDate: { label: '사망신고서 시스템 등록일자', type: 'text', disabled: true, group: '사망신고서정보', required: true },
    deathLocation: { label: '사망 장소', type: 'text', group: '사망신고서정보', required: true },
    deathLocationType: { label: '사망 장소 (구분)', type: 'select', group: '사망신고서정보', options: ['주택', '의료기관', '사회복지시설(양로원, 고아원 등)', '공공시설(학교, 운동장 등)', '도로', '상업/서비스시설(상점, 호텔 등)', '산업장', '농장(논밭, 축사, 양식장 등)', '병원 이송 중 사망','기타'], required: true },
    deathLocationEtc: { label: '사망 장소 기타사항', type: 'text', group: '사망신고서정보' },
    deathReportEtc: { label: '사망신고서 기타사항', type: 'text', group: '사망신고서정보' },
    submitterName: { label: '사망신고서 상의 제출인 이름', type: 'text', group: '사망신고서정보' },
    submitterRrn: { label: '제출인 주민등록번호', type: 'text', group: '사망신고서정보' },
    reporterName: { label: '신고인 이름', type: 'text', group: '신고인정보', required: true },
    reporterRrn: { label: '신고인 주민등록번호', type: 'text', group: '신고인정보', required: true },
    reporterQualification: { label: '신고인 자격 (1~4)', type: 'select', group: '신고인정보', options: ['동거친족', '비동거친족', '동거자', '기타(보호시설장/사망장소관리자 등)'], required: true },
    reporterRelationToDeceased: { label: '신고인과 고인의 관계', type: 'text', group: '신고인정보', required: true },
    reporterAddress: { label: '신고인 주소', type: 'text', group: '신고인정보', required: true },
    reporterPhone: { label: '신고인 전화번호', type: 'text', group: '신고인정보', required: true },
    reporterEmail: { label: '신고인 이메일', type: 'email', group: '신고인정보' },
    funeralHomeName: { label: '장례식장 이름', type: 'text', group: '장례정보', required: true },
    funeralHomeAddress: { label: '장례식장 주소', type: 'text', group: '장례정보', required: true },
    funeralDuration: { label: '장례 기간', type: 'text', group: '장례정보', required: true },
    mortuaryInfo: { label: '빈소 정보', type: 'text', group: '장례정보', required: true },
    processionDateTime: { label: '발인 일시', type: 'datetime-local', group: '장례정보', required: true },
    burialSiteInfo: { label: '장지 정보', type: 'text', group: '장례정보', required: true },
    chiefMourners: { label: '상주 목록', type: 'text', group: '장례정보', required: true },
    chiefMournersContact: { label: '상주 연락처', type: 'text', group: '장례정보', required: true },
    chiefMournerAccountHolder: { label: '상주 예금주', type: 'text', group: '장례정보' },
    chiefMournerBankName: { label: '상주 은행명', type: 'select', group: '장례정보', options: ['국민은행', '신한은행', '우리은행', '하나은행', '기업은행', '농협은행', '기타'] },
    chiefMournerAccountNumber: { label: '상주 계좌번호', type: 'text', group: '장례정보' },
    templateKeyword: { label: '사용자가 선택한 고인의 키워드', type: 'text', group: '장례정보', required: true },
};

const formGroups = {
    상조회사정보: Object.keys(fieldSpecs).filter(f => fieldSpecs[f].group === '상조회사정보'),
    고인기본정보: Object.keys(fieldSpecs).filter(f => fieldSpecs[f].group === '고인기본정보'),
    사망신고서정보: Object.keys(fieldSpecs).filter(f => fieldSpecs[f].group === '사망신고서정보'),
    신고인정보: Object.keys(fieldSpecs).filter(f => fieldSpecs[f].group === '신고인정보'),
    장례정보: Object.keys(fieldSpecs).filter(f => fieldSpecs[f].group === '장례정보'),
};

const initialFormData = Object.keys(fieldSpecs).reduce((acc, field) => ({ ...acc, [field]: '' }), {});

const Menu1_2 = () => {
    const [formData, setFormData] = useState(initialFormData);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [saving, setSaving] = useState(false);
    const [animateCard, setAnimateCard] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [validationStatus, setValidationStatus] = useState('검토 전');
    const [reviewSuggestions, setReviewSuggestions] = useState({});
    
    const navigate = useNavigate();

    useEffect(() => {
        const customerData = localStorage.getItem('selectedCustomer');
        if (customerData) {
            const customer = JSON.parse(customerData);
            setSelectedCustomer(customer);
            
            const initialData = { ...initialFormData };
            initialData.customerId = customer.id || '';
            initialData.deceasedName = customer.name || '';
            initialData.deceasedAge = customer.age || '';
            initialData.deceasedAddress = customer.location || '';
            initialData.deceasedDate = customer.funeralDate ? new Date(customer.funeralDate).toISOString().slice(0, 16) : '';
            setFormData(initialData);
        } else {
            navigate('/menu1-1');
        }
        setAnimateCard(true);
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'reporterPhone' || name === 'chiefMournersContact') {
            const numbers = value.replace(/[^0-9]/g, '');
            if (numbers.length <= 11) {
                formattedValue = numbers.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
                setFormData(prev => ({ ...prev, [name]: formattedValue }));
            }
        } else if (name === 'reporterRrn' || name === 'submitterRrn') {
            const numbers = value.replace(/[^0-9]/g, '');
            if (numbers.length <= 13) {
                formattedValue = numbers.replace(/(\d{6})(\d{0,7})/, '$1-$2').replace("--", "-");
                setFormData(prev => ({ ...prev, [name]: formattedValue }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        
        setValidationStatus('검토 전');
    };

    const handleReview = async () => {
        setValidationStatus('검토 중');
        setReviewSuggestions({});
        setErrorMessage('');
        setSuccessMessage('');

        // 1. 필수 필드 검사
        const missingRequiredFields = Object.keys(fieldSpecs).filter(fieldName => {
            const field = fieldSpecs[fieldName];
            // 비활성화되지 않은 필수 필드만 검사
            return field.required && !field.disabled && !formData[fieldName];
        });

        if (missingRequiredFields.length > 0) {
            const newSuggestions = {};
            missingRequiredFields.forEach(field => {
                newSuggestions[field] = '필수 입력 항목입니다.';
            });
            setReviewSuggestions(newSuggestions);
            setErrorMessage('필수 입력 항목을 모두 채워주세요.');
            setValidationStatus('수정 필요');
            return;
        }

        // 2. 백엔드 API 호출 시뮬레이션 (AI 검토)
        await new Promise(resolve => setTimeout(resolve, 1000));

        const suggestions = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{2,3}-\d{3,4}-\d{4}$/;
        const rrnRegex = /^\d{6}-\d{7}$/;

        if (formData.reporterEmail && !emailRegex.test(formData.reporterEmail)) {
            suggestions.reporterEmail = '이메일 형식이 올바르지 않습니다. (예: user@example.com)';
        }
        if (formData.reporterPhone && !phoneRegex.test(formData.reporterPhone)) {
            suggestions.reporterPhone = '전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)';
        }
        if (formData.reporterRrn && !rrnRegex.test(formData.reporterRrn)) {
            suggestions.reporterRrn = '주민등록번호 형식이 올바르지 않습니다. (예: 900101-1234567)';
        }
        if (formData.submitterRrn && !rrnRegex.test(formData.submitterRrn)) {
            suggestions.submitterRrn = '주민등록번호 형식이 올바르지 않습니다. (예: 900101-1234567)';
        }

        if (Object.keys(suggestions).length > 0) {
            setValidationStatus('수정 필요'); // 상태는 변경하지만 저장은 활성화
            setReviewSuggestions(suggestions);
            setErrorMessage('수정이 필요한 항목이 있습니다. 각 항목에 마우스를 올려 확인해주세요.');
        } else {
            setSuccessMessage('모든 항목이 검토되었습니다.');
        }
        setValidationStatus('검토 완료'); // 검토 후에는 항상 저장 가능하도록 상태 변경
    };

    const handleSave = async () => {
        if (validationStatus !== '검토 완료') {
            setErrorMessage('저장하기 전에 검토를 완료해야 합니다.');
            return;
        }
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Button
                                onClick={handleReview}
                                disabled={validationStatus === '검토 중'}
                                className="review-btn"
                            >
                                {validationStatus === '검토 중' ? '검토 중...' : '검토'}
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={saving || validationStatus !== '검토 완료'}
                                className="save-btn"
                            >
                                {saving ? '저장 중...' : <><Save size={16} style={{ marginRight: '8px' }} /> 저장</>}
                            </Button>
                        </div>
                    </div>
                    
                    {successMessage && <Alert variant="success" className="mb-4 flex-shrink-0">{successMessage}</Alert>}
                    {errorMessage && <Alert variant="danger" className="mb-4 flex-shrink-0">{errorMessage}</Alert>}

                    <div className="form-scroll-area" style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
                        {Object.entries(formGroups).map(([groupName, fields]) => (
                            <Card key={groupName} className="mb-4" style={{ background: 'rgba(253, 251, 243, 0.92)', border: '1px solid rgba(184, 134, 11, 0.2)' }}>
                                <Card.Header style={{ background: 'rgba(184, 134, 11, 0.08)', borderBottom: '1px solid rgba(184, 134, 11, 0.15)'}}><h5 style={{ margin: 0, display: 'flex', alignItems: 'center', color: '#2C1F14', fontWeight: '600' }}>{getGroupIcon(groupName)}<span style={{ marginLeft: '8px' }}>{groupName}</span></h5></Card.Header>
                                <Card.Body>
                                    <Row className="g-3">
                                        {fields.map((fieldName) => {
                                            const field = fieldSpecs[fieldName];
                                            if (fieldName === 'deathLocationEtc' && formData.deathLocationType !== '기타') {
                                                return null;
                                            }
                                            return (
                                                <Col md={4} key={fieldName}>
                                                    <Form.Group>
                                                        <Form.Label style={{ color: '#4A3728' }}>{field.label}</Form.Label>
                                                        <div style={{ position: 'relative' }} title={reviewSuggestions[fieldName] || ''}>
                                                            {field.type === 'select' ? (
                                                                <Form.Select
                                                                    name={fieldName}
                                                                    value={formData[fieldName]}
                                                                    onChange={handleInputChange}
                                                                    disabled={field.disabled}
                                                                    style={reviewSuggestions[fieldName] ? { borderColor: 'red' } : {}}
                                                                >
                                                                    <option value="">선택하세요</option>
                                                                    {field.options.map(option => (
                                                                        <option key={option} value={option}>{option}</option>
                                                                    ))}
                                                                </Form.Select>
                                                            ) : (
                                                                <Form.Control
                                                                    type={field.type || 'text'}
                                                                    name={fieldName}
                                                                    value={formData[fieldName]}
                                                                    onChange={handleInputChange}
                                                                    placeholder={`${field.label} 입력`}
                                                                    readOnly={field.disabled}
                                                                    className={field.disabled ? 'form-input-readonly' : ''}
                                                                    style={reviewSuggestions[fieldName] ? { borderColor: 'red' } : {}}
                                                                />
                                                            )}
                                                        </div>
                                                    </Form.Group>
                                                </Col>
                                            );
                                        })}
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
                .form-control:focus, .form-select:focus { box-shadow: 0 0 0 3px rgba(184, 134, 11, 0.2) !important; border-color: #B8860B !important; }
                .form-input-readonly {
                  background-color: rgba(184, 134, 11, 0.1) !important;
                  color: #4A3728 !important;
                  cursor: not-allowed !important;
                }

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

                .review-btn {
                    padding: 10px 24px;
                    font-size: 16px;
                    font-weight: 700;
                    border: 1px solid #B8860B;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    color: #B8860B;
                    background-color: transparent;
                }

                .review-btn:hover {
                    background-color: #B8860B;
                    color: white;
                }

                .review-btn:disabled {
                    background-color: #e9ecef;
                    border-color: #ced4da;
                    color: #6c757d;
                    cursor: not-allowed;
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