import { describe, test, expect } from "vitest";
import type { MermaidShapeType } from "../../../components/types/types";
import { formatMermaidShape } from "../../../utils/mermaid";

describe("formatMermaidShape", () => {
  describe("図形タイプ別の正確な出力", () => {
    test("rectangle: 角括弧", () => {
      expect(formatMermaidShape("rectangle", "テスト")).toBe("[テスト]");
      expect(formatMermaidShape("rectangle", "Test Node")).toBe("[Test Node]");
    });

    test("diamond: 波括弧", () => {
      expect(formatMermaidShape("diamond", "判定")).toBe("{判定}");
      expect(formatMermaidShape("diamond", "Decision")).toBe("{Decision}");
    });

    test("circle: 二重丸括弧", () => {
      expect(formatMermaidShape("circle", "開始")).toBe("((開始))");
      expect(formatMermaidShape("circle", "Start")).toBe("((Start))");
    });

    test("hexagon: 二重波括弧", () => {
      expect(formatMermaidShape("hexagon", "準備")).toBe("{{準備}}");
      expect(formatMermaidShape("hexagon", "Prepare")).toBe("{{Prepare}}");
    });

    test("stadium: 丸角括弧", () => {
      expect(formatMermaidShape("stadium", "終了")).toBe("([終了])");
      expect(formatMermaidShape("stadium", "End")).toBe("([End])");
    });

    test("rounded: 丸括弧", () => {
      expect(formatMermaidShape("rounded", "プロセス")).toBe("(プロセス)");
      expect(formatMermaidShape("rounded", "Process")).toBe("(Process)");
    });
  });

  describe("不正な図形タイプ", () => {
    test("未定義の図形タイプはrectangleとして扱う", () => {
      expect(formatMermaidShape("unknown" as unknown as MermaidShapeType, "テスト")).toBe(
        "[テスト]"
      );
      expect(formatMermaidShape("invalid" as unknown as MermaidShapeType, "Test")).toBe("[Test]");
      expect(formatMermaidShape("" as unknown as MermaidShapeType, "Empty")).toBe("[Empty]");
    });
  });

  describe("特殊文字を含むラベル", () => {
    test("日本語ラベルは正常に処理される", () => {
      expect(formatMermaidShape("rectangle", "データベース処理")).toBe("[データベース処理]");
      expect(formatMermaidShape("diamond", "ユーザー入力？")).toBe("{ユーザー入力？}");
    });

    test("記号を含むラベルも正常に処理される", () => {
      expect(formatMermaidShape("rectangle", "API/データ取得")).toBe("[API/データ取得]");
      expect(formatMermaidShape("circle", "Start (v1.0)")).toBe("((Start (v1.0)))");
    });
  });
});
