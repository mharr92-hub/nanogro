import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { Container } from "@/components/ui";
import { DiagnosticWizard, type Option } from "@/components/DiagnosticWizard";
import { localizedName } from "@/lib/format";

export const revalidate = 3600;

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(isLocale(lang) ? lang : "es");
  return { title: dict.diagnostic.title, description: dict.diagnostic.intro };
}

// Symptom keys MUST match DiagnosticRule.symptomKeys in the seed/rule data.
const SYMPTOMS: Record<Locale, Option[]> = {
  en: [
    { value: "yellowing-leaves", label: "Yellowing leaves" },
    { value: "stunted-growth", label: "Stunted growth" },
    { value: "wilting", label: "Wilting" },
    { value: "root-rot", label: "Root rot" },
    { value: "drought", label: "Drought / heat stress" },
    { value: "leaf-curl", label: "Leaf curl" },
  ],
  es: [
    { value: "yellowing-leaves", label: "Hojas amarillas" },
    { value: "stunted-growth", label: "Crecimiento atrofiado" },
    { value: "wilting", label: "Marchitez" },
    { value: "root-rot", label: "Pudrición radicular" },
    { value: "drought", label: "Estrés hídrico / calor" },
    { value: "leaf-curl", label: "Enrollamiento foliar" },
  ],
};
const STAGES: Record<Locale, Option[]> = {
  en: [
    { value: "seedling", label: "Seedling" },
    { value: "vegetative", label: "Vegetative" },
    { value: "flowering", label: "Flowering" },
    { value: "fruiting", label: "Fruiting / filling" },
  ],
  es: [
    { value: "seedling", label: "Plántula" },
    { value: "vegetative", label: "Vegetativa" },
    { value: "flowering", label: "Floración" },
    { value: "fruiting", label: "Fructificación / llenado" },
  ],
};
const GOALS: Record<Locale, Option[]> = {
  en: [
    { value: "yield", label: "Increase yield" },
    { value: "quality", label: "Improve quality" },
    { value: "disease", label: "Control disease" },
    { value: "cost", label: "Reduce costs" },
  ],
  es: [
    { value: "yield", label: "Aumentar rendimiento" },
    { value: "quality", label: "Mejorar calidad" },
    { value: "disease", label: "Controlar enfermedad" },
    { value: "cost", label: "Reducir costos" },
  ],
};

export default async function DiagnosticPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  const [crops, climates] = await Promise.all([
    prisma.crop.findMany({ orderBy: { nameEn: "asc" } }),
    prisma.climate.findMany({ orderBy: { nameEn: "asc" } }),
  ]);

  const cropOptions: Option[] = crops.map((c) => ({ value: c.slug, label: localizedName(c, lang) }));
  const climateOptions: Option[] = climates.map((c) => ({ value: c.slug, label: localizedName(c, lang) }));

  return (
    <Container className="py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight">{dict.diagnostic.title}</h1>
        <p className="mt-2 text-muted">{dict.diagnostic.intro}</p>
        <div className="mt-8">
          <DiagnosticWizard
            dict={dict}
            locale={lang}
            crops={cropOptions}
            climates={climateOptions}
            symptoms={SYMPTOMS[lang]}
            stages={STAGES[lang]}
            goals={GOALS[lang]}
          />
        </div>
      </div>
    </Container>
  );
}
