// Site footer — Figma node 12221:7272 ("Footer", desktop homepage, node-id
// 12075-1249 in the URL). That node is a single flattened image in Figma (no
// live text/icon layers), so exact typography/spacing were matched visually
// from the reference screenshot rather than extracted from Figma data.
// Content (logo/address/contact, Services + About link lists, social icons,
// certification badges) is identical between breakpoints; only the layout
// reflows — single stacked column on mobile, this 3-column row on desktop.

import { useContent } from '../../context/ContentContext';

const LOGO = '/assets/footer/logo-white.svg';
const ICON_PHONE = '/assets/footer/icon-phone.svg';
const ICON_MAIL = '/assets/footer/icon-mail.svg';
const SOCIAL_ICONS = [
  { key: 'facebook', src: '/assets/footer/icon-social-facebook.png', href: 'https://facebook.com' },
  { key: 'instagram', src: '/assets/footer/icon-social-instagram.png', href: 'https://instagram.com' },
  { key: 'youtube', src: '/assets/footer/icon-social-youtube.png', href: 'https://youtube.com' },
  { key: 'linkedin', src: '/assets/footer/icon-social-linkedin.png', href: 'https://linkedin.com' },
];
const BADGE_ISO = '/assets/footer/badge-iso.png';
const BADGE_HIPAA = '/assets/footer/badge-hipaa.png';
const BADGE_SOC = '/assets/footer/badge-soc.png';
const BADGE_DIGITAL_MISSION = '/assets/footer/badge-digital-mission.png';

function LinkColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 159.5 }}>
      <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 18, lineHeight: '28px', color: '#fff' }}>{title}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {items.map((item) => (
          <p key={item} style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 15, lineHeight: '20px', color: '#fff' }}>
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function Footer() {
  const { footer } = useContent();
  const { linkGroups, companyInfo } = footer;

  return (
    <footer style={{ background: '#004172', width: '100%' }}>
      <div
        className="flex flex-col gap-10 px-6 py-10 md:flex-row md:justify-between md:gap-12 md:px-[120px] md:py-16"
        style={{ maxWidth: 1440, margin: '0 auto' }}
      >
        {/* Logo + address + contact + social + certification badges */}
        <div className="flex flex-col gap-1 md:max-w-[460px]">
          <img src={LOGO} alt="CureBay" draggable={false} style={{ width: 106.378, height: 32 }} />
          <p style={{ margin: 0, marginTop: 12, fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 16, lineHeight: '20px', color: '#42BA85' }}>
            {companyInfo.company_name}
          </p>
          <p style={{ margin: 0, marginTop: 16, fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 14, lineHeight: '20px', color: '#fff', maxWidth: 319 }}>
            {companyInfo.address}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20 }}>
            <img src={ICON_PHONE} alt="" draggable={false} style={{ width: 24, height: 24 }} />
            <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 16, lineHeight: '18.4px', color: '#fff', whiteSpace: 'nowrap' }}>
              {companyInfo.phone}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginTop: 12 }}>
            <img src={ICON_MAIL} alt="" draggable={false} style={{ width: 16, height: 16, marginTop: 1 }} />
            <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 14, lineHeight: '20px', color: '#fff', whiteSpace: 'nowrap' }}>
              {companyInfo.email_primary}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginTop: 12 }}>
            <img src={ICON_MAIL} alt="" draggable={false} style={{ width: 16, height: 16, marginTop: 1 }} />
            <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 14, lineHeight: '20px', color: '#fff', whiteSpace: 'nowrap' }}>
              {companyInfo.email_secondary}
            </p>
          </div>

          {/* Social icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 24 }}>
            {SOCIAL_ICONS.map((s) => (
              <a key={s.key} href={s.href} target="_blank" rel="noreferrer" aria-label={s.key}>
                <img src={s.src} alt="" draggable={false} style={{ width: 40, height: 40, objectFit: 'contain' }} />
              </a>
            ))}
          </div>

          {/* Certification badges — one line on web (per Figma), always;
              wraps to 2×2 only below md, instead of overflowing the screen. */}
          <div className="flex-wrap md:flex-nowrap" style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 24 }}>
            <img src={BADGE_ISO} alt="ISO 27001:2022 certified" draggable={false} style={{ height: 88, objectFit: 'contain' }} />
            <img src={BADGE_HIPAA} alt="HIPAA secured by Sprinto" draggable={false} style={{ height: 88, objectFit: 'contain' }} />
            <img src={BADGE_SOC} alt="AICPA SOC certified" draggable={false} style={{ height: 88, objectFit: 'contain' }} />
            <img src={BADGE_DIGITAL_MISSION} alt="Ayushman Bharat Digital Mission" draggable={false} style={{ height: 88, objectFit: 'contain' }} />
          </div>
        </div>

        {/* Services + About */}
        <div className="flex gap-8 md:gap-16">
          {linkGroups.map((group: any) => (
            <LinkColumn key={group.id} title={group.title} items={group.links.map((link: any) => link.label)} />
          ))}
        </div>
      </div>
    </footer>
  );
}
