import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb"
    }
  },
  images: {
    // La evidencia vive en Supabase Storage. next/image necesita el host declarado para
    // poder optimizar y servir variantes responsivas a un movil de gama media.
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.supabase.in" }
    ],
    formats: ["image/avif", "image/webp"]
  },
  async redirects() {
    // La spec nombra la seccion /case-studies; el codigo publica en /cases y el MVP de 48h
    // prohibe cambiar el slug de un caso ya publicado. Se mantiene /cases como canonica y
    // se redirige /case-studies con 301 para cumplir la spec sin romper URLs indexadas.
    return [
      { source: "/case-studies", destination: "/cases", permanent: true },
      { source: "/case-studies/:slug", destination: "/cases/:slug", permanent: true },
      { source: "/diagnostic", destination: "/diagnostico", permanent: true }
    ];
  }
};

export default nextConfig;
