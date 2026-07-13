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

// El tema por defecto es claro SIEMPRE, no la preferencia del sistema: la mayoria del
// trafico llega desde un movil a pleno sol en campo, y ahi el papel claro gana. El usuario
// que quiera oscuro lo elige con el toggle y su eleccion se recuerda.
const themeInitScript = `
(() => {
  try {
    const stored = window.localStorage.getItem("nano-gro-theme");
    document.documentElement.dataset.theme = stored === "dark" ? "dark" : "light";
  } catch {
    document.documentElement.dataset.theme = "light";
  }
})();
`;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://nanogro.lat";
  return {
    /*
     * `metadataBase` es obligatorio para que la imagen de previsualizacion salga con URL
     * absoluta. Sin el, WhatsApp y Facebook reciben una ruta relativa, no pueden resolverla
     * y el enlace se comparte sin miniatura.
     */
    metadataBase: new URL(site),
    title: {
      default: messages.seo.defaultTitle,
      template: `%s | ${messages.seo.defaultTitle}`
    },
    description: messages.seo.defaultDescription,
    alternates: {
      canonical: `${site}${localizedHref(locale, "/")}`,
      languages: {
        // El espanol es el idioma por defecto del sitio: x-default apunta a la raiz, que
        // sirve espanol salvo que el usuario pida /en explicitamente.
        "x-default": site,
        es: `${site}/es`,
        en: `${site}/en`
      }
    },
    openGraph: {
      title: messages.seo.defaultTitle,
      description: messages.seo.ogDescription,
      type: "website",
      url: site,
      siteName: messages.common.product,
      locale: locale === "es" ? "es_ES" : "en_US"
    },
    twitter: {
      card: "summary_large_image",
      title: messages.seo.defaultTitle,
      description: messages.seo.ogDescription
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

