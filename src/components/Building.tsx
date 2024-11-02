import { Line } from '@react-three/drei';
import { Vector3 } from 'three';
import { BuildingDetails } from './BuildingDetails';

interface BuildingProps {
  type: 'apartment' | 'house';
  floors: number;
}

export function Building({ type, floors }: BuildingProps) {
  return (
    <group position={[0, 0, 0]}>
      <BuildingStructure type={type} floors={floors} />
      <BuildingDetails type={type} floors={floors} />
    </group>
  );
}

function BuildingStructure({ type, floors }: BuildingProps) {
  const points = type === 'apartment' ? getApartmentPoints(floors) : getHousePoints(floors);

  return (
    <group>
      {points.map((linePoints, index) => (
        <Line
          key={index}
          points={linePoints.map(([x, y, z]) => new Vector3(x, y, z))}
          color="#333"
          lineWidth={1.5}
        />
      ))}
    </group>
  );
}

function getApartmentPoints(floors: number) {
  const width = 6;
  const depth = 4;
  const floorHeight = 3;
  const totalHeight = floors * floorHeight;

  return [
    // Main structure
    ...createBox(0, 0, 0, width, totalHeight, depth),
    // Floor lines
    ...Array.from({ length: floors + 1 }, (_, i) => [
      [0, i * floorHeight, 0], [width, i * floorHeight, 0],
      [0, i * floorHeight, depth], [width, i * floorHeight, depth],
    ]),
    // Windows and balconies
    ...Array.from({ length: floors }, (_, i) => [
      // Front windows
      ...createWindow(1.5, i * floorHeight + 1, 0, 1.2, 1.5),
      ...createWindow(3.3, i * floorHeight + 1, 0, 1.2, 1.5),
      // Side windows
      ...createWindow(0, i * floorHeight + 1, 1.5, 1.2, 1.5, true),
      ...createWindow(width, i * floorHeight + 1, 1.5, 1.2, 1.5, true),
    ]),
  ];
}

function getHousePoints(floors: number) {
  const width = 7;
  const depth = 5;
  const floorHeight = 2.8;
  const totalHeight = floors * floorHeight;
  const roofHeight = 2;

  return [
    // Main structure
    ...createBox(0, 0, 0, width, totalHeight, depth),
    // Roof
    [[0, totalHeight, 0], [width/2, totalHeight + roofHeight, 0], [width, totalHeight, 0]],
    [[0, totalHeight, depth], [width/2, totalHeight + roofHeight, depth], [width, totalHeight, depth]],
    [[width/2, totalHeight + roofHeight, 0], [width/2, totalHeight + roofHeight, depth]],
    // Floor lines
    ...Array.from({ length: floors }, (_, i) => [
      [0, i * floorHeight, 0], [width, i * floorHeight, 0],
      [0, i * floorHeight, depth], [width, i * floorHeight, depth],
    ]),
    // Windows and door
    ...createDoor(3, 0, 0, 1.5, 2.2),
    ...Array.from({ length: floors }, (_, i) => [
      ...createWindow(1, i * floorHeight + 1, 0, 1.2, 1.2),
      ...createWindow(5, i * floorHeight + 1, 0, 1.2, 1.2),
    ]),
  ];
}

function createBox(x: number, y: number, z: number, width: number, height: number, depth: number) {
  return [
    // Bottom
    [[x, y, z], [x + width, y, z], [x + width, y, z + depth], [x, y, z + depth], [x, y, z]],
    // Top
    [[x, y + height, z], [x + width, y + height, z], 
     [x + width, y + height, z + depth], [x, y + height, z + depth], [x, y + height, z]],
    // Verticals
    [[x, y, z], [x, y + height, z]],
    [[x + width, y, z], [x + width, y + height, z]],
    [[x, y, z + depth], [x, y + height, z + depth]],
    [[x + width, y, z + depth], [x + width, y + height, z + depth]],
  ];
}

function createWindow(x: number, y: number, z: number, width: number, height: number, side = false) {
  if (side) {
    return [
      [[x, y, z], [x, y, z + width], [x, y + height, z + width], [x, y + height, z], [x, y, z]],
    ];
  }
  return [
    [[x, y, z], [x + width, y, z], [x + width, y + height, z], [x, y + height, z], [x, y, z]],
  ];
}

function createDoor(x: number, y: number, z: number, width: number, height: number) {
  return [
    [[x, y, z], [x + width, y, z], [x + width, y + height, z], [x, y + height, z], [x, y, z]],
  ];
}