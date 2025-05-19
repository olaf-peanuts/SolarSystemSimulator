// filepath: src/App.tsx

import { useState, useEffect } from 'react';
import { CelestialBody as CelestialBodyClass } from './models/celestialBody';
import { loadCelestials } from './utils/loadCelestials';
import ControlPanel from './components/ControlPanel';
import SceneCanvas from './components/SceneCanvas';
import MoonPhaseInfo from './components/MoonPhaseInfo';
import './App.css';

/**
 * アプリケーションのルートコンポーネント
 * - 各UIコンポーネントをまとめる
 * @returns JSX.Element
 */
function App() {
  // 天体データ（Map）を非同期で取得
  const [celestialMap, setCelestialMap] = useState<Map<string, CelestialBodyClass> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCelestials().then(map => {
      setCelestialMap(map);
      setLoading(false);
    });
  }, []);

  // 必要な状態はAppで管理し、子コンポーネントにpropsで渡す
  const [viewMode, setViewMode] = useState<'system' | 'earth' | 'custom'>('system');
  const [fov, setFov] = useState<number>(60);
  const [latitude, setLatitude] = useState<number>(35.6895);
  const [longitude, setLongitude] = useState<number>(139.6917);
  const [timeScale, setTimeScale] = useState<number>(1000);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [moonPhase] = useState<number>(0);

  if (loading || !celestialMap) {
    return <div>Loading celestial data...</div>;
  }

  // 必要に応じてcelestialMapからconfig情報を抽出してSceneCanvas等に渡す
  return (
    <div className="app">
      <header className="app__header">
        <ControlPanel
          viewMode={viewMode}
          setViewMode={setViewMode}
          fov={fov}
          setFov={setFov}
          latitude={latitude}
          setLatitude={setLatitude}
          longitude={longitude}
          setLongitude={setLongitude}
          timeScale={timeScale}
          setTimeScale={setTimeScale}
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
        />
      </header>
      <main className="app__scene-container">
        <SceneCanvas
          celestialMap={celestialMap}
          viewMode={viewMode}
          fov={fov}
          latitude={latitude}
          longitude={longitude}
          currentTime={currentTime}
        />
      </main>
      <footer className="app__info-panel">
        <MoonPhaseInfo
          moonPhase={moonPhase}
          currentTime={currentTime}
        />
      </footer>
    </div>
  );
}

export default App;
