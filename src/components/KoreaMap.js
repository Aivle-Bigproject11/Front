// src/components/KoreaMap.js

import React from 'react';

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
  return (
    // 이 div의 스타일을 수정하여 크기와 위치를 조정합니다.
    <div style={{ position: 'relative', width: '90%', margin: '20px auto 0' }}>
      {/* '전체' 보기 버튼 */}
      <button
        onClick={() => onRegionSelect('전체')}
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
          boxShadow: selectedRegion === '전체' ? '0 4px 12px rgba(118, 75, 162, 0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        전체 보기
      </button>

      {/* 지도 이미지 */}
      <img 
        src="/SouthKoreaGreyMap.png" 
        alt="대한민국 지도" 
        style={{ width: '100%', height: 'auto', display: 'block' }} 
      />

      {/* 각 지역에 버튼 렌더링 */}
      {Object.entries(regionPositions).map(([region, pos]) => {
        const isActive = selectedRegion === region;
        return (
          <button
            key={region}
            onClick={() => onRegionSelect(region)}
            title={region} // 마우스 오버 시 툴팁으로 전체 지역 이름 표시
            style={{
              position: 'absolute',
              top: pos.top,
              left: pos.left,
              transform: 'translate(-50%, -50%)', // 버튼의 정중앙을 좌표에 맞춤
              zIndex: 5,
              width: 'auto', // 너비를 자동으로 조절
              height: 'auto',
              padding: '6px 12px', // 텍스트 주변에 여백 추가
              border: '2px solid white',
              borderRadius: '16px', // 둥근 사각형 모양
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px', // 폰트 크기 조정
              transition: 'all 0.2s ease',
              background: isActive ? '#764ba2' : '#667eea',
              color: 'white',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              whiteSpace: 'nowrap', // 텍스트가 줄바꿈되지 않도록 설정
            }}
          >
            {region} {/* 첫 글자 대신 전체 지역명 표시 */}
          </button>
        );
      })}
    </div>
  );
};

export default KoreaMap;
