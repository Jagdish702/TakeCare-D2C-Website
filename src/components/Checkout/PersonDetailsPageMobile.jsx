import { useState } from 'react';
import CheckoutStepperMobile from './CheckoutStepperMobile';
import PrimaryButton from '../common/PrimaryButton';
import { TextField, PhoneField, AddressField } from './ShippingDetailsPageMobile';
import { useContent } from '../../context/ContentContext';

/*
  Mobile "Enter the details of this person" — Figma node 14024:20563. Same
  content/behaviour as the desktop PersonDetailsPage, reusing the exact
  same TextField/PhoneField/AddressField components ShippingDetailsPageMobile
  already built (single-column, mobile type sizes, Country/State/City/Pincode
  as a 2×2 grid).
*/

const FONT = 'Inter, sans-serif';

const DOT_GRID_BG = {
  backgroundImage: 'radial-gradient(circle, #e5e5e5 1px, transparent 1px)',
  backgroundSize: '24px 24px',
};

export default function PersonDetailsPageMobile({ isOpen, onContinue }) {
  const { checkout } = useContent();
  const savedAddresses = [...checkout.savedAddresses].sort((a, b) => a.sort_order - b.sort_order);

  const [form, setForm] = useState({
    fullName: '', phone: '', address1: '',
    country: '', state: '', city: '', pincode: '',
  });

  if (!isOpen) return null;

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#f9f9f9', zIndex: 1200, overflowY: 'auto' }}>
      <div style={{ width: '100%', padding: '48px 24px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'flex-start' }}>
        <CheckoutStepperMobile currentStep={1} />

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
            gap: 48,
            padding: '40px 24px',
            borderRadius: 40,
            background: '#fff',
            boxSizing: 'border-box',
            ...DOT_GRID_BG,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', textAlign: 'center', width: '100%' }}>
            <p style={{ margin: 0, width: '100%', fontFamily: FONT, fontWeight: 500, fontSize: 24, color: '#000', lineHeight: '32px' }}>
              Enter the details of this person
            </p>
            <p style={{ margin: 0, width: '100%', fontFamily: FONT, fontWeight: 500, fontSize: 14, color: '#808080', letterSpacing: '0.4536px', lineHeight: '24px' }}>
              These details will be used as a login credential for the Take care app.
            </p>
          </div>

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>
            <TextField label="Full Name" value={form.fullName} onChange={set('fullName')} placeholder="Rohit Sanjay Mehra" chevron={false} />
            <PhoneField value={form.phone} onChange={set('phone')} label="Phone Number" placeholder="Enter 10-digit mobile number" />

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
  );
}
