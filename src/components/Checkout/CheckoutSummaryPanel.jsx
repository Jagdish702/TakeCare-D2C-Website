import DisclaimerCard from '../Subscription/DisclaimerCard';
import AvailDiscounts from './AvailDiscounts';

/* ── Price row in breakdown ── */
function PriceRow({ label, amount, bold }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 23,
      }}
    >
      <p
        style={{
          margin: 0,
          flex: '1 0 0',
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontFamily: 'Inter, sans-serif',
          fontWeight: bold ? 700 : 500,
          fontSize: 16,
          color: bold ? '#000' : '#808080',
          letterSpacing: '0.2592px',
          lineHeight: '24px',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </p>
      <p
        style={{
          margin: 0,
          flexShrink: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontFamily: 'Inter, sans-serif',
          fontWeight: bold ? 700 : 500,
          fontSize: 16,
          color: bold ? '#000' : '#808080',
          letterSpacing: '0.2592px',
          lineHeight: '24px',
          whiteSpace: 'nowrap',
          textAlign: 'right',
        }}
      >
        {amount}
      </p>
    </div>
  );
}

/* ── Divider line ── */
function Divider() {
  return <div style={{ width: '100%', height: 1, background: '#ccc', flexShrink: 0 }} />;
}

/* ── Chevron SVGs (inline, no extra asset needed) ── */
function ChevronLeft() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 18l-6-6 6-6" stroke="#004172" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 18l6-6-6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ══════════════════════════════════════════════
   CheckoutSummaryPanel — the right-hand "Delivery /
   Avail Discounts / price breakdown / pay + Continue"
   panel (Figma node 12185:4828, "Frame 1984078589").
   Identical across every checkout step per Figma (Step 8
   "Purchase Summary" AND Step 5 "Payment" both embed this
   exact same 700px panel) — shared here instead of being
   duplicated per-page.
══════════════════════════════════════════════ */
export default function CheckoutSummaryPanel({ plan, onBack, onContinue }) {
  const isMonthly = plan.key === 'monthly';
  const devicePrice = 1599;
  const subPrice = parseInt(plan.subAmount, 10);
  const subtotal = devicePrice + subPrice;
  const delivery = 49;
  const total = subtotal + delivery;
  const subLabel = isMonthly ? 'TakeCare Monthly Plan' : 'TakeCare Yearly Plan';

  return (
    <div
      style={{
        flex: '1 1 700px',
        minWidth: 0,
        background: '#fff',
        borderRadius: 16,
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        boxSizing: 'border-box',
      }}
    >
      {/* Figma names this instance "Disclaimer Card" too — same component
          as the auto-renew disclaimer below, just with a different icon +
          two-line content. */}
      <DisclaimerCard icon="/assets/checkout/icon-delivery.svg">
        <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 12, color: '#000', letterSpacing: '0.3883px', lineHeight: '20px' }}>
          Delivery
        </p>
        <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 12, color: '#999', letterSpacing: '0.3883px', lineHeight: '20px' }}>
          Arrives in 2–4 days
        </p>
      </DisclaimerCard>

      {/* Discounts section */}
      <div
        style={{
          borderTop: '1px solid #ccc',
          borderBottom: '1px solid #ccc',
          padding: '16px 0',
        }}
      >
        <div style={{ padding: '0 24px' }}>
          <AvailDiscounts />
        </div>
      </div>

      {/* Price breakdown */}
      <div
        style={{
          background: '#f7f5f4',
          borderBottom: '1px solid #ccc',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          boxSizing: 'border-box',
        }}
      >
        <PriceRow label="Take Care tablet dispenser" amount={`₹${devicePrice.toLocaleString('en-IN')}`} />
        <PriceRow label={subLabel} amount={`₹${subPrice}`} />
        <Divider />
        <PriceRow label="Subtotal" amount={`₹${subtotal.toLocaleString('en-IN')}`} />
        <PriceRow label="Delivery charges" amount={`₹${delivery}`} />
        <Divider />
        <PriceRow label="Estimated Total" amount={`₹${total.toLocaleString('en-IN')}`} bold />
      </div>

      <Divider />

      {/* Payment logos + total + action buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Logos + total price */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <img src="/assets/checkout/pay-visa.png" alt="Visa"
              style={{ height: 18, width: 'auto', objectFit: 'contain' }} />
            <img src="/assets/checkout/pay-mastercard.png" alt="Mastercard"
              style={{ height: 18, width: 'auto', objectFit: 'contain' }} />
            <img src="/assets/checkout/pay-paypal.png" alt="PayPal"
              style={{ height: 18, width: 'auto', objectFit: 'contain' }} />
            <img src="/assets/checkout/pay-upi.png" alt="UPI"
              style={{ height: 18, width: 'auto', objectFit: 'contain' }} />
            <img src="/assets/checkout/pay-cash.svg" alt="Cash"
              style={{ width: 24, height: 24, objectFit: 'contain' }} />
          </div>
          <p
            style={{
              margin: 0,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: 24,
              color: '#000',
              letterSpacing: '0.3888px',
              lineHeight: 'normal',
            }}
          >
            ₹{total.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Back + Continue to Payment */}
        <div style={{ display: 'flex', gap: 24 }}>
          {/* Back button */}
          <button
            onClick={onBack}
            style={{
              flex: 1,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 16px',
              borderRadius: 16,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              boxShadow: '0 2px 2px rgba(0,65,114,0.08)',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: 16,
              color: '#004172',
              letterSpacing: '0.2592px',
              whiteSpace: 'nowrap',
            }}
          >
            <ChevronLeft />
            Back
          </button>

          {/* Continue to Payment button — nowrap + a smaller min horizontal
              padding at narrow widths (clamp) so the label always stays on
              one line instead of wrapping as the panel shrinks. */}
          <button
            onClick={onContinue}
            style={{
              flex: 1,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '12px clamp(16px, 4vw, 60px)',
              borderRadius: 12,
              border: 'none',
              background: '#004172',
              cursor: 'pointer',
              boxShadow: '0 2px 2px rgba(0,65,114,0.08), inset 0 0 2px rgba(0,65,114,0.08)',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: 16,
              color: '#fff',
              letterSpacing: '0.2592px',
              whiteSpace: 'nowrap',
            }}
          >
            Continue to Payment
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
