/**
 * Equipo tecnico.
 *
 * Esto no es una pagina de "sobre nosotros" con fotos y adjetivos. Es una pieza de la cadena
 * de evidencia: cuando un agronomo o un distribuidor pregunta "¿quien firma esto?", la
 * respuesta tiene que ser un nombre, unas credenciales y los informes concretos que lleva su
 * firma. Por eso cada miembro se enlaza a los casos que autorizo o superviso.
 *
 * Los casos de `signedCaseIds` NO estan elegidos a dedo: son los informes originales donde
 * su nombre aparece firmando o supervisando (verificado en docs/real-data-extraction/).
 */

export type TeamMember = {
  id: string;
  name: string;
  /** Foto en /public/team/. Si no hay, se pinta un monograma con sus iniciales. */
  photo?: string;
  roleKey: "internationalTechnicalManager";
  /** Credenciales tal y como aparecen en los informes originales. */
  credentials: string[];
  /** Documento tecnico del que es autor. */
  authored?: { es: string; en: string };
  /** Enlace al documento, para que se pueda comprobar la autoria. */
  authoredUrl?: string;
  /** Paises donde consta su trabajo en la documentacion. */
  countries?: string[];
  /** Ids de casos cuyo informe original firma o supervisa. */
  signedCaseIds: string[];
};

export const team: TeamMember[] = [
  {
    id: "pedro-pablo-rivero-hayes",
    name: "Ing. Pedro Pablo Rivero Hayes",
    photo: "/team/pedro-pablo-rivero-hayes.png",
    roleKey: "internationalTechnicalManager",
    /*
     * Solo lo que consta en los documentos del repo. El apellido es "Rivero Hayes" (no
     * "Rivera"): asi firma en el dossier tecnico y en los seis informes de campo.
     *
     * PENDIENTE de que Mark aporte, y que NO se inventa: titulo(s) y universidad, anos de
     * experiencia, certificaciones y una biografia. Los campos vacios no se pintan.
     */
    credentials: ["Director de Desarrollo del INIFAT", "La Habana, Cuba"],
    authored: {
      es: "Autor del dossier técnico «Producto Orgánico de Nanotecnología Aplicado a la Agricultura» (54 páginas)",
      en: "Author of the technical dossier “Organic Nanotechnology Product Applied to Agriculture” (54 pages)"
    },
    authoredUrl: "/source-data/fichas/04-pedro-rivero-hayes-nano-gro-mexico.pdf",
    countries: ["El Salvador", "Cuba", "Guatemala", "México"],
    signedCaseIds: [
      "real-001", // Caña de azúcar, El Salvador — "Supervisado por: Ing. Pedro Pablo Rivero Hayes"
      "real-002", // Chile en campo, El Salvador
      "real-007", // Ensayos de maíz, ALBA Alimentos
      "real-008", // Maíz foliar, El Salvador
      "real-011", // Papaya Maradol, Cuba — informe de su autoría
      "real-016" // Tomate, recuperación de Rhizoctonia — supervisado por él
    ]
  }
];

/** Iniciales para el monograma cuando aun no hay foto. */
export function initialsOf(member: TeamMember) {
  return member.name
    .replace(/^Ing\.\s*/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

/** ¿Este caso lleva la firma de alguien del equipo tecnico? */
export function signersOfCase(caseId: string) {
  return team.filter((member) => member.signedCaseIds.includes(caseId));
}
