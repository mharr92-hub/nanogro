"use client";
import { useState } from "react";
import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

export interface Option {
  value: string;
  label: string;
}
export interface DiagnosticWizardProps {
  dict: Dictionary;
  locale: Locale;
  crops: Option[];
  climates: Option[];
  symptoms: Option[];
  stages: Option[];
  goals: Option[];
}

interface Answers {
  crop?: string;
  climate?: string;
  symptoms: string[];
  stage?: string;
  goal?: string;
  name?: string;
  email?: string;
  whatsapp?: string;
  country?: string;
  hectares?: string;
}

interface MatchedCase {
  slug: string;
  title: string;
  cropEn: string;
  cropEs: string;
  yieldIncreasePct: number | null;
  confidenceScore: number;
}
interface Issue {
  causeEn: string;
  causeEs: string;
  recommendationEn: string;
  recommendationEs: string;
  productName: string | null;
  dosage: string | null;
}
interface Result {
  leadId: string;
  issues: Issue[];
  matchedCases: MatchedCase[];
}

export function DiagnosticWizard(props: DiagnosticWizardProps) {
  const { dict, locale } = props;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ symptoms: [] });
  const [result, setResult] = useState<Result | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);

  const steps = [
    dict.diagnostic.stepCrop,
    dict.diagnostic.stepClimate,
    dict.diagnostic.stepSymptoms,
    dict.diagnostic.stepStage,
    dict.diagnostic.stepGoal,
    dict.diagnostic.stepContact,
  ];

  function toggleSymptom(v: string) {
    setAnswers((a) => ({
      ...a,
      symptoms: a.symptoms.includes(v) ? a.symptoms.filter((x) => x !== v) : [...a.symptoms, v],
    }));
  }

  async function submit() {
    setSending(true);
    setError(false);
    try {
      const res = await fetch("/api/diagnostic", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          crop: answers.crop,
          climate: answers.climate,
          symptoms: answers.symptoms,
          stage: answers.stage,
          goal: answers.goal,
          name: answers.name,
          email: answers.email || undefined,
          whatsapp: answers.whatsapp || undefined,
          country: answers.country || undefined,
          hectares: answers.hectares ? Number(answers.hectares) : undefined,
        }),
      });
      if (!res.ok) throw new Error();
      setResult(await res.json());
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  }

  if (result) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{dict.diagnostic.resultTitle}</h2>
        <section className="rounded-xl border border-border bg-white p-5">
          <h3 className="font-semibold">{dict.diagnostic.likelyIssues}</h3>
          <ul className="mt-3 space-y-3">
            {result.issues.length === 0 && <li className="text-muted">—</li>}
            {result.issues.map((i, idx) => (
              <li key={idx}>
                <p className="font-medium">{locale === "es" ? i.causeEs : i.causeEn}</p>
                <p className="text-sm text-muted">{locale === "es" ? i.recommendationEs : i.recommendationEn}</p>
                {i.productName && <p className="text-sm text-brand-dark">{i.productName}{i.dosage ? ` — ${i.dosage}` : ""}</p>}
              </li>
            ))}
          </ul>
        </section>
        {result.matchedCases.length > 0 && (
          <section className="rounded-xl border border-border bg-white p-5">
            <h3 className="font-semibold">{dict.diagnostic.matchedCases}</h3>
            <ul className="mt-3 space-y-2">
              {result.matchedCases.map((c) => (
                <li key={c.slug}>
                  <Link href={`/${locale}/case-studies/${c.slug}`} className="text-brand-dark underline">
                    {c.title}
                  </Link>{" "}
                  <span className="text-sm text-muted">
                    ({locale === "es" ? c.cropEs : c.cropEn} · {c.yieldIncreasePct ?? "—"}% · {dict.cases.confidence} {c.confidenceScore})
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
        <a
          href={`/api/diagnostic/report?lead=${result.leadId}&lang=${locale}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand-dark"
        >
          {dict.diagnostic.download}
        </a>
      </div>
    );
  }

  const isLast = step === steps.length - 1;
  const canProceed =
    step === 0 ? !!answers.crop :
    step === 5 ? !!answers.name && (!!answers.email || !!answers.whatsapp) :
    true;

  return (
    <div className="rounded-xl border border-border bg-white p-6">
      {/* progress */}
      <div className="mb-6 flex gap-1">
        {steps.map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-brand" : "bg-gray-200"}`} />
        ))}
      </div>

      <h2 className="text-lg font-semibold">{steps[step]}</h2>
      <div className="mt-4">
        {step === 0 && <Choices options={props.crops} value={answers.crop} onPick={(v) => setAnswers((a) => ({ ...a, crop: v }))} />}
        {step === 1 && <Choices options={props.climates} value={answers.climate} onPick={(v) => setAnswers((a) => ({ ...a, climate: v }))} />}
        {step === 2 && <MultiChoices options={props.symptoms} values={answers.symptoms} onToggle={toggleSymptom} />}
        {step === 3 && <Choices options={props.stages} value={answers.stage} onPick={(v) => setAnswers((a) => ({ ...a, stage: v }))} />}
        {step === 4 && <Choices options={props.goals} value={answers.goal} onPick={(v) => setAnswers((a) => ({ ...a, goal: v }))} />}
        {step === 5 && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Text label={dict.lead.name} value={answers.name} onChange={(v) => setAnswers((a) => ({ ...a, name: v }))} />
            <Text label={dict.lead.email} value={answers.email} onChange={(v) => setAnswers((a) => ({ ...a, email: v }))} type="email" />
            <Text label={dict.lead.whatsapp} value={answers.whatsapp} onChange={(v) => setAnswers((a) => ({ ...a, whatsapp: v }))} />
            <Text label={dict.lead.country} value={answers.country} onChange={(v) => setAnswers((a) => ({ ...a, country: v }))} />
            <Text label={dict.lead.hectares} value={answers.hectares} onChange={(v) => setAnswers((a) => ({ ...a, hectares: v }))} type="number" />
          </div>
        )}
      </div>

      {error && <p className="mt-4 text-sm text-red-600">⚠︎</p>}

      <div className="mt-6 flex justify-between">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-40"
        >
          {dict.diagnostic.back}
        </button>
        {isLast ? (
          <button onClick={submit} disabled={!canProceed || sending} className="rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50">
            {dict.diagnostic.submit}
          </button>
        ) : (
          <button onClick={() => setStep((s) => s + 1)} disabled={!canProceed} className="rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50">
            {dict.diagnostic.next}
          </button>
        )}
      </div>
    </div>
  );
}

function Choices({ options, value, onPick }: { options: Option[]; value?: string; onPick: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onPick(o.value)}
          className={`rounded-full border px-4 py-2 text-sm ${value === o.value ? "border-brand bg-brand text-white" : "border-border bg-white hover:bg-brand-light"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function MultiChoices({ options, values, onToggle }: { options: Option[]; values: string[]; onToggle: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onToggle(o.value)}
          className={`rounded-full border px-4 py-2 text-sm ${values.includes(o.value) ? "border-brand bg-brand text-white" : "border-border bg-white hover:bg-brand-light"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Text({ label, value, onChange, type = "text" }: { label: string; value?: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted">{label}</span>
      <input type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
    </label>
  );
}
