// src/components/EarthView.tsx
import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useTimeStore } from '../utils/TimeManager';
import { calculateCelestialPosition, calculateMoonPhase } from '../utils/OrbitCalculator';
import { CelestialConfig } from '../types/celestialBody';

interface EarthViewProps {
  config: CelestialConfig;
  latitude: number;
  longitude: number;
  fov: number;
}

export const EarthView: React.FC<EarthViewProps> = ({
  config,
  latitude,
  longitude,
  fov,
}) => {
  const { camera } = useThree();
  const currentTime = useTimeStore((state) => state.currentTime);
  
  // 地球、月、太陽のオブジェクトを取得
  const earth = config.bodies.find(body => body.id === 'earth');
  const moon = config.bodies.find(body => body.id === 'moon');
  const sun = config.bodies.find(body => body.id === 'sun');
  
  useEffect(() => {
    // カメラの視野角を設定
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
      
      // 魚眼効果の適用（視野角が広い場合）
      if (fov > 100) {
        // Fisheyeシェーダーなどを適用する場合はここで
      }
    }
  }, [camera, fov]);
  
  // 緯度経度から地球上の位置を計算
  const getEarthSurfacePosition = () => {
    if (!earth) return new THREE.Vector3(0, 0, 0);
    
    // 緯度経度をラジアンに変換
    const latRad = latitude * Math.PI / 180;
    const lonRad = longitude * Math.PI / 180;
    
    // 地球の半径
    const radius = earth.displayRadius;
    
    // 球面座標から直交座標に変換
    const x = radius * Math.cos(latRad) * Math.cos(lonRad);
    const y = radius * Math.sin(latRad);
    const z = radius * Math.cos(latRad) * Math.sin(lonRad);
    
    return new THREE.Vector3(x, y, z);
  };
  
  // フレームごとに実行
  useFrame(() => {
    if (!earth || !moon || !sun) return;
    
    // 各天体の位置を計算
    const sunPosition = new THREE.Vector3(0, 0, 0); // 太陽は常に原点
    const earthPosition = calculateCelestialPosition(earth.orbitalElements, currentTime);
    const moonPosition = calculateCelestialPosition(moon.orbitalElements, currentTime, earthPosition);
    
    // 地球上の視点位置
    const surfacePosition = getEarthSurfacePosition();
    
    // 地球の自転を考慮して位置を調整
    // 自転角度 = 現在の時刻に基づく角度
    const earthRotationAngle = (currentTime.getHours() + currentTime.getMinutes() / 60) * (Math.PI / 12);
    const rotationMatrix = new THREE.Matrix4().makeRotationY(-earthRotationAngle);
    surfacePosition.applyMatrix4(rotationMatrix);
    
    // カメラを地球上の視点に配置
    camera.position.copy(earthPosition).add(surfacePosition);
    
    // カメラの向きを設定（初期値として北向き）
    const up = new THREE.Vector3(0, 1, 0); // 北を上に
    
    // 月の方向と太陽の方向を計算
    const toMoon = new THREE.Vector3().subVectors(moonPosition, camera.position).normalize();
    const toSun = new THREE.Vector3().subVectors(sunPosition, camera.position).normalize();
    
    // カメラの向きを設定（どの方向を見るかはアプリの要件による）
    // ここでは仮に太陽の方向を向けるようにする
    camera.lookAt(new THREE.Vector3().addVectors(camera.position, toSun));
    camera.up.copy(up);
    
    // 月のフェーズを計算
    const moonPhase = calculateMoonPhase(moonPosition, earthPosition, sunPosition);
    // moonPhaseの値（0-1）に基づいて月の満ち欠け表示を更新
  });
  
  return null; // このコンポーネントは視点の制御のみを行うため、表示要素はない
};
