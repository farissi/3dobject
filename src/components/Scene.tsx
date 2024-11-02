import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Building } from './building/Building';
import { Controls } from './ui/Controls';

export function Scene() {
  const controlsRef = useRef(null);

  return (
    <div className="w-full h-screen bg-gradient-to-b from-blue-50 to-white">
      <Canvas>
        <PerspectiveCamera makeDefault position={[15, 15, 15]} fov={50} />
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.05}
          minDistance={10}
          maxDistance={30}
          target={[0, 5, 0]}
        />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <group position={[-3.5, 0, -2.5]}>
          <Building />
          <gridHelper args={[20, 20, '#999', '#eee']} position={[3.5, 0, 2.5]} />
        </group>
        <fog attach="fog" args={['#f8fafc', 30, 50]} />
      </Canvas>
      <Controls />
    </div>
  );
}