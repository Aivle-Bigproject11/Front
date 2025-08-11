import React, { useState, useEffect } from 'react';
import { Button, Alert, Badge, Modal, Row, Col } from 'react-bootstrap';
import { ArrowLeft, FileText, Calendar, Download, Check, Loader, User, Building, Home, Files } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { customerService, customerUtils } from '../services/customerService';
import { documentService, documentUtils } from '../services/documentService';
import { apiService } from '../services/api';

const Menu1_3 = () => {
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [formData, setFormData] = useState({});
    const [selectedDoc, setSelectedDoc] = useState('obituary');
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [animateCard, setAnimateCard] = useState(false);
    const [previewContent, setPreviewContent] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [bulkAction, setBulkAction] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        initializePage();
    }, []);

    const initializePage = async () => {
        try {
            let customer = null;
            const customerData = localStorage.getItem('selectedCustomer');
            if (customerData) {
                customer = JSON.parse(customerData);
            }

            if (!customer) {
                navigate('/menu1-1');
                return;
            }
            setSelectedCustomer(customer);
            setFormData(customer); // Assuming customer object contains formData directly or can be used as such

            const customerId = customer.id; // Define customerId here
            const [obituaryRes, deathReportRes, scheduleRes] = await Promise.allSettled([
                apiService.getObituaryByCustomerId(customerId),
                apiService.getDeathReportByCustomerId(customerId),
                apiService.getScheduleByCustomerId(customerId)
            ]);

            if (obituaryRes.status === 'fulfilled') {
                // Process obituary data
                console.log('Obituary Data:', obituaryRes.value.data);
                // You might want to store this data in state or integrate it into formData
            } else {
                console.error('Failed to fetch obituary:', obituaryRes.reason);
            }

            if (deathReportRes.status === 'fulfilled') {
                // Process death report data
                console.log('Death Report Data:', deathReportRes.value.data);
            } else {
                console.error('Failed to fetch death report:', deathReportRes.reason);
            }

            if (scheduleRes.status === 'fulfilled') {
                // Process schedule data
                console.log('Schedule Data:', scheduleRes.value.data);
            } else {
                console.error('Failed to fetch schedule:', scheduleRes.reason);
            }

            await loadPreview('obituary', customer);
        } catch (error) {
            console.error('Error initializing page:', error);
            setErrorMessage('페이지를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
            setAnimateCard(true);
        }
    };

    const loadPreview = async (docType, data) => {
        try {
            const preview = await documentService.previewDocument(docType, data);
            setPreviewContent(preview);
        } catch (error) {
            setPreviewContent({ title: '미리보기 오류', content: '미리보기를 불러올 수 없습니다.' });
        }
    };

    const handleDocumentSelect = (docType) => {
        setSelectedDoc(docType);
        loadPreview(docType, formData);
    };

    const handleGenerateDocument = async (docType) => {
        try {
            setGenerating(true);
            setSuccessMessage('');
            setErrorMessage('');
            const validation = documentUtils.validateRequiredFields(docType, formData);
            if (!validation.isValid) {
                setErrorMessage(`필수 정보 누락: ${validation.missingFields.join(', ')}`);
                return;
            }
            await documentService.generateDocument(selectedCustomer.id, docType, formData);
            const updatedCustomer = await customerService.updateDocumentStatus(selectedCustomer.id, docType, true);
            setSelectedCustomer(updatedCustomer);
            localStorage.setItem('selectedCustomer', JSON.stringify(updatedCustomer));
            setSuccessMessage(`${documentUtils.getDocumentName(docType)} 생성 완료.`);
        } catch (error) {
            setErrorMessage('서류 생성 중 오류 발생');
        } finally {
            setGenerating(false);
        }
    };

    const handleDownload = async (docType) => {
        try {
            const blob = await documentService.downloadDocument(1); // Assuming ID 1 for mock
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${documentUtils.getDocumentName(docType)}_${selectedCustomer.name}.txt`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            setSuccessMessage(`${documentUtils.getDocumentName(docType)}이(가) 다운로드되었습니다.`);
        } catch (error) {
            setErrorMessage('다운로드 중 오류가 발생했습니다.');
        }
    };

    

    const handleBulkAction = (action) => {
        setBulkAction(action);
        setShowConfirmModal(true);
    };

    const confirmBulkAction = async () => {
        setShowConfirmModal(false);
        try {
            setGenerating(true);
            if (bulkAction === 'generateAll') {
                await Promise.all(['obituary', 'deathCertificate', 'schedule'].map(docType =>
                    handleGenerateDocument(docType)
                ));
                setSuccessMessage('모든 서류가 성공적으로 생성되었습니다.');
            
            }
        } catch (error) {
            setErrorMessage('일괄 작업 중 오류가 발생했습니다.');
        } finally {
            setGenerating(false);
        }
    };

    const isDocumentGenerated = (docType) => selectedCustomer?.documents?.[docType] || false;
    
    if (loading) return (
        <div className="page-wrapper" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%)'}}>
            <div className="text-center" style={{ color: '#4A3728' }}>
                <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem', color: '#B8860B' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3" style={{ fontSize: '1.2rem' }}>페이지 로딩 중...</p>
            </div>
        </div>
    );
    
    if (!selectedCustomer) return (
        <div className="page-wrapper" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%)'}}>
            <h2 style={{color: '#4A3728'}}>고객 정보가 없습니다. 목록으로 돌아가주세요.</h2>
        </div>
    );

    const documentTypes = [
        { type: 'obituary', name: '부고장', icon: <FileText size={18} /> },
        { type: 'deathCertificate', name: '사망신고서', icon: <FileText size={18} /> },
        { type: 'schedule', name: '장례일정표', icon: <Calendar size={18} /> },
    ];

    return (
        <div className="page-wrapper" style={{
            '--navbar-height': '62px', height: 'calc(100vh - var(--navbar-height))',
            background: 'linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%)',
            padding: '20px', boxSizing: 'border-box', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
        }}>
            <div className={`dashboard-container ${animateCard ? 'animate-in' : ''}`} style={{
                width: '100%', maxWidth: '1600px', height: '100%', margin: '0 auto',
                display: 'flex', boxSizing: 'border-box', background: 'rgba(255, 251, 235, 0.95)',
                boxShadow: '0 20px 60px rgba(44, 31, 20, 0.4)', backdropFilter: 'blur(15px)',
                border: '2px solid rgba(184, 134, 11, 0.35)', borderRadius: '28px',
                padding: '20px', gap: '20px', overflow: 'hidden',
            }}>
                <div style={{ flex: '0 0 400px', display: 'flex', flexDirection: 'column' }}>
                    <h4 className="mb-3" style={{ fontSize: '30px', fontWeight: '700', color: '#2C1F14', paddingLeft: '10px', flexShrink: 0 }}>서류 관리</h4>
                    <div className="sidebar-scroll-area" style={{
                        background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.12) 0%, rgba(205, 133, 63, 0.08) 100%)', 
                        borderRadius: '15px', padding: '20px',
                        flex: 1, overflowY: 'auto', minHeight: 0,
                        border: '1px solid rgba(184, 134, 11, 0.2)'
                    }}>
                        <div style={{ width: '120px', height: '120px', background: 'rgba(184, 134, 11, 0.15)', borderRadius: '50%', margin: '0 auto 30px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(44, 31, 20, 0.2)' }}><Files size={48} style={{ color: '#B8860B' }} /></div>
                        <h2 style={{ fontWeight: '700', fontSize: '1.8rem', textAlign: 'center', color: '#2C1F14', marginBottom: '15px' }}>{selectedCustomer.deceasedName}님 서류</h2>
                        <p style={{ fontSize: '14px', lineHeight: '1.6', opacity: 0.9, textAlign: 'center', color: '#4A3728', margin: 0, marginBottom: '10px' }}>생성된 서류를 확인하고<br />인쇄하거나 다운로드하세요.</p>
                        
                        {/* === MODIFIED INFO BLOCK START === */}
                        <div style={{ borderTop: '1px solid rgba(184, 134, 11, 0.2)', paddingTop: '10px', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}><User size={16} style={{ color: '#B8860B', marginRight: '10px' }} /><span style={{fontWeight: 500, color: '#4A3728'}}>성함 : {selectedCustomer.deceasedName} (향년 {selectedCustomer.deceasedAge}세)</span></div>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}><Building size={16} style={{ color: '#B8860B', marginRight: '10px' }} /><span style={{fontWeight: 500, color: '#4A3728'}}>장례식장 : {formData.funeralHomeName}</span></div>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}><Calendar size={16} style={{ color: '#B8860B', marginRight: '10px' }} /><span style={{fontWeight: 500, color: '#4A3728'}}>별세일 : {customerUtils.formatDate(formData.deceasedDate)}</span></div>
                            <div style={{ display: 'flex', alignItems: 'center' }}><Home size={16} style={{ color: '#B8860B', marginRight: '10px' }} /><span style={{fontWeight: 500, color: '#4A3728'}}>주소 : {formData.funeralHomeAddress}</span></div>
                        </div>
                        {/* === MODIFIED INFO BLOCK END === */}

                        <div style={{ borderTop: '1px solid rgba(184, 134, 11, 0.2)', paddingTop: '20px' }}>
                            <h6 style={{ color: '#4A3728', marginBottom: '15px', fontSize: '14px', fontWeight: '600' }}>문서 목록</h6>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {documentTypes.map(doc => (
                                    <button key={doc.type} onClick={() => handleDocumentSelect(doc.type)} style={{ background: selectedDoc === doc.type ? '#B8860B' : 'transparent', color: selectedDoc === doc.type ? 'white' : '#4A3728', border: `1px solid ${selectedDoc === doc.type ? '#B8860B' : 'rgba(184, 134, 11, 0.2)'}`, borderRadius: '8px', padding: '10px 12px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ display: 'flex', alignItems: 'center' }}>{doc.icon} <span style={{ marginLeft: '8px' }}>{doc.name}</span></span>
                                        <Badge bg={isDocumentGenerated(doc.type) ? 'success' : 'secondary'}>{isDocumentGenerated(doc.type) ? '완료' : '미생성'}</Badge>
                                    </button>
                                ))}
                            </div>
                            <hr className="my-3"/>
                            <Row className="g-2">
                                <Col><Button className="w-100 btn-golden" size="sm" onClick={() => handleBulkAction('generateAll')} disabled={generating}>{generating ? <Loader size={14} className="spinner" /> : <FileText size={14} />}<span className="ms-2">일괄 제작</span></Button></Col>
                                
                            </Row>
                        </div>
                    </div>
                </div>

                <div className="dashboard-right" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, paddingBottom: '20px', borderBottom: '1px solid rgba(184, 134, 11, 0.2)', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <button
                                onClick={() => navigate('/menu1-1')}
                                className="back-btn"
                            >
                                <ArrowLeft size={16} style={{ marginRight: '6px' }} />
                                돌아가기
                            </button>
                            <h3 style={{ color: '#2C1F14', fontWeight: '600', fontSize: '1.5rem', margin: 0 }}>
                                {documentUtils.getDocumentName(selectedDoc)} 미리보기
                            </h3>
                        </div>
                        <div className="d-flex gap-2">
                            <Button className="btn-golden" size="sm" onClick={() => handleGenerateDocument(selectedDoc)} disabled={generating}>{generating ? <Loader size={14} className='spinner me-2' /> : <Check size={14} className='me-2' />}{isDocumentGenerated(selectedDoc) ? '재생성' : '생성'}</Button>
                            <Button className="btn-outline-golden" size="sm" onClick={() => handleDownload(selectedDoc)}><Download size={14} className='me-2' />다운로드</Button>
                            
                        </div>
                    </div>
                    {successMessage && <Alert variant="success" className="mb-3 flex-shrink-0" dismissible onClose={() => setSuccessMessage('')}>{successMessage}</Alert>}
                    {errorMessage && <Alert variant="danger" className="mb-3 flex-shrink-0" dismissible onClose={() => setErrorMessage('')}>{errorMessage}</Alert>}
                    <div className="content-scroll-area" style={{ flex: 1, overflowY: 'auto', background: 'rgba(253, 251, 243, 0.92)', borderRadius: '12px', border: '1px solid rgba(184, 134, 11, 0.2)', padding: '24px' }}>
                        <div></div>
                    </div>
                </div>
            </div>

            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
                <Modal.Header closeButton><Modal.Title>일괄 작업 확인</Modal.Title></Modal.Header>
                <Modal.Body>
                    {bulkAction === 'generateAll' && '모든 서류를 일괄 생성하시겠습니까? 기존에 생성된 서류가 있다면 덮어쓰게 됩니다.'}
                    
                </Modal.Body>
                <Modal.Footer>
                    <Button className="btn-outline-golden" onClick={() => setShowConfirmModal(false)}>취소</Button>
                    <Button className="btn-golden" onClick={confirmBulkAction}>확인</Button>
                </Modal.Footer>
            </Modal>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .dashboard-container { opacity: 0; }
                .dashboard-container.animate-in { animation: fadeIn 0.6s ease-out forwards; }
                .spinner { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .content-scroll-area::-webkit-scrollbar,
                .sidebar-scroll-area::-webkit-scrollbar { width: 6px; }
                .content-scroll-area::-webkit-scrollbar-track,
                .sidebar-scroll-area::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); border-radius: 10px; }
                .content-scroll-area::-webkit-scrollbar-thumb,
                .sidebar-scroll-area::-webkit-scrollbar-thumb { background-color: rgba(184, 134, 11, 0.5); border-radius: 10px; }
                
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

                .btn-golden {
                    background: linear-gradient(135deg, #D4AF37, #F5C23E);
                    border: none;
                    color: #2C1F14;
                    font-weight: 700;
                    transition: all 0.3s ease;
                }
                .btn-golden:hover {
                    background: linear-gradient(135deg, #CAA230, #E8B530);
                    color: #2C1F14;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 15px rgba(184, 134, 11, 0.25);
                }

                .btn-outline-golden,
                .btn-outline-golden:focus,
                .btn-outline-golden:active {
                    background-color: transparent;
                    border: 1px solid #B8860B;
                    color: #B8860B;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    box-shadow: none !important;
                }

                .btn-outline-golden:hover {
                    background-color: #B8860B;
                    border-color: #B8860B;
                    color: white;
                }

                .btn-check:focus+.btn-outline-golden, .btn-outline-golden:focus {
                    background-color: transparent !important;
                    border-color: #B8860B !important;
                    color: #B8860B !important;
                    box-shadow: 0 0 0 0.25rem rgba(184, 134, 11, 0.2) !important;
                }

                .btn-outline-golden.active,
                .btn-check:active+.btn-outline-golden,
                .btn-check:checked+.btn-outline-golden {
                    background-color: #B8860B !important;
                    border-color: #B8860B !important;
                    color: white !important;
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
                }
            `}</style>
        </div>
    );
};

export default Menu1_3;
