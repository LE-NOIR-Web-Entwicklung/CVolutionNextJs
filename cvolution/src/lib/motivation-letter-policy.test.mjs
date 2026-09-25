import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("./motivation-letter-policy.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText;
const exports = {};
vm.runInNewContext(compiled, { exports, module: { exports } });
const { checkMotivationLetter } = exports;

const word = "Wort";

function assertValid(letter) {
  const result = checkMotivationLetter(letter);
  assert.equal(result.valid, true);
  assert.equal(result.reason, null);
}

test("accepts a letter at exactly 300 words and rejects 301 words", () => {
  assertValid(Array(300).fill(word).join(" "));
  assert.equal(checkMotivationLetter(Array(301).fill(word).join(" ")).valid, false);
});

test("accepts three bullets and rejects a fourth", () => {
  const threeBullets = "- Eins\n- Zwei\n- Drei";
  assertValid(threeBullets);
  assert.equal(checkMotivationLetter(`${threeBullets}\n- Vier`).valid, false);
});

test("accepts bullet limits at 22 words and 140 characters, rejects either overage", () => {
  const maxWords = `- ${Array(22).fill(word).join(" ")}`;
  assertValid(maxWords);
  assert.equal(checkMotivationLetter(`${maxWords} ${word}`).valid, false);

  const maxCharacters = `- ${"x".repeat(138)}`;
  assert.equal(maxCharacters.length, 140);
  assertValid(maxCharacters);
  assert.equal(checkMotivationLetter(`${maxCharacters}x`).valid, false);
});

test("accepts exactly 48 estimated wrapped lines and rejects 49", () => {
  assertValid(Array(48).fill(word).join("\n"));
  assert.equal(checkMotivationLetter(Array(49).fill(word).join("\n")).valid, false);
});

test("rejects empty output", () => {
  assert.equal(checkMotivationLetter(" \n ").valid, false);
});
