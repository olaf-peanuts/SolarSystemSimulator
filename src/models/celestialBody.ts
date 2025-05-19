// filepath: src/models/CelestialBody.ts

import { CelestialBodyBase, CelestialBodyType } from '../types/celestialBody';

/**
 * CelestialBodyクラス（天体の基底クラス）
 * - 恒星・惑星・衛星など、すべての天体の共通プロパティと基本的な振る舞いを定義
 */
export class CelestialBody implements CelestialBodyBase {
  /** 天体の一意なID */
  id!: string;
  /** 天体名 */
  name!: string;
  /** 天体の種類（'star' | 'planet' | 'moon' など） */
  type!: CelestialBodyType;
  /** 実際の半径（km単位） */
  radius!: number;
  /** 表示用のスケーリングされた半径 */
  displayRadius!: number;
  /** 天体の色（16進カラーコードなど） */
  color!: string;
  /** テクスチャ画像のパス（省略可） */
  texture?: string;
  /** 自転周期（時間単位、例：秒や日） */
  rotationPeriod!: number;
  /** 親天体のID（太陽の場合はundefined） */
  parentId?: string;

  /**
   * コンストラクタ
   * @param data - CelestialBodyBase型のデータ
   */
  constructor(data: CelestialBodyBase) {
    Object.assign(this, data);
  }

  /**
   * 自転角速度（ラジアン/周期単位）を計算して返す
   * @returns 自転角速度（ラジアン/時間）
   */
  getRotationSpeed(): number {
    return this.rotationPeriod > 0 ? (2 * Math.PI) / this.rotationPeriod : 0;
  }
}