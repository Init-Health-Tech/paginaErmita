import { ArtisanDetails } from "@/components/home/ArtisanDetails";
import { FeaturedBanner } from "@/components/home/FeaturedBanner";
import { FinalCta } from "@/components/home/FinalCta";
import { Hero } from "@/components/home/Hero";
import { LifeAtErmita } from "@/components/home/LifeAtErmita";
import { QuickAccessCards } from "@/components/home/QuickAccessCards";
import { QuoteSection } from "@/components/home/QuoteSection";
import { Surroundings } from "@/components/home/Surroundings";
import { Testimonials } from "@/components/home/Testimonials";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 md:py-24">
      <Hero />
      <QuickAccessCards />
      <FeaturedBanner />
      <LifeAtErmita />
      <Surroundings />
      <Testimonials />
      <ArtisanDetails />
      <QuoteSection />
      <FinalCta />
    </div>
  );
}
