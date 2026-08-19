import { useEffect, useRef, useState } from 'react';
import CheckoutStepperMobile from './CheckoutStepperMobile';
import DisclaimerCard from '../Subscription/DisclaimerCard';
import AvailDiscounts from './AvailDiscounts';
import RadioIcon from './RadioIcon';
import PrimaryButton from '../common/PrimaryButton';
import StatusCard from './StatusCard';
import { PAYMENT_ICONS, ICON_SRC, ICON_SIZE, CashIcon, AlertCircleIcon, getCaregiverPatientNames } from './PaymentPage';
import { useContent } from '../../context/ContentContext';

/*
  Mobile "Payment" — Figma node 12185:6450, the third/final checkout step.
  Reuses PAYMENT_ICONS/ICON_SRC/ICON_SIZE/CashIcon/AlertCircleIcon from the
  desktop PaymentPage (same payment-mode icon sets; labels/subtext now come
  from checkout.paymentOptions via useContent), DisclaimerCard and
  AvailDiscounts as-is — only the layout (single column, mobile type sizes)
  and the Contact/Shipping summary + price-breakdown blocks are rebuilt for
  mobile, matching CheckoutPageMobile's conventions.
*/

const FONT = 'Inter, sans-serif';

function Divider() {
  return <div style={{ width: '100%', height: 1, background: '#ccc', flexShrink: 0 }} />;
}

function ContactShippingCardMobile({ shippingInfo, personDetails, careForSelection, isCaregiver, onChange, payment }) {
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
    ? [personDetails.address1, personDetails.city, personDetails.state, personDetails.pincode, personDetails.country].filter(Boolean).join(', ')
    : shippingInfo
    ? [shippingInfo.address1, shippingInfo.city, shippingInfo.state, shippingInfo.pincode, shippingInfo.country].filter(Boolean).join(', ')
    : 'sdbcjsdb, Mumbai, Andaman and Nicobar Islands, 425404, India';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        <button type="button" onClick={onChange} style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', fontFamily: FONT, fontWeight: 500, fontSize: 16, color: '#004172', letterSpacing: '0.2592px' }}>
          {payment.change_label}
        </button>
      </div>
      <div style={{ width: '100%', background: '#fff', padding: 24, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          <p style={{ margin: 0, width: '100%', fontFamily: FONT, fontWeight: 700, fontSize: 16, color: '#000', letterSpacing: '0.5178px', lineHeight: '24px' }}>{payment.contact_label}</p>
          <p style={{ margin: 0, width: '100%', fontFamily: FONT, fontWeight: 300, fontSize: 14, color: '#000', letterSpacing: '0.4536px', lineHeight: '24px' }}>{contactLine}</p>
        </div>
        <Divider />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          <p style={{ margin: 0, width: '100%', fontFamily: FONT, fontWeight: 700, fontSize: 16, color: '#000', letterSpacing: '0.5178px', lineHeight: '24px' }}>{payment.shipping_address_label}</p>
          <p style={{ margin: 0, width: '100%', fontFamily: FONT, fontWeight: 300, fontSize: 14, color: '#000', letterSpacing: '0.4536px', lineHeight: '24px' }}>{addressLine}</p>
        </div>
        <p style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 12, color: '#999', letterSpacing: '0.3883px', lineHeight: 1.5, whiteSpace: 'nowrap' }}>
          {payment.address_note}
        </p>
      </div>
    </div>
  );
}

function PaymentOptionRowMobile({ option, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.key)}
      style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', textAlign: 'left' }}
    >
      <div style={{ display: 'flex', gap: 4, alignItems: 'flex-start', width: '100%', padding: 8, boxSizing: 'border-box' }}>
        <RadioIcon checked={selected} size={20} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: '1 0 0', minWidth: 0, paddingLeft: 8, paddingTop: 2, paddingBottom: 2 }}>
          <p style={{ margin: 0, width: '100%', fontFamily: FONT, fontWeight: 500, fontSize: 14, color: '#4d4d4d', letterSpacing: '0.4536px', lineHeight: '24px' }}>
            {option.label}
          </p>
          {option.subtext && (
            <p style={{ margin: 0, width: '100%', fontFamily: FONT, fontWeight: 500, fontSize: 12, color: '#999', letterSpacing: '0.3883px', lineHeight: 1.5 }}>
              {option.subtext}
            </p>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {option.icons[0] === 'cash' ? (
          <CashIcon />
        ) : (
          option.icons.map((icon) => (
            <img key={icon} src={ICON_SRC[icon]} alt="" draggable={false} style={{ width: ICON_SIZE[icon].width, height: ICON_SIZE[icon].height, objectFit: 'contain', flexShrink: 0 }} />
          ))
        )}
      </div>
    </button>
  );
}

function PriceRowMobile({ label, amount, bold }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between', height: 23 }}>
      <p style={{ margin: 0, flex: '1 0 0', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: FONT, fontWeight: bold ? 700 : 500, fontSize: 14, color: bold ? '#000' : '#808080', letterSpacing: '0.4536px', lineHeight: '24px', whiteSpace: 'nowrap' }}>
        {label}
      </p>
      <p style={{ margin: 0, flexShrink: 0, fontFamily: FONT, fontWeight: bold ? 700 : 500, fontSize: 14, color: bold ? '#000' : '#808080', letterSpacing: '0.4536px', lineHeight: '24px', whiteSpace: 'nowrap' }}>
        {amount}
      </p>
    </div>
  );
}

export default function PaymentPageMobile({ plan, shippingInfo, personDetails, careForSelection, isCaregiver, isOpen, onBack, onContinue }) {
  const { checkout, subscription } = useContent();
  const payment = checkout.payment;
  const section = checkout.section;
  const paymentModeOptions = [...checkout.paymentOptions]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((opt) => ({ key: opt.option_key, label: opt.label, subtext: opt.subtext, icons: PAYMENT_ICONS[opt.option_key] }));
  const [paymentMode, setPaymentMode] = useState('upi');

  // Demo payment-result flow — see the matching comment in PaymentPage.jsx.
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

  const isMonthly = plan.key === 'monthly';
  const dbPlan = subscription.plans.find((p) => p.plan_key === (isMonthly ? 'monthly' : 'yearly'));
  const planName = dbPlan.title;
  const product = subscription.cartProduct;
  const devicePrice = 1599;
  const subPrice = parseInt(String(plan.subAmount).replace(',', ''), 10);
  const subtotal = devicePrice + subPrice;
  const delivery = 49;
  const total = subtotal + delivery;

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#f9f9f9', zIndex: 1200, overflowY: 'auto' }}>
      <div style={{ width: '100%', padding: '48px 24px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 48, alignItems: 'flex-start' }}>
        <CheckoutStepperMobile currentStep={2} />

        <ContactShippingCardMobile shippingInfo={shippingInfo} personDetails={personDetails} careForSelection={careForSelection} isCaregiver={isCaregiver} onChange={onBack} payment={payment} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
            <p style={{ margin: 0, fontFamily: FONT, fontWeight: 700, fontSize: 16, color: '#808080', letterSpacing: '0.5178px', lineHeight: '24px' }}>
              {payment.payment_mode_heading}
            </p>
            <div style={{ width: '100%', background: '#fff', padding: 12, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {paymentModeOptions.map((option, i) => (
                <div key={option.key} style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
                  {i > 0 && <Divider />}
                  <PaymentOptionRowMobile option={option} selected={paymentMode === option.key} onSelect={setPaymentMode} />
                </div>
              ))}
            </div>
          </div>

          <DisclaimerCard iconNode={<AlertCircleIcon />}>
            <p style={{ margin: 0, width: '100%', fontFamily: FONT, fontWeight: 500, fontSize: 12, color: '#000', letterSpacing: '0.3883px', lineHeight: '20px' }}>{payment.disclaimer_title}</p>
            <p style={{ margin: 0, width: '100%', fontFamily: FONT, fontWeight: 500, fontSize: 12, color: '#999', letterSpacing: '0.3883px', lineHeight: '20px' }}>
              {payment.disclaimer_body}
            </p>
          </DisclaimerCard>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
          <DisclaimerCard icon="/assets/checkout/icon-delivery.svg">
            <p style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 12, color: '#000', letterSpacing: '0.3883px', lineHeight: '20px' }}>{section.delivery_label}</p>
            <p style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 12, color: '#999', letterSpacing: '0.3883px', lineHeight: '20px' }}>{section.delivery_estimate}</p>
          </DisclaimerCard>

          <div style={{ borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc', padding: '16px 0', width: '100%', boxSizing: 'border-box' }}>
            <AvailDiscounts />
          </div>

          <div style={{ background: '#f7f5f4', borderBottom: '1px solid #ccc', padding: 16, display: 'flex', flexDirection: 'column', gap: 12, boxSizing: 'border-box', width: '100%' }}>
            <PriceRowMobile label={product.name} amount={`₹${devicePrice.toLocaleString('en-IN')}`} />
            <PriceRowMobile label={planName} amount={`₹${subPrice}`} />
            <Divider />
            <PriceRowMobile label={section.subtotal_label} amount={`₹${subtotal.toLocaleString('en-IN')}`} />
            <PriceRowMobile label={section.delivery_charges_label} amount={`₹${delivery}`} />
            <Divider />
            <PriceRowMobile label={section.estimated_total_label} amount={`₹${total.toLocaleString('en-IN')}`} bold />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <img src={ICON_SRC.visa} alt="Visa" style={{ height: 18, width: 'auto', objectFit: 'contain' }} />
            <img src={ICON_SRC.mastercard} alt="Mastercard" style={{ height: 18, width: 'auto', objectFit: 'contain' }} />
            <img src={ICON_SRC.paypal} alt="PayPal" style={{ height: 18, width: 'auto', objectFit: 'contain' }} />
            <img src={ICON_SRC.upi} alt="UPI" style={{ height: 18, width: 'auto', objectFit: 'contain' }} />
            <CashIcon />
          </div>

          <PrimaryButton fullWidth onClick={handlePayNow}>{section.continue_payment_label}</PrimaryButton>
          <button
            onClick={onBack}
            style={{
              width: '100%', height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', background: 'transparent', borderRadius: 16, cursor: 'pointer',
              boxShadow: '0 2px 2px rgba(0,65,114,0.08)',
              fontFamily: FONT, fontWeight: 500, fontSize: 16, color: '#004172', letterSpacing: '0.2592px',
            }}
          >
            {section.back_label}
          </button>
        </div>
      </div>

      {statusVariant && (
        <div
          className="fixed inset-0 z-[1300] flex items-center justify-center overflow-y-auto p-4"
          style={{ background: 'rgba(0,0,0,0.32)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
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
