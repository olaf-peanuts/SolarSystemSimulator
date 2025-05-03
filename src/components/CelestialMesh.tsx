import * as THREE from 'three';
import { TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber';
import { Celestial } from '@/models/Celestial';

type Props = {
  celestial: Celestial;
  position?: [number, number, number]; // 親からの相対位置
};

export function CelestialMesh({ celestial, position = [0, 0, 0] }: Props) {
  const { config } = celestial;

  const texture = config.textureUrl
    ? useLoader(TextureLoader, config.textureUrl)
    : null;

  if (texture) {
    texture.colorSpace = THREE.SRGBColorSpace;
  }

  const isStar = config.type === 'Star';

  return (
    <group position={position} rotation={celestial.getRotation()}>
      <mesh>
        <sphereGeometry args={[config.radius / 10000, 64, 64]} />
        <meshStandardMaterial
          map={texture || undefined}
          color={texture ? undefined : config.color}
          emissive={isStar ? config.color : 'black'}
          emissiveIntensity={isStar ? 0.3 : 0}
          toneMapped={!isStar}
          metalness={0}
          roughness={1}
        />
      </mesh>

      {/* 子天体を再帰的に描画 */}
      {celestial.children.map(child => (
        <CelestialMesh
          key={child.config.name}
          celestial={child}
          position={child.getPosition()}
        />
      ))}
    </group>
  );
}
