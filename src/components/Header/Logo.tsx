import logoSrc from '../../assets/curebay-logo.png';

/**
 * CureBay brand logo (Figma node 12169:4284 "CureBay_Logo_light").
 * Fixed 120 × 36.098 — its native aspect ratio (2460 × 740) drives the
 * header's content height.
 */
export default function Logo() {
  return (
    <a href="#" className="flex h-[36.098px] w-[120px] shrink-0 flex-col items-start" aria-label="CureBay — for a healthier India">
      <img
        src={logoSrc}
        alt="CureBay"
        className="h-[36.098px] w-full object-cover"
        width={120}
        height={36.098}
      />
    </a>
  );
}
