import { describe, test, expect } from "vitest";
import { FlowData } from "../../../features/flowchart/hooks/flow-helpers";
import { generateMermaidCode } from "../../../features/flowchart/hooks/mermaid";
import { MermaidArrowType } from "../../../features/flowchart/types/types";

describe("generateMermaidCode", () => {
  describe("基本的なフローチャート生成", () => {
    test("単一ノードの出力", () => {
      const flowData: FlowData = {
        nodes: [
          {
            id: "1",
            data: { variableName: "start", shapeType: "circle", label: "start" },
            position: { x: 0, y: 0 },
          },
        ],
        edges: [],
      };

      const result = generateMermaidCode(flowData);
      expect(result).toContain("flowchart TD");
      expect(result).toContain("node_start((start))");
    });

    test("複数ノード + エッジの統合出力", () => {
      const flowData: FlowData = {
        nodes: [
          {
            id: "1",
            data: { variableName: "start", shapeType: "circle", label: "start" },
            position: { x: 0, y: 0 },
          },
          {
            id: "2",
            data: { variableName: "process", shapeType: "rectangle", label: "process" },
            position: { x: 0, y: 100 },
          },
          {
            id: "3",
            data: { variableName: "end", shapeType: "stadium", label: "end" },
            position: { x: 0, y: 200 },
          },
        ],
        edges: [
          {
            id: "e1-2",
            source: "1",
            target: "2",
            data: { arrowType: "arrow" as MermaidArrowType },
          },
          {
            id: "e2-3",
            source: "2",
            target: "3",
            data: { arrowType: "thick" as MermaidArrowType },
          },
        ],
      };

      const result = generateMermaidCode(flowData);
      expect(result).toContain("node_start((start))");
      expect(result).toContain("process[process]");
      expect(result).toContain("node_end([end])");
      expect(result).toContain("node_start --> process");
      expect(result).toContain("process ==> node_end");
    });
  });

  describe("複雑なフロー", () => {
    test("分岐・合流パターン", () => {
      const flowData: FlowData = {
        nodes: [
          {
            id: "1",
            data: { variableName: "start", shapeType: "circle", label: "start" },
            position: { x: 0, y: 0 },
          },
          {
            id: "2",
            data: { variableName: "decision", shapeType: "diamond", label: "decision" },
            position: { x: 0, y: 100 },
          },
          {
            id: "3",
            data: { variableName: "yes_path", shapeType: "rectangle", label: "yes_path" },
            position: { x: -100, y: 200 },
          },
          {
            id: "4",
            data: { variableName: "no_path", shapeType: "rectangle", label: "no_path" },
            position: { x: 100, y: 200 },
          },
          {
            id: "5",
            data: { variableName: "merge", shapeType: "circle", label: "merge" },
            position: { x: 0, y: 300 },
          },
        ],
        edges: [
          {
            id: "e1-2",
            source: "1",
            target: "2",
            data: { arrowType: "arrow" as MermaidArrowType },
          },
          {
            id: "e2-3",
            source: "2",
            target: "3",
            data: { arrowType: "arrow" as MermaidArrowType, label: "Yes" },
          },
          {
            id: "e2-4",
            source: "2",
            target: "4",
            data: { arrowType: "arrow" as MermaidArrowType, label: "No" },
          },
          {
            id: "e3-5",
            source: "3",
            target: "5",
            data: { arrowType: "arrow" as MermaidArrowType },
          },
          {
            id: "e4-5",
            source: "4",
            target: "5",
            data: { arrowType: "arrow" as MermaidArrowType },
          },
        ],
      };

      const result = generateMermaidCode(flowData);
      expect(result).toContain("decision{decision}");
      expect(result).toContain("decision -->|Yes| yes_path");
      expect(result).toContain("decision -->|No| no_path");
    });

    test("複数の矢印タイプ・図形タイプの組み合わせ", () => {
      const flowData: FlowData = {
        nodes: [
          {
            id: "1",
            data: { variableName: "A", shapeType: "hexagon", label: "A" },
            position: { x: 0, y: 0 },
          },
          {
            id: "2",
            data: { variableName: "B", shapeType: "rounded", label: "B" },
            position: { x: 0, y: 100 },
          },
        ],
        edges: [
          {
            id: "e1-2",
            source: "1",
            target: "2",
            data: { arrowType: "dotted" as MermaidArrowType, label: "dotted link" },
          },
        ],
      };

      const result = generateMermaidCode(flowData);
      expect(result).toContain("A{{A}}");
      expect(result).toContain("B(B)");
      expect(result).toContain("A -. dotted link .-> B");
    });
  });

  describe("エッジケース", () => {
    test("存在しないノードIDを参照するエッジは無視される", () => {
      const flowData: FlowData = {
        nodes: [
          {
            id: "1",
            data: { variableName: "A", shapeType: "rectangle", label: "A" },
            position: { x: 0, y: 0 },
          },
        ],
        edges: [
          {
            id: "e1-999",
            source: "1",
            target: "999",
            data: { arrowType: "arrow" as MermaidArrowType },
          },
          {
            id: "e999-1",
            source: "999",
            target: "1",
            data: { arrowType: "arrow" as MermaidArrowType },
          },
        ],
      };

      const result = generateMermaidCode(flowData);
      expect(result).toContain("A[A]");
      expect(result).not.toContain("A -->");
      expect(result).not.toContain("--> A");
    });

    test("空のnodes・edges配列", () => {
      const flowData1: FlowData = { nodes: [], edges: [] };
      const result1 = generateMermaidCode(flowData1);
      expect(result1).toBe("flowchart TD\n");

      const flowData2: FlowData = {
        nodes: [],
        edges: [
          {
            id: "e1-2",
            source: "1",
            target: "2",
            data: { arrowType: "arrow" as MermaidArrowType },
          },
        ],
      };
      const result2 = generateMermaidCode(flowData2);
      expect(result2).toBe("flowchart TD\n");
    });

    test("variableNameやshapeTypeが未定義の場合のデフォルト値", () => {
      const flowData: FlowData = {
        nodes: [
          {
            id: "1",
            data: { variableName: "", shapeType: "", label: "" },
            position: { x: 0, y: 0 },
          },
          {
            id: "2",
            data: { variableName: undefined, shapeType: undefined, label: undefined },
            position: { x: 0, y: 100 },
          },
        ],
        edges: [],
      };

      const result = generateMermaidCode(flowData);
      expect(result).toContain("node1[]");
      expect(result).toContain("node2[]");
    });
  });
});
