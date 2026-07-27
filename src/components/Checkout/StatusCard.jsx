import PrimaryButton from '../common/PrimaryButton';
import BellIcon from '../icons/BellIcon';
import CartIcon from '../icons/CartIcon';
import { useContent } from '../../context/ContentContext';
import iconChevronRight from '../../assets/profile-dashboard/icon-chevron-right-24.svg';
import iconVerifyCheck from '../../assets/profile-modal/icon-verify-check.svg';
import iconErrorClose from '../../assets/status-card/icon-error-close.svg';
import iconPendingClock from '../../assets/status-card/icon-pending-clock.svg';
import iconCardDeclined from '../../assets/status-card/icon-card-declined.svg';
import iconWarningTriangle from '../../assets/status-card/icon-warning-triangle.svg';
import iconSearch from '../../assets/status-card/icon-search.svg';
import iconPackageFooter from '../../assets/status-card/icon-package-footer.svg';
import iconMailFooter from '../../assets/status-card/icon-mail-footer.svg';

/*
  "Status Card" — Figma node 12185:8397/8400/8403/8406/8409/8412/8415 (7
  payment-result states shown after the Payment step's "Pay Now"/"Continue
  Payment" action, which is currently a no-op — see PaymentPage.jsx /
  PaymentPageMobile.jsx `onContinue={() => {}}`).

  One shared, data-driven component rather than 7 near-duplicate components
  — every card is the same shell (icon circle, heading/subheading, button
  stack, footer row + chevron); only the icon/colour/copy/CTA differ per
  state. Copy (heading/subheading/button labels/footer text) comes from the
  `status_cards` DB table via useContent(), matching how the rest of the
  app sources its text; icon/colour choice stays in STATUS_CARD_ICONS below
  since no icon anywhere in this schema is DB-driven.

  Icon sourcing, per the "reuse what exists" rule:
    - Primary CTA reuses PrimaryButton as-is (its 12px-radius/#004172/shadow
      styling is an exact match for Figma's "Regular_button").
    - Chevron reuses assets/profile-dashboard/icon-chevron-right-24.svg
      (same #004172 stroke Figma uses here).
    - Footer bell/cart reuse the existing BellIcon/CartIcon components
      (currentColor-based — recoloured to the required #4d4d4d via a
      wrapping `color` style — CartIcon's hardcoded header bg-white is
      swapped out via its className prop).
    - Success checkmark reuses assets/profile-modal/icon-verify-check.svg
      (already the correct white checkmark-on-colour-badge glyph).
    - Footer package/mail icons and all 6 main status icons (error-close,
      pending-clock, card-declined, warning-triangle, search,
      package/mail) have no existing equivalent in the right colour, so
      they're downloaded fresh from Figma into assets/status-card/ — each
      file already has the exact Figma colour baked in (#D82525 error,
      #D29300 warning, #008EB1 info, #4D4D4D footer grey).

  Known deviations from the raw Figma export (flagged, not silently
  "fixed"):
    - The "Payment in progress" (8400) primary button used a 16px corner
      radius while all 6 other cards' identical "Regular_button" use 12px
      — treated as a one-off inconsistency in the source file and
      normalised to 12px (PrimaryButton's own radius) here.
    - The "Payment successful" (8415) success badge was exported at a
      broken ~1.6px scale (a Figma resize-without-constraints artifact —
      effectively invisible). Rebuilt at the same 38px size as the other
      6 cards' icon so it actually reads as a success badge, using the
      real green/white token colours (#34C759 circle + the reused white
      checkmark glyph).
*/

const FONT = 'Inter, sans-serif';
const FOOTER_ICON_BG = '#e5e5e5';
const FOOTER_ICON_COLOR = '#4d4d4d';
const MAIN_ICON_BOX = 38;

function MainIcon({ bg, src }) {
  return (
    <div
      style={{
        width: MAIN_ICON_BOX + 24,
        height: MAIN_ICON_BOX + 24,
        borderRadius: 9999,
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <img
        src={src}
        alt=""
        style={{ width: MAIN_ICON_BOX, height: MAIN_ICON_BOX, display: 'block', filter: 'drop-shadow(0px 3px 12px rgba(0,65,114,0.08))' }}
      />
    </div>
  );
}

// "Payment successful" badge — see the deviations note above for why this
// isn't a straight asset re-export.
function SuccessBadge() {
  return (
    <div
      style={{
        width: MAIN_ICON_BOX + 24,
        height: MAIN_ICON_BOX + 24,
        borderRadius: 9999,
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: MAIN_ICON_BOX,
          height: MAIN_ICON_BOX,
          borderRadius: 9999,
          background: '#34c759',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0px 3px 15px rgba(0,65,114,0.08), inset 0px 0px 3px rgba(0,65,114,0.12)',
        }}
      >
        <img src={iconVerifyCheck} alt="" style={{ width: 16, height: 11, display: 'block' }} />
      </div>
    </div>
  );
}

function FooterIcon({ kind }) {
  if (kind === 'cart') {
    return (
      <span style={{ color: FOOTER_ICON_COLOR, display: 'flex' }}>
        <CartIcon className="relative size-6 shrink-0 overflow-clip" />
      </span>
    );
  }
  if (kind === 'bell') {
    return (
      <span style={{ color: FOOTER_ICON_COLOR, display: 'flex' }}>
        <BellIcon />
      </span>
    );
  }
  const src = kind === 'package' ? iconPackageFooter : iconMailFooter;
  return <img src={src} alt="" style={{ width: 24, height: 24, display: 'block' }} />;
}

// ─── Icon/colour catalog — one entry per `status_cards.variant_key` ──────
// Not DB-backed (see file header) — keyed to line up 1:1 with the DB rows.
export const STATUS_CARD_ICONS = {
  payment_failed: { iconBg: '#ffdbdb', icon: iconErrorClose, footerIcon: 'cart' },
  payment_in_progress: { iconBg: '#fff5df', icon: iconPendingClock, footerIcon: 'bell' },
  payment_declined: { iconBg: '#ffdbdb', icon: iconCardDeclined, footerIcon: 'package' },
  payment_interrupted: { iconBg: '#fff5df', icon: iconWarningTriangle, footerIcon: 'cart' },
  confirmation_pending: { iconBg: '#fff5df', icon: iconPendingClock, footerIcon: 'bell' },
  payment_under_review: { iconBg: '#e5f7fc', icon: iconSearch, footerIcon: 'bell' },
  payment_successful: { success: true, footerIcon: 'mail' },
};

export const STATUS_CARD_VARIANTS = Object.keys(STATUS_CARD_ICONS);

/*
  <StatusCard variant="payment_failed" onPrimary={...} onSecondary={...} onFooterClick={...} />
  `variant` must match a `status_cards.variant_key` row; the three handlers
  are optional and only wired to whichever of primary/secondary/footer that
  variant's DB row actually populates.
*/
export default function StatusCard({ variant, onPrimary, onSecondary, onFooterClick, maxWidth = 500 }) {
  const { checkout } = useContent();
  const icons = STATUS_CARD_ICONS[variant];
  const row = checkout.statusCards.find((r) => r.variant_key === variant);
  if (!icons || !row) return null;
  const content = {
    ...icons,
    heading: row.heading,
    subheading: row.subheading,
    primaryLabel: row.primary_label,
    secondaryLabel: row.secondary_label,
    countdownText: row.countdown_text,
    footerText: row.footer_text,
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth,
        boxSizing: 'border-box',
        background: '#fff',
        borderRadius: 48,
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        boxShadow: '0px 2px 20px rgba(0,65,114,0.08), inset 0px 0px 2px rgba(0,65,114,0.12)',
      }}
    >
      <div
        style={{
          width: '100%',
          borderBottom: '1px solid #ccc',
          paddingBottom: 32,
          display: 'flex',
          flexDirection: 'column',
          gap: 32,
          alignItems: 'center',
        }}
      >
        {content.success ? <SuccessBadge /> : <MainIcon bg={content.iconBg} src={content.icon} />}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', width: '100%' }}>
          <p style={{ margin: 0, width: '100%', textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 18, color: '#000', letterSpacing: '0.5825px', lineHeight: '28px' }}>
            {content.heading}
          </p>
          <p style={{ margin: 0, width: '100%', textAlign: 'center', fontFamily: FONT, fontWeight: 300, fontSize: 16, color: '#000', letterSpacing: '0.5184px', lineHeight: '28px' }}>
            {content.subheading}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
          <PrimaryButton fullWidth onClick={onPrimary}>{content.primaryLabel}</PrimaryButton>

          {content.secondaryLabel && (
            <button
              type="button"
              onClick={onSecondary}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: 48, width: '100%', boxSizing: 'border-box',
                border: 'none', background: 'transparent', borderRadius: 16, cursor: 'pointer',
                fontFamily: FONT, fontWeight: 500, fontSize: 16, color: '#004172', letterSpacing: '0.2592px',
              }}
            >
              {content.secondaryLabel}
            </button>
          )}

          {content.countdownText && (
            <p style={{ margin: 0, width: '100%', textAlign: 'right', fontFamily: FONT, fontWeight: 500, fontSize: 12, color: '#4d4d4d', letterSpacing: '0.3883px', lineHeight: '20px' }}>
              {content.countdownText}
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onFooterClick}
        style={{ display: 'flex', gap: 24, alignItems: 'center', width: '100%', border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', textAlign: 'left' }}
      >
        <div style={{ display: 'flex', flex: '1 1 0%', minWidth: 0, gap: 24, alignItems: 'center' }}>
          <div style={{ background: FOOTER_ICON_BG, width: 40, height: 40, borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FooterIcon kind={content.footerIcon} />
          </div>
          <p style={{ margin: 0, flex: '1 1 0%', minWidth: 0, fontFamily: FONT, fontWeight: 500, fontSize: 12, color: '#4d4d4d', letterSpacing: '0.3883px', lineHeight: '20px' }}>
            {content.footerText}
          </p>
        </div>
        <img src={iconChevronRight} alt="" style={{ width: 24, height: 24, flexShrink: 0 }} />
      </button>
    </div>
  );
}
