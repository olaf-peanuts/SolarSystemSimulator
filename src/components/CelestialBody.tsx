// src/components/CelestialBody.tsx
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { CelestialBody as CelestialBodyClass } from '../models/celestialBody';
import { Planet } from '../models/planet';
import { Moon } from '../models/moon';
import { calculateCelestialPosition } from '../utils/orbitCalculator';

interface CelestialBodyProps {
  body: CelestialBodyClass;
  parentPosition?: THREE.Vector3;
  currentTime: Date;
  viewMode: 'system' | 'earth' | 'custom';
  latitude: number;
  longitude: number; // Added longitude property
}

/**
 * CelestialBody コンポーネント
 * @param {CelestialBodyProps} props - コンポーネントのプロパティ
 * @returns {JSX.Element} - 天体を表す Three.js のメッシュ
 */
export function CelestialBody({ body, parentPosition = new THREE.Vector3(0,0,0), currentTime }: CelestialBodyProps) {
  // メッシュの参照を保持するための useRef
  const meshRef = useRef<THREE.Mesh>(null);

  /**
   * 天体のテクスチャをロードします。
   * useTexture は React Hook のため、条件に関係なく常に呼び出す必要があります。
   */
  const texture = useTexture(body.texture ?? '');

  /**
   * 天体の材質を作成します。
   * - テクスチャがある場合はそれを使用します。
   * - 星の場合は発光色を設定します。
   */
  const material = useMemo(() => {
    const isStar = body.type === 'star';
    const hasTexture = Boolean(body.texture);
    return new THREE.MeshStandardMaterial({
      map: hasTexture ? texture : undefined,
      color: hasTexture ? '#ffffff' : (body.color ?? '#ffffff'), // テクスチャがあれば白で固定
      emissive: isStar ? '#ffffff' : '#000000',
      emissiveIntensity: isStar ? 1.0 : 0,
    });
  }, [body, texture]);

  /**
   * 天体の位置を計算します。
   * - 星の場合は原点に固定します。
   * - 惑星や月の場合は軌道要素を基に計算します。
   * - その他の場合は親の位置をそのまま使用します。
   */
  const position = useMemo(() => {
    if (body.type === 'star') {
      return new THREE.Vector3(0, 0, 0);
    } else if (body instanceof Planet || body instanceof Moon) {
      return calculateCelestialPosition(body.orbitalElements, currentTime, parentPosition);
    } else {
      return new THREE.Vector3().copy(parentPosition);
    }
  }, [body, parentPosition, currentTime]);

  /**
   * フレームごとにメッシュの位置と回転を更新します。
   * - 回転速度は天体の自転周期に基づいて計算されます。
   * - 軸の傾き（axialTilt）がある場合は X 軸の回転に反映します。
   */
  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.position.copy(position);
    if (body.rotationPeriod && body.rotationPeriod > 0) {
      const rotationSpeed = (2 * Math.PI) / (body.rotationPeriod * 3600);
      meshRef.current.rotation.y += rotationSpeed * delta;
      if ('axialTilt' in body && typeof body.axialTilt === 'number') {
        meshRef.current.rotation.x = body.axialTilt * Math.PI / 180;
      }
    }
  });

  /**
   * 星の場合、光源を生成します。
   * - 光源は Three.js の pointLight を使用します。
   */
  const starLight = useMemo(() => {
    if (body.type === 'star') {
      return (
        <pointLight 
          position={[0, 0, 0]} 
          intensity={10} 
          distance={100} 
          decay={2}
          color={body.color}
        />
      );
    }
    return null;
  }, [body]);

  return (
    <group>
      {/* メッシュを Three.js のグループ内に配置 */}
      <mesh ref={meshRef} position={position}>
        {/* 球体のジオメトリを作成 */}
        <sphereGeometry args={[body.displayRadius, 32, 32]} />
        {/* 材質を適用 */}
        <primitive object={material} attach="material" />
        {starLight}
      </mesh>
    </group>
  );
}