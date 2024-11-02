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
          color="#64748b"
          lineWidth={0.5}
        />
      ))}
    </group>
  );
}

function getApartmentDetails(floors: number): [number, number, number][][] {
  const points: [number, number, number][][] = [];
  const floorHeight = 3;

  // Balconies and railings
  for (let i = 0; i < floors; i++) {
    const y = i * floorHeight;
    
    // Left balcony
    points.push([
      [1.2, y, 0], [3.2, y, 0],
      [3.2, y + 1, 0], [1.2, y + 1, 0],
      [1.2, y, 0]
    ]);

    // Right balcony
    points.push([
      [4, y, 0], [5.8, y, 0],
      [5.8, y + 1, 0], [4, y + 1, 0],
      [4, y, 0]
    ]);

    // Railings
    for (const x of [1.2, 1.8, 2.4, 3.2, 4, 4.6, 5.2, 5.8]) {
      points.push([[x, y, 0], [x, y + 1, 0]]);
    }
  }

  return points;
}

function getHouseDetails(floors: number): [number, number, number][][] {
  const points: [number, number, number][][] = [];
  const floorHeight = 3;
  const totalHeight = floors * floorHeight;

  // Chimney
  points.push([
    [5.5, totalHeight, 1], [6.2, totalHeight, 1],
    [6.2, totalHeight + 2, 1], [5.5, totalHeight + 2, 1],
    [5.5, totalHeight, 1]
  ]);

  points.push([
    [5.5, totalHeight, 1.5], [6.2, totalHeight, 1.5],
    [6.2, totalHeight + 2, 1.5], [5.5, totalHeight + 2, 1.5],
    [5.5, totalHeight, 1.5]
  ]);

  // Chimney connections
  points.push(
    [[5.5, totalHeight, 1], [5.5, totalHeight, 1.5]],
    [[6.2, totalHeight, 1], [6.2, totalHeight, 1.5]],
    [[5.5, totalHeight + 2, 1], [5.5, totalHeight + 2, 1.5]],
    [[6.2, totalHeight + 2, 1], [6.2, totalHeight + 2, 1.5]]
  );

  // Door details
  points.push([
    [3.5, 0, 0.01], [4.5, 0, 0.01],
    [4.5, 2.2, 0.01], [4, 2.4, 0.01],
    [3.5, 2.2, 0.01], [3.5, 0, 0.01]
  ]);

  // Door handle
  points.push([[4, 1.1, 0.01], [4, 1.8, 0.01]]);

  return points;
}