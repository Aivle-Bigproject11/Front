import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
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
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [profileImageTitle, setProfileImageTitle] = useState('');
    const [profileImageDescription, setProfileImageDescription] = useState('');
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [slideshowPhotos, setSlideshowPhotos] = useState([]);
    const [animatedPhoto, setAnimatedPhoto] = useState(null);
    const [keywords, setKeywords] = useState(['', '', '', '', '']);
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState('');
    const [isVideoLoading, setIsVideoLoading] = useState(false);

    // 추모사 생성 관련 상태
    const [eulogyKeywords, setEulogyKeywords] = useState([]);
    const [eulogyKeywordInput, setEulogyKeywordInput] = useState('');
    const [generatedEulogy, setGeneratedEulogy] = useState('');
    const [isEulogyLoading, setIsEulogyLoading] = useState(false);
    const [basePrompt, setBasePrompt] = useState(
        `- 고인의 삶과 성품을 존중하며 회고하는 내용이 포함되어야 합니다.\n- 너무 형식적이거나 과장되지 않게, 진정성이 느껴지도록 작성해주세요.\n- 듣는 이가 고인을 자연스럽게 떠올릴 수 있도록 구체적인 표현과 장면을 사용해주세요.\n- 마지막 문장은 고인을 떠나보내는 작별 인사 또는 평안을 비는 말로 마무리해주세요.`
    );
    const [isEditingPrompt, setIsEditingPrompt] = useState(false);

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

                const data = new FormData();
                data.append('profileImage', profileImageFile);
                data.append('title', profileImageTitle);
                data.append('description', profileImageDescription);
                // Append other memorial data as needed
                // for (const key in updatedMemorial) {
                //     data.append(key, updatedMemorial[key]);
                // }

                // TODO: Implement actual API call
                // await api.updateMemorial(id, data);

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

                const eulogyPrompt = {
                    keywords: eulogyKeywords.filter(k => k).join(', '),
                    prompt: basePrompt
                };

                // TODO: 실제 API 호출로 교체
                // memorialService.generateEulogy(eulogyPrompt);

                console.log("추모사 생성 요청 데이터:", eulogyPrompt);

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

    const handleAddEulogyKeyword = () => {
        if (eulogyKeywordInput && eulogyKeywords.length < 5 && !eulogyKeywords.includes(eulogyKeywordInput)) {
            setEulogyKeywords([...eulogyKeywords, eulogyKeywordInput]);
            setEulogyKeywordInput('');
        }
    };

    const handleRemoveEulogyKeyword = (keywordToRemove) => {
        setEulogyKeywords(eulogyKeywords.filter(keyword => keyword !== keywordToRemove));
    };

    

    if (accessChecking || loading) {
        return (
            <div className="page-wrapper" style={{
                '--navbar-height': '62px',
                height: 'calc(100vh - var(--navbar-height))',
                background: 'linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'url("data:image/svg+xml,%3Csvg width=\'80\' height=\'80\' viewBox=\'0 0 80 80\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23B8860B\' fill-opacity=\'0.12\'%3E%3Cpath d=\'M40 40L20 20v40h40V20L40 40zm0-20L60 0H20l20 20zm0 20L20 60h40L40 40z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
                    opacity: 0.7
                }}></div>
                <div className="text-center" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="spinner-border" role="status" style={{ color: '#b8860b' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2" style={{ color: '#2C1F14', fontWeight: '600' }}>권한 확인 및 데이터 로드 중...</p>
                </div>
            </div>
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
        <div className="page-wrapper" style={{
            '--navbar-height': '62px',
            minHeight: 'calc(100vh - var(--navbar-height))',
            background: 'linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%)',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* 배경 패턴 */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'url("data:image/svg+xml,%3Csvg width=\'80\' height=\'80\' viewBox=\'0 0 80 80\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23B8860B\' fill-opacity=\'0.12\'%3E%3Cpath d=\'M40 40L20 20v40h40V20L40 40zm0-20L60 0H20l20 20zm0 20L20 60h40L40 40z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
                opacity: 0.7
            }}></div>
            
            <Container className="mt-4" style={{ position: 'relative', zIndex: 1 }}>
            {/* 헤더 섹션 */}
            <Row className="mb-4">
                <Col>
                    <div className="config-header-section p-4" style={{
                        background: 'rgba(255, 251, 235, 0.9)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '20px',
                        border: '1px solid rgba(184, 134, 11, 0.25)',
                        boxShadow: '0 8px 32px rgba(44, 31, 20, 0.15)',
                        color: '#2C1F14'
                    }}>
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => {
                                if (isUserAccess) {
                                    navigate(`/user-memorial/${id}`);
                                } else {
                                    navigate(`/memorial/${id}`);
                                }
                            }}
                            className="mb-3"
                            style={{
                                borderRadius: '12px',
                                padding: '8px 16px',
                                border: '1px solid rgba(184, 134, 11, 0.3)',
                                color: '#B8860B',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <i className="fas fa-arrow-left me-2"></i>
                            추모관으로 돌아가기
                        </Button>

                        <h1 className="mb-2" style={{ 
                            fontWeight: '700',
                            background: 'linear-gradient(135deg, #B8860B 0%, #CD853F 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            <i className="fas fa-edit me-3" style={{ color: '#B8860B' }}></i>
                            추모관 관리
                        </h1>
                        <p className="lead mb-0" style={{ color: '#4A3728', fontSize: '1.1rem' }}>
                            {memorial.name}님의 추모관을 관리할 수 있습니다
                        </p>
                    </div>
                </Col>
            </Row>

            {/* 권한 안내 */}
            <Row className="mb-4">
                <Col>
                    <div style={{
                        background: 'rgba(184, 134, 11, 0.08)',
                        border: '1px solid rgba(184, 134, 11, 0.2)',
                        borderRadius: '16px',
                        padding: '20px',
                        color: '#2C1F14'
                    }}>
                        <i className="fas fa-info-circle me-2" style={{ color: '#B8860B' }}></i>
                        이 페이지는 유가족 또는 관리자만 접근 가능합니다. 추모관의 기본 정보 수정, 영상 생성, 추모사 생성 기능을 이용할 수 있습니다.
                    </div>
                </Col>
            </Row>

            {/* 탭 네비게이션 */}
            <Row className="mb-4">
                <Col>
                    <div className="config-tabs" style={{
                        display: 'flex',
                        background: 'rgba(255, 251, 235, 0.9)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '20px',
                        padding: '8px',
                        gap: '6px',
                        border: '1px solid rgba(184, 134, 11, 0.2)',
                        boxShadow: '0 4px 20px rgba(44, 31, 20, 0.08)'
                    }}>
                        <button 
                            className={`config-tab ${activeTab === 'basic' ? 'active' : ''}`}
                            onClick={() => setActiveTab('basic')}
                            style={{
                                flex: 1,
                                padding: '16px 20px',
                                border: 'none',
                                borderRadius: '14px',
                                background: activeTab === 'basic' 
                                    ? 'linear-gradient(135deg, #B8860B, #CD853F)' 
                                    : 'transparent',
                                color: activeTab === 'basic' ? 'white' : '#4A3728',
                                fontWeight: '600',
                                fontSize: '16px',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                boxShadow: activeTab === 'basic' 
                                    ? '0 4px 15px rgba(184, 134, 11, 0.3)' 
                                    : 'none'
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
                                padding: '16px 20px',
                                border: 'none',
                                borderRadius: '14px',
                                background: activeTab === 'video' 
                                    ? 'linear-gradient(135deg, #B8860B, #CD853F)' 
                                    : 'transparent',
                                color: activeTab === 'video' ? 'white' : '#4A3728',
                                fontWeight: '600',
                                fontSize: '16px',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                boxShadow: activeTab === 'video' 
                                    ? '0 4px 15px rgba(184, 134, 11, 0.3)' 
                                    : 'none'
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
                                padding: '16px 20px',
                                border: 'none',
                                borderRadius: '14px',
                                background: activeTab === 'memorial' 
                                    ? 'linear-gradient(135deg, #B8860B, #CD853F)' 
                                    : 'transparent',
                                color: activeTab === 'memorial' ? 'white' : '#4A3728',
                                fontWeight: '600',
                                fontSize: '16px',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                boxShadow: activeTab === 'memorial' 
                                    ? '0 4px 15px rgba(184, 134, 11, 0.3)' 
                                    : 'none'
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
                    <Card style={{ 
                        borderRadius: '20px', 
                        border: 'none', 
                        boxShadow: '0 8px 32px rgba(44, 31, 20, 0.15)',
                        background: 'rgba(255, 251, 235, 0.95)',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <Card.Header style={{
                            background: activeTab === 'basic' ? 'linear-gradient(135deg, rgba(184, 134, 11, 0.1) 0%, rgba(205, 133, 63, 0.05) 100%)' :
                                      activeTab === 'video' ? 'linear-gradient(135deg, rgba(184, 134, 11, 0.1) 0%, rgba(205, 133, 63, 0.05) 100%)' :
                                      'linear-gradient(135deg, rgba(184, 134, 11, 0.1) 0%, rgba(205, 133, 63, 0.05) 100%)',
                            borderRadius: '20px 20px 0 0',
                            padding: '1.5rem',
                            border: 'none',
                            borderBottom: '1px solid rgba(184, 134, 11, 0.15)'
                        }}>
                            <h5 className="mb-0" style={{ color: '#2C1F14', fontWeight: '700' }}>
                                {activeTab === 'basic' && <><i className="fas fa-user-edit me-2" style={{ color: '#B8860B' }}></i>추모관 기본 정보</>}
                                {activeTab === 'video' && <><i className="fas fa-video me-2" style={{ color: '#B8860B' }}></i>AI 추모 영상 생성</>}
                                {activeTab === 'memorial' && <><i className="fas fa-pen-fancy me-2" style={{ color: '#B8860B' }}></i>AI 추모사 생성</>}
                            </h5>
                        </Card.Header>
                        <Card.Body style={{ padding: '2rem' }}>
                            <Form onSubmit={handleSubmit}>
                                {/* 기본 설정 탭 */}
                                {activeTab === 'basic' && (
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold" style={{ color: '#2C1F14' }}>
                                                    <i className="fas fa-user me-2" style={{ color: '#B8860B' }}></i>성함 *
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                    style={{ 
                                                        borderRadius: '12px', 
                                                        padding: '12px 16px',
                                                        border: '2px solid rgba(184, 134, 11, 0.2)',
                                                        background: 'rgba(255, 255, 255, 0.9)',
                                                        color: '#2C1F14'
                                                    }}
                                                />
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold" style={{ color: '#2C1F14' }}>
                                                    <i className="fas fa-birthday-cake me-2" style={{ color: '#B8860B' }}></i>나이 *
                                                </Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="age"
                                                    value={formData.age}
                                                    onChange={handleInputChange}
                                                    required
                                                    style={{ 
                                                        borderRadius: '12px', 
                                                        padding: '12px 16px',
                                                        border: '2px solid rgba(184, 134, 11, 0.2)',
                                                        background: 'rgba(255, 255, 255, 0.9)',
                                                        color: '#2C1F14'
                                                    }}
                                                />
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold" style={{ color: '#2C1F14' }}>
                                                    <i className="fas fa-venus-mars me-2" style={{ color: '#B8860B' }}></i>성별 *
                                                </Form.Label>
                                                <Form.Select
                                                    name="gender"
                                                    value={formData.gender}
                                                    onChange={handleInputChange}
                                                    required
                                                    style={{ 
                                                        borderRadius: '12px', 
                                                        padding: '12px 16px',
                                                        border: '2px solid rgba(184, 134, 11, 0.2)',
                                                        background: 'rgba(255, 255, 255, 0.9)',
                                                        color: '#2C1F14'
                                                    }}
                                                >
                                                    <option value="">성별 선택</option>
                                                    <option value="MALE">남성</option>
                                                    <option value="FEMALE">여성</option>
                                                </Form.Select>
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold" style={{ color: '#2C1F14' }}>
                                                    <i className="fas fa-id-card me-2" style={{ color: '#B8860B' }}></i>고객ID *
                                                </Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="customerId"
                                                    value={formData.customerId}
                                                    onChange={handleInputChange}
                                                    required
                                                    style={{ 
                                                        borderRadius: '12px', 
                                                        padding: '12px 16px',
                                                        border: '2px solid rgba(184, 134, 11, 0.2)',
                                                        background: 'rgba(255, 255, 255, 0.9)',
                                                        color: '#2C1F14'
                                                    }}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold" style={{ color: '#2C1F14' }}>
                                                    <i className="fas fa-calendar-alt me-2" style={{ color: '#B8860B' }}></i>생년월일 *
                                                </Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    name="birthOfDate"
                                                    value={formData.birthOfDate}
                                                    onChange={handleInputChange}
                                                    required
                                                    style={{ 
                                                        borderRadius: '12px', 
                                                        padding: '12px 16px',
                                                        border: '2px solid rgba(184, 134, 11, 0.2)',
                                                        background: 'rgba(255, 255, 255, 0.9)',
                                                        color: '#2C1F14'
                                                    }}
                                                />
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold" style={{ color: '#2C1F14' }}>
                                                    <i className="fas fa-cross me-2" style={{ color: '#B8860B' }}></i>별세일 *
                                                </Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    name="deceasedDate"
                                                    value={formData.deceasedDate}
                                                    onChange={handleInputChange}
                                                    required
                                                    style={{ 
                                                        borderRadius: '12px', 
                                                        padding: '12px 16px',
                                                        border: '2px solid rgba(184, 134, 11, 0.2)',
                                                        background: 'rgba(255, 255, 255, 0.9)',
                                                        color: '#2C1F14'
                                                    }}
                                                />
                                            </Form.Group>

                                            <div style={{
                                                border: '2px solid rgba(184, 134, 11, 0.2)',
                                                borderRadius: '16px',
                                                padding: '20px',
                                                background: 'rgba(255, 255, 255, 0.5)'
                                            }}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label className="fw-bold" style={{ color: '#2C1F14' }}>
                                                        <i className="fas fa-image me-2" style={{ color: '#B8860B' }}></i>프로필 사진
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                setProfileImageFile(file);
                                                                setImagePreviewUrl(URL.createObjectURL(file));
                                                            }
                                                        }}
                                                        style={{
                                                            borderRadius: '12px',
                                                            padding: '12px 16px',
                                                            border: '2px solid rgba(184, 134, 11, 0.2)',
                                                            background: 'rgba(255, 255, 255, 0.9)',
                                                            color: '#2C1F14'
                                                        }}
                                                    />
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Label className="fw-bold" style={{ color: '#2C1F14' }}>
                                                        <i className="fas fa-heading me-2" style={{ color: '#B8860B' }}></i>사진 제목
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={profileImageTitle}
                                                        onChange={(e) => setProfileImageTitle(e.target.value)}
                                                        placeholder="사진의 제목을 입력하세요"
                                                        style={{
                                                            borderRadius: '12px',
                                                            padding: '12px 16px',
                                                            border: '2px solid rgba(184, 134, 11, 0.2)',
                                                            background: 'rgba(255, 255, 255, 0.9)',
                                                            color: '#2C1F14'
                                                        }}
                                                    />
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Label className="fw-bold" style={{ color: '#2C1F14' }}>
                                                        <i className="fas fa-align-left me-2" style={{ color: '#B8860B' }}></i>사진 설명
                                                    </Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={3}
                                                        value={profileImageDescription}
                                                        onChange={(e) => setProfileImageDescription(e.target.value)}
                                                        placeholder="사진에 대한 설명을 입력하세요"
                                                        style={{
                                                            borderRadius: '12px',
                                                            padding: '12px 16px',
                                                            border: '2px solid rgba(184, 134, 11, 0.2)',
                                                            background: 'rgba(255, 255, 255, 0.9)',
                                                            color: '#2C1F14'
                                                        }}
                                                    />
                                                </Form.Group>

                                                {/* 현재 이미지 미리보기 */}
                                                {(imagePreviewUrl || formData.imageUrl) && (
                                                    <div className="mb-3">
                                                        <Form.Label className="fw-bold" style={{ color: '#2C1F14' }}>미리보기</Form.Label>
                                                        <div className="text-center">
                                                            <img
                                                                src={imagePreviewUrl || formData.imageUrl}
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
                                            </div>
                                        </Col>
                                    </Row>
                                )}

                                {/* 영상 생성 탭 */}
                                {activeTab === 'video' && (
                                    <>
                                        <div style={{
                                            background: 'rgba(184, 134, 11, 0.08)',
                                            border: '1px solid rgba(184, 134, 11, 0.2)',
                                            borderRadius: '16px',
                                            padding: '20px',
                                            color: '#2C1F14',
                                            marginBottom: '24px'
                                        }}>
                                            <i className="fas fa-info-circle me-2" style={{ color: '#B8860B' }}></i>
                                            AI 기술을 활용하여 고인의 사진들로 감동적인 추모 영상을 제작합니다. 9장의 사진과 움직일 사진 1장을 선택하고, 키워드 5개를 입력해주세요.
                                        </div>

                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label className="fw-bold" style={{ color: '#2C1F14' }}>
                                                        <i className="fas fa-images me-2" style={{ color: '#B8860B' }}></i>슬라이드쇼 사진 (9장)
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={(e) => setSlideshowPhotos(Array.from(e.target.files).slice(0, 9))}
                                                        style={{ 
                                                            borderRadius: '12px', 
                                                            padding: '12px 16px',
                                                            border: '2px solid rgba(184, 134, 11, 0.2)',
                                                            background: 'rgba(255, 255, 255, 0.9)',
                                                            color: '#2C1F14'
                                                        }}
                                                    />
                                                    <Form.Text className="text-muted">
                                                        영상에 포함될 9장의 사진을 선택하세요.
                                                    </Form.Text>
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Label className="fw-bold" style={{ color: '#2C1F14' }}>
                                                        <i className="fas fa-running me-2" style={{ color: '#B8860B' }}></i>움직이는 사진 (1장)
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => setAnimatedPhoto(e.target.files[0])}
                                                        style={{ 
                                                            borderRadius: '12px', 
                                                            padding: '12px 16px',
                                                            border: '2px solid rgba(184, 134, 11, 0.2)',
                                                            background: 'rgba(255, 255, 255, 0.9)',
                                                            color: '#2C1F14'
                                                        }}
                                                    />
                                                    <Form.Text className="text-muted">
                                                        영상에서 움직이는 효과를 적용할 사진 1장을 선택하세요.
                                                    </Form.Text>
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Label className="fw-bold" style={{ color: '#2C1F14' }}>
                                                    <i className="fas fa-tags me-2" style={{ color: '#B8860B' }}></i>키워드 (5개)
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
                                                            style={{ 
                                                                borderRadius: '12px', 
                                                                padding: '12px 16px',
                                                                border: '2px solid rgba(184, 134, 11, 0.2)',
                                                                background: 'rgba(255, 255, 255, 0.9)',
                                                                color: '#2C1F14'
                                                            }}
                                                        />
                                                    </Form.Group>
                                                ))}
                                            </Col>
                                        </Row>

                                        {isVideoLoading && (
                                            <div className="text-center my-4">
                                                <div className="spinner-border" role="status" style={{ color: '#B8860B' }}>
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                                <p className="mt-2" style={{ color: '#2C1F14' }}>영상을 생성 중입니다. 잠시만 기다려주세요...</p>
                                            </div>
                                        )}

                                        {generatedVideoUrl && (
                                            <div className="mt-4">
                                                <h5 className="fw-bold" style={{ color: '#2C1F14' }}>생성된 영상</h5>
                                                <video src={generatedVideoUrl} controls style={{ width: '100%', borderRadius: '12px' }} />
                                                <Button
                                                    className="mt-2"
                                                    style={{
                                                        background: 'linear-gradient(135deg, #B8860B, #CD853F)',
                                                        border: 'none',
                                                        borderRadius: '12px',
                                                        padding: '12px 24px',
                                                        fontWeight: '600',
                                                        boxShadow: '0 4px 15px rgba(184, 134, 11, 0.3)'
                                                    }}
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
                                        <div style={{
                                            background: 'rgba(184, 134, 11, 0.08)',
                                            border: '1px solid rgba(184, 134, 11, 0.2)',
                                            borderRadius: '16px',
                                            padding: '20px',
                                            color: '#2C1F14',
                                            marginBottom: '24px'
                                        }}>
                                            <i className="fas fa-info-circle me-2" style={{ color: '#B8860B' }}></i>
                                            AI가 고인을 기리는 감동적인 추모사를 작성해드립니다. 5개의 키워드를 입력하고 생성 버튼을 눌러주세요.
                                        </div>

                                        <Form.Label className="fw-bold" style={{ color: '#2C1F14' }}>
                                            <i className="fas fa-tags me-2" style={{ color: '#B8860B' }}></i>키워드 (최대 5개)
                                        </Form.Label>
                                        <div className="d-flex mb-2">
                                            <Form.Control
                                                type="text"
                                                value={eulogyKeywordInput}
                                                onChange={(e) => setEulogyKeywordInput(e.target.value)}
                                                placeholder="키워드를 입력하세요"
                                                style={{
                                                    borderRadius: '12px 0 0 12px',
                                                    padding: '12px 16px',
                                                    border: '2px solid rgba(184, 134, 11, 0.2)',
                                                    background: 'rgba(255, 255, 255, 0.9)',
                                                    color: '#2C1F14'
                                                }}
                                            />
                                            <Button
                                                onClick={handleAddEulogyKeyword}
                                                style={{
                                                    borderRadius: '0 12px 12px 0',
                                                    background: 'linear-gradient(135deg, #B8860B, #CD853F)',
                                                    border: 'none',
                                                    fontWeight: '600',
                                                    boxShadow: '0 4px 15px rgba(184, 134, 11, 0.3)'
                                                }}
                                            >
                                                추가
                                            </Button>
                                        </div>
                                        <div className="d-flex flex-wrap gap-2 mb-3">
                                            {eulogyKeywords.map((keyword, index) => (
                                                <div key={index} className="d-flex align-items-center" style={{
                                                    background: 'rgba(184, 134, 11, 0.1)',
                                                    borderRadius: '12px',
                                                    padding: '8px 12px',
                                                    color: '#2C1F14'
                                                }}>
                                                    <span>{keyword}</span>
                                                    <Button
                                                        variant="link"
                                                        size="sm"
                                                        onClick={() => handleRemoveEulogyKeyword(keyword)}
                                                        style={{ color: '#B8860B', textDecoration: 'none' }}
                                                    >
                                                        &times;
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>

                                        <Form.Group className="mb-3">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <Form.Label className="fw-bold mb-0" style={{ color: '#2C1F14' }}>
                                                    <i className="fas fa-file-alt me-2" style={{ color: '#B8860B' }}></i>AI 프롬프트
                                                </Form.Label>
                                                <div className="d-flex align-items-center">
                                                    <Form.Text className="text-muted me-2">
                                                        기본 지침입니다. '편집' 버튼을 눌러 내용을 수정하고 '저장' 버튼을 눌러 반영하세요.
                                                    </Form.Text>
                                                    <Button
                                                        variant={isEditingPrompt ? "success" : "outline-secondary"}
                                                        size="sm"
                                                        onClick={() => {
                                                            if (isEditingPrompt) { // "저장" 버튼 클릭 시
                                                                const lines = basePrompt.split('\n');
                                                                const correctedLines = lines
                                                                    .map(line => line.trim())
                                                                    .filter(line => line && line !== '-')
                                                                    .map(line => {
                                                                        if (line.startsWith('- ')) {
                                                                            return line;
                                                                        }
                                                                        if (line.startsWith('-')) {
                                                                            return '- ' + line.substring(1).trim();
                                                                        }
                                                                        return '- ' + line;
                                                                    });
                                                                
                                                                let finalPrompt = correctedLines.join('\n');
                                                                if (!finalPrompt) {
                                                                    finalPrompt = `- 고인의 삶과 성품을 존중하며 회고하는 내용이 포함되어야 합니다.\n- 너무 형식적이거나 과장되지 않게, 진정성이 느껴지도록 작성해주세요.\n- 듣는 이가 고인을 자연스럽게 떠올릴 수 있도록 구체적인 표현과 장면을 사용해주세요.\n- 마지막 문장은 고인을 떠나보내는 작별 인사 또는 평안을 비는 말로 마무리해주세요.`;
                                                                }
                                                                setBasePrompt(finalPrompt);
                                                            }
                                                            setIsEditingPrompt(!isEditingPrompt);
                                                        }}
                                                    >
                                                        {isEditingPrompt ? '저장' : '편집'}
                                                    </Button>
                                                </div>
                                            </div>
                                            <Form.Control
                                                as="textarea"
                                                rows={5}
                                                value={basePrompt}
                                                onChange={(e) => setBasePrompt(e.target.value)}
                                                readOnly={!isEditingPrompt}
                                                style={{
                                                    borderRadius: '12px',
                                                    padding: '16px',
                                                    whiteSpace: 'pre-line',
                                                    border: `2px solid ${isEditingPrompt ? 'rgba(40, 167, 69, 0.5)' : 'rgba(184, 134, 11, 0.2)'}`,
                                                    background: isEditingPrompt ? 'rgba(255, 255, 255, 1)' : 'rgba(248, 249, 250, 0.7)',
                                                    color: '#2C1F14',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            />
                                        </Form.Group>

                                        {isEulogyLoading && (
                                            <div className="text-center my-4">
                                                <div className="spinner-border" role="status" style={{ color: '#B8860B' }}>
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                                <p className="mt-2" style={{ color: '#2C1F14' }}>추모사를 생성 중입니다. 잠시만 기다려주세요...</p>
                                            </div>
                                        )}

                                        {generatedEulogy && (
                                            <div className="mt-4">
                                                <h5 className="fw-bold" style={{ color: '#2C1F14' }}>생성된 추모사</h5>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={8}
                                                    value={generatedEulogy}
                                                    onChange={(e) => setGeneratedEulogy(e.target.value)}
                                                    style={{ 
                                                        borderRadius: '12px', 
                                                        padding: '16px', 
                                                        whiteSpace: 'pre-line',
                                                        border: '2px solid rgba(184, 134, 11, 0.2)',
                                                        background: 'rgba(255, 255, 255, 0.9)',
                                                        color: '#2C1F14'
                                                    }}
                                                />
                                                <Button
                                                    className="mt-2"
                                                    style={{
                                                        background: 'linear-gradient(135deg, #B8860B, #CD853F)',
                                                        border: 'none',
                                                        borderRadius: '12px',
                                                        padding: '12px 24px',
                                                        fontWeight: '600',
                                                        boxShadow: '0 4px 15px rgba(184, 134, 11, 0.3)'
                                                    }}
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
                                        style={{ 
                                            borderRadius: '12px', 
                                            padding: '12px 24px',
                                            border: '2px solid rgba(184, 134, 11, 0.3)',
                                            color: '#B8860B',
                                            fontWeight: '600'
                                        }}
                                    >
                                        <i className="fas fa-times me-2"></i>
                                        취소
                                    </Button>
                                    <Button
                                        type="submit"
                                        style={{
                                            borderRadius: '12px',
                                            padding: '12px 24px',
                                            background: 'linear-gradient(135deg, #B8860B 0%, #CD853F 100%)',
                                            border: 'none',
                                            fontWeight: '600',
                                            boxShadow: '0 4px 15px rgba(184, 134, 11, 0.3)'
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
        </div>
    );
};

export default MemorialConfig;