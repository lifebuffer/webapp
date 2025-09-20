import { createFileRoute } from '@tanstack/react-router';
import { DataPrivacy } from '@/components/DataPrivacy';
import { FAQSection } from '@/components/FAQSection';
import { Features } from '@/components/Features';
import { Hero } from '@/components/Hero';
import { OpenSource } from '@/components/OpenSource';
import { Pricing } from '@/components/Pricing';
import { ProblemSolution } from '@/components/ProblemSolution';
// import { SocialProof } from '@/components/SocialProof';
import { Status } from '@/components/Status';
import { UseCases } from '@/components/UseCases';
import { useHashNavigation } from '@/hooks/useHashNavigation';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  useHashNavigation();

  return (
    <>
      <Hero />
      <ProblemSolution />
      <UseCases />
      <Features />
      <Status />
      <DataPrivacy />
      <OpenSource />
      {/* <SocialProof /> */}
      <Pricing />
      <FAQSection />
    </>
  );
}

export default App;
