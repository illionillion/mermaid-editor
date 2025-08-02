import { describe, test, expect } from "vitest";
import { getSafeVariableName, getReservedWords } from "../../../utils/mermaid";

describe("getSafeVariableName", () => {
  describe("予約語の処理", () => {
    test("予約語にnode_プレフィックスを追加する", () => {
      expect(getSafeVariableName("end")).toBe("node_end");
      expect(getSafeVariableName("start")).toBe("node_start");
      expect(getSafeVariableName("if")).toBe("node_if");
      expect(getSafeVariableName("else")).toBe("node_else");
      expect(getSafeVariableName("subgraph")).toBe("node_subgraph");
      expect(getSafeVariableName("class")).toBe("node_class");
      expect(getSafeVariableName("function")).toBe("node_function");
    });

    test("大文字小文字を区別せずに予約語を判定する", () => {
      expect(getSafeVariableName("END")).toBe("node_END");
      expect(getSafeVariableName("Start")).toBe("node_Start");
      expect(getSafeVariableName("IF")).toBe("node_IF");
      expect(getSafeVariableName("ElSe")).toBe("node_ElSe");
    });

    test("予約語でない単語はそのまま保持する", () => {
      expect(getSafeVariableName("node")).toBe("node");
      expect(getSafeVariableName("process")).toBe("process");
      expect(getSafeVariableName("data")).toBe("data");
      expect(getSafeVariableName("user")).toBe("user");
    });
  });

  describe("特殊文字の変換", () => {
    test("スペースをアンダースコアに変換する", () => {
      expect(getSafeVariableName("test variable")).toBe("test_variable");
      expect(getSafeVariableName("my node name")).toBe("my_node_name");
      expect(getSafeVariableName("multiple  spaces")).toBe("multiple_spaces");
    });

    test("タブや改行などの空白文字をアンダースコアに変換する", () => {
      expect(getSafeVariableName("test\tvariable")).toBe("test_variable");
      expect(getSafeVariableName("test\nvariable")).toBe("test_variable");
      expect(getSafeVariableName("test\r\nvariable")).toBe("test_variable");
    });

    test("記号をアンダースコアに変換する（日本語文字は保持）", () => {
      expect(getSafeVariableName("test-variable")).toBe("test_variable");
      expect(getSafeVariableName("test.variable")).toBe("test_variable");
      expect(getSafeVariableName("test@variable")).toBe("test_variable");
      expect(getSafeVariableName("test+variable")).toBe("test_variable");
      expect(getSafeVariableName("test()variable")).toBe("test__variable");
    });
  });

  describe("日本語文字の保持", () => {
    test("日本語のみの場合はそのまま保持する", () => {
      expect(getSafeVariableName("開始")).toBe("開始");
      expect(getSafeVariableName("プロセス")).toBe("プロセス");
      expect(getSafeVariableName("処理ノード")).toBe("処理ノード");
    });

    test("日本語と英数字の組み合わせで、スペースのみ変換する", () => {
      expect(getSafeVariableName("start 開始")).toBe("start_開始");
      expect(getSafeVariableName("プロセス process")).toBe("プロセス_process");
      expect(getSafeVariableName("ノード1")).toBe("ノード1");
    });

    test("ひらがな、カタカナ、漢字すべて保持する", () => {
      expect(getSafeVariableName("ひらがな")).toBe("ひらがな");
      expect(getSafeVariableName("カタカナ")).toBe("カタカナ");
      expect(getSafeVariableName("漢字")).toBe("漢字");
      expect(getSafeVariableName("ひらがなカタカナ漢字")).toBe("ひらがなカタカナ漢字");
    });
  });

  describe("先頭数字の処理", () => {
    test("先頭が数字の場合はアンダースコアを追加する", () => {
      expect(getSafeVariableName("1node")).toBe("_1node");
      expect(getSafeVariableName("123test")).toBe("_123test");
      expect(getSafeVariableName("0start")).toBe("_0start");
    });

    test("先頭が数字でない場合はそのまま保持する", () => {
      expect(getSafeVariableName("node1")).toBe("node1");
      expect(getSafeVariableName("test123")).toBe("test123");
      expect(getSafeVariableName("a1b2c3")).toBe("a1b2c3");
    });
  });

  describe("エッジケース", () => {
    test("空文字の場合はnode_unnamedを返す", () => {
      expect(getSafeVariableName("")).toBe("node_unnamed");
    });

    test("空白のみの場合はnode_unnamedを返す", () => {
      expect(getSafeVariableName("   ")).toBe("node_unnamed");
      expect(getSafeVariableName("\t\n")).toBe("node_unnamed");
    });

    test("undefined/nullの場合はnode_unnamedを返す", () => {
      expect(getSafeVariableName(undefined as unknown as string)).toBe("node_unnamed");
      expect(getSafeVariableName(null as unknown as string)).toBe("node_unnamed");
    });
  });

  describe("複合パターン", () => {
    test("予約語 + 先頭数字の場合", () => {
      expect(getSafeVariableName("1end")).toBe("_1end");
      expect(getSafeVariableName("2start")).toBe("_2start");
    });

    test("予約語 + 特殊文字の場合", () => {
      expect(getSafeVariableName("if test")).toBe("if_test");
      expect(getSafeVariableName("start-node")).toBe("start_node");
    });

    test("日本語 + 予約語の場合", () => {
      expect(getSafeVariableName("開始start")).toBe("開始start");
      expect(getSafeVariableName("if処理")).toBe("if処理");
    });
  });
});

describe("getReservedWords", () => {
  test("予約語セットを取得", () => {
    const reservedWords = getReservedWords();
    expect(reservedWords).toBeInstanceOf(Set);
    expect(reservedWords.has("end")).toBe(true);
    expect(reservedWords.has("start")).toBe(true);
    expect(reservedWords.has("if")).toBe(true);
    expect(reservedWords.has("function")).toBe(true);
    expect(reservedWords.has("nonreserved")).toBe(false);
  });
});
