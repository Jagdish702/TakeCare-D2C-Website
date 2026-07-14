import { useContent } from '../../context/ContentContext';

/* ── Stepper step icon — inline (not <img>) so the SVG's own drop-shadow +
     inner-shadow filter can bleed past its 24×24 box; <img> would clip it
     to the element's rendered bounds. Figma: grey (#CCCCCC) for a step not
     yet completed, green (#00B82E) once the user has moved past it — the
     currently-active step still shows grey, only completed steps go green. ── */
function StepIcon({ completed }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <g filter={`url(#stepIconFilter-${completed ? 'done' : 'todo'})`}>
        <path d="M0 12C0 5.3726 5.3726 0 12 0C18.6274 0 24 5.3726 24 12C24 18.6274 18.6274 24 12 24C5.3726 24 0 18.6274 0 12Z" fill={completed ? '#00B82E' : '#CCCCCC'} />
        <path d="M17 8.0625L10.125 14.9375L7 11.8125" stroke="white" strokeWidth="1.42857" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <filter id={`stepIconFilter-${completed ? 'done' : 'todo'}`} x="-16" y="-14" width="56" height="56" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="8" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.254902 0 0 0 0 0.447059 0 0 0 0.08 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset />
          <feGaussianBlur stdDeviation="1" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.254902 0 0 0 0 0.447059 0 0 0 0.16 0" />
          <feBlend mode="normal" in2="shape" result="effect2_innerShadow" />
        </filter>
      </defs>
    </svg>
  );
}

/* ── Shared checkout stepper — Figma "Steper" (node 12185:4782 / 12185:4716).
     `currentStep` is 0-indexed; every step before it renders as completed
     (green icon/label/dash), the current step and everything after render
     in the plain grey "not yet done" style — Figma doesn't give the active
     step its own distinct look, only completed vs. not. ── */
export default function CheckoutStepper({ currentStep = 0 }) {
  const { checkout } = useContent();
  const STEPS = [...checkout.steps].sort((a, b) => a.sort_order - b.sort_order).map((s) => s.label);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
        paddingBottom: 20,
        borderBottom: '1px solid #e5e5e5',
        width: '100%',
        flexShrink: 0,
      }}
    >
      {STEPS.map((label, i) => {
        const completed = i < currentStep;
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 12 }}>
              <StepIcon completed={completed} />
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  fontSize: 16,
                  color: completed ? '#00b82e' : '#808080',
                  letterSpacing: '0.5184px',
                  lineHeight: '28px',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  fontSize: 16,
                  color: completed ? '#00b82e' : '#b2b2b2',
                  letterSpacing: '0.2592px',
                  whiteSpace: 'nowrap',
                }}
              >
                -------------
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
