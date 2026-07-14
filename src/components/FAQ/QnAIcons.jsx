import { useId } from 'react';

// Shared "X circle" (open/close) and "Plus circle" (closed/open) toggle
// icons — Figma "Question ? Answers" QA component, same glyphs on web & mobile.
export function XCircleIcon() {
  // useId keeps the filter id unique per rendered instance — up to 20 of
  // these can be open on screen at once, and duplicate SVG filter ids
  // across instances is invalid (even though visually harmless here).
  const filterId = `xCircleFilter-${useId()}`;
  return (
    <svg width="24" height="24" viewBox="13.9 11.9 24 24" fill="none">
      <g filter={`url(#${filterId})`}>
        <path
          d="M28.6004 21.1999L23.2004 26.5999M23.2004 21.1999L28.6004 26.5999M34.9004 23.8999C34.9004 28.8705 30.871 32.8999 25.9004 32.8999C20.9298 32.8999 16.9004 28.8705 16.9004 23.8999C16.9004 18.9293 20.9298 14.8999 25.9004 14.8999C30.871 14.8999 34.9004 18.9293 34.9004 23.8999Z"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <filter id={filterId} x="-2.09961" y="-2.1001" width="56" height="56" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="8" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.254902 0 0 0 0 0.447059 0 0 0 0.08 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset />
          <feGaussianBlur stdDeviation="1" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.254902 0 0 0 0 0.447059 0 0 0 0.16 0" />
          <feBlend mode="normal" in2="shape" result="effect2_innerShadow" />
        </filter>
      </defs>
    </svg>
  );
}

export function PlusCircleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 8V16M8 12H16M12 2.90039C17.0258 2.90039 21.0996 6.97421 21.0996 12C21.0996 17.0258 17.0258 21.0996 12 21.0996C6.97421 21.0996 2.90039 17.0258 2.90039 12C2.90039 6.97421 6.97421 2.90039 12 2.90039Z"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
