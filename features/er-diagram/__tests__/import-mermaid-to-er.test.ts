import type { Node } from "@xyflow/react";
import { describe, it, expect } from "vitest";
import type { ERTableNodeProps } from "../components/node/er-table-node";
import { convertMermaidToERData } from "../utils/import-mermaid-to-er";

describe("convertMermaidToERData", () => {
  // --- 正常系 ---
  it("1対多リレーション（one-to-many）の変換", () => {
    const mermaid = `erDiagram
  User {
    int id PK
    varchar(255) name
  }
  Post {
    int id PK
    int user_id
  }
  User ||--o{ Post : "has posts"
`;
    const result = convertMermaidToERData(mermaid);
    expect(result.nodes).toEqual([
      expect.objectContaining({
        data: expect.objectContaining({
          name: "User",
          columns: expect.arrayContaining([
            expect.objectContaining({ name: "id", type: "int", pk: true }),
            expect.objectContaining({ name: "name", type: "varchar(255)", pk: false }),
          ]),
        }),
      }),
      expect.objectContaining({
        data: expect.objectContaining({
          name: "Post",
          columns: expect.arrayContaining([
            expect.objectContaining({ name: "id", type: "int", pk: true }),
            expect.objectContaining({ name: "user_id", type: "int", pk: false }),
          ]),
        }),
      }),
    ]);
    expect(result.edges.length).toBe(1);
    expect(result.edges[0].data?.cardinality).toBe("one-to-many");
  });

  it("多対多リレーション（many-to-many）の変換", () => {
    const mermaid = `erDiagram
  Student {
    int id PK
    string name
  }
  Course {
    int id PK
    string title
  }
  Student }o--o{ Course : "enrolls"
`;
    const result = convertMermaidToERData(mermaid);
    expect(result.edges[0].data?.cardinality).toBe("many-to-many");
  });

  it("one-to-oneリレーションの変換", () => {
    const mermaid = `erDiagram
  A {
    int id PK
  }
  B {
    int id PK
  }
  A ||--|| B : "rel"
`;
    const result = convertMermaidToERData(mermaid);
    expect(result.edges[0].data?.cardinality).toBe("one-to-one");
  });

  it("many-to-oneリレーションの変換", () => {
    const mermaid = `erDiagram
  A {
    int id PK
  }
  B {
    int id PK
    int a_id
  }
  A }o--|| B : "rel"
`;
    const result = convertMermaidToERData(mermaid);
    expect(result.edges[0].data?.cardinality).toBe("many-to-one");
  });

  it("zero-to-one, one-to-zeroリレーションの変換", () => {
    const mermaid = `erDiagram
  A {
    int id PK
  }
  B {
    int id PK
  }
  A o|--|| B : "zero-to-one"
  B ||--o| A : "one-to-zero"
`;
    const result = convertMermaidToERData(mermaid);
    expect(result.edges[0].data?.cardinality).toBe("zero-to-one");
    expect(result.edges[1].data?.cardinality).toBe("one-to-zero");
  });

  it("列の型・PK/UK/複数属性の組み合わせ", () => {
    const mermaid = `erDiagram
  Product {
    uuid id PK UK
    string name UK
    int price
    bool is_active
  }
`;
    const result = convertMermaidToERData(mermaid);
    const product = result.nodes.find((n: Node<ERTableNodeProps>) => n.data.name === "Product");
    expect(product?.data.columns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "id", type: "uuid", pk: true, uk: true }),
        expect.objectContaining({ name: "name", type: "string", pk: false, uk: true }),
        expect.objectContaining({ name: "price", type: "int", pk: false, uk: false }),
        expect.objectContaining({ name: "is_active", type: "bool", pk: false, uk: false }),
      ])
    );
  });

  it("属性が混在する場合（PK/UK/なしが混在）", () => {
    const mermaid = `erDiagram
  A {
    int id PK
    string code UK
    string desc
  }
  B {
    int id PK
    int a_id
  }
  A ||--o{ B : "rel"
`;
    const result = convertMermaidToERData(mermaid);
    const a = result.nodes.find((n: Node<ERTableNodeProps>) => n.data.name === "A");
    expect(a?.data.columns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "id", type: "int", pk: true, uk: false }),
        expect.objectContaining({ name: "code", type: "string", pk: false, uk: true }),
        expect.objectContaining({ name: "desc", type: "string", pk: false, uk: false }),
      ])
    );
  });

  it("型名に空白やカッコを含む場合", () => {
    const mermaid = `erDiagram
  T {
    varchar(255) name
    decimal(10,2) price
  }
`;
    const result = convertMermaidToERData(mermaid);
    const t = result.nodes.find((n: Node<ERTableNodeProps>) => n.data.name === "T");
    expect(t?.data.columns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "name", type: "varchar(255)" }),
        expect.objectContaining({ name: "price", type: "decimal(10,2)" }),
      ])
    );
  });

  it("PK/UK両方持つ列や属性抜け・空行", () => {
    const mermaid = `erDiagram
  T {
    int id PK UK
    string name
    
    int value UK
  }
`;
    const result = convertMermaidToERData(mermaid);
    const t = result.nodes.find((n: Node<ERTableNodeProps>) => n.data.name === "T");
    expect(t?.data.columns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "id", type: "int", pk: true, uk: true }),
        expect.objectContaining({ name: "name", type: "string", pk: false, uk: false }),
        expect.objectContaining({ name: "value", type: "int", pk: false, uk: true }),
      ])
    );
  });

  it("不正なカーディナリティ記号（未定義記号はone-to-many扱い）", () => {
    const mermaid = `erDiagram
  A {
    int id PK
  }
  B {
    int id PK
  }
  A -- B : "broken"
`;
    const result = convertMermaidToERData(mermaid);
    expect(result.edges[0].data?.cardinality).toBe("one-to-many");
  });

  // --- 異常系 ---
  it("空文字や空白のみ", () => {
    expect(convertMermaidToERData("")).toEqual({ nodes: [], edges: [] });
    expect(convertMermaidToERData("   ")).toEqual({ nodes: [], edges: [] });
  });

  it("erDiagramヘッダーのみ", () => {
    expect(convertMermaidToERData("erDiagram")).toEqual({ nodes: [], edges: [] });
  });

  it("ノード定義だけ・エッジだけ", () => {
    const onlyNode = `erDiagram
  A {
    int id PK
  }
`;
    expect(convertMermaidToERData(onlyNode).edges).toEqual([]);
    const onlyEdge = `erDiagram
  A ||--o{ B : rel
`;
    expect(convertMermaidToERData(onlyEdge).nodes.length).toBe(0);
    expect(convertMermaidToERData(onlyEdge).edges.length).toBe(1);
  });

  it("カッコ抜けや壊れたノード定義", () => {
    const mermaid = `erDiagram
  A {
    int id PK
  B {
    int id PK
  }
`;
    const result = convertMermaidToERData(mermaid);
    expect(result.nodes.length).toBe(1);
    expect(result.nodes[0].data.name).toBe("B");
  });

  it("erDiagramブロックがない", () => {
    const mermaid = `flowchart TD
A-->B
`;
    expect(convertMermaidToERData(mermaid)).toEqual({ nodes: [], edges: [] });
  });

  it("完全に壊れた記法や意味不明な文字列", () => {
    expect(convertMermaidToERData("this is not mermaid")).toEqual({ nodes: [], edges: [] });
    expect(convertMermaidToERData("1234567890!@#$%^&*()")).toEqual({ nodes: [], edges: [] });
  });
});
