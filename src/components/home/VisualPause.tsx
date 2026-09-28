"use client";

import { useEffect, useRef } from "react";
import { CoverPhoto } from "@/components/CoverPhoto";
import { homePhotos } from "@/lib/homePhotos";

export function VisualPause() {
  const frameRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    if (reduced || mobile) return;
    const onScroll = () => {
      const frame = frameRef.current;
      const photo = photoRef.current;
      if (!frame || !photo) return;
      photo.style.transform = `translate3d(0, ${frame.getBoundingClientRect().top * 0.2}px, 0)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={frameRef} className="relative h-[70vh] overflow-hidden">
      <div ref={photoRef} className="absolute inset-x-0 -top-[18%] h-[136%]">
        <CoverPhoto src={homePhotos.banner.src} alt={homePhotos.banner.alt} sizes="100vw" />
      </div>
    </section>
  );
}
