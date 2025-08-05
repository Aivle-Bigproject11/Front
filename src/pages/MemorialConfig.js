import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { dummyData } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const MemorialConfig = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    // 접근 모드 확인: 유저(유가족) 또는 관리자
    const isUserAccess = user && user.userType === 'user'; // 유저로 로그인 (유가족)
    const isAdminAccess = user && user.userType === 'employee'; // 관리자로 로그인
    
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
        music: '',
        style: 'classic'
    });
    const [slideshowPhotos, setSlideshowPhotos] = useState([]);
    const [animatedPhoto, setAnimatedPhoto] = useState(null);
    const [keywords, setKeywords] = useState(['', '', '', '', '']);
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState('');
    const [isVideoLoading, setIsVideoLoading] = useState(false);

    // 추모사 생성 관련 상태
    const [eulogyKeywords, setEulogyKeywords] = useState(['', '', '', '', '']);
    const [generatedEulogy, setGeneratedEulogy] = useState('');
    const [isEulogyLoading, setIsEulogyLoading] = useState(false);

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
                    alert('유가족 또는 관리자만 접근 가능한 페이지입니다.');
                    if (isUserAccess) {
                        navigate(`/user-memorial/${id}`);
                    } else {
                        navigate(`/memorial/${id}`);
                    }
                    return;
                }

                setIsFamilyMember(true);

                // 추모관 데이터 로드
                const foundMemorial = dummyData.memorials._embedded.memorials.find(
                    m => m.id === parseInt(id)
                );

                if (!foundMemorial) {
                    alert('추모관을 찾을 수 없습니다.');
                    if (isUserAccess) {
                        navigate(`/user-memorial/${id}`);
                    } else {
                        navigate(`/memorial/${id}`);
                    }
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
                if (isUserAccess) {
                    navigate(`/user-memorial/${id}`);
                } else {
                    navigate(`/memorial/${id}`);
                }
            } finally {
                setAccessChecking(false);
                setLoading(false);
            }
        };

        checkAccessAndLoadData();
    }, [id, navigate]);

    // 유가족 및 관리자 권한 확인 함수 (실제 API 구현 필요)
    const checkFamilyAccess = async (memorialId) => {
        // TODO: 실제 API 호출로 교체
        return new Promise((resolve) => {
            setTimeout(() => {
                // 관리자나 유저(유가족)인 경우 접근 허용
                if (isAdminAccess || isUserAccess) {
                    resolve(true);
                } else {
                    resolve(false);
                }
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
                setIsVideoLoading(true);
                setGeneratedVideoUrl('');

                // Simulate API call
                setTimeout(() => {
                    // 백엔드에서 받은 영상 URL이라고 가정
                    const dummyVideoUrl = 'https://www.w3schools.com/html/mov_bbb.mp4';
                    setGeneratedVideoUrl(dummyVideoUrl);
                    setIsVideoLoading(false);
                    alert('영상이 성공적으로 생성되었습니다.');
                }, 3000);
            } else if (activeTab === 'memorial') {
                // 추모사 생성 처리
                setIsEulogyLoading(true);
                setGeneratedEulogy('');

                // Simulate AI eulogy generation
                setTimeout(() => {
                    const dummyEulogy = `삼가 故 ${memorial.name}님의 명복을 빕니다.\n\n${eulogyKeywords.filter(k => k).join(', ')}(와)과 함께한 소중한 추억들을 영원히 간직하겠습니다. 하늘에서 편안히 쉬시길 바랍니다.`;
                    setGeneratedEulogy(dummyEulogy);
                    setIsEulogyLoading(false);
                    alert('AI 추모사가 생성되었습니다.');
                }, 2000);
            }
        } catch (error) {
            console.error('Error processing request:', error);
            alert('처리 중 오류가 발생했습니다.');
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
                    <Button variant="primary" onClick={() => {
                        if (isUserAccess) {
                            navigate(`/user-memorial/${id}`);
                        } else {
                            navigate(`/memorial/${id}`);
                        }
                    }}>
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
                            onClick={() => {
                                if (isUserAccess) {
                                    navigate(`/user-memorial/${id}`);
                                } else {
                                    navigate(`/memorial/${id}`);
                                }
                            }}
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
                        이 페이지는 유가족 또는 관리자만 접근 가능합니다. 추모관의 기본 정보 수정, 영상 생성, 추모사 생성 기능을 이용할 수 있습니다.
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
                                            AI 기술을 활용하여 고인의 사진들로 감동적인 추모 영상을 제작합니다. 9장의 사진과 움직일 사진 1장을 선택하고, 키워드 5개를 입력해주세요.
                                        </Alert>

                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label className="fw-bold">
                                                        <i className="fas fa-images me-2"></i>슬라이드쇼 사진 (9장)
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={(e) => setSlideshowPhotos(Array.from(e.target.files).slice(0, 9))}
                                                        style={{ borderRadius: '8px', padding: '12px' }}
                                                    />
                                                    <Form.Text className="text-muted">
                                                        영상에 포함될 9장의 사진을 선택하세요.
                                                    </Form.Text>
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Label className="fw-bold">
                                                        <i className="fas fa-running me-2"></i>움직이는 사진 (1장)
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => setAnimatedPhoto(e.target.files[0])}
                                                        style={{ borderRadius: '8px', padding: '12px' }}
                                                    />
                                                    <Form.Text className="text-muted">
                                                        영상에서 움직이는 효과를 적용할 사진 1장을 선택하세요.
                                                    </Form.Text>
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Label className="fw-bold">
                                                    <i className="fas fa-tags me-2"></i>키워드 (5개)
                                                </Form.Label>
                                                {keywords.map((keyword, index) => (
                                                    <Form.Group className="mb-2" key={index}>
                                                        <Form.Control
                                                            type="text"
                                                            value={keyword}
                                                            onChange={(e) => {
                                                                const newKeywords = [...keywords];
                                                                newKeywords[index] = e.target.value;
                                                                setKeywords(newKeywords);
                                                            }}
                                                            placeholder={`키워드 #${index + 1}`}
                                                            style={{ borderRadius: '8px', padding: '12px' }}
                                                        />
                                                    </Form.Group>
                                                ))}
                                            </Col>
                                        </Row>

                                        {isVideoLoading && (
                                            <div className="text-center my-4">
                                                <div className="spinner-border" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                                <p className="mt-2">영상을 생성 중입니다. 잠시만 기다려주세요...</p>
                                            </div>
                                        )}

                                        {generatedVideoUrl && (
                                            <div className="mt-4">
                                                <h5 className="fw-bold">생성된 영상</h5>
                                                <video src={generatedVideoUrl} controls style={{ width: '100%', borderRadius: '8px' }} />
                                                <Button
                                                    variant="success"
                                                    className="mt-2"
                                                    onClick={() => {
                                                        const memorialIndex = dummyData.memorials._embedded.memorials.findIndex(m => m.id === parseInt(id));
                                                        if (memorialIndex !== -1) {
                                                            dummyData.memorials._embedded.memorials[memorialIndex].videoUrl = generatedVideoUrl;
                                                        }
                                                        alert('영상이 등록되었습니다!');
                                                        if (isUserAccess) {
                                                            navigate(`/user-memorial/${id}`);
                                                        } else {
                                                            navigate(`/memorial/${id}`);
                                                        }
                                                    }}
                                                >
                                                    영상 등록
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* 추모사 생성 탭 */}
                                {activeTab === 'memorial' && (
                                    <>
                                        <Alert variant="info" className="mb-4">
                                            <i className="fas fa-info-circle me-2"></i>
                                            AI가 고인을 기리는 감동적인 추모사를 작성해드립니다. 5개의 키워드를 입력하고 생성 버튼을 눌러주세요.
                                        </Alert>

                                        <Form.Label className="fw-bold">
                                            <i className="fas fa-tags me-2"></i>키워드 (5개)
                                        </Form.Label>
                                        {eulogyKeywords.map((keyword, index) => (
                                            <Form.Group className="mb-2" key={index}>
                                                <Form.Control
                                                    type="text"
                                                    value={keyword}
                                                    onChange={(e) => {
                                                        const newKeywords = [...eulogyKeywords];
                                                        newKeywords[index] = e.target.value;
                                                        setEulogyKeywords(newKeywords);
                                                    }}
                                                    placeholder={`키워드 #${index + 1}`}
                                                    style={{ borderRadius: '8px', padding: '12px' }}
                                                />
                                            </Form.Group>
                                        ))}

                                        {isEulogyLoading && (
                                            <div className="text-center my-4">
                                                <div className="spinner-border" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                                <p className="mt-2">추모사를 생성 중입니다. 잠시만 기다려주세요...</p>
                                            </div>
                                        )}

                                        {generatedEulogy && (
                                            <div className="mt-4">
                                                <h5 className="fw-bold">생성된 추모사</h5>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={8}
                                                    value={generatedEulogy}
                                                    onChange={(e) => setGeneratedEulogy(e.target.value)}
                                                    style={{ borderRadius: '8px', padding: '12px', whiteSpace: 'pre-line' }}
                                                />
                                                <Button
                                                    variant="success"
                                                    className="mt-2"
                                                    onClick={() => {
                                                        const memorialIndex = dummyData.memorials._embedded.memorials.findIndex(m => m.id === parseInt(id));
                                                        if (memorialIndex !== -1) {
                                                            dummyData.memorials._embedded.memorials[memorialIndex].eulogy = generatedEulogy;
                                                        }
                                                        alert('추모사가 등록되었습니다!');
                                                        if (isUserAccess) {
                                                            navigate(`/user-memorial/${id}`);
                                                        } else {
                                                            navigate(`/memorial/${id}`);
                                                        }
                                                    }}
                                                >
                                                    추모사 등록
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                )}

                                <hr className="my-4" />

                                <div className="d-flex justify-content-between">
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => {
                                            if (isUserAccess) {
                                                navigate(`/user-memorial/${id}`);
                                            } else {
                                                navigate(`/memorial/${id}`);
                                            }
                                        }}
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