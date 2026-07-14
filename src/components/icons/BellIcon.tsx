/**
 * Notification bell icon (Figma node 12169:4299 / "24_icon").
 * 24×24 box with `drop-shadow`; path box inset 12.96% / 16.67%,
 * stroke overflow expansion inset -5.06% / -5.63% (→ render box 17.8 × 19.5746).
 */
export default function BellIcon() {
  return (
    <div className="relative size-6 shrink-0 overflow-clip drop-shadow-icon" data-name="24_icon">
      <div className="absolute inset-[12.96%_16.67%_12.98%_16.67%]">
        <div className="absolute inset-[-5.06%_-5.63%]">
          <svg
            className="block size-full"
            viewBox="0 0 17.8001 19.5746"
            fill="none"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M10.4378 17.7889C10.2816 18.0583 10.0573 18.2819 9.78738 18.4374C9.5175 18.5928 9.21152 18.6746 8.90007 18.6746C8.58862 18.6746 8.28264 18.5928 8.01276 18.4374C7.74288 18.2819 7.51857 18.0583 7.36229 17.7889M14.2334 6.23333C14.2334 4.81885 13.6715 3.46229 12.6713 2.4621C11.6711 1.4619 10.3146 0.9 8.90007 0.9C7.48558 0.9 6.12903 1.4619 5.12883 2.4621C4.12864 3.46229 3.56674 4.81885 3.56674 6.23333C3.56674 12.4556 0.90007 14.2333 0.90007 14.2333H16.9001C16.9001 14.2333 14.2334 12.4556 14.2334 6.23333Z"
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
