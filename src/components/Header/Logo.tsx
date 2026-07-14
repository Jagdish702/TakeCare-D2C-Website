import logoSrc from '../../assets/curebay-logo.png';
import { useContent } from '../../context/ContentContext';

/**
 * CureBay brand logo (Figma node 12169:4284 "CureBay_Logo_light").
 * Fixed 120 × 36.098 — its native aspect ratio (2460 × 740) drives the
 * header's content height.
 */
export default function Logo() {
  const { header } = useContent();

  return (
    <a href="#" className="flex h-[36.098px] w-[120px] shrink-0 flex-col items-start" aria-label={header.header.logo_aria_label}>
      <img
        src={logoSrc}
        alt={header.header.logo_alt_text}
        className="h-[36.098px] w-full object-cover"
        width={120}
        height={36.098}
      />
    </a>
  );
}
