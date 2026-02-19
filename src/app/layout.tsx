import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Taraweeh Finder - Find Ramadan Prayers Near You",
  description: "Discover taraweeh sessions at nearby masjids during Ramadan. View prayers, crowds, and refreshments all in one place.",
  openGraph: {
    title: "Taraweeh Finder",
    description: "Find taraweeh sessions at mosques near you",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
