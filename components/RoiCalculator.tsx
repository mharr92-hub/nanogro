"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { submitLead } from "@/lib/actions";
import { calculateRoi, getComparableCases, DEFAULT_PROGRAM_COST_PER_HECTARE } from "@/lib/roi";
import { EvidenceSheet } from "@/components/ui";
import { localizedHref, type Locale, type Messages } from "@/lib/i18n-shared";
import { formatMessage } from "@/lib/i18n-shared";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { CaseStudy, Country, TaxonomyItem } from "@/lib/types";

/**
 * Calculadora de ROI (spec, seccion 5).
 *
 * El rango de mejora no lo elige un comercial: sale de los casos documentados del cultivo
 * elegido. Si no hay casos comparables, la calculadora se niega a calcular y lo dice.
 * Preferimos no dar un numero antes que dar uno inventado.
 *
 * Al pedir revision tecnica, el calculo entero viaja adjunto al lead para que el equipo no
 * empiece de cero (spec: "lead form with the calculator context attached automatically").
 */
export function RoiCalculator({
  cases,
  crops,
  countries,
  defaultCrop,
  locale,
  messages
}: {
  cases: CaseStudy[];
  crops: TaxonomyItem[];
  countries: Country[];
  defaultCrop?: string;
  locale: Locale;
  messages: Messages;
}) {
  const [crop, setCrop] = useState(defaultCrop ?? "");
  const [country, setCountry] = useState("");
  const [hectares, setHectares] = useState("10");
  const [currentYield, setCurrentYield] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [programCost, setProgramCost] = useState(String(DEFAULT_PROGRAM_COST_PER_HECTARE));

  const comparable = useMemo(
    () => getComparableCases(cases, crop || undefined, country || undefined),
    [cases, crop, country]
  );

  const result = useMemo(
    () =>
      calculateRoi(
        {
          hectares: Number(hectares) || 0,
          currentYieldPerHectare: Number(currentYield) || 0,
          salePricePerUnit: Number(salePrice) || 0,
          programCostPerHectare: Number(programCost) || 0
        },
        comparable
      ),
    [hectares, currentYield, salePrice, programCost, comparable]
  );

  const cropName = crops.find((item) => item.slug === crop)?.name ?? "";
  const countryName = countries.find((item) => item.slug === country)?.name ?? "";

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <div className="card p-5">
        <div className="grid gap-4">
          <label className="field-label">
            {messages.roi.crop}
            <select className="input" value={crop} onChange={(event) => setCrop(event.target.value)}>
              <option value="">{messages.roi.selectCrop}</option>
              {crops.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label className="field-label">
            {messages.roi.country}
            <select className="input" value={country} onChange={(event) => setCountry(event.target.value)}>
              <option value="">{messages.roi.anyCountry}</option>
              {countries.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <NumberField label={messages.roi.hectares} value={hectares} onChange={setHectares} />
          <NumberField
            label={messages.roi.currentYield}
            hint={messages.roi.yieldUnit}
            value={currentYield}
            onChange={setCurrentYield}
          />
          <NumberField label={messages.roi.salePrice} value={salePrice} onChange={setSalePrice} />
          <NumberField label={messages.roi.programCost} value={programCost} onChange={setProgramCost} />
        </div>
      </div>

      <div className="grid gap-6">
        {!crop ? (
          <div className="card border-dashed p-6">
            <p className="text-body text-muted-foreground">{messages.roi.selectCrop}</p>
          </div>
        ) : !comparable.length ? (
          <div className="card border-dashed p-6">
            <h2 className="text-h3 text-foreground">{messages.roi.noComparableTitle}</h2>
            <p className="mt-2 max-w-prose text-body text-muted-foreground">{messages.roi.noComparableBody}</p>
            <Link className="btn btn-primary mt-4" href={localizedHref(locale, "/diagnostico")}>
              {messages.diagnosticFlow.title}
            </Link>
          </div>
        ) : !result ? (
          <div className="card border-dashed p-6">
            <p className="text-body text-muted-foreground">{messages.roi.subtitle}</p>
          </div>
        ) : (
          <>
            <section className="card p-5" aria-live="polite">
              <h2 className="text-h3 text-foreground">{messages.roi.resultsTitle}</h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Figure
                  label={messages.roi.improvementRange}
                  value={`+${result.improvementLow}% – +${result.improvementHigh}%`}
                  sample={result.sample}
                  messages={messages}
                />
                <Figure
                  label={messages.roi.roiRange}
                  value={`${round(result.roiLow)}x – ${round(result.roiHigh)}x`}
                  sample={result.sample}
                  messages={messages}
                  emphasis
                />
                <Figure
                  label={messages.roi.additionalProduction}
                  value={`${round(result.additionalProductionLow)} – ${round(result.additionalProductionHigh)}`}
                  messages={messages}
                />
                <Figure
                  label={messages.roi.additionalRevenue}
                  value={`${round(result.additionalRevenueLow)} – ${round(result.additionalRevenueHigh)}`}
                  messages={messages}
                />
                <Figure
                  label={messages.roi.programCostTotal}
                  value={round(result.programCost).toString()}
                  messages={messages}
                />
                <Figure
                  label={messages.roi.grossBenefit}
                  value={`${round(result.grossBenefitLow)} – ${round(result.grossBenefitHigh)}`}
                  messages={messages}
                />
              </div>

              <p className="mt-5 border-t border-border pt-4 text-caption leading-5 text-muted-foreground">
                {messages.roi.disclaimer}
              </p>
            </section>

            <section>
              <h2 className="text-h3 text-foreground">{messages.roi.comparableTitle}</h2>
              <p className="mt-1 max-w-prose text-body text-muted-foreground">{messages.roi.comparableBody}</p>
              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                {comparable.slice(0, 4).map((item) => (
                  <EvidenceSheet key={item.id} item={item} locale={locale} messages={messages} />
                ))}
              </div>
            </section>

            <form action={submitLead} className="card grid gap-3 p-5">
              <h2 className="text-h3 text-foreground">{messages.roi.leadTitle}</h2>
              <p className="max-w-prose text-body text-muted-foreground">{messages.roi.leadBody}</p>

              <input type="hidden" name="crop_text" value={cropName} />
              <input type="hidden" name="country_text" value={countryName} />
              <input type="hidden" name="crop_slug" value={crop} />
              <input type="hidden" name="country_slug" value={country} />
              <input type="hidden" name="problem_text" value="" />
              <input type="hidden" name="area_text" value={hectares} />
              <input type="hidden" name="objective" value={messages.roi.leadTitle} />
              <input type="hidden" name="source_path" value="/roi-calculator" />
              <input
                type="hidden"
                name="recommended_case_ids"
                value={comparable.slice(0, 4).map((item) => item.id).join(",")}
              />
              {/* El calculo completo viaja con el lead. */}
              <input
                type="hidden"
                name="comments"
                value={[
                  `${messages.roi.hectares}: ${hectares}`,
                  `${messages.roi.currentYield}: ${currentYield}`,
                  `${messages.roi.salePrice}: ${salePrice}`,
                  `${messages.roi.programCost}: ${programCost}`,
                  `${messages.roi.roiRange}: ${round(result.roiLow)}x - ${round(result.roiHigh)}x`,
                  `${messages.roi.improvementRange}: +${result.improvementLow}% - +${result.improvementHigh}% (n=${result.sample})`
                ].join("\n")}
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="field-label">
                  {messages.diagnostic.name}
                  <input className="input" name="name" required />
                </label>
                <label className="field-label">
                  {messages.diagnostic.whatsapp}
                  <input className="input" name="whatsapp" inputMode="tel" required />
                </label>
              </div>

              <label className="flex items-start gap-3 text-body">
                <input className="mt-1 h-5 w-5" type="checkbox" name="consent" value="1" required />
                <span>{messages.diagnosticFlow.consent}</span>
              </label>

              <div className="flex flex-wrap gap-3">
                <button className="btn btn-primary" type="submit">
                  {messages.roi.leadTitle}
                </button>
                <a
                  className="btn btn-whatsapp"
                  href={buildWhatsAppUrl(formatMessage(messages.whatsapp.roiMessage, { crop: cropName }))}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {messages.whatsapp.float}
                </a>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function Figure({
  label,
  value,
  sample,
  emphasis = false,
  messages
}: {
  label: string;
  value: string;
  sample?: number;
  emphasis?: boolean;
  messages: Messages;
}) {
  return (
    <div>
      <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={["tabular mt-1", emphasis ? "text-metric text-data" : "text-h3 text-foreground"].join(" ")}>
        {value}
      </p>
      {typeof sample === "number" ? (
        <p className="tabular mt-1 text-caption text-muted-foreground">
          {formatMessage(messages.metrics.sample, { count: sample })}
        </p>
      ) : null}
    </div>
  );
}

function NumberField({
  label,
  hint,
  value,
  onChange
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="field-label">
      {label}
      <input
        className="input tabular"
        inputMode="decimal"
        type="number"
        min={0}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {hint ? <span className="text-caption font-normal text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

function round(value: number) {
  return Math.round(value * 10) / 10;
}
