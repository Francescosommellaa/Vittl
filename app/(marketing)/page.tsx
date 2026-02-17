import Hero from "./components/Hero";
import ProblemSection from "./components/ProblemSection";
import FeaturesGrid from "./components/Features";
import FeatureShowcase from "./components/FeatureShowcase";
import PricingTeaser from "./components/PricingTeaser";
import CTA from "./components/CTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <ProblemSection />
      <FeaturesGrid />
      <FeatureShowcase />
      <PricingTeaser />
      <CTA />
    </main>
  );
}
