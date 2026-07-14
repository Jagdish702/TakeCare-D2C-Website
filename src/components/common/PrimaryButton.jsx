/*
  Reusable primary CTA button — Figma "Regular_button" component.

  Props:
    children   — button label (string or JSX)
    fullWidth  — stretch to 100% of parent (default false)
    onClick    — click handler (optional)
*/

export default function PrimaryButton({ children, fullWidth = false, onClick }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      style={{
        position: 'relative',
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '12px 16px',
        borderRadius: 12,
        cursor: 'pointer',
        width: fullWidth ? '100%' : 'auto',
        boxSizing: 'border-box',
        flexShrink: 0,
        boxShadow: '0 2px 2px rgba(0,65,114,0.08)',
        userSelect: 'none',
      }}
    >
      {/* Background */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: '#004172',
          borderRadius: 12,
          pointerEvents: 'none',
        }}
      />
      {/* Label */}
      <span
        style={{
          position: 'relative',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          fontSize: 16,
          color: '#fff',
          letterSpacing: '0.2592px',
          lineHeight: 'normal',
          whiteSpace: 'nowrap',
        }}
      >
        {children}
      </span>
      {/* Inner shadow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          boxShadow: 'inset 0 0 2px 0 rgba(0,65,114,0.08)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
