"use client";

import { useState } from "react";
import { submitLead } from "@/lib/actions";
import { Stepper } from "@/components/ui";
import type { Messages } from "@/lib/i18n-shared";
import type { Country, TaxonomyItem } from "@/lib/types";

type StepId = "country" | "crop" | "hectares" | "problem" | "production" | "objective" | "whatsapp" | "email";

const STEPS: StepId[] = ["country", "crop", "hectares", "problem", "production", "objective", "whatsapp", "email"];

/**
 * Diagnostico gratuito: una pregunta por paso, con barra de progreso (spec, seccion 12).
 *
 * Todos los campos viven en el DOM desde el primer render, dentro de un unico <form>, y
 * los pasos que no tocan se ocultan. Asi el envio es un submit nativo al server action
 * `submitLead` con exactamente los mismos names que ya esperaba: el contrato con Supabase
 * no se toca. Lo unico que cambia es que ahora el usuario recibe valor al terminar.
 */
export function DiagnosticWizard({
  crops,
  countries,
  problems,
  defaults,
  messages
}: {
  crops: TaxonomyItem[];
  countries: Country[];
  problems: TaxonomyItem[];
  defaults?: { crop?: string; country?: string; problem?: string };
  messages: Messages;
}) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<StepId, string>>({
    country: defaults?.country ?? "",
    crop: defaults?.crop ?? "",
    hectares: "",
    problem: defaults?.problem ?? "",
    production: "",
    objective: "",
    whatsapp: "",
    email: ""
  });

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  // Produccion y email son opcionales: obligar a un agricultor a inventarse una cifra
  // para poder avanzar es la forma mas rapida de ensuciar los datos.
  const optional: StepId[] = ["production", "email"];
  const canAdvance = optional.includes(current) || values[current].trim().length > 0;
  // Pasos donde la respuesta es un toque, no texto: avanzan solos.
  const isChoiceStep = current === "country" || current === "crop" || current === "problem" || current === "objective";

  const set = (id: StepId, value: string) => setValues((previous) => ({ ...previous, [id]: value }));

  /**
   * Elegir una opcion avanza sola: en los pasos de seleccion (pais, cultivo, problema,
   * objetivo) el toque en la tarjeta ES la respuesta, y pedir despues un segundo toque en
   * "Siguiente" solo anade friccion. En los pasos de escritura (hectareas, produccion,
   * WhatsApp, email) NO se autoavanza, porque el usuario aun esta tecleando.
   *
   * El pequeno retardo deja ver la tarjeta marcada antes de pasar de pantalla: sin el, el
   * salto es tan brusco que el usuario no sabe si registro su respuesta.
   */
  const selectAndAdvance = (id: StepId, value: string) => {
    set(id, value);
    if (step < STEPS.length - 1) {
      window.setTimeout(() => setStep((current) => (current === step ? current + 1 : current)), 180);
    }
  };

  const cropName = crops.find((item) => item.slug === values.crop)?.name ?? "";
  const countryName = countries.find((item) => item.slug === values.country)?.name ?? "";
  const problemName = problems.find((item) => item.slug === values.problem)?.name ?? "";

  return (
    <form action={submitLead} className="card p-5 sm:p-6">
      <Stepper
        current={step + 1}
        total={STEPS.length}
        label={messages.diagnosticFlow.steps[current]}
        messages={messages}
      />

      <div className="mt-5">
        {current === "country" ? (
          <Choices
            name="__country"
            items={countries}
            value={values.country}
            onSelect={(value) => selectAndAdvance("country", value)}
          />
        ) : null}

        {current === "crop" ? (
          <Choices
            name="__crop"
            items={crops}
            value={values.crop}
            onSelect={(value) => selectAndAdvance("crop", value)}
          />
        ) : null}

        {current === "problem" ? (
          <Choices
            name="__problem"
            items={problems}
            value={values.problem}
            onSelect={(value) => selectAndAdvance("problem", value)}
          />
        ) : null}

        {current === "hectares" ? (
          <TextStep
            hint={messages.diagnosticFlow.hints.hectares}
            inputMode="decimal"
            value={values.hectares}
            onChange={(value) => set("hectares", value)}
            label={messages.diagnosticFlow.steps.hectares}
          />
        ) : null}

        {current === "production" ? (
          <TextStep
            hint={messages.diagnosticFlow.hints.production}
            value={values.production}
            onChange={(value) => set("production", value)}
            label={messages.diagnosticFlow.steps.production}
          />
        ) : null}

        {current === "objective" ? (
          <div className="grid gap-2">
            {messages.diagnosticFlow.objectives.map((objective) => (
              <ChoiceButton
                key={objective}
                selected={values.objective === objective}
                onClick={() => selectAndAdvance("objective", objective)}
              >
                {objective}
              </ChoiceButton>
            ))}
          </div>
        ) : null}

        {current === "whatsapp" ? (
          <TextStep
            inputMode="tel"
            value={values.whatsapp}
            onChange={(value) => set("whatsapp", value)}
            label={messages.diagnosticFlow.steps.whatsapp}
          />
        ) : null}

        {current === "email" ? (
          <>
            <TextStep
              hint={messages.diagnosticFlow.hints.email}
              type="email"
              value={values.email}
              onChange={(value) => set("email", value)}
              label={messages.diagnosticFlow.steps.email}
            />
            <label className="mt-4 flex items-start gap-3 text-body">
              <input className="mt-1 h-5 w-5" type="checkbox" name="consent" value="1" required defaultChecked />
              <span>{messages.diagnosticFlow.consent}</span>
            </label>
          </>
        ) : null}
      </div>

      {/*
        Contrato con lib/actions.ts#submitLead. Los `name` son los que ya esperaba el
        server action; los `_slug` son aditivos y solo sirven para que la pagina de
        resultado pueda buscar casos similares sin adivinar por texto.
      */}
      <input type="hidden" name="name" value={values.whatsapp ? `WhatsApp ${values.whatsapp}` : "Diagnostico web"} />
      <input type="hidden" name="country_text" value={countryName} />
      <input type="hidden" name="crop_text" value={cropName} />
      <input type="hidden" name="problem_text" value={problemName} />
      <input type="hidden" name="area_text" value={values.hectares} />
      <input type="hidden" name="whatsapp" value={values.whatsapp} />
      <input type="hidden" name="email" value={values.email} />
      <input type="hidden" name="current_production" value={values.production} />
      <input type="hidden" name="objective" value={values.objective} />
      <input type="hidden" name="comments" value="" />
      <input type="hidden" name="source_path" value="/diagnostico" />
      <input type="hidden" name="crop_slug" value={values.crop} />
      <input type="hidden" name="country_slug" value={values.country} />
      <input type="hidden" name="problem_slug" value={values.problem} />

      <div className="mt-6 flex flex-wrap gap-3">
        {/* "Atras" se puede pulsar siempre, tambien en el ultimo paso: si el usuario se
            equivoco de cultivo en el paso 2, tiene que poder volver sin reiniciar. */}
        <button
          className="btn btn-secondary"
          type="button"
          disabled={step === 0}
          onClick={() => setStep((value) => Math.max(0, value - 1))}
        >
          {messages.diagnosticFlow.back}
        </button>

        {isLast ? (
          <button className="btn btn-primary flex-1" type="submit">
            {messages.diagnosticFlow.submit}
          </button>
        ) : isChoiceStep ? (
          // En los pasos de seleccion no hay boton "Siguiente": elegir ya avanza.
          null
        ) : (
          <button
            className="btn btn-primary flex-1"
            type="button"
            disabled={!canAdvance}
            onClick={() => setStep((value) => value + 1)}
          >
            {messages.diagnosticFlow.next}
          </button>
        )}
      </div>

      {!isChoiceStep && !canAdvance ? (
        <p className="mt-3 text-caption text-muted-foreground">{messages.diagnosticFlow.required}</p>
      ) : null}
    </form>
  );
}

function Choices({
  items,
  value,
  onSelect
}: {
  name: string;
  items: TaxonomyItem[];
  value: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {items.map((item) => (
        <ChoiceButton key={item.id} selected={value === item.slug} onClick={() => onSelect(item.slug)}>
          {item.name}
        </ChoiceButton>
      ))}
    </div>
  );
}

function ChoiceButton({
  selected,
  onClick,
  children
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={[
        "min-h-[44px] rounded border px-4 py-2 text-left text-body transition-colors",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:bg-muted"
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function TextStep({
  label,
  hint,
  value,
  onChange,
  type = "text",
  inputMode
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  inputMode?: "decimal" | "tel";
}) {
  return (
    <label className="field-label">
      <span className="sr-only">{label}</span>
      <input
        className="input"
        type={type}
        inputMode={inputMode}
        value={value}
        autoFocus
        onChange={(event) => onChange(event.target.value)}
      />
      {hint ? <span className="text-caption font-normal text-muted-foreground">{hint}</span> : null}
    </label>
  );
}
