import { useEffect, useState } from 'react';

/**
 * useHeaderScrollSwap
 *
 * Drives the header's in-place swap into the "Get Take Care" price/CTA bar
 * (Figma node 12506:11047 "Type=Mobile" / 12323:7048 "Type=Web"): swap in the
 * moment the user scrolls down past `threshold` px, swap back the moment they
 * scroll back up (or return near the top of the page).
 */
export function useHeaderScrollSwap(threshold = 80): boolean {
  const [swapped, setSwapped] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    function onScroll() {
      const y = window.scrollY;
      if (y <= threshold) {
        setSwapped(false);
      } else if (y > lastY) {
        setSwapped(true);
      } else if (y < lastY) {
        setSwapped(false);
      }
      lastY = y;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return swapped;
}
