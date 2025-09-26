import type { Node, Edge } from "@xyflow/react";
import type { ERColumn } from "../components/node/er-table-content";
import type { ERTableNodeProps } from "../components/node/er-table-node";
import { ER_CARDINALITY_SYMBOLS } from "../types";

const CARDINALITY_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(ER_CARDINALITY_SYMBOLS).map(([k, v]) => [v, k])
);

function parseColumns(lines: string[]): ERColumn[] {
  return lines
    .map((line) => line.trim())
    .filter((l) => l && !l.startsWith("//"))
    .map((line) => {
      // 型名・カラム名・属性
      const m = line.match(/^([\w\d_(),]+)\s+([\w\d_]+)(.*)$/);
      if (!m) return null;
      const [, type, name, attrs] = m;
      const pk = attrs?.includes("PK") || false;
      const uk = attrs?.includes("UK") || false;
      return { name, type, pk, uk };
    })
    .filter(Boolean) as ERColumn[];
}

export function convertMermaidToERData(mermaid: string): {
  nodes: Node<ERTableNodeProps>[];
  edges: Edge[];
} {
  if (!mermaid.trim().startsWith("erDiagram")) return { nodes: [], edges: [] };

  const lines = mermaid.split("\n").map((l) => l.trimEnd());
  const nodes: Node<ERTableNodeProps>[] = [];
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
        type: "erTable",
        position: { x: 0, y: 0 },
        data: { name, columns, onNameChange: () => {}, onColumnsChange: () => {} },
      });
      nodeNames.add(name);
      continue;
    }

    // エッジ定義
    const edgeMatch = line.match(/^(\w+)\s+([|}o\-{]+)\s+(\w+)\s*:(.*)$/);
    if (edgeMatch) {
      const [, source, symbol, target, label] = edgeMatch;
      const card = CARDINALITY_MAP[symbol.trim()] || "one-to-many";
      edges.push({
        id: `${source}-${target}`,
        type: "erEdge",
        source,
        target,
        data: { label: label?.replace(/^[\s:"]+|[\s:"]+$/g, "") || "relation", cardinality: card },
      });

      // ノード定義がなければダミーノードを追加
      if (!nodeNames.has(source)) {
        nodes.push({
          id: source,
          type: "erTable",
          position: { x: 0, y: 0 },
          data: { name: source, columns: [], onNameChange: () => {}, onColumnsChange: () => {} },
        });
        nodeNames.add(source);
      }
      if (!nodeNames.has(target)) {
        nodes.push({
          id: target,
          type: "erTable",
          position: { x: 0, y: 0 },
          data: { name: target, columns: [], onNameChange: () => {}, onColumnsChange: () => {} },
        });
        nodeNames.add(target);
      }
    }

    i++;
  }
  return { nodes, edges };
}
