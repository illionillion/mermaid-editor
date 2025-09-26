import type { Node, Edge } from "@xyflow/react";
import type { ERColumn } from "../components/node/er-table-content";
import type { ERTableNodeProps } from "../components/node/er-table-node";
import { ER_CARDINALITY_SYMBOLS } from "../types";

const CARDINALITY_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(ER_CARDINALITY_SYMBOLS).map(([k, v]) => [v, k])
);

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
      // 型名・カラム名・属性
      // 型名として許可する文字: 英字、数字、アンダースコア、丸括弧、カンマ（例: varchar(255), int, decimal(10,2) など）
      // 必要に応じて許可文字を調整してください
      const m = line.match(/^([A-Za-z0-9_(),]+)\s+([A-Za-z0-9_]+)(.*)$/);
      if (!m) return null;
      const [, type, name, attrs] = m;
      const pk = attrs?.includes("PK") || false;
      const uk = attrs?.includes("UK") || false;
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
      while (i < lines.length) {
        const currentLine = lines[i].trim();
        if (currentLine === "}") {
          i++; // } をスキップ
          break;
        }
        if (/^\w+\s*\{/.test(currentLine)) {
          // 次のノード定義が始まった場合（}がない壊れた定義）
          break;
        }
        if (currentLine !== "") {
          colLines.push(lines[i]);
        }
        i++;
      }

      const columns = parseColumns(colLines);
      nodes.push({
        id: name,
        name,
        columns,
      });
      nodeNames.add(name);
      continue;
    }

    // エッジ定義
    // 許可されるカーディナリティ記号パターン例:
    // |o--o|, |o--|, |--|, }o--o{, }o--{, }--{, |--o|, |--o, o--o|, o--o, o--|, |--o, o--, --o, --|, --, etc.
    // Mermaid ER図で使用されるカーディナリティ記号の詳細は ER_CARDINALITY_SYMBOLS を参照
    const edgeMatch = line.match(/^(\w+)\s+([|}o\-{]+)\s+(\w+)\s*:(.*)$/);
    if (edgeMatch) {
      const [, source, symbol, target, label] = edgeMatch;
      const card = CARDINALITY_MAP[symbol.trim()] || "one-to-many";
      edges.push({
        id: `${source}-${target}`,
        type: "erEdge",
        source,
        target,
        // ラベルの先頭・末尾の空白、コロン、二重引用符を削除
        data: { label: label?.replace(/^[\s:"]+|[\s:"]+$/g, "") || "relation", cardinality: card },
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
