import type { Metadata } from "next";
import { LanguageProvider } from "@/components/LanguageProvider";
import { SiteChrome } from "@/components/SiteChrome";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getLocale, getMessages, localizedHref } from "@/lib/i18n";
import "./globals.css";

const themeInitScript = `
(() => {
  try {
    const stored = window.localStorage.getItem("nano-gro-theme");
    const theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    document.documentElement.dataset.theme = theme;
  } catch {
    document.documentElement.dataset.theme = "dark";
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
    <html lang={locale} data-theme="dark" suppressHydrationWarning>
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

