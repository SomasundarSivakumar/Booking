import Image from "next/image";
import { HeroBanner } from "./components/Herobanner";
import { Booking } from "./components/Booking";
import { Cars } from "./components/Cars";

export default function Home() {
  return (
    <div className="w-full h-full">
      <HeroBanner />
      <Booking />
      <Cars />
    </div>
  );
}
