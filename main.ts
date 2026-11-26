// One Star, Written in Sap — make.fun entry
// Writes one one-line 1-star review, in the voice of a houseplant, to entry.txt.
// Deterministic: stdlib only, no network, no randomness, no timestamps.
// The gate (RULES.txt): entry.txt must be UTF-8 text of 1 to 279 characters,
// not only white space. This program enforces that gate itself and refuses
// to write an invalid line.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_CHARS = 279;

const LINE =
  "One star. He misted me once, posted about it, and now calls himself a plant dad. I have not been watered since. The post got 12 likes. Twelve.";

function main(): void {
  // Gate: 1 to 279 characters, not only white space.
  if (LINE.length < 1 || LINE.length > MAX_CHARS) {
    throw new Error(
      `entry line is ${LINE.length} characters, outside the 1-${MAX_CHARS} gate`,
    );
  }
  if (LINE.trim().length === 0) {
    throw new Error("entry line is only white space");
  }
  if (LINE.includes("\n") || LINE.includes("\r")) {
    throw new Error("entry line must be a single line");
  }

  // Resolve the output directory from the environment; default /output.
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, LINE, "utf8");

  // Self-check: read back what was written and confirm it is byte-identical
  // to the gated line, so a bad write can never silently pass the gate.
  const written = readFileSync(outPath, "utf8");
  if (written !== LINE) {
    throw new Error("entry.txt does not match the gated line after writing");
  }
}

// Resolve sources from this file's own directory, never process.cwd().
const HERE = dirname(fileURLToPath(import.meta.url));
void HERE;

main();
