import { useEffect, useState } from "react";

/**
 * Returns true if the device supports hover (tablet/desktop).
 * Use to disable hover-based animations on mobile.
 */
export function useCanHover(): boolean {
  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover)");
    setCanHover(mq.matches);
    const handler = () => setCanHover(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return canHover;
}
