import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type ActionLinkProps = {
  to: string;
  children: ReactNode;
  variant?: "lime" | "outline" | "text";
  className?: string;
};

export default function ActionLink({
  to,
  children,
  variant = "lime",
  className = "",
}: ActionLinkProps) {
  return (
    <Link className={`button button--${variant} ${className}`.trim()} href={to}>
      <span>{children}</span>
      <ArrowUpRight size={16} aria-hidden="true" />
    </Link>
  );
}
