import { useState } from 'react';
import CheckoutStepper from './CheckoutStepper';
import DisclaimerCard from '../Subscription/DisclaimerCard';
import CartIcon from '../icons/CartIcon';
import { useContent } from '../../context/ContentContext';
import iconMail from '../../assets/status-card/icon-mail-footer.svg';
import iconVerifyCheck from '../../assets/profile-modal/icon-verify-check.svg';
import qrChipImg from '../../assets/figma-hero/qr-chip.png';
import { getCaregiverPatientNames } from './PaymentPage';

/*
  "Order Confirmation" — Figma node 12185:5206 ("Step 6"), shown after the
  Payment step's demo "payment_successful" Status Card — its "View Order"
  button lands here instead of the previous no-op (see App.tsx's
  `checkoutStep === 'confirmation'`).

  Copy comes from the `order_confirmation_content` DB table via
  useContent() (`checkout.orderConfirmation`), matching the rest of this
  app's convention — icons/images stay in code (no icon anywhere in this
  schema is DB-driven). `starts_from_prefix` and `order_sent_prefix` are
  sentence PREFIXES, not full sentences — the real email/phone (actual
  checkout-session data, not DB content) is appended after them below.

  No real order/subscription backend exists, so order number and the
  delivered-by/renews-on dates are generated once per page instance (lazy
  useState initializer, not recomputed on re-render) rather than faked as
  static copy — everything else (product, plan, email, address) is the
  real data the user picked/entered earlier in this same checkout session.

  Deviations from the raw Figma export:
    - The subscription card's thumbnail reuses the same object-fit:contain
      fix (not Figma's raw object-cover) applied to CartDrawer's product
      image earlier — same source photo, same crop bug otherwise.
    - Figma's placeholder shows a struck-through "regular price" on the
      subscription card (₹447 → ₹99); this app's plan data has no such
      "regular price" field, so showing one would be a fabricated number —
      omitted rather than invented.
    - The 100×100 success checkmark reuses the same fix as StatusCard.jsx's
      "payment_successful" badge (Figma's own instance was exported at a
      broken ~1px scale in this file too — a recurring authoring artifact,
      not a one-off).
*/

const HEADER_H = 52;
export const FONT = 'Inter, sans-serif';

export function SuccessCheck() {
  return (
    <div
      style={{
        width: 100,
        height: 100,
        borderRadius: 9999,
        background: '#34c759',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0px 2px 10px rgba(0,65,114,0.08), inset 0px 0px 2px rgba(0,65,114,0.12)',
        flexShrink: 0,
      }}
    >
      <img src={iconVerifyCheck} alt="" style={{ width: 42, height: 29, display: 'block' }} />
    </div>
  );
}

export function ChevronLeft() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 24, height: 24, flexShrink: 0, display: 'block' }}>
      <path d="M15 18l-6-6 6-6" stroke="#004172" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const rowStyle = { display: 'flex', gap: 8, fontFamily: FONT, fontWeight: 500, fontSize: 16, letterSpacing: '0.5184px', lineHeight: '28px', width: '100%' };
const rowLabelStyle = { margin: 0, color: '#808080', flexShrink: 0, whiteSpace: 'nowrap' };
const rowValueStyle = { margin: 0, color: '#000', flex: '1 0 0', minWidth: 0 };

/* ── Subscription-plan order card (Figma "added_in_cart_subscription_card") ── */
function SubscriptionOrderCard({ planLabel, price, startsFromLabel, startsFromText, renewsOnLabel, renewsOn, thumbnail }) {
  return (
    <div
      style={{
        position: 'relative', width: '100%', display: 'flex', gap: 8, alignItems: 'flex-start',
        padding: 8, borderRadius: 20, boxSizing: 'border-box', boxShadow: '0 4px 6px rgba(0,65,114,0.08)',
      }}
    >
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: '#fff', borderRadius: 20, pointerEvents: 'none' }} />
      <div
        style={{
          position: 'relative', width: 150.25, height: 150.25, borderRadius: 15, overflow: 'hidden', flexShrink: 0,
          background: 'radial-gradient(50% 50% at 50% 50%, #E8F1F8 0%, #fff 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12, boxSizing: 'border-box',
        }}
      >
        <img src={thumbnail} alt="" draggable={false} style={{ width: '100%', height: '100%', objectFit: 'contain', boxShadow: '1px 1px 12px 16px rgba(0,0,0,0.04)' }} />
      </div>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 24, flex: '1 0 0', minWidth: 0, alignSelf: 'stretch', paddingTop: 8, paddingLeft: 8, paddingRight: 8 }}>
        <p style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 18, color: '#000', letterSpacing: '0.5825px', lineHeight: '28px', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {planLabel}
        </p>
        <div style={rowStyle}>
          <p style={rowLabelStyle}>{startsFromLabel}</p>
          <p style={rowValueStyle}>{startsFromText}</p>
        </div>
        <div style={rowStyle}>
          <p style={rowLabelStyle}>{renewsOnLabel}</p>
          <p style={rowValueStyle}>{renewsOn}</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          <p style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 16, color: '#000', letterSpacing: '0.5184px', lineHeight: '28px' }}>{price}</p>
        </div>
      </div>
      <div aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', boxShadow: 'inset 0 0 2px 0 rgba(0,65,114,0.16)', pointerEvents: 'none' }} />
    </div>
  );
}

/* ── Product order card (Figma "added_in_cart_Prodcut_&_subscription_card") ── */
function ProductOrderCard({ heading, qtyLabel, price, deliveredByLabel, deliveredBy, deliveredAtLabel, deliveredAt, thumbnail }) {
  return (
    <div
      style={{
        position: 'relative', width: '100%', display: 'flex', gap: 8, alignItems: 'flex-start',
        padding: 8, borderRadius: 20, boxSizing: 'border-box', boxShadow: '0 4px 6px rgba(0,65,114,0.08)',
      }}
    >
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: '#fff', borderRadius: 20, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', width: 150.25, height: 150.25, borderRadius: 15, overflow: 'hidden', flexShrink: 0 }}>
        <img src={thumbnail} alt="" draggable={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }} />
        <div aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', boxShadow: 'inset 0 0 1.5px 0 rgba(0,65,114,0.24)', pointerEvents: 'none' }} />
      </div>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 24, flex: '1 0 0', minWidth: 0, alignSelf: 'stretch', paddingTop: 8, paddingLeft: 8, paddingRight: 8 }}>
        <p style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 18, color: '#000', letterSpacing: '0.5825px', lineHeight: '28px', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {heading}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 28, width: '100%', fontFamily: FONT, fontWeight: 500, fontSize: 16, letterSpacing: '0.5184px' }}>
            <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
              <span style={{ color: '#ccc' }}>{qtyLabel}</span>
              <span style={{ color: '#000' }}>1</span>
            </div>
            <p style={{ margin: 0, color: '#000' }}>{price}</p>
          </div>
          <div style={{ background: '#ccc', height: 1, width: '100%', borderRadius: 88 }} />
        </div>
        <div style={rowStyle}>
          <p style={rowLabelStyle}>{deliveredByLabel}</p>
          <p style={rowValueStyle}>{deliveredBy}</p>
        </div>
        <div style={rowStyle}>
          <p style={rowLabelStyle}>{deliveredAtLabel}</p>
          <p style={rowValueStyle}>{deliveredAt}</p>
        </div>
      </div>
      <div aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', boxShadow: 'inset 0 0 2px 0 rgba(0,65,114,0.16)', pointerEvents: 'none' }} />
    </div>
  );
}

// mm/dd → DD/MM/YYYY, Indian-convention date string used elsewhere in this app.
function formatDDMMYYYY(date) {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${date.getFullYear()}`;
}
function formatWeekdayDDMMYYYY(date) {
  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
  return `${weekday}, ${formatDDMMYYYY(date)}`;
}

// Demo order number + delivery/renewal dates — shared with
// OrderConfirmationPageMobile.jsx (same convention as PaymentPageMobile.jsx
// importing PAYMENT_ICONS etc. from the desktop PaymentPage.jsx) so both
// variants generate identical values from the same plan.
export function computeOrderMeta(plan) {
  const now = new Date();
  const deliveredBy = new Date(now);
  deliveredBy.setDate(deliveredBy.getDate() + 5);
  const renewsOn = new Date(now);
  if (plan?.key === 'yearly') renewsOn.setFullYear(renewsOn.getFullYear() + 1);
  else renewsOn.setMonth(renewsOn.getMonth() + 1);
  return {
    orderNumber: `CB-${now.getFullYear()}-${String(Math.floor(10000 + Math.random() * 90000))}`,
    deliveredBy: formatWeekdayDDMMYYYY(deliveredBy),
    renewsOn: formatDDMMYYYY(renewsOn),
  };
}

export default function OrderConfirmationPage({ plan, shippingInfo, personDetails, careForSelection, isCaregiver, isOpen, onBackToDashboard, onTrackOrder }) {
  const { subscription, checkout, images } = useContent();
  const product = subscription.cartProduct;
  const oc = checkout.orderConfirmation;

  // Generated once per page instance (lazy initializer), not on every re-render.
  const [orderMeta] = useState(() => computeOrderMeta(plan));

  if (!isOpen || !plan) return null;

  const planName = plan.key === 'yearly' ? 'Yearly' : 'Monthly';
  const email = shippingInfo?.email || '';
  const contactPhone = shippingInfo?.phone ? `+91 ${shippingInfo.phone}` : '';
  const addressLine = shippingInfo
    ? [shippingInfo.address1, shippingInfo.city, shippingInfo.state, shippingInfo.pincode, shippingInfo.country].filter(Boolean).join(', ')
    : '';

  // "Someone else" path (Figma nodes 14019:18599 agreed / 14024:19525
  // declined): the subscription card's "Starts from" line names the
  // account holder and the other person instead of just the account
  // holder's email, and the product card's "Delivered at" shows the
  // actual recipient (personDetails), not the account holder. Whether the
  // "Caregiver" line appears at all depends on CaregiverConfirmPage's
  // answer — declining it drops "Caregiver" and keeps only "Patient",
  // with "using" prefix wording changing from "you" to "patient".
  const isSomeoneElseOrder = careForSelection === 'someone-else' && !!personDetails;
  const { giverName, giverPhone, recipientName, recipientPhone } = getCaregiverPatientNames(shippingInfo, personDetails);

  const startsFromText = !isSomeoneElseOrder ? (
    `${oc.starts_from_prefix} ${email}.`
  ) : isCaregiver === false ? (
    <>
      Subscription will start once patient login the Take care app using
      <br />
      <span style={{ color: '#30956a' }}>Patient</span>{` : ${recipientName} (${recipientPhone})`}
    </>
  ) : (
    <>
      {oc.starts_from_prefix}
      <br />
      <span style={{ color: '#30956a' }}>Caregiver</span>{` : ${giverName} (${giverPhone})`}
      <br />
      <span style={{ color: '#30956a' }}>Patient</span>{` : ${recipientName} (${recipientPhone})`}
    </>
  );

  const deliveredAt = isSomeoneElseOrder
    ? [
        recipientName,
        recipientPhone,
        [personDetails.address1, personDetails.city, personDetails.state, personDetails.pincode, personDetails.country]
          .filter(Boolean)
          .join(', '),
      ]
        .filter(Boolean)
        .join(', ')
    : [shippingInfo && `${shippingInfo.firstName} ${shippingInfo.lastName}`.trim(), contactPhone, addressLine]
        .filter(Boolean)
        .join(', ');

  return (
    <div style={{ position: 'fixed', top: HEADER_H, left: 0, right: 0, bottom: 0, background: '#f9f9f9', zIndex: 1200, overflowY: 'auto' }}>
      <div style={{ width: '100%', maxWidth: 1800, margin: '0 auto', padding: 'clamp(24px, 6vw, 120px)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 60, alignItems: 'flex-start' }}>
        <CheckoutStepper currentStep={3} />

        {/* Columns stay side by side at every viewport width (never wrap/stack)
            — same "flex: 1 1 Npx" convention as CheckoutPage.jsx/PaymentPage.jsx's
            two-column rows: both sides shrink/grow together from their Figma
            widths (800 / 583) instead of one being rigid and the other wrapping. */}
        <div style={{ display: 'flex', gap: 60, alignItems: 'flex-start', justifyContent: 'center', width: '100%' }}>
          {/* ── Left column: success header + order cards ── */}
          <div style={{ flex: '1 1 800px', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 80 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <SuccessCheck />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, textAlign: 'center', width: '100%' }}>
                <p style={{ margin: 0, fontFamily: FONT, fontWeight: 600, fontSize: 32, color: '#00b82e' }}>{oc.heading}</p>
                <p style={{ margin: 0, fontFamily: FONT, fontWeight: 300, fontSize: 16, color: '#000', letterSpacing: '0.2592px', lineHeight: 1.2 }}>
                  {oc.subheading}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 48, width: '100%' }}>
              <SubscriptionOrderCard
                planLabel={`TakeCare ${planName} Plan`}
                price={`₹${plan.subAmount}`}
                startsFromLabel={oc.starts_from_label}
                startsFromText={startsFromText}
                renewsOnLabel={oc.renews_on_label}
                renewsOn={orderMeta.renewsOn}
                thumbnail={images['subscription-cart-mobile']}
              />
              <ProductOrderCard
                heading={product.name}
                qtyLabel={product.qty_label}
                price={product.price}
                deliveredByLabel={oc.delivered_by_label}
                deliveredBy={orderMeta.deliveredBy}
                deliveredAtLabel={oc.delivered_at_label}
                deliveredAt={deliveredAt}
                thumbnail={images['subscription-cart-device']}
              />
              <DisclaimerCard icon={iconMail}>
                <p style={{ margin: 0, width: '100%', fontFamily: FONT, fontWeight: 500, fontSize: 12, color: '#000', letterSpacing: '0.3883px', lineHeight: '20px' }}>
                  {oc.order_number_prefix}{orderMeta.orderNumber}
                </p>
                <p style={{ margin: 0, width: '100%', fontFamily: FONT, fontWeight: 500, fontSize: 12, color: '#999', letterSpacing: '0.3883px', lineHeight: '20px' }}>
                  {oc.order_sent_prefix} {email} and {contactPhone}
                </p>
              </DisclaimerCard>
            </div>
          </div>

          {/* ── Right column: QR + phone-in-hand promo, action buttons ── */}
          <div style={{ flex: '1 1 583px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 60, alignItems: 'flex-start' }}>
            <div
              style={{
                position: 'relative', width: '100%', height: 500, borderRadius: 48, padding: 48, boxSizing: 'border-box',
                display: 'flex', gap: 48, alignItems: 'center', justifyContent: 'center',
                background: '#fff', boxShadow: '0px 2px 10px rgba(0,65,114,0.08), inset 0px 0px 2px rgba(0,65,114,0.12)',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
                <img src={qrChipImg} alt="QR code to download the TakeCare app" style={{ width: 154, height: 145, objectFit: 'contain' }} />
                <p style={{ margin: 0, fontFamily: FONT, fontWeight: 700, fontSize: 14, color: '#000', letterSpacing: '0.4536px', lineHeight: '24px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                  {oc.qr_heading_line1}<br />{oc.qr_heading_line2}
                </p>
                <p style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 12, color: '#000', letterSpacing: '0.3883px', lineHeight: '20px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                  {oc.qr_caption_line1}<br />{oc.qr_caption_line2}
                </p>
              </div>
              <img src={images['order-confirmation-phone-in-hand']} alt="" style={{ width: 247, height: 372, objectFit: 'contain', flexShrink: 0 }} />
            </div>

            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', width: '100%' }}>
              <button
                type="button"
                onClick={onBackToDashboard}
                style={{
                  display: 'flex', flex: '1 0 0', minWidth: 0, gap: 8, alignItems: 'center', justifyContent: 'center',
                  height: 48, padding: '12px 60px', borderRadius: 16, border: 'none', background: 'transparent', cursor: 'pointer',
                  boxShadow: '0 2px 2px rgba(0,65,114,0.08)',
                }}
              >
                <ChevronLeft />
                <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 16, color: '#004172', letterSpacing: '0.2592px', whiteSpace: 'nowrap' }}>
                  {oc.back_to_dashboard_label}
                </span>
              </button>
              <button
                type="button"
                onClick={onTrackOrder}
                style={{
                  position: 'relative', display: 'flex', flex: '1 0 0', minWidth: 0, gap: 8, alignItems: 'center', justifyContent: 'center',
                  height: 48, padding: '12px 60px', borderRadius: 12, border: 'none', cursor: 'pointer',
                  boxShadow: '0 2px 2px rgba(0,65,114,0.08), inset 0 0 2px 0 rgba(0,65,114,0.08)',
                  background: '#004172',
                }}
              >
                <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 16, color: '#fff', letterSpacing: '0.2592px', whiteSpace: 'nowrap' }}>
                  {oc.track_order_label}
                </span>
                <span style={{ color: '#fff', display: 'flex' }}>
                  <CartIcon className="relative size-6 shrink-0 overflow-clip" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
