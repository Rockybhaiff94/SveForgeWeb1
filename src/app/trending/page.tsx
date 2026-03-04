import { Metadata } from "next";
import TrendingClient from "./TrendingClient";

export const metadata: Metadata = {
    title: "Trending Game Servers - ServerForge",
    description: "The hottest game servers right now. Check out the communities currently trending the fastest in ServerForge.",
};

export default function TrendingPage() {
    return <TrendingClient />;
}
