import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

test("public README declares the provider-free and non-scientific boundary", async () => {
  const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");
  assert.match(readme, /provider-free/i);
  assert.match(readme, /not an ART-12/i);
  assert.match(readme, /synthetic/i);
});
