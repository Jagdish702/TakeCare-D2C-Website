import CheckoutStepperMobile from './CheckoutStepperMobile';

/*
  Mobile "Is it a gift? 💐" — Figma node 14024:21524. Same content/behaviour
  as the desktop GiftPage — reuses CheckoutStepperMobile (currentStep=1) —
  single-column stacked option cards instead of side-by-side, mobile type
  sizes.
*/

const FONT = 'Inter, sans-serif';

const DOT_GRID_BG = {
  backgroundImage: 'radial-gradient(circle, #e5e5e5 1px, transparent 1px)',
  backgroundSize: '24px 24px',
};

function OptionCardMobile({ image, imageStyle, label, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
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
      <div style={{ width: 96, height: 92, borderRadius: 12, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
        <img src={image} alt="" draggable={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...imageStyle }} />
      </div>
      <p style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 18, color: '#4d4d4d', lineHeight: 'normal', textAlign: 'center' }}>
        {label}
      </p>
    </button>
  );
}

export default function GiftPageMobile({ isOpen, onSelect }) {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#f9f9f9', zIndex: 1200, overflowY: 'auto' }}>
      <div style={{ width: '100%', padding: '48px 24px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'flex-start' }}>
        <CheckoutStepperMobile currentStep={1} />

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
            gap: 24,
            padding: '40px 24px',
            borderRadius: 40,
            background: '#fff',
            boxSizing: 'border-box',
            ...DOT_GRID_BG,
          }}
        >
          <p style={{ margin: 0, width: '100%', fontFamily: FONT, fontWeight: 500, fontSize: 24, color: '#000', lineHeight: '32px', textAlign: 'center' }}>
            Is it a gift? 💐
          </p>
          <p style={{ margin: 0, width: '100%', fontFamily: FONT, fontWeight: 500, fontSize: 14, color: '#808080', letterSpacing: '0.4536px', lineHeight: '24px', textAlign: 'center' }}>
            The TakeCare device will be delivered with a gift card that has your name on it.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'stretch', width: '100%' }}>
            <OptionCardMobile
              image="/assets/checkout/illustration-gift.png"
              imageStyle={{ objectFit: 'cover' }}
              label="Yes, It's a gift"
              onSelect={() => onSelect?.(true)}
            />
            <OptionCardMobile
              image="/assets/checkout/illustration-device-self.png"
              imageStyle={{ objectFit: 'cover', left: '-7.35%', top: '-3.31%', width: '107.91%', height: '107.91%' }}
              label="No, it's not"
              onSelect={() => onSelect?.(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
