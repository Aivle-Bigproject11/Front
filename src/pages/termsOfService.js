import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className="page-wrapper" style={{
                '--navbar-height': '62px',
                minHeight: 'calc(100vh - var(--navbar-height))',
                background: 'linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%)',
                padding: '40px 20px',
                boxSizing: 'border-box',
            }}>
                <Container style={{ maxWidth: '800px' }}>
                    <Card style={{
                        background: 'rgba(255, 251, 235, 0.98)',
                        borderRadius: '20px',
                        boxShadow: '0 20px 60px rgba(44, 31, 20, 0.4)',
                        border: '2px solid rgba(184, 134, 11, 0.35)',
                        padding: '30px 40px'
                    }}>
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h2 style={{ color: '#2C1F14', fontWeight: '700' }}>이용약관</h2>
                                <button className="back-btn" onClick={() => navigate(-1)}>
                                    <ArrowLeft size={16} className="me-2" /> 돌아가기
                                </button>
                            </div>
                            
                            <h5 className="mt-4" style={{color: '#B8860B'}}>제 1 장 총 칙</h5>
                            <h6 className="mt-3" style={{color: '#4A3728'}}>제 1 조 (목적)</h6>
                            <p style={{color: '#4A3728'}}>
                                본 약관은 Lumora(이하 "회사")가 제공하는 프리미엄 상조 서비스(이하 "서비스")를 이용함에 있어 회사와 회원의 권리, 의무 및 책임사항, 이용조건 및 절차 등 기본적인 사항을 규정함을 목적으로 합니다.
                            </p>

                            <h6 className="mt-3" style={{color: '#4A3728'}}>제 2 조 (약관의 효력 및 변경)</h6>
                            <p style={{color: '#4A3728'}}>
                                1. 본 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그 효력을 발생합니다.<br/>
                                2. 본 약관의 내용은 회사 웹사이트에 게시하거나 기타의 방법으로 회원에게 공지하고, 이에 동의한 회원이 서비스에 가입함으로써 효력이 발생합니다.
                            </p>

                            <h6 className="mt-3" style={{color: '#4A3728'}}>제 3 조 (약관의 해석 및 약관 외 준칙)</h6>
                            <p style={{color: '#4A3728'}}>
                                1. "회사"는 개별 서비스에 대하여 별도의 이용약관 및 운영정책을 둘 수 있으며, 그 내용이 본 약관과 상충할 경우에는 각 개별 서비스의 이용약관(이하 "개별약관") 또는 운영정책이 우선하여 적용됩니다.<br/>
                                2. 본 약관에 명시되지 않은 사항은 개별약관, 운영정책, 관련 법령, 상업 관례에 따릅니다.
                            </p>

                            <h6 className="mt-3" style={{color: '#4A3728'}}>제 4 조 (용어의 정의)</h6>
                            <p style={{color: '#4A3728'}}>
                                본 약관에서 사용하는 용어의 정의는 다음과 같습니다.<br/>
                                1. "회원"이라 함은 회사가 제공하는 사이트에 접속하여 본 약관 및 개인정보처리방침에 동의하고 아이디와 비밀번호를 발급받아 회사가 제공하는 서비스를 이용하는 자를 말합니다.<br/>
                                2. "서비스"라 함은 회사가 제공하는 온라인 추모관, 장례 지원 등 모든 관련 서비스를 의미합니다.
                            </p>

                            <h5 className="mt-4" style={{color: '#B8860B'}}>제 2 장 서비스 이용 계약</h5>
                            <h6 className="mt-3" style={{color: '#4A3728'}}>제 5 조 (서비스 이용계약의 성립, 이용신청 및 승낙)</h6>
                            <p style={{color: '#4A3728'}}>
                                1. 서비스 이용계약은 회원이 되고자 하는 자가 약관에 동의하고, 회원가입 신청을 한 후 회사가 이를 승낙함으로써 성립합니다.<br/>
                                2. 회원이 되고자 하는 자는 회사에서 제공하는 회원가입 신청 양식에 따라 필요한 정보를 기입하여야 합니다.
                            </p>

                            <h6 className="mt-3" style={{color: '#4A3728'}}>제 6 조 (이용신청의 승낙 제한)</h6>
                            <p style={{color: '#4A3728'}}>
                                1. 회사는 다음 각 호의 어느 하나에 해당하는 이용신청에 대하여는 승낙을 제한할 수 있으며, 그 사유가 해소될 때까지 승낙을 유보하거나 승낙 후에도 이용계약을 해지할 수 있습니다.<br/>
                                  - 기술적인 문제가 있거나 서비스 관련 시설 용량이 부족한 경우<br/>
                                  - 신청자가 이전에 본 약관에 따라 회원 자격을 상실한 경우
                            </p>

                            <h5 className="mt-4" style={{color: '#B8860B'}}>제 3 장 서비스의 이용</h5>
                            <h6 className="mt-3" style={{color: '#4A3728'}}>제 7 조 (서비스 이용의 개시)</h6>
                            <p style={{color: '#4A3728'}}>
                                1. 회사는 회원의 이용신청을 승낙한 때부터 서비스를 개시합니다.<br/>
                                2. 회사의 업무상 또는 기술상의 장애로 인하여 서비스를 개시하지 못하는 경우에는 사이트에 공지하거나 회원에게 통지합니다.
                            </p>

                            <h6 className="mt-3" style={{color: '#4A3728'}}>제 8 조 (서비스 이용 시간)</h6>
                            <p style={{color: '#4A3728'}}>
                                1. 회사는 연중무휴 1일 24시간 서비스 제공을 위해 최선을 다합니다. 다만, 회사의 업무상 또는 기술상의 이유로 서비스가 일시 중지될 수 있으며, 운영상의 목적으로 회사가 정한 기간에는 서비스가 일시 중지될 수 있습니다.
                            </p>

                            <h5 className="mt-4" style={{color: '#B8860B'}}>제 4 장 계약 당사자의 의무</h5>
                            <h6 className="mt-3" style={{color: '#4A3728'}}>제 9 조 (회사의 의무)</h6>
                            <p style={{color: '#4A3728'}}>
                                1. 회사는 관련 법령과 본 약관에서 금지하는 행위 및 미풍양속에 반하는 행위를 하지 않으며, 계속적이고 안정적으로 서비스를 제공하기 위해 최선을 다하여 노력합니다.<br/>
                                2. 회사는 회원이 안전하게 서비스를 이용할 수 있도록 개인정보 보호를 위한 보안 시스템을 갖추어야 하며, 개인정보처리방침을 공시하고 준수합니다.
                            </p>

                            <h6 className="mt-3" style={{color: '#4A3728'}}>제 10 조 (회원의 의무)</h6>
                            <p style={{color: '#4A3728'}}>
                                1. 회원은 관계 법령, 본 약관의 규정, 이용안내 및 서비스상에 공지한 주의사항, 회사가 통지하는 사항 등을 준수하여야 하며, 기타 회사의 업무에 방해되는 행위를 하여서는 안 됩니다.
                            </p>

                            <p className="mt-5 text-muted" style={{fontSize: '12px'}}>
                                본 약관은 2025년 8월 22일부터 시행됩니다.
                            </p>
                        </Card.Body>
                    </Card>
                </Container>
            </div>
            <style>{`
                .back-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 20px;
                    background: linear-gradient(135deg, #4A3728, #8B5A2B);
                    border: none;
                    color: white;
                    font-weight: 700;
                    font-size: 14px;
                    box-shadow: 0 2px 8px rgba(74, 55, 40, 0.35);
                    transition: all 0.3s ease;
                    border-radius: 12px;
                    cursor: pointer;
                }
                .back-btn:hover {
                    background: linear-gradient(135deg, #3c2d20, #7a4e24);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(74, 55, 40, 0.45);
                }
            `}</style>
        </>
    );
};

export default TermsOfService;
