import { describe, test, expect } from "vitest";
import { getReservedWords } from "@/features/flowchart/hooks/mermaid";

describe("getReservedWords", () => {
  test("予約語のSetを正しく返す", () => {
    const reservedWords = getReservedWords();

    // Setオブジェクトであることを確認
    expect(reservedWords).toBeInstanceOf(Set);

    // 重要な予約語が含まれていることを確認
    expect(reservedWords.has("end")).toBe(true);
    expect(reservedWords.has("start")).toBe(true);
    expect(reservedWords.has("subgraph")).toBe(true);
    expect(reservedWords.has("class")).toBe(true);
    expect(reservedWords.has("classDef")).toBe(true);
    expect(reservedWords.has("click")).toBe(true);
    expect(reservedWords.has("style")).toBe(true);
    expect(reservedWords.has("linkStyle")).toBe(true);
    expect(reservedWords.has("direction")).toBe(true);
    expect(reservedWords.has("flowchart")).toBe(true);
    expect(reservedWords.has("graph")).toBe(true);
    expect(reservedWords.has("if")).toBe(true);
    expect(reservedWords.has("else")).toBe(true);
    expect(reservedWords.has("elseif")).toBe(true);
    expect(reservedWords.has("while")).toBe(true);
    expect(reservedWords.has("for")).toBe(true);
  });

  test("予約語でない単語は含まれていない", () => {
    const reservedWords = getReservedWords();

    // 一般的な単語が含まれていないことを確認
    expect(reservedWords.has("node")).toBe(false);
    expect(reservedWords.has("process")).toBe(false);
    expect(reservedWords.has("data")).toBe(false);
    expect(reservedWords.has("user")).toBe(false);
    expect(reservedWords.has("hello")).toBe(false);
    expect(reservedWords.has("world")).toBe(false);
  });

  test("同じ参照を返すのではなく新しいSetを返す", () => {
    const reservedWords1 = getReservedWords();
    const reservedWords2 = getReservedWords();

    // 内容は同じ
    expect(Array.from(reservedWords1).sort()).toEqual(Array.from(reservedWords2).sort());

    // しかし異なるオブジェクト
    expect(reservedWords1).not.toBe(reservedWords2);

    // 一方を変更しても他方に影響しない
    reservedWords1.add("test");
    expect(reservedWords2.has("test")).toBe(false);
  });

  test("最低限必要な予約語数が含まれている", () => {
    const reservedWords = getReservedWords();

    // 最低でも15個以上の予約語があることを確認
    expect(reservedWords.size).toBeGreaterThanOrEqual(15);
  });
});
