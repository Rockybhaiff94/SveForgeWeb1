import { Metadata } from "next";
import TopClient from "./TopClient";

export const metadata: Metadata = {
    title: "Top Rated Game Servers - ServerForge",
    description: "The highest rated game servers by players. Find the best communities curated by authentic player reviews.",
};

export default function TopRatedPage() {
    return <TopClient />;
}
