import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Geist } from "next/font/google";
import "../../globals.css";
import { locales, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Analytics } from "@/components/Analytics";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

type LangParams = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "es";
  const dict = await getDictionary(locale);
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    title: { default: dict.brand, template: `%s · Nano-Gro` },
    description: dict.footer.tagline,
  };
}

export default async function SiteLayout({
  children,
  params,
}: LangParams & { children: React.ReactNode }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <html lang={lang} className={`${geist.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Header locale={lang} dict={dict} />
        <main className="flex-1">{children}</main>
        <Footer locale={lang} dict={dict} />
        <Analytics />
      </body>
    </html>
  );
}
