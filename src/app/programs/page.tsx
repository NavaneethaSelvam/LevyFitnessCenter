import type { Metadata } from "next";
import ProgramsPage from "../../site-pages/ProgramsPage";

export const metadata: Metadata = {
  title: "Programs | Levy Fitness Center",
  description:
    "Explore strength, personal training, weight management, muscle building, cardio, and functional fitness directions.",
};

export default function Page() {
  return <ProgramsPage />;
}
