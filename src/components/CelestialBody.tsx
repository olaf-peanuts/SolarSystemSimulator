// src/components/CelestialBody.tsx
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CelestialBody as CelestialBodyType } from '../types/celestialBody';
import { useTimeStore } from '../utils/TimeManager';
import { calculateCelestialPosition } from '../utils/OrbitCalculator';
import { TextureLoader } from 'three';

interface CelestialBodyProps {
  body: CelestialBodyType;
  parentPosition?: THREE.Vector3;
  showOrbit?: boolean;
}

export const CelestialBody: React.FC<CelestialBodyProps> = ({
  body,
  parentPosition = new THREE.Vector3(0, 0, 0),
  showOrbit = true,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const currentTime = useTimeStore((state) => state.currentTime);
  const textureLoader = new TextureLoader();
  const [texture, setTexture] = React.useState<THREE.Texture | null>(null);

  // テクスチャのロード
  useEffect(() => {
    if (body.texture) {
      textureLoader.load(body.texture, (loadedTexture) => {
        setTexture(loadedTexture);
      });
    }
  }, [body.texture]);

  // アニメーションフレームごとに実行
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // 自転の更新（自転周期に基づく）
    if (body.rotationPeriod > 0) {
      // 1秒あたりの回転角度 = 360度 / (自転周期（時間） * 3600秒)
      const rotationSpeed = (Math.PI * 2) / (body.rotationPeriod * 3600);
      meshRef.current.rotation.y += rotationSpeed * delta * 1000; // deltaは秒単位、1000倍して効果を強調
    }

    // 公転の位置更新（planet, moonの場合）
    if (body.type === 'planet' || body.type === 'moon') {
      // 軌道要素から現在位置を計算
      const newPosition = calculateCelestialPosition(
        body.orbitalElements,
        currentTime,
        parentPosition
      );
      
      // 位置を設定
      meshRef.current.position.copy(newPosition);
    }
  });

  // 天体のマテリアル
  const getMaterial = () => {
    if (body.type === 'star') {
      // 恒星の場合は発光するマテリアル
      return new THREE.MeshBasicMaterial({
        color: body.color,
        map: texture || null,
      });
    } else {
      // 惑星・衛星の場合は光を反射するマテリアル
      return new THREE.MeshStandardMaterial({
        color: body.color,
        map: texture || null,
        roughness: 0.8,
        metalness: 0.2,
      });
    }
  };

  // 星の初期位置の設定（太陽は原点、他は後でuseFrameで更新）
  const initialPosition = body.type === 'star' 
    ? [0, 0, 0] 
    : [parentPosition.x, parentPosition.y, parentPosition.z];

  return (
    <mesh
      ref={meshRef}
      position={initialPosition}
    >
      <sphereGeometry args={[body.displayRadius, 32, 32]} />
      {getMaterial()}
      
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
