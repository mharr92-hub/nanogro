import type { CaseStudy, Country, EvidenceAsset, ExtractedMetric, FieldStatus, TaxonomyItem } from "@/lib/types";
import { publicEvidenceLabel } from "@/lib/evidence-labels";
import casePhotos from "@/lib/case-photos.json";

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
  doc("informes", "INGENIO La Cabaña.docx", "/source-data/informes/ingenio-la-cabana.docx", "docx", "extracted"),
  doc("informes", "TECNOVERDE Macolla.docx", "/source-data/informes/tecnoverde-macolla.docx", "docx", "extracted"),
  doc("informes", "TECNOVERDE SiembrasNuevas.docx", "/source-data/informes/tecnoverde-siembras-nuevas.docx", "docx", "extracted"),
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
      { label: "Cosecha antes", value: 25, unit: "días", context: "Frente a siembra vecina sin tratar" },
      { label: "Inicio de cosecha", value: 41, unit: "días tras siembra" }
    ],
    completeness: 74,
    evidence: ["CHILE EN CAMPO.docx"]
  }),
  caseItem("real-003", "Common bean in El Salvador with 35.1% higher yield", "common-bean", "el-salvador", "low-production", "A", {
    summary: "CENTA-MAG paired-plot evaluation across farmer locations in El Salvador.",
    application: "Organic technology package including Nano-Gro, minerals, mycorrhizae, Rhizobium and foliar nutrition.",
    dosage: "8 Nano-Gro tablets in the evaluated package",
    results: "Average yield reached 1.23 t/ha, 35.1% above the producer technology. The CIMMYT marginal rate of return (TRM) was 0.54. The report states the difference was not statistically significant at 10% probability.",
    yield: 35.1,
    /*
     * OJO: el informe reporta "TRM de 0.54" = Tasa de Retorno Marginal (metodologia CIMMYT).
     * NO es un ROI. Antes se mapeaba a `roi_value`, asi que la ficha publicaba "ROI 0.54x"
     * y el caso parecia decir que el programa costo mas de lo que devolvio. Era un error de
     * etiquetado, no un mal resultado. La TRM se publica ahora con su nombre real, y el
     * campo ROI se queda vacio porque el informe no calcula ROI.
     */
    metrics: [
      { label: "Rendimiento", value: 1.23, unit: "t/ha", context: "Tecnología del productor: 0.91 t/ha" },
      { label: "Sobre el testigo", value: 35.1, unit: "%" },
      { label: "TRM (CIMMYT)", value: 0.54, context: "No es un ROI. Diferencia no significativa al 10%" }
    ],
    completeness: 92,
    evidence: ["Doc 2. Inf. Carlos Reyes.docx", "Doc. 1 Info. Dir CENTA.docx"]
  }),
  caseItem("real-004", "Banana in Guatemala biometric evaluation", "banana", "guatemala", "nutrition-and-vigor", "B", {
    summary: "Guatemala banana plant biometric evaluation supported by DOCX report and spreadsheet template.",
    application: "Nano-Gro treatment compared with commercial and Potenz plans.",
    dosage: "1 pellet/5 L; backpack sprayer coverage noted at 0.125 ha",
    results: "Across weeks 39-46 the treated lots averaged 326 more boxes per hectare per year than the control, with a reported net gain of 1,630 USD/ha/year. The effect came from finger weight, not finger count.",
    metrics: [
      { label: "Cajas extra", value: 326, unit: "cajas/ha/año", context: "Promedio semanas 39-46 frente al testigo" },
      { label: "Ganancia neta", value: "1.630", unit: "USD/ha/año" }
    ],
    completeness: 78,
    evidence: ["Evaluaciones en Bananos Guatemala.docx", "PLANTILLA de Bananos en Guatemala.xlsx"]
  }),
  caseItem("real-005", "Common bean germination protocol in El Salvador", "common-bean", "el-salvador", "germination", "B", {
    summary: "Seed germination and establishment protocol for common bean using Nano-Gro.",
    application: "Seed-stage Nano-Gro protocol documented in source report.",
    dosage: "1 cápsula por litro de agua pura; inmersión de la semilla 30 segundos antes de la siembra",
    results: "Germination rose to 100% in treated seed versus 96% untreated, and total germination came almost two days earlier. Treated seed developed thicker, larger roots.",
    quality: 4,
    metrics: [
      { label: "Germinación", value: 100, unit: "%", context: "Testigo sin tratar: 96%" },
      { label: "Germina antes", value: 2, unit: "días" }
    ],
    completeness: 68,
    evidence: ["FRIJOL _ GERMINACIÓN(1).docx"]
  }),
  caseItem("real-006", "Loroco production protocol in El Salvador", "loroco", "el-salvador", "poor-flowering", "B", {
    summary: "Loroco production report documenting Nano-Gro use in flowering and production context.",
    application: "Nano-Gro application protocol documented in field report.",
    dosage: "1 cápsula por litro de agua junto a BS-95 a 1 cc/litro, aplicación foliar",
    results: "Weekly production rose from 240 lb/week before treatment to 580 lb/week from day 10, and to 720 lb/week from day 45. Flowers were reported larger and more abundant.",
    yield: 200,
    metrics: [
      { label: "Producción", value: 720, unit: "lb/semana", context: "Antes de la aplicación: 240 lb/semana" },
      { label: "A los 10 días", value: 580, unit: "lb/semana" }
    ],
    completeness: 66,
    evidence: ["LOROCO EN PRODUCCIÓN.docx"]
  }),
  caseItem("real-007", "Corn trials with ALBA Alimentos", "corn", "el-salvador", "low-production", "A", {
    summary: "Large maize trial report from ALBA Alimentos with extracted technical narrative and tables.",
    application: "Nano-Gro evaluated in maize trial conditions.",
    results: "Corn-ear yield across 4 hybrids: PIONEER 30F96 more than doubled ear weight (234.69 vs 108.26 qq/mz). CENTA H-59 rose 4% in ear count. DEKALB 390 fell 8% with the product. Germination was 100% across all four hybrids.",
    metrics: [
      { label: "Peso de elote", value: 234.69, unit: "qq/mz", context: "Sin Nano-Gro: 108.26 qq/mz" },
      { label: "Elotes", value: 4, unit: "%", context: "43.509 con Nano-Gro frente a 42.175" },
      { label: "Elotes DEKALB", value: -8, unit: "%", context: "El único híbrido con resultado negativo" }
    ],
    completeness: 86,
    evidence: ["Maiz. Ensayos en ALBA Alimentos.docx"]
  }),
  caseItem("real-008", "Foliar maize application in El Salvador", "corn", "el-salvador", "nutrition-and-vigor", "B", {
    summary: "Foliar Nano-Gro maize protocol with field images and treatment notes.",
    application: "Foliar application to maize.",
    dosage: "2 cápsulas por bomba de 16 litros, aplicación foliar única a los 25 días",
    results: "Plant height and stem thickness were 45% greater than the control under severe water stress. Flowering came 13 days earlier, and ear size and weight were 30% higher.",
    yield: 30,
    quality: 45,
    metrics: [
      { label: "Altura y tallo", value: 45, unit: "%", context: "Bajo estrés hídrico severo" },
      { label: "Floración antes", value: 13, unit: "días" },
      { label: "Tamaño y peso de mazorca", value: 30, unit: "%" }
    ],
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
      { label: "Supervivencia", value: 98, unit: "%", context: "Testigo sin tratar: 90%" },
      { label: "Germinación", value: 72, unit: "%", context: "Testigo: 56%. Inmersión óptima de 1-1.5 minutos" }
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
    dosage: "1 cápsula por litro para la inmersión de semilla; 2 cápsulas por bomba de 16 litros en la foliar a los 40 días",
    results: "Heads grew larger and firmer while keeping the variety's flavour and consistency. Harvest came 25 days earlier and flowering 30 days earlier.",
    quality: 25,
    metrics: [
      { label: "Cosecha antes", value: 25, unit: "días" },
      { label: "Floración antes", value: 30, unit: "días" }
    ],
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
      { label: "Más hojas", value: 30, unit: "%" },
      { label: "Brota antes", value: 11, unit: "días" }
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
      { label: "Peso fresco", value: 20.6, unit: "%" },
      { label: "Peso seco", value: 15.25, unit: "%" },
      { label: "Peso total", value: 10.41, unit: "%" }
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
      { label: "Supervivencia", value: 98, unit: "%", context: "Testigos: 75-80%" },
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
  }),

  /*
   * Los tres informes de caña de azúcar de El Salvador.
   *
   * El de La Cabaña es la fuente de las cifras que ya se publicaban en la pagina de
   * Tecnologia (+37.9% en tallos, +22% de grosor, +0.8 Brix) y no tenia caso propio: los
   * numeros salian en la web sin un caso al que enlazar. Ahora la evidencia esta completa y
   * la pagina de Tecnologia apunta a su caso.
   *
   * Todas las cifras estan transcritas literalmente del informe. El seguimiento de La Cabaña
   * llega a los 197 dias, que es la serie temporal mas larga de toda la base.
   */
  caseItem("real-027", "Sugarcane ratoon at Ingenio La Cabaña with 37.9% more stalks", "sugarcane", "el-salvador", "low-production", "A", {
    summary: "Application on sugarcane ratoon at Servicios Agroindustriales La Cabaña, with treated plot and control followed for 197 days.",
    application: "Foliar application on ratoon; treated plot compared against an adjacent untreated control.",
    dosage: "2 cápsulas por bombada",
    results:
      "At the 197-day sampling the treated plot reached 40 canes per linear metre versus 29 in the control (+37.9% in primary stalks), 3 m versus 2.80 m in height, 18 cm versus 15 cm internode, 11 cm versus 9 cm thickness (+22%), and an average Brix of 13.3 versus 12.5 (+0.8 points).",
    yield: 37.9,
    quality: 22,
    metrics: [
      { label: "Más tallos", value: 37.9, unit: "%", context: "40 cañas/m lineal frente a 29 del testigo" },
      { label: "Grosor de tallo", value: 22, unit: "%", context: "11 cm frente a 9 cm" },
      { label: "Grados Brix", value: 13.3, context: "Testigo: 12.5 (+0.8 puntos)" },
      { label: "Altura", value: 3, unit: "m", context: "Testigo: 2.80 m" },
      { label: "Seguimiento", value: 197, unit: "días", context: "Dos muestreos: 32 y 197 días" }
    ],
    completeness: 93,
    evidence: ["INGENIO La Cabaña.docx"]
  }),

  caseItem("real-028", "Sugarcane stools recovering from severe drought (Tecnoverde)", "sugarcane", "el-salvador", "water-stress", "B", {
    summary: "Sugarcane stools dying from intense drought at Hacienda Marinés, Zacatecoluca. Before/after photographic record.",
    application: "Foliar application on stools already dying from drought.",
    dosage: "8 cápsulas por manzana, a razón de 2 cápsulas por bomba (4 bombas/mz)",
    results: "New buds began to emerge 15 days after application, with no rainfall. Sampling at 25 days documented the recovery.",
    metrics: [
      { label: "Brotes nuevos", value: 15, unit: "días", context: "Sin lluvias en ese periodo" },
      { label: "Muestreo", value: 25, unit: "días", context: "Tras la aplicación" }
    ],
    completeness: 74,
    evidence: ["TECNOVERDE Macolla.docx"]
  }),

  caseItem("real-029", "Sugarcane new plantings with stronger regrowth (Tecnoverde)", "sugarcane", "el-salvador", "nutrition-and-vigor", "B", {
    summary: "Foliar application on new sugarcane plantings at Hacienda Marinés, Zacatecoluca.",
    application: "Foliar application on new plantings.",
    dosage: "10 cápsulas por manzana disueltas en 200 litros de agua limpia",
    results: "New buds emerged 15 days after application, and with greater vigour. Sampling at 26 days recorded the number of regrowths.",
    metrics: [
      { label: "Brotes nuevos", value: 15, unit: "días", context: "Con mayor vigorosidad" },
      { label: "Muestreo", value: 26, unit: "días", context: "Tras la aplicación" }
    ],
    completeness: 72,
    evidence: ["TECNOVERDE SiembrasNuevas.docx"]
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
    evidence_assets: [
      ...input.evidence.map((name, index) => evidenceAsset(id, name, index)),
      ...fieldPhotos(id, input.evidence)
    ]
  };
}

/**
 * Las fotografias de campo que estaban dentro de los .docx.
 *
 * 61 fotos reales de campo vivian embebidas en los informes de Word: la galeria "Antes y
 * despues" estaba vacia y ningun caso tenia una sola imagen, mientras las fotos existian
 * desde el primer dia. `scripts/extract-docx-photos.mjs` las saca y genera este manifiesto.
 *
 * La etapa (antes / despues) se deduce del ORDEN en que aparecen en el documento, porque asi
 * es como narran los informes: primero el campo el dia de la aplicacion, despues el muestreo
 * posterior. La primera mitad se marca "before" y la segunda "after". Es una inferencia, no
 * un dato del documento, asi que estas fotos NO suben el nivel de evidencia de ningun caso:
 * solo se muestran. El nivel lo sigue decidiendo `publicEvidenceLevel`, que solo cuenta lo
 * que se puede probar.
 */
function fieldPhotos(caseId: string, evidenceNames: string[]): EvidenceAsset[] {
  const folders = evidenceNames
    .map((name) => findSource(name).publicPath.split("/").pop()?.replace(/\.docx$/i, ""))
    .filter((folder): folder is string => Boolean(folder));

  const photos: EvidenceAsset[] = [];

  for (const folder of folders) {
    const files = (casePhotos as Record<string, string[]>)[folder] ?? [];
    const half = Math.ceil(files.length / 2);

    files.forEach((file, index) => {
      photos.push({
        id: `${caseId}-photo-${photos.length + 1}`,
        case_id: caseId,
        asset_type: "photo",
        evidence_stage: files.length > 1 && index >= half ? "after" : "before",
        file_url: file,
        storage_key: file,
        file_name: file.split("/").pop() ?? file,
        title: "Registro fotográfico de campo",
        caption: "Fotografía incluida en el informe original de campo.",
        alt_text: "Fotografía de campo del informe original de Nano-Gro",
        verification_status: "approved",
        consent_status: "approved",
        display_order: photos.length
      });
    });
  }

  return photos;
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
