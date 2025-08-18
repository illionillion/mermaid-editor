import { describe, test, expect } from "vitest";
import { getArrowTypeDisplayName } from "../../../features/flowchart/hooks/mermaid";
import type { MermaidArrowType } from "../../../features/flowchart/types/types";

describe("getArrowTypeDisplayName", () => {
  test("各矢印タイプに対応する正しい表示名を返す", () => {
    expect(getArrowTypeDisplayName("arrow")).toBe("通常の矢印 (->)");
    expect(getArrowTypeDisplayName("thick")).toBe("太い矢印 (==>)");
    expect(getArrowTypeDisplayName("dotted")).toBe("点線矢印 (-.->)");
    expect(getArrowTypeDisplayName("invisible")).toBe("非表示 (~~~)");
    expect(getArrowTypeDisplayName("bidirectional")).toBe("双方向矢印 (<->)");
    expect(getArrowTypeDisplayName("bidirectional-thick")).toBe("太い双方向矢印 (<==>)");
  });

  test("未知の矢印タイプに対してデフォルト値を返す", () => {
    // TypeScriptの型チェックを回避してテスト
    const unknownType = "unknown" as MermaidArrowType;
    expect(getArrowTypeDisplayName(unknownType)).toBe("通常の矢印 (->)");
  });

  test("すべての表示名が適切な形式を持つ", () => {
    const arrowTypes: MermaidArrowType[] = [
      "arrow",
      "thick",
      "dotted",
      "invisible",
      "bidirectional",
      "bidirectional-thick",
    ];

    arrowTypes.forEach((type) => {
      const displayName = getArrowTypeDisplayName(type);
      expect(typeof displayName).toBe("string");
      expect(displayName.length).toBeGreaterThan(0);

      // 表示名に括弧が含まれていることを確認（Mermaid記法の説明）
      expect(displayName).toMatch(/\([^)]+\)/);

      // 日本語が含まれていることを確認
      expect(displayName).toMatch(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/);
    });
  });

  test("表示名の一意性を確認", () => {
    const arrowTypes: MermaidArrowType[] = [
      "arrow",
      "thick",
      "dotted",
      "invisible",
      "bidirectional",
      "bidirectional-thick",
    ];

    const displayNames = arrowTypes.map((type) => getArrowTypeDisplayName(type));
    const uniqueDisplayNames = Array.from(new Set(displayNames));

    // すべての表示名が異なることを確認
    expect(displayNames.length).toBe(uniqueDisplayNames.length);
  });

  test("Mermaid記法の情報が含まれている", () => {
    // 各表示名に適切なMermaid記法が含まれていることを確認
    expect(getArrowTypeDisplayName("arrow")).toContain("->");
    expect(getArrowTypeDisplayName("thick")).toContain("==>");
    expect(getArrowTypeDisplayName("dotted")).toContain("-.->");
    expect(getArrowTypeDisplayName("invisible")).toContain("~~~");
    expect(getArrowTypeDisplayName("bidirectional")).toContain("<->");
    expect(getArrowTypeDisplayName("bidirectional-thick")).toContain("<==>");
  });
});
