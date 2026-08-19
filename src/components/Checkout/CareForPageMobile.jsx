import CheckoutStepperMobile from './CheckoutStepperMobile';

/*
  Mobile "Who is this care for?" — Figma node 14024:20404. Same content/
  behaviour as the desktop CareForPage — reuses CheckoutStepperMobile
  (currentStep=1, same index ShippingDetailsPageMobile uses) —
  single-column option cards instead of side-by-side, mobile type sizes.
*/

const FONT = 'Inter, sans-serif';

const OPTIONS = [
  { key: 'me', label: 'Me', image: '/assets/checkout/avatar-me.png' },
  { key: 'someone-else', label: 'Someone else', image: '/assets/checkout/avatar-someone-else.png' },
];

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

const DOT_GRID_BG = {
  backgroundImage: 'radial-gradient(circle, #e5e5e5 1px, transparent 1px)',
  backgroundSize: '24px 24px',
};

function OptionCardMobile({ option, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.key)}
      style={{
        width: '100%',
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
        boxSizing: 'border-box',
      }}
    >
      <img src={option.image} alt="" draggable={false} style={{ width: 80, height: 80, objectFit: 'cover', flexShrink: 0 }} />
      <p style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 18, color: '#4d4d4d', lineHeight: 'normal', textAlign: 'center' }}>
        {option.label}
      </p>
    </button>
  );
}

export default function CareForPageMobile({ isOpen, onContinue }) {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#f9f9f9', zIndex: 1200, overflowY: 'auto' }}>
      <div style={{ width: '100%', padding: '48px 24px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'flex-start' }}>
        <CheckoutStepperMobile currentStep={1} />

        <SubProgressBar filled={2} total={5} />

        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 24px',
            borderRadius: 40,
            background: '#fff',
            boxSizing: 'border-box',
            ...DOT_GRID_BG,
          }}
        >
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 48 }}>
            <p style={{ margin: 0, width: '100%', fontFamily: FONT, fontWeight: 500, fontSize: 24, color: '#000', lineHeight: '32px', textAlign: 'center' }}>
              Who is this care for?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start', width: '100%' }}>
              {OPTIONS.map((option) => (
                <OptionCardMobile key={option.key} option={option} onSelect={onContinue} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
