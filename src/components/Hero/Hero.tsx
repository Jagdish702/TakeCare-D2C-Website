import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useContent } from '../../context/ContentContext';
import { useFitScale } from '../../hooks/useFitScale';
import productShadowImg from '../../assets/figma-hero/product-shadow.svg';
import qrChipImg from '../../assets/figma-hero/qr-chip.png';
import iconApple from '../../assets/figma-hero/icon-apple.svg';
import iconAndroid from '../../assets/figma-hero/icon-android.svg';
import madeInIndiaImg from '../../assets/made in india IMG.png';
import bgLivingFallback from '../../assets/figma-hero/bg-living.png';

gsap.registerPlugin(ScrollTrigger);

/**
 * Web Hero — Figma "Hero" component set (node 12185:14642), States 0-7.
 * (States 9-10 — "A connected Ecosystem" — live in ConnectedEcosystem.tsx.)
 *
 * All geometry below is extracted verbatim from the Figma state variants via
 * get_design_context — do not round the fractional px values.
 *
 * One GSAP-pinned 1440×1000 canvas.
 *
 * INTRO (auto-plays on load, ~2s — NOT scroll-driven):
 *   0→2  heading shrinks & docks to top, product rises onto the bedside
 *        table, four glass chips pop in (night-bedroom background)
 *
 * Then scrolling scrubs 5 segments:
 *   2→3  night bg crossfades to the living-room bg (sharp — the photo's own
 *        depth-of-field); heading, subtitle and chips exit; product settles
 *   3→4  bg blur 0→24 + scrim; ecosystem block (heading + cards + caption) in
 *   4→5  blur 24→0, scrim out; ecosystem block exits up
 *   5→6  blur 0→24 + scrim; app-phone block rises
 *   6→7  product drifts down & shrinks; bg container zooms out slightly
 */

// ─── Product (Figma "Pill_dispenser" / "image 3") ─────────────────────────────
// State-2 resting box: 419×551, centre (50%-17.5px, 50%+78.5px).
// Poses are offsets from that centre + scale of the 551px-tall box.
const PRODUCT = {
  s0: { x: 45.6, y: 166.63, scale: 250.269 / 551 },   // 190.207×250.269 @ (+28.1, +245.13), hidden
  s3: { x: 234, y: -198, scale: 333 / 551 },          // 253×333 @ (+216.5, -119.5) — states 3-6
  s7: { x: 210.91, y: -109.39, scale: 308.636 / 551 },// 234.566×308.636 @ (+193.41, -30.89)
};

// ─── Living-room background container (Figma "img") ──────────────────────────
// 2794×1863 centred at (50%+78px, 50%+126.5px); state 7 shrinks it to
// 2590×1726.667 centred at (50%+65px, 50%+197.33px).
const BG_LIVING_S7 = { x: -13, y: 70.83, scale: 2590 / 2794 };

// State-0 heading/subtitle are the state-2 ones scaled up about their cap-top.
// The subtitle stays dead-centre in both states (Figma's small ±16px x drift
// was dropped on request — "it will be in middle").
const HEADING_S0 = { x: 9.6, y: 194.27, scale: 261.448 / 220.69 };   // 261.448px @ (50%+4.5, cap-top 385.27)
const SUBTITLE_S0 = { x: 0, y: 226, scale: 26.047 / 24 };            // 26.047px, cap-top 331

const CHIP_TEXT_STYLE: React.CSSProperties = {
  fontSize: '18px',
  lineHeight: '28px',
  letterSpacing: '0.5825px',
  color: '#FFFFFF',
  textShadow: '0px 2px 20px rgba(0,65,114,0.08)',
};

// Figma "Glass/chip" effect + Outer/6 shadow set.
const GLASS_CHIP_STYLE: React.CSSProperties = {
  background: 'rgba(0,0,0,0.00)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  boxShadow: '0px 2px 20px rgba(0,65,114,0.08), inset 0px 0px 2px rgba(0,65,114,0.12)',
};

// Ecosystem cards in the state-4 block — each a single composite PNG (colour
// glow + subject baked in by Figma) with just the bold label overlaid at the
// bottom (values verbatim from Figma node 12620:11540).
const ECO_CARD_LABEL_CLASS =
  'relative shrink-0 whitespace-pre-line text-center font-inter font-bold not-italic text-black [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]';
const ECO_CARD_LABEL_STYLE: React.CSSProperties = {
  fontSize: 16,
  lineHeight: '20px',
  letterSpacing: '0.5184px',
};

export default function Hero() {
  const { hero, images } = useContent();
  // Ecosystem card labels — image assets stay local; only the label text and
  // its order come from the DB (already sort_order-ascending).
  const ecosystemCards = [...hero.ecosystemCards].sort((a, b) => a.sort_order - b.sort_order);

  // Outer wrapper – gets pinned by ScrollTrigger
  const triggerRef = useRef<HTMLDivElement>(null);

  // Background layers
  const bgNightRef = useRef<HTMLDivElement>(null);
  const bgNightShadeRef = useRef<HTMLDivElement>(null);
  const bgLivingRef = useRef<HTMLDivElement>(null);
  const bgLivingBlurRef = useRef<HTMLImageElement>(null);
  const bgLivingScrimRef = useRef<HTMLDivElement>(null);

  // Heading / subtitle (states 0-2)
  const headingRef = useRef<HTMLParagraphElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  // Product + its cast shadow on the table (states 2-7 / state 2)
  const productRef = useRef<HTMLDivElement>(null);
  const productImgRef = useRef<HTMLImageElement>(null);
  const castShadowRef = useRef<HTMLDivElement>(null);

  // Glass chips (state 2)
  const chipRightRef = useRef<HTMLDivElement>(null);
  const chipLeftRef = useRef<HTMLDivElement>(null);
  const chipIndiaRef = useRef<HTMLDivElement>(null);
  const chipQRRef = useRef<HTMLDivElement>(null);

  // Ecosystem block (state 4) and app-phone block (states 6-7)
  const ecoBlockRef = useRef<HTMLDivElement>(null);
  const phoneBlockRef = useRef<HTMLDivElement>(null);

  // Contain-fit the 1440×1000 composition to the viewport (width AND height),
  // so nothing is clipped on narrow OR short screens. Never scales up past 1.
  // The 52px arg reserves the sticky header height.
  const fitScale = useFitScale(1440, 1000, 52);

  // useLayoutEffect (not useEffect) so setup/teardown run synchronously with
  // React's commit — closes the race where GSAP's own debounced global
  // `resize` listener calls refresh() on a ScrollTrigger whose pinned element
  // React already detached. See useIsMobile/HeroMobile.
  useLayoutEffect(() => {
    if (!triggerRef.current) return;
    const ctx = gsap.context(() => {
      // The State-0 → State-2 intro AUTO-PLAYS on load (not scroll-driven);
      // scrolling scrubs only States 2→7. Declared here so the ScrollTrigger
      // callback below can fast-forward it if the user scrolls mid-intro.
      let intro: gsap.core.Timeline | null = null;

      // ── Master timeline – scrubbed by scroll (States 2→7) ────────────────
      // 5 segments × 1 unit each. Scroll end "+=5000" → each unit = 1000px.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          pin: true,
          pinSpacing: true,
          start: 'top top',
          end: '+=5000',
          scrub: 1.5,
          invalidateOnRefresh: true,
          // Highest priority → recalculates first so the sections below always
          // measure against this pin's spacer.
          refreshPriority: 3,
          // If the user starts scrolling before the intro finishes, snap the
          // intro to its end so the scrub's fromTo starts never fight it.
          onUpdate: (self) => {
            if (self.progress > 0.001 && intro && intro.isActive()) {
              intro.progress(1).kill();
              intro = null;
            }
          },
        },
      });

      // ─── Initial states (State 0) ─────────────────────────────────────────
      // autoAlpha (opacity + visibility:hidden) — chips and product are HARD
      // hidden until their intro beat; a plain opacity:0 can flash as ghost
      // elements before GSAP initialises.
      gsap.set(productRef.current, { ...PRODUCT.s0, autoAlpha: 0, xPercent: -50, yPercent: -50 });
      gsap.set(castShadowRef.current, { autoAlpha: 0 });
      [chipRightRef, chipLeftRef, chipIndiaRef, chipQRRef].forEach((r) =>
        gsap.set(r.current, { autoAlpha: 0, scale: 0.8 }),
      );
      gsap.set(bgNightShadeRef.current, { opacity: 0 });
      // Resting blur is 8px per Figma (State=2/4) — the living-room bg is
      // never fully sharp; only the ecosystem/phone beats push it to 24px.
      // Blur only applies to the masked duplicate (left half) — see
      // bgLivingBlurRef below — not the whole container, per explicit
      // request for a left-blurred / right-clear split (a deliberate
      // deviation from Figma, which blurs the layer uniformly).
      gsap.set(bgLivingRef.current, {
        opacity: 0, x: 0, y: 0, scale: 1, xPercent: -50, yPercent: -50,
      });
      gsap.set(bgLivingBlurRef.current, { filter: 'blur(8px)' });
      gsap.set(bgLivingScrimRef.current, { opacity: 0 });
      gsap.set(ecoBlockRef.current, { y: 197, opacity: 0, xPercent: -50, yPercent: -50 });
      gsap.set(phoneBlockRef.current, { y: 787, opacity: 0, xPercent: -50, yPercent: -50 });
      // Heading & subtitle start at the larger / lower State-0 poses.
      // transformOrigin 'top center' keeps the trimmed cap-top exactly where
      // y says it is while the scale animates (no drift — see HeroMobile).
      // xPercent owns the horizontal centering — a CSS -translate-x-1/2 class
      // would be wiped by GSAP's inline transform (it only sometimes infers
      // the -50%, which un-centred the subtitle).
      gsap.set(headingRef.current, { ...HEADING_S0, opacity: 0, xPercent: -50, transformOrigin: 'top center' });
      gsap.set(subtitleRef.current, { ...SUBTITLE_S0, opacity: 0, xPercent: -50, transformOrigin: 'top center' });

      // ─── INTRO (auto-plays on load): State 0 → State 2, in three beats ────
      //  1. "Take Care" + subtitle fade in at the CENTRE of the dark scene
      //  2. text docks to the top while the product rises from below the fold
      //  3. the four glass chips pop in, staggered
      intro = gsap.timeline({ paused: true, delay: 0.3 });
      // Beat 1 — text appears in the middle
      intro.to([headingRef.current, subtitleRef.current], {
        opacity: 1,
        duration: 0.9, ease: 'power2.out',
      }, 0);
      // Beat 2 (starts after a short hold) — text docks up, product rises
      intro.to(headingRef.current, {
        x: 0, y: 0, scale: 1,
        duration: 1.1, ease: 'power2.inOut',
      }, 1.5);
      intro.to(subtitleRef.current, {
        x: 0, y: 0, scale: 1,
        duration: 1.1, ease: 'power2.inOut',
      }, 1.5);
      intro.to(bgNightShadeRef.current, { opacity: 1, duration: 1.1 }, 1.5);
      intro.to(productRef.current, {
        x: 0, y: 0, autoAlpha: 1, scale: 1,
        duration: 1.2, ease: 'power2.out',
      }, 1.7);
      intro.to(castShadowRef.current, { autoAlpha: 1, duration: 0.8 }, 2.1);
      // Beat 3 — chips pop in only AFTER the pill box has fully risen
      // (product tween ends at 1.7 + 1.2 = 2.9; chips start after it settles)
      [chipRightRef, chipLeftRef, chipIndiaRef, chipQRRef].forEach((r, i) => {
        intro!.to(r.current, {
          autoAlpha: 1, scale: 1,
          duration: 0.5, ease: 'back.out(1.7)',
        }, 3.1 + i * 0.12);
      });

      // Play the intro only when the page opens at the very top; on a reload
      // mid-page the scrub already owns these elements — skip straight to done.
      if (window.scrollY < 5 && (tl.scrollTrigger?.progress ?? 0) <= 0.001) {
        intro.play();
      } else {
        intro.progress(1).kill();
        intro = null;
      }

      // ─── SEGMENT 0 (scroll, 2→3): State 2 → State 3 ───────────────────────
      // Explicit fromTo (immediateRender:false) — the "from" is the State-2
      // pose the intro lands on, so a mid-intro scroll can never corrupt it.
      tl.fromTo([chipRightRef.current, chipLeftRef.current, chipIndiaRef.current,
             chipQRRef.current, headingRef.current, subtitleRef.current,
             castShadowRef.current], { opacity: 1 }, {
        opacity: 0, duration: 0.4, immediateRender: false,
      });
      // Night bg fades, living-room bg fades in
      tl.to(bgNightRef.current, { opacity: 0, duration: 0.7 }, '<');
      tl.to(bgLivingRef.current, { opacity: 1, duration: 0.7 }, '<');
      // Product settles onto the coffee table (img opacity .95 per Figma)
      tl.fromTo(productRef.current, { x: 0, y: 0, scale: 1 }, {
        ...PRODUCT.s3,
        duration: 0.8, ease: 'power2.inOut', immediateRender: false,
      }, '<0.1');
      tl.fromTo(productImgRef.current, { opacity: 1 }, {
        opacity: 0.95, duration: 0.8, immediateRender: false,
      }, '<');
      // Pad to 1 unit
      tl.to({}, { duration: 0.1 });

      // ─── SEGMENT 3 (3→4): State 3 → State 4 – ecosystem block enters ─────
      tl.to(bgLivingBlurRef.current, {
        filter: 'blur(24px)',
        duration: 1, ease: 'power2.inOut',
      });
      tl.to(bgLivingScrimRef.current, { opacity: 1, duration: 1 }, '<');
      tl.to(ecoBlockRef.current, {
        y: 0, opacity: 1,
        duration: 1, ease: 'power2.out',
      }, '<');

      // ─── SEGMENT 4 (4→5): State 4 → State 5 – ecosystem block exits ──────
      tl.to(ecoBlockRef.current, {
        y: -332, opacity: 0,
        duration: 1, ease: 'power2.in',
      });
      tl.to(bgLivingBlurRef.current, {
        filter: 'blur(8px)',
        duration: 1, ease: 'power2.inOut',
      }, '<');
      tl.to(bgLivingScrimRef.current, { opacity: 0, duration: 1 }, '<');

      // ─── SEGMENT 5 (5→6): State 5 → State 6 – app-phone block rises ──────
      tl.to(bgLivingBlurRef.current, {
        filter: 'blur(24px)',
        duration: 1, ease: 'power2.inOut',
      });
      tl.to(bgLivingScrimRef.current, { opacity: 1, duration: 1 }, '<');
      tl.to(phoneBlockRef.current, {
        y: 0, opacity: 1,
        duration: 1, ease: 'power2.out',
      }, '<');

      // ─── SEGMENT 6 (6→7): State 6 → State 7 – product drifts, bg zooms out ─
      tl.to(productRef.current, {
        ...PRODUCT.s7,
        duration: 1, ease: 'power2.inOut',
      });
      tl.to(bgLivingRef.current, { ...BG_LIVING_S7, duration: 1, ease: 'power2.inOut' }, '<');
    }, triggerRef);

    return () => ctx.revert();
  }, []);

  return (
    // ── Outer trigger wrapper – ScrollTrigger pins this ───────────────────
    <div ref={triggerRef} className="relative w-full">
      {/* ── Visible hero viewport ─────────────────────────────────────────── */}
      <div
        className="relative h-screen w-full overflow-hidden bg-white"
        style={{ minHeight: '480px' }}
      >
        {/* ── BG Layer 2: living room (states 3-7) ───────────────────────── */}
        {/*   Figma: 2794×1863 container centred at (50%+78px, 50%+126.5px). */}
        {/*   Figma itself blurs this layer UNIFORMLY (8px rest / 24px on    */}
        {/*   the ecosystem+phone beats) — no split. Per explicit request,   */}
        {/*   this is a deliberate deviation: a masked duplicate blurs only  */}
        {/*   the left half, faded out toward the right so the table/       */}
        {/*   product side of the photo stays clear.                        */}
        <div
          ref={bgLivingRef}
          className="pointer-events-none absolute"
          style={{
            left: 'calc(50% + 78px)',
            top: 'calc(50% + 126.5px)',
            width: '2794px',
            height: '1863px',
            transform: 'translate(-50%, -50%)',
          }}
          aria-hidden
        >
          <img
            // DB `figma-hero-bg-living` currently points at the mobile portrait
            // crop, not this web landscape scene — use the static asset until
            // the CDN row is corrected.
            // Sizing matches Figma's exact fill exactly (99.946% x 99.98% at
            // 0.786px/0.109px) rather than a flat 100% cover.
            src={bgLivingFallback}
            alt=""
            className="absolute max-w-none object-cover"
            style={{
              left: '0.0281%', top: '0.0059%',
              width: '99.946%', height: '99.98%',
              backgroundColor: 'lightgray',
            }}
          />
          {/* Blurred duplicate, masked so only the left half stays blurred —
              fades out across the middle so the seam isn't a hard line. */}
          <img
            ref={bgLivingBlurRef}
            src={bgLivingFallback}
            alt=""
            className="absolute max-w-none object-cover"
            style={{
              left: '0.0281%', top: '0.0059%',
              width: '99.946%', height: '99.98%',
              WebkitMaskImage: 'linear-gradient(to right, black 0%, black 40%, transparent 60%)',
              maskImage: 'linear-gradient(to right, black 0%, black 40%, transparent 60%)',
            }}
          />
          {/* Left dark scrim (states 4/6/7) so the white copy stays legible */}
          <div
            ref={bgLivingScrimRef}
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(90.5508deg, rgba(0,0,0,0.48) 54.679%, rgba(255,255,255,0) 93.825%)',
            }}
          />
        </div>

        {/* ── BG Layer 1: dark night bedroom (states 0-2) ────────────────── */}
        {/*   Figma's canvas (1440×1000, aspect 1.44) is almost an exact       */}
        {/*   match for the photo's own aspect (2764×1892, 1.46) — effectively */}
        {/*   no crop at the design's own size. At other viewport aspects,    */}
        {/*   a bare center object-position crops into the lamp/nightstand/bed */}
        {/*   on the right and leaves excess empty wall on the left; anchoring */}
        {/*   right keeps that detail in frame and sacrifices the (empty) left */}
        {/*   margin instead. */}
        <div ref={bgNightRef} className="pointer-events-none absolute inset-0" aria-hidden>
          <img
            src={images['figma-hero-bg-night']}
            alt=""
            className="absolute inset-0 size-full max-w-none object-cover"
            style={{ objectPosition: 'right center' }}
          />
          {/* Top-to-bottom black fade so the heading area reads dark in state 2 */}
          <div
            ref={bgNightShadeRef}
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(to bottom, rgba(0,0,0,0.8) 8.409%, rgba(0,0,0,0) 56.182%)',
            }}
          />
        </div>

        {/* ── Foreground content ──────────────────────────────────────────
            Wrapper scales the whole 1440-wide composition down (about its
            centre) on displays narrower than 1440 so nothing is clipped.
            Backgrounds above stay full-bleed; the pinned trigger is untouched. */}
        <div
          className="absolute inset-x-0 bottom-0"
          style={{ top: '52px', transform: `scale(${fitScale})`, transformOrigin: 'center center' }}
        >
        {/* ── Subtitle (states 0-2) ─────────────────────────────────────── */}
        {/*   Horizontally centred; cap-top at 50%-395px (state 2).          */}
        {/*   GSAP animates y/scale on the <p> about its top-centre.         */}
        <div
          className="pointer-events-none absolute left-1/2"
          style={{ top: 'calc(50% - 395px)' }}
        >
          <p
            ref={subtitleRef}
            className="text-center font-inter font-medium not-italic whitespace-nowrap [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
            style={{
              fontSize: '24px',
              lineHeight: 'normal',
              letterSpacing: '0.3888px',
              color: '#E5E5E5',
              textShadow: '0px 2px 20px rgba(0,65,114,0.08)',
            }}
          >
            {hero.content.subtitle}
          </p>
        </div>

        {/* ── "Take Care" Heading (states 0-2) ──────────────────────────── */}
        {/*   Wrapper = state-2 pose: (50%-5.1px, cap-top 50%-309px), w 1213.793. */}
        <div
          className="pointer-events-none absolute left-1/2"
          style={{ top: 'calc(50% - 309px)', marginLeft: '-5.1px' }}
        >
          <p
            ref={headingRef}
            className="text-center font-inter font-bold not-italic [word-break:break-word] [text-box-trim:trim-both] [text-box-edge:cap_alphabetic] whitespace-nowrap"
            style={{
              width: '1213.793px',
              fontSize: '220.69px',
              lineHeight: 'normal',
              filter: 'drop-shadow(0px 3.678px 36.782px rgba(0,65,114,0.08))',
            }}
          >
            <span style={{
              backgroundImage: 'linear-gradient(180deg, #F2FBFF 0%, #DBF3FF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>{hero.content.heading}</span>
          </p>
        </div>

        {/* ── Product cast shadow on the table (state 2) ────────────────── */}
        {/*   Figma "Vector 6": 417×240.5 at (408.5, 774) canvas coords;     */}
        {/*   the SVG bleeds -9.15%/-5.28% for its baked gaussian blur.      */}
        <div
          ref={castShadowRef}
          className="pointer-events-none absolute"
          style={{
            left: 'calc(50% - 311.5px)',
            top: 'calc(50% + 274px)',
            width: '417px',
            height: '240.5px',
          }}
          aria-hidden
        >
          <img
            src={productShadowImg}
            alt=""
            className="absolute max-w-none"
            style={{ inset: '-9.15% -5.28%', width: '110.56%', height: '118.3%' }}
          />
        </div>

        {/* ── Single Product Image ──────────────────────────────────────── */}
        {/*   State-2 resting box: 419×551 centred at (50%-17.5, 50%+78.5)   */}
        <div
          ref={productRef}
          className="pointer-events-none absolute"
          style={{
            left: 'calc(50% - 17.5px)',
            top: 'calc(50% + 78.5px)',
            width: '419px',
            height: '551px',
            transformOrigin: 'center center',
            boxShadow: '24px 24px 20px 0px rgba(0,65,114,0.08)',
          }}
        >
          <img
            ref={productImgRef}
            src={images['figma-hero-product']}
            alt="Take Care smart medicine dispenser"
            className="absolute inset-0 size-full max-w-none object-cover object-bottom"
          />
          <div
            className="absolute inset-0"
            style={{ boxShadow: 'inset 0px 0px 2px 0px rgba(0,65,114,0.12)' }}
          />
        </div>

        {/* ── Chip Right – "Your medicines. On time." (state 2) ─────────── */}
        <div
          ref={chipRightRef}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-3xl p-6"
          style={{
            left: 'calc(50% + 401.5px)',
            top: 'calc(50% - 51.5px)',
            transformOrigin: 'center center',
            ...GLASS_CHIP_STYLE,
          }}
        >
          <p
            className="shrink-0 whitespace-pre-line text-center font-inter font-light not-italic [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
            style={CHIP_TEXT_STYLE}
          >
            {hero.content.chip_right_text}
          </p>
        </div>

        {/* ── Chip Left – "Peace of mind..." (state 2) ──────────────────── */}
        <div
          ref={chipLeftRef}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-3xl p-6"
          style={{
            left: 'calc(50% - 430px)',
            top: 'calc(50% + 18.5px)',
            transformOrigin: 'center center',
            ...GLASS_CHIP_STYLE,
          }}
        >
          <p
            className="shrink-0 whitespace-pre-line text-center font-inter font-light not-italic [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
            style={CHIP_TEXT_STYLE}
          >
            {hero.content.chip_left_text}
          </p>
        </div>

        {/* ── Chip Made-in-India (state 2, bottom left) ─────────────────── */}
        <div
          ref={chipIndiaRef}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-6 rounded-3xl p-3"
          style={{
            left: 'calc(50% - 433.5px)',
            top: 'calc(50% + 304px)',
            width: '299px',
            transformOrigin: 'center center',
            ...GLASS_CHIP_STYLE,
          }}
        >
          <div className="relative shrink-0 overflow-hidden rounded-xl" style={{ width: 100, height: 100 }}>
            <img
              src={madeInIndiaImg}
              alt="Made in India"
              className="absolute max-w-none"
              style={{ height: '93%', left: '-6.33%', top: '4%', width: '106.21%' }}
            />
          </div>
          <div className="flex shrink-0 flex-col justify-center" style={{ width: 151, height: 89 }}>
            <p
              className="font-inter font-light not-italic [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
              style={CHIP_TEXT_STYLE}
            >
              {hero.content.chip_india_text.split('\n').map((line: string, i: number, lines: string[]) => (
                <span key={i}>
                  {line}
                  {i < lines.length - 1 && <br />}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* ── Chip QR – "Scan the QR code..." (state 2, bottom right) ───── */}
        <div
          ref={chipQRRef}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-6 rounded-3xl p-3"
          style={{
            left: 'calc(50% + 459.5px)',
            top: 'calc(50% + 304px)',
            width: '345px',
            transformOrigin: 'center center',
            ...GLASS_CHIP_STYLE,
          }}
        >
          <div
            className="relative shrink-0 overflow-hidden rounded-xl"
            style={{ width: 100, height: 100, border: '0.353px solid #004172' }}
          >
            <img
              src={qrChipImg}
              alt="QR code to download the TakeCare app"
              className="absolute inset-0 size-full max-w-none rounded-xl object-cover"
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-start justify-between" style={{ height: 89 }}>
            <p
              className="min-w-full font-inter font-light not-italic [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
              style={{ ...CHIP_TEXT_STYLE, width: 'min-content' }}
            >
              {hero.content.chip_qr_caption}
            </p>
            <div className="flex items-center gap-4">
              <img src={iconApple} alt="iOS" className="size-6 max-w-none" />
              <img src={iconAndroid} alt="Android" className="size-6 max-w-none" />
            </div>
          </div>
        </div>

        {/* ── Ecosystem block (state 4) ──────────────────────────────────── */}
        {/*   Column centred at (50%-369px, 50%+0.5px), w 432, gap 48.        */}
        {/*   Text colours follow the Figma render (dark on the light blur),  */}
        {/*   not the variable-mode white in the extracted code.              */}
        <div
          ref={ecoBlockRef}
          className="absolute flex flex-col items-start not-italic"
          style={{
            left: 'calc(50% - 369px)',
            top: 'calc(50% + 0.5px)',
            width: '432px',
            gap: '48px',
          }}
        >
          <p
            className="relative shrink-0 w-full whitespace-pre-wrap font-inter font-bold [text-box-trim:trim-both] [text-box-edge:cap_alphabetic] [word-break:break-word]"
            style={{
              fontSize: '48px',
              lineHeight: 'normal',
              color: '#FFFFFF',
              textShadow: '0px 2px 8px rgba(0,65,114,0.08)',
            }}
          >
            {hero.content.ecosystem_heading}
          </p>

          <div
            className="grid w-full shrink-0"
            style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gridTemplateRows: 'repeat(2, minmax(0, 1fr))', columnGap: 24.046, rowGap: 17.413, height: 465.996 }}
          >
            {/* Smart Dispenser */}
            <div className="relative flex items-end justify-center self-stretch overflow-hidden" style={{ borderRadius: 32, paddingTop: 16, paddingBottom: 16 }}>
              <img src={images['figma-hero-eco-card-dispenser']} alt="" className="absolute inset-0 size-full max-w-none object-cover" />
              <p className={ECO_CARD_LABEL_CLASS} style={ECO_CARD_LABEL_STYLE}>
                {ecosystemCards[0].label}
              </p>
            </div>
            {/* Takecare App */}
            <div className="relative flex items-end justify-center self-stretch overflow-hidden" style={{ borderRadius: 32, paddingTop: 16, paddingBottom: 16 }}>
              <img src={images['figma-hero-eco-card-app']} alt="" className="absolute inset-0 size-full max-w-none object-cover" />
              <p className={ECO_CARD_LABEL_CLASS} style={ECO_CARD_LABEL_STYLE}>
                {ecosystemCards[1].label}
              </p>
            </div>
            {/* CureBay Services */}
            <div className="relative flex items-end justify-center self-stretch overflow-hidden" style={{ borderRadius: 32, paddingTop: 16, paddingBottom: 16 }}>
              <img src={images['figma-hero-eco-card-curebay']} alt="" className="absolute inset-0 size-full max-w-none object-cover" />
              <p className={ECO_CARD_LABEL_CLASS} style={ECO_CARD_LABEL_STYLE}>
                {ecosystemCards[2].label}
              </p>
            </div>
            {/* 24×7 Command Centre */}
            <div className="relative flex items-end justify-center self-stretch overflow-hidden" style={{ borderRadius: 32, paddingTop: 16, paddingBottom: 16 }}>
              <img src={images['figma-hero-eco-card-command']} alt="" className="absolute inset-0 size-full max-w-none object-cover" />
              <p className={ECO_CARD_LABEL_CLASS} style={ECO_CARD_LABEL_STYLE}>
                {ecosystemCards[3].label}
              </p>
            </div>
          </div>

          <p
            className="w-full whitespace-pre-wrap text-center font-inter font-medium not-italic [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
            style={{
              fontSize: '20px',
              lineHeight: '28px',
              letterSpacing: '0.324px',
              color: '#F9F9F9',
              textShadow: '0px 2px 8px rgba(0,65,114,0.08)',
            }}
          >
            {hero.content.ecosystem_footer_caption}
          </p>
        </div>

        {/* ── App-phone block (states 6-7) ───────────────────────────────── */}
        {/*   Column centred at (50%-289px, 50%+8.07px), w 312, gap 35.742.   */}
        <div
          ref={phoneBlockRef}
          className="absolute flex flex-col items-center"
          style={{
            left: 'calc(50% - 289px)',
            top: 'calc(50% + 8.07px)',
            width: '312px',
            gap: '35.742px',
          }}
        >
          <div
            className="relative shrink-0 overflow-hidden"
            style={{ width: '242px', height: '495px' }}
          >
            <img
              src={images['figma-hero-phone-app']}
              alt="TakeCare mobile app"
              className="absolute max-w-none"
              style={{ height: '101.12%', width: '99.75%', left: '0.13%', top: '-0.64%' }}
            />
          </div>
          <p
            className="relative min-w-full shrink-0 whitespace-pre-wrap text-center font-inter font-bold not-italic [text-box-trim:trim-both] [text-box-edge:cap_alphabetic] [word-break:break-word]"
            style={{
              width: 'min-content',
              fontSize: '24px',
              lineHeight: 'normal',
              letterSpacing: '0.3888px',
              color: '#FFFFFF',
              textShadow: '0px 2.979px 8.936px rgba(0,65,114,0.08)',
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
