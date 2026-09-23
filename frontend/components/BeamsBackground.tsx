"use client";

import React from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// Dynamically import Beams to avoid SSR canvas initialization issues
const Beams = dynamic(() => import("@/components/Beams"), {
  ssr: false,
});

export function BeamsBackground() {
  const pathname = usePathname();

  // If on login, the login page uses its dedicated Strands animation
  if (pathname === "/login") {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 h-full w-full overflow-hidden pointer-events-none select-none bg-black"
    >
      <Beams
        beamWidth={2}
        beamHeight={15}
        beamNumber={12}
        lightColor="#94a3b8"
        speed={2}
        noiseIntensity={1.75}
        scale={0.2}
        rotation={0}
      />
    </div>
  );
}

export default BeamsBackground;
