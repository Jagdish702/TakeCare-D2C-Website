import { useEffect, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsMobile } from './hooks/useIsMobile';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import ConnectedEcosystem from './components/Hero/ConnectedEcosystem';
import HeroMobile from './components/mobile/HeroMobile';
import EcosystemAccordion from './components/mobile/EcosystemAccordion';
import MumTookDoseMobile from './components/mobile/MumTookDoseMobile';
import MumTookDose from './components/MumTookDose/MumTookDose';
import FeaturesSectionMobile from './components/mobile/FeaturesSectionMobile';
import NobodyFallsMobile from './components/mobile/NobodyFallsMobile';
import SetupSpecsSection from './components/SetupSpecs/SetupSpecsSection';
import SetupSpecsSectionMobile from './components/mobile/SetupSpecsSectionMobile';
import SetupRefillFlowPage from './components/SetupRefill/SetupRefillFlowPage';
import FeaturesSection from './components/Features/FeaturesSection';
import NobodyFallsSection from './components/NobodyFalls/NobodyFallsSection';
import DownloadAppSection from './components/DownloadApp/DownloadAppSection';
import DownloadAppSectionMobile from './components/DownloadApp/DownloadAppSectionMobile';
import SubscriptionSection from './components/Subscription/SubscriptionSection';
import SubscriptionSectionMobile from './components/Subscription/SubscriptionSectionMobile';
import CartDrawer from './components/Subscription/CartDrawer';
import CartDrawerMobile from './components/Subscription/CartDrawerMobile';
import CheckoutPage from './components/Checkout/CheckoutPage';
import CheckoutPageMobile from './components/Checkout/CheckoutPageMobile';
import ShippingDetailsPage from './components/Checkout/ShippingDetailsPage';
import ShippingDetailsPageMobile from './components/Checkout/ShippingDetailsPageMobile';
import PaymentPage from './components/Checkout/PaymentPage';
import PaymentPageMobile from './components/Checkout/PaymentPageMobile';
import FAQSection from './components/FAQ/FAQSection';
import FAQSectionMobile from './components/mobile/FAQSectionMobile';
import GetTakeCareStrip from './components/GetTakeCareStrip/GetTakeCareStrip';
import ProfileModal from './components/ProfileModal/ProfileModal';
import OTPModal from './components/OTPModal/OTPModal';
import ProfileDashboard, { type ProfileFormData } from './components/ProfileDashboard/ProfileDashboard';

export default function App() {
  const [cartPlan, setCartPlan] = useState<any>(null);
  const [cartOpen, setCartOpen] = useState(false);
  // Checkout flow: 'closed' | 'summary' (Purchase Summary) | 'shipping' (User Details & shipping address) | 'payment'
  const [checkoutStep, setCheckoutStep] = useState<'closed' | 'summary' | 'shipping' | 'payment'>('closed');
  // Collected on the "User Details & shipping address" step, read back on
  // the Payment step's Contact/Shipping Address summary card.
  const [shippingInfo, setShippingInfo] = useState<any>(null);

  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);
  const openCheckout = () => setCheckoutStep('summary');
  const closeCheckout = () => setCheckoutStep('closed');
  const continueToShipping = () => setCheckoutStep('shipping');
  const continueToPayment = (form: any) => {
    setShippingInfo(form);
    setCheckoutStep('payment');
  };
  const backToShipping = () => setCheckoutStep('shipping');

  // Profile flow: null | 'profile' | 'otp'
  const [profileStep, setProfileStep] = useState<'profile' | 'otp' | null>(null);
  const [otpPhone, setOtpPhone] = useState('');
  const [profileData, setProfileData] = useState<ProfileFormData | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showSetupFlowPage, setShowSetupFlowPage] = useState(false);

  const openProfile = () => {
    // Already created a profile this session — go straight back to it
    // instead of re-showing the create-profile form.
    if (profileData) {
      setShowDashboard(true);
    } else {
      setProfileStep('profile');
    }
  };
  const closeProfileFlow = () => setProfileStep(null);
  const handleRequestOTP = (phone: string, data: ProfileFormData) => {
    setOtpPhone(phone);
    setProfileData(data);
    setProfileStep('otp');
  };
  const handleOTPSuccess = () => {
    setProfileStep(null);
    setShowDashboard(true);
  };
  const backToHome = () => setShowDashboard(false);

  const openSetupFlowPage = () => setShowSetupFlowPage(true);
  const closeSetupFlowPage = () => setShowSetupFlowPage(false);

  // Toggling showSetupFlowPage swaps which giant chunk of content is on
  // screen at the same scroll offset the user was at (homepage sections
  // are pinned-scroll GSAP timelines, so document height/positions change
  // completely). Reset scroll and let ScrollTrigger recompute against the
  // newly-visible layout, or the user lands mid-way inside a pinned section.
  useEffect(() => {
    window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [showSetupFlowPage]);

  const handleGetStarted = (plan: any) => {
    setCartPlan(plan);
  };

  const isMobile = useIsMobile();

  return (
    <div className="bg-black">
      <Header onOpenCart={openCart} onOpenProfile={openProfile} />
      {showDashboard && (
        <ProfileDashboard
          formData={profileData}
          cartPlan={cartPlan}
          onBack={backToHome}
          onLogout={backToHome}
        />
      )}
      {/* Marketing homepage stays mounted (never unmounted) even while the
          dashboard is shown — several sections below run pinned GSAP
          ScrollTriggers whose cleanup on unmount is unsafe (React "removeChild"
          crashes once GSAP has reparented pinned DOM nodes). Hiding via
          display:none avoids ever tearing them down. */}
      <div style={{ display: showDashboard || showSetupFlowPage ? 'none' : 'block' }}>
        <ErrorBoundary key={isMobile ? 'mobile' : 'desktop'}>
          {isMobile ? (
            <>
              <HeroMobile />
              <EcosystemAccordion />
              <MumTookDoseMobile />
              <FeaturesSectionMobile />
              <NobodyFallsMobile />
              <SetupSpecsSectionMobile onExploreFlow={openSetupFlowPage} />
            </>
          ) : (
            <>
              <Hero />
              <ConnectedEcosystem />
              <MumTookDose />
              <FeaturesSection />
              <NobodyFallsSection />
              <SetupSpecsSection onExploreFlow={openSetupFlowPage} />
            </>
          )}
        </ErrorBoundary>
        {isMobile ? <DownloadAppSectionMobile /> : <DownloadAppSection />}
        {isMobile ? (
          <SubscriptionSectionMobile onGetStarted={handleGetStarted} onOpenCart={openCart} />
        ) : (
          <SubscriptionSection onGetStarted={handleGetStarted} onOpenCart={openCart} />
        )}
        {isMobile ? <FAQSectionMobile /> : <FAQSection />}
        {!isMobile && <GetTakeCareStrip />}
      </div>
      {showSetupFlowPage && <SetupRefillFlowPage onBackHome={closeSetupFlowPage} />}
      {isMobile ? (
        <CartDrawerMobile
          plan={cartPlan}
          isOpen={cartOpen}
          onClose={closeCart}
          onCheckout={openCheckout}
        />
      ) : (
        <CartDrawer
          plan={cartPlan}
          isOpen={cartOpen}
          onClose={closeCart}
          onCheckout={openCheckout}
        />
      )}
      {isMobile ? (
        <CheckoutPageMobile
          plan={cartPlan}
          onBack={closeCheckout}
          onContinue={continueToShipping}
          isOpen={checkoutStep === 'summary'}
        />
      ) : (
        <CheckoutPage
          plan={cartPlan}
          onBack={closeCheckout}
          onContinue={continueToShipping}
          isOpen={checkoutStep === 'summary'}
        />
      )}
      {isMobile ? (
        <ShippingDetailsPageMobile isOpen={checkoutStep === 'shipping'} onContinue={continueToPayment} />
      ) : (
        <ShippingDetailsPage isOpen={checkoutStep === 'shipping'} onContinue={continueToPayment} />
      )}
      {isMobile ? (
        <PaymentPageMobile
          plan={cartPlan}
          shippingInfo={shippingInfo}
          isOpen={checkoutStep === 'payment'}
          onBack={backToShipping}
          onContinue={() => {}}
        />
      ) : (
        <PaymentPage
          plan={cartPlan}
          shippingInfo={shippingInfo}
          isOpen={checkoutStep === 'payment'}
          onBack={backToShipping}
          onContinue={() => {}}
        />
      )}
      {profileStep === 'profile' && (
        <ProfileModal onClose={closeProfileFlow} onRequestOTP={handleRequestOTP} />
      )}
      {profileStep === 'otp' && (
        <OTPModal phoneNumber={otpPhone} onClose={closeProfileFlow} onSuccess={handleOTPSuccess} />
      )}
    </div>
  );
}
