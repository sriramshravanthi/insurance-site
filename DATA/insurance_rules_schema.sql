PRAGMA foreign_keys = ON;

-- Every fact points to a source. Publisher type tells you how much to trust it.
CREATE TABLE source (
  source_id      INTEGER PRIMARY KEY,
  name           TEXT NOT NULL,
  publisher_type TEXT NOT NULL,      -- regulator, carrier, trade group, marketplace, publisher, vendor blog
  url            TEXT NOT NULL UNIQUE,
  reliability_note TEXT,
  date_accessed  DATE
);

CREATE TABLE jurisdiction (
  code   TEXT PRIMARY KEY,           -- 'CA', 'TX', 'US' (federal), 'MULTI'
  name   TEXT NOT NULL,
  level  TEXT NOT NULL CHECK (level IN ('federal','state','multi'))
);

-- Main fact table for verified state research (auto and home).
-- One row = one checkable statement. Legal changes are versioned with effective dates.
CREATE TABLE rule_fact (
  fact_id             INTEGER PRIMARY KEY,
  jurisdiction_code   TEXT NOT NULL REFERENCES jurisdiction(code),
  line                TEXT NOT NULL CHECK (line IN ('auto','home','flood','earthquake','umbrella','general')),
  topic               TEXT NOT NULL,
  fact                TEXT NOT NULL,
  value               TEXT,
  legal_citation      TEXT,
  source_id           INTEGER NOT NULL REFERENCES source(source_id),
  data_type           TEXT,
  verification_status TEXT NOT NULL CHECK (verification_status IN
                        ('Primary source','Secondary - unverified','Conflicting','Not researched')),
  date_collected      DATE NOT NULL,
  last_updated        DATE NOT NULL,
  effective_from      DATE,          -- fill when a rule has a start date
  effective_to        DATE,          -- fill when superseded
  superseded_by       INTEGER REFERENCES rule_fact(fact_id),
  notes               TEXT
);
CREATE INDEX idx_fact_juris_line ON rule_fact(jurisdiction_code, line);
CREATE INDEX idx_fact_status ON rule_fact(verification_status);

-- Minimum liability limits (numeric so calculators can compare); text-only cases go in limits_note.
CREATE TABLE min_limit (
  limit_id            INTEGER PRIMARY KEY,
  jurisdiction_code   TEXT NOT NULL REFERENCES jurisdiction(code),
  bi_per_person_k     REAL,
  bi_per_accident_k   REAL,
  pd_k                REAL,
  limits_note         TEXT,          -- e.g. 'BI per person: None required'
  fault_system        TEXT,
  pip_medpay          TEXT,
  um_uim              TEXT,
  change_note         TEXT,
  source_id           INTEGER REFERENCES source(source_id),
  verification_status TEXT NOT NULL,
  effective_from      DATE,
  effective_to        DATE,
  last_updated        DATE,
  notes               TEXT
);
CREATE INDEX idx_minlimit_juris ON min_limit(jurisdiction_code);

CREATE TABLE rating_factor_rule (
  rule_id INTEGER PRIMARY KEY, jurisdiction_code TEXT, credit_auto TEXT, credit_home TEXT,
  gender TEXT, age TEXT, other_notes TEXT, source_id INTEGER REFERENCES source(source_id),
  verification_status TEXT NOT NULL, last_updated DATE, notes TEXT
);
CREATE TABLE discount (
  discount_id INTEGER PRIMARY KEY, name TEXT NOT NULL, category TEXT, scope TEXT, jurisdiction_code TEXT,
  availability TEXT, reported_amount TEXT, source_id INTEGER REFERENCES source(source_id),
  verification_status TEXT NOT NULL, last_updated DATE, notes TEXT
);
CREATE TABLE telematics_program (
  program_id INTEGER PRIMARY KEY, carrier TEXT, program TEXT, program_type TEXT, state_availability TEXT,
  max_discount TEXT, enrollment_discount TEXT, surcharge_possible TEXT,
  source_id INTEGER REFERENCES source(source_id), verification_status TEXT NOT NULL,
  last_updated DATE, notes TEXT
);
CREATE TABLE coverage_detail (
  detail_id INTEGER PRIMARY KEY, coverage TEXT, item TEXT, value TEXT, unit_detail TEXT,
  jurisdiction_code TEXT, source_id INTEGER REFERENCES source(source_id),
  verification_status TEXT NOT NULL, last_updated DATE, notes TEXT
);
CREATE TABLE price_benchmark (
  benchmark_id INTEGER PRIMARY KEY, line TEXT, metric TEXT, value_per_year REAL, comparable_group TEXT,
  methodology TEXT, jurisdiction_code TEXT, source_id INTEGER REFERENCES source(source_id),
  verification_status TEXT NOT NULL, last_updated DATE, notes TEXT
);
CREATE TABLE regulatory_item (
  item_id INTEGER PRIMARY KEY, item TEXT, jurisdiction TEXT, status_reported TEXT, why_it_matters TEXT,
  source_id INTEGER REFERENCES source(source_id), verification_status TEXT NOT NULL,
  last_updated DATE, notes TEXT
);
CREATE TABLE conflict (
  conflict_id INTEGER PRIMARY KEY, item TEXT, source_a_says TEXT, source_b_says TEXT,
  what_to_verify TEXT, where_to_verify TEXT, resolved INTEGER NOT NULL DEFAULT 0, resolution TEXT
);
CREATE TABLE legal_question (
  question_id INTEGER PRIMARY KEY, topic TEXT, question TEXT, why_it_matters TEXT,
  priority TEXT, status TEXT
);
CREATE TABLE quote_option (
  option_id INTEGER PRIMARY KEY, option_name TEXT, description TEXT, licensing_implication TEXT,
  data_type_shown TEXT, evidence TEXT, source_id INTEGER REFERENCES source(source_id),
  verification_status TEXT, open_questions TEXT
);
-- Who checks what, and when. next_review_due is computed in the view below.
CREATE TABLE refresh_task (
  task_id INTEGER PRIMARY KEY, data_set TEXT NOT NULL, primary_source_to_check TEXT,
  owner TEXT, review_every_days INTEGER NOT NULL, trigger_events TEXT, last_verified DATE
);

-- Views the website and the maintenance process use.
CREATE VIEW v_publishable_facts AS
  SELECT * FROM rule_fact
  WHERE verification_status = 'Primary source' AND effective_to IS NULL;

CREATE VIEW v_facts_needing_work AS
  SELECT fact_id, jurisdiction_code, line, topic, verification_status, notes
  FROM rule_fact WHERE verification_status <> 'Primary source';

CREATE VIEW v_open_conflicts AS SELECT * FROM conflict WHERE resolved = 0;

CREATE VIEW v_refresh_status AS
  SELECT task_id, data_set, owner, review_every_days, last_verified,
         CASE WHEN last_verified IS NULL THEN NULL
              ELSE date(last_verified, '+' || review_every_days || ' days') END AS next_review_due,
         CASE WHEN last_verified IS NULL THEN 'Never verified'
              WHEN date('now') > date(last_verified, '+' || review_every_days || ' days') THEN 'Overdue'
              ELSE 'OK' END AS status
  FROM refresh_task;
