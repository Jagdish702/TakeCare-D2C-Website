import { useRef, useEffect, useState } from 'react';
import PrimaryButton from '../common/PrimaryButton';
import CartPopup from './CartPopup';

/*
  "Take Care Subscription" — Figma node 12202-6911.

  Responsive: scales the 1440-px-wide canvas down to fit narrower viewports
  using the same transform:scale pattern as FeaturesSection.
*/

const CANVAS_W = 1440;
// Natural height of one plan card at 1× scale — used to constrain scale on short viewports
// so the card is always fully visible within the viewport height.
const CARD_H   = 776;

const SECTION_BG =
  'radial-gradient(ellipse 50% 50% at 50% 50%, #F2FBFD 0%, #FFFFFF 100%)';

export const PLAN_FEATURES = [
  { icon: '/assets/subscription/Mobile.svg',       text: 'Free on boarding and set up.' },
  { icon: '/assets/subscription/warrenty.svg',     text: 'One year warranty on tablet dispenser.' },
  { icon: '/assets/subscription/shield check.svg', text: 'Lifetime CureBay command Centre support.' },
];

export const PLANS = [
  {
    key: 'monthly',
    title: 'Monthly plan',
    subAmount: '99',
    subPeriod: ['INR /', 'month'],
    cta: 'Get Started at ₹1,698',
    disclaimer: [
      'One-time device purchase. Monthly subscription billing.',
      'Save up to ₹100 every month on dedicated care.',
    ],
  },
  {
    key: 'yearly',
    title: 'Yearly plan',
    subAmount: '999',
    subPeriod: ['INR /', 'year'],
    cta: 'Get Started at ₹2,598',
    disclaimer: [
      'One-time device purchase. Yearly subscription billing.',
      'Save up to ₹1,000 every year on dedicated care.',
    ],
  },
];

/* ── Price row: ₹ symbol + big number + period label ── */
function PriceRow({ amount, periodLine1, periodLine2 }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', lineHeight: 0 }}>
      <span
        style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 300,
          fontSize: 16,
          letterSpacing: '0.2592px',
          lineHeight: 1.2,
          paddingBottom: 6,
          flexShrink: 0,
        }}
      >
        ₹
      </span>
      <span
        style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          fontSize: 48,
          lineHeight: 'normal',
          flexShrink: 0,
        }}
      >
        {amount}
      </span>
      <div
        style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 300,
          fontSize: 16,
          letterSpacing: '0.2592px',
          lineHeight: 1.2,
          paddingBottom: 6,
          width: 75,
          flexShrink: 0,
        }}
      >
        <p style={{ margin: 0 }}>{periodLine1}</p>
        <p style={{ margin: 0 }}>{periodLine2}</p>
      </div>
    </div>
  );
}

/* ── Single pricing card ── */
function PlanCard({ plan, onGetStarted }) {
  return (
    <div
      style={{
        position: 'relative',
        width: 500,
        flexShrink: 0,
        borderRadius: 26,
        padding: '38px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: 38,
        boxSizing: 'border-box',
        boxShadow: '0 2px 4px rgba(0,65,114,0.08)',
      }}
    >
      {/* White fill */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: '#fff',
          borderRadius: 26,
          pointerEvents: 'none',
        }}
      />
      {/* Inner border shadow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 32,
          boxShadow: 'inset 0 0 2px 0 rgba(0,65,114,0.08)',
          pointerEvents: 'none',
        }}
      />

      {/* Plan title — green gradient text — green gradient text */}
      <p
        style={{
          position: 'relative',
          margin: 0,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          fontSize: 32,
          lineHeight: 'normal',
          letterSpacing: 0,
          whiteSpace: 'nowrap',
          background: 'linear-gradient(180deg, #10b981 0%, #00664c 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {plan.title}
      </p>

      {/* Cost breakdown */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          color: '#000',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <p
            style={{
              margin: 0,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: 18,
              letterSpacing: '0.5825px',
              lineHeight: '28px',
            }}
          >
            One time tablet dispenser cost
          </p>
          <PriceRow amount="1,599" periodLine1="One" periodLine2="time cost" />
        </div>

        <p
          style={{
            margin: 0,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            fontSize: 18,
            letterSpacing: '0.5825px',
            lineHeight: '28px',
            textAlign: 'center',
          }}
        >
          +
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <p
            style={{
              margin: 0,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: 18,
              letterSpacing: '0.5825px',
              lineHeight: '28px',
            }}
          >
            Subscription Cost
          </p>
          <PriceRow
            amount={plan.subAmount}
            periodLine1={plan.subPeriod[0]}
            periodLine2={plan.subPeriod[1]}
          />
        </div>
      </div>

      {/* CTA block */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 300,
            fontSize: 14,
            letterSpacing: '0.2px',
            lineHeight: '24px',
            color: '#000',
          }}
        >
          {plan.disclaimer.map((line, i) => (
            <p key={i} style={{ margin: 0 }}>{line}</p>
          ))}
        </div>
        <PrimaryButton fullWidth onClick={() => onGetStarted(plan)}>{plan.cta}</PrimaryButton>
      </div>

      {/* Features list */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {PLAN_FEATURES.map((feat) => (
          <div key={feat.text} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <img
              src={feat.icon}
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
                letterSpacing: '0.5184px',
                lineHeight: '28px',
                color: '#000',
              }}
            >
              {feat.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Section root ── */
export default function SubscriptionSection({ onGetStarted, onOpenCart }) {
  const wrapperRef = useRef(null);
  const canvasRef  = useRef(null);
  const [activePlan, setActivePlan] = useState(null);

  const handleGetStarted = (plan) => {
    setActivePlan(plan);
    onGetStarted?.(plan);
  };

  useEffect(() => {
    const update = () => {
      if (!wrapperRef.current || !canvasRef.current) return;
      const vw = document.documentElement.clientWidth;
      const vh = window.innerHeight;
      // Constrain by width AND card height so plan cards always fit fully in the viewport
      const s  = Math.min(1, vw / CANVAS_W, (vh - 60) / CARD_H);
      const ox = (vw - CANVAS_W * s) / 2;
      canvasRef.current.style.transform       = `translate(${ox}px, 0) scale(${s})`;
      canvasRef.current.style.transformOrigin = 'top left';
      wrapperRef.current.style.height = `${canvasRef.current.scrollHeight * s}px`;
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <>
    {activePlan && (
      <CartPopup
        plan={activePlan}
        onClose={() => setActivePlan(null)}
        onViewCart={() => { setActivePlan(null); onOpenCart?.(); }}
      />
    )}
    {/* Outer wrapper: full-width background; height driven by JS */}
    <div id="subscription-plans" ref={wrapperRef} style={{ width: '100%', background: SECTION_BG, overflow: 'hidden' }}>

      {/* Inner canvas: fixed 1440-px design width, scaled to viewport */}
      <div
        ref={canvasRef}
        style={{
          width: CANVAS_W,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 60,
          padding: '120px 120px 60px',
          boxSizing: 'border-box',
        }}
      >
        {/* Heading block */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 48,
            textAlign: 'center',
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: 19,
              color: '#008EB1',
              letterSpacing: '0.3888px',
              lineHeight: 'normal',
            }}
          >
            Get your plan
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: 70,
              color: '#000',
              lineHeight: 'normal',
              whiteSpace: 'nowrap',
            }}
          >
            Take Care Subscription
          </p>
        </div>

        {/* Device image */}
        <img
          src="/assets/subscription/device.png"
          alt="TakeCare tablet dispenser and mobile app"
          draggable={false}
          style={{ width: 481, height: 479, objectFit: 'contain', flexShrink: 0 }}
        />

        {/* Pricing cards */}
        <div
          style={{
            display: 'flex',
            gap: 19,
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}
        >
          {PLANS.map((plan) => (
            <PlanCard key={plan.key} plan={plan} onGetStarted={handleGetStarted} />
          ))}
        </div>

        {/* Disclaimer card */}
        <div
          style={{
            position: 'relative',
            width: 1020,
            borderRadius: 24,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            boxSizing: 'border-box',
            boxShadow: '0 2px 4px rgba(0,65,114,0.08)',
          }}
        >
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(255,255,255,0.8)',
              borderRadius: 24,
              pointerEvents: 'none',
            }}
          />
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 'inherit',
              boxShadow: 'inset 0 0 2px 0 rgba(0,65,114,0.08)',
              pointerEvents: 'none',
            }}
          />
          <p
            style={{
              position: 'relative',
              margin: 0,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: 16,
              color: '#000',
              letterSpacing: '0.5184px',
              lineHeight: '28px',
            }}
          >
            Disclaimer
          </p>
          <p
            style={{
              position: 'relative',
              margin: 0,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: 12,
              color: '#808080',
              letterSpacing: '0.3883px',
              lineHeight: '20px',
            }}
          >
            Service availability and response times depend on your location and
            partner network. Emergency and concierge support timelines are
            applicable in select serviceable zones. Delivery and consultation
            timelines may vary based on availability and medical requirements. All
            benefits are valid only for the active subscription period and are
            non-transferable.
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
