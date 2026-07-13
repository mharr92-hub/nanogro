import { describe, it, expect } from "vitest";
import { scoreLead } from "@/lib/leadScore";

describe("scoreLead", () => {
  it("bands a large, urgent, distributor-intent lead as HOT", () => {
    const r = scoreLead({
      hectares: 600,
      cropMatchesStrongCase: true,
      countryHasCoverage: true,
      budget: "high",
      urgency: "high",
      needDistributor: true,
      needTrial: true,
      completedDiagnostic: true,
      pageViews: 8,
      casesViewed: 4,
      returned: true,
      downloaded: true,
    });
    expect(r.band).toBe("HOT");
    expect(r.score).toBeGreaterThanOrEqual(70);
  });

  it("bands a tiny, low-intent, low-engagement lead as COLD", () => {
    const r = scoreLead({
      hectares: 1,
      budget: "low",
      urgency: "low",
      pageViews: 1,
    });
    expect(r.band).toBe("COLD");
    expect(r.score).toBeLessThan(40);
  });

  it("caps each axis at its maximum", () => {
    const r = scoreLead({
      hectares: 100000,
      cropMatchesStrongCase: true,
      countryHasCoverage: true,
      budget: "high",
      urgency: "high",
      needDistributor: true,
      needTrial: true,
      needConsultation: true,
      needProduct: true,
      completedDiagnostic: true,
      pageViews: 1000,
      casesViewed: 1000,
      returned: true,
      downloaded: true,
    });
    expect(r.breakdown.fit).toBeLessThanOrEqual(40);
    expect(r.breakdown.intent).toBeLessThanOrEqual(35);
    expect(r.breakdown.engagement).toBeLessThanOrEqual(25);
    expect(r.score).toBeLessThanOrEqual(100);
  });
});
