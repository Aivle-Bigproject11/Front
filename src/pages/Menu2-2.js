import React, { useState, useEffect } from 'react';
import InteractiveMap from '../components/InteractiveMap';
import RegionDataDisplay from '../components/RegionDataDisplay';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Menu2_2 = () => {
  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [animateCard, setAnimateCard] = useState(false);
  const [staffAllocation, setStaffAllocation] = useState({});
  const [reallocationPlan, setReallocationPlan] = useState({});
  const [showReallocation, setShowReallocation] = useState(false);
  const [predictionData, setPredictionData] = useState(null);

  // 기본 인원 배치 데이터
  const baseStaffAllocation = {
    '서울': { current: 120, needed: 0, adjacent: ['경기', '인천'], position: { top: '20%', left: '35%' } },
    '경기': { current: 150, needed: 0, adjacent: ['서울', '인천', '충남'], position: { top: '11%', left: '37%' } },
    '부산': { current: 80, needed: 0, adjacent: ['대구', '울산'], position: { top: '63%', left: '77%' } },
    '대구': { current: 60, needed: 0, adjacent: ['부산', '경기'], position: { top: '51%', left: '65%' } },
    '인천': { current: 70, needed: 0, adjacent: ['서울', '경기'], position: { top: '22%', left: '17%' } },
    '충남': { current: 50, needed: 0, adjacent: ['경기', '세종'], position: { top: '43%', left: '24%' } },
    '광주': { current: 40, needed: 0, adjacent: ['울산'], position: { top: '63%', left: '30%' } },
    '울산': { current: 35, needed: 0, adjacent: ['부산', '광주'], position: { top: '55%', left: '83%' } },
    '세종': { current: 20, needed: 0, adjacent: ['충남'], position: { top: '35%', left: '35%' } }
  };

  useEffect(() => {
    setAnimateCard(true);
    setStaffAllocation(baseStaffAllocation);
  }, []);

  // 예측 데이터 기반 상대적 워크로드 증가율 계산
  const calculateWorkloadChanges = async () => {
    try {
      const jsonResponse = await fetch('/monthly_predictions.json');
      const predictionJson = await jsonResponse.json();
      setPredictionData(predictionJson);
      
      const multipliers = { 
        '서울': 0.21, '경기': 0.26, '부산': 0.07, 
        '대구': 0.05, '인천': 0.06, '충남': 0.04, 
        '광주': 0.03, '울산': 0.02, '세종': 0.01 
      };

      const nextMonthPrediction = predictionJson.predictions[0];
      const currentMonthBaseline = predictionJson.predictions[0].predicted_deaths; // 기준값
      
      const staffNeeds = {};
      const workloadChanges = [];

      // 각 지역별 상대적 워크로드 변화 계산
      Object.keys(multipliers).forEach(region => {
        const predictedCases = Math.round(nextMonthPrediction.predicted_deaths * multipliers[region]);
        const currentCapacity = baseStaffAllocation[region].current * 8; // 현재 처리 가능 건수
        const workloadRatio = predictedCases / currentCapacity; // 워크로드 비율
        
        workloadChanges.push({
          region,
          workloadRatio,
          predictedCases,
          currentCapacity
        });
      });

      // 평균 워크로드 계산
      const avgWorkload = workloadChanges.reduce((sum, item) => sum + item.workloadRatio, 0) / workloadChanges.length;
      
      // 상대적 워크로드 증가율 계산 및 재배치 결정
      workloadChanges.forEach(item => {
        const workloadIncrease = (item.workloadRatio - avgWorkload) / avgWorkload;
        const adjustmentNeeded = Math.round(baseStaffAllocation[item.region].current * Math.abs(workloadIncrease) * 0.3); // 30% 조정
        
        staffNeeds[item.region] = {
          ...baseStaffAllocation[item.region],
          predictedCases: item.predictedCases,
          currentCapacity: item.currentCapacity,
          workloadRatio: item.workloadRatio,
          workloadIncrease: workloadIncrease,
          adjustmentNeeded: workloadIncrease > 0.1 ? adjustmentNeeded : workloadIncrease < -0.1 ? -adjustmentNeeded : 0,
          needsSupport: workloadIncrease > 0.1,
          canProvideSupport: workloadIncrease < -0.1
        };
      });

      return staffNeeds;
    } catch (error) {
      console.error('예측 데이터 로드 실패:', error);
      return baseStaffAllocation;
    }
  };

  // 상대적 워크로드 기반 스마트 재배치 계획 수립
  const generateSmartReallocationPlan = (staffNeeds) => {
    const plan = {};
    const supportProviders = [];
    const supportReceivers = [];

    Object.entries(staffNeeds).forEach(([region, data]) => {
      if (data.canProvideSupport) {
        supportProviders.push({ 
          region, 
          availableSupport: Math.abs(data.adjustmentNeeded),
          adjacent: data.adjacent,
          workloadIncrease: data.workloadIncrease
        });
      }
      if (data.needsSupport) {
        supportReceivers.push({ 
          region, 
          requiredSupport: data.adjustmentNeeded,
          adjacent: data.adjacent,
          workloadIncrease: data.workloadIncrease
        });
      }
    });

    // 워크로드 증가율이 높은 순으로 정렬
    supportReceivers.sort((a, b) => b.workloadIncrease - a.workloadIncrease);
    
    supportReceivers.forEach(receiverData => {
      const { region: receiverRegion, requiredSupport, adjacent } = receiverData;
      let remainingNeed = requiredSupport;
      const allocations = [];

      // 인접 지역 우선으로 지원 찾기
      adjacent.forEach(adjacentRegion => {
        if (remainingNeed > 0) {
          const providerData = supportProviders.find(p => p.region === adjacentRegion && p.availableSupport > 0);
          if (providerData) {
            const transferAmount = Math.min(remainingNeed, providerData.availableSupport);
            allocations.push({
              from: adjacentRegion,
              amount: transferAmount,
              efficiency: Math.abs(providerData.workloadIncrease) // 효율성 지표
            });
            providerData.availableSupport -= transferAmount;
            remainingNeed -= transferAmount;
          }
        }
      });

      // 인접하지 않은 지역에서도 지원 가능한 경우 찾기
      if (remainingNeed > 0) {
        const otherProviders = supportProviders
          .filter(p => !adjacent.includes(p.region) && p.availableSupport > 0)
          .sort((a, b) => b.workloadIncrease - a.workloadIncrease); // 여유도가 높은 순

        otherProviders.forEach(providerData => {
          if (remainingNeed > 0) {
            const transferAmount = Math.min(remainingNeed, providerData.availableSupport, Math.floor(remainingNeed / 2)); // 최대 50%만 타지역에서
            if (transferAmount > 0) {
              allocations.push({
                from: providerData.region,
                amount: transferAmount,
                efficiency: Math.abs(providerData.workloadIncrease),
                isDistant: true
              });
              providerData.availableSupport -= transferAmount;
              remainingNeed -= transferAmount;
            }
          }
        });
      }

      if (allocations.length > 0) {
        plan[receiverRegion] = {
          workloadIncrease: receiverData.workloadIncrease,
          totalRequired: requiredSupport,
          totalAllocated: requiredSupport - remainingNeed,
          remainingNeed: remainingNeed,
          allocations: allocations.sort((a, b) => b.efficiency - a.efficiency)
        };
      }
    });

    return plan;
  };

  const handleReallocationAnalysis = async () => {
    const staffNeeds = await calculateWorkloadChanges();
    setStaffAllocation(staffNeeds);
    
    const plan = generateSmartReallocationPlan(staffNeeds);
    setReallocationPlan(plan);
    setShowReallocation(true);
    
    console.log(`'${selectedRegion}' 지역을 포함한 전국 스마트 인원 재배치 분석을 실행합니다.`);
  };

  // 예측 차트 데이터 생성
  const generatePredictionChart = () => {
    if (!predictionData) return null;

    const labels = predictionData.predictions.slice(0, 6).map(p => p.date);
    const data = predictionData.predictions.slice(0, 6).map(p => p.predicted_deaths);

    return {
      labels,
      datasets: [{
        label: '다음 6개월 예측',
        data,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 3,
        pointBackgroundColor: 'rgb(75, 192, 192)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        tension: 0.4,
        fill: true
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 14, weight: 'bold' },
          color: '#2C1F14'
        }
      },
      title: {
        display: true,
        text: '향후 6개월 예측 트렌드',
        font: { size: 18, weight: 'bold' },
        color: '#2C1F14'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.1)' },
        ticks: { color: '#666', font: { size: 12 } }
      },
      x: {
        grid: { color: 'rgba(0,0,0,0.1)' },
        ticks: { color: '#666', font: { size: 12 } }
      }
    }
  };

  return (
    <div className="page-wrapper" style={{
      '--navbar-height': '62px',
      height: 'calc(100vh - var(--navbar-height))',
      background: 'linear-gradient(135deg, #f7f3e9 0%, #e8e2d5 100%)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>

      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23B8860B" fill-opacity="0.08"%3E%3Cpath d="M40 40L20 20v40h40V20L40 40zm0-20L60 0H20l20 20zm0 20L20 60h40L40 40z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
        opacity: 0.5
      }}></div>

      <div className={`dashboard-container ${animateCard ? 'animate-in' : ''}`} style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        height: '100%',
        margin: '0 auto',
        background: 'rgba(255, 251, 235, 0.95)',
        boxShadow: '0 20px 60px rgba(44, 31, 20, 0.4)',
        backdropFilter: 'blur(15px)',
        borderRadius: '28px',
        border: '2px solid rgba(184, 134, 11, 0.35)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* 헤더 영역 */}
        <div style={{
          padding: '30px 40px 20px',
          background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.15) 0%, rgba(205, 133, 63, 0.1) 100%)',
          borderBottom: '2px solid rgba(184, 134, 11, 0.2)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ 
              fontSize: '42px', 
              fontWeight: '800', 
              color: '#2C1F14',
              margin: 0,
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}>
              <i className="fas fa-users-cog me-3" style={{ color: '#D4AF37' }}></i>
              스마트 인원 재배치 시스템
            </h1>
            <button 
              className="analysis-btn" 
              onClick={handleReallocationAnalysis}
              style={{
                padding: '15px 30px',
                fontSize: '18px',
                fontWeight: '700',
                color: '#fff',
                background: showReallocation 
                  ? 'linear-gradient(135deg, #28a745, #20c997)' 
                  : 'linear-gradient(135deg, #007bff, #0056b3)',
                border: 'none',
                borderRadius: '15px',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 12px 35px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
              }}
            >
              <i className={`fas ${showReallocation ? 'fa-sync-alt' : 'fa-chart-line'} me-2`}></i>
              {showReallocation ? '재분석 실행' : '인원 재배치 분석'}
            </button>
          </div>
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div style={{ 
          flex: 1, 
          padding: '30px 40px', 
          overflow: 'hidden',
          display: 'flex',
          gap: '30px'
        }}>
          
          {/* 왼쪽: 지도와 현황 */}
          <div style={{ 
            flex: '1.2', 
            display: 'flex', 
            flexDirection: 'column',
            gap: '25px'
          }}>
            
            {/* 지도 영역 */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
              border: '1px solid rgba(184, 134, 11, 0.2)',
              position: 'relative',
              height: '450px',
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h3 style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                color: '#2C1F14',
                marginBottom: '20px',
                textAlign: 'center',
                flexShrink: 0
              }}>
                <i className="fas fa-map-marked-alt me-2" style={{ color: '#D4AF37' }}></i>
                지역별 현재 배치 현황
              </h3>
              
              <div style={{ 
                position: 'relative', 
                zIndex: 1, 
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  maxHeight: '350px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <InteractiveMap
                    selectedRegion={selectedRegion}
                    onRegionSelect={setSelectedRegion}
                  />
                </div>
                
                {/* 지도 위 인원 정보 오버레이 */}
                {showReallocation && Object.entries(staffAllocation).map(([region, data]) => {
                  // 지도 컨테이너 내에서의 상대적 위치 계산
                  const adjustedTop = `calc(${data.position?.top || '50%'} + 60px)`;
                  const adjustedLeft = data.position?.left || '50%';
                  
                  return (
                    <div
                      key={region}
                      style={{
                        position: 'absolute',
                        top: adjustedTop,
                        left: adjustedLeft,
                        transform: 'translate(-50%, -120%)',
                        background: data.workloadIncrease > 0.1 
                          ? 'linear-gradient(135deg, #ff6b6b, #ff5252)' 
                          : data.workloadIncrease < -0.1 
                          ? 'linear-gradient(135deg, #51cf66, #40c057)' 
                          : 'linear-gradient(135deg, #74c0fc, #339af0)',
                        color: 'white',
                        padding: '6px 10px',
                        borderRadius: '10px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                        whiteSpace: 'nowrap',
                        zIndex: 50,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                        pointerEvents: 'none' // 클릭 방지
                      }}
                    >
                      {data.workloadIncrease > 0.1 && `+${(data.workloadIncrease * 100).toFixed(1)}%`}
                      {data.workloadIncrease < -0.1 && `${(data.workloadIncrease * 100).toFixed(1)}%`}
                      {Math.abs(data.workloadIncrease) <= 0.1 && '평균'}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 예측 차트 */}
            {showReallocation && predictionData && (
              <div style={{
                background: 'white',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                border: '1px solid rgba(184, 134, 11, 0.2)',
                height: '300px',
                position: 'relative',
                zIndex: 2
              }}>
                <Line data={generatePredictionChart()} options={chartOptions} />
              </div>
            )}
          </div>

          {/* 오른쪽: 상세 정보 */}
          <div style={{ 
            flex: '1', 
            display: 'flex', 
            flexDirection: 'column',
            gap: '20px'
          }}>
            {!showReallocation ? (
              <div style={{
                background: 'white',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                border: '1px solid rgba(184, 134, 11, 0.2)',
                height: '100%',
                overflow: 'auto'
              }}>
                <RegionDataDisplay region={selectedRegion} />
              </div>
            ) : (
              <>
                {/* 전체 현황 요약 */}
                <div style={{
                  background: 'white',
                  borderRadius: '20px',
                  padding: '25px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(184, 134, 11, 0.2)'
                }}>
                  <h4 style={{ 
                    fontSize: '20px', 
                    fontWeight: '700', 
                    color: '#2C1F14',
                    marginBottom: '20px'
                  }}>
                    <i className="fas fa-chart-bar me-2" style={{ color: '#D4AF37' }}></i>
                    지역별 워크로드 분석
                  </h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    {['평균 워크로드', '최고 부하 지역', '최저 부하 지역', '재배치 대상'].map((label, index) => {
                      const workloads = Object.values(staffAllocation).map(data => data.workloadRatio || 0);
                      const avgWorkload = workloads.reduce((a, b) => a + b, 0) / workloads.length;
                      const maxWorkloadRegion = Object.entries(staffAllocation).reduce((max, [region, data]) => 
                        (data.workloadRatio || 0) > (staffAllocation[max]?.workloadRatio || 0) ? region : max, Object.keys(staffAllocation)[0]);
                      const minWorkloadRegion = Object.entries(staffAllocation).reduce((min, [region, data]) => 
                        (data.workloadRatio || 0) < (staffAllocation[min]?.workloadRatio || 0) ? region : min, Object.keys(staffAllocation)[0]);
                      const reallocationCount = Object.keys(reallocationPlan).length;
                      
                      const values = [
                        `${(avgWorkload * 100).toFixed(1)}%`,
                        maxWorkloadRegion,
                        minWorkloadRegion,
                        `${reallocationCount}개 지역`
                      ];
                      const colors = ['#74c0fc', '#ff6b6b', '#51cf66', '#ffd43b'];
                      
                      return (
                        <div key={label} style={{
                          background: `linear-gradient(135deg, ${colors[index]}, ${colors[index]}dd)`,
                          color: 'white',
                          padding: '20px',
                          borderRadius: '15px',
                          textAlign: 'center',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                        }}>
                          <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                            {label}
                          </div>
                          <div style={{ fontSize: index === 0 ? '24px' : '20px', fontWeight: '800' }}>
                            {values[index]}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 재배치 계획 */}
                {Object.keys(reallocationPlan).length > 0 && (
                  <div style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '25px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(184, 134, 11, 0.2)',
                    flex: 1,
                    overflow: 'auto'
                  }}>
                    <h4 style={{ 
                      fontSize: '20px', 
                      fontWeight: '700', 
                      color: '#2C1F14',
                      marginBottom: '20px'
                    }}>
                      <i className="fas fa-exchange-alt me-2" style={{ color: '#D4AF37' }}></i>
                      워크로드 기반 스마트 재배치
                    </h4>
                    
                    {Object.entries(reallocationPlan).map(([region, plan]) => (
                      <div key={region} style={{
                        background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
                        borderRadius: '15px',
                        padding: '20px',
                        marginBottom: '15px',
                        border: '2px solid rgba(184, 134, 11, 0.1)'
                      }}>
                        <h5 style={{ 
                          fontWeight: '700', 
                          color: '#495057',
                          marginBottom: '15px',
                          fontSize: '18px'
                        }}>
                          � {region} 지역 (워크로드 +{(plan.workloadIncrease * 100).toFixed(1)}%)
                        </h5>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                          <div style={{
                            background: 'linear-gradient(135deg, #ff6b6b, #ff5252)',
                            color: 'white',
                            padding: '12px',
                            borderRadius: '10px',
                            textAlign: 'center'
                          }}>
                            <div style={{ fontSize: '12px' }}>필요 지원</div>
                            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{plan.totalRequired}명</div>
                          </div>
                          <div style={{
                            background: 'linear-gradient(135deg, #51cf66, #40c057)',
                            color: 'white',
                            padding: '12px',
                            borderRadius: '10px',
                            textAlign: 'center'
                          }}>
                            <div style={{ fontSize: '12px' }}>확보 가능</div>
                            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{plan.totalAllocated}명</div>
                          </div>
                          <div style={{
                            background: plan.remainingNeed > 0 
                              ? 'linear-gradient(135deg, #ffd43b, #fab005)' 
                              : 'linear-gradient(135deg, #51cf66, #40c057)',
                            color: 'white',
                            padding: '12px',
                            borderRadius: '10px',
                            textAlign: 'center'
                          }}>
                            <div style={{ fontSize: '12px' }}>미해결</div>
                            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{plan.remainingNeed}명</div>
                          </div>
                        </div>
                        
                        <div>
                          <h6 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: '#666' }}>
                            � 효율성 순 재배치 경로:
                          </h6>
                          {plan.allocations.map((allocation, index) => (
                            <div key={index} style={{
                              background: 'white',
                              borderRadius: '8px',
                              padding: '12px',
                              marginBottom: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                              border: allocation.isDistant ? '2px dashed #ffd43b' : '1px solid #e9ecef'
                            }}>
                              <div style={{
                                background: allocation.isDistant 
                                  ? 'linear-gradient(135deg, #ffd43b, #fab005)'
                                  : 'linear-gradient(135deg, #339af0, #228be6)',
                                color: 'white',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                marginRight: '10px'
                              }}>
                                {allocation.from} {allocation.isDistant && '(원거리)'}
                              </div>
                              <i className="fas fa-arrow-right mx-2" style={{ color: '#D4AF37' }}></i>
                              <div style={{
                                background: 'linear-gradient(135deg, #51cf66, #40c057)',
                                color: 'white',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                marginRight: '10px'
                              }}>
                                {region}
                              </div>
                              <div style={{ 
                                marginLeft: 'auto',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: '#495057'
                              }}>
                                {allocation.amount}명
                              </div>
                              <div style={{
                                marginLeft: '10px',
                                fontSize: '12px',
                                color: '#666',
                                backgroundColor: '#f8f9fa',
                                padding: '4px 8px',
                                borderRadius: '4px'
                              }}>
                                효율 {(allocation.efficiency * 100).toFixed(1)}%
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 원본 데이터 보기 버튼 */}
                <button 
                  onClick={() => setShowReallocation(false)}
                  style={{
                    width: '100%',
                    padding: '15px',
                    background: 'linear-gradient(135deg, #868e96, #6c757d)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '15px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                  }}
                >
                  <i className="fas fa-chart-area me-2"></i>
                  예측 분석 데이터 보기
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .dashboard-container {
          opacity: 0;
        }

        .animate-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .analysis-btn {
          position: relative;
          overflow: hidden;
        }

        .analysis-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }

        .analysis-btn:hover::before {
          left: 100%;
        }

        /* 스크롤바 스타일링 */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, rgba(184, 134, 11, 0.6), rgba(184, 134, 11, 0.4));
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, rgba(184, 134, 11, 0.8), rgba(184, 134, 11, 0.6));
        }

        /* 호버 효과 */
        .region-card {
          transition: all 0.3s ease;
        }

        .region-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 35px rgba(0,0,0,0.15) !important;
        }

        /* 반응형 디자인 */
        @media (max-width: 1400px) {
          .page-wrapper {
            padding: 15px;
          }
          .dashboard-container {
            border-radius: 20px;
          }
        }

        @media (max-width: 1200px) {
          .page-wrapper {
            height: auto !important;
            min-height: calc(100vh - var(--navbar-height));
          }
          
          .dashboard-container {
            height: auto !important;
            min-height: calc(100vh - 90px);
          }
          
          .dashboard-container > div:last-child {
            flex-direction: column !important;
            gap: 20px !important;
          }
          
          .dashboard-container > div:last-child > div {
            flex: none !important;
          }
        }

        @media (max-width: 768px) {
          .page-wrapper {
            padding: 10px;
          }
          
          .dashboard-container > div:first-child {
            padding: 20px 20px 15px !important;
          }
          
          .dashboard-container > div:first-child h1 {
            fontSize: 28px !important;
          }
          
          .analysis-btn {
            padding: 12px 20px !important;
            fontSize: 16px !important;
          }
          
          .dashboard-container > div:last-child {
            padding: 20px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Menu2_2;