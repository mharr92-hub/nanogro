// Lead scoring model (spec §9). Transparent, tunable, 0–100 across three axes:
// Fit (40) + Intent (35) + Engagement (25). Returns a band for routing.

export type LeadBand = "HOT" | "WARM" | "COLD";

export interface LeadScoreInput {
  // Fit
  hectares?: number | null;
  cropMatchesStrongCase?: boolean; // crop has high-confidence published cases
  countryHasCoverage?: boolean; // a distributor/sales presence exists
  budget?: "low" | "medium" | "high" | string | null;
  // Intent
  urgency?: "low" | "medium" | "high" | string | null;
  needConsultation?: boolean;
  needTrial?: boolean;
  needDistributor?: boolean;
  needProduct?: boolean;
  completedDiagnostic?: boolean;
  // Engagement
  pageViews?: number;
  casesViewed?: number;
  returned?: boolean;
  downloaded?: boolean;
}

export interface LeadScoreResult {
  score: number;
  band: LeadBand;
  breakdown: { fit: number; intent: number; engagement: number };
}

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

function fitScore(i: LeadScoreInput): number {
  let s = 0;
  // Farm size → potential volume (max 18)
  const ha = i.hectares ?? 0;
  if (ha >= 500) s += 18;
  else if (ha >= 100) s += 14;
  else if (ha >= 20) s += 10;
  else if (ha >= 5) s += 6;
  else if (ha > 0) s += 3;
  // Crop matches strong evidence (max 10)
  if (i.cropMatchesStrongCase) s += 10;
  // Country coverage (max 6)
  if (i.countryHasCoverage) s += 6;
  // Budget (max 6)
  if (i.budget === "high") s += 6;
  else if (i.budget === "medium") s += 4;
  else if (i.budget === "low") s += 2;
  return clamp(s, 0, 40);
}

function intentScore(i: LeadScoreInput): number {
  let s = 0;
  if (i.urgency === "high") s += 12;
  else if (i.urgency === "medium") s += 7;
  else if (i.urgency === "low") s += 3;
  if (i.needDistributor) s += 10; // highest commercial intent
  if (i.needTrial) s += 8;
  if (i.needConsultation) s += 6;
  if (i.needProduct) s += 5;
  if (i.completedDiagnostic) s += 6;
  return clamp(s, 0, 35);
}

function engagementScore(i: LeadScoreInput): number {
  let s = 0;
  s += clamp(i.pageViews ?? 0, 0, 8);
  s += clamp((i.casesViewed ?? 0) * 2, 0, 8);
  if (i.returned) s += 5;
  if (i.downloaded) s += 4;
  return clamp(s, 0, 25);
}

export function scoreLead(input: LeadScoreInput): LeadScoreResult {
  const fit = fitScore(input);
  const intent = intentScore(input);
  const engagement = engagementScore(input);
  const score = clamp(fit + intent + engagement, 0, 100);
  const band: LeadBand = score >= 70 ? "HOT" : score >= 40 ? "WARM" : "COLD";
  return { score, band, breakdown: { fit, intent, engagement } };
}
