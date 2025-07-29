// src/components/InteractiveMap.js

import React from 'react';
import { Button } from 'react-bootstrap';


const InteractiveMap = ({ onRegionSelect }) => {
  // 버튼으로 만들 지역 목록
  const regions = [
    '전체', '서울', '경기', '부산', '대구', 
    '인천', '충남', '광주', '울산', '세종'
  ];

  const handleRegionClick = (region) => {
    onRegionSelect(region);
  };

  return (
    <div className="p-3 border rounded">
      <h5 className="mb-3">지역 선택</h5>
      {regions.map(region => (
        <Button 
          key={region}
          variant="outline-secondary"
          className="d-block w-100 mb-2"
          onClick={() => handleRegionClick(region)}
        >
          {region === '전체' ? '전체 보기' : region}
        </Button>
      ))}
    </div>
  );
};

export default InteractiveMap;