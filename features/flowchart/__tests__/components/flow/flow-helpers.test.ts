import { describe, test, expect } from "vitest";
import {
  calculateNodePosition,
  parseConnectingNodeId,
} from "@/features/flowchart/hooks/flow-helpers";

describe("calculateNodePosition", () => {
  test("マウス位置を中心にしてノード位置を計算する", () => {
    const mousePosition = { x: 100, y: 200 };
    const nodeWidth = 80;
    const nodeHeight = 60;

    const position = calculateNodePosition(mousePosition, nodeWidth, nodeHeight);

    // ノードの中心がマウス位置になるように計算される
    expect(position.x).toBe(100 - 80 / 2); // 60
    expect(position.y).toBe(200 - 60 / 2); // 170
  });

  test("幅と高さが0の場合", () => {
    const mousePosition = { x: 50, y: 75 };
    const nodeWidth = 0;
    const nodeHeight = 0;

    const position = calculateNodePosition(mousePosition, nodeWidth, nodeHeight);

    expect(position.x).toBe(50);
    expect(position.y).toBe(75);
  });

  test("負の座標でも正しく計算する", () => {
    const mousePosition = { x: -10, y: -20 };
    const nodeWidth = 100;
    const nodeHeight = 50;

    const position = calculateNodePosition(mousePosition, nodeWidth, nodeHeight);

    expect(position.x).toBe(-10 - 100 / 2); // -60
    expect(position.y).toBe(-20 - 50 / 2); // -45
  });

  test("小数点が含まれる場合", () => {
    const mousePosition = { x: 100.5, y: 200.7 };
    const nodeWidth = 30;
    const nodeHeight = 40;

    const position = calculateNodePosition(mousePosition, nodeWidth, nodeHeight);

    expect(position.x).toBe(100.5 - 30 / 2); // 85.5
    expect(position.y).toBe(200.7 - 40 / 2); // 180.7
  });

  test("大きな値でも正しく計算する", () => {
    const mousePosition = { x: 1000000, y: 2000000 };
    const nodeWidth = 100;
    const nodeHeight = 200;

    const position = calculateNodePosition(mousePosition, nodeWidth, nodeHeight);

    expect(position.x).toBe(1000000 - 100 / 2); // 999950
    expect(position.y).toBe(2000000 - 200 / 2); // 1999900
  });
});

describe("parseConnectingNodeId", () => {
  test("source形式の接続IDを正しく解析する", () => {
    const connectingNodeId = "node1-source";
    const result = parseConnectingNodeId(connectingNodeId);

    expect(result.sourceNodeId).toBe("node1");
    expect(result.handleType).toBe("source");
  });

  test("target形式の接続IDを正しく解析する", () => {
    const connectingNodeId = "node2-target";
    const result = parseConnectingNodeId(connectingNodeId);

    expect(result.sourceNodeId).toBe("node2");
    expect(result.handleType).toBe("target");
  });

  test("数字のnode IDを正しく解析する", () => {
    const connectingNodeId = "123-source";
    const result = parseConnectingNodeId(connectingNodeId);

    expect(result.sourceNodeId).toBe("123");
    expect(result.handleType).toBe("source");
  });

  test("複雑なnode IDを正しく解析する", () => {
    const connectingNodeId = "complex-node-id-target";
    const result = parseConnectingNodeId(connectingNodeId);

    // split("-")は全てのハイフンで分割するが、分割代入で最初の2要素のみ取得
    // ["complex", "node", "id", "target"] の最初の2つを取得
    expect(result.sourceNodeId).toBe("complex");
    expect(result.handleType).toBe("node");
  });

  test("ハイフンが含まれていないIDの場合", () => {
    const connectingNodeId = "node1";
    const result = parseConnectingNodeId(connectingNodeId);

    expect(result.sourceNodeId).toBe("node1");
    expect(result.handleType).toBe(undefined);
  });

  test("空文字列の場合", () => {
    const connectingNodeId = "";
    const result = parseConnectingNodeId(connectingNodeId);

    expect(result.sourceNodeId).toBe("");
    expect(result.handleType).toBe(undefined);
  });

  test("ハイフンのみの場合", () => {
    const connectingNodeId = "-";
    const result = parseConnectingNodeId(connectingNodeId);

    expect(result.sourceNodeId).toBe("");
    expect(result.handleType).toBe("");
  });

  test("複数のハイフンが含まれる場合（分割代入で最初の2要素を取得）", () => {
    const connectingNodeId = "node-1-source-handle";
    const result = parseConnectingNodeId(connectingNodeId);

    // ["node", "1", "source", "handle"] の最初の2つを取得
    expect(result.sourceNodeId).toBe("node");
    expect(result.handleType).toBe("1");
  });
});
