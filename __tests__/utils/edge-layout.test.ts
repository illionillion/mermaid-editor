import type { Edge } from "@xyflow/react";
import { describe, test, expect } from "vitest";
import {
  detectCyclicEdges,
  calculateEdgeOffset,
  getCyclicEdgeStyle,
  adjustEdgeLabelPosition,
} from "../../utils/edge-layout";

describe("edge-layout utility functions", () => {
  const mockEdges: Edge[] = [
    { id: "e1", source: "A", target: "B" },
    { id: "e2", source: "B", target: "A" }, // 循環参照
    { id: "e3", source: "C", target: "D" },
    { id: "e4", source: "A", target: "C" }, // 通常のエッジ
  ] as Edge[];

  describe("detectCyclicEdges", () => {
    test("循環参照を正しく検出する", () => {
      const cyclicGroups = detectCyclicEdges(mockEdges);

      expect(cyclicGroups.size).toBe(1);
      expect(cyclicGroups.has("A-B")).toBe(true);

      const cyclicEdges = cyclicGroups.get("A-B");
      expect(cyclicEdges).toHaveLength(2);
      expect(cyclicEdges?.some((e: Edge) => e.id === "e1")).toBe(true);
      expect(cyclicEdges?.some((e: Edge) => e.id === "e2")).toBe(true);
    });

    test("循環参照でないエッジは検出しない", () => {
      const nonCyclicEdges: Edge[] = [
        { id: "e1", source: "A", target: "B" },
        { id: "e2", source: "B", target: "C" },
      ] as Edge[];

      const cyclicGroups = detectCyclicEdges(nonCyclicEdges);
      expect(cyclicGroups.size).toBe(0);
    });

    test("空のエッジ配列では循環参照なし", () => {
      const cyclicGroups = detectCyclicEdges([]);
      expect(cyclicGroups.size).toBe(0);
    });

    test("複数の循環参照グループを正しく処理する", () => {
      const multiCyclicEdges: Edge[] = [
        { id: "e1", source: "A", target: "B" }, // A-B循環
        { id: "e2", source: "B", target: "A" }, // A-B循環
        { id: "e3", source: "C", target: "D" },
        { id: "e4", source: "D", target: "C" }, // C-D循環
      ] as Edge[];

      const cyclicGroups = detectCyclicEdges(multiCyclicEdges);
      expect(cyclicGroups.size).toBe(2);
      expect(cyclicGroups.has("A-B")).toBe(true);
      expect(cyclicGroups.has("C-D")).toBe(true);
    });
  });

  describe("calculateEdgeOffset", () => {
    test("循環参照エッジにオフセットを適用する", () => {
      const edge1 = mockEdges[0]; // A -> B
      const edge2 = mockEdges[1]; // B -> A

      const offset1 = calculateEdgeOffset(edge1, mockEdges);
      const offset2 = calculateEdgeOffset(edge2, mockEdges);

      // 両方のエッジが異なるオフセットを持つ
      expect(offset1.offsetX !== 0 || offset1.offsetY !== 0).toBe(true);
      expect(offset2.offsetX !== 0 || offset2.offsetY !== 0).toBe(true);
      expect(offset1).not.toEqual(offset2);
    });

    test("循環参照でないエッジはオフセットなし", () => {
      const normalEdge = mockEdges[2]; // C -> D
      const offset = calculateEdgeOffset(normalEdge, mockEdges);

      expect(offset.offsetX).toBe(0);
      expect(offset.offsetY).toBe(0);
    });

    test("カスタムオフセット距離を適用する", () => {
      const edge = mockEdges[0];
      const customDistance = 50;
      const offset = calculateEdgeOffset(edge, mockEdges, customDistance);

      // カスタム距離を使ったオフセットが適用される
      expect(Math.abs(offset.offsetX) <= customDistance * 2).toBe(true);
      expect(Math.abs(offset.offsetY) <= customDistance * 2).toBe(true);
    });

    test("空のエッジ配列では全てオフセットなし", () => {
      const edge = mockEdges[0];
      const offset = calculateEdgeOffset(edge, []);

      expect(offset.offsetX).toBe(0);
      expect(offset.offsetY).toBe(0);
    });

    test("セルフループ（自己参照エッジ）の処理", () => {
      const selfLoopEdges = [
        { id: "self1", source: "A", target: "A" },
        { id: "self2", source: "A", target: "A" },
      ];

      const offset1 = calculateEdgeOffset(selfLoopEdges[0], selfLoopEdges);
      const offset2 = calculateEdgeOffset(selfLoopEdges[1], selfLoopEdges);

      // セルフループは円形パターンで配置される
      expect(offset1.offsetX !== 0 || offset1.offsetY !== 0).toBe(true);
      expect(offset2.offsetX !== 0 || offset2.offsetY !== 0).toBe(true);
      expect(offset1).not.toEqual(offset2);
    });
  });

  describe("adjustEdgeLabelPosition", () => {
    test("循環参照エッジのラベル位置を調整する", () => {
      const currentEdge = { source: "A", target: "B" };
      const originalX = 100;
      const originalY = 50;

      const { adjustedX, adjustedY } = adjustEdgeLabelPosition(
        currentEdge,
        originalX,
        originalY,
        mockEdges,
        []
      );

      // 位置が調整される（オリジナルと異なる）
      expect(adjustedX !== originalX || adjustedY !== originalY).toBe(true);
    });

    test("循環参照でないエッジは位置調整なし", () => {
      const currentEdge = { source: "C", target: "D" };
      const originalX = 100;
      const originalY = 50;

      const { adjustedX, adjustedY } = adjustEdgeLabelPosition(
        currentEdge,
        originalX,
        originalY,
        mockEdges,
        []
      );

      // 位置は変更されない
      expect(adjustedX).toBe(originalX);
      expect(adjustedY).toBe(originalY);
    });

    test("存在しないエッジの場合は位置調整なし", () => {
      const currentEdge = { source: "X", target: "Y" };
      const originalX = 100;
      const originalY = 50;

      const { adjustedX, adjustedY } = adjustEdgeLabelPosition(
        currentEdge,
        originalX,
        originalY,
        mockEdges,
        []
      );

      // 位置は変更されない
      expect(adjustedX).toBe(originalX);
      expect(adjustedY).toBe(originalY);
    });
  });

  describe("getCyclicEdgeStyle", () => {
    test("循環参照エッジにスタイルを適用する（スタイリング有効時）", () => {
      const currentEdge = { source: "A", target: "B" };
      const style = getCyclicEdgeStyle(currentEdge, mockEdges, true);

      expect(style).toHaveProperty("stroke");
      expect(style).toHaveProperty("strokeOpacity");
      expect(style).toHaveProperty("strokeWidth");
    });

    test("循環参照エッジでもスタイリング無効時はデフォルトスタイル", () => {
      const currentEdge = { source: "A", target: "B" };
      const style = getCyclicEdgeStyle(currentEdge, mockEdges, false);

      expect(style).toEqual({});
    });

    test("循環参照でないエッジはデフォルトスタイル", () => {
      const normalEdge = { source: "C", target: "D" };
      const style = getCyclicEdgeStyle(normalEdge, mockEdges, true);

      expect(style).toEqual({});
    });

    test("空のエッジ配列では全てデフォルトスタイル", () => {
      const currentEdge = { source: "A", target: "B" };
      const style = getCyclicEdgeStyle(currentEdge, [], true);

      expect(style).toEqual({});
    });

    test("存在しないエッジはデフォルトスタイル", () => {
      const currentEdge = { source: "X", target: "Y" };
      const style = getCyclicEdgeStyle(currentEdge, mockEdges, true);

      expect(style).toEqual({});
    });
  });
});
