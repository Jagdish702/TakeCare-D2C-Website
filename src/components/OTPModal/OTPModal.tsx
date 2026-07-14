import { useEffect, useRef, useState } from 'react';
import { useContent } from '../../context/ContentContext';
import PrimaryButton from '../common/PrimaryButton';
import IconSlot from '../common/IconSlot';
import iconVerifyCheck from '../../assets/profile-modal/icon-verify-check.svg';
import iconSuccessCheck from '../../assets/profile-modal/icon-success-check.svg';
import iconChevronRight from '../../assets/profile-modal/icon-chevron-right.svg';

/**
 * "Enter OTP" card — Figma node 12185:2656 ("Status Card"), part of the
 * Profile Section. 500px-wide panel, p-32/gap-32, rounded-48, Outer/5 shadow
 * (drop 0/2/16 rgba(0,65,114,0.08) + inset 0/0/2 rgba(0,65,114,0.16)) — same
 * shadow token as ProfileModal's panel. No close (X) button in this Figma
 * state; dismiss is via the backdrop, matching the rest of this flow.
 *
 * On a correct code, swaps to the "Registration Successful" card — Figma
 * node 12185:2686, same shell/shadow/width — with an explicit Continue
 * button (Figma has no auto-advance timer here).
 *
 * Reuses PrimaryButton (Figma "Regular_button") for both Verify and
 * Continue, and IconSlot for every glyph, rather than re-implementing them.
 *
 * IMPORTANT: this project has no SMS backend, so no real text message is
 * sent — entering the fixed demo code below (123456) always succeeds.
 */
const DEMO_OTP = '123456';

function maskPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '**********';
  return '*'.repeat(8) + digits.slice(-4);
}

// Figma "Frame 20-25": 48×48, border #ebebeb 1.2px, radius 14.4px, gap 9.6px.
// Digit text: Inter Medium 16.8px, tracking -0.168px.
function otpBoxStyle(status: 'idle' | 'success' | 'error', filled: boolean): React.CSSProperties {
  if (status === 'success') return { borderColor: '#34c759', background: '#e8fff1', color: '#00b82e' };
  if (status === 'error') return { borderColor: '#EF4444', background: '#fef2f2', color: '#EF4444' };
  if (filled) return { borderColor: '#004172', background: '#ffffff', color: '#000000' };
  return { borderColor: '#ebebeb', background: '#ffffff', color: 'rgba(0,0,0,0.5)' };
}

// Figma node 12185:2686 ("Status Card" success state).
function SuccessCard({ onContinue }: { onContinue: () => void }) {
  const { profile } = useContent();
  const otpModal = profile.otpModal;
  return (
    <div className="flex w-full flex-col items-center gap-8">
      <div className="success-badge-in flex shrink-0 items-center justify-center rounded-[30px] bg-[#e8fff1] p-3">
        <IconSlot src={iconSuccessCheck} width={22.167} height={14.4375} />
      </div>
      <p className="w-full font-inter text-[18px] font-bold leading-[28px] tracking-[0.5825px] text-[#00b82e] text-center [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]">
        {otpModal.success_text}
      </p>
      <PrimaryButton fullWidth onClick={onContinue}>
        <span className="flex items-center justify-center gap-2">
          {otpModal.continue_label}
          <IconSlot src={iconChevronRight} width={5} height={10} />
        </span>
      </PrimaryButton>
    </div>
  );
}

export default function OTPModal({
  phoneNumber,
  onClose,
  onSuccess,
}: {
  phoneNumber: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { profile } = useContent();
  const otpModal = profile.otpModal;
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [shaking, setShaking] = useState(false);
  const [countdown, setCountdown] = useState(45);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleInput = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (status === 'success') return;
    const digit = e.target.value.replace(/\D/g, '').slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    setStatus('idle');
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (status === 'success') return;
    if (e.key === 'Backspace') {
      e.preventDefault();
      setStatus('idle');
      setDigits((prev) => {
        const next = [...prev];
        if (prev[index]) {
          next[index] = '';
          return next;
        }
        if (index > 0) {
          next[index - 1] = '';
          inputRefs.current[index - 1]?.focus();
        }
        return next;
      });
    }
    if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (status === 'success') return;
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    setDigits(Array.from({ length: 6 }, (_, i) => pasted[i] || ''));
    setStatus('idle');
    setTimeout(() => inputRefs.current[Math.min(pasted.length, 5)]?.focus(), 0);
  };

  const handleVerify = () => {
    const entered = digits.join('');
    if (entered.length < 6) return;
    if (entered === DEMO_OTP) {
      setStatus('success');
    } else {
      setStatus('error');
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  const handleResend = () => {
    if (countdown > 0) return;
    setDigits(['', '', '', '', '', '']);
    setStatus('idle');
    setCountdown(45);
    setTimeout(() => inputRefs.current[0]?.focus(), 0);
  };

  const allFilled = digits.every((d) => d !== '');

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[1200] flex items-center justify-center overflow-y-auto p-4"
      style={{
        top: '52px',
        background: 'rgba(0,0,0,0.32)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="flex w-[500px] max-w-full flex-col items-center gap-8 rounded-[48px] bg-white p-8"
        style={{ boxShadow: '0px 2px 16px rgba(0,65,114,0.08), inset 0px 0px 2px rgba(0,65,114,0.16)' }}
      >
        {status === 'success' ? (
          <SuccessCard onContinue={onSuccess} />
        ) : (
          <>
            {/* Heading */}
            <div className="flex w-full flex-col items-center gap-4 text-center">
              <p className="w-full font-inter text-[18px] font-bold leading-[28px] tracking-[0.5825px] text-black [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]">
                {otpModal.heading_enter}
              </p>
              <p className="w-full font-inter text-[16px] font-light leading-[28px] tracking-[0.5184px] text-black [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]">
                {otpModal.otp_sent_template.replace('{phone}', maskPhone(phoneNumber))}
              </p>
            </div>

            {/* 6 OTP digit boxes */}
            <div className={`flex gap-[9.6px] ${shaking ? 'otp-shake' : ''}`}>
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={2}
                  value={digit}
                  onChange={(e) => handleInput(i, e)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  aria-label={`OTP digit ${i + 1}`}
                  className="flex size-[48px] items-center justify-center rounded-[14.4px] border-[1.2px] border-solid text-center font-inter text-[16.8px] font-medium tracking-[-0.168px] outline-none transition-colors duration-200"
                  style={otpBoxStyle(status, Boolean(digit))}
                />
              ))}
            </div>

            {/* Verify + Resend */}
            <div className="flex w-full flex-col items-start gap-2">
              <PrimaryButton fullWidth onClick={handleVerify}>
                <span className="flex items-center justify-center gap-2" style={{ opacity: allFilled ? 1 : 0.5 }}>
                  <IconSlot src={iconVerifyCheck} width={14} height={9.625} />
                  {otpModal.verify_label}
                </span>
              </PrimaryButton>
              <button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0}
                className="flex h-12 w-full items-center justify-center rounded-2xl font-inter text-[16px] font-medium tracking-[0.2592px]"
                style={{
                  boxShadow: '0px 2px 2px rgba(0,65,114,0.08)',
                  color: countdown > 0 ? '#4d4d4d' : '#004172',
                  cursor: countdown > 0 ? 'default' : 'pointer',
                }}
              >
                {countdown > 0 ? otpModal.resend_countdown_template.replace('{n}', String(countdown)) : otpModal.resend_label}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
