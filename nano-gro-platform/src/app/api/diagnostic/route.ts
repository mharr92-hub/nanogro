import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { runDiagnostic } from "@/lib/diagnostic";
import { scoreLead } from "@/lib/leadScore";
import { notifyLead } from "@/lib/leadRouting";

const schema = z.object({
  crop: z.string().optional(),
  climate: z.string().optional(),
  symptoms: z.array(z.string()).default([]),
  stage: z.string().optional(),
  goal: z.string().optional(),
  // contact
  name: z.string().min(1),
  email: z.string().email().optional(),
  whatsapp: z.string().optional(),
  country: z.string().optional(),
  hectares: z.number().optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation", issues: parsed.error.issues }, { status: 422 });
  }
  const d = parsed.data;
  if (!d.email && !d.whatsapp) {
    return NextResponse.json({ error: "contact required" }, { status: 422 });
  }

  const result = await runDiagnostic({
    crop: d.crop,
    climate: d.climate,
    symptoms: d.symptoms,
    stage: d.stage,
    goal: d.goal,
  });

  const cropStrong = d.crop
    ? await prisma.case.count({ where: { publicationStatus: "PUBLISHED", confidenceScore: { gte: 60 }, crop: { slug: d.crop } } })
    : 0;

  const score = scoreLead({
    hectares: d.hectares,
    cropMatchesStrongCase: cropStrong > 0,
    countryHasCoverage: !!d.country,
    urgency: "medium",
    completedDiagnostic: true,
    needConsultation: true,
  });

  const answers = { crop: d.crop, climate: d.climate, symptoms: d.symptoms, stage: d.stage, goal: d.goal };

  const lead = await prisma.lead.create({
    data: {
      name: d.name,
      email: d.email,
      whatsapp: d.whatsapp,
      country: d.country,
      crop: d.crop,
      hectares: d.hectares,
      mainObjective: d.goal,
      needConsultation: true,
      completedDiagnostic: true,
      diagnosticAnswers: answers,
      score: score.score,
      band: score.band,
      source: "diagnostic",
    },
  });

  await notifyLead(
    { id: lead.id, name: lead.name, email: lead.email, whatsapp: lead.whatsapp, country: lead.country, crop: lead.crop, source: "diagnostic" },
    score,
  );

  return NextResponse.json({
    leadId: lead.id,
    issues: result.issues,
    matchedCases: result.matchedCases.map((c) => ({
      slug: c.slug,
      title: c.title,
      cropEn: c.crop.nameEn,
      cropEs: c.crop.nameEs,
      countryEn: c.country.nameEn,
      countryEs: c.country.nameEs,
      yieldIncreasePct: c.yieldIncreasePct,
      roiPct: c.roiPct,
      confidenceScore: c.confidenceScore,
    })),
  });
}
