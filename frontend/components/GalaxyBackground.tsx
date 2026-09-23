"use client";

import React from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const Galaxy = dynamic(() => import("@/components/Galaxy"), {
  ssr: false,
});

export function GalaxyBackground() {
  const pathname = usePathname();

  // If on login, the login page uses Strands
  if (pathname === "/login") {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 h-full w-full overflow-hidden pointer-events-none select-none bg-black"
    >
      <Galaxy
        mouseRepulsion={true}
        mouseInteraction={true}
        density={1.5}
        glowIntensity={0.6}
        saturation={0.8}
        hueShift={240}
        transparent={false}
      />
    </div>
  );
}
