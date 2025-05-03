import { CelestialConfig } from '@/types/CelestialConfig';
import { Celestial } from '@/models/Celestial';
import { Star } from '@/models/Star';
import { Planet } from '@/models/Planet';
import { Moon } from '@/models/Moon';

/**
 * JSONファイルから天体構成を読み込み、CelestialのMapを構築する
 */
export async function loadCelestials(): Promise<Map<string, Celestial>> {
  const response = await fetch('/configs/celestials.json');
  const rootConfig: CelestialConfig = await response.json();

  const celestialMap = new Map<string, Celestial>();

  function build(config: CelestialConfig, parent?: Celestial): Celestial {
    let instance: Celestial;

    switch (config.type) {
      case 'Star':
        instance = new Star(config, parent);
        break;
      case 'Planet':
        instance = new Planet(config, parent);
        break;
      case 'Moon':
        instance = new Moon(config, parent);
        break;
      default:
        throw new Error(`Unknown celestial type: ${config.type}`);
    }

    celestialMap.set(config.name, instance);

    config.children?.forEach(childConfig => {
      const child = build(childConfig, instance);
      instance.children.push(child); // 親のchildrenに登録
    });

    return instance;
  }

  build(rootConfig); // 最上位から構築

  return celestialMap;
}
