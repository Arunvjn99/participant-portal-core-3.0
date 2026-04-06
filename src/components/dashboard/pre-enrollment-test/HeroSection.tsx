/**
 * Hero section for the AI Studio prototype test dashboard.
 * Extracted from figma-dump/retiresmart-pre-enrollment-portal – for test use only.
 */
import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";

const MOCK_USER = { name: "Alex", company: "Acme Corp" };

/**
 * Hero banner: use your Whisk export for the new image.
 * 1. Open https://labs.google/fx/tools/whisk/share/5e90633qs0000
 * 2. Download/save the image (right-click → Save image, or use any export option)
 * 3. Save it as public/hero-whisk.png in this project
 * The component will use it; if missing, it falls back to the default banner.
 */
const HERO_IMAGE_LOCAL = "/hero-whisk.png";
const HERO_IMAGE_WHISK_API =
  "https://labs.google/fx/api/og-image/5e90633qs0000";
const HERO_IMAGE_FALLBACK =
  "https://labs.google/fx/api/og-image/2bml8n3o0g000";

const HERO_IMAGE_CHAIN = [
  HERO_IMAGE_LOCAL,
  HERO_IMAGE_WHISK_API,
  HERO_IMAGE_FALLBACK,
] as const;

interface HeroSectionProps {
  /** Optional class for the hero content container so it aligns with the page grid. Image stays outside. */
  gridContainerClass?: string;
}

export function HeroSection({ gridContainerClass }: HeroSectionProps) {
  const [imgIndex, setImgIndex] = useState(0);
  const imgSrc = HERO_IMAGE_CHAIN[imgIndex];
  const { scrollY } = useScroll();
  const videoY = useTransform(scrollY, [0, 500], [0, 150]);
  const videoScale = useTransform(scrollY, [0, 500], [1, 1.1]);

  const handleImgError = () => {
    setImgIndex((i) =>
      i < HERO_IMAGE_CHAIN.length - 1 ? i + 1 : i
    );
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden isolate">
      <motion.div
        style={{ y: videoY, scale: videoScale }}
        className="absolute inset-0 w-full h-full -z-10 bg-[var(--color-background-tertiary)]"
      >
        <img
          key={imgSrc}
          src={imgSrc}
          alt="Hero Background"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={handleImgError}
        />
      </motion.div>

      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.75) 40%, rgba(255,255,255,0.0) 70%)",
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F4F7FB] to-transparent z-10" />

      <div
        className={`${gridContainerClass ?? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"} w-full relative z-10`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-blue-600 font-bold text-xl mb-4"
              >
                Good morning, {MOCK_USER.name}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-[60px] font-black tracking-tighter mb-6 text-[var(--color-text)] leading-[1.1]"
              >
                Let's build your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  future together.
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-[var(--color-text-secondary)] text-[18px] leading-relaxed mb-10 max-w-2xl font-medium"
              >
                {MOCK_USER.company} offers a premium 401(k) retirement plan designed to help your wealth grow
                effortlessly through smart, automated investing.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-10"
              >
                <div className="flex flex-col gap-3">
                  <motion.button
                    type="button"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 25px 50px -12px rgba(37, 99, 235, 0.4)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="px-14 py-7 bg-blue-600 text-white font-bold rounded-3xl shadow-[0_20px_40px_rgba(37,99,235,0.25)] hover:bg-blue-700 transition-all text-2xl flex items-center justify-center gap-4 group"
                  >
                    Start Enrollment
                    <ArrowRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                  <p className="text-[var(--color-text-tertiary)] text-sm font-semibold pl-2 tracking-wide">
                    Secure 3-minute setup.
                  </p>
                </div>
                <button
                  type="button"
                  className="text-[var(--color-text)] font-bold text-xl hover:text-blue-600 transition-all flex items-center gap-2 group"
                >
                  Learn about the plan
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
