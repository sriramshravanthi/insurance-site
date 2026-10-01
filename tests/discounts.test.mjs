import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { openRulesDb, getRawDiscountById, AUTO_CHECKER_STATES } from "../scripts/lib/rules-db.mjs";

// Guards the "Potential Savings Opportunities" discount prompts: every
// discount shown must still be a Primary-source row in the database, not a
// hand-typed duplicate that could drift, and never a Secondary/Conflicting
// discount presented as if it were confirmed.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.resolve(__dirname, "..", "src", "data", "rules", "auto-discounts.json");

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

describe("exported auto discounts", () => {
  it("has an entry for every state the checker's form supports", () => {
    const data = JSON.parse(fs.readFileSync(FILE, "utf-8"));
    for (const code of AUTO_CHECKER_STATES) {
      expect(data.byState[code], `missing discounts export for ${code}`).toBeDefined();
    }
  });

  it("only includes discounts that are still Primary source in the database", () => {
    const data = JSON.parse(fs.readFileSync(FILE, "utf-8"));
    for (const code of AUTO_CHECKER_STATES) {
      for (const item of data.byState[code]) {
        const raw = getRawDiscountById(db, item.discountId);
        expect(raw, `discount_id ${item.discountId} for ${code} not found`).toBeTruthy();
        expect(
          raw.verificationStatus,
          `discount_id ${item.discountId} (${item.name}) is "${raw.verificationStatus}", not Primary source`
        ).toBe("Primary source");
      }
    }
  });

  it("every discount has a name, a source link, and a last-verified date", () => {
    const data = JSON.parse(fs.readFileSync(FILE, "utf-8"));
    for (const code of AUTO_CHECKER_STATES) {
      for (const item of data.byState[code]) {
        expect(item.name).toBeTruthy();
        expect(item.sourceUrl, `${item.name} missing source URL`).toBeTruthy();
        expect(item.lastVerified, `${item.name} missing last-verified date`).toBeTruthy();
      }
    }
  });
});
