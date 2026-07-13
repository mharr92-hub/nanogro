export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

export function buildCaseSlug(input: {
  crop?: string | null;
  country?: string | null;
  problem?: string | null;
  result?: number | null;
  title: string;
  publicId?: string | null;
}) {
  const resultPart = typeof input.result === "number" ? `${Math.round(input.result)}pct` : null;
  const parts = [input.crop, input.country, input.problem, resultPart].filter(Boolean) as string[];
  const base = parts.length >= 3 ? parts.join(" ") : `${input.title} ${input.publicId ?? ""}`;
  return slugify(base);
}
