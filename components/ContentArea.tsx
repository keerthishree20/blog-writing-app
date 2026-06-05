"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ScrollInspirationBanner from "./ScrollInspirationBanner";

export default function ContentArea({ children }: { children: React.ReactNode }) {
  const mainRef = useRef<HTMLElement>(null);
  const [scrolling, setScrolling] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastScrollTop = useRef(0);

  const handleScroll = useCallback(() => {
    const el = mainRef.current;
    if (!el) return;
    const currentTop = el.scrollTop;
    const scrollingDown = currentTop > lastScrollTop.current;
    lastScrollTop.current = currentTop;

    if (scrollingDown) {
      setScrolling(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setScrolling(false), 1000);
    }
  }, []);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", handleScroll);
      clearTimeout(timerRef.current);
    };
  }, [handleScroll]);

  return (
    <>
      <ScrollInspirationBanner visible={scrolling} />
      <main
        ref={mainRef}
        className="flex-1 overflow-y-auto bg-stone-50 dark:bg-zinc-950"
      >
        <div className="mx-auto max-w-3xl px-4 py-6 md:px-8 md:py-10">{children}</div>
      </main>
    </>
  );
}
