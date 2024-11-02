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
import { calculateWindowPositions } from '../../utils/buildingCalculations';

export function getApartmentPoints(
  floors: number,
  width: number,
  depth: number,
  hasBasement: boolean
): LinePoints[] {
  const totalHeight = floors * FLOOR_HEIGHT;
  const baseY = hasBasement ? -BASEMENT_DEPTH : 0;
  const points: LinePoints[] = [];

  // Basement if enabled
  if (hasBasement) {
    points.push(
      // Basement outline
      [[0, -BASEMENT_DEPTH, 0], [width, -BASEMENT_DEPTH, 0]],
      [[width, -BASEMENT_DEPTH, 0], [width, -BASEMENT_DEPTH, depth]],
      [[width, -BASEMENT_DEPTH, depth], [0, -BASEMENT_DEPTH, depth]],
      [[0, -BASEMENT_DEPTH, depth], [0, -BASEMENT_DEPTH, 0]],
      // Basement vertical edges
      [[0, -BASEMENT_DEPTH, 0], [0, 0, 0]],
      [[width, -BASEMENT_DEPTH, 0], [width, 0, 0]],
      [[0, -BASEMENT_DEPTH, depth], [0, 0, depth]],
      [[width, -BASEMENT_DEPTH, depth], [width, 0, depth]]
    );

    // Basement windows
    const windowY = -BASEMENT_DEPTH + 0.5;
    points.push(
      [[2, windowY, 0], [3, windowY, 0]],
      [[2, windowY + 0.8, 0], [3, windowY + 0.8, 0]],
      [[width - 3, windowY, 0], [width - 2, windowY, 0]],
      [[width - 3, windowY + 0.8, 0], [width - 2, windowY + 0.8, 0]]
    );
  }

  // Main structure outline
  points.push(
    [[0, baseY, 0], [width, baseY, 0]],
    [[width, baseY, 0], [width, baseY, depth]],
    [[width, baseY, depth], [0, baseY, depth]],
    [[0, baseY, depth], [0, baseY, 0]]
  );

  points.push(
    [[0, totalHeight, 0], [width, totalHeight, 0]],
    [[width, totalHeight, 0], [width, totalHeight, depth]],
    [[width, totalHeight, depth], [0, totalHeight, depth]],
    [[0, totalHeight, depth], [0, totalHeight, 0]]
  );

  // Vertical edges
  points.push(
    [[0, baseY, 0], [0, totalHeight, 0]],
    [[width, baseY, 0], [width, totalHeight, 0]],
    [[0, baseY, depth], [0, totalHeight, depth]],
    [[width, baseY, depth], [width, totalHeight, depth]]
  );

  // Floor separators
  for (let i = 0; i <= floors; i++) {
    const y = i * FLOOR_HEIGHT;
    points.push(
      [[0, y, 0], [width, y, 0]],
      [[width, y, 0], [width, y, depth]],
      [[width, y, depth], [0, y, depth]],
      [[0, y, depth], [0, y, 0]]
    );
  }

  // Main entrance door (centered)
  const doorCenter = width / 2;
  points.push(
    [[doorCenter - DOOR_WIDTH/2, 0, 0], [doorCenter + DOOR_WIDTH/2, 0, 0]],
    [[doorCenter + DOOR_WIDTH/2, 0, 0], [doorCenter + DOOR_WIDTH/2, DOOR_HEIGHT, 0]],
    [[doorCenter + DOOR_WIDTH/2, DOOR_HEIGHT, 0], [doorCenter, DOOR_HEIGHT + 0.2, 0]],
    [[doorCenter, DOOR_HEIGHT + 0.2, 0], [doorCenter - DOOR_WIDTH/2, DOOR_HEIGHT, 0]],
    [[doorCenter - DOOR_WIDTH/2, DOOR_HEIGHT, 0], [doorCenter - DOOR_WIDTH/2, 0, 0]]
  );

  // Windows
  const windowPositions = calculateWindowPositions(width);
  for (let i = 0; i < floors; i++) {
    const y = i * FLOOR_HEIGHT;
    
    // Front windows
    windowPositions.forEach(x => {
      if (Math.abs(x - doorCenter) > DOOR_WIDTH || i > 0) {
        points.push(
          [[x, y + 1, 0], [x + WINDOW_WIDTH, y + 1, 0]],
          [[x + WINDOW_WIDTH, y + 1, 0], [x + WINDOW_WIDTH, y + 1 + WINDOW_HEIGHT, 0]],
          [[x + WINDOW_WIDTH, y + 1 + WINDOW_HEIGHT, 0], [x, y + 1 + WINDOW_HEIGHT, 0]],
          [[x, y + 1 + WINDOW_HEIGHT, 0], [x, y + 1, 0]]
        );
      }
    });

    // Side windows
    const sideWindowPositions = calculateWindowPositions(depth);
    sideWindowPositions.forEach(z => {
      // Left side
      points.push(
        [[0, y + 1, z], [0, y + 1, z + WINDOW_WIDTH]],
        [[0, y + 1, z + WINDOW_WIDTH], [0, y + 1 + WINDOW_HEIGHT, z + WINDOW_WIDTH]],
        [[0, y + 1 + WINDOW_HEIGHT, z + WINDOW_WIDTH], [0, y + 1 + WINDOW_HEIGHT, z]],
        [[0, y + 1 + WINDOW_HEIGHT, z], [0, y + 1, z]]
      );

      // Right side
      points.push(
        [[width, y + 1, z], [width, y + 1, z + WINDOW_WIDTH]],
        [[width, y + 1, z + WINDOW_WIDTH], [width, y + 1 + WINDOW_HEIGHT, z + WINDOW_WIDTH]],
        [[width, y + 1 + WINDOW_HEIGHT, z + WINDOW_WIDTH], [width, y + 1 + WINDOW_HEIGHT, z]],
        [[width, y + 1 + WINDOW_HEIGHT, z], [width, y + 1, z]]
      );
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

  // Basement if enabled
  if (hasBasement) {
    points.push(
      // Basement outline
      [[0, -BASEMENT_DEPTH, 0], [width, -BASEMENT_DEPTH, 0]],
      [[width, -BASEMENT_DEPTH, 0], [width, -BASEMENT_DEPTH, depth]],
      [[width, -BASEMENT_DEPTH, depth], [0, -BASEMENT_DEPTH, depth]],
      [[0, -BASEMENT_DEPTH, depth], [0, -BASEMENT_DEPTH, 0]],
      // Basement vertical edges
      [[0, -BASEMENT_DEPTH, 0], [0, 0, 0]],
      [[width, -BASEMENT_DEPTH, 0], [width, 0, 0]],
      [[0, -BASEMENT_DEPTH, depth], [0, 0, depth]],
      [[width, -BASEMENT_DEPTH, depth], [width, 0, depth]]
    );

    // Basement windows
    const windowY = -BASEMENT_DEPTH + 0.5;
    points.push(
      [[2, windowY, 0], [3, windowY, 0]],
      [[2, windowY + 0.8, 0], [3, windowY + 0.8, 0]],
      [[width - 3, windowY, 0], [width - 2, windowY, 0]],
      [[width - 3, windowY + 0.8, 0], [width - 2, windowY + 0.8, 0]]
    );
  }

  // Main structure
  points.push(
    [[0, baseY, 0], [width, baseY, 0]],
    [[width, baseY, 0], [width, baseY, depth]],
    [[width, baseY, depth], [0, baseY, depth]],
    [[0, baseY, depth], [0, baseY, 0]]
  );

  points.push(
    [[0, totalHeight, 0], [width, totalHeight, 0]],
    [[width, totalHeight, 0], [width, totalHeight, depth]],
    [[width, totalHeight, depth], [0, totalHeight, depth]],
    [[0, totalHeight, depth], [0, totalHeight, 0]]
  );

  // Roof
  points.push(
    [[0, totalHeight, 0], [width/2, totalHeight + roofHeight, 0]],
    [[width/2, totalHeight + roofHeight, 0], [width, totalHeight, 0]],
    [[0, totalHeight, depth], [width/2, totalHeight + roofHeight, depth]],
    [[width/2, totalHeight + roofHeight, depth], [width, totalHeight, depth]],
    [[width/2, totalHeight + roofHeight, 0], [width/2, totalHeight + roofHeight, depth]]
  );

  // Vertical edges
  points.push(
    [[0, baseY, 0], [0, totalHeight, 0]],
    [[width, baseY, 0], [width, totalHeight, 0]],
    [[0, baseY, depth], [0, totalHeight, depth]],
    [[width, baseY, depth], [width, totalHeight, depth]]
  );

  // Door (centered)
  const doorCenter = width / 2;
  points.push(
    [[doorCenter - DOOR_WIDTH/2, 0, 0], [doorCenter + DOOR_WIDTH/2, 0, 0]],
    [[doorCenter + DOOR_WIDTH/2, 0, 0], [doorCenter + DOOR_WIDTH/2, DOOR_HEIGHT, 0]],
    [[doorCenter + DOOR_WIDTH/2, DOOR_HEIGHT, 0], [doorCenter, DOOR_HEIGHT + 0.2, 0]],
    [[doorCenter, DOOR_HEIGHT + 0.2, 0], [doorCenter - DOOR_WIDTH/2, DOOR_HEIGHT, 0]],
    [[doorCenter - DOOR_WIDTH/2, DOOR_HEIGHT, 0], [doorCenter - DOOR_WIDTH/2, 0, 0]]
  );

  // Windows
  const windowPositions = calculateWindowPositions(width);
  for (let i = 0; i < floors; i++) {
    const y = i * FLOOR_HEIGHT;
    
    // Front windows
    windowPositions.forEach(x => {
      if (Math.abs(x - doorCenter) > DOOR_WIDTH || i > 0) {
        points.push(
          [[x, y + 1, 0], [x + WINDOW_WIDTH, y + 1, 0]],
          [[x + WINDOW_WIDTH, y + 1, 0], [x + WINDOW_WIDTH, y + 1 + WINDOW_HEIGHT, 0]],
          [[x + WINDOW_WIDTH, y + 1 + WINDOW_HEIGHT, 0], [x, y + 1 + WINDOW_HEIGHT, 0]],
          [[x, y + 1 + WINDOW_HEIGHT, 0], [x, y + 1, 0]]
        );
      }
    });

    // Side windows
    const sideWindowPositions = calculateWindowPositions(depth);
    sideWindowPositions.forEach(z => {
      points.push(
        [[0, y + 1, z], [0, y + 1, z + WINDOW_WIDTH]],
        [[0, y + 1, z + WINDOW_WIDTH], [0, y + 1 + WINDOW_HEIGHT, z + WINDOW_WIDTH]],
        [[0, y + 1 + WINDOW_HEIGHT, z + WINDOW_WIDTH], [0, y + 1 + WINDOW_HEIGHT, z]],
        [[0, y + 1 + WINDOW_HEIGHT, z], [0, y + 1, z]]
      );
    });
  }

  return points;
}