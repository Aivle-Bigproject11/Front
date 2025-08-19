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
  const [selectedTransfers, setSelectedTransfers] = useState([]);

  // 2024-01 현재 배치 데이터 (시스템 기본 400명)
  const totalStaff = 400;

  // 지역 간 거리 매트릭스 (인접 지역 우선순위)
  const regionProximity = {
    '서울특별시': ['경기도', '인천광역시', '충청남도', '강원도'],
    '경기도': ['서울특별시', '인천광역시', '강원도', '충청남도', '충청북도'],
    '인천광역시': ['서울특별시', '경기도', '충청남도'],
    '부산광역시': ['경상남도', '울산광역시', '경상북도'],
    '대구광역시': ['경상북도', '경상남도', '충청북도', '울산광역시','부산광역시'],
    '광주광역시': ['전라남도', '전라북도', '충청남도'],
    '대전광역시': ['충청남도', '충청북도', '세종특별자치시'],
    '울산광역시': ['부산광역시', '경상남도', '경상북도' , '대구광역시','부산광역시'],
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
        
        console.log('📊 전체 데이터 초기화 완료. 현재 staffData 길이:', staffData.length);
        
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
      
      // 현재 날짜 기준으로 현재 달과 다음 달 데이터 가져오기
      const currentDate = new Date();
      const currentMonthStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      const nextMonth = new Date(currentDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const nextMonthStr = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}`;
      
      const recommendations = [];
      
      // 현재 배치 인력 (현재 달) vs 미래 필요 인력 (다음 달) 비교
      const currentStaffByRegion = {};
      const futureStaffByRegion = {};
      
      // 현재 배치 데이터 수집 (현재 달)
      staffData.filter(item => item.date === currentMonthStr && item.regionName !== '전국')
        .forEach(item => {
          currentStaffByRegion[item.regionName] = item.staff || 0;
        });
      
      // 미래 필요 인력 데이터 수집 (다음 달)
      staffData.filter(item => item.date === nextMonthStr && item.regionName !== '전국')
        .forEach(item => {
          futureStaffByRegion[item.regionName] = item.staff || 0;
        });
      
      console.log('현재 배치 인력:', currentStaffByRegion);
      console.log('AI 추천 인력:', futureStaffByRegion);
      
      // 각 지역별 인력 증감 계산
      const regionChanges = [];
      Object.keys(currentStaffByRegion).forEach(regionName => {
        const currentStaff = currentStaffByRegion[regionName] || 0;
        const futureStaff = futureStaffByRegion[regionName] || 0;
        const difference = futureStaff - currentStaff; // 양수면 인력 추가 필요, 음수면 인력 여유
        
        console.log(`${regionName}: 현재 ${currentStaff}명, AI 추천 ${futureStaff}명, 차이 ${difference}명`);
        
        if (Math.abs(difference) > 0) { // 변화가 있는 경우만
          regionChanges.push({
            regionName,
            currentStaff,
            futureStaff,
            difference,
            needsMore: difference > 0 ? difference : 0,
            hasExtra: difference < 0 ? Math.abs(difference) : 0
          });
        }
      });
      
      // 인력이 부족한 지역과 여유로운 지역 분류
      const deficitRegions = regionChanges.filter(item => item.needsMore > 0)
        .sort((a, b) => b.needsMore - a.needsMore); // 부족한 순서대로
      
      const surplusRegions = regionChanges.filter(item => item.hasExtra > 0)
        .sort((a, b) => b.hasExtra - a.hasExtra); // 여유 많은 순서대로
      
      console.log('인력 부족 지역:', deficitRegions);
      console.log('인력 여유 지역:', surplusRegions);
      
      // 각 부족 지역에 대해 가까운 여유 지역에서 인력 이동 추천
      deficitRegions.forEach(deficitRegion => {
        const needStaff = deficitRegion.needsMore;
        let remainingNeed = needStaff;
        
        console.log(`${deficitRegion.regionName}에 ${needStaff}명 추가 필요`);
        
        // 가까운 지역 우선순위로 정렬
        const nearbyRegions = regionProximity[deficitRegion.regionName] || [];
        const availableSurplus = surplusRegions
          .filter(surplus => nearbyRegions.includes(surplus.regionName) && surplus.hasExtra > 0)
          .concat(surplusRegions.filter(surplus => !nearbyRegions.includes(surplus.regionName) && surplus.hasExtra > 0));
        
        availableSurplus.forEach(surplusRegion => {
          if (remainingNeed <= 0) return;
          
          const availableStaff = surplusRegion.hasExtra;
          const transferAmount = Math.min(remainingNeed, availableStaff);
          
          if (transferAmount > 0) {
            console.log(`이동 추천: ${surplusRegion.regionName} → ${deficitRegion.regionName} (${transferAmount}명)`);
            
            recommendations.push({
              from: surplusRegion.regionName,
              to: deficitRegion.regionName,
              amount: transferAmount,
              distance: nearbyRegions.includes(surplusRegion.regionName) ? 'near' : 'far',
              priority: remainingNeed === needStaff ? 'high' : 'medium',
              reason: `${nextMonthStr} 인력 수요 증가로 ${transferAmount}명 추가 필요`
            });
            
            remainingNeed -= transferAmount;
            surplusRegion.hasExtra -= transferAmount; // 여유 인력 차감
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
            AI 인력배치 최적화
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
              staffData={staffData}
              transferRecommendations={transferRecommendations}
              selectedTransfers={selectedTransfers}
              setSelectedTransfers={setSelectedTransfers}
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
              onTransferSelect={() => {}} // 더 이상 사용하지 않음
            />
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes transferPulse {
          0%, 100% { 
            opacity: 0.7; 
            stroke-width: 3;
          }
          50% { 
            opacity: 1; 
            stroke-width: 4;
          }
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
const OptimizedStaffMap = ({ selectedRegion, onRegionSelect, staffData, transferRecommendations, selectedTransfers, setSelectedTransfers }) => {
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
    '충청북도': { top: '35%', left: '48%', shortName: '충북' },
    '세종특별자치시': { top: '38%', left: '34%', shortName: '세종' },
    '부산광역시': { top: '65%', left: '80%', shortName: '부산' },
    '대구광역시': { top: '53%', left: '68%', shortName: '대구' },
    '광주광역시': { top: '65%', left: '30%', shortName: '광주' },
    '울산광역시': { top: '57%', left: '86%', shortName: '울산' },
    '대전광역시': { top: '43%', left: '40%', shortName: '대전' },
    '강원도': { top: '22%', left: '63%', shortName: '강원' },
    '전라북도': { top: '55%', left: '35%', shortName: '전북' },
    '전라남도': { top: '72%', left: '38%', shortName: '전남' },
    '경상북도': { top: '40%', left: '68%', shortName: '경북' },
    '경상남도': { top: '60%', left: '58%', shortName: '경남' },
    '제주도': { top: '85%', left: '25%', shortName: '제주' }
  };

  // 지역별 인력 데이터 가져오기 (현재 달 기준)
  const getRegionStaffData = (regionName) => {
    if (!staffData || !Array.isArray(staffData)) return null;
    
    // 현재 날짜 기준으로 현재 달 계산
    const currentDate = new Date();
    const currentMonthStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    
    return staffData.find(item => item.regionName === regionName && item.date === currentMonthStr);
  };

  const getRegionBackground = (regionName, isActive, isHovered) => {
    if (isActive) return themeColors.activeBackground;
    
    // staffData가 null이거나 배열이 아니면 기본 색상 반환
    if (!staffData || !Array.isArray(staffData)) {
      return themeColors.primaryGradient;
    }
    
    // 오른쪽 카드와 동일한 로직으로 현재 실 배치 인력과 AI 추천 인력 계산
    const currentDate = new Date();
    const currentMonthStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const nextMonthStr = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}`;
    
    // 현재 달 데이터 (현재 실 배치 인력)
    const currentRegionData = staffData.find(item => 
      item.regionName === regionName && item.date === currentMonthStr
    );
    
    // 다음 달 데이터 (AI 추천 인력)
    const futureRegionData = staffData.find(item => 
      item.regionName === regionName && item.date === nextMonthStr
    );
    
    if (!currentRegionData || !futureRegionData) {
      return themeColors.primaryGradient;
    }
    
    const currentDeployedStaff = currentRegionData.staff || 0; // 현재 실 배치 인력
    const aiRecommendedStaff = futureRegionData.staff || 0; // AI 추천 인력
    
    // 오른쪽 카드와 동일한 비교 로직
    if (currentDeployedStaff === aiRecommendedStaff) {
      return 'rgba(40, 167, 69, 0.7)'; // 동일하면 초록
    } else if (currentDeployedStaff > aiRecommendedStaff) {
      return 'rgba(255, 193, 7, 0.7)'; // 넘치면 노랑
    } else {
      return 'rgba(220, 53, 69, 0.7)'; // 부족하면 빨강
    }
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
          top: '50px',
          left: '50px',
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
        전국
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
          
          // 현재 달 데이터 가져오기
          let staffInfo = null;
          if (staffData && Array.isArray(staffData)) {
            const currentDate = new Date();
            const currentMonthStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
            staffInfo = staffData.find(item => item.regionName === region && item.date === currentMonthStr);
          }
          
          const transfers = getRegionTransfers(region);
          
          return (
            <div key={region}>
              <button
                onClick={() => {
                  onRegionSelect(region);
                  // 해당 지역과 관련된 이동 추천이 있으면 자동으로 표시
                  const regionTransfers = getRegionTransfers(region);
                  if (regionTransfers.length > 0) {
                    // 첫 번째 이동 추천을 선택하거나, 모든 이동 추천을 표시
                    setSelectedTransfers(regionTransfers);
                  } else {
                    setSelectedTransfers([]);
                  }
                }}
                onMouseEnter={() => setHoveredRegion(region)}
                onMouseLeave={() => setHoveredRegion(null)}
                title={(() => {
                  if (!staffData || !Array.isArray(staffData)) {
                    return `${region}: 데이터 로딩 중...`;
                  }
                  
                  const currentDate = new Date();
                  const currentMonthStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
                  
                  const nextMonth = new Date(currentDate);
                  nextMonth.setMonth(nextMonth.getMonth() + 1);
                  const nextMonthStr = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}`;
                  
                  const currentStaffInfo = staffData.find(item => 
                    item.regionName === region && item.date === currentMonthStr
                  );
                  const futureStaffInfo = staffData.find(item => 
                    item.regionName === region && item.date === nextMonthStr
                  );
                  
                  const currentDeployedStaff = currentStaffInfo?.staff || 0;
                  const aiRecommendedStaff = futureStaffInfo?.staff || 0;
                  
                  let status = '';
                  if (currentDeployedStaff === aiRecommendedStaff) {
                    status = '최적 배치';
                  } else if (currentDeployedStaff > aiRecommendedStaff) {
                    status = `과잉 배치 (+${currentDeployedStaff - aiRecommendedStaff}명)`;
                  } else {
                    status = `부족 배치 (-${aiRecommendedStaff - currentDeployedStaff}명)`;
                  }
                  
                  return `${region}: 현재 실 배치 ${currentDeployedStaff}명 / AI 추천 ${aiRecommendedStaff}명 (${status})`;
                })()}
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
                  color: '#2C1F14',
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

      {/* 선택된 이동들에 대한 화살표 표시 */}
      {selectedTransfers.length > 0 && selectedTransfers.map((transfer, index) => (
        <TransferArrow 
          key={`${transfer.from}-${transfer.to}-${index}`}
          from={regionPositions[transfer.from]}
          to={regionPositions[transfer.to]}
          transfer={transfer}
        />
      ))}

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
              background: 'rgba(220, 53, 69, 0.7)',
              borderRadius: '4px',
              display: 'inline-block',
              marginRight: '5px'
            }}></div>
            <small style={{ fontSize: '11px' }}>AI 추천보다 부족</small>
          </Col>
          <Col md={4} className="text-center">
            <div style={{ 
              width: '20px', 
              height: '12px', 
              background: 'rgba(40, 167, 69, 0.7)',
              borderRadius: '4px',
              display: 'inline-block',
              marginRight: '5px'
            }}></div>
            <small style={{ fontSize: '11px' }}>AI 추천과 동일</small>
          </Col>
          <Col md={4} className="text-center">
            <div style={{ 
              width: '20px', 
              height: '12px', 
              background: 'rgba(255, 193, 7, 0.7)',
              borderRadius: '4px',
              display: 'inline-block',
              marginRight: '5px'
            }}></div>
            <small style={{ fontSize: '11px' }}>AI 추천보다 과잉</small>
          </Col>
        </Row>
      </div>
    </div>
  );
};

// 인력 이동 화살표 컴포넌트
const TransferArrow = ({ from, to, transfer }) => {
  if (!from || !to || !transfer || transfer.amount === 0) return null;

  // 퍼센트를 실제 픽셀로 변환하기 위해 지도 컨테이너 크기 기준으로 계산
  const fromX = parseFloat(from.left);
  const fromY = parseFloat(from.top);
  const toX = parseFloat(to.left);
  const toY = parseFloat(to.top);

  // 화살표 시작점과 끝점 계산 (버튼 중심에서 시작/끝)
  const deltaX = toX - fromX;
  const deltaY = toY - fromY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

  // 버튼 크기를 고려한 오프셋 (버튼 가장자리에서 시작/끝나도록)
  const buttonRadius = 1.5; // 버튼 반지름 (퍼센트 단위)
  const offsetRatio = buttonRadius / distance;
  
  const startX = fromX + deltaX * offsetRatio;
  const startY = fromY + deltaY * offsetRatio;
  const endX = toX - deltaX * offsetRatio;
  const endY = toY - deltaY * offsetRatio;
  
  const adjustedDistance = distance - (2 * buttonRadius);

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 15
      }}
    >
      <defs>
        <linearGradient id={`arrowGradient-${transfer.from}-${transfer.to}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor: '#007bff', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: '#dc3545', stopOpacity: 1}} />
        </linearGradient>
        <filter id="arrowShadow">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="rgba(0,0,0,0.2)"/>
        </filter>
        <marker
          id={`arrowhead-${transfer.from}-${transfer.to}`}
          markerWidth="6"
          markerHeight="5"
          refX="5.5"
          refY="2.5"
          orient="auto"
        >
          <polygon
            points="0 0, 6 2.5, 0 5"
            fill="#dc3545"
            filter="url(#arrowShadow)"
          />
        </marker>
      </defs>
      
      {/* 화살표 선 */}
      <line
        x1={`${startX}%`}
        y1={`${startY}%`}
        x2={`${endX}%`}
        y2={`${endY}%`}
        stroke={`url(#arrowGradient-${transfer.from}-${transfer.to})`}
        strokeWidth="3"
        markerEnd={`url(#arrowhead-${transfer.from}-${transfer.to})`}
        filter="url(#arrowShadow)"
        style={{
          animation: 'transferPulse 2s infinite'
        }}
      />
      
      {/* 이동 정보 배경 박스 */}
      <rect
        x={`${(startX + endX) / 2 - 2.5}%`}
        y={`${(startY + endY) / 2 - 1.5}%`}
        width="5%"
        height="1.5%"
        fill="rgba(255, 255, 255, 0.95)"
        stroke="rgba(44, 31, 20, 0.2)"
        strokeWidth="0.5"
        rx="3"
        style={{
          filter: 'url(#arrowShadow)'
        }}
      />
      
      {/* 이동 정보 텍스트 */}
      <text
        x={`${(startX + endX) / 2}%`}
        y={`${(startY + endY) / 2 - 0.8}%`}
        textAnchor="middle"
        style={{
          fill: '#2C1F14',
          fontSize: '10px',
          fontWeight: '700',
          dominantBaseline: 'middle'
        }}
      >
        {transfer.amount}명
      </text>
    </svg>
  );
};

// 최적화된 데이터 표시 컴포넌트
const OptimizedDisplayComponent = ({ 
  region, 
  nationalData, 
  currentStaffData,
  staffChartData,
  transferRecommendations,
  totalStaff,
  onTransferSelect
}) => {
  
  // 지역별 배치현황 통계 계산
  const getRegionDeploymentStats = (region) => {
    if (!currentStaffData || !Array.isArray(currentStaffData)) {
      return { 
        currentDeployedStaff: 0, 
        aiRecommendedStaff: 0,
        efficiencyScore: 0,
        predictedDeaths: 0,
        funeralHallAdjustment: 0,
        status: '정보 없음'
      };
    }

    // 현재 날짜 기준으로 현재 달과 다음 달 데이터 가져오기
    const currentDate = new Date();
    const currentMonthStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const nextMonthStr = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}`;

    if (region === '전체') {
      // 전체 통계 - 현재 달 데이터 사용
      const currentStaffItems = staffData.filter(item => item.date === currentMonthStr && item.regionName !== '전국');
      const futureStaffItems = staffData.filter(item => item.date === nextMonthStr && item.regionName !== '전국');
      
      const totalCurrentStaff = currentStaffItems.reduce((sum, item) => sum + (item.staff || 0), 0);
      const totalFutureStaff = futureStaffItems.reduce((sum, item) => sum + (item.staff || 0), 0);
      const totalPredictedDeaths = futureStaffItems.reduce((sum, item) => sum + (item.predictedDeaths || 0), 0);
      const totalFuneralHallAdjustment = futureStaffItems.reduce((sum, item) => sum + (item.staffChange || 0), 0);
      const avgEfficiency = futureStaffItems.length > 0 ? 
        futureStaffItems.reduce((sum, item) => sum + (item.predictedDeaths > 0 ? (item.staff / item.predictedDeaths * 1000) : 0), 0) / futureStaffItems.length : 0;
      
      return {
        currentDeployedStaff: totalCurrentStaff,
        aiRecommendedStaff: totalFutureStaff,
        efficiencyScore: avgEfficiency.toFixed(1),
        predictedDeaths: totalPredictedDeaths,
        funeralHallAdjustment: totalFuneralHallAdjustment,
        status: totalFuneralHallAdjustment > 0 ? '장례 수요 높음' : totalFuneralHallAdjustment < 0 ? '장례 수요 낮음' : '적정 수준'
      };
    } else {
      // 특정 지역 통계 - 현재 달 데이터 사용
      const currentRegionData = staffData.find(item => item.regionName === region && item.date === currentMonthStr);
      const futureRegionData = staffData.find(item => item.regionName === region && item.date === nextMonthStr);
      
      if (!currentRegionData || !futureRegionData) {
        return { currentDeployedStaff: 0, aiRecommendedStaff: 0, efficiencyScore: 0, predictedDeaths: 0, funeralHallAdjustment: 0, status: '정보 없음' };
      }
      
      const efficiency = futureRegionData.predictedDeaths > 0 ? 
        (futureRegionData.staff / futureRegionData.predictedDeaths * 1000) : 0;
      
      return {
        currentDeployedStaff: currentRegionData.staff || 0,
        aiRecommendedStaff: futureRegionData.staff || 0,
        efficiencyScore: efficiency.toFixed(1),
        predictedDeaths: futureRegionData.predictedDeaths || 0,
        funeralHallAdjustment: futureRegionData.staffChange || 0,
        status: futureRegionData.staffChange > 1 ? '장례 수요 높음' : futureRegionData.staffChange < -1 ? '장례 수요 낮음' : '적정 수준'
      };
    }
  };

  const deploymentStats = getRegionDeploymentStats(region);
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

      {/* 지역별 배치현황 카드 */}
      <div className="p-4 mb-4" style={cardStyle}>
        <h5 className="mb-3" style={{ fontWeight: '600', color: '#2C1F14' }}>
            {displayRegionName} 인력 배치현황
        </h5>
        <Row className="g-3">
          <Col md={3}>
            <div className="text-center p-3 rounded-3" style={{ backgroundColor: 'rgba(40, 167, 69, 0.1)' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#28a745' }}>
                {deploymentStats.currentDeployedStaff}명
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>현재 실 배치 인력</div>
            </div>
          </Col>
          <Col md={3}>
            <div className="text-center p-3 rounded-3" style={{ backgroundColor: 'rgba(54, 162, 235, 0.1)' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#369CE3' }}>
                {deploymentStats.aiRecommendedStaff}명
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>AI 추천 인력</div>
            </div>
          </Col>
          <Col md={3}>
            <div className="text-center p-3 rounded-3" style={{ backgroundColor: 'rgba(255, 206, 84, 0.1)' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#FFCE54' }}>
                {deploymentStats.efficiencyScore}‰
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>효율성 지수</div>
            </div>
          </Col>
          <Col md={3}>
            <div className="text-center p-3 rounded-3" style={{ backgroundColor: 'rgba(108, 117, 125, 0.1)' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#6c757d' }}>
                {deploymentStats.predictedDeaths}명
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>예측 사망자</div>
            </div>
          </Col>
        </Row>

        {/* 지역별 상세 정보 */}
        {region !== '전체' && (
          <div className="mt-3 p-3 rounded-3" style={{ backgroundColor: 'rgba(248, 249, 250, 0.8)' }}>
            <Row className="text-center">
              <Col md={4}>
                <small style={{ color: '#666', fontSize: '11px', display: 'block' }}>인력 증감 필요</small>
                <span style={{ 
                  fontSize: '14px', 
                  fontWeight: '600',
                  color: (deploymentStats.currentDeployedStaff - deploymentStats.aiRecommendedStaff) > 0 ? '#dc3545' : 
                         (deploymentStats.currentDeployedStaff - deploymentStats.aiRecommendedStaff) < 0 ? '#28a745' : '#666'
                }}>
                  {(deploymentStats.currentDeployedStaff - deploymentStats.aiRecommendedStaff) > 0 ? '+' : ''}
                  {deploymentStats.currentDeployedStaff - deploymentStats.aiRecommendedStaff}명
                </span>
              </Col>
              <Col md={4}>
                <small style={{ color: '#666', fontSize: '11px', display: 'block' }}>장례식장 조정</small>
                <span style={{ 
                  fontSize: '14px', 
                  fontWeight: '600',
                  color: deploymentStats.funeralHallAdjustment > 0 ? '#dc3545' : deploymentStats.funeralHallAdjustment < 0 ? '#28a745' : '#666'
                }}>
                  {deploymentStats.funeralHallAdjustment > 0 ? '+' : ''}{deploymentStats.funeralHallAdjustment}명
                </span>
              </Col>
              <Col md={4}>
                <small style={{ color: '#666', fontSize: '11px', display: 'block' }}>효율성 등급</small>
                <span className={`badge ${parseFloat(deploymentStats.efficiencyScore) > 20 ? 'bg-danger' : 
                                         parseFloat(deploymentStats.efficiencyScore) > 15 ? 'bg-warning' : 'bg-success'}`}>
                  {parseFloat(deploymentStats.efficiencyScore) > 20 ? '개선 필요' : 
                   parseFloat(deploymentStats.efficiencyScore) > 15 ? '보통' : '우수'}
                </span>
              </Col>
            </Row>
          </div>
        )}
      </div>

      {/* 인력 이동 추천 목록 */}
      <div className="p-4 mb-4" style={cardStyle}>
        <h5 className="mb-3" style={{ fontWeight: '600', color: '#2C1F14' }}>
          🔄 AI 인력 이동 추천 계획 {region !== '전체' && `(${region} 관련)`}
        </h5>
        {(() => {
          // 지역별 필터링
          let filteredRecommendations = transferRecommendations;
          if (region !== '전체') {
            filteredRecommendations = transferRecommendations.filter(transfer => 
              transfer.from === region || transfer.to === region
            );
          }

          return filteredRecommendations.length > 0 ? (
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {filteredRecommendations.map((transfer, index) => {
                // 현재 지역이 보내는 곳인지 받는 곳인지 확인
                const isSending = region !== '전체' && transfer.from === region;
                const isReceiving = region !== '전체' && transfer.to === region;
                
                return (
                  <div key={index} className="d-flex justify-content-between align-items-center p-3 mb-2 rounded-3" style={{
                    background: isSending ? 'rgba(0, 123, 255, 0.05)' : isReceiving ? 'rgba(220, 53, 69, 0.05)' : 
                               transfer.priority === 'high' ? 'rgba(220, 53, 69, 0.05)' : 'rgba(255, 193, 7, 0.05)',
                    border: isSending ? '1px solid rgba(0, 123, 255, 0.2)' : isReceiving ? '1px solid rgba(220, 53, 69, 0.2)' :
                           `1px solid ${transfer.priority === 'high' ? 'rgba(220, 53, 69, 0.2)' : 'rgba(255, 193, 7, 0.2)'}`
                  }}>
                    <div className="flex-grow-1">
                      <div style={{ fontWeight: '600', color: '#2C1F14' }}>
                        <span style={{ color: '#007bff', fontWeight: '700' }}>
                          📤 {transfer.from}
                        </span> → 
                        <span style={{ color: '#dc3545', fontWeight: '700' }}>
                          📥 {transfer.to}
                        </span>
                        {region !== '전체' && (
                          <span style={{ 
                            marginLeft: '10px',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            color: 'white',
                            backgroundColor: isSending ? '#007bff' : '#dc3545'
                          }}>
                            {isSending ? '보내기' : '받기'}
                          </span>
                        )}
                      </div>
                      <small style={{ color: '#666' }}>
                        {transfer.amount}명 이동 • {transfer.distance === 'near' ? '🔸 인근 지역' : '🔹 원거리'} • 
                        우선순위: {transfer.priority === 'high' ? '높음' : '보통'}
                        {transfer.reason && <><br/>💡 {transfer.reason}</>}
                      </small>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center p-4" style={{ color: '#666' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>✅</div>
              <h6>
                {region === '전체' ? '현재 인력배치가 최적 상태입니다' : `${region}는 인력 이동이 필요하지 않습니다`}
              </h6>
              <small>
                {region === '전체' ? '추가적인 인력 이동이 필요하지 않습니다.' : '해당 지역과 관련된 인력 이동 계획이 없습니다.'}
              </small>
            </div>
          );
        })()}
      </div>

      

      {/* 상세 예측 데이터 및 시계열 데이터 조회 카드 */}
      <div className="p-4 mb-4" style={{
        ...cardStyle,
        background: 'linear-gradient(135deg, rgba(54, 162, 235, 0.1) 0%, rgba(75, 192, 192, 0.1) 100%)',
        border: '2px solid rgba(54, 162, 235, 0.3)'
      }}>
        <div className="text-center">
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>📊</div>
          <h4 className="mb-3" style={{ fontWeight: '700', color: '#369CE3' }}>
            사망자 상세 예측 데이터 및 시계열 분석 조회
          </h4>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '25px' }}>
            {region === '전체' ? '전국' : region}의 상세한 사망자 예측 데이터와 시계열 차트를 확인하세요
          </p>
          <Button 
            variant="primary" 
            size="lg"
            style={{
              padding: '12px 30px',
              fontSize: '16px',
              fontWeight: '600',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #369CE3, #4BC0C0)',
              border: 'none',
              boxShadow: '0 4px 15px rgba(54, 162, 235, 0.3)'
            }}
            onClick={() => {
              // Menu2F로 이동하면서 선택된 지역 정보 전달
              window.location.href = `/menu2f?region=${encodeURIComponent(region)}`;
            }}
          >
            🔍 상세 분석 페이지로 이동
          </Button>
        </div>
      </div>

      {/* 3개월 예측 데이터 테이블 */}
      {currentStaffData && Array.isArray(currentStaffData) && (
        <div className="p-4" style={cardStyle}>
          <div className="mb-3">
            <h5 style={{ fontWeight: '600', color: '#2C1F14', marginBottom: 0 }}>
              📋 {displayRegionName} 3개월 예측 배치 계획
            </h5>
          </div>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <Table striped bordered hover size="sm">
              <thead style={{ backgroundColor: '#f8f9fa', position: 'sticky', top: 0 }}>
                <tr>
                  <th>지역</th>
                  <th>현재 배치</th>
                  <th>9월 예측</th>
                  <th>10월 예측</th>
                  <th>11월 예측</th>
                  <th>평균 효율성</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  // 현재 날짜 기준으로 3개월 데이터 가져오기
                  const currentDate = new Date();
                  const months = [];
                  for (let i = 1; i <= 3; i++) {
                    const futureMonth = new Date(currentDate);
                    futureMonth.setMonth(futureMonth.getMonth() + i);
                    months.push(`${futureMonth.getFullYear()}-${String(futureMonth.getMonth() + 1).padStart(2, '0')}`);
                  }
                  
                  // 현재 배치 데이터 (2024-01)
                  const currentData = staffData.filter(item => item.date === '2024-01' && item.regionName !== '전국' && (region === '전체' || item.regionName === region));
                  
                  // 3개월 미래 데이터
                  const futureDataByMonth = months.map(monthStr => 
                    staffData.filter(item => item.date === monthStr && item.regionName !== '전국' && (region === '전체' || item.regionName === region))
                  );
                  
                  // 데이터 매핑
                  const combinedData = currentData.map(currentItem => {
                    const futureMonthsData = futureDataByMonth.map(monthData => 
                      monthData.find(f => f.regionName === currentItem.regionName) || { staff: 0, staffChange: 0, predictedDeaths: 0 }
                    );
                    
                    const avgEfficiency = futureMonthsData.reduce((sum, monthData) => {
                      return sum + (monthData.predictedDeaths > 0 ? (monthData.staff / monthData.predictedDeaths * 1000) : 0);
                    }, 0) / futureMonthsData.length;
                    
                    const avgStaffChange = futureMonthsData.reduce((sum, monthData) => sum + (monthData.staffChange || 0), 0) / futureMonthsData.length;
                    
                    return {
                      ...currentItem,
                      futureMonths: futureMonthsData,
                      avgEfficiency: avgEfficiency.toFixed(1),
                      avgStaffChange
                    };
                  });
                  
                  return combinedData.map((item, index) => {
                    const currentDeployed = item.staff || 0;
                    const statusColor = item.avgStaffChange > 1 ? '#dc3545' : item.avgStaffChange < -1 ? '#198754' : '#ffc107';
                    const statusText = item.avgStaffChange > 1 ? '증가 추세' : item.avgStaffChange < -1 ? '감소 추세' : '안정';
                    
                    return (
                      <tr key={index}>
                        <td style={{ fontWeight: '600' }}>
                          {item.regionName}
                        </td>
                        <td style={{ fontWeight: '700', color: '#28a745' }}>
                          {currentDeployed}명
                        </td>
                        {item.futureMonths.map((monthData, monthIndex) => (
                          <td key={monthIndex} style={{ 
                            fontWeight: '600', 
                            color: monthData.staff > currentDeployed ? '#dc3545' : monthData.staff < currentDeployed ? '#198754' : '#369CE3'
                          }}>
                            {monthData.staff || 0}명
                            {monthData.staffChange !== 0 && (
                              <small style={{ display: 'block', fontSize: '10px', color: '#666' }}>
                                장례:{monthData.staffChange > 0 ? '+' : ''}{monthData.staffChange}
                              </small>
                            )}
                          </td>
                        ))}
                        <td>
                          <span className={`badge ${parseFloat(item.avgEfficiency) > 20 ? 'bg-danger' : parseFloat(item.avgEfficiency) > 15 ? 'bg-warning' : 'bg-success'}`}>
                            {item.avgEfficiency}‰
                          </span>
                        </td>
                        <td>
                          <span className="badge" style={{ backgroundColor: statusColor, color: 'white' }}>
                            {statusText}
                          </span>
                        </td>
                      </tr>
                    );
                  });
                })()}
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
