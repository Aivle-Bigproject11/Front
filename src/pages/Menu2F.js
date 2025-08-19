import React, { useState, useEffect } from 'react';
import InteractiveMap from '../components/InteractiveMap';
import { apiService } from '../services/api';
import { Row, Col, Table } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Menu2F = () => {
  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [animateCard, setAnimateCard] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true); // 초기 로딩 활성화
  const [nationalData, setNationalData] = useState(null); // 전국 데이터 (주요지역 현황용)
  const [currentRegionData, setCurrentRegionData] = useState(null); // 현재 선택된 지역 데이터
  const [chartData, setChartData] = useState(null); // 차트 데이터
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 표시용 지역명 계산 (전체 -> 전국)
  const getDisplayRegionName = (regionName) => {
    return regionName === '전체' ? '전국' : regionName;
  };

  // 전국 데이터 집계 함수 (지역별 데이터를 월별로 합계 계산)
  const aggregateNationalData = (regionDataArray) => {
    if (!Array.isArray(regionDataArray)) return [];
    
    console.log('🔄 전국 데이터 집계 시작:', regionDataArray);
    
    // 월별로 그룹화하여 합계 계산
    const monthlyTotals = {};
    
    regionDataArray.forEach(item => {
      if (item.date && item.deaths !== undefined) {
        if (!monthlyTotals[item.date]) {
          monthlyTotals[item.date] = {
            date: item.date,
            deaths: 0,
            growthRate: 0,
            count: 0
          };
        }
        monthlyTotals[item.date].deaths += item.deaths || 0;
        monthlyTotals[item.date].growthRate += item.growthRate || 0;
        monthlyTotals[item.date].count += 1;
      }
    });
    
    // 평균 증가율 계산 및 배열로 변환
    const aggregatedData = Object.values(monthlyTotals).map(item => ({
      date: item.date,
      deaths: Math.round(item.deaths),
      growthRate: item.count > 0 ? (item.growthRate / item.count) : 0,
      region: '전국'
    }));
    
    console.log('✅ 전국 데이터 집계 완료:', aggregatedData);
    return aggregatedData;
  };

  // 초기 데이터 로딩
  useEffect(() => {
    const initializeData = async () => {
      console.log('📊 Menu2F 초기 데이터 로딩 시작...');
      
      try {
        // 1. 2025-01 데이터 생성 요청
        console.log('📅 2025-01 예측 데이터 요청 중...');
        const predictionRequest = {
          date: "2025-01"
        };
        
        await apiService.requestPrediction(predictionRequest);
        console.log('✅ 초기 예측 데이터 생성 성공');
        
        // 데이터 처리 시간 대기
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 2. 전국 데이터 조회 (2024-01, 2025-01)
        await loadNationalData();
        
        // 3. 초기 지역 데이터 로딩
        await loadRegionData('전체');
        
        console.log('✅ Menu2F 초기 데이터 로딩 완료');
        
      } catch (error) {
        console.log('⚠️ 초기 데이터 로딩 실패:', error.message);
        setError('초기 데이터 로딩에 실패했습니다.');
      } finally {
        setIsInitialLoading(false);
        setAnimateCard(true);
      }
    };

    initializeData();
  }, []);

  // 전국 데이터 로딩 (주요지역 현황용)
  const loadNationalData = async () => {
    try {
      console.log('🇰🇷 전국 데이터 로딩 중...');
      
      // 2025-01 전국 데이터로 지역별 증가율 계산
      const nationalDataResponse = await apiService.getDashboardByDate('2025-01');
      setNationalData(nationalDataResponse);
      
      console.log('✅ 전국 데이터 로딩 완료:', nationalDataResponse);
    } catch (error) {
      console.error('전국 데이터 로딩 실패:', error);
    }
  };

  // 지역 데이터 로딩
  const loadRegionData = async (region) => {
    try {
      setLoading(true);
      console.log(`📍 ${region} 지역 데이터 로딩 중...`);
      
      let regionData;
      
      if (region === '전체') {
        // 전체 선택 시 지역별 API로 전국의 모든 월 데이터 조회
        regionData = await apiService.getDashboardByRegion('전국');
        console.log('📊 전국 지역별 API 응답:', regionData);
      } else {
        // 특정 지역 선택 시 지역별 데이터 조회
        regionData = await apiService.getDashboardByRegion(region);
      }
      
      setCurrentRegionData(regionData);
      
      // 차트 데이터 생성
      await generateChartData(region);
      
      console.log(`✅ ${region} 지역 데이터 로딩 완료:`, regionData);
      
    } catch (error) {
      console.error(`${region} 지역 데이터 로딩 실패:`, error);
      setError(`${region} 지역 데이터를 불러올 수 없습니다.`);
    } finally {
      setLoading(false);
    }
  };

  // 차트 데이터 생성 (2024 이전 데이터 + 2025 예측 데이터)
  const generateChartData = async (region) => {
    try {
      console.log(`📈 ${region} 차트 데이터 생성 중...`);
      
      let data2024, data2025;
      
      if (region === '전체') {
        // 전체 선택 시 지역별 API로 전국의 모든 월 데이터 조회
        console.log('🔍 전국 차트 데이터 조회 - 지역별 API 사용');
        const allData = await apiService.getDashboardByRegion('전국');
        console.log('📊 전국 지역별 API 응답:', allData);
        
        // 2024년과 2025년 데이터 분리
        data2024 = allData.filter(item => item.date && item.date.startsWith('2024'));
        data2025 = allData.filter(item => item.date && item.date.startsWith('2025'));
        
        console.log('� 분리된 2024년 데이터:', data2024);
        console.log('📊 분리된 2025년 데이터:', data2025);
      } else {
        // 특정 지역 선택 시 지역별 API로 해당 지역의 모든 기간 데이터 조회
        console.log(`🔍 ${region} 지역 차트 데이터 조회 - 지역별 API 사용`);
        const allData = await apiService.getDashboardByRegion(region);
        console.log(`📊 ${region} 지역별 API 응답:`, allData);
        
        // 2024년과 2025년 데이터 분리
        data2024 = allData.filter(item => item.date && item.date.startsWith('2024'));
        data2025 = allData.filter(item => item.date && item.date.startsWith('2025'));
        
        console.log(`📊 ${region} 분리된 2024년 데이터:`, data2024);
        console.log(`📊 ${region} 분리된 2025년 데이터:`, data2025);
      }
      console.log('📊 차트 데이터 매핑 시작:');
      console.log('   최종 2024년 데이터:', data2024);
      console.log('   최종 2025년 데이터:', data2025);
      
      // 모든 월을 포함하는 통합 레이블 생성
      const allLabels = new Set();
      const dataMap2024 = new Map();
      const dataMap2025 = new Map();
      
      // 2024년 데이터 매핑
      console.log('🔍 2024년 데이터 매핑 중...');
      if (Array.isArray(data2024) && data2024.length > 0) {
        console.log('   2024 데이터는 배열 형태, 길이:', data2024.length);
        data2024.forEach((item, index) => {
          console.log(`   [${index}] 항목:`, item);
          if (item && item.date && item.deaths !== undefined) {
            // 2024년 데이터만 필터링 (날짜가 2024로 시작하는 것만)
            if (item.date.startsWith('2024')) {
              console.log(`   ✅ 2024 데이터 추가: ${item.date} -> ${item.deaths}`);
              allLabels.add(item.date);
              dataMap2024.set(item.date, item.deaths);
            } else {
              console.log(`   ⏭️ 2024가 아닌 데이터 스킵: ${item.date}`);
            }
          } else {
            console.log(`   ⚠️ 유효하지 않은 항목:`, item);
          }
        });
      } else if (data2024 && data2024.date && data2024.deaths !== undefined) {
        console.log('   2024 데이터는 단일 객체 형태:', data2024);
        // 단일 객체인 경우
        if (data2024.date.startsWith('2024')) {
          console.log(`   ✅ 2024 단일 데이터 추가: ${data2024.date} -> ${data2024.deaths}`);
          allLabels.add(data2024.date);
          dataMap2024.set(data2024.date, data2024.deaths);
        } else {
          console.log(`   ⏭️ 2024가 아닌 단일 데이터 스킵: ${data2024.date}`);
        }
      } else {
        console.log('   ⚠️ 2024 데이터가 유효하지 않거나 비어있음:', data2024);
      }
      
      // 2025년 데이터 매핑
      console.log('🔍 2025년 데이터 매핑 중...');
      if (Array.isArray(data2025) && data2025.length > 0) {
        console.log('   2025 데이터는 배열 형태, 길이:', data2025.length);
        data2025.forEach((item, index) => {
          console.log(`   [${index}] 항목:`, item);
          if (item && item.date && item.deaths !== undefined) {
            // 2025년 데이터만 필터링 (날짜가 2025로 시작하는 것만)
            if (item.date.startsWith('2025')) {
              console.log(`   ✅ 2025 데이터 추가: ${item.date} -> ${item.deaths}`);
              allLabels.add(item.date);
              dataMap2025.set(item.date, item.deaths);
            } else {
              console.log(`   ⏭️ 2025가 아닌 데이터 스킵: ${item.date}`);
            }
          } else {
            console.log(`   ⚠️ 유효하지 않은 항목:`, item);
          }
        });
      } else if (data2025 && data2025.date && data2025.deaths !== undefined) {
        console.log('   2025 데이터는 단일 객체 형태:', data2025);
        // 단일 객체인 경우
        if (data2025.date.startsWith('2025')) {
          console.log(`   ✅ 2025 단일 데이터 추가: ${data2025.date} -> ${data2025.deaths}`);
          allLabels.add(data2025.date);
          dataMap2025.set(data2025.date, data2025.deaths);
        } else {
          console.log(`   ⏭️ 2025가 아닌 단일 데이터 스킵: ${data2025.date}`);
        }
      } else {
        console.log('   ⚠️ 2025 데이터가 유효하지 않거나 비어있음:', data2025);
      }
      
      // 날짜순으로 정렬
      const sortedLabels = Array.from(allLabels).sort();
      console.log('📈 모든 수집된 레이블:', Array.from(allLabels));
      console.log('📈 정렬된 레이블:', sortedLabels);
      console.log('📈 2024 데이터 맵:', Object.fromEntries(dataMap2024));
      console.log('📈 2025 데이터 맵:', Object.fromEntries(dataMap2025));
      
      // 차트 데이터 배열 생성
      const historicalData = [];
      const predictedData = [];
      
      sortedLabels.forEach(date => {
        console.log(`📊 처리 중인 날짜: ${date}`);
        // 2024년 데이터가 있으면 historical에, 2025년 데이터가 있으면 predicted에
        if (date.startsWith('2024') && dataMap2024.has(date)) {
          const value = dataMap2024.get(date);
          console.log(`   ✅ 2024 데이터 추가: ${value}`);
          historicalData.push(value);
          predictedData.push(null);
        } else if (date.startsWith('2025') && dataMap2025.has(date)) {
          const value = dataMap2025.get(date);
          console.log(`   ✅ 2025 데이터 추가: ${value}`);
          historicalData.push(null);
          predictedData.push(value);
        } else {
          console.log(`   ⚠️ 해당 날짜의 데이터 없음`);
          historicalData.push(null);
          predictedData.push(null);
        }
      });
      
      console.log('📈 최종 차트 배열:');
      console.log('   정렬된 레이블:', sortedLabels);
      console.log('   이전 데이터 배열:', historicalData);
      console.log('   예측 데이터 배열:', predictedData);
      console.log('   총 데이터 포인트 수:', sortedLabels.length);
      
      // 빈 데이터 체크
      if (sortedLabels.length === 0) {
        console.warn('⚠️ 차트 레이블이 비어있음! 데이터를 찾을 수 없습니다.');
      }
      
      if (historicalData.every(val => val === null) && predictedData.every(val => val === null)) {
        console.warn('⚠️ 모든 차트 데이터가 null입니다! 유효한 데이터가 없습니다.');
      }
      
      const chartConfig = {
        labels: sortedLabels,
        datasets: [
          {
            label: '이전 데이터 (2024)',
            data: historicalData,
            borderColor: 'rgba(54, 162, 235, 0.8)',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 5,
            spanGaps: false // null 값 사이를 연결하지 않음
          },
          {
            label: '예측 데이터 (2025)',
            data: predictedData,
            borderColor: 'rgba(255, 99, 132, 0.8)',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            borderDash: [5, 5], // 점선으로 표시
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 5,
            spanGaps: false // null 값 사이를 연결하지 않음
          }
        ]
      };
      
      setChartData(chartConfig);
      console.log('✅ 차트 데이터 생성 완료:', chartConfig);
      
    } catch (error) {
      console.error('차트 데이터 생성 실패:', error);
      // 에러 발생 시 빈 차트 데이터 설정
      setChartData({
        labels: [],
        datasets: [
          {
            label: '이전 데이터 (2024)',
            data: [],
            borderColor: 'rgba(54, 162, 235, 0.8)',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
          },
          {
            label: '예측 데이터 (2025)',
            data: [],
            borderColor: 'rgba(255, 99, 132, 0.8)',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            borderDash: [5, 5],
          }
        ]
      });
    }
  };

  // 지역 선택 핸들러
  useEffect(() => {
    if (!isInitialLoading && selectedRegion) {
      loadRegionData(selectedRegion);
    }
  }, [selectedRegion, isInitialLoading]);

  const handleRefresh = async () => {
    console.log(`'${selectedRegion}' 지역 새로고침 시작`);
    
    try {
      setLoading(true);
      
      // 2024-01, 2025-01 데이터 재생성
      const targetDates = ['2024-01', '2025-01'];
      
      for (const date of targetDates) {
        try {
          await apiService.requestPrediction({ date });
          console.log(`✅ ${date} 데이터 재생성 완료`);
        } catch (error) {
          console.log(`⚠️ ${date} 데이터 재생성 실패:`, error.message);
        }
      }
      
      // 데이터 처리 대기
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 전국 데이터 및 현재 지역 데이터 재로딩
      await loadNationalData();
      await loadRegionData(selectedRegion);
      
      setRefreshKey(prev => prev + 1);
      alert('🎉 데이터 새로고침 완료!');
      
    } catch (error) {
      console.error('새로고침 실패:', error);
      alert('⚠️ 새로고침 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

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
        {/* 왼쪽 영역 (지도와 버튼) */}
        <div style={{ flex: '0 0 400px', display: 'flex', flexDirection: 'column' }}>
          <h4 className="mb-3" style={{ 
            fontSize: '30px', 
            fontWeight: '700', 
            color: '#2C1F14',
            paddingLeft: '10px' 
          }}>
            Menu2F 통합 대시보드
          </h4>
          <div className="dashboard-left" style={{
            background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.12) 0%, rgba(205, 133, 63, 0.08) 100%)',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 20px rgba(44, 31, 20, 0.12)',
            border: '1px solid rgba(184, 134, 11, 0.2)',
            position: 'sticky',
            top: '0'
          }}>
            <InteractiveMap
              selectedRegion={selectedRegion}
              onRegionSelect={setSelectedRegion}
            />
          </div>
          <button className="refresh-btn" onClick={handleRefresh} disabled={loading}>
            {loading ? '🔄 처리 중...' : '🚀 데이터 새로고침'}
          </button>
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
          {isInitialLoading ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%',
              flexDirection: 'column',
              color: '#2C1F14'
            }}>
              <div style={{ fontSize: '18px', marginBottom: '10px' }}>
                📊 2025년 예측 데이터 생성 중...
              </div>
              <div style={{ fontSize: '14px', opacity: 0.7 }}>
                잠시만 기다려주세요
              </div>
            </div>
          ) : (
            <DataDisplayComponent 
              region={selectedRegion}
              nationalData={nationalData}
              currentRegionData={currentRegionData}
              chartData={chartData}
              loading={loading}
              error={error}
              refreshKey={refreshKey}
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

        .refresh-btn {
          width: 100%;
          margin-top: 20px; /* 지도 컴포넌트와의 간격 */
          padding: 12px 20px;
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          background: linear-gradient(135deg, #b8860b, #965a25);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(44, 31, 20, 0.2);
          transition: all 0.3s ease;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
        }

        .refresh-btn:hover {
          background: linear-gradient(135deg, #c9971c, #a86b36);
          box-shadow: 0 6px 20px rgba(44, 31, 20, 0.3);
          transform: translateY(-2px);
        }
        
        .refresh-btn:active {
          transform: translateY(0);
          box-shadow: 0 4px 15px rgba(44, 31, 20, 0.2);
        }

        .refresh-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
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
            /* 반응형 레이아웃 */
                @media (max-width: 1200px) {
                    .page-wrapper {
                        height: auto !important;
                        min-height: calc(100vh - var(--navbar-height));
                        align-items: flex-start !important;
                    }
                    .dashboard-container {
                        flex-direction: column;
                        height: auto !important;
                        overflow: visible;
                    }
                    .dashboard-left {
                        flex: 1 1 auto; /* 세로로 쌓일 때 너비 제약을 해제하고 전체 너비를 차지하도록 함 */
                        margin-bottom: 20px;
                    }
                }
                
                @media (max-width: 768px) {
                    .dashboard-container {
                        padding: 10px;
                        gap: 15px;
                    }
                    .customer-id-name-row {
                        flex-direction: column;
                    }
                    .customer-id-name-row > .col-6 {
                        width: 100%;
                        padding-left: 12px;
                        padding-right: 12px;
                    }
                     .customer-id-name-row > .col-6:first-of-type {
                        margin-bottom: 1rem;
                    }
                }
      `}</style>
    </div>
  );
};

// 데이터 표시 컴포넌트
const DataDisplayComponent = ({ 
  region, 
  nationalData, 
  currentRegionData, 
  chartData, 
  loading, 
  error,
  refreshKey 
}) => {
  // 전국 데이터 기준 지역 상태 계산
  const getRegionStatus = () => {
    if (!nationalData || !Array.isArray(nationalData)) {
      return [];
    }

    // 지역별 증가율 계산
    const regionGrowthRates = nationalData
      .filter(item => item.region && item.growthRate !== undefined)
      .map(item => ({
        region: item.region,
        growthRate: item.growthRate || 0
      }))
      .sort((a, b) => b.growthRate - a.growthRate);

    if (regionGrowthRates.length === 0) return [];

    // 3등분으로 나누기
    const totalRegions = regionGrowthRates.length;
    const highThreshold = Math.ceil(totalRegions / 3);
    const mediumThreshold = Math.ceil((totalRegions * 2) / 3);

    const regionStatus = [
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
      }
    ];

    regionGrowthRates.forEach((item, index) => {
      if (index < highThreshold) {
        regionStatus[0].regions.push(`${item.region} (${item.growthRate.toFixed(1)}%)`);
      } else if (index < mediumThreshold) {
        regionStatus[1].regions.push(`${item.region} (${item.growthRate.toFixed(1)}%)`);
      } else {
        regionStatus[2].regions.push(`${item.region} (${item.growthRate.toFixed(1)}%)`);
      }
    });

    return regionStatus;
  };

  // 예측 요약 통계 계산
  const getSummaryStats = () => {
    if (!currentRegionData || !Array.isArray(currentRegionData)) {
      return { totalDeaths: 0, avgGrowthRate: 0, maxMonth: '', minMonth: '' };
    }

    const totalDeaths = currentRegionData.reduce((sum, item) => sum + (item.deaths || 0), 0);
    const avgGrowthRate = currentRegionData.reduce((sum, item) => sum + (item.growthRate || 0), 0) / currentRegionData.length;
    
    const sortedByDeaths = [...currentRegionData].sort((a, b) => (b.deaths || 0) - (a.deaths || 0));
    const maxMonth = sortedByDeaths[0]?.date || '';
    const minMonth = sortedByDeaths[sortedByDeaths.length - 1]?.date || '';

    return {
      totalDeaths: Math.round(totalDeaths),
      avgGrowthRate: avgGrowthRate.toFixed(1),
      maxMonth,
      minMonth
    };
  };

  const regionStatus = getRegionStatus();
  const summaryStats = getSummaryStats();
  const displayRegionName = region === '전체' ? '전국' : region;

  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '16px',
    border: '1px solid rgba(184, 134, 11, 0.2)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${displayRegionName} 사망자 수 추이 (이전 vs 예측)`,
        font: { size: 16, weight: 'bold' }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '사망자 수'
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

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%',
        flexDirection: 'column',
        color: '#2C1F14'
      }}>
        <div style={{ fontSize: '18px', marginBottom: '10px' }}>
          📊 {displayRegionName} 데이터 로딩 중...
        </div>
        <div style={{ fontSize: '14px', opacity: 0.7 }}>
          잠시만 기다려주세요
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%',
        flexDirection: 'column',
        color: '#dc3545'
      }}>
        <div style={{ fontSize: '18px', marginBottom: '10px' }}>
          ⚠️ 오류 발생
        </div>
        <div style={{ fontSize: '14px', opacity: 0.7 }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* 제목 */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ fontWeight: '700', color: '#343a40' }}>
          <i className="fas fa-map-marker-alt me-2" style={{ color: '#D4AF37' }}></i>
          {displayRegionName} 예측 결과 분석
        </h2>
        <small className="text-muted">
          데이터 소스: 백엔드 API
        </small>
      </div>

      {/* 주요지역 현황 요약 (전국 데이터 기준, 지역 선택으로 변하지 않음) */}
      <div className="p-4 mb-4" style={cardStyle}>
        <h5 className="mb-3" style={{ fontWeight: '600', color: '#2C1F14' }}>
          📊 주요지역 현황 요약 (2025년 예측 기준)
        </h5>
        <Row className="g-3">
          {regionStatus.map((status, index) => (
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

      {/* 예측 요약 통계 */}
      <div className="p-4 mb-4" style={cardStyle}>
        <h5 className="mb-3" style={{ fontWeight: '600', color: '#2C1F14' }}>
          📈 {displayRegionName} 예측 요약 통계
        </h5>
        <Row className="g-3">
          <Col md={3}>
            <div className="text-center p-3 rounded-3" style={{ backgroundColor: 'rgba(54, 162, 235, 0.1)' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#369CE3' }}>
                {summaryStats.totalDeaths.toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>예상 총 사망자 수</div>
            </div>
          </Col>
          <Col md={3}>
            <div className="text-center p-3 rounded-3" style={{ backgroundColor: 'rgba(255, 99, 132, 0.1)' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#FF6384' }}>
                {summaryStats.avgGrowthRate}%
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>평균 증가율</div>
            </div>
          </Col>
          <Col md={3}>
            <div className="text-center p-3 rounded-3" style={{ backgroundColor: 'rgba(255, 206, 84, 0.1)' }}>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#FFCE54' }}>
                {summaryStats.maxMonth}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>최대 예상 월</div>
            </div>
          </Col>
          <Col md={3}>
            <div className="text-center p-3 rounded-3" style={{ backgroundColor: 'rgba(75, 192, 192, 0.1)' }}>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#4BC0C0' }}>
                {summaryStats.minMonth}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>최소 예상 월</div>
            </div>
          </Col>
        </Row>
      </div>

      {/* 시계열 차트 */}
      {chartData && (
        <div className="p-4 mb-4" style={cardStyle}>
          <h5 className="mb-3" style={{ fontWeight: '600', color: '#2C1F14' }}>
            📈 {displayRegionName} 시계열 예측 차트
          </h5>
          <div style={{ height: '400px' }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* 월별 데이터 테이블 */}
      {currentRegionData && Array.isArray(currentRegionData) && (
        <div className="p-4" style={cardStyle}>
          <h5 className="mb-3" style={{ fontWeight: '600', color: '#2C1F14' }}>
            📋 {displayRegionName} 월별 상세 데이터
          </h5>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <Table striped bordered hover size="sm">
              <thead style={{ backgroundColor: '#f8f9fa', position: 'sticky', top: 0 }}>
                <tr>
                  <th>월</th>
                  <th>예상 사망자 수</th>
                  <th>증가율</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {currentRegionData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.date}</td>
                    <td style={{ fontWeight: '600' }}>
                      {(item.deaths || 0).toLocaleString()}명
                    </td>
                    <td style={{ 
                      color: (item.growthRate || 0) >= 0 ? '#dc3545' : '#198754',
                      fontWeight: '600'
                    }}>
                      {(item.growthRate || 0) >= 0 ? '+' : ''}{(item.growthRate || 0).toFixed(1)}%
                    </td>
                    <td>
                      <span className={`badge ${(item.growthRate || 0) >= 5 ? 'bg-danger' : (item.growthRate || 0) >= 2 ? 'bg-warning' : 'bg-success'}`}>
                        {(item.growthRate || 0) >= 5 ? '주의' : (item.growthRate || 0) >= 2 ? '관심' : '안정'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu2F;
