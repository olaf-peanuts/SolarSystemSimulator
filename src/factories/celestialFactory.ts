// celestialFactory.ts
import { Celestial } from "@/models/Celestial";
import { Star } from "@/models/Star";
import { Planet } from "@/models/Planet";
import { Moon } from "@/models/Moon";
import { CelestialConfig } from "@/configs/celestialSchemas";
import { applyCelestialDefaults } from "@/configs/celestialSchemas";

type NestedCelestialConfig = CelestialConfig & {
  children?: NestedCelestialConfig[];
};

/**
 * 再帰的に Celestial インスタンスを生成する
 */
export function createCelestialsFromConfig(
  config: NestedCelestialConfig,
  parent?: Celestial
): Celestial {
  const fullConfig = applyCelestialDefaults(config);

  let celestial: Celestial;

  switch (fullConfig.type) {
    case "Star":
      celestial = new Star(fullConfig.name, fullConfig.radius, fullConfig.color, fullConfig.textureUrl);
      break;
    case "Planet":
      if (!parent) throw new Error(`Planet "${fullConfig.name}" requires a parent (e.g., Sun)`);
      celestial = new Planet(
        fullConfig.name,
        fullConfig.radius,
        fullConfig.orbitRadius,
        fullConfig.orbitSpeed,
        fullConfig.rotationSpeed!,
        parent,
        fullConfig.color,
        fullConfig.textureUrl,
        fullConfig.tilt
      );
      break;
    case "Moon":
      if (!parent || !(parent instanceof Planet)) {
        throw new Error(`Moon "${fullConfig.name}" requires a Planet as parent`);
      }
      celestial = new Moon(
        fullConfig.name,
        fullConfig.radius,
        fullConfig.orbitRadius,
        fullConfig.orbitSpeed,
        fullConfig.rotationSpeed!,
        parent,
        fullConfig.color,
        fullConfig.textureUrl,
        fullConfig.tilt
      );
      break;
    default:
      throw new Error(`Unknown celestial type: ${(fullConfig as any).type}`);
  }

  // 子要素を再帰的に処理
  if (config.children && config.children.length > 0) {
    for (const child of config.children) {
      createCelestialsFromConfig(child, celestial);
    }
  }

  return celestial;
}
