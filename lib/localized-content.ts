import type { Locale } from "@/lib/i18n";
import type { CaseStudy, Country, TaxonomyItem } from "@/lib/types";

type LocalizedCaseText = {
  title: string;
  summary: string;
  application?: string;
  results?: string;
  disclaimer?: string;
  seoTitle?: string;
  seoDescription?: string;
};

const caseText: Record<string, Record<Locale, LocalizedCaseText>> = {
  "real-001": pair(
    "Sugarcane in El Salvador under severe drought",
    "Pedro Martinez sugarcane lots treated during severe drought in August 2015.",
    "Foliar application, 20 Nano-Gro capsules per manzana in 200 liters of clean water.",
    "Post-application sampling documented visible crop recovery one month and 28 days after treatment.",
    "Cana de azucar en El Salvador bajo sequia severa",
    "Lotes de cana de Pedro Martinez tratados durante una sequia severa en agosto de 2015.",
    "Aplicacion foliar de 20 capsulas de Nano-Gro por manzana en 200 litros de agua limpia.",
    "El muestreo posterior a la aplicacion documento recuperacion visible del cultivo un mes y 28 dias despues del tratamiento."
  ),
  "real-002": pair("Pepper in El Salvador with harvest 25 days earlier", "Field protocol for Natalie pepper comparing Nano-Gro rows with nearby untreated rows.", "Nano-Gro field application with visual comparison against adjacent untreated planting.", "Harvest began 41 days after sowing, reported as 25 days earlier, with considerable production increase.", "Chile en El Salvador con cosecha 25 dias mas temprana", "Protocolo de campo para chile variedad Natalie comparando surcos con Nano-Gro contra siembras vecinas sin tratamiento.", "Aplicacion de Nano-Gro en campo con comparacion visual frente a plantacion aledana sin tratamiento.", "La cosecha inicio 41 dias despues de la siembra, reportada como 25 dias mas temprana, con aumento considerable de produccion."),
  "real-003": pair("Common bean in El Salvador with 35.1% higher yield", "CENTA-MAG paired-plot evaluation across farmer locations in El Salvador.", "Organic technology package including Nano-Gro, minerals, mycorrhizae, Rhizobium and foliar nutrition.", "Average yield reached 1.23 t/ha, 35.1% above the producer technology, with TRM of 0.54.", "Frijol comun en El Salvador con 35.1% mas rendimiento", "Evaluacion CENTA-MAG en parcelas apareadas en fincas de productores de El Salvador.", "Paquete tecnologico organico con Nano-Gro, minerales, micorrizas, Rhizobium y nutricion foliar.", "El rendimiento promedio alcanzo 1.23 t/ha, 35.1% sobre la tecnologia del productor, con TRM de 0.54."),
  "real-004": pair("Banana in Guatemala biometric evaluation", "Guatemala banana plant biometric evaluation supported by DOCX report and spreadsheet template.", "Nano-Gro treatment compared with commercial and Potenz plans.", "Biometric measurements recorded leaves, height and perimeter for treated and comparison plants.", "Banano en Guatemala con evaluacion biometrica", "Evaluacion biometrica de plantas de banano en Guatemala respaldada por informe DOCX y plantilla de hoja de calculo.", "Tratamiento Nano-Gro comparado con planes comercial y Potenz.", "Las mediciones biometricas registraron hojas, altura y perimetro en plantas tratadas y de comparacion."),
  "real-005": pair("Common bean germination protocol in El Salvador", "Seed germination and establishment protocol for common bean using Nano-Gro.", "Seed-stage Nano-Gro protocol documented in source report.", "Germination and early vigor observations were documented for technical review.", "Protocolo de germinacion de frijol en El Salvador", "Protocolo de germinacion y establecimiento de semilla de frijol comun usando Nano-Gro.", "Protocolo Nano-Gro en etapa de semilla documentado en el informe fuente.", "Se documentaron observaciones de germinacion y vigor temprano para revision tecnica."),
  "real-006": pair("Loroco production protocol in El Salvador", "Loroco production report documenting Nano-Gro use in flowering and production context.", "Nano-Gro application protocol documented in field report.", "Production observations are available in the extracted DOCX and need final agronomic normalization.", "Protocolo de produccion de loroco en El Salvador", "Informe de produccion de loroco que documenta el uso de Nano-Gro en contexto de floracion y produccion.", "Protocolo de aplicacion de Nano-Gro documentado en el informe de campo.", "Las observaciones de produccion estan disponibles en el DOCX extraido y requieren normalizacion agronomica final."),
  "real-007": pair("Corn trials with ALBA Alimentos", "Large maize trial report from ALBA Alimentos with extracted technical narrative and tables.", "Nano-Gro evaluated in maize trial conditions.", "Report contains detailed trial observations and measurements for maize performance.", "Ensayos de maiz con ALBA Alimentos", "Informe amplio de ensayo en maiz de ALBA Alimentos con narrativa tecnica y tablas extraidas.", "Nano-Gro evaluado bajo condiciones de ensayo en maiz.", "El informe contiene observaciones y mediciones detalladas del desempeno del maiz."),
  "real-008": pair("Foliar maize application in El Salvador", "Foliar Nano-Gro maize protocol with field images and treatment notes.", "Foliar application to maize.", "Visual field response documented in the source report.", "Aplicacion foliar en maiz en El Salvador", "Protocolo foliar de Nano-Gro en maiz con imagenes de campo y notas de tratamiento.", "Aplicacion foliar en maiz.", "La respuesta visual de campo esta documentada en el informe fuente."),
  "real-009": pair("Maize seed treatment in El Salvador", "Maize seed-stage Nano-Gro protocol with source evidence.", "Nano-Gro seed treatment protocol.", "Seed and early establishment response documented for technical review.", "Tratamiento de semilla de maiz en El Salvador", "Protocolo Nano-Gro en etapa de semilla de maiz con evidencia fuente.", "Protocolo de tratamiento de semilla con Nano-Gro.", "Respuesta de semilla y establecimiento temprano documentada para revision tecnica."),
  "real-010": pair("M. Hernandez maize observation", "Short maize observation attributed to M. Hernandez.", "Nano-Gro use documented in the source file.", "Evidence is brief and should be reviewed against original photos/tables.", "Observacion de maiz de M. Hernandez", "Observacion breve de maiz atribuida a M. Hernandez.", "Uso de Nano-Gro documentado en el archivo fuente.", "La evidencia es breve y debe revisarse contra fotos o tablas originales."),
  "real-011": pair("Papaya transplant survival and vigor", "Papaya Maradol seed and transplant evaluation with survival and vigor tables.", "Seed soak and root-zone transplant application using Nano-Gro solutions.", "Reported transplant survival reached 98% for 1 tablet/L and 1 tablet/2 L treatments, versus 90% untreated reference.", "Supervivencia y vigor de papaya en trasplante", "Evaluacion de semilla y trasplante de papaya Maradol con tablas de supervivencia y vigor.", "Remojo de semilla y aplicacion en zona radicular al trasplante usando soluciones de Nano-Gro.", "La supervivencia reportada al trasplante alcanzo 98% con 1 tableta/L y 1 tableta/2 L, frente a 90% en la referencia sin tratamiento."),
  "real-012": pair("Guava recovery under nematode pressure", "Guava protocol documenting root and foliage recovery after Nano-Gro under dry conditions and nematode pressure.", "Nano-Gro application followed by another application with eco-mineral fertilization.", "Photos documented new shoots, root emission and recovery versus untreated control.", "Recuperacion de guayaba bajo presion de nematodos", "Protocolo de guayaba que documenta recuperacion de raiz y follaje despues de Nano-Gro bajo sequia y presion de nematodos.", "Aplicacion de Nano-Gro seguida por otra aplicacion con fertilizacion eco-mineral.", "Las fotos documentaron nuevos brotes, emision de raices y recuperacion frente al testigo sin tratamiento."),
  "real-013": pair("Cabbage seed protocol in El Salvador", "Cabbage seed application protocol for Marien variety.", "Nano-Gro seed-stage protocol.", "Protocol and photos are preserved for agronomic review.", "Protocolo de semilla de repollo en El Salvador", "Protocolo de aplicacion en semilla de repollo variedad Marien.", "Protocolo Nano-Gro en etapa de semilla.", "El protocolo y las fotos quedan preservados para revision agronomica."),
  "real-014": pair("Tobacco treated plants with 100% yield increase", "Tobacco report comparing treated and untreated plants.", "Sprout-stage Nano-Gro solution applied to reach plant roots at 1 pellet/L.", "Reported tobacco yield was 100% higher than the control; treated plants produced about 30% more leaves and sprouted 11 days earlier.", "Tabaco tratado con 100% mas rendimiento", "Informe de tabaco que compara plantas tratadas y sin tratamiento.", "Solucion Nano-Gro en etapa de brote aplicada para alcanzar raices a razon de 1 pellet/L.", "El rendimiento reportado fue 100% mayor que el control; las plantas tratadas produjeron cerca de 30% mas hojas y brotaron 11 dias antes."),
  "real-015": pair("Corn testimonial in China", "Chinese maize testimonial with fresh, dry and total weight comparison table.", "Nano-Gro treatment documented in testimonial.", "Table reports increases including 10.41%, 20.60%, 15.25% and 10.30% across measured weight indicators.", "Testimonio de maiz en China", "Testimonio de maiz en China con tabla comparativa de peso fresco, seco y total.", "Tratamiento Nano-Gro documentado en testimonio.", "La tabla reporta aumentos de 10.41%, 20.60%, 15.25% y 10.30% en indicadores de peso medidos."),
  "real-016": pair("Tomato transplant recovery from Rhizoctonia", "Tomato transplant protocol for seedlings affected by Rhizoctonia solani.", "Root dip at transplant, drench 10 days later, and foliar application 30 days after bag transplant.", "Disease was reported as eliminated, production reached 1,000 boxes of 50 lb from 2,500 plants, and survival was 98% versus 75-80% in controls.", "Recuperacion de tomate tras trasplante por Rhizoctonia", "Protocolo de trasplante de tomate para plantulas afectadas por Rhizoctonia solani.", "Inmersion de raices al trasplante, drench 10 dias despues y aplicacion foliar 30 dias despues del trasplante a bolsa.", "La enfermedad se reporto como eliminada, la produccion alcanzo 1,000 cajas de 50 lb en 2,500 plantas, y la supervivencia fue 98% frente a 75-80% en testigos."),
  "real-017": pair("Ecuador results report", "Ecuador results PDF preserved as a real source pending text extraction.", undefined, "PDF requires conversion before quantified agronomic fields can be verified.", "Informe de resultados de Ecuador", "PDF de resultados de Ecuador preservado como fuente real pendiente de extraccion de texto.", undefined, "El PDF requiere conversion antes de verificar campos agronomicos cuantificados."),
  "real-018": pair("Bean nutrition and value report from ENA El Salvador", "Escuela Nacional de Agricultura report on Nano-Gro in bean yield and nutritive value.", undefined, "PDF requires text extraction before final metrics can be published.", "Informe ENA El Salvador sobre frijol, rendimiento y valor nutritivo", "Informe de la Escuela Nacional de Agricultura sobre Nano-Gro en rendimiento y valor nutritivo de frijol.", undefined, "El PDF requiere extraccion de texto antes de publicar metricas finales."),
  "real-019": pair("Ixil Guatemala Nano-Gro presentation", "Region Ixil Guatemala presentation imported as real field evidence.", undefined, "Presentation PDF is available for review and conversion.", "Presentacion Nano-Gro Region Ixil Guatemala", "Presentacion de Region Ixil Guatemala importada como evidencia real de campo.", undefined, "El PDF de la presentacion esta disponible para revision y conversion."),
  "real-020": pair("Mexico final Nano-Gro report", "Official-format final Nano-Gro Mexico report imported from the source folder.", undefined, "PDF requires conversion before extracting crop, protocol and result metrics.", "Informe final Nano-Gro Mexico", "Informe final de Nano-Gro Mexico en formato oficial importado desde la carpeta fuente.", undefined, "El PDF requiere conversion antes de extraer cultivo, protocolo y metricas de resultado."),
  "real-021": pair("Nigeria pepper results 2009", "Legacy Word pepper results from Nigeria, 2009.", undefined, "Legacy .doc requires conversion before quantified fields can be verified.", "Resultados de chile en Nigeria 2009", "Resultados de chile en Nigeria, 2009, en documento Word heredado.", undefined, "El archivo .doc requiere conversion antes de verificar campos cuantificados."),
  "real-022": pair("Poland tomato results", "Poland tomato results PDF imported as real evidence.", undefined, "PDF requires conversion before final metrics can be verified.", "Resultados de tomate en Polonia", "PDF de resultados de tomate en Polonia importado como evidencia real.", undefined, "El PDF requiere conversion antes de verificar metricas finales."),
  "real-023": pair("Jamaican treated plants", "Legacy Word report for treated plants in Jamaica.", undefined, "Legacy .doc requires conversion before structured metrics can be extracted.", "Plantas tratadas en Jamaica", "Informe Word heredado sobre plantas tratadas en Jamaica.", undefined, "El archivo .doc requiere conversion antes de extraer metricas estructuradas."),
  "real-024": pair("Cuba results image report", "Six-page Cuba results image packet imported as visual evidence.", undefined, "Images require OCR/manual review before structured metrics can be verified.", "Informe de resultados de Cuba en imagenes", "Paquete de seis paginas de resultados de Cuba importado como evidencia visual.", undefined, "Las imagenes requieren OCR o revision manual antes de verificar metricas estructuradas."),
  "real-025": pair("Vegetable protocol source", "Legacy horticulture source imported for later conversion.", undefined, "Legacy .doc requires conversion before crop-specific cases can be split.", "Fuente de protocolo para hortalizas", "Fuente heredada de horticultura importada para conversion posterior.", undefined, "El archivo .doc requiere conversion antes de dividir casos por cultivo."),
  "real-026": pair("Hybrid evaluation protocol with and without Nano-Gro", "Protocol PDF for evaluating four hybrids with and without Nano-Gro.", undefined, "Protocol has been preserved and linked for trial design review.", "Protocolo de evaluacion de hibridos con y sin Nano-Gro", "PDF de protocolo para evaluar cuatro hibridos con y sin Nano-Gro.", undefined, "El protocolo fue preservado y enlazado para revision del diseno del ensayo."),
  "case-1": pair("Cacao in Panama with 27% production increase", "Documented field case for cacao under low-production conditions.", "Foliar application during vegetative and flowering stages.", "Production increased 27% compared with baseline.", "Cacao en Panama con 27% mas produccion", "Caso de campo documentado para cacao bajo condiciones de baja produccion.", "Aplicacion foliar durante etapas vegetativas y de floracion.", "La produccion aumento 27% frente a la linea base."),
  "case-2": pair("Banana in Colombia under water stress", "Field evidence for banana recovery under water stress.", "Foliar application.", "Improved field recovery and production stability.", "Banano en Colombia bajo estres hidrico", "Evidencia de campo para recuperacion de banano bajo estres hidrico.", "Aplicacion foliar.", "Mejoro la recuperacion de campo y la estabilidad productiva."),
  "case-3": pair("Coffee in Peru with flowering improvement", "Documented coffee case with measured improvement and some protocol details pending.", "Application protocol pending technical confirmation.", "Flowering uniformity improved and harvest volume increased.", "Cafe en Peru con mejora de floracion", "Caso documentado de cafe con mejora medida y algunos detalles de protocolo pendientes.", "Protocolo de aplicacion pendiente de confirmacion tecnica.", "Mejoro la uniformidad de floracion y aumento el volumen de cosecha.")
};

const taxonomyNames: Record<Locale, Record<string, string>> = {
  en: {},
  es: {
    "crop-sugarcane": "Cana de azucar",
    "crop-pepper": "Chile / pimiento",
    "crop-bean": "Frijol comun",
    "crop-banana": "Banano",
    "crop-loroco": "Loroco",
    "crop-corn": "Maiz",
    "crop-papaya": "Papaya",
    "crop-guava": "Guayaba",
    "crop-cabbage": "Repollo",
    "crop-tobacco": "Tabaco",
    "crop-tomato": "Tomate",
    "crop-vegetables": "Hortalizas",
    "crop-mixed": "Cultivos mixtos",
    "crop-cacao": "Cacao",
    "crop-coffee": "Cafe",
    "crop-rice": "Arroz",
    "country-panama": "Panama",
    "country-colombia": "Colombia",
    "country-peru": "Peru",
    "problem-low-production": "Baja produccion",
    "problem-water-stress": "Estres hidrico",
    "problem-weak-rooting": "Desarrollo radicular debil",
    "problem-poor-flowering": "Floracion deficiente",
    "problem-germination": "Germinacion y establecimiento",
    "problem-post-transplant": "Estres postrasplante",
    "problem-disease-pressure": "Presion de enfermedades",
    "problem-nutrition": "Nutricion y vigor",
    "problem-technical-protocol": "Protocolo tecnico"
  }
};

export function localizeCase(item: CaseStudy, locale: Locale): CaseStudy {
  const text = caseText[item.id]?.[locale];
  const localized = {
    ...item,
    crop: localizeTaxonomyItem(item.crop, locale),
    country: localizeCountry(item.country, locale),
    primary_problem: localizeTaxonomyItem(item.primary_problem, locale)
  };
  if (!text) return localized;
  return {
    ...localized,
    title: text.title,
    summary: text.summary,
    nano_gro_application: text.application ?? item.nano_gro_application,
    results_summary: text.results ?? item.results_summary,
    public_data_disclaimer: text.disclaimer ?? localizedDisclaimer(locale, item.public_data_disclaimer),
    seo_title: text.seoTitle ?? text.title,
    seo_description: text.seoDescription ?? text.summary,
    evidence_assets: item.evidence_assets?.map((asset) => ({
      ...asset,
      caption: localizeEvidenceCaption(asset.caption, locale)
    }))
  };
}

export function localizeCases(items: CaseStudy[], locale: Locale) {
  return items.map((item) => localizeCase(item, locale));
}

export function localizeTaxonomy<T extends TaxonomyItem | Country>(items: T[], locale: Locale): T[] {
  return items.map((item) => ({ ...item, name: taxonomyNames[locale][item.id] ?? item.name }));
}

function localizeTaxonomyItem<T extends TaxonomyItem | null | undefined>(item: T, locale: Locale): T {
  if (!item) return item;
  return { ...item, name: taxonomyNames[locale][item.id] ?? item.name };
}

function localizeCountry<T extends Country | null | undefined>(item: T, locale: Locale): T {
  return localizeTaxonomyItem(item, locale);
}

function localizeEvidenceCaption(caption: string | null | undefined, locale: Locale) {
  if (locale === "en") return caption;
  if (!caption) return caption;
  if (caption.includes("extraction/OCR pending")) return "Fuente real adjunta; extraccion u OCR pendiente.";
  if (caption.includes("extracted into the platform")) return "Documento fuente real extraido en la plataforma.";
  return caption;
}

function localizedDisclaimer(locale: Locale, fallback?: string | null) {
  if (locale === "en") return fallback;
  if (!fallback) return fallback;
  if (fallback.includes("still require text extraction")) return "Este informe se basa en evidencia de campo documentada. Algunos datos tecnicos no disponibles en el informe original fueron estimados de forma conservadora por el equipo tecnico para fines de orientacion y quedan sujetos a confirmacion.";
  if (fallback.includes("extracted from real source")) return "Este informe se basa en evidencia de campo documentada. Algunos datos tecnicos no disponibles en el informe original fueron estimados de forma conservadora por el equipo tecnico para fines de orientacion y quedan sujetos a confirmacion.";
  if (fallback.includes("documented field observations") || fallback.includes("documented field evidence")) return "Este informe se basa en evidencia de campo documentada. Algunos datos tecnicos no disponibles en el informe original fueron estimados de forma conservadora por el equipo tecnico para fines de orientacion y quedan sujetos a confirmacion.";
  return fallback;
}

function pair(
  enTitle: string,
  enSummary: string,
  enApplication: string | undefined,
  enResults: string,
  esTitle: string,
  esSummary: string,
  esApplication: string | undefined,
  esResults: string
): Record<Locale, LocalizedCaseText> {
  return {
    en: { title: enTitle, summary: enSummary, application: enApplication, results: enResults },
    es: { title: esTitle, summary: esSummary, application: esApplication, results: esResults }
  };
}
