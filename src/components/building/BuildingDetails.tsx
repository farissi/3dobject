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
import { calculateWindowPositions, addSketchEffect } from '../../utils/buildingCalculations';

interface BuildingDetailsProps {
  type: 'apartment' | 'house';
  floors: number;
  width: number;
  depth: number;
  hasBasement: boolean;
}

function createDetailLine(start: Point3D, end: Point3D, segments: number = 3): Point3D[] {
  const points: Point3D[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    points.push([
      addSketchEffect(start[0] + (end[0] - start[0]) * t),
      addSketchEffect(start[1] + (end[1] - start[1]) * t),
      addSketchEffect(start[2] + (end[2] - start[2]) * t)
    ]);
  }
  return points;
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

  // Window decorations and frames
  const windowPositions = calculateWindowPositions(width, 4);
  for (let i = 0; i < floors; i++) {
    const y = i * FLOOR_HEIGHT;
    windowPositions.forEach(x => {
      points.push(
        // Window frame
        createDetailLine([x - 0.1, y + 0.9, 0.01], [x + WINDOW_WIDTH + 0.1, y + 0.9, 0.01]),
        createDetailLine([x - 0.1, y + 0.9 + WINDOW_HEIGHT, 0.01], [x + WINDOW_WIDTH + 0.1, y + 0.9 + WINDOW_HEIGHT, 0.01]),
        // Window sill
        createDetailLine([x - 0.1, y + 0.9, 0], [x + WINDOW_WIDTH + 0.1, y + 0.9, 0.2])
      );
    });
  }

  // Ground floor details
  const doorCenter = width / 2;
  points.push(
    // Door frame details
    createDetailLine([doorCenter - 0.6, 0, 0.01], [doorCenter - 0.6, 2.4, 0.01]),
    createDetailLine([doorCenter + 0.6, 0, 0.01], [doorCenter + 0.6, 2.4, 0.01]),
    createDetailLine([doorCenter - 0.6, 2.4, 0.01], [doorCenter + 0.6, 2.4, 0.01]),
    // Door handle
    createDetailLine([doorCenter + 0.3, 1.2, 0.02], [doorCenter + 0.3, 1.6, 0.02])
  );

  // Roof details
  points.push(
    // Roof edge trim
    createDetailLine([0, totalHeight, 0], [0, totalHeight + 0.3, 0.3]),
    createDetailLine([width, totalHeight, 0], [width, totalHeight + 0.3, 0.3]),
    createDetailLine([0, totalHeight, depth], [0, totalHeight + 0.3, depth - 0.3]),
    createDetailLine([width, totalHeight, depth], [width, totalHeight + 0.3, depth - 0.3])
  );

  // Basement details
  if (hasBasement) {
    points.push(
      // Basement window frames
      createDetailLine([2, baseY + 0.5, 0.01], [3, baseY + 0.5, 0.01]),
      createDetailLine([2, baseY + 1.3, 0.01], [3, baseY + 1.3, 0.01]),
      createDetailLine([width - 3, baseY + 0.5, 0.01], [width - 2, baseY + 0.5, 0.01]),
      createDetailLine([width - 3, baseY + 1.3, 0.01], [width - 2, baseY + 1.3, 0.01]),
      // Window wells
      createDetailLine([1.8, baseY, 0], [3.2, baseY, 0.3]),
      createDetailLine([width - 3.2, baseY, 0], [width - 1.8, baseY, 0.3])
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
    createDetailLine([chimneyX, totalHeight, depth/3], [chimneyX + chimneyWidth, totalHeight, depth/3]),
    createDetailLine([chimneyX + chimneyWidth, totalHeight, depth/3], [chimneyX + chimneyWidth, totalHeight + 2, depth/3]),
    createDetailLine([chimneyX + chimneyWidth, totalHeight + 2, depth/3], [chimneyX, totalHeight + 2, depth/3]),
    createDetailLine([chimneyX, totalHeight + 2, depth/3], [chimneyX, totalHeight, depth/3]),
    // Chimney cap
    createDetailLine([chimneyX - 0.1, totalHeight + 2, depth/3 - 0.1], [chimneyX + chimneyWidth + 0.1, totalHeight + 2, depth/3 - 0.1]),
    createDetailLine([chimneyX + chimneyWidth + 0.1, totalHeight + 2, depth/3 - 0.1], [chimneyX + chimneyWidth + 0.1, totalHeight + 2, depth/3 + 0.4]),
    createDetailLine([chimneyX + chimneyWidth + 0.1, totalHeight + 2, depth/3 + 0.4], [chimneyX - 0.1, totalHeight + 2, depth/3 + 0.4]),
    createDetailLine([chimneyX - 0.1, totalHeight + 2, depth/3 + 0.4], [chimneyX - 0.1, totalHeight + 2, depth/3 - 0.1])
  );

  // Window details
  const windowPositions = calculateWindowPositions(width, 2);
  for (let i = 0; i < floors; i++) {
    const y = i * FLOOR_HEIGHT;
    windowPositions.forEach(x => {
      const doorCenter = width / 2;
      if (Math.abs(x - doorCenter) > 1.5 || i > 0) {
        points.push(
          // Window frames
          createDetailLine([x - 0.1, y + 0.9, 0.01], [x + WINDOW_WIDTH + 0.1, y + 0.9, 0.01]),
          createDetailLine([x - 0.1, y + 0.9 + WINDOW_HEIGHT, 0.01], [x + WINDOW_WIDTH + 0.1, y + 0.9 + WINDOW_HEIGHT, 0.01]),
          createDetailLine([x - 0.1, y + 0.9, 0.01], [x - 0.1, y + 0.9 + WINDOW_HEIGHT, 0.01]),
          createDetailLine([x + WINDOW_WIDTH + 0.1, y + 0.9, 0.01], [x + WINDOW_WIDTH + 0.1, y + 0.9 + WINDOW_HEIGHT, 0.01]),
          // Window sills
          createDetailLine([x - 0.2, y + 0.9, 0], [x + WINDOW_WIDTH + 0.2, y + 0.9, 0.2])
        );
      }
    });
  }

  // Door details
  const doorCenter = width / 2;
  points.push(
    // Door frame
    createDetailLine([doorCenter - 0.6, 0, 0.01], [doorCenter + 0.6, 0, 0.01]),
    createDetailLine([doorCenter - 0.6, 0, 0.01], [doorCenter - 0.6, 2.2, 0.01]),
    createDetailLine([doorCenter + 0.6, 0, 0.01], [doorCenter + 0.6, 2.2, 0.01]),
    // Door panels
    createDetailLine([doorCenter - 0.4, 0.4, 0.02], [doorCenter + 0.4, 0.4, 0.02]),
    createDetailLine([doorCenter - 0.4, 1.8, 0.02], [doorCenter + 0.4, 1.8, 0.02]),
    // Door handle
    createDetailLine([doorCenter + 0.3, 1.1, 0.03], [doorCenter + 0.3, 1.5, 0.03])
  );

  return points;
}