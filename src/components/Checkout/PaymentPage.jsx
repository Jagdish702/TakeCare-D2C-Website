import { useEffect, useRef, useState } from 'react';
import CheckoutStepper from './CheckoutStepper';
import CheckoutSummaryPanel from './CheckoutSummaryPanel';
import RadioIcon from './RadioIcon';
import StatusCard from './StatusCard';
import DisclaimerCard from '../Subscription/DisclaimerCard';
import { useContent } from '../../context/ContentContext';

/*
  "Payment" — Figma node 12185:4974 ("Step 5"), the third and final step of
  checkout. Right panel is the exact same shared CheckoutSummaryPanel used
  by CheckoutPage.jsx (Figma embeds the identical 700px panel on both
  steps) — only the left side (Contact/Shipping summary + Payment Mode
  picker + disclaimer) is new here.
*/

const HEADER_H = 52;
const FONT = 'Inter, sans-serif';

// Icon sets per payment option — not content-DB-backed (icons aren't part
// of the `checkout.paymentOptions` copy schema), keyed by `option_key` so
// they can be merged onto the DB-sourced label/subtext at render time.
export const PAYMENT_ICONS = {
  all: ['visa', 'mastercard', 'paypal', 'upi'],
  debit: ['visa', 'mastercard', 'paypal'],
  credit: ['visa', 'mastercard', 'paypal'],
  upi: ['upi-badge'],
  ewallet: ['visa', 'mastercard', 'paypal', 'upi'],
  netbanking: ['netbanking'],
};

export const ICON_SRC = {
  visa: '/assets/checkout/pay-visa.png',
  mastercard: '/assets/checkout/pay-mastercard.png',
  paypal: '/assets/checkout/pay-paypal.png',
  upi: '/assets/checkout/pay-upi.png',
  'upi-badge': '/assets/checkout/pay-upi-badge.png',
  netbanking: '/assets/checkout/pay-netbanking.png',
};

// Figma's per-icon sizes (image 107/108/109/111 — same assets/dims reused
// in CheckoutSummaryPanel's payment-logos row).
export const ICON_SIZE = {
  visa: { width: 40.091, height: 17.621 },
  mastercard: { width: 30.273, height: 18 },
  paypal: { width: 30.273, height: 18 },
  upi: { width: 41.727, height: 18 },
  'upi-badge': { width: 145, height: 28 },
  netbanking: { width: 30, height: 16 },
};

export function CashIcon() {
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
      <path d="M5 11H2C1.73478 11 1.48043 10.8946 1.29289 10.7071C1.10536 10.5196 1 10.2652 1 10V2C1 1.73478 1.10536 1.48043 1.29289 1.29289C1.48043 1.10536 1.73478 1 2 1H14C14.2652 1 14.5196 1.10536 14.7071 1.29289C14.8946 1.48043 15 1.73478 15 2V5" stroke="#808080" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 6C5 5.73478 5.10536 5.48043 5.29289 5.29289C5.48043 5.10536 5.73478 5 6 5H18C18.2652 5 18.5196 5.10536 18.7071 5.29289C18.8946 5.48043 19 5.73478 19 6V14C19 14.2652 18.8946 14.5196 18.7071 14.7071C18.5196 14.8946 18.2652 15 18 15H6C5.73478 15 5.48043 14.8946 5.29289 14.7071C5.10536 14.5196 5 14.2652 5 14V6Z" stroke="#808080" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 10C10 10.5304 10.2107 11.0391 10.5858 11.4142C10.9609 11.7893 11.4696 12 12 12C12.5304 12 13.0391 11.7893 13.4142 11.4142C13.7893 11.0391 14 10.5304 14 10C14 9.46957 13.7893 8.96086 13.4142 8.58579C13.0391 8.21071 12.5304 8 12 8C11.4696 8 10.9609 8.21071 10.5858 8.58579C10.2107 8.96086 10 9.46957 10 10Z" stroke="#808080" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Info-circle icon for the "No duplicate charges" disclaimer (Figma "Alert Circle").
export function AlertCircleIcon() {
  return (
    <svg width="14.6667" height="14.6667" viewBox="0 0 14.6667 14.6667" fill="none">
      <path
        d="M7.33333 4.66667V7.33333M7.33333 10H7.34M14 7.33333C14 11.0152 11.0152 14 7.33333 14C3.65143 14 0.666667 11.0152 0.666667 7.33333C0.666667 3.65143 3.65143 0.666667 7.33333 0.666667C11.0152 0.666667 14 3.65143 14 7.33333Z"
        stroke="#999999"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Divider() {
  return <div style={{ width: '100%', height: 1, background: '#ccc', flexShrink: 0 }} />;
}

// Shared by the Payment and Order Confirmation pages (desktop + mobile) for
// the "someone else" + caregiver path, where the Contact card / order cards
// need both the account holder's ("Caregiver") and the other person's
// ("Patient") names/phones instead of a single contact line.
export function getCaregiverPatientNames(shippingInfo, personDetails) {
  const giverName = shippingInfo ? `${shippingInfo.firstName} ${shippingInfo.lastName}`.trim() : 'Krishna Mehra';
  const giverPhone = shippingInfo?.phone ? `+91 ${shippingInfo.phone}` : '+91 98765 43210';
  const recipientName = personDetails?.fullName?.trim() || 'Rohit Mehra';
  const recipientPhone = personDetails?.phone ? `+91 ${personDetails.phone}` : '+91 98765 43210';
  return { giverName, giverPhone, recipientName, recipientPhone };
}

/* ── Contact + Shipping Address summary card — reads back whatever the
     user entered on the "User Details & shipping address" step; falls
     back to Figma's own placeholder example only if that step somehow
     hasn't run yet (shouldn't normally happen, since Payment is only
     reachable via that step's Continue button).

     For the "someone else" path, the Contact block and shipping address
     depend on whether the account holder agreed to be the caregiver
     (CaregiverConfirmPage):
       - agreed/undecided (Figma node 14019:18481): "Caregiver : {name} /
         (phone)" + "Patient : {name} / (phone)" four-line form.
       - declined (Figma node 14024:19116): "You : {name}, {phone}" +
         "Patient :{name}, {phone}" two-line form (no parens, no "Caregiver"
         label at all).
     Either way the shipping address shown is the recipient's
     (personDetails'), not the account holder's — matching
     CaregiverOrderDetailsPage/GiftSummaryPage's "Will be Delivered to"
     convention. ── */
function ContactShippingCard({ shippingInfo, personDetails, careForSelection, isCaregiver, onChange, payment }) {
  const isSomeoneElseOrder = careForSelection === 'someone-else' && !!personDetails;
  const { giverName, giverPhone, recipientName, recipientPhone } = getCaregiverPatientNames(shippingInfo, personDetails);

  const contactLine = !isSomeoneElseOrder ? (
    shippingInfo ? `${shippingInfo.firstName} ${shippingInfo.lastName}, +91 ${shippingInfo.phone}`.trim() : 'Nishant Jagtap, +91 9158074477'
  ) : isCaregiver === false ? (
    <>
      {`You : ${giverName}, ${giverPhone}`}
      <br />
      {`Patient :${recipientName}, ${recipientPhone}`}
    </>
  ) : (
    <>
      {`Caregiver : ${giverName} `}
      <br />
      {`(${giverPhone})`}
      <br />
      {`Patient : ${recipientName} `}
      <br />
      {`(${recipientPhone})`}
    </>
  );
  const addressLine = isSomeoneElseOrder
    ? [personDetails.address1, personDetails.city, personDetails.state, personDetails.pincode, personDetails.country]
        .filter(Boolean)
        .join(', ')
    : shippingInfo
    ? [shippingInfo.address1, shippingInfo.city, shippingInfo.state, shippingInfo.pincode, shippingInfo.country]
        .filter(Boolean)
        .join(', ')
    : 'sdbcjsdb, Mumbai, Andaman and Nicobar Islands, 425404, India';

  return (
    <div style={{ width: '100%', background: '#fff', borderRadius: 16, padding: 32, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', width: '100%' }}>
        <p style={{ margin: 0, flex: 1, minWidth: 0, fontFamily: FONT, fontWeight: 700, fontSize: 18, color: '#000', letterSpacing: '0.5825px', lineHeight: '28px' }}>
          {payment.contact_label}
        </p>
        <p style={{ margin: 0, flex: 1, minWidth: 0, fontFamily: FONT, fontWeight: 300, fontSize: 16, color: '#000', letterSpacing: '0.5184px', lineHeight: '28px' }}>
          {contactLine}
        </p>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onChange} style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', boxShadow: '0 2px 2px rgba(0,65,114,0.08)', fontFamily: FONT, fontWeight: 500, fontSize: 16, color: '#004172', letterSpacing: '0.2592px' }}>
            {payment.change_label}
          </button>
        </div>
      </div>

      <Divider />

      <div style={{ display: 'flex', width: '100%' }}>
        <p style={{ margin: 0, flex: 1, minWidth: 0, fontFamily: FONT, fontWeight: 700, fontSize: 18, color: '#000', letterSpacing: '0.5825px', lineHeight: '28px' }}>
          {payment.shipping_address_label}
        </p>
        <p style={{ margin: 0, flex: 1, minWidth: 0, fontFamily: FONT, fontWeight: 300, fontSize: 16, color: '#000', letterSpacing: '0.5184px', lineHeight: '28px' }}>
          {addressLine}
        </p>
        <div style={{ flex: 1, minWidth: 0 }} />
      </div>

      <p style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 12, color: '#999', letterSpacing: '0.3883px', lineHeight: '20px' }}>
        {payment.address_note}
      </p>
    </div>
  );
}

/* ── One payment-mode row ── */
function PaymentOptionRow({ option, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.key)}
      style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%', border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', textAlign: 'left' }}
    >
      <div style={{ display: 'flex', gap: 4, alignItems: 'flex-start', flex: '1 0 0', minWidth: 0, padding: 8, borderRadius: 12, boxSizing: 'border-box' }}>
        <RadioIcon checked={selected} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: '1 0 0', minWidth: 0, paddingLeft: 8, paddingTop: 2, paddingBottom: 2 }}>
          <p style={{ margin: 0, width: '100%', fontFamily: FONT, fontWeight: 500, fontSize: 16, color: '#4d4d4d', letterSpacing: '0.5184px', lineHeight: '28px' }}>
            {option.label}
          </p>
          {option.subtext && (
            <p style={{ margin: 0, width: '100%', fontFamily: FONT, fontWeight: 500, fontSize: 12, color: '#999', letterSpacing: '0.3883px', lineHeight: '20px' }}>
              {option.subtext}
            </p>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        {option.icons[0] === 'cash' ? (
          <CashIcon />
        ) : (
          option.icons.map((icon) => (
            <img
              key={icon}
              src={ICON_SRC[icon]}
              alt=""
              draggable={false}
              style={{ width: ICON_SIZE[icon].width, height: ICON_SIZE[icon].height, objectFit: 'contain', flexShrink: 0 }}
            />
          ))
        )}
      </div>
    </button>
  );
}

export default function PaymentPage({ plan, shippingInfo, personDetails, careForSelection, isCaregiver, isOpen, onBack, onContinue }) {
  const { checkout } = useContent();
  const payment = checkout.payment;
  const paymentModeOptions = [...checkout.paymentOptions]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((opt) => ({ key: opt.option_key, label: opt.label, subtext: opt.subtext, icons: PAYMENT_ICONS[opt.option_key] }));
  const [paymentMode, setPaymentMode] = useState('upi');

  // Demo payment-result flow (no real backend/gateway exists) — "Pay Now"
  // shows the "in progress" Status Card, then settles on "successful" after
  // a short simulated wait; "Check status" on that card skips the wait.
  const [statusVariant, setStatusVariant] = useState(null);
  const successTimer = useRef(null);
  useEffect(() => () => clearTimeout(successTimer.current), []);

  const handlePayNow = () => {
    setStatusVariant('payment_in_progress');
    successTimer.current = setTimeout(() => setStatusVariant('payment_successful'), 2500);
  };
  const handleCheckStatus = () => {
    clearTimeout(successTimer.current);
    setStatusVariant('payment_successful');
  };
  const closeStatus = () => setStatusVariant(null);

  if (!isOpen || !plan) return null;

  return (
    <div style={{ position: 'fixed', top: HEADER_H, left: 0, right: 0, bottom: 0, background: '#f9f9f9', zIndex: 1200, overflowY: 'auto' }}>
      <div style={{ width: '100%', maxWidth: 1800, margin: '0 auto', padding: 'clamp(24px, 6vw, 120px)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 60, alignItems: 'flex-start' }}>
        <CheckoutStepper currentStep={2} />

        {/* Columns stay side by side at every viewport width (never
            wrap/stack); each shrinks proportionally via flex-basis instead
            of a hard fixed width — see the matching comment in
            CheckoutPage.jsx for why silent horizontal clipping (not a
            scrollbar) is what happens here without it. */}
        <div style={{ display: 'flex', gap: 60, alignItems: 'flex-start', width: '100%' }}>
          {/* ── Left panel: Contact/Shipping summary + Payment Mode ── */}
          <div style={{ flex: '1 1 800px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 60, width: '100%' }}>
              <ContactShippingCard shippingInfo={shippingInfo} personDetails={personDetails} careForSelection={careForSelection} isCaregiver={isCaregiver} onChange={onBack} payment={payment} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
                <p style={{ margin: 0, fontFamily: FONT, fontWeight: 700, fontSize: 18, color: '#808080', letterSpacing: '0.5825px', lineHeight: '28px' }}>
                  {payment.payment_mode_heading}
                </p>
                <div style={{ width: '100%', background: '#fff', borderRadius: 16, padding: 32, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {paymentModeOptions.map((option, i) => (
                    <div key={option.key} style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
                      {i > 0 && <Divider />}
                      <PaymentOptionRow option={option} selected={paymentMode === option.key} onSelect={setPaymentMode} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DisclaimerCard iconNode={<AlertCircleIcon />}>
              <p style={{ margin: 0, width: '100%', fontFamily: FONT, fontWeight: 500, fontSize: 12, color: '#000', letterSpacing: '0.3883px', lineHeight: '20px' }}>
                {payment.disclaimer_title}
              </p>
              <p style={{ margin: 0, width: '100%', fontFamily: FONT, fontWeight: 500, fontSize: 12, color: '#999', letterSpacing: '0.3883px', lineHeight: '20px' }}>
                {payment.disclaimer_body}
              </p>
            </DisclaimerCard>
          </div>

          {/* ── Right panel: Summary & payment (shared across checkout steps) ── */}
          <CheckoutSummaryPanel plan={plan} onBack={onBack} onContinue={handlePayNow} />
        </div>
      </div>

      {statusVariant && (
        <div
          className="fixed inset-x-0 bottom-0 z-[1300] flex items-center justify-center overflow-y-auto p-4 md:p-12"
          style={{ top: HEADER_H, background: 'rgba(0,0,0,0.32)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
        >
          <StatusCard
            variant={statusVariant}
            onPrimary={statusVariant === 'payment_in_progress' ? handleCheckStatus : () => { closeStatus(); onContinue?.(); }}
            onSecondary={closeStatus}
            onFooterClick={closeStatus}
          />
        </div>
      )}
    </div>
  );
}
