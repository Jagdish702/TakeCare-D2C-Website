import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useFitScale } from '../../hooks/useFitScale';
import plateMagneticLock from '../../assets/figma-hero/plate-magnetic-lock.png';
import plateBase from '../../assets/figma-hero/plate-base.png';
import plate30DayOverlay from '../../assets/figma-hero/plate-30day-overlay.png';
import plateMedical from '../../assets/figma-hero/plate-medical.png';
import plateMountedLabels from '../../assets/figma-hero/plate-mounted-labels.png';
import plateConnectedCare from '../../assets/figma-hero/plate-connected-care.png';

gsap.registerPlugin(ScrollTrigger);

/**
 * "A connected Ecosystem" — Figma "Hero" component set States 9-10
 * (nodes 13063:5221 / 13063:5514), desktop follow-up to the pinned Hero.
 *
 * 1440×1233 canvas on #F5FAFF (Blue Primary/2): root p-120 flex column
 * (gap 60), header (gap 36), then a 1144px 3-card grid (gap 60) and a
 * centred 2-card row (gap 60, cards 341.333 wide). State 9 shows only the
 * header; scrolling scrubs the five cards rising in (state 10).
 * All values verbatim from get_design_context — do not round.
 */

type Plate = { src: string; className?: string; style?: React.CSSProperties };

const ITEMS: Array<{
  key: string;
  title: string;
  body: string;
  note: string;
  plates: Plate[];
  /** Cards 1 & 3 use justify-between (plate pinned to the card bottom). */
  justifyBetween?: boolean;
}> = [
  {
    key: 'magnetic-lock',
    title: 'Magnetic lock',
    body: "Magnetic lock seals every slot. \nAn IR sensor confirms the dose the slot glows when it's done.",
    note: 'No more pills spilling in your bag.',
    plates: [{ src: plateMagneticLock, className: 'object-cover' }],
    justifyBetween: true,
  },
  {
    key: '30-day-slots',
    title: '30-Day Slots',
    body: 'Drop in a whole sealed strip — 30 days per slot, refilled monthly by CureBay.',
    note: 'No more popping pills \nfrom foil every day.',
    // Figma layers a transparent cut-out photo over a shared base image.
    plates: [
      { src: plateBase, className: 'object-cover' },
      { src: plate30DayOverlay, style: { height: '125.73%', left: '0.07%', top: '-25.95%', width: '100%' } },
    ],
  },
  {
    key: 'medical-grade-build',
    title: 'Medical-Grade Build',
    body: 'Medical-grade ABS, anti-microbial finish. Built to last, easy to wipe clean.',
    note: 'No more cracks on the first drop.',
    plates: [
      { src: plateBase, className: 'object-cover' },
      { src: plateMedical, className: 'object-cover' },
    ],
    justifyBetween: true,
  },
  {
    key: 'mounted-labels',
    title: 'Mounted Labels',
    body: "Numbers Mounted in, never printed. Screen + app always show what's next.",
    note: 'No more faded or mislabeled days.',
    plates: [{ src: plateMountedLabels, className: 'object-bottom' }],
  },
  {
    key: 'connected-care',
    title: 'Connected Care',
    body: 'One missed dose; instant alerts to you, your family & the 24×7 command centre.',
    note: 'No more boxes that just sit there.',
    plates: [{ src: plateConnectedCare, className: 'object-cover' }],
  },
];

// Figma card chrome: 1px #E8F1F8 border, 32px radius, white bg,
// drop 0/2/4 + inset 0/0/2 rgba(0,65,114,0.08).
const CARD_CHROME: React.CSSProperties = {
  borderRadius: 32,
  border: '1px solid #E8F1F8',
  background: '#FFFFFF',
  boxShadow: '0px 2px 4px rgba(0,65,114,0.08), inset 0px 0px 2px rgba(0,65,114,0.08)',
};

function EcoCard({
  item,
  index,
  cardRef,
  fixedWidth,
}: {
  item: (typeof ITEMS)[number];
  index: number;
  cardRef: (el: HTMLDivElement | null) => void;
  fixedWidth?: number;
}) {
  return (
    <div
      ref={cardRef}
      className={`flex flex-col items-start ${item.justifyBetween ? 'justify-between' : ''}`}
      style={{ ...CARD_CHROME, width: fixedWidth }}
    >
      {/* Content */}
      <div className="flex w-full flex-col items-start" style={{ padding: 12, gap: 8 }}>
        {/* Header pill */}
        <div
          className="flex w-full items-center backdrop-blur-[2px]"
          style={{ gap: 16, padding: '8px 16px 8px 8px', borderRadius: 116 }}
        >
          <div className="flex size-6 shrink-0 items-center justify-center bg-black" style={{ borderRadius: 22 }}>
            <p className="font-inter font-bold not-italic text-white" style={{ fontSize: 18, lineHeight: 'normal' }}>
              {index + 1}
            </p>
          </div>
          <p
            className="whitespace-nowrap font-inter font-medium not-italic text-black [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
            style={{ fontSize: 20, lineHeight: '28px', letterSpacing: '0.324px' }}
          >
            {item.title}
          </p>
        </div>

        {/* Body */}
        <div
          className="flex w-full flex-col items-center justify-center font-inter font-medium"
          style={{ padding: 8, gap: 16, fontSize: 16, letterSpacing: '0.5178px', lineHeight: '24px' }}
        >
          <p className="w-full whitespace-pre-wrap not-italic [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]" style={{ color: '#4D4D4D' }}>
            {item.body}
          </p>
          <p className="w-full whitespace-pre-wrap italic [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]" style={{ color: '#808080' }}>
            {item.note}
          </p>
        </div>
      </div>

      {/* Image plate */}
      <div className="relative w-full overflow-hidden" style={{ height: 190, borderRadius: 32 }}>
        {item.plates.map((plate) => (
          <img
            key={plate.src}
            src={plate.src}
            alt=""
            loading="lazy"
            className={`absolute max-w-none ${plate.style ? '' : 'inset-0 size-full'} ${plate.className ?? ''}`}
            style={plate.style}
          />
        ))}
      </div>
    </div>
  );
}

export default function ConnectedEcosystem() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  const fitScale = useFitScale(1440, 1233, 52);

  useLayoutEffect(() => {
    if (!triggerRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          pin: true,
          pinSpacing: true,
          start: 'top top',
          end: '+=1200',
          scrub: 1,
          invalidateOnRefresh: true,
          refreshPriority: 2,
        },
      });

      // State 9 → 10: the five cards rise in, lightly staggered.
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        tl.fromTo(
          el,
          { opacity: 0, y: 120 },
          { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
          i * 0.12,
        );
      });
    }, triggerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={triggerRef} className="relative w-full">
      <div
        className="relative h-screen w-full overflow-hidden bg-[#F5FAFF]"
        style={{ minHeight: '480px' }}
      >
        {/* Contain-fit 1440×1233 canvas below the 52px sticky header */}
        <div
          className="absolute left-1/2"
          style={{ top: '52px', height: 'calc(100% - 52px)' }}
        >
          <div
            className="absolute flex flex-col items-center"
            style={{
              left: 0,
              top: '50%',
              width: 1440,
              height: 1233,
              padding: 120,
              gap: 60,
              transform: `translate(-50%, -50%) scale(${fitScale})`,
              transformOrigin: 'center center',
            }}
          >
            {/* Header */}
            <div className="flex w-full flex-col items-center" style={{ gap: 36 }}>
              <h2
                className="whitespace-nowrap text-center font-inter font-bold not-italic text-black [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
                style={{ fontSize: 88, lineHeight: 'normal' }}
              >
                A connected Ecosystem
              </h2>
              <p
                className="whitespace-nowrap text-center font-inter font-medium not-italic [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
                style={{
                  fontSize: 24,
                  lineHeight: 'normal',
                  letterSpacing: '0.3888px',
                  color: '#808080',
                  textShadow: '0px 2px 20px rgba(0,65,114,0.08)',
                }}
              >
                Every pill dispenser fails. Take Care isn&apos;t one.
              </p>
            </div>

            {/* Row 1 — three cards */}
            <div
              className="grid shrink-0 grid-cols-3"
              style={{ width: 1144, height: 390, gap: 60 }}
            >
              {ITEMS.slice(0, 3).map((item, i) => (
                <EcoCard
                  key={item.key}
                  item={item}
                  index={i}
                  cardRef={(el) => (cardRefs.current[i] = el)}
                />
              ))}
            </div>

            {/* Row 2 — two centred cards */}
            <div className="flex shrink-0 items-start" style={{ gap: 60 }}>
              {ITEMS.slice(3).map((item, i) => (
                <EcoCard
                  key={item.key}
                  item={item}
                  index={i + 3}
                  cardRef={(el) => (cardRefs.current[i + 3] = el)}
                  fixedWidth={341.333}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
