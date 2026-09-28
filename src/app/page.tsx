import { FinalCta } from "@/components/home/FinalCta";
import { Hero } from "@/components/home/Hero";
import { LifeAtErmita } from "@/components/home/LifeAtErmita";
import { Presentation } from "@/components/home/Presentation";
import { QuoteSection } from "@/components/home/QuoteSection";
import { Reveal } from "@/components/Reveal";
import { Testimonials } from "@/components/home/Testimonials";
import { ThreePaths } from "@/components/home/ThreePaths";
import { VisualPause } from "@/components/home/VisualPause";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Reveal>
        <Presentation />
      </Reveal>
      <Reveal>
        <ThreePaths />
      </Reveal>
      <Reveal>
        <LifeAtErmita />
      </Reveal>
      <VisualPause />
      <Reveal>
        <Testimonials />
      </Reveal>
      <QuoteSection />
      <FinalCta />
    </>
  );
}
