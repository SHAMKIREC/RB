import HeroSection from "../components/HeroSection";
import ServicesGrid from "../components/ServicesGrid";
import WhyUs from "../components/WhyUs";
import VkBanner from "../components/VkBanner";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <WhyUs />
      <ServicesGrid />
      <VkBanner />
    </div>
  );
}