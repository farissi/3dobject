export type Point3D = [number, number, number];
export type LinePoints = Point3D[];

export interface BuildingProps {
  type: 'apartment' | 'house';
  floors: number;
  width: number;
  depth: number;
  hasBasement: boolean;
}