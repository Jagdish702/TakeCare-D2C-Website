import { useRef, useState } from 'react';
import RadioIcon from './RadioIcon';

/*
  "Avail Discounts" — Figma node 1914:11620 (file "Total-Care--D2C"), 14
  states covering 3 mutually-exclusive discount methods:

    Coupon:            empty -> filled -> Apply -> invalid | applied
    Corporate Discount: empty email -> Send OTP -> empty OTP -> filled OTP
                         -> Verify -> wrong OTP | applied
    Cure Coins:        empty -> filled -> Apply -> invalid | applied

  No real backend exists, so validation is a fixed demo rule (mirrors the
  exact examples shown in Figma's own mockup states):
    - Coupon code "FLAT100" (case-insensitive) succeeds; anything else fails.
    - Corporate OTP "1234" succeeds; anything else fails.
    - Cure Coins: any amount <= the remaining balance succeeds (balance
      starts at 1000 CC, matching Figma); anything over (or non-numeric)
      fails — Figma's own invalid example is 1200 against a 1000 balance.

  "Remove" (on an applied discount) clears that method back to its empty
  input state rather than deselecting the radio — lets the user retry with
  a different code without re-selecting the option.
*/

const DEMO_COUPON = 'FLAT100';
const DEMO_OTP = '1234';
const STARTING_CC_BALANCE = 1000;

const FONT = 'Inter, sans-serif';

function CheckmarkIcon({ color }) {
  return (
    <svg width="16" height="11.625" viewBox="0 0 16 11.625" fill="none">
      <path d="M15 1L5.375 10.625L1 6.25" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg width="19.7228" height="17.3167" viewBox="0 0 19.7228 17.3167" fill="none">
      <path
        d="M9.86141 6.11836V9.56398M9.86141 13.0096H9.87002M8.3884 1.69072L1.09228 13.871C0.941852 14.1315 0.862256 14.4269 0.861414 14.7277C0.860572 15.0285 0.938512 15.3243 1.08748 15.5857C1.23645 15.847 1.45125 16.0648 1.71052 16.2174C1.96979 16.3699 2.26448 16.4519 2.56529 16.4552H17.1575C17.4583 16.4519 17.753 16.3699 18.0123 16.2174C18.2716 16.0648 18.4864 15.847 18.6353 15.5857C18.7843 15.3243 18.8622 15.0285 18.8614 14.7277C18.8606 14.4269 18.781 14.1315 18.6305 13.871L11.3344 1.69072C11.1809 1.43756 10.9646 1.22825 10.7066 1.08299C10.4486 0.937721 10.1575 0.861407 9.86141 0.861407C9.56531 0.861407 9.27421 0.937721 9.0162 1.08299C8.75818 1.22825 8.54196 1.43756 8.3884 1.69072Z"
        stroke="#D82525"
        strokeWidth="1.72281"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Radio row header — icon + label (+ optional right-aligned slot) ── */
function RadioRow({ checked, label, labelBold, right, onClick }) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', width: right ? '100%' : undefined, justifyContent: right ? 'space-between' : undefined }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <button
          type="button"
          onClick={onClick}
          style={{ display: 'block', cursor: 'pointer', flexShrink: 0, width: 24, height: 24, border: 'none', background: 'transparent', padding: 0 }}
          aria-label={label}
        >
          <RadioIcon checked={checked} size={24} />
        </button>
        <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 16, color: '#000', letterSpacing: '0.5184px', lineHeight: '28px', whiteSpace: 'nowrap' }}>
          {label}
        </span>
      </div>
      {right && (
        <span style={{ fontFamily: FONT, fontWeight: labelBold ? 700 : 500, fontSize: 16, color: '#d29300', letterSpacing: '0.5184px', lineHeight: '28px', whiteSpace: 'nowrap' }}>
          {right}
        </span>
      )}
    </div>
  );
}

/* ── "Apply" / "Send OTP" pill — blue when actionable, grey when the
     field is in an error state ── */
function ActionButton({ children, disabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        height: 40, padding: '8px 16px', borderRadius: 12, border: 'none',
        cursor: disabled ? 'default' : 'pointer', flexShrink: 0,
        background: disabled ? '#f9f9f9' : '#edf9ff',
        color: disabled ? '#ccc' : '#004172',
        boxShadow: `0 2px 2px rgba(0,65,114,0.08), inset 0 0 2px rgba(0,65,114,${disabled ? 0.16 : 0.08})`,
        fontFamily: FONT, fontWeight: 500, fontSize: 16, letterSpacing: '0.2592px', whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  );
}

/* ── Text input shell — matches Figma's "Input Field / primary" ── */
function DiscountInput({ value, onChange, placeholder, error, icon, onKeyDown }) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', width: '100%', boxSizing: 'border-box',
        height: error ? 44 : undefined, padding: 16, borderRadius: 12, background: '#fff',
        border: `0.81px solid ${error ? '#ff9191' : '#ebebeb'}`,
        boxShadow: '0 2px 1px rgba(0,65,114,0.08), inset 0 0 2px rgba(0,65,114,0.08)',
      }}
    >
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        style={{
          flex: '1 0 0', minWidth: 0, border: 'none', outline: 'none', background: 'transparent',
          fontFamily: FONT, fontWeight: 500, fontSize: 16, letterSpacing: '0.2592px',
          color: value ? '#000' : '#999',
        }}
      />
      {icon && <WarningIcon />}
    </div>
  );
}

function HelperText({ error, children }) {
  return (
    <p style={{ margin: 0, width: '100%', fontFamily: FONT, fontWeight: 300, fontSize: 16, lineHeight: 1.2, letterSpacing: '0.2592px', color: error ? '#d82525' : '#808080' }}>
      {children}
    </p>
  );
}

/* ── Success row — gradient-green message + "Remove" link ── */
function AppliedRow({ message, onRemove }) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', width: '100%' }}>
      <div style={{ flex: '1 0 0', minWidth: 0, height: 41, display: 'flex', alignItems: 'center', padding: 12, borderRadius: 12 }}>
        <p
          style={{
            margin: 0, flex: '1 0 0', minWidth: 0, fontFamily: FONT, fontWeight: 500, fontSize: 16, letterSpacing: '0.5184px',
            background: 'linear-gradient(180deg, #10b981 0%, #00664c 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}
        >
          {message}
        </p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', height: 40, padding: '8px 16px',
          borderRadius: 12, border: 'none', background: 'transparent', cursor: 'pointer', flexShrink: 0,
          boxShadow: '0 2px 2px rgba(0,65,114,0.08)',
          fontFamily: FONT, fontWeight: 500, fontSize: 16, color: '#004172', letterSpacing: '0.2592px', whiteSpace: 'nowrap',
        }}
      >
        Remove
      </button>
    </div>
  );
}

/* ── Coupon flow ── */
function CouponFlow({ state, setState }) {
  const { code, applied, error } = state;

  if (applied) {
    return <AppliedRow message={`'${applied}' applied!`} onRemove={() => setState({ code: '', applied: null, error: false })} />;
  }

  const handleApply = () => {
    if (!code.trim()) return;
    if (code.trim().toUpperCase() === DEMO_COUPON) {
      setState({ code, applied: code.trim().toUpperCase(), error: false });
    } else {
      setState({ ...state, error: true });
    }
  };

  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', width: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: '1 0 0', minWidth: 0 }}>
        <DiscountInput
          value={code}
          onChange={(e) => setState({ ...state, code: e.target.value, error: false })}
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          placeholder="Enter coupon code here"
          error={error}
          icon={error}
        />
        {error && <HelperText error>Invalid Code</HelperText>}
      </div>
      <ActionButton disabled={error} onClick={handleApply}>Apply</ActionButton>
    </div>
  );
}

/* ── Corporate Discount flow (email -> OTP -> verify) ── */
function CorporateFlow({ state, setState }) {
  const { email, otpSent, otp, applied, wrong } = state;
  const otpRefs = useRef([]);

  if (applied) {
    return <AppliedRow message="Discount Successfully applied!" onRemove={() => setState({ email: '', otpSent: false, otp: ['', '', '', ''], applied: false, wrong: false })} />;
  }

  if (!otpSent) {
    const handleSendOtp = () => {
      if (!email.trim()) return;
      setState({ ...state, otpSent: true });
      setTimeout(() => otpRefs.current[0]?.focus(), 0);
    };
    return (
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: '1 0 0', minWidth: 0 }}>
          <DiscountInput
            value={email}
            onChange={(e) => setState({ ...state, email: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
            placeholder="Enter Corporate email id"
          />
          <HelperText>For Verification</HelperText>
        </div>
        <ActionButton onClick={handleSendOtp}>Send OTP</ActionButton>
      </div>
    );
  }

  const setDigit = (i, digit) => {
    const next = [...otp];
    next[i] = digit;
    setState({ ...state, otp: next, wrong: false });
  };

  const handleOtpChange = (i, e) => {
    const digit = e.target.value.replace(/\D/g, '').slice(-1);
    setDigit(i, digit);
    if (digit && i < 3) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      otpRefs.current[i - 1]?.focus();
    }
  };

  const filled = otp.every((d) => d !== '');
  const handleVerify = () => {
    if (!filled) return;
    if (otp.join('') === DEMO_OTP) {
      setState({ ...state, applied: true, wrong: false });
    } else {
      setState({ ...state, wrong: true });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
      <p style={{ margin: 0, width: '100%', fontFamily: FONT, fontWeight: 300, fontSize: 16, lineHeight: 1.2, letterSpacing: '0.2592px', color: '#000' }}>
        Enter the OTP sent to {email}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (otpRefs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(i, e)}
              onKeyDown={(e) => handleOtpKeyDown(i, e)}
              aria-label={`OTP digit ${i + 1}`}
              style={{
                width: 40, height: 40, borderRadius: 12, textAlign: 'center', outline: 'none',
                border: `${digit ? 1.62 : 0.81}px solid ${wrong ? '#ff9191' : '#ebebeb'}`,
                background: '#fff', boxShadow: digit ? 'inset 0 0 2px rgba(0,65,114,0.08)' : 'none',
                fontFamily: FONT, fontWeight: 500, fontSize: 14, letterSpacing: '-0.14px', color: '#000',
              }}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={handleVerify}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            height: 40, padding: '8px 16px', borderRadius: 12, border: 'none', flexShrink: 0,
            cursor: filled ? 'pointer' : 'default',
            background: filled ? '#edf9ff' : '#f9f9f9',
            boxShadow: `0 2px 8px rgba(0,65,114,0.08), inset 0 0 2px rgba(0,65,114,${filled ? 0.08 : 0.16})`,
            fontFamily: FONT, fontWeight: 500, fontSize: 16, letterSpacing: '0.2592px', color: filled ? '#004172' : '#ccc',
          }}
        >
          <CheckmarkIcon color={filled ? '#004172' : '#ccc'} />
          Verify
        </button>
      </div>
      {wrong && <HelperText error>Wrong OTP, Re-Enter</HelperText>}
    </div>
  );
}

/* ── Cure Coins flow ── */
function CureCoinsFlow({ state, setState, balance, onApplied, onRemoved }) {
  const { amount, applied, error } = state;

  if (applied) {
    return (
      <AppliedRow
        message={`${applied} Cure Coins applied Successfully!`}
        onRemove={() => {
          onRemoved(applied);
          setState({ amount: '', applied: null, error: false });
        }}
      />
    );
  }

  const handleApply = () => {
    const value = parseInt(amount, 10);
    if (!amount.trim()) return;
    if (!Number.isInteger(value) || value <= 0 || value > balance) {
      setState({ ...state, error: true });
      return;
    }
    setState({ amount, applied: value, error: false });
    onApplied(value);
  };

  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', width: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: '1 0 0', minWidth: 0 }}>
        <DiscountInput
          value={amount}
          onChange={(e) => setState({ ...state, amount: e.target.value.replace(/\D/g, ''), error: false })}
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          placeholder="Enter number of Curecoin to use"
          error={error}
          icon={error}
        />
        {error ? <HelperText error>Invalid digits</HelperText> : <HelperText>(1 Cure Coin = ₹1 discount)</HelperText>}
      </div>
      <ActionButton disabled={error} onClick={handleApply}>Apply</ActionButton>
    </div>
  );
}

export default function AvailDiscounts() {
  const [active, setActive] = useState(null); // 'coupon' | 'corporate' | 'curecoins' | null
  const [coupon, setCoupon] = useState({ code: '', applied: null, error: false });
  const [corporate, setCorporate] = useState({ email: '', otpSent: false, otp: ['', '', '', ''], applied: false, wrong: false });
  const [cureCoins, setCureCoins] = useState({ amount: '', applied: null, error: false });
  const [ccBalance, setCcBalance] = useState(STARTING_CC_BALANCE);

  const select = (key) => setActive((prev) => (prev === key ? prev : key));

  const isCureCoinsActive = active === 'curecoins';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
      <p style={{ margin: 0, fontFamily: FONT, fontWeight: 700, fontSize: 18, color: '#000', letterSpacing: '0.5825px', lineHeight: '28px' }}>
        Avail Discounts
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
        {/* Coupon */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start', width: '100%' }}>
          <RadioRow checked={active === 'coupon'} label="Coupon" onClick={() => select('coupon')} />
          {active === 'coupon' && <CouponFlow state={coupon} setState={setCoupon} />}
        </div>

        {/* Corporate Discount */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start', width: '100%' }}>
          <RadioRow checked={active === 'corporate'} label="Corporate Discount" onClick={() => select('corporate')} />
          {active === 'corporate' && <CorporateFlow state={corporate} setState={setCorporate} />}
        </div>

        {/* Cure Coins */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start', width: '100%' }}>
          <RadioRow
            checked={isCureCoinsActive}
            label="Cure Coins"
            labelBold={isCureCoinsActive}
            right={`${ccBalance.toLocaleString('en-IN')} CC left`}
            onClick={() => select('curecoins')}
          />
          {isCureCoinsActive && (
            <CureCoinsFlow
              state={cureCoins}
              setState={setCureCoins}
              balance={ccBalance}
              onApplied={(value) => setCcBalance((b) => b - value)}
              onRemoved={(value) => setCcBalance((b) => b + value)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
