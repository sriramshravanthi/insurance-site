import { describe, it, expect } from "vitest";
import {
  autoCheck,
  homeCheck,
  savingsOpportunities,
  money,
  isNum,
  AUTO,
} from "../src/lib/coverageGapChecker.js";

function flagsByLevel(flags, level) {
  return flags.filter((f) => f.level === level);
}

describe("money / isNum", () => {
  it("formats whole dollars with thousands separators", () => {
    expect(money(30000)).toBe("$30,000");
    expect(money(999.6)).toBe("$1,000");
  });
  it("isNum rejects non-finite and non-number values", () => {
    expect(isNum(5)).toBe(true);
    expect(isNum(null)).toBe(false);
    expect(isNum(NaN)).toBe(false);
    expect(isNum("30000")).toBe(false);
  });
});

describe("autoCheck — liability minimums come from the database", () => {
  it("flags California liability below the database minimum (30/60/15)", () => {
    const flags = autoCheck({ state: "CA", bipp: 15000, bipa: 30000, pd: 5000 });
    const below = flagsByLevel(flags, "below");
    expect(below).toHaveLength(1);
    expect(below[0].title).toContain("California minimum");
    expect(below[0].what).toContain("injury per person $15,000 (minimum $30,000)");
  });

  it("does not flag California liability that exactly meets the minimum", () => {
    const flags = autoCheck({ state: "CA", bipp: 30000, bipa: 60000, pd: 15000 });
    expect(flagsByLevel(flags, "below")).toHaveLength(0);
    expect(flagsByLevel(flags, "ok").some((f) => f.title.includes("meet the California minimums"))).toBe(true);
  });

  it("cites the database-sourced source (cadmv) for a California minimum violation, not a hardcoded duplicate", () => {
    const flags = autoCheck({ state: "CA", bipp: 15000, bipa: 30000, pd: 5000 });
    const below = flagsByLevel(flags, "below")[0];
    expect(below.cites).toEqual(AUTO.CA.minSrc);
    expect(AUTO.CA.minSrc).toEqual(["cadmv"]);
  });

  it("flags Texas property damage below the database minimum ($25,000)", () => {
    const flags = autoCheck({ state: "TX", bipp: 30000, bipa: 60000, pd: 20000 });
    const below = flagsByLevel(flags, "below");
    expect(below).toHaveLength(1);
    expect(below[0].what).toContain("property damage $20,000 (minimum $25,000)");
  });

  it("flags New York property damage below the database minimum ($10,000)", () => {
    const flags = autoCheck({ state: "NY", bipp: 25000, bipa: 50000, pd: 5000 });
    expect(flagsByLevel(flags, "below").some((f) => f.what.includes("property damage $5,000 (minimum $10,000)"))).toBe(true);
  });

  it("Florida has no bodily-injury minimum (null in the database) — only checks property damage", () => {
    expect(AUTO.FL.min.bipp).toBeNull();
    expect(AUTO.FL.min.bipa).toBeNull();
    const flags = autoCheck({ state: "FL", pd: 5000 });
    expect(flagsByLevel(flags, "below").some((f) => f.title.includes("Florida's requirement"))).toBe(true);
  });

  it("flags Florida when no bodily injury liability is entered", () => {
    const flags = autoCheck({ state: "FL", pd: 10000 });
    expect(flagsByLevel(flags, "watch").some((f) => f.title === "No bodily injury liability entered")).toBe(true);
  });
});

describe("autoCheck — other coverage checks", () => {
  it("flags assets exceeding the injury liability limit", () => {
    const flags = autoCheck({ state: "CA", bipp: 30000, bipa: 60000, pd: 15000, assets: 500000 });
    expect(flagsByLevel(flags, "watch").some((f) => f.title.includes("lower than the assets"))).toBe(true);
  });

  it("requires uninsured motorist coverage in New York", () => {
    const flags = autoCheck({ state: "NY", um: "no" });
    expect(flagsByLevel(flags, "below").some((f) => f.title.includes("uninsured motorist"))).toBe(true);
  });

  it("flags a financed vehicle missing collision coverage", () => {
    const flags = autoCheck({ state: "TX", financed: "yes", coll: "no", comp: "yes" });
    expect(flagsByLevel(flags, "watch").some((f) => f.title.includes("without collision and comprehensive"))).toBe(true);
  });

  it("flags a collision deductible at least half the vehicle's value", () => {
    const flags = autoCheck({ state: "CA", coll: "yes", vehicleValue: 10000, deductible: 5000 });
    expect(flagsByLevel(flags, "info").some((f) => f.title.includes("at least half"))).toBe(true);
  });
});

describe("homeCheck", () => {
  it("flags a dwelling limit below the rebuild estimate", () => {
    const flags = homeCheck({ state: "CA", dwelling: 600000, rebuild: 800000 });
    const watch = flagsByLevel(flags, "watch").find((f) => f.title.includes("below your estimated rebuild cost"));
    expect(watch).toBeTruthy();
    expect(watch.what).toContain("75%");
  });

  it("does not flag a dwelling limit that meets the rebuild estimate", () => {
    const flags = homeCheck({ state: "CA", dwelling: 800000, rebuild: 800000 });
    expect(flagsByLevel(flags, "watch").some((f) => f.title.includes("below your estimated rebuild cost"))).toBe(false);
  });

  it("flags a high-risk flood zone with no flood insurance as a likely gap", () => {
    const flags = homeCheck({ state: "TX", flood: "no", zone: "yes" });
    expect(flagsByLevel(flags, "gap").some((f) => f.title.includes("high-risk flood zone"))).toBe(true);
  });

  it("flags missing California earthquake coverage", () => {
    const flags = homeCheck({ state: "CA", quake: "no" });
    expect(flagsByLevel(flags, "watch").some((f) => f.title === "No earthquake coverage")).toBe(true);
  });

  it("does not raise the earthquake flag outside California", () => {
    const flags = homeCheck({ state: "TX", quake: "no" });
    expect(flags.some((f) => f.title === "No earthquake coverage")).toBe(false);
  });

  it("flags a coastal Texas home without confirmed wind and hail coverage", () => {
    const flags = homeCheck({ state: "TX", twiaArea: "yes", wind: "no" });
    expect(flagsByLevel(flags, "gap").some((f) => f.title.includes("Coastal Texas home"))).toBe(true);
  });

  it("flags a Florida Citizens policy with a $400k+ dwelling and no flood coverage", () => {
    const flags = homeCheck({ state: "FL", pool: "citizens", dwelling: 450000, flood: "no" });
    expect(flagsByLevel(flags, "gap").some((f) => f.title.includes("$400,000+ dwelling limit"))).toBe(true);
  });
});

describe("savingsOpportunities", () => {
  it("returns null when no premium is entered", () => {
    expect(savingsOpportunities({ state: "CA" }, "auto")).toBeNull();
    expect(savingsOpportunities({ state: "CA", premium: null }, "auto")).toBeNull();
  });

  it("returns null for a zero or negative premium", () => {
    expect(savingsOpportunities({ state: "CA", premium: 0 }, "auto")).toBeNull();
    expect(savingsOpportunities({ state: "CA", premium: -100 }, "auto")).toBeNull();
  });

  it("computes the monthly equivalent from the annual premium", () => {
    const result = savingsOpportunities({ state: "CA", premium: 2400 }, "auto");
    expect(result.currentPremium).toBe(2400);
    expect(result.monthlyEquivalent).toBe(200);
  });

  it("includes every verified California discount, each with a source", () => {
    const result = savingsOpportunities({ state: "CA", premium: 2400 }, "auto");
    const withSource = result.items.filter((i) => i.sourceUrl);
    expect(withSource.length).toBeGreaterThanOrEqual(4); // CA has 4 Primary-source discounts
    for (const item of withSource) {
      expect(item.sourceUrl).toMatch(/^https:\/\//);
      expect(item.text).toContain("Ask whether you're getting");
    }
  });

  it("never mentions a specific dollar savings amount", () => {
    const result = savingsOpportunities({ state: "TX", premium: 1800 }, "auto");
    for (const item of result.items) {
      expect(item.text).not.toMatch(/\$\d/);
    }
  });

  it("always includes the warning against cutting coverage just to save money", () => {
    const result = savingsOpportunities({ state: "CA", premium: 2400 }, "auto");
    expect(result.warning).toMatch(/never reduce coverage/i);
  });

  it("home savings opportunities have no source citations, since no state has verified home discount data", () => {
    const result = savingsOpportunities({ state: "CA", premium: 3000 }, "home");
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items.every((i) => !i.sourceUrl)).toBe(true);
  });
});
