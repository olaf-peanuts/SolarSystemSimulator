// filepath: src/components/SceneCanvas.tsx

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import styles from './SceneCanvas.module.css';
import { CelestialBody } from './CelestialBody';
import { CelestialBody as CelestialBodyClass } from '../models/celestialBody';

/**
 * 3Dシーン表示コンポーネント
 * - Three.js/React Three Fiberで天体・軌道・カメラ制御を担当
 */
interface SceneCanvasProps {
  celestialMap: Map<string, CelestialBodyClass>;
  viewMode: 'system' | 'earth' | 'custom';
  fov: number;
  latitude: number;
  longitude: number;
  currentTime: Date;
}

const SceneCanvas: React.FC<SceneCanvasProps> = ({
  celestialMap, viewMode, fov, latitude, longitude, currentTime
}) => {
  // Mapから配列に変換して描画
  const bodies = Array.from(celestialMap.values());

  return (
    <div className={styles['scene-canvas']}>
      <Canvas className={styles['scene-canvas__canvas']} camera={{ position: [0, 0, 50], fov }}>
        <color attach="background" args={['#000']} />
        <ambientLight intensity={0.1} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
        {/* 軌道や天体の描画 */}
        <Suspense fallback={null}>
          {bodies.map((body, idx) => (
            <CelestialBody
              key={body.id || idx}
              body={body}
              viewMode={viewMode}
              latitude={latitude}
              longitude={longitude}
              currentTime={currentTime}
            />
          ))}
        </Suspense>
        {/* カメラコントロール */}
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default SceneCanvas;
