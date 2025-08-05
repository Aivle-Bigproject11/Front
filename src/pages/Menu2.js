import React, { useState, useEffect } from 'react';
import InteractiveMap from '../components/InteractiveMap';
import RegionDataDisplay from '../components/RegionDataDisplay';

const Menu2 = () => {
  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [animateCard, setAnimateCard] = useState(false);

  useEffect(() => {
    setAnimateCard(true);
  }, []);

  const handleRefresh = () => {
    // 분석 새로고침 로직을 여기에 추가할 수 있습니다.
    console.log(`'${selectedRegion}' 지역 분석을 새로고침합니다.`);
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
            분석 새로고침
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
          <RegionDataDisplay region={selectedRegion} />
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
      `}</style>
    </div>
  );
};

export default Menu2;