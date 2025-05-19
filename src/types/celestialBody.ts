// src/types/celestialBody.ts
import { OrbitalElements } from '../utils/orbitCalculator';

/**
 * 天体の種類を表す型
 * - 'star': 恒星
 * - 'planet': 惑星
 * - 'moon': 衛星
 * - 'dwarf': 準惑星
 * - 'asteroid': 小惑星
 * - 'comet': 彗星
 */
export type CelestialBodyType = 'star' | 'planet' | 'moon' | 'dwarf' | 'asteroid' | 'comet';

// CelestialBodyの型名について
/*
- **CelestialBody（天体）**  
  「天体」という意味で、天文学や科学の分野でよく使われる表現です。  
  例：星、惑星、衛星、小惑星など、宇宙に存在する物体全般

- **Celestial（天の、天空の）**  
  形容詞として「天の」「天空の」という意味ですが、  
  **名詞としても「天体」という意味で使われることがあります。**  
  ただし、英語圏の技術文書や天文学では「CelestialBody」の方がより明確です。

#### TypeScriptの型名として

- **CelestialBody**  
  → 「天体」という意味が明確で、他の開発者にも直感的に伝わります。
- **Celestial**  
  → 少し抽象的ですが、プロジェクト内で「天体」を表す型として使うなら問題ありません。


  #### OSSや英語圏の慣例

  - 多くの天文学系ライブラリやAPIでは「CelestialBody」が一般的です。
  - ただし、**プロジェクト内で意味が明確なら「Celestial」でも問題ありません。**
*/  

/**
 * すべての天体が共通して持つ基本情報
 */
export interface CelestialBodyBase {
  /** 天体の一意なID */
  id: string;
  /** 天体名 */
  name: string;
  /** 天体の種類 */
  type: CelestialBodyType;
  /** 実際の半径（km単位） */
  radius: number;
  /** 表示用のスケーリングされた半径 */
  displayRadius: number;
  /** 天体の色（16進カラーコードなど） */
  color: string;
  /** テクスチャ画像のパス（省略可） */
  texture?: string;
  /** 自転周期（時間単位、例：秒や日） */
  rotationPeriod: number;
  /** 親天体のID（太陽の場合はundefined） */
  parentId?: string;
}

/**
 * 恒星（Star）の型定義
 */
export interface Star extends CelestialBodyBase {
  type: 'star';
  /** 太陽光度を1とした相対値 */
  luminosity: number;
  /** 表面温度（K） */
  temperature: number;
  /** 分光型（例：G2V） */
  spectralType: string;
}

/**
 * 惑星（Planet）の型定義
 */
export interface Planet extends CelestialBodyBase {
  type: 'planet';
  /** 軌道要素（公転に関するパラメータ） */
  orbitalElements: OrbitalElements;
  /** 大気の有無（省略可） */
  atmosphere?: boolean;
  /** 環の有無（省略可） */
  rings?: boolean;
  /** 軸の傾き（度） */
  axialTilt: number;
}

/**
 * 衛星（Moon）の型定義
 */
export interface Moon extends CelestialBodyBase {
  type: 'moon';
  /** 軌道要素（親天体中心） */
  orbitalElements: OrbitalElements;
  /** 軸の傾き（度） */
  axialTilt: number;
  /** 同期回転（潮汐ロック）するかどうか */
  synchronousRotation: boolean;
}

/**
 * 天体（CelestialBody）のユニオン型
 */
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
