import NeobrutalLanding from "@/components/landing/NeobrutalLanding";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviora — Landing",
  description: "Neobrutalist product landing: goals, demo, metrics, and stories.",
};

export default function LandingRoutePage() {
  return (
    <main className="mx-0 flex w-full max-w-none flex-col gap-0 bg-transparent px-0 pt-0">
      <NeobrutalLanding />
    </main>
  );
}
