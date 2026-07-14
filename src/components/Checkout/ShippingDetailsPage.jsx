import { useState, useEffect, useRef } from 'react';
import CheckoutStepper from './CheckoutStepper';
import DisclaimerCard from '../Subscription/DisclaimerCard';
import indiaFlagImg from '../../assets/profile-modal/india-flag.png';

// Demo-only: no real serviceability backend exists, so this one pincode
// (Figma's own shown example) is hardcoded to fail; every other 6-digit
// value succeeds — same "one fixed demo trigger" pattern as DEMO_COUPON /
// DEMO_OTP elsewhere in the checkout flow.
const DEMO_UNSERVICEABLE_PINCODE = '560001';

/*
  "User Details & shipping address" — Figma node 12185:4715 ("Step 4"),
  the second step of checkout, reached from CheckoutPage's "Continue to
  Payment" button. Reuses the exact same "Input Field" component styling
  (44px h, 0.81px #ebebeb border, radius 12) that appears throughout this
  Figma file (e.g. the Cure Coins / coupon inputs in AvailDiscounts.jsx),
  and the same full-screen overlay shell + Continue-button styling as
  CheckoutPage.jsx.
*/

const HEADER_H = 52;
const FONT = 'Inter, sans-serif';

const SAVED_ADDRESSES = [
  { text: '123 Mango Lane, Bangalore, Karnataka, 560001', tag: 'Default' },
  { text: '456 Coconut Avenue, Mumbai, Maharashtra, 400001' },
  { text: '789 Spice Road, Delhi, 110001' },
];

function ChevronDown() {
  return (
    <div style={{ width: 24, height: 24, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', filter: 'drop-shadow(0px 2px 8px rgba(0,65,114,0.08))' }}>
      <svg width="11.8" height="6.8" viewBox="0 0 11.8 6.8" fill="none">
        <path d="M0.9 0.9L5.9 5.9L10.9 0.9" stroke="#999999" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function ChevronUp() {
  return (
    <div style={{ width: 24, height: 24, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', filter: 'drop-shadow(0px 2px 8px rgba(0,65,114,0.08))' }}>
      <svg width="11.8" height="6.8" viewBox="0 0 11.8 6.8" fill="none">
        <path d="M10.9 5.9L5.9 0.9L0.9 5.9" stroke="#999999" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function ChevronRight() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M9 18l6-6-6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Warning triangle shown inside an errored input (Figma "24" / Icon, 24×24 box).
function WarningIcon() {
  return (
    <div style={{ width: 24, height: 24, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', filter: 'drop-shadow(0px 2px 1px rgba(0,65,114,0.08))' }}>
      <svg width="19.7228" height="17.3167" viewBox="0 0 19.7228 17.3167" fill="none">
        <path
          d="M9.86141 6.11836V9.56398M9.86141 13.0096H9.87002M8.3884 1.69072L1.09228 13.871C0.941852 14.1315 0.862256 14.4269 0.861414 14.7277C0.860572 15.0285 0.938512 15.3243 1.08748 15.5857C1.23645 15.847 1.45125 16.0648 1.71052 16.2174C1.96979 16.3699 2.26448 16.4519 2.56529 16.4552H17.1575C17.4583 16.4519 17.753 16.3699 18.0123 16.2174C18.2716 16.0648 18.4864 15.847 18.6353 15.5857C18.7843 15.3243 18.8622 15.0285 18.8614 14.7277C18.8606 14.4269 18.781 14.1315 18.6305 13.871L11.3344 1.69072C11.1809 1.43756 10.9646 1.22825 10.7066 1.08299C10.4486 0.937721 10.1575 0.861407 9.86141 0.861407C9.56531 0.861407 9.27421 0.937721 9.0162 1.08299C8.75818 1.22825 8.54196 1.43756 8.3884 1.69072Z"
          stroke="#D82525"
          strokeWidth="1.72281"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

const labelStyle = { margin: 0, width: '100%', fontFamily: FONT, fontWeight: 500, fontSize: 16, color: '#000', letterSpacing: '0.2592px', lineHeight: 'normal' };
const helperStyle = { margin: 0, width: '100%', fontFamily: FONT, fontWeight: 500, fontSize: 12, color: '#808080', letterSpacing: '0.3883px', lineHeight: '20px' };
const errorTextStyle = { ...helperStyle, color: '#d82525' };
function fieldBoxStyle(error) {
  return {
    display: 'flex', alignItems: 'center', width: '100%', height: 44, padding: '8px 16px', borderRadius: 12,
    border: `0.81px solid ${error ? '#ff9191' : '#ebebeb'}`, background: '#fff', boxSizing: 'border-box',
    boxShadow: error ? '0 2px 1px rgba(0,65,114,0.08), inset 0 0 2px rgba(0,65,114,0.08)' : undefined,
  };
}
const fieldTextStyle = { flex: '1 0 0', minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontFamily: FONT, fontWeight: 500, fontSize: 16, letterSpacing: '0.5184px', color: '#000' };

/* ── Plain text field — label + input, optional chevron + helper text.
     `error`/`errorText` swap in the red border + warning icon + red caption,
     replacing the chevron and any normal helper text (matches Figma: the
     error caption REPLACES the helper text, they never show together). ── */
function TextField({ label, value, onChange, onBlur, placeholder, helper, chevron = true, error, errorText, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', minWidth: 0, ...style }}>
      <p style={labelStyle}>{label}</p>
      <div style={fieldBoxStyle(error)}>
        <input type="text" value={value} onChange={onChange} onBlur={onBlur} placeholder={placeholder} style={fieldTextStyle} />
        {error ? <WarningIcon /> : chevron && <ChevronDown />}
      </div>
      {error ? (errorText && <p style={errorTextStyle}>{errorText}</p>) : helper && <p style={helperStyle}>{helper}</p>}
    </div>
  );
}

/* ── Phone field — India flag + "+91" + separate number segment, matching
     ProfileModal's PhoneField shell (same gradient-free flat-border variant
     as this page's own Figma export). ── */
function PhoneField({ value, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', minWidth: 0 }}>
      <p style={labelStyle}>Phone No*</p>
      <div style={{ display: 'flex', width: '100%', height: 44 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, padding: '8px 16px', border: '0.81px solid #ebebeb', borderRight: 'none', borderRadius: '12px 0 0 12px', background: '#fff', boxSizing: 'border-box' }}>
          <img src={indiaFlagImg} alt="India" style={{ width: 17.778, height: 12, objectFit: 'cover', flexShrink: 0 }} />
          <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 16, letterSpacing: '0.2592px', color: '#ccc', whiteSpace: 'nowrap' }}>+91</span>
          <ChevronDown />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', flex: '1 0 0', minWidth: 0, padding: '8px 16px', border: '0.81px solid #ebebeb', borderRadius: '0 12px 12px 0', background: '#fff', boxSizing: 'border-box' }}>
          <input
            type="tel"
            value={value}
            onChange={onChange}
            placeholder="E.g. 98XXXXXXXX"
            style={{ ...fieldTextStyle, letterSpacing: '0.2592px' }}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Address field — dropdown of saved addresses, first marked "Default" ── */
function AddressField({ value, onChange, onSelect }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  return (
    <div ref={wrapRef} style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', position: 'relative' }}>
      <p style={labelStyle}>Address 1*</p>
      <div style={fieldBoxStyle(false)}>
        <input
          type="text"
          value={value}
          onChange={onChange}
          onFocus={() => setOpen(true)}
          placeholder="E.g. 123 Main Street"
          style={fieldTextStyle}
        />
        <button type="button" onClick={() => setOpen((o) => !o)} style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer' }}>
          {open ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>
      {open && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11, width: '100%', padding: 16, borderRadius: 16, background: '#fff', boxSizing: 'border-box', boxShadow: '0 2px 10px rgba(0,65,114,0.08), inset 0 0 2px rgba(0,65,114,0.12)' }}>
          {SAVED_ADDRESSES.map((addr) => (
            <button
              key={addr.text}
              type="button"
              onClick={() => { onSelect(addr.text); setOpen(false); }}
              style={{ display: 'flex', gap: 4, alignItems: 'flex-start', width: '100%', padding: 8, borderRadius: 12, border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}
            >
              {!addr.tag && (
                <span style={{ width: 20, height: 20, flexShrink: 0, borderRadius: 1, border: '2px solid #b2b2b2', boxSizing: 'border-box', filter: 'drop-shadow(0px 2px 1px rgba(0,65,114,0.08))' }} />
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: '1 0 0', minWidth: 0, padding: addr.tag ? '2px 0 2px 8px' : '2px 0 2px 8px' }}>
                <p style={{ margin: 0, width: '100%', fontFamily: FONT, fontWeight: 500, fontSize: 16, color: '#4d4d4d', letterSpacing: '0.5184px', lineHeight: '28px' }}>{addr.text}</p>
                {addr.tag && <p style={{ margin: 0, width: '100%', fontFamily: FONT, fontWeight: 500, fontSize: 12, color: '#808080', letterSpacing: '0.3883px', lineHeight: '20px' }}>{addr.tag}</p>}
              </div>
            </button>
          ))}
        </div>
      )}
      <p style={helperStyle}>Address cannot be changed after dispatch</p>
    </div>
  );
}

export default function ShippingDetailsPage({ isOpen, onContinue }) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address1: '', deliveryInstructions: '',
    country: '', state: '', city: '', pincode: '',
  });
  const [pincodeError, setPincodeError] = useState(false);

  if (!isOpen) return null;

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const handlePincodeChange = (e) => {
    setPincodeError(false);
    setForm((f) => ({ ...f, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) }));
  };
  const handlePincodeBlur = () => {
    setPincodeError(form.pincode === DEMO_UNSERVICEABLE_PINCODE);
  };

  return (
    <div style={{ position: 'fixed', top: HEADER_H, left: 0, right: 0, bottom: 0, background: '#f9f9f9', zIndex: 1200, overflowY: 'auto' }}>
      <div style={{ width: '100%', maxWidth: 1800, margin: '0 auto', padding: 'clamp(24px, 6vw, 120px)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 60, alignItems: 'flex-start' }}>
        <CheckoutStepper currentStep={1} />

        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <div style={{ width: 1000, maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 36 }}>
            {/* Already have an account? */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <p style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 16, color: '#4d4d4d', letterSpacing: '0.5184px', lineHeight: '28px', whiteSpace: 'nowrap' }}>
                Already have an account?
              </p>
              <button type="button" style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', boxShadow: '0 2px 2px rgba(0,65,114,0.08)', fontFamily: FONT, fontWeight: 500, fontSize: 16, color: '#004172', letterSpacing: '0.2592px', whiteSpace: 'nowrap' }}>
                Log in / Sign up
              </button>
            </div>

            {/* Form card */}
            <div style={{ width: '100%', background: '#fff', borderRadius: 16, padding: 32, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'flex', gap: 24, width: '100%' }}>
                <TextField label="First Name*" value={form.firstName} onChange={set('firstName')} placeholder="E.g. Emily" style={{ flex: 1 }} />
                <TextField label="Last Name*" value={form.lastName} onChange={set('lastName')} placeholder="E.g. Smith" style={{ flex: 1 }} />
              </div>

              <div style={{ display: 'flex', gap: 24, width: '100%', alignItems: 'flex-start' }}>
                <TextField
                  label="Email*"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="E.g. abc@gmail.com"
                  helper="Subscription will be activated on this email"
                  style={{ flex: 1 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}><PhoneField value={form.phone} onChange={set('phone')} /></div>
              </div>

              <AddressField
                value={form.address1}
                onChange={set('address1')}
                onSelect={(text) => setForm((f) => ({ ...f, address1: text }))}
              />

              <TextField
                label="Delivery Instructions (Optional)"
                value={form.deliveryInstructions}
                onChange={set('deliveryInstructions')}
                placeholder="E.g. Leave at door, call before delivery"
                chevron={false}
              />

              <div style={{ display: 'flex', gap: 24, width: '100%' }}>
                <TextField label="Country/Region*" value={form.country} onChange={set('country')} placeholder="India" style={{ flex: 1 }} />
                <TextField label="State*" value={form.state} onChange={set('state')} placeholder="E.g. Maharashtra" style={{ flex: 1 }} />
                <TextField label="City*" value={form.city} onChange={set('city')} placeholder="E.g. Mumbai" style={{ flex: 1 }} />
                <TextField
                  label="Pin code*"
                  value={form.pincode}
                  onChange={handlePincodeChange}
                  onBlur={handlePincodeBlur}
                  placeholder="Eg. 450001"
                  chevron={false}
                  error={pincodeError}
                  style={{ flex: 1 }}
                />
              </div>

              <div style={{ display: 'flex', width: '100%', gap: 24 }}>
                <div style={{ flex: 1 }} />
                <button
                  onClick={() => onContinue?.(form)}
                  style={{
                    flex: 1, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '12px clamp(16px, 4vw, 60px)', borderRadius: 12, border: 'none', background: '#004172', cursor: 'pointer',
                    boxShadow: '0 2px 2px rgba(0,65,114,0.08), inset 0 0 2px rgba(0,65,114,0.08)',
                    fontFamily: FONT, fontWeight: 500, fontSize: 16, color: '#fff', letterSpacing: '0.2592px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Continue
                  <ChevronRight />
                </button>
              </div>
            </div>
          </div>
        </div>

        {pincodeError && (
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <DisclaimerCard tone="error" style={{ width: 562, maxWidth: '100%' }}>
              <p style={{ margin: 0, width: '100%', fontFamily: FONT, fontWeight: 500, fontSize: 12, color: '#d82525', lineHeight: '20px' }}>
                Pincode not serviceable
              </p>
              <p style={{ margin: 0, width: '100%', fontFamily: FONT, fontWeight: 500, fontSize: 12, color: '#808080', lineHeight: '20px' }}>
                Choose a different delivery address or check coverage at{' '}
                <a href="https://curebay.com/#partners" target="_blank" rel="noreferrer" style={{ color: '#808080', textDecoration: 'underline' }}>
                  curebay.com/serviceable
                </a>
              </p>
            </DisclaimerCard>
          </div>
        )}
      </div>
    </div>
  );
}
