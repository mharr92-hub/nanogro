import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, Inter } from "next/font/google";
import { LanguageProvider } from "@/components/LanguageProvider";
import { SiteChrome } from "@/components/SiteChrome";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getLocale, getMessages, localizedHref } from "@/lib/i18n";
import "./globals.css";

// Display: caracter, solo en titulares y en la firma de la Ficha de Evidencia.
const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", display: "swap" });
// Cuerpo: legibilidad a 360px por encima de todo.
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
// Datos: cifras tabulares. ROI, %, hectareas y scores siempre se leen en columna.
const data = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-data", display: "swap" });

const themeInitScript = `
(() => {
  try {
    const stored = window.localStorage.getItem("nano-gro-theme");
    const theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.dataset.theme = theme;
  } catch {
    document.documentElement.dataset.theme = "light";
  }
})();
`;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    title: {
      default: messages.seo.defaultTitle,
      template: `%s | ${messages.seo.defaultTitle}`
    },
    description: messages.seo.defaultDescription,
    alternates: {
      canonical: `${site}${localizedHref(locale, "/")}`,
      languages: {
        en: `${site}/en`,
        es: `${site}/es`
      }
    },
    openGraph: {
      title: messages.seo.defaultTitle,
      description: messages.seo.ogDescription,
      type: "website",
      locale
    }
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  return (
    <html
      lang={locale}
      data-theme="light"
      className={`${display.variable} ${body.variable} ${data.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <LanguageProvider initialLocale={locale} messages={messages}>
        <ThemeProvider>
        <SiteChrome>{children}</SiteChrome>
        </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

