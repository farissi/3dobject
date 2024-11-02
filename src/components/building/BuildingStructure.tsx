import React from 'react';
import { Line } from '@react-three/drei';
import { Vector3 } from 'three';
import { getApartmentPoints, getHousePoints } from './buildingPoints';

interface BuildingStructureProps {
  type: 'apartment' | 'house';
  floors: number;
  width: number;
  depth: number;
  hasBasement: boolean;
}

export function BuildingStructure({ type, floors, width, depth, hasBasement }: BuildingStructureProps) {
  const points = type === 'apartment' 
    ? getApartmentPoints(floors, width, depth, hasBasement) 
    : getHousePoints(floors, width, depth, hasBasement);

  return (
    <group>
      {points.map((linePoints, index) => (
        <Line
          key={index}
          points={linePoints.map((point) => new Vector3(point[0], point[1], point[2]))}
          color="#334155"
          lineWidth={1.5}
        />
      ))}
    </group>
  );
}