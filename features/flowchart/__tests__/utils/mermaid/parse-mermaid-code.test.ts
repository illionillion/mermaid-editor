import { describe, test, expect } from "vitest";
import { parseMermaidCode, ParsedMermaidData } from "@/features/flowchart/hooks/mermaid";

describe("parseMermaidCode", () => {
  describe("基本的なノード解析", () => {
    test("単一ノード（四角形）を解析する", () => {
      const mermaid = `
        flowchart TD
        A[ラベル]
      `;

      const expected: ParsedMermaidData = {
        nodes: [
          {
            id: "A",
            variableName: "A",
            label: "ラベル",
            shapeType: "rectangle",
          },
        ],
        edges: [],
      };

      expect(parseMermaidCode(mermaid)).toEqual(expected);
    });

    test("複数ノード（異なる図形）を解析する", () => {
      const mermaid = `
        flowchart TD
        A[四角形]
        B(丸角四角形)
        C{ダイヤモンド}
        D((円))
      `;

      const expected: ParsedMermaidData = {
        nodes: [
          { id: "A", variableName: "A", label: "四角形", shapeType: "rectangle" },
          { id: "B", variableName: "B", label: "丸角四角形", shapeType: "rounded" },
          { id: "C", variableName: "C", label: "ダイヤモンド", shapeType: "diamond" },
          { id: "D", variableName: "D", label: "円", shapeType: "circle" },
        ],
        edges: [],
      };

      expect(parseMermaidCode(mermaid)).toEqual(expected);
    });

    test("ラベルなしノードを解析する", () => {
      const mermaid = `
        flowchart TD
        A
        B[]
      `;

      const expected: ParsedMermaidData = {
        nodes: [
          { id: "A", variableName: "A", label: "A", shapeType: "rectangle" },
          { id: "B", variableName: "B", label: "", shapeType: "rectangle" },
        ],
        edges: [],
      };

      expect(parseMermaidCode(mermaid)).toEqual(expected);
    });

    test("日本語ラベルを含むノードを解析する", () => {
      const mermaid = `
        flowchart TD
        開始[プロセス開始]
        処理{判定処理}
      `;

      const expected: ParsedMermaidData = {
        nodes: [
          { id: "開始", variableName: "開始", label: "プロセス開始", shapeType: "rectangle" },
          { id: "処理", variableName: "処理", label: "判定処理", shapeType: "diamond" },
        ],
        edges: [],
      };

      expect(parseMermaidCode(mermaid)).toEqual(expected);
    });
  });

  describe("基本的なエッジ解析", () => {
    test("点線矢印（-. ラベル .->）を解析する", () => {
      const mermaid = `
        flowchart TD
        A[開始] -. 進む .-> B[終了]
      `;
      const expected: ParsedMermaidData = {
        nodes: [
          { id: "A", variableName: "A", label: "開始", shapeType: "rectangle" },
          { id: "B", variableName: "B", label: "終了", shapeType: "rectangle" },
        ],
        edges: [
          {
            id: "A-B",
            source: "A",
            target: "B",
            label: "進む",
            arrowType: "dotted",
          },
        ],
      };
      expect(parseMermaidCode(mermaid)).toEqual(expected);
    });

    test("太い矢印（== ラベル ==>）を解析する", () => {
      const mermaid = `
        flowchart TD
        A[開始] == 進む ==> B[終了]
      `;
      const expected: ParsedMermaidData = {
        nodes: [
          { id: "A", variableName: "A", label: "開始", shapeType: "rectangle" },
          { id: "B", variableName: "B", label: "終了", shapeType: "rectangle" },
        ],
        edges: [
          {
            id: "A-B",
            source: "A",
            target: "B",
            label: "進む",
            arrowType: "thick",
          },
        ],
      };
      expect(parseMermaidCode(mermaid)).toEqual(expected);
    });

    test("太い双方向矢印（<== ラベル ==>）を解析する", () => {
      const mermaid = `
        flowchart TD
        A[開始] <== 進む ==> B[終了]
      `;
      const expected: ParsedMermaidData = {
        nodes: [
          { id: "A", variableName: "A", label: "開始", shapeType: "rectangle" },
          { id: "B", variableName: "B", label: "終了", shapeType: "rectangle" },
        ],
        edges: [
          {
            id: "A-B",
            source: "A",
            target: "B",
            label: "進む",
            arrowType: "bidirectional-thick",
          },
        ],
      };
      expect(parseMermaidCode(mermaid)).toEqual(expected);
    });
    test("スペース区切りラベル付き矢印（-- label -->）を解析する", () => {
      const mermaid = `
        flowchart TD
        A[開始] -- はい --> B[終了]
      `;

      const expected: ParsedMermaidData = {
        nodes: [
          { id: "A", variableName: "A", label: "開始", shapeType: "rectangle" },
          { id: "B", variableName: "B", label: "終了", shapeType: "rectangle" },
        ],
        edges: [
          {
            id: "A-B",
            source: "A",
            target: "B",
            label: "はい",
            arrowType: "arrow",
          },
        ],
      };

      expect(parseMermaidCode(mermaid)).toEqual(expected);
    });
    test("単純な矢印を解析する", () => {
      const mermaid = `
        flowchart TD
        A[開始] --> B[終了]
      `;

      const expected: ParsedMermaidData = {
        nodes: [
          { id: "A", variableName: "A", label: "開始", shapeType: "rectangle" },
          { id: "B", variableName: "B", label: "終了", shapeType: "rectangle" },
        ],
        edges: [
          {
            id: "A-B",
            source: "A",
            target: "B",
            label: "",
            arrowType: "arrow",
          },
        ],
      };

      expect(parseMermaidCode(mermaid)).toEqual(expected);
    });

    test("ラベル付き矢印を解析する", () => {
      const mermaid = `
        flowchart TD
        A[開始] -->|はい| B[処理]
        B --> |いいえ| C[終了]
      `;

      const expected: ParsedMermaidData = {
        nodes: [
          { id: "A", variableName: "A", label: "開始", shapeType: "rectangle" },
          { id: "B", variableName: "B", label: "処理", shapeType: "rectangle" },
          { id: "C", variableName: "C", label: "終了", shapeType: "rectangle" },
        ],
        edges: [
          {
            id: "A-B",
            source: "A",
            target: "B",
            label: "はい",
            arrowType: "arrow",
          },
          {
            id: "B-C",
            source: "B",
            target: "C",
            label: "いいえ",
            arrowType: "arrow",
          },
        ],
      };

      expect(parseMermaidCode(mermaid)).toEqual(expected);
    });

    test("複数の接続パターンを解析する", () => {
      const mermaid = `
        flowchart TD
        A[開始]
        B[処理1]
        C[処理2]
        D[終了]
        
        A --> B
        A --> C
        B --> D
        C --> D
      `;

      const expected: ParsedMermaidData = {
        nodes: [
          { id: "A", variableName: "A", label: "開始", shapeType: "rectangle" },
          { id: "B", variableName: "B", label: "処理1", shapeType: "rectangle" },
          { id: "C", variableName: "C", label: "処理2", shapeType: "rectangle" },
          { id: "D", variableName: "D", label: "終了", shapeType: "rectangle" },
        ],
        edges: [
          { id: "A-B", source: "A", target: "B", label: "", arrowType: "arrow" },
          { id: "A-C", source: "A", target: "C", label: "", arrowType: "arrow" },
          { id: "B-D", source: "B", target: "D", label: "", arrowType: "arrow" },
          { id: "C-D", source: "C", target: "D", label: "", arrowType: "arrow" },
        ],
      };

      expect(parseMermaidCode(mermaid)).toEqual(expected);
    });
  });

  describe("異なる矢印タイプの解析", () => {
    test("太い矢印を解析する", () => {
      const mermaid = `
        flowchart TD
        A[開始] ==> B[終了]
        C[処理] ==>|ラベル| D[完了]
      `;

      const expected: ParsedMermaidData = {
        nodes: [
          { id: "A", variableName: "A", label: "開始", shapeType: "rectangle" },
          { id: "B", variableName: "B", label: "終了", shapeType: "rectangle" },
          { id: "C", variableName: "C", label: "処理", shapeType: "rectangle" },
          { id: "D", variableName: "D", label: "完了", shapeType: "rectangle" },
        ],
        edges: [
          { id: "A-B", source: "A", target: "B", label: "", arrowType: "thick" },
          { id: "C-D", source: "C", target: "D", label: "ラベル", arrowType: "thick" },
        ],
      };

      expect(parseMermaidCode(mermaid)).toEqual(expected);
    });

    test("点線矢印を解析する", () => {
      const mermaid = `
        flowchart TD
        A[開始] -.-> B[終了]
        C[処理] -. ラベル .-> D[完了]
      `;

      const expected: ParsedMermaidData = {
        nodes: [
          { id: "A", variableName: "A", label: "開始", shapeType: "rectangle" },
          { id: "B", variableName: "B", label: "終了", shapeType: "rectangle" },
          { id: "C", variableName: "C", label: "処理", shapeType: "rectangle" },
          { id: "D", variableName: "D", label: "完了", shapeType: "rectangle" },
        ],
        edges: [
          { id: "A-B", source: "A", target: "B", label: "", arrowType: "dotted" },
          { id: "C-D", source: "C", target: "D", label: "ラベル", arrowType: "dotted" },
        ],
      };

      expect(parseMermaidCode(mermaid)).toEqual(expected);
    });

    test("双方向矢印を解析する", () => {
      const mermaid = `
        flowchart TD
        A[ノード1] <--> B[ノード2]
        C[ノード3] <-->|相互| D[ノード4]
      `;

      const expected: ParsedMermaidData = {
        nodes: [
          { id: "A", variableName: "A", label: "ノード1", shapeType: "rectangle" },
          { id: "B", variableName: "B", label: "ノード2", shapeType: "rectangle" },
          { id: "C", variableName: "C", label: "ノード3", shapeType: "rectangle" },
          { id: "D", variableName: "D", label: "ノード4", shapeType: "rectangle" },
        ],
        edges: [
          { id: "A-B", source: "A", target: "B", label: "", arrowType: "bidirectional" },
          { id: "C-D", source: "C", target: "D", label: "相互", arrowType: "bidirectional" },
        ],
      };

      expect(parseMermaidCode(mermaid)).toEqual(expected);
    });

    test("太い双方向矢印を解析する", () => {
      const mermaid = `
        flowchart TD
        A[ノード1] <==> B[ノード2]
        C[ノード3] <==ラベル==> D[ノード4]
      `;

      const expected: ParsedMermaidData = {
        nodes: [
          { id: "A", variableName: "A", label: "ノード1", shapeType: "rectangle" },
          { id: "B", variableName: "B", label: "ノード2", shapeType: "rectangle" },
          { id: "C", variableName: "C", label: "ノード3", shapeType: "rectangle" },
          { id: "D", variableName: "D", label: "ノード4", shapeType: "rectangle" },
        ],
        edges: [
          { id: "A-B", source: "A", target: "B", label: "", arrowType: "bidirectional-thick" },
          {
            id: "C-D",
            source: "C",
            target: "D",
            label: "ラベル",
            arrowType: "bidirectional-thick",
          },
        ],
      };

      expect(parseMermaidCode(mermaid)).toEqual(expected);
    });

    test("混在する矢印タイプを解析する", () => {
      const mermaid = `
        flowchart TD
        A[開始] --> B[処理1]
        B ==> C[処理2]
        C -.-> D[処理3]
        D <--> E[処理4]
        E <==> F[終了]
      `;

      const expected: ParsedMermaidData = {
        nodes: [
          { id: "A", variableName: "A", label: "開始", shapeType: "rectangle" },
          { id: "B", variableName: "B", label: "処理1", shapeType: "rectangle" },
          { id: "C", variableName: "C", label: "処理2", shapeType: "rectangle" },
          { id: "D", variableName: "D", label: "処理3", shapeType: "rectangle" },
          { id: "E", variableName: "E", label: "処理4", shapeType: "rectangle" },
          { id: "F", variableName: "F", label: "終了", shapeType: "rectangle" },
        ],
        edges: [
          { id: "A-B", source: "A", target: "B", label: "", arrowType: "arrow" },
          { id: "B-C", source: "B", target: "C", label: "", arrowType: "thick" },
          { id: "C-D", source: "C", target: "D", label: "", arrowType: "dotted" },
          { id: "D-E", source: "D", target: "E", label: "", arrowType: "bidirectional" },
          { id: "E-F", source: "E", target: "F", label: "", arrowType: "bidirectional-thick" },
        ],
      };

      expect(parseMermaidCode(mermaid)).toEqual(expected);
    });
  });

  describe("複合パターン解析", () => {
    test("ノードとエッジが混在するコードを解析する", () => {
      const mermaid = `
        flowchart TD
        A[開始]
        A --> B{判定}
        B -->|はい| C[処理A]
        B -->|いいえ| D[処理B]
        C --> E[終了]
        D --> E
      `;

      const expected: ParsedMermaidData = {
        nodes: [
          { id: "A", variableName: "A", label: "開始", shapeType: "rectangle" },
          { id: "B", variableName: "B", label: "判定", shapeType: "diamond" },
          { id: "C", variableName: "C", label: "処理A", shapeType: "rectangle" },
          { id: "D", variableName: "D", label: "処理B", shapeType: "rectangle" },
          { id: "E", variableName: "E", label: "終了", shapeType: "rectangle" },
        ],
        edges: [
          { id: "A-B", source: "A", target: "B", label: "", arrowType: "arrow" },
          { id: "B-C", source: "B", target: "C", label: "はい", arrowType: "arrow" },
          { id: "B-D", source: "B", target: "D", label: "いいえ", arrowType: "arrow" },
          { id: "C-E", source: "C", target: "E", label: "", arrowType: "arrow" },
          { id: "D-E", source: "D", target: "E", label: "", arrowType: "arrow" },
        ],
      };

      expect(parseMermaidCode(mermaid)).toEqual(expected);
    });
  });

  describe("エラーハンドリング", () => {
    test("空のコードを解析する", () => {
      expect(parseMermaidCode("")).toEqual({ nodes: [], edges: [] });
      expect(parseMermaidCode("   ")).toEqual({ nodes: [], edges: [] });
    });

    test("flowchartヘッダーのみの場合", () => {
      const mermaid = `flowchart TD`;
      expect(parseMermaidCode(mermaid)).toEqual({ nodes: [], edges: [] });
    });

    test("無効な形式の行を無視する", () => {
      const mermaid = `
        flowchart TD
        A[正常なノード]
        this is not valid mermaid syntax!!!
        B[別の正常なノード]
        A --> B
        invalid arrow syntax ===>>> C
        also invalid <--- D
      `;

      const expected: ParsedMermaidData = {
        nodes: [
          { id: "A", variableName: "A", label: "正常なノード", shapeType: "rectangle" },
          { id: "B", variableName: "B", label: "別の正常なノード", shapeType: "rectangle" },
        ],
        edges: [{ id: "A-B", source: "A", target: "B", label: "", arrowType: "arrow" }],
      };

      expect(parseMermaidCode(mermaid)).toEqual(expected);
    });
  });
});
