import CheckoutStepperMobile from './CheckoutStepperMobile';
import { useContent } from '../../context/ContentContext';

/*
  Mobile "Would you like to be the caregiver of [Name]?" — Figma node
  14024:21403. Same content/behaviour as the desktop CaregiverConfirmPage —
  reuses CheckoutStepperMobile (currentStep=1) — single-column stacked
  option cards instead of side-by-side, mobile type sizes. Copy/options come
  from checkout.caregiverConfirmPage/checkout.optionCards via useContent().
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
        justifyContent: 'flex-end',
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
      <img src={image} alt="" draggable={false} style={{ width: 80, height: 80, flexShrink: 0, ...imageStyle }} />
      <p style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 18, color: '#4d4d4d', lineHeight: 'normal', textAlign: 'center' }}>
        {label}
      </p>
    </button>
  );
}

export default function CaregiverConfirmPageMobile({ personDetails, isOpen, onConfirm }) {
  const { checkout, images } = useContent();
  if (!isOpen) return null;

  const firstName = personDetails?.fullName?.trim().split(/\s+/)[0] || 'them';
  const [headingBefore, headingAfter] = checkout.caregiverConfirmPage.heading_template.split('{name}');
  const optionByKey = Object.fromEntries(
    checkout.optionCards.filter((o) => o.page_key === 'caregiver_confirm').map((o) => [o.option_key, o])
  );

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
            {headingBefore}<span style={{ color: '#30956a' }}>{firstName}</span>{headingAfter}
          </p>
          <p style={{ margin: 0, width: '100%', fontFamily: FONT, fontWeight: 500, fontSize: 14, color: '#808080', letterSpacing: '0.4536px', lineHeight: '24px', textAlign: 'center' }}>
            {checkout.caregiverConfirmPage.body}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'stretch', width: '100%' }}>
            <OptionCardMobile
              image={images[optionByKey.yes.image_key]}
              imageStyle={{ objectFit: 'cover' }}
              label={optionByKey.yes.label}
              onSelect={() => onConfirm?.(true)}
            />
            <OptionCardMobile
              image={images[optionByKey.no.image_key]}
              imageStyle={{ objectFit: 'contain' }}
              label={optionByKey.no.label}
              onSelect={() => onConfirm?.(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
