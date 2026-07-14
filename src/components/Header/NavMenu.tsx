import { NAV_ITEMS } from './navItems';

/**
 * Header navigation (Figma node 12169:4285 "Frame 1").
 * Inter Medium 16px, letter-spacing 0.2592px, 24px gap, cap-height trimmed.
 * Active item = brand blue (#004172); others = #999999.
 */
export default function NavMenu() {
  return (
    <nav
      className="flex shrink-0 items-center gap-6 whitespace-nowrap font-inter text-base font-medium leading-[normal] tracking-nav [word-break:break-word]"
      aria-label="Primary"
    >
      {NAV_ITEMS.map((item) => (
        <a
          key={item.label}
          href={item.href}
          aria-current={item.active ? 'page' : undefined}
          className={`relative shrink-0 cursor-pointer transition-colors duration-200 ease-out [text-box-edge:cap_alphabetic] [text-box-trim:trim-both] hover:text-brand-blue ${
            item.active ? 'text-brand-blue' : 'text-nav-inactive'
          }`}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
