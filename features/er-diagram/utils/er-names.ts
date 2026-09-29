/**
 * ER 図の名前 (テーブル名・関係のラベル) の書き方と、列を Mermaid に書けるかの判定。
 * 規則は mermaid@11 の erDiagram の字句規則に合わせている (空白で名前が割れる・キーワードや多重度の語が先に取られる・
 * 列は「型 名前」の 2 語が揃わないと文法の誤り)
 */

/** 囲まずに書ける形。Unicode の文字か _ で始まり、文字・数字・_・- だけ (数字始まりは多重度として割れる) */
const BARE_NAME = new RegExp("^[\\p{L}_][\\p{L}\\p{N}_-]*$", "u");
/**
 * キーワード・多重度の語で始まる名前は囲む (大文字小文字を問わない前方一致)。
 * Mermaid の \b は ASCII 基準なので、end注文 や one-to-one はキーワード + 残りと読まれる。前方一致は tokens なども囲むが、囲めば通るので安全側
 */
const RESERVED_PREFIX =
  /^(?:erdiagram|style|classdef|class|subgraph|end|direction|acctitle|accdescr|many|one|to)/i;
/** u- / u. は「親」の多重度の記号 (u) として取られる */
const MD_PARENT_PREFIX = /^u[-.]/i;

const ENTITY_HASH = new RegExp("#(?=[\\p{L}\\p{N}_]+;)", "gu");
/** Mermaid は囲みの中でも `direction` + 空白 + 向き を含む行を向きの行として読む。空白を実体参照にして避ける */
const DIRECTION_RUN = /(direction)(\s+)(?=(?:tb|bt|rl|lr))/gi;

/**
 * テーブル名・関係のラベルを、Mermaid で 1 つの名前として読める形で書く。そのままでは読めない時だけ "…" で囲む。
 * 囲む時の書き換えはこの順: ① #語; の # → #35; ② & → #38; ③ " → #quot; ④ % → #37; ⑤ \ → #92;
 * ⑥ direction + 空白 + 向き の空白 1 字ずつ → #<符号位置>;。① を先にするので、② 以降で入れた #…; は書き換わらない。
 * % と \ は囲みの中でも使えない
 */
export function quoteErName(name: string): string {
  if (BARE_NAME.test(name) && !RESERVED_PREFIX.test(name) && !MD_PARENT_PREFIX.test(name))
    return name;
  const escaped = name
    .replace(ENTITY_HASH, "#35;")
    .replace(/&/g, "#38;")
    .replace(/"/g, "#quot;")
    .replace(/%/g, "#37;")
    .replace(/\\/g, "#92;")
    .replace(
      DIRECTION_RUN,
      (_m, word: string, space: string) =>
        word + Array.from(space, (c) => `#${c.codePointAt(0)};`).join("")
    );
  return `"${escaped}"`;
}

/**
 * 列名・型に書ける形 (Mermaid の列の字句規則)。UTF-16 の符号単位で見る (u フラグなし) ので、
 * U+10000 以上の文字 (絵文字など) も U+00C0〜U+FFFF の範囲に入る。U+0080〜U+00BF (° · ¥) は受け付けられない
 */
const COLUMN_WORD = /^[A-Za-z_*À-￿][A-Za-z0-9_\-*.,()[\]À-￿]*$/;
/** 型だけは ~ を 2 つ含む総称型 (List~int~) も書ける */
const GENERIC_TYPE =
  /^[A-Za-z_*À-￿][A-Za-z0-9_\-*.,()[\]À-￿]*~[A-Za-z0-9_\-*.,()[\]À-￿]+~[A-Za-z0-9_\-*.,()[\]À-￿]*$/;
/** PK / FK / UK の後が語の文字でない形はキーとして先に取られる (pk・PK-x は書けない、pk_id は書ける) */
const KEY_PREFIX = /^(?:pk|fk|uk)(?![A-Za-z0-9_])/i;

/**
 * 列を Mermaid に書けない理由。書ける時は null。
 * - empty: 名前も型も空 (「カラム追加」の直後)
 * - empty-name / empty-type: 片方だけ空
 * - bad-name / bad-type: 書けない文字・形 (空白・記号・数字始まり・PK 等)
 */
export type ColumnIssue = "empty" | "empty-name" | "empty-type" | "bad-name" | "bad-type";

export function columnIssue(column: { name: string; type: string }): ColumnIssue | null {
  const noName = column.name.trim() === "";
  const noType = column.type.trim() === "";
  if (noName && noType) return "empty";
  if (noName) return "empty-name";
  if (noType) return "empty-type";
  if (!COLUMN_WORD.test(column.name) || KEY_PREFIX.test(column.name)) return "bad-name";
  if (
    !(COLUMN_WORD.test(column.type) || GENERIC_TYPE.test(column.type)) ||
    KEY_PREFIX.test(column.type)
  )
    return "bad-type";
  return null;
}
