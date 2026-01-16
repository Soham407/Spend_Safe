import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "SpendSafe | Financial Clarity for Freelancers",
    template: "%s | SpendSafe",
  },
  description:
    "Manual-first financial clarity tool for freelancers. Separate your guaranteed income from your hopeful assumptions.",
  keywords: [
    "freelance finance",
    "budgeting",
    "financial clarity",
    "income tracking",
    "runway calculator",
  ],
  authors: [{ name: "SpendSafe Team" }],
  creator: "SpendSafe",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://spendsafe.app"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://spendsafe.app",
    title: "SpendSafe | Financial Clarity Without the Guesswork",
    description:
      "Stop wondering if you can afford it. Separate cash from assumptions.",
    siteName: "SpendSafe",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SpendSafe Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SpendSafe | Panic-Proof Freelance Finance",
    description: "Know your true safe-to-spend number instantly.",
    images: ["/og-image.png"],
    creator: "@spendsafe",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
