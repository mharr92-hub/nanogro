import type { Country, TaxonomyItem } from "@/lib/types";

/**
 * Iconografia de la taxonomia.
 *
 * No es decoracion: en un listado de veinte cultivos, un icono se reconoce antes de leer
 * la palabra, y buena parte del publico lee en un movil pequeno y con prisa. Los paises
 * usan su bandera REAL derivada del codigo ISO, no un emoji elegido a mano.
 *
 * El emparejamiento es por palabra clave y funciona en espanol y en ingles, porque los
 * nombres de la taxonomia vienen de la base de datos en cualquiera de los dos idiomas.
 * Si nada casa, se devuelve un icono neutro: nunca se deja el hueco vacio.
 */

const CROP_ICONS: [RegExp, string][] = [
  [/ma[ií]z|corn|maize/i, "🌽"],
  [/arroz|rice/i, "🌾"],
  [/trigo|wheat|cereal/i, "🌾"],
  [/frijol|bean|leguminosa|soya|soja|soy/i, "🫘"],
  [/caf[eé]|coffee/i, "☕"],
  [/cacao|cocoa/i, "🍫"],
  [/banano|banana|pl[aá]tano|plantain/i, "🍌"],
  [/tomate|tomato/i, "🍅"],
  [/papa|patata|potato/i, "🥔"],
  [/ca[nñ]a|sugarcane|sugar/i, "🎋"],
  [/uva|grape|vid/i, "🍇"],
  [/c[ií]trico|citrus|naranja|orange|lim[oó]n|lemon/i, "🍊"],
  [/mel[oó]n|melon/i, "🍈"],
  [/sand[ií]a|watermelon/i, "🍉"],
  [/papaya/i, "🥭"],
  [/mango/i, "🥭"],
  [/guayaba|guava/i, "🍐"],
  [/pi[nñ]a|pineapple/i, "🍍"],
  [/aguacate|avocado|palta/i, "🥑"],
  [/chile|aj[ií]|pepper|pimiento/i, "🌶️"],
  [/repollo|cabbage|col\b/i, "🥬"],
  [/lechuga|lettuce|espinaca|spinach/i, "🥬"],
  [/cebolla|onion|ajo|garlic/i, "🧅"],
  [/zanahoria|carrot/i, "🥕"],
  [/tabaco|tobacco/i, "🍃"],
  [/algod[oó]n|cotton/i, "🌱"],
  [/flor|ornamental|rosa|rose/i, "🌸"],
  [/loroco|hortaliza|vegetable/i, "🥬"],
  [/fresa|berry|berries|arandano/i, "🍓"]
];

const PROBLEM_ICONS: [RegExp, string][] = [
  [/baja producci[oó]n|low (production|yield)|rendimiento/i, "📉"],
  [/ra[ií]z|ra[ií]ces|root/i, "🪴"],
  [/agua|h[ií]drico|sequ[ií]a|water|drought/i, "💧"],
  [/floraci[oó]n|flower|floweri/i, "🌸"],
  [/fruto|fruit|cuaj/i, "🍏"],
  [/trasplante|transplant/i, "🌱"],
  [/germinaci[oó]n|germination|semilla|seed/i, "🌰"],
  [/enfermedad|disease|hongo|fung/i, "🦠"],
  [/plaga|pest|insecto/i, "🐛"],
  [/calidad|quality/i, "⭐"],
  [/clima|climate|estr[eé]s|stress|calor|heat/i, "🌡️"],
  [/suelo|soil|salinidad|salin/i, "🪨"],
  [/nutrient|deficien|nutrici/i, "🧪"]
];

const NEUTRAL_CROP = "🌱";
const NEUTRAL_PROBLEM = "🔎";

export function cropIcon(term: Pick<TaxonomyItem, "name" | "slug">) {
  return match(CROP_ICONS, `${term.name} ${term.slug}`) ?? NEUTRAL_CROP;
}

export function problemIcon(term: Pick<TaxonomyItem, "name" | "slug">) {
  return match(PROBLEM_ICONS, `${term.name} ${term.slug}`) ?? NEUTRAL_PROBLEM;
}

/**
 * Bandera del pais a partir de su codigo ISO-3166 alfa-2: cada letra se desplaza al
 * rango de "regional indicator symbols" de Unicode y el par forma la bandera. Es el
 * dato real de la columna `iso_code`, no una tabla de emojis mantenida a mano.
 */
export function countryIcon(country: Pick<Country, "name" | "slug" | "iso_code">) {
  const code = country.iso_code?.trim().toUpperCase();
  if (code && /^[A-Z]{2}$/.test(code)) {
    return String.fromCodePoint(...[...code].map((letter) => 0x1f1e6 + letter.charCodeAt(0) - 65));
  }
  return "🌎";
}

/**
 * Bandera de un pais del que solo conocemos el slug (los enlaces cruzados de los hubs se
 * construyen contando casos, no leyendo la taxonomia). Necesita la lista para recuperar
 * el `iso_code`, que es de donde sale la bandera de verdad.
 */
export function countryIconBySlug(slug: string, countries: Country[]) {
  const country = countries.find((item) => item.slug === slug);
  return country ? countryIcon(country) : "🌎";
}

/** Icono del termino segun el tipo de hub, para no repetir el switch en cada pagina. */
export function taxonomyIcon(kind: "crop" | "country" | "problem", term: TaxonomyItem) {
  if (kind === "crop") return cropIcon(term);
  if (kind === "problem") return problemIcon(term);
  return countryIcon(term as Country);
}

function match(table: [RegExp, string][], haystack: string) {
  return table.find(([pattern]) => pattern.test(haystack))?.[1];
}
