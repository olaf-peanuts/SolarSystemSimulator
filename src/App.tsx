import * as THREE from 'three'; 
import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber'; // ← 3D描画用
import { Suspense, useState } from 'react';  // ← React標準機能
import { SolarSystem } from './components/SolarSystem'; // ← ソーラーシステム表示用
import { SettingsPanel } from './components/ui/SettingsPanel'; 
import styles from './App.module.css';       // ← CSS Modules読み込み

function App() {
  // --- 時間倍率の状態管理（初期値: 1秒=1秒）
  const [timeScale, setTimeScale] = useState<number>(1);
  const lightRef = useRef<THREE.DirectionalLight>(null);

  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.target.position.set(0, 0, 1000); // 地球の方角に光を向ける
      lightRef.current.target.updateMatrixWorld();
    }
  }, []); // ← マウント時に1回だけ実行！

  return (
    <div className={styles['app-container']}>
      <Canvas shadows camera={{ position: [0, 0, 1000], fov: 10 }}>
        {/*
        <SolarSystem timeScale={timeScale} />
        */}
        <SolarSystem />
      </Canvas>
      <div className={styles['app-container__controls']}>
        <SettingsPanel
          timeScale={timeScale}
          onTimeScaleChange={setTimeScale}
        />
      </div>
    </div>
  );
}

export default App;
