import { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import { Building } from './Building';

export function Scene() {
  const [buildingType, setBuildingType] = useState<'apartment' | 'house'>('apartment');
  const [floors, setFloors] = useState(3);
  const controlsRef = useRef(null);

  return (
    <div className="w-full h-screen bg-white">
      <div className="absolute top-4 left-4 z-10 space-y-4">
        <div className="space-x-2">
          <button
            onClick={() => setBuildingType('apartment')}
            className={`px-4 py-2 rounded-md ${
              buildingType === 'apartment'
                ? 'bg-black text-white'
                : 'bg-gray-200 text-black'
            }`}
          >
            Apartment
          </button>
          <button
            onClick={() => setBuildingType('house')}
            className={`px-4 py-2 rounded-md ${
              buildingType === 'house'
                ? 'bg-black text-white'
                : 'bg-gray-200 text-black'
            }`}
          >
            House
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="floors" className="text-sm font-medium">
            Floors:
          </label>
          <input
            id="floors"
            type="number"
            min="1"
            max="10"
            value={floors}
            onChange={(e) => setFloors(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-20 px-2 py-1 border rounded-md"
          />
        </div>
      </div>
      <Canvas
        camera={{ position: [10, 10, 10], fov: 50 }}
        style={{ background: 'white' }}
      >
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.05}
          minDistance={5}
          maxDistance={20}
        />
        <Building type={buildingType} floors={floors} />
        <gridHelper args={[20, 20, 'black', 'black']} />
      </Canvas>
    </div>
  );
}