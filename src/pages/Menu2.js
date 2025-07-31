// src/pages/Menu2.js

import React, { useState, useEffect } from 'react';
import InteractiveMap from '../components/InteractiveMap';
import RegionDataDisplay from '../components/RegionDataDisplay';

const Menu2 = () => {
  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [animateCard, setAnimateCard] = useState(false);

  useEffect(() => {
    setAnimateCard(true);
  }, []);

  return (
    <div className="page-wrapper" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className={`dashboard-container ${animateCard ? 'animate-in' : ''}`} style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '1600px',
        minHeight: 'calc(100vh - 40px)',
        margin: '0 auto',
        display: 'flex',
        boxSizing: 'border-box',
        background: 'rgba(255, 255, 255, 0.7)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        borderRadius: '20px',
        transform: animateCard ? 'translateY(0)' : 'translateY(30px)',
        opacity: animateCard ? 1 : 0,
        transition: 'all 0.6s ease-out',
        padding: '20px',
        gap: '20px'
      }}>
        <div style={{ flex: '0 0 400px', display: 'flex', flexDirection: 'column' }}>

          <h4 className="mb-3" style={{ fontSize: '30px', fontWeight: '700', color: '#343a40', paddingLeft: '10px' }}>
            통합 대시보드
          </h4>
          <div className="dashboard-left" style={{
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '15px',
            padding: '20px',
            height: 'min-content',
            position: 'sticky',
            top: '20px'
          }}>
            <InteractiveMap
              selectedRegion={selectedRegion}
              onRegionSelect={setSelectedRegion}
            />
          </div>
        </div>

        <div className="dashboard-right" style={{
          flex: '1', // 나머지 공간 모두 차지
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 80px)', // 스크롤을 위한 높이 설정
          paddingRight: '10px'
        }}>
          <RegionDataDisplay region={selectedRegion} />
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-in {
          animation: fadeInUp 0.6s ease-out;
        }

        .dashboard-right::-webkit-scrollbar {
          width: 6px;
        }
        .dashboard-right::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
        .dashboard-right::-webkit-scrollbar-thumb {
          background-color: rgba(108, 117, 125, 0.5);
          border-radius: 10px;
        }

        @media (max-width: 1200px) {
          .dashboard-container {
            flex-direction: column;
            min-height: auto;
          }
          .dashboard-left {
            position: static;
            width: 100%;
            flex: 0 0 auto;
          }
          .dashboard-right {
            max-height: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Menu2;