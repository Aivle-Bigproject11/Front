// src/pages/Menu2.js

import React, { useState } from 'react';
import InteractiveMap from '../components/InteractiveMap';
import RegionDataDisplay from '../components/RegionDataDisplay';
import './Menu2.css'; 

const Menu2 = () => { 
  const [selectedRegion, setSelectedRegion] = useState('전체');

  return (
    <div className="dashboard-container">
      <div className="map-area">
        <h4 className="mb-3">통합 대시보드</h4>
        <InteractiveMap onRegionSelect={setSelectedRegion} />
      </div>

      <div className="content-area">
        <RegionDataDisplay region={selectedRegion} />
      </div>
    </div>
  );
};

export default Menu2;