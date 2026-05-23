import type { Metadata } from "next";
import { IBM_Plex_Mono, Syne } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Anchor Security Prep",
    template: "%s · Anchor Security Prep",
  },
  description:
    "Pre-audit static analysis for Anchor and Solana programs. 26 security rules, SARIF export, and GitHub Actions integration.",
  metadataBase: new URL("https://github.com/panagot/Anchor-Security-Prep"),
  openGraph: {
    title: "Anchor Security Prep",
    description: "Pre-audit static analysis for Anchor and Solana programs",
    type: "website",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${ibmPlexMono.variable} antialiased`}>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <div className="app-shell">
          <Navbar />
          <main id="main-content" className="mx-auto max-w-6xl px-6 py-10">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
