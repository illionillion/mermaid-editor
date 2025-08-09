export type MermaidArrowType =
  | "arrow" // -->
  | "thick" // ==>
  | "dotted" // -.->
  | "invisible" // ~~~
  | "bidirectional" // <-->
  | "bidirectional-thick"; // <==>

export type MermaidShapeType =
  | "rectangle" // [label]
  | "diamond" // {label}
  | "rounded" // (label)
  | "circle" // ((label))
  | "hexagon" // {{label}}
  | "stadium"; // ([label])

export type GraphType = "TD" | "LR" | "RL" | "BT";

// UI定数
export const UI_CONSTANTS = {
  DOUBLE_CLICK_THRESHOLD: 300,
  DEBOUNCE_DELAY: 150,
  IME_COMPOSITION_DELAY: 100,
} as const;

// 矢印タイプの配列（セレクターなどで使用）
export const ARROW_TYPES: readonly MermaidArrowType[] = [
  "arrow",
  "thick",
  "dotted",
  "invisible",
  "bidirectional",
  "bidirectional-thick",
] as const;

// 形状オプション（セレクターで使用）
export const SHAPE_OPTIONS = [
  { type: "rectangle", label: "四角形", symbol: "[ ]" },
  { type: "diamond", label: "菱形", symbol: "{ }" },
  { type: "rounded", label: "角丸四角", symbol: "( )" },
  { type: "circle", label: "円形", symbol: "(( ))" },
  { type: "hexagon", label: "六角形", symbol: "{{ }}" },
  { type: "stadium", label: "スタジアム", symbol: "([ ])" },
] as const;
