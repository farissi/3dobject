import { Line } from '@react-three/drei';
import { Vector3 } from 'three';

interface BuildingDetailsProps {
  type: 'apartment' | 'house';
  floors: number;
}

export function BuildingDetails({ type, floors }: BuildingDetailsProps) {
  const detailPoints = type === 'apartment' 
    ? getApartmentDetails(floors)
    : getHouseDetails(floors);

  return (
    <group>
      {detailPoints.map((linePoints, index) => (
        <Line
          key={`detail-${index}`}
          points={linePoints.map(([x, y, z]) => new Vector3(x, y, z))}
          color="#666"
          lineWidth={0.5}
        />
      ))}
    </group>
  );
}

function getApartmentDetails(floors: number) {
  return [
    // Decorative elements
    ...Array.from({ length: floors }, (_, i) => [
      // Balcony railings
      ...createRailing(1.2, i * 3, 0, 1.5, 1),
      ...createRailing(3.3, i * 3, 0, 1.5, 1),
      // Window details
      ...createWindowDetail(1.5, i * 3 + 1, 0, 1.2, 1.5),
      ...createWindowDetail(3.3, i * 3 + 1, 0, 1.2, 1.5),
    ]),
  ];
}

function getHouseDetails(floors: number) {
  return [
    // Decorative elements
    ...createChimney(5.5, floors * 2.8, 1, 0.5, 1.5),
    ...Array.from({ length: floors }, (_, i) => [
      // Window sills
      ...createWindowSill(1, i * 2.8 + 1, 0, 1.2),
      ...createWindowSill(5, i * 2.8 + 1, 0, 1.2),
    ]),
  ];
}

function createRailing(x: number, y: number, z: number, width: number, height: number) {
  const posts = 4;
  const spacing = width / (posts - 1);
  
  return Array.from({ length: posts }, (_, i) => [
    [x + i * spacing, y, z], [x + i * spacing, y + height, z],
  ]);
}

function createWindowDetail(x: number, y: number, z: number, width: number, height: number) {
  return [
    // Window frame details
    [[x - 0.1, y - 0.1, z], [x + width + 0.1, y - 0.1, z]],
    [[x - 0.1, y + height + 0.1, z], [x + width + 0.1, y + height + 0.1, z]],
  ];
}

function createWindowSill(x: number, y: number, z: number, width: number) {
  return [
    [[x - 0.2, y - 0.1, z], [x + width + 0.2, y - 0.1, z]],
    [[x - 0.2, y - 0.1, z], [x - 0.2, y - 0.2, z]],
    [[x + width + 0.2, y - 0.1, z], [x + width + 0.2, y - 0.2, z]],
  ];
}

function createChimney(x: number, y: number, z: number, width: number, height: number) {
  return [
    // Chimney structure
    [[x, y, z], [x + width, y, z], [x + width, y + height, z], [x, y + height, z], [x, y, z]],
    [[x, y, z + width], [x + width, y, z + width], [x + width, y + height, z + width], [x, y + height, z + width], [x, y, z + width]],
    [[x, y, z], [x, y, z + width]],
    [[x + width, y, z], [x + width, y, z + width]],
    [[x, y + height, z], [x, y + height, z + width]],
    [[x + width, y + height, z], [x + width, y + height, z + width]],
  ];
}