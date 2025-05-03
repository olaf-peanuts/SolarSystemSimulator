import { CelestialConfig } from '@/types/CelestialConfig';

// Celestial = 天体（恒星・惑星・衛星）を抽象化した基底クラス
export class Celestial {
  public readonly config: CelestialConfig;
  public readonly parent?: Celestial;
  public readonly children: Celestial[] = [];

  private angle = 0; // 公転角（rad）
  private selfRotation = 0; // 自転角（rad）

  constructor(config: CelestialConfig, parent?: Celestial) {
    this.config = config;
    this.parent = parent;
  }

  // 毎フレーム呼び出され、角度を更新する
  update(deltaTime: number) {
    const { orbitSpeed = 0, rotationSpeed = 0 } = this.config;

    // 度/秒 → rad/frame に変換（deltaTimeは秒単位）
    this.angle += (orbitSpeed * Math.PI / 180) * deltaTime;
    this.selfRotation += (rotationSpeed * Math.PI / 180) * deltaTime;

    this.children.forEach(child => child.update(deltaTime));
  }

  // 親からの相対座標（実際の位置を計算）
  getPosition(): [number, number, number] {
    const orbitRadius = this.config.orbitRadius ?? 0;
    const angle = this.angle + (this.config.initialAngle ?? 0) * Math.PI / 180;

    const x = Math.cos(angle) * orbitRadius;
    const z = Math.sin(angle) * orbitRadius;
    const y = 0;

    if (this.parent) {
      const [px, py, pz] = this.parent.getPosition();
      return [px + x, py + y, pz + z];
    }

    return [x, y, z];
  }

  // 自転の回転角（THREE.jsでの `rotation` に使用）
  getRotation(): [number, number, number] {
    return [0, this.selfRotation, 0];
  }
}
