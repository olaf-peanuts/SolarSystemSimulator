// src/components/EarthView.tsx
import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CelestialConfig } from '../types/celestialBody';
import { useTimeStore } from '../utils/timeManager';
import { calculateCelestialPosition } from '../utils/orbitCalculator';

interface EarthViewProps {
  config: CelestialConfig;
  latitude: number;
  longitude: number;
  fov: number;
}

export function EarthView({ config, latitude, longitude, fov }: EarthViewProps) {
  // Three.jsのカメラを取得
  const { camera } = useThree();
  // 地球の参照
  const earthRef = useRef<THREE.Group | null>(null);
  const { currentTime } = useTimeStore();

  // 地球の位置を計算
  useEffect(() => {
    // 地球の情報を取得
    const earth = config.bodies.find(b => b.id === 'earth');
    const sun = config.bodies.find(b => b.id === 'sun');

    if (!earth || !sun || earth.type !== 'planet') return;

    // 地球の位置を計算（太陽を中心とした位置）
    const earthPosition = calculateCelestialPosition(
      earth.orbitalElements,
      currentTime,
      new THREE.Vector3(0, 0, 0)
    );

    // 地球の参照を設定
    if (earthRef.current) {
      earthRef.current.position.copy(earthPosition);
    }

    // カメラを地球の表面に配置
    const earthRadius = earth.displayRadius;
    
    // 緯度と経度をラジアンに変換
    const latRad = latitude * Math.PI / 180;
    const lonRad = longitude * Math.PI / 180;
    
    // 地球表面の座標を計算（球面座標から直交座標へ）
    const surfaceX = earthRadius * Math.cos(latRad) * Math.cos(lonRad);
    const surfaceY = earthRadius * Math.sin(latRad);
    const surfaceZ = earthRadius * Math.cos(latRad) * Math.sin(lonRad);
    
    // 地球の中心からの表面位置
    const surfacePosition = new THREE.Vector3(surfaceX, surfaceY, surfaceZ);
    
    // カメラの位置を地球の表面に設定
    camera.position.copy(earthPosition.clone().add(surfacePosition));
    
    // カメラの上方向を設定（北極方向）
    const up = new THREE.Vector3(0, 1, 0);
    camera.up.copy(up);
    
    // カメラの視線方向を空に向ける（表面の法線方向）
    const target = earthPosition.clone().add(surfacePosition.clone().multiplyScalar(2));
    camera.lookAt(target);
    
    // FOVを更新
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }, [camera, config, latitude, longitude, fov, currentTime]);

  // 自転を反映（実際の時間に基づいて）
  useFrame(() => {
    const earth = config.bodies.find(b => b.id === 'earth');
    if (!earth || !earthRef.current) return;
    
    // 現在時刻から地球の自転角度を計算
    const rotationPeriod = earth.rotationPeriod; // 時間単位
    const dayInMs = rotationPeriod * 3600 * 1000; // ミリ秒に変換
    const dayProgress = (currentTime.getTime() % dayInMs) / dayInMs;
    
    // 地球の自転角度（360度 * 日の進行度）
    const rotation = 2 * Math.PI * dayProgress;
    
    // 経度オフセットを考慮した回転（経度の増加は西向き）
    const longitudeOffset = (longitude * Math.PI) / 180;
    
    earthRef.current.rotation.y = rotation - longitudeOffset;
  });

  return (
    <group ref={earthRef} />
  );
}
