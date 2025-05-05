// src/utils/OrbitCalculator.ts
import * as THREE from 'three';
import { CelestialBodyType } from '../types/celestialBody';

// ケプラーの法則に基づいた軌道計算
export interface OrbitalElements {
  // 軌道要素
  semiMajorAxis: number;    // 長半径 (AU)
  eccentricity: number;     // 離心率
  inclination: number;      // 軌道傾斜角 (度)
  longitudeOfAscendingNode: number; // 昇交点黄経 (度)
  argumentOfPerihelion: number;     // 近日点引数 (度)
  meanAnomaly: number;      // 平均近点角 (度)
  epoch: Date;              // 元期
}

// 地球の軌道要素 (J2000.0)
export const EARTH_ORBITAL_ELEMENTS: OrbitalElements = {
  semiMajorAxis: 1.00000011, // AU
  eccentricity: 0.01671022,
  inclination: 0.00005,
  longitudeOfAscendingNode: -11.26064,
  argumentOfPerihelion: 102.94719,
  meanAnomaly: 100.46435,
  epoch: new Date('2000-01-01T12:00:00Z') // J2000.0
};

// 月の軌道要素 (J2000.0, 地球中心)
export const MOON_ORBITAL_ELEMENTS: OrbitalElements = {
  semiMajorAxis: 0.00257, // AU (約384,400 km)
  eccentricity: 0.0549,
  inclination: 5.145,
  longitudeOfAscendingNode: 125.08,
  argumentOfPerihelion: 318.0634,
  meanAnomaly: 115.3654,
  epoch: new Date('2000-01-01T12:00:00Z') // J2000.0
};

// 天体の位置を計算
export function calculateCelestialPosition(
  orbitalElements: OrbitalElements,
  currentTime: Date,
  parentPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0)
): THREE.Vector3 {
  // 現在時刻と元期の時間差（日数）
  const daysSinceEpoch = (currentTime.getTime() - orbitalElements.epoch.getTime()) / (1000 * 60 * 60 * 24);
  
  // 平均運動（1日あたりの角度変化、度）
  // ケプラーの第3法則: n^2 * a^3 = GM, ここでは簡略化
  const meanMotion = 0.9856076686 / Math.pow(orbitalElements.semiMajorAxis, 1.5);
  
  // 現在の平均近点角（度）
  let meanAnomaly = orbitalElements.meanAnomaly + (meanMotion * daysSinceEpoch);
  meanAnomaly = meanAnomaly % 360;
  if (meanAnomaly < 0) meanAnomaly += 360;
  
  // 度からラジアンへ変換
  const meanAnomalyRad = meanAnomaly * Math.PI / 180;
  
  // 離心近点角を計算（ケプラー方程式を解く）
  const eccentricAnomaly = solveKepler(meanAnomalyRad, orbitalElements.eccentricity);
  
  // 真近点角を計算
  const trueAnomalyRad = 2 * Math.atan2(
    Math.sqrt(1 + orbitalElements.eccentricity) * Math.sin(eccentricAnomaly / 2),
    Math.sqrt(1 - orbitalElements.eccentricity) * Math.cos(eccentricAnomaly / 2)
  );
  
  // 軌道面上での距離
  const distance = orbitalElements.semiMajorAxis * (1 - orbitalElements.eccentricity * Math.cos(eccentricAnomaly));
  
  // 軌道面座標系での位置（x-y平面）
  const xOrbit = distance * Math.cos(trueAnomalyRad);
  const yOrbit = distance * Math.sin(trueAnomalyRad);
  
  // 軌道面から黄道面への変換
  // 3D回転行列を使用して正確に計算する必要がありますが、簡略化のため基本実装を示します
  const inclinationRad = orbitalElements.inclination * Math.PI / 180;
  const ascNodeRad = orbitalElements.longitudeOfAscendingNode * Math.PI / 180;
  const argPeriRad = orbitalElements.argumentOfPerihelion * Math.PI / 180;
  
  // 回転行列の適用（簡略化版）
  const xEcliptic = (Math.cos(ascNodeRad) * Math.cos(argPeriRad + trueAnomalyRad) - 
                    Math.sin(ascNodeRad) * Math.sin(argPeriRad + trueAnomalyRad) * Math.cos(inclinationRad)) * distance;
  
  const yEcliptic = (Math.sin(ascNodeRad) * Math.cos(argPeriRad + trueAnomalyRad) + 
                    Math.cos(ascNodeRad) * Math.sin(argPeriRad + trueAnomalyRad) * Math.cos(inclinationRad)) * distance;
  
  const zEcliptic = Math.sin(argPeriRad + trueAnomalyRad) * Math.sin(inclinationRad) * distance;
  
  // AU単位からThree.js用のスケールに変換（このスケール値は調整が必要）
  const scaleAU = 10; // 1AU = 10単位（表示用）
  
  // 親天体からの相対位置を計算
  return new THREE.Vector3(
    parentPosition.x + xEcliptic * scaleAU,
    parentPosition.y + zEcliptic * scaleAU, // Three.jsでは通常、y軸が上向き
    parentPosition.z + yEcliptic * scaleAU
  );
}

// ケプラー方程式を解く（数値解法：ニュートン法）
function solveKepler(meanAnomalyRad: number, eccentricity: number): number {
  // 初期値として平均近点角を使用
  let eccentricAnomaly = meanAnomalyRad;
  
  // 反復回数
  const maxIterations = 10;
  // 許容誤差
  const tolerance = 1e-8;
  
  for (let i = 0; i < maxIterations; i++) {
    // ケプラー方程式: E - e * sin(E) = M
    const delta = eccentricAnomaly - eccentricity * Math.sin(eccentricAnomaly) - meanAnomalyRad;
    
    // 収束判定
    if (Math.abs(delta) < tolerance) {
      break;
    }
    
    // ニュートン法による更新
    eccentricAnomaly = eccentricAnomaly - delta / (1 - eccentricity * Math.cos(eccentricAnomaly));
  }
  
  return eccentricAnomaly;
}

// 軌道を描画するための点列を生成
export function generateOrbitPoints(
  orbitalElements: OrbitalElements,
  segments: number = 100
): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  
  for (let i = 0; i <= segments; i++) {
    // 0から2πまでの角度を均等に分割
    const angle = (i / segments) * 2 * Math.PI;
    
    // 離心率を考慮した軌道上の点を計算
    const radius = orbitalElements.semiMajorAxis * (1 - Math.pow(orbitalElements.eccentricity, 2)) / 
                  (1 + orbitalElements.eccentricity * Math.cos(angle));
    
    // 軌道面上での座標
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    
    // 軌道傾斜を適用（簡略化）
    const inclinationRad = orbitalElements.inclination * Math.PI / 180;
    const z = y * Math.sin(inclinationRad);
    const y2 = y * Math.cos(inclinationRad);
    
    // スケーリング
    const scaleAU = 10;
    points.push(new THREE.Vector3(x * scaleAU, z * scaleAU, y2 * scaleAU));
  }
  
  return points;
}

// 月の満ち欠けのフェーズを計算（0-1の値、0=新月、0.5=満月）
export function calculateMoonPhase(
  moonPosition: THREE.Vector3,
  earthPosition: THREE.Vector3,
  sunPosition: THREE.Vector3
): number {
  // 地球から月へのベクトル
  const earthToMoon = new THREE.Vector3().subVectors(moonPosition, earthPosition).normalize();
  
  // 地球から太陽へのベクトル
  const earthToSun = new THREE.Vector3().subVectors(sunPosition, earthPosition).normalize();
  
  // 内積を計算（-1から1の範囲）
  const dotProduct = earthToMoon.dot(earthToSun);
  
  // -1から1の範囲を0から1の範囲に変換
  // 0 = 新月、0.5 = 満月、1 = 新月（次の周期）
  const phase = (1 - dotProduct) / 2;
  
  return phase;
}
