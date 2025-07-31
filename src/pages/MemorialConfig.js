import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { dummyData } from '../services/api';

const MemorialConfig = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [memorial, setMemorial] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('basic'); // 'basic', 'video', 'memorial'
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        birthOfDate: '',
        deceasedDate: '',
        gender: '',
        imageUrl: '',
        customerId: ''
    });

    // 영상 생성 관련 상태
    const [videoData, setVideoData] = useState({
        title: '',
        description: '',
        photos: [],
        music: '',
        style: 'classic'
    });

    // 추모사 생성 관련 상태
    const [memorialText, setMemorialText] = useState({
        relationship: '',
        tone: 'formal',
        length: 'medium',
        keywords: '',
        customText: '',
        generatedText: ''
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

    const handleVideoDataChange = (e) => {
        setVideoData({
            ...videoData,
            [e.target.name]: e.target.value
        });
    };

    const handleMemorialTextChange = (e) => {
        setMemorialText({
            ...memorialText,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (activeTab === 'basic') {
                // 기본 정보 수정
                const updatedMemorial = {
                    ...memorial,
                    ...formData,
                    age: parseInt(formData.age),
                    customerId: parseInt(formData.customerId)
                };

                setMemorial(updatedMemorial);
                alert('추모관 정보가 성공적으로 수정되었습니다.');
            } else if (activeTab === 'video') {
                // 영상 생성 처리
                alert('영상 생성이 시작되었습니다. 완료되면 알림을 드리겠습니다.');
            } else if (activeTab === 'memorial') {
                // 추모사 생성 처리
                if (memorialText.customText) {
                    setMemorialText({
                        ...memorialText,
                        generatedText: memorialText.customText
                    });
                    alert('추모사가 저장되었습니다.');
                } else {
                    // AI 추모사 생성 시뮬레이션
                    const aiGeneratedText = generateMemorialText();
                    setMemorialText({
                        ...memorialText,
                        generatedText: aiGeneratedText
                    });
                    alert('AI 추모사가 생성되었습니다.');
                }
            }
        } catch (error) {
            console.error('Error processing request:', error);
            alert('처리 중 오류가 발생했습니다.');
        }
    };

    // AI 추모사 생성 시뮬레이션
    const generateMemorialText = () => {
        const templates = {
            formal: {
                short: `삼가 故 ${memorial.name}님의 명복을 빕니다. 고인의 따뜻한 마음과 선한 행실을 기억하며, 영원히 그리워하겠습니다.`,
                medium: `삼가 故 ${memorial.name}님의 명복을 빕니다. 
                
고인께서는 생전에 ${memorialText.keywords || '가족과 주변 사람들'}을 사랑으로 돌보시며, 언제나 따뜻한 미소로 우리 곁에 계셨습니다. 

고인의 선한 마음과 아름다운 추억들을 가슴에 간직하며, 하늘에서 편안히 쉬시길 기원합니다.`,
                long: `삼가 故 ${memorial.name}님의 명복을 빕니다.

고인께서는 ${memorial.birthOfDate}에 태어나시어 ${memorial.age}세의 나이로 ${memorial.deceasedDate}에 하늘의 부르심을 받으셨습니다.

생전에 ${memorialText.keywords || '가족과 주변 사람들'}을 깊이 사랑하시고, 항상 다른 사람을 먼저 생각하시는 따뜻한 마음의 소유자셨습니다. 고인의 선한 행실과 아름다운 인품은 우리 모두의 마음에 영원히 남을 것입니다.

비록 육신은 우리 곁을 떠나셨지만, 고인께서 남겨주신 사랑과 추억은 영원히 우리와 함께할 것입니다. 하늘에서 편안히 쉬시며, 남은 가족들을 지켜보시길 기원합니다.

다시 한 번 삼가 고인의 명복을 빕니다.`
            },
            casual: {
                short: `${memorial.name}님, 좋은 곳에서 편히 쉬세요. 항상 기억하겠습니다.`,
                medium: `${memorial.name}님과 함께했던 소중한 시간들을 잊지 않겠습니다. 

언제나 밝은 모습으로 우리 곁에 계셨던 ${memorial.name}님의 따뜻한 미소와 ${memorialText.keywords || '친절함'}을 영원히 기억하겠습니다.

좋은 곳에서 편안히 쉬시길 바랍니다.`,
                long: `${memorial.name}님께,

함께 보낸 시간들이 정말 소중했습니다. ${memorial.name}님의 ${memorialText.keywords || '밝은 성격과 따뜻한 마음'}은 주변 모든 사람들에게 큰 힘이 되었습니다.

비록 이제는 만날 수 없지만, ${memorial.name}님과의 아름다운 추억들은 우리 마음속에 영원히 살아있을 것입니다. 그 추억들을 소중히 간직하며 살아가겠습니다.

하늘에서 편안히 쉬시고, 언제나 우리를 지켜봐 주세요. 정말 감사했습니다.`
            }
        };

        return templates[memorialText.tone][memorialText.length];
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
                            추모관 관리
                        </h1>
                        <p className="lead mb-0">
                            {memorial.name}님의 추모관을 관리할 수 있습니다
                        </p>
                    </div>
                </Col>
            </Row>

            {/* 권한 안내 */}
            <Row className="mb-4">
                <Col>
                    <Alert variant="info">
                        <i className="fas fa-info-circle me-2"></i>
                        이 페이지는 유가족만 접근 가능합니다. 추모관의 기본 정보 수정, 영상 생성, 추모사 생성 기능을 이용할 수 있습니다.
                    </Alert>
                </Col>
            </Row>

            {/* 탭 네비게이션 */}
            <Row className="mb-4">
                <Col>
                    <div className="config-tabs" style={{
                        display: 'flex',
                        background: '#f8f9fa',
                        borderRadius: '12px',
                        padding: '6px',
                        gap: '4px'
                    }}>
                        <button 
                            className={`config-tab ${activeTab === 'basic' ? 'active' : ''}`}
                            onClick={() => setActiveTab('basic')}
                            style={{
                                flex: 1,
                                padding: '12px 20px',
                                border: 'none',
                                borderRadius: '8px',
                                background: activeTab === 'basic' 
                                    ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                                    : 'transparent',
                                color: activeTab === 'basic' ? 'white' : '#6c757d',
                                fontWeight: '600',
                                fontSize: '16px',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}
                        >
                            <i className="fas fa-cog me-2"></i>
                            기본 설정
                        </button>
                        <button 
                            className={`config-tab ${activeTab === 'video' ? 'active' : ''}`}
                            onClick={() => setActiveTab('video')}
                            style={{
                                flex: 1,
                                padding: '12px 20px',
                                border: 'none',
                                borderRadius: '8px',
                                background: activeTab === 'video' 
                                    ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                                    : 'transparent',
                                color: activeTab === 'video' ? 'white' : '#6c757d',
                                fontWeight: '600',
                                fontSize: '16px',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}
                        >
                            <i className="fas fa-video me-2"></i>
                            영상 생성
                        </button>
                        <button 
                            className={`config-tab ${activeTab === 'memorial' ? 'active' : ''}`}
                            onClick={() => setActiveTab('memorial')}
                            style={{
                                flex: 1,
                                padding: '12px 20px',
                                border: 'none',
                                borderRadius: '8px',
                                background: activeTab === 'memorial' 
                                    ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                                    : 'transparent',
                                color: activeTab === 'memorial' ? 'white' : '#6c757d',
                                fontWeight: '600',
                                fontSize: '16px',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}
                        >
                            <i className="fas fa-pen-fancy me-2"></i>
                            추모사 생성
                        </button>
                    </div>
                </Col>
            </Row>

            {/* 탭 컨텐츠 */}
            <Row>
                <Col>
                    <Card style={{ borderRadius: '15px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                        <Card.Header style={{
                            background: activeTab === 'basic' ? 'linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100%)' :
                                      activeTab === 'video' ? 'linear-gradient(90deg, #e3f2fd 0%, #bbdefb 100%)' :
                                      'linear-gradient(90deg, #f3e5f5 0%, #e1bee7 100%)',
                            borderRadius: '15px 15px 0 0',
                            padding: '1.5rem'
                        }}>
                            <h5 className="mb-0">
                                {activeTab === 'basic' && <><i className="fas fa-user-edit me-2"></i>추모관 기본 정보</>}
                                {activeTab === 'video' && <><i className="fas fa-video me-2"></i>AI 추모 영상 생성</>}
                                {activeTab === 'memorial' && <><i className="fas fa-pen-fancy me-2"></i>AI 추모사 생성</>}
                            </h5>
                        </Card.Header>
                        <Card.Body style={{ padding: '2rem' }}>
                            <Form onSubmit={handleSubmit}>
                                {/* 기본 설정 탭 */}
                                {activeTab === 'basic' && (
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
                                )}

                                {/* 영상 생성 탭 */}
                                {activeTab === 'video' && (
                                    <>
                                        <Alert variant="info" className="mb-4">
                                            <i className="fas fa-info-circle me-2"></i>
                                            AI 기술을 활용하여 고인의 사진들로 감동적인 추모 영상을 제작합니다.
                                        </Alert>
                                        
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label className="fw-bold">
                                                        <i className="fas fa-heading me-2"></i>영상 제목 *
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="title"
                                                        value={videoData.title}
                                                        onChange={handleVideoDataChange}
                                                        placeholder={`${memorial.name}님을 기억하며`}
                                                        style={{ borderRadius: '8px', padding: '12px' }}
                                                    />
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Label className="fw-bold">
                                                        <i className="fas fa-music me-2"></i>배경음악
                                                    </Form.Label>
                                                    <Form.Select
                                                        name="music"
                                                        value={videoData.music}
                                                        onChange={handleVideoDataChange}
                                                        style={{ borderRadius: '8px', padding: '12px' }}
                                                    >
                                                        <option value="">음악 선택</option>
                                                        <option value="peaceful">평화로운 선율</option>
                                                        <option value="classical">클래식</option>
                                                        <option value="nature">자연의 소리</option>
                                                        <option value="hymn">찬송가</option>
                                                        <option value="custom">직접 업로드</option>
                                                    </Form.Select>
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Label className="fw-bold">
                                                        <i className="fas fa-palette me-2"></i>영상 스타일
                                                    </Form.Label>
                                                    <Form.Select
                                                        name="style"
                                                        value={videoData.style}
                                                        onChange={handleVideoDataChange}
                                                        style={{ borderRadius: '8px', padding: '12px' }}
                                                    >
                                                        <option value="classic">클래식</option>
                                                        <option value="modern">모던</option>
                                                        <option value="vintage">빈티지</option>
                                                        <option value="elegant">우아한</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label className="fw-bold">
                                                        <i className="fas fa-align-left me-2"></i>영상 설명
                                                    </Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={3}
                                                        name="description"
                                                        value={videoData.description}
                                                        onChange={handleVideoDataChange}
                                                        placeholder="영상에 대한 간단한 설명을 입력하세요"
                                                        style={{ borderRadius: '8px', padding: '12px' }}
                                                    />
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Label className="fw-bold">
                                                        <i className="fas fa-images me-2"></i>사진 업로드
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        style={{ borderRadius: '8px', padding: '12px' }}
                                                    />
                                                    <Form.Text className="text-muted">
                                                        여러 장의 사진을 선택할 수 있습니다. (최대 20장)
                                                    </Form.Text>
                                                </Form.Group>

                                                <div className="video-preview p-3" style={{
                                                    background: '#f8f9fa',
                                                    borderRadius: '8px',
                                                    border: '2px dashed #dee2e6'
                                                }}>
                                                    <div className="text-center">
                                                        <i className="fas fa-video fa-3x text-muted mb-2"></i>
                                                        <p className="text-muted mb-0">영상 미리보기</p>
                                                        <small className="text-muted">사진을 업로드하면 미리보기가 표시됩니다</small>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </>
                                )}

                                {/* 추모사 생성 탭 */}
                                {activeTab === 'memorial' && (
                                    <>
                                        <Alert variant="info" className="mb-4">
                                            <i className="fas fa-info-circle me-2"></i>
                                            AI가 고인의 정보를 바탕으로 감동적인 추모사를 작성해드립니다.
                                        </Alert>
                                        
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label className="fw-bold">
                                                        <i className="fas fa-users me-2"></i>작성자와의 관계
                                                    </Form.Label>
                                                    <Form.Select
                                                        name="relationship"
                                                        value={memorialText.relationship}
                                                        onChange={handleMemorialTextChange}
                                                        style={{ borderRadius: '8px', padding: '12px' }}
                                                    >
                                                        <option value="">관계 선택</option>
                                                        <option value="family">가족</option>
                                                        <option value="friend">친구</option>
                                                        <option value="colleague">동료</option>
                                                        <option value="acquaintance">지인</option>
                                                    </Form.Select>
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Label className="fw-bold">
                                                        <i className="fas fa-font me-2"></i>문체
                                                    </Form.Label>
                                                    <Form.Select
                                                        name="tone"
                                                        value={memorialText.tone}
                                                        onChange={handleMemorialTextChange}
                                                        style={{ borderRadius: '8px', padding: '12px' }}
                                                    >
                                                        <option value="formal">격식있는 문체</option>
                                                        <option value="casual">친근한 문체</option>
                                                    </Form.Select>
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Label className="fw-bold">
                                                        <i className="fas fa-ruler me-2"></i>추모사 길이
                                                    </Form.Label>
                                                    <Form.Select
                                                        name="length"
                                                        value={memorialText.length}
                                                        onChange={handleMemorialTextChange}
                                                        style={{ borderRadius: '8px', padding: '12px' }}
                                                    >
                                                        <option value="short">짧게 (2-3줄)</option>
                                                        <option value="medium">보통 (1-2문단)</option>
                                                        <option value="long">길게 (3-4문단)</option>
                                                    </Form.Select>
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Label className="fw-bold">
                                                        <i className="fas fa-tags me-2"></i>포함할 키워드
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="keywords"
                                                        value={memorialText.keywords}
                                                        onChange={handleMemorialTextChange}
                                                        placeholder="예: 친절함, 따뜻한 마음, 봉사정신"
                                                        style={{ borderRadius: '8px', padding: '12px' }}
                                                    />
                                                    <Form.Text className="text-muted">
                                                        쉼표로 구분하여 여러 키워드를 입력하세요
                                                    </Form.Text>
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label className="fw-bold">
                                                        <i className="fas fa-edit me-2"></i>직접 작성 (선택사항)
                                                    </Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={6}
                                                        name="customText"
                                                        value={memorialText.customText}
                                                        onChange={handleMemorialTextChange}
                                                        placeholder="추모사를 직접 작성하거나, AI 생성 후 수정할 수 있습니다"
                                                        style={{ borderRadius: '8px', padding: '12px' }}
                                                    />
                                                </Form.Group>

                                                {memorialText.generatedText && (
                                                    <div className="generated-text p-3" style={{
                                                        background: '#f8f9fa',
                                                        borderRadius: '8px',
                                                        border: '1px solid #dee2e6'
                                                    }}>
                                                        <Form.Label className="fw-bold mb-2">
                                                            <i className="fas fa-robot me-2"></i>AI 생성 추모사
                                                        </Form.Label>
                                                        <div style={{
                                                            background: 'white',
                                                            padding: '15px',
                                                            borderRadius: '6px',
                                                            border: '1px solid #e9ecef',
                                                            whiteSpace: 'pre-line',
                                                            lineHeight: '1.6'
                                                        }}>
                                                            {memorialText.generatedText}
                                                        </div>
                                                        <div className="mt-2">
                                                            <Button
                                                                variant="outline-primary"
                                                                size="sm"
                                                                onClick={() => setMemorialText({
                                                                    ...memorialText,
                                                                    customText: memorialText.generatedText
                                                                })}
                                                            >
                                                                편집하기
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </Col>
                                        </Row>
                                    </>
                                )}

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
                                        <i className={`fas ${
                                            activeTab === 'basic' ? 'fa-save' :
                                            activeTab === 'video' ? 'fa-play' :
                                            'fa-magic'
                                        } me-2`}></i>
                                        {activeTab === 'basic' ? '정보 수정' :
                                         activeTab === 'video' ? '영상 생성' :
                                         '추모사 생성'}
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