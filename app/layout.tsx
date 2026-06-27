import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";
import { PwaRegistry } from "@/components/pwa-registry";
import type { Viewport } from "next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#FDFCF8",
  minimumScale: 1,
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  width: "device-width",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    template: "%s | Validexio",
    default: "Validexio — AI Startup Idea Validation Platform",
  },
  description:
    "Stop guessing, start validating. Validexio is an AI-powered idea validation platform that analyzes market saturation, unit economics, and acts as a VC pitch simulator.",
  keywords: [
    "AI startup validation",
    "idea validation platform",
    "validate startup idea AI",
    "competitor analysis tool for startups",
    "unit economics calculator",
    "VC pitch simulator",
    "startup simulator",
    "product market fit",
  ],
  authors: [{ name: "Validexio" }],
  creator: "Validexio",
  publisher: "Validexio",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://validexio.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://validexio.com",
    title: "Validexio — AI Startup Idea Validation Platform",
    description:
      "Stop guessing, start validating. Validexio is an AI-powered idea validation platform that analyzes market saturation, unit economics, and acts as a VC pitch simulator.",
    siteName: "Validexio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Validexio — AI Startup Idea Validation Platform",
    description:
      "Stop guessing, start validating. Validexio is an AI-powered idea validation platform that analyzes market saturation, unit economics, and acts as a VC pitch simulator.",
    creator: "@validexio",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.deferredPrompt = null;
              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                window.deferredPrompt = e;
                window.dispatchEvent(new Event('pwa-install-ready'));
              });
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Validexio",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "url": "https://validexio.com",
              "description": "AI-powered idea validation platform and startup simulator.",
              "offers": {
                "@type": "Offer",
                "price": "0.00",
                "priceCurrency": "USD"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Validexio",
                "url": "https://validexio.com"
              }
            })
          }}
        />
      </head>
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-[#FDFCF8] text-[#1B1716] antialiased overflow-x-hidden selection:bg-cherry/20 selection:text-cherry`}>
        <PwaRegistry />
        <NextTopLoader color="#E44234" showSpinner={false} height={3} shadow="0 0 10px #E44234,0 0 5px #E44234" />
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "rgba(27, 23, 22, 0.95)",
              border: "1px solid rgba(27, 23, 22, 0.1)",
              color: "#EDEBDE",
              backdropFilter: "blur(20px)",
            },
          }}
        />
      </body>
    </html>
  );
}
