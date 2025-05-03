import { Celestial } from './Celestial';
import { CelestialConfig } from '@/types/CelestialConfig';

// 恒星（光る）
export class Star extends Celestial {
  constructor(config: CelestialConfig, parent?: Celestial) {
    super(config, parent);
  }
}