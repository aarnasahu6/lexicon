import test from "node:test";
import assert from "node:assert/strict";
import { offlineResponse, examples } from "../src/services/offline";
import { terms } from "../src/data/terms";
import { ResultSchema, Language } from "../src/data/types";
for (const language of [
  "Hindi / Hinglish",
  "Spanish",
  "English",
] as Language[]) {
  test(`${language}: both core offline flows produce valid explanations`, () => {
    for (const action of ["bridge", "understand"] as const) {
      const r = offlineResponse({
        language,
        action,
        input: examples[action][language],
        stage: "Student",
        field: "Finance",
      });
      assert.ok(ResultSchema.safeParse(r).success);
      assert.ok(r.concepts.length >= 3);
      if (action === "understand")
        assert.match(r.simpleMeaning, /1.5 percentage points/);
    }
  });
  test(`${language}: all 34 learning terms have localized meanings`, () => {
    assert.equal(terms(language).length, 34);
    assert.equal(new Set(terms(language).map((t) => t.term)).size, 34);
    for (const t of terms(language)) {
      assert.ok(t.localizedExplanation.length > 10);
      assert.ok(t.example.length > 10);
    }
  });
}
test("unsupported input does not fabricate a rewrite", () =>
  assert.throws(
    () =>
      offlineResponse({
        language: "English",
        action: "bridge",
        input: "The moon is purple.",
        stage: "Intern",
        field: "Finance",
      }),
    /No matching term/,
  ));
test("invalid explanation is rejected", () =>
  assert.equal(
    ResultSchema.safeParse({ simpleMeaning: "Hello", concepts: [] }).success,
    false,
  ));

test("every everyday scenario works in all three languages", async () => {
  const { scenarios } = await import("../src/services/offline");
  for (const scenario of scenarios)
    for (const language of [
      "Hindi / Hinglish",
      "Spanish",
      "English",
    ] as Language[]) {
      const output = offlineResponse({
        language,
        action: "bridge",
        input: scenario.inputs[language],
        stage: "Student",
        field: "Finance",
      });
      assert.equal(output.responseKind, "scenario");
      assert.equal(output.professionalVersion, scenario.professional);
    }
});
test("glossary lookup does not infer the direction of a business claim", () => {
  const result = offlineResponse({
    language: "English",
    action: "understand",
    input: "Revenue is not declining.",
    stage: "Student",
    field: "Finance",
  });
  assert.equal(result.responseKind, "glossary");
  assert.match(result.whyItMatters, /do not interpret/);
});
test("Spanish terminology can find the English finance concept", () => {
  const result = offlineResponse({
    language: "Spanish",
    action: "understand",
    input: "liquidez",
    stage: "Intern",
    field: "Finance",
  });
  assert.equal(result.concepts[0].term, "Liquidity");
});

test("business reporting abbreviations resolve to the relevant concepts", () => {
  const result = offlineResponse({
    language: "English",
    action: "understand",
    input: "Diluted EPS and share repurchases",
    stage: "Intern",
    field: "General Business",
  });
  assert.equal(result.responseKind, "glossary");
  assert.deepEqual(
    result.concepts.map((t) => t.term),
    ["Earnings per share", "Share buybacks"],
  );
});
test("a long business report lookup stays within result limits", () => {
  const result = offlineResponse({
    language: "English",
    action: "understand",
    input: terms("English")
      .map((t) => t.term)
      .join(" "),
    stage: "Intern",
    field: "General Business",
  });
  assert.equal(result.concepts.length, 8);
  assert.ok(ResultSchema.safeParse(result).success);
});
test("professional scenario wording can be unpacked in Understand", async () => {
  const { scenarios } = await import("../src/services/offline");
  for (const scenario of scenarios) {
    const result = offlineResponse({
      language: "Spanish",
      action: "understand",
      input: scenario.professional,
      stage: "Intern",
      field: "General Business",
    });
    assert.equal(result.simpleMeaning, scenario.simple);
    assert.equal(result.localizedExplanation, scenario.es);
  }
});

test("document punctuation does not hide finance terms", () => {
  const result = offlineResponse({
    language: "English",
    action: "understand",
    input: "Revenue: $100. (Operating expenses): $50; EPS: $2.",
    stage: "Intern",
    field: "General Business",
  });
  assert.deepEqual(
    result.concepts.map((t) => t.term),
    ["Earnings per share", "Revenue", "Operating expenses"],
  );
});
