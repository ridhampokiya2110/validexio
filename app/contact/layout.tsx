import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Validexio",
  description: "Get in touch with the Validexio team. We're here to help you validate your next big idea or answer questions about your validation report.",
  keywords: ["contact validexio", "support", "enterprise sales"],
};

const schema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://validexio.com/contact"
  },
  "name": "Contact Validexio",
  "description": "Get in touch with the Validexio team."
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
      />
      {children}
    </>
  );
}
