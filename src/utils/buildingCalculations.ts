import { MIN_WINDOW_SPACING, WALL_MARGIN, WINDOW_WIDTH } from '../constants/building';

export function calculateWindowPositions(width: number, maxWindows: number = 4): number[] {
  const availableWidth = width - (2 * WALL_MARGIN);
  const minSpacing = MIN_WINDOW_SPACING + WINDOW_WIDTH;
  const possibleWindows = Math.min(maxWindows, Math.floor(availableWidth / minSpacing));
  
  if (possibleWindows <= 1) return [width / 2];
  
  const actualSpacing = availableWidth / (possibleWindows - 1);
  const positions = [];
  
  for (let i = 0; i < possibleWindows; i++) {
    const basePosition = WALL_MARGIN + (i * actualSpacing);
    // Add slight randomness for sketch effect
    const randomOffset = (Math.random() - 0.5) * 0.1;
    positions.push(basePosition + randomOffset);
  }
  
  return positions.filter(x => x >= WALL_MARGIN && x <= width - WALL_MARGIN - WINDOW_WIDTH);
}

// Add slight variation to points for sketch effect
export function addSketchEffect(point: number, variation: number = 0.05): number {
  return point + (Math.random() - 0.5) * variation;
}