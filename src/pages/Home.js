import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import menu01 from '../assets/images/menu01.png';
import menu02 from '../assets/images/menu02.png';
import menu03 from '../assets/images/menu03.png';
import menu04 from '../assets/images/menu04.png';
import menu05 from '../assets/images/menu05.png';
import logoIcon from '../assets/logo/icon01.png';

const Home = () => {
  const [animateCard, setAnimateCard] = useState(false);

  useEffect(() => {
    setAnimateCard(true);
  }, []);

  const cardStyle = {
    flex: '1 1 calc(20% - 20px)',
    minWidth: '280px',
    height: '350px',
    background: 'rgba(255, 251, 235, 0.95)',
    border: '1px solid rgba(184, 134, 11, 0.35)',
    boxShadow: '0 8px 30px rgba(44, 31, 20, 0.15)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
  };

  const buttonBaseStyle = {
    color: '#FFFFFF',
    border: 'none',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
  }

  const redButtonStyle = { ...buttonBaseStyle, background: 'linear-gradient(135deg, #C62828, #A91E1E)' };
  const orangeButtonStyle = { ...buttonBaseStyle, background: 'linear-gradient(135deg, #D58512, #B5651D)' };
  const greenButtonStyle = { ...buttonBaseStyle, background: 'linear-gradient(135deg, #2E7D32, #1B5E20)' };
  const blueButtonStyle = { ...buttonBaseStyle, background: 'linear-gradient(135deg, #1565C0, #0D47A1)' };
  const purpleButtonStyle = { ...buttonBaseStyle, background: 'linear-gradient(135deg, #6A1B9A, #4A148C)' };


  return (
    <div className="page-wrapper" style={{
      '--navbar-height': '62px',
      height: 'calc(100vh - var(--navbar-height))',
      background: 'linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%)',
      padding: '20px',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden', // 스크롤 숨김
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23B8860B" fill-opacity="0.1"%3E%3Cpath d="M40 40L20 20v40h40V20L40 40zm0-20L60 0H20l20 20zm0 20L20 60h40L40 40z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
        opacity: 0.7
      }}></div>

      <div className={`dashboard-container ${animateCard ? 'animate-in' : ''}`} style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '1600px',
        height: '100%', // 전체 높이 사용
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        background: 'rgba(255, 251, 235, 0.85)',
        boxShadow: '0 12px 40px rgba(44, 31, 20, 0.25)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(184, 134, 11, 0.25)',
        borderRadius: '20px',
        opacity: animateCard ? 1 : 0,
        transition: 'opacity 0.6s ease-out',
        padding: '30px',
        gap: '20px',
      }}>
        <div className="jumbotron p-4 rounded mb-4" style={{
          flexShrink: 0,
          background: 'linear-gradient(135deg, #3c2d20, #7a4e24)',
          color: '#FFFBEB',
          textShadow: '1px 1px 2px rgba(44, 31, 20, 0.5)',
          marginTop: '20px'
        }}>
          <h1 className="display-5" style={{ fontWeight: '600' }}>환영합니다!</h1>
          <p className="lead" style={{ fontWeight: '400' }}>
            Golden Gate 상조회사 서비스 플랫폼입니다. 아래 메뉴를 통해 다양한 기능을 이용하실 수 있습니다.
          </p>
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          justifyContent: 'center',
          flexGrow: 1,
          alignItems: 'center', // 카드를 중앙에 정렬
        }}>
          <Card style={cardStyle} className="menu-card">
            <Card.Body className="text-center d-flex flex-column justify-content-around align-items-center p-4">
              <img src={menu01} alt="장례 서류 작성" style={{ width: '90px', height: '90px' }} />
              <div>
                <Card.Title className="mb-3" style={{ color: '#2C1F14', fontWeight: '700', fontSize: '1.25rem' }}>장례 서류 작성</Card.Title>
                <Card.Text style={{ color: '#4A3728', fontSize: '0.9rem' }}>
                  - 장례 관련 서류 자동 작성
                </Card.Text>
              </div>
              <Button as={Link} to="/menu1" style={redButtonStyle} className="w-75 service-button">
                바로가기
              </Button>
            </Card.Body>
          </Card>

          <Card style={cardStyle} className="menu-card">
            <Card.Body className="text-center d-flex flex-column justify-content-around align-items-center p-4">
              <img src={menu02} alt="AI 인력배치" style={{ width: '90px', height: '90px' }} />
              <div>
                <Card.Title className="mb-3" style={{ color: '#2C1F14', fontWeight: '700', fontSize: '1.25rem' }}>AI 인력배치</Card.Title>
                <Card.Text style={{ color: '#4A3728', fontSize: '0.9rem' }}>
                  - 실시간 통계 및 분석<br />
                  - 사망자 현황 및 예측 대시보드
                </Card.Text>
              </div>
              <Button as={Link} to="/menu2N" style={orangeButtonStyle} className="w-75 service-button">
                바로가기
              </Button>
            </Card.Body>
          </Card>

          <Card style={cardStyle} className="menu-card">
            <Card.Body className="text-center d-flex flex-column justify-content-around align-items-center p-4">
              <img src={menu03} alt="전환 서비스 추천" style={{ width: '90px', height: '90px' }} />
              <div>
                <Card.Title className="mb-3" style={{ color: '#2C1F14', fontWeight: '700', fontSize: '1.25rem' }}>전환 서비스 추천</Card.Title>
                <Card.Text style={{ color: '#4A3728', fontSize: '0.9rem' }}>
                  - 맞춤 전환 서비스 메시지 생성<br />
                  - 고객 메시지 발송 기록 조회
                </Card.Text>
              </div>
              <Button as={Link} to="/menu3" style={greenButtonStyle} className="w-75 service-button">
                바로가기
              </Button>
            </Card.Body>
          </Card>

          <Card style={cardStyle} className="menu-card">
            <Card.Body className="text-center d-flex flex-column justify-content-around align-items-center p-4">
              <img src={menu04} alt="디지털 추모관" style={{ width: '90px', height: '90px' }} />
              <div>
                <Card.Title className="mb-3" style={{ color: '#2C1F14', fontWeight: '700', fontSize: '1.25rem' }}>디지털 추모관</Card.Title>
                <Card.Text style={{ color: '#4A3728', fontSize: '0.9rem' }}>
                  - 추모관 관리<br />
                  - AI 추모영상/추모사 생성
                </Card.Text>
              </div>
              <Button as={Link} to="/menu4" style={blueButtonStyle} className="w-75 service-button">
                바로가기
              </Button>
            </Card.Body>
          </Card>

          <Card style={cardStyle} className="menu-card">
            <Card.Body className="text-center d-flex flex-column justify-content-around align-items-center p-4">
              <img src={menu05} alt="고객 관리" style={{ width: '90px', height: '90px' }} />
              <div>
                <Card.Title className="mb-3" style={{ color: '#2C1F14', fontWeight: '700', fontSize: '1.25rem' }}>고객 관리</Card.Title>
                <Card.Text style={{ color: '#4A3728', fontSize: '0.9rem' }}>
                  - 고객 정보 조회<br />
                  - 고객 문의 관리
                </Card.Text>
              </div>
              <Button as={Link} to="/menu5" style={purpleButtonStyle} className="w-75 service-button">
                바로가기
              </Button>
            </Card.Body>
          </Card>
        </div>

        <div style={{ flexShrink: 0, marginTop: 'auto', paddingTop: '20px' }}>
          <hr style={{ borderTop: '1px solid rgba(184, 134, 11, 0.2)' }} />
          <div className="text-center py-3 d-flex align-items-center justify-content-center" style={{ gap: '15px' }}>
            <img src={logoIcon} alt="Golden Gate Logo" style={{ height: '24px' }} />
            <p style={{ color: '#4A3728', margin: 0, fontWeight: '500', fontSize: '1rem' }}>
              <strong>Golden Gate</strong>, 전통과 품격으로 마지막 순간까지 함께합니다
            </p>
          </div>
          <hr style={{ borderTop: '1px solid rgba(184, 134, 11, 0.2)' }} />
          <div className="text-center py-2">
            <a href="/privacyPolicy" style={{ color: '#6B4423', textDecoration: 'none', fontSize: '12px', fontWeight: '500' }}>개인정보처리방침</a>
            <span style={{ margin: '0 10px', color: '#6B4423', fontSize: '12px' }}>|</span>
            <a href="/termsOfService" style={{ color: '#6B4423', textDecoration: 'none', fontSize: '12px', fontWeight: '500' }}>이용약관</a>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-in {
          animation: fadeIn 0.6s ease-out;
        }

        .menu-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 40px rgba(44, 31, 20, 0.2);
        }

        .service-button:hover {
            filter: brightness(1.1);
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .dashboard-container::-webkit-scrollbar {
            width: 6px;
        }
        .dashboard-container::-webkit-scrollbar-track {
            background: rgba(44, 31, 20, 0.08);
            border-radius: 10px;
        }
        .dashboard-container::-webkit-scrollbar-thumb {
            background-color: rgba(184, 134, 11, 0.6);
            border-radius: 10px;
            background-clip: content-box;
        }
        .dashboard-container::-webkit-scrollbar-thumb:hover {
            background-color: rgba(184, 134, 11, 0.8);
        }


        @media (max-width: 1200px) {
          .page-wrapper {
            height: auto !important;
            min-height: calc(100vh - var(--navbar-height));
            overflow: auto !important;
          }
          .dashboard-container {
            height: auto !important;
          }
          .dashboard-container > div:nth-child(2) > .card {
            flex: 1 1 45% !important;
            max-width: none !important;
          }
        }

        @media (max-width: 768px) {
            .dashboard-container > div:nth-child(2) > .card {
                flex: 1 1 100% !important;
            }
        }
      `}</style>
    </div>
  );
};

export default Home;
