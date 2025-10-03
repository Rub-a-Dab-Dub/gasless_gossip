import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import AboutUs from "../components/about";
import WhatWeOffer from "../components/whatWeOffer";
import OurSponsors from "../components/ourSponsors";
import Footer from "../components/Footer";
import Socials from "../components/ui/socialsOverlay";

export default function Home() {
  return (
    <div className="bg-[#F1F7F6] relative">
      <section>
        <div className="relative bg-[url(/images/mobile_hero_image.svg)] md:bg-[url(/images/bg.svg)] bg-contain bg-no-repeat w-full min-h-[493px]">
          <Navbar />
          <HeroSection />
        </div>
        <div className="absolute px-12 top-24 right-0 z-50">
          <Socials />
        </div>
      </section>
      <AboutUs />
      <WhatWeOffer />
      <OurSponsors />
      <Footer />
    </div>
  );
}
