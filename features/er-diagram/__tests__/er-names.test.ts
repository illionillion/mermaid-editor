import { describe, expect, test } from "vitest";
import { columnIssue, quoteErName } from "../utils/er-names";

// ER 図のテーブル名・関係のラベルの書き方と、列を Mermaid に書けるかの判定
describe("quoteErName", () => {
  test.each([
    "ユーザー",
    "テーブル2",
    "注文明細",
    "ー長音",
    "User",
    "user",
    "u",
    "_a",
    "a-b",
    "é",
    "only",
    "relation",
    "行う",
    "zero-to-one",
  ])("%s はそのまま書く", (name) => {
    expect(quoteErName(name)).toBe(name);
  });

  test.each([
    // 空白・記号・数字始まり (Mermaid では割れるか、文法の誤りになる)
    ["注文 明細", '"注文 明細"'],
    ["has many", '"has many"'],
    ["1abc", '"1abc"'],
    ["２番", '"２番"'],
    ["a.b", '"a.b"'],
    ["a(b)", '"a(b)"'],
    // キーワード・多重度の語で始まる (大文字小文字を問わない前方一致)
    ["end", '"end"'],
    ["End", '"End"'],
    ["end注文", '"end注文"'],
    ["style", '"style"'],
    ["classes", '"classes"'],
    ["direction", '"direction"'],
    ["accDescr", '"accDescr"'],
    ["tokens", '"tokens"'],
    ["one-to-one", '"one-to-one"'],
    ["many-to-many", '"many-to-many"'],
    ["u-id", '"u-id"'],
  ])("%s は囲む", (name, expected) => {
    expect(quoteErName(name)).toBe(expected);
  });

  test('囲む時の書き換えの順: #語; の # → & → " → % → \\ → direction + 空白 + 向き の空白', () => {
    expect(quoteErName('a "b"')).toBe('"a #quot;b#quot;"');
    expect(quoteErName("#1;")).toBe('"#35;1;"');
    expect(quoteErName("a#b")).toBe('"a#b"');
    expect(quoteErName("a&amp;b")).toBe('"a#38;amp;b"');
    expect(quoteErName("50%")).toBe('"50#37;"');
    expect(quoteErName("C:\\dir")).toBe('"C:#92;dir"');
    expect(quoteErName("direction LR")).toBe('"direction#32;LR"');
    expect(quoteErName("x Direction  tb y")).toBe('"x Direction#32;#32;tb y"');
    expect(quoteErName("direction\u3000rl")).toBe('"direction#12288;rl"');
    expect(quoteErName("direction up")).toBe('"direction up"');
  });
});

describe("columnIssue", () => {
  test.each([
    ["int", "id"],
    ["varchar(255)", "name"],
    ["decimal(10,2)", "price"],
    ["string[]", "tags"],
    ["整数", "注文日"],
    ["int", "pk_id"],
    ["int", "a-b"],
    ["List~int~", "items"],
  ])("%s %s は書ける", (type, name) => {
    expect(columnIssue({ type, name })).toBeNull();
  });

  test("名前も型も空 (カラム追加の直後) / 片方だけ空", () => {
    expect(columnIssue({ type: "", name: "" })).toBe("empty");
    expect(columnIssue({ type: "int", name: "" })).toBe("empty-name");
    expect(columnIssue({ type: "", name: "id" })).toBe("empty-type");
  });

  test.each(["注 文", "a:b", "a/b", 'a"b', "a#b", "a~b", "1a", "-a", "pk", "PK-x", " id"])(
    "列名 %s は書けない",
    (name) => {
      expect(columnIssue({ type: "int", name })).toBe("bad-name");
    }
  );

  test.each(["varchar 255", "a:b", "pk", "1int", "a~b"])("型 %s は書けない", (type) => {
    expect(columnIssue({ type, name: "x" })).toBe("bad-type");
  });
});
