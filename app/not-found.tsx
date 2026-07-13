import Link from "next/link";
import { EmptyState } from "@/components/ui";
import { getLocale, getMessages, localizedHref } from "@/lib/i18n";

export default async function NotFound() {
  const locale = await getLocale();
  const messages = await getMessages(locale);

  return (
    <section className="section">
      <div className="container max-w-2xl">
        <EmptyState
          title={messages.errors.emptyCases}
          body={messages.hub.emptyBody}
          action={
            <>
              <Link className="btn btn-primary" href={localizedHref(locale, "/cases")}>
                {messages.homeSections.allCases}
              </Link>
              <Link className="btn btn-secondary" href={localizedHref(locale, "/diagnostico")}>
                {messages.nav.primaryCta}
              </Link>
            </>
          }
        />
      </div>
    </section>
  );
}
