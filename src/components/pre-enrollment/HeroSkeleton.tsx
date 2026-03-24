/** Skeleton aligned with full-bleed immersive hero (content + illustration). */
export const HeroSkeleton = () => (
  <section className="relative w-full overflow-visible bg-[var(--color-background)] py-16 md:py-20 lg:py-24">
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
      <div
        className="absolute left-0 top-[42%] h-[min(130%,44rem)] w-[min(100vw,40rem)] -translate-x-[18%] -translate-y-1/2 rounded-full blur-[80px] opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 72% 58% at 35% 50%, rgb(var(--enroll-brand-rgb) / 0.06) 0%, transparent 72%)",
        }}
      />
      <div
        className="absolute right-0 top-1/2 h-[min(125%,42rem)] w-[min(95vw,44rem)] translate-x-[12%] -translate-y-1/2 rounded-full blur-[90px] opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 68% 52% at 72% 48%, rgb(var(--enroll-brand-rgb) / 0.1) 0%, transparent 70%)",
        }}
      />
    </div>
    <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div
        className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12 lg:grid-cols-[1.1fr_0.9fr]"
        aria-hidden
      >
        <div className="flex max-w-xl flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="h-5 w-44 animate-pulse rounded bg-[var(--color-border)]" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-[var(--color-border)]" />
            <div className="h-20 w-full animate-pulse rounded-lg bg-[var(--color-border)]" />
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="h-12 w-40 animate-pulse rounded-lg bg-[var(--color-border)]" />
            <div className="h-12 w-44 animate-pulse rounded-lg bg-[var(--color-border)]" />
          </div>
          <div className="h-4 w-36 animate-pulse rounded bg-[var(--color-border)]" />
        </div>
        <div className="flex w-full justify-center overflow-visible md:justify-end">
          <div className="aspect-[4/3] w-full max-w-[15rem] shrink-0 animate-pulse bg-[var(--color-border)]/30 sm:max-w-[17.5rem] md:aspect-[5/4] md:max-w-none md:w-[118%] md:min-h-[16rem] md:translate-x-1 lg:w-[126%] lg:translate-x-3 xl:w-[136%] xl:translate-x-6 2xl:w-[142%] 2xl:translate-x-10" />
        </div>
      </div>
    </div>
  </section>
);
