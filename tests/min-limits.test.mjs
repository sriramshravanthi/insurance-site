import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { openRulesDb, getRawMinLimitById, AUTO_CHECKER_STATES } from "../scripts/lib/rules-db.mjs";

// Guards the Coverage Gap Checker's state minimums: they must always trace
// back to a Primary-source, non-superseded min_limit row, and the exported
// dollar amounts must be an exact unit conversion of that row — not a
// hand-typed duplicate that could drift from the database.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.resolve(__dirname, "..", "src", "data", "rules", "auto-min-limits.json");

let db;

beforeAll(() => {
  if (!fs.existsSync(FILE)) {
    throw new Error(`${FILE} does not exist. Run "npm run data:export" before the tests.`);
  }
  db = openRulesDb();
});

afterAll(() => {
  db?.close();
});

describe("exported auto minimum liability limits", () => {
  it("covers every state the checker's form supports", () => {
    const data = JSON.parse(fs.readFileSync(FILE, "utf-8"));
    for (const code of AUTO_CHECKER_STATES) {
      expect(data.limits[code], `missing min-limit export for ${code}`).toBeTruthy();
    }
  });

  it("only cites Primary-source, non-superseded rows, with dollar amounts exactly matching the raw *_k columns", () => {
    const data = JSON.parse(fs.readFileSync(FILE, "utf-8"));
    for (const code of AUTO_CHECKER_STATES) {
      const exported = data.limits[code];
      const raw = getRawMinLimitById(db, exported.limitId);
      expect(raw, `limit_id ${exported.limitId} for ${code} not found in min_limit`).toBeTruthy();
      expect(raw.verificationStatus, `${code} min_limit is not Primary source`).toBe("Primary source");
      expect(raw.effectiveTo, `${code} min_limit has effective_to set (superseded)`).toBeNull();

      const expectedBipp = raw.biPerPersonK == null ? null : raw.biPerPersonK * 1000;
      const expectedBipa = raw.biPerAccidentK == null ? null : raw.biPerAccidentK * 1000;
      const expectedPd = raw.pdK == null ? null : raw.pdK * 1000;
      expect(exported.bipp, `${code} bipp mismatch`).toBe(expectedBipp);
      expect(exported.bipa, `${code} bipa mismatch`).toBe(expectedBipa);
      expect(exported.pd, `${code} pd mismatch`).toBe(expectedPd);
    }
  });

  it("every entry has a source link and a last-verified date", () => {
    const data = JSON.parse(fs.readFileSync(FILE, "utf-8"));
    for (const code of AUTO_CHECKER_STATES) {
      expect(data.limits[code].sourceUrl, `${code} missing source URL`).toBeTruthy();
      expect(data.limits[code].lastVerified, `${code} missing last-verified date`).toBeTruthy();
    }
  });
});
