import { useEffect, useState } from 'react';
import { loadCelestials } from '@/utils/loadCelestials';
import { Celestial } from '@/models/Celestial';
import { CelestialMesh } from './CelestialMesh';

export function SolarSystem() {
  const [root, setRoot] = useState<Celestial | null>(null);

  useEffect(() => {
    loadCelestials().then(celestials => {
      const sun = celestials.get('Sun');
      if (sun) {
        setRoot(sun);
      } else {
        console.error('Sun not found in celestial map');
      }
    });
  }, []);

  return (
    <>
      {root && <CelestialMesh celestial={root} />}
    </>
  );
}
