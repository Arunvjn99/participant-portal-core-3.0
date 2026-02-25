import { useEffect, useState } from "react";

// In future, this can be fetched dynamically from Supabase storage list API.
const IMAGES = ["Container_1.png", "Container_2.png", "Container_3.png"];

function getStorageBaseUrl(): string {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  if (!url) return "";
  const base = url.replace(/\/$/, "");
  return `${base}/storage/v1/object/public/company-logos/`;
}

export default function LeftPanelCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const baseUrl = getStorageBaseUrl();

  useEffect(() => {
    if (!IMAGES.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!baseUrl || !IMAGES.length) return;
    IMAGES.forEach((name) => {
      const img = new Image();
      img.src = `${baseUrl}${name}`;
    });
  }, [baseUrl]);

  if (!IMAGES.length) return null;
  if (!baseUrl) return null;

  return (
    <div className="relative w-full flex justify-center items-center">
      <img
        src={`${baseUrl}${IMAGES[currentIndex]}`}
        alt="Plan Preview"
        className="w-full max-w-[520px] object-contain transition-opacity duration-500"
        loading="lazy"
      />
    </div>
  );
}
