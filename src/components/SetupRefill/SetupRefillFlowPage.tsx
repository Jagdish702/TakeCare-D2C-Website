import { useIsMobile } from '../../hooks/useIsMobile';
import FlowBreadcrumb from './FlowBreadcrumb';
import SetupRefill from './SetupRefill';
import SetupRefillJourneySection from '../SetupRefillJourney/SetupRefillJourneySection';
import SpecificationsSection from '../Specifications/SpecificationsSection';
import SetupRefillJourneyMobile from '../mobile/SetupRefillJourneyMobile';
import SpecificationsMobile from '../mobile/SpecificationsMobile';

/**
 * "Set Up, Refill & Specifications" flow page — Figma node 13222:18278
 * (desktop) / 13222:18315 (mobile). Reached from any "Explore the flow"
 * button (SetupSpecsSection / SetupSpecsSectionMobile). The site's <Header>
 * is rendered once at the App level and stays visible above this page (same
 * pattern as ProfileDashboard).
 *
 * Desktop reuses the scroll-scrubbed SetupRefillJourneySection /
 * SpecificationsSection as-is. Mobile has its own dedicated, simpler static
 * sections (SetupRefillJourneyMobile / SpecificationsMobile) matching the
 * separate mobile Figma frame, same split-by-breakpoint convention as the
 * rest of the site (Hero/HeroMobile, NobodyFallsSection/NobodyFallsMobile, ...).
 */
interface SetupRefillFlowPageProps {
  onBackHome: () => void;
}

export default function SetupRefillFlowPage({ onBackHome }: SetupRefillFlowPageProps) {
  const isMobile = useIsMobile();

  return (
    <div className="bg-white">
      <FlowBreadcrumb onHome={onBackHome} />
      <SetupRefill />
      {isMobile ? (
        <>
          <SetupRefillJourneyMobile />
          <SpecificationsMobile />
        </>
      ) : (
        <>
          <SetupRefillJourneySection />
          <SpecificationsSection />
        </>
      )}
    </div>
  );
}
