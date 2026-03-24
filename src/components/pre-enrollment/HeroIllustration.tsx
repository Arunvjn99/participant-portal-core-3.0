import { useReducedMotion } from "@/hooks/useReducedMotion";
import { isVideoAssetUrl } from "@/lib/isVideoAssetUrl";
import { cn } from "@/lib/utils";

interface HeroIllustrationProps {
  imageSrc: string;
  /** Decorative hero art; empty string omits alt for screen readers when appropriate. */
  alt?: string;
}

const HERO_IMAGE_CLASS =
  "mx-auto h-auto w-full max-h-[min(40vh,17.5rem)] object-contain object-center sm:max-h-[min(42vh,19rem)] md:mx-0 md:max-h-[min(46vh,22rem)] md:object-right lg:max-h-[min(48vh,25rem)] xl:max-h-[min(50vh,27rem)] 2xl:max-h-[min(52vh,29rem)]";

/** Larger caps for hero video so it matches the visual weight of the prior PNG illustration (+3px on rem caps). */
const HERO_VIDEO_CLASS =
  "mx-auto h-auto w-full max-h-[min(60vh,calc(28rem+3px))] object-contain object-center sm:max-h-[min(62vh,calc(30rem+3px))] md:mx-0 md:max-h-[min(66vh,calc(35rem+3px))] md:object-right lg:max-h-[min(68vh,calc(39rem+3px))] xl:max-h-[min(70vh,calc(43rem+3px))] 2xl:max-h-[min(72vh,calc(47rem+3px))]";

const HERO_IMAGE_WRAP =
  "w-full max-w-[16rem] sm:max-w-[18rem] md:max-w-[22rem] lg:max-w-[26rem] xl:max-w-[30rem] 2xl:max-w-[32rem]";

const HERO_VIDEO_WRAP =
  "w-full max-w-[calc(24rem+3px)] sm:max-w-[calc(28rem+3px)] md:max-w-[calc(34rem+3px)] lg:max-w-[calc(40rem+3px)] xl:max-w-[calc(44rem+3px)] 2xl:max-w-[calc(50rem+3px)]";

/**
 * Hero art stays within the grid column with capped width/height so large raster
 * assets (e.g. square exports) do not overpower the headline and CTA.
 */
export function HeroIllustration({ imageSrc, alt = "" }: HeroIllustrationProps) {
  const trimmed = imageSrc.trim();
  const reducedMotion = useReducedMotion();
  const isVideo = trimmed ? isVideoAssetUrl(trimmed) : false;

  const wrapClass = isVideo ? HERO_VIDEO_WRAP : HERO_IMAGE_WRAP;

  return (
    <div
      className={cn(
        "relative z-10 flex min-w-0 w-full justify-center md:justify-end",
        isVideo && "md:-translate-x-4 lg:-translate-x-6 xl:-translate-x-7",
      )}
    >
      <div className={wrapClass}>
        {trimmed && isVideo ? (
          <video
            className={HERO_VIDEO_CLASS}
            src={trimmed}
            autoPlay={!reducedMotion}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden={!alt}
            title={alt || undefined}
          />
        ) : trimmed ? (
          <img
            src={trimmed}
            alt={alt}
            loading="eager"
            decoding="async"
            className={HERO_IMAGE_CLASS}
          />
        ) : (
          <div
            className="mx-auto aspect-[4/3] w-full max-h-[min(40vh,17.5rem)] max-w-full bg-[var(--color-border)]/20 md:mx-0 md:aspect-[5/4]"
            aria-hidden
          />
        )}
      </div>
    </div>
  );
}
