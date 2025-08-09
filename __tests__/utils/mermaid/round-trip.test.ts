import { describe, test, expect } from "vitest";
import type { FlowData } from "../../../components/flow/flow-helpers";
import type { GraphType } from "../../../components/types/types";
import { generateMermaidCode, parseMermaidCode } from "../../../utils/mermaid";

describe("Mermaid round-trip test", () => {
  test("生成されたMermaidコードを正しくパースできる", () => {
    const originalFlowData: FlowData = {
      nodes: [
        {
          id: "1",
          type: "custom",
          position: { x: 0, y: 0 },
          data: {
            variableName: "start",
            label: "開始",
            shapeType: "rectangle",
          },
        },
        {
          id: "2",
          type: "custom",
          position: { x: 200, y: 0 },
          data: {
            variableName: "process",
            label: "処理",
            shapeType: "diamond",
          },
        },
        {
          id: "3",
          type: "custom",
          position: { x: 400, y: 0 },
          data: {
            variableName: "end",
            label: "終了",
            shapeType: "circle",
          },
        },
      ],
      edges: [
        {
          id: "e1-2",
          source: "1",
          target: "2",
          data: {
            label: "実行",
            arrowType: "arrow",
          },
        },
        {
          id: "e2-3",
          source: "2",
          target: "3",
          data: {
            label: "完了",
            arrowType: "thick",
          },
        },
      ],
    };

    // FlowDataからMermaidコードを生成
    const generatedMermaid = generateMermaidCode(originalFlowData);

    // 生成されたMermaidコードをパース
    const parsedData = parseMermaidCode(generatedMermaid);

    // パースされたデータが期待される構造と一致するかチェック
    expect(parsedData.nodes).toHaveLength(3);
    expect(parsedData.edges).toHaveLength(2);

    // ノードの検証
    const startNode = parsedData.nodes.find((n) => n.variableName === "node_start");
    expect(startNode).toBeDefined();
    expect(startNode?.label).toBe("開始");
    expect(startNode?.shapeType).toBe("rectangle");

    const processNode = parsedData.nodes.find((n) => n.variableName === "process");
    expect(processNode).toBeDefined();
    expect(processNode?.label).toBe("処理");
    expect(processNode?.shapeType).toBe("diamond");

    const endNode = parsedData.nodes.find((n) => n.variableName === "node_end");
    expect(endNode).toBeDefined();
    expect(endNode?.label).toBe("終了");
    expect(endNode?.shapeType).toBe("circle");

    // エッジの検証
    const firstEdge = parsedData.edges.find(
      (e) => e.source === "node_start" && e.target === "process"
    );
    expect(firstEdge).toBeDefined();
    expect(firstEdge?.label).toBe("実行");
    expect(firstEdge?.arrowType).toBe("arrow");

    const secondEdge = parsedData.edges.find(
      (e) => e.source === "process" && e.target === "node_end"
    );
    expect(secondEdge).toBeDefined();
    expect(secondEdge?.label).toBe("完了");
    expect(secondEdge?.arrowType).toBe("thick");
  });

  test("全ての矢印タイプとノード形状のround-trip", () => {
    const originalFlowData: FlowData = {
      nodes: [
        {
          id: "1",
          type: "custom",
          position: { x: 0, y: 0 },
          data: { variableName: "rect", label: "四角形", shapeType: "rectangle" },
        },
        {
          id: "2",
          type: "custom",
          position: { x: 0, y: 100 },
          data: { variableName: "diamond", label: "ダイヤ", shapeType: "diamond" },
        },
        {
          id: "3",
          type: "custom",
          position: { x: 0, y: 200 },
          data: { variableName: "rounded", label: "角丸", shapeType: "rounded" },
        },
        {
          id: "4",
          type: "custom",
          position: { x: 0, y: 300 },
          data: { variableName: "circle", label: "円", shapeType: "circle" },
        },
        {
          id: "5",
          type: "custom",
          position: { x: 0, y: 400 },
          data: { variableName: "hexagon", label: "六角形", shapeType: "hexagon" },
        },
        {
          id: "6",
          type: "custom",
          position: { x: 0, y: 500 },
          data: { variableName: "stadium", label: "スタジアム", shapeType: "stadium" },
        },
      ],
      edges: [
        { id: "e1", source: "1", target: "2", data: { label: "通常", arrowType: "arrow" } },
        { id: "e2", source: "2", target: "3", data: { label: "太い", arrowType: "thick" } },
        { id: "e3", source: "3", target: "4", data: { label: "点線", arrowType: "dotted" } },
        {
          id: "e4",
          source: "4",
          target: "5",
          data: { label: "双方向", arrowType: "bidirectional" },
        },
        {
          id: "e5",
          source: "5",
          target: "6",
          data: { label: "太い双方向", arrowType: "bidirectional-thick" },
        },
      ],
    };

    const generatedMermaid = generateMermaidCode(originalFlowData);

    const parsedData = parseMermaidCode(generatedMermaid);

    // ノード形状の検証
    expect(parsedData.nodes.find((n) => n.variableName === "rect")?.shapeType).toBe("rectangle");
    expect(parsedData.nodes.find((n) => n.variableName === "diamond")?.shapeType).toBe("diamond");
    expect(parsedData.nodes.find((n) => n.variableName === "rounded")?.shapeType).toBe("rounded");
    expect(parsedData.nodes.find((n) => n.variableName === "circle")?.shapeType).toBe("circle");
    expect(parsedData.nodes.find((n) => n.variableName === "hexagon")?.shapeType).toBe("hexagon");
    expect(parsedData.nodes.find((n) => n.variableName === "stadium")?.shapeType).toBe("stadium");

    // 矢印タイプの検証
    expect(parsedData.edges.find((e) => e.source === "rect")?.arrowType).toBe("arrow");
    expect(parsedData.edges.find((e) => e.source === "diamond")?.arrowType).toBe("thick");
    expect(parsedData.edges.find((e) => e.source === "rounded")?.arrowType).toBe("dotted");
    expect(parsedData.edges.find((e) => e.source === "circle")?.arrowType).toBe("bidirectional");
    expect(parsedData.edges.find((e) => e.source === "hexagon")?.arrowType).toBe(
      "bidirectional-thick"
    );
  });

  test("異なる方向（direction）でのMermaidコード生成", () => {
    const simpleFlowData: FlowData = {
      nodes: [
        {
          id: "1",
          type: "custom",
          position: { x: 0, y: 0 },
          data: { variableName: "A", label: "ノードA", shapeType: "rectangle" },
        },
        {
          id: "2",
          type: "custom",
          position: { x: 100, y: 0 },
          data: { variableName: "B", label: "ノードB", shapeType: "rectangle" },
        },
      ],
      edges: [
        {
          id: "e1-2",
          source: "1",
          target: "2",
          data: { label: "接続", arrowType: "arrow" },
        },
      ],
    };

    // すべての方向をテスト
    const directions: GraphType[] = ["TD", "LR", "RL", "BT"];

    directions.forEach((direction) => {
      const generatedMermaid = generateMermaidCode(simpleFlowData, direction);

      // 生成されたコードに正しい方向が含まれているかチェック
      expect(generatedMermaid).toContain(`flowchart ${direction}`);

      // パースできることを確認
      const parsedData = parseMermaidCode(generatedMermaid);
      expect(parsedData.nodes).toHaveLength(2);
      expect(parsedData.edges).toHaveLength(1);

      // ノードとエッジの内容は方向に関係なく同じ
      expect(parsedData.nodes.find((n) => n.variableName === "A")?.label).toBe("ノードA");
      expect(parsedData.nodes.find((n) => n.variableName === "B")?.label).toBe("ノードB");
      expect(parsedData.edges[0].label).toBe("接続");
    });
  });

  test("デフォルト方向（TD）でのMermaidコード生成", () => {
    const simpleFlowData: FlowData = {
      nodes: [
        {
          id: "1",
          type: "custom",
          position: { x: 0, y: 0 },
          data: { variableName: "start", label: "開始", shapeType: "rectangle" },
        },
      ],
      edges: [],
    };

    // 方向を指定しない場合
    const generatedMermaidDefault = generateMermaidCode(simpleFlowData);
    expect(generatedMermaidDefault).toContain("flowchart TD");

    // 明示的にTDを指定した場合
    const generatedMermaidTD = generateMermaidCode(simpleFlowData, "TD");
    expect(generatedMermaidTD).toContain("flowchart TD");

    // 両者は同じ結果になるべき
    expect(generatedMermaidDefault).toBe(generatedMermaidTD);
  });
});
