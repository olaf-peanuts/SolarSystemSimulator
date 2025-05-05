// src/App.tsx
import React, { useEffect, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { CelestialBody } from './components/CelestialBody';
import { EarthView } from './components/EarthView';
import { CelestialConfig, CelestialBody as CelestialBodyType } from './types/celestialBody';
import { useTimeStore, formatDateTime } from './utils/TimeManager';
import { generateOrbitPoints, calculateMoonPhase } from './utils/OrbitCalculator';
import './App.css';

// 設定ファイルのインポート
import celestialConfig from './config/celestial.json';

function App() {
  const [config, setConfig] = useState<CelestialConfig>(celestialConfig as CelestialConfig);
  const [viewMode, setViewMode] = useState<'system' | 'earth' | 'custom'>('system');
  const [fov, setFov] = useState<number>(60);
  const [latitude, setLatitude] = useState<number>(35.6895); // デフォルト: 東京
  const [longitude, setLongitude] = useState<number>(139.6917); // デフォルト: 東京
  const [moonPhase, setMoonPhase] = useState<number>(0); // 月の満ち欠け（0-1）

  // 時刻関連の状態
  const { 
    currentTime, 
    timeScale, 
    isPaused, 
    setTimeScale, 
    togglePause, 
    resetToCurrentTime, 
    tick 
  } = useTimeStore();

  // アニメーションループ
  useEffect(() => {
    const animationId = requestAnimationFrame(function animate() {
      tick(); // 時間を更新
      requestAnimationFrame(animate);
    });

    return () => cancelAnimationFrame(animationId);
  }, [tick]);

  // 設定をロード
  useEffect(() => {
    // 設定ファイルの日付があれば設定
    if (config.timeSettings.startDate) {
      useTimeStore.getState().setSpecificDate(new Date(config.timeSettings.startDate));
    }

    // デフォルトのタイムスケールを設定
    setTimeScale(config.timeSettings.defaultTimeScale);
  }, [config, setTimeScale]);

  // 月の満ち欠けを計算
  useEffect(() => {
    // 各天体の位置を取得
    const earth = config.bodies.find(b => b.id === 'earth');
    const moon = config.bodies.find(b => b.id === 'moon');
    const sun = config.bodies.find(b => b.id === 'sun');

    if (earth && moon && earth.type === 'planet' && moon.type === 'moon' && sun) {
      // 太陽は原点
      const sunPosition = new THREE.Vector3(0, 0, 0);
      
      // 地球の位置を計算（実装済みならそちらを使用）
      const earthPosition = new THREE.Vector3(0, 0, 0); // 仮の位置、実際には計算が必要
      
      // 月の位置を計算（実装済みならそちらを使用）
      const moonPosition = new THREE.Vector3(0, 0, 0); // 仮の位置、実際には計算が必要
      
      // 月の満ち欠けを計算
      const phase = calculateMoonPhase(moonPosition, earthPosition, sunPosition);
      setMoonPhase(phase);
    }
  }, [config.bodies, currentTime]);

  // 星を表示する関数
  const renderCelestialBodies = () => {
    const bodies = config.bodies;

    return bodies.map(body => {
      // 親の位置を取得
      let parentPosition = new THREE.Vector3(0, 0, 0);
      if (body.parentId) {
        const parent = bodies.find(b => b.id === body.parentId);
        if (parent) {
          // この実装では親の位置は常に更新されているため、ここでは初期値だけを設定
          // 実際の位置は CelestialBody コンポーネント内で更新される
          parentPosition = new THREE.Vector3(0, 0, 0);
        }
      }

      return (
        <CelestialBody
          key={body.id}
          body={body}
          parentPosition={parentPosition}
          showOrbit={true}
        />
      );
    });
  };

  // 軌道を描画する関数
  const renderOrbits = () => {
    const bodies = config.bodies;
    const orbits = [];

    for (const body of bodies) {
      if ((body.type === 'planet' || body.type === 'moon') && 'orbitalElements' in body) {
        const points = generateOrbitPoints(body.orbitalElements, 100);
        
        orbits.push(
          <line key={`orbit-${body.id}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={points.length}
                array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color={body.color} opacity={0.5} transparent />
          </line>
        );
      }
    }

    return orbits;
  };

  // 視点を変更する関数
  const changeViewMode = (mode: 'system' | 'earth' | 'custom') => {
    setViewMode(mode);
  };

  // カメラの設定
  const getCameraSettings = () => {
    switch (viewMode) {
      case 'earth':
        // 地球視点
        return {
          position: [0, 0, 0], // これは実際には地球上の位置に調整される
          fov: fov,
        };
      case 'custom':
        return {
          position: [0, 10, 20],
          fov: fov,
        };
      case 'system':
      default:
        // 太陽系全体の視点
        return {
          position: config.defaultView.cameraPosition,
          fov: 60,
        };
    }
  };

  // 月の満ち欠けを表示
  const renderMoonPhaseImage = () => {
    // 月の満ち欠けに応じた表示（0=新月、0.5=満月）
    const phaseDescription = () => {
      if (moonPhase < 0.05) return '新月';
      if (moonPhase < 0.20) return '三日月（上弦前）';
      if (moonPhase < 0.30) return '上弦の月';
      if (moonPhase < 0.45) return '十三夜月（上弦後）';
      if (moonPhase < 0.55) return '満月';
      if (moonPhase < 0.70) return '十六夜月（下弦前）';
      if (moonPhase < 0.80) return '下弦の月';
      if (moonPhase < 0.95) return '二十六夜月（下弦後）';
      return '新月';
    };

    return (
      <div className="moon-phase-display">
        <div 
          className="moon-image" 
          style={{ 
            backgroundColor: '#333',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* 月の満ち欠けを表現するための要素（実際にはもっと複雑な表現が必要） */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: `${moonPhase * 100}%`,
              width: '100%',
              height: '100%',
              backgroundColor: '#ccc',
              borderRadius: '50%',
              transform: `translateX(-${moonPhase * 100}%)`
            }}
          />
        </div>
        <div>
          <p>月相: {(moonPhase * 100).toFixed(1)}%</p>
          <p>{phaseDescription()}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <header className="controls">
        <div className="time-display">
          <h3>現在時刻: {formatDateTime(currentTime)}</h3>
        </div>
        
        <div className="time-controls">
          <button onClick={togglePause}>
            {isPaused ? '再生' : '一時停止'}
          </button>
          <button onClick={resetToCurrentTime}>現在時刻にリセット</button>
          
          <label>
            時間スケール:
            <input
              type="range"
              min="1"
              max="10000"
              value={timeScale}
              onChange={(e) => setTimeScale(Number(e.target.value))}
            />
            <span>x{timeScale.toLocaleString()}</span>
          </label>
        </div>
        
        <div className="view-controls">
          <button onClick={() => changeViewMode('system')}>太陽系全体</button>
          <button onClick={() => changeViewMode('earth')}>地球視点</button>
          <button onClick={() => changeViewMode('custom')}>カスタム視点</button>
          
          <label>
            視野角:
            <input
              type="range"
              min="30"
              max="180"
              value={fov}
              onChange={(e) => setFov(Number(e.target.value))}
            />
            <span>{fov}°</span>
          </label>
          
          {viewMode === 'earth' && (
            <div className="earth-coordinates">
              <label>
                緯度:
                <input
                  type="number"
                  min="-90"
                  max="90"
                  value={latitude}
                  onChange={(e) => setLatitude(Number(e.target.value))}
                />
              </label>
              <label>
                経度:
                <input
                  type="number"
                  min="-180"
                  max="180"
                  value={longitude}
                  onChange={(e) => setLongitude(Number(e.target.value))}
                />
              </label>
            </div>
          )}
        </div>
      </header>
      
      <main className="scene-container">
        <Canvas camera={getCameraSettings()}>
          <color attach="background" args={['#000']} />
          <ambientLight intensity={0.1} />
          
          {/* 星空 */}
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
          
          {/* 軌道 */}
          {renderOrbits()}
          
          {/* 天体 */}
          <Suspense fallback={null}>
            {renderCelestialBodies()}
          </Suspense>
          
          {/* 地球視点モードの場合 */}
          {viewMode === 'earth' && (
            <EarthView
              config={config}
              latitude={latitude}
              longitude={longitude}
              fov={fov}
            />
          )}
          
          {/* カメラコントロール（地球視点以外） */}
          {viewMode !== 'earth' && <OrbitControls />}
        </Canvas>
      </main>
      
      <footer className="info-panel">
        <div className="moon-phase-info">
          <h3>月齢情報</h3>
          {renderMoonPhaseImage()}
        </div>
      </footer>
    </div>
  );
}

export default App;
