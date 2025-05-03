// src/hooks/useSunLightDirection.ts
export function useSunLightDirection(earthPosition: [number, number, number]) {
  const [x, y, z] = earthPosition;
  const length = Math.sqrt(x * x + y * y + z * z);
  return [-x / length, -y / length, -z / length] as [number, number, number];
}
