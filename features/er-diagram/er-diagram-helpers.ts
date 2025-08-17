import type { Node, Edge } from "@xyflow/react";
import type { ERTableNodeProps } from "./er-table-node";

export function calculateNodePosition(
  mousePosition: { x: number; y: number },
  nodeWidth: number,
  nodeHeight: number
): { x: number; y: number } {
  return {
    x: mousePosition.x - nodeWidth / 2 + 90,
    y: mousePosition.y - nodeHeight / 2,
  };
}

export function createNewERTableNode(
  nodeId: number,
  position: { x: number; y: number },
  handlers: Pick<ERTableNodeProps, "onNameChange" | "onColumnsChange">
): Node<ERTableNodeProps> {
  return {
    id: nodeId.toString(),
    type: "erTable",
    position,
    data: {
      name: `テーブル${nodeId}`,
      columns: [{ name: "id", type: "int", pk: true, nn: true, defaultValue: "auto_increment" }],
      ...handlers,
    },
  };
}

export function createNewEREdge(
  sourceNodeId: string,
  targetNodeId: string,
  handleType?: string
): Edge {
  // flow-editorと同じくhandleTypeでsource/targetを切り替え
  return {
    id: `${sourceNodeId}-${targetNodeId}`,
    source: handleType === "source" ? sourceNodeId : targetNodeId,
    target: handleType === "source" ? targetNodeId : sourceNodeId,
    type: "default",
    data: {},
  };
}

export function parseConnectingNodeId(connectingNodeId: string): {
  sourceNodeId: string;
  handleType: string;
} {
  const [sourceNodeId, handleType] = connectingNodeId.split("-");
  return { sourceNodeId, handleType };
}
