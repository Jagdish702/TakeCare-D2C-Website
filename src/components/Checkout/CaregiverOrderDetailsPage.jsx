import CheckoutStepper from './CheckoutStepper';
import PrimaryButton from '../common/PrimaryButton';
import { DeliveryVanIcon, LocationIcon, PhoneCallIcon } from './OrderDetailsPage';
import { UserIcon, DetailsCard } from './GiftSummaryPage';

/*
  "Check order Details" — Figma node 14019:18843, reached from GiftPage's
  "No, it's not" option (the "someone else" + not-a-gift path — the "Yes,
  It's a gift" option leads to GiftSummaryPage instead). Same content
  mapping as GiftSummaryPage: "Will be Delivered to" comes from the other
  person's details (personDetails), "Caregiver" comes from the account
  holder's own details (shippingInfo). No gift card visual here.
*/

const HEADER_H = 52;
const FONT = 'Inter, sans-serif';

const DOT_GRID_BG = {
  backgroundImage: 'radial-gradient(circle, #e5e5e5 1px, transparent 1px)',
  backgroundSize: '24px 24px',
};

export default function CaregiverOrderDetailsPage({ shippingInfo, personDetails, isCaregiver, isOpen, onDone }) {
  if (!isOpen) return null;

  // Figma node 14027:26492: when the account holder declined to be the
  // caregiver, this review screen drops the "Caregiver" card entirely.
  const showCaregiverCard = isCaregiver !== false;

  const giverName = shippingInfo ? `${shippingInfo.firstName} ${shippingInfo.lastName}`.trim() : 'Krishna Mehra';
  const giverPhone = shippingInfo?.phone ? `+91 ${shippingInfo.phone}` : '+91 98765 43210';
  const recipientName = personDetails?.fullName?.trim() ? `Mr. ${personDetails.fullName.trim()}` : 'Mr. Rohit Mehra';
  const recipientAddress = personDetails
    ? [personDetails.address1, personDetails.city, personDetails.state, personDetails.pincode, personDetails.country].filter(Boolean).join(', ')
    : 'Flat 402, Royal Palms, Sector 56, Gurgaon, Haryana - 122011';
  const recipientPhone = personDetails?.phone ? `+91 ${personDetails.phone}` : '+91 98765 43210';

  return (
    <div style={{ position: 'fixed', top: HEADER_H, left: 0, right: 0, bottom: 0, background: '#f9f9f9', zIndex: 1200, overflowY: 'auto' }}>
      <div style={{ width: '100%', maxWidth: 1800, margin: '0 auto', padding: 'clamp(24px, 6vw, 120px)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 60, alignItems: 'flex-start' }}>
        <CheckoutStepper currentStep={1} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'flex-start', width: '100%' }}>
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
              justifyContent: 'center',
              padding: '220px 240px',
              borderRadius: 40,
              background: '#fff',
              boxSizing: 'border-box',
              ...DOT_GRID_BG,
            }}
          >
            <div style={{ width: 400, maxWidth: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 48, padding: 32, borderRadius: 24, boxSizing: 'border-box' }}>
              <p style={{ margin: 0, width: '100%', fontFamily: FONT, fontWeight: 500, fontSize: 32, color: '#000', lineHeight: 1.3, letterSpacing: '-0.32px', textAlign: 'center' }}>
                Check order Details
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start', width: 271 }}>
                <DetailsCard
                  title="Will be Delivered to"
                  avatarSrc="/assets/checkout/avatar-someone-else.png"
                  icon={<DeliveryVanIcon />}
                  primaryLine={recipientName}
                  primaryLineSize={15}
                  address={recipientAddress}
                  phone={recipientPhone}
                />
                {showCaregiverCard && (
                  <DetailsCard
                    title="Caregiver"
                    avatarSrc="/assets/checkout/avatar-me.png"
                    icon={<UserIcon />}
                    primaryLine={giverName}
                    phone={giverPhone}
                  />
                )}
              </div>

              <PrimaryButton fullWidth onClick={onDone}>Done</PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
