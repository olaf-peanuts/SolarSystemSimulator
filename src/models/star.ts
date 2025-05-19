// filepath: src/models/Star.ts

import { Star as StarType } from '../types/celestialBody';
import { CelestialBody } from './celestialBody';

/**
 * Starクラス（恒星）
 * - CelestialBody（天体の基底クラス）を継承
 * - StarType（型定義）をimplementsして型安全に
 */
export class Star extends CelestialBody implements StarType {
  /** 天体の種類は'star'で固定 */
  type: 'star';
  /** 太陽光度を1とした相対値 */
  luminosity: number;
  /** 表面温度（K） */
  temperature: number;
  /** 分光型（例：G2V） */
  spectralType: string;

  /**
   * コンストラクタ
   * @param data - StarType型のデータ
   */
  constructor(data: StarType) {
    super(data);
    this.type = 'star';
    this.luminosity = data.luminosity;
    this.temperature = data.temperature;
    this.spectralType = data.spectralType;
  }

  /**
   * 恒星の明るさ（光度）を返す
   * @returns 光度（太陽光度=1基準）
   */
  getLuminosity(): number {
    return this.luminosity;
  }
}
