import CheckoutStepperMobile from './CheckoutStepperMobile';
import PrimaryButton from '../common/PrimaryButton';
import { DeliveryVanIcon, LocationIcon, PhoneCallIcon } from './OrderDetailsPage';
import { useContent } from '../../context/ContentContext';

/*
  Mobile "Dispenser will be delivered with this gift card" — Figma node
  14024:21609. Same content/behaviour and data mapping as the desktop
  GiftSummaryPage. Note Figma's mobile layout order is Details cards →
  Done button → gift card visual (the gift card sits *below* Done here,
  unlike desktop's side-by-side layout) — reproduced as-is.
*/

const FONT = 'Inter, sans-serif';

const DOT_GRID_BG = {
  backgroundImage: 'radial-gradient(circle, #e5e5e5 1px, transparent 1px)',
  backgroundSize: '24px 24px',
};

const GIFT_CARD_GRADIENT = 'linear-gradient(135deg, #ff5f6d 0%, #ffc371 22%, #f6d365 38%, #7bdc8f 56%, #4facfe 76%, #a18cd1 100%)';

export function UserIcon() {
  return (
    <svg width="15.8" height="17.55" viewBox="0 0 15.8 17.55" fill="none" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,65,114,0.08))' }}>
      <path
        d="M14.9 16.65V14.9C14.9 13.9717 14.5312 13.0815 13.8749 12.4251C13.2185 11.7688 12.3283 11.4 11.4 11.4H4.4C3.47174 11.4 2.5815 11.7688 1.92513 12.4251C1.26875 13.0815 0.9 13.9717 0.9 14.9V16.65M11.4 4.4C11.4 6.333 9.833 7.9 7.9 7.9C5.967 7.9 4.4 6.333 4.4 4.4C4.4 2.467 5.967 0.9 7.9 0.9C9.833 0.9 11.4 2.467 11.4 4.4Z"
        stroke="#004172"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DetailsCard({ title, avatarSrc, icon, primaryLine, primaryLineSize = 18, address, phone }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start', padding: 16, borderRadius: 16, width: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', width: '100%' }}>
        <img src={avatarSrc} alt="" draggable={false} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
        <p style={{ margin: 0, flex: '1 0 0', minWidth: 0, fontFamily: FONT, fontWeight: 700, fontSize: 16, color: '#000' }}>{title}</p>
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {icon}
        <p style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: primaryLineSize, color: '#000', whiteSpace: 'nowrap' }}>{primaryLine}</p>
      </div>
      {address && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', width: '100%' }}>
          <LocationIcon />
          <p style={{ margin: 0, flex: '1 0 0', minWidth: 0, fontFamily: FONT, fontWeight: 400, fontSize: 14, color: '#000' }}>{address}</p>
        </div>
      )}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', width: '100%' }}>
        <PhoneCallIcon />
        <p style={{ margin: 0, flex: '1 0 0', minWidth: 0, fontFamily: FONT, fontWeight: 500, fontSize: 14, color: '#000' }}>{phone}</p>
      </div>
    </div>
  );
}

export default function GiftSummaryPageMobile({ shippingInfo, personDetails, isCaregiver, isOpen, onDone }) {
  const { checkout, images } = useContent();
  if (!isOpen) return null;

  const review = checkout.orderReview;
  const showCaregiverCard = isCaregiver !== false;

  const giverName = shippingInfo ? `${shippingInfo.firstName} ${shippingInfo.lastName}`.trim() : 'Krishna Mehra';
  const giverPhone = shippingInfo?.phone ? `+91 ${shippingInfo.phone}` : '+91 98765 43210';
  const recipientName = personDetails?.fullName?.trim() ? `Mr. ${personDetails.fullName.trim()}` : 'Mr. Rohit Mehra';
  const recipientAddress = personDetails
    ? [personDetails.address1, personDetails.city, personDetails.state, personDetails.pincode, personDetails.country].filter(Boolean).join(', ')
    : 'Flat 402, Royal Palms, Sector 56, Gurgaon, Haryana - 122011';
  const recipientPhone = personDetails?.phone ? `+91 ${personDetails.phone}` : '+91 98765 43210';

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#f9f9f9', zIndex: 1200, overflowY: 'auto' }}>
      <div style={{ width: '100%', padding: '48px 24px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'flex-start' }}>
        <CheckoutStepperMobile currentStep={1} />

        <div style={{ display: 'flex', width: '100%', height: 8, borderRadius: 24, overflow: 'hidden', background: '#e5e5e5' }}>
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} style={{ flex: '1 0 0', minWidth: 0, height: 8, background: 'linear-gradient(180deg, #10b981 0%, #00664c 100%)' }} />
          ))}
        </div>

        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
            padding: '40px 24px',
            borderRadius: 40,
            background: '#fff',
            boxSizing: 'border-box',
            ...DOT_GRID_BG,
          }}
        >
          <p style={{ margin: 0, width: '100%', fontFamily: FONT, fontWeight: 500, fontSize: 24, color: '#000', lineHeight: '32px', textAlign: 'center' }}>
            {review.gift_heading}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start', width: '100%' }}>
            <DetailsCard
              title={review.delivered_to_label}
              avatarSrc={images['checkout-avatar-someone-else']}
              icon={<DeliveryVanIcon />}
              primaryLine={recipientName}
              primaryLineSize={15}
              address={recipientAddress}
              phone={recipientPhone}
            />
            {showCaregiverCard && (
              <DetailsCard
                title={review.caregiver_label}
                avatarSrc={images['checkout-avatar-me']}
                icon={<UserIcon />}
                primaryLine={giverName}
                phone={giverPhone}
              />
            )}
          </div>

          <PrimaryButton fullWidth onClick={onDone}>{review.done_label}</PrimaryButton>

          {/* Gift card visual — Figma places this below the Done button on mobile */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 19,
              padding: '32px 24px',
              borderRadius: 32,
              background: GIFT_CARD_GRADIENT,
              boxSizing: 'border-box',
            }}
          >
            <p style={{ margin: 0, width: '100%', fontFamily: "'Kalnia', serif", fontWeight: 600, fontSize: 24, color: '#fff', lineHeight: 1.3, letterSpacing: '-0.24px', textAlign: 'center' }}>
              {review.gift_card_welcome_line1}
              <br />
              {review.gift_card_welcome_line2}
            </p>
            <img src={images['checkout-gift-card-device']} alt="" draggable={false} style={{ width: 95.484, height: 156.468, objectFit: 'cover', flexShrink: 0 }} />
            <p style={{ margin: 0, width: '100%', fontFamily: "'Kalam', cursive", fontWeight: 400, fontSize: 18, color: '#fff', letterSpacing: '0.5825px', lineHeight: '22.28px', textAlign: 'center' }}>
              {review.gift_card_from_label}
              <br />
              {giverName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
