import React, { useState, useEffect } from 'react';
import InteractiveMap from '../components/InteractiveMap';
import RegionDataDisplay from '../components/RegionDataDisplay';
import { apiService } from '../services/api';

const Menu2 = () => {
  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [animateCard, setAnimateCard] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [globalData, setGlobalData] = useState(null); // 전체 데이터 저장

  // 초기 데이터 로딩
  useEffect(() => {
    const initializeData = async () => {
      console.log('📊 Menu2 초기 데이터 로딩 시작...');
      
      try {
        // 2025-01 데이터 요청 (1년간 데이터 생성)
        console.log('📅 2025-01 예측 데이터 요청 중...');
        
        const predictionRequest = {
          date: "2025-01"
        };
        
        const response = await apiService.requestPrediction(predictionRequest);
        console.log('✅ 초기 예측 데이터 생성 성공:', response);
        
        // 데이터 처리 시간 대기
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // 전체 데이터 조회하여 저장 (우선/관심/안정 지역 판정용)
        try {
          const globalDataResponse = await apiService.getDashboardByDate('2025-01');
          setGlobalData(globalDataResponse);
          console.log('✅ 전체 데이터 조회 성공:', globalDataResponse);
        } catch (dataError) {
          console.log('⚠️ 전체 데이터 조회 실패:', dataError.message);
        }
        
        console.log('✅ Menu2 초기 데이터 로딩 완료');
        
      } catch (error) {
        console.log('⚠️ 초기 예측 데이터 생성 실패 (기존 데이터 사용):', error.message);
      } finally {
        setIsInitialLoading(false);
        setAnimateCard(true);
      }
    };

    initializeData();
  }, []);

  const handleRefresh = async () => {
    // 분석 새로고침 로직
    console.log(`'${selectedRegion}' 지역 분석을 새로고침합니다.`);
    
    try {
      // 백엔드 API 테스트
      console.log('백엔드 API 테스트 시작...');
      
      // 1. 백엔드 서버 기본 연결 확인
      console.log('1. 백엔드 서버 연결 확인...');
      
      let serverAvailable = false;
      try {
        // 먼저 기본 GET 요청으로 서버 응답 확인
        const basicResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 5000
        });
        
        console.log('기본 GET 응답 상태:', basicResponse.status);
        if (basicResponse.status) {
          serverAvailable = true;
          console.log('✅ 백엔드 서버 기본 연결 성공');
        }
      } catch (basicError) {
        console.log('❌ 기본 연결 실패, actuator/health 시도...');
        
        // 기본 연결 실패 시 actuator/health 시도
        try {
          const healthResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/actuator/health`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
            timeout: 5000
          });
          
          if (healthResponse.ok) {
            serverAvailable = true;
            console.log('✅ 백엔드 서버 actuator/health 연결 성공');
          }
        } catch (healthError) {
          console.log('❌ actuator/health도 실패, 로그인 엔드포인트 시도...');
          
          // 마지막으로 알려진 작동 엔드포인트 시도
          try {
            const loginResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/managers/login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ loginId: 'test', loginPassword: 'test' })
            });
            
            // 400이나 401 응답도 서버가 살아있다는 의미
            if (loginResponse.status) {
              serverAvailable = true;
              console.log('✅ 백엔드 서버 로그인 엔드포인트로 연결 확인 (상태:', loginResponse.status, ')');
            }
          } catch (loginError) {
            console.log('❌ 모든 연결 시도 실패');
            throw new Error('백엔드 서버에 연결할 수 없습니다');
          }
        }
      }
      
      if (!serverAvailable) {
        throw new Error('백엔드 서버 응답 없음');
      }

      // 2. 예측 데이터 생성을 위한 초기 로딩 (2024-01, 2025-01)
      console.log('2. 예측 데이터 초기 로딩 시작...');
      
      const targetDates = ['2024-01', '2025-01'];
      let successCount = 0;
      
      for (const date of targetDates) {
        try {
          console.log(`📅 ${date} 데이터 생성 요청...`);
          
          // 단순한 요청으로 수정 (date만 전송)
          const predictionRequest = {
            date: date
          };
          
          console.log('예측 요청 데이터:', predictionRequest);
          const predictionResponse = await apiService.requestPrediction(predictionRequest);
          console.log(`✅ ${date} 예측 데이터 생성 성공:`, predictionResponse);
          successCount++;
          
          // 각 요청 사이에 잠시 대기 (서버 부하 방지)
          if (date !== targetDates[targetDates.length - 1]) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
          
        } catch (predError) {
          console.log(`⚠️ ${date} 예측 요청 실패 (기존 데이터가 있을 수 있음):`, predError.message);
          // 실패해도 계속 진행 (기존 데이터가 있을 수 있음)
        }
      }

      // 3. 데이터 생성 후 잠시 대기 (파이썬 모델 처리 시간 고려)
      console.log('3. 데이터 처리 완료 대기 중...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 4. 생성된 데이터 확인 및 지역별 데이터 조회
      console.log('4. 생성된 데이터 확인...');
      
      try {
        // 2025-01 데이터로 확인
        const dateData = await apiService.getDashboardByDate('2025-01');
        console.log('✅ 날짜별 데이터 응답 (2025-01):', dateData);
        
        // 전체 데이터 업데이트 (우선/관심/안정 지역 판정용)
        setGlobalData(dateData);
      } catch (dateError) {
        console.log('⚠️ 날짜별 데이터 조회 실패:', dateError.message);
      }
      
      // 5. 지역별 데이터 테스트 (전체가 아닌 경우)
      if (selectedRegion !== '전체') {
        try {
          console.log(`5. 지역별 데이터 요청: ${selectedRegion}`);
          const regionData = await apiService.getDashboardByRegion(selectedRegion);
          console.log('✅ 지역별 데이터 응답:', regionData);
        } catch (regionError) {
          console.log('⚠️ 지역별 데이터 조회 실패:', regionError.message);
        }
      }
      
      // RegionDataDisplay 컴포넌트를 다시 렌더링하기 위해 key 변경
      setRefreshKey(prev => prev + 1);
      
      const successMessage = successCount > 0 
        ? `🎉 예측 데이터 생성 완료! (${successCount}/${targetDates.length}개 성공)\n\n2024-01, 2025-01 데이터로 그래프를 그릴 수 있습니다.\n콘솔에서 상세 응답 데이터를 확인하세요.`
        : '⚠️ 새로운 예측 데이터 생성은 실패했지만\n기존 데이터로 대시보드를 표시합니다.\n콘솔에서 상세 내용을 확인하세요.';
      
      alert(successMessage);
      
    } catch (error) {
      console.error('API 테스트 실패:', error);
      console.error('에러 상세:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          method: error.config?.method,
          url: error.config?.url,
          baseURL: error.config?.baseURL
        }
      });
      
      // 에러 유형별 메시지 생성
      let errorMessage;
      if (error.response) {
        const status = error.response.status;
        if (status === 500) {
          errorMessage = `서버 내부 오류 (${status}): 백엔드에서 데이터베이스 연결 등에 문제가 있을 수 있습니다.`;
        } else if (status === 404) {
          errorMessage = `API 엔드포인트를 찾을 수 없습니다 (${status}): ${error.config?.url}`;
        } else if (status === 401) {
          errorMessage = `인증이 필요합니다 (${status}): 로그인 후 다시 시도해주세요.`;
        } else {
          errorMessage = `API 오류 (${status}): ${error.response.data?.message || error.message}`;
        }
      } else if (error.request) {
        errorMessage = `네트워크 연결 오류: 백엔드 서버(${process.env.REACT_APP_API_URL || 'http://localhost:8080'})에 연결할 수 없습니다.`;
      } else {
        errorMessage = `요청 설정 오류: ${error.message}`;
      }
      
      alert(`백엔드 API 테스트 실패:\n${errorMessage}\n\n자세한 내용은 콘솔을 확인하세요.`);
      
      // 에러가 발생해도 화면은 새로고침 (CSV 데이터로 폴백)
      setRefreshKey(prev => prev + 1);
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
            통합 대시보드
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
          <button className="refresh-btn" onClick={handleRefresh}>
            � 예측 데이터 생성 & 새로고침
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
            <RegionDataDisplay 
              key={refreshKey} 
              region={selectedRegion}
              globalData={globalData}
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

export default Menu2;