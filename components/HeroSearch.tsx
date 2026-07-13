"use client";

import { useMemo, useState } from "react";
import { localizedHref, type Locale, type Messages } from "@/lib/i18n-shared";
import type { Country, TaxonomyItem } from "@/lib/types";

/** Una combinacion cultivo+pais+problema que EXISTE en un caso publicado. */
export type CaseCombo = { crop?: string; country?: string; problem?: string };

/**
 * El buscador ES el hero, y ademas es honesto: solo deja elegir combinaciones que existen.
 *
 * Antes los tres desplegables eran independientes, asi que se podia pedir "Cacao en Panama
 * con estres hidrico" y aterrizar en una pagina vacia. Ahora los selectores van en cascada:
 * las opciones de cada uno se recalculan contra las combinaciones reales de los casos
 * publicados. Si eliges Maiz, solo quedan los paises donde hay casos de maiz; si eliges
 * despues El Salvador, solo quedan los problemas documentados de maiz en El Salvador.
 *
 * Y si una eleccion previa deja a otra sin sentido, esa otra se limpia sola en vez de
 * enviarte a un resultado vacio.
 *
 * Es cliente porque la cascada exige reaccionar al cambio; el envio sigue siendo un GET
 * nativo a /cases, asi que la URL resultante se puede compartir e indexar igual que antes.
 */
export function HeroSearch({
  crops,
  countries,
  problems,
  combos,
  defaults,
  locale,
  messages
}: {
  crops: TaxonomyItem[];
  countries: Country[];
  problems: TaxonomyItem[];
  combos: CaseCombo[];
  defaults?: { q?: string; crop?: string; country?: string; problem?: string };
  locale: Locale;
  messages: Messages;
}) {
  const [crop, setCrop] = useState(defaults?.crop ?? "");
  const [country, setCountry] = useState(defaults?.country ?? "");
  const [problem, setProblem] = useState(defaults?.problem ?? "");

  /** Combinaciones que siguen siendo posibles, ignorando el campo que se esta pintando. */
  const possible = useMemo(
    () => (skip: keyof CaseCombo) =>
      combos.filter(
        (combo) =>
          (skip === "crop" || !crop || combo.crop === crop) &&
          (skip === "country" || !country || combo.country === country) &&
          (skip === "problem" || !problem || combo.problem === problem)
      ),
    [combos, crop, country, problem]
  );

  const allowedCrops = useMemo(() => new Set(possible("crop").map((c) => c.crop)), [possible]);
  const allowedCountries = useMemo(() => new Set(possible("country").map((c) => c.country)), [possible]);
  const allowedProblems = useMemo(() => new Set(possible("problem").map((c) => c.problem)), [possible]);

  // Al cambiar un selector, se limpia lo que haya quedado sin casos.
  const changeCrop = (value: string) => {
    setCrop(value);
    const next = combos.filter((combo) => !value || combo.crop === value);
    if (country && !next.some((combo) => combo.country === country)) setCountry("");
    if (problem && !next.some((combo) => combo.problem === problem)) setProblem("");
  };

  const changeCountry = (value: string) => {
    setCountry(value);
    const next = combos.filter(
      (combo) => (!crop || combo.crop === crop) && (!value || combo.country === value)
    );
    if (problem && !next.some((combo) => combo.problem === problem)) setProblem("");
  };

  return (
    <form action={localizedHref(locale, "/cases")} className="card grid gap-3 p-4 sm:p-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <Select
          name="crop"
          label={messages.hero.crop}
          anyLabel={messages.hero.anyCrop}
          items={crops.filter((item) => allowedCrops.has(item.slug))}
          value={crop}
          onChange={changeCrop}
        />
        <Select
          name="country"
          label={messages.hero.country}
          anyLabel={messages.hero.anyCountry}
          items={countries.filter((item) => allowedCountries.has(item.slug))}
          value={country}
          onChange={changeCountry}
        />
        <Select
          name="problem"
          label={messages.hero.problem}
          anyLabel={messages.hero.anyProblem}
          items={problems.filter((item) => allowedProblems.has(item.slug))}
          value={problem}
          onChange={setProblem}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <label className="field-label">
          <span className="sr-only">{messages.hero.keyword}</span>
          <input
            className="input"
            name="q"
            type="search"
            placeholder={messages.hero.keyword}
            defaultValue={defaults?.q}
          />
        </label>
        <button className="btn btn-primary" type="submit">
          {messages.hero.search}
        </button>
      </div>
    </form>
  );
}

function Select({
  name,
  label,
  anyLabel,
  items,
  value,
  onChange
}: {
  name: string;
  label: string;
  anyLabel: string;
  items: TaxonomyItem[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="field-label">
      {label}
      <select className="input" name={name} value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">{anyLabel}</option>
        {items.map((item) => (
          <option key={item.id} value={item.slug}>
            {item.name}
          </option>
        ))}
      </select>
    </label>
  );
}
