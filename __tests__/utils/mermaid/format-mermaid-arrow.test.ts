import { describe, test, expect } from "vitest";
import {
  formatMermaidArrow,
  getArrowTypeSymbol,
  getArrowTypeDisplayName,
} from "@/features/flowchart/hooks/mermaid";
import { MermaidArrowType } from "@/features/flowchart/types/types";

describe("formatMermaidArrow", () => {
  describe("矢印タイプ別の出力", () => {
    test("arrow: 通常の矢印", () => {
      expect(formatMermaidArrow("arrow")).toBe(" --> ");
      expect(formatMermaidArrow("arrow", "")).toBe(" --> ");
    });

    test("thick: 太い矢印", () => {
      expect(formatMermaidArrow("thick")).toBe(" ==> ");
    });

    test("dotted: 点線矢印", () => {
      expect(formatMermaidArrow("dotted")).toBe(" -.-> ");
    });

    test("invisible: 非表示", () => {
      expect(formatMermaidArrow("invisible")).toBe(" ~~~ ");
    });

    test("bidirectional: 双方向矢印", () => {
      expect(formatMermaidArrow("bidirectional")).toBe(" <--> ");
    });

    test("bidirectional-thick: 太い双方向矢印", () => {
      expect(formatMermaidArrow("bidirectional-thick")).toBe(" <==> ");
    });

    test("undefined/デフォルト: arrow扱い", () => {
      expect(formatMermaidArrow(undefined)).toBe(" --> ");
      expect(formatMermaidArrow("" as MermaidArrowType)).toBe(" --> ");
    });
  });

  describe("ラベル付き矢印", () => {
    test("arrow + ラベル", () => {
      expect(formatMermaidArrow("arrow", "はい")).toBe(" -->|はい| ");
      expect(formatMermaidArrow("arrow", "Yes")).toBe(" -->|Yes| ");
    });

    test("thick + ラベル", () => {
      expect(formatMermaidArrow("thick", "重要")).toBe(" ==>|重要| ");
      expect(formatMermaidArrow("thick", "Important")).toBe(" ==>|Important| ");
    });

    test("dotted + ラベル: 特殊記法", () => {
      expect(formatMermaidArrow("dotted", "条件付き")).toBe(" -. 条件付き .-> ");
      expect(formatMermaidArrow("dotted", "Conditional")).toBe(" -. Conditional .-> ");
    });

    test("invisible + ラベル", () => {
      expect(formatMermaidArrow("invisible", "非表示リンク")).toBe(" ~~~|非表示リンク| ");
      expect(formatMermaidArrow("invisible", "Hidden")).toBe(" ~~~|Hidden| ");
    });

    test("bidirectional + ラベル", () => {
      expect(formatMermaidArrow("bidirectional", "双方向")).toBe(" <-->|双方向| ");
      expect(formatMermaidArrow("bidirectional", "Both Ways")).toBe(" <-->|Both Ways| ");
    });

    test("bidirectional-thick + ラベル", () => {
      expect(formatMermaidArrow("bidirectional-thick", "太い双方向")).toBe(" <==太い双方向==> ");
      expect(formatMermaidArrow("bidirectional-thick", "Thick Both")).toBe(" <==Thick Both==> ");
    });
  });

  describe("ラベルのサニタイズ", () => {
    test("空文字・undefined時は適切に処理される", () => {
      expect(formatMermaidArrow("arrow", undefined)).toBe(" --> ");
      expect(formatMermaidArrow("thick", "")).toBe(" ==> ");
      expect(formatMermaidArrow("dotted", "   ")).toBe(" -.-> ");
    });

    test("特殊文字を含むラベル", () => {
      expect(formatMermaidArrow("arrow", "API/データ")).toBe(' -->|"API/データ"| ');
      expect(formatMermaidArrow("thick", "Error (404)")).toBe(' ==>|"Error (404)"| ');
    });
  });
});

describe("getArrowTypeSymbol", () => {
  test("矢印タイプの記号を取得", () => {
    expect(getArrowTypeSymbol("arrow")).toBe("→");
    expect(getArrowTypeSymbol("thick")).toBe("⇒");
    expect(getArrowTypeSymbol("dotted")).toBe("⇢");
    expect(getArrowTypeSymbol("invisible")).toBe("～");
    expect(getArrowTypeSymbol("bidirectional")).toBe("↔");
    expect(getArrowTypeSymbol("bidirectional-thick")).toBe("⇔");
    expect(getArrowTypeSymbol("" as MermaidArrowType)).toBe("→");
  });
});

describe("getArrowTypeDisplayName", () => {
  test("矢印タイプの表示名を取得", () => {
    expect(getArrowTypeDisplayName("arrow")).toBe("通常の矢印 (->)");
    expect(getArrowTypeDisplayName("thick")).toBe("太い矢印 (==>)");
    expect(getArrowTypeDisplayName("dotted")).toBe("点線矢印 (-.->)");
    expect(getArrowTypeDisplayName("invisible")).toBe("非表示 (~~~)");
    expect(getArrowTypeDisplayName("bidirectional")).toBe("双方向矢印 (<->)");
    expect(getArrowTypeDisplayName("bidirectional-thick")).toBe("太い双方向矢印 (<==>)");
    expect(getArrowTypeDisplayName("" as MermaidArrowType)).toBe("通常の矢印 (->)");
  });
});
