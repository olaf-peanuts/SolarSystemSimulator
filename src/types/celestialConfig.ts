// filepath: src/types/CelestialConfig.ts

/**
 * 天体シミュレーターの設定ファイル用型
 * - 階層構造で天体（恒星・惑星・衛星）を表現
 */
export type CelestialConfig = {
  /** 天体の種類（'Star' | 'Planet' | 'Moon'） */
  type: 'Star' | 'Planet' | 'Moon';
  /** 天体名 */
  name: string;
  /** 半径 */
  radius: number;
  /** 天体の色（省略可） */
  color?: string;
  /** テクスチャ画像のURL（省略可） */
  textureUrl?: string;
  /** 軌道半径（親天体からの距離、単位は任意） */
  orbitRadius?: number;
  /** 周回速度（公転角速度：度/秒など、単位は任意） */
  orbitSpeed?: number;
  /** 自転速度（自転角速度：度/秒など、単位は任意） */
  rotationSpeed?: number;
  /** 初期位相角（公転開始角度、単位は度など） */
  initialAngle?: number;
  /** 子天体（衛星や惑星など） */
  children?: CelestialConfig[];
};
