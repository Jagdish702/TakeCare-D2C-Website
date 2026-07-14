import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useContent } from '../../context/ContentContext';
import iconChevronRight from '../../assets/profile-dashboard/icon-chevron-right-24.svg';

gsap.registerPlugin(ScrollTrigger);

/*
  Mobile "Set_up_&_specs_section_mobile" — Figma node 12628:10982, 9 states
  (0-8), each a 402x890 frame (nodes 12628:10998/10999/11000/11001,
  13278:17200/17265/17278/17291/17304). All positions below are absolute px
  on this canvas, computed exactly from each state's Figma coordinates
  (translate(-50%,-50%) anchors resolved to top-left) — confirmed per-state,
  not interpolated/assumed:

  S0: card 354x500 centred (201,535). Rx 148x200 @ (127,518). Phone (Fill
      Medicines) 183x379 @ (109,95). Copy absent.
  S1: Rx shrinks+moves to 80x109 @ (161,319) — STAYS VISIBLE (opacity 1).
      Phone -> Daily Schedule, 169x348 @ (116,111). Copy fades IN here
      (not delayed to S2 — Figma shows it visible already at S1, no overlap
      with Rx since Rx sits inside the card's upper half and copy sits in
      the card's lower half).
  S2: Rx unchanged. Phone grows back to ~full size (182x377 @ 110,97),
      still Daily Schedule. Copy stays visible.
  S3: Rx fades out (same spot). Phone swaps to Allotment Successful, same
      182x377 @ (110,97) — no move, just a content swap. Copy fades out.
  S4: card collapses to a 1x1 point at the CANVAS centre (201,445) — not
      in place like the desktop version. Rx recentres (hidden) to
      80x109 @ (162,230). Phone recentres to 274x566 @ (65,162).
  S5: phone fades to nothing (collapses+fades) — interstitial blank beat.
  S6: phone swaps to the big Specifications device image, fades in at
      354x482 @ (25,205). Copy content silently swaps to "Specifications"
      while still hidden (opacity 0).
  S7: card reappears full size (354x500 @ 24,285). Phone docks to its
      final rest spot, 280x382 @ (59,109). Copy still hidden.
  S8: copy fades in — final resting state. Nothing else moves.

  Figma's mobile body copy is a SINGLE un-split paragraph (unlike the web
  version's forced 2-line break) — left to wrap naturally at width 299.
*/

const CANVAS_W = 402;
const CANVAS_H = 890;
const OUTER_H = '640vh'; // 8 transitions, lighter scroll distance than web

const CENTER_X = CANVAS_W / 2; // 201
const CARD_CENTER_Y = CANVAS_H / 2 + 90; // 535
const CARD_W = 354;
const CARD_H = 500;

function cardLeft(w) { return CENTER_X - w / 2; }
function cardTop(h) { return CARD_CENTER_Y - h / 2; }

export default function SetupSpecsSectionMobile({ onExploreFlow }) {
  const { setupSpecs, images } = useContent();
  const rxDocImg = images['setup-specs-rx-document'];
  const phoneFillMedsImg = images['setup-specs-phone-fill-medicines'];
  const phoneDailyScheduleImg = images['setup-specs-phone-daily-schedule'];
  const phoneAllotmentImg = images['setup-specs-phone-allotment-success'];
  const deviceSpecsImg = images['setup-specs-device-specs-hero'];
  const COPY = Object.fromEntries(
    setupSpecs.copy.map((row) => [row.act_key, {
      eyebrow: row.eyebrow,
      heading: [row.heading_line1, row.heading_line2],
      body: `${row.body_line1.trimEnd()} ${row.body_line2.trimStart()}`,
      cta: row.cta_label,
    }])
  );

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
  const ctaLabelRef = useRef(null);

  const setCopy = (key) => {
    const c = COPY[key];
    if (eyebrowRef.current) eyebrowRef.current.textContent = c.eyebrow;
    if (headingRef.current) {
      headingRef.current.innerHTML = `<p style="margin:0">${c.heading[0]}</p><p style="margin:0">${c.heading[1]}</p>`;
    }
    if (bodyRef.current) bodyRef.current.textContent = c.body;
    if (ctaLabelRef.current) ctaLabelRef.current.textContent = c.cta;
  };

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

      // ── State 0 ──
      gsap.set(cardRef.current, { width: CARD_W, height: CARD_H, left: cardLeft(CARD_W), top: cardTop(CARD_H) });
      gsap.set(rxRef.current, { width: 148, height: 201, x: 127, y: 518, opacity: 1 });
      gsap.set(phoneRef.current, { width: 183, height: 379, x: 109, y: 95, opacity: 1 });
      gsap.set([eyebrowRef.current, headingRef.current, bodyRef.current, ctaRef.current], { opacity: 0 });
      phoneImgRef.current.src = phoneFillMedsImg;

      // ── 0 -> 1: Rx shrinks + moves up into the card; phone -> Daily
      // Schedule; copy fades IN (visible from here through S2 — Rx lives in
      // the card's upper half, copy in its lower half, so no overlap) ──
      // .call() fires when the scrub playhead crosses a point in EITHER
      // direction, so a one-way assignment here would leave the image stuck
      // once a user scrolls past this label and then back up — check
      // scroll direction and assign the correct image for each direction.
      // The swap call itself is nudged to 's1+=0.01' (not exactly 's1',
      // i.e. time 0) — a .call() sitting exactly at a timeline's time 0
      // fires immediately on the very first render, before any real
      // scrolling, which was overwriting the Fill Medicines image at mount.
      tl.addLabel('s1')
        .to(rxRef.current, { width: 80, height: 109, x: 161, y: 319 }, 's1')
        .to(phoneRef.current, { width: 169, height: 348, x: 116, y: 111 }, 's1')
        .call(() => {
          phoneImgRef.current.src = tl.scrollTrigger.direction === 1 ? phoneDailyScheduleImg : phoneFillMedsImg;
        }, null, 's1+=0.01')
        .to([eyebrowRef.current, headingRef.current, bodyRef.current, ctaRef.current], { opacity: 1 }, 's1');

      // ── 1 -> 2: Rx holds in place; phone grows back to ~full size
      // (still Daily Schedule — the content swap happens next beat) ──
      tl.addLabel('s2')
        .to(phoneRef.current, { width: 182, height: 377, x: 110, y: 97 }, 's2');

      // ── 2 -> 3: Rx fades out; phone swaps to Allotment Successful in
      // the same spot (no move); copy fades out ──
      tl.addLabel('s3')
        .to(rxRef.current, { opacity: 0 }, 's3')
        .call(() => {
          phoneImgRef.current.src = tl.scrollTrigger.direction === 1 ? phoneAllotmentImg : phoneDailyScheduleImg;
        }, null, 's3')
        .to([eyebrowRef.current, headingRef.current, bodyRef.current, ctaRef.current], { opacity: 0 }, 's3');

      // ── 3 -> 4: card collapses to a point at the canvas centre; Rx and
      // phone recentre with it (Rx stays hidden, phone stays visible) ──
      tl.addLabel('s4')
        .to(cardRef.current, { width: 1, height: 1, left: 201, top: 445 }, 's4')
        .to(rxRef.current, { width: 80, height: 109, x: 162, y: 230 }, 's4')
        .to(phoneRef.current, { width: 274, height: 566, x: 65, y: 162 }, 's4');

      // ── 4 -> 5: phone fades to nothing — interstitial blank beat ──
      tl.addLabel('s5')
        .to(phoneRef.current, { opacity: 0 }, 's5');

      // ── 5 -> 6: swap to the big Specifications device image and fade it
      // in; copy content silently swaps while still hidden ──
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
        .to(phoneRef.current, { width: 354, height: 482, x: 25, y: 205, opacity: 1 }, 's6');

      // ── 6 -> 7: card reappears full size; device image docks to its
      // final rest spot ──
      tl.addLabel('s7')
        .to(cardRef.current, { width: CARD_W, height: CARD_H, left: cardLeft(CARD_W), top: cardTop(CARD_H) }, 's7')
        .to(phoneRef.current, { width: 280, height: 382, x: 59, y: 109 }, 's7');

      // ── 7 -> 8: Specifications copy fades in — final resting state ──
      tl.addLabel('s8')
        .to([eyebrowRef.current, headingRef.current, bodyRef.current, ctaRef.current], { opacity: 1 }, 's8');
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} style={{ height: OUTER_H }}>
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
        <div
          ref={cardRef}
          style={{ position: 'absolute', borderRadius: 24, background: 'rgba(236,236,236,0.6)' }}
        />

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

        <div ref={phoneRef} style={{ position: 'absolute', pointerEvents: 'none' }}>
          <img
            ref={phoneImgRef}
            alt=""
            draggable={false}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', maxWidth: 'none', objectFit: 'cover' }}
          />
        </div>

        <div
          style={{
            position: 'absolute', left: 51, top: 641.5, width: 299,
            transform: 'translateY(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 24,
          }}
        >
          <p
            ref={eyebrowRef}
            className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
            style={{ margin: 0, width: '100%', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 20, letterSpacing: '0.324px', color: '#008eb1', lineHeight: '28px' }}
          />
          <div
            ref={headingRef}
            className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
            style={{ width: '100%', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 32, color: '#000', lineHeight: 'normal' }}
          />
          <p
            ref={bodyRef}
            className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
            style={{ margin: 0, width: '100%', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 16, letterSpacing: '0.5178px', lineHeight: '24px', color: '#4d4d4d' }}
          />
          <button
            ref={ctaRef}
            type="button"
            onClick={onExploreFlow}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: 0, borderRadius: 16,
              background: 'transparent', border: 'none', cursor: 'pointer',
              filter: 'drop-shadow(0px 2px 2px rgba(0,65,114,0.08))',
              fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 16, letterSpacing: '0.2592px', color: '#004172',
            }}
          >
            <span ref={ctaLabelRef} />
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
