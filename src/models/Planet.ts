import { Celestial } from './Celestial';
import { CelestialConfig } from '@/types/CelestialConfig';

// 惑星（公転あり）
export class Planet extends Celestial {
  constructor(config: CelestialConfig, parent?: Celestial) {
    super(config, parent);
  }
}