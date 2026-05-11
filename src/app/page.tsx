import Image from "next/image";
import { HeroBanner } from "./components/Herobanner";
import { Booking } from "./components/Booking";
import { Cars } from "./components/Cars";
// import { Consulting } from "./components/Consulting";
import { ComingSoon } from "./components/ComingSoon";
import { TouristPlaces } from "./components/TouristPlaces";

export default function Home() {
  return (
    <div className="w-full h-full">
      <HeroBanner />
      <Booking />
      <Cars />
      <TouristPlaces />
      {/* <Consulting /> */}
      <ComingSoon />
    </div>
  );
}
