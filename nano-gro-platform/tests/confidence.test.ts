import { describe, it, expect } from "vitest";
import { computeConfidence, deriveSuccessLevel } from "@/lib/confidence";

describe("computeConfidence", () => {
  it("scores a fully-evidenced, lab-verified case near the top", () => {
    const { score, components } = computeConfidence({
      hasControlGroup: true,
      verificationStatus: "LAB_VERIFIED",
      labReportCount: 2,
      hasBeforeAfter: true,
      photoCount: 6,
      resultMetricsPresent: 4,
      multiSeason: true,
    });
    expect(score).toBe(100);
    expect(components.find((c) => c.key === "verification")?.earned).toBe(30);
  });

  it("scores an unverified self-report low", () => {
    const { score } = computeConfidence({
      hasControlGroup: false,
      verificationStatus: "UNVERIFIED",
      labReportCount: 0,
      hasBeforeAfter: false,
      photoCount: 0,
      resultMetricsPresent: 0,
      multiSeason: false,
    });
    expect(score).toBe(0);
  });

  it("never exceeds 100 even with excess media", () => {
    const { score, components } = computeConfidence({
      hasControlGroup: true,
      verificationStatus: "AGRONOMIST_VERIFIED",
      labReportCount: 10,
      hasBeforeAfter: true,
      photoCount: 50,
      resultMetricsPresent: 4,
      multiSeason: true,
    });
    expect(score).toBeLessThanOrEqual(100);
    expect(components.find((c) => c.key === "lab")?.earned).toBe(15);
    expect(components.find((c) => c.key === "media")?.earned).toBe(10);
  });
});

describe("deriveSuccessLevel", () => {
  it("classifies by yield or ROI band", () => {
    expect(deriveSuccessLevel(45, 0)).toBe("EXCEPTIONAL");
    expect(deriveSuccessLevel(0, 400)).toBe("EXCEPTIONAL");
    expect(deriveSuccessLevel(25, 0)).toBe("HIGH");
    expect(deriveSuccessLevel(10, 0)).toBe("MODERATE");
    expect(deriveSuccessLevel(2, 10)).toBe("LOW");
    expect(deriveSuccessLevel(null, null)).toBe("LOW");
  });
});
