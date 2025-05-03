import * as THREE from 'three'; 
import { useMemo } from 'react';
import { Line } from '@react-three/drei';

type OrbitCircleProps = {
  radius: number;          // 半径
  segments?: number;       // 分割数
  color?: string;          // 線の色
  positionRef?: React.RefObject<THREE.Mesh>; // 基準点 (例: 地球の位置に対する月の軌道)
};

// 公転軌道を描くコンポーネント
export function OrbitCircle({
  radius,
  segments = 64,
  color = 'white',
  positionRef,
}: OrbitCircleProps) {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * 2 * Math.PI;
      pts.push([radius * Math.cos(theta), 0, radius * Math.sin(theta)]);
    }
    return pts;
  }, [radius, segments]);

  return (
    <group position={positionRef?.current?.position}>
      <Line
        points={points}
        color={color}
        lineWidth={1}
        dashed={false}
      />
    </group>
  );
}
