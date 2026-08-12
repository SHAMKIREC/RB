import HeroSection from "../components/HeroSection";
import ServicesGrid from "../components/ServicesGrid";
import WhyUs from "../components/WhyUs";
import DocumentationPreview from "../components/DocumentationPreview";
import VkBanner from "../components/VkBanner";
import NrvDigitalPromo from "../components/NrvDigitalPromo";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <WhyUs />
      <ServicesGrid />
      <DocumentationPreview />
      <VkBanner />
      <NrvDigitalPromo />
    </div>
  );
}
