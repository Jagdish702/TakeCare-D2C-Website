import CheckoutStepper from './CheckoutStepper';

/*
  "Would you like to be the caregiver of [Name]?" — Figma node 14012:23003,
  reached from PersonDetailsPage's Continue button (only on the "Someone
  else" path). Reuses the shared CheckoutStepper (currentStep=1) and the
  same stepper/progress-bar/dot-grid-card shell as CareForPage/
  PersonDetailsPage/OrderDetailsPage. [Name] is the first word of the real
  full name entered on PersonDetailsPage, not Figma's placeholder "Rohit".
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
        justifyContent: 'flex-end',
        gap: 22,
        padding: 24,
        borderRadius: 24,
        border: '1px solid #e8f1f8',
        background: '#fff',
        boxShadow: '0 4px 6px rgba(0,65,114,0.08), inset 0 0 2px rgba(0,65,114,0.16)',
        cursor: 'pointer',
      }}
    >
      <img src={image} alt="" draggable={false} style={{ width: 80, height: 80, flexShrink: 0, ...imageStyle }} />
      <p style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 18, color: '#4d4d4d', lineHeight: 'normal', textAlign: 'center' }}>
        {label}
      </p>
    </button>
  );
}

export default function CaregiverConfirmPage({ personDetails, isOpen, onConfirm }) {
  if (!isOpen) return null;

  const firstName = personDetails?.fullName?.trim().split(/\s+/)[0] || 'them';

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
                  Would you like to be the caregiver of <span style={{ color: '#30956a' }}>{firstName}</span>?
                </p>
                <p style={{ margin: 0, width: '100%', fontFamily: FONT, fontWeight: 400, fontSize: 16, color: '#000', lineHeight: 1.5 }}>
                  By accepting, you will be able to manage their care.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 16, alignItems: 'stretch', width: '100%' }}>
                <OptionCard
                  image="/assets/checkout/avatar-me.png"
                  imageStyle={{ objectFit: 'cover' }}
                  label="Yes, I'll be the caregiver"
                  onSelect={() => onConfirm?.(true)}
                />
                <OptionCard
                  image="/assets/checkout/illustration-not-caregiver.png"
                  imageStyle={{ objectFit: 'contain' }}
                  label="No, not right now"
                  onSelect={() => onConfirm?.(false)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
