import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { dummyData } from '../services/api';

const MemorialConfig = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [memorial, setMemorial] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        birthOfDate: '',
        deceasedDate: '',
        gender: '',
        imageUrl: '',
        customerId: ''
    });

    // 유가족 권한 확인 (실제로는 API로 확인)
    const [isFamilyMember, setIsFamilyMember] = useState(false);
    const [accessChecking, setAccessChecking] = useState(true);

    useEffect(() => {
        // 유가족 권한 확인 및 추모관 데이터 로드
        const checkAccessAndLoadData = async () => {
            try {
                // TODO: 실제 API로 유가족 권한 확인
                const hasAccess = await checkFamilyAccess(id);

                if (!hasAccess) {
                    alert('유가족만 접근 가능한 페이지입니다.');
                    navigate(`/memorial/${id}`);
                    return;
                }

                setIsFamilyMember(true);

                // 추모관 데이터 로드
                const foundMemorial = dummyData.memorials._embedded.memorials.find(
                    m => m.id === parseInt(id)
                );

                if (!foundMemorial) {
                    alert('추모관을 찾을 수 없습니다.');
                    navigate('/menu4');
                    return;
                }

                setMemorial(foundMemorial);
                setFormData({
                    name: foundMemorial.name,
                    age: foundMemorial.age,
                    birthOfDate: foundMemorial.birthOfDate,
                    deceasedDate: foundMemorial.deceasedDate,
                    gender: foundMemorial.gender,
                    imageUrl: foundMemorial.imageUrl || '',
                    customerId: foundMemorial.customerId
                });

            } catch (error) {
                console.error('Error loading memorial config:', error);
                alert('오류가 발생했습니다. 다시 시도해주세요.');
                navigate(`/memorial/${id}`);
            } finally {
                setAccessChecking(false);
                setLoading(false);
            }
        };

        checkAccessAndLoadData();
    }, [id, navigate]);

    // 유가족 권한 확인 함수 (실제 API 구현 필요)
    const checkFamilyAccess = async (memorialId) => {
        // TODO: 실제 API 호출로 교체
        return new Promise((resolve) => {
            setTimeout(() => {
                // 테스트용: 항상 true 반환
                resolve(true);
            }, 500);
        });
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // TODO: API 호출로 추모관 수정
            const updatedMemorial = {
                ...memorial,
                ...formData,
                age: parseInt(formData.age),
                customerId: parseInt(formData.customerId)
            };

            setMemorial(updatedMemorial);
            alert('추모관 정보가 성공적으로 수정되었습니다.');
            navigate(`/memorial/${id}`);
        } catch (error) {
            console.error('Error updating memorial:', error);
            alert('수정 중 오류가 발생했습니다.');
        }
    };

    if (accessChecking || loading) {
        return (
            <Container className="mt-4">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">권한 확인 및 데이터 로드 중...</p>
                </div>
            </Container>
        );
    }

    if (!memorial) {
        return (
            <Container className="mt-4">
                <div className="text-center">
                    <h4>추모관을 찾을 수 없습니다.</h4>
                    <Button variant="primary" onClick={() => navigate('/menu4')}>
                        목록으로 돌아가기
                    </Button>
                </div>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            {/* 헤더 섹션 */}
            <Row className="mb-4">
                <Col>
                    <div className="config-header-section p-4" style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '15px',
                        color: 'white'
                    }}>
                        <Button
                            variant="light"
                            size="sm"
                            onClick={() => navigate(`/memorial/${id}`)}
                            className="mb-3"
                        >
                            <i className="fas fa-arrow-left me-2"></i>
                            추모관으로 돌아가기
                        </Button>

                        <h1 className="mb-2" style={{ fontWeight: '700' }}>
                            <i className="fas fa-edit me-3"></i>
                            추모관 정보 수정
                        </h1>
                        <p className="lead mb-0">
                            {memorial.name}님의 추모관 정보를 수정할 수 있습니다
                        </p>
                    </div>
                </Col>
            </Row>

            {/* 권한 안내 */}
            <Row className="mb-4">
                <Col>
                    <Alert variant="info">
                        <i className="fas fa-info-circle me-2"></i>
                        이 페이지는 유가족만 접근 가능합니다. 추모관의 기본 정보를 수정할 수 있습니다.
                    </Alert>
                </Col>
            </Row>

            {/* 추모관 정보 수정 폼 */}
            <Row>
                <Col>
                    <Card style={{ borderRadius: '15px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                        <Card.Header style={{
                            background: 'linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100%)',
                            borderRadius: '15px 15px 0 0',
                            padding: '1.5rem'
                        }}>
                            <h5 className="mb-0">
                                <i className="fas fa-user-edit me-2"></i>
                                추모관 기본 정보
                            </h5>
                        </Card.Header>
                        <Card.Body style={{ padding: '2rem' }}>
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">
                                                <i className="fas fa-user me-2"></i>성함 *
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                style={{ borderRadius: '8px', padding: '12px' }}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">
                                                <i className="fas fa-birthday-cake me-2"></i>나이 *
                                            </Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="age"
                                                value={formData.age}
                                                onChange={handleInputChange}
                                                required
                                                style={{ borderRadius: '8px', padding: '12px' }}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">
                                                <i className="fas fa-venus-mars me-2"></i>성별 *
                                            </Form.Label>
                                            <Form.Select
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleInputChange}
                                                required
                                                style={{ borderRadius: '8px', padding: '12px' }}
                                            >
                                                <option value="">성별 선택</option>
                                                <option value="MALE">남성</option>
                                                <option value="FEMALE">여성</option>
                                            </Form.Select>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">
                                                <i className="fas fa-id-card me-2"></i>고객ID *
                                            </Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="customerId"
                                                value={formData.customerId}
                                                onChange={handleInputChange}
                                                required
                                                style={{ borderRadius: '8px', padding: '12px' }}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">
                                                <i className="fas fa-calendar-alt me-2"></i>생년월일 *
                                            </Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="birthOfDate"
                                                value={formData.birthOfDate}
                                                onChange={handleInputChange}
                                                required
                                                style={{ borderRadius: '8px', padding: '12px' }}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">
                                                <i className="fas fa-cross me-2"></i>별세일 *
                                            </Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="deceasedDate"
                                                value={formData.deceasedDate}
                                                onChange={handleInputChange}
                                                required
                                                style={{ borderRadius: '8px', padding: '12px' }}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">
                                                <i className="fas fa-image me-2"></i>프로필 이미지 URL
                                            </Form.Label>
                                            <Form.Control
                                                type="url"
                                                name="imageUrl"
                                                value={formData.imageUrl}
                                                onChange={handleInputChange}
                                                placeholder="https://example.com/image.jpg"
                                                style={{ borderRadius: '8px', padding: '12px' }}
                                            />
                                            <Form.Text className="text-muted">
                                                이미지 URL을 입력하시면 프로필 사진이 표시됩니다.
                                            </Form.Text>
                                        </Form.Group>

                                        {/* 현재 이미지 미리보기 */}
                                        {formData.imageUrl && (
                                            <div className="mb-3">
                                                <Form.Label className="fw-bold">미리보기</Form.Label>
                                                <div className="text-center">
                                                    <img
                                                        src={formData.imageUrl}
                                                        alt="프로필 미리보기"
                                                        style={{
                                                            width: '150px',
                                                            height: '180px',
                                                            objectFit: 'cover',
                                                            borderRadius: '8px',
                                                            border: '2px solid #e9ecef'
                                                        }}
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </Col>
                                </Row>

                                <hr className="my-4" />

                                <div className="d-flex justify-content-between">
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => navigate(`/memorial/${id}`)}
                                        style={{ borderRadius: '8px', padding: '12px 24px' }}
                                    >
                                        <i className="fas fa-times me-2"></i>
                                        취소
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        style={{
                                            borderRadius: '8px',
                                            padding: '12px 24px',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            border: 'none'
                                        }}
                                    >
                                        <i className="fas fa-save me-2"></i>
                                        수정 완료
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default MemorialConfig;