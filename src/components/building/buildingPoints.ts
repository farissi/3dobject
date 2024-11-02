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
import { calculateWindowPositions, addSketchEffect } from '../../utils/buildingCalculations';

function createSketchLine(start: Point3D, end: Point3D, segments: number = 3): Point3D[] {
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

function createBasementPoints(width: number, depth: number): LinePoints[] {
  const points: LinePoints[] = [];
  
  // Basement outline
  points.push(
    createSketchLine([0, -BASEMENT_DEPTH, 0], [width, -BASEMENT_DEPTH, 0]),
    createSketchLine([width, -BASEMENT_DEPTH, 0], [width, -BASEMENT_DEPTH, depth]),
    createSketchLine([width, -BASEMENT_DEPTH, depth], [0, -BASEMENT_DEPTH, depth]),
    createSketchLine([0, -BASEMENT_DEPTH, depth], [0, -BASEMENT_DEPTH, 0])
  );

  // Vertical edges
  points.push(
    createSketchLine([0, -BASEMENT_DEPTH, 0], [0, 0, 0]),
    createSketchLine([width, -BASEMENT_DEPTH, 0], [width, 0, 0]),
    createSketchLine([0, -BASEMENT_DEPTH, depth], [0, 0, depth]),
    createSketchLine([width, -BASEMENT_DEPTH, depth], [width, 0, depth])
  );

  // Basement windows (two windows centered on each long wall)
  const windowY = -BASEMENT_DEPTH + 0.5;
  points.push(
    createSketchLine([2, windowY, 0], [3, windowY, 0]),
    createSketchLine([2, windowY + 0.8, 0], [3, windowY + 0.8, 0]),
    createSketchLine([width - 3, windowY, 0], [width - 2, windowY, 0]),
    createSketchLine([width - 3, windowY + 0.8, 0], [width - 2, windowY + 0.8, 0])
  );

  return points;
}

function createWindowPoints(x: number, y: number, z: number, isVertical: boolean = false): LinePoints[] {
  const points: LinePoints[] = [];
  if (isVertical) {
    points.push(
      createSketchLine([x, y, z], [x, y, z + WINDOW_WIDTH]),
      createSketchLine([x, y, z + WINDOW_WIDTH], [x, y + WINDOW_HEIGHT, z + WINDOW_WIDTH]),
      createSketchLine([x, y + WINDOW_HEIGHT, z + WINDOW_WIDTH], [x, y + WINDOW_HEIGHT, z]),
      createSketchLine([x, y + WINDOW_HEIGHT, z], [x, y, z])
    );
  } else {
    points.push(
      createSketchLine([x, y, z], [x + WINDOW_WIDTH, y, z]),
      createSketchLine([x + WINDOW_WIDTH, y, z], [x + WINDOW_WIDTH, y + WINDOW_HEIGHT, z]),
      createSketchLine([x + WINDOW_WIDTH, y + WINDOW_HEIGHT, z], [x, y + WINDOW_HEIGHT, z]),
      createSketchLine([x, y + WINDOW_HEIGHT, z], [x, y, z])
    );
  }
  return points;
}

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
    createSketchLine([0, baseY, 0], [width, baseY, 0]),
    createSketchLine([width, baseY, 0], [width, baseY, depth]),
    createSketchLine([width, baseY, depth], [0, baseY, depth]),
    createSketchLine([0, baseY, depth], [0, baseY, 0])
  );

  // Vertical edges
  points.push(
    createSketchLine([0, baseY, 0], [0, totalHeight, 0]),
    createSketchLine([width, baseY, 0], [width, totalHeight, 0]),
    createSketchLine([0, baseY, depth], [0, totalHeight, depth]),
    createSketchLine([width, baseY, depth], [width, totalHeight, depth])
  );

  // Floor separators
  for (let i = 0; i <= floors; i++) {
    const y = i * FLOOR_HEIGHT;
    points.push(
      createSketchLine([0, y, 0], [width, y, 0]),
      createSketchLine([width, y, 0], [width, y, depth]),
      createSketchLine([width, y, depth], [0, y, depth]),
      createSketchLine([0, y, depth], [0, y, 0])
    );
  }

  // Main entrance door
  const doorCenter = width / 2;
  points.push(
    ...createSketchLine(
      [doorCenter - DOOR_WIDTH / 2, 0, 0],
      [doorCenter + DOOR_WIDTH / 2, DOOR_HEIGHT, 0]
    ).map(point => [point])
  );

  // Add exactly two windows per floor on each front side
  const windowPositions = calculateWindowPositions(width, 2);
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
    createSketchLine([0, baseY, 0], [width, baseY, 0]),
    createSketchLine([width, baseY, 0], [width, baseY, depth]),
    createSketchLine([width, baseY, depth], [0, baseY, depth]),
    createSketchLine([0, baseY, depth], [0, baseY, 0])
  );

  // Vertical edges
  points.push(
    createSketchLine([0, baseY, 0], [0, totalHeight, 0]),
    createSketchLine([width, baseY, 0], [width, totalHeight, 0]),
    createSketchLine([0, baseY, depth], [0, totalHeight, depth]),
    createSketchLine([width, baseY, depth], [width, totalHeight, depth])
  );

  // Roof
  points.push(
    createSketchLine([0, totalHeight, 0], [width/2, totalHeight + roofHeight, 0]),
    createSketchLine([width/2, totalHeight + roofHeight, 0], [width, totalHeight, 0]),
    createSketchLine([0, totalHeight, depth], [width/2, totalHeight + roofHeight, depth]),
    createSketchLine([width/2, totalHeight + roofHeight, depth], [width, totalHeight, depth]),
    createSketchLine([width/2, totalHeight + roofHeight, 0], [width/2, totalHeight + roofHeight, depth])
  );

  // Main entrance door
  const doorCenter = width / 2;
  points.push(
    ...createSketchLine(
      [doorCenter - DOOR_WIDTH / 2, 0, 0],
      [doorCenter + DOOR_WIDTH / 2, DOOR_HEIGHT, 0]
    ).map(point => [point])
  );

  // Add exactly two windows per floor on each side
  for (let i = 0; i < floors; i++) {
    const y = i * FLOOR_HEIGHT;
    
    // Front and back windows
    const frontBackWindows = calculateWindowPositions(width, 2);
    frontBackWindows.forEach(x => {
      if (Math.abs(x - doorCenter) > DOOR_WIDTH || i > 0) {
        points.push(...createWindowPoints(x, y + 1, 0));      // Front
        points.push(...createWindowPoints(x, y + 1, depth));  // Back
      }
    });

    // Side windows
    const sideWindows = calculateWindowPositions(depth, 2);
    sideWindows.forEach(z => {
      points.push(...createWindowPoints(0, y + 1, z, true));    // Left
      points.push(...createWindowPoints(width, y + 1, z, true));// Right
    });
  }

  return points;
}
