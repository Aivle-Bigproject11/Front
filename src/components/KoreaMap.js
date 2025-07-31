// src/components/KoreaMap.js

import React, { useState } from 'react';

// PNG 이미지 크기에 맞춰 각 지역의 좌표를 퍼센트(%)로 조정
const regionPositions = {
  '서울': { top: '20%', left: '35%' },
  '경기': { top: '11%', left: '37%' },
  '인천': { top: '22%', left: '17%' },
  '충남': { top: '43%', left: '24%' },
  '부산': { top: '63%', left: '77%' },
  '대구': { top: '51%', left: '65%' },
  '광주': { top: '63%', left: '30%' },
  '울산': { top: '55%', left: '83%' },
  '세종': { top: '35%', left: '35%' },
};

const KoreaMap = ({ selectedRegion, onRegionSelect }) => {
  const [hoveredRegion, setHoveredRegion] = useState(null);

  return (
    <div style={{ position: 'relative', width: '90%', margin: '20px auto 0' }}>
      <button
        onClick={() => onRegionSelect('전체')}
        onMouseEnter={() => setHoveredRegion('전체')}
        onMouseLeave={() => setHoveredRegion(null)}
        style={{
          position: 'absolute',
          top: '-10px',
          left: '-15px',
          zIndex: 10,
          padding: '6px 14px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '14px',
          transition: 'all 0.2s ease',
          background: selectedRegion === '전체' ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#f1f3f5',
          color: selectedRegion === '전체' ? 'white' : '#495057',
          boxShadow: selectedRegion === '전체' || hoveredRegion === '전체' ? '0 8px 25px rgba(102, 126, 234, 0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
          transform: selectedRegion === '전체' || hoveredRegion === '전체' ? 'translateY(-2px)' : 'translateY(0)',
        }}
      >
        전체 보기
      </button>

      <img 
        src="/SouthKoreaGreyMap.png" 
        alt="대한민국 지도" 
        style={{ width: '100%', height: 'auto', display: 'block' }} 
      />

      {Object.entries(regionPositions).map(([region, pos]) => {
        const isActive = selectedRegion === region;
        const isHovered = hoveredRegion === region;
        return (
          <button
            key={region}
            onClick={() => onRegionSelect(region)}
            onMouseEnter={() => setHoveredRegion(region)}
            onMouseLeave={() => setHoveredRegion(null)}
            title={region}
            style={{
              position: 'absolute',
              top: pos.top,
              left: pos.left,
              transform: `translate(-50%, -50%) translateY(${isActive || isHovered ? -3 : 0}px)`,
              boxShadow: isActive || isHovered ? '0 8px 25px rgba(102, 126, 234, 0.4)' : '0 4px 8px rgba(0,0,0,0.2)',
              zIndex: isActive || isHovered ? 10 : 5,
              width: 'auto',
              height: 'auto',
              padding: '6px 12px',
              border: '2px solid white',
              borderRadius: '16px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              transition: 'all 0.2s ease',
              background: isActive ? '#764ba2' : '#667eea',
              color: 'white',
              whiteSpace: 'nowrap',
            }}
          >
            {region}
          </button>
        );
      })}
    </div>
  );
};

export default KoreaMap;
