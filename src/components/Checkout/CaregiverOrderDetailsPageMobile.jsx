import CheckoutStepperMobile from './CheckoutStepperMobile';
import PrimaryButton from '../common/PrimaryButton';
import { DeliveryVanIcon, LocationIcon, PhoneCallIcon } from './OrderDetailsPage';
import { UserIcon, DetailsCard } from './GiftSummaryPageMobile';
import { useContent } from '../../context/ContentContext';

/*
  Mobile "Check order Details" — Figma node 14026:21701, reached from
  GiftPageMobile's "No, it's not" option. Same content/data mapping as the
  desktop CaregiverOrderDetailsPage: no gift card visual, just the two
  details cards (Will be Delivered to / Caregiver) + Done.
*/

const FONT = 'Inter, sans-serif';

const DOT_GRID_BG = {
  backgroundImage: 'radial-gradient(circle, #e5e5e5 1px, transparent 1px)',
  backgroundSize: '24px 24px',
};

export default function CaregiverOrderDetailsPageMobile({ shippingInfo, personDetails, isCaregiver, isOpen, onDone }) {
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
            {review.plain_heading}
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
        </div>
      </div>
    </div>
  );
}
