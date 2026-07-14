import { Fragment, useState } from 'react';
import IconSlot from '../common/IconSlot';
import PrimaryButton from '../common/PrimaryButton';
import avatarPhoto from '../../assets/profile-dashboard/avatar-photo.png';
import iconCamera from '../../assets/profile-dashboard/icon-camera.svg';
import iconEditPencil from '../../assets/profile-dashboard/icon-edit-pencil.svg';
import iconBreadcrumbChevron from '../../assets/profile-dashboard/icon-breadcrumb-chevron.svg';
import iconFilter from '../../assets/profile-dashboard/icon-filter.svg';
import iconLanguage from '../../assets/profile-dashboard/icon-language.svg';
import iconShieldCheck from '../../assets/profile-dashboard/icon-shield-check.svg';
import type { ProfileFormData } from '../ProfileModal/ProfileModal';
import {
  type CartPlan,
  Divider,
  Chip,
  IconRoundButton,
  IconChevronButton,
  IconGreenBadge,
  GhostButton,
  TintedButton,
  Toggle,
  LogoutButton,
  NOTIF_ROWS,
  type NotifKey,
  val,
  formatAddress,
  displayName,
  DASH,
} from './ProfileDashboard';

export type { ProfileFormData };

/**
 * Profile Dashboard — mobile (Figma node 12185:2687 "Total Care - mobile",
 * content frame 12185:2691). Same single source-of-truth data/logic as the
 * desktop ProfileDashboard (formData/cartPlan; every primitive below is
 * imported from there) — single-column stack instead of the desktop's
 * two-column layout, at mobile type sizes. The Figma mobile mockup's fake
 * subscription-progress-bar and fake order numbers aren't backed by any
 * real data model in this app, so — same as the desktop build — this shows
 * the real cartPlan-driven content instead of fabricating placeholder data.
 * Figma's Header/Footer frames are skipped; the app's real <Header> and
 * mobile chrome already cover that.
 */

const CARD_TITLE_CLS = 'whitespace-nowrap font-inter text-[16px] font-bold leading-[24px] tracking-[0.5178px] text-[#808080]';
const ROW_LABEL_CLS = 'min-w-0 flex-1 font-inter text-[14px] font-medium leading-[24px] tracking-[0.4536px] text-[#808080]';
const ROW_VALUE_CLS = 'min-w-0 flex-1 text-right font-inter text-[14px] font-medium leading-[24px] tracking-[0.4536px] text-black';
const FOOTER_NOTE_CLS = 'font-inter text-[12px] font-medium leading-[20px] tracking-[0.3883px] text-[#808080]';
const EMPTY_ROW_CLS = 'w-full font-inter text-[14px] font-medium leading-[24px] tracking-[0.4536px] text-[#808080]';

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex w-full shrink-0 items-center gap-6">
      <p className={ROW_LABEL_CLS}>{label}</p>
      <p className={ROW_VALUE_CLS}>{value}</p>
    </div>
  );
}

// Card shell: header (title + actions) + white card body + optional footer —
// same shell/shadow rules as desktop's SectionCard, just a smaller title.
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
  const rootStyle: React.CSSProperties = shadowMode === 'split' ? { filter: 'drop-shadow(0px 2px 4px rgba(0,65,114,0.08))' } : {};
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
  return (
    <div className="flex w-full shrink-0 items-center gap-6">
      <div
        className="relative size-[80px] shrink-0 overflow-hidden rounded-full"
        style={{ boxShadow: '0px 2px 16px rgba(0,65,114,0.08), inset 0px 0px 2px rgba(0,65,114,0.16)' }}
      >
        <img src={avatarPhoto} alt="" className="size-full object-cover" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-3">
        <p
          className="whitespace-nowrap bg-clip-text font-inter text-[20px] font-light leading-[28px] tracking-[0.324px] text-transparent"
          style={{ backgroundImage: 'linear-gradient(96.24deg, #b189ff 0%, #2e008b 96.07%)' }}
        >
          Welcome,
        </p>
        <p className="whitespace-nowrap font-inter text-[20px] font-bold leading-[28px] tracking-[0.324px] text-black">
          {displayName(formData)}
        </p>
        <p className="whitespace-nowrap font-inter text-[14px] font-light leading-[24px] tracking-[0.4536px] text-black">
          CureBay · Take Care Member
        </p>
      </div>
      <IconRoundButton icon={iconCamera} width={20} height={14.754} alt="Change profile picture" />
    </div>
  );
}

// ─── ABHA ────────────────────────────────────────────────────────────────────

function ABHACard() {
  return (
    <SectionCard
      title="ABHA"
      actions={<Chip text="ABHA not created" variant="danger" />}
      footer=""
    >
      <InfoRow label="ABHA ID :" value="Not linked" />
      <Divider />
      <InfoRow label="ABHA Address :" value="Not linked" />
      <div className="w-full pt-1">
        <PrimaryButton fullWidth>Create ABHA</PrimaryButton>
      </div>
    </SectionCard>
  );
}

// ─── Personal Information ───────────────────────────────────────────────────

function PersonalInfoCard({ formData }: { formData: ProfileFormData | null }) {
  return (
    <SectionCard
      title="Personal Information"
      shadowMode="onCard"
      headerFixedHeight
      actions={<IconRoundButton icon={iconEditPencil} width={17.8} height={17.019} alt="Edit personal information" />}
      footer="Your name appears on your Take Care Subscription and orders."
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
  const address = formData ? formatAddress(formData) : null;
  return (
    <SectionCard
      title="Addresses"
      shadowMode="none"
      actions={
        <div className="flex items-center gap-3">
          <IconRoundButton icon={iconEditPencil} width={17.8} height={17.019} alt="Edit address" />
          <GhostButton className="h-10 rounded-full p-2">View All</GhostButton>
        </div>
      }
      footer="Address cannot be changed after an order is dispatched."
    >
      {address ? (
        <div className="flex w-full shrink-0 items-center gap-6">
          <div className="flex min-w-0 flex-1 flex-col items-start gap-3">
            <p className="w-full font-inter text-[14px] font-medium leading-[24px] tracking-[0.4536px] text-black">Home</p>
            <p className="w-full font-inter text-[14px] font-medium leading-[24px] tracking-[0.4536px] text-[#808080]">{address}</p>
          </div>
          <Chip text="Default" variant="info" />
        </div>
      ) : (
        <p className={EMPTY_ROW_CLS}>No address added yet.</p>
      )}
    </SectionCard>
  );
}

// ─── Contact ─────────────────────────────────────────────────────────────────

function ContactCard({ formData }: { formData: ProfileFormData | null }) {
  const phone = formData?.phoneNumber?.trim() ? `+91 ${formData.phoneNumber.trim()}` : DASH;
  return (
    <SectionCard
      title="Contact"
      headerFixedHeight
      actions={<IconRoundButton icon={iconEditPencil} width={17.8} height={17.019} alt="Edit contact" />}
      footer="Your email activates your Take Care Subscription. Changing it affects your login."
    >
      <InfoRow label="Email" value="Not provided" />
      <Divider />
      <InfoRow label="Contact" value={phone} />
    </SectionCard>
  );
}

// ─── Subscription ────────────────────────────────────────────────────────────

function SubscriptionCard({ cartPlan }: { cartPlan: CartPlan }) {
  return (
    <SectionCard
      title="Subscription"
      actions={
        <div className="flex items-center gap-3">
          <GhostButton className="h-10 rounded-full p-2">History</GhostButton>
        </div>
      }
      footer="Your email activates your Take Care Subscription. Changing it affects your login."
    >
      {cartPlan ? (
        <>
          <div className="flex w-full shrink-0 items-center gap-6">
            <div className="flex min-w-0 flex-1 flex-col items-start gap-3">
              <p className="w-full font-inter text-[14px] font-medium leading-[24px] tracking-[0.4536px] text-black">{cartPlan.title}</p>
              <p className="w-full font-inter text-[14px] font-medium leading-[24px] tracking-[0.4536px] text-[#808080]">
                ₹{cartPlan.subAmount} {cartPlan.subPeriod[0]} {cartPlan.subPeriod[1]}
              </p>
            </div>
            <Chip text="Active" variant="success" />
          </div>
          <div className="w-full">
            <TintedButton>Manage Subscription</TintedButton>
          </div>
        </>
      ) : (
        <p className={EMPTY_ROW_CLS}>No active subscription yet.</p>
      )}
    </SectionCard>
  );
}

// ─── Orders ──────────────────────────────────────────────────────────────────

function OrdersCard({ cartPlan }: { cartPlan: CartPlan }) {
  const rows = cartPlan
    ? [
        { key: 'device', title: 'TakeCare Tablet Dispenser', sub: '₹1,599 · One-time' },
        { key: 'plan', title: cartPlan.title, sub: `₹${cartPlan.subAmount} ${cartPlan.subPeriod[0]} ${cartPlan.subPeriod[1]}` },
      ]
    : [];

  return (
    <SectionCard
      title="Orders"
      actions={
        <div className="flex items-center gap-3">
          <GhostButton className="h-10 rounded-full p-2">History</GhostButton>
          <TintedButton>
            Filter by
            <IconSlot src={iconFilter} width={20} height={20} />
          </TintedButton>
        </div>
      }
    >
      {rows.length ? (
        rows.map((row, i) => (
          <Fragment key={row.key}>
            {i > 0 && <Divider />}
            <div className="flex w-full shrink-0 flex-col items-start gap-3">
              <p className="w-full font-inter text-[14px] font-medium leading-[24px] tracking-[0.4536px] text-black">{row.title}</p>
              <p className="w-full font-inter text-[14px] font-medium leading-[24px] tracking-[0.4536px] text-[#808080]">{row.sub}</p>
              <Chip text="Order Confirmed" variant="detail" />
            </div>
          </Fragment>
        ))
      ) : (
        <p className={EMPTY_ROW_CLS}>No orders yet.</p>
      )}
    </SectionCard>
  );
}

// ─── Notifications ───────────────────────────────────────────────────────────

function NotificationsCard() {
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
          <div className="flex w-full shrink-0 items-center gap-6">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <IconGreenBadge icon={row.icon} width={row.iw} height={row.ih} />
              <p className="whitespace-nowrap font-inter text-[14px] font-medium leading-[24px] tracking-[0.4536px] text-black">
                {row.label}
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
  return (
    <SectionCard title="General" headerFixedHeight footer="Your email activates your Take Care Subscription. Changing it affects your login.">
      <div className="flex w-full shrink-0 items-center gap-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <IconGreenBadge icon={iconLanguage} width={16.9} height={14.4} />
          <p className="whitespace-nowrap font-inter text-[14px] font-medium leading-[24px] tracking-[0.4536px] text-[#808080]">Language</p>
        </div>
        <div className="flex items-center gap-3">
          <p className="whitespace-nowrap font-inter text-[14px] font-medium leading-[24px] tracking-[0.4536px] text-black">English</p>
          <IconChevronButton />
        </div>
      </div>
      <Divider />
      <div className="flex w-full shrink-0 items-center gap-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <IconGreenBadge icon={iconShieldCheck} width={18} height={19.8} />
          <p className="whitespace-nowrap font-inter text-[14px] font-medium leading-[24px] tracking-[0.4536px] text-[#808080]">Privacy &amp; data</p>
        </div>
        <IconChevronButton />
      </div>
    </SectionCard>
  );
}

// ─── Title + breadcrumb ──────────────────────────────────────────────────────

function TitleBreadcrumb({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex w-full shrink-0 flex-col items-start gap-3">
      <h1 className="font-inter text-[32px] font-bold leading-normal text-black">Profile</h1>
      <div className="flex items-center gap-1 bg-[#f9f9f9]">
        <button type="button" onClick={onBack} className="font-inter text-[12px] font-medium leading-[20px] tracking-[0.3883px] text-[#999999]">
          TakeCare
        </button>
        <IconSlot src={iconBreadcrumbChevron} width={4.445} height={7.778} />
        <span className="font-inter text-[12px] font-medium leading-[20px] tracking-[0.3883px] text-black">Profile</span>
      </div>
    </div>
  );
}

// ─── Root ────────────────────────────────────────────────────────────────────

export default function ProfileDashboardMobile({
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
  return (
    <div className="flex w-full flex-col items-start gap-12 bg-white px-6 py-12" style={{ boxSizing: 'border-box' }}>
      <TitleBreadcrumb onBack={onBack} />
      <AvatarWelcomeRow formData={formData} />
      <ABHACard />
      <PersonalInfoCard formData={formData} />
      <AddressesCard formData={formData} />
      <ContactCard formData={formData} />
      <SubscriptionCard cartPlan={cartPlan} />
      <OrdersCard cartPlan={cartPlan} />
      <NotificationsCard />
      <GeneralCard />
      <LogoutButton onClick={onLogout} />
    </div>
  );
}
