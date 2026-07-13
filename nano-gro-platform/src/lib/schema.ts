// JSON-LD (schema.org) builders for SEO. Rendered as a <script type="application/ld+json">.
// Strings are sanitized at render time by escaping "<" (see <JsonLd/> component).

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Nano-Gro",
    url: SITE,
    description:
      "The world's most documented database of Nano-Gro agricultural case studies.",
  };
}

export interface CaseLdInput {
  slug: string;
  title: string;
  description: string;
  cropName: string;
  countryName: string;
  yieldIncreasePct: number | null;
  publishedAt: Date | null;
  imageUrl?: string | null;
  locale: string;
}

export function caseStudyLd(c: CaseLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: c.title,
    description: c.description,
    inLanguage: c.locale,
    datePublished: c.publishedAt ? c.publishedAt.toISOString() : undefined,
    image: c.imageUrl || undefined,
    about: [
      { "@type": "Thing", name: c.cropName },
      { "@type": "Place", name: c.countryName },
    ],
    isPartOf: { "@type": "Dataset", name: "Nano-Gro Case Studies" },
    url: `${SITE}/${c.locale}/case-studies/${c.slug}`,
  };
}

export function breadcrumbLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE}${it.url}`,
    })),
  };
}

export function faqLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: { "@type": "Answer", text: it.answer },
    })),
  };
}
