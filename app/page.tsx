import type { Metadata } from "next";
import HomeClient from "./home-client";

export const metadata: Metadata = {
  title: "Dialog Builder - Quest Dialog Management",
  description: "Create, edit, and manage quest dialogs with branching conversations and multi-page narratives",
  keywords: ["dialog", "quest", "game development", "dialogue system"],
  openGraph: {
    title: "Dialog Builder",
    description: "Create and manage quest dialogs for game development",
    type: "website",
  },
};

export default function Page() {
  return <HomeClient />;
}
