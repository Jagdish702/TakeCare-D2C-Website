import { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import IconSlot from '../common/IconSlot';
import indiaFlagImg from '../../assets/profile-modal/india-flag.png';
import iconCheck from '../../assets/profile-modal/icon-check.svg';
import iconChevronDown from '../../assets/profile-modal/icon-chevron-down.svg';
import iconChevronDownSm from '../../assets/profile-modal/icon-chevron-down-sm.svg';
import iconCloseCircle from '../../assets/profile-modal/icon-close-circle.svg';
import iconCalendar from '../../assets/profile-modal/icon-calendar.svg';
import iconChevronRight from '../../assets/profile-modal/icon-chevron-right.svg';
import iconCaptureAvatar from '../../assets/profile-modal/icon-capture-avatar.svg';

/**
 * "Create your Profile" modal — Figma node 12185:2622 ("Frame 1703877931"),
 * part of the Profile Section (12185:2368). 1100×842.571 panel, p-48/gap-48,
 * rounded-48, Outer/5 shadow (drop 0/2/16 + inset 0/0/2 rgba(0,65,114,*)).
 * All icons below are the exact Figma SVG exports (Dev Mode MCP), not
 * hand-drawn approximations — see profile-modal asset folder.
 *
 * Two field "heights" exist in the raw Dev Mode output: plain fields use
 * p-16 with no fixed height (would render ~60px tall because their
 * `text-box-trim` CSS isn't yet supported in shipping browsers), while
 * dropdown-style fields use h-44/py-8. The Figma screenshot shows every
 * field at a uniform ~44px, so all fields here are explicitly h-11 (44px)
 * to match the RENDERED design rather than literally porting the
 * inconsistent source padding.
 */

// ─── Field primitives ─────────────────────────────────────────────────────────

const FIELD_BOX = 'flex h-11 w-full items-center gap-2 px-4';

// Figma: 319×44 field, border is a top-to-bottom gradient (#EBEBEB → #B7B7B7),
// not a flat colour — reproduced via the padding-box/border-box layered-
// background technique (a plain `border` can't render a gradient stroke).
// `borderWidth`/`radius` are passed per-side so the phone field's two
// segments can share one seam without doubling the middle border (matching
// the Figma source, which omits the right segment's left edge entirely).
function gradientBorderStyle(borderWidth: string, radius: string): React.CSSProperties {
  return {
    borderStyle: 'solid',
    borderWidth,
    borderColor: 'transparent',
    backgroundImage: `linear-gradient(white, white), linear-gradient(to bottom, #EBEBEB, #B7B7B7)`,
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
    boxShadow: '0px 2px 1px rgba(0,65,114,0.08), inset 0px 0px 2px rgba(0,65,114,0.08)',
    borderRadius: radius,
  };
}

// Web/Body-M: Inter Medium 16px, lineHeight spacing/9 (28px), tracking 0.5184px
const FIELD_TEXT_CLS =
  'min-w-0 flex-1 bg-transparent font-inter text-[16px] font-medium leading-[28px] tracking-[0.5184px] text-black outline-none ' +
  'placeholder:font-inter placeholder:text-[16px] placeholder:font-medium placeholder:leading-[28px] placeholder:tracking-[0.5184px] placeholder:text-[#cccccc]';

// Body medium: Inter Medium 16px, lineHeight 100%, tracking 0.2592px
const FIELD_LABEL_CLS =
  'w-full font-inter text-[16px] font-medium leading-normal tracking-[0.2592px] text-black [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]';

// Every plain field box (no split seam) uses the same gradient border as the
// phone field's segments — uniform 0.81px on all sides, 12px on all corners.
const PLAIN_FIELD_BORDER = gradientBorderStyle('0.81px', '12px');

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <p className={FIELD_LABEL_CLS}>{label}</p>
      <div className={FIELD_BOX} style={PLAIN_FIELD_BORDER}>
        <input type="text" value={value} onChange={onChange} placeholder={placeholder} className={FIELD_TEXT_CLS} />
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <p className={FIELD_LABEL_CLS}>{label}</p>
      <div className={FIELD_BOX} style={PLAIN_FIELD_BORDER}>
        <input type="text" value={value} onChange={onChange} placeholder={placeholder} className={FIELD_TEXT_CLS} />
        <IconSlot src={iconChevronDown} width={10} height={5} />
      </div>
    </div>
  );
}

function DateField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <p className={FIELD_LABEL_CLS}>{label}</p>
      <div className={FIELD_BOX} style={PLAIN_FIELD_BORDER}>
        <IconSlot src={iconCalendar} width={16} height={17.778} shadow />
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={FIELD_TEXT_CLS.replace('leading-[28px]', 'leading-normal').replace('tracking-[0.5184px]', 'tracking-[0.2592px]')}
        />
        <IconSlot src={iconChevronDown} width={10} height={5} />
      </div>
    </div>
  );
}

function PhoneField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <p className={FIELD_LABEL_CLS}>{label}</p>
      <div className="flex h-11 w-full items-start">
        <div
          className="flex h-11 shrink-0 items-center gap-2 px-4"
          style={gradientBorderStyle('1.62px', '12px 0 0 12px')}
        >
          <img src={indiaFlagImg} alt="India" className="h-3 w-[17.778px] shrink-0 object-cover" />
          <span className="whitespace-nowrap font-inter text-[16px] font-medium leading-normal tracking-[0.2592px] text-[#cccccc]">
            +91
          </span>
          <img src={iconChevronDownSm} alt="" className="h-[5px] w-[10px] shrink-0" />
        </div>
        <div
          className="flex h-11 min-w-0 flex-1 items-center px-4"
          style={gradientBorderStyle('1.62px 1.62px 1.62px 0', '0 12px 12px 0')}
        >
          <input
            type="tel"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={FIELD_TEXT_CLS.replace('leading-[28px]', 'leading-normal').replace('tracking-[0.5184px]', 'tracking-[0.2592px]')}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Checkbox row ──────────────────────────────────────────────────────────────

function CheckboxRow({ checked, onToggle, text }: { checked: boolean; onToggle: () => void; text: string }) {
  return (
    <button type="button" onClick={onToggle} className="flex w-full items-start gap-4 text-left focus:outline-none">
      {checked ? (
        // Fills the same 20×20 slot as the unchecked box — the drop/inner
        // shadow is baked into the SVG's own <filter>, so no extra CSS
        // filter is applied here.
        <img src={iconCheck} alt="" className="size-5 shrink-0" />
      ) : (
        <span
          className="size-5 shrink-0 rounded-[1px] border-2 border-[#b2b2b2]"
          style={{ filter: 'drop-shadow(0px 2px 1px rgba(0,65,114,0.08))' }}
        />
      )}
      <p className="font-inter text-[16px] font-medium leading-normal tracking-[-0.16px] text-[rgba(0,0,0,0.5)]">
        {text}
      </p>
    </button>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export type ProfileFormData = {
  firstName: string;
  lastName: string;
  gender: string;
  phoneNumber: string;
  dateOfBirth: string;
  bloodGroup: string;
  age: string;
  address1: string;
  country: string;
  pincode: string;
  city: string;
  state: string;
};

export default function ProfileModal({
  onClose,
  onRequestOTP,
}: {
  onClose: () => void;
  onRequestOTP?: (phoneNumber: string, formData: ProfileFormData) => void;
}) {
  const { profile, checkout } = useContent();
  const profileModal = profile.profileModal;
  const fieldMap = Object.fromEntries(
    checkout.formFields.filter((f: any) => f.form_key === 'profile').map((f: any) => [f.field_key, f])
  ) as Record<string, { label: string; placeholder: string }>;

  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    gender: '',
    phoneNumber: '',
    dateOfBirth: '',
    bloodGroup: '',
    age: '',
    address1: '',
    country: '',
    pincode: '',
    city: '',
    state: '',
  });

  const handleChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const [checkboxes, setCheckboxes] = useState({ consent: false, terms: true, privacy: true });
  const toggleCheckbox = (key: keyof typeof checkboxes) => () =>
    setCheckboxes((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    // Overlay starts BELOW the 52px sticky header (top: HEADER_H, not 0) so
    // the header stays sharp and clickable above the blurred/dimmed page —
    // only the page content behind the modal blurs, not the header itself.
    <div
      className="fixed inset-x-0 bottom-0 z-[1200] flex items-center justify-center overflow-y-auto p-4 md:p-12"
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
        className="relative flex w-[1100px] max-w-full max-h-full flex-col items-start gap-12 overflow-y-auto rounded-[48px] bg-white p-12"
        style={{ boxShadow: '0px 2px 16px rgba(0,65,114,0.08), inset 0px 0px 2px rgba(0,65,114,0.16)' }}
      >
      {/* ── Header row ── */}
      <div className="flex w-full shrink-0 items-center justify-between">
        <h2 className="font-inter text-[32px] font-semibold leading-normal text-black [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]">
          {profileModal.heading}
        </h2>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="flex shrink-0 items-center justify-center rounded-[20px] p-2"
          style={{ boxShadow: '0px 2px 2px rgba(0,65,114,0.08)' }}
        >
          <img src={iconCloseCircle} alt="" className="size-6" style={{ filter: 'drop-shadow(0px 2px 8px rgba(0,65,114,0.08))' }} />
        </button>
      </div>

      {/* ── Content ── */}
      <div className="flex w-full flex-col items-start gap-6">
        {/* Avatar / capture profile picture */}
        <div
          className="flex size-[78.571px] shrink-0 items-center justify-center rounded-2xl bg-[#e5e5e5]"
          style={{ boxShadow: 'inset 0px 0px 2px rgba(0,65,114,0.08)' }}
        >
          <img src={iconCaptureAvatar} alt="Capture profile picture" className="h-[14.754px] w-5" />
        </div>

        {/* Form grid — Figma explicit row/col placement, reproduced with
            row-start/col-start; collapses to 1 column below md so nothing
            overlaps on narrow viewports. */}
        <div className="grid w-full grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-3">
          <div className="md:col-start-1 md:row-start-1">
            <TextField label={fieldMap.first_name.label} value={formData.firstName} onChange={handleChange('firstName')} placeholder={fieldMap.first_name.placeholder} />
          </div>
          <div className="md:col-start-2 md:row-start-1">
            <TextField label={fieldMap.last_name.label} value={formData.lastName} onChange={handleChange('lastName')} placeholder={fieldMap.last_name.placeholder} />
          </div>
          <div className="md:col-start-3 md:row-start-1">
            <TextField label={fieldMap.gender.label} value={formData.gender} onChange={handleChange('gender')} placeholder={fieldMap.gender.placeholder} />
          </div>

          <div className="md:col-start-1 md:row-start-2">
            <PhoneField label={fieldMap.phone_number.label} value={formData.phoneNumber} onChange={handleChange('phoneNumber')} placeholder={fieldMap.phone_number.placeholder} />
          </div>
          <div className="md:col-start-2 md:row-start-2">
            <DateField label={fieldMap.date_of_birth.label} value={formData.dateOfBirth} onChange={handleChange('dateOfBirth')} placeholder={fieldMap.date_of_birth.placeholder} />
          </div>
          <div className="md:col-start-3 md:row-start-2">
            <SelectField label={fieldMap.blood_group.label} value={formData.bloodGroup} onChange={handleChange('bloodGroup')} placeholder={fieldMap.blood_group.placeholder} />
          </div>

          <div className="md:col-start-1 md:row-start-3">
            <TextField label={fieldMap.age.label} value={formData.age} onChange={handleChange('age')} placeholder={fieldMap.age.placeholder} />
          </div>
          <div className="md:col-start-2 md:row-start-3">
            <TextField label={fieldMap.address1.label} value={formData.address1} onChange={handleChange('address1')} placeholder={fieldMap.address1.placeholder} />
          </div>
          <div className="md:col-start-3 md:row-start-3">
            <SelectField label={fieldMap.country.label} value={formData.country} onChange={handleChange('country')} placeholder={fieldMap.country.placeholder} />
          </div>

          <div className="md:col-start-1 md:row-start-4">
            <SelectField label={fieldMap.pincode.label} value={formData.pincode} onChange={handleChange('pincode')} placeholder={fieldMap.pincode.placeholder} />
          </div>
          <div className="md:col-start-2 md:row-start-4">
            <SelectField label={fieldMap.city.label} value={formData.city} onChange={handleChange('city')} placeholder={fieldMap.city.placeholder} />
          </div>
          <div className="md:col-start-3 md:row-start-4">
            <SelectField label={fieldMap.state.label} value={formData.state} onChange={handleChange('state')} placeholder={fieldMap.state.placeholder} />
          </div>
        </div>

        {/* Consent + T&C + Privacy */}
        <div className="flex w-full flex-col items-start gap-5">
          <CheckboxRow
            checked={checkboxes.consent}
            onToggle={toggleCheckbox('consent')}
            text={profileModal.consent_text}
          />
          <CheckboxRow checked={checkboxes.terms} onToggle={toggleCheckbox('terms')} text={profileModal.terms_label} />
          <CheckboxRow checked={checkboxes.privacy} onToggle={toggleCheckbox('privacy')} text={profileModal.privacy_label} />
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="flex w-full shrink-0 items-start justify-end">
        <button
          type="button"
          onClick={() => onRequestOTP?.(formData.phoneNumber, formData)}
          className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#004172] px-4 py-3 font-inter text-[16px] font-medium leading-normal tracking-[0.2592px] text-white"
          style={{ boxShadow: '0px 2px 2px rgba(0,65,114,0.08), inset 0px 0px 2px rgba(0,65,114,0.08)' }}
        >
          {profileModal.submit_label}
          <IconSlot src={iconChevronRight} width={5} height={10} />
        </button>
      </div>
      </div>
    </div>
  );
}
