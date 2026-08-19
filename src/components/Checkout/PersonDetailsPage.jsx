import { useState } from 'react';
import CheckoutStepper from './CheckoutStepper';
import PrimaryButton from '../common/PrimaryButton';
import { TextField, PhoneField, AddressField } from './ShippingDetailsPage';
import { useContent } from '../../context/ContentContext';

/*
  "Enter the details of the person" — Figma node 14010:22870, reached from
  CareForPage's "Someone else" option (as opposed to "Me", which skips
  straight to OrderDetailsPage). Reuses the exact same TextField/PhoneField/
  AddressField input components as ShippingDetailsPage (same 44px h,
  0.81px #ebebeb border, radius 12 "Input Field" styling) and the same
  stepper/progress-bar/dot-grid-card shell as CareForPage/OrderDetailsPage.
  Country/State/City/Pincode sit in a 2×2 grid here (narrower 700px form)
  rather than ShippingDetailsPage's 4-across row.
*/

const HEADER_H = 52;
const FONT = 'Inter, sans-serif';

const DOT_GRID_BG = {
  backgroundImage: 'radial-gradient(circle, #e5e5e5 1px, transparent 1px)',
  backgroundSize: '24px 24px',
};

export default function PersonDetailsPage({ isOpen, onContinue }) {
  const { checkout } = useContent();
  const savedAddresses = [...checkout.savedAddresses].sort((a, b) => a.sort_order - b.sort_order);

  const [form, setForm] = useState({
    fullName: '', phone: '', address1: '',
    country: '', state: '', city: '', pincode: '',
  });

  if (!isOpen) return null;

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div style={{ position: 'fixed', top: HEADER_H, left: 0, right: 0, bottom: 0, background: '#f9f9f9', zIndex: 1200, overflowY: 'auto' }}>
      <div style={{ width: '100%', maxWidth: 1800, margin: '0 auto', padding: 'clamp(24px, 6vw, 120px)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 60, alignItems: 'flex-start' }}>
        <CheckoutStepper currentStep={1} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'flex-start', width: '100%' }}>
          <div style={{ display: 'flex', width: '100%', height: 8, borderRadius: 24, overflow: 'hidden', background: '#e5e5e5' }}>
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} style={{ flex: '1 0 0', minWidth: 0, height: 8, background: i < 3 ? 'linear-gradient(180deg, #10b981 0%, #00664c 100%)' : 'transparent' }} />
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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 48 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', textAlign: 'center' }}>
                <p style={{ margin: 0, fontFamily: FONT, fontWeight: 500, fontSize: 32, color: '#000', lineHeight: 1.3, letterSpacing: '-0.32px' }}>
                  Enter the details of the person
                </p>
                <p style={{ margin: 0, fontFamily: FONT, fontWeight: 400, fontSize: 16, color: '#000' }}>
                  These details will be used as a login credential for the Take care app.
                </p>
              </div>

              <div style={{ width: 700, maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ display: 'flex', gap: 24, width: '100%' }}>
                  <TextField label="Full Name" value={form.fullName} onChange={set('fullName')} placeholder="Rohit Sanjay Mehra" chevron={false} style={{ flex: 1 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <PhoneField value={form.phone} onChange={set('phone')} label="Phone Number" placeholder="Enter 10-digit mobile number" />
                  </div>
                </div>

                <AddressField
                  value={form.address1}
                  onChange={set('address1')}
                  onSelect={(text) => setForm((f) => ({ ...f, address1: text }))}
                  label="Address 1*"
                  placeholder="E.g. 123 Main Street"
                  helper="Address cannot be changed after dispatch"
                  savedAddresses={savedAddresses}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, width: '100%' }}>
                  <TextField label="Country/Region*" value={form.country} onChange={set('country')} placeholder="India" />
                  <TextField label="State*" value={form.state} onChange={set('state')} placeholder="E.g. Maharashtra" />
                  <TextField label="City*" value={form.city} onChange={set('city')} placeholder="E.g. Mumbai" />
                  <TextField label="Pin code*" value={form.pincode} onChange={set('pincode')} placeholder="Eg. 450001" chevron={false} />
                </div>

                <PrimaryButton fullWidth onClick={() => onContinue?.(form)}>Continue</PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
