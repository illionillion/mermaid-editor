// ER図用のカーディナリティ種別
export type ErCardinality =
  | "one-to-one"
  | "one-to-many"
  | "many-to-one"
  | "many-to-many"
  | "zero-to-one";

// Mermaid記法用のカーディナリティ記号
export const ER_CARDINALITY_SYMBOLS: Record<ErCardinality, string> = {
  "one-to-one": "||--||",
  "one-to-many": "||--o{",
  "many-to-one": "}o--||",
  "many-to-many": "}o--o{",
  "zero-to-one": "o|--||",
};
