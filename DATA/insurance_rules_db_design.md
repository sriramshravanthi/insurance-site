# State-rules database: design notes

**Files:** `insurance_rules.db` (SQLite, ready to query) and `insurance_rules_schema.sql` (the same structure as plain SQL, portable to Postgres with minor changes).

The database was generated from `Insurance_Reference_Data_v5.xlsx` on 2026-09-30, with New York home, Illinois auto/home, Pennsylvania auto/home, Georgia auto/home, North Carolina auto/home, and New Jersey auto/home insurance facts added on 2026-10-01. The workbook stays the place where research is done; the database is what the website reads. Regenerate the database after each workbook update so they never disagree.

## The idea in one paragraph
Every rule is stored as one checkable statement with its source, its verification status and its dates. The website may only publish statements marked "Primary source". Anything weaker stays in the database as a to-do, not on the site. This mirrors the site principle "never show an unverified number as fact."

## Tables

| Table | What it holds | Rows now |
|---|---|---|
| `source` | Every source with publisher type (regulator, blog, etc.) and a reliability note | 114 |
| `jurisdiction` | US (federal), 50 states + DC, and a "multiple" bucket | 53 |
| `rule_fact` | Main table: verified state auto and home rules, one statement per row | 300 |
| `min_limit` | Minimum liability limits as numbers so calculators can compare them | 21 |
| `rating_factor_rule` | Credit, gender, age rules by state | 15 |
| `discount` | Discounts and where they are mandated or optional | 31 |
| `telematics_program` | Carrier programs, availability, surcharge risk | 10 |
| `coverage_detail` | Flood, earthquake, umbrella facts | 23 |
| `price_benchmark` | Published average premiums with methodology | 13 |
| `regulatory_item` | Laws and rules to monitor | 14 |
| `conflict` | Where sources disagree, and whether resolved | 20 |
| `legal_question` | Questions for counsel | 20 |
| `quote_option` | Ways to get real quotes | 5 |
| `refresh_task` | Who checks what, how often | 17 |

## Key design choices
- **Verification status is a hard rule, not a label.** It can only be `Primary source`, `Secondary - unverified`, `Conflicting` or `Not researched`.
- **Numbers and text are separate for limits.** `min_limit` stores numbers (Florida's "no bodily injury required" is stored as empty numbers plus a `limits_note`), so a calculator never has to parse text.
- **Laws change on dates.** `rule_fact` and `min_limit` have `effective_from`, `effective_to` and `superseded_by`. When a rule changes (for example, New Jersey's 2026 limits), add a new row and close the old one instead of overwriting, so old policies can still be explained.
- **Four views do the daily work:**
  - `v_publishable_facts`: what the website is allowed to show
  - `v_facts_needing_work`: the research backlog
  - `v_open_conflicts`: unresolved disagreements
  - `v_refresh_status`: overdue or never-verified checks

## Example queries (tested)
```sql
-- What can the site publish for Texas home insurance?
SELECT topic, fact, value, legal_citation
FROM v_publishable_facts WHERE jurisdiction_code = 'TX' AND line = 'home';

-- Minimum liability limits side by side
SELECT jurisdiction_code, bi_per_person_k, bi_per_accident_k, pd_k
FROM min_limit WHERE jurisdiction_code IN ('CA','TX','NY');

-- Research backlog by state
SELECT jurisdiction_code, verification_status, COUNT(*)
FROM rule_fact WHERE verification_status <> 'Primary source' GROUP BY 1, 2;

-- Which checks are overdue?
SELECT data_set, next_review_due, status FROM v_refresh_status WHERE status <> 'OK';

-- How much rests on weak source types?
SELECT s.publisher_type, COUNT(*) FROM rule_fact f JOIN source s USING (source_id) GROUP BY 1;
```

## Current picture
- 283 of 300 facts come from regulator or government sources; 17 come from blogs or news.
- 15 conflicts are still open. 10 refresh tasks have never been verified (all the not-yet-researched states and topics).
- Integrity check and foreign-key check both pass.

## How to maintain it
1. Do research in the workbook, marking status and citing sources.
2. Regenerate the database from the workbook.
3. Before publishing, check `v_publishable_facts` and `v_open_conflicts`.
4. Assign owners in `refresh_task` and re-verify on schedule.

## Not built yet
- User accounts, quotes, or any personal data. Design that separately once counsel has reviewed consent and privacy needs.
- A front-end API. The site reads these tables at build time via a Node export script (`scripts/export-rules.mjs`) rather than querying the database live; the Coverage Gap Checker's state minimums and discount prompts are sourced from that export, not a hand-copied duplicate.
