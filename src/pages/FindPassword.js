import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const FindPassword = () => {
  const [formData, setFormData] = useState({
    loginId: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [animateCard, setAnimateCard] = useState(false);

  const { changePassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 카드 애니메이션 효과
    setAnimateCard(true);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    const { loginId, newPassword, confirmPassword } = formData;

    // 유효성 검사
    if (!loginId || !newPassword || !confirmPassword) {
      setError('모든 필드를 입력해주세요.');
      setLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      setLoading(false);
      return;
    }

    const result = await changePassword(loginId, newPassword);

    setLoading(false);

    if (result.success) {
      setSuccessMessage('비밀번호 변경이 성공적으로 완료되었습니다.');
      // 폼 초기화
      setFormData({ loginId: '', newPassword: '', confirmPassword: '' });
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="login-page-wrapper" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* 배경 패턴 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat'
      }}></div>
      
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
        background: '#f8f9fa',
        boxShadow: '0 8px 32px rgba(102,126,234,0.08)',
        padding: '24px',
        borderRadius: '28px',
        transform: animateCard ? 'translateY(0)' : 'translateY(30px)',
        opacity: animateCard ? 1 : 0,
        transition: 'all 0.6s ease-out'
      }}>
        <div className="login-card" style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          backdropFilter: 'blur(10px)',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div className="login-content" style={{
            display: 'flex',
            minHeight: '600px'
          }}>
            {/* 왼쪽 이미지 영역 */}
            <div className="login-left" style={{
              flex: '1',
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* 장식 요소들 */}
              <div style={{ position: 'absolute', top: '10%', left: '10%', width: '80px', height: '80px', background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: '50%', opacity: 0.1 }}></div>
              <div style={{ position: 'absolute', bottom: '20%', right: '15%', width: '120px', height: '120px', background: 'linear-gradient(135deg, #764ba2, #667eea)', borderRadius: '20px', opacity: 0.08, transform: 'rotate(45deg)' }}></div>
              
              <div className="login-image-content" style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ width: '150px', height: '150px', background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: '50%', margin: '0 auto 30px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)' }}>
                  <i className="fas fa-key" style={{ fontSize: '4rem', color: 'white' }}></i>
                </div>
                <h3 style={{ color: '#495057', fontWeight: '700', marginBottom: '15px' }}>비밀번호 재설정</h3>
                <p style={{ color: '#6c757d', fontSize: '16px', lineHeight: '1.6', margin: 0 }}>
                  새로운 비밀번호를 설정하여<br/>
                  계정을 안전하게<br/>
                  보호하세요.
                </p>
              </div>
            </div>

            {/* 오른쪽 폼 영역 */}
            <div className="login-right" style={{
              flex: '1',
              padding: '50px 40px',
              display: 'flex',
              flexDirection: 'column',
              background: '#f1f3f5'
            }}>
              {/* 제목 */}
              <div style={{ marginBottom: '30px' }}>
                <h2 style={{ color: '#495057', fontWeight: '700', fontSize: '28px', marginBottom: '8px' }}>비밀번호 변경</h2>
                <p style={{ color: '#6c757d', fontSize: '14px', margin: 0 }}>아이디와 새 비밀번호를 입력해주세요.</p>
              </div>

              {/* 에러 메시지 */}
              {error && (
                <Alert variant="danger" style={{ borderRadius: '10px', border: 'none', backgroundColor: '#fff5f5', color: '#e53e3e', marginBottom: '20px' }}>
                  {error}
                </Alert>
              )}
              
              {/* 성공 메시지 */}
              {successMessage && (
                <div style={{ padding: '20px', background: 'rgba(76, 175, 80, 0.1)', borderRadius: '12px', border: '1px solid rgba(76, 175, 80, 0.2)', marginBottom: '20px', textAlign: 'center' }}>
                    <p style={{ fontSize: '14px', color: '#2e7d32', margin: 0, fontWeight: '500' }}>
                        <i className="fas fa-check-circle me-2"></i>
                        {successMessage}
                    </p>
                </div>
              )}

              {/* 폼 */}
              {!successMessage && (
                <form onSubmit={handleSubmit}>
                  <div className="login-form-group" style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#495057', fontWeight: '600', fontSize: '14px' }}>아이디</label>
                    <input type="text" name="loginId" value={formData.loginId} onChange={handleChange} required style={{ width: '100%', padding: '12px 18px', border: '2px solid #e9ecef', borderRadius: '12px', fontSize: '16px', transition: 'all 0.3s ease', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = '#667eea'} onBlur={(e) => e.target.style.borderColor = '#e9ecef'} />
                  </div>

                  <div className="login-form-group" style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#495057', fontWeight: '600', fontSize: '14px' }}>새 비밀번호</label>
                    <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} required style={{ width: '100%', padding: '12px 18px', border: '2px solid #e9ecef', borderRadius: '12px', fontSize: '16px', transition: 'all 0.3s ease', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = '#667eea'} onBlur={(e) => e.target.style.borderColor = '#e9ecef'} />
                  </div>
                  
                  <div className="login-form-group" style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#495057', fontWeight: '600', fontSize: '14px' }}>새 비밀번호 확인</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required style={{ width: '100%', padding: '12px 18px', border: '2px solid #e9ecef', borderRadius: '12px', fontSize: '16px', transition: 'all 0.3s ease', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = '#667eea'} onBlur={(e) => e.target.style.borderColor = '#e9ecef'} />
                  </div>
                  
                  <button type="submit" className="login-btn" disabled={loading} style={{ width: '100%', padding: '15px', background: loading ? '#e9ecef' : 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease' }}>
                    {loading ? '변경 중...' : '비밀번호 바꾸기'}
                  </button>
                </form>
              )}
              
              <div style={{ marginTop: 'auto', paddingTop: '20px', textAlign: 'center' }}>
                <button onClick={() => navigate('/login')} className="login-link" style={{ background: 'none', border: 'none', color: '#6c757d', textDecoration: 'none', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                  로그인 화면으로 돌아가기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in { animation: fadeInUp 0.6s ease-out; }
        .login-link:hover { text-decoration: underline !important; }
        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }
        @media (max-width: 768px) {
          .login-content { flex-direction: column !important; }
          .login-left { min-height: 250px !important; }
          .login-right { padding: 30px 20px !important; }
        }
      `}</style>
    </div>
  );
};

export default FindPassword;
