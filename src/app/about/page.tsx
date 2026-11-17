import type { Metadata } from "next";
import AboutPage from "../../site-pages/AboutPage";

export const metadata: Metadata = {
  title: "About us | Levy Fitness Center",
  description:
    "Discover Levy Fitness Center's approach to focused, personal, sustainable training.",
};

export default function Page() {
  return <AboutPage />;
}
