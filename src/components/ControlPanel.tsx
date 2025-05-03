import React from 'react';
import styles from './ControlPanel.module.css'; // 必要に応じてスタイルを適用

type Props = {
  timeScale: number; // 現在の時間倍率
  setTimeScale: (value: number) => void; // 時間倍率を更新する関数
};

const ControlPanel: React.FC<Props> = ({ timeScale, setTimeScale }) => {
  return (
    <div className={styles['control-panel']}>
      <label>
        <input
          type="radio"
          name="timeScale"
          value={1}
          checked={timeScale === 1}
          onChange={() => setTimeScale(1)}
        />
        1秒=1秒
      </label>
      <br />
      <label>
        <input
          type="radio"
          name="timeScale"
          value={60}
          checked={timeScale === 60}
          onChange={() => setTimeScale(60)}
        />
        1秒=1分
      </label>
      <br />
      <label>
        <input
          type="radio"
          name="timeScale"
          value={3600}
          checked={timeScale === 3600}
          onChange={() => setTimeScale(3600)}
        />
        1秒=1時間
      </label>
      <br />
      <label>
        <input
          type="radio"
          name="timeScale"
          value={86400}
          checked={timeScale === 86400}
          onChange={() => setTimeScale(86400)}
        />
        1秒=1日
      </label>
    </div>
  );
};

export default ControlPanel;
