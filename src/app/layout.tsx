import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Avenir Next als selbst gehosteter Webfont (Lizenz vorhanden), damit auch
// Windows und Android die Schrift bekommen. Auf macOS und iOS greift die
// vorinstallierte Systemversion zuerst, ohne Download.
const avenir = localFont({
  src: [
    { path: "../../public/fonts/AvenirNext-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/AvenirNext-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../public/fonts/AvenirNext-DemiBold.ttf", weight: "600", style: "normal" },
    { path: "../../public/fonts/AvenirNext-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-avenir",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bewerbung · Regierungsinspektoranwärter/in 2027 (Prototyp)",
  description:
    "Klick-Prototyp einer mobilen Bewerbungsstrecke für das Land Schleswig-Holstein. Es werden keine Daten übertragen.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#1e3a6e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${avenir.variable} h-full antialiased`}>
      <body className="min-h-dvh flex flex-col">{children}</body>
    </html>
  );
}
