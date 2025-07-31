import React, { useState, useEffect } from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Papa from 'papaparse';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


// 데이터 처리 로직 시작
const nationalRegionStatus = [
  { level: '고위험 지역', color: 'rgba(183, 28, 28, 0.8)', regions: ['서울', '경기', '부산'] },
  { level: '주의 지역', color: 'rgba(251, 192, 45, 0.8)', regions: ['대구', '인천', '충남'] },
  { level: '안정 지역', color: 'rgba(51, 105, 30, 0.8)', regions: ['광주', '울산', '세종'] },
];

const generateRegionalData = (baseData, multiplier, regionName) => {
  const formatNumber = (num) => Math.round(num).toLocaleString('ko-KR') + '명';
  const formatNumberOnly = (num) => Math.round(num * multiplier);

  return {
    regionStatus: nationalRegionStatus,
    charts: {
      longTermTrend: {
        labels: baseData.longTermTrend.labels,
        data: baseData.longTermTrend.data.map(d => Math.round(d * multiplier)),
      },
      predictionTrend: {
        labels: baseData.predictionTrend.labels,
        actualData: baseData.predictionTrend.actualData.map(d => d && formatNumberOnly(d)),
        predictedData: baseData.predictionTrend.predictedData.map(d => d && formatNumberOnly(d)),
      },
    },
    monthlyPredictions: baseData.monthlyPredictions.map(p => ({
      ...p,
      count: formatNumber(p.raw_count * multiplier),
    })),
    predictionSummary: {
        avg: formatNumber(baseData.predictionSummary.avg * multiplier),
        max: formatNumber(baseData.predictionSummary.max * multiplier),
        min: formatNumber(baseData.predictionSummary.min * multiplier),
        totalNext12: formatNumber(baseData.predictionSummary.totalNext12 * multiplier),
    },
  };
};

const RegionDataDisplay = ({ region }) => {
  const [processedData, setProcessedData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAndProcessData = async () => {
      try {
        const [csvResponse, jsonResponse] = await Promise.all([
          fetch('/15년치_월별.csv'),
          fetch('/monthly_predictions.json')
        ]);
        const csvText = await csvResponse.text();
        const predictionJson = await jsonResponse.json();
        const parsedCsv = await new Promise((resolve) => {
          Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => resolve(results.data),
          });
        });
        const formattedCsvData = parsedCsv.map(row => ({
          '연월': row['연월'],
          '사망자수': Number(String(row['사망자수']).replace(/,/g, '')) || 0
        }));
        const historicalDataMap = new Map(formattedCsvData.map(item => [item['연월'], item['사망자수']]));
        const lastActualDataPoint = formattedCsvData[formattedCsvData.length - 1];
        const calculatedPredictions = predictionJson.predictions.map((item, index, arr) => {
          const currentYear = new Date(item.date).getFullYear();
          const currentMonth = new Date(item.date).getMonth() + 1;
          const lastYearMonthKey = `${currentYear - 1}-${String(currentMonth).padStart(2, '0')}`;
          const lastYearData = historicalDataMap.get(lastYearMonthKey);
          const lastMonthPrediction = index > 0 ? arr[index - 1].predicted_deaths : lastActualDataPoint['사망자수'];
          const calculateChange = (current, previous) => {
            if (previous && current && previous > 0) {
              return parseFloat((((current - previous) / previous) * 100).toFixed(1));
            }
            return 'N/A';
          };
          return {
            month: item.date,
            count: item.formatted_deaths,
            raw_count: item.predicted_deaths,
            vsLastYear: calculateChange(item.predicted_deaths, lastYearData),
            vsLastMonth: calculateChange(item.predicted_deaths, lastMonthPrediction),
          };
        });
        const predictionArray = predictionJson.predictions;
        const newPredictedLabels = predictionArray.map(item => item.date);
        const newPredictedData = predictionArray.map(item => item.predicted_deaths);
        const recentActualData = formattedCsvData.slice(-24);
        const recentActualLabels = recentActualData.map(item => item['연월']);
        const recentActualValues = recentActualData.map(item => item['사망자수']);
        const nationalBaseData = {
          longTermTrend: {
            labels: formattedCsvData.map(row => row['연월']),
            data: formattedCsvData.map(row => row['사망자수']),
          },
          predictionTrend: {
            labels: [...recentActualLabels, ...newPredictedLabels],
            actualData: [...recentActualValues, ...Array(newPredictedLabels.length).fill(null)],
            predictedData: [...Array(recentActualValues.length - 1).fill(null), recentActualValues[recentActualValues.length - 1], ...newPredictedData],
          },
          monthlyPredictions: calculatedPredictions,
          predictionSummary: {
            avg: predictionJson.summary.average_monthly,
            max: predictionJson.summary.max_month,
            min: predictionJson.summary.min_month,
            totalNext12: predictionJson.summary.total_12months,
          },
        };
        const regionalData = {};
        const multipliers = { '전체': 1, '서울': 0.21, '경기': 0.26, '부산': 0.07, '대구': 0.05, '인천': 0.06, '충남': 0.04, '광주': 0.03, '울산': 0.02, '세종': 0.01 };
        for (const regionName in multipliers) {
          regionalData[regionName] = generateRegionalData(nationalBaseData, multipliers[regionName], regionName);
        }
        setProcessedData(regionalData);
        setLoading(false);
      } catch (error) {
        console.error("데이터를 불러오거나 처리하는 중 에러 발생:", error);
        setLoading(false);
      }
    };
    loadAndProcessData();
  }, []);

// 기존 데이터 처리 로직 끝

  if (loading || !processedData) {
    return <div className="p-5 text-center"><h5>데이터를 불러오는 중입니다...</h5></div>;
  }

  const data = processedData[region] || processedData['전체'];
  
  if (!data) {
    return <div className="p-5 text-center"><h5>{region} 지역의 데이터가 없습니다.</h5></div>;
  }

  const chartOptions = { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'top' } } };
  const longTermChartData = {
    labels: data.charts.longTermTrend.labels,
    datasets: [{ label: '사망자 수', data: data.charts.longTermTrend.data, backgroundColor: 'rgba(102, 126, 234, 0.2)', borderColor: 'rgba(102, 126, 234, 1)', borderWidth: 2, pointBackgroundColor: 'rgba(102, 126, 234, 1)', tension: 0.4, fill: true }],
  };
  const predictionChartData = {
    labels: data.charts.predictionTrend.labels,
    datasets: [
      { label: '실제 데이터', data: data.charts.predictionTrend.actualData, backgroundColor: 'rgba(75, 192, 192, 0.2)', borderColor: 'rgb(75, 192, 192)', borderWidth: 2, pointBackgroundColor: 'rgb(75, 192, 192)', tension: 0.4 },
      { label: '예측 데이터', data: data.charts.predictionTrend.predictedData, borderDash: [5, 5], backgroundColor: 'rgba(255, 99, 132, 0.2)', borderColor: 'rgb(255, 99, 132)', borderWidth: 2, pointBackgroundColor: 'rgb(255, 99, 132)', tension: 0.4 },
    ],
  };

  const renderChange = (value) => {
    if (value === 'N/A' || value === null) return <td className="text-muted">{value}</td>;
    const color = value > 0 ? '#d32f2f' : '#1976d2';
    const sign = value > 0 ? '▲' : '▼';
    return <td style={{ color, fontWeight: '600' }}>{sign} {Math.abs(value)}%</td>;
  };

  const SummaryCard = ({ title, value }) => (
    <div className="text-center p-3" style={{ background: '#f8f9fa', borderRadius: '10px', border: '1px solid #e9ecef' }}>
      <h6 style={{ color: '#6c757d', fontSize: '0.9rem', marginBottom: '8px' }}>{title}</h6>
      <p className="fs-5 fw-bold mb-0" style={{ color: '#667eea' }}>{value}</p>
    </div>
  );

  return (
    <div>
      <h2 className="mb-4" style={{ fontWeight: '700', color: '#343a40' }}>
        <i className="fas fa-map-marker-alt me-2" style={{ color: '#667eea' }}></i>
        {region} 예측 결과 분석
      </h2>

      <div className="p-4 mb-4" style={{ background: 'white', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h5 className="mb-3" style={{ fontWeight: '600' }}>주요지역 현황 요약</h5>
        <Row>
          {data.regionStatus.map((status, index) => (
            <Col md={4} key={index} className="mb-2">
              <div className="p-3 text-white rounded d-flex flex-column" style={{ backgroundColor: status.color, height: '100%' }}>
                <h6 className="mb-1" style={{ fontWeight: 'bold' }}>{status.level}</h6>
                <p className="fs-6 mb-0">{status.regions.join(', ')}</p>
              </div>
            </Col>
          ))}
        </Row>
      </div>
      
      <div className="p-4 mb-4" style={{ background: 'white', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Row>
          <Col md={12} className="mb-5">
            <h5 style={{ fontWeight: '600' }}>전체 시계열 데이터</h5>
            <Line options={chartOptions} data={longTermChartData} height={100} />
          </Col>
          <Col md={12}>
            <h5 style={{ fontWeight: '600' }}>최근 24개월 실제 데이터 + 예측</h5>
            <Line options={chartOptions} data={predictionChartData} height={100} />
          </Col>
        </Row>
      </div>

      <div className="p-4 mb-4" style={{ background: 'white', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
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

      <div className="p-4 mb-4" style={{ background: 'white', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h5 className="mb-3" style={{ fontWeight: '600' }}>예측 요약 통계</h5>
        <Row>
          <Col md={3} className="mb-3"><SummaryCard title="평균 월별 예상" value={data.predictionSummary.avg} /></Col>
          <Col md={3} className="mb-3"><SummaryCard title="월 최대 예상" value={data.predictionSummary.max} /></Col>
          <Col md={3} className="mb-3"><SummaryCard title="월 최소 예상" value={data.predictionSummary.min} /></Col>
          <Col md={3} className="mb-3"><SummaryCard title="향후 12개월 총 예상" value={data.predictionSummary.totalNext12} /></Col>
        </Row>
      </div>
    </div>
  );
};

export default RegionDataDisplay;