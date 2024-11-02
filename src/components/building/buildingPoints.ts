import { Point3D, LinePoints } from '../../types/building';
import { 
  WINDOW_WIDTH, 
  WINDOW_HEIGHT, 
  FLOOR_HEIGHT, 
  BASEMENT_DEPTH,
  DOOR_WIDTH,
  DOOR_HEIGHT,
  WALL_MARGIN
} from '../../constants/building';
import { addSketchEffect } from '../../utils/buildingCalculations';

// Jitter function for sketchy effect
function jitter(value: number, intensity: number = 0.1): number {
  return value + (Math.random() - 0.5) * intensity;
}

// Sketch line with jittered segments for a hand-drawn effect
function createSketchLine(start: Point3D, end: Point3D, segments: number = 3): Point3D[] {
  const points: Point3D[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    points.push([
      jitter(start[0] + (end[0] - start[0]) * t),
      jitter(start[1] + (end[1] - start[1]) * t),
      jitter(start[2] + (end[2] - start[2]) * t)
    ]);
  }
  return points;
}

// Generate window points with sketchy effect
function createWindowPoints(x: number, y: number, z: number, isVertical: boolean = false): LinePoints[] {
  const points: LinePoints[] = [];
  if (isVertical) {
    points.push(
      createSketchLine([x, y, z], [x, y, z + WINDOW_WIDTH], 3),
      createSketchLine([x, y, z + WINDOW_WIDTH], [x, y + WINDOW_HEIGHT, z + WINDOW_WIDTH], 3),
      createSketchLine([x, y + WINDOW_HEIGHT, z + WINDOW_WIDTH], [x, y + WINDOW_HEIGHT, z], 3),
      createSketchLine([x, y + WINDOW_HEIGHT, z], [x, y, z], 3)
    );
  } else {
    points.push(
      createSketchLine([x, y, z], [x + WINDOW_WIDTH, y, z], 3),
      createSketchLine([x + WINDOW_WIDTH, y, z], [x + WINDOW_WIDTH, y + WINDOW_HEIGHT, z], 3),
      createSketchLine([x + WINDOW_WIDTH, y + WINDOW_HEIGHT, z], [x, y + WINDOW_HEIGHT, z], 3),
      createSketchLine([x, y + WINDOW_HEIGHT, z], [x, y, z], 3)
    );
  }
  return points;
}

// Calculate and place two evenly spaced windows
function calculateEvenWindowPositions(width: number): number[] {
  const gap = (width - 2 * WINDOW_WIDTH) / 3; // Divide remaining space by 3 to place windows evenly
  return [gap, width - WINDOW_WIDTH - gap];
}

// Generate apartment points with evenly spaced front windows
export function getApartmentPoints(
  floors: number,
  width: number,
  depth: number,
  hasBasement: boolean
): LinePoints[] {
  const totalHeight = floors * FLOOR_HEIGHT;
  const baseY = hasBasement ? -BASEMENT_DEPTH : 0;
  const points: LinePoints[] = [];

  if (hasBasement) {
    points.push(...createBasementPoints(width, depth));
  }

  // Main structure
  points.push(
    createSketchLine([0, baseY, 0], [width, baseY, 0], 5),
    createSketchLine([width, baseY, 0], [width, baseY, depth], 5),
    createSketchLine([width, baseY, depth], [0, baseY, depth], 5),
    createSketchLine([0, baseY, depth], [0, baseY, 0], 5)
  );

  // Vertical edges
  points.push(
    createSketchLine([0, baseY, 0], [0, totalHeight, 0], 5),
    createSketchLine([width, baseY, 0], [width, totalHeight, 0], 5),
    createSketchLine([0, baseY, depth], [0, totalHeight, depth], 5),
    createSketchLine([width, baseY, depth], [width, totalHeight, depth], 5)
  );

  // Floor separators
  for (let i = 0; i <= floors; i++) {
    const y = i * FLOOR_HEIGHT;
    points.push(
      createSketchLine([0, y, 0], [width, y, 0], 4),
      createSketchLine([width, y, 0], [width, y, depth], 4),
      createSketchLine([width, y, depth], [0, y, depth], 4),
      createSketchLine([0, y, depth], [0, y, 0], 4)
    );
  }

  // Main entrance door
  const doorCenter = width / 2;
  points.push(
    ...createSketchLine(
      [doorCenter - DOOR_WIDTH / 2, 0, 0],
      [doorCenter + DOOR_WIDTH / 2, DOOR_HEIGHT, 0],
      5
    ).map(point => [point])
  );

  // Place two evenly spaced windows on the front of each floor
  const windowPositions = calculateEvenWindowPositions(width);
  for (let i = 0; i < floors; i++) {
    const y = i * FLOOR_HEIGHT;
    windowPositions.forEach(x => {
      if (Math.abs(x - doorCenter) > DOOR_WIDTH || i > 0) {
        points.push(...createWindowPoints(x, y + 1, 0));
      }
    });
  }

  return points;
}

// Generate house points with evenly spaced windows
export function getHousePoints(
  floors: number,
  width: number,
  depth: number,
  hasBasement: boolean
): LinePoints[] {
  const totalHeight = floors * FLOOR_HEIGHT;
  const baseY = hasBasement ? -BASEMENT_DEPTH : 0;
  const roofHeight = 3;
  const points: LinePoints[] = [];

  if (hasBasement) {
    points.push(...createBasementPoints(width, depth));
  }

  // Main structure
  points.push(
    createSketchLine([0, baseY, 0], [width, baseY, 0], 5),
    createSketchLine([width, baseY, 0], [width, baseY, depth], 5),
    createSketchLine([width, baseY, depth], [0, baseY, depth], 5),
    createSketchLine([0, baseY, depth], [0, baseY, 0], 5)
  );

  // Vertical edges
  points.push(
    createSketchLine([0, baseY, 0], [0, totalHeight, 0], 5),
    createSketchLine([width, baseY, 0], [width, totalHeight, 0], 5),
    createSketchLine([0, baseY, depth], [0, totalHeight, depth], 5),
    createSketchLine([width, baseY, depth], [width, totalHeight, depth], 5)
  );

  // Roof
  points.push(
    createSketchLine([0, totalHeight, 0], [width/2, totalHeight + roofHeight, 0], 3),
    createSketchLine([width/2, totalHeight + roofHeight, 0], [width, totalHeight, 0], 3),
    createSketchLine([0, totalHeight, depth], [width/2, totalHeight + roofHeight, depth], 3),
    createSketchLine([width/2, totalHeight + roofHeight, depth], [width, totalHeight, depth], 3),
    createSketchLine([width/2, totalHeight + roofHeight, 0], [width/2, totalHeight + roofHeight, depth], 3)
  );

  // Main entrance door
  const doorCenter = width / 2;
  points.push(
    ...createSketchLine(
      [doorCenter - DOOR_WIDTH / 2, 0, 0],
      [doorCenter + DOOR_WIDTH / 2, DOOR_HEIGHT, 0],
      5
    ).map(point => [point])
  );

  // Evenly spaced windows on front and back walls of each floor
  const frontBackWindowPositions = calculateEvenWindowPositions(width);
  for (let i = 0; i < floors; i++) {
    const y = i * FLOOR_HEIGHT;
    frontBackWindowPositions.forEach(x => {
      if (Math.abs(x - doorCenter) > DOOR_WIDTH || i > 0) {
        points.push(...createWindowPoints(x, y + 1, 0));         // Front windows
        points.push(...createWindowPoints(x, y + 1, depth));     // Back windows
      }
    });

    // Side windows
    const sideWindowPositions = calculateEvenWindowPositions(depth);
    sideWindowPositions.forEach(z => {
      points.push(...createWindowPoints(0, y + 1, z, true));    // Left windows
      points.push(...createWindowPoints(width, y + 1, z, true));// Right windows
    });
  }

  return points;
}

function createBasementPoints(width: number, depth: number): LinePoints[] {
  const points: LinePoints[] = [];
  
  points.push(
    createSketchLine([0, -BASEMENT_DEPTH, 0], [width, -BASEMENT_DEPTH, 0], 5),
    createSketchLine([width, -BASEMENT_DEPTH, 0], [width, -BASEMENT_DEPTH, depth], 5),
    createSketchLine([width, -BASEMENT_DEPTH, depth], [0, -BASEMENT_DEPTH, depth], 5),
    createSketchLine([0, -BASEMENT_DEPTH, depth], [0, -BASEMENT_DEPTH, 0], 5)
  );

  points.push(
    createSketchLine([0, -BASEMENT_DEPTH, 0], [0, 0, 0], 3),
    createSketchLine([width, -BASEMENT_DEPTH, 0], [width, 0, 0], 3),
    createSketchLine([0, -BASEMENT_DEPTH, depth], [0, 0, depth], 3),
    createSketchLine([width, -BASEMENT_DEPTH, depth], [width, 0, depth], 3)
  );

  // Basement windows
  const windowY = -BASEMENT_DEPTH + 0.5;
  points.push(
    createSketchLine([2, windowY, 0], [3, windowY, 0], 2),
    createSketchLine([2, windowY + 0.8, 0], [3, windowY + 0.8, 0], 2),
    createSketchLine([width - 3, windowY, 0], [width - 2, windowY, 0], 2),
    createSketchLine([width - 3, windowY + 0.8, 0], [width - 2, windowY + 0.8, 0], 2)
  );

  return points;
}