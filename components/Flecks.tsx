'use client';
import { useEffect, useState } from 'react';

/** Gold flecks drifting across the deep panel — the V4 speckle, set loose. */
export default function Flecks() {
  const [on, setOn] = useState(false);

  // client-only, and skipped entirely when the visitor asks for less motion
  useEffect(() => {
    setOn(!matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  if (!on) return null;

  return (
    <>
      <style>{`@keyframes drift{from{transform:translate(0,0);opacity:.16}50%{opacity:.55}to{transform:translate(15px,-32px);opacity:.2}}`}</style>
      {Array.from({ length: 7 }, (_, i) => (
        <i
          key={i}
          className="fleck"
          aria-hidden="true"
          style={{
            width: 2 + (i % 3), height: 2 + (i % 3),
            left: `${7 + i * 13}%`, top: `${16 + (i * 17) % 62}%`,
            animation: `drift ${25 + i * 4}s ease-in-out ${i * 2}s infinite alternate`,
          }}
        />
      ))}
    </>
  );
}
