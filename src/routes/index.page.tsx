import type{ PageProps } from "rakkasjs";
import { HeroSection } from "./_components/landing/HeroSection";
import { Products } from "./products/_components/Products";

export default function HomePage({}: PageProps) {
  
  return (
    <main className="flex h-fit w-full flex-col  items-center ">
      <HeroSection />
      <Products />
    </main>
  );
}
