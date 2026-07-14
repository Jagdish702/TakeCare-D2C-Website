import { useContent } from '../../context/ContentContext';

/**
 * Header navigation (Figma node 12169:4285 "Frame 1").
 * Inter Medium 16px, letter-spacing 0.2592px, 24px gap, cap-height trimmed.
 * Active item = brand blue (#004172); others = #999999.
 */
export default function NavMenu() {
  const { header } = useContent();
  const primaryNavLabel = header.labels.find((l: any) => l.label_key === 'primary_nav').label_text;

  return (
    <nav
      className="flex shrink-0 items-center gap-6 whitespace-nowrap font-inter text-base font-medium leading-[normal] tracking-nav [word-break:break-word]"
      aria-label={primaryNavLabel}
    >
      {header.navLinks.map((item: any) => (
        <a
          key={item.id}
          href={item.href}
          aria-current={item.is_active ? 'page' : undefined}
          className={`relative shrink-0 cursor-pointer transition-colors duration-200 ease-out [text-box-edge:cap_alphabetic] [text-box-trim:trim-both] hover:text-brand-blue ${
            item.is_active ? 'text-brand-blue' : 'text-nav-inactive'
          }`}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
