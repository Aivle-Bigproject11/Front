import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Card } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import staffData from '../assets/dataset/Predcit_rf_Result_min.json';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Menu2_2 = () => {
  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [animateCard, setAnimateCard] = useState(false);
  const [currentStaffData, setCurrentStaffData] = useState(null);
  const [nationalData, setNationalData] = useState(null);
  const [staffChartData, setStaffChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2024-01 현재 배치 데이터 (시스템 기본 400명)
  const totalStaff = 400;

  // 표시용 지역명 계산 (전체 -> 전국)
  const getDisplayRegionName = (regionName) => {
    return regionName === '전체' ? '전국' : regionName;
  };

  // 초기 데이터 로딩
  useEffect(() => {
    const initializeData = async () => {
      console.log('📊 AI 인력배치 추천 페이지 초기화 시작...');
      
      try {
        // 2024-01 데이터 필터링
        const currentData = staffData.filter(item => item.date === '2024-01');
        
        // 전국 데이터와 지역별 데이터 분리
        const nationalItem = currentData.find(item => item.regionName === '전국');
        const regionData = currentData.filter(item => item.regionName !== '전국');
        
        setNationalData(regionData);
        setCurrentStaffData(currentData);
        
        // 초기 지역 데이터 설정
        await loadRegionData('전체');
        
        console.log('✅ AI 인력배치 데이터 초기화 완료');
        
      } catch (error) {
        console.error('⚠️ 초기 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
        setAnimateCard(true);
      }
    };

    initializeData();
  }, []);

  // 지역 데이터 로딩
  const loadRegionData = async (region) => {
    try {
      console.log(`📍 ${region} 지역 AI 인력배치 데이터 로딩 중...`);
      
      let regionData;
      
      if (region === '전체') {
        // 전체 선택 시 모든 지역의 월별 데이터
        regionData = staffData.filter(item => item.regionName !== '전국');
      } else {
        // 특정 지역 선택 시 해당 지역의 모든 월 데이터
        regionData = staffData.filter(item => item.regionName === region);
      }
      
        // 차트 데이터 생성
        generateStaffChartData(region, regionData);      console.log(`✅ ${region} AI 인력배치 데이터 로딩 완료`);
      
    } catch (error) {
      console.error(`${region} 지역 데이터 로딩 실패:`, error);
    }
  };

  // 인력배치 차트 데이터 생성
  const generateStaffChartData = (region, regionData) => {
    try {
      console.log(`👥 ${region} 인력배치 차트 데이터 생성 중...`);
      
      let chartDataPoints = [];
      
      if (region === '전체') {
        // 전국 집계: 월별로 그룹화하여 합계 계산
        const monthlyTotals = {};
        
        regionData.forEach(item => {
          if (item.staff !== undefined) {
            if (!monthlyTotals[item.date]) {
              monthlyTotals[item.date] = { staff: 0, staffChange: 0 };
            }
            monthlyTotals[item.date].staff += item.staff || 0;
            monthlyTotals[item.date].staffChange += item.staffChange || 0;
          }
        });
        
        chartDataPoints = Object.entries(monthlyTotals)
          .map(([date, data]) => ({ 
            date, 
            staff: data.staff,
            staffChange: data.staffChange,
            pureStaff: data.staff - data.staffChange
          }))
          .sort((a, b) => a.date.localeCompare(b.date));
      } else {
        // 특정 지역
        chartDataPoints = regionData
          .filter(item => item.staff !== undefined)
          .map(item => ({ 
            date: item.date, 
            staff: item.staff,
            staffChange: item.staffChange,
            pureStaff: (item.staff || 0) - (item.staffChange || 0)
          }))
          .sort((a, b) => a.date.localeCompare(b.date));
      }
      
      const chartConfig = {
        labels: chartDataPoints.map(item => item.date),
        datasets: [
          {
            label: 'AI 추천 총 인력 (staff)',
            data: chartDataPoints.map(item => item.staff),
            backgroundColor: 'rgba(255, 99, 132, 0.7)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2
          },
          {
            label: '순수 사망자 기반 인력 (staff-staffChange)',
            data: chartDataPoints.map(item => item.pureStaff),
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2
          },
          {
            label: '장례식장 가중치 (staffChange)',
            data: chartDataPoints.map(item => item.staffChange),
            backgroundColor: 'rgba(255, 206, 84, 0.7)',
            borderColor: 'rgba(255, 206, 84, 1)',
            borderWidth: 2
          }
        ]
      };
      
      setStaffChartData(chartConfig);
      console.log('✅ 인력배치 차트 데이터 생성 완료');
      
    } catch (error) {
      console.error('인력배치 차트 데이터 생성 실패:', error);
    }
  };

  // 지역 선택 핸들러
  useEffect(() => {
    if (!loading && selectedRegion) {
      loadRegionData(selectedRegion);
    }
  }, [selectedRegion, loading]);

  return (
    <div className="page-wrapper" style={{
      '--navbar-height': '62px',
      height: 'calc(100vh - var(--navbar-height))',
      background: 'linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>

      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23B8860B" fill-opacity="0.12"%3E%3Cpath d="M40 40L20 20v40h40V20L40 40zm0-20L60 0H20l20 20zm0 20L20 60h40L40 40z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
        opacity: 0.7
      }}></div>

      <div className={`dashboard-container ${animateCard ? 'animate-in' : ''}`} style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '1600px',
        height: '100%', 
        margin: '0 auto',
        display: 'flex',
        boxSizing: 'border-box',
        background: 'rgba(255, 251, 235, 0.95)',
        boxShadow: '0 20px 60px rgba(44, 31, 20, 0.4)',
        backdropFilter: 'blur(15px)',
        padding: '24px',
        borderRadius: '28px',
        border: '2px solid rgba(184, 134, 11, 0.35)',
        gap: '20px',
        overflow: 'hidden'
      }}>
        {/* 왼쪽 영역 (지도) */}
        <div style={{ flex: '0 0 600px', display: 'flex', flexDirection: 'column' }}>
          <h4 className="mb-3" style={{ 
            fontSize: '30px', 
            fontWeight: '700', 
            color: '#2C1F14',
            paddingLeft: '10px' 
          }}>
            🤖 AI 인력배치 추천
          </h4>
          <div className="dashboard-left" style={{
            background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.12) 0%, rgba(205, 133, 63, 0.08) 100%)',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 20px rgba(44, 31, 20, 0.12)',
            border: '1px solid rgba(184, 134, 11, 0.2)',
            position: 'sticky',
            top: '0',
            height: 'fit-content'
          }}>
            <StaffMap
              selectedRegion={selectedRegion}
              onRegionSelect={setSelectedRegion}
              staffData={currentStaffData}
            />
            
            {/* 현재 배치 인력 정보 */}
            <div className="mt-3 p-3 rounded-3" style={{
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(184, 134, 11, 0.2)'
            }}>
              <h6 className="mb-2" style={{ color: '#2C1F14', fontWeight: '600' }}>
                📊 현재 시스템 인력 현황 (2024-01)
              </h6>
              <div className="d-flex justify-content-between align-items-center">
                <span style={{ fontSize: '14px', color: '#666' }}>총 가용 인력:</span>
                <span style={{ fontSize: '18px', fontWeight: '700', color: '#B8860B' }}>
                  {totalStaff}명
                </span>
              </div>
              <div className="mt-2 text-center">
                <small style={{ color: '#666', fontSize: '12px' }}>
                  전국에 분산 배치된 인력
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 영역 (데이터) */}
        <div className="dashboard-right" style={{
          flex: '1',
          overflowY: 'auto',
          height: '100%',
          padding: '20px',
          background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.12) 0%, rgba(205, 133, 63, 0.08) 100%)',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(44, 31, 20, 0.12)',
          border: '1px solid rgba(184, 134, 11, 0.2)'
        }}>
          {loading ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%',
              flexDirection: 'column',
              color: '#2C1F14'
            }}>
              <div style={{ fontSize: '18px', marginBottom: '10px' }}>
                🤖 AI 인력배치 데이터 로딩 중...
              </div>
              <div style={{ fontSize: '14px', opacity: 0.7 }}>
                잠시만 기다려주세요
              </div>
            </div>
          ) : (
            <StaffDisplayComponent 
              region={selectedRegion}
              nationalData={nationalData}
              currentStaffData={currentStaffData}
              staffChartData={staffChartData}
              totalStaff={totalStaff}
            />
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .dashboard-container {
            opacity: 0;
        }

        .animate-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .dashboard-right::-webkit-scrollbar {
          width: 6px;
        }
        .dashboard-right::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
        .dashboard-right::-webkit-scrollbar-thumb {
          background-color: rgba(184, 134, 11, 0.5);
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
          .dashboard-left {
            position: static !important;
            width: 100%;
            flex: 0 0 auto;
          }
          .dashboard-right {
            height: auto;
            max-height: none;
          }
        }
      `}</style>
    </div>
  );
};

// 데이터 표시 컴포넌트
const StaffDisplayComponent = ({ 
  region, 
  nationalData, 
  currentStaffData,
  staffChartData,
  totalStaff
}) => {
  
  // 지역별 인력배치 상태 계산
  const getStaffStatus = () => {
    if (!nationalData || !Array.isArray(nationalData)) {
      return [];
    }

    // 현재 배치된 인력 기준으로 정렬
    const staffRegions = nationalData
      .filter(item => item.staff !== undefined)
      .map(item => ({
        region: item.regionName,
        currentStaff: item.staff,
        staffChange: item.staffChange || 0,
        pureStaff: (item.staff || 0) - (item.staffChange || 0),
        predictedDeaths: item.predictedDeaths || 0,
        growthRate: item.growthRate || 0
      }))
      .sort((a, b) => b.currentStaff - a.currentStaff);

    if (staffRegions.length === 0) return [];

    // 3등분으로 나누기
    const totalRegions = staffRegions.length;
    const highThreshold = Math.ceil(totalRegions / 3);
    const mediumThreshold = Math.ceil((totalRegions * 2) / 3);

    const staffStatus = [
      { 
        level: '주요 배치 지역', 
        description: '인력이 가장 많이 배치된 핵심 지역들',
        color: 'rgba(220, 53, 69, 0.15)', 
        borderColor: 'rgba(220, 53, 69, 0.8)',
        textColor: '#dc3545',
        regions: [] 
      },
      { 
        level: '일반 배치 지역', 
        description: '중간 규모로 인력이 배치된 지역들',
        color: 'rgba(255, 193, 7, 0.15)', 
        borderColor: 'rgba(255, 193, 7, 0.8)',
        textColor: '#ffc107',
        regions: [] 
      },
      { 
        level: '소규모 배치 지역', 
        description: '상대적으로 적은 인력이 배치된 지역들',
        color: 'rgba(25, 135, 84, 0.15)', 
        borderColor: 'rgba(25, 135, 84, 0.8)',
        textColor: '#198754',
        regions: [] 
      }
    ];

    staffRegions.forEach((item, index) => {
      const displayText = `${item.region} (${item.currentStaff}명)`;
      if (index < highThreshold) {
        staffStatus[0].regions.push(displayText);
      } else if (index < mediumThreshold) {
        staffStatus[1].regions.push(displayText);
      } else {
        staffStatus[2].regions.push(displayText);
      }
    });

    return staffStatus;
  };

  // 인력배치 요약 통계 계산
  const getStaffSummaryStats = () => {
    if (!currentStaffData || !Array.isArray(currentStaffData)) {
      return { 
        totalRecommendedStaff: 0, 
        totalStaffChange: 0, 
        totalPureStaff: 0,
        avgEfficiency: 0,
        recommendedChanges: 0
      };
    }

    const staffItems = currentStaffData.filter(item => item.staff !== undefined && item.regionName !== '전국');
    const totalRecommendedStaff = staffItems.reduce((sum, item) => sum + (item.staff || 0), 0);
    const totalStaffChange = staffItems.reduce((sum, item) => sum + (item.staffChange || 0), 0);
    const totalPureStaff = totalRecommendedStaff - totalStaffChange;
    
    // 추천 변경사항 계산 (현재 400명 대비)
    const recommendedChanges = totalRecommendedStaff - totalStaff;
    
    // 효율성 계산 (예상 사망자 수 대비 인력 비율)
    const totalPredictedDeaths = staffItems.reduce((sum, item) => sum + (item.predictedDeaths || 0), 0);
    const avgEfficiency = totalPredictedDeaths > 0 ? (totalRecommendedStaff / totalPredictedDeaths * 1000) : 0;

    return {
      totalRecommendedStaff,
      totalStaffChange,
      totalPureStaff,
      avgEfficiency: avgEfficiency.toFixed(2),
      recommendedChanges
    };
  };

  const staffStatus = getStaffStatus();
  const summaryStats = getStaffSummaryStats();
  const displayRegionName = region === '전체' ? '전국' : region;

  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '16px',
    border: '1px solid rgba(184, 134, 11, 0.2)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
  };

  const staffChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${displayRegionName} AI 추천 인력배치 분석`,
        font: { size: 16, weight: 'bold' }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '인력 수 (명)'
        }
      },
      x: {
        title: {
          display: true,
          text: '월'
        }
      }
    },
  };

  return (
    <div>
      {/* 제목 */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ fontWeight: '700', color: '#343a40' }}>
          <i className="fas fa-robot me-2" style={{ color: '#D4AF37' }}></i>
          {displayRegionName} AI 인력배치 추천 분석
        </h2>
        <small className="text-muted">
          데이터 소스: AI 머신러닝 모델
        </small>
      </div>

      {/* 지역별 인력배치 현황 요약 */}
      <div className="p-4 mb-4" style={cardStyle}>
        <h5 className="mb-3" style={{ fontWeight: '600', color: '#2C1F14' }}>
          👥 지역별 인력배치 현황 (2024-01 기준)
        </h5>
        <Row className="g-3">
          {staffStatus.map((status, index) => (
            <Col md={4} key={index}>
              <div 
                className="h-100 p-3 rounded-3 border-start border-4"
                style={{ 
                  backgroundColor: status.color,
                  borderLeftColor: status.borderColor + ' !important',
                  minHeight: '120px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0" style={{ color: status.textColor, fontWeight: '600' }}>
                    {status.level}
                  </h6>
                  <span className="badge rounded-pill" style={{ backgroundColor: status.textColor, color: 'white' }}>
                    {status.regions.length}개
                  </span>
                </div>
                <small className="text-muted mb-2" style={{ fontSize: '11px' }}>
                  {status.description}
                </small>
                <div className="mt-auto">
                  <div className="d-flex flex-wrap gap-1">
                    {status.regions.slice(0, 3).map((region, regionIndex) => (
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
                    {status.regions.length > 3 && (
                      <span className="text-muted small">+{status.regions.length - 3}개</span>
                    )}
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

      {/* AI 인력배치 추천 요약 통계 */}
      <div className="p-4 mb-4" style={cardStyle}>
        <h5 className="mb-3" style={{ fontWeight: '600', color: '#2C1F14' }}>
          🤖 AI 인력배치 추천 요약 통계
        </h5>
        <Row className="g-3">
          <Col md={3}>
            <div className="text-center p-3 rounded-3" style={{ backgroundColor: 'rgba(255, 99, 132, 0.1)' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#FF6384' }}>
                {summaryStats.totalRecommendedStaff}명
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>AI 추천 총 인력</div>
            </div>
          </Col>
          <Col md={3}>
            <div className="text-center p-3 rounded-3" style={{ backgroundColor: 'rgba(54, 162, 235, 0.1)' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#369CE3' }}>
                {summaryStats.totalPureStaff}명
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>순수 사망자 기반</div>
            </div>
          </Col>
          <Col md={3}>
            <div className="text-center p-3 rounded-3" style={{ backgroundColor: 'rgba(255, 206, 84, 0.1)' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#FFCE54' }}>
                {summaryStats.totalStaffChange > 0 ? '+' : ''}{summaryStats.totalStaffChange}명
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>장례식장 가중치</div>
            </div>
          </Col>
          <Col md={3}>
            <div className="text-center p-3 rounded-3" style={{ 
              backgroundColor: summaryStats.recommendedChanges >= 0 ? 'rgba(220, 53, 69, 0.1)' : 'rgba(25, 135, 84, 0.1)' 
            }}>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                color: summaryStats.recommendedChanges >= 0 ? '#dc3545' : '#198754' 
              }}>
                {summaryStats.recommendedChanges > 0 ? '+' : ''}{summaryStats.recommendedChanges}명
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>현재 대비 변경</div>
            </div>
          </Col>
        </Row>
        
        {/* 추천사항 */}
        <div className="mt-3 p-3 rounded-3" style={{ 
          backgroundColor: summaryStats.recommendedChanges >= 0 ? 'rgba(220, 53, 69, 0.05)' : 'rgba(25, 135, 84, 0.05)',
          border: `1px solid ${summaryStats.recommendedChanges >= 0 ? 'rgba(220, 53, 69, 0.2)' : 'rgba(25, 135, 84, 0.2)'}`
        }}>
          <h6 style={{ color: '#2C1F14', fontWeight: '600', marginBottom: '8px' }}>
            💡 AI 추천사항
          </h6>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '0' }}>
            {summaryStats.recommendedChanges > 0 ? (
              <>현재 배치된 {totalStaff}명에서 <strong style={{ color: '#dc3545' }}>{summaryStats.recommendedChanges}명 추가 배치</strong>를 권장합니다. 
              예상 사망자 수 증가에 대비한 인력 보강이 필요합니다.</>
            ) : summaryStats.recommendedChanges < 0 ? (
              <>현재 배치된 {totalStaff}명에서 <strong style={{ color: '#198754' }}>{Math.abs(summaryStats.recommendedChanges)}명 감축</strong>이 가능합니다. 
              효율적인 인력 재배치를 통해 비용 절감을 달성할 수 있습니다.</>
            ) : (
              <>현재 배치된 {totalStaff}명이 <strong style={{ color: '#198754' }}>적정 수준</strong>입니다. 
              현재의 인력배치를 유지하는 것을 권장합니다.</>
            )}
          </p>
        </div>
      </div>

      {/* 인력배치 차트 */}
      {staffChartData && (
        <div className="p-4 mb-4" style={cardStyle}>
          <h5 className="mb-3" style={{ fontWeight: '600', color: '#2C1F14' }}>
            👥 {displayRegionName} AI 인력배치 추천 분석
          </h5>
          <div style={{ height: '350px' }}>
            <Bar data={staffChartData} options={staffChartOptions} />
          </div>
          <div className="mt-3 p-3 rounded-3" style={{ backgroundColor: 'rgba(184, 134, 11, 0.05)' }}>
            <small style={{ color: '#666' }}>
              <strong>📖 차트 해석:</strong><br/>
              • <span style={{ color: '#ff6384' }}>■</span> <strong>AI 추천 총 인력</strong>: 최종적으로 배치해야 할 전체 인력 수<br/>
              • <span style={{ color: '#36a2eb' }}>■</span> <strong>순수 사망자 기반 인력</strong>: 사망자 예측만을 고려한 기본 인력 수<br/>
              • <span style={{ color: '#ffce56' }}>■</span> <strong>장례식장 가중치</strong>: 지역 장례식장 배치를 고려한 추가/감소 인력 수
            </small>
          </div>
        </div>
      )}

      {/* 월별 상세 데이터 테이블 */}
      {currentStaffData && Array.isArray(currentStaffData) && (
        <div className="p-4" style={cardStyle}>
          <h5 className="mb-3" style={{ fontWeight: '600', color: '#2C1F14' }}>
            📋 {displayRegionName} 월별 AI 인력배치 상세 데이터
          </h5>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <Table striped bordered hover size="sm">
              <thead style={{ backgroundColor: '#f8f9fa', position: 'sticky', top: 0 }}>
                <tr>
                  <th>지역</th>
                  <th>월</th>
                  <th>예측 사망자</th>
                  <th>증가율</th>
                  <th>AI 추천 인력</th>
                  <th>가중치</th>
                  <th>순수 인력</th>
                  <th>효율성</th>
                </tr>
              </thead>
              <tbody>
                {currentStaffData
                  .filter(item => item.regionName !== '전국' && (region === '전체' || item.regionName === region))
                  .map((item, index) => {
                    const pureStaff = (item.staff || 0) - (item.staffChange || 0);
                    const efficiency = item.predictedDeaths > 0 ? ((item.staff || 0) / item.predictedDeaths * 1000).toFixed(1) : '0';
                    
                    return (
                      <tr key={index}>
                        <td style={{ fontWeight: '600' }}>{item.regionName}</td>
                        <td>{item.date}</td>
                        <td>{(item.predictedDeaths || 0).toLocaleString()}명</td>
                        <td style={{ 
                          color: (item.growthRate || 0) >= 0 ? '#dc3545' : '#198754',
                          fontWeight: '600'
                        }}>
                          {(item.growthRate || 0) >= 0 ? '+' : ''}{(item.growthRate || 0).toFixed(1)}%
                        </td>
                        <td style={{ fontWeight: '700', color: '#FF6384' }}>
                          {item.staff || 0}명
                        </td>
                        <td style={{ 
                          color: (item.staffChange || 0) >= 0 ? '#dc3545' : '#198754',
                          fontWeight: '600'
                        }}>
                          {(item.staffChange || 0) > 0 ? '+' : ''}{item.staffChange || 0}명
                        </td>
                        <td style={{ fontWeight: '600', color: '#369CE3' }}>
                          {pureStaff}명
                        </td>
                        <td>
                          <span className={`badge ${parseFloat(efficiency) > 20 ? 'bg-danger' : parseFloat(efficiency) > 15 ? 'bg-warning' : 'bg-success'}`}>
                            {efficiency}‰
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </div>
          <div className="mt-3 text-center">
            <small className="text-muted">
              * 효율성: 예측 사망자 1000명당 배치 인력 수 (‰: 퍼밀, 낮을수록 효율적)
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

// 인력배치 지도 컴포넌트
const StaffMap = ({ selectedRegion, onRegionSelect, staffData }) => {
  const [hoveredRegion, setHoveredRegion] = useState(null);
  
  const themeColors = {
    primaryGradient: 'linear-gradient(135deg, #D4AF37, #F5C23E)',
    activeBackground: 'linear-gradient(135deg, #B8860B, #CD853F)',
    defaultBackground: 'rgba(255, 251, 235, 0.9)',
    defaultColor: '#4A3728',
    activeColor: '#FFFFFF',
    borderColor: 'rgba(184, 134, 11, 0.5)',
    shadowColor: 'rgba(184, 134, 11, 0.45)',
  };

  // 지역별 위치 정보 (더 넓은 지도에 맞게 조정)
  const regionPositions = {
    '서울특별시': { top: '22%', left: '38%', shortName: '서울' },
    '경기도': { top: '12%', left: '40%', shortName: '경기' },
    '인천광역시': { top: '24%', left: '20%', shortName: '인천' },
    '충청남도': { top: '45%', left: '27%', shortName: '충남' },
    '충청북도': { top: '38%', left: '42%', shortName: '충북' },
    '세종특별자치시': { top: '38%', left: '33%', shortName: '세종' },
    '부산광역시': { top: '65%', left: '80%', shortName: '부산' },
    '대구광역시': { top: '53%', left: '68%', shortName: '대구' },
    '광주광역시': { top: '65%', left: '33%', shortName: '광주' },
    '울산광역시': { top: '57%', left: '86%', shortName: '울산' },
    '대전광역시': { top: '40%', left: '38%', shortName: '대전' },
    '강원도': { top: '25%', left: '60%', shortName: '강원' },
    '전라북도': { top: '55%', left: '35%', shortName: '전북' },
    '전라남도': { top: '68%', left: '38%', shortName: '전남' },
    '경상북도': { top: '45%', left: '65%', shortName: '경북' },
    '경상남도': { top: '60%', left: '68%', shortName: '경남' },
    '제주도': { top: '85%', left: '25%', shortName: '제주' }
  };

  // 2024-01 지역별 인력 데이터 가져오기
  const getRegionStaffData = (regionName) => {
    if (!staffData || !Array.isArray(staffData)) return null;
    return staffData.find(item => item.regionName === regionName && item.date === '2024-01');
  };

  // 인근 지역별 인력 이동 추천 계산
  const getStaffRecommendations = (targetRegion) => {
    if (!staffData || !Array.isArray(staffData)) return [];
    
    const currentData = staffData.filter(item => item.date === '2024-01' && item.regionName !== '전국');
    const targetData = currentData.find(item => item.regionName === targetRegion);
    
    if (!targetData) return [];

    // 인력이 부족한 지역인 경우 (staffChange > 0)
    if (targetData.staffChange > 0) {
      return currentData
        .filter(item => item.staffChange < 0 && item.regionName !== targetRegion) // 여유 인력이 있는 지역
        .sort((a, b) => a.staffChange - b.staffChange) // 가장 여유가 많은 순
        .slice(0, 3)
        .map(item => ({
          from: item.regionName,
          to: targetRegion,
          amount: Math.min(Math.abs(item.staffChange), targetData.staffChange),
          type: 'receive'
        }));
    }
    
    // 인력이 여유로운 지역인 경우 (staffChange < 0)
    if (targetData.staffChange < 0) {
      return currentData
        .filter(item => item.staffChange > 0 && item.regionName !== targetRegion) // 인력이 부족한 지역
        .sort((a, b) => b.staffChange - a.staffChange) // 가장 부족한 순
        .slice(0, 3)
        .map(item => ({
          from: targetRegion,
          to: item.regionName,
          amount: Math.min(Math.abs(targetData.staffChange), item.staffChange),
          type: 'send'
        }));
    }

    return [];
  };

  const recommendations = selectedRegion && selectedRegion !== '전체' ? getStaffRecommendations(selectedRegion) : [];

  return (
    <div style={{ position: 'relative', width: '100%', margin: '20px auto 0' }}>
      <button
        onClick={() => onRegionSelect('전체')}
        onMouseEnter={() => setHoveredRegion('전체')}
        onMouseLeave={() => setHoveredRegion(null)}
        style={{
          position: 'absolute',
          top: '-10px',
          left: '-15px',
          zIndex: 10,
          padding: '8px 16px',
          border: `1px solid ${themeColors.borderColor}`,
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '14px',
          transition: 'all 0.2s ease',
          background: selectedRegion === '전체' ? themeColors.activeBackground : themeColors.defaultBackground,
          color: selectedRegion === '전체' ? themeColors.activeColor : themeColors.defaultColor,
          boxShadow: selectedRegion === '전체' || hoveredRegion === '전체' ? `0 8px 25px ${themeColors.shadowColor}` : '0 2px 4px rgba(0,0,0,0.1)',
          transform: selectedRegion === '전체' || hoveredRegion === '전체' ? 'translateY(-2px)' : 'translateY(0)',
        }}
      >
        전체 보기
      </button>

      <img 
        src="/SouthKoreaGreyMap.png" 
        alt="대한민국 지도" 
        style={{ width: '100%', height: 'auto', display: 'block', filter: 'opacity(0.6)' }} 
      />

      {Object.entries(regionPositions).map(([region, pos]) => {
        const isActive = selectedRegion === region;
        const isHovered = hoveredRegion === region;
        const staffInfo = getRegionStaffData(region);
        
        return (
          <div key={region}>
            <button
              onClick={() => onRegionSelect(region)}
              onMouseEnter={() => setHoveredRegion(region)}
              onMouseLeave={() => setHoveredRegion(null)}
              title={`${region}: ${staffInfo?.staff || 0}명 배치`}
              style={{
                position: 'absolute',
                top: pos.top,
                left: pos.left,
                transform: `translate(-50%, -50%) translateY(${isActive || isHovered ? -3 : 0}px)`,
                boxShadow: isActive || isHovered ? `0 8px 25px ${themeColors.shadowColor}` : '0 4px 8px rgba(44, 31, 20, 0.3)',
                zIndex: isActive || isHovered ? 10 : 5,
                width: 'auto',
                height: 'auto',
                padding: '8px 12px',
                border: `2px solid ${isActive ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.5)'}`,
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '12px',
                transition: 'all 0.2s ease',
                background: isActive ? themeColors.activeBackground : themeColors.primaryGradient,
                color: isActive ? themeColors.activeColor : '#2C1F14',
                whiteSpace: 'nowrap',
                flexDirection: 'column',
                display: 'flex',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: '600' }}>{pos.shortName}</div>
              <div style={{ 
                fontSize: '11px', 
                fontWeight: '700',
                color: isActive ? '#FFE4B5' : '#8B4513'
              }}>
                {staffInfo?.staff || 0}명
              </div>
              {staffInfo?.staffChange && (
                <div style={{ 
                  fontSize: '10px', 
                  fontWeight: '600',
                  color: staffInfo.staffChange > 0 ? '#dc3545' : '#198754'
                }}>
                  {staffInfo.staffChange > 0 ? '+' : ''}{staffInfo.staffChange}
                </div>
              )}
            </button>
          </div>
        );
      })}

      {/* 인력 이동 추천 표시 */}
      {selectedRegion && selectedRegion !== '전체' && recommendations.length > 0 && (
        <div style={{
          position: 'absolute',
          bottom: '-60px',
          left: '0',
          right: '0',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '12px',
          padding: '12px',
          border: '1px solid rgba(184, 134, 11, 0.3)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
        }}>
          <h6 style={{ fontSize: '14px', fontWeight: '600', color: '#2C1F14', marginBottom: '8px' }}>
            💡 {regionPositions[selectedRegion]?.shortName || selectedRegion} 인력 이동 추천
          </h6>
          {recommendations.map((rec, index) => (
            <div key={index} style={{ 
              fontSize: '12px', 
              color: '#666', 
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>
                {rec.type === 'receive' ? (
                  <>📥 <strong>{regionPositions[rec.from]?.shortName || rec.from}</strong>에서 <strong>{rec.amount}명</strong> 받기</>
                ) : (
                  <>📤 <strong>{regionPositions[rec.to]?.shortName || rec.to}</strong>로 <strong>{rec.amount}명</strong> 보내기</>
                )}
              </span>
              <span style={{ 
                fontSize: '11px',
                padding: '2px 6px',
                borderRadius: '6px',
                background: rec.type === 'receive' ? 'rgba(220, 53, 69, 0.1)' : 'rgba(25, 135, 84, 0.1)',
                color: rec.type === 'receive' ? '#dc3545' : '#198754'
              }}>
                {rec.type === 'receive' ? '부족' : '여유'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu2_2;
