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
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    title: "SpendSafe | Financial Clarity Without the Guesswork",
    description:
      "Stop wondering if you can afford it. Separate cash from assumptions.",
    siteName: "SpendSafe",
    // Note: Add og-image.png to /public directory for social media previews
    // images: [
    //   {
    //     url: "/og-image.png",
    //     width: 1200,
    //     height: 630,
    //     alt: "SpendSafe Dashboard Preview",
    //   },
    // ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SpendSafe | Panic-Proof Freelance Finance",
    description: "Know your true safe-to-spend number instantly.",
    // images: ["/og-image.png"],
    creator: "@spendsafe",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
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
