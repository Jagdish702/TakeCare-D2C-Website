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

import { useContent } from '../../context/ContentContext';

const FONT = 'Inter, sans-serif';
const textTrim = '[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]';

// icon_key -> local icon asset (same 6 icons the desktop SpecificationsSection uses).
const FEATURE_ICON = {
  'magnetic-lock': '/assets/specifications/icons/magnetic-lock.svg',
  'medical-grade': '/assets/specifications/icons/medical-grade.svg',
  'marked-for-everyone': '/assets/specifications/icons/marked-for-everyone.svg',
  'see-whats-left': '/assets/specifications/icons/see-whats-left.svg',
  'made-for-older-hands': '/assets/specifications/icons/made-for-older-hands.svg',
  'reliable-every-day': '/assets/specifications/icons/reliable-every-day.svg',
};

// The "Magnetic Lock" card body ends with a bolded sentence in Figma; the DB stores
// the body as one plain-text field, so the bold tail is re-applied by locating the
// known trailing sentence (copy itself still comes from the DB row).
const MAGNETIC_LOCK_BOLD_TAIL = 'IR sensors confirm each dose is taken.';

// No 'mobile' variant rows exist in specification_connectivity_cards — the copy is
// device specs (SIM/charging/audio), identical regardless of viewport, so mobile
// reuses the 'desktop' rows directly rather than keeping a separate hardcoded copy.
const CONNECTIVITY_ICON = {
  Connectivity: '/assets/specifications/icons/connectivity.svg',
  Charging: '/assets/specifications/icons/charging-input.svg',
  'Audio Integration': '/assets/specifications/icons/audio-integration.svg',
};

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

function ConnectivityCard({ icon, title, body }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16, width: '100%' }}>
      <img src={icon} alt="" draggable={false} style={{ width: 32, height: 32 }} />
      <p className={textTrim} style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 20, lineHeight: '28px', letterSpacing: '0.324px', color: '#000' }}>
        {title}
      </p>
      <p className={textTrim} style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 16, lineHeight: '24px', letterSpacing: '0.5178px', color: '#4d4d4d' }}>
        {body}
      </p>
    </div>
  );
}

export default function SpecificationsMobile() {
  const { specifications, images } = useContent();
  const SPEC_IMG_DIMENSIONED = images['specifications-spec-device-mobile'];
  const SPEC_IMG_FRONT = images['specifications-spec-state1'];
  const SPEC_IMG_EXPLODED = images['specifications-spec-state6'];
  const SPEC_IMG_ANGLED = images['specifications-spec-state9'];
  const FEATURE_CARDS = specifications.cards
    .filter((c) => c.state_key === 'state3')
    .map((row) => {
      const idx = row.icon_key === 'magnetic-lock' ? row.body.lastIndexOf(MAGNETIC_LOCK_BOLD_TAIL) : -1;
      return {
        icon: FEATURE_ICON[row.icon_key],
        title: row.title,
        body: idx === -1 ? row.body : row.body.slice(0, idx),
        bold: idx === -1 ? undefined : row.body.slice(idx),
      };
    });
  const specStats = specifications.stats.filter((s) => s.group_key === 'specifications');
  const connectivityCards = specifications.connectivityCards
    .filter((c) => c.variant === 'desktop')
    .map((row) => ({ icon: CONNECTIVITY_ICON[row.title], title: row.title, body: row.body }));

  return (
    <div className="md:hidden" style={{ background: '#fff', display: 'flex', flexDirection: 'column', width: '100%' }}>

      {/* Title + dimensioned device photo (264/180/100mm) */}
      <SectionShell paddingY={60}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, textAlign: 'center', width: '100%' }}>
          <p className={textTrim} style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 20, lineHeight: '28px', letterSpacing: '0.324px', color: '#008EB1' }}>
            {specifications.content.eyebrow}
          </p>
          <h2 className={textTrim} style={{ margin: 0, fontFamily: FONT, fontWeight: 700, fontSize: 48, lineHeight: 'normal', color: '#000', textShadow: '0px 2px 20px rgba(0,65,114,0.08)' }}>
            {specifications.content.heading}
          </h2>
          <p className={textTrim} style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 20, lineHeight: '28px', letterSpacing: '0.324px', color: '#808080', textShadow: '0px 2px 20px rgba(0,65,114,0.08)' }}>
            {specifications.content.subhead}
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
            {specifications.storageCapacity.heading}
          </p>
          {/* This paragraph's bespoke wording (with inline emphasis) has no matching DB field —
              specifications.storageCapacity.body holds a differently-worded plain-text version
              used by the standalone StorageCapacitySection instead. Kept hardcoded. */}
          <p className={textTrim} style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 16, lineHeight: '24px', letterSpacing: '0.5178px', color: '#808080' }}>
            One slot holds a month&rsquo;s worth of meds, with{' '}
            <span style={{ fontWeight: 700, color: '#000' }}>six compartments for regular pills and two for larger ones.</span>
            {' '}Simply drop a sealed strip in&mdash;no peeling needed&mdash;and refill monthly.
          </p>
          <div style={{ display: 'flex', gap: 38, alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <span style={{ fontFamily: FONT, fontWeight: 300, fontSize: 70, color: '#000' }}>{specStats[0].number}</span>
                <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 12, lineHeight: 1.5, letterSpacing: '0.3883px', color: '#808080' }}>{specStats[0].unit}</span>
              </div>
              <div style={{ width: '100%', height: 1, background: '#e5e5e5' }} />
              <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 12, lineHeight: 1.5, letterSpacing: '0.3883px', color: '#30956A' }}>{specStats[0].label}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <span style={{ fontFamily: FONT, fontWeight: 300, fontSize: 70, color: '#000' }}>{specStats[1].number}</span>
                <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 12, lineHeight: 1.5, letterSpacing: '0.3883px', color: '#808080' }}>{specStats[1].unit}</span>
              </div>
              <div style={{ width: '100%', height: 1, background: '#e5e5e5' }} />
              <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 12, lineHeight: 1.5, letterSpacing: '0.3883px', color: '#30956A' }}>{specStats[1].label}</span>
            </div>
          </div>
        </div>
      </SectionShell>

      {/* Angled top-corner photo + connectivity/charging/audio */}
      <SectionShell paddingY={48}>
        <Photo src={SPEC_IMG_ANGLED} alt="TakeCare device top corner detail" size={200} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
          {connectivityCards.map((card) => (
            <ConnectivityCard key={card.title} {...card} />
          ))}
        </div>
      </SectionShell>

    </div>
  );
}
