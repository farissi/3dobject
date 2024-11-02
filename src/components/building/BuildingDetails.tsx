import React from 'react';
import { Line } from '@react-three/drei';
import { Vector3 } from 'three';
import { Point3D, LinePoints } from '../../types/building';
import { 
  WINDOW_WIDTH, 
  WINDOW_HEIGHT, 
  FLOOR_HEIGHT, 
  BASEMENT_DEPTH,
  WALL_MARGIN
} from '../../constants/building';
import { calculateBalconyPositions } from '../../utils/buildingCalculations';

interface BuildingDetailsProps {
  type: 'apartment' | 'house';
  floors: number;
  width: number;
  depth: number;
  hasBasement: boolean;
}

export function BuildingDetails({ type, floors, width, depth, hasBasement }: BuildingDetailsProps) {
  const detailPoints = type === 'apartment' 
    ? getApartmentDetails(floors, width, depth, hasBasement)
    : getHouseDetails(floors, width, depth, hasBasement);

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

function getApartmentDetails(
  floors: number,
  width: number,
  depth: number,
  hasBasement: boolean
): LinePoints[] {
  const points: LinePoints[] = [];
  const baseY = hasBasement ? -BASEMENT_DEPTH : 0;
  const totalHeight = floors * FLOOR_HEIGHT;

  // Balconies and railings
  const balconyPositions = calculateBalconyPositions(width);
  for (let i = 0; i < floors; i++) {
    const y = i * FLOOR_HEIGHT;
    
    // Balconies
    balconyPositions.forEach((x, index) => {
      if (index % 2 === 0) { // Alternate balconies for visual interest
        const balconyWidth = 1.8;
        points.push([
          [x, y, 0], [x + balconyWidth, y, 0],
          [x + balconyWidth, y + 1, 0], [x, y + 1, 0],
          [x, y, 0]
        ]);

        // Railings
        for (let rx = x; rx <= x + balconyWidth; rx += 0.3) {
          points.push([[rx, y, 0], [rx, y + 1, 0]]);
        }

        // Balcony side panels
        points.push(
          [[x, y, 0], [x, y + 1, 0.3]],
          [[x + balconyWidth, y, 0], [x + balconyWidth, y + 1, 0.3]]
        );
      }
    });

    // Window decorations
    balconyPositions.forEach(x => {
      points.push(
        // Window frame
        [[x, y + 0.9, 0], [x + WINDOW_WIDTH, y + 0.9, 0]],
        [[x, y + 0.9 + WINDOW_HEIGHT, 0], [x + WINDOW_WIDTH, y + 0.9 + WINDOW_HEIGHT, 0]],
        // Window sill
        [[x - 0.1, y + 0.9, 0], [x + WINDOW_WIDTH + 0.1, y + 0.9, 0.2]]
      );
    });
  }

  // Ground floor details
  const doorCenter = width / 2;
  points.push(
    // Door frame details
    [[doorCenter - 0.6, 0, 0.01], [doorCenter - 0.6, 2.4, 0.01]],
    [[doorCenter + 0.6, 0, 0.01], [doorCenter + 0.6, 2.4, 0.01]],
    [[doorCenter - 0.6, 2.4, 0.01], [doorCenter + 0.6, 2.4, 0.01]],
    // Door handle
    [[doorCenter + 0.3, 1.2, 0.02], [doorCenter + 0.3, 1.6, 0.02]]
  );

  // Roof details
  points.push(
    // Roof edge trim
    [[0, totalHeight, 0], [0, totalHeight + 0.3, 0.3]],
    [[width, totalHeight, 0], [width, totalHeight + 0.3, 0.3]],
    [[0, totalHeight, depth], [0, totalHeight + 0.3, depth - 0.3]],
    [[width, totalHeight, depth], [width, totalHeight + 0.3, depth - 0.3]]
  );

  // Basement details
  if (hasBasement) {
    points.push(
      // Basement window frames
      [[2, baseY + 0.5, 0.01], [3, baseY + 0.5, 0.01]],
      [[2, baseY + 1.3, 0.01], [3, baseY + 1.3, 0.01]],
      [[width - 3, baseY + 0.5, 0.01], [width - 2, baseY + 0.5, 0.01]],
      [[width - 3, baseY + 1.3, 0.01], [width - 2, baseY + 1.3, 0.01]],
      // Window wells
      [[1.8, baseY, 0], [3.2, baseY, 0.3]],
      [[width - 3.2, baseY, 0], [width - 1.8, baseY, 0.3]]
    );
  }

  return points;
}

function getHouseDetails(
  floors: number,
  width: number,
  depth: number,
  hasBasement: boolean
): LinePoints[] {
  const points: LinePoints[] = [];
  const baseY = hasBasement ? -BASEMENT_DEPTH : 0;
  const totalHeight = floors * FLOOR_HEIGHT;
  const roofHeight = 3;

  // Chimney
  const chimneyWidth = 0.7;
  const chimneyX = width * 0.75;
  points.push(
    // Main chimney structure
    [
      [chimneyX, totalHeight, depth/3], 
      [chimneyX + chimneyWidth, totalHeight, depth/3],
      [chimneyX + chimneyWidth, totalHeight + 2, depth/3], 
      [chimneyX, totalHeight + 2, depth/3],
      [chimneyX, totalHeight, depth/3]
    ],
    [
      [chimneyX, totalHeight, depth/3 + 0.5], 
      [chimneyX + chimneyWidth, totalHeight, depth/3 + 0.5],
      [chimneyX + chimneyWidth, totalHeight + 2, depth/3 + 0.5], 
      [chimneyX, totalHeight + 2, depth/3 + 0.5],
      [chimneyX, totalHeight, depth/3 + 0.5]
    ],
    // Chimney cap details
    [
      [chimneyX - 0.1, totalHeight + 2, depth/3 - 0.1],
      [chimneyX + chimneyWidth + 0.1, totalHeight + 2, depth/3 - 0.1],
      [chimneyX + chimneyWidth + 0.1, totalHeight + 2, depth/3 + 0.6],
      [chimneyX - 0.1, totalHeight + 2, depth/3 + 0.6],
      [chimneyX - 0.1, totalHeight + 2, depth/3 - 0.1]
    ]
  );

  // Roof details
  points.push(
    // Roof trim
    [[0, totalHeight, 0], [width/2, totalHeight + roofHeight + 0.2, 0]],
    [[width/2, totalHeight + roofHeight + 0.2, 0], [width, totalHeight, 0]],
    [[0, totalHeight, depth], [width/2, totalHeight + roofHeight + 0.2, depth]],
    [[width/2, totalHeight + roofHeight + 0.2, depth], [width, totalHeight, depth]],
    // Roof ridge decoration
    [[width/2 - 0.1, totalHeight + roofHeight, 0], [width/2 - 0.1, totalHeight + roofHeight, depth]],
    [[width/2 + 0.1, totalHeight + roofHeight, 0], [width/2 + 0.1, totalHeight + roofHeight, depth]]
  );

  // Window details
  const windowPositions = calculateBalconyPositions(width);
  for (let i = 0; i < floors; i++) {
    const y = i * FLOOR_HEIGHT;
    windowPositions.forEach(x => {
      const doorCenter = width / 2;
      if (Math.abs(x - doorCenter) > 1.5 || i > 0) {
        points.push(
          // Window frame
          [[x - 0.1, y + 0.9, 0.01], [x + WINDOW_WIDTH + 0.1, y + 0.9, 0.01]],
          [[x - 0.1, y + 0.9 + WINDOW_HEIGHT, 0.01], [x + WINDOW_WIDTH + 0.1, y + 0.9 + WINDOW_HEIGHT, 0.01]],
          [[x - 0.1, y + 0.9, 0.01], [x - 0.1, y + 0.9 + WINDOW_HEIGHT, 0.01]],
          [[x + WINDOW_WIDTH + 0.1, y + 0.9, 0.01], [x + WINDOW_WIDTH + 0.1, y + 0.9 + WINDOW_HEIGHT, 0.01]],
          // Window sill
          [[x - 0.2, y + 0.9, 0], [x + WINDOW_WIDTH + 0.2, y + 0.9, 0.2]]
        );
      }
    });
  }

  // Door details
  const doorCenter = width / 2;
  points.push(
    // Door frame
    [[doorCenter - 0.6, 0, 0.01], [doorCenter + 0.6, 0, 0.01]],
    [[doorCenter - 0.6, 0, 0.01], [doorCenter - 0.6, 2.2, 0.01]],
    [[doorCenter + 0.6, 0, 0.01], [doorCenter + 0.6, 2.2, 0.01]],
    // Door panels
    [[doorCenter - 0.4, 0.4, 0.02], [doorCenter + 0.4, 0.4, 0.02]],
    [[doorCenter - 0.4, 1.8, 0.02], [doorCenter + 0.4, 1.8, 0.02]],
    // Door handle
    [[doorCenter + 0.3, 1.1, 0.03], [doorCenter + 0.3, 1.5, 0.03]]
  );

  // Basement details
  if (hasBasement) {
    const basementWindowWidth = 1;
    const basementWindowPositions = [width * 0.25, width * 0.75];
    basementWindowPositions.forEach(x => {
      points.push(
        // Window frame
        [[x, baseY + 0.5, 0.01], [x + basementWindowWidth, baseY + 0.5, 0.01]],
        [[x, baseY + 1.3, 0.01], [x + basementWindowWidth, baseY + 1.3, 0.01]],
        [[x, baseY + 0.5, 0.01], [x, baseY + 1.3, 0.01]],
        [[x + basementWindowWidth, baseY + 0.5, 0.01], [x + basementWindowWidth, baseY + 1.3, 0.01]],
        // Window well
        [[x - 0.2, baseY, 0], [x + basementWindowWidth + 0.2, baseY, 0.3]]
      );
    });
  }

  return points;
}