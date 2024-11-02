import { Line } from '@react-three/drei';
import { Vector3 } from 'three';
import { BuildingDetails } from './building/BuildingDetails';
import { useBuilding } from '../hooks/useBuilding';

export function Building() {
  const { buildingType, floors } = useBuilding();
  
  return (
    <group>
      <BuildingStructure type={buildingType} floors={floors} />
      <BuildingDetails type={buildingType} floors={floors} />
    </group>
  );
}

interface BuildingProps {
  type: 'apartment' | 'house';
  floors: number;
}

function BuildingStructure({ type, floors }: BuildingProps) {
  const points = type === 'apartment' ? getApartmentPoints(floors) : getHousePoints(floors);

  return (
    <group>
      {points.map((linePoints, index) => (
        <Line
          key={index}
          points={linePoints.map(([x, y, z]) => new Vector3(x, y, z))}
          color="#334155"
          lineWidth={1.5}
        />
      ))}
    </group>
  );
}

function getApartmentPoints(floors: number): [number, number, number][][] {
  const width = 7;
  const depth = 5;
  const floorHeight = 3;
  const totalHeight = floors * floorHeight;
  const windowWidth = 1.2;
  const windowHeight = 1.8;

  const points: [number, number, number][][] = [];

  // Main structure outline
  points.push([
    [0, 0, 0], [width, 0, 0], [width, 0, depth], [0, 0, depth], [0, 0, 0]
  ]);

  points.push([
    [0, totalHeight, 0], [width, totalHeight, 0], 
    [width, totalHeight, depth], [0, totalHeight, depth], [0, totalHeight, 0]
  ]);

  // Vertical edges
  points.push(...[
    [[0, 0, 0], [0, totalHeight, 0]],
    [[width, 0, 0], [width, totalHeight, 0]],
    [[0, 0, depth], [0, totalHeight, depth]],
    [[width, 0, depth], [width, totalHeight, depth]]
  ]);

  // Floor separators
  for (let i = 0; i <= floors; i++) {
    points.push([
      [0, i * floorHeight, 0], [width, i * floorHeight, 0],
      [width, i * floorHeight, depth], [0, i * floorHeight, depth]
    ]);
  }

  // Main entrance door
  points.push([
    [3, 0, 0], [4, 0, 0], [4, 2.4, 0], [3.5, 2.6, 0], [3, 2.4, 0], [3, 0, 0]
  ]);

  // Windows
  for (let i = 0; i < floors; i++) {
    const y = i * floorHeight;
    // Front windows
    points.push([
      [1.5, y + 1, 0], [1.5 + windowWidth, y + 1, 0],
      [1.5 + windowWidth, y + 1 + windowHeight, 0], [1.5, y + 1 + windowHeight, 0],
      [1.5, y + 1, 0]
    ]);
    points.push([
      [4.3, y + 1, 0], [4.3 + windowWidth, y + 1, 0],
      [4.3 + windowWidth, y + 1 + windowHeight, 0], [4.3, y + 1 + windowHeight, 0],
      [4.3, y + 1, 0]
    ]);

    // Side windows (left)
    points.push([
      [0, y + 1, 1.5], [0, y + 1, 2.7],
      [0, y + 1 + windowHeight, 2.7], [0, y + 1 + windowHeight, 1.5],
      [0, y + 1, 1.5]
    ]);

    // Side windows (right)
    points.push([
      [width, y + 1, 1.5], [width, y + 1, 2.7],
      [width, y + 1 + windowHeight, 2.7], [width, y + 1 + windowHeight, 1.5],
      [width, y + 1, 1.5]
    ]);
  }

  return points;
}

function getHousePoints(floors: number): [number, number, number][][] {
  const width = 8;
  const depth = 6;
  const floorHeight = 3;
  const totalHeight = floors * floorHeight;
  const roofHeight = 3;
  const windowWidth = 1.2;
  const windowHeight = 1.8;

  const points: [number, number, number][][] = [];

  // Main structure
  points.push([
    [0, 0, 0], [width, 0, 0], [width, 0, depth], [0, 0, depth], [0, 0, 0]
  ]);

  points.push([
    [0, totalHeight, 0], [width, totalHeight, 0], 
    [width, totalHeight, depth], [0, totalHeight, depth], [0, totalHeight, 0]
  ]);

  // Roof
  points.push([
    [0, totalHeight, 0], [width/2, totalHeight + roofHeight, 0], [width, totalHeight, 0]
  ]);
  points.push([
    [0, totalHeight, depth], [width/2, totalHeight + roofHeight, depth], [width, totalHeight, depth]
  ]);
  points.push([
    [width/2, totalHeight + roofHeight, 0], [width/2, totalHeight + roofHeight, depth]
  ]);

  // Vertical edges
  points.push(...[
    [[0, 0, 0], [0, totalHeight, 0]],
    [[width, 0, 0], [width, totalHeight, 0]],
    [[0, 0, depth], [0, totalHeight, depth]],
    [[width, 0, depth], [width, totalHeight, depth]]
  ]);

  // Door
  points.push([
    [3.5, 0, 0], [4.5, 0, 0], [4.5, 2.2, 0], [4, 2.4, 0], [3.5, 2.2, 0], [3.5, 0, 0]
  ]);

  // Windows
  for (let i = 0; i < floors; i++) {
    const y = i * floorHeight;
    // Front windows
    points.push([
      [1.5, y + 1, 0], [2.7, y + 1, 0],
      [2.7, y + 1 + windowHeight, 0], [1.5, y + 1 + windowHeight, 0],
      [1.5, y + 1, 0]
    ]);
    points.push([
      [5.3, y + 1, 0], [6.5, y + 1, 0],
      [6.5, y + 1 + windowHeight, 0], [5.3, y + 1 + windowHeight, 0],
      [5.3, y + 1, 0]
    ]);

    // Side windows
    points.push([
      [0, y + 1, 2], [0, y + 1, 3.2],
      [0, y + 1 + windowHeight, 3.2], [0, y + 1 + windowHeight, 2],
      [0, y + 1, 2]
    ]);
  }

  return points;
}