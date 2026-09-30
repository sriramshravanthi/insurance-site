# Prompts to give Claude Code, in this order

Do one at a time. Wait for each to finish and check the result before the next.

## Before you start (5 minutes)
1. Make a folder, for example `insurance-site`.
2. Inside it create two folders: `data` and `docs`.
3. Put `CLAUDE.md` in the main folder.
4. Put these five files in `data`: Insurance_Reference_Data_v5.xlsx, insurance_rules.db, insurance_rules_schema.sql, insurance_rules_db_design.md, coverage_gap_checker.html.
5. Save your original "Master Context" document as `docs/master_context.md`.
6. Open a terminal in the folder and start Claude Code (the command is `claude`).

## Prompt 1: Understand the project (no code yet)
Read CLAUDE.md, docs/master_context.md and data/insurance_rules_db_design.md. Look inside data/insurance_rules.db and the workbook README tab. Then explain back to me in plain language what we are building, what data we have, and what is missing. Propose a simple technology stack and a build plan in phases. Do not write any code yet.

## Prompt 2: Set up the site skeleton
Using the plan we agreed, create the project skeleton with the navigation from the master context: Home, Auto Insurance, Home Insurance, Compare, Savings, Learn, Insurance Companies, Tools, About. Pages we do not have content for should say "Coming soon". Use a clean, trustworthy, mobile-friendly design. No forms that collect personal data.

## Prompt 3: Show the verified rules
Build state pages for California, Texas, Florida and New York (auto) and California, Texas and Florida (home). Read the rules from data/insurance_rules.db using only the view v_publishable_facts. For each rule show the topic, the fact, the source link and the "last verified" date. For states we have not researched, show "Coming soon". Add a small test that fails if any unverified rule would be shown.

## Prompt 4: Put the Coverage Gap Checker on the Tools page
Move data/coverage_gap_checker.html into the Tools page. Keep it working and keep its wording. Change it so its state minimums and sources come from the database instead of its own copy, and add tests for the calculations. Keep the disclaimer and the source labels.

## Prompt 5: Education pages
Write the learn pages from docs/master_context.md: why prices differ between insurers, what affects premiums, coverage types, discounts, deductibles, and six-month versus annual policies. Use plain language, no guarantees, no "best company" claims. Link facts about specific states to the verified rules only.

## Prompt 6: Trust and compliance pages
Create About, How we make money (say none yet, and explain that any future referral or advertising will be clearly disclosed), Privacy, and Terms pages as drafts. Add the standard disclaimer on every page. Mark all of these clearly as drafts pending review by an insurance lawyer.

## Prompt 7: Quality check
Check the whole site for: keyboard use and screen reader basics, mobile layout, broken links, missing source links, and anywhere an unverified rule might appear. List anything you find and fix the small items.

## Before you go live
- Have an insurance-regulatory lawyer review the disclosures, wording and any referral plans. The workbook has a "Legal Review Checklist" tab you can hand them.
- Check that every rule still matches its source (the "Refresh Schedule" tab lists how often).
- Do not add quote, lead or referral features until the lawyer has cleared them.
