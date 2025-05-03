import { TimeScaleControl } from './TimeScaleControl';

type SettingsPanelProps = {
  timeScale: number;
  onTimeScaleChange: (timeScale: number) => void;
};

export function SettingsPanel({ timeScale, onTimeScaleChange }: SettingsPanelProps) {
  return (
    <div className="settings-panel">
      <h3>Simulation Settings</h3>
      <TimeScaleControl timeScale={timeScale} onChange={onTimeScaleChange} />
      {/* 今後：カメラ速度、表示切替など */}
    </div>
  );
}
