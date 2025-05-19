// filepath: src/models/Planet.ts

import { Planet as PlanetType } from '../types/celestialBody';
import { OrbitalElements } from '../utils/orbitCalculator';
import { CelestialBody } from './celestialBody';

/**
 * Planetクラス（惑星）
 * - CelestialBody（天体の基底クラス）を継承
 * - PlanetType（型定義）をimplementsして型安全に
 */
export class Planet extends CelestialBody implements PlanetType {
  /** 天体の種類は'planet'で固定 */
  type: 'planet';
  /** 軌道要素（公転に関するパラメータ） */
  orbitalElements: OrbitalElements;
  /** 大気の有無（省略可） */
  atmosphere?: boolean;
  /** 環の有無（省略可） */
  rings?: boolean;
  /** 軸の傾き（度） */
  axialTilt: number;

  /**
   * コンストラクタ
   * @param data - PlanetType型のデータ
   */
  constructor(data: PlanetType) {
    super(data);
    this.type = 'planet';
    this.orbitalElements = data.orbitalElements;
    this.atmosphere = data.atmosphere;
    this.rings = data.rings;
    this.axialTilt = data.axialTilt;
  }

  /**
   * 軌道長半径（semiMajorAxis）を取得
   * @returns 軌道長半径（単位は軌道要素の定義に依存）
   */
  getSemiMajorAxis(): number | undefined {
    return this.orbitalElements?.semiMajorAxis;
  }
}
