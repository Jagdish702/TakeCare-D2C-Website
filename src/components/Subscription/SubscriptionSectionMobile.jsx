import { useState } from 'react';
import PrimaryButton from '../common/PrimaryButton';
import CartPopupMobile from './CartPopupMobile';
import { usePlansAndFeatures } from './SubscriptionSection';
import { useContent } from '../../context/ContentContext';

/*
  Mobile "Take Care Subscription" — Figma node 12445:4450.
  Fluid (no fixed-canvas scale) like the site's other simple mobile sections;
  content/data reused verbatim from the desktop SubscriptionSection. Per-plan
  disclaimer is rendered as a single flowing paragraph (mobile Figma copy is
  one un-split string, unlike the desktop's forced 2-line break — same
  pattern as SetupSpecsSectionMobile).
*/

const SECTION_BG =
  'radial-gradient(ellipse 50% 50% at 50% 50%, #F2FBFD 0%, #FFFFFF 100%)';

/* ── Price row: ₹ symbol + big number + period label ── */
function PriceRowMobile({ amount, periodLine1, periodLine2 }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        alignItems: 'flex-end',
        lineHeight: 0,
        fontFamily: 'Inter, sans-serif',
        fontWeight: 300,
      }}
    >
      <span style={{ fontSize: 14, letterSpacing: '0.4536px', lineHeight: '24px', flexShrink: 0 }}>₹</span>
      <span style={{ fontSize: 48, lineHeight: 'normal', flexShrink: 0 }}>{amount}</span>
      <div style={{ fontSize: 14, letterSpacing: '0.4536px', lineHeight: '24px', width: 75, flexShrink: 0 }}>
        <p style={{ margin: 0 }}>{periodLine1}</p>
        <p style={{ margin: 0 }}>{periodLine2}</p>
      </div>
    </div>
  );
}

// Blue "current plan" ribbon badge + card border — see the matching
// constant/comment in the desktop SubscriptionSection.jsx.
const CURRENT_PLAN_BLUE = '#004172';

/* ── Single pricing card ── */
function PlanCardMobile({ plan, features, content, onGetStarted, isCurrent }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        borderRadius: 36,
        padding: '36px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 36,
        boxSizing: 'border-box',
        boxShadow: '0 2px 4px rgba(0,65,114,0.08)',
        border: `2px solid ${isCurrent ? CURRENT_PLAN_BLUE : 'transparent'}`,
      }}
    >
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: '#fff', borderRadius: 36, pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: 36, boxShadow: 'inset 0 0 2px 0 rgba(0,65,114,0.08)', pointerEvents: 'none' }} />

      {isCurrent && (
        <div
          style={{
            position: 'absolute',
            top: -16,
            left: 20,
            padding: '6px 16px',
            borderRadius: 999,
            background: CURRENT_PLAN_BLUE,
            boxShadow: '0 2px 4px rgba(0,65,114,0.16)',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: '0.3883px',
            lineHeight: '18px',
            color: '#fff',
            textTransform: 'uppercase',
          }}
        >
          Current Plan
        </div>
      )}

      {/* Plan title — green gradient text */}
      <p
        style={{
          position: 'relative',
          margin: 0,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 700,
          fontSize: 24,
          lineHeight: '32px',
          letterSpacing: 0,
          background: 'linear-gradient(180deg, #10b981 0%, #00664c 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {plan.title}
      </p>

      {/* Cost breakdown */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 24, color: '#000' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 16, letterSpacing: '0.5178px', lineHeight: '24px' }}>
            One time tablet dispenser cost
          </p>
          <PriceRowMobile
            amount={content.device_price}
            periodLine1={content.device_period_line1}
            periodLine2={content.device_period_line2}
          />
        </div>

        <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 16, letterSpacing: '0.5178px', lineHeight: '24px', textAlign: 'center' }}>
          +
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 16, letterSpacing: '0.5178px', lineHeight: '24px' }}>
            {content.subscription_cost_label}
          </p>
          <PriceRowMobile amount={plan.subAmount} periodLine1={plan.subPeriod[0]} periodLine2={plan.subPeriod[1]} />
        </div>
      </div>

      {/* CTA block */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 300, fontSize: 14, letterSpacing: '0.4536px', lineHeight: '24px', color: '#000' }}>
          {plan.disclaimer.join(' ')}
        </p>
        {isCurrent ? (
          <div
            style={{
              width: '100%',
              height: 48,
              boxSizing: 'border-box',
              borderRadius: 12,
              background: '#e5e5e5',
              color: '#808080',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: 16,
              letterSpacing: '0.2592px',
              cursor: 'default',
            }}
          >
            Current Plan
          </div>
        ) : (
          <PrimaryButton fullWidth onClick={() => onGetStarted(plan)}>{plan.cta}</PrimaryButton>
        )}
      </div>

      {/* Features list */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {features.map((feat) => (
          <div key={feat.text} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <img src={feat.icon} alt="" draggable={false} style={{ width: 24, height: 24, flexShrink: 0, objectFit: 'contain' }} />
            <p
              style={{
                margin: 0,
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: 14,
                letterSpacing: '0.4536px',
                lineHeight: '24px',
                color: '#000',
                flex: '1 0 0',
                minWidth: 0,
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
export default function SubscriptionSectionMobile({ onGetStarted, onOpenCart, currentPlanKey }) {
  const { subscription, images } = useContent();
  const { content } = subscription;
  const { plans, features } = usePlansAndFeatures();
  const [activePlan, setActivePlan] = useState(null);

  const handleGetStarted = (plan) => {
    setActivePlan(plan);
    onGetStarted?.(plan);
  };

  return (
    <>
      {activePlan && (
        <CartPopupMobile
          plan={activePlan}
          onClose={() => setActivePlan(null)}
          onViewCart={() => { setActivePlan(null); onOpenCart?.(); }}
        />
      )}
      <div
        id="subscription-plans"
        style={{
          width: '100%',
          background: SECTION_BG,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          padding: '80px 24px 60px',
          boxSizing: 'border-box',
        }}
      >
        {/* Heading block */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, textAlign: 'center', width: '100%' }}>
          <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 20, color: '#008EB1', letterSpacing: '0.324px', lineHeight: '28px' }}>
            {content.eyebrow}
          </p>
          <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 48, color: '#000', lineHeight: 'normal', width: '100%' }}>
            {content.heading}
          </p>
        </div>

        {/* Device image */}
        <img
          src={images['subscription-device']}
          alt="TakeCare tablet dispenser and mobile app"
          draggable={false}
          style={{ width: '100%', maxWidth: 354, height: 'auto', aspectRatio: '354 / 353.115', objectFit: 'contain', flexShrink: 0 }}
        />

        {/* Pricing cards */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, width: '100%' }}>
          {plans.map((plan) => (
            <PlanCardMobile
              key={plan.key}
              plan={plan}
              features={features}
              content={content}
              onGetStarted={handleGetStarted}
              isCurrent={plan.key === currentPlanKey}
            />
          ))}
        </div>

        {/* Disclaimer card */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            borderRadius: 24,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            boxSizing: 'border-box',
            boxShadow: '0 2px 4px rgba(0,65,114,0.08)',
          }}
        >
          <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.8)', borderRadius: 24, pointerEvents: 'none' }} />
          <div aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', boxShadow: 'inset 0 0 2px 0 rgba(0,65,114,0.08)', pointerEvents: 'none' }} />
          <p style={{ position: 'relative', margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14, color: '#000', letterSpacing: '0.4536px', lineHeight: '24px' }}>
            {content.disclaimer_title}
          </p>
          <p style={{ position: 'relative', margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 12, color: '#808080', letterSpacing: '0.3883px', lineHeight: 1.5 }}>
            {content.disclaimer_body}
          </p>
        </div>
      </div>
    </>
  );
}
