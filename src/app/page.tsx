import type { Metadata } from "next";
import HomePage from "../site-pages/HomePage";

export const metadata: Metadata = {
  title: "Train for what's next | Levy Fitness Center",
  description:
    "Find your focus at Levy Fitness Center. Explore strength, personal training, cardio, and more.",
};

export default function Page() {
  return <HomePage />;
}
