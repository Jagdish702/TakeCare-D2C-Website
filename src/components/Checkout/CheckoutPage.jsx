import DisclaimerCard from '../Subscription/DisclaimerCard';
import CheckoutStepper from './CheckoutStepper';
import CheckoutSummaryPanel from './CheckoutSummaryPanel';
import { useContent } from '../../context/ContentContext';

const HEADER_H = 52;

const PLAN_FEATURE_ICONS = {
  mobile: '/assets/subscription/Mobile.svg',
  warranty: '/assets/subscription/warrenty.svg',
  'shield-check': '/assets/subscription/shield check.svg',
};

/* ── Shared card image box ── */
function ImageBox({ src, alt, radial }) {
  return (
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
        ...(radial ? { padding: 12, boxSizing: 'border-box' } : {}),
      }}
    >
      {radial && (
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
      )}
      <img
        src={src}
        alt={alt}
        draggable={false}
        style={
          radial
            ? { position: 'relative', width: 61, height: 125, objectFit: 'cover', flexShrink: 0 }
            : { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', display: 'block', maxWidth: 'none' }
        }
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
  );
}

/* ── Review card shell ── */
function ReviewCard({ children }) {
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
      {children}
    </div>
  );
}

/* ── Text column shared styles ── */
const textColStyle = {
  flex: '1 0 0',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  paddingLeft: 8,
  paddingRight: 8,
  paddingTop: 8,
  alignSelf: 'stretch',
};

const nameStyle = {
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
};

const descStyle = {
  fontFamily: 'Inter, sans-serif',
  fontWeight: 300,
  fontSize: 16,
  color: '#808080',
  letterSpacing: '0.5184px',
  lineHeight: '28px',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
};

const qtyRowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 28,
  flexShrink: 0,
};

const qtyLabelStyle = {
  fontFamily: 'Inter, sans-serif',
  fontWeight: 500,
  fontSize: 16,
  color: '#ccc',
  letterSpacing: '0.5184px',
  lineHeight: '28px',
};

const qtyValueStyle = {
  fontFamily: 'Inter, sans-serif',
  fontWeight: 500,
  fontSize: 16,
  color: '#000',
  letterSpacing: '0.5184px',
  lineHeight: '28px',
};

const priceStyle = {
  margin: 0,
  fontFamily: 'Inter, sans-serif',
  fontWeight: 500,
  fontSize: 16,
  color: '#000',
  letterSpacing: '0.5184px',
  lineHeight: '28px',
};

/* ── Product review card ── */
function ProductReviewCard() {
  const { subscription, images } = useContent();
  const product = subscription.cartProduct;
  return (
    <ReviewCard>
      <ImageBox src={images['subscription-cart-device']} alt={product.name} />
      <div style={textColStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={nameStyle}>{product.name}</p>
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
          <div style={descStyle}>
            <p style={{ margin: 0 }}>{product.description}</p>
          </div>
        </div>
        <div style={qtyRowStyle}>
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            <span style={qtyLabelStyle}>{product.qty_label}</span>
            <span style={qtyValueStyle}>1</span>
          </div>
          <p style={priceStyle}>{product.price}</p>
        </div>
      </div>
    </ReviewCard>
  );
}

/* ── Subscription review card ── */
function SubscriptionReviewCard({ plan }) {
  const { subscription, images } = useContent();
  const dbPlan = subscription.plans.find((p) => p.plan_key === plan.key);
  const price = `₹${plan.subAmount}`;

  return (
    <ReviewCard>
      <ImageBox src={images['subscription-cart-mobile']} alt="TakeCare app" radial />
      <div style={textColStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={nameStyle}>{dbPlan.title}</p>
          <div style={descStyle}>
            <p style={{ margin: 0 }}>{dbPlan.disclaimer_line1}</p>
            <p style={{ margin: 0 }}>{dbPlan.disclaimer_line2}</p>
          </div>
        </div>
        <div style={qtyRowStyle}>
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            <span style={qtyLabelStyle}>{subscription.cartProduct.qty_label}</span>
            <span style={qtyValueStyle}>1</span>
          </div>
          <p style={priceStyle}>{price}</p>
        </div>
      </div>
    </ReviewCard>
  );
}

/* ── Plan features list ── */
function PlanFeatures() {
  const { subscription } = useContent();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 24px' }}>
      {subscription.planFeatures.map((f) => (
        <div key={f.text} style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <img
            src={PLAN_FEATURE_ICONS[f.icon_key]}
            alt=""
            draggable={false}
            style={{ width: 24, height: 24, flexShrink: 0, objectFit: 'contain' }}
          />
          <p
            style={{
              margin: 0,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: 16,
              color: '#808080',
              letterSpacing: '0.5184px',
              lineHeight: '28px',
              flex: '1 0 0',
              minWidth: 0,
            }}
          >
            {f.text}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   CheckoutPage — "Step 8" in Figma (node 12185-4781)
   Opens as a full-screen overlay below the header
   when "Checkout" is clicked in CartDrawer.
══════════════════════════════════════════════ */
export default function CheckoutPage({ plan, onBack, onContinue, isOpen }) {
  const { checkout } = useContent();
  const section = checkout.section;

  if (!isOpen || !plan) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: HEADER_H,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#f9f9f9',
        zIndex: 1200,
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 1800,
          margin: '0 auto',
          padding: 'clamp(24px, 6vw, 120px)',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 60,
          alignItems: 'flex-start',
        }}
      >
        {/* Stepper */}
        <CheckoutStepper currentStep={0} />

        {/* Two-column layout — columns stay side by side at every viewport
            width (never wrap/stack); each shrinks proportionally via
            flex-basis instead of a hard fixed width, so together they
            always fit rather than silently overflowing/clipping inside
            this overlay's overflowY:'auto' (which, per the CSS overflow
            spec, forces overflow-x to 'auto' too once overflow-y is
            non-'visible' — so horizontal overflow here doesn't show a
            scrollbar, it just hides content off-screen). */}
        <div
          style={{
            display: 'flex',
            gap: 60,
            alignItems: 'flex-start',
            width: '100%',
          }}
        >
          {/* ── Left panel: Review products ── */}
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
            {/* Product section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 8, boxSizing: 'border-box' }}>
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
                {section.review_products_heading}
              </p>
              <ProductReviewCard />
            </div>

            {/* Subscription section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
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
                {section.subscriptions_heading}
              </p>
              <SubscriptionReviewCard plan={plan} />
              <PlanFeatures />
              {/* ✅ REUSED — DisclaimerCard from DisclaimerCard.jsx */}
              <DisclaimerCard plan={plan} />
            </div>
          </div>

          {/* ── Right panel: Summary & payment (shared across checkout steps) ── */}
          <CheckoutSummaryPanel plan={plan} onBack={onBack} onContinue={onContinue} />
        </div>
      </div>
    </div>
  );
}
