const STEPS = ['Purchase Summery', 'User Details & shipping address', 'Payment'];

// Per-step progress-ring background (Figma "Mobile" component's ring graphic
// grows a green arc further around per step). No distinct asset exists yet
// for the final Payment step, so it reuses the step-1 (index 1) ring.
const STEP_RINGS = ['/assets/checkout/step-ring.svg', '/assets/checkout/step-ring-2.svg', '/assets/checkout/step-ring-2.svg'];

/*
  Mobile checkout stepper — Figma node 12185:6187 ("Mobile" component,
  property1="1"/"2"). Unlike the desktop CheckoutStepper (a horizontal row of
  all 3 steps), mobile shows only the CURRENT step: a ring badge with
  "N /3" + the step title and a "Next: ..." subtitle. `currentStep` is
  0-indexed, matching CheckoutStepper's convention.
*/
export default function CheckoutStepperMobile({ currentStep = 0 }) {
  const title = STEPS[currentStep];
  const next = STEPS[currentStep + 1];

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', width: '100%', paddingBottom: 12, borderBottom: '1px solid #ccc', boxSizing: 'border-box' }}>
      <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={STEP_RINGS[currentStep] || STEP_RINGS[STEP_RINGS.length - 1]} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', gap: 0, lineHeight: 0, whiteSpace: 'nowrap' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 48, color: '#000', lineHeight: 'normal' }}>{currentStep + 1}</span>
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300, fontSize: 16, color: '#808080', letterSpacing: '0.5184px', lineHeight: '28px' }}>/{STEPS.length}</span>
        </div>
      </div>
      <div style={{ flex: '1 0 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <p style={{ margin: 0, width: '100%', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 16, color: '#000', letterSpacing: '0.5178px', lineHeight: '24px' }}>
          {title}
        </p>
        {next && (
          <p style={{ margin: 0, width: '100%', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 14, color: '#808080', letterSpacing: '0.4536px', lineHeight: '24px' }}>
            Next : {next}
          </p>
        )}
      </div>
    </div>
  );
}
