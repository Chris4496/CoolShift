import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Cool Shift · Powered by CLP",
    short_name: "Cool Shift",
    description:
      "Small actions, everyday value. A personal AI energy assistant for Hong Kong households.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f6f6f4",
    theme_color: "#f6f6f4",
    categories: ["utilities", "lifestyle"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Ask Cool Shift", url: "/ask", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Rewards", url: "/rewards", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
