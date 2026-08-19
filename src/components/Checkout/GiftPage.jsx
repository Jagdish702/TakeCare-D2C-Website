import CheckoutStepper from './CheckoutStepper';

/*
  "Is it a gift? 💐" — Figma node 14012:23546, reached from either option on
  CaregiverConfirmPage ("Yes" or "No" both lead here). Reuses the shared
  CheckoutStepper (currentStep=1) and the same stepper/progress-bar/
  dot-grid-card shell as CareForPage/PersonDetailsPage/CaregiverConfirmPage.
*/

const HEADER_H = 52;
const FONT = 'Inter, sans-serif';

const DOT_GRID_BG = {
  backgroundImage: 'radial-gradient(circle, #e5e5e5 1px, transparent 1px)',
  backgroundSize: '24px 24px',
};

function OptionCard({ image, imageStyle, label, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
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
      <div style={{ width: 96, height: 92, borderRadius: 12, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
        <img src={image} alt="" draggable={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...imageStyle }} />
      </div>
      <p style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 18, color: '#4d4d4d', lineHeight: 'normal', textAlign: 'center' }}>
        {label}
      </p>
    </button>
  );
}

export default function GiftPage({ isOpen, onSelect }) {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: HEADER_H, left: 0, right: 0, bottom: 0, background: '#f9f9f9', zIndex: 1200, overflowY: 'auto' }}>
      <div style={{ width: '100%', maxWidth: 1800, margin: '0 auto', padding: 'clamp(24px, 6vw, 120px)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 60, alignItems: 'flex-start' }}>
        <CheckoutStepper currentStep={1} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'flex-start', width: '100%' }}>
          <div style={{ display: 'flex', width: '100%', height: 8, borderRadius: 24, overflow: 'hidden', background: '#e5e5e5' }}>
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} style={{ flex: '1 0 0', minWidth: 0, height: 8, background: i < 4 ? 'linear-gradient(180deg, #10b981 0%, #00664c 100%)' : 'transparent' }} />
            ))}
          </div>

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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', textAlign: 'center', width: '100%' }}>
                <p style={{ margin: 0, width: '100%', fontFamily: FONT, fontWeight: 500, fontSize: 32, color: '#000', lineHeight: 1.3, letterSpacing: '-0.32px' }}>
                  Is it a gift? 💐
                </p>
                <p style={{ margin: 0, width: '100%', fontFamily: FONT, fontWeight: 400, fontSize: 16, color: '#000', lineHeight: 1.5 }}>
                  The TakeCare device will be delivered with a gift card that has your name on it.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 16, alignItems: 'stretch', width: '100%' }}>
                <OptionCard
                  image="/assets/checkout/illustration-gift.png"
                  imageStyle={{ objectFit: 'cover' }}
                  label="Yes, It's a gift"
                  onSelect={() => onSelect?.(true)}
                />
                <OptionCard
                  image="/assets/checkout/illustration-device-self.png"
                  imageStyle={{ objectFit: 'cover', left: '-7.35%', top: '-3.31%', width: '107.91%', height: '107.91%' }}
                  label="No, it's not"
                  onSelect={() => onSelect?.(false)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
