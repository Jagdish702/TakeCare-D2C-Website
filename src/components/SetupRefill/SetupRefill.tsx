import { useContent } from '../../context/ContentContext';

export default function SetupRefill() {
  const { setupRefillJourney } = useContent();
  const { intro } = setupRefillJourney;

  return (
    <div className="bg-white w-full px-[120px] pt-[120px] pb-0 max-lg:px-[40px] max-sm:px-6 max-sm:pt-[80px]">
      <div className="flex flex-col gap-[48px] max-sm:gap-[24px] items-center text-center w-full">

        {/* Web/H4-M: Inter Medium 18px / lh 28px / tracking 0.5825px / #008EB1 */}
        {/* Mobile/H4-M: Inter Medium 16px / lh 24px / tracking 0.5178px / #008EB1 */}
        <p
          className="font-inter font-medium w-full text-[#008eb1] text-[18px] leading-[28px] tracking-[0.5825px] max-sm:text-[16px] max-sm:leading-[24px] max-sm:tracking-[0.5178px]"
        >
          {intro.eyebrow}
        </p>

        {/* Web/H0-B: Inter Bold 88px / lh normal / black */}
        {/* Mobile/H0-B: Inter Bold 48px / lh normal / black */}
        <div
          className="font-inter font-bold text-black text-center w-full leading-[normal] text-[88px] max-lg:text-[64px] max-sm:text-[48px]"
        >
          <p>{intro.heading_line1}</p>
          <p>{intro.heading_line2}</p>
        </div>

      </div>
    </div>
  );
}
