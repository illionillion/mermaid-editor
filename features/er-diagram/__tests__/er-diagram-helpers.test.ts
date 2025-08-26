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
});
