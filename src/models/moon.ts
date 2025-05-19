// filepath: src/models/moon.ts

// MoonType型（interface）は天体の型定義ファイルからインポート
import { Moon as MoonType } from '../types/celestialBody';
// 軌道要素の型もインポート
import { OrbitalElements } from '../utils/orbitCalculator';
// CelestialBodyクラス（天体の基底クラス）をインポート
import { CelestialBody } from './celestialBody';

/**
 * Moonクラス（衛星）
 * - CelestialBody（天体の基底クラス）を継承
 * - MoonType（型定義）をimplementsして型安全に
 */
export class Moon extends CelestialBody implements MoonType {
  // typeプロパティは'moon'というリテラル型で固定
  type: 'moon';
  // 軌道要素（親天体の周りを回るためのパラメータ）
  orbitalElements: OrbitalElements;
  // 軸の傾き（度）
  axialTilt: number;
  // 同期回転（潮汐ロック）しているかどうか
  synchronousRotation: boolean;

  /**
   * コンストラクタ
   * @param data - MoonType型のデータ（interfaceで定義された全プロパティを持つオブジェクト）
   */
  constructor(data: MoonType) {
    // 親クラス（CelestialBody）のコンストラクタを呼び出し、共通プロパティを初期化
    super(data);
    // Moon固有のプロパティを初期化
    this.type = 'moon';
    this.orbitalElements = data.orbitalElements;
    this.axialTilt = data.axialTilt;
    this.synchronousRotation = data.synchronousRotation;
  }

  /**
   * この衛星が同期回転（潮汐ロック）しているかどうかを返す
   * @returns trueなら同期回転している
   */
  isSynchronous(): boolean {
    return this.synchronousRotation;
  }
}
