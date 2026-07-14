import { useEffect } from 'react';
import { useContent } from '../../context/ContentContext';

/*
  Mobile "added to cart" toast — Figma node 12457:8710 (FeedbackNotificationCard,
  type="Mobile", 354×161). Same content/behaviour as the desktop CartPopup
  (auto-dismiss after 3s, View -> open cart), reusing the same device/mobile
  combo image and close-icon glyph as the desktop version, laid out for a
  narrow viewport instead of a fixed top-right toast.
*/

export default function CartPopupMobile({ plan, onClose, onViewCart }) {
  const { images } = useContent();
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 68,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        width: 'calc(100% - 48px)',
        maxWidth: 354,
        background: '#f9f9f9',
        borderRadius: 20,
        padding: 8,
        display: 'flex',
        gap: 8,
        alignItems: 'flex-start',
        boxSizing: 'border-box',
        boxShadow: '0 2px 4px rgba(0,65,114,0.08), inset 0 0 2px rgba(0,65,114,0.08)',
      }}
    >
      {/* Product image — fixed square so sizing doesn't depend on the row's content height */}
      <div
        style={{
          width: 132,
          height: 132,
          flexShrink: 0,
          borderRadius: 12,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <img
          src={images['subscription-device']}
          alt="TakeCare device"
          draggable={false}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', maxWidth: 'none' }}
        />
        <div aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', boxShadow: 'inset 0 0 1.198px rgba(0,65,114,0.24)', pointerEvents: 'none' }} />
      </div>

      {/* Right content column */}
      <div style={{ flex: '1 0 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12, paddingLeft: 8, paddingRight: 8, paddingTop: 8 }}>
          {/* Label row + close button */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', width: '100%' }}>
            <p style={{ flex: '1 0 0', minWidth: 0, margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 12, color: '#808080', letterSpacing: '0.3883px', lineHeight: 1.5 }}>
              Product + Subscription
            </p>
            <button
              onClick={onClose}
              aria-label="Dismiss"
              style={{ flexShrink: 0, width: 24, height: 24, border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <img src="/assets/subscription/icon-close.svg" alt="" style={{ width: 14, height: 14 }} />
            </button>
          </div>

          {/* Product name */}
          <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 16, color: '#000', letterSpacing: '0.5184px', lineHeight: '28px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            TakeCare tablets dispenser &amp; {plan.title.toLowerCase()}
          </p>

          {/* is added to cart */}
          <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 16, color: '#00B82E', letterSpacing: '0.5184px', lineHeight: '28px' }}>
            is added to cart
          </p>
        </div>

        {/* View button */}
        <div style={{ position: 'relative', width: '100%', height: 48 }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, background: '#EDF9FF', borderRadius: 16, pointerEvents: 'none' }} />
          <button
            onClick={onViewCart}
            style={{
              position: 'relative',
              width: '100%',
              height: 48,
              borderRadius: 16,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: 16,
              color: '#004172',
              letterSpacing: '0.2592px',
            }}
          >
            View
          </button>
          <div aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: 16, boxShadow: 'inset 0 0 2px 0 rgba(0,65,114,0.08)', pointerEvents: 'none' }} />
        </div>
      </div>
    </div>
  );
}
