// Mobile "Specifications" section — Figma section 12628:13359 ("Specifications_mobile",
// 8 states). States are Figma's own reveal-animation keyframes for a single static page;
// each state frame independently repeats the "Specifications / Engineered to last." title,
// but that's a prototyping artifact of Figma's per-frame mockups, not real page content —
// so the title renders once here, followed by the four content blocks (dimensioned photo,
// front-view + feature list, exploded view + storage stats, angled view + connectivity
// cards) in scroll order. All device photos and feature icons are reused from the desktop
// SpecificationsSection's existing assets (per user: already present, don't redownload):
// spec-device-mobile.png / spec-state1.png / spec-state6.png / spec-state9.png,
// and the icons/ SVGs shared with the desktop State-8 cards.

const SPEC_IMG_DIMENSIONED = '/assets/specifications/spec-device-mobile.png';
const SPEC_IMG_FRONT = '/assets/specifications/spec-state1.png';
const SPEC_IMG_EXPLODED = '/assets/specifications/spec-state6.png';
const SPEC_IMG_ANGLED = '/assets/specifications/spec-state9.png';

const FONT = 'Inter, sans-serif';
const textTrim = '[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]';

const FEATURE_CARDS = [
  {
    icon: '/assets/specifications/icons/magnetic-lock.svg',
    title: 'Magnetic Lock',
    body: 'A magnetic lock secures the slot with a single push, at dose time the right slot glows green. Take it and shut the slot; that close is the confirmation, ',
    bold: 'IR sensors confirm each dose is taken.',
  },
  {
    icon: '/assets/specifications/icons/medical-grade.svg',
    title: 'Medical-grade build.',
    body: 'Super White ABS / polycarbonate with a matte, anti-microbial finish — non-reflective and easy to wipe clean.',
  },
  {
    icon: '/assets/specifications/icons/see-whats-left.svg',
    title: "See what's left",
    body: 'A clear window on the front of each slot, with a slight inward tilt that nudges pills forward, shows how much medicine remains at a glance.',
  },
  {
    icon: '/assets/specifications/icons/marked-for-everyone.svg',
    title: 'Marked for everyone',
    body: 'Each slot carries a number, a pull-arrow, and a Braille mark — Mounted into the surface, never printed, so they never rub off. Built so low-vision and blind users find the right slot by touch.',
  },
  {
    icon: '/assets/specifications/icons/made-for-older-hands.svg',
    title: 'Made for older hands',
    body: "The two everyday keys — Taken and Snooze — sit raised for a confident press; the rest stay flush so they're never hit by accident.",
  },
  {
    icon: '/assets/specifications/icons/stable-base.svg',
    title: 'Stable base',
    body: 'A 1 mm rubber mat grips the surface and seals each slot, blocking light bleed between stacked trays.',
  },
];

const CONNECTIVITY_CARDS = [
  {
    icon: '/assets/specifications/icons/connectivity.svg',
    title: 'Connectivity',
    body: '4G connectivity and nano-SIM tray with pin-hole release; high-tolerance fit.',
  },
  {
    icon: '/assets/specifications/icons/charging-input.svg',
    title: 'Charging',
    body: 'Side-mounted charging input on the top-right panel along with 24 hours of battery backup.',
  },
  {
    icon: '/assets/specifications/icons/audio-integration.svg',
    title: 'Audio Integration',
    // Figma's own content here is an unfinished placeholder (a duplicate red-gradient
    // "Audio Integration" label instead of real body copy) — reproduced as-is per the
    // design rather than inventing copy the design hasn't written yet.
    bodyPlaceholder: true,
  },
];

function SectionShell({ paddingY, children }) {
  return (
    <div style={{ background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: `${paddingY}px 24px`, width: '100%' }}>
      {children}
    </div>
  );
}

function Photo({ src, alt, size }) {
  return (
    <div style={{ width: '100%', maxWidth: size, aspectRatio: '350 / 476.389' }}>
      <img
        src={src}
        alt={alt}
        draggable={false}
        style={{ width: '100%', height: '100%', objectFit: 'cover', boxShadow: '0px 2px 6px rgba(0,65,114,0.08)', borderRadius: 4 }}
      />
    </div>
  );
}

function FeatureCard({ icon, title, body, bold }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12, width: '100%' }}>
      <img src={icon} alt="" draggable={false} style={{ width: 32, height: 32 }} />
      <p className={textTrim} style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 20, lineHeight: '28px', letterSpacing: '0.324px', color: '#000' }}>
        {title}
      </p>
      <p className={textTrim} style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 16, lineHeight: '24px', letterSpacing: '0.5178px', color: '#808080' }}>
        {body}
        {bold && <span style={{ fontWeight: 700, color: '#000' }}>{bold}</span>}
      </p>
    </div>
  );
}

function ConnectivityCard({ icon, title, body, bodyPlaceholder }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16, width: '100%' }}>
      <img src={icon} alt="" draggable={false} style={{ width: 32, height: 32 }} />
      <p className={textTrim} style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 20, lineHeight: '28px', letterSpacing: '0.324px', color: '#000' }}>
        {title}
      </p>
      {bodyPlaceholder ? (
        <p
          className={textTrim}
          style={{
            margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 16, lineHeight: '24px', letterSpacing: '0.5178px',
            background: 'linear-gradient(180deg, #ff9191 0%, #ba0000 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
          }}
        >
          Audio Integration
        </p>
      ) : (
        <p className={textTrim} style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 16, lineHeight: '24px', letterSpacing: '0.5178px', color: '#4d4d4d' }}>
          {body}
        </p>
      )}
    </div>
  );
}

export default function SpecificationsMobile() {
  return (
    <div className="md:hidden" style={{ background: '#fff', display: 'flex', flexDirection: 'column', width: '100%' }}>

      {/* Title + dimensioned device photo (264/180/100mm) */}
      <SectionShell paddingY={60}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, textAlign: 'center', width: '100%' }}>
          <p className={textTrim} style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 20, lineHeight: '28px', letterSpacing: '0.324px', color: '#008EB1' }}>
            Specifications
          </p>
          <h2 className={textTrim} style={{ margin: 0, fontFamily: FONT, fontWeight: 700, fontSize: 48, lineHeight: 'normal', color: '#000', textShadow: '0px 2px 20px rgba(0,65,114,0.08)' }}>
            Engineered to last.
          </h2>
          <p className={textTrim} style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 20, lineHeight: '28px', letterSpacing: '0.324px', color: '#808080', textShadow: '0px 2px 20px rgba(0,65,114,0.08)' }}>
            Precision, inside out. · Proof in every detail.
          </p>
        </div>
        <Photo src={SPEC_IMG_DIMENSIONED} alt="TakeCare device dimensions" size={350} />
      </SectionShell>

      {/* Front-view photo + feature list */}
      <SectionShell paddingY={48}>
        <Photo src={SPEC_IMG_FRONT} alt="TakeCare device front view" size={200} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
          {FEATURE_CARDS.map((card) => (
            <FeatureCard key={card.title} {...card} />
          ))}
        </div>
      </SectionShell>

      {/* Exploded-drawer photo + flexible storage capacity */}
      <SectionShell paddingY={48}>
        <Photo src={SPEC_IMG_EXPLODED} alt="TakeCare device with slots pulled out" size={200} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48, alignItems: 'flex-start', width: '100%' }}>
          <p className={textTrim} style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 32, lineHeight: 'normal', color: '#000' }}>
            Flexible Storage Capacity
          </p>
          <p className={textTrim} style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 16, lineHeight: '24px', letterSpacing: '0.5178px', color: '#808080' }}>
            One slot holds a month&rsquo;s worth of meds, with{' '}
            <span style={{ fontWeight: 700, color: '#000' }}>six compartments for regular pills and two for larger ones.</span>
            {' '}Simply drop a sealed strip in&mdash;no peeling needed&mdash;and refill monthly.
          </p>
          <div style={{ display: 'flex', gap: 38, alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <span style={{ fontFamily: FONT, fontWeight: 300, fontSize: 70, color: '#000' }}>24</span>
                <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 12, lineHeight: 1.5, letterSpacing: '0.3883px', color: '#808080' }}>mm Height</span>
              </div>
              <div style={{ width: '100%', height: 1, background: '#e5e5e5' }} />
              <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 12, lineHeight: 1.5, letterSpacing: '0.3883px', color: '#30956A' }}>6 compartments</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <span style={{ fontFamily: FONT, fontWeight: 300, fontSize: 70, color: '#000' }}>48</span>
                <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 12, lineHeight: 1.5, letterSpacing: '0.3883px', color: '#808080' }}>mm height</span>
              </div>
              <div style={{ width: '100%', height: 1, background: '#e5e5e5' }} />
              <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 12, lineHeight: 1.5, letterSpacing: '0.3883px', color: '#30956A' }}>2 compartments</span>
            </div>
          </div>
        </div>
      </SectionShell>

      {/* Angled top-corner photo + connectivity/charging/audio */}
      <SectionShell paddingY={48}>
        <Photo src={SPEC_IMG_ANGLED} alt="TakeCare device top corner detail" size={200} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
          {CONNECTIVITY_CARDS.map((card) => (
            <ConnectivityCard key={card.title} {...card} />
          ))}
        </div>
      </SectionShell>

    </div>
  );
}
