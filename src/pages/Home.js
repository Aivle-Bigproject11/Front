import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import menu01 from '../assets/images/menu01.png';
import menu02 from '../assets/images/menu02.png';
import menu03 from '../assets/images/menu03.png';
import menu04 from '../assets/images/menu04.png';
import menu05 from '../assets/images/menu05.png';

const Home = () => {
  const [animateCard, setAnimateCard] = useState(false);

  useEffect(() => {
    setAnimateCard(true);
  }, []);

  return (
    <div className="page-wrapper" style={{
      '--navbar-height': '62px',
      height: 'calc(100vh - var(--navbar-height))',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '20px',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div className={`dashboard-container ${animateCard ? 'animate-in' : ''}`} style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '1600px',
        height: '100%',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        background: 'rgba(255, 255, 255, 0.7)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        borderRadius: '20px',
        transform: animateCard ? 'translateY(0)' : 'translateY(30px)',
        opacity: animateCard ? 1 : 0,
        transition: 'all 0.6s ease-out',
        padding: '20px',
        gap: '20px',
        justifyContent: 'center',
      }}>
        {/* Jumbotron content as a header */}
        <div className="jumbotron bg-primary text-white p-4 rounded mb-4" style={{ flexShrink: 0 }}>
          <h1 className="display-5">환영합니다!</h1>
          <p className="lead">
            추모관 서비스 플랫폼입니다. 아래 메뉴를 통해 다양한 기능을 이용하실 수 있습니다.
          </p>
        </div>

        {/* Menu Cards - arranged in a flex row, wrapping */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          justifyContent: 'center',
          flexGrow: 1,
          alignItems: 'center',
        }}>
          {/* Card 1: 장례 서류 작성 */}
          <Card style={{ flex: '1 1 calc(20% - 16px)', height: '350px' }}>
            <Card.Body className="text-center d-flex flex-column justify-content-between align-items-center p-3">
              <div className="d-flex align-items-center justify-content-center mb-3" style={{ height: '80px' }}>
                <img src={menu01} alt="장례 서류 작성" style={{ width: '60px', height: '60px', marginRight: '10px' }} />
                <i className="fas fa-file-alt fa-2x text-primary"></i>
              </div>
              <div className="flex-grow-1 d-flex flex-column justify-content-center">
                <Card.Title className="mb-3">장례 서류 작성</Card.Title>
                <Card.Text className="mb-3">
                  - 템플릿을 통한 장례 관련 서류 자동 작성
                </Card.Text>
              </div>
              <Button as={Link} to="/menu1" variant="primary" className="w-75">
                바로가기
              </Button>
            </Card.Body>
          </Card>

          {/* Card 2: 대시보드 */}
          <Card style={{ flex: '1 1 calc(20% - 16px)', height: '350px' }}>
            <Card.Body className="text-center d-flex flex-column justify-content-between align-items-center p-3">
              <div className="d-flex align-items-center justify-content-center mb-3" style={{ height: '80px' }}>
                <img src={menu02} alt="대시보드" style={{ width: '60px', height: '60px', marginRight: '10px' }} />
                <i className="fas fa-chart-bar fa-2x text-success"></i>
              </div>
              <div className="flex-grow-1 d-flex flex-column justify-content-center">
                <Card.Title className="mb-3">대시보드</Card.Title>
                <Card.Text className="mb-3">
                  - 추모관 현황 대시보드<br />
                  - 실시간 통계 및 분석
                </Card.Text>
              </div>
              <Button as={Link} to="/menu2" variant="success" className="w-75">
                바로가기
              </Button>
            </Card.Body>
          </Card>

          {/* Card 3: 전환 서비스 추천 */}
          <Card style={{ flex: '1 1 calc(20% - 16px)', height: '350px' }}>
            <Card.Body className="text-center d-flex flex-column justify-content-between align-items-center p-3">
              <div className="d-flex align-items-center justify-content-center mb-3" style={{ height: '80px' }}>
                <img src={menu03} alt="전환 서비스 추천" style={{ width: '60px', height: '60px', marginRight: '10px' }} />
                <i className="fas fa-chart-line fa-2x text-info"></i>
              </div>
              <div className="flex-grow-1 d-flex flex-column justify-content-center">
                <Card.Title className="mb-3">전환 서비스 추천</Card.Title>
                <Card.Text className="mb-3">
                  - 정보 조회<br />
                  - 맞춤 전환 서비스 메시지 생성
                </Card.Text>
              </div>
              <Button as={Link} to="/menu3" variant="info" className="w-75">
                바로가기
              </Button>
            </Card.Body>
          </Card>

          {/* Card 4: 디지털 추모관 */}
          <Card style={{ flex: '1 1 calc(20% - 16px)', height: '350px' }}>
            <Card.Body className="text-center d-flex flex-column justify-content-between align-items-center p-3">
              <div className="d-flex align-items-center justify-content-center mb-3" style={{ height: '80px' }}>
                <img src={menu04} alt="디지털 추모관" style={{ width: '60px', height: '60px', marginRight: '10px' }} />
                <i className="fas fa-video fa-2x text-warning"></i>
              </div>
              <div className="flex-grow-1 d-flex flex-column justify-content-center">
                <Card.Title className="mb-3">디지털 추모관</Card.Title>
                <Card.Text className="mb-3">
                  - 추모관 관리<br />
                  - AI 추모영상/추모사 생성
                </Card.Text>
              </div>
              <Button as={Link} to="/menu4" variant="warning" className="w-75">
                바로가기
              </Button>
            </Card.Body>
          </Card>

          {/* Card 5: 고객 관리 */}
          <Card style={{ flex: '1 1 calc(20% - 16px)', height: '350px' }}>
            <Card.Body className="text-center d-flex flex-column justify-content-between align-items-center p-3">
              <div className="d-flex align-items-center justify-content-center mb-3" style={{ height: '80px' }}>
                <img src={menu05} alt="고객 관리" style={{ width: '60px', height: '60px', marginRight: '10px' }} />
                <i className="fas fa-users-cog fa-2x text-danger"></i>
              </div>
              <div className="flex-grow-1 d-flex flex-column justify-content-center">
                <Card.Title className="mb-3">고객 관리</Card.Title>
                <Card.Text className="mb-3">
                  - 고객 정보 조회<br />
                  - 고객 문의 관리
                </Card.Text>
              </div>
              <Button as={Link} to="/menu5" variant="danger" className="w-75">
                바로가기
              </Button>
            </Card.Body>
          </Card>
        </div>

        {/* Recent Announcements */}
        <div style={{ flexShrink: 0, marginTop: '20px' }}>
          <Card>
            <Card.Header>
              <h5>Golden Gate Frontend Team</h5>
            </Card.Header>
            <Card.Body>
              <ul>
                <li>김시훈</li>
                <li>양성현</li>
                <li>박수연</li>
              </ul>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Global Styles from Menu2.js */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-in {
          animation: fadeInUp 0.6s ease-out;
        }

        /* Scrollbar styles for the menu cards container */
        .dashboard-container > div:nth-child(2)::-webkit-scrollbar {
          width: 6px;
        }
        .dashboard-container > div:nth-child(2)::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
        .dashboard-container > div:nth-child(2)::-webkit-scrollbar-thumb {
          background-color: rgba(108, 117, 125, 0.5);
          border-radius: 10px;
        }

        @media (max-width: 1200px) {
          .page-wrapper {
            height: auto;
            min-height: calc(100vh - var(--navbar-height));
          }
          .dashboard-container {
            flex-direction: column;
            height: auto;
          }
          /* Adjust card flex basis for smaller screens if needed */
          .dashboard-container > div:nth-child(2) > .card {
            flex: 1 1 100% !important;
            max-width: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
