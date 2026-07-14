import { forwardRef } from 'react';

// ─── Exact Figma SVG icons (Figma node 12137-2065) ───────────────────────────
// Each icon is stroked/filled with its card's brand colour, passed in via `color`.

function BellIcon({ color }: { color: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="52" viewBox="0 0 50 52" fill="none">
      <g filter="url(#bell-shadow)">
        <path
          d="M26.4382 31.7893C26.2819 32.0587 26.0576 32.2823 25.7877 32.4378C25.5178 32.5932 25.2118 32.675 24.9004 32.675C24.5889 32.675 24.283 32.5932 24.0131 32.4378C23.7432 32.2823 23.5189 32.0587 23.3626 31.7893M30.2337 20.2337C30.2337 18.8192 29.6718 17.4627 28.6716 16.4625C27.6714 15.4623 26.3149 14.9004 24.9004 14.9004C23.4859 14.9004 22.1293 15.4623 21.1292 16.4625C20.129 17.4627 19.5671 18.8192 19.5671 20.2337C19.5671 26.4559 16.9004 28.2337 16.9004 28.2337H32.9004C32.9004 28.2337 30.2337 26.4559 30.2337 20.2337Z"
          stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        />
      </g>
      <defs>
        <filter id="bell-shadow" x="-3.09961" y="-2.21094" width="56" height="56" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="2"/>
          <feGaussianBlur stdDeviation="8"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.254902 0 0 0 0 0.447059 0 0 0 0.08 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_bell"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_bell" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset/>
          <feGaussianBlur stdDeviation="1"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.254902 0 0 0 0 0.447059 0 0 0 0.16 0"/>
          <feBlend mode="normal" in2="shape" result="effect2_innerShadow_bell"/>
        </filter>
      </defs>
    </svg>
  );
}

function MedicineIcon({ color }: { color: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M18.5426 7.86848C18.6069 7.88417 18.6737 7.88692 18.7391 7.87657C18.8045 7.86623 18.8672 7.84299 18.9236 7.80822C18.9799 7.77345 19.0288 7.72783 19.0674 7.67401C19.106 7.6202 19.1335 7.55925 19.1483 7.49472C19.1631 7.43019 19.165 7.36335 19.1538 7.29809C19.1426 7.23283 19.1185 7.17045 19.083 7.11456C19.0475 7.05867 19.0013 7.01039 18.9469 6.97253C18.8926 6.93466 18.8313 6.90797 18.7666 6.89398L15.4586 6.13398C15.3938 6.11674 15.3261 6.11272 15.2597 6.12217C15.1933 6.13161 15.1294 6.15432 15.072 6.18895C15.0145 6.22358 14.9646 6.26942 14.9252 6.32374C14.8859 6.37806 14.8578 6.43974 14.8428 6.50512C14.8278 6.5705 14.826 6.63824 14.8377 6.7043C14.8494 6.77036 14.8743 6.8334 14.9108 6.88965C14.9474 6.9459 14.9949 6.99422 15.0505 7.03173C15.1061 7.06924 15.1687 7.09517 15.2346 7.10798L18.5426 7.86848Z"
        fill={color} stroke={color} strokeWidth="0.4"
      />
      <path
        fillRule="evenodd" clipRule="evenodd"
        d="M17.0005 11C18.0614 11 19.0788 10.5786 19.8289 9.82843C20.5791 9.07828 21.0005 8.06087 21.0005 7C21.0005 5.93913 20.5791 4.92172 19.8289 4.17157C19.0788 3.42143 18.0614 3 17.0005 3C15.9396 3 14.9222 3.42143 14.1721 4.17157C13.4219 4.92172 13.0005 5.93913 13.0005 7C13.0005 8.06087 13.4219 9.07828 14.1721 9.82843C14.9222 10.5786 15.9396 11 17.0005 11ZM17.0005 10C17.3945 10 17.7846 9.9224 18.1486 9.77164C18.5125 9.62087 18.8433 9.3999 19.1218 9.12132C19.4004 8.84274 19.6214 8.51203 19.7722 8.14805C19.9229 7.78407 20.0005 7.39397 20.0005 7C20.0005 6.60603 19.9229 6.21593 19.7722 5.85195C19.6214 5.48797 19.4004 5.15726 19.1218 4.87868C18.8433 4.6001 18.5125 4.37913 18.1486 4.22836C17.7846 4.0776 17.3945 4 17.0005 4C16.2049 4 15.4418 4.31607 14.8792 4.87868C14.3166 5.44129 14.0005 6.20435 14.0005 7C14.0005 7.79565 14.3166 8.55871 14.8792 9.12132C15.4418 9.68393 16.2049 10 17.0005 10ZM8.38951 4.6225C8.06601 3.8565 6.98301 3.7795 6.54851 4.491L3.14651 10.0575C2.75401 10.6995 3.19251 11.5195 3.95801 11.574L9.89101 11.997C10.656 12.052 11.213 11.303 10.921 10.612L8.38951 4.6225ZM7.40601 5.0065L7.40151 5.0125L4.00551 10.57L4.00651 10.571L4.01151 10.573C4.01725 10.5753 4.02335 10.5765 4.02951 10.5765L9.96301 10.9995H9.98201C9.98723 10.9978 9.99213 10.9953 9.99651 10.992L7.46851 5.012L7.46651 5.007C7.45836 5.00215 7.449 4.99972 7.43951 5C7.42897 4.99895 7.41833 5.0005 7.40851 5.0045L7.40701 5.005L7.40601 5.0065ZM17.693 18.18C18.4141 17.8438 18.9722 17.2348 19.2443 16.4872C19.5165 15.7395 19.4805 14.9144 19.1443 14.1932C18.808 13.4721 18.1991 12.9141 17.4515 12.6419C16.7038 12.3698 15.8786 12.4058 15.1575 12.742L9.71951 15.277C8.99832 15.6132 8.44024 16.2222 8.16803 16.9699C7.89582 17.7176 7.93179 18.5428 8.26801 19.264C8.60424 19.9852 9.21319 20.5433 9.9609 20.8155C10.7086 21.0877 11.5338 21.0517 12.255 20.7155L17.693 18.18ZM10.142 16.184C9.90136 16.2933 9.68477 16.4493 9.50476 16.6428C9.32474 16.8364 9.18488 17.0637 9.09325 17.3116C9.00162 17.5595 8.96004 17.8231 8.97092 18.0872C8.9818 18.3513 9.04492 18.6107 9.15664 18.8502C9.26835 19.0898 9.42644 19.3048 9.62176 19.4829C9.81709 19.6609 10.0458 19.7985 10.2946 19.8877C10.5434 19.9769 10.8075 20.0158 11.0714 20.0023C11.3354 19.9888 11.5941 19.9231 11.8325 19.809L14.0655 18.7675L12.3755 15.1425L10.142 16.184ZM14.972 18.345L13.2815 14.72L15.58 13.648C15.8186 13.5326 16.0778 13.4657 16.3424 13.4514C16.6071 13.437 16.872 13.4753 17.1217 13.5642C17.3714 13.6531 17.6009 13.7908 17.797 13.9691C17.993 14.1475 18.1516 14.3631 18.2636 14.6033C18.3756 14.8436 18.4388 15.1036 18.4494 15.3685C18.4599 15.6333 18.4178 15.8976 18.3253 16.146C18.2329 16.3944 18.092 16.622 17.9108 16.8155C17.7296 17.0089 17.5118 17.1645 17.27 17.273L14.972 18.345Z"
        fill={color} stroke={color} strokeWidth="0.4"
      />
    </svg>
  );
}

function CalendarIcon({ color }: { color: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="52" viewBox="0 0 50 52" fill="none">
      <g filter="url(#calendar-shadow)">
        <path
          d="M28.4559 14.9004V18.4559M21.3448 14.9004V18.4559M16.9004 22.0115H32.9004M18.6782 16.6782H31.1226C32.1045 16.6782 32.9004 17.4741 32.9004 18.4559V30.9004C32.9004 31.8822 32.1045 32.6782 31.1226 32.6782H18.6782C17.6963 32.6782 16.9004 31.8822 16.9004 30.9004V18.4559C16.9004 17.4741 17.6963 16.6782 18.6782 16.6782Z"
          stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        />
      </g>
      <defs>
        <filter id="calendar-shadow" x="-3.09961" y="-2.21094" width="56" height="56" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="2"/>
          <feGaussianBlur stdDeviation="8"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.254902 0 0 0 0 0.447059 0 0 0 0.08 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_cal"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_cal" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset/>
          <feGaussianBlur stdDeviation="1"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.254902 0 0 0 0 0.447059 0 0 0 0.16 0"/>
          <feBlend mode="normal" in2="shape" result="effect2_innerShadow_cal"/>
        </filter>
      </defs>
    </svg>
  );
}

// 'people' key kept so MumTookDoseSectionTwo.tsx needs no changes
const ICON_MAP = { bell: BellIcon, people: MedicineIcon, calendar: CalendarIcon } as const;

// Per-card brand colour — applied to both the icon stroke and the title.
// (Blue Tertiary / Warning Dark / Green Secondary — Figma node 12137-2065.)
const ICON_COLOR: Record<keyof typeof ICON_MAP, string> = {
  bell:     '#00B2DD',
  people:   '#D29300',
  calendar: '#3CBA84',
};

// ─── FeatureCard ──────────────────────────────────────────────────────────────

export interface FeatureCardProps {
  icon: keyof typeof ICON_MAP;
  title: string;
  body: string;
}

const FeatureCard = forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ icon, title, body }, ref) => {
    const Icon = ICON_MAP[icon];
    const color = ICON_COLOR[icon];
    return (
      <div ref={ref} className="flex flex-col">
        {/* Icon — 40×40 glass chip (Glass/chip + Outer/5 tokens) */}
        <div
          className="flex shrink-0 items-center justify-center overflow-hidden rounded-full"
          style={{
            width: '40px',
            height: '40px',
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 2px 16px rgba(0,65,114,0.08), inset 0 0 2px rgba(0,65,114,0.16)',
          }}
        >
          <Icon color={color} />
        </div>

        {/* Title — Web/Body-M: Inter Medium 16 / lh 28 / tracking 0.518px */}
        <p
          className="font-inter font-medium"
          style={{
            marginTop: '16px',
            fontSize: '16px',
            lineHeight: '28px',
            letterSpacing: '0.518px',
            color,
          }}
        >
          {title}
        </p>

        {/* Body — Web/Body-L: Inter Light 16 / lh 28 / tracking 0.518px / #F9F9F9 */}
        <p
          className="font-inter font-light"
          style={{
            fontSize: '16px',
            lineHeight: '28px',
            letterSpacing: '0.518px',
            color: '#F9F9F9',
          }}
        >
          {body}
        </p>
      </div>
    );
  }
);

FeatureCard.displayName = 'FeatureCard';
export default FeatureCard;
