/* Shared DisclaimerCard — Figma's "Disclaimer Card" component (node
   12257:10344 / 12185:4829 / 12185:4973). Same shell (icon + text, border,
   radius, padding) is reused for the subscription auto-renew disclaimer
   (default icon/text, driven by `plan`), the checkout page's Delivery info
   box (custom `icon` + `children`), AND the shipping page's "Pincode not
   serviceable" error banner (`tone="error"` + `iconNode`) — Figma names all
   of these instances "Disclaimer Card", so this is one component. */

// Figma's "Alert triangle" icon (16×16 box), used by the error tone.
function AlertTriangleIcon() {
  return (
    <svg width="15.264" height="13.4019" viewBox="0 0 15.264 13.4019" fill="none">
      <path
        d="M7.63201 4.73516V7.40183M7.63201 10.0685H7.63868M6.49201 1.3085L0.845346 10.7352C0.728925 10.9368 0.667324 11.1654 0.666672 11.3982C0.66602 11.631 0.72634 11.8599 0.84163 12.0622C0.956921 12.2644 1.12316 12.433 1.32382 12.5511C1.52447 12.6691 1.75255 12.7326 1.98535 12.7352H13.2787C13.5115 12.7326 13.7396 12.6691 13.9402 12.5511C14.1409 12.433 14.3071 12.2644 14.4224 12.0622C14.5377 11.8599 14.598 11.631 14.5974 11.3982C14.5967 11.1654 14.5351 10.9368 14.4187 10.7352L8.77201 1.3085C8.65317 1.11257 8.48583 0.950576 8.28614 0.838152C8.08646 0.725728 7.86117 0.666667 7.63201 0.666667C7.40286 0.666667 7.17757 0.725728 6.97788 0.838152C6.7782 0.950576 6.61086 1.11257 6.49201 1.3085Z"
        stroke="#D82525"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function DisclaimerCard({ plan, icon, iconNode, tone = 'default', children, style }) {
  const isQuarterly = plan?.key === 'quarterly';
  const defaultText = plan
    ? (isQuarterly
        ? 'Auto-renews quarterly at ₹297 after trial. Cancel anytime from app settings at least 24hrs before renewal. No refund for current billing period after cancellation (T&C §2.1)'
        : 'Auto-renews yearly at ₹999 after trial. Cancel anytime from app settings at least 24hrs before renewal. No refund for current billing period after cancellation (T&C §2.1)')
    : null;

  const isError = tone === 'error';

  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        padding: 12,
        border: `1px solid ${isError ? '#d82525' : '#e5e5e5'}`,
        borderRadius: 12,
        background: isError ? '#ffdbdb' : '#fff',
        alignItems: 'flex-start',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {iconNode || (isError ? <AlertTriangleIcon /> : (
        <img
          src={icon || '/assets/subscription/icon-refresh.svg'}
          alt=""
          draggable={false}
          style={{
            width: 16,
            height: 16,
            flexShrink: 0,
            marginTop: 2,
            filter: 'drop-shadow(0 1.333px 5.333px rgba(0,65,114,0.08))',
          }}
        />
      ))}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          justifyContent: 'center',
          flex: '1 0 0',
          minWidth: 0,
        }}
      >
        {children || (
          <p
            style={{
              margin: 0,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: 12,
              color: isError ? '#d82525' : '#999',
              letterSpacing: '0.3883px',
              lineHeight: '20px',
            }}
          >
            {defaultText}
          </p>
        )}
      </div>
    </div>
  );
}
