import DisclaimerCard from '../Subscription/DisclaimerCard';
import PrimaryButton from '../common/PrimaryButton';
import CheckoutStepperMobile from './CheckoutStepperMobile';
import AvailDiscounts from './AvailDiscounts';

/*
  Mobile "Purchase Summery" — Figma node 12185:6186 ("Mobile: Cart").
  Single-column stack of the same content as the desktop CheckoutPage
  (node 12185-4781) + CheckoutSummaryPanel, reusing DisclaimerCard,
  PrimaryButton and AvailDiscounts as-is. Figma's mobile mockup mislabels
  the subscription review card with the product's copy — this uses the
  correct plan-specific copy instead, per the site's "web content is
  source of truth" convention (see SubscriptionSectionMobile/CartDrawerMobile).
*/

const PLAN_FEATURES = [
  { icon: '/assets/subscription/Mobile.svg',       text: 'Free on boarding and set up.' },
  { icon: '/assets/subscription/warrenty.svg',     text: 'One year warranty on tablet dispenser.' },
  { icon: '/assets/subscription/shield check.svg', text: 'Lifetime CureBay command Centre support.' },
];

const FONT = 'Inter, sans-serif';

function ReviewCardMobile({ image, imageBg, title, tag, description, price }) {
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
          <img src={image} alt="" draggable={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', maxWidth: 'none' }} />
          <div aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', boxShadow: 'inset 0 0 1.2px rgba(0,65,114,0.24)', pointerEvents: 'none' }} />
        </div>

        <div style={{ flex: '1 0 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 8, paddingRight: 8 }}>
          <p style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 16, color: '#000', letterSpacing: '0.5178px', lineHeight: '24px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {title}
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: FONT,
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
          <p style={{ margin: 0, fontFamily: FONT, fontWeight: 300, fontSize: 14, color: '#999', letterSpacing: '0.4536px', lineHeight: '24px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {description}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: 8 }}>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center', fontFamily: FONT, fontWeight: 500, fontSize: 14, letterSpacing: '0.4536px', lineHeight: '24px' }}>
          <span style={{ color: '#ccc' }}>Quantity</span>
          <span style={{ color: '#000' }}>1</span>
        </div>
        <p style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 14, color: '#000', letterSpacing: '0.4536px', lineHeight: '24px' }}>
          {price}
        </p>
      </div>
    </div>
  );
}

function PlanFeaturesMobile() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 24px', width: '100%', boxSizing: 'border-box' }}>
      {PLAN_FEATURES.map((f) => (
        <div key={f.text} style={{ display: 'flex', gap: 20, alignItems: 'center', width: '100%' }}>
          <img src={f.icon} alt="" draggable={false} style={{ width: 24, height: 24, flexShrink: 0, objectFit: 'contain' }} />
          <p style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 14, color: '#808080', letterSpacing: '0.4536px', lineHeight: '24px', flex: '1 0 0', minWidth: 0 }}>
            {f.text}
          </p>
        </div>
      ))}
    </div>
  );
}

function PriceRowMobile({ label, amount, bold }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between', height: 23 }}>
      <p style={{ margin: 0, flex: '1 0 0', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: FONT, fontWeight: bold ? 700 : 500, fontSize: 14, color: bold ? '#000' : '#808080', letterSpacing: '0.4536px', lineHeight: '24px', whiteSpace: 'nowrap' }}>
        {label}
      </p>
      <p style={{ margin: 0, flexShrink: 0, fontFamily: FONT, fontWeight: bold ? 700 : 500, fontSize: 14, color: bold ? '#000' : '#808080', letterSpacing: '0.4536px', lineHeight: '24px', whiteSpace: 'nowrap' }}>
        {amount}
      </p>
    </div>
  );
}

function Divider() {
  return <div style={{ width: '100%', height: 1, background: '#ccc', flexShrink: 0 }} />;
}

export default function CheckoutPageMobile({ plan, onBack, onContinue, isOpen }) {
  if (!isOpen || !plan) return null;

  const isMonthly = plan.key === 'monthly';
  const planName = isMonthly ? 'TakeCare Monthly Plan' : 'TakeCare Yearly Plan';
  const planDesc = isMonthly
    ? 'Monthly subscription billing. Save up to ₹100 every month on dedicated care.'
    : 'Yearly subscription billing. Save up to ₹1,000 every year on dedicated care.';

  const devicePrice = 1599;
  const subPrice = parseInt(String(plan.subAmount).replace(',', ''), 10);
  const subtotal = devicePrice + subPrice;
  const delivery = 49;
  const total = subtotal + delivery;

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#f9f9f9', zIndex: 1200, overflowY: 'auto' }}>
      <div style={{ width: '100%', padding: '48px 24px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 48, alignItems: 'flex-start' }}>
        <CheckoutStepperMobile currentStep={0} />

        {/* Review your products */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
          <p style={{ margin: 0, fontFamily: FONT, fontWeight: 700, fontSize: 16, color: '#808080', letterSpacing: '0.5178px', lineHeight: '24px' }}>
            Review your products
          </p>
          <ReviewCardMobile
            image="/assets/subscription/cart-device.png"
            title="Take Care tablet dispenser"
            tag="One time payment"
            description="Take Care is the smart dispenser that doses, reminds, and confirms. So you stop worrying and start trusting."
            price="₹1,599"
          />
        </div>

        {/* Subscriptions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
          <p style={{ margin: 0, fontFamily: FONT, fontWeight: 700, fontSize: 16, color: '#808080', letterSpacing: '0.5178px', lineHeight: '24px' }}>
            Subscriptions
          </p>
          <ReviewCardMobile
            image="/assets/subscription/cart-mobile.png"
            imageBg="radial-gradient(50% 50% at 50% 50%, #E8F1F8 0%, #fff 100%)"
            title={planName}
            tag={planDesc}
            description=""
            price={`₹${plan.subAmount}`}
          />
          <PlanFeaturesMobile />
          <DisclaimerCard plan={plan} />
        </div>

        {/* Delivery / discounts / price breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
          <DisclaimerCard icon="/assets/checkout/icon-delivery.svg">
            <p style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 12, color: '#000', letterSpacing: '0.3883px', lineHeight: '20px' }}>Delivery</p>
            <p style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 12, color: '#999', letterSpacing: '0.3883px', lineHeight: '20px' }}>Arrives in 2–4 days</p>
          </DisclaimerCard>

          <div style={{ borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc', padding: '16px 0', width: '100%', boxSizing: 'border-box' }}>
            <AvailDiscounts />
          </div>

          <div style={{ background: '#f7f5f4', borderBottom: '1px solid #ccc', padding: 16, display: 'flex', flexDirection: 'column', gap: 12, boxSizing: 'border-box', width: '100%' }}>
            <PriceRowMobile label="Take Care tablet dispenser" amount={`₹${devicePrice.toLocaleString('en-IN')}`} />
            <PriceRowMobile label={planName} amount={`₹${subPrice}`} />
            <Divider />
            <PriceRowMobile label="Subtotal" amount={`₹${subtotal.toLocaleString('en-IN')}`} />
            <PriceRowMobile label="Delivery charges" amount={`₹${delivery}`} />
            <Divider />
            <PriceRowMobile label="Estimated Total" amount={`₹${total.toLocaleString('en-IN')}`} bold />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
          <PrimaryButton fullWidth onClick={onContinue}>Continue to Payment</PrimaryButton>
          <button
            onClick={onBack}
            style={{
              width: '100%',
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              background: 'transparent',
              borderRadius: 16,
              cursor: 'pointer',
              boxShadow: '0 2px 2px rgba(0,65,114,0.08)',
              fontFamily: FONT,
              fontWeight: 500,
              fontSize: 16,
              color: '#004172',
              letterSpacing: '0.2592px',
            }}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
