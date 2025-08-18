import { describe, test, expect } from "vitest";
import { UI_CONSTANTS, ARROW_TYPES, SHAPE_OPTIONS } from "../../../features/flowchart/types/types";

describe("UI_CONSTANTS", () => {
  test("定数値が正しく定義されている", () => {
    expect(UI_CONSTANTS.DOUBLE_CLICK_THRESHOLD).toBe(300);
    expect(UI_CONSTANTS.DEBOUNCE_DELAY).toBe(150);
    expect(UI_CONSTANTS.IME_COMPOSITION_DELAY).toBe(100);
  });

  test("定数が数値型である", () => {
    expect(typeof UI_CONSTANTS.DOUBLE_CLICK_THRESHOLD).toBe("number");
    expect(typeof UI_CONSTANTS.DEBOUNCE_DELAY).toBe("number");
    expect(typeof UI_CONSTANTS.IME_COMPOSITION_DELAY).toBe("number");
  });

  test("定数が正の値である", () => {
    expect(UI_CONSTANTS.DOUBLE_CLICK_THRESHOLD).toBeGreaterThan(0);
    expect(UI_CONSTANTS.DEBOUNCE_DELAY).toBeGreaterThan(0);
    expect(UI_CONSTANTS.IME_COMPOSITION_DELAY).toBeGreaterThan(0);
  });
});

describe("ARROW_TYPES", () => {
  test("全ての矢印タイプが含まれている", () => {
    expect(ARROW_TYPES).toHaveLength(6);
    expect(ARROW_TYPES).toContain("arrow");
    expect(ARROW_TYPES).toContain("thick");
    expect(ARROW_TYPES).toContain("dotted");
    expect(ARROW_TYPES).toContain("invisible");
    expect(ARROW_TYPES).toContain("bidirectional");
    expect(ARROW_TYPES).toContain("bidirectional-thick");
  });

  test("配列の順序が正しい", () => {
    expect(ARROW_TYPES[0]).toBe("arrow");
    expect(ARROW_TYPES[1]).toBe("thick");
    expect(ARROW_TYPES[2]).toBe("dotted");
    expect(ARROW_TYPES[3]).toBe("invisible");
    expect(ARROW_TYPES[4]).toBe("bidirectional");
    expect(ARROW_TYPES[5]).toBe("bidirectional-thick");
  });

  test("読み取り専用配列である", () => {
    // TypeScriptの型チェックが働いているか確認
    // この行は型エラーになるべき（コンパイル時）
    // ARROW_TYPES.push("test"); // この行をアンコメントすると型エラー
    expect(Array.isArray(ARROW_TYPES)).toBe(true);
  });
});

describe("SHAPE_OPTIONS", () => {
  test("全ての形状オプションが含まれている", () => {
    expect(SHAPE_OPTIONS).toHaveLength(6);

    const types = SHAPE_OPTIONS.map((option) => option.type);
    expect(types).toContain("rectangle");
    expect(types).toContain("diamond");
    expect(types).toContain("rounded");
    expect(types).toContain("circle");
    expect(types).toContain("hexagon");
    expect(types).toContain("stadium");
  });

  test("各形状オプションが正しい構造を持つ", () => {
    SHAPE_OPTIONS.forEach((option) => {
      expect(option).toHaveProperty("type");
      expect(option).toHaveProperty("label");
      expect(option).toHaveProperty("symbol");

      expect(typeof option.type).toBe("string");
      expect(typeof option.label).toBe("string");
      expect(typeof option.symbol).toBe("string");

      expect(option.label.length).toBeGreaterThan(0);
      expect(option.symbol.length).toBeGreaterThan(0);
    });
  });

  test("日本語ラベルが正しく設定されている", () => {
    const rectangleOption = SHAPE_OPTIONS.find((opt) => opt.type === "rectangle");
    expect(rectangleOption?.label).toBe("四角形");

    const diamondOption = SHAPE_OPTIONS.find((opt) => opt.type === "diamond");
    expect(diamondOption?.label).toBe("菱形");

    const roundedOption = SHAPE_OPTIONS.find((opt) => opt.type === "rounded");
    expect(roundedOption?.label).toBe("角丸四角");

    const circleOption = SHAPE_OPTIONS.find((opt) => opt.type === "circle");
    expect(circleOption?.label).toBe("円形");

    const hexagonOption = SHAPE_OPTIONS.find((opt) => opt.type === "hexagon");
    expect(hexagonOption?.label).toBe("六角形");

    const stadiumOption = SHAPE_OPTIONS.find((opt) => opt.type === "stadium");
    expect(stadiumOption?.label).toBe("スタジアム");
  });

  test("Mermaidシンボルが正しく設定されている", () => {
    const rectangleOption = SHAPE_OPTIONS.find((opt) => opt.type === "rectangle");
    expect(rectangleOption?.symbol).toBe("[ ]");

    const diamondOption = SHAPE_OPTIONS.find((opt) => opt.type === "diamond");
    expect(diamondOption?.symbol).toBe("{ }");

    const roundedOption = SHAPE_OPTIONS.find((opt) => opt.type === "rounded");
    expect(roundedOption?.symbol).toBe("( )");

    const circleOption = SHAPE_OPTIONS.find((opt) => opt.type === "circle");
    expect(circleOption?.symbol).toBe("(( ))");

    const hexagonOption = SHAPE_OPTIONS.find((opt) => opt.type === "hexagon");
    expect(hexagonOption?.symbol).toBe("{{ }}");

    const stadiumOption = SHAPE_OPTIONS.find((opt) => opt.type === "stadium");
    expect(stadiumOption?.symbol).toBe("([ ])");
  });

  test("シンボルの一意性を確認", () => {
    const symbols = SHAPE_OPTIONS.map((option) => option.symbol);
    const uniqueSymbols = Array.from(new Set(symbols));
    expect(symbols.length).toBe(uniqueSymbols.length);
  });
});
