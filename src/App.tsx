import { useEffect, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsMobile } from './hooks/useIsMobile';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
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
import CareForPage from './components/Checkout/CareForPage';
import CareForPageMobile from './components/Checkout/CareForPageMobile';
import PersonDetailsPage from './components/Checkout/PersonDetailsPage';
import PersonDetailsPageMobile from './components/Checkout/PersonDetailsPageMobile';
import CaregiverConfirmPage from './components/Checkout/CaregiverConfirmPage';
import CaregiverConfirmPageMobile from './components/Checkout/CaregiverConfirmPageMobile';
import GiftPage from './components/Checkout/GiftPage';
import GiftPageMobile from './components/Checkout/GiftPageMobile';
import GiftSummaryPage from './components/Checkout/GiftSummaryPage';
import GiftSummaryPageMobile from './components/Checkout/GiftSummaryPageMobile';
import CaregiverOrderDetailsPage from './components/Checkout/CaregiverOrderDetailsPage';
import CaregiverOrderDetailsPageMobile from './components/Checkout/CaregiverOrderDetailsPageMobile';
import OrderDetailsPage from './components/Checkout/OrderDetailsPage';
import OrderDetailsPageMobile from './components/Checkout/OrderDetailsPageMobile';
import PaymentPage from './components/Checkout/PaymentPage';
import PaymentPageMobile from './components/Checkout/PaymentPageMobile';
import OrderConfirmationPage from './components/Checkout/OrderConfirmationPage';
import OrderConfirmationPageMobile from './components/Checkout/OrderConfirmationPageMobile';
import FAQSection from './components/FAQ/FAQSection';
import FAQSectionMobile from './components/mobile/FAQSectionMobile';
import GetTakeCareStrip from './components/GetTakeCareStrip/GetTakeCareStrip';
import ProfileModal from './components/ProfileModal/ProfileModal';
import OTPModal from './components/OTPModal/OTPModal';
import ProfileDashboard, { type ProfileFormData } from './components/ProfileDashboard/ProfileDashboard';
import ProfileDashboardMobile from './components/ProfileDashboard/ProfileDashboardMobile';

export default function App() {
  const [cartPlan, setCartPlan] = useState<any>(null);
  const [cartOpen, setCartOpen] = useState(false);
  // Checkout flow: 'closed' | 'summary' (Purchase Summary) | 'shipping' (User Details & shipping address) | 'careFor' (Who is this care for?) | 'personDetails' (Enter the details of the person, only for "Someone else") | 'caregiverConfirm' (Would you like to be the caregiver of..., only for "Someone else") | 'gift' (Is it a gift?, only for "Someone else") | 'giftSummary' (Dispenser will be delivered with this gift card — final review, when "Someone else" + a gift) | 'caregiverOrderDetails' (Check order Details w/ recipient+caregiver cards, when "Someone else" + not a gift) | 'orderDetails' (Check order Details, single card, "Me" path) | 'payment' | 'confirmation' (Order Confirmation, post-payment)
  const [checkoutStep, setCheckoutStep] = useState<
    'closed' | 'summary' | 'shipping' | 'careFor' | 'personDetails' | 'caregiverConfirm' | 'gift' | 'giftSummary' | 'caregiverOrderDetails' | 'orderDetails' | 'payment' | 'confirmation'
  >('closed');
  // Collected on the "User Details & shipping address" step, read back on
  // the Order Details / Payment steps' delivery/contact summaries.
  const [shippingInfo, setShippingInfo] = useState<any>(null);
  // 'me' | 'someone-else', picked on the "Who is this care for?" step, read
  // back on Order Details to pick which avatar to show.
  const [careForSelection, setCareForSelection] = useState<string | null>(null);
  // Collected on "Enter the details of the person" (only reached when
  // careForSelection === 'someone-else') — takes over from shippingInfo as
  // the recipient shown on Order Details when present.
  const [personDetails, setPersonDetails] = useState<any>(null);

  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);
  const openCheckout = () => setCheckoutStep('summary');
  const closeCheckout = () => setCheckoutStep('closed');
  const continueToShipping = () => setCheckoutStep('shipping');
  const continueToCareFor = (form: any) => {
    setShippingInfo(form);
    setCheckoutStep('careFor');
  };
  const continueFromCareFor = (careFor: string) => {
    setCareForSelection(careFor);
    setPersonDetails(null);
    setCheckoutStep(careFor === 'someone-else' ? 'personDetails' : 'orderDetails');
  };
  const continueToCaregiverConfirm = (form: any) => {
    setPersonDetails(form);
    setCheckoutStep('caregiverConfirm');
  };
  // Whether the account holder agreed to be the caregiver on
  // CaregiverConfirmPage — both options lead to GiftPage either way, but
  // this is remembered so the review/Payment/Confirmation screens further
  // down know whether to show a "Caregiver" card/label at all (declining
  // drops it, leaving just the recipient shown as "Patient").
  const [isCaregiver, setIsCaregiver] = useState<boolean | null>(null);
  const continueFromCaregiverConfirm = (confirmed: boolean) => {
    setIsCaregiver(confirmed);
    setCheckoutStep('gift');
  };
  // GiftPage's two options both lead to a final review screen, but which
  // one depends on the answer: "Yes, It's a gift" shows the gift card
  // (giftSummary), "No, it's not" shows the plain two-card review
  // (caregiverOrderDetails). Remembered so Payment's Back button can
  // return to the right one.
  const [isGift, setIsGift] = useState<boolean | null>(null);
  const continueFromGift = (giftAnswer: boolean) => {
    setIsGift(giftAnswer);
    setCheckoutStep(giftAnswer ? 'giftSummary' : 'caregiverOrderDetails');
  };
  const continueToPayment = () => setCheckoutStep('payment');
  // Payment's Back button returns to whichever review screen led here:
  // giftSummary/caregiverOrderDetails for the "someone else" path
  // (orderDetails is bypassed entirely there), orderDetails otherwise.
  const backFromPayment = () =>
    setCheckoutStep(careForSelection === 'someone-else' ? (isGift ? 'giftSummary' : 'caregiverOrderDetails') : 'orderDetails');

  // Which plan (if any) shows the blue "Current Plan" badge/border on the
  // subscription cards — set once the demo Payment flow's "View Order"
  // (the payment_successful Status Card's primary button) confirms a
  // purchase, since this app has no real login/subscription backend.
  const [currentPlanKey, setCurrentPlanKey] = useState<string | null>(null);
  const confirmPlanPurchase = () => {
    if (cartPlan) setCurrentPlanKey(cartPlan.key);
    setCheckoutStep('confirmation');
  };

  // Order Confirmation's "Back to dashboard" — closes the checkout overlay
  // and scrolls the (now-visible) home page down to the subscription cards,
  // where the plan just purchased shows its "Current Plan" badge/border.
  const backToDashboardFromOrder = () => {
    closeCheckout();
    requestAnimationFrame(() => {
      document.getElementById('subscription-plans')?.scrollIntoView({ behavior: 'smooth' });
    });
  };

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

  // Order Details shows whoever the care is actually for: the person-details
  // form (when "Someone else" was picked) takes over from the account
  // holder's own shippingInfo.
  const orderRecipient =
    careForSelection === 'someone-else' && personDetails
      ? {
          firstName: personDetails.fullName,
          lastName: '',
          phone: personDetails.phone,
          address1: personDetails.address1,
          city: personDetails.city,
          state: personDetails.state,
          pincode: personDetails.pincode,
          country: personDetails.country,
        }
      : shippingInfo;

  const isMobile = useIsMobile();

  return (
    <div className="bg-black">
      <Header onOpenCart={openCart} onOpenProfile={openProfile} />
      {showDashboard && (
        isMobile ? (
          <ProfileDashboardMobile
            formData={profileData}
            cartPlan={cartPlan}
            onBack={backToHome}
            onLogout={backToHome}
          />
        ) : (
          <ProfileDashboard
            formData={profileData}
            cartPlan={cartPlan}
            onBack={backToHome}
            onLogout={backToHome}
          />
        )
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
          <SubscriptionSectionMobile onGetStarted={handleGetStarted} onOpenCart={openCart} currentPlanKey={currentPlanKey} />
        ) : (
          <SubscriptionSection onGetStarted={handleGetStarted} onOpenCart={openCart} currentPlanKey={currentPlanKey} />
        )}
        {isMobile ? <FAQSectionMobile /> : <FAQSection />}
        <Footer />
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
        <ShippingDetailsPageMobile isOpen={checkoutStep === 'shipping'} onContinue={continueToCareFor} />
      ) : (
        <ShippingDetailsPage isOpen={checkoutStep === 'shipping'} onContinue={continueToCareFor} />
      )}
      {isMobile ? (
        <CareForPageMobile isOpen={checkoutStep === 'careFor'} onContinue={continueFromCareFor} />
      ) : (
        <CareForPage isOpen={checkoutStep === 'careFor'} onContinue={continueFromCareFor} />
      )}
      {isMobile ? (
        <PersonDetailsPageMobile isOpen={checkoutStep === 'personDetails'} onContinue={continueToCaregiverConfirm} />
      ) : (
        <PersonDetailsPage isOpen={checkoutStep === 'personDetails'} onContinue={continueToCaregiverConfirm} />
      )}
      {isMobile ? (
        <CaregiverConfirmPageMobile personDetails={personDetails} isOpen={checkoutStep === 'caregiverConfirm'} onConfirm={continueFromCaregiverConfirm} />
      ) : (
        <CaregiverConfirmPage personDetails={personDetails} isOpen={checkoutStep === 'caregiverConfirm'} onConfirm={continueFromCaregiverConfirm} />
      )}
      {isMobile ? (
        <GiftPageMobile isOpen={checkoutStep === 'gift'} onSelect={continueFromGift} />
      ) : (
        <GiftPage isOpen={checkoutStep === 'gift'} onSelect={continueFromGift} />
      )}
      {isMobile ? (
        <GiftSummaryPageMobile
          shippingInfo={shippingInfo}
          personDetails={personDetails}
          isCaregiver={isCaregiver}
          isOpen={checkoutStep === 'giftSummary'}
          onDone={continueToPayment}
        />
      ) : (
        <GiftSummaryPage
          shippingInfo={shippingInfo}
          personDetails={personDetails}
          isCaregiver={isCaregiver}
          isOpen={checkoutStep === 'giftSummary'}
          onDone={continueToPayment}
        />
      )}
      {isMobile ? (
        <CaregiverOrderDetailsPageMobile
          shippingInfo={shippingInfo}
          personDetails={personDetails}
          isCaregiver={isCaregiver}
          isOpen={checkoutStep === 'caregiverOrderDetails'}
          onDone={continueToPayment}
        />
      ) : (
        <CaregiverOrderDetailsPage
          shippingInfo={shippingInfo}
          personDetails={personDetails}
          isCaregiver={isCaregiver}
          isOpen={checkoutStep === 'caregiverOrderDetails'}
          onDone={continueToPayment}
        />
      )}
      {isMobile ? (
        <OrderDetailsPageMobile
          shippingInfo={orderRecipient}
          careForSelection={careForSelection}
          isOpen={checkoutStep === 'orderDetails'}
          onDone={continueToPayment}
        />
      ) : (
        <OrderDetailsPage
          shippingInfo={orderRecipient}
          careForSelection={careForSelection}
          isOpen={checkoutStep === 'orderDetails'}
          onDone={continueToPayment}
        />
      )}
      {isMobile ? (
        <PaymentPageMobile
          plan={cartPlan}
          shippingInfo={shippingInfo}
          personDetails={personDetails}
          careForSelection={careForSelection}
          isCaregiver={isCaregiver}
          isOpen={checkoutStep === 'payment'}
          onBack={backFromPayment}
          onContinue={confirmPlanPurchase}
        />
      ) : (
        <PaymentPage
          plan={cartPlan}
          shippingInfo={shippingInfo}
          personDetails={personDetails}
          careForSelection={careForSelection}
          isCaregiver={isCaregiver}
          isOpen={checkoutStep === 'payment'}
          onBack={backFromPayment}
          onContinue={confirmPlanPurchase}
        />
      )}
      {isMobile ? (
        <OrderConfirmationPageMobile
          plan={cartPlan}
          shippingInfo={shippingInfo}
          personDetails={personDetails}
          careForSelection={careForSelection}
          isCaregiver={isCaregiver}
          isOpen={checkoutStep === 'confirmation'}
          onBackToDashboard={backToDashboardFromOrder}
          onTrackOrder={() => { closeCheckout(); openProfile(); }}
        />
      ) : (
        <OrderConfirmationPage
          plan={cartPlan}
          shippingInfo={shippingInfo}
          personDetails={personDetails}
          careForSelection={careForSelection}
          isCaregiver={isCaregiver}
          isOpen={checkoutStep === 'confirmation'}
          onBackToDashboard={backToDashboardFromOrder}
          onTrackOrder={() => { closeCheckout(); openProfile(); }}
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
