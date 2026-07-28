import { useState } from 'react';
import DisclaimerCard from '../Subscription/DisclaimerCard';
import CartIcon from '../icons/CartIcon';
import { useContent } from '../../context/ContentContext';
import { FONT, SuccessCheck, ChevronLeft, computeOrderMeta } from './OrderConfirmationPage';
import iconMail from '../../assets/status-card/icon-mail-footer.svg';
import qrChipImg from '../../assets/figma-hero/qr-chip.png';

/*
  Mobile "Order Confirmation" — Figma node 12185:6632 ("Mobile: Cart").
  Reuses FONT/SuccessCheck/ChevronLeft/computeOrderMeta from the desktop
  OrderConfirmationPage (same convention as PaymentPageMobile importing from
  PaymentPage) and the same `order_confirmation_content` DB copy — only the
  layout is rebuilt: single-column stack, smaller 80.201px thumbnails, a
  quantity+price row folded into each card's top section (mobile's Figma
  cards read Quantity/Price before Starts-from/Delivered-by, unlike the
  desktop cards' bottom-right price), a single stacked QR+phone card, and
  the two action buttons stacked full-width in Track-Order-then-Back-to-
  dashboard order (reversed from desktop's side-by-side order).
*/

const rowStyle = { display: 'flex', gap: 8, fontFamily: FONT, fontWeight: 500, fontSize: 14, letterSpacing: '0.4536px', lineHeight: '24px', width: '100%' };
const rowLabelStyle = { margin: 0, color: '#808080', flexShrink: 0, whiteSpace: 'nowrap' };
const rowValueStyle = { margin: 0, color: '#000', flex: '1 0 0', minWidth: 0 };

/* ── Shared mobile order card (Figma "added_in_cart_..._card") ── */
function MobileOrderCard({ thumbnail, imageBg, heading, price, rows }) {
  return (
    <div
      style={{
        position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', gap: 8,
        padding: 8, borderRadius: 20, boxSizing: 'border-box', boxShadow: '0 4px 6px rgba(0,65,114,0.08)',
        background: '#fff',
      }}
    >
      <div style={{ display: 'flex', gap: 12, height: 80.201, alignItems: 'flex-start', width: '100%' }}>
        <div style={{ position: 'relative', width: 80.201, height: 80.201, borderRadius: 13.345, overflow: 'hidden', flexShrink: 0, background: imageBg }}>
          <img src={thumbnail} alt="" draggable={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }} />
          <div aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', boxShadow: 'inset 0 0 0.801px 0 rgba(0,65,114,0.24)', pointerEvents: 'none' }} />
        </div>
        <div style={{ position: 'relative', display: 'flex', flex: '1 0 0', minWidth: 0, flexDirection: 'column', height: '100%', alignItems: 'flex-start', justifyContent: 'space-between', paddingTop: 8, paddingBottom: 8, paddingRight: 8 }}>
          <p style={{ margin: 0, width: '100%', fontFamily: FONT, fontWeight: 500, fontSize: 16, color: '#000', letterSpacing: '0.5178px', lineHeight: '24px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {heading}
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', width: '100%', fontFamily: FONT, fontWeight: 500, letterSpacing: '0.4536px', whiteSpace: 'nowrap' }}>
            <div style={{ display: 'flex', gap: 5, alignItems: 'center', fontSize: 14 }}>
              <span style={{ color: '#ccc' }}>Quantity</span>
              <span style={{ color: '#000' }}>1</span>
            </div>
            <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: '#000' }}>{price}</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ background: '#ccc', height: 1, width: '100%', borderRadius: 88, flexShrink: 0 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', padding: 8, boxSizing: 'border-box' }}>
        {rows.map((row) => (
          <div key={row.label} style={rowStyle}>
            <p style={rowLabelStyle}>{row.label}</p>
            <p style={rowValueStyle}>{row.value}</p>
          </div>
        ))}
      </div>
      <div aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', boxShadow: 'inset 0 0 2px 0 rgba(0,65,114,0.16)', pointerEvents: 'none' }} />
    </div>
  );
}

export default function OrderConfirmationPageMobile({ plan, shippingInfo, isOpen, onBackToDashboard, onTrackOrder }) {
  const { subscription, checkout, images } = useContent();
  const product = subscription.cartProduct;
  const oc = checkout.orderConfirmation;

  const [orderMeta] = useState(() => computeOrderMeta(plan));

  if (!isOpen || !plan) return null;

  const planName = plan.key === 'yearly' ? 'Yearly' : 'Monthly';
  const email = shippingInfo?.email || '';
  const contactPhone = shippingInfo?.phone ? `+91 ${shippingInfo.phone}` : '';
  const addressLine = shippingInfo
    ? [shippingInfo.address1, shippingInfo.city, shippingInfo.state, shippingInfo.pincode, shippingInfo.country].filter(Boolean).join(', ')
    : '';
  const deliveredAt = [shippingInfo && `${shippingInfo.firstName} ${shippingInfo.lastName}`.trim(), contactPhone, addressLine]
    .filter(Boolean)
    .join(', ');

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#f9f9f9', zIndex: 1200, overflowY: 'auto' }}>
      <div style={{ width: '100%', padding: '48px 24px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 48, alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center', width: '100%', borderBottom: '1px solid #ccc', paddingBottom: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', width: '100%' }}>
            <SuccessCheck />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center', textAlign: 'center', width: '100%' }}>
              <p style={{ margin: 0, fontFamily: FONT, fontWeight: 700, fontSize: 24, color: '#00b82e', lineHeight: '32px' }}>{oc.heading}</p>
              <p style={{ margin: 0, fontFamily: FONT, fontWeight: 300, fontSize: 16, color: '#4d4d4d', letterSpacing: '0.5184px', lineHeight: '28px', width: '100%' }}>
                {oc.subheading}
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 48, width: '100%' }}>
          <MobileOrderCard
            thumbnail={images['subscription-cart-mobile']}
            imageBg="radial-gradient(50% 50% at 50% 50%, #E8F1F8 0%, #fff 100%)"
            heading={`TakeCare ${planName} Plan`}
            price={`₹${plan.subAmount}`}
            rows={[
              { label: oc.starts_from_label, value: `${oc.starts_from_prefix} ${email}.` },
              { label: oc.renews_on_label, value: orderMeta.renewsOn },
            ]}
          />
          <MobileOrderCard
            thumbnail={images['subscription-cart-device']}
            heading={product.name}
            price={product.price}
            rows={[
              { label: oc.delivered_by_label, value: orderMeta.deliveredBy },
              { label: oc.delivered_at_label, value: deliveredAt },
            ]}
          />
          <DisclaimerCard icon={iconMail}>
            <p style={{ margin: 0, width: '100%', fontFamily: FONT, fontWeight: 500, fontSize: 12, color: '#000', letterSpacing: '0.3883px', lineHeight: 1.5 }}>
              {oc.order_number_prefix}{orderMeta.orderNumber}
            </p>
            <p style={{ margin: 0, width: '100%', fontFamily: FONT, fontWeight: 500, fontSize: 12, color: '#999', letterSpacing: '0.3883px', lineHeight: 1.5 }}>
              {oc.order_sent_prefix} {email} and {contactPhone}
            </p>
          </DisclaimerCard>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 60, alignItems: 'flex-start', justifyContent: 'center', width: '100%' }}>
          <div
            style={{
              position: 'relative', width: '100%', borderRadius: 32, padding: 48, boxSizing: 'border-box',
              display: 'flex', flexDirection: 'column', gap: 48, alignItems: 'center', justifyContent: 'center',
              background: '#fff', boxShadow: '0px 2px 10px rgba(0,65,114,0.08), inset 0px 0px 2px rgba(0,65,114,0.12)',
            }}
          >
            <img src={images['order-confirmation-phone-in-hand']} alt="" style={{ width: 247, height: 372, objectFit: 'contain', flexShrink: 0 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
              <img src={qrChipImg} alt="QR code to download the TakeCare app" style={{ width: 154, height: 145, objectFit: 'contain' }} />
              <p style={{ margin: 0, fontFamily: FONT, fontWeight: 700, fontSize: 14, color: '#000', letterSpacing: '0.4536px', lineHeight: '24px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                {oc.qr_heading_line1}<br />{oc.qr_heading_line2}
              </p>
              <p style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 12, color: '#000', letterSpacing: '0.3883px', lineHeight: 1.5, textAlign: 'center', whiteSpace: 'nowrap' }}>
                {oc.qr_caption_line1}<br />{oc.qr_caption_line2}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'flex-start', width: '100%' }}>
            <button
              type="button"
              onClick={onTrackOrder}
              style={{
                position: 'relative', display: 'flex', width: '100%', gap: 8, alignItems: 'center', justifyContent: 'center',
                height: 48, padding: '12px 60px', borderRadius: 12, border: 'none', cursor: 'pointer', boxSizing: 'border-box',
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
            <button
              type="button"
              onClick={onBackToDashboard}
              style={{
                display: 'flex', width: '100%', gap: 8, alignItems: 'center', justifyContent: 'center',
                height: 48, padding: '12px 60px', borderRadius: 16, border: 'none', background: 'transparent', cursor: 'pointer',
                boxSizing: 'border-box', boxShadow: '0 2px 2px rgba(0,65,114,0.08)',
              }}
            >
              <ChevronLeft />
              <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 16, color: '#004172', letterSpacing: '0.2592px', whiteSpace: 'nowrap' }}>
                {oc.back_to_dashboard_label}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
