import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TeamCard } from "@/components/TeamCard";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { trackEvent } from "@/lib/analytics";
import { getPublishedCases } from "@/lib/data";
import { getLocale, getMessages, localizedHref } from "@/lib/i18n";
import { localizeCases } from "@/lib/localized-content";
import { team } from "@/lib/team";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const site = SITE_URL;
  return {
    title: messages.team.metadataTitle,
    description: messages.team.metadataDescription,
    alternates: {
      canonical: `${site}${localizedHref(locale, "/equipo")}`,
      languages: { es: `${site}/es/equipo`, en: `${site}/en/team` }
    }
  };
}

export default async function TeamPage() {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  await trackEvent("page_view", { page_path: "/equipo" });

  const cases = localizeCases(await getPublishedCases(), locale);

  return (
    <section className="section">
      <div className="container">
        <Breadcrumbs crumbs={[{ label: messages.team.title }]} locale={locale} messages={messages} />

        <p className="mt-3 text-label font-semibold uppercase tracking-wide text-data">{messages.team.eyebrow}</p>
        <h1 className="mt-1 text-h1 text-foreground">{messages.team.title}</h1>
        <p className="mt-3 max-w-prose text-body-lg text-muted-foreground">{messages.team.subtitle}</p>

        <div className="mt-10 grid gap-14">
          {team.map((member) => (
            <TeamCard key={member.id} member={member} cases={cases} locale={locale} messages={messages} />
          ))}
        </div>
      </div>

      <WhatsAppFab message={messages.whatsapp.genericMessage} messages={messages} />
    </section>
  );
}
