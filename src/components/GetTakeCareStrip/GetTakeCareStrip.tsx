import { useFitScale } from '../../hooks/useFitScale';
import productImg from '../../assets/hero-product.png';
import mobileImg from '../../assets/hero-mobile.png';
import { useContent } from '../../context/ContentContext';

/*
  "Get_TakeCare_bottom_Strip" — Figma node 12323:7048.
  Sticky pill anchored to the bottom of the viewport; the button jumps
  straight to the 2-card subscription plans (#subscription-plans).
*/
export default function GetTakeCareStrip() {
  const { header } = useContent();
  const { promoStrip } = header;

  // Card is a fixed 727px-wide design; shrink it (from the bottom edge) on
  // narrower viewports instead of letting it overflow off-screen.
  const scale = useFitScale(727 + 32);

  const scrollToPlans = () => {
    document.getElementById(promoStrip.scroll_target_id)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      className="fixed left-1/2 flex items-center"
      style={{
        bottom: '24px',
        zIndex: 40,
        gap: '120px',
        transform: `translateX(-50%) scale(${scale})`,
        transformOrigin: 'bottom center',
        width: '727.372px',
        height: '60px',
        padding: '0 16px',
        borderRadius: '24px',
        background: 'rgba(255,255,255,0.8)',
      }}
    >
      {/* ── Left group: device + subscription line items ─────────────── */}
      <div className="flex shrink-0 items-center px-2" style={{ gap: '8px' }}>
        <div className="relative shrink-0" style={{ width: '32.93px', height: '48px' }}>
          <img
            src={productImg}
            alt=""
            className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
          />
        </div>
        <div
          className="shrink-0 whitespace-nowrap font-inter font-medium not-italic [text-box-trim:trim-both] [text-box-edge:cap_alphabetic] [word-break:break-word]"
          style={{ fontSize: '14px', color: '#808080', letterSpacing: '0.4536px' }}
        >
          <p className="mb-0 whitespace-pre" style={{ lineHeight: '24px' }}>{promoStrip.device_label_line1}</p>
          <p className="whitespace-pre" style={{ lineHeight: '24px' }}>{promoStrip.device_label_line2}</p>
        </div>
        <p
          className="shrink-0 whitespace-nowrap font-inter font-medium not-italic [text-box-trim:trim-both] [text-box-edge:cap_alphabetic] [word-break:break-word]"
          style={{ fontSize: '12px', color: '#4D4D4D', letterSpacing: '0.3883px', lineHeight: '1.5' }}
        >
          {promoStrip.separator_symbol_1}
        </p>
        <div className="relative shrink-0 overflow-hidden" style={{ width: '23.442px', height: '48.367px' }}>
          <img
            src={mobileImg}
            alt=""
            className="pointer-events-none absolute max-w-none"
            style={{ left: '-0.26%', top: '-0.61%', width: '101.79%', height: '100.61%' }}
          />
        </div>
        <div
          className="shrink-0 whitespace-nowrap font-inter font-medium not-italic [text-box-trim:trim-both] [text-box-edge:cap_alphabetic] [word-break:break-word]"
          style={{ fontSize: '14px', color: '#808080', letterSpacing: '0.4536px' }}
        >
          <p className="mb-0 whitespace-pre" style={{ lineHeight: '24px' }}>{promoStrip.subscription_label_line1}</p>
          <p className="whitespace-pre" style={{ lineHeight: '24px' }}>{promoStrip.subscription_label_line2}</p>
        </div>
      </div>

      {/* ── Right group: price + CTA ──────────────────────────────────── */}
      <div className="flex shrink-0 items-center" style={{ gap: '24px' }}>
        <p
          className="shrink-0 whitespace-nowrap text-center font-inter font-medium not-italic [text-box-trim:trim-both] [text-box-edge:cap_alphabetic] [word-break:break-word]"
          style={{ fontSize: '24px', color: '#000000', letterSpacing: '0.3888px', lineHeight: 'normal' }}
        >
          {promoStrip.price}
        </p>
        <button
          type="button"
          onClick={scrollToPlans}
          className="relative flex shrink-0 items-center justify-center whitespace-nowrap"
          style={{
            gap: '8px',
            height: '48px',
            padding: '12px 16px',
            borderRadius: '12px',
            background: '#004172',
            filter: 'drop-shadow(0px 2px 2px rgba(0,65,114,0.08))',
            boxShadow: 'inset 0px 0px 2px rgba(0,65,114,0.08)',
          }}
        >
          <span
            className="font-inter font-medium not-italic text-white [text-box-trim:trim-both] [text-box-edge:cap_alphabetic] [word-break:break-word]"
            style={{ fontSize: '16px', letterSpacing: '0.2592px', lineHeight: 'normal' }}
          >
            {promoStrip.cta_label}
          </span>
        </button>
      </div>
    </div>
  );
}
