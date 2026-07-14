import productImg from '../../assets/hero-product.png';
import mobileImg from '../../assets/hero-mobile.png';

/**
 * Compact "Get Take Care" price/CTA bar — Figma node 12506:11047
 * ("Get_TakeCare_bottom_Strip", Type=Mobile, 408×54). Swapped in for the
 * mobile header's normal content once the user scrolls down (see
 * `useHeaderScrollSwap`); reuses the same device/phone icons as the
 * desktop `GetTakeCareStrip` bottom pill (Figma "Type=Web" sibling).
 */
export default function GetTakeCareBarMobile() {
  const scrollToPlans = () => {
    document.getElementById('subscription-plans')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex shrink-0 items-center" style={{ gap: '8px' }}>
        <div className="relative shrink-0" style={{ width: '21.787px', height: '31.757px' }}>
          <img src={productImg} alt="" className="pointer-events-none absolute inset-0 size-full max-w-none object-cover" />
        </div>
        <p
          className="shrink-0 whitespace-nowrap font-inter font-medium not-italic [text-box-trim:trim-both] [text-box-edge:cap_alphabetic] [word-break:break-word]"
          style={{ fontSize: '12px', color: '#4D4D4D', letterSpacing: '0.3883px', lineHeight: '1.5' }}
        >
          +
        </p>
        <div className="relative shrink-0 overflow-hidden" style={{ width: '15.509px', height: '32px' }}>
          <img
            src={mobileImg}
            alt=""
            className="pointer-events-none absolute max-w-none"
            style={{ left: '-0.26%', top: '-0.61%', width: '101.79%', height: '100.61%' }}
          />
        </div>
        <p
          className="shrink-0 whitespace-nowrap font-inter font-medium not-italic [text-box-trim:trim-both] [text-box-edge:cap_alphabetic] [word-break:break-word]"
          style={{ fontSize: '12px', color: '#4D4D4D', letterSpacing: '0.3883px', lineHeight: '1.5' }}
        >
          =
        </p>
        <p
          className="shrink-0 whitespace-nowrap text-center font-inter font-medium not-italic [text-box-trim:trim-both] [text-box-edge:cap_alphabetic] [word-break:break-word]"
          style={{ fontSize: '20px', color: '#000000', letterSpacing: '0.324px', lineHeight: '28px' }}
        >
          ₹1,698
        </p>
      </div>

      <button
        type="button"
        onClick={scrollToPlans}
        className="relative flex shrink-0 items-center justify-center whitespace-nowrap"
        style={{
          gap: '8px',
          height: '32px',
          padding: '8px 16px',
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
          Get Take Care
        </span>
      </button>
    </div>
  );
}
