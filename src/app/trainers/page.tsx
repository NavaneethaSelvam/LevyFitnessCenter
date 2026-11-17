import type { Metadata } from "next";
import TrainersPage from "../../site-pages/TrainersPage";

export const metadata: Metadata = {
  title: "Trainers | Levy Fitness Center",
  description:
    "Meet the Levy Fitness Center coaching team. Profiles and qualifications will be added when confirmed.",
};

export default function Page() {
  return <TrainersPage />;
}
