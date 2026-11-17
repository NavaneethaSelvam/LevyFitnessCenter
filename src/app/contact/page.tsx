import { Suspense } from "react";
import type { Metadata } from "next";
import ContactPage from "../../site-pages/ContactPage";

export const metadata: Metadata = {
  title: "Contact us | Levy Fitness Center",
  description:
    "Contact Levy Fitness Center with questions about programs, membership, and training.",
};

export default function Page() {
  return (
    <Suspense>
      <ContactPage />
    </Suspense>
  );
}
