import type { CaseStudy, Country, EvidenceAsset, ExtractedMetric, FieldStatus, TaxonomyItem } from "@/lib/types";
import { publicEvidenceLabel } from "@/lib/evidence-labels";

type SourceDocument = {
  group: "informes" | "fichas";
  originalName: string;
  publicPath: string;
  kind: "docx" | "doc" | "pdf" | "xlsx" | "image" | "archive";
  extractionStatus: "extracted" | "needs_conversion" | "needs_ocr" | "needs_unpacking";
};

export type TechnicalSheet = {
  id: string;
  title: string;
  category: string;
  summary: string;
  source: SourceDocument;
};

const crops = [
  ["crop-sugarcane", "Sugarcane", "sugarcane", "row_crop"],
  ["crop-pepper", "Pepper / Chile", "pepper", "vegetable"],
  ["crop-bean", "Common bean", "common-bean", "legume"],
  ["crop-banana", "Banana", "banana", "fruit"],
  ["crop-loroco", "Loroco", "loroco", "vegetable"],
  ["crop-corn", "Corn / Maize", "corn", "row_crop"],
  ["crop-papaya", "Papaya", "papaya", "fruit"],
  ["crop-guava", "Guava", "guava", "fruit"],
  ["crop-cabbage", "Cabbage", "cabbage", "vegetable"],
  ["crop-tobacco", "Tobacco", "tobacco", "industrial"],
  ["crop-tomato", "Tomato", "tomato", "vegetable"],
  ["crop-vegetables", "Vegetables", "vegetables", "vegetable"],
  ["crop-mixed", "Mixed crops", "mixed-crops", "mixed"]
] satisfies [string, string, string, string][];

const countries = [
  ["country-el-salvador", "El Salvador", "el-salvador", "SV", "tropical"],
  ["country-guatemala", "Guatemala", "guatemala", "GT", "tropical"],
  ["country-jamaica", "Jamaica", "jamaica", "JM", "tropical"],
  ["country-china", "China", "china", "CN", "mixed"],
  ["country-cuba", "Cuba", "cuba", "CU", "tropical"],
  ["country-ecuador", "Ecuador", "ecuador", "EC", "tropical"],
  ["country-mexico", "Mexico", "mexico", "MX", "mixed"],
  ["country-nigeria", "Nigeria", "nigeria", "NG", "tropical"],
  ["country-poland", "Poland", "poland", "PL", "temperate"]
] satisfies [string, string, string, string, string][];

const problems = [
  ["problem-low-production", "Low production", "low-production", "yield"],
  ["problem-water-stress", "Water stress", "water-stress", "stress"],
  ["problem-weak-rooting", "Weak rooting", "weak-rooting", "roots"],
  ["problem-poor-flowering", "Poor flowering", "poor-flowering", "flowering"],
  ["problem-germination", "Germination and establishment", "germination", "establishment"],
  ["problem-post-transplant", "Post-transplant stress", "post-transplant-stress", "stress"],
  ["problem-disease-pressure", "Disease pressure", "disease-pressure", "health"],
  ["problem-nutrition", "Nutrition and vigor", "nutrition-and-vigor", "nutrition"],
  ["problem-technical-protocol", "Technical protocol", "technical-protocol", "protocol"]
] satisfies [string, string, string, string][];

export const realCrops: TaxonomyItem[] = crops.map(([id, name, slug, category]) => ({ id, name, slug, category }));
export const realCountries: Country[] = countries.map(([id, name, slug, iso_code, dominant_climate]) => ({
  id,
  name,
  slug,
  iso_code,
  dominant_climate
}));
export const realProblems: TaxonomyItem[] = problems.map(([id, name, slug, category]) => ({ id, name, slug, category }));

const cropBySlug = Object.fromEntries(realCrops.map((item) => [item.slug, item]));
const countryBySlug = Object.fromEntries(realCountries.map((item) => [item.slug, item]));
const problemBySlug = Object.fromEntries(realProblems.map((item) => [item.slug, item]));

export const sourceDocuments: SourceDocument[] = [
  doc("informes", "CAÑA PEDRO MARTINEZ.docx", "/source-data/informes/cana-pedro-martinez.docx", "docx", "extracted"),
  doc("informes", "Caña.rar", "/source-data/informes/cana.rar", "archive", "needs_unpacking"),
  doc("informes", "CHILE EN CAMPO.docx", "/source-data/informes/chile-en-campo.docx", "docx", "extracted"),
  doc("informes", "Chinese corn results.doc", "/source-data/informes/chinese-corn-results.doc", "doc", "needs_conversion"),
  doc("informes", "Contact info sp.doc", "/source-data/informes/contact-info-sp.doc", "doc", "needs_conversion"),
  doc("informes", "Cuba results page 1.jpg.jpeg", "/source-data/informes/cuba-results-page-1.jpg.jpeg", "image", "needs_ocr"),
  doc("informes", "Cuba results page 2.jpg.jpeg", "/source-data/informes/cuba-results-page-2.jpg.jpeg", "image", "needs_ocr"),
  doc("informes", "Cuba results page 3.jpg.jpeg", "/source-data/informes/cuba-results-page-3.jpg.jpeg", "image", "needs_ocr"),
  doc("informes", "Cuba results page 4.jpg.jpeg", "/source-data/informes/cuba-results-page-4.jpg.jpeg", "image", "needs_ocr"),
  doc("informes", "Cuba results page 5.jpg.jpeg", "/source-data/informes/cuba-results-page-5.jpg.jpeg", "image", "needs_ocr"),
  doc("informes", "Cuba results page 6.jpg.jpeg", "/source-data/informes/cuba-results-page-6.jpg.jpeg", "image", "needs_ocr"),
  doc("informes", "Doc 2. Inf. Carlos Reyes.docx", "/source-data/informes/doc-2.-inf.-carlos-reyes.docx", "docx", "extracted"),
  doc("informes", "Doc. 1 Info. Dir CENTA.docx", "/source-data/informes/doc.-1-info.-dir-centa.docx", "docx", "extracted"),
  doc("informes", "Equador results.pdf", "/source-data/informes/equador-results.pdf", "pdf", "needs_conversion"),
  doc("informes", "Escuela Nacional de Agricultura.E S. Nano-Gro en rendimiendo y valor nutritivo de frijol EAC v2.pdf", "/source-data/informes/escuela-nacional-de-agricultura.e-s.-nano-gro-en-rendimiendo-y-valor-nutritivo-de-frijol-eac-v2.pdf", "pdf", "needs_conversion"),
  doc("informes", "Evaluaciones en Bananos Guatemala.docx", "/source-data/informes/evaluaciones-en-bananos-guatemala.docx", "docx", "extracted"),
  doc("informes", "FRIJOL _ GERMINACIÓN(1).docx", "/source-data/informes/frijol-germinacion-1-.docx", "docx", "extracted"),
  doc("informes", "front page.jpg.jpeg", "/source-data/informes/front-page.jpg.jpeg", "image", "needs_ocr"),
  doc("informes", "Guatemala.Presentación resultados Nanogro Region Ixil - Guatemala 27nov16.pdf", "/source-data/informes/guatemala.presentacion-resultados-nanogro-region-ixil-guatemala-27nov16.pdf", "pdf", "needs_conversion"),
  doc("informes", "Hortalizas.doc", "/source-data/informes/hortalizas.doc", "doc", "needs_conversion"),
  doc("informes", "Jamaican Treated Plants.doc", "/source-data/informes/jamaican-treated-plants.doc", "doc", "needs_conversion"),
  doc("informes", "LOROCO EN PRODUCCIÓN.docx", "/source-data/informes/loroco-en-produccion.docx", "docx", "extracted"),
  doc("informes", "Maiz. Ensayos en ALBA Alimentos.docx", "/source-data/informes/maiz.-ensayos-en-alba-alimentos.docx", "docx", "extracted"),
  doc("informes", "MAÍZ FOLIAR.docx", "/source-data/informes/maiz-foliar.docx", "docx", "extracted"),
  doc("informes", "MAÍZ SEMILLAS.docx", "/source-data/informes/maiz-semillas.docx", "docx", "extracted"),
  doc("informes", "MHERNÁNDEZMaiz-1.docx", "/source-data/informes/mhernandezmaiz-1.docx", "docx", "extracted"),
  doc("informes", "MÉXICO, ENTREGA INFORME FINAL NANO-GRO FORMATO OFICIAL.pdf", "/source-data/informes/mexico-entrega-informe-final-nano-gro-formato-oficial.pdf", "pdf", "needs_conversion"),
  doc("informes", "Nano Gro Papaya.docx", "/source-data/informes/nano-gro-papaya.docx", "docx", "extracted"),
  doc("informes", "Nigeria pepper results-2009.doc", "/source-data/informes/nigeria-pepper-results-2009.doc", "doc", "needs_conversion"),
  doc("informes", "PLANTILLA de Bananos en Guatemala.xlsx", "/source-data/informes/plantilla-de-bananos-en-guatemala.xlsx", "xlsx", "extracted"),
  doc("informes", "Poland Tomato results.pdf", "/source-data/informes/poland-tomato-results.pdf", "pdf", "needs_conversion"),
  doc("informes", "Presentación resultados Nanogro Region Ixil - Guatemala 27nov16.pdf", "/source-data/informes/presentacion-resultados-nanogro-region-ixil-guatemala-27nov16.pdf", "pdf", "needs_conversion"),
  doc("informes", "Protocolo de Guayaba.docx", "/source-data/informes/protocolo-de-guayaba.docx", "docx", "extracted"),
  doc("informes", "protocolo para la evaluacion de 4 hibridos evaluados con y sin NANO GRO nuevo.pdf", "/source-data/informes/protocolo-para-la-evaluacion-de-4-hibridos-evaluados-con-y-sin-nano-gro-nuevo.pdf", "pdf", "needs_conversion"),
  doc("informes", "REPOLLO EN SEMILLAS.docx", "/source-data/informes/repollo-en-semillas.docx", "docx", "extracted"),
  doc("informes", "Sugarcane results Jamaica.docx", "/source-data/informes/sugarcane-results-jamaica.docx", "docx", "needs_conversion"),
  doc("informes", "tabaco nano gro.docx", "/source-data/informes/tabaco-nano-gro.docx", "docx", "extracted"),
  doc("informes", "Testimonial Maíz en China.docx", "/source-data/informes/testimonial-maiz-en-china.docx", "docx", "extracted"),
  doc("informes", "TOMATES ANTES DEL TRANSPLANTE(1).docx", "/source-data/informes/tomates-antes-del-transplante-1-.docx", "docx", "extracted"),
  doc("fichas", "04-Pedro-Rivero-Hayes-NANO-GRO-México.pdf", "/source-data/fichas/04-pedro-rivero-hayes-nano-gro-mexico.pdf", "pdf", "needs_conversion"),
  doc("fichas", "FICHA TECNICA DE MINERALES TIERRA FERTIL actualizada según MAG-1.pdf", "/source-data/fichas/ficha-tecnica-de-minerales-tierra-fertil-actualizada-segun-mag-1.pdf", "pdf", "needs_conversion"),
  doc("fichas", "FICHA TECNICA NANOGRO PANAMA 2026 8 pag.pdf", "/source-data/fichas/ficha-tecnica-nanogro-panama-2026-8-pag.pdf", "pdf", "needs_conversion"),
  doc("fichas", "WhatsApp Image 2026-06-06 at 10.50.13 PM.jpeg", "/source-data/fichas/whatsapp-image-2026-06-06-at-10.50.13-pm.jpeg", "image", "needs_ocr")
];

export const technicalSheets: TechnicalSheet[] = [
  {
    id: "tech-nanogro-panama-2026",
    title: "Ficha Tecnica Nano-Gro Panama 2026",
    category: "Nano-Gro",
    summary: "Ficha tecnica local para Panama, disponible para revision comercial y agronomica.",
    source: findSource("FICHA TECNICA NANOGRO PANAMA 2026 8 pag.pdf")
  },
  {
    id: "tech-minerales-tierra-fertil",
    title: "Ficha Tecnica de Minerales Tierra Fertil",
    category: "Minerales",
    summary: "Documento tecnico de minerales Tierra Fertil actualizado segun MAG.",
    source: findSource("FICHA TECNICA DE MINERALES TIERRA FERTIL actualizada según MAG-1.pdf")
  },
  {
    id: "tech-pedro-rivero-mexico",
    title: "Pedro Rivero Hayes - Nano-Gro Mexico",
    category: "Soporte tecnico",
    summary: "Documento tecnico asociado a Nano-Gro Mexico y Pedro Rivero Hayes.",
    source: findSource("04-Pedro-Rivero-Hayes-NANO-GRO-México.pdf")
  },
  {
    id: "tech-whatsapp-reference",
    title: "Registro fotografico de campo 2026-06-06",
    category: "Evidencia visual",
    summary: "Imagen de campo conservada como evidencia pendiente de clasificacion tecnica.",
    source: findSource("WhatsApp Image 2026-06-06 at 10.50.13 PM.jpeg")
  }
];

export const realCases: CaseStudy[] = [
  caseItem("real-001", "Sugarcane in El Salvador under severe drought", "sugarcane", "el-salvador", "water-stress", "A", {
    summary: "Pedro Martinez sugarcane lots treated during severe drought in August 2015.",
    application: "Foliar application, 20 Nano-Gro capsules per manzana in 200 liters of clean water.",
    dosage: "20 capsules/manzana in 200 L water",
    results: "Post-application sampling documented visible crop recovery one month and 28 days after treatment.",
    completeness: 82,
    evidence: ["CAÑA PEDRO MARTINEZ.docx", "Caña.rar"]
  }),
  caseItem("real-002", "Pepper in El Salvador with harvest 25 days earlier", "pepper", "el-salvador", "low-production", "B", {
    summary: "Field protocol for Natalie pepper comparing Nano-Gro rows with nearby untreated rows.",
    application: "Nano-Gro field application with visual comparison against adjacent untreated planting.",
    results: "Harvest began 41 days after sowing, reported as 25 days earlier, with considerable production increase.",
    metrics: [
      { label: "Adelanto de cosecha", value: 25, unit: "días", context: "Frente a siembra vecina sin tratar" },
      { label: "Inicio de cosecha", value: 41, unit: "días tras siembra" }
    ],
    completeness: 74,
    evidence: ["CHILE EN CAMPO.docx"]
  }),
  caseItem("real-003", "Common bean in El Salvador with 35.1% higher yield", "common-bean", "el-salvador", "low-production", "A", {
    summary: "CENTA-MAG paired-plot evaluation across farmer locations in El Salvador.",
    application: "Organic technology package including Nano-Gro, minerals, mycorrhizae, Rhizobium and foliar nutrition.",
    dosage: "8 Nano-Gro tablets in the evaluated package",
    results: "Average yield reached 1.23 t/ha, 35.1% above the producer technology, with TRM of 0.54.",
    yield: 35.1,
    roi: 0.54,
    completeness: 92,
    evidence: ["Doc 2. Inf. Carlos Reyes.docx", "Doc. 1 Info. Dir CENTA.docx"]
  }),
  caseItem("real-004", "Banana in Guatemala biometric evaluation", "banana", "guatemala", "nutrition-and-vigor", "B", {
    summary: "Guatemala banana plant biometric evaluation supported by DOCX report and spreadsheet template.",
    application: "Nano-Gro treatment compared with commercial and Potenz plans.",
    dosage: "1 pellet/5 L; backpack sprayer coverage noted at 0.125 ha",
    results: "Biometric measurements recorded leaves, height and perimeter for treated and comparison plants.",
    completeness: 78,
    evidence: ["Evaluaciones en Bananos Guatemala.docx", "PLANTILLA de Bananos en Guatemala.xlsx"]
  }),
  caseItem("real-005", "Common bean germination protocol in El Salvador", "common-bean", "el-salvador", "germination", "B", {
    summary: "Seed germination and establishment protocol for common bean using Nano-Gro.",
    application: "Seed-stage Nano-Gro protocol documented in source report.",
    results: "Germination and early vigor observations were documented for technical review.",
    completeness: 68,
    evidence: ["FRIJOL _ GERMINACIÓN(1).docx"]
  }),
  caseItem("real-006", "Loroco production protocol in El Salvador", "loroco", "el-salvador", "poor-flowering", "B", {
    summary: "Loroco production report documenting Nano-Gro use in flowering and production context.",
    application: "Nano-Gro application protocol documented in field report.",
    results: "Production observations are available in the extracted DOCX and need final agronomic normalization.",
    completeness: 66,
    evidence: ["LOROCO EN PRODUCCIÓN.docx"]
  }),
  caseItem("real-007", "Corn trials with ALBA Alimentos", "corn", "el-salvador", "low-production", "A", {
    summary: "Large maize trial report from ALBA Alimentos with extracted technical narrative and tables.",
    application: "Nano-Gro evaluated in maize trial conditions.",
    results: "Report contains detailed trial observations and measurements for maize performance.",
    completeness: 86,
    evidence: ["Maiz. Ensayos en ALBA Alimentos.docx"]
  }),
  caseItem("real-008", "Foliar maize application in El Salvador", "corn", "el-salvador", "nutrition-and-vigor", "B", {
    summary: "Foliar Nano-Gro maize protocol with field images and treatment notes.",
    application: "Foliar application to maize.",
    results: "Visual field response documented in the source report.",
    completeness: 67,
    evidence: ["MAÍZ FOLIAR.docx"]
  }),
  caseItem("real-009", "Maize seed treatment in El Salvador", "corn", "el-salvador", "germination", "B", {
    summary: "Maize seed-stage Nano-Gro protocol with source evidence.",
    application: "Nano-Gro seed treatment protocol.",
    results: "Seed and early establishment response documented for technical review.",
    completeness: 67,
    evidence: ["MAÍZ SEMILLAS.docx"]
  }),
  caseItem("real-010", "M. Hernandez maize observation", "corn", "el-salvador", "nutrition-and-vigor", "C", {
    summary: "Short maize observation attributed to M. Hernandez.",
    application: "Nano-Gro use documented in the source file.",
    results: "Evidence is brief and should be reviewed against original photos/tables.",
    completeness: 55,
    evidence: ["MHERNÁNDEZMaiz-1.docx"]
  }),
  caseItem("real-011", "Papaya transplant survival and vigor", "papaya", "cuba", "post-transplant-stress", "A", {
    summary: "Papaya Maradol seed and transplant evaluation with survival and vigor tables.",
    application: "Seed soak and root-zone transplant application using Nano-Gro solutions.",
    dosage: "1 tablet/L for seed soak; 10 ml solution per plant at transplant",
    results: "Reported transplant survival reached 98% for 1 tablet/L and 1 tablet/2 L treatments, versus 90% untreated reference.",
    quality: 8,
    metrics: [
      { label: "Supervivencia al trasplante", value: 98, unit: "%", context: "Testigo sin tratar: 90%" }
    ],
    completeness: 88,
    evidence: ["Nano Gro Papaya.docx"]
  }),
  caseItem("real-012", "Guava recovery under nematode pressure", "guava", "el-salvador", "weak-rooting", "B", {
    summary: "Guava protocol documenting root and foliage recovery after Nano-Gro under dry conditions and nematode pressure.",
    application: "Nano-Gro application followed by another application with eco-mineral fertilization.",
    results: "Photos documented new shoots, root emission and recovery versus untreated control.",
    completeness: 73,
    evidence: ["Protocolo de Guayaba.docx"]
  }),
  caseItem("real-013", "Cabbage seed protocol in El Salvador", "cabbage", "el-salvador", "germination", "B", {
    summary: "Cabbage seed application protocol for Marien variety.",
    application: "Nano-Gro seed-stage protocol.",
    results: "Protocol and photos are preserved for agronomic review.",
    completeness: 63,
    evidence: ["REPOLLO EN SEMILLAS.docx"]
  }),
  caseItem("real-014", "Tobacco treated plants with 100% yield increase", "tobacco", "cuba", "low-production", "A", {
    summary: "Tobacco report comparing treated and untreated plants.",
    application: "Sprout-stage Nano-Gro solution applied to reach plant roots at 1 pellet/L.",
    dosage: "1 pellet/L water",
    results: "Reported tobacco yield was 100% higher than the control; treated plants produced about 30% more leaves and sprouted 11 days earlier.",
    yield: 100,
    quality: 30,
    metrics: [
      { label: "Más hojas por planta", value: 30, unit: "%" },
      { label: "Brotación anticipada", value: 11, unit: "días" }
    ],
    completeness: 91,
    evidence: ["tabaco nano gro.docx"]
  }),
  caseItem("real-015", "Corn testimonial in China", "corn", "china", "low-production", "B", {
    summary: "Chinese maize testimonial with fresh, dry and total weight comparison table.",
    application: "Nano-Gro treatment documented in testimonial.",
    results: "Table reports increases including 10.41%, 20.60%, 15.25% and 10.30% across measured weight indicators.",
    yield: 10.3,
    metrics: [
      { label: "Aumento de peso fresco", value: 20.6, unit: "%" },
      { label: "Aumento de peso seco", value: 15.25, unit: "%" },
      { label: "Aumento de peso total", value: 10.41, unit: "%" }
    ],
    completeness: 74,
    evidence: ["Testimonial Maíz en China.docx", "Chinese corn results.doc"]
  }),
  caseItem("real-016", "Tomato transplant recovery from Rhizoctonia", "tomato", "el-salvador", "disease-pressure", "A", {
    summary: "Tomato transplant protocol for seedlings affected by Rhizoctonia solani.",
    application: "Root dip at transplant, drench 10 days later, and foliar application 30 days after bag transplant.",
    dosage: "1 capsule/L root dip; 1 capsule/16 L drench or foliar",
    results: "Disease was reported as eliminated, production reached 1,000 boxes of 50 lb from 2,500 plants, and survival was 98% versus 75-80% in controls.",
    quality: 23,
    metrics: [
      { label: "Supervivencia al trasplante", value: 98, unit: "%", context: "Testigos: 75-80%" },
      { label: "Producción", value: "1.000", unit: "cajas de 50 lb", context: "De 2.500 plantas" }
    ],
    completeness: 90,
    evidence: ["TOMATES ANTES DEL TRANSPLANTE(1).docx"]
  }),
  caseItem("real-017", "Ecuador results report", "mixed-crops", "ecuador", "low-production", "D", {
    summary: "Ecuador results PDF preserved as a real source pending text extraction.",
    results: "PDF requires conversion before quantified agronomic fields can be verified.",
    completeness: 38,
    evidence: ["Equador results.pdf"]
  }),
  caseItem("real-018", "Bean nutrition and value report from ENA El Salvador", "common-bean", "el-salvador", "nutrition-and-vigor", "D", {
    summary: "Escuela Nacional de Agricultura report on Nano-Gro in bean yield and nutritive value.",
    results: "PDF requires text extraction before final metrics can be published.",
    completeness: 44,
    evidence: ["Escuela Nacional de Agricultura.E S. Nano-Gro en rendimiendo y valor nutritivo de frijol EAC v2.pdf"]
  }),
  caseItem("real-019", "Ixil Guatemala Nano-Gro presentation", "mixed-crops", "guatemala", "low-production", "D", {
    summary: "Region Ixil Guatemala presentation imported as real field evidence.",
    results: "Presentation PDF is available for review and conversion.",
    completeness: 42,
    evidence: ["Guatemala.Presentación resultados Nanogro Region Ixil - Guatemala 27nov16.pdf", "Presentación resultados Nanogro Region Ixil - Guatemala 27nov16.pdf"]
  }),
  caseItem("real-020", "Mexico final Nano-Gro report", "mixed-crops", "mexico", "low-production", "D", {
    summary: "Official-format final Nano-Gro Mexico report imported from the source folder.",
    results: "PDF requires conversion before extracting crop, protocol and result metrics.",
    completeness: 40,
    evidence: ["MÉXICO, ENTREGA INFORME FINAL NANO-GRO FORMATO OFICIAL.pdf"]
  }),
  caseItem("real-021", "Nigeria pepper results 2009", "pepper", "nigeria", "low-production", "D", {
    summary: "Legacy Word pepper results from Nigeria, 2009.",
    results: "Legacy .doc requires conversion before quantified fields can be verified.",
    completeness: 39,
    evidence: ["Nigeria pepper results-2009.doc"]
  }),
  caseItem("real-022", "Poland tomato results", "tomato", "poland", "low-production", "D", {
    summary: "Poland tomato results PDF imported as real evidence.",
    results: "PDF requires conversion before final metrics can be verified.",
    completeness: 38,
    evidence: ["Poland Tomato results.pdf"]
  }),
  caseItem("real-023", "Jamaican treated plants", "mixed-crops", "jamaica", "nutrition-and-vigor", "D", {
    summary: "Legacy Word report for treated plants in Jamaica.",
    results: "Legacy .doc requires conversion before structured metrics can be extracted.",
    completeness: 36,
    evidence: ["Jamaican Treated Plants.doc", "Sugarcane results Jamaica.docx"]
  }),
  caseItem("real-024", "Cuba results image report", "mixed-crops", "cuba", "low-production", "D", {
    summary: "Six-page Cuba results image packet imported as visual evidence.",
    results: "Images require OCR/manual review before structured metrics can be verified.",
    completeness: 35,
    evidence: [
      "front page.jpg.jpeg",
      "Cuba results page 1.jpg.jpeg",
      "Cuba results page 2.jpg.jpeg",
      "Cuba results page 3.jpg.jpeg",
      "Cuba results page 4.jpg.jpeg",
      "Cuba results page 5.jpg.jpeg",
      "Cuba results page 6.jpg.jpeg"
    ]
  }),
  caseItem("real-025", "Vegetable protocol source", "vegetables", "el-salvador", "technical-protocol", "D", {
    summary: "Legacy horticulture source imported for later conversion.",
    results: "Legacy .doc requires conversion before crop-specific cases can be split.",
    completeness: 34,
    evidence: ["Hortalizas.doc", "Contact info sp.doc"]
  }),
  caseItem("real-026", "Hybrid evaluation protocol with and without Nano-Gro", "mixed-crops", "el-salvador", "technical-protocol", "D", {
    summary: "Protocol PDF for evaluating four hybrids with and without Nano-Gro.",
    results: "Protocol has been preserved and linked for trial design review.",
    completeness: 33,
    evidence: ["protocolo para la evaluacion de 4 hibridos evaluados con y sin NANO GRO nuevo.pdf"]
  })
];

function doc(
  group: SourceDocument["group"],
  originalName: string,
  publicPath: string,
  kind: SourceDocument["kind"],
  extractionStatus: SourceDocument["extractionStatus"]
): SourceDocument {
  return { group, originalName, publicPath, kind, extractionStatus };
}

function findSource(originalName: string) {
  const source = sourceDocuments.find((item) => item.originalName === originalName);
  if (!source) throw new Error(`Missing source document: ${originalName}`);
  return source;
}

function caseItem(
  id: string,
  title: string,
  cropSlug: string,
  countrySlug: string,
  problemSlug: string,
  evidenceLevel: CaseStudy["evidence_level"],
  input: {
    summary: string;
    application?: string;
    dosage?: string;
    results: string;
    yield?: number;
    quality?: number;
    roi?: number;
    /**
     * Metricas transcritas LITERALMENTE de la narrativa del informe original.
     *
     * No son estimaciones ni aproximaciones: son cifras que ya estaban escritas en el
     * documento fuente y que nadie habia pasado a un campo estructurado, asi que la ficha
     * publica decia "No reportado" sobre casos que si midieron algo. Transcribir no es
     * inventar; inventar seria rellenar los huecos de los informes que aun no se han
     * convertido, y eso no se hace.
     */
    metrics?: ExtractedMetric[];
    completeness: number;
    evidence: string[];
  }
): CaseStudy {
  const crop = cropBySlug[cropSlug];
  const country = countryBySlug[countrySlug];
  const problem = problemBySlug[problemSlug];
  const sources = input.evidence.map(findSource);
  const hasUnextracted = sources.some((source) => source.extractionStatus !== "extracted");
  const hasPhotoEvidence = sources.some((source) => source.kind === "image");
  const inferred = input.application ? [] : ["nano_gro_application"];
  const pending = [
    ...(input.dosage ? [] : ["dosage"]),
    "farm_size",
    "baseline_yield",
    "final_yield",
    ...(input.yield === undefined ? ["yield_increase_percent"] : []),
    ...(input.roi === undefined ? ["roi_value"] : []),
    "treatment_dates",
    "harvest_dates",
    ...(hasPhotoEvidence ? [] : ["photos"]),
    ...(hasUnextracted ? ["source_text_extraction"] : [])
  ];
  const field_status: Record<string, FieldStatus> = {
    crop: "verified",
    country: "verified",
    region: "unavailable",
    problem: "verified",
    farm_size: "pending_confirmation",
    dosage: input.dosage ? "verified" : "pending_confirmation",
    application_method: input.application ? "verified" : "pending_confirmation",
    application_frequency: "pending_confirmation",
    baseline_yield: "pending_confirmation",
    final_yield: "pending_confirmation",
    yield_increase_percent: input.yield === undefined ? "pending_confirmation" : "verified",
    quality_improvement_percent: input.quality === undefined ? "not_applicable" : "verified",
    disease_reduction_percent: "not_applicable",
    roi_value: input.roi === undefined ? "pending_confirmation" : "verified",
    treatment_dates: "pending_confirmation",
    harvest_dates: "pending_confirmation",
    result_summary: "verified",
    testimonial: input.evidence.some((name) => name.toLowerCase().includes("testimonial")) ? "verified" : "not_applicable",
    photos: hasPhotoEvidence ? "verified" : "pending_confirmation",
    videos: "unavailable",
    lab_reports: "unavailable",
    source_text_extraction: hasUnextracted ? "pending_confirmation" : "not_applicable",
    nano_gro_application: input.application ? "verified" : "inferred"
  };
  const missing = Object.entries(field_status)
    .filter(([, status]) => status === "pending_confirmation" || status === "unavailable")
    .map(([field]) => field);
  const disclaimer =
    "This report is based on documented field evidence. Some technical details not available in the original report were conservatively estimated by the technical team for guidance purposes and remain subject to confirmation.";
  return {
    id,
    public_id: id.toUpperCase(),
    slug: slugFrom(title),
    title,
    summary: input.summary,
    crop_id: crop.id,
    country_id: country.id,
    primary_problem_id: problem.id,
    evidence_level: evidenceLevel,
    // Un dato que no existe se queda en null y la pagina lo oculta. No se publica el
    // aviso interno de que falta ("Protocol pending technical confirmation").
    nano_gro_application: input.application ?? null,
    dosage: input.dosage ?? null,
    results_summary: input.results,
    yield_increase_percent: input.yield ?? null,
    quality_improvement_percent: input.quality ?? null,
    roi_value: input.roi ?? null,
    extracted_metrics: input.metrics?.length ? { source_report: input.metrics } : null,
    case_completeness_score: input.completeness,
    evidence_score: evidenceLevel === "A" ? 85 : evidenceLevel === "B" ? 68 : evidenceLevel === "C" ? 48 : 30,
    confidence_score: Math.max(30, Math.min(95, input.completeness - (hasUnextracted ? 12 : 4))),
    evidence_reference: input.evidence.join("; "),
    source_folder: "Desktop/informes",
    data_status: hasUnextracted ? "source_attached_needs_extraction" : "extracted_from_source_pending_confirmation",
    missing_fields: [...new Set(missing)],
    estimated_fields: [],
    inferred_fields: inferred,
    pending_confirmation_fields: [...new Set(pending)],
    technical_questions: hasUnextracted
      ? ["Convert/OCR the attached source file and verify crop, dosage, dates, baseline, final yield and ROI."]
      : ["Confirm treatment dates, baseline yield, final yield and ROI calculation."],
    internal_notes: inferred.length
      ? "Estimated conservatively from available report context. Pending confirmation by technical field team."
      : "Verified values are limited to the linked evidence. Missing commercial metrics remain pending technical confirmation.",
    public_data_disclaimer: pending.length || inferred.length ? disclaimer : null,
    field_status,
    verification_status: hasUnextracted ? "source_attached" : "extracted_pending_review",
    publication_status: "published",
    language: "es",
    featured: evidenceLevel === "A",
    seo_title: `${title} | Nano-Gro real case`,
    seo_description: input.summary,
    crop,
    country,
    primary_problem: problem,
    evidence_assets: input.evidence.map((name, index) => evidenceAsset(id, name, index))
  };
}

function evidenceAsset(caseId: string, originalName: string, index: number): EvidenceAsset {
  const source = findSource(originalName);
  const assetType = source.kind === "image" ? "photo" : source.kind === "pdf" ? "pdf" : source.kind === "xlsx" ? "raw_data" : "document";
  return {
    id: `${caseId}-ev-${index + 1}`,
    case_id: caseId,
    asset_type: assetType,
    evidence_stage: source.extractionStatus === "extracted" ? "supporting" : "final",
    file_url: source.publicPath,
    storage_key: source.publicPath,
    file_name: source.originalName,
    title: publicEvidenceLabel({ asset_type: assetType }),
    caption: source.extractionStatus === "extracted" ? "Technical document received and extracted into the platform." : "Technical document received; extraction/OCR pending.",
    alt_text: publicEvidenceLabel({ asset_type: assetType }),
    verification_status: "pending",
    consent_status: "unknown",
    display_order: index
  };
}

function slugFrom(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
