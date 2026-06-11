import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luma | AI Launch Agent Workspace",
  description:
    "Luma turns product ideas into human + AI launch workflows for product distribution.",
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
