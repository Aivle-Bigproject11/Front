import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import InteractiveMap from '../components/InteractiveMap';
import { apiService } from '../services/api';
import { Row, Col, Table } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import staffData from '../assets/dataset/Predcit_rf_Result_min.json';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Menu2F = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [animateCard, setAnimateCard] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true); // 초기 로딩 활성화
  const [nationalData, setNationalData] = useState(null); // 전국 데이터 (주요지역 현황용)
  const [currentRegionData, setCurrentRegionData] = useState(null); // 현재 선택된 지역 데이터
  const [chartData, setChartData] = useState(null); // 차트 데이터
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState({ year: new Date().getFullYear(), month: new Date().getMonth() + 1 });
  const [deploymentData, setDeploymentData] = useState(null); // 2N에서 전달받은 간소화된 배치 데이터
  const [currentAllocation, setCurrentAllocation] = useState(null); // 2N에서 전달받은 현재 조정된 배치 데이터

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
      
      // URL 쿼리 파라미터에서 배치 데이터 가져오기
      const urlParams = new URLSearchParams(location.search);
      const menuDataParam = urlParams.get('menuData');
      
      if (menuDataParam) {
        try {
          const parsedMenuData = JSON.parse(decodeURIComponent(menuDataParam));
          console.log('✅ Menu2N 데이터 수신:', parsedMenuData);
          
          // Menu2N에서 전달받은 데이터 구조 분해
          const { deploymentData, currentAllocation, totalStaff } = parsedMenuData;
          
          setDeploymentData(deploymentData);
          
          // 현재 조정된 배치 데이터를 상태로 저장
          if (currentAllocation) {
            setCurrentAllocation(currentAllocation);
            console.log('📊 현재 조정된 배치 데이터:', currentAllocation, '총 인력:', totalStaff);
          }
          
        } catch (error) {
          console.error('⚠️ Menu2N 데이터 파싱 실패:', error);
        }
      }
      
      try {
        // 1. 먼저 2024-01 데이터가 존재하는지 확인
        console.log('📅 기존 2024-01 데이터 존재 여부 확인 중...');
        let shouldGenerateData = false;
        
        try {
          const existingData = await apiService.getDashboardByDate('2024-01');
          if (!existingData || existingData.length === 0) {
            shouldGenerateData = true;
            console.log('📋 기존 데이터가 없어 새로 생성이 필요합니다.');
          } else {
            console.log('✅ 기존 2024-01 데이터가 존재합니다. 생성 요청을 생략합니다.');
          }
        } catch (error) {
          shouldGenerateData = true;
          console.log('📋 데이터 확인 실패, 새로 생성을 시도합니다.');
        }
        
        // 2. 데이터가 없는 경우에만 예측 데이터 생성 요청
        if (shouldGenerateData) {
          console.log('📅 2024-01, 2025-01, 2026-01 예측 데이터 동시 요청 중...');
          const predictionRequests = [
            apiService.requestPrediction({ date: "2024-01" }),
            apiService.requestPrediction({ date: "2025-01" }),
            apiService.requestPrediction({ date: "2026-01" })
          ];
          
          await Promise.all(predictionRequests);
          console.log('✅ 초기 예측 데이터 생성 성공');
          
          // 데이터 처리 시간 대기
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        // 3. 전국 데이터 조회 (2024-01, 2025-01, 2026-01)
        await loadNationalData();
        
        // 4. 초기 지역 데이터 로딩
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
  }, [location.search]);

  // 전국 데이터 로딩 (주요지역 현황용)
  const loadNationalData = async () => {
    try {
      console.log('🇰🇷 전국 데이터 로딩 중...');
      const dateString = `${currentDate.year}-${String(currentDate.month).padStart(2, '0')}`;
      
      // 현재 날짜 기준 전국 데이터로 지역별 증가율 계산
      const nationalDataResponse = await apiService.getDashboardByDate(dateString);
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

  // 24년 1월부터 26년 12월까지 순차적으로 36개월 범위 계산
  const get36MonthRange = () => {
    const months = [];
    
    // 2024년 1월부터 2026년 12월까지 순차적으로 생성
    for (let year = 2024; year <= 2026; year++) {
      for (let month = 1; month <= 12; month++) {
        const dateString = `${year}-${String(month).padStart(2, '0')}`;
        months.push(dateString);
      }
    }
    
    console.log('📅 36개월 범위 계산 (2024-01 ~ 2026-12):', months);
    console.log(`📅 현재 월: ${currentDate.year}-${String(currentDate.month).padStart(2, '0')}`);
    return months;
  };

  // 차트 데이터 생성 (2024년 1월부터 2026년 12월까지 순차적으로 36개월 범위)
  const generateChartData = async (region) => {
    try {
      console.log(`📈 ${region} 차트 데이터 생성 중...`);
      
      // 36개월 범위 계산 (2024-01 ~ 2026-12)
      const monthRange = get36MonthRange();
      
      let allData;
      
      if (region === '전체') {
        // 전체 선택 시 지역별 API로 전국의 모든 월 데이터 조회
        console.log('🔍 전국 차트 데이터 조회 - 지역별 API 사용');
        allData = await apiService.getDashboardByRegion('전국');
        console.log('📊 전국 지역별 API 응답:', allData);
      } else {
        // 특정 지역 선택 시 지역별 API로 해당 지역의 모든 기간 데이터 조회
        console.log(`🔍 ${region} 지역 차트 데이터 조회 - 지역별 API 사용`);
        allData = await apiService.getDashboardByRegion(region);
        console.log(`📊 ${region} 지역별 API 응답:`, allData);
      }
      
      // 36개월 범위 내의 데이터만 필터링
      const filteredData = allData.filter(item => 
        item.date && monthRange.includes(item.date)
      );
      
      console.log('📊 36개월 범위 필터링된 데이터:', filteredData);
      
      // 2024년, 2025년, 2026년 데이터 분리 (36개월 범위 내에서)
      const data2024 = filteredData.filter(item => item.date && item.date.startsWith('2024'));
      const data2025 = filteredData.filter(item => item.date && item.date.startsWith('2025'));
      const data2026 = filteredData.filter(item => item.date && item.date.startsWith('2026'));
      
      console.log('📊 36개월 범위 내 2024년 데이터:', data2024);
      console.log('📊 36개월 범위 내 2025년 데이터:', data2025);
      console.log('📊 36개월 범위 내 2026년 데이터:', data2026);
      console.log('📊 차트 데이터 매핑 시작:');
      console.log('   최종 2024년 데이터:', data2024);
      console.log('   최종 2025년 데이터:', data2025);
      
      // 24개월 범위를 레이블로 사용 (순서 보장)
      const allLabels = monthRange;
      const dataMap2024 = new Map();
      const dataMap2025 = new Map();
      const dataMap2026 = new Map();
      
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
          dataMap2025.set(data2025.date, data2025.deaths);
        } else {
          console.log(`   ⏭️ 2025가 아닌 단일 데이터 스킵: ${data2025.date}`);
        }
      } else {
        console.log('   ⚠️ 2025 데이터가 유효하지 않거나 비어있음:', data2025);
      }
      
      // 2026년 데이터 매핑
      console.log('🔍 2026년 데이터 매핑 중...');
      if (Array.isArray(data2026) && data2026.length > 0) {
        console.log('   2026 데이터는 배열 형태, 길이:', data2026.length);
        data2026.forEach((item, index) => {
          console.log(`   [${index}] 항목:`, item);
          if (item && item.date && item.deaths !== undefined) {
            // 2026년 데이터만 필터링 (날짜가 2026로 시작하는 것만)
            if (item.date.startsWith('2026')) {
              console.log(`   ✅ 2026 데이터 추가: ${item.date} -> ${item.deaths}`);
              dataMap2026.set(item.date, item.deaths);
            } else {
              console.log(`   ⏭️ 2026이 아닌 데이터 스킵: ${item.date}`);
            }
          } else {
            console.log(`   ⚠️ 유효하지 않은 항목:`, item);
          }
        });
      } else if (data2026 && data2026.date && data2026.deaths !== undefined) {
        console.log('   2026 데이터는 단일 객체 형태:', data2026);
        // 단일 객체인 경우
        if (data2026.date.startsWith('2026')) {
          console.log(`   ✅ 2026 단일 데이터 추가: ${data2026.date} -> ${data2026.deaths}`);
          dataMap2026.set(data2026.date, data2026.deaths);
        } else {
          console.log(`   ⏭️ 2026이 아닌 단일 데이터 스킵: ${data2026.date}`);
        }
      } else {
        console.log('   ⚠️ 2026 데이터가 유효하지 않거나 비어있음:', data2026);
      }
      
      // 36개월 범위 레이블 사용 (이미 정렬됨)
      const sortedLabels = allLabels;
      console.log('📈 36개월 범위 레이블:', sortedLabels);
      console.log('📈 2024 데이터 맵:', Object.fromEntries(dataMap2024));
      console.log('📈 2025 데이터 맵:', Object.fromEntries(dataMap2025));
      console.log('📈 2026 데이터 맵:', Object.fromEntries(dataMap2026));
      
      // 차트 데이터 배열 생성 (현재 월 기준으로 이전/이후 구분)
      const historicalData = [];
      const predictedData = [];
      const currentMonthStr = `${currentDate.year}-${String(currentDate.month).padStart(2, '0')}`;
      
      sortedLabels.forEach(date => {
        console.log(`📊 처리 중인 날짜: ${date}`);
        
        // 현재 월보다 이전인지 확인
        const isPastMonth = date < currentMonthStr;
        const isCurrentMonth = date === currentMonthStr;
        const isFutureMonth = date > currentMonthStr;
        
        // 데이터 값 가져오기
        let value = null;
        if (date.startsWith('2024') && dataMap2024.has(date)) {
          value = dataMap2024.get(date);
        } else if (date.startsWith('2025') && dataMap2025.has(date)) {
          value = dataMap2025.get(date);
        } else if (date.startsWith('2026') && dataMap2026.has(date)) {
          value = dataMap2026.get(date);
        }
        
        if (value !== null) {
          if (isPastMonth || isCurrentMonth) {
            // 현재 월 포함 이전 데이터는 historical에
            console.log(`   ✅ 이전 데이터 추가: ${date} -> ${value}`);
            historicalData.push(value);
            predictedData.push(null);
          } else {
            // 현재 월 이후 데이터는 predicted에
            console.log(`   ✅ 예측 데이터 추가: ${date} -> ${value}`);
            historicalData.push(null);
            predictedData.push(value);
          }
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
            label: '이전 데이터 (현재 월 포함)',
            data: historicalData,
            borderColor: 'rgba(54, 162, 235, 0.8)',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            tension: 0.4,
            pointRadius: function(context) {
              const currentMonthStr = `${currentDate.year}-${String(currentDate.month).padStart(2, '0')}`;
              const label = context.chart.data.labels[context.dataIndex];
              return label === currentMonthStr ? 8 : 4;
            },
            pointBackgroundColor: function(context) {
              const currentMonthStr = `${currentDate.year}-${String(currentDate.month).padStart(2, '0')}`;
              const label = context.chart.data.labels[context.dataIndex];
              return label === currentMonthStr ? '#B8860B' : 'rgba(54, 162, 235, 0.8)';
            },
            pointBorderColor: function(context) {
              const currentMonthStr = `${currentDate.year}-${String(currentDate.month).padStart(2, '0')}`;
              const label = context.chart.data.labels[context.dataIndex];
              return label === currentMonthStr ? '#fff' : 'rgba(54, 162, 235, 0.8)';
            },
            pointBorderWidth: function(context) {
              const currentMonthStr = `${currentDate.year}-${String(currentDate.month).padStart(2, '0')}`;
              const label = context.chart.data.labels[context.dataIndex];
              return label === currentMonthStr ? 3 : 1;
            },
            pointHoverRadius: 6,
            spanGaps: false // null 값 사이를 연결하지 않음
          },
          {
            label: '예측 데이터 (현재 월 이후)',
            data: predictedData,
            borderColor: 'rgba(255, 99, 132, 0.8)',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            borderDash: [8, 4], // 점선으로 표시
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: 'rgba(255, 99, 132, 0.8)',
            pointBorderColor: 'rgba(255, 99, 132, 0.8)',
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
            label: '예측 데이터 (2025-2026)',
            data: [],
            borderColor: 'rgba(255, 99, 132, 0.8)',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            borderDash: [5, 5],
          }
        ]
      });
    }
  };

  // URL 쿼리 파라미터 처리
  useEffect(() => {
    if (!isInitialLoading) {
      const params = new URLSearchParams(location.search);
      const regionFromQuery = params.get('region');
      if (regionFromQuery && regionFromQuery !== selectedRegion) {
        console.log(`쿼리 파라미터로부터 지역 설정: ${regionFromQuery}`);
        setSelectedRegion(regionFromQuery);
      }
    }
  }, [isInitialLoading, location.search]);

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
      
      // 2024-01, 2025-01, 2026-01 데이터 재생성
      const targetDates = ['2024-01', '2025-01', '2026-01'];
      
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
        <div style={{ flex: '0 0 600px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={() => navigate(-1)}
              className="back-btn"
            >
              <ArrowLeft size={16} style={{ marginRight: '6px' }} />
              뒤로가기
            </button>
            <button className="refresh-btn" onClick={handleRefresh} disabled={loading}>
              {loading ? '🔄 처리 중...' : <>🚀 데이터 새로고침</>}
            </button>
          </div>
          <div className="dashboard-left" style={{
            background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.12) 0%, rgba(205, 133, 63, 0.08) 100%)',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 20px rgba(44, 31, 20, 0.12)',
            border: '1px solid rgba(184, 134, 11, 0.2)',
            position: 'sticky',
            top: '0'
          }}>
            <StaffMap
              selectedRegion={selectedRegion}
              onRegionSelect={setSelectedRegion}
              staffData={staffData.filter(item => item.date === '2024-01')}
              deploymentData={deploymentData}
              currentAllocation={currentAllocation}
            />
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
              currentDate={currentDate}
              deploymentData={deploymentData}
              currentAllocation={currentAllocation}
            />
          )}
        </div>
      </div>

      <style jsx global>{`
        .back-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 20px;
            background: linear-gradient(135deg, #4A3728, #8B5A2B);
            border: none;
            color: white;
            font-weight: 700;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(74, 55, 40, 0.35);
            transition: all 0.3s ease;
            border-radius: 12px;
            cursor: pointer;
        }
        .back-btn:hover {
            background: linear-gradient(135deg, #3c2d20, #7a4e24);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(74, 55, 40, 0.45);
        }
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
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          background: linear-gradient(135deg, #b8860b, #965a25);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(74, 55, 40, 0.35);
          transition: all 0.3s ease;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
        }

        .refresh-btn:hover {
          background: linear-gradient(135deg, #c9971c, #a86b36);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(74, 55, 40, 0.45);
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
  refreshKey,
  currentDate,
  deploymentData,
  currentAllocation
}) => {
  const [selectedYear, setSelectedYear] = useState(currentDate.year);

  // 2N에서 받은 배치 상태 또는 전국 데이터 기준 지역 상태 계산
  const getRegionStatus = () => {
    // 지역명 축약 함수
    const getShortRegionName = (regionName) => {
      const regionMap = {
        '경상남도': '경남',
        '경상북도': '경북',
        '전라남도': '전남',
        '전라북도': '전북',
        '충청남도': '충남',
        '충청북도': '충북',
        '서울특별시': '서울',
        '부산광역시': '부산',
        '대구광역시': '대구',
        '인천광역시': '인천',
        '광주광역시': '광주',
        '대전광역시': '대전',
        '울산광역시': '울산',
        '세종특별자치시': '세종',
        '강원도': '강원',
        '제주도': '제주'
      };
      return regionMap[regionName] || regionName.replace(/특별시|광역시|특별자치시|도$/g, '');
    };

    // 2N에서 배치 데이터를 받은 경우 우선 사용
    if (deploymentData && Object.keys(deploymentData).length > 0) {
      const regionStatus = [
        {
          level: '적정 배치',
          description: '현재 인력이 AI 추천과 일치',
          color: 'rgba(25, 135, 84, 0.15)',
          borderColor: 'rgba(25, 135, 84, 0.8)',
          textColor: '#198754',
          regions: []
        },
        {
          level: '인력 부족',
          description: 'AI 추천보다 인력이 부족',
          color: 'rgba(220, 53, 69, 0.15)',
          borderColor: 'rgba(220, 53, 69, 0.8)',
          textColor: '#dc3545',
          regions: []
        },
        {
          level: '인력 과잉',
          description: 'AI 추천보다 인력이 과잉',
          color: 'rgba(255, 193, 7, 0.15)',
          borderColor: 'rgba(255, 193, 7, 0.8)',
          textColor: '#ffc107',
          regions: []
        }
      ];

      // deploymentData와 currentAllocation을 함께 사용하여 지역별 상태 분류
      Object.entries(deploymentData).forEach(([regionName, data]) => {
        const shortRegionName = getShortRegionName(regionName);
        let statusText;
        
        // 현재 조정된 배치 데이터가 있으면 사용, 없으면 기본 배치 데이터 사용
        const currentStaffCount = currentAllocation && currentAllocation[regionName] !== undefined 
          ? currentAllocation[regionName] 
          : data.current;
        
        const recommendedStaffCount = data.recommended;
        
        // 상태 계산
        let status;
        if (currentStaffCount === recommendedStaffCount) {
          status = 0; // 적정
        } else if (currentStaffCount < recommendedStaffCount) {
          status = 1; // 부족
        } else {
          status = 2; // 과잉
        }
        
        if (status === 0) {
          // 적정 배치
          statusText = shortRegionName;
          regionStatus[0].regions.push(statusText);
        } else if (status === 1) {
          // 인력 부족: AI 추천보다 적음을 음수로 표시
          const shortage = recommendedStaffCount - currentStaffCount;
          statusText = `${shortRegionName} (-${shortage})`;
          regionStatus[1].regions.push(statusText);
        } else if (status === 2) {
          // 인력 과잉: AI 추천보다 많음을 양수로 표시
          const surplus = currentStaffCount - recommendedStaffCount;
          statusText = `${shortRegionName} (+${surplus})`;
          regionStatus[2].regions.push(statusText);
        }
      });

      return regionStatus;
    }

    // deploymentData가 없으면 기존 로직 사용 (nationalData 기반)
    if (!nationalData || !Array.isArray(nationalData)) {
      return [];
    }

    // 지역별 증가율 계산
    const regionGrowthRates = nationalData
      .filter(item => item.region && item.growthRate !== undefined && item.region !== '전국') // 전국 데이터 제외
      .map(item => ({
        region: getShortRegionName(item.region),
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
        level: '인력 부족',
        description: '증가율 높음',
        color: 'rgba(220, 53, 69, 0.15)',
        borderColor: 'rgba(220, 53, 69, 0.8)',
        textColor: '#dc3545',
        regions: []
      },
      {
        level: '인력 과잉',
        description: '증가율 중간',
        color: 'rgba(255, 193, 7, 0.15)',
        borderColor: 'rgba(255, 193, 7, 0.8)',
        textColor: '#ffc107',
        regions: []
      },
      {
        level: '적정 배치',
        description: '증가율 낮음',
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

  // 예측 요약 통계 계산 (지난달 대비, 다음달 예상 변화)
  const getSummaryStats = () => {
    if (!currentRegionData || !Array.isArray(currentRegionData)) {
      return {
        lastMonthChange: 0,
        lastMonthChangePercent: 0,
        nextMonthChange: 0,
        nextMonthChangePercent: 0,
        currentStaff: 0,
        recommendedStaff: 0
      };
    }

    const currentYear = currentDate.year;
    const currentMonth = currentDate.month;
    
    const currentMonthStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
    const lastMonth = new Date(currentYear, currentMonth - 2, 1); // 지난달
    const nextMonth = new Date(currentYear, currentMonth, 1); // 다음달
    const lastMonthStr = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;
    const nextMonthStr = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}`;

    const currentMonthData = currentRegionData.find(item => item.date === currentMonthStr);
    const lastMonthData = currentRegionData.find(item => item.date === lastMonthStr);
    const nextMonthData = currentRegionData.find(item => item.date === nextMonthStr);

    let lastMonthChange = 0;
    let lastMonthChangePercent = 0;
    let nextMonthChange = 0;
    let nextMonthChangePercent = 0;

    // 지난달 대비 현재달 변화
    if (currentMonthData && lastMonthData) {
      lastMonthChange = (currentMonthData.deaths || 0) - (lastMonthData.deaths || 0);
      lastMonthChangePercent = lastMonthData.deaths ? ((lastMonthChange / lastMonthData.deaths) * 100) : 0;
    }

    // 현재달 대비 다음달 변화
    if (currentMonthData && nextMonthData) {
      nextMonthChange = (nextMonthData.deaths || 0) - (currentMonthData.deaths || 0);
      nextMonthChangePercent = currentMonthData.deaths ? ((nextMonthChange / currentMonthData.deaths) * 100) : 0;
    }

    // 배치 데이터 처리 - 현재 조정된 배치 데이터 우선 사용
    let currentStaff = 0;
    let recommendedStaff = 0;
    
    if (currentAllocation && Object.keys(currentAllocation).length > 0) {
      // Menu2N에서 전달받은 현재 조정된 배치 데이터 사용
      if (region === '전체') {
        currentStaff = Object.values(currentAllocation).reduce((sum, val) => sum + val, 0);
        // 추천 인력은 deploymentData에서 가져오기
        if (deploymentData) {
          recommendedStaff = Object.values(deploymentData).reduce((sum, data) => sum + data.recommended, 0);
        }
      } else if (currentAllocation[region] !== undefined) {
        currentStaff = currentAllocation[region];
        // 추천 인력은 deploymentData에서 가져오기
        if (deploymentData && deploymentData[region]) {
          recommendedStaff = deploymentData[region].recommended;
        }
      }
    } else if (deploymentData && Object.keys(deploymentData).length > 0) {
      // 조정된 배치 데이터가 없으면 기본 배치 데이터 사용
      if (region === '전체') {
        currentStaff = Object.values(deploymentData).reduce((sum, data) => sum + data.current, 0);
        recommendedStaff = Object.values(deploymentData).reduce((sum, data) => sum + data.recommended, 0);
      } else if (deploymentData[region]) {
        const data = deploymentData[region];
        currentStaff = data.current;
        recommendedStaff = data.recommended;
      }
    }

    return {
      lastMonthChange: Math.round(lastMonthChange),
      lastMonthChangePercent: lastMonthChangePercent.toFixed(1),
      nextMonthChange: Math.round(nextMonthChange),
      nextMonthChangePercent: nextMonthChangePercent.toFixed(1),
      currentStaff,
      recommendedStaff
    };
  };

  // 현재 달과 다음 달 비교 분석
  const getCurrentVsNextMonthAnalysis = () => {
    if (!currentRegionData || !Array.isArray(currentRegionData)) {
      return {
        currentMonthDeaths: 0,
        nextMonthDeaths: 0,
        difference: 0,
        trend: 'unknown',
        trendIcon: '❓',
        trendColor: '#666',
        trendMessage: '데이터를 분석 중입니다...'
      };
    }

    const currentDate = new Date();
    const currentMonthStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const nextMonthStr = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}`;

    const currentMonthData = currentRegionData.find(item => item.date === currentMonthStr);
    const nextMonthData = currentRegionData.find(item => item.date === nextMonthStr);

    if (!currentMonthData || !nextMonthData) {
      return {
        currentMonthDeaths: 0,
        nextMonthDeaths: 0,
        difference: 0,
        trend: 'unknown',
        trendIcon: '❓',
        trendColor: '#666',
        trendMessage: '해당 기간의 데이터가 없습니다.'
      };
    }

    const currentDeaths = currentMonthData.deaths || 0;
    const nextDeaths = nextMonthData.deaths || 0;
    const difference = nextDeaths - currentDeaths;
    const percentChange = currentDeaths > 0 ? ((difference / currentDeaths) * 100) : 0;

    let trend, trendIcon, trendColor, trendMessage;

    if (Math.abs(difference) <= Math.max(currentDeaths * 0.05, 5)) { // 5% 이하 변화 또는 5명 이하 차이
      trend = 'stable';
      trendIcon = '➡️';
      trendColor = '#28a745';
      trendMessage = `다음 달 사망자 수가 현재와 유사할 것으로 예상됩니다 (${difference > 0 ? '+' : ''}${difference}명)`;
    } else if (difference > 0) {
      trend = 'increase';
      trendIcon = '📈';
      trendColor = '#dc3545';
      trendMessage = `다음 달 사망자 수가 ${difference}명 증가할 것으로 예상됩니다 (+${percentChange.toFixed(1)}%)`;
    } else {
      trend = 'decrease';
      trendIcon = '📉';
      trendColor = '#369CE3';
      trendMessage = `다음 달 사망자 수가 ${Math.abs(difference)}명 감소할 것으로 예상됩니다 (${percentChange.toFixed(1)}%)`;
    }

    return {
      currentMonthDeaths: currentDeaths,
      nextMonthDeaths: nextDeaths,
      difference,
      trend,
      trendIcon,
      trendColor,
      trendMessage,
      currentMonthStr,
      nextMonthStr
    };
  };

  const regionStatus = getRegionStatus();
  const summaryStats = getSummaryStats();
  const monthAnalysis = getCurrentVsNextMonthAnalysis();
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
        text: `${displayRegionName} 사망자 수 추이 (2024년 1월~2026년 12월)`,
        font: { size: 16, weight: 'bold' }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: '사망자 수'
        },
        // 동적으로 Y축 범위 조정
        afterDataLimits: function(scale) {
          const data = scale.chart.data.datasets.flatMap(dataset => 
            dataset.data.filter(value => value !== null && value !== undefined)
          );
          
          if (data.length > 0) {
            const minValue = Math.min(...data);
            const maxValue = Math.max(...data);
            const range = maxValue - minValue;
            const padding = range * 0.1; // 10% 여백
            
            // 최소값에서 여백을 빼되, 0보다 작아지지 않도록 조정
            scale.min = Math.max(0, minValue - padding);
            scale.max = maxValue + padding;
          }
        }
      },
      x: {
        title: {
          display: true,
          text: '월'
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          // 레이블을 적절히 표시
          callback: function(value, index) {
            const label = this.getLabelForValue(value);
            const currentMonthLabel = `${currentDate.year}-${String(currentDate.month).padStart(2, '0')}`;
            
            // 현재 월은 항상 표시
            if (label === currentMonthLabel) {
              return '★ ' + label;
            }
            
            // 1월과 7월만 표시하여 가독성 향상
            if (label.endsWith('-01') || label.endsWith('-07')) {
              return label;
            }
            
            return '';
          }
        }
      }
    },
    // 차트 호버 시 현재 월 표시
    interaction: {
      intersect: false,
      mode: 'index'
    },
    elements: {
      point: {
        radius: function(context) {
          const currentMonthLabel = `${currentDate.year}-${String(currentDate.month).padStart(2, '0')}`;
          const label = context.chart.data.labels[context.dataIndex];
          return label === currentMonthLabel ? 8 : 4;
        },
        backgroundColor: function(context) {
          const currentMonthLabel = `${currentDate.year}-${String(currentDate.month).padStart(2, '0')}`;
          const label = context.chart.data.labels[context.dataIndex];
          return label === currentMonthLabel ? '#B8860B' : context.dataset.borderColor;
        },
        borderColor: function(context) {
          const currentMonthLabel = `${currentDate.year}-${String(currentDate.month).padStart(2, '0')}`;
          const label = context.chart.data.labels[context.dataIndex];
          return label === currentMonthLabel ? '#fff' : context.dataset.borderColor;
        },
        borderWidth: function(context) {
          const currentMonthLabel = `${currentDate.year}-${String(currentDate.month).padStart(2, '0')}`;
          const label = context.chart.data.labels[context.dataIndex];
          return label === currentMonthLabel ? 3 : 1;
        }
      }
    }
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

      {/* 현재 vs 다음 달 안내 메시지 카드 */}
      <div className="p-4 mb-4" style={cardStyle}>
        <h5 className="mb-3" style={{ fontWeight: '600', color: '#2C1F14' }}>
          📊 {displayRegionName} 월간 변화 예측
        </h5>
        <div className="text-center p-4 rounded-3" style={{
          backgroundColor: `${monthAnalysis.trendColor}15`,
          border: `2px solid ${monthAnalysis.trendColor}30`
        }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>
            {monthAnalysis.trendIcon}
          </div>
          <h6 style={{ color: monthAnalysis.trendColor, fontWeight: '600', marginBottom: '15px' }}>
            {monthAnalysis.trendMessage}
          </h6>
          <Row className="g-3">
            <Col md={6}>
              <div className="text-center p-3 rounded-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#666' }}>
                  {monthAnalysis.currentMonthDeaths.toLocaleString()}명
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  현재 ({monthAnalysis.currentMonthStr?.slice(-2)}월)
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="text-center p-3 rounded-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: monthAnalysis.trendColor }}>
                  {monthAnalysis.nextMonthDeaths.toLocaleString()}명
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  예상 ({monthAnalysis.nextMonthStr?.slice(-2)}월)
                </div>
              </div>
            </Col>
          </Row>
          {monthAnalysis.difference !== 0 && (
            <div className="mt-3">
              <span className={`badge ${monthAnalysis.difference > 0 ? 'bg-danger' : 'bg-primary'} fs-6`}>
                {monthAnalysis.difference > 0 ? '+' : ''}{monthAnalysis.difference}명
                ({monthAnalysis.difference > 0 ? '증가' : '감소'})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 예측 요약 통계 */}
      <div className="p-4 mb-4" style={cardStyle}>
        <h5 className="mb-3" style={{ fontWeight: '600', color: '#2C1F14' }}>
          📈 {displayRegionName} 월간 변화 분석
        </h5>
        <Row className="g-3">
          <Col md={3}>
            <div className="text-center p-3 rounded-3" style={{
              backgroundColor: summaryStats.lastMonthChange >= 0 ? 'rgba(220, 53, 69, 0.1)' : 'rgba(25, 135, 84, 0.1)'
            }}>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: summaryStats.lastMonthChange >= 0 ? '#dc3545' : '#198754'
              }}>
                {summaryStats.lastMonthChange >= 0 ? '+' : ''}{summaryStats.lastMonthChange.toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>지난달 대비 변화</div>
              <div style={{
                fontSize: '11px',
                fontWeight: '600',
                color: summaryStats.lastMonthChange >= 0 ? '#dc3545' : '#198754'
              }}>
                ({summaryStats.lastMonthChangePercent >= 0 ? '+' : ''}{summaryStats.lastMonthChangePercent}%)
              </div>
            </div>
          </Col>
          <Col md={3}>
            <div className="text-center p-3 rounded-3" style={{
              backgroundColor: summaryStats.nextMonthChange >= 0 ? 'rgba(255, 193, 7, 0.1)' : 'rgba(54, 162, 235, 0.1)'
            }}>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: summaryStats.nextMonthChange >= 0 ? '#ffc107' : '#369CE3'
              }}>
                {summaryStats.nextMonthChange >= 0 ? '+' : ''}{summaryStats.nextMonthChange.toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>다음달 예상 변화</div>
              <div style={{
                fontSize: '11px',
                fontWeight: '600',
                color: summaryStats.nextMonthChange >= 0 ? '#ffc107' : '#369CE3'
              }}>
                ({summaryStats.nextMonthChangePercent >= 0 ? '+' : ''}{summaryStats.nextMonthChangePercent}%)
              </div>
            </div>
          </Col>
          <Col md={3}>
            <div className="text-center p-3 rounded-3" style={{ backgroundColor: 'rgba(255, 206, 84, 0.1)' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#FFCE54' }}>
                {summaryStats.currentStaff.toLocaleString()}명
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>현재 배치 인력</div>
            </div>
          </Col>
          <Col md={3}>
            <div className="text-center p-3 rounded-3" style={{ backgroundColor: 'rgba(75, 192, 192, 0.1)' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#4BC0C0' }}>
                {summaryStats.recommendedStaff.toLocaleString()}명
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>AI 추천 인력</div>
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
          <div className="mb-2" style={{ fontSize: '12px', color: '#666' }}>
            💡 2024년 1월부터 2026년 12월까지 순차적으로 표시
          </div>
          <div style={{ height: '400px' }}>
            <Line
              data={chartData}
              options={chartOptions}
              plugins={[{
                id: 'currentMonthHighlight',
                afterDraw: (chart) => {
                  const currentMonthLabel = `${currentDate.year}-${String(currentDate.month).padStart(2, '0')}`;
                  const ctx = chart.ctx;
                  const xAxis = chart.scales.x;
                  const yAxis = chart.scales.y;
                  const labels = chart.data.labels;
                  const index = labels.indexOf(currentMonthLabel);

                  if (index !== -1) {
                    const x = xAxis.getPixelForValue(index);

                    // 반투명 배경 영역 그리기
                    ctx.save();
                    ctx.fillStyle = 'rgba(184, 134, 11, 0.1)';
                    const areaWidth = 30;
                    ctx.fillRect(x - areaWidth/2, yAxis.top, areaWidth, yAxis.height);
                    
                    // 수직선 그리기
                    ctx.beginPath();
                    ctx.moveTo(x, yAxis.top);
                    ctx.lineTo(x, yAxis.bottom);
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = '#B8860B';
                    ctx.setLineDash([5, 5]);
                    ctx.stroke();
                    ctx.setLineDash([]);

                    // 텍스트 라벨 그리기
                    ctx.fillStyle = '#B8860B';
                    ctx.textAlign = 'center';
                    ctx.font = 'bold 16px sans-serif';
                    ctx.fillText('현재', x, yAxis.bottom - 15);
                    
                    // 현재 월의 데이터 포인트 강조
                    const currentData = chart.data.datasets.find(dataset =>
                      dataset.data[index] !== null && dataset.data[index] !== undefined
                    );
                    
                    if (currentData && currentData.data[index]) {
                      const y = yAxis.getPixelForValue(currentData.data[index]);
                      ctx.beginPath();
                      ctx.arc(x, y, 8, 0, 2 * Math.PI);
                      ctx.fillStyle = '#B8860B';
                      ctx.fill();
                      ctx.strokeStyle = '#fff';
                      ctx.lineWidth = 3;
                      ctx.stroke();
                    }
                    
                    ctx.restore();
                  }
                }
              }]}
            />
          </div>
        </div>
      )}

      {/* 월별 데이터 테이블 - 연속성 있는 타임라인 디자인 */}
      {currentRegionData && Array.isArray(currentRegionData) && (
        <div className="p-4" style={cardStyle}>
          <h5 className="mb-3" style={{ fontWeight: '600', color: '#2C1F14' }}>
            📋 {displayRegionName} 월별 상세 데이터
          </h5>
          
          {/* Year Tabs */}
          <div className="d-flex justify-content-center mb-3" style={{ gap: '10px' }}>
            {[2024, 2025, 2026].map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  border: '2px solid',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  borderColor: selectedYear === year ? '#B8860B' : '#ddd',
                  backgroundColor: selectedYear === year ? '#B8860B' : 'white',
                  color: selectedYear === year ? 'white' : '#333',
                  boxShadow: selectedYear === year ? '0 4px 15px rgba(184, 134, 11, 0.4)' : 'none'
                }}
              >
                {year}년
              </button>
            ))}
          </div>
          
          {(() => {
            const yearData = currentRegionData
              .filter(item => item.date.startsWith(selectedYear))
              .sort((a, b) => a.date.localeCompare(b.date));
            
            if (yearData.length === 0) {
              return <p style={{textAlign: 'center', color: '#666'}}>해당 연도의 데이터가 없습니다.</p>;
            }

            const firstHalf = yearData.filter(item => {
                const month = parseInt(item.date.split('-')[1], 10);
                return month >= 1 && month <= 6;
            });
            const secondHalf = yearData.filter(item => {
                const month = parseInt(item.date.split('-')[1], 10);
                return month >= 7 && month <= 12;
            });

            const renderMonthRow = (data, isSecondRow = false) => (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, 1fr)',
                  gap: '16px',
                  padding: '16px',
                  background: 'rgba(248, 249, 250, 0.5)',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  marginBottom: isSecondRow ? 0 : '16px'
                }}>
                  {data.map((item, index) => {
                    const isCurrentMonth = item.date === `${currentDate.year}-${String(currentDate.month).padStart(2, '0')}`;
                    const [, month] = item.date.split('-');
                    const monthNum = parseInt(month, 10);
                    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

                    const [itemYear, itemMonth] = item.date.split('-').map(Number);
                    const prevMonthDate = new Date(itemYear, itemMonth - 2, 1);
                    const prevMonthDateStr = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}`;
                    const prevMonthData = currentRegionData.find(d => d.date === prevMonthDateStr);
                    const changeFromPrevMonth = prevMonthData ? (item.deaths || 0) - (prevMonthData.deaths || 0) : null;

                    return (
                      <div 
                        key={index}
                        style={{
                          background: isCurrentMonth 
                            ? 'linear-gradient(135deg, rgba(184, 134, 11, 0.2), rgba(184, 134, 11, 0.35))'
                            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.95))',
                          border: isCurrentMonth 
                            ? '3px solid #B8860B' 
                            : '1px solid rgba(0, 0, 0, 0.1)',
                          borderRadius: '12px',
                          padding: '16px 12px',
                          position: 'relative',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          transform: isCurrentMonth ? 'scale(1.05)' : 'scale(1)',
                          boxShadow: isCurrentMonth 
                            ? '0 8px 25px rgba(184, 134, 11, 0.4)' 
                            : '0 2px 8px rgba(0, 0, 0, 0.1)',
                          zIndex: isCurrentMonth ? 10 : 1
                        }}
                      >
                        {isCurrentMonth && (
                          <div style={{
                            position: 'absolute',
                            top: '-10px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: 'linear-gradient(135deg, #B8860B, #D4AF37)',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '8px',
                            fontSize: '10px',
                            fontWeight: '700',
                            boxShadow: '0 2px 8px rgba(184, 134, 11, 0.4)',
                            whiteSpace: 'nowrap'
                          }}>
                            📍 현재
                          </div>
                        )}
                        <div style={{ fontSize: '14px', fontWeight: '700', color: isCurrentMonth ? '#B8860B' : '#2C1F14', marginBottom: '8px', textAlign: 'center' }}>
                          {monthNames[monthNum - 1]}
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: '800', color: isCurrentMonth ? '#B8860B' : '#2C1F14', textAlign: 'center', marginBottom: '8px', lineHeight: '1' }}>
                          {(item.deaths || 0).toLocaleString()}명
                        </div>
                        <div style={{ fontSize: '12px', fontWeight: '600', color: (item.growthRate || 0) >= 0 ? '#dc3545' : '#198754', textAlign: 'center', marginBottom: '6px' }}>
                          증가율: {(item.growthRate || 0) >= 0 ? '+' : ''}{(item.growthRate || 0).toFixed(1)}%
                        </div>
                        {changeFromPrevMonth !== null && (
                          <div style={{ fontSize: '11px', fontWeight: '500', color: changeFromPrevMonth >= 0 ? '#dc3545' : '#198754', textAlign: 'center' }}>
                            전월 대비: {changeFromPrevMonth >= 0 ? '+' : ''}{changeFromPrevMonth.toLocaleString()}명
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
            );
            
            return (
              <div>
                {renderMonthRow(firstHalf)}
                {renderMonthRow(secondHalf, true)}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

// 인력배치 지도 컴포넌트
const StaffMap = ({ selectedRegion, onRegionSelect, staffData, deploymentData, currentAllocation }) => {
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

  // 지역별 위치 정보
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

  // 지역별 인력 데이터 가져오기
  const getRegionStaffData = (regionName) => {
    if (!staffData || !Array.isArray(staffData)) return null;
    return staffData.find(item => item.regionName === regionName);
  };

  // 지역 배경색 결정 (현재 조정된 배치 현황 기준)
  const getRegionBackground = (regionName, isActive, isHovered) => {
    if (isActive) return themeColors.activeBackground;
    
    // 2N에서 전달받은 배치 데이터가 있으면 사용
    if (deploymentData && deploymentData[regionName]) {
      const data = deploymentData[regionName];
      
      // 현재 조정된 배치 데이터가 있으면 사용, 없으면 기본 배치 데이터 사용
      const currentStaffCount = currentAllocation && currentAllocation[regionName] !== undefined 
        ? currentAllocation[regionName] 
        : data.current;
      
      const recommendedStaffCount = data.recommended;
      
      // 상태 계산
      if (currentStaffCount === recommendedStaffCount) {
        return 'rgba(40, 167, 69, 0.7)'; // 초록색 - 적정
      } else if (currentStaffCount < recommendedStaffCount) {
        return 'rgba(220, 53, 69, 0.7)'; // 빨간색 - 부족
      } else {
        return 'rgba(255, 193, 7, 0.7)'; // 노란색 - 과잉
      }
    }
    
    // 배치 데이터가 없으면 기존 로직 사용
    const staffInfo = getRegionStaffData(regionName);
    if (!staffInfo) return themeColors.primaryGradient;
    
    // staffChange가 양수면 AI 추천 인력이 더 많음 (현재 부족) -> 빨강
    // staffChange가 음수면 AI 추천 인력이 더 적음 (현재 과잉) -> 노랑
    // staffChange가 0이면 최적 -> 초록
    if (staffInfo.staffChange > 0) return 'rgba(220, 53, 69, 0.7)'; // Red
    if (staffInfo.staffChange < 0) return 'rgba(255, 193, 7, 0.7)'; // Yellow
    return 'rgba(40, 167, 69, 0.7)'; // Green (optimal)
  };

  return (
    <div style={{ position: 'relative', width: '100%', margin: '20px auto 0' }}>
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
        전국
      </button>

      {/* 지도 우측 상단 범례 */}
      <div style={{
        position: 'absolute',
        top: '50px',
        right: '20px',
        zIndex: 10,
        background: 'rgba(255, 255, 255, 0.95)',
        border: '1px solid rgba(184, 134, 11, 0.3)',
        borderRadius: '12px',
        padding: '12px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <h6 style={{ fontSize: '12px', fontWeight: '700', color: '#2C1F14', marginBottom: '10px', textAlign: 'center' }}>
          {deploymentData ? '지역 배치 상태' : ''}
        </h6>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              background: 'rgba(40, 167, 69, 0.7)',
              borderRadius: '50%',
              flexShrink: 0
            }}></div>
            <small style={{ fontSize: '11px', color: '#2C1F14', whiteSpace: 'nowrap' }}>
              {deploymentData ? '적정 배치' : '1'}
            </small>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              background: 'rgba(220, 53, 69, 0.7)',
              borderRadius: '50%',
              flexShrink: 0
            }}></div>
            <small style={{ fontSize: '11px', color: '#2C1F14', whiteSpace: 'nowrap' }}>
              {deploymentData ? '인력 부족' : '2'}
            </small>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              background: 'rgba(255, 193, 7, 0.7)',
              borderRadius: '50%',
              flexShrink: 0
            }}></div>
            <small style={{ fontSize: '11px', color: '#2C1F14', whiteSpace: 'nowrap' }}>
              {deploymentData ? '인력 과잉' : '3'}
            </small>
          </div>
        </div>
        {deploymentData && (
          <div className="mt-2 text-center">
            <small style={{ fontSize: '10px', color: '#666', fontStyle: 'italic' }}>
            </small>
          </div>
        )}
      </div>

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
              title={(() => {
                // 현재 조정된 배치 데이터가 있으면 표시
                if (deploymentData && deploymentData[region]) {
                  const data = deploymentData[region];
                  const currentStaffCount = currentAllocation && currentAllocation[region] !== undefined 
                    ? currentAllocation[region] 
                    : data.current;
                  const recommendedStaffCount = data.recommended;
                  
                  let status = '';
                  if (currentStaffCount === recommendedStaffCount) {
                    status = '적정 배치';
                  } else if (currentStaffCount < recommendedStaffCount) {
                    status = `부족 배치 (-${recommendedStaffCount - currentStaffCount}명)`;
                  } else {
                    status = `과잉 배치 (+${currentStaffCount - recommendedStaffCount}명)`;
                  }
                  
                  return `${region}: 현재 배치 ${currentStaffCount}명 / AI 추천 ${recommendedStaffCount}명 (${status})`;
                }
                return region;
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
                color: isActive ? themeColors.activeColor : '#2C1F14',
                whiteSpace: 'nowrap',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: '600' }}>{pos.shortName}</div>
              {deploymentData && deploymentData[region] && (
                <div style={{ fontSize: '11px', fontWeight: '700' }}>
                  {currentAllocation && currentAllocation[region] !== undefined 
                    ? currentAllocation[region] 
                    : deploymentData[region].current}명
                </div>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Menu2F;