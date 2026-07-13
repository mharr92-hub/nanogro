import "server-only";
import Anthropic from "@anthropic-ai/sdk";

// Staged AI-assisted intake (spec §3 / plan §3): turn raw Word/Docs case text into
// a structured draft for human review. Uses Claude when ANTHROPIC_API_KEY is set,
// otherwise a heuristic parser so the import tool still works offline.

export interface ExtractedCase {
  title: string | null;
  farmName: string | null;
  farmerName: string | null;
  country: string | null;
  region: string | null;
  crop: string | null;
  variety: string | null;
  climate: string | null;
  soilType: string | null;
  farmSizeHa: number | null;
  problems: string[];
  treatmentProduct: string | null;
  dosage: string | null;
  applicationMethod: string | null;
  applicationFrequency: string | null;
  hasControlGroup: boolean;
  yieldIncreasePct: number | null;
  qualityImprovePct: number | null;
  diseaseReductPct: number | null;
  roiPct: number | null;
  conclusions: string | null;
  agronomistNotes: string | null;
  confidenceNote: string | null;
}

export const EMPTY_EXTRACTION: ExtractedCase = {
  title: null, farmName: null, farmerName: null, country: null, region: null,
  crop: null, variety: null, climate: null, soilType: null, farmSizeHa: null,
  problems: [], treatmentProduct: "Nano-Gro", dosage: null, applicationMethod: null,
  applicationFrequency: null, hasControlGroup: false, yieldIncreasePct: null,
  qualityImprovePct: null, diseaseReductPct: null, roiPct: null, conclusions: null,
  agronomistNotes: null, confidenceNote: null,
};

const SYSTEM = `You extract structured data from raw agricultural case study notes about the biostimulant "Nano-Gro".
Return ONLY a JSON object matching the provided shape. Use null when a field is not present in the text.
Percentages must be numbers (e.g. 23.5 for "23.5%"). Do not invent values that are not supported by the text.`;

export async function extractCaseFromText(raw: string): Promise<ExtractedCase> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return heuristicExtract(raw);

  try {
    const client = new Anthropic({ apiKey: key });
    const msg = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: `Extract this case into JSON with keys: ${Object.keys(EMPTY_EXTRACTION).join(", ")}.\n\nCASE TEXT:\n${raw}`,
        },
      ],
    });
    const text = msg.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");
    const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
    const parsed = JSON.parse(json) as Partial<ExtractedCase>;
    return { ...EMPTY_EXTRACTION, ...parsed };
  } catch (err) {
    console.error("[ai] extraction failed, using heuristic:", err);
    return heuristicExtract(raw);
  }
}

// Regex/keyword fallback — good enough to pre-fill a draft for human correction.
function heuristicExtract(raw: string): ExtractedCase {
  const out: ExtractedCase = { ...EMPTY_EXTRACTION };
  const firstLine = raw.split("\n").map((l) => l.trim()).find((l) => l.length > 0);
  out.title = firstLine ?? null;

  const num = (label: RegExp): number | null => {
    const m = raw.match(label);
    return m ? Number(m[1].replace(",", ".")) : null;
  };
  out.yieldIncreasePct = num(/yield[^.\d]*?([\d.,]+)\s*%/i) ?? num(/rendimiento[^.\d]*?([\d.,]+)\s*%/i);
  out.diseaseReductPct = num(/disease[^.\d]*?([\d.,]+)\s*%/i) ?? num(/enfermedad[^.\d]*?([\d.,]+)\s*%/i);
  out.roiPct = num(/roi[^.\d]*?([\d.,]+)\s*%/i);
  out.farmSizeHa = num(/([\d.,]+)\s*(?:ha|hect)/i);
  out.hasControlGroup = /control\s*group|grupo\s*control|testigo/i.test(raw);

  const country = raw.match(/\b(Mexico|México|Brazil|Brasil|Colombia|Peru|Perú|Argentina|Chile|Ecuador|Guatemala|Honduras|USA|United States)\b/i);
  out.country = country ? country[1] : null;
  return out;
}
