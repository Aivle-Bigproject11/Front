import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <div className="jumbotron bg-primary text-white p-5 rounded">
            <h1 className="display-4">환영합니다!</h1>
            <p className="lead">
              추모관 서비스 플랫폼입니다. 아래 메뉴를 통해 다양한 기능을 이용하실 수 있습니다.
            </p>
          </div>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={6} lg={3} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <i className="fas fa-file-alt fa-3x text-primary mb-3"></i>
              <Card.Title>장례 서류 작성</Card.Title>
              <Card.Text>
                - 템플릿을 통한 장례 관련 서류 자동 작성
              </Card.Text>
              <Button as={Link} to="/menu1" variant="primary">
                바로가기
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <i className="fas fa-chart-bar fa-3x text-success mb-3"></i>
              <Card.Title>대시보드</Card.Title>
              <Card.Text>
                - 추모관 현황 대시보드<br />
                - 실시간 통계 및 분석
              </Card.Text>
              <Button as={Link} to="/menu2" variant="success">
                바로가기
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <i className="fas fa-chart-line fa-3x text-info mb-3"></i>
              <Card.Title>전환 서비스 추천</Card.Title>
              <Card.Text>
                - 정보 조회<br />
                - 맞춤 전환 서비스 메시지 생성
              </Card.Text>
              <Button as={Link} to="/menu3" variant="info">
                바로가기
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <i className="fas fa-heart fa-3x text-warning mb-3"></i>
              <Card.Title>디지털 추모관</Card.Title>
              <Card.Text>
                - 추모관 관리<br />
                - AI 추모영상/추모사 생성
              </Card.Text>
              <Button as={Link} to="/menu4" variant="warning">
                바로가기
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <Card>
            <Card.Header>
              <h5>최근 공지사항</h5>
            </Card.Header>
            <Card.Body>
              <ul>
                <li>추모관 서비스 시스템이 새롭게 업데이트되었습니다.</li>
                <li>AI 기반 추모사 생성 기능이 추가되었습니다.</li>
                <li>디지털 추모관 템플릿이 다양화되었습니다.</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
