// src/components/CelestialBody.tsx
import * as THREE from 'three';
import React, { useRef } from 'react';
//import { useFrame } from '@react-three/fiber';
import { CelestialBody } from '../types/celestialBody';

interface CelestialBodyProps {
  body: CelestialBody;
  initialPosition: [number, number, number]; // 明示的に型を指定
  texture?: THREE.Texture;
}

const CelestialBodyComponent: React.FC<CelestialBodyProps> = ({ 
  body, 
  initialPosition,
  texture 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // アニメーションロジックがあればここに...
  
  return (
    <mesh
      ref={meshRef}
      position={initialPosition} // 型が[number, number, number]として明示的に指定されているので問題なし
    >
      <sphereGeometry args={[body.displayRadius, 32, 32]} />
      
      {/* マテリアルをJSX形式で直接記述 */}
      {body.type === 'star' ? (
        <meshBasicMaterial 
          color={body.color}
          map={texture}
        />
      ) : (
        <meshStandardMaterial
          color={body.color}
          map={texture}
          roughness={0.8}
          metalness={0.2}
        />
      )}
      
      {/* 恒星の場合、光源を追加 */}
      {body.type === 'star' && (
        <pointLight
          intensity={1.5}
          distance={100}
          color={body.color}
        />
      )}
    </mesh>
  );
};

export default CelestialBodyComponent;