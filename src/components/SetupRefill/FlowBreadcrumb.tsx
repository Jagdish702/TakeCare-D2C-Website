/**
 * Breadcrumb strip below the header on the "Set Up, Refill & Specifications"
 * flow page (Figma node 13222:18301, "Frame 77") — distinct from the site
 * Header itself. "TakeCare" is a link back to the homepage; the current
 * page label is plain (non-interactive) text.
 */
function ChevronRightSmall() {
  return (
    <svg width="4.44444" height="7.77778" viewBox="0 0 4.44444 7.77778" fill="none" style={{ filter: 'drop-shadow(0px 1.333px 5.333px rgba(0,65,114,0.08))' }}>
      <path d="M0.555556 7.22222L3.88889 3.88889L0.555556 0.555556" stroke="#808080" strokeWidth="1.11111" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function FlowBreadcrumb({ onHome }: { onHome: () => void }) {
  return (
    <div
      className="px-[120px] max-lg:px-[40px] max-sm:px-6"
      style={{
        display: 'flex',
        gap: 4,
        alignItems: 'center',
        width: '100%',
        boxSizing: 'border-box',
        paddingTop: 16,
        paddingBottom: 16,
        background: '#f9f9f9',
      }}
    >
      <button
        type="button"
        onClick={onHome}
        style={{
          border: 'none',
          background: 'transparent',
          padding: 0,
          cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          fontSize: 12,
          color: '#808080',
          letterSpacing: '0.3883px',
          lineHeight: '20px',
          whiteSpace: 'nowrap',
        }}
      >
        TakeCare
      </button>
      <ChevronRightSmall />
      <p
        style={{
          margin: 0,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          fontSize: 12,
          color: '#000',
          letterSpacing: '0.3883px',
          lineHeight: '20px',
          whiteSpace: 'nowrap',
        }}
      >
        Set Up, Refill &amp; Specifications
      </p>
    </div>
  );
}
