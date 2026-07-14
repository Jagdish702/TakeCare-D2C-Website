import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useContent } from '../../context/ContentContext';

gsap.registerPlugin(ScrollTrigger);

const GRAD_0 = `url("data:image/svg+xml;utf8,<svg viewBox='0 0 1440 1024' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(0.2 2.3 -3.2344 0.28125 357.5 489)'><stop stop-color='rgba(232,241,248,1)' offset='0'/><stop stop-color='rgba(255,255,255,1)' offset='1'/></radialGradient></defs></svg>")`;
const GRAD_1 = `url("data:image/svg+xml;utf8,<svg viewBox='0 0 1440 1024' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-0.6 29.55 -41.555 -0.84375 396 577)'><stop stop-color='rgba(232,241,248,1)' offset='0'/><stop stop-color='rgba(255,255,255,1)' offset='1'/></radialGradient></defs></svg>")`;
const GRAD_2 = `url("data:image/svg+xml;utf8,<svg viewBox='0 0 1440 1024' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(0.8 45 -38.45 0.68356 352 461.5)'><stop stop-color='rgba(232,241,248,1)' offset='0'/><stop stop-color='rgba(255,255,255,1)' offset='1'/></radialGradient></defs></svg>")`;
const GRAD_3 = `url("data:image/svg+xml;utf8,<svg viewBox='0 0 1440 1024' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-0.4 38.55 -31.862 -0.33061 376 481)'><stop stop-color='rgba(232,241,248,1)' offset='0'/><stop stop-color='rgba(255,255,255,1)' offset='1'/></radialGradient></defs></svg>")`;
const GRAD_4 = `url("data:image/svg+xml;utf8,<svg viewBox='0 0 1440 1024' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(0.55 32.45 -29.95 0.50762 346 469.5)'><stop stop-color='rgba(232,241,248,1)' offset='0'/><stop stop-color='rgba(255,255,255,1)' offset='1'/></radialGradient></defs></svg>")`;
const GRAD_5 = `url("data:image/svg+xml;utf8,<svg viewBox='0 0 1440 1024' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(0.023697 0.9 -0.32873 0.0086555 524.26 566)'><stop stop-color='rgba(235,248,243,1)' offset='0'/><stop stop-color='rgba(255,255,255,1)' offset='1'/></radialGradient></defs></svg>")`;
const GRAD_6 = `url("data:image/svg+xml;utf8,<svg viewBox='0 0 1440 1024' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(0.099998 33 -24.567 0.074445 454.5 527)'><stop stop-color='rgba(235,248,243,1)' offset='0'/><stop stop-color='rgba(255,255,255,1)' offset='1'/></radialGradient></defs></svg>")`;
const GRAD_7 = `url("data:image/svg+xml;utf8,<svg viewBox='0 0 1440 1024' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(0.95 39.15 -35.736 0.86715 465.5 544.5)'><stop stop-color='rgba(235,248,243,1)' offset='0'/><stop stop-color='rgba(255,255,255,1)' offset='1'/></radialGradient></defs></svg>")`;
const GRAD_8 = `url("data:image/svg+xml;utf8,<svg viewBox='0 0 1440 1024' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(0.85 35.8 -43.031 1.0217 488 530)'><stop stop-color='rgba(235,248,243,1)' offset='0'/><stop stop-color='rgba(255,255,255,1)' offset='1'/></radialGradient></defs></svg>")`;
// State 13 — warm cream radial (node 12360-2455). viewBox 1440×900 stretched into the 1024 canvas.
const GRAD_9 = `url("data:image/svg+xml;utf8,<svg viewBox='0 0 1440 900' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-0.2 45 -38.402 -0.13184 706.5 450)'><stop stop-color='rgba(255,248,233,1)' offset='0'/><stop stop-color='rgba(255,255,255,1)' offset='1'/></radialGradient></defs></svg>")`;
// State 14 — warm cream radial, glow shifted left over the device (node 12359-1944).
const GRAD_10 = `url("data:image/svg+xml;utf8,<svg viewBox='0 0 1440 900' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-1.25 46.187 -39.415 -0.82402 419.5 431.98)'><stop stop-color='rgba(255,248,233,1)' offset='0'/><stop stop-color='rgba(255,255,255,1)' offset='1'/></radialGradient></defs></svg>")`;
// State 1 final positions (pixel top-left on 1440×1024 canvas) — node 12628-11471
// rx card and phone are side-by-side horizontally
const S1 = {
  rxCard: { left: 237.001, top: 354.0,  w: 202.198, h: 278.983 },
  phone:  { left: 476.001, top: 281.0,  w: 204.758, h: 423.22,  br: 38.715 },
  badge:  { left: 769,     top: 330,    w: 80,      h: 80 },
  head:   { left: 769,     top: 458,    w: 378 },
  item1:  { left: 769,     top: 541,    w: 378 },
  item2:  { left: 769,     top: 611,    w: 360 },
};

// State 0 initial offsets (GSAP x/y delta from S1, from node 12052-614)
// rxCard state0 TL=(446.51, 282.78) → delta from S1=(237.0, 354.0)
// phone  state0 TL=(446.52, 457.32) → delta from S1=(476.0, 281.0)
const S0 = {
  rxCard: { x: 209.511, y: -71.224, w: 120.956, h: 166.889 },
  phone:  { x: -29.484, y: 176.323, w: 122.487, h: 253.173, br: 23.159 },
  badge:  { y: 271 },
  head:   { y: 165 },
  item1:  { y: 158 },
};

// State 2/3 phone position (shared — same size/pos in both states) — node 12628-11472
// center = (50%-184.8, 50%-21.69) → TL=(417.003, 246.005)
const S2 = {
  phone2: { left: 417.003, top: 246.005, w: 236.394, h: 488.611, br: 44.696 },
};

// State 4 phone position (from Figma node 12052-679)
// center = (50%-189.35, 50%-30.56) → TL=(399.977, 211.347)
const S4 = {
  phone4: { left: 399.977, top: 211.347, w: 261.347, h: 540.186, br: 44.66 },
};

// State 6 delivery person position (from Figma node 12052-696)
const S6 = {
  person: { left: 458.002, top: 111.0015, w: 441.216, h: 689.137 },
};

// State 7 — person moves left+shrinks, new "Load" content slides in from below (node 12052-712)
// person: center=(50%-245.58, 50%-11.14) → TL=(284.998, 205.0)
const S7 = {
  person: { left: 284.998, top: 205.0, w: 378.845, h: 591.719 },
  badge2: { left: 769, top: 269, w: 80, h: 80 },
  head2:  { left: 769, top: 397, w: 378 },
  text2:  { left: 769, top: 480, w: 360 },
};

// State 8 — pill dispenser rises from below, person gone, 3rd paragraph appears (node 12059-88)
// pillDispenser: center=(50%-245.46, 50%-27.38) → TL=(285.005, 205.0), 379.071×559.247
const S8 = {
  pillDispenser: { left: 285.005, top: 205.0, w: 379.071, h: 559.247 },
  text3:         { left: 769, top: 600, w: 380 },
};

// State 9 — pill dispenser crossfades to filled version (node 12052-860)
// center=(50%-245.58, 50%-11.14) → TL=(284.998, 205.0), 378.845×591.719
const S9 = {
  pillDispenser2: { left: 284.998, top: 205.0, w: 378.845, h: 591.719 },
};

// State 10 — phone appears overlaid on pill dispenser (node 12052-729)
// phone: center=(50%-79.61, 50%+122.5) → TL=(561.013, 472.0), 158.754×325.005
const S10 = {
  phone10: { left: 561.013, top: 472.0, w: 158.754, h: 325.005, br: 30.017 },
};

// State 13 — all content vanishes, single phone centered (node 12387-7489 "3_mobile_img")
// Figma frame 1440×900: center=(50%-24, 50%-0.5), 304.708×600.
// Centered on the 1024 canvas → center y = 512 → TL=(543.646, 212).
const S13 = {
  phone13: { left: 543.646, top: 212.0, w: 304.708, h: 600.0 },
};

// State 14 — "Done" step (node 12359-1944). Figma frame 1440×900; y mapped 50%→512.
// dispenser (open/filled "image 186"): center (50%-231.81, 50%-51.36) → (488.19, 460.64)
// phone overlay ("3_mobile_img"):       center (50%-123.25, 50%+85.86) → (596.75, 597.86)
const S14 = {
  dispenser: { left: 324.184, top: 249.26,  w: 328.012, h: 422.761 },
  phone:     { left: 507.196, top: 421.385, w: 179.109, h: 352.95  },
  badge:     { left: 769,     top: 275.0,   w: 80,      h: 80 },
  head:      { left: 769,     top: 403.0,   w: 378 },
  text:      { left: 769,     top: 486.0,   w: 360 },
};

// State 15 — pill box & mobile swap to richer "in-use" views (node 12359-2113).
// Same gradient (GRAD_10) and right-side text as S14; only the device + phone change.
// dispenser "image 186": center (50%-231.94, 50%-36.67) → (488.06, 475.33)
// phone "3_mobile_img":   center (50%-123.25, 50%+87.6)  → (596.75, 599.6)
const S15 = {
  dispenser: { left: 324.19,  top: 264.12,  w: 327.74,  h: 422.411 },
  phone:     { left: 507.196, top: 423.125, w: 179.109, h: 352.95  },
};

// State 16 — dispenser + S15 phone vanish; a larger centered caregiver-view phone pops up and
// a 2nd "Done" paragraph rises from below (node 12360-2286). Same gradient/badge/"Done"/1st-para as S15.
// phone "3_mobile_img": center (50%-157.87, 50%-0.5) → (562.13, 511.5)
const S16 = {
  phone: { left: 433.996, top: 259.0, w: 256.269, h: 505.0 },
  text2: { left: 769,     top: 667.0, w: 360 },
};

// State 18 — content gone, bg crossfades blue→green, centered Medicine Inventory phone rises (node 12368-2626).
// Figma "image 190" is 300.404x615.868 centered at (699.2, 490.93); scaled to 80% (240.32x492.69) so the full
// phone stays visible with margins — at full size its top edge clipped under the header at short viewports.
const S18 = {
  phone: { left: 579.04, top: 244.58, w: 240.32, h: 492.69 },
};

// State 19 — "Refill" step (node 12368-2582). Same green bg + same phone as S18; phone slides left & resizes,
// green "4" badge + "Refill" heading + paragraph rise from below.
// phone "image 190": center (50%-196.5, 50%) → (523.5, 512); badge/head/text share the step-4 column at x=769.
const S19 = {
  phone: { left: 395.216, top: 249.0, w: 256.569, h: 526.0 },
  badge: { left: 769, top: 275.0, w: 80, h: 80 },
  head:  { left: 769, top: 403.0, w: 378 },
  text:  { left: 769, top: 486.0, w: 360 },
};

// State 20 — section finale (node 12368-2604). Same green bg + same phone spot as S19; only the phone IMAGE
// crossfades to the full-stock view, and the 2nd paragraph ("When it arrives… Just once a month.") rises.
const S20 = {
  phone: { left: 395.216, top: 249.0, w: 256.569, h: 526.0 }, // identical to S19 end-position (crossfade in place)
  text2: { left: 769, top: 667.0, w: 360 },
};

export default function SetupRefillJourneySection() {
  const { setupRefillJourney, images } = useContent();
  const ASSETS = {
    bg:           images['setup-refill-bg-state1'],
    rxCard:       images['setup-refill-rx-card'],
    phone1:       images['setup-refill-phone1'],
    phone2:       images['setup-refill-phone2-s2'],
    phone3:       images['setup-refill-phone3-s3'],
    phone4:       images['setup-refill-phone4-s4'],
    person6:      images['setup-refill-person-s6'],
    pillDispenser: images['setup-refill-pill-dispenser-s8'],
    pillDispenser2:images['setup-refill-pill-dispenser-s9'],
    phone10:       images['setup-refill-phone-s10'],
    phone13:       images['setup-refill-phone-s13'],
    dispenser14:   images['setup-refill-dispenser-s14'],
    phone14:       images['setup-refill-phone-s14'],
    dispenser15:   images['setup-refill-dispenser-s15'],
    phone15:       images['setup-refill-phone-s15'],
    phone16:       images['setup-refill-phone-s16'],
    bg18:          images['setup-refill-bg-state18'],
    phone18:       images['setup-refill-phone-s18'],
    phone20:       images['setup-refill-phone-s20'],
  };
  const stepByKey = Object.fromEntries(setupRefillJourney.steps.map((s) => [s.step_key, s]));
  const textByKey = (step) => Object.fromEntries(step.texts.map((t) => [t.text_key, t.body]));
  const scheduleTexts = textByKey(stepByKey.schedule);
  const loadTexts = textByKey(stepByKey.load);
  const doneTexts = textByKey(stepByKey.done);
  const refillTexts = textByKey(stepByKey.refill);

  const outerRef   = useRef(null);
  const canvasRef  = useRef(null);

  const grad0Ref   = useRef(null);
  const grad1Ref   = useRef(null);
  const grad2Ref   = useRef(null);
  const grad3Ref   = useRef(null);
  const grad4Ref   = useRef(null);
  const grad5Ref   = useRef(null);
  const grad6Ref   = useRef(null);
  const grad7Ref   = useRef(null);
  const grad8Ref   = useRef(null);
  const grad9Ref   = useRef(null);
  const grad10Ref  = useRef(null);
  const rxCardRef  = useRef(null);
  const phoneRef   = useRef(null);

  const phone2Ref  = useRef(null);
  const phone3Ref  = useRef(null);
  const phone4Ref  = useRef(null);

  const personRef  = useRef(null);

  const badgeRef   = useRef(null);
  const headRef    = useRef(null);
  const item1Ref   = useRef(null);
  const item2Ref   = useRef(null);

  const badge2Ref  = useRef(null);
  const head2Ref   = useRef(null);
  const text2Ref   = useRef(null);

  const pillDispenserRef  = useRef(null);
  const pillDispenser2Ref = useRef(null);
  const text3Ref          = useRef(null);

  const phone10Ref = useRef(null);
  const phone13Ref = useRef(null);

  const dispenser14Ref = useRef(null);
  const phone14Ref     = useRef(null);
  const badge3Ref      = useRef(null);
  const head3Ref       = useRef(null);
  const text3DoneRef   = useRef(null);

  const dispenser15Ref = useRef(null);
  const phone15Ref     = useRef(null);

  const phone16Ref       = useRef(null);
  const caregiverTextRef = useRef(null);

  const bgRef      = useRef(null);
  const bg18Ref    = useRef(null);
  const phone18Ref = useRef(null);

  const badge4Ref      = useRef(null);
  const refillHeadRef  = useRef(null);
  const refillTextRef  = useRef(null);

  const phone20Ref     = useRef(null);
  const refillText2Ref = useRef(null);

  useEffect(() => {
    const updateScale = () => {
      if (!canvasRef.current) return;
      const vw  = document.documentElement.clientWidth;
      const vh  = document.documentElement.clientHeight;
      const hdr = 52; // header height — center canvas in visible area below header
      const s   = Math.max(vw / 1440, (vh - hdr) / 1024);
      const ox  = (vw - 1440 * s) / 2;
      const oy  = hdr + ((vh - hdr) - 1024 * s) / 2;
      canvasRef.current.style.transform = `translate(${ox}px, ${oy}px) scale(${s})`;
    };
    updateScale();
    const raf = requestAnimationFrame(updateScale);
    window.addEventListener('resize', updateScale);

    const ctx = gsap.context(() => {
      // ── Initial state (all hidden) ───────────────────────────────
      gsap.set([grad1Ref.current, grad2Ref.current, grad3Ref.current, grad4Ref.current, grad5Ref.current, grad6Ref.current, grad7Ref.current, grad8Ref.current, grad9Ref.current, grad10Ref.current], { opacity: 0 });

      gsap.set(rxCardRef.current, {
        opacity: 0, x: S0.rxCard.x, y: S0.rxCard.y,
        width: S0.rxCard.w, height: S0.rxCard.h,
      });
      gsap.set(phoneRef.current, {
        opacity: 0, x: S0.phone.x, y: S0.phone.y,
        width: S0.phone.w, height: S0.phone.h, borderRadius: S0.phone.br,
      });

      // State 2 & 3 phones start invisible
      gsap.set(phone2Ref.current, { opacity: 0, y: 60 });
      gsap.set(phone3Ref.current, { opacity: 0 });
      gsap.set(phone4Ref.current, { opacity: 0 });
      gsap.set(personRef.current, { opacity: 0, filter: 'blur(48px)', y: 100 });
      gsap.set([badge2Ref.current, head2Ref.current, text2Ref.current], { opacity: 0, y: 120 });
      gsap.set(pillDispenserRef.current,  { opacity: 0, y: 120 });
      gsap.set(pillDispenser2Ref.current, { opacity: 0 });
      gsap.set(text3Ref.current,          { opacity: 0, y: 120 });
      gsap.set(phone10Ref.current,        { opacity: 0, y: 80 });
      gsap.set(phone13Ref.current,        { opacity: 0, y: 80 });
      gsap.set([dispenser14Ref.current, phone14Ref.current, badge3Ref.current, head3Ref.current, text3DoneRef.current], { opacity: 0, y: 120 });
      gsap.set([dispenser15Ref.current, phone15Ref.current], { opacity: 0, y: 120 });
      gsap.set([phone16Ref.current, caregiverTextRef.current], { opacity: 0, y: 120 });
      gsap.set(phone18Ref.current, { opacity: 0, y: 120 });
      gsap.set([badge4Ref.current, refillHeadRef.current, refillTextRef.current], { opacity: 0, y: 120 });
      gsap.set(phone20Ref.current, { opacity: 0 });
      gsap.set(refillText2Ref.current, { opacity: 0, y: 120 });
      // item2 starts 158px below its final position (visually at y=769, final at y=611)
      gsap.set(item2Ref.current, { y: 158 });

      gsap.set([badgeRef.current, headRef.current, item1Ref.current, item2Ref.current], { opacity: 0 });
      gsap.set(badgeRef.current, { y: S0.badge.y });
      gsap.set(headRef.current,  { y: S0.head.y });
      gsap.set(item1Ref.current, { y: S0.item1.y });

      // ── ScrollTrigger timeline ───────────────────────────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start: 'top top',
          end:   'bottom bottom',
          scrub: 1.5,
        },
      });

      // State 0 → State 1  (beats 0 – 2)
      tl.to(grad0Ref.current, { opacity: 0, duration: 1, ease: 'none' }, 0);
      tl.to(grad1Ref.current, { opacity: 1, duration: 1, ease: 'none' }, 0);

      tl.to(rxCardRef.current, {
        opacity: 1, x: 0, y: 0,
        width: S1.rxCard.w, height: S1.rxCard.h,
        duration: 2, ease: 'none',
      }, 0);
      tl.to(phoneRef.current, {
        opacity: 1, x: 0, y: 0,
        width: S1.phone.w, height: S1.phone.h, borderRadius: S1.phone.br,
        duration: 2, ease: 'none',
      }, 0);

      tl.to(badgeRef.current, { y: 0, opacity: 1, duration: 1, ease: 'none' }, 0.3);
      tl.to(headRef.current,  { y: 0, opacity: 1, duration: 1, ease: 'none' }, 0.5);
      tl.to(item1Ref.current, { y: 0, opacity: 1, duration: 1, ease: 'none' }, 0.7);

      // State 1 → State 2  (beat 2.5)
      // Snap state 1 images away instantly, crossfade gradient
      tl.to(rxCardRef.current, { opacity: 0, duration: 0.05, ease: 'none' }, 2.5);
      tl.to(phoneRef.current,  { opacity: 0, duration: 0.05, ease: 'none' }, 2.5);
      tl.to(grad1Ref.current,  { opacity: 0, duration: 0.5,  ease: 'none' }, 2.5);
      tl.to(grad2Ref.current,  { opacity: 1, duration: 0.5,  ease: 'none' }, 2.5);

      // State 2 phone pops up
      tl.to(phone2Ref.current, { opacity: 1, y: 0, duration: 1, ease: 'none' }, 2.5);

      // State 2 → State 3  (beats 4 – 5)
      // Phone crossfade
      tl.to(phone2Ref.current, { opacity: 0, duration: 0.5, ease: 'none' }, 4);
      tl.to(phone3Ref.current, { opacity: 1, duration: 0.5, ease: 'none' }, 4);
      // Gradient crossfade
      tl.to(grad2Ref.current,  { opacity: 0, duration: 0.5, ease: 'none' }, 4);
      tl.to(grad3Ref.current,  { opacity: 1, duration: 0.5, ease: 'none' }, 4);
      // Item 2 slides up from below
      tl.to(item2Ref.current,  { y: 0, opacity: 1, duration: 1, ease: 'none' }, 4);

      // State 3 → State 4  (beat 5.5)
      tl.to(phone3Ref.current, { opacity: 0, duration: 0.05, ease: 'none' }, 5.5);
      tl.to(phone4Ref.current, { opacity: 1, duration: 0.5, ease: 'none' }, 5.5);
      tl.to(grad3Ref.current,  { opacity: 0, duration: 0.5, ease: 'none' }, 5.5);
      tl.to(grad4Ref.current,  { opacity: 1, duration: 0.5, ease: 'none' }, 5.5);

      // State 4 → State 5  (beat 7) — all content fades out, bg only remains
      tl.to(phone4Ref.current, { opacity: 0, duration: 0.05, ease: 'none' }, 7);
      tl.to([badgeRef.current, headRef.current, item1Ref.current, item2Ref.current], { opacity: 0, duration: 0.5, ease: 'none' }, 7);
      tl.to(grad4Ref.current,  { opacity: 0, duration: 0.5, ease: 'none' }, 7);
      tl.to(grad5Ref.current,  { opacity: 1, duration: 0.5, ease: 'none' }, 7);

      // State 5 → State 6  (beat 8.5) — person emerges from blur
      tl.to(grad5Ref.current,  { opacity: 0, duration: 0.5, ease: 'none' }, 8.5);
      tl.to(grad6Ref.current,  { opacity: 1, duration: 0.5, ease: 'none' }, 8.5);
      tl.to(personRef.current, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1, ease: 'none' }, 8.5);

      // State 6 → State 7  (beat 10.5) — person slides left+shrinks, new content rises
      tl.to(personRef.current, {
        x: S7.person.left - S6.person.left,
        y: S7.person.top  - S6.person.top,
        width: S7.person.w, height: S7.person.h,
        duration: 1, ease: 'none',
      }, 10.5);
      tl.to(grad6Ref.current,  { opacity: 0, duration: 0.5, ease: 'none' }, 10.5);
      tl.to(grad7Ref.current,  { opacity: 1, duration: 0.5, ease: 'none' }, 10.5);
      tl.to(badge2Ref.current, { opacity: 1, y: 0, duration: 1, ease: 'none' }, 10.5);
      tl.to(head2Ref.current,  { opacity: 1, y: 0, duration: 1, ease: 'none' }, 10.7);
      tl.to(text2Ref.current,  { opacity: 1, y: 0, duration: 1, ease: 'none' }, 10.9);

      // State 7 → State 8  (beat 12.5) — person gone, pill dispenser + text3 rise
      tl.to(personRef.current,       { opacity: 0, duration: 0.5, ease: 'none' }, 12.5);
      tl.to(pillDispenserRef.current, { opacity: 1, y: 0, duration: 1, ease: 'none' }, 12.5);
      tl.to(text3Ref.current,        { opacity: 1, y: 0, duration: 1, ease: 'none' }, 12.7);

      // State 8 → State 9  (beat 14.5) — pill dispenser crossfades to filled version
      tl.to(pillDispenserRef.current,  { opacity: 0, duration: 0.5, ease: 'none' }, 14.5);
      tl.to(pillDispenser2Ref.current, { opacity: 1, duration: 0.5, ease: 'none' }, 14.5);

      // State 9 → State 10  (beat 16.5) — phone slides up over pill dispenser, new gradient
      tl.to(grad7Ref.current,  { opacity: 0, duration: 0.5, ease: 'none' }, 16.5);
      tl.to(grad8Ref.current,  { opacity: 1, duration: 0.5, ease: 'none' }, 16.5);
      tl.to(phone10Ref.current, { opacity: 1, y: 0, duration: 1, ease: 'none' }, 16.5);

      // State 10 → State 13  (beat 18.5) — all content vanishes, centered phone rises in
      tl.to([
        pillDispenser2Ref.current, phone10Ref.current,
        badge2Ref.current, head2Ref.current, text2Ref.current, text3Ref.current,
      ], { opacity: 0, duration: 0.5, ease: 'none' }, 18.5);
      tl.to(grad8Ref.current,   { opacity: 0, duration: 0.5, ease: 'none' }, 18.5);
      tl.to(grad9Ref.current,   { opacity: 1, duration: 0.5, ease: 'none' }, 18.5);
      tl.to(phone13Ref.current, { opacity: 1, y: 0, duration: 1, ease: 'none' }, 18.5);

      // State 13 → State 14  (beat 20.5) — centered phone fades out, "Done" step rises from below
      tl.to(phone13Ref.current, { opacity: 0, duration: 0.5, ease: 'none' }, 20.5);
      tl.to(grad9Ref.current,   { opacity: 0, duration: 0.5, ease: 'none' }, 20.5);
      tl.to(grad10Ref.current,  { opacity: 1, duration: 0.5, ease: 'none' }, 20.5);
      tl.to(dispenser14Ref.current, { opacity: 1, y: 0, duration: 1, ease: 'none' }, 20.5);
      tl.to(phone14Ref.current,     { opacity: 1, y: 0, duration: 1, ease: 'none' }, 20.5);
      tl.to(badge3Ref.current,      { opacity: 1, y: 0, duration: 1, ease: 'none' }, 20.5);
      tl.to(head3Ref.current,       { opacity: 1, y: 0, duration: 1, ease: 'none' }, 20.7);
      tl.to(text3DoneRef.current,   { opacity: 1, y: 0, duration: 1, ease: 'none' }, 20.9);

      // State 14 → State 15  (beat 22.5) — pill box + mobile rise up & out, richer in-use views rise in.
      // "3" / "Done" / text stay put — only the device + phone swap.
      tl.to([dispenser14Ref.current, phone14Ref.current], { y: -250, opacity: 0, duration: 0.6, ease: 'none' }, 22.5);
      tl.to(dispenser15Ref.current, { y: 0, opacity: 1, duration: 1, ease: 'none' }, 22.5);
      tl.to(phone15Ref.current,     { y: 0, opacity: 1, duration: 1, ease: 'none' }, 22.5);

      // State 15 → State 16  (beat 24.5) — pill box + S15 phone vanish, caregiver phone pops up,
      // 2nd paragraph rises from below. "3" / "Done" / 1st paragraph stay put.
      tl.to([dispenser15Ref.current, phone15Ref.current], { opacity: 0, duration: 0.5, ease: 'none' }, 24.5);
      tl.to(phone16Ref.current,       { y: 0, opacity: 1, duration: 1, ease: 'none' }, 24.5);
      tl.to(caregiverTextRef.current, { y: 0, opacity: 1, duration: 1, ease: 'none' }, 24.7);

      // State 16 → State 18  (beat 26.5) — all content vanishes, bg crossfades blue→green,
      // centered Medicine Inventory phone rises from below.
      tl.to([phone16Ref.current, caregiverTextRef.current, badge3Ref.current, head3Ref.current, text3DoneRef.current],
        { opacity: 0, duration: 0.6, ease: 'none' }, 26.5);
      tl.to(bgRef.current,      { opacity: 0, duration: 0.6, ease: 'none' }, 26.5);
      tl.to(bg18Ref.current,    { opacity: 1, duration: 0.6, ease: 'none' }, 26.5);
      tl.to(phone18Ref.current, { y: 0, opacity: 1, duration: 1, ease: 'none' }, 26.5);

      // State 18 → State 19  (beat 28.5) — phone slides left & resizes, "Refill" step rises from below.
      tl.to(phone18Ref.current, {
        x: S19.phone.left - S18.phone.left,
        y: S19.phone.top  - S18.phone.top,
        width: S19.phone.w, height: S19.phone.h,
        duration: 1, ease: 'none',
      }, 28.5);
      tl.to(badge4Ref.current,     { opacity: 1, y: 0, duration: 1, ease: 'none' }, 28.5);
      tl.to(refillHeadRef.current, { opacity: 1, y: 0, duration: 1, ease: 'none' }, 28.7);
      tl.to(refillTextRef.current, { opacity: 1, y: 0, duration: 1, ease: 'none' }, 28.9);

      // State 19 → State 20  (beat 30.5) — phone image crossfades to full-stock, 2nd paragraph rises. Section finale.
      tl.to(phone18Ref.current,     { opacity: 0, duration: 0.5, ease: 'none' }, 30.5);
      tl.to(phone20Ref.current,     { opacity: 1, duration: 0.5, ease: 'none' }, 30.5);
      tl.to(refillText2Ref.current, { opacity: 1, y: 0, duration: 1, ease: 'none' }, 30.7);

    });

    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  const txt = { position: 'absolute', fontFamily: 'Inter, sans-serif' };

  return (
    <div ref={outerRef} style={{ height: '4050vh' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: 'white' }}>
        <div
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0, left: 0,
            width: 1440, height: 1024,
            transformOrigin: 'top left',
          }}
        >
          {/* ── Gradients ── */}
          <div ref={grad0Ref} style={{ position: 'absolute', inset: 0, backgroundImage: GRAD_0 }} />
          <div ref={grad1Ref} style={{ position: 'absolute', inset: 0, backgroundImage: GRAD_1, opacity: 0 }} />
          <div ref={grad2Ref} style={{ position: 'absolute', inset: 0, backgroundImage: GRAD_2, opacity: 0 }} />
          <div ref={grad3Ref} style={{ position: 'absolute', inset: 0, backgroundImage: GRAD_3, opacity: 0 }} />
          <div ref={grad4Ref} style={{ position: 'absolute', inset: 0, backgroundImage: GRAD_4, opacity: 0 }} />
          <div ref={grad5Ref} style={{ position: 'absolute', inset: 0, backgroundImage: GRAD_5, opacity: 0 }} />
          <div ref={grad6Ref} style={{ position: 'absolute', inset: 0, backgroundImage: GRAD_6, opacity: 0 }} />
          <div ref={grad7Ref} style={{ position: 'absolute', inset: 0, backgroundImage: GRAD_7, opacity: 0 }} />
          <div ref={grad8Ref} style={{ position: 'absolute', inset: 0, backgroundImage: GRAD_8, opacity: 0 }} />
          <div ref={grad9Ref} style={{ position: 'absolute', inset: 0, backgroundImage: GRAD_9, opacity: 0 }} />
          <div ref={grad10Ref} style={{ position: 'absolute', inset: 0, backgroundImage: GRAD_10, opacity: 0 }} />

          {/* ── Static bg image (states 1–16) ── */}
          <div ref={bgRef} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            <img
              alt=""
              src={ASSETS.bg}
              style={{
                position: 'absolute',
                width: '126.94%', height: '124.84%',
                left: '-15.69%', top: '-14.25%',
                maxWidth: 'none',
              }}
            />
          </div>

          {/* ── State 18: green frame bg (crossfades in over the blue frame) ── */}
          <div ref={bg18Ref} style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0 }}>
            <img
              alt=""
              src={ASSETS.bg18}
              style={{
                position: 'absolute',
                width: '127.02%', height: '124.89%',
                left: '-13.51%', top: '-14.66%',
                maxWidth: 'none',
              }}
            />
          </div>

          {/* ── State 1: Rx card (upper half-circle) ── */}
          <div
            ref={rxCardRef}
            style={{
              position: 'absolute',
              left: S1.rxCard.left, top: S1.rxCard.top,
              width: S1.rxCard.w, height: S1.rxCard.h,
              overflow: 'hidden', opacity: 0,
            }}
          >
            <img
              alt=""
              src={ASSETS.rxCard}
              style={{
                position: 'absolute',
                width: '110.13%', height: '119.72%',
                left: '-4.64%', top: '-7.04%',
                maxWidth: 'none',
              }}
            />
          </div>

          {/* ── State 1: Phone (lower half-circle) ── */}
          <div
            ref={phoneRef}
            style={{
              position: 'absolute',
              left: S1.phone.left, top: S1.phone.top,
              width: S1.phone.w, height: S1.phone.h,
              borderRadius: S1.phone.br,
              overflow: 'hidden', opacity: 0,
            }}
          >
            <img
              alt=""
              src={ASSETS.phone1}
              style={{
                position: 'absolute',
                width: '101.89%', height: '100.75%',
                left: '-1.14%', top: '-0.38%',
                maxWidth: 'none',
              }}
            />
          </div>

          {/* ── State 6: Delivery person ── */}
          <div
            ref={personRef}
            style={{
              position: 'absolute',
              left: S6.person.left, top: S6.person.top,
              width: S6.person.w, height: S6.person.h,
              aspectRatio: '89/139',
              overflow: 'hidden', opacity: 0,
            }}
          >
            <img
              alt=""
              src={ASSETS.person6}
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>

          {/* ── State 2: Full phone (Daily Schedule screen) ── */}
          <div
            ref={phone2Ref}
            style={{
              position: 'absolute',
              left: S2.phone2.left, top: S2.phone2.top,
              width: S2.phone2.w, height: S2.phone2.h,
              borderRadius: S2.phone2.br,
              overflow: 'hidden', opacity: 0,
            }}
          >
            <img
              alt=""
              src={ASSETS.phone2}
              style={{
                position: 'absolute',
                width: '100%', height: '100%',
                left: 0, top: 0,
                maxWidth: 'none',
              }}
            />
          </div>

          {/* ── State 4: Phone (allotment success screen) ── */}
          <div
            ref={phone4Ref}
            style={{
              position: 'absolute',
              left: S4.phone4.left, top: S4.phone4.top,
              width: S4.phone4.w, height: S4.phone4.h,
              borderRadius: S4.phone4.br,
              overflow: 'hidden', opacity: 0,
            }}
          >
            <img alt="" src={ASSETS.phone4} style={{ position: 'absolute', width: '100.17%', height: '100.37%', left: '-0.09%', top: '-0.37%', maxWidth: 'none' }} />
          </div>

          {/* ── State 3: Phone (meal timing screen) — same position as phone2 ── */}
          <div
            ref={phone3Ref}
            style={{
              position: 'absolute',
              left: S2.phone2.left, top: S2.phone2.top,
              width: S2.phone2.w, height: S2.phone2.h,
              borderRadius: S2.phone2.br,
              overflow: 'hidden', opacity: 0,
            }}
          >
            <img
              alt=""
              src={ASSETS.phone3}
              style={{ position: 'absolute', width: '100%', height: '100%', left: 0, top: 0, maxWidth: 'none' }}
            />
          </div>

          {/* ── Badge ── */}
          <div
            ref={badgeRef}
            style={{
              position: 'absolute',
              left: S1.badge.left, top: S1.badge.top,
              width: S1.badge.w, height: S1.badge.h,
              background: 'rgba(215,234,249,0.6)',
              backdropFilter: 'blur(12px)',
              borderRadius: 120,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: 0,
            }}
          >
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 48, fontWeight: 500, color: '#00345b', lineHeight: 1 }}>
              {stepByKey.schedule.badge_number}
            </span>
          </div>

          {/* ── Schedule heading ── */}
          <p
            ref={headRef}
            style={{
              ...txt,
              left: S1.head.left, top: S1.head.top,
              margin: 0,
              fontSize: 48, fontWeight: 500, color: '#000',
              width: S1.head.w, lineHeight: 1, opacity: 0,
            }}
          >
            {stepByKey.schedule.heading}
          </p>

          {/* ── List item 1 ── */}
          <ol
            ref={item1Ref}
            start={1}
            style={{
              ...txt,
              left: S1.item1.left, top: S1.item1.top,
              margin: 0, paddingLeft: 36,
              listStyleType: 'decimal', listStylePosition: 'outside',
              fontSize: 24, fontWeight: 300, color: '#000',
              width: S1.item1.w, letterSpacing: 0.3888, lineHeight: 1.35,
              opacity: 0,
            }}
          >
            <li>{scheduleTexts.item1}</li>
          </ol>

          {/* ── List item 2 (hidden until state 2+) ── */}
          <ol
            ref={item2Ref}
            start={2}
            style={{
              ...txt,
              left: S1.item2.left, top: S1.item2.top,
              margin: 0, paddingLeft: 36,
              listStyleType: 'decimal', listStylePosition: 'outside',
              fontSize: 24, fontWeight: 300, color: '#000',
              width: S1.item2.w, letterSpacing: 0.3888, lineHeight: 1.35,
              opacity: 0,
            }}
          >
            <li>{scheduleTexts.item2}</li>
          </ol>

          {/* ── State 7: Badge 2 ── */}
          <div
            ref={badge2Ref}
            style={{
              position: 'absolute',
              left: S7.badge2.left, top: S7.badge2.top,
              width: S7.badge2.w, height: S7.badge2.h,
              background: '#d7eaf9',
              borderRadius: 120,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: 0,
            }}
          >
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 48, fontWeight: 500, color: '#000', lineHeight: 1 }}>
              {stepByKey.load.badge_number}
            </span>
          </div>

          {/* ── State 7: "Load" heading ── */}
          <p
            ref={head2Ref}
            style={{
              ...txt,
              left: S7.head2.left, top: S7.head2.top,
              margin: 0, fontSize: 48, fontWeight: 500, color: '#000',
              width: S7.head2.w, lineHeight: 1, opacity: 0,
            }}
          >
            {stepByKey.load.heading}
          </p>

          {/* ── State 7: description text ── */}
          <p
            ref={text2Ref}
            style={{
              ...txt,
              left: S7.text2.left, top: S7.text2.top,
              margin: 0, fontSize: 24, fontWeight: 300, color: '#000',
              width: S7.text2.w, letterSpacing: 0.3888, lineHeight: 1.35, opacity: 0,
            }}
          >
            {loadTexts.text2}
          </p>

          {/* ── State 8: Pill dispenser device (empty) ── */}
          <div
            ref={pillDispenserRef}
            style={{
              position: 'absolute',
              left: S8.pillDispenser.left, top: S8.pillDispenser.top,
              width: S8.pillDispenser.w, height: S8.pillDispenser.h,
              overflow: 'hidden', opacity: 0,
            }}
          >
            <img
              alt=""
              src={ASSETS.pillDispenser}
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            />
          </div>

          {/* ── State 9: Pill dispenser device (filled with medicines) ── */}
          <div
            ref={pillDispenser2Ref}
            style={{
              position: 'absolute',
              left: S9.pillDispenser2.left, top: S9.pillDispenser2.top,
              width: S9.pillDispenser2.w, height: S9.pillDispenser2.h,
              overflow: 'hidden', opacity: 0,
            }}
          >
            <img
              alt=""
              src={ASSETS.pillDispenser2}
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            />
          </div>

          {/* ── State 10: Phone over pill dispenser ── */}
          <div
            ref={phone10Ref}
            style={{
              position: 'absolute',
              left: S10.phone10.left, top: S10.phone10.top,
              width: S10.phone10.w, height: S10.phone10.h,
              borderRadius: S10.phone10.br,
              overflow: 'hidden', opacity: 0,
            }}
          >
            <img
              alt=""
              src={ASSETS.phone10}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* ── State 8: third paragraph ── */}
          <p
            ref={text3Ref}
            style={{
              ...txt,
              left: S8.text3.left, top: S8.text3.top,
              margin: 0, fontSize: 24, fontWeight: 300, color: '#000',
              width: S8.text3.w, letterSpacing: 0.3888, lineHeight: 1.35, opacity: 0,
            }}
          >
            {loadTexts.text3}
          </p>

          {/* ── State 13: Single centered phone (Pill Box / Medication Status screen) ── */}
          <div
            ref={phone13Ref}
            style={{
              position: 'absolute',
              left: S13.phone13.left, top: S13.phone13.top,
              width: S13.phone13.w, height: S13.phone13.h,
              overflow: 'hidden', opacity: 0,
            }}
          >
            <img
              alt=""
              src={ASSETS.phone13}
              style={{
                position: 'absolute',
                width: '106.29%', height: '104.33%',
                left: '-3.14%', top: '-2.24%',
                maxWidth: 'none',
              }}
            />
          </div>

          {/* ── State 14: Open/filled pill dispenser device ── */}
          <div
            ref={dispenser14Ref}
            style={{
              position: 'absolute',
              left: S14.dispenser.left, top: S14.dispenser.top,
              width: S14.dispenser.w, height: S14.dispenser.h,
              boxShadow: '0px 1.544px 15.443px rgba(0,65,114,0.08)',
              opacity: 0,
            }}
          >
            <img
              alt=""
              src={ASSETS.dispenser14}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* ── State 14: Phone overlay (Medication Status / Medicine Logs) ── */}
          <div
            ref={phone14Ref}
            style={{
              position: 'absolute',
              left: S14.phone.left, top: S14.phone.top,
              width: S14.phone.w, height: S14.phone.h,
              overflow: 'hidden', opacity: 0,
            }}
          >
            <img
              alt=""
              src={ASSETS.phone14}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* ── State 14: Badge 3 ── */}
          <div
            ref={badge3Ref}
            style={{
              position: 'absolute',
              left: S14.badge.left, top: S14.badge.top,
              width: S14.badge.w, height: S14.badge.h,
              background: '#d7eaf9',
              borderRadius: 120,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: 0,
            }}
          >
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 48, fontWeight: 500, color: '#004172', lineHeight: 1 }}>
              {stepByKey.done.badge_number}
            </span>
          </div>

          {/* ── State 14: "Done" heading ── */}
          <p
            ref={head3Ref}
            style={{
              ...txt,
              left: S14.head.left, top: S14.head.top,
              margin: 0, fontSize: 48, fontWeight: 500, color: '#000',
              width: S14.head.w, lineHeight: 1, opacity: 0,
            }}
          >
            {stepByKey.done.heading}
          </p>

          {/* ── State 14: description text (explicit line breaks to match Figma's 5-line wrap;
              white-space:pre keeps the breaks exactly — the browser fits ~2px less per line than Figma) ── */}
          <p
            ref={text3DoneRef}
            style={{
              ...txt,
              left: S14.text.left, top: S14.text.top,
              margin: 0, fontSize: 24, fontWeight: 300, color: '#000',
              width: S14.text.w, letterSpacing: 0.3888, lineHeight: 1.35,
              whiteSpace: 'pre', opacity: 0,
            }}
          >
            {doneTexts.text3_done}
          </p>

          {/* ── State 15: Pill box (richer in-use view) ── */}
          <div
            ref={dispenser15Ref}
            style={{
              position: 'absolute',
              left: S15.dispenser.left, top: S15.dispenser.top,
              width: S15.dispenser.w, height: S15.dispenser.h,
              opacity: 0,
            }}
          >
            <img
              alt=""
              src={ASSETS.dispenser15}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* ── State 15: Phone overlay (Taken 2 / adherence) ── */}
          <div
            ref={phone15Ref}
            style={{
              position: 'absolute',
              left: S15.phone.left, top: S15.phone.top,
              width: S15.phone.w, height: S15.phone.h,
              opacity: 0,
            }}
          >
            <img
              alt=""
              src={ASSETS.phone15}
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            />
          </div>

          {/* ── State 16: Larger centered caregiver-view phone ── */}
          <div
            ref={phone16Ref}
            style={{
              position: 'absolute',
              left: S16.phone.left, top: S16.phone.top,
              width: S16.phone.w, height: S16.phone.h,
              opacity: 0,
            }}
          >
            <img
              alt=""
              src={ASSETS.phone16}
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            />
          </div>

          {/* ── State 16: 2nd "Done" paragraph (caregiver notification) ── */}
          <p
            ref={caregiverTextRef}
            style={{
              ...txt,
              left: S16.text2.left, top: S16.text2.top,
              margin: 0, fontSize: 24, fontWeight: 300, color: '#000',
              width: S16.text2.w, letterSpacing: 0.3888, lineHeight: 1.35, opacity: 0,
            }}
          >
            {doneTexts.caregiver_text}
          </p>

          {/* ── State 18: Centered Medicine Inventory phone ── */}
          <div
            ref={phone18Ref}
            style={{
              position: 'absolute',
              left: S18.phone.left, top: S18.phone.top,
              width: S18.phone.w, height: S18.phone.h,
              opacity: 0,
            }}
          >
            <img
              alt=""
              src={ASSETS.phone18}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* ── State 19: Badge 4 (green) ── */}
          <div
            ref={badge4Ref}
            style={{
              position: 'absolute',
              left: S19.badge.left, top: S19.badge.top,
              width: S19.badge.w, height: S19.badge.h,
              background: '#c4eada',
              borderRadius: 120,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: 0,
            }}
          >
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 48, fontWeight: 500, color: '#003d2e', lineHeight: 1 }}>
              {stepByKey.refill.badge_number}
            </span>
          </div>

          {/* ── State 19: "Refill" heading ── */}
          <p
            ref={refillHeadRef}
            style={{
              ...txt,
              left: S19.head.left, top: S19.head.top,
              margin: 0, fontSize: 48, fontWeight: 500, color: '#000',
              width: S19.head.w, lineHeight: 1, opacity: 0,
            }}
          >
            {stepByKey.refill.heading}
          </p>

          {/* ── State 19: description text ── */}
          <p
            ref={refillTextRef}
            style={{
              ...txt,
              left: S19.text.left, top: S19.text.top,
              margin: 0, fontSize: 24, fontWeight: 300, color: '#000',
              width: S19.text.w, letterSpacing: 0.3888, lineHeight: 1.35, opacity: 0,
            }}
          >
            {refillTexts.refill_text}
          </p>

          {/* ── State 20: Full-stock phone (crossfades over the State 19 phone, same spot) ── */}
          <div
            ref={phone20Ref}
            style={{
              position: 'absolute',
              left: S20.phone.left, top: S20.phone.top,
              width: S20.phone.w, height: S20.phone.h,
              opacity: 0,
            }}
          >
            <img
              alt=""
              src={ASSETS.phone20}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* ── State 20: 2nd "Refill" paragraph (with gradient highlight) ── */}
          <p
            ref={refillText2Ref}
            style={{
              ...txt,
              left: S20.text2.left, top: S20.text2.top,
              margin: 0, fontSize: 24, fontWeight: 300, color: '#000',
              width: S20.text2.w, letterSpacing: 0.3888, lineHeight: 1.35,
              whiteSpace: 'pre', opacity: 0,
            }}
          >
            {refillTexts.refill_text2}
            <span
              style={{
                fontWeight: 700,
                backgroundImage: 'linear-gradient(91.1deg, rgb(60,186,132) 0%, rgb(0,65,114) 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {refillTexts.refill_text2_emphasis}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
