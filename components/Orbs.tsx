'use client';
import { useEffect, useState } from 'react';

/**
 * Tiny glowing motes drifting over the deep panel — fireflies, not bokeh.
 * A small bright core plus a box-shadow halo reads as light; a large blurred
 * gradient just reads as a smudge, which is what this used to be.
 *
 * Drift lives on the element and glow on its ::before, because both would
 * otherwise fight over `transform` and only the last one would win.
 */
const COUNT = 13;

// deterministic pseudo-random: same on server and client, so no hydration gap
const rnd = (i: number, seed: number) => {
  const x = Math.sin(i * 12.9898 + seed) * 43758.5453;
  return x - Math.floor(x);
};

const ORBS = Array.from({ length: COUNT }, (_, i) => ({
  x: rnd(i, 1) * 96 + 2,            // %
  y: rnd(i, 2) * 92 + 4,            // %
  size: 2.5 + rnd(i, 3) * 5.5,      // px — small enough to read as a point
  drift: 16 + rnd(i, 4) * 24,       // s
  glow: 2.4 + rnd(i, 5) * 3.4,      // s
  dx: (rnd(i, 6) - 0.5) * 44,       // px of wander
  dy: -(10 + rnd(i, 7) * 40),
  delay: -rnd(i, 8) * 30,           // negative: already mid-drift on arrival
  gDelay: -rnd(i, 9) * 6,
  gold: rnd(i, 10) > 0.38,
}));

export default function Orbs() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    setOn(!matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  if (!on) return null;

  return (
    <>
      {ORBS.map((o, i) => (
        <i
          key={i}
          className={`orb ${o.gold ? 'orb-gold' : 'orb-sage'}`}
          aria-hidden="true"
          style={{
            left: `${o.x}%`,
            top: `${o.y}%`,
            width: `${o.size}px`,
            height: `${o.size}px`,
            animationDuration: `${o.drift}s`,
            animationDelay: `${o.delay}s`,
            ['--dx' as string]: `${o.dx}px`,
            ['--dy' as string]: `${o.dy}px`,
            ['--g' as string]: `${o.glow}s`,
            ['--gd' as string]: `${o.gDelay}s`,
          }}
        />
      ))}
    </>
  );
}
