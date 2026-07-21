import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useContent } from '../../context/ContentContext';
import { useFitScale } from '../../hooks/useFitScale';
import madeInIndiaImg from '../../assets/made in india IMG.png';

gsap.registerPlugin(ScrollTrigger);
// URL-bar show/hide on mobile fires resize events; refreshing a pinned scrub
// mid-scroll makes the whole scene jump. Dimension-only mobile resizes are safe
// to ignore — orientation changes still refresh.
ScrollTrigger.config({ ignoreMobileResize: true });

/**
 * Mobile Hero — Figma "Hero_mobile_option_2" (node 13058:4148), States 0-8.
 *
 * INTRO (auto-plays on load, matching web's Hero.tsx — NOT scroll-driven):
 *   0→2  heading shrinks 1.1842→1 & docks to top, product grows in, glass
 *        caption chip fades in ("Made in India"); once settled, the chip
 *        free-runs a 1s-per-swap crossfade loop through its 3 messages,
 *        completely decoupled from scroll.
 *
 * Then scrolling scrubs the remaining 4 beats:
 *   0→1  dark bg (A) crossfades to light bg (B); heading + chip exit;
 *        product shrinks & rises
 *   1→2  ecosystem block (heading + 4 cards + footer) zooms in
 *   2→3  ecosystem block exits; product blurs & drifts right
 *   3→4  app-phone block rises to centre
 *
 * Backgrounds: A is shared verbatim by states 0-4, B by 5-8 — each is mounted
 * once and only crossfaded at the intro→scroll boundary, never re-created or moved.
 *
 * All foreground geometry lives on a fixed 402×767 design canvas (Figma frame
 * size) that is contain-fit scaled to the area below the 54px sticky header;
 * the backgrounds sit on a duplicate canvas that is cover-fit scaled instead,
 * so they stay full-bleed at any viewport.
 */
const CANVAS_W = 402;
const CANVAS_H = 767;
const HEADER_H = 54;

// State-0 heading is the state-1 heading uniformly scaled up (78.838/66.575).
const HEADING_SCALE_0 = 78.838 / 66.575;
// State-0 product placeholder is 59.21×77.907 (vs 277×364 in state 1).
const PRODUCT_SCALE_0 = 59.21 / 277;

// Product frame (277×364) centre offsets from canvas centre, per state.
const PRODUCT = {
  s5: { cx: 8.08, cy: 234.65 - CANVAS_H / 2, scale: 186.482 / 277 },
  s6: { cx: 4.5, cy: -246, scale: 175 / 277 },
  s7: { cx: 49, cy: -244, scale: 170 / 277 },
};

// Background-B gradient overlays (one per Figma state, crossfaded on scrub).
const BG_LIGHT_GRADIENTS = [
  'linear-gradient(1.8432deg, rgba(0,0,0,0.32) 50.333%, rgba(255,255,255,0) 58.93%)', // state 5
  'linear-gradient(1.8423deg, rgba(59,51,44,0.6) 50.333%, rgba(255,255,255,0) 58.93%)', // state 6
  'linear-gradient(1.2414deg, rgba(0,0,0,0.32) 64.842%, rgba(255,255,255,0) 85.683%)', // state 7
  'linear-gradient(1.2414deg, rgba(0,0,0,0.48) 64.842%, rgba(255,255,255,0) 85.683%)', // state 8
];

const CAPTION_TEXT_STYLE: React.CSSProperties = {
  fontSize: 18,
  lineHeight: '28px',
  letterSpacing: '0.5825px',
  color: '#FFFFFF',
  textShadow: '0px 2px 20px rgba(0,65,114,0.08)',
};

// Figma "Glass/chip" effect + Outer/6 shadow set.
const GLASS_CHIP_STYLE: React.CSSProperties = {
  background: 'rgba(0,0,0,0)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  boxShadow: '0px 2px 20px rgba(0,65,114,0.08), inset 0px 0px 2px rgba(0,65,114,0.12)',
};

// The 2×2 ecosystem card grid shown in state 6 — each card is a single
// composite PNG (colour glow + subject baked in by Figma) with just the bold
// label overlaid at the bottom (values verbatim from Figma node 12620:11718).
const ECO_CARD_LABEL_CLASS =
  'relative shrink-0 whitespace-pre-line text-center font-inter font-bold not-italic text-black [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]';
const ECO_CARD_LABEL_STYLE: React.CSSProperties = {
  fontSize: 14,
  lineHeight: '16px',
  letterSpacing: '0.4536px',
};

export default function HeroMobile() {
  const { hero, images } = useContent();
  // Ecosystem card labels — image assets stay local; only the label text and
  // its order come from the DB (already sort_order-ascending).
  const ecosystemCards = [...hero.ecosystemCards].sort((a, b) => a.sort_order - b.sort_order);

  const triggerRef = useRef<HTMLDivElement>(null);

  const bgDarkRef = useRef<HTMLDivElement>(null);
  const bgGradientRefs = useRef<Array<HTMLDivElement | null>>([]);
  // Background B's blur is state-specific, not constant (verified per-state
  // against Figma): the "half blur" behind the text/ecosystem cards at
  // state 6 (node 13058:4188) is baked into the image asset itself; states
  // 7-8 need the whole frame blurred on top of that, via one extra layer
  // crossfaded exactly like the darkening gradients below.
  const blurFullRef = useRef<HTMLImageElement>(null);

  const headingRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const chipStackRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<Array<HTMLDivElement | null>>([]);
  const ecoBlockRef = useRef<HTMLDivElement>(null);
  const phoneBlockRef = useRef<HTMLDivElement>(null);

  const fitScale = useFitScale(CANVAS_W, CANVAS_H, HEADER_H);
  const [coverScale, setCoverScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const vw = document.documentElement.clientWidth;
      const vh = document.documentElement.clientHeight - HEADER_H;
      setCoverScale(Math.max(vw / CANVAS_W, vh / CANVAS_H));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useLayoutEffect(() => {
    if (!triggerRef.current) return;

    // Measurement-dependent canvas geometry. Mutated in place so the
    // function-based keyframe values below always read fresh numbers.
    const m = { headingY0: 0, productY0: 0, productCY: 0 };
    let alive = true;

    const ctx = gsap.context(() => {
      // ── Canvas-space layout (the 402×767 canvas itself never resizes) ────
      // State-1 flow: column top 40, [heading]-12-[product 364]-24-[chip].
      // State-0 (Figma: py-80, justify-center, gap 64) re-centres that column
      // with the heading scaled up and the product collapsed to its
      // 59.21×77.907 placeholder above a 124px-tall (hidden) chip.
      const measure = () => {
        const headingH = headingRef.current?.offsetHeight ?? 129;
        const productTop = 40 + headingH + 12;
        m.productCY = productTop + 182 - CANVAS_H / 2; // centre offset from canvas centre

        const h0 = headingH * HEADING_SCALE_0;
        const col0 = h0 + 28.421 + 77.907 + 64 + 124;
        const top0 = 80 + (607 - col0) / 2;
        m.headingY0 = top0 - 40;
        m.productY0 = top0 + h0 + 28.421 + 77.907 / 2 - CANVAS_H / 2 - m.productCY;

        gsap.set(productRef.current, { top: productTop });
        gsap.set(chipStackRef.current, { top: productTop + 364 + 24 });
      };

      measure();
      // Elements that stay put until their beat arrives.
      gsap.set(headingRef.current, { transformOrigin: 'top center' });
      chipRefs.current.forEach((el, i) => el && gsap.set(el, { opacity: 0, y: i === 0 ? 40 : 0 }));
      gsap.set(ecoBlockRef.current, { yPercent: -50, scale: 0.31, opacity: 0 });
      gsap.set(phoneBlockRef.current, { yPercent: -50, y: 336, opacity: 0 });
      bgGradientRefs.current.forEach((el, i) => el && gsap.set(el, { opacity: i === 0 ? 1 : 0 }));
      gsap.set(blurFullRef.current, { opacity: 0 });

      // ── Caption chip: free-running 1s-per-swap crossfade loop, fully
      // decoupled from scroll (Made in India → Peace of mind → Your
      // medicines → repeat). Built up front, started once the intro lands
      // on state 2; killed the moment the user starts scrolling.
      const HOLD = 0.6;
      const FADE = 0.4;
      const captionTl = gsap.timeline({ paused: true, repeat: -1 });
      for (let i = 0; i < 3; i++) {
        const cur = chipRefs.current[i % 3];
        const nxt = chipRefs.current[(i + 1) % 3];
        captionTl.to(cur, { opacity: 0, duration: FADE }, i + HOLD);
        captionTl.to(nxt, { opacity: 1, duration: FADE }, i + HOLD);
      }

      // ── INTRO (auto-plays on load): State 0 → State 2 — heading docks to
      // top, product grows in, Made-in-India chip fades in. NOT scroll-driven.
      let intro: gsap.core.Timeline | null = gsap.timeline({ paused: true, delay: 0.3 });
      intro.fromTo(
        headingRef.current,
        { y: () => m.headingY0, scale: HEADING_SCALE_0 },
        { y: 0, scale: 1, duration: 1, ease: 'power2.inOut' },
        0,
      );
      intro.fromTo(
        productRef.current,
        { x: 0, y: () => m.productY0, scale: PRODUCT_SCALE_0, opacity: 0, filter: 'blur(0px)' },
        { y: 0, scale: 1, opacity: 1, duration: 1, ease: 'power2.out' },
        0,
      );
      intro.fromTo(
        chipRefs.current[0],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        1.1,
      );

      // The pin exists from the very first frame (an unpinned window would let
      // the hero scroll away and then visibly snap once pinned). Every beat is
      // an explicit fromTo with function-based values, so the font-load
      // ScrollTrigger.refresh() below can re-evaluate all keyframes at any
      // scrub position without corrupting recorded start values.
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: triggerRef.current,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          start: `top ${HEADER_H}px`,
          end: '+=1800',
          scrub: 1,
          invalidateOnRefresh: true,
          // If the user starts scrolling before the intro/caption-loop settle,
          // fast-forward the intro and stop the loop so scroll's own fromTo
          // (which fades the whole chip stack) never fights either of them.
          onUpdate: (self) => {
            if (self.progress > 0.001) {
              if (intro) {
                intro.progress(1).kill();
                intro = null;
              }
              captionTl.pause();
            }
          },
        },
      });

      // Play the intro only when the page opens at the very top; on a reload
      // mid-page the scrub already owns these elements — skip straight to done.
      if (window.scrollY < 5 && (tl.scrollTrigger?.progress ?? 0) <= 0.001) {
        intro.eventCallback('onComplete', () => captionTl.play(0));
        intro.play();
      } else {
        intro.progress(1).kill();
        intro = null;
      }

      const productPose = (s: { cx: number; cy: number; scale: number }) => ({
        x: s.cx,
        y: () => s.cy - m.productCY,
        scale: s.scale,
      });

      // Beat 0→1: bg A → bg B; heading + chip stack exit; product shrinks & rises.
      tl.to(headingRef.current, { opacity: 0, duration: 0.4 }, 0);
      tl.fromTo(chipStackRef.current, { opacity: 1 }, { opacity: 0, duration: 0.4 }, 0);
      tl.fromTo(bgDarkRef.current, { opacity: 1 }, { opacity: 0, duration: 1 }, 0);
      tl.fromTo(
        productRef.current,
        { x: 0, y: 0, scale: 1 },
        { ...productPose(PRODUCT.s5), duration: 1 },
        0,
      );

      // Beat 1→2: ecosystem block zooms in, product settles higher.
      tl.fromTo(
        productRef.current,
        productPose(PRODUCT.s5),
        { ...productPose(PRODUCT.s6), duration: 1 },
        1,
      );
      tl.fromTo(ecoBlockRef.current, { opacity: 0, scale: 0.31 }, { opacity: 1, scale: 1, duration: 1 }, 1);
      tl.fromTo(bgGradientRefs.current[0], { opacity: 1 }, { opacity: 0, duration: 1 }, 1);
      tl.fromTo(bgGradientRefs.current[1], { opacity: 0 }, { opacity: 1, duration: 1 }, 1);

      // Beat 2→3: ecosystem block exits, product blurs & drifts right.
      tl.fromTo(ecoBlockRef.current, { y: 0 }, { opacity: 0, y: 60, duration: 0.7 }, 2);
      tl.fromTo(
        productRef.current,
        { ...productPose(PRODUCT.s6), filter: 'blur(0px)' },
        { ...productPose(PRODUCT.s7), filter: 'blur(16px)', duration: 1 },
        2,
      );
      tl.fromTo(bgGradientRefs.current[1], { opacity: 1 }, { opacity: 0, duration: 1 }, 2);
      tl.fromTo(bgGradientRefs.current[2], { opacity: 0 }, { opacity: 1, duration: 1 }, 2);
      tl.fromTo(blurFullRef.current, { opacity: 0 }, { opacity: 1, duration: 1 }, 2);

      // Beat 3→4: app-phone block rises to centre.
      tl.fromTo(phoneBlockRef.current, { opacity: 0, y: 336 }, { opacity: 1, y: 0, duration: 1 }, 3);
      tl.fromTo(bgGradientRefs.current[2], { opacity: 1 }, { opacity: 0, duration: 1 }, 3);
      tl.fromTo(bgGradientRefs.current[3], { opacity: 0 }, { opacity: 1, duration: 1 }, 3);

      // Webfonts change the heading height a few px; fold the exact metrics in
      // without rebuilding (refresh + invalidateOnRefresh re-runs the keyframe
      // functions at the current scrub position — no replay, no jump).
      document.fonts?.ready.then(() => {
        if (!alive) return;
        measure();
        ScrollTrigger.refresh();
      });
    }, triggerRef);

    return () => {
      alive = false;
      ctx.revert();
    };
  }, []);

  const canvasStyle = (scale: number): React.CSSProperties => ({
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: CANVAS_W,
    height: CANVAS_H,
    transform: `translate(-50%, -50%) scale(${scale})`,
  });

  return (
    <div ref={triggerRef} className="relative w-full md:hidden">
      <div
        className="relative w-full overflow-hidden bg-white"
        style={{ height: `calc(100svh - ${HEADER_H}px)`, minHeight: 480 }}
      >
        {/* ── Backgrounds: cover-fit canvas, mounted once, crossfaded only ── */}
        <div aria-hidden className="pointer-events-none" style={canvasStyle(coverScale)}>
          {/* Background B — light living room (states 5-8). The asset itself
              (Figma's flattened state-6 export, exactly 402×767 — native
              canvas size, no crop/offset needed) already bakes in the "half
              blur": sharp behind the product's table, naturally
              depth-of-field-blurred behind where the text/ecosystem cards
              sit. States 7-8 need the WHOLE frame blurred — that's the only
              extra layer required. */}
          <div className="absolute inset-0">
            <img
              src={images['hero-mobile-bg-light']}
              alt=""
              className="absolute inset-0 size-full max-w-none object-cover"
            />
            {/* States 7-8 — uniformly blurred on top of the (already
                half-blurred) base, fully hiding its sharp region too. */}
            <img
              ref={blurFullRef}
              src={images['hero-mobile-bg-light']}
              alt=""
              className="absolute inset-0 size-full max-w-none object-cover"
              style={{ filter: 'blur(24px)' }}
            />
            {BG_LIGHT_GRADIENTS.map((g, i) => (
              <div
                key={g}
                ref={(el) => (bgGradientRefs.current[i] = el)}
                className="absolute inset-0"
                style={{ backgroundImage: g }}
              />
            ))}
          </div>
          {/* Background A — dark night scene (states 0-4) */}
          <div ref={bgDarkRef} className="absolute inset-0">
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={images['hero-mobile-bg-dark']}
                alt=""
                className="absolute max-w-none"
                style={{ left: '-208.99%', top: '-48.8%', width: '437.75%', height: '148.8%' }}
              />
            </div>
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(180deg, rgba(0,0,0,0.8) 8.409%, rgba(0,0,0,0) 56.182%)',
              }}
            />
          </div>
        </div>

        {/* ── Foreground: contain-fit 402×767 canvas ── */}
        <div className="pointer-events-none" style={canvasStyle(fitScale)}>
          {/* Heading (states 0-4) */}
          <div
            ref={headingRef}
            className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center"
            style={{ top: 40, width: 325, gap: 24 }}
          >
            <p
              className="text-center font-inter font-medium not-italic [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
              style={{
                width: 249,
                fontSize: 24,
                lineHeight: 'normal',
                letterSpacing: '0.3888px',
                color: '#E5E5E5',
                textShadow: '0px 2px 20px rgba(0,65,114,0.08)',
              }}
            >
              {hero.content.subtitle}
            </p>
            <p
              className="whitespace-nowrap text-center font-inter font-bold not-italic [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
              style={{
                fontSize: 66.575,
                lineHeight: 'normal',
                filter: 'drop-shadow(0px 5.102px 51.015px rgba(0,65,114,0.08))',
              }}
            >
              <span
                style={{
                  backgroundImage: 'linear-gradient(180deg, #F2FBFF 0%, #DBF3FF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {hero.content.heading}
              </span>
            </p>
          </div>

          {/* Product (states 0-8) — flow slot of state 1, tweened from there */}
          <div
            ref={productRef}
            className="absolute"
            style={{
              left: (CANVAS_W - 277) / 2,
              top: 193,
              width: 277,
              height: 364,
              boxShadow: '24px 24px 20px 0px rgba(0,65,114,0.08)',
            }}
          >
            <img
              src={images['hero-product-sm']}
              alt="Take Care smart medicine dispenser"
              className="absolute inset-0 size-full max-w-none object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ boxShadow: 'inset 0px 0px 2px 0px rgba(0,65,114,0.12)' }}
            />
          </div>

          {/* Caption chips (states 2-4) — stacked, crossfaded */}
          <div
            ref={chipStackRef}
            className="absolute left-0 grid w-full justify-items-center"
            style={{ top: 581 }}
          >
            {/* State 2 — Made in India */}
            <div
              ref={(el) => (chipRefs.current[0] = el)}
              className="col-start-1 row-start-1 flex items-center justify-center self-start rounded-3xl"
              style={{ ...GLASS_CHIP_STYLE, width: 299, padding: 12, gap: 24 }}
            >
              <div className="relative shrink-0 overflow-hidden rounded-xl" style={{ width: 100, height: 100 }}>
                <img
                  src={madeInIndiaImg}
                  alt="Made in India"
                  className="absolute max-w-none"
                  style={{ height: '93%', left: '-6.33%', top: '4%', width: '106.21%' }}
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center" style={{ height: 89 }}>
                <p
                  className="whitespace-pre-line font-inter font-light not-italic [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
                  style={CAPTION_TEXT_STYLE}
                >
                  {hero.content.chip_india_text}
                </p>
              </div>
            </div>
            {/* State 3 — Peace of mind */}
            <div
              ref={(el) => (chipRefs.current[1] = el)}
              className="col-start-1 row-start-1 self-start rounded-3xl"
              style={{ ...GLASS_CHIP_STYLE, padding: 24 }}
            >
              <p
                className="whitespace-pre-line text-center font-inter font-light not-italic [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
                style={CAPTION_TEXT_STYLE}
              >
                {hero.content.chip_left_text}
              </p>
            </div>
            {/* State 4 — Your medicines */}
            <div
              ref={(el) => (chipRefs.current[2] = el)}
              className="col-start-1 row-start-1 self-start rounded-3xl"
              style={{ ...GLASS_CHIP_STYLE, padding: 24 }}
            >
              <p
                className="whitespace-pre-line text-center font-inter font-light not-italic [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
                style={CAPTION_TEXT_STYLE}
              >
                {hero.content.chip_right_text}
              </p>
            </div>
          </div>

          {/* Ecosystem block (state 6) */}
          <div
            ref={ecoBlockRef}
            className="absolute flex flex-col items-center"
            style={{ left: 39, top: 490.77, width: 323, gap: 24 }}
          >
            <p
              className="w-full text-center font-inter font-bold not-italic text-white [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
              style={{ fontSize: 24, lineHeight: '32px', textShadow: '0px 2px 8px rgba(0,65,114,0.08)' }}
            >
              {hero.content.ecosystem_heading}
            </p>

            <div
              className="grid w-full shrink-0"
              style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gridTemplateRows: 'repeat(2, minmax(0, 1fr))', gap: 16, height: 348.418 }}
            >
              {/* Smart Dispenser */}
              <div className="relative flex items-end justify-center self-stretch overflow-hidden" style={{ borderRadius: 32, paddingTop: 11.963, paddingBottom: 11.963 }}>
                <img src={images['figma-hero-eco-card-dispenser']} alt="" className="absolute inset-0 size-full max-w-none object-cover" />
                <p className={ECO_CARD_LABEL_CLASS} style={ECO_CARD_LABEL_STYLE}>
                  {ecosystemCards[0].label}
                </p>
              </div>
              {/* Takecare App */}
              <div className="relative flex items-end justify-center self-stretch overflow-hidden" style={{ borderRadius: 32, paddingTop: 11.963, paddingBottom: 11.963 }}>
                <img src={images['figma-hero-eco-card-app']} alt="" className="absolute inset-0 size-full max-w-none object-cover" />
                <p className={ECO_CARD_LABEL_CLASS} style={ECO_CARD_LABEL_STYLE}>
                  {ecosystemCards[1].label}
                </p>
              </div>
              {/* CureBay Services */}
              <div className="relative flex items-end justify-center self-stretch overflow-hidden" style={{ borderRadius: 32, paddingTop: 11.963, paddingBottom: 11.963 }}>
                <img src={images['figma-hero-eco-card-curebay']} alt="" className="absolute inset-0 size-full max-w-none object-contain" />
                <p className={ECO_CARD_LABEL_CLASS} style={ECO_CARD_LABEL_STYLE}>
                  {ecosystemCards[2].label}
                </p>
              </div>
              {/* 24×7 Command Centre */}
              <div className="relative flex items-end justify-center self-stretch overflow-hidden" style={{ borderRadius: 32, paddingTop: 11.963, paddingBottom: 11.963 }}>
                <img src={images['figma-hero-eco-card-command']} alt="" className="absolute inset-0 size-full max-w-none object-cover" />
                <p className={ECO_CARD_LABEL_CLASS} style={ECO_CARD_LABEL_STYLE}>
                  {ecosystemCards[3].label}
                </p>
              </div>
            </div>

            <p
              className="w-full text-center font-inter font-medium not-italic [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
              style={{
                fontSize: 20,
                lineHeight: '28px',
                letterSpacing: '0.324px',
                color: '#F9F9F9',
                textShadow: '0px 2px 8px rgba(0,65,114,0.08)',
              }}
            >
              {hero.content.ecosystem_footer_caption}
            </p>
          </div>

          {/* App-phone block (state 8) */}
          <div
            ref={phoneBlockRef}
            className="absolute flex flex-col items-center"
            style={{ left: 38, top: 383.92, width: 326.529, gap: 37.407 }}
          >
            <div className="relative shrink-0 overflow-hidden" style={{ width: 252.495, height: 511.435 }}>
              <img
                src={images['hero-app-phone']}
                alt="TakeCare mobile app"
                className="absolute left-0 w-full max-w-none"
                style={{ height: '100.69%', top: '-0.69%' }}
              />
            </div>
            <p
              className="whitespace-pre-line text-center font-inter font-medium not-italic [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
              style={{
                width: 253,
                fontSize: 20,
                lineHeight: '28px',
                letterSpacing: '0.324px',
                color: '#FFFFFF',
                textShadow: '0px 3.117px 9.352px rgba(0,65,114,0.08)',
              }}
            >
              {hero.content.phone_caption}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
