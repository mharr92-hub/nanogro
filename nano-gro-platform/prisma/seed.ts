import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { computeConfidence, deriveSuccessLevel } from "../src/lib/confidence";

const prisma = new PrismaClient();

async function main() {
  // --- Admin user ---
  const passwordHash = await bcrypt.hash("nanogro123", 10);
  await prisma.user.upsert({
    where: { email: "admin@nano-gro.local" },
    update: {},
    create: {
      email: "admin@nano-gro.local",
      name: "Platform Admin",
      role: "ADMIN",
      passwordHash,
    },
  });

  // --- Taxonomy ---
  const crops = [
    { slug: "soybean", nameEn: "Soybean", nameEs: "Soya" },
    { slug: "maize", nameEn: "Maize", nameEs: "Maíz" },
    { slug: "coffee", nameEn: "Coffee", nameEs: "Café" },
    { slug: "tomato", nameEn: "Tomato", nameEs: "Tomate" },
    { slug: "potato", nameEn: "Potato", nameEs: "Papa" },
  ];
  for (const c of crops) {
    await prisma.crop.upsert({ where: { slug: c.slug }, update: c, create: c });
  }

  const countries = [
    { slug: "brazil", code: "BR", nameEn: "Brazil", nameEs: "Brasil" },
    { slug: "mexico", code: "MX", nameEn: "Mexico", nameEs: "México" },
    { slug: "colombia", code: "CO", nameEn: "Colombia", nameEs: "Colombia" },
  ];
  for (const c of countries) {
    await prisma.country.upsert({ where: { slug: c.slug }, update: c, create: c });
  }

  const climates = [
    { slug: "tropical-humid", nameEn: "Tropical humid", nameEs: "Tropical húmedo" },
    { slug: "subtropical", nameEn: "Subtropical", nameEs: "Subtropical" },
    { slug: "arid", nameEn: "Arid", nameEs: "Árido" },
  ];
  for (const c of climates) {
    await prisma.climate.upsert({ where: { slug: c.slug }, update: c, create: c });
  }

  const soils = [
    { slug: "clay-loam", nameEn: "Clay loam", nameEs: "Franco arcilloso" },
    { slug: "sandy", nameEn: "Sandy", nameEs: "Arenoso" },
  ];
  for (const s of soils) {
    await prisma.soilType.upsert({ where: { slug: s.slug }, update: s, create: s });
  }

  const problems = [
    { slug: "root-fungal-disease", type: "DISEASE" as const, nameEn: "Root fungal disease", nameEs: "Enfermedad fúngica radicular" },
    { slug: "low-yield", type: "ENVIRONMENTAL" as const, nameEn: "Low yield", nameEs: "Bajo rendimiento" },
    { slug: "nitrogen-deficiency", type: "DEFICIENCY" as const, nameEn: "Nitrogen deficiency", nameEs: "Deficiencia de nitrógeno" },
    { slug: "drought-stress", type: "ENVIRONMENTAL" as const, nameEn: "Drought stress", nameEs: "Estrés hídrico" },
  ];
  for (const p of problems) {
    await prisma.problem.upsert({ where: { slug: p.slug }, update: p, create: p });
  }

  // --- Diagnostic rules ---
  const rules = [
    {
      cropSlug: null,
      symptomKeys: ["yellowing-leaves", "stunted-growth"],
      problemSlug: "nitrogen-deficiency",
      causeEn: "Likely nitrogen deficiency limiting vegetative growth.",
      causeEs: "Probable deficiencia de nitrógeno que limita el crecimiento vegetativo.",
      recommendationEn: "Apply Nano-Gro to stimulate root uptake and improve nutrient assimilation.",
      recommendationEs: "Aplicar Nano-Gro para estimular la absorción radicular y mejorar la asimilación de nutrientes.",
      productName: "Nano-Gro",
      dosage: "1 tablet / 200 L",
      applicationMethod: "Foliar + soil drench",
      priority: 10,
    },
    {
      cropSlug: null,
      symptomKeys: ["wilting", "root-rot"],
      problemSlug: "root-fungal-disease",
      causeEn: "Symptoms consistent with root fungal pressure.",
      causeEs: "Síntomas consistentes con presión fúngica radicular.",
      recommendationEn: "Use Nano-Gro to strengthen root systems and plant immune response alongside an IPM program.",
      recommendationEs: "Usar Nano-Gro para fortalecer el sistema radicular y la respuesta inmune, junto con un programa MIP.",
      productName: "Nano-Gro",
      dosage: "1 tablet / 200 L",
      applicationMethod: "Soil drench",
      priority: 8,
    },
    {
      cropSlug: null,
      symptomKeys: ["drought", "leaf-curl"],
      problemSlug: "drought-stress",
      causeEn: "Water/heat stress reducing performance.",
      causeEs: "Estrés hídrico/térmico reduciendo el desempeño.",
      recommendationEn: "Nano-Gro improves stress tolerance and root depth; combine with irrigation scheduling.",
      recommendationEs: "Nano-Gro mejora la tolerancia al estrés y la profundidad radicular; combinar con calendario de riego.",
      productName: "Nano-Gro",
      dosage: "1 tablet / 200 L",
      applicationMethod: "Foliar",
      priority: 6,
    },
  ];
  // Reset rules to keep seed idempotent.
  await prisma.diagnosticRule.deleteMany({});
  for (const r of rules) await prisma.diagnosticRule.create({ data: r });

  // --- Sample cases ---
  const soybean = await prisma.crop.findUniqueOrThrow({ where: { slug: "soybean" } });
  const coffee = await prisma.crop.findUniqueOrThrow({ where: { slug: "coffee" } });
  const brazil = await prisma.country.findUniqueOrThrow({ where: { slug: "brazil" } });
  const colombia = await prisma.country.findUniqueOrThrow({ where: { slug: "colombia" } });
  const tropical = await prisma.climate.findUniqueOrThrow({ where: { slug: "tropical-humid" } });
  const lowYield = await prisma.problem.findUniqueOrThrow({ where: { slug: "low-yield" } });
  const rootDisease = await prisma.problem.findUniqueOrThrow({ where: { slug: "root-fungal-disease" } });

  const case1Conf = computeConfidence({
    hasControlGroup: true,
    verificationStatus: "AGRONOMIST_VERIFIED",
    labReportCount: 1,
    hasBeforeAfter: true,
    photoCount: 3,
    resultMetricsPresent: 3,
    multiSeason: false,
  });

  await prisma.case.upsert({
    where: { publicId: "NG-BR-0001" },
    update: {},
    create: {
      publicId: "NG-BR-0001",
      slug: "soybean-yield-brazil-mato-grosso",
      language: "es",
      title: "Aumento de 28% en rendimiento de soya con Nano-Gro — Mato Grosso, Brasil",
      farmName: "Fazenda Boa Esperança",
      farmSizeHa: 320,
      variety: "BRS 7280",
      hasControlGroup: true,
      yieldIncreasePct: 28,
      qualityImprovePct: 12,
      roiPct: 240,
      conclusions:
        "El lote tratado con Nano-Gro superó al testigo en 28% de rendimiento con mejor desarrollo radicular y llenado de grano.",
      agronomistNotes: "Ensayo con grupo control adyacente. Reporte de laboratorio de suelo adjunto.",
      tags: ["soya", "rendimiento", "brasil"],
      keywords: ["soybean yield", "nano-gro brazil"],
      verificationStatus: "AGRONOMIST_VERIFIED",
      successLevel: deriveSuccessLevel(28, 240),
      confidenceScore: case1Conf.score,
      publicationStatus: "PUBLISHED",
      featured: true,
      publishedAt: new Date("2025-09-15"),
      treatment: { product: "Nano-Gro", dosage: "1 tablet / 200 L", method: "Foliar + soil", frequency: "2 applications", controlGroup: true },
      results: { rootDevelopment: "Marked increase", plantHeightCm: 92, costSavings: "Reduced fungicide passes" },
      cropId: soybean.id,
      countryId: brazil.id,
      climateId: tropical.id,
      problems: { connect: [{ id: lowYield.id }] },
    },
  });

  const case2Conf = computeConfidence({
    hasControlGroup: false,
    verificationStatus: "DISTRIBUTOR_VERIFIED",
    labReportCount: 0,
    hasBeforeAfter: true,
    photoCount: 2,
    resultMetricsPresent: 2,
    multiSeason: false,
  });

  await prisma.case.upsert({
    where: { publicId: "NG-CO-0001" },
    update: {},
    create: {
      publicId: "NG-CO-0001",
      slug: "coffee-root-health-colombia-huila",
      language: "es",
      title: "Mejor sanidad radicular y +18% en café — Huila, Colombia",
      farmName: "Finca La Esperanza",
      farmSizeHa: 12,
      hasControlGroup: false,
      yieldIncreasePct: 18,
      diseaseReductPct: 35,
      roiPct: 160,
      conclusions:
        "La aplicación de Nano-Gro redujo la incidencia de enfermedad radicular y mejoró el vigor de las plantas.",
      tags: ["café", "raíces", "colombia"],
      keywords: ["coffee nano-gro", "root disease"],
      verificationStatus: "DISTRIBUTOR_VERIFIED",
      successLevel: deriveSuccessLevel(18, 160),
      confidenceScore: case2Conf.score,
      publicationStatus: "PUBLISHED",
      featured: false,
      publishedAt: new Date("2025-10-02"),
      treatment: { product: "Nano-Gro", dosage: "1 tablet / 200 L", method: "Soil drench", frequency: "Monthly", controlGroup: false },
      results: { rootDevelopment: "Healthier root mass", notes: "Lower fungal incidence" },
      cropId: coffee.id,
      countryId: colombia.id,
      climateId: tropical.id,
      problems: { connect: [{ id: rootDisease.id }] },
    },
  });

  console.log("Seed complete. Admin login: admin@nano-gro.local / nanogro123");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
