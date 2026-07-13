"use client";
import { useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export interface LeadFormProps {
  dict: Dictionary;
  source: string;
  sourceRef?: string;
  defaults?: { crop?: string; country?: string };
  compact?: boolean;
}

export function LeadForm({ dict, source, sourceRef, defaults, compact }: LeadFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload: Record<string, unknown> = { source, sourceRef };
    fd.forEach((value, key) => {
      if (key === "hectares") payload[key] = value ? Number(value) : undefined;
      else if (["needConsultation", "needTrial", "needDistributor"].includes(key)) payload[key] = value === "on";
      else payload[key] = value || undefined;
    });
    // UTM passthrough
    const qs = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    qs.forEach((v, k) => { if (k.startsWith("utm_")) utm[k] = v; });
    if (Object.keys(utm).length) payload.utm = utm;

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      setStatus(res.ok ? "done" : "error");
      if (res.ok) form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-xl border border-brand bg-brand-light p-6 text-center text-brand-dark">
        {dict.lead.thanks}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Input name="name" label={dict.lead.name} required />
        <Input name="company" label={dict.lead.company} />
        <Input name="email" label={dict.lead.email} type="email" />
        <Input name="whatsapp" label={dict.lead.whatsapp} />
        <Input name="country" label={dict.lead.country} defaultValue={defaults?.country} />
        <Input name="crop" label={dict.lead.crop} defaultValue={defaults?.crop} />
        {!compact && (
          <>
            <Input name="hectares" label={dict.lead.hectares} type="number" />
            <Input name="currentYield" label={dict.lead.currentYield} />
            <Input name="currentProducts" label={dict.lead.products} />
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted">{dict.lead.urgency}</span>
              <select name="urgency" className="w-full rounded-lg border border-border px-3 py-2 text-sm">
                <option value="low">●</option>
                <option value="medium">●●</option>
                <option value="high">●●●</option>
              </select>
            </label>
          </>
        )}
      </div>
      {!compact && (
        <Input name="problem" label={dict.lead.problem} textarea />
      )}
      <div className="flex flex-wrap gap-4 text-sm">
        <Check name="needConsultation" label={dict.lead.needConsultation} />
        <Check name="needTrial" label={dict.lead.needTrial} />
        <Check name="needDistributor" label={dict.lead.needDistributor} />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-lg bg-brand px-4 py-3 font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {dict.lead.submit}
      </button>
      {status === "error" && <p className="text-sm text-red-600">⚠︎</p>}
    </form>
  );
}

function Input({
  name,
  label,
  type = "text",
  required,
  defaultValue,
  textarea,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted">
        {label}{required && " *"}
      </span>
      {textarea ? (
        <textarea name={name} rows={3} className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
      ) : (
        <input name={name} type={type} required={required} defaultValue={defaultValue} className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
      )}
    </label>
  );
}

function Check({ name, label }: { name: string; label: string }) {
  return (
    <label className="inline-flex items-center gap-2">
      <input type="checkbox" name={name} className="h-4 w-4 rounded border-border text-brand" />
      <span>{label}</span>
    </label>
  );
}
