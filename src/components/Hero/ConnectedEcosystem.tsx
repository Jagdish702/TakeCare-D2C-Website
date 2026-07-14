import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useContent } from '../../context/ContentContext';
import { useFitScale } from '../../hooks/useFitScale';
import ecoSectionBg from '../../assets/figma-hero/eco-section-bg.png';
import plateCurebayConnected from '../../assets/figma-hero/plate-curebay-connected.png';
import plate247 from '../../assets/figma-hero/plate-247.png';
import plate30DayDrawers from '../../assets/figma-hero/plate-30day-drawers.png';
import plateMedical from '../../assets/figma-hero/plate-medical.png';
import plateMagneticLock from '../../assets/figma-hero/plate-magnetic-lock.png';

gsap.registerPlugin(ScrollTrigger);

/**
 * "A connected Ecosystem" — Figma "Hero" component set (node 13617:23693),
 * desktop follow-up to the pinned Hero. Updated card set/order/copy —
 * replaces the previous "Mounted Labels" + "Connected Care" cards with
 * "Connected to CureBay" (new) and "Works 24x7" (new title, same body/note
 * as the old "Connected Care" card, new photo).
 *
 * 1440×1233 canvas on a photo background (marble/plant + faint wave/cross
 * pattern) with a top-to-bottom white→#576385 gradient overlay at 32%
 * opacity: root p-120 flex column (gap 60), header (gap 36), then a
 * 1144px 3-card grid (gap 60) and a centred 2-card row (gap 60, cards
 * 341.333 wide). State 9 shows only the header; scrolling scrubs the five
 * cards rising in (state 10). All values verbatim from get_design_context
 * — do not round.
 */

type Plate = { src: string; className?: string; style?: React.CSSProperties };

type EcoItem = { key: string; title: string; body: string; note: string; plates: Plate[] };

// Image assets per card — not part of the DB content, kept local and matched
// to the DB rows by item_key in buildItems() below.
const PLATES_BY_KEY: Record<string, Plate[]> = {
  'connected-to-curebay': [{ src: plateCurebayConnected, className: 'object-cover' }],
  'works-24x7': [{ src: plate247, className: 'object-cover' }],
  '30-day-slots': [{ src: plate30DayDrawers, style: { height: '125.73%', left: '0.07%', top: '-25.95%', width: '100%' } }],
  'medical-grade-build': [{ src: plateMedical, className: 'object-cover' }],
  'magnetic-lock': [{ src: plateMagneticLock, className: 'object-cover' }],
};

function buildItems(dbItems: Array<{ item_key: string; title: string; body: string; note: string; sort_order: number }>): EcoItem[] {
  return [...dbItems]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((i) => ({
      key: i.item_key,
      title: i.title,
      body: i.body,
      note: i.note,
      plates: PLATES_BY_KEY[i.item_key],
    }));
}

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
  fixedHeight,
}: {
  item: EcoItem;
  index: number;
  cardRef: (el: HTMLDivElement | null) => void;
  fixedWidth?: number;
  fixedHeight?: number;
}) {
  return (
    <div
      ref={cardRef}
      className={`flex flex-col items-start ${fixedHeight ? '' : 'h-full'}`}
      style={{ ...CARD_CHROME, width: fixedWidth, height: fixedHeight }}
    >
      {/* Content — flex-1 so it fills the space above the fixed-height image plate below */}
      <div className="flex w-full flex-1 flex-col items-start" style={{ padding: 12, gap: 8 }}>
        {/* Header pill */}
        <div
          className="flex w-full items-center backdrop-blur-[2px]"
          style={{ gap: 16, padding: '8px 16px 8px 8px', borderRadius: 116 }}
        >
          <div className="flex size-6 shrink-0 items-center justify-center bg-[#00b82e]" style={{ borderRadius: 22 }}>
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
          <p className="w-full whitespace-pre-wrap italic [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]" style={{ color: '#D82525' }}>
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
  const { hero } = useContent();
  const ITEMS = buildItems(hero.ecosystemItems);

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
        className="relative h-screen w-full overflow-hidden"
        style={{ minHeight: '480px' }}
      >
        {/* Background photo + top-to-bottom white→#576385 gradient overlay (32% opacity) */}
        <div aria-hidden className="absolute inset-0">
          <img src={ecoSectionBg} alt="" className="absolute size-full max-w-none object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.32) 13.95%, rgba(87,99,133,0.32) 47.142%)' }}
          />
        </div>

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
                {hero.ecosystemSection.heading}
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
                {hero.ecosystemSection.subheading}
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
                  fixedHeight={366}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
