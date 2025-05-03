// src/types/CelestialConfig.ts

export type CelestialConfig = {
  type: 'Star' | 'Planet' | 'Moon';
  name: string;
  radius: number;
  color?: string;
  textureUrl?: string;
  orbitRadius?: number;         // 軌道半径（親天体からの距離）
  orbitSpeed?: number;          // 周回速度（公転角速度：度/秒など）
  rotationSpeed?: number;       // 自転速度（自転角速度：度/秒など）
  initialAngle?: number;        // 初期位相角（公転開始角度）
  children?: CelestialConfig[]; // 子天体
};
