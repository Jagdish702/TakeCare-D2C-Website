import CartIcon from '../icons/CartIcon';
import ProfileIcon from '../icons/ProfileIcon';
import { useContent } from '../../context/ContentContext';

interface HeaderActionsProps {
  /** Notification count shown on the bell badge. */
  notificationCount?: number;
  onOpenCart?: () => void;
  onOpenProfile?: () => void;
}

/**
 * Header action icons (Figma node 12169:4292 "Frame 2").
 * Four 24px icons, 24px gap. The notification badge is absolutely positioned
 * on the bell (left 60 / top -2.05 within this row).
 */
export default function HeaderActions({ notificationCount: _notificationCount = 1, onOpenCart, onOpenProfile }: HeaderActionsProps) {
  const { header } = useContent();
  const cartLabel = header.labels.find((l: any) => l.label_key === 'cart').label_text;
  const accountLabel = header.labels.find((l: any) => l.label_key === 'account').label_text;

  return (
    <div className="relative flex shrink-0 items-center gap-6">
      <button type="button" aria-label={cartLabel} onClick={onOpenCart} className="cursor-pointer appearance-none text-nav-inactive transition-colors duration-200 ease-out hover:text-brand-blue">
        <CartIcon />
      </button>
      <button type="button" aria-label={accountLabel} onClick={onOpenProfile} className="cursor-pointer appearance-none text-nav-inactive transition-colors duration-200 ease-out hover:text-brand-blue">
        <ProfileIcon />
      </button>


    </div>
  );
}
