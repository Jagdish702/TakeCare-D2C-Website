import CheckoutStepperMobile from './CheckoutStepperMobile';
import PrimaryButton from '../common/PrimaryButton';

/*
  Mobile "Check order Details" — Figma node 14026:21829. Same content/
  behaviour as the desktop OrderDetailsPage — reuses CheckoutStepperMobile
  (currentStep=1) and PrimaryButton for "Done", real shippingInfo +
  careForSelection instead of Figma's placeholder example.
*/

const FONT = 'Inter, sans-serif';
const BRAND_BLUE = '#004172';

const AVATAR_SRC = {
  me: '/assets/checkout/avatar-me.png',
  'someone-else': '/assets/checkout/avatar-someone-else.png',
};

const DOT_GRID_BG = {
  backgroundImage: 'radial-gradient(circle, #e5e5e5 1px, transparent 1px)',
  backgroundSize: '24px 24px',
};

function DeliveryVanIcon() {
  return (
    <svg width="24" height="16.5" viewBox="0 0 24 16.5" fill="none">
      <path
        d="M0.75 0C0.335786 0 0 0.335786 0 0.75C0 1.16421 0.335786 1.5 0.75 1.5H13.25C13.8023 1.5 14.25 1.94772 14.25 2.5V11.75C14.25 12.3023 13.8023 12.75 13.25 12.75H9.633C9.2985 11.4607 8.139 10.5 6.75 10.5C5.361 10.5 4.2015 11.4607 3.867 12.75C3.38817 12.75 3 12.3618 3 11.883V9.75C3 9.33579 2.66421 9 2.25 9C1.83579 9 1.5 9.33579 1.5 9.75V12.25C1.5 13.3546 2.39543 14.25 3.5 14.25H3.867C4.2015 15.5393 5.361 16.5 6.75 16.5C8.139 16.5 9.2985 15.5393 9.633 14.25H15.867C16.2015 15.5393 17.361 16.5 18.75 16.5C20.139 16.5 21.2985 15.5393 21.633 14.25C22.9403 14.25 24 13.1903 24 11.883V8.25987C24 8.17607 23.984 8.09303 23.9528 8.01525L23.1988 5.74122C22.6563 4.10472 21.1262 3 19.4021 3H16.75C16.1977 3 15.75 2.55228 15.75 2C15.75 0.895431 14.8546 0 13.75 0H0.75ZM1.5 3C1.08579 3 0.75 3.33579 0.75 3.75C0.75 4.16421 1.08579 4.5 1.5 4.5H6.75C7.16421 4.5 7.5 4.16421 7.5 3.75C7.5 3.33579 7.16421 3 6.75 3H1.5ZM15.75 5.5C15.75 4.94772 16.1977 4.5 16.75 4.5H19.7721C20.6316 4.5 21.3949 5.04913 21.6683 5.86399L22.4481 8.18899C22.4825 8.29148 22.5 8.39888 22.5 8.50699V11.883C22.5 12.3618 22.1118 12.75 21.633 12.75C21.2985 11.4607 20.139 10.5 18.75 10.5C17.3788 10.5 16.2312 11.4363 15.8803 12.7006C15.8722 12.7296 15.846 12.75 15.816 12.75C15.7795 12.75 15.75 12.7205 15.75 12.684V5.5ZM2.25 6C1.83579 6 1.5 6.33579 1.5 6.75C1.5 7.16421 1.83579 7.5 2.25 7.5H5.25C5.66421 7.5 6 7.16421 6 6.75C6 6.33579 5.66421 6 5.25 6H2.25ZM6.75 12C7.58775 12 8.25 12.6623 8.25 13.5C8.25 14.3377 7.58775 15 6.75 15C5.91225 15 5.25 14.3377 5.25 13.5C5.25 12.6623 5.91225 12 6.75 12ZM18.75 12C19.5877 12 20.25 12.6623 20.25 13.5C20.25 14.3377 19.5877 15 18.75 15C17.9123 15 17.25 14.3377 17.25 13.5C17.25 12.6623 17.9123 12 18.75 12Z"
        fill={BRAND_BLUE}
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="13.3333" height="16" viewBox="0 0 13.3333 16" fill="none">
      <path
        d="M12.6667 6.66667C12.6667 11.3333 6.66667 15.3333 6.66667 15.3333C6.66667 15.3333 0.666667 11.3333 0.666667 6.66667C0.666667 5.07537 1.29881 3.54924 2.42403 2.42403C3.54924 1.29881 5.07537 0.666667 6.66667 0.666667C8.25797 0.666667 9.78409 1.29881 10.9093 2.42403C12.0345 3.54924 12.6667 5.07537 12.6667 6.66667Z"
        stroke={BRAND_BLUE}
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.66667 8.66667C7.77124 8.66667 8.66667 7.77124 8.66667 6.66667C8.66667 5.5621 7.77124 4.66667 6.66667 4.66667C5.5621 4.66667 4.66667 5.5621 4.66667 6.66667C4.66667 7.77124 5.5621 8.66667 6.66667 8.66667Z"
        stroke={BRAND_BLUE}
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneCallIcon() {
  return (
    <svg width="17.8001" height="17.8307" viewBox="0 0 17.8001 17.8307" fill="none">
      <path
        d="M10.8104 3.96402C11.5586 4.10999 12.2462 4.4759 12.7852 5.01491C13.3242 5.55391 13.6901 6.2415 13.8361 6.98967M10.8104 0.900079C12.3648 1.07276 13.8143 1.76884 14.9209 2.87403C16.0275 3.97922 16.7254 5.42783 16.9 6.98201M16.134 13.0946V15.3925C16.1349 15.6059 16.0912 15.817 16.0057 16.0125C15.9203 16.2079 15.7949 16.3834 15.6377 16.5276C15.4805 16.6718 15.2949 16.7816 15.0928 16.85C14.8908 16.9183 14.6766 16.9437 14.4642 16.9245C12.1071 16.6684 9.84297 15.863 7.85371 14.5729C6.00295 13.3969 4.43384 11.8278 3.25779 9.97701C1.96326 7.97871 1.15765 5.70357 0.906217 3.33591C0.887076 3.12409 0.912249 2.91061 0.980135 2.70905C1.04802 2.50749 1.15713 2.32228 1.30052 2.1652C1.44391 2.00812 1.61843 1.88262 1.81298 1.79668C2.00753 1.71075 2.21785 1.66627 2.43053 1.66607H4.72849C5.10022 1.66241 5.46061 1.79404 5.74247 2.03644C6.02433 2.27884 6.20843 2.61546 6.26046 2.98356C6.35745 3.71896 6.53732 4.44102 6.79665 5.13598C6.89971 5.41015 6.92201 5.70811 6.86092 5.99456C6.79983 6.28101 6.6579 6.54395 6.45195 6.75221L5.47915 7.72501C6.56958 9.64269 8.15739 11.2305 10.0751 12.3209L11.0479 11.3481C11.2561 11.1422 11.5191 11.0003 11.8055 10.9392C12.092 10.8781 12.3899 10.9004 12.6641 11.0034C13.3591 11.2628 14.0811 11.4426 14.8165 11.5396C15.1886 11.5921 15.5284 11.7795 15.7713 12.0662C16.0143 12.3529 16.1433 12.7189 16.134 13.0946Z"
        stroke={BRAND_BLUE}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function OrderDetailsPageMobile({ shippingInfo, careForSelection, isOpen, onDone }) {
  if (!isOpen) return null;

  const recipientName = shippingInfo ? `${shippingInfo.firstName} ${shippingInfo.lastName}`.trim() : 'Rohit Mehra';
  const addressLine = shippingInfo
    ? [shippingInfo.address1, shippingInfo.city, shippingInfo.state, shippingInfo.pincode, shippingInfo.country].filter(Boolean).join(', ')
    : 'Flat 402, Royal Palms, Sector 56, Gurgaon, Haryana - 122011';
  const phoneLine = shippingInfo?.phone ? `+91 ${shippingInfo.phone}` : '+91 98765 43210';
  const avatarSrc = AVATAR_SRC[careForSelection] || AVATAR_SRC.me;

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
            Check order Details
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start', padding: 16, borderRadius: 16, width: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', width: '100%' }}>
              <img src={avatarSrc} alt="" draggable={false} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              <p style={{ margin: 0, flex: '1 0 0', minWidth: 0, fontFamily: FONT, fontWeight: 700, fontSize: 16, color: '#000' }}>Will be Delivered to</p>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <DeliveryVanIcon />
              <p style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 15, color: '#000', whiteSpace: 'nowrap' }}>{recipientName}</p>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', width: '100%' }}>
              <LocationIcon />
              <p style={{ margin: 0, flex: '1 0 0', minWidth: 0, fontFamily: FONT, fontWeight: 400, fontSize: 14, color: '#000' }}>{addressLine}</p>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', width: '100%' }}>
              <PhoneCallIcon />
              <p style={{ margin: 0, flex: '1 0 0', minWidth: 0, fontFamily: FONT, fontWeight: 500, fontSize: 14, color: '#000' }}>{phoneLine}</p>
            </div>
          </div>

          <PrimaryButton fullWidth onClick={onDone}>Done</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
