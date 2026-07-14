import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useContent } from '../../context/ContentContext';

gsap.registerPlugin(ScrollTrigger);

// Mobile "Set up & Refill Reimagined" scroll-scrubbed journey — Figma section
// 12628:11469, the "..._MOBILE" instance track (21 states, 402x887 canvas).
// Ported beat-for-beat from the desktop SetupRefillJourneySection.jsx timeline,
// reusing its exact same image assets (per user: "assets already present in
// web so reuse that") — no new asset downloads. Content/copy is identical to
// desktop; only positions/typography/pacing are mobile-specific per Figma.
//
// Position note: Figma expresses every box as "canvas-center + offset"
// (its `-translate-x-1/2 -translate-y-1/2` anchor pattern). GSAP's `x`/`y`
// tween props map to `transform: translate()`, which would collide with a
// CSS `transform: translate(-50%,-50%)` centering trick and get clobbered
// the moment GSAP takes over the transform. So every box below is
// pre-converted to plain top-left `left`/`top` pixel values via toBox() —
// GSAP then animates `left`/`top` as ordinary CSS properties, same as the
// desktop file does.

const CANVAS_W = 402;
const CANVAS_H = 887;
const CX = CANVAS_W / 2;
const CY = CANVAS_H / 2;

function toBox(offsetX, offsetY, w, h, br = 0) {
  return { left: CX + offsetX - w / 2, top: CY + offsetY - h / 2, width: w, height: h, borderRadius: br };
}

const FONT = 'Inter, sans-serif';
const HEADING_STYLE = { fontFamily: FONT, fontWeight: 500, fontSize: 24, lineHeight: '32px', color: '#000' };
const BODY_STYLE = { fontFamily: FONT, fontWeight: 300, fontSize: 20, lineHeight: '28px', letterSpacing: '0.324px', color: '#000' };

// ── Beat position tables (converted to plain left/top px via toBox) ──

// Schedule (badge "1")
const S0_RXCARD = toBox(1.17, -101.95, 99.333, 134.667);
const S0_PHONE  = toBox(1.5, 82.06, 100, 206.693, 18.908);
const S1_RXCARD = toBox(0.82, -217.47, 203.633, 276.067);
const S1_PHONE  = toBox(1.5, 159.76, 205, 423.72, 38.761);
const S2_RXCARD = toBox(-89.29, -190.5, 117.413, 162);
const S2_PHONE  = toBox(75, -186.48, 150, 310.039, 28.361);
const S3_RXCARD = toBox(-12.29, -190.5, 117.413, 162);
const S3_PHONE  = toBox(0.5, -184.5, 179, 370, 28.361);
const S5_PHONE  = toBox(0.5, -172, 191, 395, 28.361);

const BADGE1 = { x: -131, y: 69.5 };
const HEAD_SCHEDULE = { x: -160, y: 128, w: 310 };
const LIST1 = { x: -161, y: 185.5, w: 310 };
const LIST2 = { x: -160, y: 257.5, w: 295 };

// Load (badge "2")
const COURIER_INIT  = toBox(0, 184.69, 100.117, 156.373);
const PERSON_BIG     = toBox(0.5, -62, 321, 501);
const PERSON_SMALL   = toBox(0, -197, 204, 319);
const INSET_PHONE    = toBox(88, -102.14, 100, 204.722, 18.908);

const BADGE2 = { x: -133, y: 44.5 };
const HEAD_LOAD = { x: -159, y: 103.5, w: 321 };
const LOAD_P1 = { x: -159, y: 155.5, w: 306 };
const LOAD_P2 = { x: -159, y: 255.5, w: 306 };

// Done (badge "3")
const PHONE13_BOX = toBox(0.5, 0.5, 301, 592);
const DISPENSER14_BOX = toBox(-11.78, -215.58, 226.4, 291.8);
const PHONE_DETAIL_BOX = toBox(63.17, -120.83, 123.6, 243.6);
const PHONE16_BIG_BOX = toBox(0, -193, 176, 347);

const BADGE3 = { x: -118, y: 35.5 };
const HEAD_DONE = { x: -148, y: 94.5, w: 296 };
const DONE_P1 = { x: -148, y: 146.5, w: 301 };
const DONE_P2 = { x: -148, y: 302.5, w: 307 };

// Refill (badge "4")
const PHONE18_BIG_BOX = toBox(-3, -5, 276, 565);
const PHONE18_SMALL_BOX = toBox(0, -201, 162, 333);

const BADGE4 = { x: -122, y: 18.5 };
const HEAD_REFILL = { x: -152, y: 77.5, w: 315 };
const REFILL_P1 = { x: -152, y: 129.5, w: 300 };
const REFILL_P2 = { x: -152, y: 285.5, w: 300 };

const TOTAL_BEATS = 23;
const OUTER_H = `${TOTAL_BEATS * 130}vh`;

function Box({ innerRef, pos, children }) {
  return (
    <div ref={innerRef} style={{ position: 'absolute', ...pos, overflow: 'hidden' }}>
      {children}
    </div>
  );
}

function CoverImg({ innerRef, src, extra }) {
  return (
    <img
      ref={innerRef}
      alt=""
      draggable={false}
      src={src}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', maxWidth: 'none', ...extra }}
    />
  );
}

export default function SetupRefillJourneyMobile() {
  const { setupRefillJourney, images } = useContent();
  const ASSETS = {
    bg:        images['setup-refill-set-refill-reimagined-mobile-blue-bg'],
    bg18:      images['setup-refill-set-refill-reimagined-mobile-green-bg-img'],
    rxCard:    images['setup-refill-rx-card'],
    phone1:    images['setup-refill-phone1'],
    phone2:    images['setup-refill-phone2-s2'],
    phone3:    images['setup-refill-phone3-s3'],
    phone4:    images['setup-refill-phone4-s4'],
    person6:   images['setup-refill-person-s6'],
    dispenserEmpty:  images['setup-refill-pill-dispenser-s8'],
    dispenserFilled: images['setup-refill-pill-dispenser-s9'],
    phone10:   images['setup-refill-phone-s10'],
    phone13:   images['setup-refill-phone-s13'],
    dispenser14: images['setup-refill-dispenser-s14'],
    phone14:   images['setup-refill-phone-s14'],
    dispenser15: images['setup-refill-dispenser-s15'],
    phone15:   images['setup-refill-phone-s15'],
    phone16:   images['setup-refill-phone-s16'],
    phone18:   images['setup-refill-phone-s18'],
    phone20:   images['setup-refill-phone-s20'],
  };
  const stepByKey = Object.fromEntries(setupRefillJourney.steps.map((s) => [s.step_key, s]));
  const textByKey = (step) => Object.fromEntries(step.texts.map((t) => [t.text_key, t.body]));
  const scheduleTexts = textByKey(stepByKey.schedule);
  const loadTexts = textByKey(stepByKey.load);
  const doneTexts = textByKey(stepByKey.done);
  const refillTexts = textByKey(stepByKey.refill);
  // Mobile renders single flowing paragraphs (no whiteSpace:pre), unlike the desktop
  // timeline's forced multi-line breaks — collapse the DB's explicit "\n" breaks to spaces.
  const flatten = (s) => s.replace(/\n/g, ' ');

  const outerRef = useRef(null);
  const canvasRef = useRef(null);

  const bgRef = useRef(null);
  const bg18Ref = useRef(null);

  // Schedule
  const rxCardWrapRef = useRef(null);
  const phoneWrapRef = useRef(null);
  const phone1Ref = useRef(null);
  const phone2Ref = useRef(null);
  const phone3Ref = useRef(null);
  const phone4Ref = useRef(null);
  const badge1Ref = useRef(null);
  const headScheduleRef = useRef(null);
  const list1Ref = useRef(null);
  const list2Ref = useRef(null);

  // Load
  const courierWrapRef = useRef(null);
  const personRef = useRef(null);
  const dispenserEmptyRef = useRef(null);
  const dispenserFilledRef = useRef(null);
  const insetPhoneWrapRef = useRef(null);
  const insetPhoneRef = useRef(null);
  const badge2Ref = useRef(null);
  const headLoadRef = useRef(null);
  const loadP1Ref = useRef(null);
  const loadP2Ref = useRef(null);

  // Done
  const phone13WrapRef = useRef(null);
  const dispenserWrapRef = useRef(null);
  const dispenser14Ref = useRef(null);
  const dispenser15Ref = useRef(null);
  const phoneDetailWrapRef = useRef(null);
  const phone14Ref = useRef(null);
  const phone15Ref = useRef(null);
  const phone16WrapRef = useRef(null);
  const phone16Ref = useRef(null);
  const badge3Ref = useRef(null);
  const headDoneRef = useRef(null);
  const doneP1Ref = useRef(null);
  const doneP2Ref = useRef(null);

  // Refill
  const refillPhoneWrapRef = useRef(null);
  const phone18Ref = useRef(null);
  const phone20Ref = useRef(null);
  const badge4Ref = useRef(null);
  const headRefillRef = useRef(null);
  const refillP1Ref = useRef(null);
  const refillP2Ref = useRef(null);

  useEffect(() => {
    const updateScale = () => {
      if (!canvasRef.current) return;
      const vw = document.documentElement.clientWidth;
      const vh = document.documentElement.clientHeight;
      const s = Math.min(1, vw / CANVAS_W, (vh - 52) / CANVAS_H);
      const ox = (vw - CANVAS_W * s) / 2;
      const oy = 52 + ((vh - 52) - CANVAS_H * s) / 2;
      canvasRef.current.style.transform = `translate(${ox}px, ${oy}px) scale(${s})`;
    };
    updateScale();
    const raf = requestAnimationFrame(updateScale);
    window.addEventListener('resize', updateScale);

    const ctx = gsap.context(() => {
      // ── Initial state (S0) ──────────────────────────────────────────────
      gsap.set(bg18Ref.current, { opacity: 0 });

      gsap.set(rxCardWrapRef.current, { opacity: 0, ...S0_RXCARD });
      gsap.set(phoneWrapRef.current, { opacity: 0, ...S0_PHONE });
      gsap.set([phone2Ref.current, phone3Ref.current, phone4Ref.current], { opacity: 0 });
      gsap.set(phone1Ref.current, { opacity: 1 });
      gsap.set([badge1Ref.current, headScheduleRef.current, list1Ref.current, list2Ref.current], { opacity: 0 });

      gsap.set(courierWrapRef.current, { opacity: 0, ...COURIER_INIT });
      gsap.set(personRef.current, { opacity: 1 });
      gsap.set([dispenserEmptyRef.current, dispenserFilledRef.current], { opacity: 0 });
      gsap.set(insetPhoneWrapRef.current, { opacity: 0, ...INSET_PHONE });
      gsap.set([badge2Ref.current, headLoadRef.current, loadP1Ref.current, loadP2Ref.current], { opacity: 0 });

      gsap.set(phone13WrapRef.current, { opacity: 0, ...PHONE13_BOX });
      gsap.set(dispenserWrapRef.current, { opacity: 0, ...DISPENSER14_BOX });
      gsap.set(dispenser15Ref.current, { opacity: 0 });
      gsap.set(dispenser14Ref.current, { opacity: 1 });
      gsap.set(phoneDetailWrapRef.current, { opacity: 0, ...PHONE_DETAIL_BOX });
      gsap.set(phone15Ref.current, { opacity: 0 });
      gsap.set(phone14Ref.current, { opacity: 1 });
      gsap.set(phone16WrapRef.current, { opacity: 0, ...PHONE16_BIG_BOX });
      gsap.set([badge3Ref.current, headDoneRef.current, doneP1Ref.current, doneP2Ref.current], { opacity: 0 });

      gsap.set(refillPhoneWrapRef.current, { opacity: 0, ...PHONE18_BIG_BOX });
      gsap.set(phone20Ref.current, { opacity: 0 });
      gsap.set(phone18Ref.current, { opacity: 1 });
      gsap.set([badge4Ref.current, headRefillRef.current, refillP1Ref.current, refillP2Ref.current], { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
        },
      });

      // ── Schedule ────────────────────────────────────────────────────────
      // S0 → S1: rx card + phone zoom in
      tl.to(rxCardWrapRef.current, { opacity: 1, ...S1_RXCARD, duration: 1, ease: 'none' }, 0);
      tl.to(phoneWrapRef.current,  { opacity: 1, ...S1_PHONE,  duration: 1, ease: 'none' }, 0);

      // S1 → S2: shrink + move up, badge/heading/list1 reveal
      tl.to(rxCardWrapRef.current, { ...S2_RXCARD, duration: 1, ease: 'none' }, 2.5);
      tl.to(phoneWrapRef.current,  { ...S2_PHONE,  duration: 1, ease: 'none' }, 2.5);
      tl.to([badge1Ref.current, headScheduleRef.current, list1Ref.current], { opacity: 1, duration: 1, ease: 'none' }, 2.5);

      // S2 → S3: phone box shifts, crossfade phone1 → phone2 (Daily Schedule)
      tl.to(rxCardWrapRef.current, { ...S3_RXCARD, duration: 0.5, ease: 'none' }, 3.5);
      tl.to(phoneWrapRef.current,  { ...S3_PHONE,  duration: 0.5, ease: 'none' }, 3.5);
      tl.to(phone1Ref.current, { opacity: 0, duration: 0.4, ease: 'none' }, 3.5);
      tl.to(phone2Ref.current, { opacity: 1, duration: 0.4, ease: 'none' }, 3.5);

      // S3 → S4: crossfade phone2 → phone3 (meal timing), list2 reveals
      tl.to(phone2Ref.current, { opacity: 0, duration: 0.4, ease: 'none' }, 4.5);
      tl.to(phone3Ref.current, { opacity: 1, duration: 0.4, ease: 'none' }, 4.5);
      tl.to(list2Ref.current,  { opacity: 1, duration: 1,   ease: 'none' }, 4.5);

      // S4 → S5: crossfade phone3 → phone4 (allotment success), box grows
      tl.to(phoneWrapRef.current, { ...S5_PHONE, duration: 0.5, ease: 'none' }, 5.5);
      tl.to(phone3Ref.current, { opacity: 0, duration: 0.4, ease: 'none' }, 5.5);
      tl.to(phone4Ref.current, { opacity: 1, duration: 0.4, ease: 'none' }, 5.5);

      // S5 → S6: everything fades to blank
      tl.to([rxCardWrapRef.current, phoneWrapRef.current, badge1Ref.current, headScheduleRef.current, list1Ref.current, list2Ref.current],
        { opacity: 0, duration: 0.6, ease: 'none' }, 7);

      // ── Load ────────────────────────────────────────────────────────────
      // S6 → S7: courier fades in big
      tl.to(courierWrapRef.current, { opacity: 1, ...PERSON_BIG, duration: 1, ease: 'none' }, 8);

      // S7 → S8: courier shrinks + moves up, badge2/heading/para1 reveal
      tl.to(courierWrapRef.current, { ...PERSON_SMALL, duration: 1, ease: 'none' }, 9);
      tl.to([badge2Ref.current, headLoadRef.current, loadP1Ref.current], { opacity: 1, duration: 1, ease: 'none' }, 9);

      // S8 → S9: crossfade courier → empty dispenser, para2 reveals
      tl.to(personRef.current,          { opacity: 0, duration: 0.4, ease: 'none' }, 10);
      tl.to(dispenserEmptyRef.current,  { opacity: 1, duration: 0.4, ease: 'none' }, 10);
      tl.to(loadP2Ref.current,          { opacity: 1, duration: 1,   ease: 'none' }, 10);

      // S9 → S10: crossfade empty → filled dispenser
      tl.to(dispenserEmptyRef.current,  { opacity: 0, duration: 0.4, ease: 'none' }, 11);
      tl.to(dispenserFilledRef.current, { opacity: 1, duration: 0.4, ease: 'none' }, 11);

      // S10 → S11: inset phone (full-stock preview) fades in
      tl.to(insetPhoneWrapRef.current, { opacity: 1, duration: 1, ease: 'none' }, 12);
      tl.to(insetPhoneRef.current, { opacity: 1, duration: 1, ease: 'none' }, 12);

      // S11 → S12: everything fades to blank
      tl.to([courierWrapRef.current, insetPhoneWrapRef.current, badge2Ref.current, headLoadRef.current, loadP1Ref.current, loadP2Ref.current],
        { opacity: 0, duration: 0.6, ease: 'none' }, 13.5);

      // ── Done ────────────────────────────────────────────────────────────
      // S12 → S13: big combo phone fades in
      tl.to(phone13WrapRef.current, { opacity: 1, duration: 1, ease: 'none' }, 14.5);

      // S13 → S14: combo fades out; dispenser14 + phone14 fade in; badge3/heading/para1 reveal
      tl.to(phone13WrapRef.current, { opacity: 0, duration: 0.5, ease: 'none' }, 15.5);
      tl.to(dispenserWrapRef.current,   { opacity: 1, duration: 1, ease: 'none' }, 15.5);
      tl.to(phoneDetailWrapRef.current, { opacity: 1, duration: 1, ease: 'none' }, 15.5);
      tl.to([badge3Ref.current, headDoneRef.current, doneP1Ref.current], { opacity: 1, duration: 1, ease: 'none' }, 15.5);

      // S14 → S15: crossfade dispenser14→15, phone14→15
      tl.to(dispenser14Ref.current, { opacity: 0, duration: 0.4, ease: 'none' }, 16.5);
      tl.to(dispenser15Ref.current, { opacity: 1, duration: 0.4, ease: 'none' }, 16.5);
      tl.to(phone14Ref.current, { opacity: 0, duration: 0.4, ease: 'none' }, 16.5);
      tl.to(phone15Ref.current, { opacity: 1, duration: 0.4, ease: 'none' }, 16.5);

      // S15 → S16: dispenser + phone15 fade away in place, caregiver phone16 (separate, bigger
      // box) fades in, para2 reveals
      tl.to(dispenserWrapRef.current, { opacity: 0, duration: 1, ease: 'none' }, 17.5);
      tl.to(phoneDetailWrapRef.current, { opacity: 0, duration: 1, ease: 'none' }, 17.5);
      tl.to(phone16WrapRef.current, { opacity: 1, duration: 1, ease: 'none' }, 17.5);
      tl.to(doneP2Ref.current, { opacity: 1, duration: 1, ease: 'none' }, 17.5);

      // S16 → S17: bg crossfades to green, everything fades out
      tl.to(bgRef.current,   { opacity: 0, duration: 0.8, ease: 'none' }, 19);
      tl.to(bg18Ref.current, { opacity: 1, duration: 0.8, ease: 'none' }, 19);
      tl.to([dispenserWrapRef.current, phoneDetailWrapRef.current, phone16WrapRef.current, badge3Ref.current, headDoneRef.current, doneP1Ref.current, doneP2Ref.current],
        { opacity: 0, duration: 0.6, ease: 'none' }, 19);

      // ── Refill ──────────────────────────────────────────────────────────
      // S17 → S18: phone18 (Medicine Inventory) fades in big
      tl.to(refillPhoneWrapRef.current, { opacity: 1, duration: 1, ease: 'none' }, 20);

      // S18 → S19: phone shrinks; badge4/heading/para1 reveal
      tl.to(refillPhoneWrapRef.current, { ...PHONE18_SMALL_BOX, duration: 1, ease: 'none' }, 21);
      tl.to([badge4Ref.current, headRefillRef.current, refillP1Ref.current], { opacity: 1, duration: 1, ease: 'none' }, 21);

      // S19 → S20: crossfade phone18 → phone20 (full stock), para2 gradient finale reveals
      tl.to(phone18Ref.current, { opacity: 0, duration: 0.5, ease: 'none' }, 22);
      tl.to(phone20Ref.current, { opacity: 1, duration: 0.5, ease: 'none' }, 22);
      tl.to(refillP2Ref.current, { opacity: 1, duration: 1, ease: 'none' }, 22.2);
    }, outerRef);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', updateScale);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={outerRef} className="md:hidden" style={{ height: OUTER_H }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: '#fff' }}>
        <div
          ref={canvasRef}
          style={{ position: 'absolute', top: 0, left: 0, width: CANVAS_W, height: CANVAS_H, transformOrigin: '0 0', overflow: 'hidden' }}
        >
          {/* Backgrounds */}
          <div ref={bgRef} style={{ position: 'absolute', inset: 0 }}>
            <img src={ASSETS.bg} alt="" draggable={false} style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div ref={bg18Ref} style={{ position: 'absolute', inset: 0, opacity: 0 }}>
            <img src={ASSETS.bg18} alt="" draggable={false} style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {/* ── Schedule (badge 1) ── */}
          <Box innerRef={rxCardWrapRef} pos={S0_RXCARD}>
            <CoverImg src={ASSETS.rxCard} />
          </Box>
          <Box innerRef={phoneWrapRef} pos={S0_PHONE}>
            <CoverImg innerRef={phone1Ref} src={ASSETS.phone1} />
            <CoverImg innerRef={phone2Ref} src={ASSETS.phone2} extra={{ opacity: 0 }} />
            <CoverImg innerRef={phone3Ref} src={ASSETS.phone3} extra={{ opacity: 0 }} />
            <CoverImg innerRef={phone4Ref} src={ASSETS.phone4} extra={{ opacity: 0 }} />
          </Box>

          <div
            ref={badge1Ref}
            style={{
              position: 'absolute', left: `calc(50% + ${BADGE1.x}px)`, top: `calc(50% + ${BADGE1.y}px)`,
              transform: 'translate(-50%, -50%)', width: 60, height: 60, borderRadius: 120,
              background: 'rgba(215,234,249,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 32, color: '#00345b' }}>{stepByKey.schedule.badge_number}</span>
          </div>
          <p ref={headScheduleRef} style={{ position: 'absolute', left: `calc(50% + ${HEAD_SCHEDULE.x}px)`, top: `calc(50% + ${HEAD_SCHEDULE.y}px)`, width: HEAD_SCHEDULE.w, margin: 0, ...HEADING_STYLE }}>
            {stepByKey.schedule.heading}
          </p>
          <p ref={list1Ref} style={{ position: 'absolute', left: `calc(50% + ${LIST1.x}px)`, top: `calc(50% + ${LIST1.y}px)`, width: LIST1.w, margin: 0, paddingLeft: 24, ...BODY_STYLE }}>
            1. {scheduleTexts.item1}
          </p>
          <p ref={list2Ref} style={{ position: 'absolute', left: `calc(50% + ${LIST2.x}px)`, top: `calc(50% + ${LIST2.y}px)`, width: LIST2.w, margin: 0, paddingLeft: 24, ...BODY_STYLE }}>
            2. {scheduleTexts.item2}
          </p>

          {/* ── Load (badge 2) ── */}
          <Box innerRef={courierWrapRef} pos={COURIER_INIT}>
            <CoverImg innerRef={personRef} src={ASSETS.person6} />
            <CoverImg innerRef={dispenserEmptyRef} src={ASSETS.dispenserEmpty} extra={{ opacity: 0 }} />
            <CoverImg innerRef={dispenserFilledRef} src={ASSETS.dispenserFilled} extra={{ opacity: 0 }} />
          </Box>
          <Box innerRef={insetPhoneWrapRef} pos={INSET_PHONE}>
            <CoverImg innerRef={insetPhoneRef} src={ASSETS.phone10} />
          </Box>

          <div
            ref={badge2Ref}
            style={{
              position: 'absolute', left: `calc(50% + ${BADGE2.x}px)`, top: `calc(50% + ${BADGE2.y}px)`,
              transform: 'translate(-50%, -50%)', width: 60, height: 60, borderRadius: 120,
              background: '#d7eaf9', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 32, color: '#000' }}>{stepByKey.load.badge_number}</span>
          </div>
          <p ref={headLoadRef} style={{ position: 'absolute', left: `calc(50% + ${HEAD_LOAD.x}px)`, top: `calc(50% + ${HEAD_LOAD.y}px)`, width: HEAD_LOAD.w, margin: 0, ...HEADING_STYLE }}>
            {stepByKey.load.heading}
          </p>
          <p ref={loadP1Ref} style={{ position: 'absolute', left: `calc(50% + ${LOAD_P1.x}px)`, top: `calc(50% + ${LOAD_P1.y}px)`, width: LOAD_P1.w, margin: 0, ...BODY_STYLE }}>
            {loadTexts.text2}
          </p>
          <p ref={loadP2Ref} style={{ position: 'absolute', left: `calc(50% + ${LOAD_P2.x}px)`, top: `calc(50% + ${LOAD_P2.y}px)`, width: LOAD_P2.w, margin: 0, ...BODY_STYLE }}>
            {loadTexts.text3}
          </p>

          {/* ── Done (badge 3) ── */}
          <Box innerRef={phone13WrapRef} pos={PHONE13_BOX}>
            <CoverImg src={ASSETS.phone13} />
          </Box>
          <Box innerRef={dispenserWrapRef} pos={DISPENSER14_BOX}>
            <CoverImg innerRef={dispenser14Ref} src={ASSETS.dispenser14} />
            <CoverImg innerRef={dispenser15Ref} src={ASSETS.dispenser15} extra={{ opacity: 0 }} />
          </Box>
          <Box innerRef={phoneDetailWrapRef} pos={PHONE_DETAIL_BOX}>
            <CoverImg innerRef={phone14Ref} src={ASSETS.phone14} />
            <CoverImg innerRef={phone15Ref} src={ASSETS.phone15} extra={{ opacity: 0 }} />
          </Box>
          <Box innerRef={phone16WrapRef} pos={PHONE16_BIG_BOX}>
            <CoverImg innerRef={phone16Ref} src={ASSETS.phone16} />
          </Box>

          <div
            ref={badge3Ref}
            style={{
              position: 'absolute', left: `calc(50% + ${BADGE3.x}px)`, top: `calc(50% + ${BADGE3.y}px)`,
              transform: 'translate(-50%, -50%)', width: 60, height: 60, borderRadius: 120,
              background: '#d7eaf9', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 32, color: '#004172' }}>{stepByKey.done.badge_number}</span>
          </div>
          <p ref={headDoneRef} style={{ position: 'absolute', left: `calc(50% + ${HEAD_DONE.x}px)`, top: `calc(50% + ${HEAD_DONE.y}px)`, width: HEAD_DONE.w, margin: 0, ...HEADING_STYLE }}>
            {stepByKey.done.heading}
          </p>
          <p ref={doneP1Ref} style={{ position: 'absolute', left: `calc(50% + ${DONE_P1.x}px)`, top: `calc(50% + ${DONE_P1.y}px)`, width: DONE_P1.w, margin: 0, ...BODY_STYLE }}>
            {flatten(doneTexts.text3_done)}
          </p>
          <p ref={doneP2Ref} style={{ position: 'absolute', left: `calc(50% + ${DONE_P2.x}px)`, top: `calc(50% + ${DONE_P2.y}px)`, width: DONE_P2.w, margin: 0, ...BODY_STYLE }}>
            {doneTexts.caregiver_text}
          </p>

          {/* ── Refill (badge 4) ── */}
          <Box innerRef={refillPhoneWrapRef} pos={PHONE18_BIG_BOX}>
            <CoverImg innerRef={phone18Ref} src={ASSETS.phone18} />
            <CoverImg innerRef={phone20Ref} src={ASSETS.phone20} extra={{ opacity: 0 }} />
          </Box>

          <div
            ref={badge4Ref}
            style={{
              position: 'absolute', left: `calc(50% + ${BADGE4.x}px)`, top: `calc(50% + ${BADGE4.y}px)`,
              transform: 'translate(-50%, -50%)', width: 60, height: 60, borderRadius: 120,
              background: '#C4EADA', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 32, color: '#003D2E' }}>{stepByKey.refill.badge_number}</span>
          </div>
          <p ref={headRefillRef} style={{ position: 'absolute', left: `calc(50% + ${HEAD_REFILL.x}px)`, top: `calc(50% + ${HEAD_REFILL.y}px)`, width: HEAD_REFILL.w, margin: 0, ...HEADING_STYLE }}>
            {stepByKey.refill.heading}
          </p>
          <p ref={refillP1Ref} style={{ position: 'absolute', left: `calc(50% + ${REFILL_P1.x}px)`, top: `calc(50% + ${REFILL_P1.y}px)`, width: REFILL_P1.w, margin: 0, ...BODY_STYLE }}>
            {refillTexts.refill_text}
          </p>
          <p ref={refillP2Ref} style={{ position: 'absolute', left: `calc(50% + ${REFILL_P2.x}px)`, top: `calc(50% + ${REFILL_P2.y}px)`, width: REFILL_P2.w, margin: 0, ...BODY_STYLE }}>
            {flatten(refillTexts.refill_text2)}
            <strong
              style={{
                fontWeight: 700,
                background: 'linear-gradient(91deg, #3CBA84 0%, #004172 100%)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
              }}
            >
              {refillTexts.refill_text2_emphasis}
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
}
