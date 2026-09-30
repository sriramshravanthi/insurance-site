import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  openRulesDb,
  getStates,
  getPublishableFacts,
  getMinLimit,
  LINES,
  AUTO_CHECKER_STATES,
} from "./lib/rules-db.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "..", "src", "data", "rules");

function main() {
  const db = openRulesDb();

  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const states = getStates(db);
  const availability = { auto: [], home: [] };

  for (const state of states) {
    for (const line of LINES) {
      const facts = getPublishableFacts(db, state.code, line);
      if (facts.length === 0) continue;

      availability[line].push({ code: state.code, name: state.name });
      const fileName = `${state.code.toLowerCase()}-${line}.json`;
      fs.writeFileSync(
        path.join(OUT_DIR, fileName),
        JSON.stringify({ state, line, generatedAt: new Date().toISOString(), facts }, null, 2) + "\n"
      );
    }
  }

  fs.writeFileSync(
    path.join(OUT_DIR, "_index.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), states, availability }, null, 2) + "\n"
  );

  // Coverage Gap Checker: state minimum liability limits, read straight from
  // min_limit instead of the tool carrying its own copy of these numbers.
  const jurisdictionByCode = Object.fromEntries(states.map((s) => [s.code, s]));
  const autoMinLimits = { generatedAt: new Date().toISOString(), limits: {} };
  for (const code of AUTO_CHECKER_STATES) {
    const row = getMinLimit(db, code);
    if (!row) continue; // not verified (Primary source, not superseded) — omit rather than guess
    autoMinLimits.limits[code] = {
      limitId: row.limitId,
      name: jurisdictionByCode[code]?.name ?? code,
      bipp: row.biPerPersonK == null ? null : row.biPerPersonK * 1000,
      bipa: row.biPerAccidentK == null ? null : row.biPerAccidentK * 1000,
      pd: row.pdK == null ? null : row.pdK * 1000,
      sourceName: row.sourceName,
      sourceUrl: row.sourceUrl,
      lastVerified: row.lastVerified,
    };
  }
  fs.writeFileSync(
    path.join(OUT_DIR, "auto-min-limits.json"),
    JSON.stringify(autoMinLimits, null, 2) + "\n"
  );

  db.close();

  console.log(
    `Exported verified rules — auto: [${availability.auto.map((s) => s.code).join(", ")}], ` +
      `home: [${availability.home.map((s) => s.code).join(", ")}]`
  );
}

main();
