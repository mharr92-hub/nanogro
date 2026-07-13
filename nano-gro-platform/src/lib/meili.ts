import "server-only";
import { MeiliSearch } from "meilisearch";

// Optional Meilisearch sync. No-ops when MEILI_HOST is unset so the app runs
// without it (Postgres is the search source of truth — see lib/search.ts).

const HOST = process.env.MEILI_HOST;
const KEY = process.env.MEILI_KEY;
const INDEX = "cases";

function client(): MeiliSearch | null {
  if (!HOST) return null;
  return new MeiliSearch({ host: HOST, apiKey: KEY });
}

export interface CaseIndexDoc {
  id: string;
  slug: string;
  title: string;
  crop: string;
  country: string;
  problems: string[];
  yieldIncreasePct: number | null;
  roiPct: number | null;
  confidenceScore: number;
  language: string;
}

export async function syncCaseToIndex(doc: CaseIndexDoc): Promise<void> {
  const c = client();
  if (!c) return;
  try {
    await c.index(INDEX).addDocuments([doc], { primaryKey: "id" });
  } catch (err) {
    console.error("[meili] sync failed (non-fatal):", err);
  }
}

export async function removeCaseFromIndex(id: string): Promise<void> {
  const c = client();
  if (!c) return;
  try {
    await c.index(INDEX).deleteDocument(id);
  } catch (err) {
    console.error("[meili] delete failed (non-fatal):", err);
  }
}
