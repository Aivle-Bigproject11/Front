import React, { useState, useEffect } from 'react';
import { Button, Alert, Card, Form, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ArrowLeft, Save, User, FileText, MapPin, Building, Briefcase, Phone, Calendar, Home, Search, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { customerService, customerUtils } from '../services/customerService';
import { apiService } from '../services/api';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';

registerLocale('ko', ko);

// 폼 필드 정의 (순서 조정)
const fieldSpecs = {
    funeralCompanyName: { label: '이용 상조회사 이름', type: 'text', group: '상조회사정보', required: true },
    directorName: { label: '담당 장례지도사 이름', type: 'text', disabled: true, group: '상조회사정보', required: true },
    directorPhone: { label: '담당 장례지도사 연락처', type: 'text', disabled: true, group: '상조회사정보', required: true },
    customerId: { label: '상조회사 고객 ID', type: 'text', disabled: true, group: '고인기본정보', required: true },
    deceasedName: { label: '고인 성명 (한글)', type: 'text', disabled: true, group: '고인기본정보', required: true },
    deceasedNameHanja: { label: '고인 성명 (한자)', type: 'text', group: '고인기본정보' },
    deceasedRrn: { label: '고인 주민등록번호', type: 'text', disabled: true, group: '고인기본정보', required: true },
    deceasedAge: { label: '고인 나이', type: 'number', disabled: true, group: '고인기본정보', required: true },
    deceasedBirthOfDate: { label: '고인 생일', type: 'date', disabled: true, group: '고인기본정보', required: true },
    deceasedGender: { label: '고인 성별', type: 'text', disabled: true, group: '고인기본정보', required: true },
    deceasedReligion: { label: '고인 종교', type: 'select', group: '고인기본정보', options: [
        { value: '기독교', label: '기독교' },
        { value: '불교', label: '불교' },
        { value: '천주교', label: '천주교' },
        { value: '개신교', label: '개신교' },
        { value: '무교', label: '무교' },
        { value: '기타', label: '기타' }
    ] },
    deceasedDate: { label: '고인 돌아가신 날짜', type: 'datetime', group: '고인기본정보', required: true },
    deceasedAddress: { label: '고인 주소', type: 'text', group: '고인기본정보', required: true },
    deceasedRegisteredAddress: { label: '고인 등록기준지', type: 'text', group: '고인기본정보' },
    deceasedRelationToHouseholdHead: { label: '고인과 세대주와의 관계', type: 'text', group: '고인기본정보', required: true },
    reportRegistrationDate: { label: '사망신고서 시스템 등록일자', type: 'text', disabled: true, group: '사망신고서정보', required: true },
    deathLocation: { label: '사망 장소', type: 'text', group: '사망신고서정보', required: true },
    deathLocationType: { label: '사망 장소 (구분)', type: 'select', group: '사망신고서정보', options: [
        { value: '1', label: '주택' },
        { value: '2', label: '의료기관' },
        { value: '3', label: '사회복지시설(양로원, 고아원 등)' },
        { value: '4', label: '공공시설(학교, 운동장 등)' },
        { value: '5', label: '도로' },
        { value: '6', label: '상업/서비스시설(상점, 호텔 등)' },
        { value: '7', label: '산업장' },
        { value: '8', label: '농장(논밭, 축사, 양식장 등)' },
        { value: '9', label: '병원 이송 중 사망' },
        { value: '10', label: '기타' }
    ], required: true },
    deathLocationEtc: { label: '사망 장소 기타사항', type: 'text', group: '사망신고서정보' },
    deathReportEtc: { label: '사망신고서 기타사항', type: 'text', group: '사망신고서정보' },
    submitterName: { label: '사망신고서 상의 제출인 이름', type: 'text', group: '사망신고서정보' },
    submitterRrn: { label: '제출인 주민등록번호', type: 'text', group: '사망신고서정보' },
    reporterName: { label: '신고인 이름', type: 'text', group: '신고인정보', required: true },
    reporterRrn: { label: '신고인 주민등록번호', type: 'text', group: '신고인정보', required: true },
    reporterQualification: { label: '신고인 자격', type: 'select', group: '신고인정보', options: [
        { value: '1', label: '동거친족' },
        { value: '2', label: '비동거친족' },
        { value: '3', label: '동거자' },
        { value: '4', label: '기타(보호시설장/사망장소관리자 등)' }
    ], required: true },
    reporterRelationToDeceased: { label: '신고인과 고인의 관계', type: 'text', group: '신고인정보', required: true },
    reporterAddress: { label: '신고인 주소', type: 'text', group: '신고인정보', required: true },
    reporterPhone: { label: '신고인 전화번호', type: 'text', group: '신고인정보', required: true },
    reporterEmail: { label: '신고인 이메일', type: 'email', group: '신고인정보' },
    funeralHomeName: { label: '장례식장 이름', type: 'text', group: '장례정보', required: true },
    funeralHomeAddress: { label: '장례식장 주소', type: 'text', group: '장례정보', required: true },
    processionDateTime: { label: '발인 일시', type: 'datetime', group: '장례정보', required: true },
    funeralDuration: { label: '장례 기간', type: 'text', group: '장례정보', required: true },
    mortuaryInfo: { label: '빈소 정보', type: 'text', group: '장례정보', required: true },
    burialSiteInfo: { label: '장지 정보', type: 'text', group: '장례정보', required: true },
    chiefMourners: { label: '상주 목록', type: 'text', group: '장례정보', required: true },
    chiefMournersContact: { label: '상주 연락처', type: 'text', group: '장례정보', required: true },
    chiefMournerAccountHolder: { label: '상주 예금주', type: 'text', group: '장례정보' },
    chiefMournerBankName: { label: '상주 은행명', type: 'select', group: '장례정보', options: ['국민은행', '신한은행', '우리은행', '하나은행', '기업은행', '농협은행', '기타'] },
    chiefMournerAccountNumber: { label: '상주 계좌번호', type: 'text', group: '장례정보' },
    templateKeyword: { label: '사용자가 선택한 고인의 키워드', type: 'text', group: '장례정보', required: true },
};

// 폼 그룹핑
const formGroups = {
    상조회사정보: Object.keys(fieldSpecs).filter(f => fieldSpecs[f].group === '상조회사정보'),
    고인기본정보: Object.keys(fieldSpecs).filter(f => fieldSpecs[f].group === '고인기본정보'),
    사망신고서정보: Object.keys(fieldSpecs).filter(f => fieldSpecs[f].group === '사망신고서정보'),
    신고인정보: Object.keys(fieldSpecs).filter(f => fieldSpecs[f].group === '신고인정보'),
    장례정보: Object.keys(fieldSpecs).filter(f => fieldSpecs[f].group === '장례정보'),
};

// 폼 데이터 초기값
const initialFormData = Object.keys(fieldSpecs).reduce((acc, field) => {
    if (fieldSpecs[field].type === 'date' || fieldSpecs[field].type === 'datetime') {
        acc[field] = null;
        if(fieldSpecs[field].type === 'datetime') {
            acc[`${field}_time`] = '';
        }
    } else {
        acc[field] = '';
    }
    return acc;
}, {});

const WarningIcon = ({ suggestion }) => (
    <OverlayTrigger
        placement="right"
        delay={{ show: 250, hide: 400 }}
        overlay={
            <Tooltip id={`tooltip-${suggestion.fieldName}`}>
                <strong>{suggestion.warningDescription}</strong><br />
                <em>제안: {suggestion.suggestion}</em>
            </Tooltip>
        }
    >
        <span style={{ marginLeft: '8px', color: '#ffc107', fontWeight: 'bold', cursor: 'pointer' }}>
             <AlertCircle size={16} />
        </span>
    </OverlayTrigger>
);

const formatDateTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}/${month}/${day}/${hours}:${minutes}`;
};

const Menu1_2 = () => {
    const [formData, setFormData] = useState(initialFormData);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [saving, setSaving] = useState(false);
    const [reviewing, setReviewing] = useState(false);
    const [animateCard, setAnimateCard] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [validationStatus, setValidationStatus] = useState('검토 전');
    const [reviewSuggestions, setReviewSuggestions] = useState([]); // Changed back to array
    
    const navigate = useNavigate();
    const { state } = useLocation();

    useEffect(() => {
        let customer = null;
        if (state && state.funeralInfo) {
            customer = state.funeralInfo;
        } else {
            const customerData = localStorage.getItem('selectedCustomer');
            if (customerData) {
                customer = JSON.parse(customerData);
            }
        }

        if (customer) {
            setSelectedCustomer(customer);
            const initialData = { ...initialFormData };
            Object.keys(fieldSpecs).forEach(key => {
                if (customer[key]) {
                    const fieldSpec = fieldSpecs[key];
                    if (fieldSpec.type === 'date' || fieldSpec.type === 'datetime') {
                        const dateObj = new Date(customer[key]);
                        initialData[key] = dateObj;
                        if(fieldSpec.type === 'datetime') {
                            const hours = String(dateObj.getUTCHours()).padStart(2, '0');
                            const minutes = String(dateObj.getUTCMinutes()).padStart(2, '0');
                            initialData[`${key}_time`] = `${hours}:${minutes}`;
                        }
                    } else {
                        if (key === 'reportRegistrationDate' && customer[key]) {
                            // Convert to Date object and then to ISO string with Z
                            initialData[key] = new Date(customer[key]).toISOString();
                        } else {
                            initialData[key] = customer[key];
                        }
                    }
                }
            });
            setFormData(initialData);
        } else {
            navigate('/menu1-1');
        }
        setAnimateCard(true);
    }, [navigate, state]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name.endsWith('_time')) {
            const numbers = value.replace(/[^0-9]/g, '');
            let formattedTime = numbers;
            if (numbers.length > 2) {
                formattedTime = `${numbers.slice(0, 2)}:${numbers.slice(2, 4)}`;
            }
            setFormData(prev => {
                const fieldName = name.replace('_time', ''); // e.g., 'deceasedDate'
                const dateObj = prev[fieldName] ? new Date(prev[fieldName]) : new Date(); // Get current Date object or new one
                
                if (formattedTime.length === 5 && formattedTime.includes(':')) {
                    const [hours, minutes] = formattedTime.split(':');
                    dateObj.setUTCHours(parseInt(hours, 10));
                    dateObj.setUTCMinutes(parseInt(minutes, 10));
                    dateObj.setSeconds(0);
                    dateObj.setMilliseconds(0);
                } else {
                    // If time is incomplete or invalid, reset to 00:00 or handle as needed
                    dateObj.setHours(0);
                    dateObj.setMinutes(0);
                    dateObj.setSeconds(0);
                    dateObj.setMilliseconds(0);
                }

                return {
                    ...prev,
                    [name]: formattedTime, // Update the time string
                    [fieldName]: dateObj // Update the Date object with new time
                };
            });
        } else if (name === 'reporterPhone' || name === 'chiefMournersContact') {
            const numbersOnly = value.replace(/[^0-9]/g, '');
            let formattedPhone = numbersOnly;
            if (numbersOnly.length > 3 && numbersOnly.length <= 7) {
                formattedPhone = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
            } else if (numbersOnly.length > 7) {
                formattedPhone = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 7)}-${numbersOnly.slice(7, 11)}`;
            }
            setFormData(prev => ({ ...prev, [name]: formattedPhone.slice(0, 13) }));
        } else if (name === 'reporterRrn' || name === 'submitterRrn') {
            const numbers = value.replace(/[^0-9]/g, '');
            const formattedValue = numbers.replace(/(\d{6})(\d{0,7})/, '$1-$2').replace("--", "-");
            setFormData(prev => ({ ...prev, [name]: formattedValue.slice(0, 14) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        
        };

    const handleDateChange = (date, fieldName) => {
        setFormData(prev => ({ ...prev, [fieldName]: date }));
    };

    const handleReview = async () => {
        setReviewing(true);
        setErrorMessage('');
        setSuccessMessage('');
        setReviewSuggestions([]);

        // --- Start of new validation logic ---
        const requiredFields = Object.keys(fieldSpecs).filter(key => fieldSpecs[key].required);
        const missingFields = [];

        requiredFields.forEach(fieldName => {
            const field = fieldSpecs[fieldName];
            let value = formData[fieldName];

            // Special handling for date/datetime fields
            if (field.type === 'datetime' || field.type === 'date') {
                // Check if the date object itself is null or invalid
                if (!value || (field.type === 'datetime' && !formData[`${fieldName}_time`])) {
                    missingFields.push(field.label);
                }
            } else if (!value || (typeof value === 'string' && value.trim() === '')) {
                missingFields.push(field.label);
            }
        });

        if (missingFields.length > 0) {
            setErrorMessage(`다음 필수 항목을 입력해주세요: ${missingFields.join(', ')}`);
            setReviewing(false);
            setValidationStatus('검토 실패'); // Or '입력 필요'
            return; // Stop execution
        }
        // --- End of new validation logic ---
        try {
            const requestBody = {
                deceasedName: formData.deceasedName,
                deceasedNameHanja: formData.deceasedNameHanja,
                deceasedAge: formData.deceasedAge,
                deceasedBirthOfDate: formData.deceasedBirthOfDate,
                deceasedDate: formData.deceasedDate,
                deceasedRegisteredAddress: formData.deceasedRegisteredAddress,
                deceasedAddress: formData.deceasedAddress,
                deceasedRelationToHouseholdHead: formData.deceasedRelationToHouseholdHead,
                reportRegistrationDate: formData.reportRegistrationDate, // This needs to be converted
                deathLocation: formData.deathLocation,
                deathLocationEtc: formData.deathLocationEtc,
                deathReportEtc: formData.deathReportEtc,
                reporterName: formData.reporterName,
                reporterRelationToDeceased: formData.reporterRelationToDeceased,
                reporterAddress: formData.reporterAddress,
                submitterName: formData.submitterName,
                directorName: formData.directorName,
                funeralHomeName: formData.funeralHomeName,
                funeralHomeAddress: formData.funeralHomeAddress,
                funeralDuration: formData.funeralDuration,
                mortuaryInfo: formData.mortuaryInfo,
                processionDateTime: formData.processionDateTime,
                burialSiteInfo: formData.burialSiteInfo,
                chiefMourners: formData.chiefMourners,
                chiefMournerAccountHolder: formData.chiefMournerAccountHolder,
                templateKeyword: formData.templateKeyword,
            };

            // Convert reportRegistrationDate to ISO Z format for POST request
            if (requestBody.reportRegistrationDate) {
                requestBody.reportRegistrationDate = new Date(requestBody.reportRegistrationDate).toISOString();
            }

            const response = await apiService.validateFuneralInfo(requestBody);
            const result = response.data;
            setSuccessMessage('검토요청 완료!');

            if (result.warnings && result.warnings.length > 0) {
                setValidationStatus('수정 필요');
                setReviewSuggestions(result.warnings);
            } else {
                setValidationStatus('검토 완료');
            }
        } catch (error) {
            console.error('Error during review:', error);
            setErrorMessage('검토 중 오류가 발생했습니다.');
            setValidationStatus('검토 실패');
        } finally {
            setReviewing(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const dataToSave = {
                customerId: selectedCustomer.customerId,
                deceasedName: selectedCustomer.deceasedName,
                deceasedNameHanja: formData.deceasedNameHanja,
                deceasedRrn: selectedCustomer.deceasedRrn,
                deceasedAge: selectedCustomer.deceasedAge,
                deceasedBirthOfDate: formData.deceasedBirthOfDate,
                deceasedDate: formData.deceasedDate,
                deceasedReligion: formData.deceasedReligion,
                deceasedRegisteredAddress: formData.deceasedRegisteredAddress,
                deceasedAddress: formData.deceasedAddress,
                deceasedRelationToHouseholdHead: formData.deceasedRelationToHouseholdHead,
                reportRegistrationDate: selectedCustomer.reportRegistrationDate,
                deathLocation: formData.deathLocation,
                deathLocationType: formData.deathLocationType,
                deathLocationEtc: formData.deathLocationEtc,
                deathReportEtc: formData.deathReportEtc,
                reporterName: formData.reporterName,
                reporterRrn: formData.reporterRrn,
                reporterQualification: formData.reporterQualification,
                reporterRelationToDeceased: formData.reporterRelationToDeceased,
                reporterAddress: formData.reporterAddress,
                reporterPhone: formData.reporterPhone,
                reporterEmail: formData.reporterEmail,
                submitterName: formData.submitterName,
                submitterRrn: formData.submitterRrn,
                funeralCompanyName: formData.funeralCompanyName,
                directorName: selectedCustomer.directorName,
                directorPhone: selectedCustomer.directorPhone,
                funeralHomeName: formData.funeralHomeName,
                funeralHomeAddress: formData.funeralHomeAddress,
                funeralHomeAddressUrl: selectedCustomer.funeralHomeAddressUrl,
                funeralDuration: formData.funeralDuration,
                mortuaryInfo: formData.mortuaryInfo,
                processionDateTime: formData.processionDateTime,
                burialSiteInfo: formData.burialSiteInfo,
                chiefMourners: formData.chiefMourners,
                chiefMournersContact: formData.chiefMournersContact,
                chiefMournerAccountHolder: formData.chiefMournerAccountHolder,
                chiefMournerBankName: formData.chiefMournerBankName,
                chiefMournerAccountNumber: formData.chiefMournerAccountNumber,
                templateKeyword: formData.templateKeyword,
            };

            // Convert reportRegistrationDate to ISO Z format for PUT request
            if (dataToSave.reportRegistrationDate) {
                dataToSave.reportRegistrationDate = new Date(dataToSave.reportRegistrationDate).toISOString();
            }

            ['deceasedDate', 'processionDateTime'].forEach(field => {
                if (dataToSave[field] && dataToSave[`${field}_time`]) {
                    const date = new Date(dataToSave[field]);
                    const [hours, minutes] = dataToSave[`${field}_time`].split(':');
                    date.setHours(parseInt(hours, 10));
                    date.setMinutes(parseInt(minutes, 10));
                    date.setSeconds(0);
                    date.setMilliseconds(0);
                    dataToSave[field] = date.toISOString();
                }
            });
            
            if (dataToSave.deceasedBirthOfDate) {
                dataToSave.deceasedBirthOfDate = new Date(dataToSave.deceasedBirthOfDate).toISOString();
            }

            await apiService.updateFuneralInfo(selectedCustomer.funeralInfoId, dataToSave);
            setSuccessMessage('장례 정보가 성공적으로 저장되었습니다.');
        } catch (error) {
            console.error('Error saving form data:', error);
            setErrorMessage('저장 중 오류가 발생했습니다.');
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

    if (!selectedCustomer) {
        return null; 
    }

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
                            {selectedCustomer.deceasedName}님 정보
                        </h2>
                        <p style={{ fontSize: '16px', lineHeight: '1.6', opacity: 0.9, textAlign: 'center', color: '#4A3728' }}>
                            고객님의 장례정보를<br/>정확하게 입력해주세요.
                        </p>
                        <div style={{ marginTop: '30px', borderTop: '1px solid rgba(184, 134, 11, 0.2)', paddingTop: '20px'}}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}><User size={16} style={{ color: '#B8860B', marginRight: '10px' }} /><span style={{fontWeight: 500, color: '#4A3728'}}>성함 : {selectedCustomer.deceasedName} (향년 {selectedCustomer.deceasedAge}세)</span></div>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}><Building size={16} style={{ color: '#B8860B', marginRight: '10px' }} /><span style={{fontWeight: 500, color: '#4A3728'}}>장례식장 : {formData.funeralHomeName || selectedCustomer.funeralHomeName}</span></div>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}><Calendar size={16} style={{ color: '#B8860B', marginRight: '10px' }} /><span style={{fontWeight: 500, color: '#4A3728'}}>별세일 : {customerUtils.formatDate(selectedCustomer.deceasedDate)}</span></div>
                            <div style={{ display: 'flex', alignItems: 'center' }}><Home size={16} style={{ color: '#B8860B', marginRight: '10px' }} /><span style={{fontWeight: 500, color: '#4A3728'}}>주소 : {formData.funeralHomeAddress || selectedCustomer.funeralHomeAddress}</span></div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-right" style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0 20px 0', borderBottom: '1px solid rgba(184, 134, 11, 0.2)', marginBottom: '20px', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <button onClick={handleCancel} className="back-btn">
                                <ArrowLeft size={16} style={{ marginRight: '6px' }} /> 돌아가기
                            </button>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                <h3 style={{ color: '#2C1F14', fontWeight: '600', fontSize: '1.5rem', margin: 0 }}>상세 정보 입력</h3>
                                <span style={{ fontSize: '0.8rem', color: '#6c757d' }}>* 표시는 필수 입력 항목입니다.</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Button
                                onClick={handleReview}
                                disabled={reviewing}
                                className="btn-outline-golden"
                                size="sm"
                                style={{
                                    padding: '8px 16px',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    borderRadius: '8px',
                                }}
                            >
                                {reviewing ? '검토 중...' : <><Search size={14} style={{ marginRight: '6px' }} /> 검토</>}
                            </Button>
                            <Button onClick={handleSave} disabled={saving || (selectedCustomer?.validationStatus !== 'VALIDATED' && validationStatus !== '검토 완료')} className="save-btn">
                                {saving ? '저장 중...' : <><Save size={16} style={{ marginRight: '8px' }} /> 저장</>}
                            </Button>
                        </div>
                    </div>
                    
                    <div className="form-scroll-area" style={{ flex: 1, overflowY: 'scroll', paddingRight: '10px' }}>
                        {successMessage && <Alert variant="success" className="mb-4" onClose={() => { setSuccessMessage(''); navigate('/menu1-1'); }} dismissible>{successMessage}</Alert>}
                        {errorMessage && <Alert variant="danger" className="mb-4" onClose={() => setErrorMessage('')} dismissible>{errorMessage}</Alert>}

                        {reviewSuggestions.length > 0 && (
                            <Alert variant="warning" className="mb-4">
                                <Alert.Heading>검토 제안</Alert.Heading>
                                <ul>
                                    {reviewSuggestions.map((item, index) => (
                                        <li key={index}>
                                            <strong>{fieldSpecs[item.fieldName]?.label || item.fieldName}:</strong> {item.warningDescription}
                                            <br />
                                            <em><small>제안: {item.suggestion}</small></em>
                                        </li>
                                    ))}
                                </ul>
                            </Alert>
                        )}

                        {Object.entries(formGroups).map(([groupName, fields]) => (
                            <Card key={groupName} className="mb-4" style={{ background: 'rgba(253, 251, 243, 0.92)', border: '1px solid rgba(184, 134, 11, 0.2)' }}>
                                <Card.Header style={{ background: 'rgba(184, 134, 11, 0.08)', borderBottom: '1px solid rgba(184, 134, 11, 0.15)'}}><h5 style={{ margin: 0, display: 'flex', alignItems: 'center', color: '#2C1F14', fontWeight: '600' }}>{getGroupIcon(groupName)}<span style={{ marginLeft: '8px' }}>{groupName}</span></h5></Card.Header>
                                <Card.Body>
                                    <Row className="g-3">
                                        {fields.map((fieldName) => {
                                            const field = fieldSpecs[fieldName];
                                            const suggestion = reviewSuggestions.find(s => s.fieldName === fieldName);
                                            if (fieldName === 'deathLocationEtc' && formData.deathLocationType !== '10') return null;
                                            
                                            const isDateTime = field.type === 'datetime';
                                            const isDate = field.type === 'date';

                                            return (
                                                <Col md={isDateTime ? 4 : 4} key={fieldName}>
                                                    <Form.Group>
                                                        <Form.Label style={{ color: '#4A3728' }}>
                                                            {field.label} {field.required && <span style={{ color: 'red' }}>*</span>}
                                                            {suggestion && <WarningIcon suggestion={suggestion} />}
                                                        </Form.Label>
                                                        <div style={{ position: 'relative' }}>
                                                            {field.type === 'select' ? (
                                                                <Form.Select name={fieldName} value={formData[fieldName]} onChange={handleInputChange} disabled={field.disabled}>
                                                                    <option value="">선택하세요</option>
                                                                    {field.options.map(option => <option key={option.value || option} value={option.value || option}>{option.label || option}</option>)}
                                                                </Form.Select>
                                                            ) : (isDate || isDateTime) ? (
                                                                <Row>
                                                                    <Col md={isDateTime ? 6 : 12}>
                                                                        <DatePicker 
                                                                            selected={formData[fieldName]} 
                                                                            onChange={(date) => handleDateChange(date, fieldName)} 
                                                                            locale={ko} 
                                                                            dateFormat="yyyy/MM/dd" 
                                                                            placeholderText="날짜 선택" 
                                                                            disabled={field.disabled} 
                                                                            customInput={<Form.Control className={field.disabled ? 'form-input-readonly' : ''} />} 
                                                                            renderCustomHeader={({
                                                                                date,
                                                                                changeYear,
                                                                                changeMonth,
                                                                                decreaseMonth,
                                                                                increaseMonth,
                                                                                prevMonthButtonDisabled,
                                                                                nextMonthButtonDisabled,
                                                                            }) => {
                                                                                const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 50 + i);
                                                                                const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
                                                                                return (
                                                                                    <div style={{ margin: 10, display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                                                        <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} style={{border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2em'}}>{"<"}</button>
                                                                                        <Form.Select value={date.getFullYear()} onChange={({ target: { value } }) => changeYear(value)} style={{margin: '0 5px', width: '100px'}}>
                                                                                            {years.map((option) => (<option key={option} value={option}>{option}년</option>))}
                                                                                        </Form.Select>
                                                                                        <Form.Select value={months[date.getMonth()]} onChange={({ target: { value } }) => changeMonth(months.indexOf(value))} style={{margin: '0 5px', width: '80px'}}>
                                                                                            {months.map((option) => (<option key={option} value={option}>{option}</option>))}
                                                                                        </Form.Select>
                                                                                        <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} style={{border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2em'}}>{">"}</button>
                                                                                    </div>
                                                                                );
                                                                            }}
                                                                        />
                                                                    </Col>
                                                                    {isDateTime && (
                                                                        <Col md={6}>
                                                                            <Form.Control type="text" name={`${fieldName}_time`} value={formData[`${fieldName}_time`]} onChange={handleInputChange} placeholder="시간 (HH:MM)" maxLength="5" />
                                                                        </Col>
                                                                    )}
                                                                </Row>
                                                            ) : (
                                                                <Form.Control type={field.type || 'text'} name={fieldName} value={fieldName === 'reportRegistrationDate' ? formatDateTime(formData[fieldName]) : formData[fieldName]} onChange={handleInputChange} placeholder={`${field.label} 입력`} readOnly={field.disabled} className={field.disabled ? 'form-input-readonly' : ''} maxLength={(fieldName === 'reporterPhone' || fieldName === 'chiefMournersContact') ? 13 : (fieldName === 'reporterRrn' || fieldName === 'submitterRrn') ? 14 : undefined} />
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
                /* ... (기존 스타일은 여기에 유지됩니다) ... */
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .dashboard-container { opacity: 0; }
                .dashboard-container.animate-in { opacity: 1; animation: fadeIn 0.6s ease-out; }
                .form-scroll-area::-webkit-scrollbar { width: 6px; }
                .form-scroll-area::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); border-radius: 10px; }
                .form-scroll-area::-webkit-scrollbar-thumb { background-color: rgba(184, 134, 11, 0.5); border-radius: 10px; }
                .form-control:focus, .form-select:focus, .react-datepicker__input-container input:focus { 
                    box-shadow: 0 0 0 3px rgba(184, 134, 11, 0.2) !important; 
                    border-color: #B8860B !important; 
                }
                .form-input-readonly {
                    background-color: rgba(184, 134, 11, 0.1) !important;
                    color: #4A3728 !important;
                    cursor: not-allowed !important;
                }
                .react-datepicker-wrapper { width: 100%; }
                .react-datepicker__input-container input {
                    width: 100%;
                    border: 1px solid #ced4da;
                    border-radius: .25rem;
                    padding: .375rem .75rem;
                    line-height: 1.5;
                }
                .back-btn {
                    display: flex; align-items: center; gap: 8px; padding: 12px 20px;
                    background: linear-gradient(135deg, #4A3728, #8B5A2B); border: none;
                    color: white; font-weight: 700; font-size: 14px;
                    box-shadow: 0 2px 8px rgba(74, 55, 40, 0.35); transition: all 0.3s ease;
                    border-radius: 12px; cursor: pointer;
                }
                .back-btn:hover {
                    background: linear-gradient(135deg, #3c2d20, #7a4e24);
                    transform: translateY(-2px); box-shadow: 0 4px 12px rgba(74, 55, 40, 0.45);
                }
                .save-btn {
                    padding: 10px 24px; font-size: 16px; font-weight: 700;
                    border: none; border-radius: 12px; cursor: pointer;
                    transition: all 0.3s ease; color: #2C1F14;
                    background: linear-gradient(135deg, #D4AF37, #F5C23E);
                    box-shadow: 0 4px 15px rgba(184, 134, 11, 0.35);
                }
                .save-btn:hover {
                    transform: translateY(-2px); box-shadow: 0 8px 25px rgba(184, 134, 11, 0.45);
                }
                .save-btn:disabled, .btn-outline-golden:disabled {
                    background: #e9ecef; box-shadow: none;
                    color: #6c757d; cursor: not-allowed; border-color: #ced4da;
                }
                .btn-outline-golden {
                    background-color: transparent !important;
                    border: 1px solid #B8860B !important;
                    color: #B8860B !important;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    box-shadow: none !important;
                }
                .btn-outline-golden:hover {
                    background-color: #B8860B !important;
                    border-color: #B8860B !important;
                    color: white !important;
                }
                .btn-outline-golden:active,
                .btn-outline-golden:focus,
                .btn-check:focus+.btn-outline-golden, .btn-outline-golden:focus {
                    background-color: transparent !important;
                    border-color: #B8860B !important;
                    color: #B8860B !important;
                    box-shadow: 0 0 0 0.25rem rgba(184, 134, 11, 0.2) !important; 
                }

                .btn-outline-golden.active {
                    background-color: #B8860B !important;
                    border-color: #B8860B !important;
                    color: white !important;
                }
                @media (max-width: 1200px) {
                    .page-wrapper { height: auto !important; min-height: calc(100vh - var(--navbar-height)); align-items: flex-start !important; }
                    .dashboard-container { flex-direction: column; height: auto !important; overflow: visible; }
                }
                @media (max-width: 768px) { .dashboard-container { padding: 10px; gap: 15px; } }
            `}</style>
        </div>
    );
};

export default Menu1_2;
