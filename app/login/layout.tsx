import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | PermsPortal - NITC CSEA Venue Booking",
  description: "Sign in to PermsPortal using your NIT Calicut Google Workspace account to request, approve, and schedule department venues.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
