import { describe, test, expect } from "vitest";
import { getArrowTypeSymbol } from "@/features/flowchart/hooks/mermaid";
import type { MermaidArrowType } from "@/features/flowchart/types/types";

describe("getArrowTypeSymbol", () => {
  test("各矢印タイプに対応する正しいシンボルを返す", () => {
    expect(getArrowTypeSymbol("arrow")).toBe("→");
    expect(getArrowTypeSymbol("thick")).toBe("⇒");
    expect(getArrowTypeSymbol("dotted")).toBe("⇢");
    expect(getArrowTypeSymbol("invisible")).toBe("～");
    expect(getArrowTypeSymbol("bidirectional")).toBe("↔");
    expect(getArrowTypeSymbol("bidirectional-thick")).toBe("⇔");
  });

  test("未知の矢印タイプに対してデフォルト値を返す", () => {
    // TypeScriptの型チェックを回避してテスト
    const unknownType = "unknown" as MermaidArrowType;
    expect(getArrowTypeSymbol(unknownType)).toBe("→");
  });

  test("すべての矢印タイプがUnicode文字を返す", () => {
    const arrowTypes: MermaidArrowType[] = [
      "arrow",
      "thick",
      "dotted",
      "invisible",
      "bidirectional",
      "bidirectional-thick",
    ];

    arrowTypes.forEach((type) => {
      const symbol = getArrowTypeSymbol(type);
      expect(typeof symbol).toBe("string");
      expect(symbol.length).toBeGreaterThan(0);
      // Unicode文字であることを確認（基本的には非ASCII文字）
      expect(symbol.charCodeAt(0)).toBeGreaterThan(127);
    });
  });

  test("シンボルの一意性を確認", () => {
    const arrowTypes: MermaidArrowType[] = [
      "arrow",
      "thick",
      "dotted",
      "invisible",
      "bidirectional",
      "bidirectional-thick",
    ];

    const symbols = arrowTypes.map((type) => getArrowTypeSymbol(type));
    const uniqueSymbols = Array.from(new Set(symbols));

    // すべてのシンボルが異なることを確認
    expect(symbols.length).toBe(uniqueSymbols.length);
  });
});
