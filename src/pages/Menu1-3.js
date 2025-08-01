import React, { useState, useEffect } from 'react';
import { Button, Alert, Badge, Modal, Row, Col } from 'react-bootstrap';
import { ArrowLeft, FileText, Calendar, Eye, Printer, Download, Check, Loader, User, Phone, MapPin, Files } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { customerService, customerUtils } from '../services/customerService';
import { documentService, documentUtils } from '../services/documentService';

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

    useEffect(() => {
        initializePage();
    }, []);

    const initializePage = async () => {
        try {
            const customerData = localStorage.getItem('selectedCustomer');
            if (!customerData) {
                navigate('/menu1-1');
                return;
            }
            const customer = JSON.parse(customerData);
            setSelectedCustomer(customer);

            const customerDetails = await customerService.getCustomerById(customer.id);
            const initialFormData = customerDetails.formData || {};
            setFormData(initialFormData);

            await loadPreview('obituary', initialFormData);
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

    // ✅ 일괄 작업 로직 복구
    const handleBulkAction = (action) => {
        setBulkAction(action);
        setShowConfirmModal(true);
    };

    const confirmBulkAction = async () => {
        setShowConfirmModal(false);
        try {
            setGenerating(true);
            if (bulkAction === 'generateAll') {
                // 이 부분은 간결하게 표현하기 위해 Promise.all을 사용할 수 있습니다.
                await Promise.all(['obituary', 'deathCertificate', 'schedule'].map(docType => 
                    handleGenerateDocument(docType)
                ));
                setSuccessMessage('모든 서류가 성공적으로 생성되었습니다.');
            } else if (bulkAction === 'printAll') {
                await documentService.printDocument(1); // Mock
                setSuccessMessage('완성된 서류를 모두 인쇄합니다.');
            }
        } catch (error) {
            setErrorMessage('일괄 작업 중 오류가 발생했습니다.');
        } finally {
            setGenerating(false);
        }
    };

    const handleDownload = async (docType) => { /* ... */ };
    const handlePrint = async (docType) => { /* ... */ };
    const isDocumentGenerated = (docType) => selectedCustomer?.documents?.[docType] || false;
    if (loading) return <div>페이지 로딩 중...</div>;
    if (!selectedCustomer) return <div>고객 정보 없음...</div>;

    const documentTypes = [
        { type: 'obituary', name: '부고장', icon: <FileText size={18} /> },
        { type: 'deathCertificate', name: '사망신고서', icon: <FileText size={18} /> },
        { type: 'schedule', name: '장례일정표', icon: <Calendar size={18} /> },
    ];

    return (
        <div className="page-wrapper" style={{
            '--navbar-height': '62px', height: 'calc(100vh - var(--navbar-height))',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            padding: '20px', boxSizing: 'border-box', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
        }}>
            <div className={`dashboard-container ${animateCard ? 'animate-in' : ''}`} style={{
                width: '100%', maxWidth: '1600px', height: '100%', margin: '0 auto',
                display: 'flex', boxSizing: 'border-box', background: 'rgba(255, 255, 255, 0.7)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.18)', borderRadius: '20px',
                padding: '20px', gap: '20px', overflow: 'hidden',
            }}>
                <div style={{ flex: '0 0 400px', display: 'flex', flexDirection: 'column' }}>
                    <h4 className="mb-3" style={{ fontSize: '30px', fontWeight: '700', color: '#343a40', paddingLeft: '10px', flexShrink: 0 }}>서류 관리</h4>
                    <div className="sidebar-scroll-area" style={{
                        background: 'rgba(255, 255, 255, 0.8)', borderRadius: '15px', padding: '20px',
                        flex: 1, overflowY: 'auto', minHeight: 0
                    }}>
                        <div style={{ width: '120px', height: '120px', background: 'rgba(111, 66, 193, 0.2)', borderRadius: '50%', margin: '0 auto 30px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}><Files size={48} style={{ color: '#6f42c1' }} /></div>
                        <h2 style={{ fontWeight: '700', fontSize: '1.8rem', textAlign: 'center', color: '#343a40', marginBottom: '15px' }}>{selectedCustomer.name}님 서류</h2>
                        <p style={{ fontSize: '16px', lineHeight: '1.6', opacity: 0.7, textAlign: 'center', color: '#6c757d', margin: 0, marginBottom: '20px' }}>생성된 서류를 확인하고<br />인쇄하거나 다운로드하세요.</p>
                        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}><User size={16} style={{ color: '#6f42c1', marginRight: '10px' }} /><span style={{ fontWeight: 500 }}>{selectedCustomer.name} (향년 {selectedCustomer.age}세)</span></div>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}><Phone size={16} style={{ color: '#6f42c1', marginRight: '10px' }} /><span style={{ fontWeight: 500 }}>{selectedCustomer.phone}</span></div>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}><Calendar size={16} style={{ color: '#6f42c1', marginRight: '10px' }} /><span style={{ fontWeight: 500 }}>별세: {customerUtils.formatDate(selectedCustomer.funeralDate)}</span></div>
                            <div style={{ display: 'flex', alignItems: 'center' }}><MapPin size={16} style={{ color: '#6f42c1', marginRight: '10px' }} /><span style={{ fontWeight: 500 }}>{selectedCustomer.location}</span></div>
                        </div>
                        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
                            <h6 style={{ color: '#6c757d', marginBottom: '15px', fontSize: '14px', fontWeight: '600' }}>문서 목록</h6>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {documentTypes.map(doc => (
                                    <button key={doc.type} onClick={() => handleDocumentSelect(doc.type)} style={{ background: selectedDoc === doc.type ? '#6f42c1' : 'transparent', color: selectedDoc === doc.type ? 'white' : '#6c757d', border: '1px solid rgba(111, 66, 193, 0.2)', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ display: 'flex', alignItems: 'center' }}>{doc.icon} <span style={{ marginLeft: '8px' }}>{doc.name}</span></span>
                                        <Badge bg={isDocumentGenerated(doc.type) ? 'success' : 'secondary'}>{isDocumentGenerated(doc.type) ? '완료' : '미생성'}</Badge>
                                    </button>
                                ))}
                            </div>
                            {/* ✅ 일괄 작업 버튼 복구 및 배치 */}
                            <hr className="my-3"/>
                            <Row className="g-2">
                                <Col>
                                    <Button className="w-100 btn-purple" size="sm" onClick={() => handleBulkAction('generateAll')} disabled={generating}>
                                        {generating ? <Loader size={14} className="spinner" /> : <FileText size={14} />}<span className="ms-2">전체 생성</span>
                                    </Button>
                                </Col>
                                <Col>
                                    <Button className="w-100 btn-outline-purple" size="sm" onClick={() => handleBulkAction('printAll')}>
                                        <Printer size={14} /><span className="ms-2">일괄 인쇄</span>
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>

                <div className="dashboard-right" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, paddingBottom: '20px', borderBottom: '1px solid rgba(229, 231, 235, 0.5)', marginBottom: '20px' }}>
                        <h3 style={{ color: '#374151', fontWeight: '600', fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center' }}>
                            <button onClick={() => navigate('/menu1-1')} style={{ all: 'unset', cursor: 'pointer', marginRight: '16px', color: '#6f42c1' }}><ArrowLeft size={24} /></button>
                            {documentUtils.getDocumentName(selectedDoc)} 미리보기
                        </h3>
                        <div className="d-flex gap-2">
                            <Button variant="outline-primary" size="sm" onClick={() => handleGenerateDocument(selectedDoc)} disabled={generating}>{generating ? <Loader size={14} className='spinner me-2' /> : <Check size={14} className='me-2' />}{isDocumentGenerated(selectedDoc) ? '재생성' : '생성'}</Button>
                            <Button variant="outline-secondary" size="sm" onClick={() => handleDownload(selectedDoc)}><Download size={14} className='me-2' />다운로드</Button>
                            <Button variant="outline-secondary" size="sm" onClick={() => handlePrint(selectedDoc)}><Printer size={14} className='me-2' />인쇄</Button>
                        </div>
                    </div>
                    {successMessage && <Alert variant="success" className="mb-3 flex-shrink-0">{successMessage}</Alert>}
                    {errorMessage && <Alert variant="danger" className="mb-3 flex-shrink-0">{errorMessage}</Alert>}
                    <div className="content-scroll-area" style={{ flex: 1, overflowY: 'auto', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px' }}>
                        {previewContent ? (
                            <div style={{ background: 'white', fontFamily: 'serif', padding: '32px', minHeight: '100%', border: '1px solid #ddd' }}>
                                <h2 style={{ textAlign: 'center', marginBottom: '32px', fontSize: '24px', fontWeight: 'bold' }}>{previewContent.title}</h2>
                                <div style={{ whiteSpace: 'pre-line', lineHeight: '1.8', fontSize: '16px' }} dangerouslySetInnerHTML={{ __html: previewContent.content }} />
                            </div>
                        ) : (<div>미리보기를 불러오는 중...</div>)}
                    </div>
                </div>
            </div>

            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
                <Modal.Header closeButton><Modal.Title>일괄 작업 확인</Modal.Title></Modal.Header>
                <Modal.Body>
                    {bulkAction === 'generateAll' && '모든 서류를 일괄 생성하시겠습니까? 기존에 생성된 서류가 있다면 덮어쓰게 됩니다.'}
                    {bulkAction === 'printAll' && '완성된 모든 서류를 인쇄하시겠습니까?'}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>취소</Button>
                    <Button variant="primary" onClick={confirmBulkAction}>확인</Button>
                </Modal.Footer>
            </Modal>

            <style>{`
                /* ... 스타일은 이전과 동일 ... */
            `}</style>
        </div>
    );
};

export default Menu1_3;