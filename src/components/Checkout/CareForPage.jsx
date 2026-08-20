import CheckoutStepper from './CheckoutStepper';
import { useContent } from '../../context/ContentContext';

/*
  "Who is this care for?" — Figma node 14005:22734 ("Step 15"), a new
  interstitial step reached from the "User Details & shipping address"
  step's Continue button, before Payment. Reuses the shared CheckoutStepper
  (currentStep=1, same index ShippingDetailsPage uses — still within the
  shipping phase) and the same fixed-overlay shell as
  PaymentPage.jsx/CheckoutPage.jsx.

  The 5-segment bar below the stepper is Figma's own finer-grained
  sub-progress indicator for this phase (2 of 5 segments filled) — a new
  element, not shared with any other page yet.

  Heading and the two option cards (label + image) come from
  checkout.careForPage / checkout.optionCards (page_key='care_for') via
  useContent() — see database/schema.sql section 14.
*/

const HEADER_H = 52;
const FONT = 'Inter, sans-serif';

// Figma "Progress Bar" — 5 segments, first N filled with the green gradient.
function SubProgressBar({ filled = 2, total = 5 }) {
  return (
    <div style={{ display: 'flex', width: '100%', height: 8, borderRadius: 24, overflow: 'hidden', background: '#e5e5e5' }}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            flex: '1 0 0',
            minWidth: 0,
            height: 8,
            background: i < filled ? 'linear-gradient(180deg, #10b981 0%, #00664c 100%)' : 'transparent',
          }}
        />
      ))}
    </div>
  );
}

// Figma applies this dot-grid texture as the content card's fill.
const DOT_GRID_BG = {
  backgroundImage: 'radial-gradient(circle, #e5e5e5 1px, transparent 1px)',
  backgroundSize: '24px 24px',
};

function OptionCard({ option, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.key)}
      style={{
        flex: '1 0 0',
        minWidth: 0,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 22,
        padding: 24,
        borderRadius: 24,
        border: '1px solid #e8f1f8',
        background: '#fff',
        boxShadow: '0 4px 6px rgba(0,65,114,0.08), inset 0 0 2px rgba(0,65,114,0.16)',
        cursor: 'pointer',
      }}
    >
      <img src={option.image} alt="" draggable={false} style={{ width: 80, height: 80, objectFit: 'cover', flexShrink: 0 }} />
      <p style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 18, color: '#4d4d4d', lineHeight: 'normal', textAlign: 'center' }}>
        {option.label}
      </p>
    </button>
  );
}

export default function CareForPage({ isOpen, onContinue }) {
  const { checkout, images } = useContent();
  if (!isOpen) return null;

  const options = checkout.optionCards
    .filter((o) => o.page_key === 'care_for')
    .map((o) => ({ key: o.option_key, label: o.label, image: images[o.image_key] }));

  return (
    <div style={{ position: 'fixed', top: HEADER_H, left: 0, right: 0, bottom: 0, background: '#f9f9f9', zIndex: 1200, overflowY: 'auto' }}>
      <div style={{ width: '100%', maxWidth: 1800, margin: '0 auto', padding: 'clamp(24px, 6vw, 120px)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 60, alignItems: 'flex-start' }}>
        <CheckoutStepper currentStep={1} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'flex-start', width: '100%' }}>
          <SubProgressBar filled={2} total={5} />

          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '220px 240px',
              borderRadius: 40,
              background: '#fff',
              boxSizing: 'border-box',
              ...DOT_GRID_BG,
            }}
          >
            <div style={{ width: 520, maxWidth: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 48 }}>
              <p style={{ margin: 0, width: '100%', fontFamily: FONT, fontWeight: 500, fontSize: 36, color: '#000', lineHeight: 1.3, letterSpacing: '-0.36px', textAlign: 'center' }}>
                {checkout.careForPage.heading}
              </p>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', width: '100%' }}>
                {options.map((option) => (
                  <OptionCard key={option.key} option={option} onSelect={onContinue} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
