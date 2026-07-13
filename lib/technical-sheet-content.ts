import type { Locale } from "@/lib/i18n-shared";
import { technicalSheets, type TechnicalSheet } from "@/lib/real-source-data";

type SheetCopy = {
  title: string;
  summary: string;
  promise: string;
  howItWorks: string[];
  whyItMatters: string[];
  fieldUse: string[];
  proofNote: string;
};

type LocalizedSheet = TechnicalSheet & SheetCopy;

const publicSlugs: Record<TechnicalSheet["id"], string> = {
  "tech-nanogro-panama-2026": "nano-gro-panama-2026",
  "tech-minerales-tierra-fertil": "minerales-tierra-fertil",
  "tech-pedro-rivero-mexico": "nano-gro-mexico-soporte-tecnico",
  "tech-whatsapp-reference": "registro-fotografico-campo-2026-06-06"
};

const copy: Record<TechnicalSheet["id"], Record<Locale, SheetCopy>> = {
  "tech-nanogro-panama-2026": {
    es: {
      title: "Ficha Tecnica Nano-Gro Panama 2026",
      summary: "Ficha tecnica local para Panama, disponible para revision comercial y agronomica.",
      promise:
        "Nano-Gro se presenta como una herramienta de bioestimulacion para apoyar la respuesta fisiologica de la planta en etapas criticas, especialmente cuando el cultivo necesita mayor vigor, mejor establecimiento o recuperacion despues de estres.",
      howItWorks: [
        "Se aplica segun el protocolo tecnico definido para el cultivo y la etapa fenologica.",
        "Actua como senal de apoyo para activar respuestas naturales de crecimiento, raiz y recuperacion.",
        "Ayuda a que la planta use mejor su energia durante momentos de alta demanda.",
        "El seguimiento de campo permite documentar vigor, sanidad visual, establecimiento y respuesta productiva."
      ],
      whyItMatters: [
        "Convierte la conversacion comercial en una recomendacion tecnica, no solo en una promesa de producto.",
        "Ayuda a productores que necesitan mejorar respuesta del cultivo sin cambiar por completo su manejo.",
        "Sirve como base para explicar casos reales, protocolos y oportunidades de validacion local."
      ],
      fieldUse: [
        "Presentaciones comerciales con distribuidores y productores.",
        "Capacitacion de tecnicos de campo.",
        "Validacion inicial antes de una prueba o demostracion."
      ],
      proofNote:
        "Documento tecnico de soporte. Los resultados finales siempre deben comunicarse con evidencia del caso, cultivo, dosis, fechas y comparativo disponible."
    },
    en: {
      title: "Nano-Gro Panama 2026 Technical Sheet",
      summary: "Local Panama technical sheet prepared for commercial and agronomic review.",
      promise:
        "Nano-Gro is positioned as a biostimulation tool that supports the plant's physiological response during critical stages, especially when crops need vigor, establishment, or recovery after stress.",
      howItWorks: [
        "It is applied according to the technical protocol for the crop and growth stage.",
        "It supports natural plant responses related to growth, rooting, and recovery.",
        "It helps the crop manage energy during high-demand moments.",
        "Field follow-up documents vigor, visual health, establishment, and productive response."
      ],
      whyItMatters: [
        "It turns the sales conversation into a technical recommendation, not just a product claim.",
        "It helps producers improve crop response without fully changing their management plan.",
        "It supports local validation, field demonstrations, and real case storytelling."
      ],
      fieldUse: [
        "Commercial presentations with distributors and producers.",
        "Field team training.",
        "Initial validation before a trial or demonstration."
      ],
      proofNote:
        "Technical support document. Final results should always be communicated with available case evidence, crop, dosage, dates, and comparison."
    }
  },
  "tech-minerales-tierra-fertil": {
    es: {
      title: "Ficha Tecnica de Minerales Tierra Fertil",
      summary: "Documento tecnico de minerales Tierra Fertil actualizado segun MAG.",
      promise:
        "El documento de minerales Tierra Fertil ayuda a explicar la base nutricional que debe acompanar una estrategia de vigor, raiz y recuperacion del cultivo.",
      howItWorks: [
        "Aporta una referencia tecnica para ordenar el componente mineral dentro del manejo agricola.",
        "Complementa la conversacion sobre bioestimulacion con nutricion y balance del cultivo.",
        "Permite al tecnico conectar sintomas de campo con necesidades de soporte mineral.",
        "Facilita recomendaciones mas completas cuando el productor busca recuperacion y rendimiento."
      ],
      whyItMatters: [
        "Un cultivo con deficiencias nutricionales puede limitar la respuesta a cualquier bioestimulante.",
        "Ayuda al equipo comercial a vender una solucion tecnica mas completa.",
        "Da respaldo para conversaciones con productores que piden fundamentos agronomicos."
      ],
      fieldUse: [
        "Diagnostico comercial inicial.",
        "Soporte para propuestas de programa nutricional.",
        "Material de consulta para tecnicos y distribuidores."
      ],
      proofNote:
        "Documento tecnico recibido. La recomendacion final debe adaptarse al cultivo, suelo, analisis disponible y objetivo del productor."
    },
    en: {
      title: "Tierra Fertil Minerals Technical Sheet",
      summary: "Technical document for Tierra Fertil minerals, updated according to MAG.",
      promise:
        "The Tierra Fertil minerals document helps explain the nutritional foundation that should support a crop vigor, rooting, and recovery strategy.",
      howItWorks: [
        "It provides a technical reference for the mineral component within crop management.",
        "It complements biostimulation discussions with nutrition and crop balance.",
        "It helps the field team connect crop symptoms with mineral support needs.",
        "It supports fuller recommendations when producers seek recovery and yield improvement."
      ],
      whyItMatters: [
        "Nutritional deficiencies can limit the response to any biostimulant.",
        "It helps the commercial team sell a more complete technical solution.",
        "It supports conversations with producers who need agronomic rationale."
      ],
      fieldUse: [
        "Initial commercial diagnosis.",
        "Support for nutritional program proposals.",
        "Reference material for technical teams and distributors."
      ],
      proofNote:
        "Technical document received. Final recommendation should be adapted to crop, soil, available analysis, and producer objective."
    }
  },
  "tech-pedro-rivero-mexico": {
    es: {
      title: "Pedro Rivero Hayes - Nano-Gro Mexico",
      summary: "Documento tecnico asociado a Nano-Gro Mexico y Pedro Rivero Hayes.",
      promise:
        "Esta ficha funciona como soporte tecnico local para conversaciones de Nano-Gro en Mexico, conectando el producto con contexto regional, validacion y seguimiento agronomico.",
      howItWorks: [
        "Preserva una referencia tecnica para explicar el uso de Nano-Gro en contexto local.",
        "Ayuda a estructurar preguntas de dosis, cultivo, etapa y objetivo antes de recomendar.",
        "Permite separar evidencia disponible de informacion pendiente de confirmacion.",
        "Sirve como punto de partida para construir casos publicables con soporte documental."
      ],
      whyItMatters: [
        "Los compradores confian mas cuando la recomendacion tiene soporte tecnico local.",
        "Reduce improvisacion comercial y ordena la explicacion del producto.",
        "Facilita que el disenador o vendedor convierta el documento en piezas de campana."
      ],
      fieldUse: [
        "Capacitacion para Mexico.",
        "Brief comercial para distribuidores.",
        "Base para revisar y completar evidencia de campo."
      ],
      proofNote:
        "Documento tecnico recibido y pendiente de conversion completa. Evitar presentar datos no extraidos como resultados verificados."
    },
    en: {
      title: "Pedro Rivero Hayes - Nano-Gro Mexico",
      summary: "Technical document associated with Nano-Gro Mexico and Pedro Rivero Hayes.",
      promise:
        "This sheet works as local technical support for Nano-Gro conversations in Mexico, connecting the product with regional context, validation, and agronomic follow-up.",
      howItWorks: [
        "It preserves a technical reference for explaining Nano-Gro in a local context.",
        "It structures dosage, crop, stage, and objective questions before recommendation.",
        "It separates available evidence from details still pending confirmation.",
        "It serves as a starting point for publishable cases with documentary support."
      ],
      whyItMatters: [
        "Buyers trust recommendations more when they have local technical support.",
        "It reduces commercial improvisation and organizes the product explanation.",
        "It helps designers and sellers turn the document into campaign material."
      ],
      fieldUse: [
        "Training for Mexico.",
        "Commercial brief for distributors.",
        "Base for reviewing and completing field evidence."
      ],
      proofNote:
        "Technical document received and pending full conversion. Avoid presenting unextracted data as verified results."
    }
  },
  "tech-whatsapp-reference": {
    es: {
      title: "Registro fotografico de campo 2026-06-06",
      summary: "Imagen de campo conservada como evidencia pendiente de clasificacion tecnica.",
      promise:
        "Este registro visual sirve para conservar evidencia de campo y abrir una revision tecnica posterior, sin presentarlo como informe completo ni como resultado verificado.",
      howItWorks: [
        "La imagen se conserva como evidencia inicial del seguimiento en campo.",
        "El equipo tecnico debe clasificar cultivo, ubicacion, fecha, tratamiento y observacion.",
        "Despues de la validacion, puede vincularse a un caso o a un protocolo.",
        "Si faltan datos, permanece como soporte visual y no como prueba final."
      ],
      whyItMatters: [
        "Las fotos ayudan a vender cuando estan bien explicadas y conectadas a un caso.",
        "Evita perder evidencia de campo que puede ser util para seguimiento comercial.",
        "Protege la credibilidad al no convertir una imagen suelta en afirmacion tecnica."
      ],
      fieldUse: [
        "Revision interna de evidencia.",
        "Preparacion de caso antes de publicacion.",
        "Solicitud de informacion faltante al equipo de campo."
      ],
      proofNote:
        "Evidencia proporcionada por equipo de campo. Requiere clasificacion antes de usarse como pieza publica principal."
    },
    en: {
      title: "Field photographic record 2026-06-06",
      summary: "Field image preserved as evidence pending technical classification.",
      promise:
        "This visual record preserves field evidence and opens later technical review, without treating it as a full report or verified result.",
      howItWorks: [
        "The image is preserved as initial field follow-up evidence.",
        "The technical team should classify crop, location, date, treatment, and observation.",
        "After validation, it can be linked to a case or protocol.",
        "If data is missing, it remains visual support rather than final proof."
      ],
      whyItMatters: [
        "Photos help sell when they are properly explained and connected to a case.",
        "They prevent useful field evidence from being lost.",
        "They protect credibility by not turning a loose image into a technical claim."
      ],
      fieldUse: [
        "Internal evidence review.",
        "Case preparation before publication.",
        "Missing-information request to the field team."
      ],
      proofNote:
        "Evidence provided by field team. Requires classification before use as a primary public piece."
    }
  }
};

export function getLocalizedTechnicalSheet(sheet: TechnicalSheet, locale: Locale): LocalizedSheet {
  return { ...sheet, ...copy[sheet.id][locale] };
}

export function getTechnicalSheetRouteId(sheet: TechnicalSheet) {
  return publicSlugs[sheet.id] ?? sheet.id;
}

export function getTechnicalSheetByRouteId(id: string, locale: Locale) {
  const sheet = technicalSheets.find((item) => item.id === id || getTechnicalSheetRouteId(item) === id);
  return sheet ? getLocalizedTechnicalSheet(sheet, locale) : null;
}
