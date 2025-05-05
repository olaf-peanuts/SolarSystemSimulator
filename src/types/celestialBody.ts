// src/types/celestialBody.ts
import { OrbitalElements } from '../utils/orbitCalculator';

export type CelestialBodyType = 'star' | 'planet' | 'moon' | 'dwarf' | 'asteroid' | 'comet';

export interface CelestialBodyBase {
  id: string;
  name: string;
  type: CelestialBodyType;
  radius: number;          // km単位の実際の半径
  displayRadius: number;   // 表示用のスケーリングされた半径
  color: string;
  texture?: string;        // テクスチャ画像のパス
  rotationPeriod: number;  // 自転周期（時間）
  parentId?: string;       // 親天体のID（太陽の場合はundefined）
}

export interface Star extends CelestialBodyBase {
  type: 'star';
  luminosity: number;      // 太陽光度を1とした相対値
  temperature: number;     // 表面温度（K）
  spectralType: string;    // 分光型（例：G2V）
}

export interface Planet extends CelestialBodyBase {
  type: 'planet';
  orbitalElements: OrbitalElements;  // 軌道要素
  atmosphere?: boolean;    // 大気の有無
  rings?: boolean;         // 環の有無
  axialTilt: number;       // 軸の傾き（度）
}

export interface Moon extends CelestialBodyBase {
  type: 'moon';
  orbitalElements: OrbitalElements;  // 軌道要素（親天体中心）
  axialTilt: number;       // 軸の傾き（度）
  synchronousRotation: boolean; // 同期回転（潮汐ロック）するかどうか
}

export type CelestialBody = Star | Planet | Moon;

// 設定ファイル全体の型
export interface CelestialConfig {
  version: string;
  bodies: CelestialBody[];
  defaultView: {
    cameraPosition: [number, number, number];
    target: string; // 視点の中心となる天体のID
  };
  timeSettings: {
    defaultTimeScale: number;
    startDate?: string; // ISO 8601形式の日付文字列
  };
}
