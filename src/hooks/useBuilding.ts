import { create } from 'zustand';

interface BuildingState {
  buildingType: 'apartment' | 'house';
  floors: number;
  hasBasement: boolean;
  useDimensions: boolean;
  width: number;
  depth: number;
  surfaceArea: number;
  setBuildingType: (type: 'apartment' | 'house') => void;
  setFloors: (floors: number) => void;
  setHasBasement: (hasBasement: boolean) => void;
  setUseDimensions: (useDimensions: boolean) => void;
  setWidth: (width: number) => void;
  setDepth: (depth: number) => void;
  setSurfaceArea: (area: number) => void;
}

const MIN_WIDTH = 5;
const MAX_WIDTH = 20;
const MIN_DEPTH = 5;
const MAX_DEPTH = 15;
const MIN_AREA = 25;
const MAX_AREA = 300;

export const useBuilding = create<BuildingState>((set) => ({
  buildingType: 'apartment',
  floors: 3,
  hasBasement: false,
  useDimensions: false,
  width: 7,
  depth: 5,
  surfaceArea: 35,
  setBuildingType: (type) => set({ buildingType: type }),
  setFloors: (floors) => set({ floors: Math.min(10, Math.max(1, floors)) }),
  setHasBasement: (hasBasement) => set({ hasBasement }),
  setUseDimensions: (useDimensions) => set({ useDimensions }),
  setWidth: (width) => set((state) => ({ 
    width: Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, width)),
    surfaceArea: Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, width)) * state.depth
  })),
  setDepth: (depth) => set((state) => ({ 
    depth: Math.max(MIN_DEPTH, Math.min(MAX_DEPTH, depth)),
    surfaceArea: state.width * Math.max(MIN_DEPTH, Math.min(MAX_DEPTH, depth))
  })),
  setSurfaceArea: (area) => set((state) => {
    const newArea = Math.max(MIN_AREA, Math.min(MAX_AREA, area));
    const ratio = state.width / state.depth;
    const newWidth = Math.sqrt(newArea * ratio);
    const newDepth = newArea / newWidth;
    return {
      surfaceArea: newArea,
      width: Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth)),
      depth: Math.max(MIN_DEPTH, Math.min(MAX_DEPTH, newDepth))
    };
  }),
}));