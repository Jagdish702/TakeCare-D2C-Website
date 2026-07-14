import { useEffect } from 'react';
import CartIcon from '../icons/CartIcon';
import ProfileIcon from '../icons/ProfileIcon';
import CloseCircleIcon from '../icons/CloseCircleIcon';
import PhoneIcon from '../icons/PhoneIcon';
import { useContent } from '../../context/ContentContext';

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCart?: () => void;
  onOpenProfile?: () => void;
}

/**
 * Mobile nav drawer (Figma node 13001:14618 "Menu", 407 × 890 — full-height
 * slide-in from the left, opened by the hamburger icon / closed by the ⓧ).
 * Spacing lifted directly from the Figma frame's absolute child positions:
 * 48px top pad → header row → 24px → divider → 48px → nav list (40px rows,
 * 8px gap) → 48px → divider → 48px → icon row → 48px → "Get the App" button.
 */
export default function MobileMenuDrawer({ isOpen, onClose, onOpenCart, onOpenProfile }: MobileMenuDrawerProps) {
  const { header } = useContent();
  const menuLabel = header.labels.find((l: any) => l.label_key === 'menu').label_text;
  const closeMenuLabel = header.labels.find((l: any) => l.label_key === 'close_menu').label_text;
  const mobilePrimaryNavLabel = header.labels.find((l: any) => l.label_key === 'mobile_primary_nav').label_text;
  const cartLabel = header.labels.find((l: any) => l.label_key === 'cart').label_text;
  const accountLabel = header.labels.find((l: any) => l.label_key === 'account').label_text;
  const getAppLabel = header.labels.find((l: any) => l.label_key === 'get_app_cta').label_text;

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden
        className="fixed inset-0 z-[1100] md:hidden"
        style={{
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={menuLabel}
        className="fixed inset-y-0 left-0 z-[1101] flex w-full max-w-[407px] flex-col overflow-y-auto bg-white md:hidden"
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '4px 0 24px rgba(0,65,114,0.12)',
          willChange: 'transform',
        }}
      >
        <div className="flex flex-col px-6 pt-12">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <p
              className="font-inter font-medium not-italic [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
              style={{ fontSize: 24, lineHeight: '32px', color: '#000000' }}
            >
              {menuLabel}
            </p>
            <button
              type="button"
              aria-label={closeMenuLabel}
              onClick={onClose}
              className="flex size-10 shrink-0 cursor-pointer appearance-none items-center justify-center text-brand-blue"
            >
              <CloseCircleIcon />
            </button>
          </div>

          {/* Divider */}
          <div className="mt-6 h-px w-full shrink-0" style={{ background: '#CCCCCC' }} />

          {/* Nav list */}
          <nav className="mt-12 flex flex-col gap-2" aria-label={mobilePrimaryNavLabel}>
            {header.navLinks.map((item: any) => (
              <a
                key={item.id}
                href={item.href}
                aria-current={item.is_active ? 'page' : undefined}
                onClick={onClose}
                className="flex h-10 shrink-0 items-center rounded-xl px-2 font-inter font-medium not-italic tracking-nav [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
                style={{
                  fontSize: 16,
                  lineHeight: 'normal',
                  background: item.is_active ? '#F5FAFF' : 'transparent',
                  color: item.is_active ? '#004172' : '#808080',
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Divider */}
          <div className="mt-12 h-px w-full shrink-0" style={{ background: '#CCCCCC' }} />

          {/* Cart / Profile icons */}
          <div className="mt-12 flex shrink-0 items-center gap-6">
            <button
              type="button"
              aria-label={cartLabel}
              onClick={() => {
                onClose();
                onOpenCart?.();
              }}
              className="flex size-10 shrink-0 cursor-pointer appearance-none items-center justify-center text-nav-inactive"
            >
              <CartIcon />
            </button>
            <button
              type="button"
              aria-label={accountLabel}
              onClick={() => {
                onClose();
                onOpenProfile?.();
              }}
              className="flex size-10 shrink-0 cursor-pointer appearance-none items-center justify-center text-nav-inactive"
            >
              <ProfileIcon />
            </button>
          </div>

          {/* Get the App button */}
          <button
            type="button"
            className="mt-12 flex h-12 w-full shrink-0 cursor-pointer appearance-none items-center justify-center gap-2 rounded-full bg-brand-blue font-inter font-medium not-italic text-white tracking-nav"
            style={{ fontSize: 16 }}
          >
            {getAppLabel}
            <PhoneIcon />
          </button>
        </div>
      </div>
    </>
  );
}
