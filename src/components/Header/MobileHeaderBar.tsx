import Logo from './Logo';
import CartIcon from '../icons/CartIcon';
import ProfileIcon from '../icons/ProfileIcon';
import MenuIcon from '../icons/MenuIcon';
import GetTakeCareBarMobile from './GetTakeCareBarMobile';
import { useHeaderScrollSwap } from '../../hooks/useHeaderScrollSwap';
import { useContent } from '../../context/ContentContext';

interface MobileHeaderBarProps {
  onOpenCart?: () => void;
  onOpenProfile?: () => void;
  onOpenMenu: () => void;
}

/**
 * Mobile header bar (Figma node 13063:16732, 408 × 54).
 * Logo left; cart / profile / hamburger clustered right, 24px gaps.
 *
 * Swaps in-place for the compact "Get Take Care" price/CTA bar
 * (Figma 12506:11047, Type=Mobile) once the user scrolls down past the
 * threshold, and swaps back on scroll-up (see `useHeaderScrollSwap`).
 */
export default function MobileHeaderBar({ onOpenCart, onOpenProfile, onOpenMenu }: MobileHeaderBarProps) {
  const swapped = useHeaderScrollSwap();
  const { header } = useContent();
  const cartLabel = header.labels.find((l: any) => l.label_key === 'cart').label_text;
  const accountLabel = header.labels.find((l: any) => l.label_key === 'account').label_text;
  const openMenuLabel = header.labels.find((l: any) => l.label_key === 'open_menu').label_text;

  return (
    <header className="sticky top-0 z-50 flex h-[54px] w-full items-center justify-between bg-white px-6 shadow-header md:hidden">
      {swapped ? (
        <GetTakeCareBarMobile />
      ) : (
        <>
          <Logo />
          <div className="flex shrink-0 items-center gap-6 text-nav-inactive">
            <button type="button" aria-label={cartLabel} onClick={onOpenCart} className="cursor-pointer appearance-none transition-colors duration-200 ease-out hover:text-brand-blue">
              <CartIcon />
            </button>
            <button type="button" aria-label={accountLabel} onClick={onOpenProfile} className="cursor-pointer appearance-none transition-colors duration-200 ease-out hover:text-brand-blue">
              <ProfileIcon />
            </button>
            <button
              type="button"
              aria-label={openMenuLabel}
              onClick={onOpenMenu}
              className="cursor-pointer appearance-none text-[#666666] transition-colors duration-200 ease-out hover:text-brand-blue"
            >
              <MenuIcon />
            </button>
          </div>
        </>
      )}
    </header>
  );
}
