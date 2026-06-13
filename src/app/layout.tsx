import type { Metadata } from "next";
import "./globals.css";
import { SmoothScroll } from "./components/SmoothScroll";
import HeaderWrapper from "./components/HeaderWrapper";
import { SplashLoader } from "./components/SplashLoader";

export const metadata: Metadata = {
  title: "Prakash Travels | Premium Car Rentals & Taxi Services",
  description: "Experience premium, reliable, and affordable car rentals & taxi services with Prakash Travels. Book online for one-way or round-trip journeys with Swift Dzire, Ertiga, Scorpio, and more. Your Journey, Your Choice.",
  keywords: [
    "Prakash Travels",
    "Prakash Travels booking",
    "car rentals",
    "taxi booking online",
    "outstation cabs",
    "one way taxi",
    "round trip cabs",
    "hire Swift Dzire",
    "Ertiga rental",
    "SUV booking India",
    "reliable taxi service",
    "Sayalgudi travel agency"
  ],
  authors: [{ name: "Prakash Travels", url: "https://www.prakashtravels.online" }],
  publisher: "Prakash Travels",
  metadataBase: new URL("https://www.prakashtravels.online"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Prakash Travels | Premium Car Rentals & Taxi Services",
    description: "Experience premium, reliable, and affordable car rentals & taxi services with Prakash Travels. Book online for one-way or round-trip journeys.",
    url: "https://www.prakashtravels.online",
    siteName: "Prakash Travels",
    locale: "en_US",
    type: "website",
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
  verification: {
    google: "IYAYxJGbf7Por8OcJ1zblDYzkheE1k7g4orOYw0Da1U",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    "name": "Prakash Travels",
    "description": "Premium car rentals and taxi services in Sayalkudi, Tamil Nadu, providing round-trip and one-way outstation cabs.",
    "image": "https://www.prakashtravels.online/assets/images/hero_banner.png",
    "@id": "https://www.prakashtravels.online/#taxiservice",
    "url": "https://www.prakashtravels.online",
    "telephone": "+917092022232",
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Sayalkudi",
      "addressLocality": "Sayalkudi",
      "addressRegion": "Tamil Nadu",
      "postalCode": "623120",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 9.167923,
      "longitude": 78.435357
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "sameAs": [
      "https://facebook.com",
      "https://instagram.com",
      "https://x.com",
      "https://youtube.com"
    ],
    "areaServed": [
      {
        "@type": "AdministrativeArea",
        "name": "Tamil Nadu"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Sayalkudi"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Madurai"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Rameswaram"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Chennai"
      }
    ],
    "provider": {
      "@type": "LocalBusiness",
      "name": "Prakash Travels",
      "telephone": "+917092022232",
      "priceRange": "₹₹"
    }
  };

  return (
    <html lang="en" className="antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Open+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans bg-background text-foreground selection:bg-dynamic-orange/30">
        <SplashLoader />
        <HeaderWrapper />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}

