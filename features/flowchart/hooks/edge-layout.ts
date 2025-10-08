import type { Edge, Node } from "@xyflow/react";
import type { CSSProperties } from "react";

/**
 * 循環参照エッジを検出する
 * @description A→BとB→Aのような双方向の循環参照エッジを検出してグループ化する
 * @param edges 全エッジの配列
 * @returns グループキーとエッジ配列のマップ
 * @example
 * // A→BとB→Aがある場合、"A-B"グループに両方のエッジが含まれる
 * const groups = detectCyclicEdges(edges);
 * // groups.get("A-B") => [edge1, edge2]
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
 * パラレルエッジ（同一ノード間の複数エッジ）を検出する
 * @description 同じsourceとtargetを持つエッジ（同じ方向の複数エッジ）をグループ化する
 * @param edges 全エッジの配列
 * @returns グループキーとエッジ配列のマップ（2つ以上のエッジがあるグループのみ）
 * @example
 * // A→Bが2本ある場合、"A->B"グループに両方のエッジが含まれる
 * const groups = detectParallelEdges(edges);
 * // groups.get("A->B") => [edge1, edge2]
 */
export function detectParallelEdges(edges: Edge[]): Map<string, Edge[]> {
  const parallelGroups = new Map<string, Edge[]>();

  /**
   * ノード間の接続ごとにエッジをグループ化
   * @description 同じsource→targetの組み合わせを持つエッジを集める
   */
  edges.forEach((edge) => {
    const groupKey = `${edge.source}->${edge.target}`;

    if (!parallelGroups.has(groupKey)) {
      parallelGroups.set(groupKey, []);
    }
    parallelGroups.get(groupKey)?.push(edge);
  });

  /**
   * 1本しかないエッジのグループを削除
   * @description パラレルエッジは2本以上のエッジがある場合のみ対象とする
   */
  for (const [key, group] of Array.from(parallelGroups.entries())) {
    if (group.length < 2) {
      parallelGroups.delete(key);
    }
  }

  return parallelGroups;
}

/**
 * セルフループエッジのオフセットを計算する
 * @description 同じノードへの自己参照エッジを円形パターンで分散配置する
 * @param edgeInGroup 対象のエッジ
 * @param groupEdges グループ内の全エッジ
 * @param offsetDistance 基本オフセット距離
 * @returns オフセット座標
 */
function calculateSelfLoopOffset(
  edgeInGroup: Edge,
  groupEdges: Edge[],
  offsetDistance: number
): { offsetX: number; offsetY: number } {
  /**
   * グループ内の全セルフループを取得
   */
  const selfLoops = groupEdges.filter(
    (e) => e.source === edgeInGroup.source && e.target === edgeInGroup.target
  );
  const selfLoopIndex = selfLoops.findIndex((e) => e.id === edgeInGroup.id);

  /**
   * セルフループを円形に配置
   * @description 各エッジを円周上に等間隔で配置する
   */
  const angle = ((2 * Math.PI) / Math.max(selfLoops.length, 1)) * selfLoopIndex;
  const radius = offsetDistance * (1 + selfLoopIndex);
  const dx = Math.cos(angle) * radius;
  const dy = Math.sin(angle) * radius;
  return { offsetX: dx, offsetY: dy };
}

/**
 * パラレルエッジのオフセットを計算する
 * @description 同一ノード間の複数エッジを垂直方向に分散配置する
 * @param edgeInGroup 対象のエッジ
 * @param groupEdges グループ内の全エッジ
 * @param offsetDistance 基本オフセット距離
 * @returns オフセット座標
 * @example
 * // 3本のパラレルエッジがある場合
 * // edge[0]: offsetY = -20 (上)
 * // edge[1]: offsetY = 0   (中央)
 * // edge[2]: offsetY = 20  (下)
 */
function calculateParallelEdgeOffset(
  edgeInGroup: Edge,
  groupEdges: Edge[],
  offsetDistance: number
): { offsetX: number; offsetY: number } {
  /**
   * グループ内でのエッジのインデックスを取得
   */
  const edgeIndex = groupEdges.findIndex((e) => e.id === edgeInGroup.id);
  const totalEdges = groupEdges.length;

  /**
   * 中央を基準に上下に分散配置
   * @description 奇数本の場合は中央を0として上下に配置、偶数本の場合は中央をずらして配置
   * @example
   * // 奇数(3本): -1, 0, 1 → -20, 0, 20
   * // 偶数(4本): -1.5, -0.5, 0.5, 1.5 → -30, -10, 10, 30
   */
  const centerOffset = (totalEdges - 1) / 2;
  const relativePosition = edgeIndex - centerOffset;
  const dy = relativePosition * offsetDistance;

  return { offsetX: 0, offsetY: dy };
}

/**
 * エッジのオフセットを計算する（循環参照・パラレルエッジ対応）
 * @description エッジの種類に応じて適切なオフセットを計算する
 * @param edge 対象のエッジ
 * @param allEdges 全エッジの配列
 * @param offsetDistance 基本オフセット距離（デフォルト: 20）
 * @returns オフセット座標
 * @example
 * // 循環参照エッジ（A→B, B→A）の場合は斜めにオフセット
 * // パラレルエッジ（A→B, A→B）の場合は垂直にオフセット
 * // セルフループ（A→A）の場合は円形にオフセット
 */
export function calculateEdgeOffset(
  edge: Edge,
  allEdges: Edge[],
  offsetDistance: number = 20
): { offsetX: number; offsetY: number } {
  /**
   * 優先順位1: 循環参照エッジの検出と処理
   * @description A→BとB→Aのような双方向の循環参照を優先的に処理
   */
  const cyclicGroups = detectCyclicEdges(allEdges);

  for (const [, groupEdges] of Array.from(cyclicGroups.entries())) {
    const edgeInGroup = groupEdges.find((e: Edge) => e.id === edge.id);
    if (edgeInGroup) {
      const edgeIndex = groupEdges.indexOf(edgeInGroup);

      /**
       * オフセット計算（上下または左右に分散）
       */
      const offsetMultiplier = edgeIndex % 2 === 0 ? 1 : -1;
      const offsetAmount = Math.floor(edgeIndex / 2 + 1) * offsetDistance * offsetMultiplier;

      /**
       * セルフループの特別処理
       * @description 自己参照エッジは円形パターンで配置
       */
      if (edgeInGroup.target === edgeInGroup.source) {
        return calculateSelfLoopOffset(edgeInGroup, groupEdges, offsetDistance);
      } else {
        const dx =
          String(edgeInGroup.target).localeCompare(String(edgeInGroup.source), undefined, {
            numeric: true,
          }) > 0
            ? offsetAmount
            : -offsetAmount;
        const dy = offsetAmount;
        return { offsetX: dx, offsetY: dy };
      }
    }
  }

  /**
   * 優先順位2: パラレルエッジの検出と処理
   * @description 同一ノード間の複数エッジ（同じ方向）を垂直方向に分散
   */
  const parallelGroups = detectParallelEdges(allEdges);

  for (const [, groupEdges] of Array.from(parallelGroups.entries())) {
    const edgeInGroup = groupEdges.find((e: Edge) => e.id === edge.id);
    if (edgeInGroup) {
      return calculateParallelEdgeOffset(edgeInGroup, groupEdges, offsetDistance);
    }
  }

  /**
   * どのグループにも属さない場合はオフセットなし
   */
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
): CSSProperties {
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
