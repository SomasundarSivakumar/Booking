import Image from "next/image";
import { HeroBanner } from "./components/Herobanner";
import { Booking } from "./components/Booking";
import { Cars } from "./components/Cars";
import { Consulting } from "./components/Consulting";

export default function Home() {
  return (
    <div className="w-full h-full">
      <HeroBanner />
      <Booking />
      <Cars />
      <Consulting />
    </div>
  );
}
