import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { dir } from "i18next";
import i18nConfig from "@/lib/i18n/settings";
import ClientApp from "@/components/ClientApp";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: { locale?: string };
}): Promise<Metadata> {
  const locale = params?.locale ?? "en";
  const isKo = locale === "ko" || locale?.startsWith("ko");

  return {
    title: "Korips",
    description: isKo
      ? "한국 온천 숙박/티켓 예약 플랫폼"
      : "Korean hot spring lodging & ticket reservation platform",
    alternates: {
      languages: {
        en: "/en",
        ko: "/ko",
      },
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      ],
      apple: [
        { url: "/favicon-180x180.png", sizes: "180x180", type: "image/png" },
      ],
    },
  };
}

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  const locale = params.locale;
  const htmlDir = dir(locale ?? "en");

  return (
    <html lang={locale} dir={htmlDir}>
      <head></head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          src="https://js.tosspayments.com/v2/standard"
          strategy="afterInteractive"
        />
        <ClientApp>{children}</ClientApp>
      </body>
    </html>
  );
}
