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
      '--navbar-height': '70px',
      minHeight: 'calc(100vh - var(--navbar-height))',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '20px',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
    }}>
      <div className={`dashboard-container ${animateCard ? 'animate-in' : ''}`} style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '1600px',
        height: 'auto',
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
        gap: '20px',
      }}>
        <div style={{ flex: '0 0 400px' }}>
          <div className="dashboard-left" style={{
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '15px',
            padding: '20px',
            position: 'sticky',
            top: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}>
            <h4 className="mb-3" style={{
              fontSize: '30px',
              fontWeight: '700',
              color: '#343a40',
              paddingLeft: '10px',
              margin: 0
            }}>
              통합 대시보드
            </h4>
            <InteractiveMap
              selectedRegion={selectedRegion}
              onRegionSelect={setSelectedRegion}
            />
          </div>
        </div>

        <div className="dashboard-right" style={{
          flex: '1 1 65%', 
          minWidth: 0, 
          paddingRight: '10px'
        }}>
          <RegionDataDisplay region={selectedRegion} />
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in { animation: fadeInUp 0.6s ease-out; }

        @media (max-width: 992px) {
          .dashboard-container {
            flex-direction: column;
            height: auto;
          }
          .dashboard-left {
            position: static;
            width: 100%;
            flex: 0 0 auto;
          }
          .dashboard-right {
            height: auto;
            max-height: none;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Menu2;