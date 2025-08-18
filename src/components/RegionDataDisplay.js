import React, { useState, useEffect } from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { apiService } from '../services/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// 데이터 처리 로직 시작
const nationalRegionStatus = [
  { level: '고위험 지역', color: 'rgba(183, 28, 28, 0.2)', regions: ['서울', '경기', '부산'] },
  { level: '주의 지역', color: 'rgba(251, 192, 45, 0.2)', regions: ['대구', '인천', '충남'] },
  { level: '안정 지역', color: 'rgba(51, 105, 30, 0.2)', regions: ['광주', '울산', '세종'] },
];

const RegionDataDisplay = ({ region }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useBackendData, setUseBackendData] = useState(false); // 기본값을 false로 변경
  const [backendAvailable, setBackendAvailable] = useState(false);

  useEffect(() => {
    // 백엔드 가용성 체크
    const checkBackendAvailability = async () => {
      try {
        // 간단한 헬스체크 요청
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/by-date`, {
          method: 'HEAD', // HEAD 요청으로 서버 응답만 확인
          timeout: 3000 // 3초 타임아웃
        });
        
        if (response.ok || response.status < 500) {
          setBackendAvailable(true);
          console.log('백엔드 서버 가용 확인됨');
        } else {
          console.log('백엔드 서버 응답 오류:', response.status);
        }
      } catch (error) {
        console.log('백엔드 서버 연결 불가:', error.message);
        setBackendAvailable(false);
      }
    };

    checkBackendAvailability();

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (useBackendData && backendAvailable) {
          // 백엔드 API 사용
          const currentDate = new Date().toISOString().slice(0, 7); // YYYY-MM
          
          let regionData;
          if (region === '전체') {
            console.log('전체 지역 데이터 요청 중...');
            regionData = await apiService.getDashboardByDate(currentDate);
          } else {
            console.log(`${region} 지역 데이터 요청 중...`);
            regionData = await apiService.getDashboardByRegion(region);
          }

          console.log('백엔드 응답 데이터:', regionData);

          // 백엔드 데이터를 기존 형식으로 변환
          const processedData = formatBackendData(regionData, region);
          setDashboardData(processedData);
        } else {
          // CSV 데이터 사용
          loadCsvData();
        }
      } catch (error) {
        console.error('백엔드 데이터 로딩 실패:', error);
        
        // 네트워크 에러인지 확인
        if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
          setError('백엔드 서버에 연결할 수 없습니다. CSV 데이터를 사용합니다.');
        } else {
          setError(`백엔드 API 오류: ${error.response?.status || 'Unknown'}. CSV 데이터를 사용합니다.`);
        }
        
        setUseBackendData(false);
        
        // 폴백: CSV 데이터 사용
        loadCsvData();
      } finally {
        setLoading(false);
      }
    };

    const loadCsvData = async () => {
      // 기존 CSV 로딩 로직 (폴백용)
      try {
        console.log('CSV 데이터 로딩 중...');
        const [csvResponse, jsonResponse] = await Promise.all([
          fetch('/15년치_월별.csv'),
          fetch('/monthly_predictions.json')
        ]);
        
        if (!csvResponse.ok || !jsonResponse.ok) {
          throw new Error('CSV 또는 JSON 파일을 불러올 수 없습니다.');
        }

        const csvText = await csvResponse.text();
        const predictionJson = await jsonResponse.json();

        // CSV 파싱은 간단한 방법으로 변경
        const lines = csvText.split('\n');
        const data = lines.slice(1)
          .filter(line => line.trim())
          .map(line => {
            const values = line.split(',');
            return {
              '연월': values[0]?.trim(),
              '사망자수': parseInt(values[1]?.replace(/[,'"]/g, '')) || 0
            };
          });

        const processedData = formatCsvData(data, predictionJson, region);
        setDashboardData(processedData);
        
      } catch (fallbackError) {
        console.error('CSV 데이터 로딩도 실패:', fallbackError);
        setError('모든 데이터 소스를 불러올 수 없습니다.');
      }
    };

    // 초기 로딩 시에는 항상 CSV부터 시작
    loadDashboardData();
  }, [region, useBackendData, backendAvailable]);

  // 백엔드 데이터를 UI에 맞게 변환
  const formatBackendData = (data, selectedRegion) => {
    if (!data || !Array.isArray(data)) {
      console.warn('백엔드 데이터가 배열이 아닙니다:', data);
      return getEmptyData();
    }

    if (data.length === 0) {
      console.warn('백엔드에서 빈 데이터를 받았습니다');
      return getEmptyData();
    }

    // 날짜순으로 정렬
    const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // 선택된 지역에 맞게 필터링 (전체가 아닌 경우)
    const filteredData = selectedRegion === '전체' 
      ? sortedData 
      : sortedData.filter(item => item.region === selectedRegion);

    // 전체 지역인 경우 지역별로 그룹화해서 합계 계산
    let chartData;
    if (selectedRegion === '전체') {
      const groupedByDate = {};
      sortedData.forEach(item => {
        if (!groupedByDate[item.date]) {
          groupedByDate[item.date] = 0;
        }
        groupedByDate[item.date] += item.deaths;
      });
      
      chartData = Object.entries(groupedByDate)
        .sort(([a], [b]) => new Date(a) - new Date(b))
        .map(([date, deaths]) => ({ date, deaths }));
    } else {
      chartData = filteredData;
    }
    
    return {
      regionStatus: nationalRegionStatus,
      charts: {
        longTermTrend: {
          labels: chartData.map(item => item.date),
          data: chartData.map(item => item.deaths),
        },
        predictionTrend: {
          labels: chartData.map(item => item.date),
          actualData: chartData.map(item => item.deaths),
          predictedData: new Array(chartData.length).fill(null), // 예측 데이터는 별도 API에서 처리
        },
      },
      monthlyPredictions: chartData.map((item, index) => ({
        month: item.date,
        count: item.deaths.toLocaleString('ko-KR') + '명',
        vsLastYear: index >= 12 ? calculateChange(item.deaths, chartData[index - 12]?.deaths) : 'N/A',
        vsLastMonth: index > 0 ? calculateChange(item.deaths, chartData[index - 1]?.deaths) : 'N/A',
      })),
      predictionSummary: {
        avg: chartData.length > 0 ? Math.round(chartData.reduce((sum, item) => sum + item.deaths, 0) / chartData.length).toLocaleString('ko-KR') + '명' : '0명',
        max: chartData.length > 0 ? Math.max(...chartData.map(item => item.deaths)).toLocaleString('ko-KR') + '명' : '0명',
        min: chartData.length > 0 ? Math.min(...chartData.map(item => item.deaths)).toLocaleString('ko-KR') + '명' : '0명',
        totalNext12: chartData.reduce((sum, item) => sum + item.deaths, 0).toLocaleString('ko-KR') + '명',
      },
    };
  };

  // CSV 데이터를 UI에 맞게 변환 (기존 로직 유지)
  const formatCsvData = (csvData, predictionJson, selectedRegion) => {
    const multipliers = { 
      '전체': 1, '서울': 0.21, '경기': 0.26, '부산': 0.07, 
      '대구': 0.05, '인천': 0.06, '충남': 0.04, '광주': 0.03, 
      '울산': 0.02, '세종': 0.01 
    };
    
    const multiplier = multipliers[selectedRegion] || 1;
    
    return {
      regionStatus: nationalRegionStatus,
      charts: {
        longTermTrend: {
          labels: csvData.map(row => row['연월']),
          data: csvData.map(row => Math.round(row['사망자수'] * multiplier)),
        },
        predictionTrend: {
          labels: [...csvData.slice(-12).map(row => row['연월']), ...predictionJson.predictions.map(p => p.date)],
          actualData: [...csvData.slice(-12).map(row => Math.round(row['사망자수'] * multiplier)), ...new Array(predictionJson.predictions.length).fill(null)],
          predictedData: [...new Array(csvData.slice(-12).length - 1).fill(null), csvData[csvData.length - 1]['사망자수'] * multiplier, ...predictionJson.predictions.map(p => Math.round(p.predicted_deaths * multiplier))],
        },
      },
      monthlyPredictions: predictionJson.predictions.map((item, index) => ({
        month: item.date,
        count: Math.round(item.predicted_deaths * multiplier).toLocaleString('ko-KR') + '명',
        vsLastYear: 'N/A',
        vsLastMonth: 'N/A',
      })),
      predictionSummary: {
        avg: Math.round(predictionJson.summary.average_monthly * multiplier).toLocaleString('ko-KR') + '명',
        max: Math.round(predictionJson.summary.max_month * multiplier).toLocaleString('ko-KR') + '명',
        min: Math.round(predictionJson.summary.min_month * multiplier).toLocaleString('ko-KR') + '명',
        totalNext12: Math.round(predictionJson.summary.total_12months * multiplier).toLocaleString('ko-KR') + '명',
      },
    };
  };

  const calculateChange = (current, previous) => {
    if (previous && current && previous > 0) {
      return parseFloat((((current - previous) / previous) * 100).toFixed(1));
    }
    return 'N/A';
  };

  const getEmptyData = () => ({
    regionStatus: nationalRegionStatus,
    charts: {
      longTermTrend: { labels: [], data: [] },
      predictionTrend: { labels: [], actualData: [], predictedData: [] },
    },
    monthlyPredictions: [],
    predictionSummary: {
      avg: '0명',
      max: '0명', 
      min: '0명',
      totalNext12: '0명',
    },
  });

  // 로딩 중일 때
  if (loading) {
    return (
      <div className="p-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="mt-3">데이터를 불러오는 중입니다...</h5>
      </div>
    );
  }

  // 에러가 있지만 데이터가 있을 때 경고 표시
  if (error && dashboardData) {
    console.warn('백엔드 연결 실패, CSV 데이터 사용 중:', error);
  }

  // 에러가 있을 때 (하지만 데이터가 있으면 표시)
  if (error && !dashboardData) {
    return (
      <div className="p-5 text-center">
        <div className="alert alert-warning" role="alert">
          <h5>데이터 로딩 오류</h5>
          <p>{error}</p>
          <div className="mt-3">
            <button 
              className="btn btn-primary me-2" 
              onClick={() => {
                setUseBackendData(true);
                setError(null);
              }}
            >
              백엔드 API 재시도
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => {
                setUseBackendData(false);
                setError(null);
              }}
            >
              CSV 데이터 사용
            </button>
          </div>
        </div>
      </div>
    );
  }

  const data = dashboardData || getEmptyData();

  const chartOptions = { 
    responsive: true, 
    maintainAspectRatio: true, 
    plugins: { legend: { position: 'top' } },
  };

  const longTermChartData = {
    labels: data.charts.longTermTrend.labels,
    datasets: [{ 
      label: '사망자 수', 
      data: data.charts.longTermTrend.data, 
      backgroundColor: 'rgba(102, 126, 234, 0.2)', 
      borderColor: 'rgba(102, 126, 234, 1)', 
      borderWidth: 2, 
      pointBackgroundColor: 'rgba(102, 126, 234, 1)', 
      tension: 0.4, 
      fill: true 
    }],
  };

  const predictionChartData = {
    labels: data.charts.predictionTrend.labels,
    datasets: [
      { 
        label: '실제 데이터', 
        data: data.charts.predictionTrend.actualData, 
        backgroundColor: 'rgba(75, 192, 192, 0.2)', 
        borderColor: 'rgb(75, 192, 192)', 
        borderWidth: 2, 
        pointBackgroundColor: 'rgb(75, 192, 192)', 
        tension: 0.4 
      },
      { 
        label: '예측 데이터', 
        data: data.charts.predictionTrend.predictedData, 
        borderDash: [5, 5], 
        backgroundColor: 'rgba(255, 99, 132, 0.2)', 
        borderColor: 'rgb(255, 99, 132)', 
        borderWidth: 2, 
        pointBackgroundColor: 'rgb(255, 99, 132)', 
        tension: 0.4 
      },
    ],
  };

  const renderChange = (value) => {
    if (value === 'N/A' || value === null) return <td className="text-muted">{value}</td>;
    const color = value > 0 ? '#d32f2f' : '#1976d2'; 
    const sign = value > 0 ? '▲' : '▼';
    return <td style={{ color, fontWeight: '600' }}>{sign} {Math.abs(value)}%</td>;
  };

  // 요약 카드 컴포넌트 
  const SummaryCard = ({ title, value }) => (
    <div className="text-center p-3" style={{ background: '#f8f9fa', borderRadius: '10px', border: '1px solid #e9ecef' }}>
      <h6 style={{ color: '#17191aff', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 'bold' }}>{title}</h6>
      <p className="fs-5 fw-bold mb-0" style={{ color: '#7a5128ff' }}>{value}</p>
    </div>
  );

  // 카드 스타일
  const cardStyle = {
    background: 'white',
    borderRadius: '15px', 
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  };

  return (
    <div>
      {/* 데이터 소스 상태 및 토글 */}
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <span className={`badge ${backendAvailable ? 'bg-success' : 'bg-warning'} me-2`}>
            {backendAvailable ? '백엔드 연결됨' : '백엔드 연결 안됨'}
          </span>
          <span className={`badge ${useBackendData ? 'bg-primary' : 'bg-secondary'}`}>
            {useBackendData ? '백엔드 데이터' : 'CSV 데이터'} 사용 중
          </span>
        </div>
        {backendAvailable && (
          <button
            className={`btn btn-sm ${useBackendData ? 'btn-secondary' : 'btn-primary'}`}
            onClick={() => setUseBackendData(!useBackendData)}
          >
            {useBackendData ? 'CSV로 전환' : '백엔드로 전환'}
          </button>
        )}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
          <small><strong>알림:</strong> {error}</small>
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      {/* 제목 */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ fontWeight: '700', color: '#343a40' }}>
          <i className="fas fa-map-marker-alt me-2" style={{ color: '#D4AF37' }}></i>
          {region} 예측 결과 분석
        </h2>
        <div>
          <small className="text-muted">
            데이터 소스: {useBackendData ? '백엔드 API' : 'CSV 파일'}
          </small>
          <button 
            className="btn btn-sm btn-outline-secondary ms-2"
            onClick={() => setUseBackendData(!useBackendData)}
          >
            {useBackendData ? 'CSV 모드' : 'API 모드'}
          </button>
        </div>
      </div>

      {/* 주요지역 현황 요약 */}
      <div className="p-4 mb-4" style={cardStyle}>
        <h5 className="mb-3" style={{ fontWeight: '600' }}>주요지역 현황 요약</h5>
        <Row>
          {data.regionStatus.map((status, index) => (
            <Col md={4} key={index} className="mb-2">
              <div className="p-3 text-black rounded d-flex flex-column" style={{ backgroundColor: status.color, height: '100%' }}>
                <h6 className="mb-1" style={{ fontWeight: 'bold', fontSize: '15px', color: '#505050ff' }}>{status.level}</h6>
                <p className="mb-0" style={{ fontWeight: 'bold', fontSize: '20px' }}>{status.regions.join(', ')}</p>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* 예측 요약 통계 */}
      <div className="p-4 mb-4" style={cardStyle}>
        <h5 className="mb-3" style={{ fontWeight: '600' }}>예측 요약 통계</h5>
        <Row>
          <Col md={3} className="mb-3"><SummaryCard title="평균 월별 예상" value={data.predictionSummary.avg} /></Col>
          <Col md={3} className="mb-3"><SummaryCard title="월 최대 예상" value={data.predictionSummary.max} /></Col>
          <Col md={3} className="mb-3"><SummaryCard title="월 최소 예상" value={data.predictionSummary.min} /></Col>
          <Col md={3} className="mb-3"><SummaryCard title="향후 12개월 총 예상" value={data.predictionSummary.totalNext12} /></Col>
        </Row>
      </div>
      
      {/* 차트 영역 */}
      <div className="p-4 mb-4" style={cardStyle}>
        <Row>
          <Col md={12}>
            <h5 style={{ fontWeight: '600' }}>최근 24개월 실제 데이터 + 향후 12개월 예측</h5>
            <Line options={chartOptions} data={predictionChartData} height={100} />
          </Col>
        </Row>
      </div>

      {/* 테이블 영역 */}
      <div className="p-4 mb-4" style={cardStyle}>
        <h5 className="mb-3" style={{ fontWeight: '600' }}>월별 예측 상세 결과</h5>
        <Table hover responsive>
          <thead style={{ background: '#f8f9fa' }}>
            <tr>
              <th>월</th><th>예상 사망자 수</th><th>전년 동월 대비</th><th>전월 대비</th>
            </tr>
          </thead>
          <tbody>
            {data.monthlyPredictions.map((item, index) => (
              <tr key={index}>
                <td>{item.month}</td>
                <td>{item.count}</td>
                {renderChange(item.vsLastYear)}
                {renderChange(item.vsLastMonth)}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* 전체 시계열 차트 */}
      <div className="p-4 mb-4" style={cardStyle}>
        <Row>
          <Col md={12} className="mb-5">
            <h5 style={{ fontWeight: '600' }}>전체 시계열 데이터</h5>
            <Line options={chartOptions} data={longTermChartData} height={100} />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default RegionDataDisplay;