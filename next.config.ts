import type { NextConfig } from "next";

// Statischer Export: die Strecke hat kein Backend und läuft als reine
// Client-App, deploybar auf GitHub Pages (basePath kommt aus der CI-Umgebung)
const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  images: { unoptimized: true },
};

export default nextConfig;
