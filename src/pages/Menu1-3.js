// src/pages/Menu1-3.js - 서류관리 페이지

import React, { useState, useEffect } from 'react';
import { Button, Alert, Badge, Modal } from 'react-bootstrap';
import { ArrowLeft, FileText, Calendar, Eye, Printer, Download, Check, X, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { customerService } from '../services/customerService';
import { documentService, documentUtils } from '../services/documentService';
import './Menu3.css';

const Menu1_3 = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedDoc, setSelectedDoc] = useState('obituary');
  const [documents, setDocuments] = useState([]);
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
    // 애니메이션 시작
    setTimeout(() => setAnimateCard(true), 100);
  }, []);

  const initializePage = async () => {
    try {
      // 로컬 스토리지에서 선택된 고객 정보 가져오기
      const customerData = localStorage.getItem('selectedCustomer');
      if (!customerData) {
        navigate('/menu1-1');
        return;
      }

      const customer = JSON.parse(customerData);
      setSelectedCustomer(customer);

      // 고객의 저장된 폼 데이터 가져오기 (실제로는 API에서)
      const customerDetails = await customerService.getCustomerById(customer.id);
      if (customerDetails && customerDetails.formData) {
        setFormData(customerDetails.formData);
      }

      // 고객의 서류 목록 가져오기
      const customerDocs = await documentService.getCustomerDocuments(customer.id);
      setDocuments(customerDocs);

      // 초기 미리보기 로드
      loadPreview('obituary');
      
    } catch (error) {
      console.error('Error initializing page:', error);
      setErrorMessage('페이지를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const loadPreview = async (docType) => {
    try {
      const preview = await documentService.previewDocument(docType, formData);
      setPreviewContent(preview);
    } catch (error) {
      console.error('Error loading preview:', error);
      setPreviewContent({
        title: '미리보기 오류',
        content: '미리보기를 불러올 수 없습니다. 정보 등록을 먼저 완료해주세요.',
        requiredFields: []
      });
    }
  };

  const handleDocumentSelect = (docType) => {
    setSelectedDoc(docType);
    loadPreview(docType);
  };

  const handleGenerateDocument = async (docType) => {
    try {
      setGenerating(true);
      setSuccessMessage('');
      setErrorMessage('');

      // 필수 필드 검증
      const validation = documentUtils.validateRequiredFields(docType, formData);
      if (!validation.isValid) {
        setErrorMessage(`다음 필수 정보가 누락되었습니다: ${validation.missingFields.map(field => field).join(', ')}`);
        return;
      }

      // 서류 생성
      const document = await documentService.generateDocument(selectedCustomer.id, docType, formData);
      
      // 고객의 서류 상태 업데이트
      await customerService.updateDocumentStatus(selectedCustomer.id, docType, true);
      
      setSuccessMessage(`${documentUtils.getDocumentName(docType)}이(가) 성공적으로 생성되었습니다.`);
      
      // 서류 목록 갱신
      const updatedDocs = await documentService.getCustomerDocuments(selectedCustomer.id);
      setDocuments(updatedDocs);
      
    } catch (error) {
      console.error('Error generating document:', error);
      setErrorMessage('서류 생성 중 오류가 발생했습니다.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async (docType) => {
    try {
      const blob = await documentService.downloadDocument(1); // Mock ID
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
      console.error('Error downloading document:', error);
      setErrorMessage('다운로드 중 오류가 발생했습니다.');
    }
  };

  const handlePrint = async (docType) => {
    try {
      await documentService.printDocument(1); // Mock ID
      setSuccessMessage(`${documentUtils.getDocumentName(docType)} 인쇄 대화상자가 열렸습니다.`);
    } catch (error) {
      console.error('Error printing document:', error);
      setErrorMessage('인쇄 중 오류가 발생했습니다.');
    }
  };

  const handleBulkAction = async (action) => {
    setBulkAction(action);
    setShowConfirmModal(true);
  };

  const confirmBulkAction = async () => {
    try {
      setGenerating(true);
      setShowConfirmModal(false);

      if (bulkAction === 'generateAll') {
        // 모든 서류 생성
        for (const docType of ['obituary', 'deathCertificate', 'schedule']) {
          await handleGenerateDocument(docType);
        }
        setSuccessMessage('모든 서류가 성공적으로 생성되었습니다.');
      } else if (bulkAction === 'printAll') {
        // 완성된 서류 모두 인쇄
        await documentService.printDocument(1); // Mock implementation
        setSuccessMessage('완성된 서류를 모두 인쇄합니다.');
      }
    } catch (error) {
      setErrorMessage('일괄 작업 중 오류가 발생했습니다.');
    } finally {
      setGenerating(false);
    }
  };

  const isDocumentGenerated = (docType) => {
    return selectedCustomer?.documents?.[docType] || false;
  };

  const getDocumentStatusBadge = (docType) => {
    const isGenerated = isDocumentGenerated(docType);
    return (
      <Badge 
        bg={isGenerated ? 'success' : 'secondary'}
        style={{ fontSize: '10px', marginLeft: '8px' }}
      >
        {isGenerated ? '생성완료' : '미생성'}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="page-wrapper" style={{
        '--navbar-height': '70px',
        height: 'calc(100vh - var(--navbar-height))',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="text-center" style={{ color: '#374151' }}>
          <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3" style={{ fontSize: '1.2rem' }}>서류 관리 페이지를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!selectedCustomer) {
    return (
      <div className="page-wrapper" style={{
        '--navbar-height': '70px',
        height: 'calc(100vh - var(--navbar-height))',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="text-center">
          <h3>선택된 고객이 없습니다</h3>
          <Button variant="primary" onClick={() => navigate('/menu1-1')}>
            고객 목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper" style={{
      '--navbar-height': '70px',
      height: 'calc(100vh - var(--navbar-height))',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '20px',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
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
        background: 'rgba(255, 255, 255, 0.7)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        borderRadius: '20px',
        transform: animateCard ? 'translateY(0)' : 'translateY(30px)',
        opacity: animateCard ? 1 : 0,
        transition: 'all 0.6s ease-out',
        padding: '20px',
        overflow: 'hidden',
      }}>
        {/* 헤더 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '2px solid rgba(102, 126, 234, 0.1)'
        }}>
          <button
            onClick={() => navigate('/menu1-1')}
            style={{
              marginRight: '16px',
              background: 'rgba(102, 126, 234, 0.1)',
              color: '#667eea',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(102, 126, 234, 0.15)';
              e.target.style.transform = 'translateX(-3px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(102, 126, 234, 0.1)';
              e.target.style.transform = 'translateX(0)';
            }}
          >
            <ArrowLeft size={16} style={{ marginRight: '6px' }} />
            돌아가기
          </button>
          <h1 style={{
            fontSize: '2.2rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
          }}>
            서류 관리 - {selectedCustomer.name}
          </h1>
        </div>

        {/* 알림 메시지 */}
        {successMessage && (
          <Alert variant="success" className="mb-3" dismissible onClose={() => setSuccessMessage('')}>
            {successMessage}
          </Alert>
        )}
        {errorMessage && (
          <Alert variant="danger" className="mb-3" dismissible onClose={() => setErrorMessage('')}>
            {errorMessage}
          </Alert>
        )}

        {/* 메인 콘텐츠 */}
        <div style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 3fr',
          gap: '20px',
          minHeight: 0,
          overflow: 'hidden'
        }}>
          {/* 왼쪽 서류 선택 영역 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            overflowY: 'auto',
            height: '100%',
            paddingRight: '10px'
          }}>
            {/* 부고장 */}
            <div
              style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                padding: '16px',
                cursor: 'pointer',
                border: selectedDoc === 'obituary' ? '2px solid #3b82f6' : '2px solid transparent',
                backgroundColor: selectedDoc === 'obituary' ? '#eff6ff' : 'white',
                transition: 'all 0.3s ease'
              }}
              onClick={() => handleDocumentSelect('obituary')}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '100%',
                  height: '128px',
                  background: '#f3f4f6',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FileText size={48} style={{ color: '#9ca3af' }} />
                </div>
                <h3 style={{
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px',
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  부고장
                  {getDocumentStatusBadge('obituary')}
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '4px'
                }}>
                  <button 
                    style={{
                      background: '#3b82f6',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDocumentSelect('obituary');
                    }}
                  >
                    <Eye size={12} style={{ marginRight: '4px' }} />
                    미리보기
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGenerateDocument('obituary');
                    }}
                    disabled={generating}
                    style={{
                      background: isDocumentGenerated('obituary') ? '#10b981' : '#6b7280',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    {generating ? <Loader size={12} className="spinner" /> : <Check size={12} />}
                    <span style={{ marginLeft: '4px' }}>
                      {isDocumentGenerated('obituary') ? '재생성' : '생성'}
                    </span>
                  </button>
                  <button 
                    style={{
                      background: '#6b7280',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload('obituary');
                    }}
                  >
                    <Download size={12} style={{ marginRight: '4px' }} />
                    다운로드
                  </button>
                  <button 
                    style={{
                      background: '#8b5cf6',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrint('obituary');
                    }}
                  >
                    <Printer size={12} style={{ marginRight: '4px' }} />
                    인쇄
                  </button>
                </div>
              </div>
            </div>

            {/* 사망신고서 */}
            <div
              style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                padding: '16px',
                cursor: 'pointer',
                border: selectedDoc === 'deathCertificate' ? '2px solid #3b82f6' : '2px solid transparent',
                backgroundColor: selectedDoc === 'deathCertificate' ? '#eff6ff' : 'white',
                transition: 'all 0.3s ease'
              }}
              onClick={() => handleDocumentSelect('deathCertificate')}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '100%',
                  height: '128px',
                  background: '#f3f4f6',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FileText size={48} style={{ color: '#9ca3af' }} />
                </div>
                <h3 style={{
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px',
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  사망신고서
                  {getDocumentStatusBadge('deathCertificate')}
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '4px'
                }}>
                  <button 
                    style={{
                      background: '#3b82f6',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDocumentSelect('deathCertificate');
                    }}
                  >
                    <Eye size={12} style={{ marginRight: '4px' }} />
                    미리보기
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGenerateDocument('deathCertificate');
                    }}
                    disabled={generating}
                    style={{
                      background: isDocumentGenerated('deathCertificate') ? '#10b981' : '#6b7280',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    {generating ? <Loader size={12} className="spinner" /> : <Check size={12} />}
                    <span style={{ marginLeft: '4px' }}>
                      {isDocumentGenerated('deathCertificate') ? '재생성' : '생성'}
                    </span>
                  </button>
                  <button 
                    style={{
                      background: '#6b7280',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload('deathCertificate');
                    }}
                  >
                    <Download size={12} style={{ marginRight: '4px' }} />
                    다운로드
                  </button>
                  <button 
                    style={{
                      background: '#8b5cf6',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrint('deathCertificate');
                    }}
                  >
                    <Printer size={12} style={{ marginRight: '4px' }} />
                    인쇄
                  </button>
                </div>
              </div>
            </div>

            {/* 장례일정표 */}
            <div
              style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                padding: '16px',
                cursor: 'pointer',
                border: selectedDoc === 'schedule' ? '2px solid #3b82f6' : '2px solid transparent',
                backgroundColor: selectedDoc === 'schedule' ? '#eff6ff' : 'white',
                transition: 'all 0.3s ease'
              }}
              onClick={() => handleDocumentSelect('schedule')}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '100%',
                  height: '128px',
                  background: '#f3f4f6',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Calendar size={48} style={{ color: '#9ca3af' }} />
                </div>
                <h3 style={{
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px',
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  장례일정표
                  {getDocumentStatusBadge('schedule')}
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '4px'
                }}>
                  <button 
                    style={{
                      background: '#3b82f6',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDocumentSelect('schedule');
                    }}
                  >
                    <Eye size={12} style={{ marginRight: '4px' }} />
                    미리보기
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGenerateDocument('schedule');
                    }}
                    disabled={generating}
                    style={{
                      background: isDocumentGenerated('schedule') ? '#10b981' : '#6b7280',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    {generating ? <Loader size={12} className="spinner" /> : <Check size={12} />}
                    <span style={{ marginLeft: '4px' }}>
                      {isDocumentGenerated('schedule') ? '재생성' : '생성'}
                    </span>
                  </button>
                  <button 
                    style={{
                      background: '#6b7280',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload('schedule');
                    }}
                  >
                    <Download size={12} style={{ marginRight: '4px' }} />
                    다운로드
                  </button>
                  <button 
                    style={{
                      background: '#8b5cf6',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrint('schedule');
                    }}
                  >
                    <Printer size={12} style={{ marginRight: '4px' }} />
                    인쇄
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽 미리보기 영역 */}
          <div style={{
            background: '#f9fafb',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {previewContent ? (
              <div style={{
                height: '100%',
                background: 'white',
                borderRadius: '8px',
                margin: '16px',
                padding: '24px',
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '32px',
                  flex: 1,
                  fontFamily: 'serif',
                  overflow: 'auto'
                }}>
                  <h2 style={{
                    textAlign: 'center',
                    marginBottom: '32px',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#111827'
                  }}>
                    {previewContent.title}
                  </h2>
                  <div style={{
                    whiteSpace: 'pre-line',
                    lineHeight: '1.8',
                    fontSize: '16px',
                    color: '#374151'
                  }}>
                    {previewContent.content}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'white',
                borderRadius: '8px',
                margin: '16px'
              }}>
                <div style={{ textAlign: 'center', color: '#6b7280' }}>
                  <FileText size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                  <h3>서류를 선택해주세요</h3>
                  <p>왼쪽에서 서류를 선택하면 미리보기가 표시됩니다</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 하단 일괄 처리 버튼 */}
        <div style={{
          marginTop: '16px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          padding: '12px',
          borderTop: '1px solid rgba(229, 231, 235, 0.5)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px'
          }}>
            <Button
              variant="primary"
              onClick={() => handleBulkAction('generateAll')}
              disabled={generating}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 12px',
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.9rem'
              }}
            >
              {generating ? <Loader size={14} className="spinner me-2" /> : <FileText size={14} style={{ marginRight: '6px' }} />}
              전체 서류 일괄 생성
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleBulkAction('printAll')}
              style={{
                borderRadius: '8px',
                padding: '6px 12px',
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.9rem'
              }}
            >
              <Printer size={14} style={{ marginRight: '6px' }} />
              완성된 서류 일괄 인쇄
            </Button>
          </div>
        </div>
      </div>

      {/* 확인 모달 */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {bulkAction === 'generateAll' && '모든 서류를 일괄 생성하시겠습니까?'}
          {bulkAction === 'printAll' && '완성된 모든 서류를 인쇄하시겠습니까?'}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            취소
          </Button>
          <Button variant="primary" onClick={confirmBulkAction}>
            확인
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-in {
          animation: fadeInUp 0.6s ease-out;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* 스크롤바 스타일 */
        div::-webkit-scrollbar {
          width: 6px;
        }
        div::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
        div::-webkit-scrollbar-thumb {
          background-color: rgba(108, 117, 125, 0.5);
          border-radius: 10px;
        }

        @media (max-width: 1200px) {
          .page-wrapper {
            height: auto;
            min-height: calc(100vh - var(--navbar-height));
            padding: 15px;
          }
          .dashboard-container {
            height: auto !important;
            min-height: calc(100vh - 90px);
          }
          
          /* 그리드를 세로로 변경 */
          .dashboard-container > div:nth-child(3) {
            grid-template-columns: 1fr !important;
            gap: 15px !important;
          }
          
          /* 왼쪽 서류 영역을 가로로 배치 */
          .dashboard-container > div:nth-child(3) > div:first-child {
            flex-direction: row !important;
            overflow-x: auto !important;
            overflow-y: visible !important;
            height: auto !important;
            padding-right: 0 !important;
            gap: 12px !important;
          }
          
          /* 서류 카드 최소 너비 설정 */
          .dashboard-container > div:nth-child(3) > div:first-child > div {
            min-width: 200px !important;
          }
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding: 15px !important;
          }
          
          h1 {
            font-size: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Menu1_3;
