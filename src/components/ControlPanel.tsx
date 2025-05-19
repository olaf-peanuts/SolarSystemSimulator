// filepath: src/components/ControlPanel.tsx

import React from 'react';
import styles from './ControlPanel.module.css';

/**
 * コントロールパネル（メニューUI）コンポーネント
 * - 時刻表示・時刻操作・視点切替・視野角・緯度経度入力などを担当
 */
interface ControlPanelProps {
  viewMode: 'system' | 'earth' | 'custom';
  setViewMode: (mode: 'system' | 'earth' | 'custom') => void;
  fov: number;
  setFov: (fov: number) => void;
  latitude: number;
  setLatitude: (lat: number) => void;
  longitude: number;
  setLongitude: (lng: number) => void;
  timeScale: number;
  setTimeScale: (scale: number) => void;
  currentTime: Date;
  setCurrentTime: (date: Date) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  viewMode, setViewMode, fov, setFov,
  latitude, setLatitude, longitude, setLongitude,
  timeScale, setTimeScale, currentTime
}) => {
  return (
    <div className={styles['control-panel']}>
      <div className={styles['control-panel__section']}>
        <span className={styles['control-panel__label']}>現在時刻:</span>
        <span className={styles['control-panel__value']}>{currentTime.toLocaleString()}</span>
      </div>
      <div className={styles['control-panel__section']}>
        <button className={styles['control-panel__button']} onClick={() => setViewMode('system')}>太陽系全体</button>
        <button className={styles['control-panel__button']} onClick={() => setViewMode('earth')}>地球視点</button>
        <button className={styles['control-panel__button']} onClick={() => setViewMode('custom')}>カスタム視点</button>
      </div>
      <div className={styles['control-panel__section']}>
        <label>
          視野角:
          <input
            type="range"
            min="30"
            max="180"
            value={fov}
            onChange={e => setFov(Number(e.target.value))}
            className={styles['control-panel__slider']}
          />
          <span>{fov}°</span>
        </label>
      </div>
      {viewMode === 'earth' && (
        <div className={styles['control-panel__section']}>
          <label>
            緯度:
            <input
              type="number"
              min="-90"
              max="90"
              value={latitude}
              onChange={e => setLatitude(Number(e.target.value))}
              className={styles['control-panel__input']}
            />
          </label>
          <label>
            経度:
            <input
              type="number"
              min="-180"
              max="180"
              value={longitude}
              onChange={e => setLongitude(Number(e.target.value))}
              className={styles['control-panel__input']}
            />
          </label>
        </div>
      )}
      <div className={styles['control-panel__section']}>
        <label>
          時間スケール:
          <input
            type="range"
            min="1"
            max="10000"
            value={timeScale}
            onChange={e => setTimeScale(Number(e.target.value))}
            className={styles['control-panel__slider']}
          />
          <span>x{timeScale.toLocaleString()}</span>
        </label>
      </div>
    </div>
  );
};

export default ControlPanel;
