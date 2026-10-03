import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "AI Research Agent",
    template: "%s | AI Research Agent",
  },
  description:
    "Source-grounded AI research assistant for discovering, analysing, and organising academic literature.",
  keywords: ["research", "academic", "literature", "AI", "papers"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
