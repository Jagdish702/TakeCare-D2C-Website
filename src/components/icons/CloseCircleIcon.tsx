/**
 * Close (X in circle) icon (Figma node 13001:14622 "Icon_only_Regular_button" — brand blue).
 * 24×24, matches the other header icon strokes (1.8px, round caps).
 */
export default function CloseCircleIcon() {
  return (
    <svg
      className="block size-6"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9.5 9.5L14.5 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M14.5 9.5L9.5 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
