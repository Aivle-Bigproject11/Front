import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import { apiService } from '../services/api';
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
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [slideshowPhotos, setSlideshowPhotos] = useState([]);
    const [slideshowPhotoURLs, setSlideshowPhotoURLs] = useState([]);
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
        // 권한 확인 및 데이터 로드
        const loadData = async () => {
            try {
                // 로그인 상태 확인
                if (!user) {
                    alert('로그인이 필요한 페이지입니다.');
                    navigate('/login');
                    return;
                }

                // 관리자는 모든 추모관에 접근 가능
                if (isAdminAccess) {
                    setIsFamilyMember(true);
                } else if (isUserAccess) {
                    // 유저(유가족)인 경우 해당 추모관 접근 권한 확인
                    try {
                        const response = await apiService.getMemorial(id);
                        const memorialData = response;
                        
                        // 현재 로그인한 유저의 customerId와 추모관의 customerId 비교
                        // 또는 familyList에 포함되어 있는지 확인
                        console.log('🔍 권한 확인 - 로그인 유저:', user);
                        console.log('🔍 권한 확인 - 추모관 데이터:', memorialData);
                        console.log('🔍 권한 확인 - 유저 ID:', user.id, '추모관 고객 ID:', memorialData.customerId);
                        
                        const hasAccess = memorialData.customerId === user.id || 
                                        (memorialData.familyList && 
                                         memorialData.familyList.some(family => family.userId === user.id));
                        
                        console.log('🔍 권한 확인 결과:', hasAccess);
                        
                        // 개발 환경에서는 권한 검사를 우회 (임시)
                        const isDevelopment = process.env.NODE_ENV === 'development';
                        if (!hasAccess && !isDevelopment) {
                            alert('해당 추모관에 대한 접근 권한이 없습니다.');
                            navigate('/menu4');
                            return;
                        } else if (!hasAccess && isDevelopment) {
                            console.warn('⚠️ 개발 환경에서 권한 검사 우회');
                        }
                        setIsFamilyMember(true);
                    } catch (error) {
                        console.error('권한 확인 중 오류:', error);
                        alert('권한 확인 중 오류가 발생했습니다.');
                        navigate('/menu4');
                        return;
                    }
                } else {
                    alert('유가족 또는 관리자만 접근 가능한 페이지입니다.');
                    navigate('/login');
                    return;
                }

                const response = await apiService.getMemorial(id);
                console.log('✅ MemorialConfig API 응답:', response);
                
                // API 명세에 따라 응답이 직접 memorial 객체
                const memorialData = response;

                setMemorial(memorialData);
                setGeneratedEulogy(memorialData.tribute || '');
                setFormData({
                    name: memorialData.name,
                    age: memorialData.age,
                    birthOfDate: memorialData.birthDate, // API 명세에 따라 birthDate로 수정
                    deceasedDate: memorialData.deceasedDate,
                    gender: memorialData.gender,
                    imageUrl: memorialData.profileImageUrl || '', // API 명세에 따라 profileImageUrl로 수정
                    customerId: memorialData.customerId
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

        loadData();
    }, [id, navigate, isAdminAccess, isUserAccess]);

    useEffect(() => {
        const urls = slideshowPhotos.map(photo => URL.createObjectURL(photo));
        setSlideshowPhotoURLs(urls);

        // Cleanup function to revoke URLs
        return () => {
            urls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [slideshowPhotos]);

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

    const handleSlideshowPhotoChange = (e) => {
        const newFiles = Array.from(e.target.files);
        const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB
        const MAX_INDIVIDUAL_SIZE = 5 * 1024 * 1024; // 5MB

        // 개별 파일 크기 확인
        for (const file of newFiles) {
            if (file.size > MAX_INDIVIDUAL_SIZE) {
                alert(`개별 사진의 용량은 5MB를 초과할 수 없습니다. (${file.name})`);
                return;
            }
        }

        // 새로 추가될 사진 포함 전체 개수 확인
        if (slideshowPhotos.length + newFiles.length > 15) {
            alert('슬라이드쇼 사진은 최대 15개까지 선택 가능합니다.');
            return;
        }

        // 새로 추가될 사진 포함 전체 용량 확인
        const currentTotalSize = slideshowPhotos.reduce((acc, photo) => acc + photo.size, 0);
        const newFilesSize = newFiles.reduce((acc, file) => acc + file.size, 0);
        if (currentTotalSize + newFilesSize > MAX_TOTAL_SIZE) {
            alert('업로드하는 모든 사진의 총 용량은 50MB를 초과할 수 없습니다.');
            return;
        }

        setSlideshowPhotos(prevPhotos => [...prevPhotos, ...newFiles]);
    };

    const handleRemoveSlideshowPhoto = (index) => {
        setSlideshowPhotos(prevPhotos => prevPhotos.filter((_, i) => i !== index));
    };

    const handleChangeSlideshowPhoto = (index, file) => {
        const MAX_INDIVIDUAL_SIZE = 5 * 1024 * 1024; // 5MB
        if (file.size > MAX_INDIVIDUAL_SIZE) {
            alert(`개별 사진의 용량은 5MB를 초과할 수 없습니다. (${file.name})`);
            return;
        }

        const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB
        const currentTotalSize = slideshowPhotos.reduce((acc, photo, i) => {
            if (i === index) return acc; // 교체될 파일은 용량 계산에서 제외
            return acc + photo.size;
        }, 0);

        if (currentTotalSize + file.size > MAX_TOTAL_SIZE) {
            alert('업로드하는 모든 사진의 총 용량은 50MB를 초과할 수 없습니다.');
            return;
        }

        setSlideshowPhotos(prevPhotos => {
            const newPhotos = [...prevPhotos];
            newPhotos[index] = file;
            return newPhotos;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (activeTab === 'basic') {
            // 기본 정보 수정
            try {
                // Menu4 API 명세에 맞는 간단한 형태로 수정
                const updatedMemorial = {
                    name: formData.name,
                    age: parseInt(formData.age),
                    birthDate: formData.birthOfDate,
                    deceasedDate: formData.deceasedDate,
                    gender: formData.gender,
                    customerId: parseInt(formData.customerId)
                };
                
                // Menu4 API 사용 (현재 구현된 방식 유지)
                await apiService.updateMemorial(id, updatedMemorial);

                // 2. 프로필 이미지 업데이트 (파일이 선택된 경우)
                if (profileImageFile) {
                    const imageData = new FormData();
                    imageData.append('photo', profileImageFile); // API 명세에 따라 'photo' 필드 사용
                    await apiService.uploadMemorialProfileImage(id, imageData);
                }

                alert('추모관 정보가 성공적으로 수정되었습니다.');
                navigate(`/memorial/${id}`);

            } catch (error) {
                console.error('Error updating memorial:', error);
                alert('정보 수정에 실패했습니다.');
            }
        } else if (activeTab === 'video') {
            // 영상 생성 처리
            if (!slideshowPhotos || slideshowPhotos.length < 9) {
                alert("슬라이드쇼용 사진을 최소 9장 이상 선택해주세요.");
                return;
            }
            
            if (slideshowPhotos.length > 15) {
                alert("슬라이드쇼 사진은 최대 15개까지 선택 가능합니다.");
                return;
            }
            
            const totalSize = slideshowPhotos.reduce((acc, photo) => acc + photo.size, 0);
            const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB
            if (totalSize > MAX_TOTAL_SIZE) {
                alert('업로드하는 모든 사진의 총 용량은 50MB를 초과할 수 없습니다.');
                return;
            }

            if (!animatedPhoto) {
                alert("움직이는 효과를 적용할 사진을 선택해주세요.");
                return;
            }
            
            const validKeywords = keywords.filter(k => k.trim());
            if (validKeywords.length === 0) {
                alert("키워드를 최소 1개 이상 입력해주세요.");
                return;
            }

            setIsVideoLoading(true);
            try {
                const formData = new FormData();
                formData.append('memorialId', id);
                
                // keywords를 문장으로 변환
                const keywordsText = validKeywords.join(', ');
                formData.append('keywords', keywordsText);
                formData.append('imagesCount', slideshowPhotos.length);
                
                // outroImage 원본 그대로 사용
                formData.append('outroImage', animatedPhoto);
                
                // 슬라이드쇼 이미지들 원본 그대로 추가
                slideshowPhotos.forEach((photo, index) => {
                    formData.append('images', photo);
                });

                // FormData 내용 디버깅
                console.log('🔗 FormData 내용:');
                for (let [key, value] of formData.entries()) {
                    if (value instanceof File) {
                        console.log(`  ${key}: [File] ${value.name} (${value.size} bytes)`);
                    } else {
                        console.log(`  ${key}: ${value}`);
                    }
                }

                console.log('🔗 CreateVideo 요청 시작 - Memorial ID:', id);
                console.log('🔗 Keywords:', keywordsText);
                console.log('🔗 Images Count:', slideshowPhotos.length);
                console.log('🔗 영상 생성 시작...');
                
                const response = await apiService.createVideo(id, formData);
                console.log('✅ CreateVideo 응답:', response);
                
                alert("영상 생성이 요청되었습니다. 생성이 완료되면 추모관에서 확인하실 수 있습니다.");
                
                // 폼 초기화
                setSlideshowPhotos([]);
                setAnimatedPhoto(null);
                setKeywords(['', '', '', '', '']);
                
            } catch (error) {
                console.error('❌ CreateVideo 실패:', error);
                
                // 에러 응답 상세 정보 출력
                if (error.response) {
                    console.error('응답 상태:', error.response.status);
                    console.error('응답 데이터:', error.response.data);
                    console.error('응답 헤더:', error.response.headers);
                    
                    if (error.response.data && error.response.data.message) {
                        alert(`영상 생성 요청에 실패했습니다: ${error.response.data.message}`);
                    } else {
                        alert(`영상 생성 요청에 실패했습니다. (상태: ${error.response.status})`);
                    }
                } else if (error.request) {
                    console.error('요청이 전송되지 않았습니다:', error.request);
                    alert("서버에 연결할 수 없습니다. 네트워크를 확인해주세요.");
                } else {
                    console.error('요청 설정 오류:', error.message);
                    alert("요청 처리 중 오류가 발생했습니다.");
                }
            } finally {
                setIsVideoLoading(false);
            }

        } else if (activeTab === 'memorial') {
            // 추모사 생성 처리
            setIsEulogyLoading(true);
            
            // 토큰 확인
            const token = localStorage.getItem('token');
            if (!token) {
                alert('인증 토큰이 없습니다. 다시 로그인해주세요.');
                navigate('/login');
                setIsEulogyLoading(false);
                return;
            }
            
            try {
                const eulogyRequest = {
                    keywords: eulogyKeywords.filter(k => k).join(', '), // API 명세에 따라 String으로 변경
                    tributeRequest: basePrompt // API 명세에 따라 prompt -> tributeRequest로 변경
                };
                console.log('🔗 CreateTribute 요청 데이터:', eulogyRequest);
                console.log('🔗 Memorial ID:', id);
                console.log('🔗 API URL:', `${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/memorials/${id}/tribute`);
                console.log('🔗 추모사 생성 시작... (최대 60초 소요)');
                
                const response = await apiService.createTribute(id, eulogyRequest);
                console.log('✅ CreateTribute API 응답:', response);
                setGeneratedEulogy(response.tribute || response);
                alert('AI 추모사가 생성되었습니다.');
            } catch (error) {
                console.error('❌ 추모사 생성 실패:', error);
                
                // 에러 타입별 상세 메시지
                if (error.code === 'ECONNABORTED') {
                    alert('추모사 생성 시간이 초과되었습니다. AI 서버가 바쁠 수 있으니 잠시 후 다시 시도해주세요.');
                } else if (error.response) {
                    console.error('응답 상태:', error.response.status);
                    console.error('응답 데이터:', error.response.data);
                    
                    if (error.response.status === 500) {
                        // 백엔드 서버 오류 상세 분석
                        const errorMessage = error.response.data?.message || '서버 내부 오류';
                        console.error('서버 오류 상세:', errorMessage);
                        
                        if (errorMessage.includes('AI') || errorMessage.includes('LLM') || errorMessage.includes('OpenAI')) {
                            alert('AI 서비스 연결에 문제가 있습니다. 잠시 후 다시 시도해주세요.');
                        } else if (errorMessage.includes('network') || errorMessage.includes('connection')) {
                            alert('네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요.');
                        } else {
                            alert(`서버 오류로 인해 추모사 생성에 실패했습니다.\n오류: ${errorMessage}\n잠시 후 다시 시도해주세요.`);
                        }
                    } else if (error.response.status === 401) {
                        alert('인증 토큰이 만료되었거나 유효하지 않습니다. 다시 로그인해주세요.');
                        navigate('/login');
                    } else if (error.response.status === 403) {
                        alert('추모사 생성 권한이 없습니다. 유가족만 이용 가능한 기능입니다.');
                    } else if (error.response.status === 404) {
                        alert('추모관을 찾을 수 없습니다.');
                    } else if (error.response.status === 400) {
                        const errorMessage = error.response.data?.message || '잘못된 요청';
                        alert(`요청 정보가 올바르지 않습니다: ${errorMessage}`);
                    } else {
                        const errorMessage = error.response.data?.message || '알 수 없는 오류';
                        alert(`추모사 생성에 실패했습니다.\n오류 코드: ${error.response.status}\n메시지: ${errorMessage}`);
                    }
                } else if (error.request) {
                    console.error('네트워크 오류:', error.request);
                    alert('서버에 연결할 수 없습니다.\n1. 백엔드 서버가 실행 중인지 확인해주세요\n2. 네트워크 연결 상태를 확인해주세요');
                } else {
                    console.error('요청 설정 오류:', error.message);
                    alert(`추모사 생성 중 예상치 못한 오류가 발생했습니다.\n오류: ${error.message}`);
                }
            } finally {
                setIsEulogyLoading(false);
            }
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

    const handleEulogyKeywordKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddEulogyKeyword();
        }
    };

    

    if (accessChecking || loading) {
        return (
            <div className="page-wrapper" style={{
                '--navbar-height': '62px',
                height: isUserAccess ? '100vh' : 'calc(100vh - var(--navbar-height))',
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
                    background: 'url("data:image/svg+xml,%3Csvg width=\'80\' height=\'80\' viewBox=\'0 0 80 80\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23B8860B\' fill-opacity=\'0.12\' %3E%3Cpath d=\'M40 40L20 20v40h40V20L40 40zm0-20L60 0H20l20 20zm0 20L20 60h40L40 40z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
                    opacity: 0.7
                }}>
                </div>
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
                background: 'url("data:image/svg+xml,%3Csvg width=\'80\' height=\'80\' viewBox=\'0 0 80 80\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23B8860B\' fill-opacity=\'0.12\' %3E%3Cpath d=\'M40 40L20 20v40h40V20L40 40zm0-20L60 0H20l20 20zm0 20L20 60h40L40 40z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
                opacity: 0.7
            }}>
            </div>
            
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
                        <button
                            type="button"
                            onClick={() => {
                                if (isUserAccess) {
                                    navigate(`/user-memorial/${id}`);
                                } else {
                                    navigate(`/memorial/${id}`);
                                }
                            }}
                            className="mb-3"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                height: '45px',
                                padding: '0 20px',
                                boxSizing: 'border-box',
                                background: 'linear-gradient(135deg, #4A3728, #8B5A2B)',
                                border: 'none',
                                color: 'white',
                                fontWeight: '700',
                                fontSize: '14px',
                                boxShadow: '0 2px 8px rgba(74, 55, 40, 0.35)',
                                transition: 'all 0.3s ease',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            <i className="fas fa-arrow-left me-2"></i>
                            추모관으로 돌아가기
                        </button>

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
                                                    <option value="남">남</option>
                                                    <option value="여">여</option>
                                                </Form.Select>
                                            </Form.Group>

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
                                        </Col>

                                        <Col md={6} className="d-flex flex-column justify-content-center">
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
                                )
                                }

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
                                            AI 기술을 활용하여 고인의 사진들로 감동적인 추모 영상을 제작합니다. 9~15장의 사진과 움직일 사진 1장을 선택하고, 키워드 5개를 입력해주세요.
                                        </div>

                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
    <div className="d-flex justify-content-between align-items-center mb-2">
        <Form.Label className="fw-bold mb-0" style={{ color: '#2C1F14' }}>
            <i className="fas fa-images me-2" style={{ color: '#B8860B' }}></i>슬라이드쇼 사진 (9~15장)
        </Form.Label>
        <Badge 
            bg={slideshowPhotos.length >= 9 && slideshowPhotos.length <= 15 ? "success" : "warning"}
            style={{ fontSize: '0.8rem' }}
        >
            {slideshowPhotos.length}/15장 선택됨
        </Badge>
    </div>
    <Form.Control
        type="file"
        multiple
        accept="image/*"
        onChange={handleSlideshowPhotoChange}
        style={{ 
            borderRadius: '12px', 
            padding: '12px 16px',
            border: '2px solid rgba(184, 134, 11, 0.2)',
            background: 'rgba(255, 255, 255, 0.9)',
            color: '#2C1F14'
        }}
    />
    <Form.Text className="text-muted">
        영상에 포함될 9~15장의 사진을 선택하세요. 
        {slideshowPhotos.length < 9 && <span className="text-warning"> (최소 {9 - slideshowPhotos.length}장 더 필요)</span>}
        {slideshowPhotos.length > 15 && <span className="text-danger"> (최대 15장까지만 가능)</span>}
    </Form.Text>

    {/* 이미지 미리보기 및 관리 */}
    <div className="mt-3 d-flex flex-wrap gap-3">
        {slideshowPhotoURLs.map((url, index) => (
            <div key={index} className="position-relative" style={{ width: '100px', height: '100px' }}>
                <img
                    src={url}
                    alt={`슬라이드쇼 이미지 ${index + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                />
                <div className="position-absolute top-0 end-0 p-1">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files[0]) {
                                handleChangeSlideshowPhoto(index, e.target.files[0]);
                            }
                        }}
                        style={{ display: 'none' }}
                        id={`change-photo-${index}`}
                    />
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => document.getElementById(`change-photo-${index}`).click()}
                        style={{ lineHeight: '1', padding: '0.2rem 0.4rem', marginRight: '4px' }}
                    >
                        변경
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemoveSlideshowPhoto(index)}
                        style={{ lineHeight: '1', padding: '0.2rem 0.4rem' }}
                    >
                        삭제
                    </Button>
                </div>
            </div>
        ))}
    </div>
</Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Label className="fw-bold" style={{ color: '#2C1F14' }}>
                                                        <i className="fas fa-running me-2" style={{ color: '#B8860B' }}></i>움직이는 사진 (1장)
                                                    </Form.Label>
                                                    {animatedPhoto ? (
                                                        <div className="position-relative" style={{ width: '100px', height: '100px' }}>
                                                            <img
                                                                src={URL.createObjectURL(animatedPhoto)}
                                                                alt="움직이는 사진"
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                                                            />
                                                            <div className="position-absolute top-0 end-0 p-1">
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(e) => {
                                                                        if (e.target.files[0]) {
                                                                            const file = e.target.files[0];
                                                                            const MAX_INDIVIDUAL_SIZE = 5 * 1024 * 1024; // 5MB
                                                                            if (file.size > MAX_INDIVIDUAL_SIZE) {
                                                                                alert(`개별 사진의 용량은 5MB를 초과할 수 없습니다. (${file.name})`);
                                                                                return;
                                                                            }
                                                                            setAnimatedPhoto(file);
                                                                        }
                                                                    }}
                                                                    style={{ display: 'none' }}
                                                                    id="change-animated-photo"
                                                                />
                                                                <Button
                                                                    variant="secondary"
                                                                    size="sm"
                                                                    onClick={() => document.getElementById('change-animated-photo').click()}
                                                                    style={{ lineHeight: '1', padding: '0.2rem 0.4rem', marginRight: '4px' }}
                                                                >
                                                                    변경
                                                                </Button>
                                                                <Button
                                                                    variant="danger"
                                                                    size="sm"
                                                                    onClick={() => setAnimatedPhoto(null)}
                                                                    style={{ lineHeight: '1', padding: '0.2rem 0.4rem' }}
                                                                >
                                                                    삭제
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <Form.Control
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => {
                                                                    const file = e.target.files[0];
                                                                    if (file) {
                                                                        const MAX_INDIVIDUAL_SIZE = 5 * 1024 * 1024; // 5MB
                                                                        if (file.size > MAX_INDIVIDUAL_SIZE) {
                                                                            alert(`개별 사진의 용량은 5MB를 초과할 수 없습니다. (${file.name})`);
                                                                            return;
                                                                        }
                                                                        setAnimatedPhoto(file);
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
                                                            <Form.Text className="text-muted">
                                                                영상에서 움직이는 효과를 적용할 사진 1장을 선택하세요.
                                                            </Form.Text>
                                                        </>
                                                    )}
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
                                                    onClick={async () => {
                                                        try {
                                                            await apiService.updateMemorial(id, { videoUrl: generatedVideoUrl });
                                                            alert('영상이 등록되었습니다!');
                                                            if (isUserAccess) {
                                                                navigate(`/user-memorial/${id}`);
                                                            } else {
                                                                navigate(`/memorial/${id}`);
                                                            }
                                                        } catch (error) {
                                                            console.error('Error updating memorial with video:', error);
                                                            alert('영상 등록에 실패했습니다.');
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
                                        <div className="d-flex align-items-center justify-content-between gap-3 mb-2">
                                            {/* Left side: Input and Add button */}
                                            <div className="d-flex align-items-center gap-2" style={{ maxWidth: '750px', flexGrow: 1 }}>
                                                <Form.Control
                                                    type="text"
                                                    value={eulogyKeywordInput}
                                                    onChange={(e) => setEulogyKeywordInput(e.target.value)}
                                                    onKeyDown={handleEulogyKeywordKeyDown}
                                                    placeholder="키워드를 입력하세요"
                                                    style={{
                                                        borderRadius: '12px',
                                                        padding: '12px 16px',
                                                        border: '2px solid rgba(184, 134, 11, 0.2)',
                                                        background: 'rgba(255, 255, 255, 0.9)',
                                                        color: '#2C1F14'
                                                    }}
                                                />
                                                <Button
                                                    onClick={handleAddEulogyKeyword}
                                                    style={{
                                                        borderRadius: '12px',
                                                        background: 'linear-gradient(135deg, #B8860B, #CD853F)',
                                                        border: 'none',
                                                        fontWeight: '600',
                                                        boxShadow: '0 4px 15px rgba(184, 134, 11, 0.3)',
                                                        flexShrink: 0
                                                    }}
                                                >
                                                    추가
                                                </Button>
                                            </div>

                                            {/* Right side: Generate button */}
                                            <Button
                                                type="submit"
                                                disabled={isEulogyLoading}
                                                style={{
                                                    borderRadius: '12px',
                                                    padding: '12px 24px',
                                                    background: isEulogyLoading ? 
                                                        '#6C757D' : 
                                                        'linear-gradient(135deg, #B8860B 0%, #CD853F 100%)',
                                                    border: 'none',
                                                    fontWeight: '600',
                                                    boxShadow: '0 4px 15px rgba(184, 134, 11, 0.3)',
                                                    opacity: isEulogyLoading ? 0.7 : 1,
                                                    flexShrink: 0
                                                }}
                                            >
                                                {isEulogyLoading ? (
                                                    <>
                                                        <div className="spinner-border spinner-border-sm me-2" role="status" style={{ width: '0.8rem', height: '0.8rem' }}>
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                        처리 중...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fas fa-magic me-2"></i>
                                                        추모사 생성
                                                    </>
                                                )}
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
                                                <p className="mt-2" style={{ color: '#2C1F14', fontWeight: '600' }}>
                                                    AI 추모사를 생성 중입니다...
                                                </p>
                                                <p className="mt-1" style={{ color: '#6C757D', fontSize: '0.9rem' }}>
                                                    처리에 최대 1분 정도 소요될 수 있습니다.
                                                </p>
                                            </div>
                                        )}

                                        <div className="mt-4">
                                                <div className="d-flex align-items-baseline mb-2">
                                                    <h5 className="fw-bold mb-0" style={{ color: '#2C1F14' }}>추모사 내용</h5>
                                                    <span className="ms-2" style={{ color: '#6c757d', fontSize: '0.85rem' }}>생성된 추모사를 확인하거나 추모사를 직접 수정할 수 있습니다</span>
                                                </div>
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
                                            </div>
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
                                    {activeTab !== 'memorial' &&
                                    <Button
                                        type="submit"
                                        disabled={isVideoLoading || isEulogyLoading}
                                        style={{
                                            borderRadius: '12px',
                                            padding: '12px 24px',
                                            background: (isVideoLoading || isEulogyLoading) ? 
                                                '#6C757D' : 
                                                'linear-gradient(135deg, #B8860B 0%, #CD853F 100%)',
                                            border: 'none',
                                            fontWeight: '600',
                                            boxShadow: '0 4px 15px rgba(184, 134, 11, 0.3)',
                                            opacity: (isVideoLoading || isEulogyLoading) ? 0.7 : 1
                                        }}
                                    >
                                        {(isVideoLoading || isEulogyLoading) ? (
                                            <>
                                                <div className="spinner-border spinner-border-sm me-2" role="status" style={{ width: '0.8rem', height: '0.8rem' }}>
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                                처리 중...
                                            </>
                                        ) : (
                                            <>
                                                <i className={`fas ${ 
                                                    activeTab === 'basic' ? 'fa-save' :
                                                    activeTab === 'video' ? 'fa-play' :
                                                    'fa-magic'
                                                } me-2`}></i>
                                                {activeTab === 'basic' ? '정보 수정' :
                                                 activeTab === 'video' ? '영상 생성' :
                                                 '추모사 생성'}
                                            </>
                                        )}
                                    </Button>
                                    }
                                    {activeTab === 'memorial' &&
                                        <Button
                                            disabled={isEulogyLoading}
                                            style={{
                                                background: isEulogyLoading ? '#6C757D' : 'linear-gradient(135deg, #B8860B, #CD853F)',
                                                border: 'none',
                                                borderRadius: '12px',
                                                padding: '12px 24px',
                                                fontWeight: '600',
                                                boxShadow: '0 4px 15px rgba(184, 134, 11, 0.3)',
                                                opacity: isEulogyLoading ? 0.7 : 1
                                            }}
                                            onClick={async () => {
                                                if (!generatedEulogy.trim()) {
                                                    alert('추모사를 생성해주세요!');
                                                    return;
                                                }
                                                try {
                                                    await apiService.updateTribute(id, { tribute: generatedEulogy });
                                                    alert('추모사가 등록되었습니다!');
                                                    
                                                    // 추모사 등록 후 MemorialDetail 페이지로 이동하면서 새로고침 유도
                                                    const timestamp = Date.now();
                                                    if (isUserAccess) {
                                                        navigate(`/user-memorial/${id}?updated=${timestamp}`);
                                                    } else {
                                                        navigate(`/memorial/${id}?updated=${timestamp}`);
                                                    }
                                                } catch (error) {
                                                    console.error('Error updating tribute:', error);
                                                    alert('추모사 등록에 실패했습니다.');
                                                }
                                            }}
                                        >
                                            추모사 등록
                                        </Button>
                                    }
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
