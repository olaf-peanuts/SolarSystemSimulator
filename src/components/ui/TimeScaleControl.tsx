// src/components/controls/TimeScaleControl.tsx
import styles from './TimeScaleControl.module.css';

type TimeScaleControlProps = {
  timeScale: number;
  onChange: (timeScale: number) => void;
};

const OPTIONS = [0.1, 1, 10, 100];

export function TimeScaleControl({ timeScale, onChange }: TimeScaleControlProps) {
  return (
    <div className={styles['time-scale-control']}>
      <div className={styles['time-scale-control__label']}>
        <label>
          <input
            type="radio"
            name="timeScale"
            value={1}
            checked={timeScale === 1}
            onChange={() => onChange(1)}
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
            onChange={() => onChange(60)}
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
            onChange={() => onChange(3600)}
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
            onChange={() => onChange(86400)}
          />
          1秒=1日
        </label>
      </div>

      
      
      
      
      
      {/*
      <span className={styles['time-scale-control__label']}>Time Scale:</span>
      <div className={styles['time-scale-control__options']}>
        {OPTIONS.map((option) => (
          <label
            key={option}
            className={`${styles['time-scale-control__option']} ${
              value === option ? styles['time-scale-control__option--selected'] : ''
            }`}
          >
            <input
              type="radio"
              name="timeScale"
              className={styles['time-scale-control__input']}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
            />
            {option}x
          </label>
        ))}
      </div>
      */}
    </div>
  );
}
