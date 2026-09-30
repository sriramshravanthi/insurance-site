import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it, expect } from "vitest";

// Found during the Prompt 7 QA pass: autoCheck()/homeCheck() reference
// citation keys as plain strings (e.g. cites: st.minSrc, or ["cdi401"]),
// so a typo or a renamed SRC key wouldn't be caught by TypeScript or by a
// normal test run — only by actually triggering that exact branch in the
// browser, where it would throw when render() tries to read `SRC[key].url`
// on undefined. This statically cross-checks every reference against SRC.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE = fs.readFileSync(
  path.resolve(__dirname, "..", "src", "lib", "coverageGapChecker.js"),
  "utf-8"
);

function extractSrcKeys() {
  const block = SOURCE.match(/export const SRC = \{([\s\S]*?)\n\};/);
  if (!block) throw new Error("Could not locate the SRC object in coverageGapChecker.js");
  return new Set([...block[1].matchAll(/^\s*([a-zA-Z0-9]+):\s*\{/gm)].map((m) => m[1]));
}

function extractReferencedKeys() {
  // Literal citation arrays passed straight to add(): ["key"], ["a", "b"]
  const bracketed = [...SOURCE.matchAll(/\[([^\]]*)\]/g)]
    .flatMap((m) => [...m[1].matchAll(/["']([a-z0-9]{3,10})["']/g)])
    .map((m) => m[1]);

  // AUTO's guide / minSrc / liabNote fields, referenced indirectly via st.*
  const autoBlock = SOURCE.match(/export const AUTO = \{([\s\S]*?)\n\};/)[1];
  const guideRefs = [...autoBlock.matchAll(/guide:\s*"([a-z0-9]+)"/g)].map((m) => m[1]);
  const liabNoteRefs = [...autoBlock.matchAll(/liabNote:\s*"([a-z0-9]+)"/g)].map((m) => m[1]);

  return new Set([...bracketed, ...guideRefs, ...liabNoteRefs]);
}

describe("coverage gap checker citation keys", () => {
  it("every citation key referenced by autoCheck/homeCheck/AUTO resolves in SRC", () => {
    const srcKeys = extractSrcKeys();
    expect(srcKeys.size).toBeGreaterThan(0);
    const referenced = extractReferencedKeys();
    const missing = [...referenced].filter((k) => !srcKeys.has(k));
    expect(missing, `citation keys referenced but missing from SRC: ${missing.join(", ")}`).toEqual([]);
  });
});
