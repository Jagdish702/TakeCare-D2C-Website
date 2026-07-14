/**
 * Shopping cart icon (Figma node 12169:4300 / "25").
 * 24×24 box with white background; path box 18 × 17.182 centred (offset +0.34px Y),
 * stroke overflow expansion inset -5.24% / -5% (→ render box 19.8 × 18.9818).
 */
export default function CartIcon() {
  return (
    <div className="relative size-6 shrink-0 overflow-clip bg-white" data-name="25">
      <div className="absolute left-1/2 top-[calc(50%+0.34px)] h-[17.182px] w-[18px] -translate-x-1/2 -translate-y-1/2">
        <div className="absolute inset-[-5.24%_-5%]">
          <svg
            className="block size-full"
            viewBox="0 0 19.8 18.9818"
            fill="none"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M0.9 0.9H4.17273L6.36545 11.8555C6.44027 12.2321 6.6452 12.5705 6.94436 12.8113C7.24351 13.0522 7.61784 13.1801 8.00182 13.1727H15.9545C16.3385 13.1801 16.7129 13.0522 17.012 12.8113C17.3112 12.5705 17.5161 12.2321 17.5909 11.8555L18.9 4.99091H4.99091M8.26364 17.2636C8.26364 17.7155 7.89732 18.0818 7.44545 18.0818C6.99359 18.0818 6.62727 17.7155 6.62727 17.2636C6.62727 16.8118 6.99359 16.4455 7.44545 16.4455C7.89732 16.4455 8.26364 16.8118 8.26364 17.2636ZM17.2636 17.2636C17.2636 17.7155 16.8973 18.0818 16.4455 18.0818C15.9936 18.0818 15.6273 17.7155 15.6273 17.2636C15.6273 16.8118 15.9936 16.4455 16.4455 16.4455C16.8973 16.4455 17.2636 16.8118 17.2636 17.2636Z"
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
