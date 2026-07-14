import { useState } from 'react';
import Logo from './Logo';
import NavMenu from './NavMenu';
import HeaderActions from './HeaderActions';
import MobileHeaderBar from './MobileHeaderBar';
import MobileMenuDrawer from './MobileMenuDrawer';

/**
 * Site header (Figma node 12169:4282 "Header", 1440 × 68.098).
 *
 * Layout: white bar, 120px horizontal / 16px vertical padding, `Outer/5` shadow.
 * Inner row stretches to fill (flex-1) and distributes Logo · Nav · Actions
 * with `justify-between` — reproducing the exact Figma x-positions at 1440px
 * while remaining fluid.
 *
 * Below `md`, swaps for the mobile bar (node 13063:16732) + slide-in drawer
 * (node 13001:14618) triggered by the hamburger icon.
 */
interface HeaderProps {
  onOpenCart?: () => void;
  onOpenProfile?: () => void;
}

export default function Header({ onOpenCart, onOpenProfile }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 hidden h-[52px] w-full items-end justify-center bg-white px-[120px] py-[8px] shadow-header md:flex">
        <div className="flex min-w-[1px] flex-[1_0_0] items-center justify-between">
          <Logo />
          <NavMenu />
          <HeaderActions notificationCount={1} onOpenCart={onOpenCart} onOpenProfile={onOpenProfile} />
        </div>
      </header>

      <MobileHeaderBar onOpenCart={onOpenCart} onOpenProfile={onOpenProfile} onOpenMenu={() => setMenuOpen(true)} />
      <MobileMenuDrawer
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onOpenCart={onOpenCart}
        onOpenProfile={onOpenProfile}
      />
    </>
  );
}
