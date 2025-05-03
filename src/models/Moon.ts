import { Celestial } from './Celestial';
import { CelestialConfig } from '@/types/CelestialConfig';

// 衛星（惑星の周りを公転）
export class Moon extends Celestial {
  constructor(config: CelestialConfig, parent?: Celestial) {
    super(config, parent);
  }
}
