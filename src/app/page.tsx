import Image from "next/image";
import { HeroBanner } from "./components/Herobanner";
import { Booking } from "./components/Booking";
// import { Consulting } from "./components/Consulting";
import { ComingSoon } from "./components/ComingSoon";
import { TouristPlaces } from "./components/TouristPlaces";
import { ContactUs } from "./components/ContactUs";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
    <div className="w-full h-full">
      <HeroBanner />
      <Booking />
      <TouristPlaces />
      {/* <Consulting /> */}
      <ComingSoon />
      <ContactUs />
      <Footer />
    </div>
  );
}
