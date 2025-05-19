// filepath: src/components/MoonPhaseInfo.tsx

import React from 'react';
import styles from './MoonPhaseInfo.module.css';

/**
 * 月齢情報表示コンポーネント
 * - 月の満ち欠けや現在時刻などを表示
 */
interface MoonPhaseInfoProps {
  moonPhase: number; // 0=新月, 0.5=満月, 1=新月
  currentTime: Date;
}

const MoonPhaseInfo: React.FC<MoonPhaseInfoProps> = ({ moonPhase, currentTime }) => {
  /**
   * 月相の説明を返す
   * @returns {string}
   */
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
    <div className={styles['moon-phase-info']}>
      <h3 className={styles['moon-phase-info__title']}>月齢情報</h3>
      <div className={styles['moon-phase-info__display']}>
        <div 
          className={styles['moon-phase-info__image']}
          style={{ 
            backgroundColor: '#333',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* 月の満ち欠けを表現するための要素（簡易版）
            - **月の満ち欠けの可視化部分は、`moonPhase`の値によって動的にスタイル（位置や形状）が変化するためです。**
            - CSS Modulesでは、クラス名ごとに静的なスタイルしか定義できません。
            - しかし、月の影の位置や形状は`moonPhase`の値によって毎回変わるため、  
              `style={{ ... }}` のように**インラインスタイルで動的に指定**しています。
          */}
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
        <div className={styles['moon-phase-info__desc']}>
          <p>月相: {(moonPhase * 100).toFixed(1)}%</p>
          <p>{phaseDescription()}</p>
          <p>現在時刻: {currentTime.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default MoonPhaseInfo;
