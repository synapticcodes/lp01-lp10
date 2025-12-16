
import { BackRedirectHero } from "@/components/sections/BackRedirectHero";
import { CountdownTimer } from "@/components/sections/CountdownTimer";
import { BenefitsGrid } from "@/components/sections/BenefitsGrid";
import { SocialProofCard } from "@/components/sections/SocialProofCard";
import { BackRedirectFAQ } from "@/components/sections/BackRedirectFAQ";
import { StickyBottomCTA } from "@/components/sections/StickyBottomCTA";

const BackRedirect = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-lavender-50 to-white">
      <BackRedirectHero />
      <CountdownTimer />
      <BenefitsGrid />
      <SocialProofCard />
      <BackRedirectFAQ />
      <StickyBottomCTA />
    </div>
  );
};

export default BackRedirect;
