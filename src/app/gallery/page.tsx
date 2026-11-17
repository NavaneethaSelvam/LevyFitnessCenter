import type { Metadata } from "next";
import GalleryPage from "../../site-pages/GalleryPage";

export const metadata: Metadata = {
  title: "Gallery | Levy Fitness Center",
  description:
    "Explore the Levy Fitness Center spaces, equipment, and training imagery.",
};

export default function Page() {
  return <GalleryPage />;
}
