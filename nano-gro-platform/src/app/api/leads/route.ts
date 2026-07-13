import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { scoreLead } from "@/lib/leadScore";
import { notifyLead } from "@/lib/leadRouting";

const leadSchema = z.object({
  name: z.string().min(1).max(200),
  company: z.string().max(200).optional(),
  country: z.string().max(120).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(60).optional(),
  whatsapp: z.string().max(60).optional(),
  crop: z.string().max(120).optional(),
  hectares: z.number().nonnegative().optional(),
  currentProblem: z.string().max(2000).optional(),
  problem: z.string().max(2000).optional(), // alias from forms
  currentYield: z.string().max(200).optional(),
  mainObjective: z.string().max(500).optional(),
  currentProducts: z.string().max(500).optional(),
  budget: z.string().max(50).optional(),
  urgency: z.string().max(50).optional(),
  needAssistance: z.boolean().optional(),
  needDistributor: z.boolean().optional(),
  needProduct: z.boolean().optional(),
  needTrial: z.boolean().optional(),
  needConsultation: z.boolean().optional(),
  completedDiagnostic: z.boolean().optional(),
  diagnosticAnswers: z.unknown().optional(),
  engagement: z.object({
    pageViews: z.number().optional(),
    casesViewed: z.number().optional(),
    returned: z.boolean().optional(),
    downloaded: z.boolean().optional(),
  }).optional(),
  source: z.string().max(60).optional(),
  sourceRef: z.string().max(200).optional(),
  utm: z.record(z.string(), z.string()).optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation", issues: parsed.error.issues }, { status: 422 });
  }
  const d = parsed.data;
  if (!d.email && !d.phone && !d.whatsapp) {
    return NextResponse.json({ error: "contact required" }, { status: 422 });
  }

  // Fit signals from the DB (transparent inputs to the score).
  const [cropStrong, countryKnown] = await Promise.all([
    d.crop
      ? prisma.case.count({
          where: {
            publicationStatus: "PUBLISHED",
            confidenceScore: { gte: 60 },
            crop: { OR: [{ slug: d.crop }, { nameEn: d.crop }, { nameEs: d.crop }] },
          },
        })
      : Promise.resolve(0),
    d.country
      ? prisma.country.count({ where: { OR: [{ slug: d.country }, { nameEn: d.country }, { nameEs: d.country }] } })
      : Promise.resolve(0),
  ]);

  const score = scoreLead({
    hectares: d.hectares,
    cropMatchesStrongCase: cropStrong > 0,
    countryHasCoverage: countryKnown > 0,
    budget: d.budget,
    urgency: d.urgency,
    needConsultation: d.needConsultation,
    needTrial: d.needTrial,
    needDistributor: d.needDistributor,
    needProduct: d.needProduct,
    completedDiagnostic: d.completedDiagnostic,
    pageViews: d.engagement?.pageViews,
    casesViewed: d.engagement?.casesViewed,
    returned: d.engagement?.returned,
    downloaded: d.engagement?.downloaded,
  });

  const lead = await prisma.lead.create({
    data: {
      name: d.name,
      company: d.company,
      country: d.country,
      email: d.email,
      phone: d.phone,
      whatsapp: d.whatsapp,
      crop: d.crop,
      hectares: d.hectares,
      currentProblem: d.currentProblem ?? d.problem,
      currentYield: d.currentYield,
      mainObjective: d.mainObjective,
      currentProducts: d.currentProducts,
      budget: d.budget,
      urgency: d.urgency,
      needAssistance: d.needAssistance ?? false,
      needDistributor: d.needDistributor ?? false,
      needProduct: d.needProduct ?? false,
      needTrial: d.needTrial ?? false,
      needConsultation: d.needConsultation ?? false,
      completedDiagnostic: d.completedDiagnostic ?? false,
      diagnosticAnswers: d.diagnosticAnswers === undefined ? undefined : (d.diagnosticAnswers as object),
      engagement: d.engagement,
      score: score.score,
      band: score.band,
      source: d.source,
      sourceRef: d.sourceRef,
      utm: d.utm,
    },
  });

  await notifyLead(
    { id: lead.id, name: lead.name, email: lead.email, phone: lead.phone, whatsapp: lead.whatsapp, country: lead.country, crop: lead.crop, source: lead.source },
    score,
  );

  return NextResponse.json({ ok: true, id: lead.id, band: score.band });
}
