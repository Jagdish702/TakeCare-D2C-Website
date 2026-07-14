import { useEffect, useState } from 'react';

/**
 * useFitScale
 *
 * Returns a uniform scale factor that shrinks a fixed `designWidth` × optional
 * `designHeight` layout down to fit the viewport, capped at 1 (never scales up).
 *
 * - With only `designWidth`: scales so the design fits the viewport WIDTH
 *   (prevents horizontal overflow on narrow displays).
 * - With `designHeight` too: "contain" fit — scales by whichever of width/height
 *   is more constrained, so a tall section is never clipped at the bottom on a
 *   short viewport.
 *
 * `heightInset` subtracts fixed chrome (e.g. the 52px sticky header) from the
 * usable height so content scales to fit — and can be centred within — the area
 * BELOW that chrome instead of the full viewport.
 *
 * Apply the returned value as `transform: scale(...)` on a section's foreground
 * wrapper. Backgrounds stay full-bleed (object-cover) OUTSIDE the scaled wrapper,
 * and the GSAP-pinned trigger element must remain untransformed so ScrollTrigger
 * pinning continues to work.
 */
export function useFitScale(designWidth = 1440, designHeight?: number, heightInset = 0): number {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const vw = document.documentElement.clientWidth;
      const vh = document.documentElement.clientHeight;
      const widthScale  = vw / designWidth;
      const heightScale = designHeight ? (vh - heightInset) / designHeight : Infinity;
      setScale(Math.min(1, widthScale, heightScale));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [designWidth, designHeight, heightInset]);

  return scale;
}
