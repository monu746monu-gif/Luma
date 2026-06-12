import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luma | Marketing Workflow Automation",
  description:
    "Luma turns product details, team roles, and selected AI agents into human + AI marketing workflows.",
  icons: {
    icon: "/logo.jpeg",
    shortcut: "/logo.jpeg",
    apple: "/logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
