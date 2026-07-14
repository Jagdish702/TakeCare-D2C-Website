import { useEffect, useRef, useState } from 'react';
import { buildTabs } from '../Features/FeaturesSection';
import { useContent } from '../../context/ContentContext';

// Real Figma mobile exports (355×~395, one per tab, same order as TABS) —
// dropped into public/assets/mobile by hand since Figma's Dev Mode MCP asset
// directory wasn't whitelisted for automatic download.
const MOBILE_IMAGES = [
  '/assets/mobile/Features_mobile%20doctor.png',
  '/assets/mobile/Features_mobile%20medicines.png',
  '/assets/mobile/Features_mobile%20lb%20test.png',
  '/assets/mobile/Features_mobile%20sos.png',
  '/assets/mobile/Features_mobile%20dose%20management.png',
];

/**
 * Mobile "CureBay Services" — Figma "Mobile_option_2 / Features" (node
 * 12424:14779, "State=2" of a 5-state tap-driven component), 402px canvas.
 *
 * Reuses the exact same TABS data (icons, accent colors, copy) as the
 * desktop FeaturesSection so content stays in lockstep; only the layout
 * (2-column pill grid instead of a single row), type scale, and device
 * mockup images (MOBILE_IMAGES, portrait crops) differ.
 */
export default function FeaturesSectionMobile() {
  const { features } = useContent();
  const TABS = buildTabs(features.tabs);

  const [activeTab, setActiveTab] = useState(0);
  const [displayTab, setDisplayTab] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'exiting' | 'entering'>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    MOBILE_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (phase === 'exiting') {
      timerRef.current = setTimeout(() => {
        setDisplayTab(activeTab);
        setPhase('entering');
      }, 200);
    } else if (phase === 'entering') {
      timerRef.current = setTimeout(() => setPhase('idle'), 400);
    }
    return () => clearTimeout(timerRef.current);
  }, [phase, activeTab]);

  const switchTab = (i: number) => {
    if (i === activeTab || phase !== 'idle') return;
    setActiveTab(i);
    setPhase('exiting');
  };

  const animClass = phase === 'exiting' ? 'feat-exiting' : phase === 'entering' ? 'feat-entering' : '';
  const tab = TABS[displayTab];

  return (
    <section className="w-full bg-[#F9F9F9] md:hidden">
      <div className="mx-auto flex w-full max-w-[402px] flex-col items-center gap-12 px-6 py-12">
        {/* Header */}
        <div className="flex w-full flex-col items-center gap-6 text-center">
          <p
            className="font-inter font-medium not-italic [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
            style={{ fontSize: 20, lineHeight: '28px', letterSpacing: '1.62px', color: '#008EB1' }}
          >
            {features.content.eyebrow}
          </p>
          <p
            className="w-full font-inter font-bold not-italic text-black [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]"
            style={{ fontSize: 48, lineHeight: 'normal' }}
          >
            {features.content.heading}
          </p>
        </div>

        {/* Device mockup — native asset ratio (355×~395) */}
        <div className={`w-full overflow-hidden rounded-[32px] ${animClass}`} style={{ aspectRatio: '355 / 395' }}>
          <img
            src={MOBILE_IMAGES[displayTab]}
            alt={tab.label}
            draggable={false}
            className="size-full object-cover"
          />
        </div>

        {/* Tab grid — 2 columns; Dose Management spans both */}
        <div className="grid w-full grid-cols-2 gap-3">
          {TABS.map((t: any, i: number) => {
            const isActive = i === activeTab;
            const isWide = t.isWide;
            return (
              <button
                key={t.label}
                type="button"
                onClick={() => switchTab(i)}
                className={`flex items-center justify-between rounded-full bg-white transition-[color,border-color,box-shadow] duration-[240ms] ease-out ${isWide ? 'col-span-2' : ''}`}
                style={{
                  padding: '12px 16px',
                  border: `1px solid ${isActive ? t.accent : '#E5E5E5'}`,
                  color: isActive ? t.accent : '#808080',
                  boxShadow: isActive
                    ? '0px 2px 20px rgba(0,65,114,0.078), inset 0px 0px 2px rgba(0,65,114,0.122)'
                    : 'none',
                }}
              >
                <span
                  className="font-inter font-medium not-italic"
                  style={{ fontSize: 16, lineHeight: '24px', letterSpacing: '0.324px' }}
                >
                  {t.label}
                </span>
                <t.Icon />
              </button>
            );
          })}
        </div>

        {/* Description — bold accent-colored intro + light black body */}
        <p className={`w-full text-center ${animClass}`} style={{ fontSize: 0 }}>
          <span
            className="font-inter font-medium not-italic"
            style={{ fontSize: 16, lineHeight: '24px', letterSpacing: '0.324px', color: tab.accent }}
          >
            {tab.boldText}
          </span>
          <span
            className="font-inter font-light not-italic"
            style={{ fontSize: 16, lineHeight: '24px', letterSpacing: '0.324px', color: '#000000' }}
          >
            {tab.bodyText}
          </span>
        </p>
      </div>
    </section>
  );
}
