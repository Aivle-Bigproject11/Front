import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Card, Button } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import staffData from '../assets/dataset/Predcit_rf_Result_min.json';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Menu2N = () => {
  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [animateCard, setAnimateCard] = useState(false);
  const [currentStaffData, setCurrentStaffData] = useState(null);
  const [nationalData, setNationalData] = useState(null);
  const [staffChartData, setStaffChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transferRecommendations, setTransferRecommendations] = useState([]);

  // 2024-01 현재 배치 데이터 (시스템 기본 400명)
  const totalStaff = 400;

  // 지역 간 거리 매트릭스 (인접 지역 우선순위)
  const regionProximity = {
    '서울특별시': ['경기도', '인천광역시', '충청남도', '강원도'],
    '경기도': ['서울특별시', '인천광역시', '강원도', '충청남도', '충청북도'],
    '인천광역시': ['서울특별시', '경기도', '충청남도'],
    '부산광역시': ['경상남도', '울산광역시', '경상북도'],
    '대구광역시': ['경상북도', '경상남도', '충청북도'],
    '광주광역시': ['전라남도', '전라북도', '충청남도'],
    '대전광역시': ['충청남도', '충청북도', '세종특별자치시'],
    '울산광역시': ['부산광역시', '경상남도', '경상북도'],
    '세종특별자치시': ['충청남도', '충청북도', '대전광역시'],
    '강원도': ['경기도', '서울특별시', '충청북도', '경상북도'],
    '충청북도': ['충청남도', '경기도', '강원도', '대전광역시', '경상북도'],
    '충청남도': ['세종특별자치시', '대전광역시', '충청북도', '경기도', '전라북도'],
    '전라북도': ['전라남도', '충청남도', '광주광역시', '경상남도'],
    '전라남도': ['광주광역시', '전라북도', '제주도'],
    '경상북도': ['대구광역시', '경상남도', '강원도', '충청북도', '울산광역시'],
    '경상남도': ['부산광역시', '울산광역시', '대구광역시', '경상북도', '전라북도'],
    '제주도': ['전라남도']
  };

  // 표시용 지역명 계산 (전체 -> 전국)
  const getDisplayRegionName = (regionName) => {
    return regionName === '전체' ? '전국' : regionName;
  };

  // 초기 데이터 로딩
  useEffect(() => {
    const initializeData = async () => {
      console.log('📊 Menu2N AI 인력배치 최적화 페이지 초기화 시작...');
      
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
        
        // 인력 이동 추천 계산
        calculateTransferRecommendations(regionData);
        
        console.log('✅ Menu2N 데이터 초기화 완료');
        
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
      console.log(`📍 ${region} 지역 데이터 로딩 중...`);
      
      let regionData;
      
      if (region === '전체') {
        // 전체 선택 시 모든 지역의 월별 데이터
        regionData = staffData.filter(item => item.regionName !== '전국');
      } else {
        // 특정 지역 선택 시 해당 지역의 모든 월 데이터
        regionData = staffData.filter(item => item.regionName === region);
      }
      
      // 차트 데이터 생성
      generateStaffChartData(region, regionData);
      
      console.log(`✅ ${region} 데이터 로딩 완료`);
      
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

  // 인력 이동 추천 계산
  const calculateTransferRecommendations = (regionData) => {
    try {
      console.log('🔄 인력 이동 추천 계산 시작...');
      
      // 인력이 부족한 지역과 여유로운 지역 분류
      const deficitRegions = regionData.filter(item => item.staffChange > 0)
        .sort((a, b) => b.staffChange - a.staffChange); // 부족한 순서대로
      
      const surplusRegions = regionData.filter(item => item.staffChange < 0)
        .sort((a, b) => a.staffChange - b.staffChange); // 여유 많은 순서대로
      
      const recommendations = [];
      
      // 각 부족 지역에 대해 가까운 여유 지역에서 인력 이동 추천
      deficitRegions.forEach(deficitRegion => {
        const needStaff = deficitRegion.staffChange;
        let remainingNeed = needStaff;
        
        // 가까운 지역 우선순위로 정렬
        const nearbyRegions = regionProximity[deficitRegion.regionName] || [];
        const availableSurplus = surplusRegions
          .filter(surplus => nearbyRegions.includes(surplus.regionName) && surplus.staffChange < 0)
          .concat(surplusRegions.filter(surplus => !nearbyRegions.includes(surplus.regionName) && surplus.staffChange < 0));
        
        availableSurplus.forEach(surplusRegion => {
          if (remainingNeed <= 0) return;
          
          const availableStaff = Math.abs(surplusRegion.staffChange);
          const transferAmount = Math.min(remainingNeed, availableStaff);
          
          if (transferAmount > 0) {
            recommendations.push({
              from: surplusRegion.regionName,
              to: deficitRegion.regionName,
              amount: transferAmount,
              distance: nearbyRegions.includes(surplusRegion.regionName) ? 'near' : 'far',
              priority: remainingNeed === needStaff ? 'high' : 'medium'
            });
            
            remainingNeed -= transferAmount;
            surplusRegion.staffChange += transferAmount; // 여유 인력 차감
          }
        });
      });
      
      setTransferRecommendations(recommendations);
      console.log('✅ 인력 이동 추천 계산 완료:', recommendations);
      
    } catch (error) {
      console.error('인력 이동 추천 계산 실패:', error);
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
        <div style={{ flex: '0 0 50%', display: 'flex', flexDirection: 'column' }}>
          <h4 className="mb-3" style={{ 
            fontSize: '32px', 
            fontWeight: '700', 
            color: '#2C1F14',
            paddingLeft: '10px',
            textAlign: 'center'
          }}>
            🎯 AI 인력배치 최적화
          </h4>
          <div className="dashboard-left" style={{
            background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.12) 0%, rgba(205, 133, 63, 0.08) 100%)',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 20px rgba(44, 31, 20, 0.12)',
            border: '1px solid rgba(184, 134, 11, 0.2)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <OptimizedStaffMap
              selectedRegion={selectedRegion}
              onRegionSelect={setSelectedRegion}
              staffData={currentStaffData}
              transferRecommendations={transferRecommendations}
            />
            
            {/* 현재 배치 인력 정보 */}
            <div className="mt-3 p-3 rounded-3" style={{
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(184, 134, 11, 0.2)',
              flexShrink: 0
            }}>
              <h6 className="mb-2" style={{ color: '#2C1F14', fontWeight: '600' }}>
                📊 시스템 인력 현황 (2024-01)
              </h6>
              <Row>
                <Col md={6}>
                  <div className="d-flex justify-content-between align-items-center">
                    <span style={{ fontSize: '14px', color: '#666' }}>총 가용 인력:</span>
                    <span style={{ fontSize: '18px', fontWeight: '700', color: '#B8860B' }}>
                      {totalStaff}명
                    </span>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="d-flex justify-content-between align-items-center">
                    <span style={{ fontSize: '14px', color: '#666' }}>AI 권장 이동:</span>
                    <span style={{ fontSize: '18px', fontWeight: '700', color: '#dc3545' }}>
                      {transferRecommendations.length}건
                    </span>
                  </div>
                </Col>
              </Row>
              <div className="mt-2 text-center">
                <small style={{ color: '#666', fontSize: '12px' }}>
                  AI가 분석한 최적 인력 재배치 계획
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 영역 (데이터 분석) */}
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
                🤖 AI 최적화 분석 중...
              </div>
              <div style={{ fontSize: '14px', opacity: 0.7 }}>
                잠시만 기다려주세요
              </div>
            </div>
          ) : (
            <OptimizedDisplayComponent 
              region={selectedRegion}
              nationalData={nationalData}
              currentStaffData={currentStaffData}
              staffChartData={staffChartData}
              transferRecommendations={transferRecommendations}
              totalStaff={totalStaff}
            />
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .dashboard-container { opacity: 0; }
        .animate-in { animation: fadeIn 0.6s ease-out forwards; }

        .dashboard-right::-webkit-scrollbar { width: 6px; }
        .dashboard-right::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
        .dashboard-right::-webkit-scrollbar-thumb {
          background-color: rgba(184, 134, 11, 0.5);
          border-radius: 10px;
        }

        @media (max-width: 1200px) {
          .page-wrapper { height: auto; min-height: calc(100vh - var(--navbar-height)); }
          .dashboard-container { flex-direction: column; height: auto; }
          .dashboard-left { position: static !important; width: 100%; flex: 0 0 auto; }
          .dashboard-right { height: auto; max-height: none; }
        }
      `}</style>
    </div>
  );
};

// 최적화된 인력배치 지도 컴포넌트
const OptimizedStaffMap = ({ selectedRegion, onRegionSelect, staffData, transferRecommendations }) => {
  const [hoveredRegion, setHoveredRegion] = useState(null);
  
  const themeColors = {
    primaryGradient: 'linear-gradient(135deg, #D4AF37, #F5C23E)',
    activeBackground: 'linear-gradient(135deg, #B8860B, #CD853F)',
    deficitBackground: 'linear-gradient(135deg, #dc3545, #c82333)',
    surplusBackground: 'linear-gradient(135deg, #28a745, #20c997)',
    defaultBackground: 'rgba(255, 251, 235, 0.9)',
    defaultColor: '#4A3728',
    activeColor: '#FFFFFF',
    borderColor: 'rgba(184, 134, 11, 0.5)',
    shadowColor: 'rgba(184, 134, 11, 0.45)',
  };

  // 지역별 위치 정보 (최적화된 레이아웃)
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

  // 지역별 인력 데이터 가져오기
  const getRegionStaffData = (regionName) => {
    if (!staffData || !Array.isArray(staffData)) return null;
    return staffData.find(item => item.regionName === regionName && item.date === '2024-01');
  };

  // 지역 배경색 결정 (부족/여유/중립)
  const getRegionBackground = (regionName, isActive, isHovered) => {
    const staffInfo = getRegionStaffData(regionName);
    if (!staffInfo) return isActive ? themeColors.activeBackground : themeColors.primaryGradient;
    
    if (isActive) return themeColors.activeBackground;
    
    if (staffInfo.staffChange > 2) return themeColors.deficitBackground;
    if (staffInfo.staffChange < -2) return themeColors.surplusBackground;
    return themeColors.primaryGradient;
  };

  // 해당 지역과 관련된 이동 추천 가져오기
  const getRegionTransfers = (regionName) => {
    return transferRecommendations.filter(transfer => 
      transfer.from === regionName || transfer.to === regionName
    );
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <button
        onClick={() => onRegionSelect('전체')}
        onMouseEnter={() => setHoveredRegion('전체')}
        onMouseLeave={() => setHoveredRegion(null)}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
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

      <div style={{ position: 'relative', flex: 1 }}>
        <img 
          src="/SouthKoreaGreyMap.png" 
          alt="대한민국 지도" 
          style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'opacity(0.6)' }} 
        />

        {Object.entries(regionPositions).map(([region, pos]) => {
          const isActive = selectedRegion === region;
          const isHovered = hoveredRegion === region;
          const staffInfo = getRegionStaffData(region);
          const transfers = getRegionTransfers(region);
          
          return (
            <div key={region}>
              <button
                onClick={() => onRegionSelect(region)}
                onMouseEnter={() => setHoveredRegion(region)}
                onMouseLeave={() => setHoveredRegion(null)}
                title={`${region}: ${staffInfo?.staff || 0}명 배치 (${staffInfo?.staffChange > 0 ? '+' : ''}${staffInfo?.staffChange || 0})`}
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
                  fontSize: '13px',
                  transition: 'all 0.2s ease',
                  background: getRegionBackground(region, isActive, isHovered),
                  color: '#FFFFFF',
                  whiteSpace: 'nowrap',
                  flexDirection: 'column',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px'
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: '600' }}>{pos.shortName}</div>
                <div style={{ fontSize: '11px', fontWeight: '700' }}>
                  {staffInfo?.staff || 0}명
                </div>
                {transfers.length > 0 && (
                  <div style={{ 
                    fontSize: '10px', 
                    fontWeight: '600',
                    color: '#FFE4B5',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                  }}>
                    🔄 {transfers.length}건
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* 범례 */}
      <div className="mt-3 p-2 rounded-3" style={{
        background: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid rgba(184, 134, 11, 0.2)',
        flexShrink: 0
      }}>
        <h6 style={{ fontSize: '12px', fontWeight: '600', color: '#2C1F14', marginBottom: '8px' }}>
          🎨 지역 상태 범례
        </h6>
        <Row>
          <Col md={4} className="text-center">
            <div style={{ 
              width: '20px', 
              height: '12px', 
              background: themeColors.deficitBackground,
              borderRadius: '4px',
              display: 'inline-block',
              marginRight: '5px'
            }}></div>
            <small style={{ fontSize: '11px' }}>인력 부족</small>
          </Col>
          <Col md={4} className="text-center">
            <div style={{ 
              width: '20px', 
              height: '12px', 
              background: themeColors.primaryGradient,
              borderRadius: '4px',
              display: 'inline-block',
              marginRight: '5px'
            }}></div>
            <small style={{ fontSize: '11px' }}>적정 수준</small>
          </Col>
          <Col md={4} className="text-center">
            <div style={{ 
              width: '20px', 
              height: '12px', 
              background: themeColors.surplusBackground,
              borderRadius: '4px',
              display: 'inline-block',
              marginRight: '5px'
            }}></div>
            <small style={{ fontSize: '11px' }}>인력 여유</small>
          </Col>
        </Row>
      </div>
    </div>
  );
};

// 최적화된 데이터 표시 컴포넌트
const OptimizedDisplayComponent = ({ 
  region, 
  nationalData, 
  currentStaffData,
  staffChartData,
  transferRecommendations,
  totalStaff
}) => {
  
  // 인력배치 최적화 요약 통계 계산
  const getOptimizationStats = () => {
    if (!currentStaffData || !Array.isArray(currentStaffData)) {
      return { 
        totalRecommendedStaff: 0, 
        totalTransfers: 0,
        efficiencyGain: 0,
        costSaving: 0
      };
    }

    const staffItems = currentStaffData.filter(item => item.staff !== undefined && item.regionName !== '전국');
    const totalRecommendedStaff = staffItems.reduce((sum, item) => sum + (item.staff || 0), 0);
    const totalTransfers = transferRecommendations.length;
    const transferAmount = transferRecommendations.reduce((sum, transfer) => sum + transfer.amount, 0);
    
    // 효율성 개선 계산 (이동 인력 대비 개선도)
    const efficiencyGain = transferAmount > 0 ? ((transferAmount / totalStaff) * 100) : 0;
    
    // 비용 절감 계산 (가상의 계산식)
    const costSaving = transferAmount * 50000; // 인당 월 50,000원 절감 가정

    return {
      totalRecommendedStaff,
      totalTransfers,
      efficiencyGain: efficiencyGain.toFixed(1),
      costSaving
    };
  };

  const optimizationStats = getOptimizationStats();
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
      legend: { position: 'top' },
      title: {
        display: true,
        text: `${displayRegionName} AI 최적화 인력배치 분석`,
        font: { size: 16, weight: 'bold' }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: '인력 수 (명)' }
      },
      x: {
        title: { display: true, text: '월' }
      }
    },
  };

  return (
    <div>
      {/* 제목 */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ fontWeight: '700', color: '#343a40' }}>
          <i className="fas fa-chart-line me-2" style={{ color: '#D4AF37' }}></i>
          {displayRegionName} AI 최적화 분석
        </h2>
        <small className="text-muted">
          데이터 소스: AI 머신러닝 최적화 모델
        </small>
      </div>

      {/* AI 최적화 요약 통계 */}
      <div className="p-4 mb-4" style={cardStyle}>
        <h5 className="mb-3" style={{ fontWeight: '600', color: '#2C1F14' }}>
          🚀 AI 최적화 성과 요약
        </h5>
        <Row className="g-3">
          <Col md={3}>
            <div className="text-center p-3 rounded-3" style={{ backgroundColor: 'rgba(255, 99, 132, 0.1)' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#FF6384' }}>
                {optimizationStats.totalRecommendedStaff}명
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>AI 추천 총 인력</div>
            </div>
          </Col>
          <Col md={3}>
            <div className="text-center p-3 rounded-3" style={{ backgroundColor: 'rgba(54, 162, 235, 0.1)' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#369CE3' }}>
                {optimizationStats.totalTransfers}건
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>인력 이동 권장</div>
            </div>
          </Col>
          <Col md={3}>
            <div className="text-center p-3 rounded-3" style={{ backgroundColor: 'rgba(255, 206, 84, 0.1)' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#FFCE54' }}>
                {optimizationStats.efficiencyGain}%
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>효율성 개선</div>
            </div>
          </Col>
          <Col md={3}>
            <div className="text-center p-3 rounded-3" style={{ backgroundColor: 'rgba(75, 192, 192, 0.1)' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#4BC0C0' }}>
                ₩{optimizationStats.costSaving.toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>월간 절감 예상</div>
            </div>
          </Col>
        </Row>
      </div>

      {/* 인력 이동 추천 목록 */}
      <div className="p-4 mb-4" style={cardStyle}>
        <h5 className="mb-3" style={{ fontWeight: '600', color: '#2C1F14' }}>
          🔄 AI 인력 이동 추천 계획
        </h5>
        {transferRecommendations.length > 0 ? (
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {transferRecommendations.map((transfer, index) => (
              <div key={index} className="d-flex justify-content-between align-items-center p-3 mb-2 rounded-3" style={{
                background: transfer.priority === 'high' ? 'rgba(220, 53, 69, 0.05)' : 'rgba(255, 193, 7, 0.05)',
                border: `1px solid ${transfer.priority === 'high' ? 'rgba(220, 53, 69, 0.2)' : 'rgba(255, 193, 7, 0.2)'}`
              }}>
                <div className="flex-grow-1">
                  <div style={{ fontWeight: '600', color: '#2C1F14' }}>
                    📤 <strong>{transfer.from.replace(/특별시|광역시|특별자치시|도$/g, '')}</strong> → 
                    📥 <strong>{transfer.to.replace(/특별시|광역시|특별자치시|도$/g, '')}</strong>
                  </div>
                  <small style={{ color: '#666' }}>
                    {transfer.amount}명 이동 • {transfer.distance === 'near' ? '🔸 인근 지역' : '🔹 원거리'} • 
                    우선순위: {transfer.priority === 'high' ? '높음' : '보통'}
                  </small>
                </div>
                <Button 
                  size="sm" 
                  variant={transfer.priority === 'high' ? 'danger' : 'warning'}
                  style={{ fontSize: '12px', padding: '4px 8px' }}
                >
                  {transfer.priority === 'high' ? '즉시 시행' : '검토 필요'}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-4" style={{ color: '#666' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>✅</div>
            <h6>현재 인력배치가 최적 상태입니다</h6>
            <small>추가적인 인력 이동이 필요하지 않습니다.</small>
          </div>
        )}
      </div>

      {/* 인력배치 차트 */}
      {staffChartData && (
        <div className="p-4 mb-4" style={cardStyle}>
          <h5 className="mb-3" style={{ fontWeight: '600', color: '#2C1F14' }}>
            📊 {displayRegionName} 월별 인력배치 추이
          </h5>
          <div style={{ height: '350px' }}>
            <Bar data={staffChartData} options={staffChartOptions} />
          </div>
          <div className="mt-3 p-3 rounded-3" style={{ backgroundColor: 'rgba(184, 134, 11, 0.05)' }}>
            <small style={{ color: '#666' }}>
              <strong>📖 차트 해석:</strong><br/>
              • <span style={{ color: '#ff6384' }}>■</span> <strong>AI 추천 총 인력</strong>: 최종적으로 배치해야 할 전체 인력 수<br/>
              • <span style={{ color: '#36a2eb' }}>■</span> <strong>순수 사망자 기반 인력</strong>: 사망자 예측만을 고려한 기본 인력 수<br/>
              • <span style={{ color: '#ffce56' }}>■</span> <strong>장례식장 가중치</strong>: 지역 장례식장 배치를 고려한 조정 인력 수
            </small>
          </div>
        </div>
      )}

      {/* 월별 상세 데이터 테이블 */}
      {currentStaffData && Array.isArray(currentStaffData) && (
        <div className="p-4" style={cardStyle}>
          <h5 className="mb-3" style={{ fontWeight: '600', color: '#2C1F14' }}>
            📋 {displayRegionName} 상세 최적화 데이터
          </h5>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <Table striped bordered hover size="sm">
              <thead style={{ backgroundColor: '#f8f9fa', position: 'sticky', top: 0 }}>
                <tr>
                  <th>지역</th>
                  <th>현재 인력</th>
                  <th>AI 추천</th>
                  <th>조정 필요</th>
                  <th>효율성</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {currentStaffData
                  .filter(item => item.regionName !== '전국' && (region === '전체' || item.regionName === region))
                  .map((item, index) => {
                    const efficiency = item.predictedDeaths > 0 ? ((item.staff || 0) / item.predictedDeaths * 1000).toFixed(1) : '0';
                    const statusColor = item.staffChange > 2 ? '#dc3545' : item.staffChange < -2 ? '#198754' : '#ffc107';
                    const statusText = item.staffChange > 2 ? '부족' : item.staffChange < -2 ? '여유' : '적정';
                    
                    return (
                      <tr key={index}>
                        <td style={{ fontWeight: '600' }}>
                          {item.regionName.replace(/특별시|광역시|특별자치시|도$/g, '')}
                        </td>
                        <td>{item.staff || 0}명</td>
                        <td style={{ fontWeight: '700', color: '#FF6384' }}>
                          {item.staff || 0}명
                        </td>
                        <td style={{ 
                          color: item.staffChange > 0 ? '#dc3545' : item.staffChange < 0 ? '#198754' : '#666',
                          fontWeight: '600'
                        }}>
                          {item.staffChange > 0 ? '+' : ''}{item.staffChange || 0}명
                        </td>
                        <td>
                          <span className={`badge ${parseFloat(efficiency) > 20 ? 'bg-danger' : parseFloat(efficiency) > 15 ? 'bg-warning' : 'bg-success'}`}>
                            {efficiency}‰
                          </span>
                        </td>
                        <td>
                          <span className="badge" style={{ backgroundColor: statusColor, color: 'white' }}>
                            {statusText}
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

export default Menu2N;
