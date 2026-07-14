import { useState } from 'react';

import { useContent } from '../../context/ContentContext';

/**
 * "A connected ecosystem" — Figma "Hero_mobile_option_2" States 9-13
 * (nodes 13061:3927 / 13063:4314 / 4368 / 4422 / 4476).
 *
 * Tap-driven accordion below the pinned mobile Hero. Exactly one card is
 * expanded at a time: its badge is a black numbered circle and it reveals the
 * body copy, an italic note and a 190px image plate; every collapsed card
 * shows a green ✓ badge instead. Expansion animates via the
 * grid-template-rows 0fr→1fr trick so no heights are hard-coded.
 */
type Plate = { src: string; className?: string; style?: React.CSSProperties };

type EcoItem = { key: string; title: string; body: string; note: string; plates: Plate[] };

// Image assets per card — not part of the DB content, kept local and matched
// to the DB rows by item_key in buildItems() below.
function getPlatesByKey(images: Record<string, string>): Record<string, Plate[]> {
  return {
    'connected-to-curebay': [{ src: images['mobile-plate-curebay-connected'], className: 'object-cover' }],
    'works-24x7': [{ src: images['mobile-plate-247'], className: 'object-cover' }],
    // Figma layers a transparent cut-out photo over a shared base image.
    '30-day-slots': [
      { src: images['mobile-plate-base'], className: 'object-cover' },
      {
        src: images['mobile-plate-30day-overlay'],
        style: { height: '125.73%', left: '0.07%', top: '-25.95%', width: '100%' },
      },
    ],
    'medical-grade-build': [
      { src: images['mobile-plate-base'], className: 'object-cover' },
      { src: images['mobile-plate-medical-overlay'], className: 'object-cover' },
    ],
    'magnetic-lock': [{ src: images['mobile-plate-magnetic-lock'], className: 'object-cover' }],
  };
}

function buildItems(
  dbItems: Array<{ item_key: string; title: string; body: string; note: string; sort_order: number }>,
  images: Record<string, string>,
): EcoItem[] {
  const platesByKey = getPlatesByKey(images);
  return [...dbItems]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((i) => ({
      key: i.item_key,
      title: i.title,
      body: i.body,
      note: i.note,
      plates: platesByKey[i.item_key],
    }));
}

// Figma Outer/3 (active) and Outer/4 (collapsed) effect styles.
const CARD_SHADOW_ACTIVE =
  '0px 2px 8px rgba(0,65,114,0.08), inset 0px 0px 2px rgba(0,65,114,0.08)';
const CARD_SHADOW_INACTIVE =
  '0px 4px 12px rgba(0,65,114,0.08), inset 0px 0px 2px rgba(0,65,114,0.16)';

export default function EcosystemAccordion() {
  const { hero, images } = useContent();
  const ITEMS = buildItems(hero.ecosystemItems, images);

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative w-full overflow-hidden md:hidden">
      {/* Background photo (mobile-specific tall crop, Figma node 13063:4422 "State=12") +
          top-to-bottom white→#70737C gradient overlay at 32% opacity */}
      <div aria-hidden className="absolute inset-0">
        <img src={images['mobile-eco-section-bg']} alt="" className="absolute size-full max-w-none object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.32) 21.211%, rgba(112,115,124,0.32) 39%)' }}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-[402px] flex-col items-center gap-6 px-[29px] py-12">
        {/* Heading */}
        <div className="flex w-full max-w-[329px] flex-col gap-6">
          <h2
            className="font-inter font-bold not-italic text-black [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
            style={{ fontSize: 48, lineHeight: 'normal' }}
          >
            {hero.ecosystemSection.heading}
          </h2>
          <p
            className="whitespace-pre-line font-inter font-medium not-italic [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
            style={{
              fontSize: 20,
              lineHeight: '28px',
              letterSpacing: '0.324px',
              color: '#808080',
              textShadow: '0px 2px 20px rgba(0,65,114,0.08)',
            }}
          >
            {hero.ecosystemSection.subheading}
          </p>
        </div>

        {/* Cards */}
        {ITEMS.map((item, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={item.key}
              type="button"
              aria-expanded={isActive}
              onClick={() => setActiveIndex(i)}
              className="relative w-full cursor-pointer overflow-hidden rounded-[32px] border border-solid bg-white text-left transition-[border-color,box-shadow] duration-300"
              style={{
                borderColor: isActive ? '#E8F1F8' : '#F5FAFF',
                boxShadow: isActive ? CARD_SHADOW_ACTIVE : CARD_SHADOW_INACTIVE,
              }}
            >
              <div className="flex flex-col p-3">
                {/* Title row */}
                <div className="flex w-full items-center gap-4 rounded-full py-2 pl-2 pr-4 backdrop-blur-[2px]">
                  <div
                    className="flex size-6 shrink-0 items-center justify-center rounded-full transition-colors duration-300"
                    style={{ backgroundColor: isActive ? '#000000' : '#00B82E' }}
                  >
                    <p className="font-inter font-bold not-italic text-white" style={{ fontSize: 18, lineHeight: 'normal' }}>
                      {isActive ? i + 1 : '✓'}
                    </p>
                  </div>
                  <p
                    className="whitespace-nowrap font-inter font-medium not-italic text-black [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
                    style={{ fontSize: 20, lineHeight: '28px', letterSpacing: '0.324px' }}
                  >
                    {item.title}
                  </p>
                </div>

                {/* Body copy — collapses to 0fr when inactive */}
                <div
                  className="grid transition-[grid-template-rows,opacity] duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
                  style={{ gridTemplateRows: isActive ? '1fr' : '0fr', opacity: isActive ? 1 : 0 }}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div
                      className="mt-2 flex flex-col gap-4 p-2 font-inter font-medium"
                      style={{ fontSize: 16, letterSpacing: '0.5178px', lineHeight: '24px' }}
                    >
                      <p className="whitespace-pre-line not-italic [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]" style={{ color: '#4D4D4D' }}>
                        {item.body}
                      </p>
                      <p className="whitespace-pre-line italic [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]" style={{ color: '#D82525' }}>
                        {item.note}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image plate — collapses to 0fr when inactive */}
              <div
                className="grid transition-[grid-template-rows,opacity] duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{ gridTemplateRows: isActive ? '1fr' : '0fr', opacity: isActive ? 1 : 0 }}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="relative h-[190px] w-full overflow-hidden rounded-[32px]">
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
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
