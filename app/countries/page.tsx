import Link from "next/link";
import { getTaxonomy } from "@/lib/data";
import { getLocale, getMessages, localizedHref } from "@/lib/i18n";
import { localizeTaxonomy } from "@/lib/localized-content";

export default async function CountriesPage() {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const { countries: rawCountries } = await getTaxonomy();
  const countries = localizeTaxonomy(rawCountries, locale);
  return (
    <section className="section">
      <div className="container">
        <h1 className="text-4xl font-black">{messages.countries.title}</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {countries.map((item) => (
            <Link className="card p-5" key={item.id} href={localizedHref(locale, `/countries/${item.slug}`)}>
              <p className="text-xl font-black">{item.name}</p>
              <p className="mt-2 text-sm text-muted-foreground">{item.dominant_climate || messages.countries.fallback}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

