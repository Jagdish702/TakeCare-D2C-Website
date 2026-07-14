import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useFitScale } from '../../hooks/useFitScale';
import AppreciationCard from './AppreciationCard';
import { useContent } from '../../context/ContentContext';

gsap.registerPlugin(ScrollTrigger);

export default function MumTookDose() {
  const { mumTookDose, images } = useContent();
  const triggerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cardWrapRef = useRef<HTMLDivElement>(null);

  // Contain-fit to the viewport (width AND height) so the content is never
  // clipped on narrow or short screens. Full-size until ~760px tall.
  const fitScale = useFitScale(1440, 760);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Start invisible — fades in the moment it enters the viewport from below
      gsap.set(triggerRef.current, { opacity: 0 });

      // Frame 0 initial states
      gsap.set(textRef.current, { y: 80, opacity: 0 });
      gsap.set(cardWrapRef.current, { y: 60, opacity: 0 });

      // Fade in as soon as the section's top enters the bottom of the viewport
      // (fires ~200px after Hero's pin ends — nearly seamless transition)
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
          start: 'top top',
          end: '+=3000',
          scrub: 1.5,
          invalidateOnRefresh: true,
          // Recalculates after Hero (3) but before SectionTwo (1) so stacked
          // pin spacers above are always settled first → no scroll jump.
          refreshPriority: 2,
        },
      });

      // Frame 0 → 1: text slides in from below
      tl.to(textRef.current, { y: 0, opacity: 1, duration: 1, ease: 'power2.out' });
      tl.to({}, { duration: 0.5 }); // hold on Frame 1

      // Frame 1 → 2: text exits upward, card enters from below
      tl.to(textRef.current, { y: -80, opacity: 0, duration: 0.6, ease: 'power2.in' });
      tl.to(cardWrapRef.current, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.4');
      tl.to({}, { duration: 0.5 }); // hold on Frame 2
    }, triggerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={triggerRef} className="relative h-screen overflow-hidden" style={{ minHeight: '480px' }}>
      {/* Background — man checking the app (2300×1332, white backdrop).
          object-contain + left-bottom keeps the WHOLE photo visible at any
          viewport size, pinned to the bottom-left corner; the white layer
          behind extends its backdrop over the remaining space. */}
      <div className="absolute inset-0 bg-white" />
      <img
        src={images['mum-took-dose-background']}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        style={{ objectPosition: 'left bottom' }}
      />

      {/* Content — scales down to fit displays narrower than 1440 (origin centre) */}
      <div
        className="absolute inset-0 flex flex-col px-[120px] py-[120px]"
        style={{ transform: `scale(${fitScale})`, transformOrigin: 'center center' }}
      >
        {/* 2-column grid — left col is empty (bg photo shows through), right col holds content */}
        <div className="grid grid-cols-2 gap-x-[120px] py-[48px] w-full">
          <div /> {/* Left column: empty */}

          {/* Right column: text & card stack in the same position, GSAP controls visibility */}
          <div className="relative min-h-[500px]">
            {/* Text block — visible in Frame 1, exits in Frame 2 */}
            <div ref={textRef} className="absolute top-0 left-0 w-full flex flex-col gap-[48px] items-start">
              {/* Web/H3-M: 24px Medium, lineHeight 100%, tracking 0.3888px */}
              <p className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic] font-inter font-medium text-[24px] leading-none text-[#008eb1] tracking-[0.3888px] whitespace-nowrap">
                {mumTookDose.content.eyebrow}
              </p>
              {/* Web/H0-B: 88px Bold, lineHeight 100% */}
              <div className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic] font-inter font-bold text-[88px] leading-none text-black">
                <p>{mumTookDose.content.heading_line1}</p>
                <p>{mumTookDose.content.heading_line2}</p>
              </div>
              {/* Web/H2-L: 32px Light, lineHeight 100% */}
              <div className="[text-box-trim:trim-both] [text-box-edge:cap_alphabetic] font-inter font-light text-[32px] leading-none text-black">
                <p>{mumTookDose.content.subheading_line1}</p>
                <p>{mumTookDose.content.subheading_line2}</p>
              </div>
            </div>

            {/* Appreciation Card — enters in Frame 2, gradient animates in Frame 3 */}
            <div ref={cardWrapRef} className="absolute top-0 left-0">
              <AppreciationCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
