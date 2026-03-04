import { Metadata } from "next";
import LandingPageContent from "@/components/home/LandingPageContent";

export const metadata: Metadata = {
  title: "ServerForge – Discover the Best Gaming Servers",
  description: "Find the best Minecraft, FiveM, Rust, and CS2 servers. List your server and grow your community.",
  openGraph: {
    title: "ServerForge – Discover the Best Gaming Servers",
    description: "Find the best Minecraft, FiveM, Rust, and CS2 servers. List your server and grow your community.",
    type: "website",
  }
};

export default function HomePage() {
  return <LandingPageContent />;
}
