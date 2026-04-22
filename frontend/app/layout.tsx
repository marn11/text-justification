import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "justifier",
  description:
    "A minimalist frontend for requesting tokens and justifying text through the text justification API.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
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
