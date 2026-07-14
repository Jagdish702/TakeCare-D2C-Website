import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CANVAS_W = 1440;
const CANVAS_H = 1100;

// State 0: annotated front view
const SPEC_IMG = '/assets/specifications/spec-device.png';
const SPEC_W   = 440.816;
const SPEC_H   = 600;
const SPEC_L   = (CANVAS_W - SPEC_W) / 2;  // 499.592
const SPEC_T   = 298;

// States 1–4: touchscreen close-up
const STATE1_IMG   = '/assets/specifications/spec-state1.png';
const STATE1_SCALE = 979 / SPEC_W;  // 2.2207

// State 3: device sits 60px below grid bottom
const STATE3_Y = 387;

// State 5–6: angled product photo
// IMG6_Y: Figma outer h=1100, items-center, right-col h=1246 → (1100-1246)/2 = -73
const STATE6_IMG = '/assets/specifications/spec-state6.png';
const IMG6_W     = 979;
const IMG6_H     = 1332;
const IMG6_Y     = -73;

// State 9: bottom/side device view
// Figma: center at canvas (732.5, 1395) → left=46, top=461, 1373×1868
const STATE9_IMG   = '/assets/specifications/spec-state9.png';
const IMG9_W       = 1373;
const IMG9_H       = 1868;
const IMG9_L       = Math.round(720 + 12.5 - IMG9_W / 2);  // 46
const IMG9_T       = Math.round(550 + 845 - IMG9_H / 2);   // 461
const IMG9_START_Y = CANVAS_H - IMG9_T;                     // 639 — fully below canvas

// 1200vh outer: 1100vh real scroll → 22-unit timeline → 50vh/unit
const OUTER_H = '1200vh';

const GRID_L = (CANVAS_W - 1000) / 2;  // 220

const CARDS = [
  {
    col: 1, row: 1,
    icon: '/assets/specifications/icons/magnetic-lock.svg',
    title: 'Magnetic Lock',
    body: (
      <>
        A magnetic lock secures the slot with a single push, at dose time the right slot glows green.
        Take it and shut the slot; that close is the confirmation,{' '}
        <strong style={{ fontWeight: 700 }}>IR sensors confirm each dose is taken.</strong>
      </>
    ),
    fontSize: 18, tracking: '0.5825px',
  },
  {
    col: 2, row: 1,
    icon: '/assets/specifications/icons/medical-grade.svg',
    title: 'Medical-grade build.',
    body: 'Super White ABS / polycarbonate with a matte, anti-microbial finish — non-reflective and easy to wipe clean.',
    fontSize: 18, tracking: '0.5825px',
  },
  {
    col: 3, row: 1,
    icon: '/assets/specifications/icons/marked-for-everyone.svg',
    title: 'Marked for everyone',
    body: 'Each slot carries a number, a pull-arrow, and a Braille mark — moulded into the surface, never printed, so they never rub off. Built so low-vision and blind users find the right slot by touch.',
    fontSize: 16, tracking: '0.5184px',
  },
  {
    col: 1, row: 2,
    icon: '/assets/specifications/icons/see-whats-left.svg',
    title: "See what's left",
    body: 'A clear window on the front of each slot, with a slight inward tilt that nudges pills forward, shows how much medicine remains at a glance.',
    fontSize: 16, tracking: '0.5184px',
  },
  {
    col: 2, row: 2,
    icon: '/assets/specifications/icons/made-for-older-hands.svg',
    title: 'Made for older hands',
    body: "The two everyday keys — Taken and Snooze — sit raised for a confident press; the rest stay flush so they're never hit by accident.",
    fontSize: 16, tracking: '0.5184px',
  },
  {
    col: 3, row: 2,
    icon: '/assets/specifications/icons/stable-base.svg',
    title: 'Stable base',
    body: 'A 1 mm rubber mat grips the surface and seals each slot, blocking light bleed between stacked trays.',
    fontSize: 18, tracking: '0.5825px',
  },
];

function StatItem({ number, unit, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', whiteSpace: 'nowrap' }}>
        <span
          className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
          style={{ fontSize: 88, fontWeight: 300, fontFamily: 'Inter, sans-serif', color: '#000', lineHeight: 1 }}
        >
          {number}
        </span>
        <span
          className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
          style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Inter, sans-serif', color: '#999999', letterSpacing: '0.5184px', lineHeight: '28px', paddingBottom: 10 }}
        >
          {unit}
        </span>
      </div>
      <div style={{ width: '100%', height: 1, background: 'rgba(0,0,0,0.12)' }} />
      <span
        className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
        style={{ fontSize: 16, fontWeight: 500, fontFamily: 'Inter, sans-serif', color: '#30956A', letterSpacing: '0.5184px', lineHeight: '28px', textAlign: 'center' }}
      >
        {label}
      </span>
    </div>
  );
}

export default function SpecificationsSection() {
  const outerRef     = useRef(null);
  const canvasRef    = useRef(null);
  const specRef      = useRef(null);
  const state1Ref    = useRef(null);
  const titleRef     = useRef(null);
  const gridRef      = useRef(null);
  const state6ImgRef  = useRef(null);
  const leftTextRef   = useRef(null);
  const leftText2Ref  = useRef(null);
  const state9ImgRef  = useRef(null);
  const leftText3Ref  = useRef(null);

  useEffect(() => {
    // StrictMode fix: ctx.revert() strips GSAP inline opacity; React won't re-apply unchanged
    // JSX props on remount, so set imperatively before GSAP runs.
    if (gridRef.current)      gridRef.current.style.opacity      = '0';
    if (state1Ref.current)    state1Ref.current.style.opacity    = '0';
    if (state6ImgRef.current) { state6ImgRef.current.style.opacity = '1'; state6ImgRef.current.style.transform = 'translateX(100%)'; }
    if (leftTextRef.current)   leftTextRef.current.style.opacity  = '0';
    if (leftText2Ref.current)  leftText2Ref.current.style.opacity = '0';
    if (state9ImgRef.current)  state9ImgRef.current.style.opacity = '0';
    if (leftText3Ref.current)  leftText3Ref.current.style.opacity = '0';

    const updateScale = () => {
      if (!canvasRef.current) return;
      const vw = document.documentElement.clientWidth;
      const vh = document.documentElement.clientHeight;
      const s  = Math.min(1, vw / CANVAS_W, (vh - 52) / CANVAS_H);
      const ox = (vw - CANVAS_W * s) / 2;
      const oy = 52 + ((vh - 52) - CANVAS_H * s) / 2;
      canvasRef.current.style.transform = `translate(${ox}px, ${oy}px) scale(${s})`;

      // State 5-6 image lives OUTSIDE the canvas so its right edge reaches the viewport
      // right edge (right:0 on the sticky container), sized to match canvas scale.
      if (state6ImgRef.current) {
        state6ImgRef.current.style.top    = `${oy + IMG6_Y * s}px`;
        state6ImgRef.current.style.width  = `${IMG6_W * s}px`;
        state6ImgRef.current.style.height = `${IMG6_H * s}px`;
      }
    };
    updateScale();
    const raf = requestAnimationFrame(updateScale);
    window.addEventListener('resize', updateScale);

    const ctx = gsap.context(() => {
      if (
        !specRef.current || !state1Ref.current || !titleRef.current ||
        !gridRef.current || !outerRef.current ||
        !state6ImgRef.current || !leftTextRef.current || !leftText2Ref.current ||
        !state9ImgRef.current || !leftText3Ref.current
      ) return;

      gsap.set(state1Ref.current,    { scale: 1, opacity: 0, transformOrigin: 'center top' });
      gsap.set(gridRef.current,      { opacity: 0 });
      gsap.set(state6ImgRef.current, { opacity: 1, x: '100%' });
      gsap.set(leftTextRef.current,   { opacity: 0, y: 80 });
      gsap.set(leftText2Ref.current,  { opacity: 0, y: 80 });
      gsap.set(state9ImgRef.current,  { opacity: 0, y: IMG9_START_Y });
      gsap.set(leftText3Ref.current,  { opacity: 0, y: 80 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start:   'top top',
          end:     'bottom bottom',
          scrub:   1.5,
        },
      });

      // ── Beat 0→2: State 0 → 1 ──────────────────────────────────────────
      tl.to(specRef.current,   { opacity: 0, duration: 0.4, ease: 'none' }, 0);
      tl.to(state1Ref.current, { opacity: 1, duration: 0.4, ease: 'none' }, 0);
      tl.to(state1Ref.current, { scale: STATE1_SCALE, duration: 2, ease: 'none' }, 0);

      // ── Beat 2→4: State 1 → 2 ──────────────────────────────────────────
      tl.to(state1Ref.current, { y: 393, duration: 2, ease: 'none' }, 2);

      // ── Beat 4→6: State 2 → 3 ──────────────────────────────────────────
      tl.to(titleRef.current,  { opacity: 0, duration: 1.5, ease: 'none' }, 4);
      tl.to(gridRef.current,   { opacity: 1, duration: 1.5, ease: 'none' }, 4);
      tl.to(state1Ref.current, { y: STATE3_Y, duration: 2, ease: 'none' }, 4);

      // ── Beat 6→8: State 3 → 4 ──────────────────────────────────────────
      tl.to(gridRef.current, { opacity: 0, duration: 1.5, ease: 'none' }, 6);

      // ── Beat 8→10: State 4 → 5 ─────────────────────────────────────────
      // Device vanishes in place
      tl.to(state1Ref.current, { opacity: 0, duration: 2, ease: 'power2.in' }, 8);

      // ── Beat 10→12: State 5 → 6 ────────────────────────────────────────
      // After device fully gone, angled product photo slides in from the right
      tl.to(state6ImgRef.current, { x: 0, duration: 2, ease: 'power2.out' }, 10);

      // ── Beat 12→14: State 6 → 7 ────────────────────────────────────────
      // Left content rises from 80px below into centred position
      tl.to(leftTextRef.current, { opacity: 1, y: 0, duration: 2, ease: 'power2.out' }, 12);

      // ── Beat 14→16: left text exits upward ─────────────────────────────
      tl.to(leftTextRef.current,  { opacity: 0, y: -100, duration: 2, ease: 'power2.in' }, 14);

      // ── Beat 16→18: 3-card column rises from below (after first text gone)
      tl.to(leftText2Ref.current, { opacity: 1, y: 0,    duration: 2, ease: 'power2.out' }, 16);

      // ── Beat 18→20: State 8 exit ────────────────────────────────────────
      // Product image exits right, 3-card column exits upward simultaneously
      tl.to(state6ImgRef.current, { x: '100%', duration: 2, ease: 'power2.in' }, 18);
      tl.to(leftText2Ref.current, { opacity: 0, y: -100, duration: 2, ease: 'power2.in' }, 18);

      // ── Beat 20→22: State 9 enter ───────────────────────────────────────
      // New device image rises from below canvas, 2×2 grid fades in from below
      tl.to(state9ImgRef.current, { opacity: 1, y: 0, duration: 2, ease: 'power2.out' }, 20);
      tl.to(leftText3Ref.current, { opacity: 1, y: 0, duration: 2, ease: 'power2.out' }, 20);
    }, outerRef);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', updateScale);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={outerRef} style={{ height: OUTER_H }}>

      {/* Pinned viewport */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: '#fff' }}>

        {/* ── State 5–6: angled product photo ───────────────────────────────
            Lives OUTSIDE the canvas so right:0 maps to the VIEWPORT right edge,
            not the canvas right edge. top/width/height set dynamically by
            updateScale() to stay in sync with the canvas scale.
            zIndex:1 puts it behind the canvas (zIndex:2), but canvas is transparent
            so the image shows through wherever canvas has no opaque content.       */}
        <div
          ref={state6ImgRef}
          style={{ position: 'absolute', right: 0, opacity: 0, zIndex: 1 }}
        >
          <img
            src={STATE6_IMG}
            alt="TakeCare device flexible storage compartments"
            draggable={false}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* ── 1440×1100 canvas ──────────────────────────────────────────────
            zIndex:2 keeps it above the product image. Canvas is transparent
            (no background) so state6 image shows through from behind.
            overflow:hidden clips the device's diagonal exit animation.          */}
        <div
          ref={canvasRef}
          style={{
            position: 'absolute', top: 0, left: 0,
            width: CANVAS_W, height: CANVAS_H,
            transformOrigin: '0 0',
            overflow: 'hidden',
            zIndex: 2,
          }}
        >

          {/* ── Title — fades out in State 3 ─────────────────────────────── */}
          <div
            ref={titleRef}
            style={{
              position: 'absolute', zIndex: 2,
              top: 60, left: 120, right: 120,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 32, textAlign: 'center',
            }}
          >
            <p
              className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
              style={{ color: '#008EB1', fontSize: 24, fontWeight: 500, fontFamily: 'Inter, sans-serif', letterSpacing: '0.3888px', lineHeight: 1, margin: 0 }}
            >
              Specifications
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 48 }}>
              <h2
                className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
                style={{ fontSize: 88, fontWeight: 700, color: '#000', fontFamily: 'Inter, sans-serif', lineHeight: 1, whiteSpace: 'nowrap', margin: 0, textShadow: '0px 2px 20px rgba(0,65,114,0.08)' }}
              >
                Engineered to last.
              </h2>
              <p
                className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
                style={{ fontSize: 24, fontWeight: 500, color: '#808080', fontFamily: 'Inter, sans-serif', letterSpacing: '0.3888px', lineHeight: 1, whiteSpace: 'nowrap', margin: 0 }}
              >
                Precision, inside out. · Proof in every detail.
              </p>
            </div>
          </div>

          {/* ── State 3: Feature grid ─────────────────────────────────────── */}
          <div
            ref={gridRef}
            style={{
              position: 'absolute', zIndex: 3,
              top: 60, left: GRID_L, width: 1000,
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gridTemplateRows: 'repeat(2, fit-content(100%))',
              columnGap: 60, rowGap: 60,
              opacity: 0,
            }}
          >
            {CARDS.map(({ col, row, icon, title, body, fontSize, tracking }) => (
              <div
                key={title}
                style={{ gridColumn: col, gridRow: row, display: 'flex', flexDirection: 'column', gap: 24, alignSelf: 'start' }}
              >
                <img src={icon} alt="" draggable={false} style={{ width: 48, height: 48, objectFit: 'contain', flexShrink: 0 }} />
                <p
                  className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
                  style={{ fontSize: 24, fontWeight: 500, color: '#000', fontFamily: 'Inter, sans-serif', letterSpacing: '0.3888px', lineHeight: 'normal', margin: 0 }}
                >
                  {title}
                </p>
                <p
                  className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
                  style={{ fontSize, fontWeight: 300, color: '#4D4D4D', fontFamily: 'Inter, sans-serif', letterSpacing: tracking, lineHeight: '28px', margin: 0 }}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>

          {/* ── State 0: annotated front-view ─────────────────────────────── */}
          <div
            ref={specRef}
            style={{ position: 'absolute', top: SPEC_T, left: SPEC_L, width: SPEC_W, height: SPEC_H }}
          >
            <img src={SPEC_IMG} alt="TakeCare device dimensions" draggable={false} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>

          {/* ── States 1–4: touchscreen close-up ─────────────────────────── */}
          <div
            ref={state1Ref}
            style={{ position: 'absolute', top: SPEC_T, left: SPEC_L, width: SPEC_W, height: SPEC_H, opacity: 0 }}
          >
            <img src={STATE1_IMG} alt="TakeCare device touchscreen interface" draggable={false} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>

          {/* ── State 6: left text block (Flexible Storage Capacity) ─────── */}
          {/* ── State 7: 3-card column (Magnetic Lock / Medical / Stable) ─── */}
          {/* Outer div vertically centres; GSAP animates y+opacity on inner   */}
          <div
            style={{
              position: 'absolute',
              left: 180, top: 0, bottom: 0,
              width: 411,
              display: 'flex', alignItems: 'center',
              zIndex: 10,
            }}
          >
            <div
              ref={leftTextRef}
              style={{ display: 'flex', flexDirection: 'column', gap: 60, opacity: 0 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
                <h2
                  className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
                  style={{ fontSize: 48, fontWeight: 500, fontFamily: 'Inter, sans-serif', color: '#000', lineHeight: 1, margin: 0 }}
                >
                  Flexible Storage Capacity
                </h2>
                <p
                  className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
                  style={{ fontSize: 18, fontWeight: 300, fontFamily: 'Inter, sans-serif', color: '#4D4D4D', letterSpacing: '0.5825px', lineHeight: '28px', margin: 0 }}
                >
                  <strong style={{ fontWeight: 700, color: '#000' }}>One slot, one month.</strong>
                  {' '}Six compartments are for regular medications, and the two larger ones offer three times the storage for bigger pills or higher-volume meds. Drop a full sealed strip into the slot — no peeling tablets from foil. Each slot holds up to 30 days, so you{' '}
                  <strong style={{ fontWeight: 700, color: '#30956A' }}>refill once a month</strong>
                  , not every week.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>
                <StatItem number="24" unit="mm Height" label="6 compartments" />
                <StatItem number="48" unit="mm height" label="2 compartments" />
              </div>
            </div>
          </div>

          {/* ── State 9: bottom/side device view — slides up from below canvas ── */}
          <div
            ref={state9ImgRef}
            style={{
              position: 'absolute',
              left: IMG9_L, top: IMG9_T,
              width: IMG9_W, height: IMG9_H,
              opacity: 0,
            }}
          >
            <img
              src={STATE9_IMG}
              alt="TakeCare device connectivity"
              draggable={false}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          {/* ── State 9: 2×2 feature grid (Connectivity / Charging / Audio) ───── */}
          {/* Outer: centers grid at canvas y=402 (Figma: top=calc(50%-148px)).    */}
          {/* Inner div is the GSAP target for y+opacity animation.                 */}
          <div style={{ position: 'absolute', left: 317, top: 402, width: 807, transform: 'translateY(-50%)', zIndex: 10 }}>
            <div
              ref={leftText3Ref}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', columnGap: 60, rowGap: 60, opacity: 0 }}
            >
              {/* Card 1: Connectivity */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <img src="/assets/specifications/icons/connectivity.svg" alt="" draggable={false} style={{ width: 48, height: 48, objectFit: 'contain' }} />
                <p
                  className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
                  style={{ fontSize: 24, fontWeight: 500, fontFamily: 'Inter, sans-serif', color: '#000', letterSpacing: '0.3888px', lineHeight: 'normal', margin: 0 }}
                >
                  Connectivity
                </p>
                <p
                  className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
                  style={{ fontSize: 18, fontWeight: 300, fontFamily: 'Inter, sans-serif', color: '#4D4D4D', letterSpacing: '0.5825px', lineHeight: '28px', margin: 0 }}
                >
                  4G connectivity and nano-SIM tray with pin-hole release; high-tolerance fit.
                </p>
              </div>

              {/* Card 2: Charging Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <img src="/assets/specifications/icons/charging-input.svg" alt="" draggable={false} style={{ width: 48, height: 48, objectFit: 'contain' }} />
                <p
                  className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
                  style={{ fontSize: 24, fontWeight: 500, fontFamily: 'Inter, sans-serif', color: '#000', letterSpacing: '0.3888px', lineHeight: 'normal', margin: 0 }}
                >
                  Charging Input
                </p>
                <p
                  className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
                  style={{ fontSize: 18, fontWeight: 300, fontFamily: 'Inter, sans-serif', color: '#4D4D4D', letterSpacing: '0.5825px', lineHeight: '28px', margin: 0 }}
                >
                  Side-mounted charging input on the top-right panel.
                </p>
              </div>

              {/* Card 3: Audio Integration */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <img src="/assets/specifications/icons/audio-integration.svg" alt="" draggable={false} style={{ width: 48, height: 48, objectFit: 'contain' }} />
                <p
                  className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
                  style={{ fontSize: 24, fontWeight: 500, fontFamily: 'Inter, sans-serif', color: '#000', letterSpacing: '0.3888px', lineHeight: 'normal', margin: 0 }}
                >
                  Audio Integration
                </p>
                <p
                  className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
                  style={{
                    fontSize: 18, fontWeight: 300, fontFamily: 'Inter, sans-serif',
                    letterSpacing: '0.5825px', lineHeight: '28px', margin: 0,
                    background: 'linear-gradient(to bottom, #ff9191, #ba0000)',
                    WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
                  }}
                >
                  Audio Integration
                </p>
              </div>
            </div>
          </div>

          {/* ── State 8: 3-card column — Magnetic Lock / Medical-grade / Stable ── */}
          {/* Same outer centering wrapper; inner div animated by GSAP              */}
          <div
            style={{
              position: 'absolute',
              left: 180, top: 0, bottom: 0,
              width: 329,
              display: 'flex', alignItems: 'center',
              zIndex: 10,
            }}
          >
            <div
              ref={leftText2Ref}
              style={{ display: 'flex', flexDirection: 'column', gap: 60, opacity: 0 }}
            >

              {/* Card 1: Magnetic Lock */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <img src="/assets/specifications/icons/magnetic-lock.svg" alt="" draggable={false} style={{ width: 48, height: 48, objectFit: 'contain' }} />
                <p
                  className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
                  style={{ fontSize: 24, fontWeight: 500, fontFamily: 'Inter, sans-serif', color: '#000', letterSpacing: '0.3888px', lineHeight: 'normal', margin: 0 }}
                >
                  Magnetic Lock
                </p>
                <p
                  className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
                  style={{ fontSize: 18, fontWeight: 300, fontFamily: 'Inter, sans-serif', color: '#4D4D4D', letterSpacing: '0.5825px', lineHeight: '28px', margin: 0 }}
                >
                  A magnetic lock secures the slot with a single push, at dose time the right slot glows green — no labels to read. Take it and shut the slot; that close is the confirmation,{' '}
                  <strong style={{ fontWeight: 700, color: '#000' }}>IR sensors confirm each dose is taken.</strong>
                </p>
              </div>

              {/* Card 2: Medical-grade build. */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <img src="/assets/specifications/icons/medical-grade.svg" alt="" draggable={false} style={{ width: 48, height: 48, objectFit: 'contain' }} />
                <p
                  className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
                  style={{ fontSize: 24, fontWeight: 500, fontFamily: 'Inter, sans-serif', color: '#000', letterSpacing: '0.3888px', lineHeight: 'normal', margin: 0 }}
                >
                  Medical-grade build.
                </p>
                <p
                  className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
                  style={{ fontSize: 18, fontWeight: 300, fontFamily: 'Inter, sans-serif', color: '#4D4D4D', letterSpacing: '0.5825px', lineHeight: '28px', margin: 0 }}
                >
                  Super White ABS / polycarbonate with a matte, anti-microbial finish — non-reflective and easy to wipe clean.
                </p>
              </div>

              {/* Card 3: Stable base */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <img src="/assets/specifications/icons/stable-base.svg" alt="" draggable={false} style={{ width: 48, height: 48, objectFit: 'contain' }} />
                <p
                  className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
                  style={{ fontSize: 24, fontWeight: 500, fontFamily: 'Inter, sans-serif', color: '#000', letterSpacing: '0.3888px', lineHeight: 'normal', margin: 0 }}
                >
                  Stable base
                </p>
                <p
                  className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
                  style={{ fontSize: 18, fontWeight: 300, fontFamily: 'Inter, sans-serif', color: '#4D4D4D', letterSpacing: '0.5825px', lineHeight: '28px', margin: 0 }}
                >
                  A 1 mm rubber mat grips the surface and seals each slot, blocking light bleed between stacked trays.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
