import { useState, useEffect } from 'react';
import PrimaryButton from '../common/PrimaryButton';
import DisclaimerCard from './DisclaimerCard';
import { useContent } from '../../context/ContentContext';

/*
  Mobile "Your Cart" page — Figma node 12185:6104 ("Mobile: Cart").
  Full-screen sheet (slides up), reusing desktop CartDrawer's data logic
  (qty/price/plan) and shared DisclaimerCard. Figma's mobile mockup shows
  the Subscriptions card re-using the Product card's placeholder copy
  ("Take Care tablet dispenser" / "One time payment") — that's a content
  bug in the design; this reuses the desktop CartDrawer's correct
  plan-specific copy instead, per the site's "web content is source of
  truth" convention.
*/

function MenuTabMobile({ text, count, active }) {
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
      }}
    >
      <p
        style={{
          flex: '1 0 0',
          margin: 0,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          fontSize: 14,
          color: active ? '#004172' : '#808080',
          letterSpacing: '0.4536px',
          lineHeight: '24px',
          minWidth: 0,
        }}
      >
        {text}
      </p>
      <div style={{ background: '#f9f9f9', borderRadius: 8, padding: '4px 8px', flexShrink: 0 }}>
        <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 12, color: '#999', letterSpacing: '0.3883px', lineHeight: 1.5, whiteSpace: 'nowrap' }}>
          {count}
        </p>
      </div>
    </div>
  );
}

/* Shared qty stepper used by both cards */
function QtyStepper({ qty, onQtyChange, min = 1 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e5e5', borderRadius: 9, background: '#fff', overflow: 'hidden', flexShrink: 0 }}>
      <button
        onClick={() => onQtyChange(Math.max(min, qty - 1))}
        style={{ width: 32, height: 32, border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 300, fontSize: 18, color: '#808080', textAlign: 'center', padding: 0, lineHeight: '32px' }}
      >
        -
      </button>
      <div style={{ width: 32, height: 32, borderLeft: '1px solid #e5e5e5', borderRight: '1px solid #e5e5e5', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 18, color: '#000', textAlign: 'center', lineHeight: '32px' }}>
        {qty}
      </div>
      <button
        onClick={() => onQtyChange(qty + 1)}
        style={{ width: 32, height: 32, border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 300, fontSize: 18, color: '#808080', textAlign: 'center', padding: 0, lineHeight: '32px' }}
      >
        +
      </button>
    </div>
  );
}

/* Compact horizontal card shared shell — image + text, then stepper/trash + price row */
function CartLineCardMobile({ image, imageBg, title, tag, description, qty, onQtyChange, onRemove, price }) {
  return (
    <div
      style={{
        position: 'relative',
        background: '#fff',
        borderRadius: 20,
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        boxShadow: '0 4px 6px rgba(0,65,114,0.08)',
        boxSizing: 'border-box',
        width: '100%',
      }}
    >
      <div aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', boxShadow: 'inset 0 0 2px rgba(0,65,114,0.16)', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', width: '100%' }}>
        <div style={{ position: 'relative', width: 120, height: 120, borderRadius: 12, overflow: 'hidden', flexShrink: 0, background: imageBg }}>
          <img
            src={image}
            alt=""
            draggable={false}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', display: 'block', maxWidth: 'none' }}
          />
          <div aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', boxShadow: 'inset 0 0 1.2px rgba(0,65,114,0.24)', pointerEvents: 'none' }} />
        </div>

        <div style={{ flex: '1 0 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 8, paddingRight: 8 }}>
          <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 16, color: '#000', letterSpacing: '0.5178px', lineHeight: '24px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {title}
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: '0.3883px',
              lineHeight: 1.5,
              background: 'linear-gradient(180deg, #10b981 0%, #00664c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {tag}
          </p>
          <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 300, fontSize: 14, color: '#999', letterSpacing: '0.4536px', lineHeight: '24px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {description}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: 8 }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <QtyStepper qty={qty} onQtyChange={onQtyChange} />
          {onRemove && (
            <img
              src="/assets/subscription/icon-trash.svg"
              alt="Remove"
              draggable={false}
              onClick={onRemove}
              style={{ width: 24, height: 24, cursor: 'pointer', flexShrink: 0, filter: 'drop-shadow(0 1.333px 5.333px rgba(0,65,114,0.08))' }}
            />
          )}
        </div>
        <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 14, color: '#000', letterSpacing: '0.4536px', lineHeight: '24px' }}>
          {price}
        </p>
      </div>
    </div>
  );
}

function EmptySubscriptionMobile({ title, subtitle }) {
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
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 14, color: '#808080', textAlign: 'center', lineHeight: '24px' }}>
        {title}
        <br />
        {subtitle}
      </p>
    </div>
  );
}

export default function CartDrawerMobile({ plan, isOpen, onClose, onCheckout }) {
  const { subscription, images } = useContent();
  const { cartProduct, cartStaticText } = subscription;
  const [deviceQty, setDeviceQty] = useState(1);
  const [subQty, setSubQty] = useState(1);

  useEffect(() => {
    if (isOpen) { setDeviceQty(1); setSubQty(1); }
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const devicePrice = 1599 * deviceQty;
  const subUnitPrice = plan ? parseInt(String(plan.subAmount).replace(',', ''), 10) : 0;
  const subPrice = subUnitPrice * subQty;
  const total = devicePrice + subPrice;
  const totalStr = total.toLocaleString('en-IN');
  const cartCount = plan ? 2 : 1;

  const isQuarterly = plan?.key === 'quarterly';
  const planName = plan ? (isQuarterly ? 'TakeCare Quarterly Plan' : 'TakeCare Yearly Plan') : '';
  const planTag = isQuarterly ? 'Quarterly subscription' : 'Yearly subscription';
  const planDesc = plan
    ? (isQuarterly
        ? 'Monthly subscription billing. Save up to ₹100 every month on dedicated care.'
        : 'Yearly subscription billing. Save up to ₹1,000 every year on dedicated care.')
    : '';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1101,
        background: '#f9f9f9',
        display: 'flex',
        flexDirection: 'column',
        transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform',
      }}
    >
      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '48px 24px 24px', display: 'flex', flexDirection: 'column', gap: 24, boxSizing: 'border-box' }}>
        {/* Title + close */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 32, lineHeight: 'normal', color: '#000' }}>
              {cartStaticText.title}
            </p>
            <button
              onClick={onClose}
              aria-label="Close cart"
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 2px 2px rgba(0,65,114,0.08)',
              }}
            >
              <img src="/assets/subscription/icon-close-circle.svg" alt="" style={{ width: 24, height: 24, filter: 'drop-shadow(0 2px 8px rgba(0,65,114,0.08))' }} />
            </button>
          </div>
          <div style={{ display: 'flex', width: '100%' }}>
            <MenuTabMobile text="Cart" count={String(cartCount)} active />
            <MenuTabMobile text="Orders" count="0" />
          </div>
        </div>

        {/* Products */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
          <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 16, color: '#808080', letterSpacing: '0.5178px', lineHeight: '24px' }}>
            Products
          </p>
          <CartLineCardMobile
            image={images['subscription-cart-device']}
            title={cartProduct.name}
            tag={cartProduct.tag}
            description={cartProduct.description}
            qty={deviceQty}
            onQtyChange={setDeviceQty}
            price={cartProduct.price}
          />

          {plan && <DisclaimerCard plan={plan} />}
        </div>

        {/* Subscriptions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
          <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 16, color: '#808080', letterSpacing: '0.5178px', lineHeight: '24px' }}>
            {cartStaticText.subscriptions_section_label}
          </p>
          {plan ? (
            <CartLineCardMobile
              image={images['subscription-cart-mobile']}
              imageBg="radial-gradient(50% 50% at 50% 50%, #E8F1F8 0%, #fff 100%)"
              title={planName}
              tag={planTag}
              description={planDesc}
              qty={subQty}
              onQtyChange={setSubQty}
              onRemove={() => {}}
              price={`₹${plan.subAmount}`}
            />
          ) : (
            <EmptySubscriptionMobile
              title={cartStaticText.empty_subscription_title}
              subtitle={cartStaticText.empty_subscription_subtitle}
            />
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          flexShrink: 0,
          position: 'relative',
          background: '#fff',
          boxShadow: '0 -2px 10px rgba(0,65,114,0.08)',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <div aria-hidden style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 2px rgba(0,65,114,0.12)', pointerEvents: 'none' }} />
        <p style={{ position: 'relative', margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 16, color: '#000', letterSpacing: '0.5178px', lineHeight: '24px', flexShrink: 0 }}>
          ₹{totalStr}
        </p>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <PrimaryButton onClick={() => { onClose(); onCheckout?.(); }}>{cartStaticText.checkout_cta_label}</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
