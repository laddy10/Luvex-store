import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { StoreProvider } from "@/components/store-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const geistSans = localFont({
  src: "./fonts/geist-latin.woff2",
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/geist-mono-latin.woff2",
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3010",
  ),
  icons: { icon: "/brand/logo-luvex.jpeg", apple: "/brand/logo-luvex.jpeg" },
  title: {
    default: "LUVEX — Tu mundo. Tu ritmo. Tu estilo.",
    template: "%s | LUVEX",
  },
  description:
    "Accesorios de tecnología que van contigo. Descubre audio, fundas para iPhone y el universo LUVEX. Colombia · Precios en COP.",
  applicationName: "LUVEX",
  openGraph: {
    title: "LUVEX — Tu mundo. Tu ritmo. Tu estilo.",
    description: "Una selección de accesorios de tecnología, muy tuya.",
    locale: "es_CO",
    type: "website",
    images: [{ url: "/brand/logo-luvex.jpeg", width: 1254, height: 1254 }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-CO"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>
        <StoreProvider>
          <a className="skip-link" href="#contenido">
            Saltar al contenido
          </a>
          <Header />
          {children}
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
