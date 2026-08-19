import logoSrc from '../../assets/take-care-logo.png';
import { useContent } from '../../context/ContentContext';

/**
 * Take Care brand logo. Native size 73 × 36 (aspect ratio ~2.03) — width is
 * derived from that ratio at the header's fixed 36.098px content height
 * (was previously the CureBay wordmark, native 2460 × 740).
 */
const LOGO_HEIGHT = 36.098;
const LOGO_WIDTH = (73 / 36) * LOGO_HEIGHT;

export default function Logo() {
  const { header } = useContent();

  return (
    <a href="#" className="flex shrink-0 flex-col items-start" style={{ height: LOGO_HEIGHT, width: LOGO_WIDTH }} aria-label={header.header.logo_aria_label}>
      <img
        src={logoSrc}
        alt={header.header.logo_alt_text}
        className="h-full w-full object-contain"
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
      />
    </a>
  );
}
