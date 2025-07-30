import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const FindPassword = () => {
  const [formData, setFormData] = useState({
    loginId: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  // 성공 메시지를 state로 관리할 필요가 없으므로 아래 라인 삭제
  // const [success, setSuccess] = useState(''); 
  const [loading, setLoading] = useState(false);

  const { changePassword } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // setSuccess(''); // 삭제
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
      alert('비밀번호 변경이 완료되었습니다!'); 
      navigate('/login');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shadow-sm">
              <Card.Header className="text-center bg-white border-0 py-3">
                <h3 className="mb-0">비밀번호 변경</h3>
              </Card.Header>
              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>아이디</Form.Label>
                    <Form.Control type="text" name="loginId" value={formData.loginId} onChange={handleChange} required />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>새 비밀번호</Form.Label>
                    <Form.Control type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} required />
                  </Form.Group>
                  <Form.Text className="text-danger d-block mb-3">
                    *영문, 숫자, 특수문자 중 2종류를 조합하여 10자리(3종류는 8자리) 이상으로 구성해 주세요
                  </Form.Text>
                  <Form.Group className="mb-4">
                    <Form.Label>새 비밀번호 확인</Form.Label>
                    <Form.Control type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                  </Form.Group>
                  
                  <div className="d-grid">
                    <Button type="submit" variant="primary" disabled={loading}>
                      {loading ? '변경 중...' : '비밀번호 바꾸기'}
                    </Button>
                  </div>
                </Form>
                
                {error && <Alert variant="danger" className="mt-4">{error}</Alert>}
                
                <hr className="my-4" />

                <div className="d-grid">
                    <Button variant="outline-secondary" onClick={() => navigate('/login')}>
                        로그인 화면으로
                    </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FindPassword;