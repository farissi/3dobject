import { useState } from 'react';

export function useBuilding() {
  const [buildingType, setBuildingType] = useState<'apartment' | 'house'>('apartment');
  const [floors, setFloors] = useState(3);

  return {
    buildingType,
    floors,
    setBuildingType,
    setFloors,
  };
}