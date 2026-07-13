import { prisma } from "@/lib/db";
import { runDiagnostic, type DiagnosticAnswers } from "@/lib/diagnostic";
import { localizedName } from "@/lib/format";
import type { Locale } from "@/lib/i18n/config";

// Branded diagnostic report. MVP renders a print-optimized HTML document
// (browser "Save as PDF"); a server-rendered binary PDF is a Phase-2 upgrade.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const leadId = url.searchParams.get("lead");
  const lang = (url.searchParams.get("lang") === "en" ? "en" : "es") as Locale;
  if (!leadId) return new Response("missing lead", { status: 400 });

  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead || !lead.diagnosticAnswers) return new Response("not found", { status: 404 });

  const answers = lead.diagnosticAnswers as DiagnosticAnswers;
  const result = await runDiagnostic(answers);

  const tt = (en: string, es: string) => (lang === "es" ? es : en);
  const issuesHtml = result.issues
    .map(
      (i) => `<li><strong>${esc(lang === "es" ? i.causeEs : i.causeEn)}</strong><br/>
      ${esc(lang === "es" ? i.recommendationEs : i.recommendationEn)}
      ${i.productName ? `<br/><em>${esc(i.productName)}${i.dosage ? " — " + esc(i.dosage) : ""}</em>` : ""}</li>`,
    )
    .join("");
  const casesHtml = result.matchedCases
    .map(
      (c) => `<li>${esc(c.title)} — ${esc(localizedName(c.crop, lang))}, ${esc(localizedName(c.country, lang))}
      (${c.yieldIncreasePct ?? "—"}% ${tt("yield", "rend.")}, ${tt("confidence", "confianza")} ${c.confidenceScore})</li>`,
    )
    .join("");

  const html = `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${tt("Nano-Gro Diagnosis", "Diagnóstico Nano-Gro")}</title>
  <style>
    body{font-family:system-ui,Arial,sans-serif;color:#14271c;max-width:760px;margin:2rem auto;padding:0 1rem;line-height:1.5}
    h1{color:#155c39} .brand{font-weight:700;color:#1f7a4d}
    .box{border:1px solid #e2e8e4;border-radius:8px;padding:1rem;margin:1rem 0}
    .btn{background:#1f7a4d;color:#fff;border:none;padding:.6rem 1rem;border-radius:6px;cursor:pointer}
    @media print{.btn{display:none}}
    li{margin:.5rem 0}
  </style></head><body>
  <div class="brand">Nano-Gro</div>
  <h1>${tt("Your agronomic diagnosis", "Tu diagnóstico agronómico")}</h1>
  <p>${tt("Prepared for", "Preparado para")}: <strong>${esc(lead.name)}</strong>${lead.crop ? ` · ${esc(lead.crop)}` : ""}</p>
  <div class="box"><h2>${tt("Likely issues & recommendations", "Problemas probables y recomendaciones")}</h2>
  <ul>${issuesHtml || `<li>${tt("No specific rule matched; an advisor will follow up.", "Ninguna regla específica coincidió; un asesor te contactará.")}</li>`}</ul></div>
  <div class="box"><h2>${tt("Matching case studies", "Casos de estudio coincidentes")}</h2>
  <ul>${casesHtml || `<li>—</li>`}</ul></div>
  <p style="color:#5b6b62;font-size:.85rem">${tt("This report is informational. Results vary by conditions.", "Este reporte es informativo. Los resultados varían según las condiciones.")}</p>
  <button class="btn" onclick="window.print()">${tt("Save as PDF", "Guardar como PDF")}</button>
  </body></html>`;

  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch] || ch));
}
