import { useEffect, useState } from 'react';

/**
 * useIsMobile
 *
 * Tracks whether the viewport is at/below `breakpoint` (default 768 — Tailwind `md`).
 * Used to swap the desktop Hero for the Figma "Hero_mobile_option_2" build instead of
 * just CSS-scaling the desktop composition down.
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < breakpoint
  );

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [breakpoint]);

  return isMobile;
}
