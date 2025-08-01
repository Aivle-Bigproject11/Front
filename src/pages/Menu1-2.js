import React, { useState, useEffect } from 'react';
import { Button, Alert, Card, Form } from 'react-bootstrap';
import { ArrowLeft, Save, User, Users, FileText, MapPin, Phone, Calendar } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import { customerService, customerUtils } from '../services/customerService';
import { initialFormData, formGroups, fieldLabels, fieldTypes, validationRules } from '../data/formData';

const Menu1_2 = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [saving, setSaving] = useState(false);
  const [animateCard, setAnimateCard] = useState(false);
  const [errors, setErrors] = useState({});
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
        고인성명한글: customer.name || '',
        고인나이: customer.age || '',
        상조회사고객전화번호: customer.phone || '',
        장례식장주소: customer.location || '',
        고인돌아가신날짜: customer.funeralDate || '',
        발인일시: customer.funeralDate || ''
      }));
    } else {
      navigate('/menu1-1');
      return;
    }

    setAnimateCard(true);
  }, [navigate]);

  const validateField = (name, value) => {
    const rules = validationRules;
    const fieldErrors = [];

    if (rules.required?.includes(name) && !value.trim()) {
      fieldErrors.push(`${fieldLabels[name]}은(는) 필수 입력 항목입니다.`);
    }
    if (rules.minLength?.[name] && value.length < rules.minLength[name]) {
      fieldErrors.push(`${fieldLabels[name]}은(는) 최소 ${rules.minLength[name]}자 이상이어야 합니다.`);
    }
    if (rules.maxLength?.[name] && value.length > rules.maxLength[name]) {
      fieldErrors.push(`${fieldLabels[name]}은(는) 최대 ${rules.maxLength[name]}자까지 입력 가능합니다.`);
    }
    if (rules.pattern?.[name] && value && !rules.pattern[name].test(value)) {
      fieldErrors.push(`${fieldLabels[name]}의 형식이 올바르지 않습니다.`);
    }
    return fieldErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    const fieldErrors = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: fieldErrors }));
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
      setTimeout(() => navigate('/menu1-1'), 2000);
    } catch (error) {
      console.error('Error saving form data:', error);
      setErrorMessage('저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => navigate('/menu1-1');
  const getFieldType = (fieldName) => fieldTypes[fieldName] || 'text';
  const getGroupIcon = (groupName) => ({
    상조회사정보: <Users size={20} />,
    고객정보: <User size={20} />,
    고인기본정보: <FileText size={20} />,
    신고인정보: <Phone size={20} />,
    제출인정보: <FileText size={20} />,
    장례정보: <MapPin size={20} />
  }[groupName] || <FileText size={20} />);

  if (!selectedCustomer) {
    return <div>고객 정보를 불러오는 중...</div>;
  }

  return (
    <div className="page-wrapper" style={{
      '--navbar-height': '62px',
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
        boxSizing: 'border-box',
        background: 'rgba(255, 255, 255, 0.7)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        borderRadius: '20px',
        padding: '20px',
        gap: '20px',
        overflow: 'hidden',
      }}>
        {/* 왼쪽 사이드바 */}
        <div style={{ flex: '0 0 400px', display: 'flex', flexDirection: 'column' }}>
          <h4 className="mb-3" style={{ fontSize: '30px', fontWeight: '700', color: '#343a40', paddingLeft: '10px' }}>
            장례정보 등록
          </h4>
          <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '15px',
            padding: '20px',
            height: 'min-content',
            position: 'sticky',
            top: '20px'
          }}>
            <div style={{
              width: '120px', height: '120px', background: 'rgba(111, 66, 193, 0.2)',
              borderRadius: '50%', margin: '0 auto 30px', display: 'flex',
              alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}>
              <FileText size={48} style={{ color: '#6f42c1' }} />
            </div>
            <h2 style={{ fontWeight: '700', fontSize: '1.8rem', textAlign: 'center', color: '#343a40' }}>
              {selectedCustomer.name}님 정보
            </h2>
            <p style={{ fontSize: '16px', lineHeight: '1.6', opacity: 0.7, textAlign: 'center', color: '#6c757d' }}>
              고객님의 장례정보를<br/>
              정확하게 입력해주세요.
            </p>
            <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px'}}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <User size={16} style={{ color: '#6f42c1', marginRight: '10px' }} />
                <span style={{fontWeight: 500}}>{selectedCustomer.name} (향년 {selectedCustomer.age}세)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <Phone size={16} style={{ color: '#6f42c1', marginRight: '10px' }} />
                <span style={{fontWeight: 500}}>{selectedCustomer.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <Calendar size={16} style={{ color: '#6f42c1', marginRight: '10px' }} />
                <span style={{fontWeight: 500}}>별세일: {customerUtils.formatDate(selectedCustomer.funeralDate)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <MapPin size={16} style={{ color: '#6f42c1', marginRight: '10px' }} />
                <span style={{fontWeight: 500}}>주소 : {selectedCustomer.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 메인 콘텐츠 */}
        <div className="dashboard-right" style={{
          flex: '1',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0 20px 0', borderBottom: '1px solid rgba(229, 231, 235, 0.5)', marginBottom: '20px', flexShrink: 0 }}>
            <h3 style={{ color: '#374151', fontWeight: '600', fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center' }}>
              <button onClick={handleCancel} style={{ all: 'unset', cursor: 'pointer', marginRight: '16px', color: '#6f42c1' }}>
                <ArrowLeft size={24} />
              </button>
              상세 정보 입력
            </h3>
            <div className="d-flex gap-2">
              <Button variant="outline-secondary" size="sm" onClick={handleCancel} disabled={saving}>
                취소
              </Button>
              <Button size="sm" className="btn-purple" onClick={handleSave} disabled={saving}>
                {saving ? '저장 중...' : <><Save size={14} className="me-2" /> 저장</>}
              </Button>
            </div>
          </div>
          
          {successMessage && <Alert variant="success" className="mb-4 flex-shrink-0">{successMessage}</Alert>}
          {errorMessage && <Alert variant="danger" className="mb-4 flex-shrink-0">{errorMessage}</Alert>}

          <div className="form-scroll-area" style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
            {Object.entries(formGroups).map(([groupName, fields]) => (
              <Card key={groupName} className="mb-4">
                <Card.Header>
                  <h5 style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
                    {getGroupIcon(groupName)}
                    <span style={{ marginLeft: '8px' }}>{groupName}</span>
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    {fields.map((fieldName) => (
                      <Form.Group key={fieldName}>
                        <Form.Label>
                          {fieldLabels[fieldName] || fieldName}
                          {validationRules.required?.includes(fieldName) && <span style={{ color: '#dc3545', marginLeft: '4px' }}>*</span>}
                        </Form.Label>
                        <Form.Control
                          type={getFieldType(fieldName)}
                          name={fieldName}
                          value={formData[fieldName]}
                          onChange={handleInputChange}
                          placeholder={`${fieldLabels[fieldName] || fieldName} 입력`}
                          isInvalid={errors[fieldName]?.length > 0}
                        />
                        {errors[fieldName] && <Form.Control.Feedback type="invalid">{errors[fieldName].join(', ')}</Form.Control.Feedback>}
                      </Form.Group>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .dashboard-container { opacity: 0; }
        .dashboard-container.animate-in {
          opacity: 1;
          animation: fadeIn 0.6s ease-out;
        }

        .form-scroll-area::-webkit-scrollbar { width: 6px; }
        .form-scroll-area::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); border-radius: 10px; }
        .form-scroll-area::-webkit-scrollbar-thumb { background-color: rgba(108, 117, 125, 0.5); border-radius: 10px; }
        
        .form-control:focus {
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
          border-color: #667eea !important;
        }
        @media (max-width: 1200px) {
          .page-wrapper { height: auto; min-height: calc(100vh - var(--navbar-height)); }
          .dashboard-container { flex-direction: column; height: auto; }
          .dashboard-left { position: static; width: 100%; flex: 0 0 auto; }
          .dashboard-right { height: auto; max-height: none; }
        }

        .btn-purple {
            background-color: #6f42c1;
            border-color: #6f42c1;
            color: white;
            }
            .btn-purple:hover {
                            background-color: transparent;
            background-color: #5a32a3;
            border-color: #5a32a3;
            color: white;
            }

            .btn-outline-purple {
            background-color: transparent;
            border-color: #6f42c1;
            color: #6f42c1;
            }
            .btn-outline-purple:hover {
            background-color: #6f42c1;
            border-color: #6f42c1;
            color: white;
            }
        }
      `}</style>
    </div>
  );
};

export default Menu1_2;