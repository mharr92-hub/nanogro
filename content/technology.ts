import type { Locale } from "@/lib/i18n-shared";

/**
 * Contenido de la pagina de Tecnologia.
 *
 * TODO lo de este archivo esta sacado de tres documentos que estan en el repo, y de ningun
 * otro sitio:
 *   - documentaymejora/pdf-t/nanogro-panama.txt   (ficha tecnica NG Caribbean)
 *   - documentaymejora/pdf-t/pedro-mexico.txt     (dossier tecnico, 54 pag.)
 *   - documentaymejora/pdf-t/tierra-fertil.txt    (analisis AOAC de Tierra Fertil)
 *
 * La separacion mas importante del archivo es esta:
 *
 *   `claims`  = lo que el FABRICANTE afirma que hace el producto. Va en VERDE, porque es
 *               propuesta comercial. No se presenta como algo que el agricultor vaya a
 *               obtener.
 *   `results` = lo que se MIDIO en campo, con su cultivo, su lugar y su cifra. Va en AZUL,
 *               que en este sitio es el color del dato medido.
 *
 * Confundir las dos cosas seria exactamente el tipo de mentira que esta plataforma existe
 * para no contar.
 */

type Bilingual = Record<Locale, string>;

const t = (es: string, en: string): Bilingual => ({ es, en });

export const technology = {
  intro: {
    title: t("Qué es Nano-Gro", "What Nano-Gro is"),
    body: t(
      "Una cápsula de azúcar de grado farmacéutico que contiene nano-sulfatos minerales en concentración 10⁻⁹. Se disuelve en agua limpia y se aplica a la semilla o a la planta. Según su fabricante, NG Caribbean, actúa como regulador del crecimiento y potenciador de la inmunidad de la planta, reactivando las vías de comunicación electroquímica que los suelos sobreexplotados han ido perdiendo.",
      "A pharmaceutical-grade sugar capsule containing mineral nano-sulfates at a 10⁻⁹ concentration. It dissolves in clean water and is applied to the seed or the plant. According to its manufacturer, NG Caribbean, it acts as a growth regulator and plant immunity enhancer, reactivating the electrochemical communication pathways that over-exploited soils have gradually lost."
    ),
    /*
     * Matiz importante: la ficha tecnica oficial clasifica el producto como "Fertilizante
     * organico. Potenciador de la inmunidad de las plantas". Se usa esa formulacion literal
     * en vez de la de "no es fertilizante" que circula en los materiales comerciales, porque
     * lo que aguanta una revision es el documento, no el folleto.
     */
    classification: t(
      "Clasificación en la ficha técnica oficial: «Fertilizante orgánico. Potenciador de la inmunidad de las plantas». Fabricante: NG Caribbean.",
      "Classification in the official technical sheet: “Organic fertilizer. Plant immunity enhancer.” Manufacturer: NG Caribbean."
    )
  },

  mechanisms: [
    {
      icon: "🌱",
      title: t("Absorción radicular", "Root absorption"),
      body: t("Sistema radicular más fuerte y profundo.", "Stronger, deeper root system.")
    },
    {
      icon: "🍃",
      title: t("Absorción foliar", "Foliar absorption"),
      body: t("Mayor aprovechamiento del nutriente aplicado a la hoja.", "Better uptake of nutrients applied to the leaf.")
    },
    {
      icon: "🛡️",
      title: t("Sistema inmunológico", "Immune system"),
      body: t("Mayor tolerancia al estrés y a la presión de enfermedad.", "Greater tolerance to stress and disease pressure.")
    }
  ],

  /** AFIRMACIONES DEL FABRICANTE. Verde. No son resultados que se prometan a nadie. */
  claims: [
    t("Aumenta la fotosíntesis", "Increases photosynthesis"),
    t("Acelera el metabolismo celular", "Speeds up cell metabolism"),
    t("Sube los grados Brix (azúcares y reservas)", "Raises Brix degrees (sugars and reserves)"),
    t("Acelera el crecimiento y el engrosamiento celular", "Accelerates growth and cell thickening"),
    t("Fortalece el sistema inmunológico", "Strengthens the immune system"),
    t("Aumenta la resistencia a sequía, inundación y helada", "Increases resistance to drought, flooding, and frost"),
    t("Maximiza la absorción de nutrientes", "Maximises nutrient absorption"),
    t("Cosechas más uniformes y maduración pareja", "More uniform harvests and even ripening"),
    t("Mejor resistencia en anaquel", "Better shelf life"),
    t("Raíz más fuerte y profunda", "Stronger, deeper roots"),
    t("Evita el acame en arroz, caña, plátano y maíz", "Prevents lodging in rice, sugarcane, plantain, and maize")
  ],

  /**
   * DATOS MEDIDOS EN CAMPO. Azul. Cada uno con su cultivo, su lugar y su cifra, y con el
   * slug del caso publicado cuando existe, para que se pueda ir a ver la evidencia.
   */
  results: [
    {
      crop: t("Frijol", "Common bean"),
      place: t("Laderas, El Salvador", "Hillsides, El Salvador"),
      figure: "21 → 45 qq/mz",
      note: t("Mayor resistencia a sequía y plagas, y mejor calidad de semilla.", "Greater drought and pest resistance, and better seed quality."),
      caseSlug: "common-bean-in-el-salvador-with-35-1-higher-yield"
    },
    {
      crop: t("Maíz", "Maize"),
      place: t("San Sebastián, San Vicente, El Salvador — 2015", "San Sebastián, San Vicente, El Salvador — 2015"),
      figure: "+35%",
      note: t(
        "Las plantas tratadas resistieron 28 días de sequía; las no tratadas no resistieron.",
        "Treated plants withstood 28 days of drought; untreated plants did not."
      ),
      caseSlug: "maize-seed-treatment-in-el-salvador"
    },
    {
      crop: t("Caña de azúcar", "Sugarcane"),
      place: t("El Salvador — 2015", "El Salvador — 2015"),
      figure: "+37.9%",
      note: t(
        "Tallos primarios frente al testigo. Además: +22% de grosor de tallo y +0.8 puntos Brix. Parcela vs testigo: 40 vs 29 cañas por metro lineal; Brix 13.3 vs 12.5.",
        "Primary stalks versus the control. Also: +22% stalk thickness and +0.8 Brix points. Treated vs control plot: 40 vs 29 canes per linear metre; Brix 13.3 vs 12.5."
      ),
      caseSlug: "sugarcane-in-el-salvador-under-severe-drought"
    },
    {
      crop: t("Banano / musáceas", "Banana / musaceae"),
      place: t("Aplicación al racimo", "Bunch application"),
      figure: "+15-20%",
      note: t(
        "Peso del dedo. El dossier lo equipara a más de 1.200 USD/ha/año.",
        "Finger weight. The dossier equates this to more than 1,200 USD/ha/year."
      ),
      caseSlug: "banana-in-guatemala-biometric-evaluation"
    },
    {
      crop: t("Germinación (frijol)", "Germination (bean)"),
      place: t("Frijol rojo y negro", "Red and black bean"),
      figure: t("hasta 15 días", "up to 15 days"),
      note: t(
        "Adelanto de la germinación con remojo de semilla, con raíces más desarrolladas.",
        "Earlier germination with seed soaking, and better developed roots."
      ),
      caseSlug: "common-bean-germination-protocol-in-el-salvador"
    },
    {
      crop: t("Guayaba con nematodos", "Guava under nematode pressure"),
      place: t("Más del 90% de infestación", "Over 90% infestation"),
      figure: t("~33 días", "~33 days"),
      note: t(
        "Rebrotes y yemas nuevas visibles (aplicación 10 nov → rebrotes 13 dic).",
        "New shoots and buds visible (applied 10 Nov → shoots 13 Dec)."
      ),
      caseSlug: "guava-recovery-under-nematode-pressure"
    }
  ],

  validations: {
    title: t("Validaciones institucionales", "Institutional validations"),
    institutions: ["INIFAT (Cuba)", "Universidad del Valle (Guatemala)", "SAGARPA e INIFAP (México)", "CENTA (El Salvador)"],
    keyFinding: t(
      "Hallazgo clave de esas validaciones: se obtuvieron resultados superiores con el tratamiento a la semilla combinado con solo el 50% de la fertilización habitual. Es decir, más rendimiento con menos insumo químico.",
      "Key finding from those validations: better results were obtained with seed treatment combined with only 50% of the usual fertilisation. That is, more yield with less chemical input."
    ),
    independent: t(
      "Validación independiente: existe un estudio revisado por pares sobre la influencia del estimulador orgánico NANO-GRO® en el rendimiento y la calidad del fruto de tomate de campo, publicado e indexado. No es un caso propio de Nano-Gro.",
      "Independent validation: a peer-reviewed study exists on the influence of the NANO-GRO® organic stimulator on field tomato yield and fruit quality, published and indexed. It is not a Nano-Gro in-house case."
    )
  },

  certifications: [
    { name: "OMRI", note: t("Declarado orgánico (Organic Materials Review Institute, EE.UU.).", "Declared organic (Organic Materials Review Institute, USA).") },
    { name: "OACC", note: t("Declarado orgánico (Organic Agriculture Centre of Canada).", "Declared organic (Organic Agriculture Centre of Canada).") },
    { name: "ISO 9001:2000", note: t("Estándar de fabricación.", "Manufacturing standard.") },
    { name: "BPM", note: t("Buenas Prácticas de Manufactura.", "Good Manufacturing Practices.") },
    { name: t("No peligroso (OSHA)", "Non-hazardous (OSHA)"), note: t("Clasificación según OSHA.", "Classification per OSHA.") },
    { name: t("No fitotóxico", "Non-phytotoxic"), note: t("El producto no causa fitotoxicidad.", "The product does not cause phytotoxicity.") },
    { name: t("Sin efecto residual", "No residual effect"), note: t("Sin efecto tóxico ni residual sobre suelo, agua o fauna.", "No toxic or residual effect on soil, water, or fauna.") }
  ],

  facts: [
    {
      label: t("Dosis", "Dose"),
      value: t("8-10 cápsulas/ha en 200 L de agua limpia", "8-10 capsules/ha in 200 L of clean water")
    },
    { label: t("Vida útil", "Shelf life"), value: t("15 años en cápsula", "15 years in capsule") },
    { label: t("pH óptimo", "Optimal pH"), value: "3.5 – 8" },
    {
      label: t("Compatibilidad", "Compatibility"),
      value: t(
        "Fertilizantes, insecticidas y fungicidas solubles. NO con herbicidas.",
        "Soluble fertilisers, insecticides, and fungicides. NOT with herbicides."
      )
    },
    {
      label: t("Cultivos", "Crops"),
      value: t(
        "Gramíneas, leguminosas, cucurbitáceas y frutales",
        "Grasses, legumes, cucurbits, and fruit trees"
      )
    }
  ],

  /**
   * La ficha tecnica se contradice a si misma en la dosis: en un sitio dice 8-10 capsulas por
   * hectarea y en otro "Rendimientos en Cultivos: 10-25 capsulas en 200 litros de agua /
   * hectarea". Se publica el rango principal y se remite al tecnico, que es lo que el propio
   * documento pide en mayusculas.
   */
  doseWarning: t(
    "La ficha técnica recoge también un rango de 10-25 cápsulas por hectárea según el tipo de cultivo. El propio documento indica consultar con un técnico especialista para la dosificación de cada cultivo.",
    "The technical sheet also lists a 10-25 capsules per hectare range depending on the crop. The document itself states that a specialist technician should be consulted for each crop's dosage."
  ),

  datasheetUrl: "/source-data/fichas/ficha-tecnica-nanogro-panama-2026-8-pag.pdf",

  tierraFertil: {
    title: t("Minerales Tierra Fértil Plus", "Tierra Fértil Plus Minerals"),
    body: t(
      "Acondicionador de suelos 100% natural. Devuelve al suelo los macro y micronutrientes perdidos por años de explotación, erosión y exceso de fertilizante químico.",
      "A 100% natural soil conditioner. It returns to the soil the macro- and micronutrients lost to years of exploitation, erosion, and excess chemical fertiliser."
    ),
    system: t(
      "Tierra Fértil repone los minerales del suelo; Nano-Gro reactiva la comunicación de la planta para que los aproveche. Dos piezas del mismo sistema.",
      "Tierra Fértil replenishes the soil's minerals; Nano-Gro reactivates the plant's communication so it can use them. Two pieces of the same system."
    ),
    analysisTitle: t("Análisis AOAC (15.ª ed.)", "AOAC analysis (15th ed.)"),
    analysis: [
      { label: "SiO₂", value: "50.84%" },
      { label: "Fe", value: "1.70%" },
      { label: "N", value: "489 mg/kg" },
      { label: "P", value: "900 mg/kg" },
      { label: "K", value: "335 mg/kg" },
      { label: "Mn", value: "221 mg/kg" },
      { label: "Zn", value: "62 mg/kg" },
      { label: "Cu", value: "26 mg/kg" },
      { label: t("Materia orgánica", "Organic matter"), value: "1.73%" },
      { label: "pH", value: "8.08" }
    ],
    datasheetUrl: "/source-data/fichas/ficha-tecnica-de-minerales-tierra-fertil-actualizada-segun-mag-1.pdf"
  }
};

export function pick(value: Bilingual | string, locale: Locale): string {
  return typeof value === "string" ? value : value[locale];
}
