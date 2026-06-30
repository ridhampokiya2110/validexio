import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Startup Simulator",
  description: "Learn about Validexio, the ultimate reality check for startup founders. We help you kill bad ideas before they kill your bank account.",
  keywords: ["about validexio", "startup simulator", "validation tool founders"],
};

const schema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://validexio.com/about"
  },
  "name": "About Validexio",
  "description": "Learn about Validexio, the ultimate reality check for startup founders."
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: `{
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://validexio.com/about"
  },
  "name": "About Validexio",
  "description": "Learn about Validexio, the ultimate reality check for startup founders."
}` }}
      />
      {children}
    </>
  );
}
