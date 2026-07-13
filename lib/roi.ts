import { getYieldRange } from "@/lib/aggregate";
import type { CaseStudy } from "@/lib/types";

/**
 * Calculador de ROI (spec, seccion 5).
 *
 * Traduce el resultado agronomico a la pregunta economica del agricultor: "cuanto dinero
 * podria ganar". El rango de mejora NO se inventa: sale de los casos documentados
 * comparables (mismo cultivo, y si hay, mismo pais). Si no hay casos comparables, el
 * calculador lo dice y no calcula nada.
 *
 * Guardrail de la spec: la salida es una estimacion basada en casos comparables, jamas un
 * resultado garantizado. `comparableCases` viaja siempre con el resultado para que el
 * usuario pueda ir a leer de donde salio cada supuesto.
 */

export type RoiInput = {
  hectares: number;
  currentYieldPerHectare: number;
  salePricePerUnit: number;
  programCostPerHectare: number;
};

export type RoiResult = {
  additionalProductionLow: number;
  additionalProductionHigh: number;
  additionalRevenueLow: number;
  additionalRevenueHigh: number;
  programCost: number;
  grossBenefitLow: number;
  grossBenefitHigh: number;
  roiLow: number;
  roiHigh: number;
  improvementLow: number;
  improvementHigh: number;
  sample: number;
};

/** Coste por hectarea por defecto del programa, hasta que el equipo comercial lo configure. */
export const DEFAULT_PROGRAM_COST_PER_HECTARE = 60;

export function getComparableCases(cases: CaseStudy[], cropSlug?: string, countrySlug?: string) {
  const withYield = cases.filter((item) => typeof item.yield_increase_percent === "number");
  if (!cropSlug) return [];

  const sameCropSameCountry = withYield.filter(
    (item) => item.crop?.slug === cropSlug && (!countrySlug || item.country?.slug === countrySlug)
  );
  // Si el pais deja la muestra vacia, se amplia a todo el cultivo antes que devolver nada,
  // pero el tamano de muestra resultante se muestra siempre para que el usuario lo juzgue.
  if (sameCropSameCountry.length >= 2) return sameCropSameCountry;
  return withYield.filter((item) => item.crop?.slug === cropSlug);
}

export function calculateRoi(input: RoiInput, comparableCases: CaseStudy[]): RoiResult | null {
  const range = getYieldRange(comparableCases);
  if (!range) return null;
  if (input.hectares <= 0 || input.currentYieldPerHectare <= 0 || input.salePricePerUnit <= 0) return null;

  const baseProduction = input.hectares * input.currentYieldPerHectare;
  const additionalProductionLow = baseProduction * (range.low / 100);
  const additionalProductionHigh = baseProduction * (range.high / 100);

  const additionalRevenueLow = additionalProductionLow * input.salePricePerUnit;
  const additionalRevenueHigh = additionalProductionHigh * input.salePricePerUnit;

  const programCost = input.hectares * input.programCostPerHectare;
  const grossBenefitLow = additionalRevenueLow - programCost;
  const grossBenefitHigh = additionalRevenueHigh - programCost;

  return {
    additionalProductionLow,
    additionalProductionHigh,
    additionalRevenueLow,
    additionalRevenueHigh,
    programCost,
    grossBenefitLow,
    grossBenefitHigh,
    roiLow: programCost > 0 ? additionalRevenueLow / programCost : 0,
    roiHigh: programCost > 0 ? additionalRevenueHigh / programCost : 0,
    improvementLow: range.low,
    improvementHigh: range.high,
    sample: range.sample
  };
}
