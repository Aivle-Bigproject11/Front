import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, ProgressBar } from 'react-bootstrap';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { dummyData } from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Menu2 = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: 실제 API 호출로 교체
    setTimeout(() => {
      setDashboardData(dummyData.dashboard);
      setLoading(false);
    }, 1000);
  }, []);

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '월별 추모관 생성 현황',
      },
    },
  };

  const lineChartData = {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
    datasets: [
      {
        label: '추모관 수',
        data: dummyData.analytics.monthlyMemorials,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const doughnutChartData = {
    labels: ['남성', '여성'],
    datasets: [
      {
        data: [dummyData.analytics.memorialsByGender.male, dummyData.analytics.memorialsByGender.female],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 99, 132, 0.8)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">대시보드 데이터를 불러오는 중...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h1>대시보드</h1>
          <p className="lead">추모관 서비스 현황을 한눈에 확인하세요.</p>
        </Col>
      </Row>

      {/* 통계 카드 */}
      <Row className="mt-4">
        <Col md={3}>
          <Card className="text-white bg-primary">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h4>{dashboardData?.totalMemorials || 0}</h4>
                  <small>총 추모관</small>
                </div>
                <i className="fas fa-heart fa-2x"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-white bg-success">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h4>{dashboardData?.activeMemorials || 0}</h4>
                  <small>활성 추모관</small>
                </div>
                <i className="fas fa-chart-line fa-2x"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-white bg-info">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h4>{dashboardData?.systemUptime || 0}%</h4>
                  <small>시스템 가동률</small>
                </div>
                <i className="fas fa-server fa-2x"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-white bg-warning">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h4>{dashboardData?.notifications || 0}</h4>
                  <small>알림</small>
                </div>
                <i className="fas fa-bell fa-2x"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 차트 섹션 */}
      <Row className="mt-4">
        <Col md={8}>
          <Card>
            <Card.Header>
              <h5>월별 추모관 생성 추이</h5>
            </Card.Header>
            <Card.Body>
              <Line options={lineChartOptions} data={lineChartData} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>
              <h5>성별 분포</h5>
            </Card.Header>
            <Card.Body>
              <Doughnut data={doughnutChartData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 최근 활동 */}
      <Row className="mt-4">
        <Col md={8}>
          <Card>
            <Card.Header>
              <h5>최근 활동</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>시간</th>
                    <th>사용자</th>
                    <th>활동</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData?.recentActivities?.map((activity, index) => (
                    <tr key={index}>
                      <td>{activity.time}</td>
                      <td>{activity.user}</td>
                      <td>{activity.action}</td>
                      <td>
                        <span className={`badge ${
                          activity.status === '성공' || activity.status === '완료' 
                            ? 'bg-success' 
                            : activity.status === '진행중' 
                              ? 'bg-warning' 
                              : 'bg-secondary'
                        }`}>
                          {activity.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>
              <h5>시스템 상태</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <label>CPU 사용률</label>
                <ProgressBar now={45} label="45%" />
              </div>
              <div className="mb-3">
                <label>메모리 사용률</label>
                <ProgressBar now={67} variant="warning" label="67%" />
              </div>
              <div className="mb-3">
                <label>디스크 사용률</label>
                <ProgressBar now={23} variant="success" label="23%" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Menu2;
