import { Edge, Node } from "@xyflow/react";

/**
 * 循環参照エッジを検出する
 */
export function detectCyclicEdges(edges: Edge[]): Map<string, Edge[]> {
  const cyclicGroups = new Map<string, Edge[]>();

  // ノード間の接続をマップ化
  const connections = new Map<string, Set<string>>();

  edges.forEach((edge) => {
    if (!connections.has(edge.source)) {
      connections.set(edge.source, new Set());
    }
    connections.get(edge.source)?.add(edge.target);
  });

  // 循環参照を検出
  edges.forEach((edge) => {
    const { source, target } = edge;
    const reverseExists = connections.get(target)?.has(source);

    if (reverseExists) {
      // 循環参照グループのキーを一意にする（小さい方を先に）
      const groupKey = source < target ? `${source}-${target}` : `${target}-${source}`;

      if (!cyclicGroups.has(groupKey)) {
        cyclicGroups.set(groupKey, []);
      }
      cyclicGroups.get(groupKey)?.push(edge);
    }
  });

  return cyclicGroups;
}

/**
 * エッジのオフセットを計算する（循環参照対応）
 */
export function calculateEdgeOffset(
  edge: Edge,
  allEdges: Edge[],
  offsetDistance: number = 20
): { offsetX: number; offsetY: number } {
  const cyclicGroups = detectCyclicEdges(allEdges);

  // この エッジが循環参照グループに属するかチェック
  for (const [, groupEdges] of Array.from(cyclicGroups.entries())) {
    const edgeInGroup = groupEdges.find((e: Edge) => e.id === edge.id);
    if (edgeInGroup) {
      // グループ内でのエッジのインデックスを取得
      const edgeIndex = groupEdges.indexOf(edgeInGroup);

      // オフセットを計算（上下または左右に分散）
      const offsetMultiplier = edgeIndex % 2 === 0 ? 1 : -1;
      const offsetAmount = Math.floor(edgeIndex / 2 + 1) * offsetDistance * offsetMultiplier;

      // エッジの方向に応じてオフセット方向を決定
      const dx =
        edgeInGroup.target === edgeInGroup.source
          ? 0
          : parseInt(edgeInGroup.target) > parseInt(edgeInGroup.source)
            ? offsetAmount
            : -offsetAmount;
      const dy = offsetAmount;

      return { offsetX: dx, offsetY: dy };
    }
  }

  // 循環参照でない場合はオフセットなし
  return { offsetX: 0, offsetY: 0 };
}

/**
 * エッジラベルの位置を調整する（重複回避）
 */
export const adjustEdgeLabelPosition = (
  currentEdge: { source: string; target: string },
  originalX: number,
  originalY: number,
  allEdges: Edge[],
  _nodes: Node[]
): { adjustedX: number; adjustedY: number } => {
  // currentEdgeをEdge型に変換
  const edgeAsEdge = allEdges.find(
    (e) => e.source === currentEdge.source && e.target === currentEdge.target
  );
  if (!edgeAsEdge) {
    return { adjustedX: originalX, adjustedY: originalY };
  }

  const { offsetX, offsetY } = calculateEdgeOffset(edgeAsEdge, allEdges);

  return {
    adjustedX: originalX + offsetX,
    adjustedY: originalY + offsetY,
  };
};

/**
 * 循環参照エッジのスタイルを取得する
 */
export function getCyclicEdgeStyle(
  currentEdge: { source: string; target: string },
  allEdges: Edge[],
  enableStyling: boolean = false
): React.CSSProperties {
  const cyclicGroups = detectCyclicEdges(allEdges);

  // 循環参照グループに属するかチェック
  for (const [, groupEdges] of Array.from(cyclicGroups.entries())) {
    const isInCyclicGroup = groupEdges.some(
      (edge: Edge) => edge.source === currentEdge.source && edge.target === currentEdge.target
    );

    if (isInCyclicGroup && enableStyling) {
      return {
        stroke: "#ff6b6b",
        strokeOpacity: 0.8,
        strokeWidth: 2,
      };
    }
  }

  return {};
}
