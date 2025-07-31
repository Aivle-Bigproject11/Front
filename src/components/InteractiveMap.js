// src/components/InteractiveMap.js

import React from 'react';

const InteractiveMap = ({ selectedRegion, onRegionSelect }) => {
  const regions = [
    '전체', '서울', '경기', '부산', '대구',
    '인천', '충남', '광주', '울산', '세종'
  ];

  return (
    <div>
      <h5 className="mb-3" style={{ fontSize: '1rem', color: '#495057' }}>지역 선택</h5>
      {regions.map(region => {
        const isActive = selectedRegion === region;
        return (
          <button
            key={region}
            onClick={() => onRegionSelect(region)}
            style={{
              display: 'block',
              width: '100%',
              padding: '12px 15px',
              marginBottom: '10px',
              border: 'none',
              borderRadius: '8px',
              textAlign: 'left',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: isActive ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#e9ecef',
              color: isActive ? 'white' : '#495057',
              boxShadow: isActive ? '0 4px 12px rgba(118, 75, 162, 0.3)' : 'none',
              transform: isActive ? 'translateY(-2px)' : 'none'
            }}
          >
            {region === '전체' ? '전체 보기' : region}
          </button>
        );
      })}
    </div>
  );
};

export default InteractiveMap;