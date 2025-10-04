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
        <div className="relative bg-[url(/images/mobile_hero_image.svg)] md:bg-[url(/images/bg.svg)] bg-contain bg-no-repeat w-full min-h-[493px] md:bg-cover">
          <div className="max-w-[1440px] w-full mx-auto relative">
            <Navbar />
            <HeroSection />

            <div className="absolute md:px-8 px-12 top-24 right-0 z-50">
              <Socials />
            </div>
          </div>
        </div>
      </section>
      <AboutUs />
      <WhatWeOffer />
      <OurSponsors />
      <Footer />
    </div>
  );
}
