import { MIN_WINDOW_SPACING, WALL_MARGIN } from '../constants/building';

export function calculateWindowPositions(width: number): number[] {
  const availableWidth = Math.max(0, width - (2 * WALL_MARGIN));
  const possibleWindows = Math.max(2, Math.floor(availableWidth / MIN_WINDOW_SPACING));
  const actualSpacing = availableWidth / Math.max(1, possibleWindows - 1);
  
  return Array.from({ length: possibleWindows }, (_, i) => 
    WALL_MARGIN + (i * actualSpacing)
  ).filter(x => x >= 0 && x <= width && !isNaN(x));
}

export function calculateBalconyPositions(width: number): number[] {
  const minSpacing = 3;
  const availableWidth = Math.max(0, width - (2 * WALL_MARGIN));
  const possibleBalconies = Math.max(2, Math.floor(availableWidth / minSpacing));
  const actualSpacing = availableWidth / Math.max(1, possibleBalconies - 1);
  
  return Array.from({ length: possibleBalconies }, (_, i) => 
    WALL_MARGIN + (i * actualSpacing)
  ).filter(x => x >= 0 && x <= width && !isNaN(x));
}