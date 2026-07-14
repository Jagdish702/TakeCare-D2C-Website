/**
 * User / profile icon (Figma node 12169:4301 / "26").
 * 24×24 box with `drop-shadow`; path box inset 17.19% / 20.83%,
 * stroke overflow expansion inset -5.71% / -6.43% (→ render box 15.8 × 17.55).
 */
export default function ProfileIcon() {
  return (
    <div className="relative size-6 shrink-0 overflow-clip drop-shadow-icon" data-name="26">
      <div className="absolute inset-[17.19%_20.83%]">
        <div className="absolute inset-[-5.71%_-6.43%]">
          <svg
            className="block size-full"
            viewBox="0 0 15.8 17.55"
            fill="none"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M14.9 16.65V14.9C14.9 13.9717 14.5312 13.0815 13.8749 12.4251C13.2185 11.7688 12.3283 11.4 11.4 11.4H4.4C3.47174 11.4 2.5815 11.7688 1.92513 12.4251C1.26875 13.0815 0.9 13.9717 0.9 14.9V16.65M11.4 4.4C11.4 6.333 9.833 7.9 7.9 7.9C5.967 7.9 4.4 6.333 4.4 4.4C4.4 2.467 5.967 0.9 7.9 0.9C9.833 0.9 11.4 2.467 11.4 4.4Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
