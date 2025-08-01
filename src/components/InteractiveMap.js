// src/components/InteractiveMap.js 

import React from 'react';
import KoreaMap from './KoreaMap';

const InteractiveMap = ({ selectedRegion, onRegionSelect }) => {
  return (
    <div>
      <KoreaMap
        selectedRegion={selectedRegion}
        onRegionSelect={onRegionSelect}
      />
    </div>
  );
};

export default InteractiveMap;