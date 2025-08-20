import type { Node, Edge } from "@xyflow/react";
import { describe, it, expect } from "vitest";
import type { ERTableNodeProps } from "../components/node/er-table-node";
import type { ErCardinality } from "../types/types";
import { generateERDiagramMermaidCode } from "../utils/generate-mermaid-code";

describe("generateERDiagramMermaidCode", () => {
  it("シンプルな1対多リレーションのER図を正しくmermaid記法に変換できる", () => {
    const nodes: Node<ERTableNodeProps>[] = [
      {
        id: "1",
        type: "erTable",
        position: { x: 0, y: 0 },
        data: {
          name: "User",
          columns: [
            { name: "id", type: "int", pk: true, uk: false },
            { name: "name", type: "varchar(255)", pk: false, uk: false },
          ],
          onNameChange: () => {},
          onColumnsChange: () => {},
        },
      },
      {
        id: "2",
        type: "erTable",
        position: { x: 0, y: 0 },
        data: {
          name: "Post",
          columns: [
            { name: "id", type: "int", pk: true, uk: false },
            { name: "user_id", type: "int", pk: false, uk: false },
          ],
          onNameChange: () => {},
          onColumnsChange: () => {},
        },
      },
    ];
    const edges: Edge[] = [
      {
        id: "1-2",
        source: "1",
        target: "2",
        type: "erEdge",
        data: {
          label: "has",
          cardinality: "one-to-many" as ErCardinality,
        },
      },
    ];
    const expected = `erDiagram\n  User {\n    int id PK\n    varchar(255) name\n  }\n  Post {\n    int id PK\n    int user_id\n  }\n  User ||--o{ Post : has`;
    expect(generateERDiagramMermaidCode(nodes, edges)).toBe(expected);
  });

  it("全カーディナリティを網羅して正しく変換できる", () => {
    const nodes: Node<ERTableNodeProps>[] = [
      {
        id: "A",
        type: "erTable",
        position: { x: 0, y: 0 },
        data: {
          name: "A",
          columns: [{ name: "id", type: "int", pk: true, uk: false }],
          onNameChange: () => {},
          onColumnsChange: () => {},
        },
      },
      {
        id: "B",
        type: "erTable",
        position: { x: 0, y: 0 },
        data: {
          name: "B",
          columns: [{ name: "id", type: "int", pk: true, uk: false }],
          onNameChange: () => {},
          onColumnsChange: () => {},
        },
      },
    ];
    const cardinalities = [
      "one-to-one",
      "one-to-many",
      "many-to-one",
      "many-to-many",
      "zero-to-one",
      "one-to-zero",
    ] as const;
    const expectedSymbols = ["||--||", "||--o{", "}o--||", "}o--o{", "o|--||", "||--o|"];
    cardinalities.forEach((card, i) => {
      const edges: Edge[] = [
        {
          id: `A-B-${card}`,
          source: "A",
          target: "B",
          type: "erEdge",
          data: { label: card, cardinality: card },
        },
      ];
      const code = generateERDiagramMermaidCode(nodes, edges);
      expect(code).toContain(`A ${expectedSymbols[i]} B : ${card}`);
    });
  });

  it("複数テーブル・複数エッジ・行数バリエーションを正しく変換できる", () => {
    const nodes: Node<ERTableNodeProps>[] = [
      {
        id: "1",
        type: "erTable",
        position: { x: 0, y: 0 },
        data: {
          name: "User",
          columns: [
            { name: "id", type: "int", pk: true, uk: false },
            { name: "name", type: "varchar(255)", pk: false, uk: false },
            { name: "email", type: "varchar(255)", pk: false, uk: false },
          ],
          onNameChange: () => {},
          onColumnsChange: () => {},
        },
      },
      {
        id: "2",
        type: "erTable",
        position: { x: 0, y: 0 },
        data: {
          name: "Post",
          columns: [
            { name: "id", type: "int", pk: true, uk: false },
            { name: "user_id", type: "int", pk: false, uk: false },
          ],
          onNameChange: () => {},
          onColumnsChange: () => {},
        },
      },
      {
        id: "3",
        type: "erTable",
        position: { x: 0, y: 0 },
        data: {
          name: "Comment",
          columns: [
            { name: "id", type: "int", pk: true, uk: false },
            { name: "post_id", type: "int", pk: false, uk: false },
            { name: "body", type: "text", pk: false, uk: false },
          ],
          onNameChange: () => {},
          onColumnsChange: () => {},
        },
      },
    ];
    const edges: Edge[] = [
      {
        id: "1-2",
        source: "1",
        target: "2",
        type: "erEdge",
        data: { label: "has", cardinality: "one-to-many" },
      },
      {
        id: "2-3",
        source: "2",
        target: "3",
        type: "erEdge",
        data: { label: "has", cardinality: "one-to-many" },
      },
    ];
    const code = generateERDiagramMermaidCode(nodes, edges);
    expect(code).toContain(
      "User {\n    int id PK\n    varchar(255) name\n    varchar(255) email\n  }"
    );
    expect(code).toContain("Post {\n    int id PK\n    int user_id\n  }");
    expect(code).toContain("Comment {\n    int id PK\n    int post_id\n    text body\n  }");
    expect(code).toContain("User ||--o{ Post : has");
    expect(code).toContain("Post ||--o{ Comment : has");
  });

  it("UK属性が正しく出力される", () => {
    const nodes: Node<ERTableNodeProps>[] = [
      {
        id: "1",
        type: "erTable",
        position: { x: 0, y: 0 },
        data: {
          name: "User",
          columns: [
            { name: "id", type: "int", pk: false, uk: true },
            { name: "name", type: "varchar(255)", pk: false, uk: false },
          ],
          onNameChange: () => {},
          onColumnsChange: () => {},
        },
      },
    ];
    const code = generateERDiagramMermaidCode(nodes, []);
    expect(code).toContain("int id UK");
  });

  it("PKとUKが両方trueの場合、PKのみ出力される", () => {
    const nodes: Node<ERTableNodeProps>[] = [
      {
        id: "1",
        type: "erTable",
        position: { x: 0, y: 0 },
        data: {
          name: "User",
          columns: [{ name: "id", type: "int", pk: true, uk: true }],
          onNameChange: () => {},
          onColumnsChange: () => {},
        },
      },
    ];
    const code = generateERDiagramMermaidCode(nodes, []);
    expect(code).toContain("int id PK");
    expect(code).not.toContain("UK");
  });

  it("カラム名・型が空文字の場合でも出力される", () => {
    const nodes: Node<ERTableNodeProps>[] = [
      {
        id: "1",
        type: "erTable",
        position: { x: 0, y: 0 },
        data: {
          name: "User",
          columns: [{ name: "", type: "", pk: true, uk: false }],
          onNameChange: () => {},
          onColumnsChange: () => {},
        },
      },
    ];
    const code = generateERDiagramMermaidCode(nodes, []);
    expect(code).toContain("PK"); // 空文字でもPKは出力される
  });

  it("ノード・エッジが空配列の場合、erDiagramのみ出力", () => {
    const code = generateERDiagramMermaidCode([], []);
    expect(code).toBe("erDiagram");
  });

  it("エッジのlabelが空文字や未指定の場合、relationが出力される", () => {
    const nodes: Node<ERTableNodeProps>[] = [
      {
        id: "A",
        type: "erTable",
        position: { x: 0, y: 0 },
        data: {
          name: "A",
          columns: [{ name: "id", type: "int", pk: true, uk: false }],
          onNameChange: () => {},
          onColumnsChange: () => {},
        },
      },
      {
        id: "B",
        type: "erTable",
        position: { x: 0, y: 0 },
        data: {
          name: "B",
          columns: [{ name: "id", type: "int", pk: true, uk: false }],
          onNameChange: () => {},
          onColumnsChange: () => {},
        },
      },
    ];
    const edges: Edge[] = [
      {
        id: "A-B",
        source: "A",
        target: "B",
        type: "erEdge",
        data: {},
      },
      {
        id: "A-B2",
        source: "A",
        target: "B",
        type: "erEdge",
        data: { label: "" },
      },
    ];
    const code = generateERDiagramMermaidCode(nodes, edges);
    expect(code).toContain("A ||--o{ B : relation");
  });

  it("同名テーブルが複数存在する場合も出力される", () => {
    const nodes: Node<ERTableNodeProps>[] = [
      {
        id: "1",
        type: "erTable",
        position: { x: 0, y: 0 },
        data: {
          name: "User",
          columns: [{ name: "id", type: "int", pk: true, uk: false }],
          onNameChange: () => {},
          onColumnsChange: () => {},
        },
      },
      {
        id: "2",
        type: "erTable",
        position: { x: 0, y: 0 },
        data: {
          name: "User",
          columns: [{ name: "id2", type: "int", pk: false, uk: true }],
          onNameChange: () => {},
          onColumnsChange: () => {},
        },
      },
    ];
    const code = generateERDiagramMermaidCode(nodes, []);
    expect(code.match(/User \{/g)?.length).toBe(2);
  });

  it("カラムが1つもないテーブルも出力される", () => {
    const nodes: Node<ERTableNodeProps>[] = [
      {
        id: "1",
        type: "erTable",
        position: { x: 0, y: 0 },
        data: {
          name: "EmptyTable",
          columns: [],
          onNameChange: () => {},
          onColumnsChange: () => {},
        },
      },
    ];
    const code = generateERDiagramMermaidCode(nodes, []);
    expect(code).toContain("EmptyTable {\n  }");
  });
});
