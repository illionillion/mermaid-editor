// ER図用のカーディナリティ種別
export type ErCardinality =
  | "one-to-one"
  | "one-to-many"
  | "many-to-one"
  | "many-to-many"
  | "zero-to-one"
  | "one-to-zero"
  | "one-to-many-mandatory";

// Mermaid記法用のカーディナリティ記号
export const ER_CARDINALITY_SYMBOLS: Record<ErCardinality, string> = {
  "one-to-one": "||--||",
  "one-to-many": "||--o{",
  "many-to-one": "}o--||",
  "many-to-many": "}o--o{",
  "zero-to-one": "o|--||",
  "one-to-zero": "||--o|",
  "one-to-many-mandatory": "||--|{",
};

// GUI表示用のカーディナリティラベル
export const ER_CARDINALITY_DISPLAY_LABELS: Record<ErCardinality, string> = {
  "one-to-one": "1...1",
  "one-to-many": "1...*",
  "many-to-one": "*...1",
  "many-to-many": "*...*",
  "zero-to-one": "0...1",
  "one-to-zero": "1...0",
  "one-to-many-mandatory": "1...+",
};
