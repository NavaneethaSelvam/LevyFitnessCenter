import type { Metadata } from "next";
import MembershipPage from "../../site-pages/MembershipPage";

export const metadata: Metadata = {
  title: "Membership | Levy Fitness Center",
  description:
    "View 1, 3, 6, 9, and 12 month membership plans and prices at Levy Fitness Center.",
};

export default function Page() {
  return <MembershipPage />;
}
