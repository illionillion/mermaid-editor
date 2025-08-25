import { describe, test, expect } from "vitest";
import { parseMermaidCode, ParsedMermaidData } from "@/features/flowchart/hooks/mermaid";

describe("parseMermaidCode - flowchartヘッダーなしのケース", () => {
  test("flowchart TDがない場合でも正常に解析する", () => {
    const mermaid = `
      A[開始]
      B[終了]
      A --> B
    `;

    const expected: ParsedMermaidData = {
      nodes: [
        { id: "A", variableName: "A", label: "開始", shapeType: "rectangle" },
        { id: "B", variableName: "B", label: "終了", shapeType: "rectangle" },
      ],
      edges: [{ id: "A-B", source: "A", target: "B", label: "", arrowType: "arrow" }],
    };

    expect(parseMermaidCode(mermaid)).toEqual(expected);
  });

  test("複雑なコードでもflowchartヘッダーなしで動作する", () => {
    const mermaid = `
      A[開始]
      B{判定}
      C[処理A]
      D[処理B]
      E((終了))
      
      A --> B
      B -->|はい| C
      B -->|いいえ| D
      C ==> E
      D ==> E
    `;

    const expected: ParsedMermaidData = {
      nodes: [
        { id: "A", variableName: "A", label: "開始", shapeType: "rectangle" },
        { id: "B", variableName: "B", label: "判定", shapeType: "diamond" },
        { id: "C", variableName: "C", label: "処理A", shapeType: "rectangle" },
        { id: "D", variableName: "D", label: "処理B", shapeType: "rectangle" },
        { id: "E", variableName: "E", label: "終了", shapeType: "circle" },
      ],
      edges: [
        { id: "A-B", source: "A", target: "B", label: "", arrowType: "arrow" },
        { id: "B-C", source: "B", target: "C", label: "はい", arrowType: "arrow" },
        { id: "B-D", source: "B", target: "D", label: "いいえ", arrowType: "arrow" },
        { id: "C-E", source: "C", target: "E", label: "", arrowType: "thick" },
        { id: "D-E", source: "D", target: "E", label: "", arrowType: "thick" },
      ],
    };

    expect(parseMermaidCode(mermaid)).toEqual(expected);
  });

  test("異なるflowchartヘッダー（graph）も適切にスキップする", () => {
    const mermaid = `
      graph LR
      A[開始] --> B[終了]
    `;

    const expected: ParsedMermaidData = {
      nodes: [
        { id: "A", variableName: "A", label: "開始", shapeType: "rectangle" },
        { id: "B", variableName: "B", label: "終了", shapeType: "rectangle" },
      ],
      edges: [{ id: "A-B", source: "A", target: "B", label: "", arrowType: "arrow" }],
    };

    expect(parseMermaidCode(mermaid)).toEqual(expected);
  });

  test("複数のflowchartヘッダーがあっても動作する", () => {
    const mermaid = `
      flowchart TD
      graph LR
      flowchart TB
      A[ノード1]
      B[ノード2]
      A --> B
    `;

    const expected: ParsedMermaidData = {
      nodes: [
        { id: "A", variableName: "A", label: "ノード1", shapeType: "rectangle" },
        { id: "B", variableName: "B", label: "ノード2", shapeType: "rectangle" },
      ],
      edges: [{ id: "A-B", source: "A", target: "B", label: "", arrowType: "arrow" }],
    };

    expect(parseMermaidCode(mermaid)).toEqual(expected);
  });

  test("ノード定義のみでflowchartヘッダーがない場合", () => {
    const mermaid = `
      A[開始ノード]
      B{判定ノード}
      C((終了ノード))
    `;

    const expected: ParsedMermaidData = {
      nodes: [
        { id: "A", variableName: "A", label: "開始ノード", shapeType: "rectangle" },
        { id: "B", variableName: "B", label: "判定ノード", shapeType: "diamond" },
        { id: "C", variableName: "C", label: "終了ノード", shapeType: "circle" },
      ],
      edges: [],
    };

    expect(parseMermaidCode(mermaid)).toEqual(expected);
  });
});
