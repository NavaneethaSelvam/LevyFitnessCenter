import type { Metadata, Viewport } from "next";
import ClientShell from "../components/ClientShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Levy Fitness Center | Train for what's next",
  description:
    "Levy Fitness Center — a focused space to build strength, confidence, and a fitness routine that lasts.",
  icons: {
    icon: "/images/branding/levy-mark.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#090b09",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
