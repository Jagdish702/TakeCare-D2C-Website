import { Fragment, useEffect, useRef, useState } from 'react';
import { useContent } from '../../context/ContentContext';
import IconSlot from '../common/IconSlot';
import PrimaryButton from '../common/PrimaryButton';
import { onImageError } from '../../utils/imageFallback';
import avatarPhotoFallback from '../../assets/profile-dashboard/avatar-photo.png';
import iconCamera from '../../assets/profile-dashboard/icon-camera.svg';
import iconEditPencil from '../../assets/profile-dashboard/icon-edit-pencil.svg';
import iconBreadcrumbChevron from '../../assets/profile-dashboard/icon-breadcrumb-chevron.svg';
import iconFilter from '../../assets/profile-dashboard/icon-filter.svg';
import iconPackage from '../../assets/profile-dashboard/icon-package.svg';
import iconMembership from '../../assets/profile-dashboard/icon-membership.svg';
import iconHeartPulse from '../../assets/profile-dashboard/icon-heart-pulse.svg';
import iconBell from '../../assets/profile-dashboard/icon-bell.svg';
import iconToggleOn from '../../assets/profile-dashboard/icon-toggle-on.svg';
import iconLanguage from '../../assets/profile-dashboard/icon-language.svg';
import iconShieldCheck from '../../assets/profile-dashboard/icon-shield-check.svg';
import iconChevronRight24 from '../../assets/profile-dashboard/icon-chevron-right-24.svg';
import iconLogout from '../../assets/profile-dashboard/icon-logout.svg';
import type { ProfileFormData } from '../ProfileModal/ProfileModal';

export type { ProfileFormData };

/**
 * Profile Dashboard — Figma node 12185:2369 ("Web/Profile_Page").
 * The Figma "Header" sub-frame is intentionally skipped — the app's real
 * <Header> already covers site nav. Everything below is the "Profile"
 * content frame: 1481-wide canvas, pt-60/px-120/pb-120, two 596.5px columns
 * with a 48px gap (and 48px between stacked cards in each column).
 *
 * Personal Information / Addresses / Contact show the real values collected
 * in ProfileModal's create-profile form (`formData`), not Figma's example
 * text. Orders shows the real device + selected subscription plan
 * (`cartPlan`) when one exists — nothing is fabricated when it doesn't.
 */

const CANVAS_W = 1481;
export const DASH = '—';

export type CartPlan = {
  key: string;
  title: string;
  subAmount: string;
  subPeriod: [string, string];
} | null;

export function val(v?: string): string {
  return v && v.trim() ? v.trim() : DASH;
}

export function formatAddress(f: ProfileFormData): string | null {
  if (!f.address1?.trim()) return null;
  const line2 = [f.city, f.state, f.pincode].filter((s) => s?.trim()).join(', ');
  return [f.address1, line2, f.country].filter((s) => s?.trim()).join(', ');
}

export function displayName(f: ProfileFormData | null): string {
  const name = [f?.firstName, f?.lastName].filter((s) => s?.trim()).join(' ').trim();
  return name || 'there';
}

// ─── Shared type styles ─────────────────────────────────────────────────────

const CARD_TITLE_CLS =
  'whitespace-nowrap font-inter text-[24px] font-medium leading-normal tracking-[0.3888px] text-[#808080]';
const ROW_LABEL_CLS = 'min-w-0 flex-1 font-inter text-[16px] font-medium leading-[28px] tracking-[0.5184px] text-[#808080]';
const ROW_VALUE_CLS =
  'min-w-0 flex-1 text-right font-inter text-[16px] font-medium leading-[28px] tracking-[0.5184px] text-black';
const FOOTER_NOTE_CLS = 'font-inter text-[12px] font-medium leading-[20px] tracking-[0.3883px] text-[#808080]';
const BUTTON_TEXT_CLS = 'whitespace-nowrap font-inter text-[16px] font-medium leading-normal tracking-[0.2592px]';
const EMPTY_ROW_CLS = 'w-full font-inter text-[16px] font-medium leading-[28px] tracking-[0.5184px] text-[#808080]';

// ─── Primitives ──────────────────────────────────────────────────────────────

export function Divider() {
  return <div className="h-px w-full shrink-0 bg-[#e5e5e5]" />;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex w-full shrink-0 items-center gap-6">
      <p className={ROW_LABEL_CLS}>{label}</p>
      <p className={ROW_VALUE_CLS}>{value}</p>
    </div>
  );
}

export type ChipVariant = 'success' | 'info' | 'detail' | 'danger';
const CHIP_STYLES: Record<ChipVariant, string> = {
  success: 'bg-[#e8fff1] text-[#00b82e]',
  info: 'bg-[#e5f7fc] text-[#008eb1]',
  detail: 'bg-[#e5e5e5] text-[#4d4d4d]',
  danger: 'bg-[#ffdbdb] text-[#d82525]',
};

export function Chip({ text, variant }: { text: string; variant: ChipVariant }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-lg px-3 py-2 font-inter text-[12px] font-medium leading-[20px] tracking-[0.3883px] ${CHIP_STYLES[variant]}`}
    >
      {text}
    </span>
  );
}

// Transparent, fully round — header Edit/Add-photo icon buttons.
export function IconRoundButton({
  icon,
  width,
  height,
  alt,
  onClick,
}: {
  icon: string;
  width: number;
  height: number;
  alt: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={alt}
      className="flex size-10 shrink-0 items-center justify-center rounded-full"
      style={{ boxShadow: '0px 2px 2px rgba(0,65,114,0.08)' }}
    >
      <IconSlot src={icon} width={width} height={height} shadow />
    </button>
  );
}

// Transparent, rounded-20 — General row trailing chevrons.
export function IconChevronButton() {
  return (
    <button
      type="button"
      aria-label="Open"
      className="flex size-10 shrink-0 items-center justify-center rounded-[20px]"
      style={{ boxShadow: '0px 2px 2px rgba(0,65,114,0.08)' }}
    >
      <IconSlot src={iconChevronRight24} width={6.8} height={11.8} />
    </button>
  );
}

// Light-green rounded-xl badge — Notifications/General row leads.
export function IconGreenBadge({ icon, width, height }: { icon: string; width: number; height: number }) {
  return (
    <span
      className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#ebf8f3]"
      style={{ boxShadow: '0px 2px 2px rgba(0,65,114,0.08), inset 0px 0px 2px rgba(0,65,114,0.08)' }}
    >
      <IconSlot src={icon} width={width} height={height} shadow />
    </span>
  );
}

export function GhostButton({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex shrink-0 items-center justify-center gap-2 text-[#004172] ${BUTTON_TEXT_CLS} ${className}`}
      style={{ boxShadow: '0px 2px 2px rgba(0,65,114,0.08)' }}
    >
      {children}
    </button>
  );
}

export function TintedButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#edf9ff] px-4 py-3 text-[#004172] ${BUTTON_TEXT_CLS}`}
      style={{ boxShadow: '0px 2px 2px rgba(0,65,114,0.08), inset 0px 0px 2px rgba(0,65,114,0.08)' }}
    >
      {children}
    </button>
  );
}

export function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={on}
      className={`flex h-7 w-[54px] shrink-0 items-center rounded-full p-0.5 ${on ? 'justify-end' : 'justify-start'}`}
      style={{
        background: on ? 'linear-gradient(to bottom, #10b981, #00664c)' : 'linear-gradient(to bottom, #ebebeb, #b7b7b7)',
        boxShadow: 'inset 0px 0px 6px rgba(0,65,114,0.24)',
      }}
    >
      <span
        className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white"
        style={{ boxShadow: '0px 2px 4px rgba(0,65,114,0.08), inset 0px 0px 2px rgba(0,65,114,0.08)' }}
      >
        {on && <IconSlot src={iconToggleOn} width={10.5} height={7.583} />}
      </span>
    </button>
  );
}

// Card shell: header (title + actions) + white card body + optional footer.
// Figma's per-card shadow placement is genuinely inconsistent — reproduced
// exactly rather than normalized: most cards split drop-shadow (root) from
// inset-shadow (card); Personal Information puts both on the card; Addresses
// has no shadow at all.
function SectionCard({
  title,
  actions,
  children,
  footer,
  shadowMode = 'split',
  headerFixedHeight = false,
}: {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  footer?: string;
  shadowMode?: 'split' | 'onCard' | 'none';
  headerFixedHeight?: boolean;
}) {
  const rootStyle: React.CSSProperties =
    shadowMode === 'split' ? { filter: 'drop-shadow(0px 2px 4px rgba(0,65,114,0.08))' } : {};
  const cardStyle: React.CSSProperties =
    shadowMode === 'onCard'
      ? { boxShadow: '0px 2px 1px rgba(0,65,114,0.08), inset 0px 0px 2px rgba(0,65,114,0.08)' }
      : shadowMode === 'split'
        ? { boxShadow: 'inset 0px 0px 2px rgba(0,65,114,0.08)' }
        : {};

  return (
    <div className="flex w-full shrink-0 flex-col items-start gap-3" style={rootStyle}>
      <div className={`flex w-full items-center justify-between ${headerFixedHeight ? 'h-12' : ''}`}>
        <p className={CARD_TITLE_CLS}>{title}</p>
        {actions}
      </div>
      <div className="relative flex w-full flex-col items-start gap-[22px] rounded-3xl bg-white p-6" style={cardStyle}>
        {children}
      </div>
      {footer && <p className={FOOTER_NOTE_CLS}>{footer}</p>}
    </div>
  );
}

// ─── Avatar + Welcome row ────────────────────────────────────────────────────

function AvatarWelcomeRow({ formData }: { formData: ProfileFormData | null }) {
  const { profile, images } = useContent();
  const dashboard = profile.dashboard;
  return (
    <div className="flex w-full shrink-0 items-center gap-12">
      <div
        className="relative size-[120px] shrink-0 overflow-hidden rounded-full"
        style={{ boxShadow: '0px 2px 16px rgba(0,65,114,0.08), inset 0px 0px 2px rgba(0,65,114,0.16)' }}
      >
        <img
          src={images['profile-dashboard-avatar-photo']}
          onError={onImageError(avatarPhotoFallback)}
          alt=""
          className="size-full object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-6">
        <p
          className="whitespace-nowrap bg-clip-text font-inter text-[24px] font-light leading-normal tracking-[0.3888px] text-transparent"
          style={{ backgroundImage: 'linear-gradient(96.24deg, #b189ff 0%, #2e008b 96.07%)' }}
        >
          {dashboard.welcome_text}
        </p>
        <p className="whitespace-nowrap font-inter text-[24px] font-bold leading-normal tracking-[0.3888px] text-black">
          {displayName(formData)}
        </p>
        <p className="whitespace-nowrap font-inter text-[16px] font-light leading-[28px] tracking-[0.5184px] text-black">
          {dashboard.member_tag}
        </p>
      </div>
      <IconRoundButton icon={iconCamera} width={23} height={17} alt="Change profile picture" />
    </div>
  );
}

// ─── ABHA ────────────────────────────────────────────────────────────────────

function ABHACard() {
  const { profile } = useContent();
  const abhaCard = profile.abhaCard;
  return (
    <SectionCard
      title="ABHA"
      actions={
        <div className="flex items-center gap-6">
          <Chip text={abhaCard.not_created_chip} variant="danger" />
          <PrimaryButton>{abhaCard.create_cta_label}</PrimaryButton>
        </div>
      }
    >
      <InfoRow label={abhaCard.id_label} value={abhaCard.not_linked_value} />
      <Divider />
      <InfoRow label={abhaCard.address_label} value={abhaCard.not_linked_value} />
    </SectionCard>
  );
}

// ─── Personal Information ───────────────────────────────────────────────────

function PersonalInfoCard({ formData }: { formData: ProfileFormData | null }) {
  const { profile } = useContent();
  const personalInfoCard = profile.personalInfoCard;
  return (
    <SectionCard
      title="Personal Information"
      shadowMode="onCard"
      headerFixedHeight
      actions={<IconRoundButton icon={iconEditPencil} width={17.8} height={17.019} alt="Edit personal information" />}
      footer={personalInfoCard.footer_text}
    >
      <InfoRow label="First Name" value={val(formData?.firstName)} />
      <Divider />
      <InfoRow label="Last name" value={val(formData?.lastName)} />
      <Divider />
      <InfoRow label="Date of birth" value={val(formData?.dateOfBirth)} />
      <Divider />
      <InfoRow label="Gender" value={val(formData?.gender)} />
      <Divider />
      <InfoRow label="Blood group" value={val(formData?.bloodGroup)} />
    </SectionCard>
  );
}

// ─── Addresses ───────────────────────────────────────────────────────────────

function AddressesCard({ formData }: { formData: ProfileFormData | null }) {
  const { profile } = useContent();
  const addressesCard = profile.addressesCard;
  const address = formData ? formatAddress(formData) : null;
  return (
    <SectionCard
      title="Addresses"
      shadowMode="none"
      actions={
        <div className="flex items-center gap-6">
          <IconRoundButton icon={iconEditPencil} width={17.8} height={17.019} alt="Edit address" />
          <GhostButton className="h-12 rounded-2xl px-4 py-3">{addressesCard.view_all_label}</GhostButton>
        </div>
      }
      footer={addressesCard.footer_text}
    >
      {address ? (
        <div className="flex w-full shrink-0 items-center gap-12">
          <div className="flex min-w-0 flex-1 flex-col items-start gap-4">
            <p className="w-full font-inter text-[16px] font-medium leading-[28px] tracking-[0.5184px] text-black">
              {addressesCard.home_label}
            </p>
            <p className="w-full font-inter text-[16px] font-medium leading-[28px] tracking-[0.5184px] text-[#808080]">
              {address}
            </p>
          </div>
          <Chip text={addressesCard.default_chip} variant="info" />
        </div>
      ) : (
        <p className={EMPTY_ROW_CLS}>{addressesCard.empty_text}</p>
      )}
    </SectionCard>
  );
}

// ─── Contact ─────────────────────────────────────────────────────────────────

function ContactCard({ formData }: { formData: ProfileFormData | null }) {
  const { profile } = useContent();
  const contactCard = profile.contactCard;
  const phone = formData?.phoneNumber?.trim() ? `+91 ${formData.phoneNumber.trim()}` : DASH;
  return (
    <SectionCard
      title="Contact"
      headerFixedHeight
      actions={<IconRoundButton icon={iconEditPencil} width={17.8} height={17.019} alt="Edit contact" />}
      footer={contactCard.footer_text}
    >
      <InfoRow label={contactCard.email_label} value={contactCard.not_provided_label} />
      <Divider />
      <InfoRow label={contactCard.contact_label} value={phone} />
    </SectionCard>
  );
}

// ─── Subscription ────────────────────────────────────────────────────────────

function SubscriptionCard({ cartPlan }: { cartPlan: CartPlan }) {
  const { profile } = useContent();
  const subscriptionCard = profile.subscriptionCard;
  return (
    <SectionCard
      title="Subscription"
      actions={
        <div className="flex items-center gap-6">
          <GhostButton className="h-10 rounded-full p-2">{subscriptionCard.history_label}</GhostButton>
          <TintedButton>{subscriptionCard.manage_label}</TintedButton>
        </div>
      }
      footer={subscriptionCard.footer_text}
    >
      {cartPlan ? (
        <div className="flex w-full shrink-0 items-center gap-12">
          <div className="flex min-w-0 flex-1 flex-col items-start gap-4">
            <p className="w-full font-inter text-[16px] font-medium leading-[28px] tracking-[0.5184px] text-black">
              {cartPlan.title}
            </p>
            <p className="w-full font-inter text-[16px] font-medium leading-[28px] tracking-[0.5184px] text-[#808080]">
              ₹{cartPlan.subAmount} {cartPlan.subPeriod[0]} {cartPlan.subPeriod[1]}
            </p>
          </div>
          <Chip text={subscriptionCard.active_chip} variant="success" />
        </div>
      ) : (
        <p className={EMPTY_ROW_CLS}>{subscriptionCard.empty_text}</p>
      )}
    </SectionCard>
  );
}

// ─── Orders ──────────────────────────────────────────────────────────────────

function OrdersCard({ cartPlan }: { cartPlan: CartPlan }) {
  const { profile } = useContent();
  const ordersCard = profile.ordersCard;
  const rows = cartPlan
    ? [
        { key: 'device', title: ordersCard.device_name, sub: ordersCard.device_price_label },
        {
          key: 'plan',
          title: cartPlan.title,
          sub: `₹${cartPlan.subAmount} ${cartPlan.subPeriod[0]} ${cartPlan.subPeriod[1]}`,
        },
      ]
    : [];

  return (
    <SectionCard
      title="Orders"
      actions={
        <div className="flex items-center gap-6">
          <GhostButton className="h-10 rounded-full p-2">History</GhostButton>
          <TintedButton>
            {ordersCard.filter_label}
            <IconSlot src={iconFilter} width={20} height={20} />
          </TintedButton>
        </div>
      }
    >
      {rows.length ? (
        rows.map((row, i) => (
          <Fragment key={row.key}>
            {i > 0 && <Divider />}
            <div className="flex w-full shrink-0 items-center gap-12">
              <div className="flex min-w-0 flex-1 flex-col items-start gap-3">
                <p className="w-full font-inter text-[16px] font-medium leading-[28px] tracking-[0.5184px] text-black">
                  {row.title}
                </p>
                <p className="w-full font-inter text-[16px] font-medium leading-[28px] tracking-[0.5184px] text-[#808080]">
                  {row.sub}
                </p>
              </div>
              <Chip text={ordersCard.confirmed_chip} variant="detail" />
            </div>
          </Fragment>
        ))
      ) : (
        <p className={EMPTY_ROW_CLS}>{ordersCard.empty_text}</p>
      )}
    </SectionCard>
  );
}

// ─── Notifications ───────────────────────────────────────────────────────────

export type NotifKey = 'orderUpdates' | 'subscriptionAlerts' | 'healthReminders' | 'promotions';

// icon/size are presentation-only (not content-backed); `label` here is a
// fallback and is overridden at render time by `profile.notificationRows`
// (sort_order-matched, same 4-row order) via useContent().
export const NOTIF_ROWS: { key: NotifKey; icon: string; iw: number; ih: number; label: string }[] = [
  { key: 'orderUpdates', icon: iconPackage, iw: 16.4, ih: 18, label: 'Order updates' },
  { key: 'subscriptionAlerts', icon: iconMembership, iw: 16.2, ih: 9.2, label: 'Subscription alerts' },
  { key: 'healthReminders', icon: iconHeartPulse, iw: 19.6, ih: 20.2, label: 'Health reminders' },
  { key: 'promotions', icon: iconBell, iw: 17.8, ih: 19.575, label: 'Promotions' },
];

function NotificationsCard() {
  const { profile } = useContent();
  const notificationRows = profile.notificationRows;
  const [toggles, setToggles] = useState<Record<NotifKey, boolean>>({
    orderUpdates: true,
    subscriptionAlerts: true,
    healthReminders: false,
    promotions: false,
  });
  const flip = (key: NotifKey) => () => setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <SectionCard title="Notifications" headerFixedHeight>
      {NOTIF_ROWS.map((row, i) => (
        <Fragment key={row.key}>
          {i > 0 && <Divider />}
          <div className="flex w-full shrink-0 items-center gap-12">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <IconGreenBadge icon={row.icon} width={row.iw} height={row.ih} />
              <p className="whitespace-nowrap font-inter text-[16px] font-medium leading-[28px] tracking-[0.5184px] text-black">
                {notificationRows[i].label}
              </p>
            </div>
            <Toggle on={toggles[row.key]} onToggle={flip(row.key)} />
          </div>
        </Fragment>
      ))}
    </SectionCard>
  );
}

// ─── General ─────────────────────────────────────────────────────────────────

function GeneralCard() {
  const { profile } = useContent();
  const generalCard = profile.generalCard;
  return (
    <SectionCard
      title="General"
      headerFixedHeight
      footer={generalCard.footer_text}
    >
      <div className="flex w-full shrink-0 items-center gap-12">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <IconGreenBadge icon={iconLanguage} width={16.9} height={14.4} />
          <p className="whitespace-nowrap font-inter text-[16px] font-medium leading-[28px] tracking-[0.5184px] text-[#808080]">
            {generalCard.language_label}
          </p>
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
          <p className="min-w-0 flex-1 text-right font-inter text-[16px] font-medium leading-[28px] tracking-[0.5184px] text-black">
            {generalCard.language_value}
          </p>
          <IconChevronButton />
        </div>
      </div>
      <Divider />
      <div className="flex w-full shrink-0 items-center gap-12">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <IconGreenBadge icon={iconShieldCheck} width={18} height={19.8} />
          <p className="whitespace-nowrap font-inter text-[16px] font-medium leading-[28px] tracking-[0.5184px] text-[#808080]">
            {generalCard.privacy_label}
          </p>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <IconChevronButton />
        </div>
      </div>
    </SectionCard>
  );
}

// ─── Logout ──────────────────────────────────────────────────────────────────

export function LogoutButton({ onClick }: { onClick?: () => void }) {
  const { profile } = useContent();
  const dashboard = profile.dashboard;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-[#d82525] ${BUTTON_TEXT_CLS}`}
      style={{ boxShadow: '0px 2px 2px rgba(0,65,114,0.08), inset 0px 0px 2px rgba(0,65,114,0.08)' }}
    >
      {dashboard.logout_label}
      <IconSlot src={iconLogout} width={18} height={18} shadow />
    </button>
  );
}

// ─── Title + breadcrumb ──────────────────────────────────────────────────────

function TitleBreadcrumb({ onBack }: { onBack: () => void }) {
  const { profile } = useContent();
  const dashboard = profile.dashboard;
  return (
    <div className="flex w-full shrink-0 flex-col items-start gap-6">
      <h1 className="font-inter text-[48px] font-bold leading-normal text-black">{dashboard.title}</h1>
      <div className="flex items-center gap-1 bg-[#f9f9f9]">
        <button
          type="button"
          onClick={onBack}
          className="font-inter text-[12px] font-medium leading-[20px] tracking-[0.3883px] text-[#999999]"
        >
          TakeCare
        </button>
        <IconSlot src={iconBreadcrumbChevron} width={4.445} height={7.778} />
        <span className="font-inter text-[12px] font-medium leading-[20px] tracking-[0.3883px] text-black">{dashboard.title}</span>
      </div>
    </div>
  );
}

// ─── Root ────────────────────────────────────────────────────────────────────

export default function ProfileDashboard({
  formData,
  cartPlan,
  onBack,
  onLogout,
}: {
  formData: ProfileFormData | null;
  cartPlan: CartPlan;
  onBack: () => void;
  onLogout: () => void;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      if (!wrapperRef.current || !canvasRef.current) return;
      const vw = document.documentElement.clientWidth;
      const s = Math.min(1, vw / CANVAS_W);
      const ox = (vw - CANVAS_W * s) / 2;
      canvasRef.current.style.transform = `translate(${ox}px, 0) scale(${s})`;
      canvasRef.current.style.transformOrigin = 'top left';
      wrapperRef.current.style.height = `${canvasRef.current.scrollHeight * s}px`;
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <div ref={wrapperRef} className="w-full bg-white" style={{ overflow: 'hidden' }}>
      <div
        ref={canvasRef}
        className="flex flex-col items-start gap-12 px-[120px] pb-[120px] pt-[60px]"
        style={{ width: CANVAS_W, boxSizing: 'border-box' }}
      >
        <TitleBreadcrumb onBack={onBack} />
        <div className="flex w-full items-start gap-12">
          <div className="flex min-w-0 flex-1 flex-col items-start gap-12">
            <AvatarWelcomeRow formData={formData} />
            <PersonalInfoCard formData={formData} />
            <ContactCard formData={formData} />
            <OrdersCard cartPlan={cartPlan} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-start gap-12">
            <ABHACard />
            <AddressesCard formData={formData} />
            <SubscriptionCard cartPlan={cartPlan} />
            <NotificationsCard />
            <GeneralCard />
            <LogoutButton onClick={onLogout} />
          </div>
        </div>
      </div>
    </div>
  );
}
