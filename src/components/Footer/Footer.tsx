// Site footer — Figma node 13222:18333 ("Footer", mobile flow-page spec).
// Content (logo/address/contact, Services + About link lists, certification
// badges, copyright) is identical between breakpoints; only the layout
// reflows — single stacked column on mobile (as designed), 3-column row on
// desktop (Logo+contact | Services | About) since no separate desktop Figma
// frame for this section has been built yet.

const LOGO = '/assets/footer/logo-white.svg';
const ICON_PHONE = '/assets/footer/icon-phone.svg';
const ICON_MAIL = '/assets/footer/icon-mail.svg';
const BADGE_STRIP = '/assets/footer/badge-strip.png';
const BADGE_ISO = '/assets/footer/badge-iso.png';
const BADGE_SOC = '/assets/footer/badge-soc.png';
const BADGE_DIGITAL_MISSION = '/assets/footer/badge-digital-mission.png';

const SERVICES = ['Membership', 'Totalcare', 'Consult a Doctor', 'Order Medicine', 'Book a Lab Test', 'Consult for Surgery', 'Concierge Services'];
const ABOUT = ['Why CureBay', 'Our Team', 'Blogs', 'Media & News', 'Awards', 'Privacy Policy', 'Terms of Use', 'Return and Refund Policy', 'Medicine Delivery Policy', 'Careers'];

function LinkColumn({ title, items }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 159.5 }}>
      <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 18, lineHeight: '28px', color: '#fff' }}>{title}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map((item) => (
          <p key={item} style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 300, fontSize: 14, lineHeight: '20px', color: '#fff', whiteSpace: 'nowrap' }}>
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer style={{ background: '#004172', width: '100%' }}>
      <div
        className="flex flex-col gap-10 px-6 pt-6 md:flex-row md:justify-between md:gap-12 md:px-[120px] md:pt-16"
        style={{ maxWidth: 1440, margin: '0 auto' }}
      >
        {/* Logo + address + contact */}
        <div className="flex flex-col gap-1 md:max-w-[380px]">
          <img src={LOGO} alt="CureBay" draggable={false} style={{ width: 106.378, height: 32 }} />
          <p style={{ margin: 0, marginTop: 4, fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 16, lineHeight: '18.4px', color: '#42BA85' }}>
            CureBay Pharmacy Pvt. Ltd.
          </p>
          <p style={{ margin: 0, marginTop: 16, fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 14, lineHeight: '20px', color: '#fff', maxWidth: 319 }}>
            Plot No-A-98, Laxmi Sagar, Budha Nagar, Bhubaneswar, Khordha, Odisha, 751006
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20 }}>
            <img src={ICON_PHONE} alt="" draggable={false} style={{ width: 24, height: 24 }} />
            <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 16, lineHeight: '18.4px', color: '#fff', whiteSpace: 'nowrap' }}>
              +91-8335 000 999
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginTop: 12 }}>
            <img src={ICON_MAIL} alt="" draggable={false} style={{ width: 16, height: 16, marginTop: 1 }} />
            <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 14, lineHeight: '20px', color: '#fff', whiteSpace: 'nowrap' }}>
              contact@curebay.com
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginTop: 12 }}>
            <img src={ICON_MAIL} alt="" draggable={false} style={{ width: 16, height: 16, marginTop: 1 }} />
            <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 14, lineHeight: '20px', color: '#fff', whiteSpace: 'nowrap' }}>
              support@curebay.com
            </p>
          </div>
        </div>

        {/* Services + About */}
        <div className="flex gap-8 md:gap-16">
          <LinkColumn title="Services" items={SERVICES} />
          <LinkColumn title="About" items={ABOUT} />
        </div>

        {/* Certification badges */}
        <div className="flex flex-col items-center gap-3 md:items-end md:justify-start">
          <img src={BADGE_STRIP} alt="" draggable={false} style={{ width: 221, height: 44.772, objectFit: 'cover' }} />
          <div
            className="grid grid-cols-2 gap-8 justify-center"
            style={{ borderTop: '1px solid rgba(255,255,255,0.37)', paddingTop: 21, width: '100%', maxWidth: 319 }}
          >
            <img src={BADGE_ISO} alt="ISO certified" draggable={false} style={{ height: 80, objectFit: 'contain' }} />
            <img src={BADGE_ISO} alt="ISO certified" draggable={false} style={{ height: 80, objectFit: 'contain' }} />
            <img src={BADGE_SOC} alt="SOC certified" draggable={false} style={{ height: 80, objectFit: 'contain' }} />
            <img src={BADGE_DIGITAL_MISSION} alt="Digital Mission" draggable={false} style={{ height: 99.5, objectFit: 'contain' }} />
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.37)', marginTop: 32 }} className="mx-6 md:mx-[120px]">
        <p style={{ margin: 0, padding: '33px 0 32px', textAlign: 'center', fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 12, lineHeight: '16px', color: '#fff' }}>
          Copyright © 2024
          <br />
          All Rights Reserved by CureBay Pharmacy Pvt. Ltd.
        </p>
      </div>
    </footer>
  );
}
