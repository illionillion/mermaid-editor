import type { Node, Edge } from "@xyflow/react";
import type { ERColumn } from "../components/node/er-table-content";
import type { ERTableNodeProps } from "../components/node/er-table-node";
import { ER_CARDINALITY_SYMBOLS } from "../types";

const CARDINALITY_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(ER_CARDINALITY_SYMBOLS).map(([k, v]) => [v, k])
);

// 正規表現パターン定数
// 型名として許可する文字: 英字、数字、アンダースコア、丸括弧（例: varchar(255), int など）
// 注意: カンマを含む型名（decimal(10,2)）は公式Mermaidでサポートされていないため除外
// 複数属性（PK UK）も公式Mermaidでサポートされていないため、単一属性のみ対応
const COLUMN_PATTERN = /^([A-Za-z0-9_()]+)\s+([A-Za-z0-9_]+)\s*(PK|UK)?\s*$/; // [全体マッチ, 型名, カラム名, 属性]
// エッジのカーディナリティ記号として公式でサポートされているもののみ許可
const EDGE_PATTERN =
  /^(\w+)\s+(\|\|--\|\||\|\|--o\{|\}o--\|\||\}o--o\{|o\|--\|\||\|\|--o\|)\s+(\w+)\s*:(.*)$/; // [全体マッチ, source, cardinality, target, label]

/**
 * テーブル名やラベルの正規化処理
 * - 空白: mermaid記法で余分な空白が含まれる場合がある
 * - コロン: ラベル区切り文字として使用されるが、実際のラベルには不要
 * - 二重引用符: mermaid記法でクォートされた文字列の場合に除去
 */
function sanitizeTableName(input: string): string {
  // 先頭または末尾の空白・コロン・二重引用符を除去する正規表現
  // ^[\s:"]+   : 文字列の先頭 (^) から空白 (\s)、コロン (:)、二重引用符 (") のいずれかが1文字以上 (+) 連続する部分をマッチ
  // |          : または
  // [\s:"]+$   : 文字列の末尾 ($) で空白 (\s)、コロン (:)、二重引用符 (") のいずれかが1文字以上 (+) 連続する部分をマッチ
  // gフラグ    : グローバルに全ての該当箇所を対象
  return input.replace(/^[\s:"]+|[\s:"]+$/g, "");
}

/**
 * パースされたERテーブルデータの型定義（純粋なデータのみ、UIハンドラーなし）
 * flowchartのParsedMermaidNodeと同じ設計パターン
 */
export interface ParsedERTableData {
  id: string;
  name: string;
  columns: ERColumn[];
}

/**
 * パースされたMermaidデータの型定義
 */
export interface ParsedMermaidERData {
  nodes: ParsedERTableData[];
  edges: Edge[];
}

function parseColumns(lines: string[]): ERColumn[] {
  return lines
    .map((line) => line.trim())
    .filter((l) => l && !l.startsWith("//"))
    .map((line) => {
      // 型名・カラム名・属性の解析
      // 型名として許可する文字: 英字、数字、アンダースコア、丸括弧（例: varchar(255), int など）
      // 注意: カンマを含む型名（decimal(10,2)）や複数属性（PK UK）は公式Mermaidでサポートされていないため対応しない
      const m = line.match(COLUMN_PATTERN);
      if (!m) return null;
      const [, type, name, attribute] = m;
      const pk = attribute === "PK";
      const uk = attribute === "UK";
      return { name, type, pk, uk };
    })
    .filter(Boolean) as ERColumn[];
}

export function convertMermaidToERData(mermaid: string): ParsedMermaidERData {
  if (!mermaid.trim().startsWith("erDiagram")) return { nodes: [], edges: [] };

  const lines = mermaid.split("\n").map((l) => l.trimEnd());
  const nodes: ParsedERTableData[] = [];
  const nodeNames: Set<string> = new Set();
  const edges: Edge[] = [];

  let i = 0;
  // erDiagramヘッダー行をスキップ
  while (i < lines.length && !/^erDiagram\b/.test(lines[i])) i++;
  if (i < lines.length && /^erDiagram\b/.test(lines[i])) i++;

  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) {
      i++;
      continue;
    }

    // ノード定義
    if (/^\w+\s*\{/.test(line)) {
      const nameMatch = line.match(/^(\w+)\s*\{/);
      if (!nameMatch) {
        i++;
        continue;
      }

      const name = nameMatch[1];
      const colLines: string[] = [];
      i++; // { の次の行に進む

      // カラム定義をすべて収集
      let foundClosingBrace = false;
      while (i < lines.length) {
        const currentLine = lines[i].trim();
        if (currentLine === "}") {
          i++; // } をスキップ
          foundClosingBrace = true;
          break;
        }
        if (/^\w+\s*\{/.test(currentLine)) {
          /**
           * エラー回復シナリオ:
           * 例: "User { id int Post { id int }"
           * 上記のように、ノード定義の閉じ括弧（}）が抜けている場合、
           * 次のノード定義（"Post {"）の開始を検出した時点で現在のノード定義を中断し、回復します。
           * この場合、"User"ノードは無効としてスキップされ、"Post"ノードのパースに進みます。
           * 公式Mermaid仕様に準拠し、閉じ括弧がないノードは無視します。
           * 対応テストケース: "公式Mermaidでエラーになる壊れたノード定義は解析できない"
           */
          break;
        }
        if (currentLine !== "") {
          colLines.push(lines[i]);
        }
        i++;
      }

      // 閉じ括弧が見つかった場合のみノードを追加（公式Mermaid仕様に準拠）
      if (foundClosingBrace) {
        const columns = parseColumns(colLines);
        nodes.push({
          id: name,
          name,
          columns,
        });
        nodeNames.add(name);
      }
      continue;
    }

    // エッジ定義
    // 許可されるカーディナリティ記号パターン例:
    // |o--o|, |o--|, |--|, }o--o{, }o--{, }--{, |--o|, |--o, o--o|, o--o, o--|, |--o, o--, --o, --|, --, etc.
    // Mermaid ER図で使用されるカーディナリティ記号の詳細は ER_CARDINALITY_SYMBOLS を参照
    const edgeMatch = line.match(EDGE_PATTERN);
    if (edgeMatch) {
      const [, source, symbol, target, label] = edgeMatch;
      const card = CARDINALITY_MAP[symbol.trim()] || "one-to-many";
      const cleanLabel = sanitizeTableName(label) || "relation";

      edges.push({
        id: `${source}-${target}`,
        type: "erEdge",
        source,
        target,
        data: { label: cleanLabel, cardinality: card },
      });

      // ノード定義がなければダミーノードを追加
      if (!nodeNames.has(source)) {
        nodes.push({
          id: source,
          name: source,
          columns: [],
        });
        nodeNames.add(source);
      }
      if (!nodeNames.has(target)) {
        nodes.push({
          id: target,
          name: target,
          columns: [],
        });
        nodeNames.add(target);
      }
    }

    i++;
  }
  return { nodes, edges };
}

/**
 * ParsedERTableDataをReactFlowのNode型に変換するヘルパー関数
 * flowchartのhandleImportMermaidと同じ設計パターン
 */
export function convertParsedDataToNodes(
  parsedData: ParsedERTableData[],
  handlers: {
    onNameChange: (nodeId: string, newName: string) => void;
    onColumnsChange: (nodeId: string, newColumns: ERColumn[]) => void;
  }
): Node<ERTableNodeProps>[] {
  return parsedData.map((parsedNode, index) => ({
    id: parsedNode.id,
    type: "erTable",
    position: { x: index * 300, y: 0 }, // 簡単なレイアウト
    data: {
      name: parsedNode.name,
      columns: parsedNode.columns,
      onNameChange: (newName: string) => handlers.onNameChange(parsedNode.id, newName),
      onColumnsChange: (newColumns: ERColumn[]) =>
        handlers.onColumnsChange(parsedNode.id, newColumns),
    },
  }));
}
