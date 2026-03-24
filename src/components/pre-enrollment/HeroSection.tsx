import { HeroContent } from "./HeroContent";
import { HeroIllustration } from "./HeroIllustration";
import { useResolvedUIAsset } from "@/hooks/useResolvedUIAsset";

/**
 * Pre-enrollment dashboard hero: full-bleed section, immersive soft gradients, grid content.
 */
export function HeroSection() {
  const heroImage = useResolvedUIAsset("dashboardHero");

  return (
    <section className="relative w-full overflow-visible bg-[var(--color-background)] py-16 md:py-20 lg:py-24">
      {/* Ambient light layers — all derived from --color-primary-rgb */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        {/* Primary focus glow — centered on content area */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 70% 40%, rgb(var(--color-primary-rgb) / 0.12), transparent 60%)",
          }}
        />
        {/* Left ambient */}
        <div
          className="absolute left-0 top-[42%] h-[min(130%,44rem)] w-[min(100vw,40rem)] -translate-x-[18%] -translate-y-1/2 rounded-full blur-[80px] sm:blur-[100px]"
          style={{
            background:
              "radial-gradient(ellipse 72% 58% at 35% 50%, rgb(var(--color-primary-rgb) / 0.055) 0%, transparent 72%)",
          }}
        />
        {/* Right accent */}
        <div
          className="absolute right-0 top-1/2 h-[min(125%,42rem)] w-[min(95vw,44rem)] translate-x-[12%] -translate-y-1/2 rounded-full blur-[90px] sm:blur-[110px]"
          style={{
            background:
              "radial-gradient(ellipse 68% 52% at 72% 48%, rgb(var(--color-primary-rgb) / 0.10) 0%, transparent 70%)",
          }}
        />
        {/* Bottom fade to page background */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/2 opacity-70"
          style={{
            background:
              "linear-gradient(to top, var(--color-background) 0%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12 lg:grid-cols-[1fr_1fr]">
          <HeroContent />
          <HeroIllustration imageSrc={heroImage} />
        </div>
      </div>
    </section>
  );
}
