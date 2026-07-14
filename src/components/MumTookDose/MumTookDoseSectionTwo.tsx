/**
 * MumTookDoseSectionTwo
 *
 * Scroll-pinned storytelling section (Figma node 12137-1871 "Mum_took_dose_section_2").
 * Placed immediately after MumTookDoseSection. Uses the same mumdose-bg.png so the
 * background environment reads as continuous.
 *
 * 6-frame animation spec:
 *   Frame 1            – bg photo, no text, no cards                  (initial)
 *   Frame 1 → 2        – bg blurs in (filter:blur 0 → 10px, scale 1 → 1.08)
 *   Frame 2 → 3        – paragraph rises from below (y:80→0, opacity:0→1)
 *   Frame 3 hold
 *   Frame 3 → 4        – paragraph exits upward (y:0→−90, opacity:1→0)
 *   Frame 4 → 5        – dark gradient fades in; 3 cards stagger up from below
 *   Frame 5 hold
 *   Frame 5 → 6        – paragraph re-enters from above (fromTo y:−60→0)
 *   Frame 6 hold       – final: paragraph + 3 cards
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useFitScale } from '../../hooks/useFitScale';
import mumdoseBg from '../../assets/Background mumtookdosetwo.png';
import FeatureCard from './FeatureCard';

gsap.registerPlugin(ScrollTrigger);

// ─── Copy (verified from Figma screenshots) ───────────────────────────────────

const PARA =
  "Over 55% of elderly patients managing chronic conditions miss doses regularly — most without their family's knowledge. Medication non-adherence causes more than 1,25,000 preventable hospitalisations in India each year. Take Care gives you real-time visibility without requiring you to be there.";

const CARDS = [
  {
    icon: 'bell' as const,
    title: 'Dose confirmed. Instantly.',
    body: 'To eliminate follow-up calls, Take Care notifies you the moment a dose is taken or missed — medicine name, slot number, timestamp. The device syncs to the TakeCare app in under 30 seconds over Wi-Fi.',
  },
  {
    icon: 'people' as const,
    title: 'Handles up to 8 medicines at once.',
    body: 'To manage complex multi-drug regimens, each numbered compartment maps to one medicine and one time slot. The dispenser opens only the right drawer at the right time. No mix-ups. No double doses.',
  },
  {
    icon: 'calendar' as const,
    title: 'Configure full schedule from your phone.',
    body: "Upload the prescription to set up care without a visit. CureBay verifies it, schedules, and delivers medicines to your parent's door. You manage timings, refill alerts, and caregiver access. Your parent presses TAKEN, and you see it instantly.",
  },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function MumTookDoseSectionTwo() {
  // Outer: ScrollTrigger pins this; also receives the viewport-entry fade
  const triggerRef  = useRef<HTMLDivElement>(null);

  // Background image wrapper — extends −60 px past edges so blur never clips
  const bgWrapRef   = useRef<HTMLDivElement>(null);

  // Dark gradient overlay (card readability, enters at Frame 4→5)
  const gradientRef = useRef<HTMLDivElement>(null);

  // Paragraph text (enters Frame 3, exits Frame 4, re-enters Frame 6)
  const paraRef     = useRef<HTMLParagraphElement>(null);

  // Individual card refs (staggered entrance, Frame 4→5)
  const card1Ref    = useRef<HTMLDivElement>(null);
  const card2Ref    = useRef<HTMLDivElement>(null);
  const card3Ref    = useRef<HTMLDivElement>(null);

  // Contain-fit the fixed 1320px card grid to the viewport (width AND height).
  // Fixed columns keep text wrapping/heights constant (no overlap); the height
  // term shrinks the block on short screens so it never collides with the
  // paragraph or runs off the bottom. Full-size until ~820px tall.
  const fitScale = useFitScale(1440, 820);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Pre-set: all animated elements in their Frame-1 initial state ───────
      gsap.set(bgWrapRef.current,   { filter: 'blur(0px)', scale: 1 });
      gsap.set(gradientRef.current, { opacity: 0 });
      gsap.set(paraRef.current,     { y: 80, opacity: 0 });
      gsap.set(card1Ref.current,    { y: 80, opacity: 0 });
      gsap.set(card2Ref.current,    { y: 80, opacity: 0 });
      gsap.set(card3Ref.current,    { y: 80, opacity: 0 });

      // Fade the entire section in as it enters the viewport from below, matching
      // the approach used in MumTookDoseSection for a consistent entry feel.
      gsap.set(triggerRef.current, { opacity: 0 });
      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top 95%',         // triggers just before the section top hits the fold
        onEnter:     () => gsap.to(triggerRef.current, { opacity: 1, duration: 0.6, ease: 'power1.out' }),
        onLeaveBack: () => gsap.to(triggerRef.current, { opacity: 0, duration: 0.3 }),
      });

      // ── Master pin + scrub timeline ─────────────────────────────────────────
      // Total duration: ~6.05 "units". end: +=5000 → ~827 px per unit.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger:           triggerRef.current,
          pin:               true,
          pinSpacing:        true,
          start:             'top top',
          end:               '+=5000',
          scrub:             1.5,
          invalidateOnRefresh: true,
          // Lowest of the three pins → recalculates last, after Hero (3) and
          // MumTookDose (2) spacers above it are already settled.
          refreshPriority:   1,
        },
      });

      // ── Frame 1 → 2: background blurs in (≈ 1 unit) ─────────────────────────
      // The bg wrapper is inset −60 px on all sides; scale(1.08) ensures
      // the softened blur edges remain outside the visible viewport crop.
      tl.to(bgWrapRef.current, {
        filter:   'blur(10px)',
        scale:    1.08,
        duration: 1,
        ease:     'power2.inOut',
      });
      tl.to({}, { duration: 0.25 }); // small hold before text enters

      // ── Frame 2 → 3: paragraph rises from below (≈ 1 unit) ──────────────────
      tl.to(paraRef.current, {
        y:        0,
        opacity:  1,
        duration: 1,
        ease:     'power2.out',
      });
      tl.to({}, { duration: 0.4 }); // hold at Frame 3

      // ── Frame 3 → 4: paragraph exits upward (≈ 0.8 unit) ───────────────────
      tl.to(paraRef.current, {
        y:        -90,
        opacity:  0,
        duration: 0.8,
        ease:     'power2.in',
      });

      // ── Frame 4 → 5: gradient + all 3 cards rise simultaneously ────────────
      tl.to(gradientRef.current, { opacity: 1, duration: 0.35, ease: 'power1.in' });
      tl.to(
        [card1Ref.current, card2Ref.current, card3Ref.current],
        { y: 0, opacity: 1, duration: 1, ease: 'power2.out' },
        '<0.05',
      );
      tl.to({}, { duration: 0.4 }); // hold at final state

    }, triggerRef);

    return () => ctx.revert();
  }, []);

  return (
    // Outer trigger wrapper — GSAP ScrollTrigger pins this element
    <div ref={triggerRef} className="relative w-full">

      {/*
        Visible section viewport.
        100svh keeps it flush with the viewport on all modern browsers;
        minHeight:1200px matches the Figma canvas height (1440 × 1200).
        overflow:hidden clips the −60px bg wrapper.
      */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: '100svh', minHeight: '480px' }}
      >

        {/* ── Background image ───────────────────────────────────────────────── */}
        {/*
          The wrapper extends 60 px past every section edge via negative inset.
          This creates a "bleed" so that when GSAP applies filter:blur(10px)
          the Gaussian softening never reaches the visible crop boundary.
          GSAP animates filter + scale on the wrapper; the <img> is unchanged.
        */}
        <div
          ref={bgWrapRef}
          className="pointer-events-none absolute"
          style={{ inset: '-60px', transformOrigin: 'center center' }}
          aria-hidden="true"
        >
          <img
            src={mumdoseBg}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        </div>

        {/* ── Dark gradient — card readability (Frame 4 → 5) ────────────────── */}
        {/*
          Gradient ramp:
            0 %  → rgba(0,0,0,0.93)   solid near-black at section bottom
           45 %  → rgba(0,0,0,0.72)   mid ramp
          100 %  → transparent         photo shows through in upper half
          Height: 60% of section (≈ 720 px on 1200 px canvas).
          Measured from Figma State=2: cards occupy lower ~35% with a wide
          gradient feather zone above them.
        */}
        <div
          ref={gradientRef}
          className="pointer-events-none absolute inset-x-0 bottom-0"
          style={{
            height: '60%',
            background:
              'linear-gradient(to top, rgba(0,0,0,0.93) 0%, rgba(0,0,0,0.72) 45%, rgba(0,0,0,0) 100%)',
          }}
          aria-hidden="true"
        />

        {/* ── Paragraph text ────────────────────────────────────────────────── */}
        {/*
          Resting position extracted from Figma State=1:
            left  ≈ 835 px on 1440 px canvas → 58.0 %
            top   ≈ 183 px on 1200 px canvas → 15.3 %
            width ≈ 385 px → max-width 390 px
          Typography: Inter Light 18 px / lh 1.70 / white
          GSAP sequence:
            Frame 3 entry  — y: 80 → 0  opacity: 0 → 1
            Frame 4 exit   — y:  0 → −90 opacity: 1 → 0
            Frame 6 return — y: −60 → 0 opacity: 0 → 1
        */}
        <p
          ref={paraRef}
          className="pointer-events-none absolute font-inter font-light text-white
                     max-lg:left-1/2 max-lg:!top-[10%] max-lg:max-w-[88%] max-lg:-translate-x-1/2
                     max-sm:text-[16px]"
          style={{
            left:        '58%',
            top:         '15.3%',
            width:       '389px',
            fontSize:    '24px',
            lineHeight:  'normal',
            letterSpacing: '0.389px',
          }}
        >
          {PARA}
        </p>

        {/* ── Three feature cards ───────────────────────────────────────────── */}
        {/*
          Figma grid (node 12137-2065): a fixed 1320px block centred at the
          section bottom — 60px padding, 48px column-gap, 10px row-gap, three
          equal minmax(0,1fr) columns (368px each). Fixed width means the
          columns never compress, so the body text wraps identically at every
          screen size and the cards keep a constant height (no overlap).
          fitScale shrinks the whole block (origin bottom-centre) on displays
          narrower than 1440 so the 1320px grid never overflows horizontally.
          Refs on each card (not the grid wrapper) so GSAP can stagger them.
        */}
        <div
          className="absolute inset-x-0 bottom-0 flex justify-center"
          style={{ transform: `scale(${fitScale})`, transformOrigin: 'bottom center' }}
        >
          <div
            style={{
              display:             'grid',
              width:               '1320px',
              padding:             '60px',
              rowGap:              '10px',
              columnGap:           '48px',
              gridTemplateRows:    'repeat(1, fit-content(100%))',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            }}
          >
            <FeatureCard ref={card1Ref} {...CARDS[0]} />
            <FeatureCard ref={card2Ref} {...CARDS[1]} />
            <FeatureCard ref={card3Ref} {...CARDS[2]} />
          </div>
        </div>

      </div>
    </div>
  );
}
