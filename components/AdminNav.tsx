import Link from "next/link";
import { logoutAdmin } from "@/lib/actions";
import { getLocale, getMessages, localizedHref } from "@/lib/i18n";

const links = [
  ["/admin", "dashboard"],
  ["/admin/cases", "cases"],
  ["/admin/cases/new", "newCase"],
  ["/admin/evidence", "evidence"],
  ["/admin/taxonomy", "taxonomy"],
  ["/admin/import", "import"],
  ["/admin/review", "review"],
  ["/admin/leads", "leads"]
];

export async function AdminNav() {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  return (
    <aside className="border-b border-border bg-card p-4 md:border-b-0 md:border-r">
      <Link href={localizedHref(locale, "/admin")} className="text-lg font-black text-primary">{messages.navigation.admin}</Link>
      <nav className="scroll-strip mt-4 flex gap-1 overflow-x-auto pb-1 text-sm font-semibold md:mt-6 md:grid md:overflow-visible md:pb-0">
        {links.map(([href, key]) => (
          <Link className="shrink-0 rounded px-3 py-2 text-muted-foreground hover:bg-accent hover:text-primary" key={href} href={localizedHref(locale, href)}>{messages.admin[key as keyof typeof messages.admin]}</Link>
        ))}
      </nav>
      <form action={logoutAdmin} className="mt-4 md:mt-6">
        <button className="btn btn-secondary w-full md:w-full" type="submit">{messages.common.logout}</button>
      </form>
    </aside>
  );
}

