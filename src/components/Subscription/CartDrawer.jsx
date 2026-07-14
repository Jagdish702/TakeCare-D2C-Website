import { useState, useEffect } from 'react';
import PrimaryButton from '../common/PrimaryButton';
import DisclaimerCard from './DisclaimerCard';
import { useContent } from '../../context/ContentContext';

const HEADER_H = 52;

/* ─────────────────────────────────────────────
   Tab
───────────────────────────────────────────── */
function MenuTab({ text, count, active }) {
  return (
    <div
      style={{
        flex: '1 0 0',
        minWidth: 0,
        display: 'flex',
        gap: 24,
        alignItems: 'center',
        padding: '12px 20px',
        borderBottom: active ? '2px solid #004172' : '1px solid #e5e5e5',
        boxSizing: 'border-box',
        cursor: 'pointer',
      }}
    >
      <p
        style={{
          flex: '1 0 0',
          margin: 0,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          fontSize: 16,
          color: active ? '#004172' : '#808080',
          letterSpacing: '0.5184px',
          lineHeight: '28px',
          minWidth: 0,
        }}
      >
        {text}
      </p>
      <div
        style={{
          background: '#f9f9f9',
          borderRadius: 8,
          padding: '4px 8px',
          flexShrink: 0,
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            fontSize: 12,
            color: '#999',
            letterSpacing: '0.3883px',
            lineHeight: '20px',
            whiteSpace: 'nowrap',
          }}
        >
          {count}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Product card — TakeCare tablet dispenser
───────────────────────────────────────────── */
function ProductCard({ product }) {
  return (
    <div
      style={{
        position: 'relative',
        background: 'white',
        borderRadius: 20,
        padding: 8,
        display: 'flex',
        gap: 8,
        alignItems: 'flex-start',
        boxShadow: '0 4px 6px rgba(0,65,114,0.08)',
        boxSizing: 'border-box',
        width: '100%',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          boxShadow: 'inset 0 0 2px rgba(0,65,114,0.16)',
          pointerEvents: 'none',
        }}
      />

      {/* Tablet dispenser image — downloaded from Figma node 12242:9752 */}
      <div
        style={{
          position: 'relative',
          width: 150,
          height: 150,
          borderRadius: 15,
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <img
          src="/assets/subscription/cart-device.png"
          alt="TakeCare tablet dispenser"
          draggable={false}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            maxWidth: 'none',
          }}
        />
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            boxShadow: 'inset 0 0 1.5px rgba(0,65,114,0.24)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Text content */}
      <div
        style={{
          flex: '1 0 0',
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          paddingLeft: 8,
          paddingRight: 8,
          paddingTop: 8,
          alignSelf: 'stretch',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p
            style={{
              margin: 0,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: 18,
              color: '#000',
              letterSpacing: '0.5825px',
              lineHeight: '28px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {product.name}
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: '0.3883px',
              lineHeight: '20px',
              background: 'linear-gradient(180deg, #10b981 0%, #00664c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {product.tag}
          </p>
          <div
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: 14,
              color: '#555',
              letterSpacing: '0.3px',
              lineHeight: '22px',
            }}
          >
            <p style={{ margin: 0 }}>{product.description}</p>
          </div>
        </div>

        {/* Quantity + price */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 28,
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: 16,
                color: '#999',
                letterSpacing: '0.5184px',
                lineHeight: '28px',
              }}
            >
              {product.qty_label}
            </span>
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: 16,
                color: '#000',
                letterSpacing: '0.5184px',
                lineHeight: '28px',
              }}
            >
              1
            </span>
          </div>
          <p
            style={{
              margin: 0,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: 16,
              color: '#000',
              letterSpacing: '0.5184px',
              lineHeight: '28px',
            }}
          >
            {product.price}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Subscription card — monthly or yearly
───────────────────────────────────────────── */
function SubscriptionCard({ plan, qty, onQtyChange }) {
  const isMonthly = plan.key === 'monthly';
  const planName = isMonthly ? 'TakeCare Monthly Plan' : 'TakeCare Yearly Plan';
  const price = `₹${plan.subAmount}`;
  const descLine1 = isMonthly ? 'Monthly subscription billing.' : 'Yearly subscription billing.';
  const descLine2 = plan.disclaimer[1];

  return (
    <div
      style={{
        position: 'relative',
        background: 'white',
        borderRadius: 20,
        padding: 8,
        display: 'flex',
        gap: 8,
        alignItems: 'flex-start',
        boxShadow: '0 4px 6px rgba(0,65,114,0.08)',
        boxSizing: 'border-box',
        width: '100%',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          boxShadow: 'inset 0 0 2px rgba(0,65,114,0.16)',
          pointerEvents: 'none',
        }}
      />

      {/* Mobile app image — downloaded from Figma node 12221:7464 */}
      <div
        style={{
          position: 'relative',
          width: 150,
          height: 150,
          borderRadius: 15,
          overflow: 'hidden',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 12,
          boxSizing: 'border-box',
        }}
      >
        {/* Radial gradient background */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 15,
            background: 'radial-gradient(50% 50% at 50% 50%, #E8F1F8 0%, #fff 100%)',
            pointerEvents: 'none',
          }}
        />
        <img
          src="/assets/subscription/cart-mobile.png"
          alt="TakeCare app"
          draggable={false}
          style={{
            position: 'relative',
            width: 61,
            height: 125,
            objectFit: 'cover',
            flexShrink: 0,
            boxShadow: '1px 1px 12px 16px rgba(0,0,0,0.04)',
          }}
        />
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            boxShadow: 'inset 0 0 1.5px rgba(0,65,114,0.24)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Text content */}
      <div
        style={{
          flex: '1 0 0',
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          paddingLeft: 8,
          paddingRight: 8,
          paddingTop: 8,
          alignSelf: 'stretch',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p
            style={{
              margin: 0,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: 18,
              color: '#000',
              letterSpacing: '0.5825px',
              lineHeight: '28px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {planName}
          </p>
          <div
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: 14,
              color: '#555',
              letterSpacing: '0.3px',
              lineHeight: '22px',
            }}
          >
            <p style={{ margin: 0 }}>{descLine1}</p>
            <p style={{ margin: 0 }}>{descLine2}</p>
          </div>
        </div>

        {/* Qty stepper + trash + price */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            {/* Stepper */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #e5e5e5',
                borderRadius: 8,
                background: '#fff',
                overflow: 'hidden',
              }}
            >
              <button
                onClick={() => onQtyChange(Math.max(1, qty - 1))}
                style={{
                  width: 28,
                  height: 44,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 300,
                  fontSize: 18,
                  color: '#808080',
                  textAlign: 'center',
                  padding: 0,
                  lineHeight: '44px',
                }}
              >
                -
              </button>
              <div
                style={{
                  width: 28,
                  height: 44,
                  borderLeft: '0.81px solid #e5e5e5',
                  borderRight: '0.81px solid #e5e5e5',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: 16,
                  color: '#000',
                  textAlign: 'center',
                  lineHeight: '44px',
                }}
              >
                {qty}
              </div>
              <button
                onClick={() => onQtyChange(qty + 1)}
                style={{
                  width: 28,
                  height: 44,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 300,
                  fontSize: 18,
                  color: '#808080',
                  textAlign: 'center',
                  padding: 0,
                  lineHeight: '44px',
                }}
              >
                +
              </button>
            </div>
            {/* Trash icon */}
            <img
              src="/assets/subscription/icon-trash.svg"
              alt="Remove"
              draggable={false}
              style={{
                width: 24,
                height: 24,
                cursor: 'pointer',
                flexShrink: 0,
                filter: 'drop-shadow(0 1.333px 5.333px rgba(0,65,114,0.08))',
              }}
            />
          </div>
          <p
            style={{
              margin: 0,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: 16,
              color: '#000',
              letterSpacing: '0.5184px',
              lineHeight: '28px',
            }}
          >
            {price}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Disclaimer card
───────────────────────────────────────────── */
/* DisclaimerCard imported from ./DisclaimerCard */

/* ─────────────────────────────────────────────
   Empty state — no subscription selected
───────────────────────────────────────────── */
function EmptySubscription({ title, subtitle }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: '32px 24px',
        border: '1.5px dashed #e5e5e5',
        borderRadius: 16,
        background: '#fff',
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          fontSize: 15,
          color: '#808080',
          textAlign: 'center',
          lineHeight: '24px',
        }}
      >
        {title}
        <br />
        {subtitle}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CartDrawer — main export
   Always in DOM so CSS transform transitions
   fire in both directions without a delay hack.
───────────────────────────────────────────── */
export default function CartDrawer({ plan, isOpen, onClose, onCheckout }) {
  const { subscription } = useContent();
  const { cartProduct, cartStaticText } = subscription;
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (isOpen) setQty(1);
  }, [isOpen]);

  // Escape closes
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [onClose]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const devicePrice = 1599;
  const subPrice = plan ? parseInt(plan.subAmount.replace(',', ''), 10) : 0;
  const total = devicePrice + subPrice;
  const totalStr = total.toLocaleString('en-IN');
  const cartCount = plan ? 2 : 1;

  return (
    <>
      {/* ── Backdrop — starts BELOW the sticky header so the header stays
             fully visible and clickable while the cart is open ── */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: HEADER_H,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1100,
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* ── Drawer panel ── */}
      <div
        style={{
          position: 'fixed',
          top: HEADER_H,
          right: 0,
          width: 800,
          maxWidth: '100vw',
          height: `calc(100vh - ${HEADER_H}px)`,
          zIndex: 1101,
          background: '#f9f9f9',
          display: 'flex',
          flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(850px)',
          transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '-4px 0 24px rgba(0,65,114,0.12)',
          willChange: 'transform',
        }}
      >
        {/* Scrollable content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '32px 32px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            boxSizing: 'border-box',
          }}
        >
          {/* Title + tabs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <p
              style={{
                margin: 0,
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: 48,
                lineHeight: 'normal',
                color: '#000',
              }}
            >
              {cartStaticText.title}
            </p>
            <div style={{ display: 'flex' }}>
              <MenuTab text="Cart" count={String(cartCount)} active />
              <MenuTab text="Orders" count="0" />
            </div>
          </div>

          {/* ── Product section ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p
              style={{
                margin: 0,
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: 18,
                color: '#808080',
                letterSpacing: '0.5825px',
                lineHeight: '28px',
              }}
            >
              {cartStaticText.products_section_label}
            </p>
            <ProductCard product={cartProduct} />
          </div>

          {/* ── Subscription section ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p
              style={{
                margin: 0,
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: 18,
                color: '#808080',
                letterSpacing: '0.5825px',
                lineHeight: '28px',
              }}
            >
              {cartStaticText.subscriptions_section_label}
            </p>
            {plan ? (
              <>
                <SubscriptionCard plan={plan} qty={qty} onQtyChange={setQty} />
                <DisclaimerCard plan={plan} />
              </>
            ) : (
              <EmptySubscription
                title={cartStaticText.empty_subscription_title}
                subtitle={cartStaticText.empty_subscription_subtitle}
              />
            )}
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          style={{
            flexShrink: 0,
            position: 'relative',
            background: '#fff',
            boxShadow: '0 -2px 10px rgba(0,65,114,0.08)',
            padding: '16px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 32,
          }}
        >
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              boxShadow: 'inset 0 0 2px rgba(0,65,114,0.12)',
              pointerEvents: 'none',
            }}
          />
          <p
            style={{
              position: 'relative',
              margin: 0,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: 24,
              color: '#000',
              letterSpacing: '0.3888px',
              lineHeight: 'normal',
              flexShrink: 0,
            }}
          >
            ₹{totalStr}
          </p>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <PrimaryButton onClick={() => { onClose(); onCheckout?.(); }}>{cartStaticText.checkout_cta_label}</PrimaryButton>
          </div>
        </div>
      </div>
    </>
  );
}
