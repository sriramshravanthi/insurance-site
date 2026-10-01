# Project: U.S. car and home insurance education and comparison website

## What we are building
An education-first website that helps U.S. consumers understand, compare and possibly reduce the cost of car and home insurance. The full vision is in `docs/master_context.md`. Read it first.

## Rules that never change
1. **Education first.** No fake quotes. No "best company" labels. Never present an estimate as an actual insurer quote.
2. **Only publish verified rules.** A rule may appear on the site only if its `verification_status` is `Primary source` and `effective_to` is empty (view: `v_publishable_facts`). Anything else stays in the backlog and is never shown as fact.
3. **Every rule shows its source link and a "last verified" date.**
4. **Neutral wording.** Use "Below a legal minimum", "Likely gap", "Worth checking", "For your information". Say "potential premium difference", never "you will save".
5. **Phase 1 collects no personal data.** No lead forms, no accounts, no uploads, no tracking of what users type. Referrals and quotes wait for legal review.
6. **Always show the disclaimer:** educational information, not insurance advice, not a quote, not a coverage decision.
7. Mobile-friendly, accessible (keyboard use, labels, contrast), fast, simple design.
8. Do not invent insurance rules. If a fact is not in the database, say "not yet verified" or leave it out.

## Data you have (in `data/`)
- `Insurance_Reference_Data_v5.xlsx`: the research workbook (source of truth). Start with the README tab.
- `insurance_rules.db`: SQLite database generated from the workbook. Read from it.
- `insurance_rules_schema.sql`: the database structure.
- `insurance_rules_db_design.md`: how the database is organized and example queries.
- `coverage_gap_checker.html`: a working first tool (car: CA, TX, FL, NY; home: CA, TX, FL). Its logic is in one script and currently carries its own copy of the rules.

## Coverage today
Verified from primary sources: California auto and home; Texas, Florida, New York, Illinois, Pennsylvania, Georgia and North Carolina auto; Texas, Florida, New York, Illinois, Pennsylvania, Georgia and North Carolina home (Florida home is thin). All other states are not yet researched. Do not create pages that imply otherwise. Pages for unresearched states should say "coming soon".

## Open items (do not publish as fact)
See view `v_open_conflicts` and `v_facts_needing_work` in the database. Examples: home credit-use rules in California, Citizens flood phase-in details in Florida, TWIA dwelling limit in Texas.

## Working style
- Before writing code, summarize the plan and wait for approval on big choices (framework, hosting).
- Keep changes small and explain what you did in plain language.
- Never delete files in `data/`. If the database needs regenerating, tell me first.
- Add simple tests for anything that computes numbers or reads rules.
