import { Celestial } from './celestial';
import { CelestialConfig } from '@/types/CelestialConfig';

// 恒星（光る）
export class Star extends Celestial {
  constructor(config: CelestialConfig, parent?: Celestial) {
    super(config, parent);
  }
}