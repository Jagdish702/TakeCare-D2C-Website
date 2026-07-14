import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import iconChevronRight from '../../assets/profile-dashboard/icon-chevron-right-24.svg';
import rxDocImg from '../../assets/setup-specs/rx-document.png';
import phoneFillMedsImg from '../../assets/setup-specs/phone-fill-medicines.png';
import phoneDailyScheduleImg from '../../assets/setup-specs/phone-daily-schedule.png';
import phoneAllotmentImg from '../../assets/setup-specs/phone-allotment-success.png';
import deviceSpecsImg from '../../assets/setup-specs/device-specs-hero.png';

gsap.registerPlugin(ScrollTrigger);

/*
  "Set_up_&_specs_section" — Figma node 12628:10982, 9 states (0-8), each a
  1440x800 frame. Two acts sharing one card+phone+copy rig:

  Act 1 "Set Up & Refill" (states 0-3): Rx doc + phone walk through the app
  flow (Fill Medicines -> Daily Schedule -> Medicines Allotment Successful),
  copy reveals then fades.

  Interstitial (states 4-6): card collapses to a sliver, Rx/phone recentre,
  everything fades to nothing, then the big specs device image fades in
  centred — copy content silently swaps from "Set Up & Refill" to
  "Specifications" while still hidden.

  Act 2 "Specifications" (states 7-8): card reappears, device image docks to
  the right (overhanging the card edge, matching Act 1's phone-dock framing),
  copy reappears on the left.

  All positions below are absolute px on the 1440x800 canvas, computed from
  each state's exact Figma coordinates (translate(-50%,-50%) anchors resolved
  to top-left). The copy text is pinned at its one visible resting spot
  (x=357) throughout — Figma's own "left:562" mid-transition position is
  never visible (opacity 0 the whole time it's there), so it's dropped.
*/

const CANVAS_W = 1440;
const CANVAS_H = 800;
const OUTER_H = '800vh'; // 8 transitions x 100vh

const COPY = {
  setup: {
    eyebrow: 'Set Up & Refill',
    heading: ['Load once. ', 'Forget for 30 days.'],
    body: ['See how prescription upload, scheduling, ', 'and monthly refill work — step by step.'],
  },
  specs: {
    eyebrow: 'Specifications',
    heading: ['Engineered ', 'to Last'],
    body: ['Dimensions, materials, connectivity, and', 'what makes the device built to last.'],
  },
};

const CARD_CENTER_X = CANVAS_W / 2; // 720
const CARD_TOP = 150;
const CARD_H = 500;

function cardLeft(w) { return CARD_CENTER_X - w / 2; }

export default function SetupSpecsSection({ onExploreFlow }) {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const cardRef = useRef(null);
  const rxRef = useRef(null);
  const phoneRef = useRef(null);
  const phoneImgRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headingRef = useRef(null);
  const bodyRef = useRef(null);
  const ctaRef = useRef(null);

  const setCopy = (key) => {
    const c = COPY[key];
    if (eyebrowRef.current) eyebrowRef.current.textContent = c.eyebrow;
    if (headingRef.current) {
      headingRef.current.innerHTML = `<p style="margin:0">${c.heading[0]}</p><p style="margin:0">${c.heading[1]}</p>`;
    }
    if (bodyRef.current) {
      bodyRef.current.innerHTML = `<p style="margin:0">${c.body[0]}</p><p style="margin:0">${c.body[1]}</p>`;
    }
  };

  /* ── Scale canvas to fit viewport (same pattern as SpecificationsSection: CSS
       `position:sticky` does the pinning natively; GSAP only drives the scrub) ── */
  useEffect(() => {
    const update = () => {
      if (!canvasRef.current) return;
      const vw = document.documentElement.clientWidth;
      const vh = document.documentElement.clientHeight;
      const s = Math.min(1, vw / CANVAS_W, (vh - 52) / CANVAS_H);
      const ox = (vw - CANVAS_W * s) / 2;
      const oy = 52 + ((vh - 52) - CANVAS_H * s) / 2;
      canvasRef.current.style.transform = `translate(${ox}px, ${oy}px) scale(${s})`;
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    setCopy('setup');

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
        defaults: { ease: 'power2.inOut', duration: 1 },
      });

      // ── State 0 (initial DOM values, set directly — no tween into state 0) ──
      gsap.set(cardRef.current, { width: 900, left: cardLeft(900) });
      gsap.set(rxRef.current, { width: 295, height: 400, x: 450, y: 200, opacity: 1 });
      gsap.set(phoneRef.current, { width: 307, height: 635, x: 863, y: 83, opacity: 1 });
      gsap.set([eyebrowRef.current, headingRef.current, bodyRef.current, ctaRef.current], { opacity: 0 });
      phoneImgRef.current.src = phoneFillMedsImg;

      // ── 0 -> 1: Rx shrinks + slides right, phone swaps to Daily Schedule + shrinks slightly, copy fades in ──
      // .call() fires when the scrub playhead crosses a point in EITHER
      // direction, so a one-way assignment here would leave the image stuck
      // once a user scrolls past this label and then back up — check
      // scroll direction and assign the correct image for each direction.
      // The swap call itself is nudged to 's1+=0.01' (not exactly 's1',
      // i.e. time 0) — a .call() sitting exactly at a timeline's time 0
      // fires immediately on the very first render, before any real
      // scrolling, which was overwriting the Fill Medicines image at mount.
      tl.addLabel('s1')
        .to(rxRef.current, { width: 164.113, height: 222.526, x: 1009, y: 270 }, 's1')
        .to(phoneRef.current, { width: 278, height: 575, x: 892, y: 113 }, 's1')
        .call(() => {
          phoneImgRef.current.src = tl.scrollTrigger.direction === 1 ? phoneDailyScheduleImg : phoneFillMedsImg;
        }, null, 's1+=0.01')
        .to([eyebrowRef.current, headingRef.current, bodyRef.current, ctaRef.current], { opacity: 1 }, 's1');

      // ── 1 -> 2: Rx fades out, phone swaps to Allotment Successful + grows back to full size ──
      tl.addLabel('s2')
        .to(rxRef.current, { opacity: 0 }, 's2')
        .to(phoneRef.current, { width: 307, height: 635, x: 863, y: 83 }, 's2')
        .call(() => {
          phoneImgRef.current.src = tl.scrollTrigger.direction === 1 ? phoneAllotmentImg : phoneDailyScheduleImg;
        }, null, 's2');

      // ── 2 -> 3: copy fades out (phone/card hold) ──
      tl.addLabel('s3')
        .to([eyebrowRef.current, headingRef.current, bodyRef.current, ctaRef.current], { opacity: 0 }, 's3');

      // ── 3 -> 4: card collapses to a sliver, Rx reappears centred (brief), phone recentres ──
      tl.addLabel('s4')
        .to(cardRef.current, { width: 1, left: cardLeft(1) }, 's4')
        .to(rxRef.current, { width: 164.113, height: 222.526, x: 637.5, y: 270, opacity: 1 }, 's4')
        .to(phoneRef.current, { x: 566.5 }, 's4');

      // ── 4 -> 5: everything fades to nothing ──
      tl.addLabel('s5')
        .to(rxRef.current, { opacity: 0 }, 's5')
        .to(phoneRef.current, { opacity: 0 }, 's5');

      // ── 5 -> 6: device specs image fades in big + centred; copy silently swaps to Specifications ──
      tl.addLabel('s6')
        .call(() => {
          if (tl.scrollTrigger.direction === 1) {
            phoneImgRef.current.src = deviceSpecsImg;
            setCopy('specs');
          } else {
            phoneImgRef.current.src = phoneAllotmentImg;
            setCopy('setup');
          }
        }, null, 's6')
        .to(phoneRef.current, { width: 524, height: 712, x: 458.5, y: 77, opacity: 1 }, 's6');

      // ── 6 -> 7: card reappears full width, device image docks right (overhanging) ──
      tl.addLabel('s7')
        .to(cardRef.current, { width: 900, left: cardLeft(900) }, 's7')
        .to(phoneRef.current, { x: 815 }, 's7');

      // ── 7 -> 8: Specifications copy fades in — final resting state ──
      tl.addLabel('s8')
        .to([eyebrowRef.current, headingRef.current, bodyRef.current, ctaRef.current], { opacity: 1 }, 's8');
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} style={{ height: OUTER_H }}>
      {/* Pinned viewport — native CSS sticky, not GSAP's `pin` option (matches
          SpecificationsSection's proven pattern; GSAP pin + an already-absolute
          canvas target doesn't reliably pin). */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: '#fff' }}>
        <div
          ref={canvasRef}
          style={{
            width: CANVAS_W,
            height: CANVAS_H,
            position: 'absolute',
            top: 0,
            left: 0,
            transformOrigin: '0 0',
            background: '#fff',
            overflow: 'hidden',
          }}
        >
        {/* Card */}
        <div
          ref={cardRef}
          style={{
            position: 'absolute',
            top: CARD_TOP,
            height: CARD_H,
            borderRadius: 24,
            background: 'rgba(236,236,236,0.6)',
          }}
        />

        {/* Rx document image */}
        <div ref={rxRef} style={{ position: 'absolute', overflow: 'hidden', pointerEvents: 'none' }}>
          <img
            src={rxDocImg}
            alt=""
            draggable={false}
            style={{
              position: 'absolute', width: '110.13%', height: '119.72%',
              left: '-4.64%', top: '-7.04%', maxWidth: 'none', objectFit: 'cover',
            }}
          />
        </div>

        {/* Phone / device image */}
        <div ref={phoneRef} style={{ position: 'absolute', pointerEvents: 'none' }}>
          <img
            ref={phoneImgRef}
            alt=""
            draggable={false}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', maxWidth: 'none', objectFit: 'cover' }}
          />
        </div>

        {/* Copy block — fixed position, only opacity + content animate */}
        <div
          style={{
            position: 'absolute', left: 357, top: 400, width: 480,
            transform: 'translateY(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 48,
          }}
        >
          <p
            ref={eyebrowRef}
            className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
            style={{ margin: 0, width: '100%', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 24, letterSpacing: '0.3888px', color: '#008eb1', lineHeight: 'normal' }}
          />
          <div
            ref={headingRef}
            className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
            style={{ width: '100%', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 48, color: '#000', lineHeight: 'normal' }}
          />
          <div
            ref={bodyRef}
            className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
            style={{ width: 383, fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 18, letterSpacing: '0.5825px', lineHeight: '28px', color: '#4d4d4d' }}
          />
          <button
            ref={ctaRef}
            type="button"
            onClick={onExploreFlow}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              height: 48, padding: '12px 0', borderRadius: 16,
              background: 'transparent', border: 'none', cursor: 'pointer',
              filter: 'drop-shadow(0px 2px 2px rgba(0,65,114,0.08))',
              fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 16, letterSpacing: '0.2592px', color: '#004172',
            }}
          >
            Explore the flow
            <img
              src={iconChevronRight}
              alt=""
              style={{ width: 6.8, height: 11.8 }}
            />
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
