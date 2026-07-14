import { useRef, useEffect, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CARDS, CardBox, type CardDef } from '../NobodyFalls/AlertCards';

gsap.registerPlugin(ScrollTrigger);

/*
  Mobile "Nobody falls through the cracks." — Figma
  "Nobody_falls_through_the_cracks_Section_mobile" (node 12442:3291, States 0-5).

  Only TWO background images exist (both already in public/assets/nobody-falls,
  reused as-is — no new downloads):
    - nobody-falls-scene.png — used at TWO different crops: a close-up on the
      08:30 alarm clock (Figma State 0), then panned/zoomed out to the
      sleeping man + pillow (State 1). Same file, just re-cropped.
    - nobody-falls-state2.png — the device reveal (States 2+).

  Sequence (matches the Figma states):
    1. Clock close-up, no text.
    2. Crossfade to the full sleeping scene; headline+subtext fade/slide up
       into view, resting low — anchored so its own measured height always
       stays inside the frame, never clipped at the bottom.
    3. Crossfade to the product/device photo; text rises to the top
       (the header's bottom edge), where it stays for the rest of the
       sequence; the countdown starts once the device is revealed.
    4. Countdown ticks down, flips to "Dose Missed". Once it does, all three
       344px-wide cards pop in as a plain vertical stack — Patient,
       Caregiver, Command Centre top to bottom, 24px apart, starting 200px
       below the subheading. The stack is NOT scroll-driven within the
       frame: it simply runs downward, and everything past the one-screen
       frame's bottom edge EXTENDS the section below it (in flow, on the
       black background) rather than clipping. So once the pin releases,
       normal page scrolling continues down through the remaining cards
       before the next section arrives.
    5. The sequence plays ONCE per page load: the FIRST scroll after the
       cards appear (or crossing the pin's end, whichever comes first)
       kills the trigger permanently (see finish() below). From then on
       the section is a plain static block — a single scroll moves the
       page immediately, and scrolling back up never rewinds the beats;
       the completed frame just scrolls down and away. A reload starts
       fresh.

  The countdown panel is placed with the SAME cover-fit math desktop uses
  (object-fit:cover + measured panel X/Y/W/H on the 2880×2048 source),
  just re-centred on the panel instead of the photo's own centre — see
  CROP_CENTER_X below for why.
*/

const HEADER_H = 54;
// The pinned frame sits flush against the sticky header's bottom edge
// (pin start = `top ${HEADER_H}px`), so frame-local y=0 IS the header line:
// the risen text rests exactly 10px below the header.
const TEXT_TOP_PAD = 10;
const BOTTOM_SAFE = 28;

const FRAMES: Record<string, string> = {
  '03': '/assets/nobody-falls/topview/topview-03.png',
  '02': '/assets/nobody-falls/topview/topview-02.png',
  '01': '/assets/nobody-falls/topview/topview-01.png',
  '00': '/assets/nobody-falls/topview/topview-00.png',
  missed: '/assets/nobody-falls/topview/topview-missed.png',
  blank: '/assets/nobody-falls/topview/topview-blank.png',
};
const COUNT = ['03', '02', '01', '00', 'missed'];
const frameForTick = (t: number) =>
  t < COUNT.length ? COUNT[t] : (t - COUNT.length) % 2 === 0 ? 'blank' : 'missed';
const fadeForTick = (t: number) => (t <= COUNT.length ? 600 : 240);

// Same source photos/measurements as desktop (NobodyFallsSection.jsx) — no new assets.
const IMG_W = 2880;
const IMG_H = 2048;
const PANEL = { X: 1458, Y: 660, W: 1269, H: 486 };
// Re-centre the mobile crop on the panel instead of the photo's own centre —
// the panel (1269px) is wider than the ~1050px window a phone's cover-fit
// crop shows, so full visibility is impossible either way; this biases
// toward the "buffer time remaining / 0:03" text (left-of-centre in the
// panel) so the countdown reads fully even though its blank right edge clips.
const CROP_CENTER_X = 1900;

// All three cards render together as a plain vertical stack — Patient →
// Caregiver → Command Centre, top to bottom, CARD_GAP apart. The stack is
// static (no scroll-driven movement); whatever extends past the one-screen
// frame's bottom edge extends the SECTION instead of clipping, and is
// reached by normal page scrolling once the pin releases.
const MOBILE_CARD_ORDER: CardDef[] = [CARDS[0], CARDS[1], CARDS[2]];
const CARDS_GAP_FROM_TEXT = 200; // gap between the subheading and the top card
const CARD_W = 344;
const CARD_GAP = 24; // vertical gap between stacked cards

export default function NobodyFallsMobile() {
  const outerRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLImageElement>(null);
  const sleepRef = useRef<HTMLImageElement>(null);
  const bg2WrapRef = useRef<HTMLDivElement>(null);
  const deviceLayerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const finishedRef = useRef(false); // sequence fully played → pin permanently released
  const cardsOnRef = useRef(false); // mirrors cardsOn for the GSAP onUpdate closure

  const [started, setStarted] = useState(false);
  const [tick, setTick] = useState(0);
  const [bottomKey, setBottom] = useState('03');
  const [topFrame, setTopFrame] = useState<{ k: string; fade: number } | null>(null);
  const [cardsOn, setCardsOn] = useState(false);
  const [textBottom, setTextBottom] = useState(0); // frame-local bottom edge of the risen text block
  const [devicePose, setDevicePose] = useState({ left: 0, top: 0, width: 0, height: 0 });

  useEffect(() => {
    Object.values(FRAMES).forEach((src) => {
      const i = new Image();
      i.src = src;
    });
  }, []);

  useEffect(() => {
    if (!started) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const k = frameForTick(tick);
    if (tick >= COUNT.length - 1) {
      setCardsOn(true); // countdown reached "Dose Missed"
      cardsOnRef.current = true;
    }
    if (k === bottomKey) return;
    const fade = fadeForTick(tick);
    setTopFrame({ k, fade });
    const t = setTimeout(() => {
      setBottom(k);
      setTopFrame(null);
    }, fade);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, started]);

  // Cards sit CARDS_GAP_FROM_TEXT below the subheading's own rendered
  // bottom edge — measured directly off the text block rather than a guessed
  // percentage, so the gap holds regardless of how tall the wrapped text is.
  // Re-measures once webfonts finish loading: Inter's fallback-font metrics
  // render noticeably taller, so a measurement taken before document.fonts
  // settles overstates the text height and pushes the cards too far down.
  useLayoutEffect(() => {
    let alive = true;
    const measure = () => {
      if (!textRef.current) return;
      setTextBottom(TEXT_TOP_PAD + textRef.current.offsetHeight);
    };
    measure();
    document.fonts?.ready.then(() => { if (alive) measure(); });
    window.addEventListener('resize', measure);
    return () => {
      alive = false;
      window.removeEventListener('resize', measure);
    };
  }, []);

  // Lock the (reused, full-size) device photo + countdown panel together —
  // same cover-fit math as desktop, just re-centred on CROP_CENTER_X instead
  // of the photo's own centre (see file-level comment for why).
  useEffect(() => {
    const place = () => {
      // clientWidth/clientHeight (not window.innerWidth/innerHeight) — some
      // embedded/mobile webviews report a DPR-scaled innerWidth/innerHeight
      // that doesn't match actual CSS pixels, which throws off every
      // percentage-based position in this file if used instead.
      const vw = document.documentElement.clientWidth;
      const vh = document.documentElement.clientHeight;
      const s = Math.max(vw / IMG_W, vh / IMG_H);
      const ox = vw / 2 - CROP_CENTER_X * s;
      const oy = (vh - IMG_H * s) / 2;
      setDevicePose({ left: ox, top: oy, width: IMG_W * s, height: IMG_H * s });
      if (panelRef.current) {
        const el = panelRef.current;
        el.style.left = `${ox + PANEL.X * s}px`;
        el.style.top = `${oy + PANEL.Y * s}px`;
        el.style.width = `${PANEL.W * s}px`;
        el.style.height = `${PANEL.H * s}px`;
      }
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, []);

  // Pinned 3-beat reveal: clock close-up → sleeping scene (text fades in,
  // resting low) → device revealed (text rises to top, countdown starts).
  useEffect(() => {
    // No arbitrary "0.7 of viewport" ceiling — that could still let a tall
    // wrapped heading run past the bottom edge. Anchoring purely off
    // (FRAME height − bottom margin − the text's own measured height)
    // guarantees the text's bottom edge always lands inside the frame —
    // the frame is HEADER_H shorter than the viewport, so measuring
    // against the raw viewport height would clip the text's last line.
    const textTopLow = (frameH: number, h: number) =>
      Math.max(TEXT_TOP_PAD, frameH - BOTTOM_SAFE - h);
    const textTopHigh = () => TEXT_TOP_PAD;

    const ctx = gsap.context(() => {
      gsap.set(sleepRef.current, { opacity: 0 });
      gsap.set(bg2WrapRef.current, { opacity: 0, scale: 1.12 });
      gsap.set(clockRef.current, { opacity: 1 });
      gsap.set(textRef.current, { opacity: 0, y: 40 });

      // PLAY ONCE, NEVER REWIND: the moment the sequence has fully played
      // (scroll crossed the pin's end), the trigger — and with it the pin
      // and its 6000px scroll runway — is killed for good, and the section
      // becomes a plain static block: scrolling back up brings the WHOLE
      // completed frame down instead of scrubbing the beats backwards.
      // kill(true) is required — kill(false) leaves the pin-spacer (a
      // 6000px blank band above the parked frame); but the full revert
      // also wipes the tween styles, so the final composition is re-applied
      // by hand right after, and the scroll position is pulled back by the
      // collapsed runway so the swap is invisible.
      const finish = (self: ScrollTrigger) => {
        if (finishedRef.current) return;
        finishedRef.current = true;
        self.kill(true);
        gsap.set(clockRef.current, { opacity: 0 });
        gsap.set(sleepRef.current, { opacity: 0 });
        gsap.set(bg2WrapRef.current, { opacity: 1, scale: 1 });
        gsap.set(textRef.current, { opacity: 1, y: 0, top: TEXT_TOP_PAD });
        // Re-measure the remaining triggers on the now-shorter page, then
        // land the scroll so the frame top sits exactly on the header line
        // — the same view the pin just showed. All synchronous inside this
        // scroll callback, so nothing intermediate ever paints; refresh()'s
        // own scroll restoration is unreliable here (it nudged ~230px off),
        // hence the explicit position-based landing AFTER it.
        ScrollTrigger.refresh();
        const top = outerRef.current!.getBoundingClientRect().top;
        window.scrollTo(0, window.scrollY + top - HEADER_H);
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          start: `top ${HEADER_H}px`,
          // Upper bound only — long enough that the pin can't run out while
          // the wall-clock countdown plays. In practice the pin is released
          // much earlier, by the first scroll after the cards appear (see
          // onUpdate below); crossing this end is just the fallback for
          // someone who blasts straight through before the countdown ends.
          end: '+=6000',
          scrub: 1,
          invalidateOnRefresh: true,
          onLeave: (self) => finish(self),
          onUpdate: (self) => {
            if (!startedRef.current && self.progress >= 0.37) {
              startedRef.current = true;
              setStarted(true);
            }
            // Once the cards are up, the very NEXT scroll releases the pin —
            // no dead runway left to grind through: a single scroll after
            // the cards appear starts moving the page immediately.
            if (cardsOnRef.current) {
              finish(self);
              return;
            }
            // covers a reload restored past the end, where onLeave never fires
            if (self.progress >= 1) finish(self);
          },
        },
      });

      // Beat 1 → 2: clock close-up crossfades to the full sleeping scene;
      // text fades/slides up into view, resting low in the frame.
      tl.to(clockRef.current, { opacity: 0, duration: 0.15, ease: 'none' }, 0.05);
      tl.to(sleepRef.current, { opacity: 1, duration: 0.15, ease: 'none' }, 0.05);
      tl.to(
        textRef.current,
        {
          opacity: 1, y: 0, duration: 0.13, ease: 'none',
          onStart: () => gsap.set(textRef.current, { top: () => textTopLow(document.documentElement.clientHeight - HEADER_H, textRef.current!.offsetHeight) }),
        },
        0.08,
      );

      // Beat 2 → 3: sleeping scene crossfades to the device photo; text
      // rises from its low rest position to the top of the frame.
      tl.to(sleepRef.current, { opacity: 0, duration: 0.15, ease: 'none' }, 0.2);
      tl.to(bg2WrapRef.current, { opacity: 1, scale: 1, duration: 0.15, ease: 'none' }, 0.2);
      tl.to(
        textRef.current,
        { top: () => textTopHigh(), duration: 0.15, ease: 'none' },
        0.2,
      );

      tl.to({}, { duration: 0.65 }, 0.35); // hold — countdown runs, then the cards pop in
    }, outerRef);

    return () => ctx.revert();
  }, []);

  const layer: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  };

  return (
    <div className="w-full md:hidden">
      {/* Pinned reveal: clock → sleeping scene → device + countdown.
          No explicit height here, and no CSS position:sticky on the child —
          GSAP's pin:true (below) turns THIS element fixed for the pin's
          scroll duration and manages its own spacer height automatically.
          Setting an explicit height here too (as an earlier pass did, e.g.
          "220svh") fights that spacer: whatever gap is left between this
          guessed height and what the pin actually consumes renders as a
          dead black gap before the next section — exactly the bug reported. */}
      {/* bg black: the card stack below extends this element past the
          one-screen frame, and that tail must read as the same scene. */}
      <div ref={outerRef} className="relative w-full" style={{ background: '#000' }}>
        <div
          style={{
            position: 'relative',
            height: `calc(100svh - ${HEADER_H}px)`,
            minHeight: 480,
            overflow: 'hidden',
            background: '#000',
          }}
        >
          {/* Beat 1 — clock close-up (same photo, cropped low/right on the nightstand) */}
          <img
            ref={clockRef}
            src="/assets/nobody-falls/nobody-falls-scene.png"
            alt=""
            draggable={false}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: '78% 92%', pointerEvents: 'none',
            }}
          />

          {/* Beat 2 — same photo, panned out to the sleeping head + pillow */}
          <img
            ref={sleepRef}
            src="/assets/nobody-falls/nobody-falls-scene.png"
            alt=""
            draggable={false}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: '28% 32%', pointerEvents: 'none',
            }}
          />

          {/* Beat 3 — device revealed + countdown */}
          <div ref={bg2WrapRef} style={{ position: 'absolute', inset: 0, background: '#000', willChange: 'opacity, transform' }}>
            <div ref={deviceLayerRef} style={{ position: 'absolute', inset: 0 }}>
              <img
                src="/assets/nobody-falls/nobody-falls-state2.png"
                alt=""
                draggable={false}
                style={{
                  position: 'absolute',
                  left: devicePose.left, top: devicePose.top,
                  width: devicePose.width, height: devicePose.height,
                  maxWidth: 'none',
                  pointerEvents: 'none',
                }}
              />
              {/* Countdown panel — pasted on top of the product image, same
                  cover-fit placement logic as the desktop version. */}
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
            </div>
            {/* Fade the photo's clipped bottom edge into the black tail the
                card stack continues onto below the frame — without it the
                photo ends in a hard horizontal cut against flat black. */}
            <div
              style={{
                position: 'absolute', left: 0, right: 0, bottom: 0, height: 160,
                background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, #000 100%)',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Headline + subtext — Mobile/H0-B (48px bold) + Mobile/H2-L
              (24px light, 28px line-height). Fades in low (Beat 2), then
              rises to the top (Beat 3). */}
          <div
            ref={textRef}
            style={{
              position: 'absolute',
              left: 24,
              width: 'calc(100% - 48px)',
              top: '70%',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              willChange: 'top, opacity, transform',
            }}
          >
            <p
              style={{
                fontSize: 48, fontWeight: 700, fontFamily: 'Inter, sans-serif',
                color: '#fff', lineHeight: 1.1, margin: 0,
              }}
            >
              Nobody falls through the cracks.
            </p>
            <div style={{ fontSize: 24, fontWeight: 300, fontFamily: 'Inter, sans-serif', color: '#b2b2b2', lineHeight: '28px' }}>
              <p style={{ margin: 0 }}>One missed dose triggers</p>
              <p style={{ margin: 0 }}>three parallel alerts.</p>
            </div>
          </div>

        </div>

        {/* Alert cards — ALL THREE as a plain vertical stack, top card
            exactly CARDS_GAP_FROM_TEXT (200px) below the subheading,
            CARD_GAP (24px) between each card. The stack sits in normal
            flow AFTER the one-screen frame, pulled up over it with a
            negative margin — so instead of clipping at the frame's bottom
            edge, everything past it EXTENDS the pinned section: once the
            pin releases, normal page scrolling continues down through the
            remaining cards on the black background. The wrapper is ALWAYS
            mounted (its height is part of the section, so the pin's spacer
            math never changes mid-pin); the cards themselves stay hidden
            (opacity 0, same pattern as desktop AlertCards) until the
            countdown flips cardsOn and they pop in. Each card's wrapper
            owns nf-card-pop; the stack div itself has no animated
            transform — mixing a static transform and an animated one on
            the SAME element makes the animation's transform silently win
            and wipe out the static one, which is what broke card centring
            earlier. */}
        <div
          className="pointer-events-none relative mx-auto flex flex-col"
          style={{
            width: CARD_W,
            gap: CARD_GAP,
            // stack top = frame-local (textBottom + gap); it naturally
            // starts at the frame's bottom (100svh − header), so pull up
            // by the difference
            marginTop: `calc(${textBottom + CARDS_GAP_FROM_TEXT}px - 100svh + ${HEADER_H}px)`,
            paddingBottom: BOTTOM_SAFE,
          }}
        >
          {MOBILE_CARD_ORDER.map((card, i) => (
            <div
              key={card.key}
              className="pointer-events-auto flex w-full flex-col items-center gap-2"
              style={{
                animation: cardsOn
                  ? `nf-card-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) ${i * 150}ms both`
                  : 'none',
                opacity: 0,
                filter: 'drop-shadow(0 10px 22px rgba(0,0,0,0.45))',
              }}
            >
              <CardBox card={card} />
              <p
                style={{
                  fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 13,
                  color: '#fff', textAlign: 'center', margin: 0, letterSpacing: 0.26,
                }}
              >
                {card.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
