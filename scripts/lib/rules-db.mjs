import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The workbook and generated database live in DATA/ — the single source of
// truth. This module only ever reads from it (readOnly: true) and only ever
// reads through v_publishable_facts, never the raw rule_fact table, so an
// unverified or expired rule can never reach the export step.
export const DB_PATH = path.resolve(__dirname, "..", "..", "DATA", "insurance_rules.db");

export const LINES = ["auto", "home"];

export function openRulesDb() {
  return new DatabaseSync(DB_PATH, { readOnly: true });
}

export function getStates(db) {
  return db
    .prepare(`SELECT code, name FROM jurisdiction WHERE level = 'state' ORDER BY name`)
    .all();
}

export function getPublishableFacts(db, jurisdictionCode, line) {
  return db
    .prepare(
      `SELECT f.fact_id AS factId,
              f.jurisdiction_code AS jurisdictionCode,
              f.line AS line,
              f.topic AS topic,
              f.fact AS fact,
              f.value AS value,
              f.legal_citation AS legalCitation,
              f.last_updated AS lastVerified,
              s.name AS sourceName,
              s.url AS sourceUrl
         FROM v_publishable_facts f
         JOIN source s ON s.source_id = f.source_id
        WHERE f.jurisdiction_code = ? AND f.line = ?
        ORDER BY f.topic, f.fact_id`
    )
    .all(jurisdictionCode, line);
}

// Used only by the guard test, to double check every exported fact against
// the raw table — independent of whatever SQL the export step used.
export function getRawFactById(db, factId) {
  return db
    .prepare(
      `SELECT fact_id AS factId, verification_status AS verificationStatus, effective_to AS effectiveTo
         FROM rule_fact WHERE fact_id = ?`
    )
    .get(factId);
}

export function getAllPublishableFactIds(db, jurisdictionCode, line) {
  return db
    .prepare(
      `SELECT fact_id AS factId FROM v_publishable_facts WHERE jurisdiction_code = ? AND line = ?`
    )
    .all(jurisdictionCode, line)
    .map((row) => row.factId);
}

// States the Coverage Gap Checker's auto form currently supports. This is a
// UI-scope decision (the <select> only offers these four), not a fact — it
// does not affect which facts get published.
export const AUTO_CHECKER_STATES = ["CA", "TX", "FL", "NY"];

// min_limit has no v_publishable_facts-style view of its own, so the same
// "Primary source and not superseded" filter from rule 2 is applied here by
// hand.
export function getMinLimit(db, jurisdictionCode) {
  return db
    .prepare(
      `SELECT m.limit_id AS limitId,
              m.jurisdiction_code AS jurisdictionCode,
              m.bi_per_person_k AS biPerPersonK,
              m.bi_per_accident_k AS biPerAccidentK,
              m.pd_k AS pdK,
              m.last_updated AS lastVerified,
              s.name AS sourceName,
              s.url AS sourceUrl
         FROM min_limit m
         JOIN source s ON s.source_id = m.source_id
        WHERE m.jurisdiction_code = ?
          AND m.verification_status = 'Primary source'
          AND m.effective_to IS NULL`
    )
    .get(jurisdictionCode);
}

// Used only by the guard test, independent of the export step's own SQL.
export function getRawMinLimitById(db, limitId) {
  return db
    .prepare(
      `SELECT limit_id AS limitId,
              verification_status AS verificationStatus,
              effective_to AS effectiveTo,
              bi_per_person_k AS biPerPersonK,
              bi_per_accident_k AS biPerAccidentK,
              pd_k AS pdK
         FROM min_limit WHERE limit_id = ?`
    )
    .get(limitId);
}
