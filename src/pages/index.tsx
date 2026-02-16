import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Tagline } from "@/components/Tagline";
import { Founders } from "@/components/Founders";
import { Offerings } from "@/components/Offerings";
import { Pricing } from "@/components/Pricing";
import { Schedule } from "@/components/Schedule";
import { Testimonials } from "@/components/Testimonials";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

export default function Home() {
  return (
    <>
      <SEO
        title="Fight&Flight - Where Grit Meets Grace"
        description="Luxury boutique fitness combining Muay Thai intensity with aerial artistry. Transform your body and mind through cinematic training experiences."
        image="/logo.png"
      />
      <main className="bg-black min-h-screen">
        <Navigation />
        <Hero />
        <Tagline />
        <Founders />
        <Offerings />
        <Schedule />
        <Pricing />
        <Testimonials />
        <CTA />
        <Footer />
      </main>
    </>
  );
}