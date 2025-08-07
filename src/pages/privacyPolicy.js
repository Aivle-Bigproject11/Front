import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
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
                            
                            <p style={{color: '#4A3728'}}>
                                Golden Gate 서비스(이하 '회사')는 정보통신망 이용촉진 및 정보보호 등에 관한 법률, 개인정보보호법 등 관련 법령상의 개인정보보호 규정을 준수하며, 관련 법령에 의거한 개인정보처리방침을 정하여 이용자 권익 보호에 최선을 다하고 있습니다.
                            </p>

                            <h5 className="mt-4" style={{color: '#B8860B'}}>1. 수집하는 개인정보 항목</h5>
                            <p style={{color: '#4A3728'}}>
                                회사는 회원가입, 원활한 고객상담, 각종 서비스의 제공을 위해 아래와 같은 최소한의 개인정보를 필수항목으로 수집하고 있습니다.
                                <br/>- 필수항목: 이름, 아이디, 비밀번호, 연락처, 이메일
                                <br/>- 서비스 이용 과정에서 생성 정보: 서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보
                            </p>

                            <h5 className="mt-4" style={{color: '#B8860B'}}>2. 개인정보의 수집 및 이용목적</h5>
                            <p style={{color: '#4A3728'}}>
                                회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.
                                <br/>- 서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금 정산
                                <br/>- 회원 관리: 회원제 서비스 이용에 따른 본인확인, 개인 식별, 불량회원의 부정 이용 방지와 비인가 사용 방지, 가입 의사 확인
                                <br/>- 마케팅 및 광고에 활용: 신규 서비스 개발 및 맞춤 서비스 제공, 이벤트 등 광고성 정보 전달
                            </p>

                            <h5 className="mt-4" style={{color: '#B8860B'}}>3. 개인정보의 보유 및 이용기간</h5>
                            <p style={{color: '#4A3728'}}>
                                이용자의 개인정보는 원칙적으로 개인정보의 수집 및 이용목적이 달성되면 지체 없이 파기합니다. 단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다.
                                <br/>- 계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래 등에서의 소비자보호에 관한 법률)
                                <br/>- 대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래 등에서의 소비자보호에 관한 법률)
                                <br/>- 소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래 등에서의 소비자보호에 관한 법률)
                            </p>

                            <h5 className="mt-4" style={{color: '#B8860B'}}>4. 개인정보의 파기절차 및 방법</h5>
                            <p style={{color: '#4A3728'}}>
                                회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 파기절차 및 방법은 다음과 같습니다.
                                <br/>- 파기절차: 회원님이 회원가입 등을 위해 입력하신 정보는 목적이 달성된 후 별도의 DB로 옮겨져(종이의 경우 별도의 서류함) 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라(보유 및 이용기간 참조) 일정 기간 저장된 후 파기됩니다.
                                <br/>- 파기방법: 전자적 파일형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.
                            </p>

                            <p className="mt-5 text-muted" style={{fontSize: '12px'}}>
                                본 방침은 2025년 8월 7일부터 시행됩니다.
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