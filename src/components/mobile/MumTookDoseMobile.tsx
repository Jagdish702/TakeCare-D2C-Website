import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useFitScale } from '../../hooks/useFitScale';
import AppreciationCard from '../MumTookDose/AppreciationCard';
import { useContent } from '../../context/ContentContext';

gsap.registerPlugin(ScrollTrigger);

const CANVAS_W = 402;
const CANVAS_H = 890;
const HEADER_H = 54;

// AppreciationCard is a fixed 400px-wide design; scale it down to fit the
// mobile canvas with the same side margins as the text block above it.
const CARD_NATIVE_W = 400;
const CARD_W = 354;
const CARD_SCALE = CARD_W / CARD_NATIVE_W;

/**
 * Mobile "Mum took her dose" — Figma "Mum_took_dose_section_1_mobile"
 * (node 12442:3881), States 0-3.
 *
 * One GSAP-pinned screen, scroll-scrubbed through 3 beats:
 *   0→1  bg photo fades in
 *   1→2  caption + heading + subtitle rise in
 *   2→3  text exits upward, Appreciate notification card rises in
 *
 * The Appreciate button's hover glow is left to real touch/hover — it's not
 * forced on by scroll, matching desktop's mouse-only hover behavior.
 *
 * Reuses the desktop section's exact background photo and AppreciationCard
 * component so copy/visuals stay in lockstep; only layout and scale differ.
 */
export default function MumTookDoseMobile() {
  const { mumTookDose, images } = useContent();
  const triggerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cardWrapRef = useRef<HTMLDivElement>(null);

  const fitScale = useFitScale(CANVAS_W, CANVAS_H, HEADER_H);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(triggerRef.current, { opacity: 0 });
      gsap.set(bgRef.current, { opacity: 0 });
      gsap.set(textRef.current, { y: 60, opacity: 0 });
      gsap.set(cardWrapRef.current, { y: 60, opacity: 0 });

      // Fade the whole section in as it scrolls into view from below.
      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top bottom',
        onEnter: () => gsap.to(triggerRef.current, { opacity: 1, duration: 0.5, ease: 'power1.out' }),
        onLeaveBack: () => gsap.to(triggerRef.current, { opacity: 0, duration: 0.25 }),
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          start: `top ${HEADER_H}px`,
          end: '+=2100',
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
      });

      // Beat 0→1: bg photo fades in.
      tl.to(bgRef.current, { opacity: 1, duration: 1, ease: 'power1.out' });
      tl.to({}, { duration: 0.3 });

      // Beat 1→2: text rises in.
      tl.to(textRef.current, { y: 0, opacity: 1, duration: 1, ease: 'power2.out' });
      tl.to({}, { duration: 0.5 });

      // Beat 2→3: text exits, card enters.
      tl.to(textRef.current, { y: -60, opacity: 0, duration: 0.6, ease: 'power2.in' });
      tl.to(cardWrapRef.current, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.4');
      tl.to({}, { duration: 0.4 });
    }, triggerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={triggerRef} className="relative w-full md:hidden">
      <div
        className="relative w-full overflow-hidden bg-white"
        style={{ height: `calc(100svh - ${HEADER_H}px)`, minHeight: 480 }}
      >
        {/* Background photo — fades in at beat 0→1 */}
        <div
          ref={bgRef}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0"
          style={{ height: '51.7%' }}
        >
          <img
            src={images['mumdose-bg']}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: 'left center' }}
          />
        </div>

        {/* Foreground — contain-fit 402×890 canvas */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2"
          style={{
            width: CANVAS_W,
            height: CANVAS_H,
            transform: `translate(-50%, -50%) scale(${fitScale})`,
          }}
        >
          {/* Text and card share the same slot, cross-fading */}
          <div className="absolute" style={{ left: 24, top: 140, width: CARD_W }}>
            {/* Text block (beat 1→2 in, 2→3 out) */}
            <div
              ref={textRef}
              className="absolute left-0 top-0 flex w-full flex-col items-start"
              style={{ gap: 24 }}
            >
              <p
                className="font-inter font-medium not-italic [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
                style={{ fontSize: 20, lineHeight: '28px', letterSpacing: '1.62px', color: '#008EB1' }}
              >
                {mumTookDose.content.eyebrow}
              </p>
              <div
                className="font-inter font-bold not-italic text-black [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
                style={{ fontSize: 48, lineHeight: 'normal' }}
              >
                <p>{mumTookDose.content.heading_line1}</p>
                <p>{mumTookDose.content.heading_line2}</p>
              </div>
              <div
                className="font-inter font-light not-italic [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
                style={{ fontSize: 24, lineHeight: '28px', color: '#4D4D4D' }}
              >
                <p>{mumTookDose.content.subheading_line1}</p>
                <p>{mumTookDose.content.subheading_line2}</p>
              </div>
            </div>

            {/* Appreciation card (beat 2→3 in, glow at 3→4) */}
            <div ref={cardWrapRef} className="pointer-events-auto absolute left-0 top-0">
              <div style={{ width: CARD_W, transform: `scale(${CARD_SCALE})`, transformOrigin: 'top left' }}>
                <AppreciationCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
