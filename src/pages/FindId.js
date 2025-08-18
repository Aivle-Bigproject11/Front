import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const FindId = () => {
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [foundId, setFoundId] = useState('');
    const [animateCard, setAnimateCard] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const isEmployee = location.state?.isEmployee ?? false; // Get user type from location state

    useEffect(() => {
        // 카드 애니메이션 효과
        setAnimateCard(true);
    }, []);

    // 입력 필드 변경 핸들러
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setFoundId('');

        if (!formData.name || !formData.email) {
            setError('이름과 이메일을 모두 입력해주세요.');
            setLoading(false);
            return;
        }

        try {
            const response = isEmployee
                ? await apiService.findManagerId(formData.name, formData.email)
                : await apiService.findFamilyId(formData.name, formData.email);

            // 성공 응답 (2xx) 처리
            if (typeof response === 'string' && response.startsWith('찾으시는 아이디는:')) {
                const id = response.split(': ')[1];
                setFoundId(id);
            } else {
                setError(response || '알 수 없는 응답입니다.');
            }
        } catch (err) {
            console.error("Find ID failed:", err);
            // 실패 응답 (4xx, 5xx) 처리
            if (err.response && err.response.data) {
                // 서버가 보낸 에러 메시지를 그대로 표시
                setError(err.response.data);
            } else {
                // 네트워크 에러 등 그 외의 경우
                setError('아이디 찾기 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page-wrapper" style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            
            <div className={`login-container ${animateCard ? 'animate-in' : ''}`} style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                maxWidth: '940px',
                minHeight: '640px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
                background: 'rgba(184, 134, 11, 0.1)',
                boxShadow: '0 12px 40px rgba(44, 31, 20, 0.25)',
                padding: '24px',
                borderRadius: '28px',
                border: '1px solid rgba(184, 134, 11, 0.2)',
                transform: animateCard ? 'translateY(0)' : 'translateY(30px)',
                opacity: animateCard ? 1 : 0,
                transition: 'all 0.6s ease-out'
            }}>
                <div className="login-card" style={{
                    width: '100%',
                    background: 'rgba(255, 251, 235, 0.95)',
                    borderRadius: '20px',
                    boxShadow: '0 20px 60px rgba(44, 31, 20, 0.3)',
                    overflow: 'hidden',
                    border: '1px solid rgba(184, 134, 11, 0.3)',
                }}>
                    <div className="login-content" style={{
                        display: 'flex',
                        minHeight: '600px'
                    }}>
                        {/* 왼쪽 이미지 영역 */}
                        <div className="login-left" style={{
                            flex: '1',
                            background: 'linear-gradient(135deg, #fff9f0 0%, #f7f3e9 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {/* 장식 요소들 */}
                            <div style={{ position: 'absolute', top: '10%', left: '10%', width: '80px', height: '80px', background: 'linear-gradient(135deg, #D4AF37, #B8860B)', borderRadius: '50%', opacity: 0.1 }}></div>
                            <div style={{ position: 'absolute', bottom: '20%', right: '15%', width: '120px', height: '120px', background: 'linear-gradient(135deg, #B8860B, #D4AF37)', borderRadius: '20px', opacity: 0.08, transform: 'rotate(45deg)' }}></div>
                            
                            <div className="login-image-content" style={{ textAlign: 'center', padding: '40px' }}>
                                <div style={{ width: '150px', height: '150px', background: 'linear-gradient(135deg, #4A3728, #8B5A2B)', borderRadius: '50%', margin: '0 auto 30px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(184, 134, 11, 0.3)' }}>
                                    <i className="fas fa-search" style={{ fontSize: '4rem', color: '#ffffffff' }}></i>
                                </div>
                                <h3 style={{ color: '#2C1F14', fontWeight: '700', marginBottom: '15px' }}>계정 정보 찾기</h3>
                                <p style={{ color: '#4A3728', fontSize: '16px', lineHeight: '1.6', margin: 0 }}>
                                    가입 시 등록한 정보로<br/>
                                    아이디 또는 비밀번호를<br/>
                                    찾을 수 있습니다.
                                </p>
                            </div>
                        </div>

                        {/* 오른쪽 폼 영역 */}
                        <div className="login-right" style={{
                            flex: '1',
                            padding: '50px 40px',
                            display: 'flex',
                            flexDirection: 'column',
                            background: 'transparent'
                        }}>
                            {/* 제목 */}
                            <div style={{ marginBottom: '30px' }}>
                                <h2 style={{ color: '#2C1F14', fontWeight: '700', fontSize: '28px', marginBottom: '8px' }}>{isEmployee ? '직원 아이디 찾기' : '사용자 아이디 찾기'}</h2>
                                <p style={{ color: '#4A3728', fontSize: '14px', margin: 0 }}>이름과 이메일을 입력해주세요.</p>
                            </div>

                            {/* 에러 메시지 */}
                            {error && (
                                <Alert variant="danger" style={{ borderRadius: '10px', border: '1px solid rgba(178, 58, 72, 0.2)', backgroundColor: 'rgba(178, 58, 72, 0.1)', color: '#b23a48', marginBottom: '20px' }}>
                                    {error}
                                </Alert>
                            )}
                            
                            {/* 아이디 찾기 결과 */}
                            {foundId && (
                                <div style={{ padding: '20px', background: 'rgba(184, 134, 11, 0.1)', borderRadius: '12px', border: '1px solid rgba(184, 134, 11, 0.2)', marginBottom: '20px', textAlign: 'center' }}>
                                    <p style={{ fontSize: '14px', color: '#4A3728', margin: 0, fontWeight: '500' }}>
                                        <i className="fas fa-check-circle me-2"></i>
                                        회원님의 아이디는 <strong>{foundId.length > 2 ? foundId.slice(0, -2) + '**' : '**'}</strong> 입니다.
                                    </p>
                                </div>
                            )}

                            {/* 폼 */}
                            <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div className="login-form-group" style={{ marginBottom: '25px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: '#2C1F14', fontWeight: '600', fontSize: '14px' }}>이름</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        style={{ width: '100%', padding: '15px 20px', border: '2px solid rgba(184, 134, 11, 0.35)', borderRadius: '12px', fontSize: '16px', transition: 'all 0.3s ease', outline: 'none' }}
                                        onFocus={(e) => { e.target.style.borderColor = '#B8860B'; e.target.style.boxShadow = '0 0 0 3px rgba(184, 134, 11, 0.2)'; }}
                                        onBlur={(e) => { e.target.style.borderColor = 'rgba(184, 134, 11, 0.35)'; e.target.style.boxShadow = 'none'; }}
                                    />
                                </div>

                                <div className="login-form-group" style={{ marginBottom: '30px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: '#2C1F14', fontWeight: '600', fontSize: '14px' }}>가입 시 등록한 이메일</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        style={{ width: '100%', padding: '15px 20px', border: '2px solid rgba(184, 134, 11, 0.35)', borderRadius: '12px', fontSize: '16px', transition: 'all 0.3s ease', outline: 'none' }}
                                        onFocus={(e) => { e.target.style.borderColor = '#B8860B'; e.target.style.boxShadow = '0 0 0 3px rgba(184, 134, 11, 0.2)'; }}
                                        onBlur={(e) => { e.target.style.borderColor = 'rgba(184, 134, 11, 0.35)'; e.target.style.boxShadow = 'none'; }}
                                    />
                                </div>
                                
                                <div style={{ marginTop: 'auto' }}>
                                    <button 
                                        type="submit" 
                                        className="login-btn"
                                        disabled={loading}
                                        style={{ width: '100%', padding: '15px', background: loading ? '#e9ecef' : 'linear-gradient(135deg, #D4AF37, #F5C23E)', color: '#2C1F14', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease', marginBottom: '15px' }}
                                    >
                                        {loading ? '찾는 중...' : '아이디 찾기'}
                                    </button>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                                        <button onClick={() => navigate('/findPassword')} className="login-link" style={{ background: 'none', border: 'none', color: '#B8860B', textDecoration: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                                            비밀번호 재설정
                                        </button>
                                        <button onClick={() => navigate('/login')} className="login-link" style={{ background: 'none', border: 'none', color: '#4A3728', textDecoration: 'none', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                                            로그인 화면으로
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
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
                
                .login-link:hover {
                    text-decoration: underline !important;
                }
                
                .login-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(184, 134, 11, 0.45);
                }

                @media (max-width: 768px) {
                    .login-content {
                        flex-direction: column !important;
                    }
                    
                    .login-left {
                        min-height: 250px !important;
                    }
                    
                    .login-right {
                        padding: 30px 20px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default FindId;