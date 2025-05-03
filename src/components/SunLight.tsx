// src/components/SunLight.tsx
import * as THREE from 'three';
import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';

type SunLightProps = {
  targetPosition: [number, number, number];
};

export function SunLight({ targetPosition }: SunLightProps) {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const { scene } = useThree();

  useEffect(() => {
    if (lightRef.current) {
      const target = lightRef.current.target;
      target.position.set(...targetPosition);
      target.updateMatrixWorld();

      // シーンに target を追加（必要！）
      if (!scene.children.includes(target)) {
        scene.add(target);
      }
    }
  }, [targetPosition, scene]);

  return (
    <directionalLight
      ref={lightRef}
      castShadow
      position={[0, 0, 0]} // 太陽の位置
      intensity={2}
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
      shadow-camera-near={0.5}
      shadow-camera-far={5000}
      shadow-camera-left={-200}
      shadow-camera-right={200}
      shadow-camera-top={200}
      shadow-camera-bottom={-200}
    />
  );
}
