import { Star as StarType, Planet as PlanetType, Moon as MoonType } from '../types/celestialBody';
import { CelestialBody as CelestialBodyClass } from '../models/celestialBody';
import { Star } from '../models/star';
import { Planet } from '../models/planet';
import { Moon } from '../models/moon';
import { OrbitalElements } from '../utils/orbitCalculator';

/**
 * celestials.json から天体データを読み込み、型安全に各天体クラスへ変換してMapとして返す
 * - orbitalElements.epoch（軌道要素）はDate型へ変換
 * - Star, Planet, Moonクラスのインスタンスを生成
 * @returns 天体IDをキー、CelestialBodyインスタンスを値とするMap
 */
export async function loadCelestials(): Promise<Map<string, CelestialBodyClass>> {
  // JSONファイルを取得
  const response = await fetch('/configs/celestials.json');
  const json = await response.json();

  // 天体IDをキー、CelestialBodyインスタンスを値とするMap
  const celestialMap = new Map<string, CelestialBodyClass>();

  /**
   * orbitalElements.epoch を Date 型に変換し、OrbitalElements型として返す
   */
  function parseOrbitalElements(oeRaw: unknown): OrbitalElements {
    const oe = oeRaw as Record<string, unknown>;
    return {
      semiMajorAxis: oe.semiMajorAxis as number,
      eccentricity: oe.eccentricity as number,
      inclination: oe.inclination as number,
      longitudeOfAscendingNode: oe.longitudeOfAscendingNode as number,
      argumentOfPerihelion: oe.argumentOfPerihelion as number,
      meanAnomaly: oe.meanAnomaly as number,
      epoch: typeof oe.epoch === 'string' ? new Date(oe.epoch) : (oe.epoch as Date),
    };
  }

  // bodies配列をループし、各天体を型安全にインスタンス化
  for (const bodyRaw of json.bodies as Array<Record<string, unknown>>) {
    const type = bodyRaw.type as string;
    let instance: CelestialBodyClass;
    if (type === 'star') {
      const body: StarType = {
        id: bodyRaw.id as string,
        name: bodyRaw.name as string,
        type: 'star',
        radius: bodyRaw.radius as number,
        displayRadius: bodyRaw.displayRadius as number,
        color: bodyRaw.color as string,
        texture: bodyRaw.texture as string | undefined,
        rotationPeriod: bodyRaw.rotationPeriod as number,
        parentId: bodyRaw.parentId as string | undefined,
        luminosity: bodyRaw.luminosity as number,
        temperature: bodyRaw.temperature as number,
        spectralType: bodyRaw.spectralType as string,
      };
      instance = new Star(body);
    } else if (type === 'planet') {
      const body: PlanetType = {
        id: bodyRaw.id as string,
        name: bodyRaw.name as string,
        type: 'planet',
        radius: bodyRaw.radius as number,
        displayRadius: bodyRaw.displayRadius as number,
        color: bodyRaw.color as string,
        texture: bodyRaw.texture as string | undefined,
        rotationPeriod: bodyRaw.rotationPeriod as number,
        parentId: bodyRaw.parentId as string | undefined,
        orbitalElements: parseOrbitalElements(bodyRaw.orbitalElements),
        atmosphere: bodyRaw.atmosphere as boolean | undefined,
        rings: bodyRaw.rings as boolean | undefined,
        axialTilt: bodyRaw.axialTilt as number,
      };
      instance = new Planet(body);
    } else if (type === 'moon') {
      const body: MoonType = {
        id: bodyRaw.id as string,
        name: bodyRaw.name as string,
        type: 'moon',
        radius: bodyRaw.radius as number,
        displayRadius: bodyRaw.displayRadius as number,
        color: bodyRaw.color as string,
        texture: bodyRaw.texture as string | undefined,
        rotationPeriod: bodyRaw.rotationPeriod as number,
        parentId: bodyRaw.parentId as string | undefined,
        orbitalElements: parseOrbitalElements(bodyRaw.orbitalElements),
        axialTilt: bodyRaw.axialTilt as number,
        synchronousRotation: bodyRaw.synchronousRotation as boolean,
      };
      instance = new Moon(body);
    } else {
      throw new Error(`Unknown celestial type: ${type}`);
    }
    celestialMap.set(bodyRaw.id as string, instance);
  }

  return celestialMap;
}
