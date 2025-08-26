import { describe, it, expect } from "vitest";
import { ER_CARDINALITY_SYMBOLS, ER_CARDINALITY_DISPLAY_LABELS, ErCardinality } from "../types";

describe("types/index", () => {
  const all: ErCardinality[] = [
    "one-to-one",
    "one-to-many",
    "many-to-one",
    "many-to-many",
    "zero-to-one",
    "one-to-zero",
  ];

  it.each(all)("ER_CARDINALITY_SYMBOLS: %s に記号が割り当てられている", (type) => {
    expect(typeof ER_CARDINALITY_SYMBOLS[type]).toBe("string");
  });

  it.each(all)("ER_CARDINALITY_DISPLAY_LABELS: %s にラベルが割り当てられている", (type) => {
    expect(typeof ER_CARDINALITY_DISPLAY_LABELS[type]).toBe("string");
  });
});
