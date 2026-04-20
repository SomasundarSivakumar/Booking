import type { Metadata } from "next";
import "./globals.css";
import { SmoothScroll } from "./components/SmoothScroll";
import HeaderWrapper from "./components/HeaderWrapper";

export const metadata: Metadata = {
  title: "Prakash Travel",
  description: "Your Journey, Your Choice",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      </head>
      <body className="font-sans bg-background text-foreground selection:bg-dynamic-orange/30">
        <HeaderWrapper />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}

