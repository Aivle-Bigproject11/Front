import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
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
                                <h2 style={{ color: '#2C1F14', fontWeight: '700' }}>개인정보처리방침</h2>
                                <button className="back-btn" onClick={() => navigate(-1)}>
                                    <ArrowLeft size={16} className="me-2" /> 돌아가기
                                </button>
                            </div>
                            
                            <h5 className="mt-4" style={{color: '#B8860B'}}>제 1조 총칙</h5>
                            <p style={{color: '#4A3728'}}>
                                Golden Gate(이하 "회사")는 귀하의 개인정보를 매우 중요하게 생각하며, 귀하의 개인정보를 가장 효과적이고 안전하게 관리하고 보호하기 위해 최선을 다하고 있습니다. 회사는 개인정보보호법 및 기타 관련 법률을 준수합니다. 또한, 회사는 본 개인정보처리방침을 수립하여 준수하고 있으며, 언제든지 고객이 쉽게 접근할 수 있도록 웹사이트에 공개하고 있습니다.
                            </p>

                            <h5 className="mt-4" style={{color: '#B8860B'}}>제 2조 개인정보의 수집 및 이용 목적, 항목 및 보유 기간</h5>
                            <p style={{color: '#4A3728'}}>
                                회사는 프리미엄 상조 서비스 제공, 고객 관리 및 기타 관련 목적에 필요한 최소한의 개인정보만을 수집합니다.
                                <br/><br/>
                                <strong>가. 필수 수집 및 이용 목적 및 항목</strong><br/>
                                - 수집 이용 목적: 상조 서비스 제공(장례 컨설팅, 추모관 예약, 관련 물품 지원), 고객 관리, 서비스 관련 고지사항 전달<br/>
                                - 개인정보 항목: 성명, 연락처(휴대전화), 이메일, 아이디, 주소, 고인과의 관계, 서비스 이용 기록<br/>
                                - 보유 기간: 서비스 이용 계약 종료 후 5년까지
                            </p>

                            <h5 className="mt-4" style={{color: '#B8860B'}}>제 3조 개인정보 수집 방법</h5>
                            <p style={{color: '#4A3728'}}>
                                회사는 웹사이트의 회원가입 및 서비스 신청 절차를 통해 개인정보를 수집합니다.
                            </p>

                            <h5 className="mt-4" style={{color: '#B8860B'}}>제 4조 개인정보의 보유 및 이용 기간</h5>
                            <p style={{color: '#4A3728'}}>
                                회사는 다음 기간 동안만 귀하의 개인정보를 보유하고 이용합니다.<br/>
                                가. 서비스 이용 계약 기간 동안<br/>
                                나. 법률에 특별 보관 기간이 규정된 경우
                            </p>

                            <h5 className="mt-4" style={{color: '#B8860B'}}>제 5조 개인정보의 파기 절차 및 방법</h5>
                            <p style={{color: '#4A3728'}}>
                                회사는 원칙적으로 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 파기 절차 및 방법은 다음과 같습니다.<br/>
                                - 파기 절차: 수집 및 이용 목적이 달성된 후, 귀하의 개인정보는 별도의 DB(종이의 경우 별도의 파일 캐비닛)로 이전되어 내부 방침 및 기타 관련 법률에 따라 일정 기간 동안 보관된 후 파기됩니다.<br/>
                                - 파기 방법: 종이에 기재되거나 인쇄된 개인정보(서면 문서)는 파쇄 또는 소각 등의 방법으로 파기합니다. DB 등 전자 파일 형태로 저장된 개인정보는 복구가 불가능한 기술적 방법을 사용하여 삭제합니다.
                            </p>

                            <h5 className="mt-4" style={{color: '#B8860B'}}>제 6조 수집한 개인정보의 공유 및 제공</h5>
                            <p style={{color: '#4A3728'}}>
                                회사는 귀하의 사전 동의 없이 귀하의 개인정보를 제3자에게 제공하지 않습니다. 단, 관련 법률에 특별한 규정이 있는 경우는 예외로 합니다.
                            </p>

                            <h5 className="mt-4" style={{color: '#B8860B'}}>제 7조 개인정보 처리의 위탁</h5>
                            <p style={{color: '#4A3728'}}>
                                회사는 서비스 제공을 위한 고객 편의 증진을 위해 개인정보 처리를 외부 전문업체에 위탁할 수 있으며, 수탁자는 관련 법규 및 지침을 준수하고 "위탁계약" 등을 통해 정보를 제공하도록 요구하고 있습니다.
                            </p>

                            <h5 className="mt-4" style={{color: '#B8860B'}}>제 8조 이용자 및 법정대리인의 권리와 그 행사 방법</h5>
                            <p style={{color: '#4A3728'}}>
                                고객은 언제든지 개인정보, 제3자에게 개인정보를 이용 또는 제공한 현황, 개인정보의 수집, 이용, 제공 등에 대한 동의 현황(이하 '개인정보 등')을 열람하거나 제공받을 수 있습니다. 오류가 있는 경우 정정을 요청할 수 있으며, 개인정보의 수집, 이용, 제공에 대한 동의를 철회할 수 있습니다.
                            </p>

                            <h5 className="mt-4" style={{color: '#B8860B'}}>제 9조 자동 수집 장치의 설치·운영 및 거부에 관한 사항</h5>
                            <p style={{color: '#4A3728'}}>
                                회사는 웹사이트 운영에 있어 필요한 경우 고객 정보를 찾고 저장하기 위해 '쿠키'를 사용합니다. 쿠키는 회사의 웹사이트를 운영하는 데 사용되는 서버가 고객의 브라우저로 보내는 아주 작은 텍스트 파일로, 고객의 컴퓨터 하드디스크에 저장됩니다.
                            </p>

                            <h5 className="mt-4" style={{color: '#B8860B'}}>제 10조 개인정보의 기술적·관리적 보호 대책</h5>
                            <p style={{color: '#4A3728'}}>
                                회사는 귀하의 개인정보가 분실, 도난, 유출, 위조, 변조 또는 훼손되지 않도록 안전성 확보를 위해 다음과 같은 기술적·관리적 대책을 강구하고 있습니다.
                            </p>

                            <p className="mt-5 text-muted" style={{fontSize: '12px'}}>
                                본 방침은 2025년 8월 1일부터 시행됩니다.
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

export default PrivacyPolicy;