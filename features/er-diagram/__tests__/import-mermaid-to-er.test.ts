import { describe, it, expect, vi } from "vitest";
import { convertMermaidToERData, convertParsedDataToNodes } from "../utils/import-mermaid-to-er";

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
        id: "User",
        name: "User",
        columns: expect.arrayContaining([
          expect.objectContaining({ name: "id", type: "int", pk: true }),
          expect.objectContaining({ name: "name", type: "varchar(255)", pk: false }),
        ]),
      }),
      expect.objectContaining({
        id: "Post",
        name: "Post",
        columns: expect.arrayContaining([
          expect.objectContaining({ name: "id", type: "int", pk: true }),
          expect.objectContaining({ name: "user_id", type: "int", pk: false }),
        ]),
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
    const product = result.nodes.find((n) => n.name === "Product");
    expect(product?.columns).toEqual(
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
    const a = result.nodes.find((n) => n.name === "A");
    expect(a?.columns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "id", type: "int", pk: true, uk: false }),
        expect.objectContaining({ name: "code", type: "string", pk: false, uk: true }),
        expect.objectContaining({ name: "desc", type: "string", pk: false, uk: false }),
      ])
    );
  });

  it("型名にカッコやカンマを含む場合", () => {
    const mermaid = `erDiagram
  T {
    varchar(255) name
    decimal(10,2) price
  }
`;
    const result = convertMermaidToERData(mermaid);
    const t = result.nodes.find((n) => n.name === "T");
    expect(t?.columns).toEqual(
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
    const t = result.nodes.find((n) => n.name === "T");
    expect(t?.columns).toEqual(
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
    expect(convertMermaidToERData(onlyEdge).nodes.length).toBe(2); // A, Bノードが自動生成される
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
    expect(result.nodes.length).toBe(2); // AとBの両方が検出される
    // Aは壊れた定義だが、Bは正常に検出される
    const nodeNames = result.nodes.map((n) => n.name);
    expect(nodeNames).toContain("A");
    expect(nodeNames).toContain("B");
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

describe("convertParsedDataToNodes", () => {
  it("ParsedERTableDataをReactFlowのNode型に変換", () => {
    const parsedData = [
      {
        id: "User",
        name: "User",
        columns: [
          { name: "id", type: "int", pk: true, uk: false },
          { name: "name", type: "string", pk: false, uk: false },
        ],
      },
      {
        id: "Post",
        name: "Post",
        columns: [
          { name: "id", type: "int", pk: true, uk: false },
          { name: "user_id", type: "int", pk: false, uk: false },
        ],
      },
    ];

    const mockHandlers = {
      onNameChange: vi.fn(),
      onColumnsChange: vi.fn(),
    };

    const result = convertParsedDataToNodes(parsedData, mockHandlers);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: "User",
      type: "erTable",
      position: { x: 0, y: 0 },
      data: {
        name: "User",
        columns: [
          { name: "id", type: "int", pk: true, uk: false },
          { name: "name", type: "string", pk: false, uk: false },
        ],
        onNameChange: expect.any(Function),
        onColumnsChange: expect.any(Function),
      },
    });

    expect(result[1]).toEqual({
      id: "Post",
      type: "erTable",
      position: { x: 300, y: 0 },
      data: {
        name: "Post",
        columns: [
          { name: "id", type: "int", pk: true, uk: false },
          { name: "user_id", type: "int", pk: false, uk: false },
        ],
        onNameChange: expect.any(Function),
        onColumnsChange: expect.any(Function),
      },
    });
  });

  it("ハンドラーが正しく呼び出される", () => {
    const parsedData = [
      {
        id: "Test",
        name: "Test",
        columns: [],
      },
    ];

    const mockHandlers = {
      onNameChange: vi.fn(),
      onColumnsChange: vi.fn(),
    };

    const result = convertParsedDataToNodes(parsedData, mockHandlers);

    // onNameChangeハンドラーをテスト
    result[0].data.onNameChange("NewName");
    expect(mockHandlers.onNameChange).toHaveBeenCalledWith("Test", "NewName");

    // onColumnsChangeハンドラーをテスト
    const newColumns = [{ name: "id", type: "int", pk: true, uk: false }];
    result[0].data.onColumnsChange(newColumns);
    expect(mockHandlers.onColumnsChange).toHaveBeenCalledWith("Test", newColumns);
  });
});
