'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { invitation } from '@/lib/invitation';
import s from './CdPlayer.module.css';

const { title, artist, src, fallback, volume } = invitation.music;

export default function CdPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const pausedByUser = useRef(false);
  const fadeRef = useRef<number | null>(null);
  const landRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [waiting, setWaiting] = useState(false);

  const fade = useCallback((to: number, ms: number) => {
    const a = audioRef.current;
    if (!a) return;
    if (fadeRef.current) cancelAnimationFrame(fadeRef.current);
    if (landRef.current) clearTimeout(landRef.current);
    const from = a.volume;
    const t0 = performance.now();
    const step = (t: number) => {
      // rAF hands back the frame's start time, which can predate t0 — left
      // unclamped that makes the first step negative, and assigning a volume
      // below 0 throws, killing the fade with the track stuck silent.
      const k = Math.min(1, Math.max(0, (t - t0) / ms));
      a.volume = Math.min(1, Math.max(0, from + (to - from) * k));
      if (k < 1) fadeRef.current = requestAnimationFrame(step);
      else if (to === 0) a.pause();
    };
    fadeRef.current = requestAnimationFrame(step);
    // rAF stops entirely in a backgrounded tab, and this fade starts from
    // volume 0 — so a visitor who opens the card and immediately switches
    // apps can come back to a track that is playing but permanently silent.
    // Land it on the target no matter what happened to the animation frames.
    landRef.current = window.setTimeout(() => {
      a.volume = Math.min(1, Math.max(0, to));
      if (to === 0) a.pause();
    }, ms + 300);
  }, []);

  /**
   * Autoplay. No browser will play audibly before the visitor has interacted —
   * that is policy, not something code can get around. What it *will* allow is
   * muted playback, so the track starts and buffers the moment the page opens
   * and the first tap only has to unmute it: no download, no spin-up, no wait.
   * It rewinds as it becomes audible, so nobody joins the song halfway.
   */
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0;
    let dead = false;
    let silent = false; // running, but muted and inaudible
    let won = false;    // audible playback has succeeded — never mute again

    // `click` as well as `pointerdown`: a button reached through assistive
    // technology, or activated programmatically, raises click on its own.
    const events = ['pointerdown', 'touchstart', 'keydown', 'click'] as const;
    const detach = () => events.forEach((e) => window.removeEventListener(e, attempt));

    async function attempt() {
      if (dead || won || pausedByUser.current || !a) return;
      try {
        a.muted = false;
        if (silent) { a.currentTime = 0; silent = false; }
        await a.play();
        if (dead) return;
        won = true;            // claimed before anything async can undo it
        setPlaying(true);
        setWaiting(false);
        fade(volume, 1600);
        detach();
      } catch {
        /* The attempt fired at mount has no gesture behind it and is *meant*
           to fail. But its rejection is async, so it can land after a later,
           gesture-driven attempt has already started playing audibly — and
           muting here then silences the track the visitor just opened. That
           is the "the card opens but stays quiet" report: the audio is not
           stopped, it is running muted, which is why nothing looks wrong. */
        if (dead || won) return;
        setWaiting(true);
        if (!silent) {
          a.muted = true;
          a.play().then(() => {
            // and the same race once more, one level down
            if (won) a.muted = false; else silent = true;
          }).catch(() => {});
        }
      }
    }

    events.forEach((e) => window.addEventListener(e, attempt, { passive: true }));
    attempt();

    return () => {
      dead = true;
      detach();
      if (fadeRef.current) cancelAnimationFrame(fadeRef.current);
      if (landRef.current) clearTimeout(landRef.current);
    };
  }, [fade]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      pausedByUser.current = true;
      setPlaying(false);
      fade(0, 480);
    } else {
      pausedByUser.current = false;
      if (a.muted) { a.muted = false; a.currentTime = 0; }
      a.play()
        .then(() => { setPlaying(true); setWaiting(false); fade(volume, 900); })
        .catch(() => setWaiting(true));
    }
  };

  return (
    <div className={s.wrap}>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? `Pause ${title}` : `Play ${title}`}
        className={`${s.button} ${playing ? s.playing : ''}`}
      >
        <span className={s.disc} />
        <span className={s.sheen} />
        <span className={s.hub}>
          <svg className={s.play} viewBox="0 0 14 16" aria-hidden="true"><path d="M1 1.2v13.6L13 8z" /></svg>
          <svg className={s.pause} viewBox="0 0 14 16" aria-hidden="true"><path d="M1 1h4v14H1zM9 1h4v14H9z" /></svg>
        </span>
      </button>

      <p className={s.track}>{title} &middot; {artist}</p>
      {waiting && !playing && <p className={s.hint}>tap anywhere to begin the music</p>}

      {/* preload:auto — the wait people noticed was the file only starting to
          download on the first tap. AAC first, the original as a safety net. */}
      <audio ref={audioRef} loop preload="auto" playsInline>
        <source src={src} type="audio/mp4" />
        <source src={fallback} type="audio/mpeg" />
      </audio>
    </div>
  );
}
