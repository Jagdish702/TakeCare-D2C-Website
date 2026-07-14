import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AlertCards from './AlertCards';
import { useContent } from '../../context/ContentContext';

gsap.registerPlugin(ScrollTrigger);

/*
  "Nobody falls through the cracks." — Figma section 12068-1376 (States 0–5).

  Scroll reveals the device (State 0 sleeping → State 2 device).  Once the device
  is on screen, the top-view screen runs a ONE-TIME countdown 0:03 → 0:02 → 0:01
  → 0:00, then flips to a blinking red "Dose Missed" (node 12068-960).  When the
  countdown finishes, three alert cards pop up in sequence — left (Patient),
  middle (Caregiver), right (Command Centre) (States 3→4→5).

  The countdown plays once per page load; reloading the page replays it.
  All overlays are placed with object-fit:cover math so they stay locked to the
  device at any resolution.
*/

// Countdown plays once (0:03 → … → Dose Missed); after that the screen blinks.
const COUNT = ['03', '02', '01', '00', 'missed'];
const frameForTick = (t) =>
  t < COUNT.length ? COUNT[t] : ((t - COUNT.length) % 2 === 0 ? 'blank' : 'missed');
const fadeForTick = (t) => (t <= COUNT.length ? 600 : 240);

// Placement on the 2880×2048 State-2 PNG (measured).
const IMG_W = 2880;
const IMG_H = 2048;
const PANEL = { X: 1458, Y: 660, W: 1269, H: 486 };
const CANVAS = { w: IMG_W, h: IMG_H };

export default function NobodyFallsSection() {
  const { nobodyFalls, images } = useContent();

  // Top-view countdown panels (perspective-matched to the device top face).
  const FRAMES = {
    '03':   images['nobody-falls-topview-topview-03'],
    '02':   images['nobody-falls-topview-topview-02'],
    '01':   images['nobody-falls-topview-topview-01'],
    '00':   images['nobody-falls-topview-topview-00'],
    missed: images['nobody-falls-topview-topview-missed'],
    blank:  images['nobody-falls-topview-topview-blank'],
  };

  const outerRef   = useRef(null);
  const bg0Ref     = useRef(null);
  const bg2WrapRef = useRef(null);
  const panelRef   = useRef(null);
  const textRef    = useRef(null);
  const startedRef = useRef(false);

  const [started, setStarted]  = useState(false); // countdown begins when device is revealed
  const [tick, setTick]        = useState(0);
  const [bottomKey, setBottom] = useState('03');  // committed frame (always opaque)
  const [topFrame, setTopFr]   = useState(null);  // incoming frame fading in
  const [cardsOn, setCardsOn]  = useState(false);
  const [vpSize, setVpSize]    = useState({ w: window.innerWidth, h: window.innerHeight });

  /* ── Preload countdown panels ── */
  useEffect(() => {
    Object.values(FRAMES).forEach((src) => { const i = new Image(); i.src = src; });
  }, [images]);

  /* ── Track viewport for card placement ── */
  useEffect(() => {
    const onResize = () => setVpSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* ── Once revealed, advance one step per second (countdown plays once) ── */
  useEffect(() => {
    if (!started) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [started]);

  /* ── Drive crossfade + card trigger from the tick ── */
  useEffect(() => {
    if (!started) return;
    const k = frameForTick(tick);
    if (tick >= COUNT.length - 1) setCardsOn(true); // countdown reached "Dose Missed"
    if (k === bottomKey) return;
    const fade = fadeForTick(tick);
    setTopFr({ k, fade });
    const t = setTimeout(() => { setBottom(k); setTopFr(null); }, fade);
    return () => clearTimeout(t);
  }, [tick, started]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Lock countdown panel to the device (object-fit:cover math) ── */
  useEffect(() => {
    const place = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const s  = Math.max(vw / IMG_W, vh / IMG_H);
      const ox = (vw - IMG_W * s) / 2;
      const oy = (vh - IMG_H * s) / 2;
      if (panelRef.current) {
        const el = panelRef.current;
        el.style.left   = `${ox + PANEL.X * s}px`;
        el.style.top    = `${oy + PANEL.Y * s}px`;
        el.style.width  = `${PANEL.W * s}px`;
        el.style.height = `${PANEL.H * s}px`;
      }
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, []);

  /* ── Scroll-scrubbed State 0 → State 2; start countdown when device is revealed ── */
  useEffect(() => {
    const HEADER_SAFE = 64;
    const BOTTOM_SAFE = 28;
    const topFor = (which) => {
      const vh = window.innerHeight;
      const h  = textRef.current ? textRef.current.offsetHeight : 0;
      const maxTop = Math.max(HEADER_SAFE, vh - BOTTOM_SAFE - h);
      if (which === 'state2') return Math.min(Math.max(HEADER_SAFE, vh * 0.11), maxTop);
      return Math.min(vh * 0.42, maxTop);
    };

    const ctx = gsap.context(() => {
      gsap.set(bg2WrapRef.current, { opacity: 0, scale: 1.12 });
      gsap.set(bg0Ref.current,     { opacity: 1, scale: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start: 'top top',
          end:   'bottom bottom',
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Device is essentially revealed past ~80% — kick off the countdown once.
            if (!startedRef.current && self.progress >= 0.8) {
              startedRef.current = true;
              setStarted(true);
            }
          },
        },
      });

      const D = 0.8;
      tl.to(bg0Ref.current,     { opacity: 0, scale: 1.04, duration: D, ease: 'none' }, 0);
      tl.to(bg2WrapRef.current, { opacity: 1, scale: 1,    duration: D, ease: 'none' }, 0);
      tl.fromTo(
        textRef.current,
        { top: () => topFor('state0') },
        { top: () => topFor('state2'), duration: D, ease: 'none' },
        0,
      );
      tl.to({}, { duration: 1 - D }, D);
    }, outerRef);

    return () => ctx.revert();
  }, []);

  const layer = { position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' };

  return (
    <div ref={outerRef} style={{ height: '200vh' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          background: '#000',
        }}
      >
        {/* State 0 — sleeping scene */}
        <img
          ref={bg0Ref}
          src={images['nobody-falls-nobody-falls-scene']}
          alt=""
          draggable={false}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center', pointerEvents: 'none',
            willChange: 'opacity, transform',
          }}
        />

        {/* State 2 — pill-box dispenser + countdown + alert cards */}
        <div ref={bg2WrapRef} style={{ position: 'absolute', inset: 0, willChange: 'opacity, transform' }}>
          <img
            src={images['nobody-falls-nobody-falls-state2']}
            alt=""
            draggable={false}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center', pointerEvents: 'none',
            }}
          />

          {/* Device top-view countdown */}
          <div ref={panelRef} style={{ position: 'absolute', pointerEvents: 'none' }}>
            <img src={FRAMES[bottomKey]} alt="" draggable={false} style={layer} />
            {topFrame && (
              <img
                key={tick}
                src={FRAMES[topFrame.k]}
                alt=""
                draggable={false}
                style={{ ...layer, animation: `nf-fadein ${topFrame.fade}ms ease forwards` }}
              />
            )}
          </div>

          {/* Alert cards — pop up right → middle → left after the countdown */}
          <AlertCards visible={cardsOn} canvasSize={CANVAS} vpSize={vpSize} />
        </div>

        {/* Headline + subtext — rises up on scroll, always clearing the header */}
        <div
          ref={textRef}
          style={{
            position: 'absolute',
            left: '8.75%',
            width: 'clamp(280px, 41.25%, 594px)',
            top: '42%',
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(13px, 1.96vw, 28px)',
            willChange: 'top',
          }}
        >
          <p
            style={{
              fontSize: 'clamp(21px, 3.91vw, 56px)',
              fontWeight: 700, fontFamily: 'Inter, sans-serif', color: '#fff',
              lineHeight: 1.2, margin: 0,
            }}
          >
            {nobodyFalls.content.heading}
          </p>
          <div
            style={{
              fontSize: 'clamp(9px, 1.42vw, 21px)',
              fontWeight: 300, fontFamily: 'Inter, sans-serif', color: '#b2b2b2',
              lineHeight: 1.4,
            }}
          >
            <p style={{ margin: 0 }}>{nobodyFalls.content.subtext_line1}</p>
            <p style={{ margin: 0 }}>{nobodyFalls.content.subtext_line2}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
