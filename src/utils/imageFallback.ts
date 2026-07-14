import type { SyntheticEvent } from 'react';

/**
 * Swaps a broken <img> to a local static asset if the DB-driven URL 404s.
 * Guards against infinite loops if the fallback itself fails to load.
 */
export function onImageError(fallbackSrc: string) {
  return (e: SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.src === fallbackSrc) return;
    img.onerror = null;
    img.src = fallbackSrc;
  };
}
