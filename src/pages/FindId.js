import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const FindId = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [foundId, setFoundId] = useState('');

  const { findId } = useAuth();
  const navigate = useNavigate();

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

    // 이름과 이메일이 모두 입력되었는지 확인
    if (!formData.name || !formData.email) {
      setError('이름과 이메일을 모두 입력해주세요.');
      setLoading(false);
      return;
    }

    const result = await findId(formData.name, formData.email);

    if (result.success) {
      setFoundId(result.loginId);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shadow-sm">
              <Card.Header className="text-center bg-white border-0 py-3">
                <h3 className="mb-0">아이디 찾기</h3>
              </Card.Header>
              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>이름</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>가입 시 등록한 이메일</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  
                  <div className="d-grid">
                    <Button type="submit" variant="primary" disabled={loading}>
                      {loading ? '찾는 중...' : '아이디 찾기'}
                    </Button>
                  </div>
                </Form>
                
                {/* 에러 메시지 표시 */}
                {error && (
                  <Alert variant="danger" className="mt-4">
                    {error}
                  </Alert>
                )}
                
                {/* 아이디 찾기 결과 표시 */}
                {foundId && (
                  <Card className="mt-4 bg-light">
                    <Card.Body className="text-center">
                      <p className="mb-1 text-muted">아이디 검색 결과</p>
                      <p className="h5 mb-0"><strong>{foundId}</strong></p>
                    </Card.Body>
                  </Card>
                )}

                <hr className="my-4" />

                <div className="d-grid gap-2">
                    <Button variant="secondary" onClick={() => navigate('/findPassword')}>
                        비밀번호 찾기
                    </Button>
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

export default FindId;