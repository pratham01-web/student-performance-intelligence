import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable automatic creation of frontend/AGENTS.md to avoid duplicating the project-level AGENTS.md
  agentRules: false,
};

export default nextConfig;
