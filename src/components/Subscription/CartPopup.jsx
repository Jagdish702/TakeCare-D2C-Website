import { useEffect } from 'react';

export default function CartPopup({ plan, onClose, onViewCart }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 68,
        right: 16,
        zIndex: 1000,
        width: 418,
        height: 156,
        background: '#f9f9f9',
        borderRadius: 20,
        padding: 8,
        display: 'flex',
        gap: 8,
        alignItems: 'flex-start',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* outer drop shadow + inner border shadow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 20,
          boxShadow: '0 2px 4px rgba(0,65,114,0.08), inset 0 0 2px rgba(0,65,114,0.08)',
          pointerEvents: 'none',
        }}
      />

      {/* Product image — self-stretch + aspect 1:1 */}
      <div
        style={{
          aspectRatio: '1200 / 1197',
          alignSelf: 'stretch',
          flexShrink: 0,
          borderRadius: 12,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <img
          src="/assets/subscription/device.png"
          alt="TakeCare device"
          draggable={false}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            maxWidth: 'none',
          }}
        />
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            boxShadow: 'inset 0 0 1.198px rgba(0,65,114,0.24)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Right content column */}
      <div
        style={{
          flex: '1 0 0',
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          alignItems: 'flex-start',
          alignSelf: 'stretch',
        }}
      >
        {/* Text block */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            paddingLeft: 8,
            paddingRight: 8,
          }}
        >
          {/* Label row + close button */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', width: '100%' }}>
            <p
              style={{
                flex: '1 0 0',
                minWidth: 0,
                margin: 0,
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: 12,
                color: '#808080',
                letterSpacing: '0.3883px',
                lineHeight: '20px',
              }}
            >
              Product + Subscription
            </p>
            <button
              onClick={onClose}
              style={{
                flexShrink: 0,
                width: 24,
                height: 24,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/assets/subscription/icon-close.svg"
                alt="Close"
                style={{ width: 14, height: 14 }}
              />
            </button>
          </div>

          {/* Product name */}
          <p
            style={{
              margin: 0,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: 16,
              color: '#000',
              letterSpacing: '0.5184px',
              lineHeight: '28px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            TakeCare tablets dispenser &amp; {plan.title.toLowerCase()}
          </p>

          {/* is added to cart */}
          <p
            style={{
              margin: 0,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: 16,
              color: '#00B82E',
              letterSpacing: '0.5184px',
              lineHeight: '28px',
            }}
          >
            is added to cart
          </p>
        </div>

        {/* View button */}
        <div style={{ position: 'relative', width: '100%', height: 40 }}>
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              background: '#EDF9FF',
              borderRadius: 16,
              pointerEvents: 'none',
            }}
          />
          <button
            onClick={onViewCart}
            style={{
              position: 'relative',
              width: '100%',
              height: 40,
              borderRadius: 16,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: 16,
              color: '#004172',
              letterSpacing: '0.2592px',
            }}
          >
            View
          </button>
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 16,
              boxShadow: '0 2px 2px rgba(0,65,114,0.08), inset 0 0 2px rgba(0,65,114,0.08)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>
    </div>
  );
}
