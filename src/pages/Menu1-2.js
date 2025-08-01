// src/pages/Menu1-2.js - 장례정보 등록 페이지

import React, { useState, useEffect } from 'react';
import { Button, Alert, Card, Form } from 'react-bootstrap';
import { ArrowLeft, Save, User, Users, FileText, MapPin, Calendar, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { customerService } from '../services/customerService';
import { initialFormData, formGroups, fieldLabels, fieldTypes, validationRules } from '../data/formData';
import './Menu3.css';

const Menu1_2 = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [animateCard, setAnimateCard] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    // 로컬 스토리지에서 선택된 고객 정보 가져오기
    const customerData = localStorage.getItem('selectedCustomer');
    if (customerData) {
      const customer = JSON.parse(customerData);
      setSelectedCustomer(customer);
      
      // 고객 정보로 폼 데이터 초기화
      setFormData(prev => ({
        ...prev,
        고인성명한글: customer.name || '',
        고인나이: customer.age || '',
        상조회사고객전화번호: customer.phone || '',
        장례식장주소: customer.location || '',
        고인돌아가신날짜: customer.funeralDate || '',
        발인일시: customer.funeralDate || ''
      }));
    } else {
      // 선택된 고객이 없으면 목록으로 리다이렉트
      navigate('/menu1-1');
      return;
    }

    setAnimateCard(true);
  }, [navigate]);

  const validateField = (name, value) => {
    const rules = validationRules;
    const fieldErrors = [];

    // 필수 필드 체크
    if (rules.required?.includes(name) && !value.trim()) {
      fieldErrors.push(`${fieldLabels[name]}은(는) 필수 입력 항목입니다.`);
    }

    // 최소 길이 체크
    if (rules.minLength?.[name] && value.length < rules.minLength[name]) {
      fieldErrors.push(`${fieldLabels[name]}은(는) 최소 ${rules.minLength[name]}자 이상이어야 합니다.`);
    }

    // 최대 길이 체크
    if (rules.maxLength?.[name] && value.length > rules.maxLength[name]) {
      fieldErrors.push(`${fieldLabels[name]}은(는) 최대 ${rules.maxLength[name]}자까지 입력 가능합니다.`);
    }

    // 패턴 체크
    if (rules.pattern?.[name] && value && !rules.pattern[name].test(value)) {
      fieldErrors.push(`${fieldLabels[name]}의 형식이 올바르지 않습니다.`);
    }

    return fieldErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 실시간 유효성 검사
    const fieldErrors = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: fieldErrors
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.entries(formData).forEach(([name, value]) => {
      const fieldErrors = validateField(name, value);
      if (fieldErrors.length > 0) {
        newErrors[name] = fieldErrors;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    setSuccessMessage('');
    setErrorMessage('');

    if (!validateForm()) {
      setErrorMessage('입력 정보를 확인해주세요.');
      return;
    }

    try {
      setSaving(true);
      
      // 고객 정보 업데이트
      await customerService.updateCustomer(selectedCustomer.id, {
        ...selectedCustomer,
        name: formData.고인성명한글 || selectedCustomer.name,
        age: formData.고인나이 || selectedCustomer.age,
        phone: formData.상조회사고객전화번호 || selectedCustomer.phone,
        location: formData.장례식장주소 || selectedCustomer.location,
        funeralDate: formData.발인일시 || selectedCustomer.funeralDate,
        formData: formData
      });

      setSuccessMessage('장례 정보가 성공적으로 저장되었습니다.');
      
      // 3초 후 목록으로 이동
      setTimeout(() => {
        navigate('/menu1-1');
      }, 2000);
      
    } catch (error) {
      console.error('Error saving form data:', error);
      setErrorMessage('저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/menu1-1');
  };

  const getFieldType = (fieldName) => {
    return fieldTypes[fieldName] || 'text';
  };

  const getGroupIcon = (groupName) => {
    const icons = {
      상조회사정보: <Users size={20} />,
      고객정보: <User size={20} />,
      고인기본정보: <FileText size={20} />,
      신고인정보: <Phone size={20} />,
      제출인정보: <FileText size={20} />,
      장례정보: <MapPin size={20} />
    };
    return icons[groupName] || <FileText size={20} />;
  };

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
      padding: '24px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start'
    }}>
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '1400px',
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(8px)',
        borderRadius: '20px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        padding: '32px',
        transform: animateCard ? 'translateY(0)' : 'translateY(30px)',
        opacity: animateCard ? 1 : 0,
        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* 헤더 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '32px',
          paddingBottom: '24px',
          borderBottom: '2px solid rgba(102, 126, 234, 0.1)'
        }}>
          <button
            onClick={handleCancel}
            style={{
              marginRight: '20px',
              background: 'rgba(102, 126, 234, 0.1)',
              color: '#667eea',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
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
            장례정보 등록 - {selectedCustomer.name}
          </h1>
        </div>

        {/* 알림 메시지 */}
        {successMessage && (
          <Alert variant="success" className="mb-4">
            {successMessage}
          </Alert>
        )}
        {errorMessage && (
          <Alert variant="danger" className="mb-4">
            {errorMessage}
          </Alert>
        )}

        {/* 폼 콘텐츠 */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '32px',
          maxHeight: '70vh',
          overflowY: 'auto',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(229, 231, 235, 0.8)'
        }}>
          {/* 그룹별 폼 필드 */}
          {Object.entries(formGroups).map(([groupName, fields]) => (
            <Card key={groupName} className="mb-4" style={{
              border: '1px solid rgba(229, 231, 235, 0.5)',
              borderRadius: '16px',
              overflow: 'hidden'
            }}>
              <Card.Header style={{
                background: 'linear-gradient(135deg, #f8f9ff 0%, #e8ecff 100%)',
                border: 'none',
                padding: '16px 24px'
              }}>
                <h5 style={{
                  margin: 0,
                  color: '#374151',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {getGroupIcon(groupName)}
                  <span style={{ marginLeft: '8px' }}>{groupName}</span>
                </h5>
              </Card.Header>
              <Card.Body style={{ padding: '24px' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '20px'
                }}>
                  {fields.map((fieldName) => (
                    <Form.Group key={fieldName}>
                      <Form.Label style={{
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '8px',
                        fontSize: '0.95rem'
                      }}>
                        {fieldLabels[fieldName] || fieldName}
                        {validationRules.required?.includes(fieldName) && (
                          <span style={{ color: '#dc3545', marginLeft: '4px' }}>*</span>
                        )}
                      </Form.Label>
                      <Form.Control
                        type={getFieldType(fieldName)}
                        name={fieldName}
                        value={formData[fieldName]}
                        onChange={handleInputChange}
                        placeholder={`${fieldLabels[fieldName] || fieldName} 입력`}
                        isInvalid={errors[fieldName]?.length > 0}
                        style={{
                          padding: '14px 16px',
                          borderRadius: '12px',
                          fontSize: '0.95rem',
                          backgroundColor: '#fafafa',
                          border: '2px solid #e5e7eb',
                          transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#667eea';
                          e.target.style.backgroundColor = 'white';
                          e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = errors[fieldName]?.length > 0 ? '#dc3545' : '#e5e7eb';
                          e.target.style.backgroundColor = '#fafafa';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                      {errors[fieldName] && (
                        <Form.Control.Feedback type="invalid">
                          {errors[fieldName].join(', ')}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                  ))}
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>

        {/* 하단 버튼 */}
        <div style={{
          marginTop: '32px',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '16px'
        }}>
          <Button
            variant="secondary"
            size="lg"
            onClick={handleCancel}
            disabled={saving}
            style={{
              borderRadius: '12px',
              fontWeight: '600',
              padding: '12px 24px'
            }}
          >
            취소
          </Button>

          <Button
            variant="primary"
            size="lg"
            onClick={handleSave}
            disabled={saving}
            style={{
              borderRadius: '12px',
              fontWeight: '600',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none'
            }}
          >
            {saving ? (
              <>
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                저장 중...
              </>
            ) : (
              <>
                <Save size={16} style={{ marginRight: '6px' }} />
                저장
              </>
            )}
          </Button>
        </div>
      </div>

      <style jsx global>{`
        .form-control:focus {
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
          border-color: #667eea !important;
        }
      `}</style>
    </div>
  );
};

export default Menu1_2;
