import React from 'react';
import { BuildingStructure } from './BuildingStructure';
import { BuildingDetails } from './BuildingDetails';
import { useBuilding } from '../../hooks/useBuilding';

export function Building() {
  const { buildingType, floors, width, depth, hasBasement } = useBuilding();
  
  return (
    <group>
      <BuildingStructure 
        type={buildingType} 
        floors={floors}
        width={width}
        depth={depth}
        hasBasement={hasBasement}
      />
      <BuildingDetails 
        type={buildingType} 
        floors={floors}
        width={width}
        depth={depth}
        hasBasement={hasBasement}
      />
    </group>
  );
}