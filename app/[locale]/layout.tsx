import type { Metadata } from "next";
import { Geist, Fira_Code } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/components/providers";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://api.axiomtext.com"),
  title: "AxiomText API - API d'envoie d'sms et de code otp de la Plateforme SMS professionnelle axiomtext.",
  description:
    "Documentation officielle de l'API Axiom TEXT, messagerie SMS professionnelle basée au Sénégal. API SMS simple et puissante pour vos communications d'entreprise en Afrique et dans le monde.",
  keywords: [
    "API SMS",
    "SMS Sénégal",
    "Messagerie professionnelle",
    "Bulk SMS",
    "SMS API Africa",
    "SMS Gateway",
    "OTP SMS",
    "SMS Marketing",
    "API Documentation",
    "SMS Entreprise",
  ],
  authors: [{ name: "AxiomText" }],
  creator: "AxiomText",
  publisher: "AxiomText",
  robots: "index, follow",
  alternates: {
    canonical: "https://api.axiomtext.com",
  },
  openGraph: {
    type: "website",
    locale: "fr_SN",
    alternateLocale: "en_US",
    url: "https://api.axiomtext.com",
    siteName: "AxiomText",
    title: "AxiomText - Plateforme SMS API Professionnelle au Sénégal",
    description:
      "Plateforme de messagerie SMS professionnelle basée au Sénégal. API SMS simple et puissante pour vos communications d'entreprise en Afrique et dans le monde.",
    images: [
      {
        url: "/aaxiom.png",
        width: 800,
        height: 600,
        alt: "AxiomText Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AxiomText - Plateforme SMS API Professionnelle au Sénégal",
    description:
      "Plateforme de messagerie SMS professionnelle basée au Sénégal. API SMS simple et puissante pour vos communications d'entreprise en Afrique et dans le monde.",
    creator: "@axiomtext",
    images: ["/aaxiom.png"],
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  viewport: "width=device-width, initial-scale=1.0",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  category: "Technology",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { params: Promise<{ locale: string }> };
}>) {
  const { locale } = await params;
  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${firaCode.variable} antialiased`}
      >
        <Providers locale={locale}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            {children}
            <Footer />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
