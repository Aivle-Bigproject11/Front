import React, { useState, useEffect } from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { apiService } from '../services/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// 데이터 처리 로직 시작
const getRegionStatusTemplate = () => [
  { 
    level: '우선 지역', 
    description: '전원 대비 증가율이 가장 높은 지역들',
    color: 'rgba(220, 53, 69, 0.15)', 
    borderColor: 'rgba(220, 53, 69, 0.8)',
    textColor: '#dc3545',
    regions: [] 
  },
  { 
    level: '관심 지역', 
    description: '평상 수준 이상의 증가율을 보이는 주의 필요한 지역',
    color: 'rgba(255, 193, 7, 0.15)', 
    borderColor: 'rgba(255, 193, 7, 0.8)',
    textColor: '#ffc107',
    regions: [] 
  },
  { 
    level: '안정 지역', 
    description: '증가율이 낮거나 감소세를 보이는 지역',
    color: 'rgba(25, 135, 84, 0.15)', 
    borderColor: 'rgba(25, 135, 84, 0.8)',
    textColor: '#198754',
    regions: [] 
  },
];

// 증가율에 따른 지역 분류 함수
const classifyRegionsByGrowthRate = (dataArray) => {
  if (!dataArray || dataArray.length === 0) {
    return getRegionStatusTemplate();
  }

  // 지역별 증가율 계산 (최신 데이터 기준)
  const regionGrowthRates = dataArray
    .filter(item => item.region && item.growthRate !== undefined)
    .map(item => ({
      region: item.region,
      growthRate: item.growthRate || 0
    }))
    .sort((a, b) => b.growthRate - a.growthRate); // 증가율 내림차순 정렬

  if (regionGrowthRates.length === 0) {
    return getRegionStatusTemplate();
  }

  const regionStatus = getRegionStatusTemplate();
  const totalRegions = regionGrowthRates.length;

  // 3등분으로 나누기
  const highThreshold = Math.ceil(totalRegions / 3);
  const mediumThreshold = Math.ceil((totalRegions * 2) / 3);

  regionGrowthRates.forEach((item, index) => {
    if (index < highThreshold) {
      // 상위 33% - 우선 지역
      regionStatus[0].regions.push(`${item.region} (${item.growthRate.toFixed(1)}%)`);
    } else if (index < mediumThreshold) {
      // 중위 33% - 관심 지역
      regionStatus[1].regions.push(`${item.region} (${item.growthRate.toFixed(1)}%)`);
    } else {
      // 하위 33% - 안정 지역
      regionStatus[2].regions.push(`${item.region} (${item.growthRate.toFixed(1)}%)`);
    }
  });

  return regionStatus;
};

const RegionDataDisplay = ({ region }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useBackendData, setUseBackendData] = useState(true); // 백엔드 데이터를 기본값으로 변경
  const [backendAvailable, setBackendAvailable] = useState(false);

  useEffect(() => {
    // 백엔드 가용성 체크
    const checkBackendAvailability = async () => {
      try {
        console.log('🔍 백엔드 서버 연결 상태 확인 중...');
        
        // 1차: 기본 GET 요청으로 서버 응답 확인
        try {
          const basicResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
            timeout: 3000
          });
          
          if (basicResponse.status) {
            console.log('✅ 백엔드 서버 기본 연결 성공 (상태:', basicResponse.status, ')');
            setBackendAvailable(true);
            return;
          }
        } catch (basicError) {
          console.log('⚠️ 기본 GET 연결 실패:', basicError.message);
        }

        // 2차: actuator/health 시도
        try {
          const healthResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/actuator/health`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
            timeout: 3000
          });
          
          if (healthResponse.ok) {
            const healthData = await healthResponse.text();
            console.log('✅ 백엔드 서버 actuator/health 성공:', healthData);
            setBackendAvailable(true);
            return;
          }
        } catch (healthError) {
          console.log('⚠️ actuator/health 실패:', healthError.message);
        }

        // 3차: 로그인 엔드포인트로 서버 생존 확인
        try {
          const loginResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/managers/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ loginId: 'test', loginPassword: 'test' }),
            timeout: 3000
          });
          
          // 400, 401 등의 응답도 서버가 살아있다는 의미
          if (loginResponse.status) {
            console.log('✅ 백엔드 서버 로그인 엔드포인트로 생존 확인 (상태:', loginResponse.status, ')');
            setBackendAvailable(true);
            return;
          }
        } catch (loginError) {
          console.log('⚠️ 로그인 엔드포인트도 실패:', loginError.message);
        }

        // 모든 시도 실패
        console.log('❌ 모든 백엔드 연결 시도 실패');
        setBackendAvailable(false);
        setUseBackendData(false); // 백엔드 연결 실패 시 CSV로 폴백
        
      } catch (error) {
        console.log('💥 백엔드 서버 연결 불가:', error.message);
        setBackendAvailable(false);
        setUseBackendData(false); // 백엔드 연결 실패 시 CSV로 폴백
      }
    };

    checkBackendAvailability();

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 백엔드가 사용 가능하면 우선적으로 백엔드 데이터 사용
        if (backendAvailable) {
          console.log('🚀 백엔드 데이터 로딩 시작...');
          
          try {
            // 백엔드 API 사용
            const currentDate = new Date().toISOString().slice(0, 7); // YYYY-MM
            
            let regionData;
            if (region === '전체') {
              console.log('전체 지역 데이터 요청 중...');
              console.log('API 호출:', `GET /deathPredictions/by-date/${currentDate}`);
              
              try {
                regionData = await apiService.getDashboardByDate(currentDate);
                console.log('✅ 전체 지역 데이터 응답:', regionData);
              } catch (error) {
                // 데이터가 없으면 먼저 예측 요청을 시도
                if (error.response?.status === 404) {
                  console.log('📝 데이터가 없어 예측 요청 시도 중...');
                  try {
                    await apiService.requestPrediction({
                      date: currentDate,
                      region: "서울특별시",
                      previousYearDeaths: 1500
                    });
                    // 다시 데이터 조회 시도
                    regionData = await apiService.getDashboardByDate(currentDate);
                  } catch (predError) {
                    console.log('📝 예측 요청 실패, 폴백 모드로 전환:', predError.message);
                    throw error; // 원래 404 에러를 다시 던짐
                  }
                } else {
                  throw error;
                }
              }
            } else {
              console.log(`${region} 지역 데이터 요청 중...`);
              console.log('API 호출:', `GET /deathPredictions/by-region/${region}`);
              
              try {
                regionData = await apiService.getDashboardByRegion(region);
                console.log('✅ 지역별 데이터 응답:', regionData);
              } catch (error) {
                // 데이터가 없으면 먼저 예측 요청을 시도
                if (error.response?.status === 404) {
                  console.log('📝 데이터가 없어 예측 요청 시도 중...');
                  try {
                    await apiService.requestPrediction({
                      date: currentDate,
                      region: region,
                      previousYearDeaths: 1500
                    });
                    // 다시 데이터 조회 시도
                    regionData = await apiService.getDashboardByRegion(region);
                  } catch (predError) {
                    console.log('📝 예측 요청 실패, 폴백 모드로 전환:', predError.message);
                    throw error; // 원래 404 에러를 다시 던짐
                  }
                } else {
                  throw error;
                }
              }
            }

            console.log('백엔드 응답 데이터:', regionData);

            // 백엔드 데이터를 기존 형식으로 변환
            const processedData = formatBackendData(regionData, region);
            setDashboardData(processedData);
            setUseBackendData(true);
            
          } catch (backendError) {
            console.error('백엔드 데이터 로딩 실패, CSV로 폴백:', backendError);
            setError('백엔드 연결 실패, CSV 데이터로 표시합니다.');
            setUseBackendData(false);
            loadCsvData(); // 백엔드 실패 시 CSV로 폴백
          }
        } else {
          console.log('📄 백엔드 연결 불가, CSV 데이터 사용');
          setUseBackendData(false);
          // CSV 데이터 사용
          loadCsvData();
        }
      } catch (error) {
        console.error('전체 데이터 로딩 실패:', error);
        setError('데이터를 불러올 수 없습니다.');
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

    // 백엔드 가용성 체크 완료 후 데이터 로딩
    checkBackendAvailability().then(() => {
      loadDashboardData();
    });
  }, [region]); // region 변경 시에만 새로 로딩

  // 백엔드 데이터를 UI에 맞게 변환
  const formatBackendData = (data, selectedRegion) => {
    console.log('🔄 백엔드 데이터 변환 시작:', data);
    
    if (!data) {
      console.warn('백엔드 데이터가 null/undefined입니다');
      return getEmptyData();
    }

    // 단일 객체인 경우 배열로 변환
    const dataArray = Array.isArray(data) ? data : [data];
    
    if (dataArray.length === 0) {
      console.warn('백엔드에서 빈 데이터를 받았습니다');
      return getEmptyData();
    }

    console.log('🔄 변환할 데이터 배열:', dataArray);

    // 백엔드 응답 구조에 맞게 데이터 처리
    // DeathPrediction 객체: { id: {date, region}, deaths, growthRate, regionalPercentage, previousYearDeaths, date, region }
    const processedData = dataArray.map(item => ({
      date: item.date || item.id?.date,
      region: item.region || item.id?.region,
      deaths: item.deaths || 0,
      growthRate: item.growthRate || 0,
      regionalPercentage: item.regionalPercentage || 0,
      previousYearDeaths: item.previousYearDeaths || 0
    }));

    // 날짜순으로 정렬
    const sortedData = processedData.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // 선택된 지역에 맞게 필터링 (전체가 아닌 경우)
    const filteredData = selectedRegion === '전체' 
      ? sortedData 
      : sortedData.filter(item => item.region === selectedRegion);

    console.log('🔄 필터링된 데이터:', filteredData);

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
    
    console.log('🔄 차트 데이터:', chartData);

    // 실제 API 데이터로 지역 분류
    const regionStatus = classifyRegionsByGrowthRate(processedData);
    console.log('🔄 지역 분류 결과:', regionStatus);

    return {
      regionStatus: regionStatus,
      charts: {
        longTermTrend: {
          labels: chartData.map(item => item.date),
          data: chartData.map(item => item.deaths),
        },
        predictionTrend: {
          labels: chartData.map(item => item.date),
          actualData: chartData.map(item => item.deaths),
          predictedData: new Array(chartData.length).fill(null), // 예측 데이터는 별도 로직으로 처리
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

  const formatCsvData = (csvData, predictionJson, selectedRegion) => {
    const multipliers = { 
      '전체': 1, '서울': 0.21, '경기': 0.26, '부산': 0.07, 
      '대구': 0.05, '인천': 0.06, '충남': 0.04, '광주': 0.03, 
      '울산': 0.02, '세종': 0.01 
    };
    
    const multiplier = multipliers[selectedRegion] || 1;
    
    // CSV 데이터에서 임시 증가율 계산 (백엔드 실제 지역명으로 더미 데이터)
    const dummyRegionData = [
      { region: '서울특별시', growthRate: 8.5 },
      { region: '경기도', growthRate: 7.2 },
      { region: '부산광역시', growthRate: 6.8 },
      { region: '대구광역시', growthRate: 4.1 },
      { region: '인천광역시', growthRate: 3.7 },
      { region: '충청남도', growthRate: 2.9 },
      { region: '광주광역시', growthRate: 1.8 },
      { region: '울산광역시', growthRate: 0.5 },
      { region: '세종특별자치시', growthRate: -0.3 },
      { region: '대전광역시', growthRate: 3.2 },
      { region: '강원특별자치도', growthRate: 1.5 },
      { region: '충청북도', growthRate: 2.1 },
      { region: '전북특별자치도', growthRate: 0.8 },
      { region: '전라남도', growthRate: -0.1 },
      { region: '경상북도', growthRate: 1.2 },
      { region: '경상남도', growthRate: 2.3 },
      { region: '제주특별자치도', growthRate: 4.6 }
    ];
    
    const regionStatus = classifyRegionsByGrowthRate(dummyRegionData);
    
    return {
      regionStatus: regionStatus,
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
    regionStatus: getRegionStatusTemplate(),
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
              className="btn btn-primary" 
              onClick={() => {
                setUseBackendData(!useBackendData);
                setError(null);
              }}
            >
              {useBackendData ? 'CSV 데이터로 전환' : '백엔드 API로 전환'}
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
        <button
          className={`btn btn-sm ${useBackendData ? 'btn-outline-secondary' : 'btn-outline-primary'}`}
          onClick={() => setUseBackendData(!useBackendData)}
          disabled={!backendAvailable && !useBackendData}
        >
          {useBackendData ? 'CSV 모드로 전환' : '백엔드 모드로 전환'}
        </button>
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
        <small className="text-muted">
          데이터 소스: {useBackendData ? '백엔드 API' : 'CSV 파일'}
        </small>
      </div>

      {/* 주요지역 현황 요약 */}
      <div className="p-4 mb-4" style={cardStyle}>
        <h5 className="mb-4" style={{ fontWeight: '600', color: '#343a40' }}>주요지역 현황 요약</h5>
        <Row className="g-3">
          {data.regionStatus.map((status, index) => (
            <Col md={4} key={index}>
              <div 
                className="p-4 rounded-3 h-100 d-flex flex-column position-relative" 
                style={{ 
                  backgroundColor: status.color,
                  border: `2px solid ${status.borderColor}`,
                  transition: 'all 0.3s ease'
                }}
              >
                {/* 상태 표시 도트 */}
                <div 
                  className="position-absolute top-0 end-0 m-3 rounded-circle"
                  style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: status.textColor,
                    boxShadow: `0 0 0 4px ${status.color}`
                  }}
                ></div>
                
                {/* 제목 */}
                <h6 
                  className="mb-2 fw-bold" 
                  style={{ 
                    fontSize: '16px', 
                    color: status.textColor,
                    letterSpacing: '-0.5px'
                  }}
                >
                  ● {status.level}
                </h6>
                
                {/* 설명 */}
                <p 
                  className="mb-3 small" 
                  style={{ 
                    color: '#212529',
                    fontSize: '13px',
                    lineHeight: '1.4',
                    minHeight: '34px'
                  }}
                >
                  {status.description}
                </p>
                
                {/* 지역 목록 */}
                <div className="mt-auto">
                  <div className="d-flex flex-wrap gap-1">
                    {status.regions.map((region, regionIndex) => (
                      <span 
                        key={regionIndex}
                        className="badge rounded-pill px-2 py-1"
                        style={{ 
                          backgroundColor: status.textColor,
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                      >
                        {region}
                      </span>
                    ))}
                  </div>
                  {status.regions.length === 0 && (
                    <p className="text-muted small mb-0">데이터가 없습니다</p>
                  )}
                </div>
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