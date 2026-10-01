import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import {
  openRulesDb,
  getAllPublishableFactIds,
  getRawFactById,
} from "../scripts/lib/rules-db.mjs";

// This test exists for one reason: CLAUDE.md rule #2 says a rule may appear
// on the site only if verification_status is "Primary source" and
// effective_to is empty. It must fail loudly if that is ever violated —
// whether by a bug in the export script, a hand-edited JSON file, or a
// change to the database that the export step wasn't re-run against.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RULES_DIR = path.resolve(__dirname, "..", "src", "data", "rules");

function readJson(fileName) {
  return JSON.parse(fs.readFileSync(path.join(RULES_DIR, fileName), "utf-8"));
}

function exportedStateLineFiles() {
  return fs
    .readdirSync(RULES_DIR)
    .filter(
      (name) =>
        name.endsWith(".json") &&
        !["_index.json", "auto-min-limits.json", "auto-discounts.json"].includes(name)
    );
}

let db;

beforeAll(() => {
  if (!fs.existsSync(RULES_DIR)) {
    throw new Error(
      `${RULES_DIR} does not exist. Run "npm run data:export" before the tests.`
    );
  }
  db = openRulesDb();
});

afterAll(() => {
  db?.close();
});

describe("published rule facts", () => {
  it("has exported at least one state/line file", () => {
    expect(exportedStateLineFiles().length).toBeGreaterThan(0);
  });

  for (const fileName of exportedStateLineFiles()) {
    describe(fileName, () => {
      it("contains only facts that are still Primary source and not superseded", () => {
        const data = readJson(fileName);
        for (const item of data.facts) {
          const raw = getRawFactById(db, item.factId);
          expect(
            raw,
            `fact_id ${item.factId} referenced in ${fileName} no longer exists in rule_fact`
          ).toBeTruthy();
          expect(
            raw.verificationStatus,
            `fact_id ${item.factId} in ${fileName} is "${raw.verificationStatus}", not "Primary source"`
          ).toBe("Primary source");
          expect(
            raw.effectiveTo,
            `fact_id ${item.factId} in ${fileName} has effective_to set (superseded) and must not be shown`
          ).toBeNull();
        }
      });

      it("every fact has a source link and a last-verified date", () => {
        const data = readJson(fileName);
        for (const item of data.facts) {
          expect(item.sourceUrl, `fact_id ${item.factId} is missing a source URL`).toBeTruthy();
          expect(
            item.lastVerified,
            `fact_id ${item.factId} is missing a last-verified date`
          ).toBeTruthy();
        }
      });

      it("matches v_publishable_facts exactly — nothing extra, nothing missing", () => {
        const data = readJson(fileName);
        const exportedIds = data.facts.map((f) => f.factId).sort((a, b) => a - b);
        const expectedIds = getAllPublishableFactIds(db, data.state.code, data.line).sort(
          (a, b) => a - b
        );
        expect(exportedIds).toEqual(expectedIds);
      });
    });
  }

  it("lists a state as available only when it has at least one publishable fact", () => {
    const index = readJson("_index.json");
    for (const line of ["auto", "home"]) {
      for (const state of index.availability[line]) {
        const ids = getAllPublishableFactIds(db, state.code, line);
        expect(
          ids.length,
          `${state.code} is listed as available for ${line} but has no publishable facts`
        ).toBeGreaterThan(0);
      }
    }
  });
});
