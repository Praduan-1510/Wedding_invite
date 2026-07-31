'use client';
import { useEffect, useRef, useState } from 'react';
import { invitation } from '@/lib/invitation';

const TARGET = new Date(invitation.startsAt).getTime();
const UNITS = [
  { key: 'd', label: 'Days' },
  { key: 'h', label: 'Hours' },
  { key: 'm', label: 'Minutes' },
  { key: 's', label: 'Seconds' },
] as const;

function remaining() {
  const left = Math.max(0, TARGET - Date.now());
  return {
    d: String(Math.floor(left / 864e5)),
    h: String(Math.floor(left / 36e5) % 24).padStart(2, '0'),
    m: String(Math.floor(left / 6e4) % 60).padStart(2, '0'),
    s: String(Math.floor(left / 1e3) % 60).padStart(2, '0'),
  };
}

export default function Countdown() {
  // rendered blank on the server: the value differs every second, and a
  // mismatch between server HTML and first client render is a hydration error
  const [t, setT] = useState<ReturnType<typeof remaining> | null>(null);
  const prev = useRef<Record<string, string>>({});

  useEffect(() => {
    setT(remaining());
    const id = setInterval(() => setT(remaining()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="clock" role="timer">
      {UNITS.map((u, i) => {
        const value = t ? t[u.key] : '—';
        // only the figure that actually changed is allowed to move
        const moved = t !== null && prev.current[u.key] !== undefined && prev.current[u.key] !== value;
        if (t) prev.current[u.key] = value;
        return (
          <div className="unit" key={u.key} style={{ display: 'contents' }}>
            {i > 0 && <span className="sep" aria-hidden="true">:</span>}
            <div className="unit">
              <span className={`num${moved ? ' tick' : ''}`} key={`${u.key}-${value}`}>{value}</span>
              <small>{u.label}</small>
            </div>
          </div>
        );
      })}
    </div>
  );
}
