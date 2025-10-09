import { describe, it, expect } from "vitest";
import {
  calculateNodePosition,
  createNewERTableNode,
  createNewEREdge,
  parseConnectingNodeId,
} from "../hooks/er-diagram-helpers";

describe("er-diagram-helpers", () => {
  it("calculateNodePosition: マウス座標とノードサイズから中心座標を計算", () => {
    const pos = calculateNodePosition({ x: 100, y: 200 }, 80, 40);
    expect(pos).toEqual({ x: 100 - 40 + 90, y: 200 - 20 });
  });

  it("createNewERTableNode: 新しいノードを生成", () => {
    const node = createNewERTableNode(
      1,
      { x: 10, y: 20 },
      { onNameChange: () => {}, onColumnsChange: () => {} }
    );
    expect(node.id).toBe("1");
    expect(node.type).toBe("erTable");
    expect(node.position).toEqual({ x: 10, y: 20 });
    expect(node.data.name).toContain("テーブル");
    expect(node.data.columns[0].pk).toBe(true);
  });

  it("createNewEREdge: 新しいエッジを生成", () => {
    const edge = createNewEREdge("1", "2", "source", "rel", "one-to-one");
    expect(edge.id).toBe("1-2");
    expect(edge.source).toBe("1");
    expect(edge.target).toBe("2");
    expect(edge.data).not.toBeNull();
    expect(edge.data).not.toBeUndefined();
    expect(edge.data?.label).toBe("rel");
    expect(edge.data?.cardinality).toBe("one-to-one");
  });

  it("parseConnectingNodeId: ノードIDとハンドル種別をパース", () => {
    const result = parseConnectingNodeId("123-source");
    expect(result).toEqual({ sourceNodeId: "123", handleType: "source" });
  });

  describe("並列エッジ（同じテーブル間の複数リレーション）", () => {
    it("同じテーブル間で複数回呼び出すと同じIDが生成される（ID衝突）", () => {
      const edge1 = createNewEREdge("1", "2", "source", "rel1", "one-to-many");
      const edge2 = createNewEREdge("1", "2", "source", "rel2", "one-to-one");

      expect(edge1.id).toBe("1-2");
      expect(edge2.id).toBe("1-2");
      expect(edge1.id).toBe(edge2.id);
      expect(edge1.data?.label).toBe("rel1");
      expect(edge2.data?.label).toBe("rel2");
      expect(edge1.data?.cardinality).toBe("one-to-many");
      expect(edge2.data?.cardinality).toBe("one-to-one");
    });

    it("handleType='source': source/targetが正しく設定される", () => {
      const edge = createNewEREdge("1", "2", "source", "relation", "one-to-many");
      expect(edge.source).toBe("1");
      expect(edge.target).toBe("2");
    });

    it("handleType='target': source/targetが逆転して設定される", () => {
      const edge = createNewEREdge("1", "2", "target", "relation", "one-to-many");
      expect(edge.source).toBe("2");
      expect(edge.target).toBe("1");
    });

    it("handleType未指定: source/targetが逆転して設定される（デフォルト動作）", () => {
      const edge = createNewEREdge("1", "2", undefined, "relation", "one-to-many");
      expect(edge.source).toBe("2");
      expect(edge.target).toBe("1");
    });

    it("デフォルト値: labelとcardinalityが正しく設定される", () => {
      const edge = createNewEREdge("1", "2", "source");
      expect(edge.data?.label).toBe("relation");
      expect(edge.data?.cardinality).toBe("one-to-many");
    });

    it("異なるラベルでの並列エッジ作成", () => {
      const edge1 = createNewEREdge("User", "Post", "source", "owns", "one-to-many");
      const edge2 = createNewEREdge("User", "Post", "source", "likes", "many-to-many");

      expect(edge1.id).toBe("User-Post");
      expect(edge2.id).toBe("User-Post");
      expect(edge1.data?.label).toBe("owns");
      expect(edge2.data?.label).toBe("likes");
      expect(edge1.data?.cardinality).toBe("one-to-many");
      expect(edge2.data?.cardinality).toBe("many-to-many");
    });

    it("handleType='source'とhandleType='target'で異なる方向のエッジが生成される", () => {
      const edgeSourceMode = createNewEREdge("A", "B", "source", "forward", "one-to-one");
      const edgeTargetMode = createNewEREdge("A", "B", "target", "backward", "many-to-one");

      expect(edgeSourceMode.id).toBe("A-B");
      expect(edgeTargetMode.id).toBe("A-B");

      expect(edgeSourceMode.source).toBe("A");
      expect(edgeSourceMode.target).toBe("B");

      expect(edgeTargetMode.source).toBe("B");
      expect(edgeTargetMode.target).toBe("A");

      expect(edgeSourceMode.data?.label).toBe("forward");
      expect(edgeTargetMode.data?.label).toBe("backward");
    });

    it("すべてのカーディナリティタイプが正しく設定される", () => {
      const cardinalityTypes = [
        "one-to-one",
        "one-to-many",
        "many-to-one",
        "many-to-many",
        "zero-to-one",
        "one-to-zero",
        "one-to-many-mandatory",
      ] as const;

      cardinalityTypes.forEach((cardinality) => {
        const edge = createNewEREdge("1", "2", "source", "rel", cardinality);
        expect(edge.data?.cardinality).toBe(cardinality);
        expect(edge.type).toBe("erEdge");
      });
    });

    it("複数の異なるテーブルペア間でエッジを作成", () => {
      const edge1 = createNewEREdge("1", "2", "source", "rel1", "one-to-many");
      const edge2 = createNewEREdge("2", "3", "source", "rel2", "one-to-one");
      const edge3 = createNewEREdge("1", "3", "source", "rel3", "many-to-many");

      expect(edge1.id).toBe("1-2");
      expect(edge2.id).toBe("2-3");
      expect(edge3.id).toBe("1-3");

      expect(edge1.source).toBe("1");
      expect(edge2.source).toBe("2");
      expect(edge3.source).toBe("1");
    });

    it("エッジタイプが常に'erEdge'に設定される", () => {
      const edge1 = createNewEREdge("1", "2", "source");
      const edge2 = createNewEREdge("3", "4", "target", "custom", "many-to-many");

      expect(edge1.type).toBe("erEdge");
      expect(edge2.type).toBe("erEdge");
    });
  });
});
