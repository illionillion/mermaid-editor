import type { Node, Edge } from "@xyflow/react";
import type { ERTableNodeProps } from "@/features/er-diagram/components/node/er-table-node";
import { ER_CARDINALITY_SYMBOLS } from "../types";
import { columnIssue, quoteErName } from "./er-names";

/**
 * ER図ノード・エッジ配列からmermaid ER記法を生成
 */
export function generateERDiagramMermaidCode(
  nodes: Node<ERTableNodeProps>[],
  edges: Edge[]
): string {
  // ノード部
  const nodeDefs = nodes.map((node) => {
    const lines = [
      `  ${quoteErName(node.data.name)} {`,
      // 書きかけ・Mermaid に書けない形の列は書かない (図全体を文法の誤りにしない)
      ...node.data.columns
        .filter((col) => columnIssue(col) === null)
        .map((col) => {
          const attrs = [col.type, col.name];
          if (col.pk) {
            attrs.push("PK");
          } else if (col.uk) {
            attrs.push("UK");
          }
          return `    ${attrs.join(" ")}`;
        }),
      `  }`,
    ];
    return lines.join("\n");
  });

  // エッジ部
  const edgeDefs = edges
    .filter((edge) => edge.type === "erEdge")
    .map((edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      const targetNode = nodes.find((n) => n.id === edge.target);
      if (!sourceNode || !targetNode) return "";
      const label = String(edge.data?.label || "relation");
      const cardinality = edge.data?.cardinality || "one-to-many";
      const symbol =
        ER_CARDINALITY_SYMBOLS[cardinality as keyof typeof ER_CARDINALITY_SYMBOLS] || "||--o{";
      return `  ${quoteErName(sourceNode.data.name)} ${symbol} ${quoteErName(targetNode.data.name)} : ${quoteErName(label)}`;
    });

  return ["erDiagram", ...nodeDefs, ...edgeDefs.filter(Boolean)].join("\n");
}
