import { saveTaxonomy } from "@/lib/actions";
import { getTaxonomy } from "@/lib/data";
import { getMessages } from "@/lib/i18n";

export default async function TaxonomyAdminPage() {
  const messages = await getMessages();
  const { crops, countries, problems } = await getTaxonomy();
  return (
    <div>
      <h1 className="text-3xl font-black">{messages.admin.taxonomy}</h1>
      <form action={saveTaxonomy} className="card mt-6 grid gap-3 p-5">
        <h2 className="text-xl font-black">{messages.admin.createTaxonomy}</h2>
        <select className="input" name="table" defaultValue="crops">
          <option value="crops">{messages.common.crop}</option>
          <option value="countries">{messages.common.country}</option>
          <option value="problems">{messages.common.problem}</option>
        </select>
        <input className="input" name="name" placeholder={messages.admin.name} required />
        <input className="input" name="slug" placeholder="Slug optional" />
        <input className="input" name="category" placeholder="Problem/category optional" />
        <input className="input" name="iso_code" placeholder="ISO code for country optional" />
        <button className="btn btn-primary" type="submit">{messages.admin.createTaxonomy}</button>
      </form>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <List title={messages.navigation.crops} items={crops} />
        <List title={messages.navigation.countries} items={countries} />
        <List title={messages.navigation.problems} items={problems} />
      </div>
    </div>
  );
}

function List({ title, items }: { title: string; items: { id: string; name: string; slug: string }[] }) {
  return (
    <section className="card p-5">
      <h2 className="text-xl font-black">{title}</h2>
      <div className="mt-4 grid gap-2 text-sm">
        {items.map((item) => <p className="rounded bg-muted p-2" key={item.id}>{item.name} / {item.slug}</p>)}
      </div>
    </section>
  );
}

