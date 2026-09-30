import fs from "node:fs";
import path from "node:path";

// Resolved against the project root (process.cwd()), not import.meta.url —
// Astro/Vite relocate this module into dist/.prerender/chunks during build,
// which would break a path resolved relative to the module's own location.
const RULES_DIR = path.resolve(process.cwd(), "src", "data", "rules");

export function loadRulesIndex() {
  const raw = fs.readFileSync(path.join(RULES_DIR, "_index.json"), "utf-8");
  return JSON.parse(raw);
}

export function loadStateFacts(stateCode, line) {
  const fileName = `${stateCode.toLowerCase()}-${line}.json`;
  const filePath = path.join(RULES_DIR, fileName);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export function groupFactsByTopic(facts) {
  const byTopic = new Map();
  for (const fact of facts) {
    if (!byTopic.has(fact.topic)) byTopic.set(fact.topic, []);
    byTopic.get(fact.topic).push(fact);
  }
  return [...byTopic.entries()].map(([topic, items]) => ({ topic, items }));
}
