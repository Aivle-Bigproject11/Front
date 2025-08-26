import React, { useState, useEffect } from 'react';
import { Button, Alert, Badge, Modal, Row, Col } from 'react-bootstrap';
import { ArrowLeft, FileText, Calendar, Download, Check, Loader, User, Building, Home, Files } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { customerService, customerUtils } from '../services/customerService';
import { documentService, documentUtils } from '../services/documentService';
import { apiService } from '../services/api';

const Menu1_3 = () => {
    const [obituaryFileUrl, setObituaryFileUrl] = useState(null);
    const [deathReportFileUrl, setDeathReportFileUrl] = useState(null);
    const [scheduleFileUrl, setScheduleFileUrl] = useState(null);

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
    const [funeralInfoId, setFuneralInfoId] = useState(null); // New state for funeralInfoId
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

            // Retrieve funeralInfoId from localStorage
            const storedFuneralInfoId = localStorage.getItem('selectedFuneralInfoId');
            if (storedFuneralInfoId) {
                setFuneralInfoId(storedFuneralInfoId);
            } else {
                // Handle case where funeralInfoId is not found in localStorage
                console.error('funeralInfoId not found in localStorage for Menu1-3.');
                // Optionally, navigate back or show an error
            }

            if (!customer) {
                navigate('/menu1-1');
                return;
            }
            setSelectedCustomer(customer);
            setFormData(customer); // Assuming customer object contains formData directly or can be used as such

            const customerId = customer.customerId; // Define customerId here
            const [obituaryRes, deathReportRes, scheduleRes] = await Promise.allSettled([
                apiService.getObituaryByCustomerId(customerId),
                apiService.getDeathReportByCustomerId(customerId),
                apiService.getScheduleByCustomerId(customerId)
            ]);

            if (obituaryRes.status === 'fulfilled' && obituaryRes.value.data && obituaryRes.value.data.obituaryFileUrl) {
                setObituaryFileUrl(obituaryRes.value.data.obituaryFileUrl);
                console.log('Obituary Data:', obituaryRes.value.data);
            } else {
                setObituaryFileUrl(null); // Ensure it's null if not found or failed
                console.error('Failed to fetch obituary or obituaryFileUrl is null:', obituaryRes.reason || 'URL not found');
            }

            if (deathReportRes.status === 'fulfilled' && deathReportRes.value.data && deathReportRes.value.data.deathReportFileUrl) {
                setDeathReportFileUrl(deathReportRes.value.data.deathReportFileUrl);
                console.log('Death Report Data:', deathReportRes.value.data);
            } else {
                setDeathReportFileUrl(null); // Ensure it's null if not found or failed
                console.error('Failed to fetch death report or deathReportFileUrl is null:', deathReportRes.reason || 'URL not found');
            }

            if (scheduleRes.status === 'fulfilled' && scheduleRes.value.data && scheduleRes.value.data.scheduleFileUrl) {
                setScheduleFileUrl(scheduleRes.value.data.scheduleFileUrl);
                console.log('Schedule Data:', scheduleRes.value.data);
            } else {
                setScheduleFileUrl(null); // Ensure it's null if not found or failed
                console.error('Failed to fetch schedule or scheduleFileUrl is null:', scheduleRes.reason || 'URL not found');
            }

            let initialPreviewUrl = null;
            if (obituaryRes.status === 'fulfilled' && obituaryRes.value.data && obituaryRes.value.data.obituaryFileUrl) {
                initialPreviewUrl = obituaryRes.value.data.obituaryFileUrl;
            }

            // Call loadPreview with the directly obtained URL or a message
            if (initialPreviewUrl) {
                const isPdf = initialPreviewUrl.toLowerCase().endsWith('.pdf');
                setPreviewContent({ type: isPdf ? 'pdf' : 'image', url: initialPreviewUrl });
            } else {
                setPreviewContent({ type: 'message', content: '문서를 생성해주세요' });
            }
        } catch (error) {
            console.error('Error initializing page:', error);
            setErrorMessage('페이지를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
            setAnimateCard(true);
        }
    };

    const loadPreview = (fileUrl) => {
        try {
            if (fileUrl) {
                // Determine file type (simple check based on extension)
                const isPdf = fileUrl.toLowerCase().endsWith('.pdf');
                setPreviewContent({ type: isPdf ? 'pdf' : 'image', url: fileUrl });
            } else {
                setPreviewContent({ type: 'message', content: '문서를 생성해주세요' });
            }
        } catch (error) {
            console.error('Error loading preview:', error);
            setPreviewContent({ type: 'message', content: '미리보기를 불러올 수 없습니다.' });
        }
    };

    const handleDocumentSelect = (docType) => {
        setSelectedDoc(docType);
        let fileUrl = null;
        if (docType === 'obituary') {
            fileUrl = obituaryFileUrl;
        } else if (docType === 'deathCertificate') {
            fileUrl = deathReportFileUrl;
        } else if (docType === 'schedule') {
            fileUrl = scheduleFileUrl;
        }
        loadPreview(fileUrl);
    };

    const handleGenerateDocument = async (docType, isBulk = false) => {
        const requiredFields = [
            'customerId', 'deceasedName', 'deceasedRrn', 'deceasedAge',
            'deceasedBirthOfDate', 'deceasedGender', 'deceasedDate', 'deceasedAddress',
            'deceasedRelationToHouseholdHead', 'deathLocation', 'deathLocationType',
            'reporterName', 'reporterRrn', 'reporterQualification', 'reporterRelationToDeceased',
            'reporterAddress', 'reporterPhone', 'funeralCompanyName', 'directorName',
            'directorPhone', 'funeralHomeName', 'funeralHomeAddress', 'funeralDuration',
            'mortuaryInfo', 'processionDateTime', 'burialSiteInfo', 'chiefMourners',
            'chiefMournersContact', 'templateKeyword'
        ];

        const fieldLabels = {
            customerId: '상조회사 고객 ID',
            deceasedName: '고인 성명 (한글)',
            deceasedRrn: '고인 주민등록번호',
            deceasedAge: '고인 나이',
            deceasedBirthOfDate: '고인 생일',
            deceasedGender: '고인 성별',
            deceasedDate: '고인 돌아가신 날짜',
            deceasedAddress: '고인 주소',
            deceasedRelationToHouseholdHead: '고인과 세대주와의 관계',
            deathLocation: '사망 장소',
            deathLocationType: '사망 장소 (구분)',
            reporterName: '신고인 이름',
            reporterRrn: '신고인 주민등록번호',
            reporterQualification: '신고인 자격',
            reporterRelationToDeceased: '신고인과 고인의 관계',
            reporterAddress: '신고인 주소',
            reporterPhone: '신고인 전화번호',
            funeralCompanyName: '이용 상조회사 이름',
            directorName: '담당 장례지도사 이름',
            directorPhone: '담당 장례지도사 연락처',
            funeralHomeName: '장례식장 이름',
            funeralHomeAddress: '장례식장 주소',
            funeralDuration: '장례 기간',
            mortuaryInfo: '빈소 정보',
            processionDateTime: '발인 일시',
            burialSiteInfo: '장지 정보',
            chiefMourners: '상주 목록',
            chiefMournersContact: '상주 연락처',
            templateKeyword: '사용자가 선택한 고인의 키워드'
        };

        const validateRequiredFields = (data) => {
            if (!data) {
                return "고인 정보가 없습니다. 목록에서 다시 선택해주세요.";
            }
            const missingFields = [];
            for (const field of requiredFields) {
                if (data[field] === null || data[field] === undefined || String(data[field]).trim() === '') {
                    missingFields.push(field);
                }
            }
            
            if (missingFields.length > 0) {
                if (isBulk) {
                    return '필수 입력 항목을 모두 입력해주세요.';
                }
                const missingLabels = missingFields.map(field => fieldLabels[field] || field);
                return (
                    <>
                        <span>다음 필수 항목이 비어있습니다:</span>
                        <br />
                        {
                            missingLabels.map((label, index) => (
                                <React.Fragment key={label}>
                                    <strong>{label}</strong>
                                    {index < missingLabels.length - 1 ? ', ' : ''}
                                </React.Fragment>
                            ))
                        }
                        <br />
                        <small>'정보 등록' 메뉴에서 정보를 입력해주세요.</small>
                    </>
                );
            }
            return null; // All fields are valid
        };

        try {
            const validationError = validateRequiredFields(selectedCustomer);
            if (validationError) {
                setErrorMessage(validationError);
                setGenerating(false); // Stop loading spinner
                return false; // Indicate failure
            }

            setGenerating(true);
            setSuccessMessage('');
            setErrorMessage('');

            if (!funeralInfoId) { // Use the state variable directly
                setErrorMessage('장례 정보 ID를 찾을 수 없습니다.');
                setGenerating(false);
                return false; // Indicate failure
            }

            let createApiCall;
            let getApiCall;
            let statusKey;
            let fileUrlKey;

            if (docType === 'obituary') {
                createApiCall = () => apiService.createObituary(funeralInfoId);
                getApiCall = () => apiService.getObituaryByCustomerId(selectedCustomer.customerId);
                statusKey = 'obituaryStatus';
                fileUrlKey = 'obituaryFileUrl';
            } else if (docType === 'deathCertificate') {
                createApiCall = () => apiService.createDeathReport(funeralInfoId);
                getApiCall = () => apiService.getDeathReportByCustomerId(selectedCustomer.customerId);
                statusKey = 'deathReportStatus';
                fileUrlKey = 'deathReportFileUrl';
            } else if (docType === 'schedule') {
                createApiCall = () => apiService.createSchedule(funeralInfoId);
                getApiCall = () => apiService.getScheduleByCustomerId(selectedCustomer.customerId);
                statusKey = 'scheduleStatus';
                fileUrlKey = 'scheduleFileUrl';
            } else {
                setErrorMessage('알 수 없는 문서 유형입니다.');
                setGenerating(false);
                return false; // Indicate failure
            }

            // Step 1: Send the PUT request to generate the document
            const initialResponse = await createApiCall();
            const initialStatus = initialResponse.data[statusKey];

            if (initialStatus === 'COMPLETED') {
                setSuccessMessage(`${documentUtils.getDocumentName(docType)} 생성 완료.`);
                // Update the file URL state immediately if completed
                if (docType === 'obituary') setObituaryFileUrl(initialResponse.data[fileUrlKey]);
                else if (docType === 'deathCertificate') setDeathReportFileUrl(initialResponse.data[fileUrlKey]);
                else if (docType === 'schedule') setScheduleFileUrl(initialResponse.data[fileUrlKey]);
                if (docType === selectedDoc) {
                    loadPreview(initialResponse.data[fileUrlKey]); // Update preview
                }
                return true; // Indicate success
            } else if (initialStatus === 'PENDING') {
                setSuccessMessage(`${documentUtils.getDocumentName(docType)} 생성 요청 완료. 문서 생성 중...`);
                // Start polling
                return new Promise((resolve) => {
                    let pollCount = 0;
                    const pollDocumentStatus = async () => {
                        try {
                            pollCount++;
                            if (pollCount > 90) {
                                setErrorMessage(`${documentUtils.getDocumentName(docType)} 생성 시간이 초과되었습니다. 다시 시도해주세요.`);
                                resolve(false);
                                return;
                            }

                            const pollResponse = await getApiCall();
                            const currentStatus = pollResponse.data[statusKey];

                            if (currentStatus === 'COMPLETED') {
                                setSuccessMessage(`${documentUtils.getDocumentName(docType)} 생성 완료.`);
                                if (docType === 'obituary') setObituaryFileUrl(pollResponse.data[fileUrlKey]);
                                else if (docType === 'deathCertificate') setDeathReportFileUrl(pollResponse.data[fileUrlKey]);
                                else if (docType === 'schedule') setScheduleFileUrl(pollResponse.data[fileUrlKey]);
                                if (docType === selectedDoc) {
                                    loadPreview(pollResponse.data[fileUrlKey]);
                                }
                                resolve(true);
                            } else if (currentStatus === 'PENDING') {
                                setTimeout(pollDocumentStatus, 1000);
                            } else {
                                setErrorMessage(`${documentUtils.getDocumentName(docType)} 생성 실패: ${currentStatus}`);
                                resolve(false);
                            }
                        } catch (pollError) {
                            console.error('Polling error:', pollError);
                            setErrorMessage('문서 상태 확인 중 오류가 발생했습니다.');
                            resolve(false);
                        }
                    };
                    setTimeout(pollDocumentStatus, 1000);
                });
            } else {
                setErrorMessage(`${documentUtils.getDocumentName(docType)} 생성 실패: ${initialStatus}`);
                return false; // Indicate failure
            }

        } catch (error) {
            console.error('Error generating document:', error);
            setErrorMessage('서류 생성 중 오류 발생');
            return false; // Indicate failure
        }
        // The finally block is now handled by the wrapper function
    };

    const handleSingleGenerate = async (docType) => {
        try {
            await handleGenerateDocument(docType, false);
        } finally {
            setGenerating(false);
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
            setSuccessMessage('');
            setErrorMessage('');

            if (bulkAction === 'generateAll') {
                const results = await Promise.allSettled(['obituary', 'deathCertificate', 'schedule'].map(docType =>
                    handleGenerateDocument(docType, true)
                ));

                const allSuccessful = results.every(result => result.status === 'fulfilled' && result.value === true);
                const someFailed = results.some(result => result.status === 'rejected' || result.value === false);

                if (allSuccessful) {
                    setSuccessMessage('모든 서류가 성공적으로 생성되었습니다.');
                } else if (someFailed) {
                    // Error message is already set by the first failed handleGenerateDocument call
                } else {
                    setSuccessMessage('일괄 제작 요청이 처리되었습니다. 각 서류의 상태를 확인해주세요.');
                }
            }
        } catch (error) {
            console.error('일괄 작업 중 예상치 못한 오류 발생:', error);
            setErrorMessage('일괄 작업 중 오류가 발생했습니다.');
        } finally {
            setGenerating(false);
        }
    };

    const isDocumentGenerated = (docType) => {
        if (docType === 'obituary') {
            return obituaryFileUrl !== null;
        } else if (docType === 'deathCertificate') {
            return deathReportFileUrl !== null;
        } else if (docType === 'schedule') {
            return scheduleFileUrl !== null;
        }
        return false;
    };
    
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
                                        <Badge bg={isDocumentGenerated(doc.type) ? 'success' : 'secondary'}>{isDocumentGenerated(doc.type) ? '생성됨' : '미생성'}</Badge>
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
                            <Button className="save-btn" size="sm" onClick={() => handleSingleGenerate(selectedDoc)} disabled={generating}>{generating ? <Loader size={14} className='spinner me-2' /> : <FileText size={14} className='me-2' />}{isDocumentGenerated(selectedDoc) ? '재생성' : '생성'}</Button>
                            
                            
                        </div>
                    </div>
                    {successMessage && <Alert variant="success" className="mb-3 flex-shrink-0" dismissible onClose={() => setSuccessMessage('')}>{successMessage}</Alert>}
                    {errorMessage && <Alert variant="danger" className="mb-3 flex-shrink-0" dismissible onClose={() => setErrorMessage('')}>{errorMessage}</Alert>}
                    <div className="content-scroll-area" style={{ flex: 1, overflowY: 'auto', background: 'rgba(253, 251, 243, 0.92)', borderRadius: '12px', border: '1px solid rgba(184, 134, 11, 0.2)', padding: '24px' }}>
                        {previewContent && previewContent.type === 'image' && (
                            <img src={previewContent.url} alt="Document Preview" style={{ maxWidth: '100%', height: 'auto' }} />
                        )}
                        {previewContent && previewContent.type === 'pdf' && (
                            <embed src={previewContent.url} type="application/pdf" width="100%" height="100%" />
                        )}
                        {previewContent && previewContent.type === 'message' && (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', fontSize: '1.2rem', color: '#6c757d' }}>
                                {previewContent.content}
                            </div>
                        )}
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
                
                .save-btn, .btn-golden {
                    padding: 10px 24px; font-size: 16px; font-weight: 700;
                    border: none; border-radius: 12px; cursor: pointer;
                    transition: all 0.3s ease; color: #2C1F14;
                    background: linear-gradient(135deg, #D4AF37, #F5C23E);
                    box-shadow: 0 4px 15px rgba(184, 134, 11, 0.35);
                }
                .save-btn:hover, .btn-golden:hover {
                    transform: translateY(-2px); 
                    box-shadow: 0 8px 25px rgba(184, 134, 11, 0.45);
                    background: linear-gradient(135deg, #CAA230, #E8B530);
                    color: #2C1F14;
                }
                .save-btn:active, .save-btn.active,
                .btn-golden:active, .btn-golden.active {
                    background: linear-gradient(135deg, #c8a430, #e0b030) !important;
                    transform: translateY(0);
                    box-shadow: 0 4px 15px rgba(184, 134, 11, 0.35) !important;
                }
                .save-btn:focus, .save-btn.focus,
                .btn-golden:focus, .btn-golden.focus {
                    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.5) !important;
                }
                .save-btn:disabled, .save-btn:disabled:hover, .save-btn:disabled:focus, .save-btn:disabled:active,
                .btn-golden:disabled, .btn-golden:disabled:hover, .btn-golden:disabled:focus, .btn-golden:disabled:active {
                    background: #e9ecef !important;
                    background-image: none !important;
                    box-shadow: none !important;
                    color: #6c757d !important;
                    cursor: not-allowed;
                    border-color: #ced4da !important;
                }

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
