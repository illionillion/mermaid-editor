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

  it("列の型・PK/UK属性（公式仕様に準拠）", () => {
    const mermaid = `erDiagram
  Product {
    uuid id PK
    string name UK
    int price
    bool is_active
  }
`;
    const result = convertMermaidToERData(mermaid);
    const product = result.nodes.find((n) => n.name === "Product");
    expect(product?.columns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "id", type: "uuid", pk: true, uk: false }),
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
    int price
  }
`;
    const result = convertMermaidToERData(mermaid);
    const t = result.nodes.find((n) => n.name === "T");
    expect(t?.columns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "name", type: "varchar(255)" }),
        expect.objectContaining({ name: "price", type: "int" }),
      ])
    );
  });

  it("コンマを含む型名（decimal形式など）を正しく解析できる", () => {
    // decimal(10,2)などコンマを含む型名もサポートする
    const mermaidWithDecimal = `erDiagram
  T {
    varchar(255) name
    decimal(10,2) price
  }
`;
    const result = convertMermaidToERData(mermaidWithDecimal);
    const t = result.nodes.find((n) => n.name === "T");
    // decimal(10,2)行も正しく解析される
    expect(t?.columns).toEqual([
      expect.objectContaining({ name: "name", type: "varchar(255)" }),
      expect.objectContaining({ name: "price", type: "decimal(10,2)" }),
    ]);
    expect(t?.columns?.length).toBe(2); // name と price 両方
  });

  it("公式Mermaidでサポートされていない複数属性（PK UK）は解析できない", () => {
    // 実際のMermaidツールでPK UKの複数属性はエラーになる
    const mermaidWithMultipleAttributes = `erDiagram
  T {
    int id PK UK
    string name
  }
`;
    const result = convertMermaidToERData(mermaidWithMultipleAttributes);
    const t = result.nodes.find((n) => n.name === "T");
    // PK UK行は正規表現にマッチせず、無視される
    expect(t?.columns).toEqual([
      expect.objectContaining({ name: "name", type: "string", pk: false, uk: false }),
      // idは解析されない（正規表現にマッチしないため）
    ]);
    expect(t?.columns?.length).toBe(1); // nameのみ
  });

  it("空行がある場合の解析", () => {
    const mermaid = `erDiagram
  T {
    int id PK
    string name
    
    int value UK
  }
`;
    const result = convertMermaidToERData(mermaid);
    const t = result.nodes.find((n) => n.name === "T");
    expect(t?.columns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "id", type: "int", pk: true, uk: false }),
        expect.objectContaining({ name: "name", type: "string", pk: false, uk: false }),
        expect.objectContaining({ name: "value", type: "int", pk: false, uk: true }),
      ])
    );
  });

  it("公式Mermaidでサポートされていない不正なカーディナリティ記号は解析できない", () => {
    // 実際のMermaidツールでA -- Bはエラーになるため、このプロジェクトでも対応しない
    const mermaidWithBrokenCardinality = `erDiagram
  A {
    int id PK
  }
  B {
    int id PK
  }
  A -- B : "broken"
`;
    const result = convertMermaidToERData(mermaidWithBrokenCardinality);
    // 不正なカーディナリティ記号の行は正規表現にマッチせず、エッジは作成されない
    expect(result.edges.length).toBe(0);
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

  it("公式Mermaidでエラーになる壊れたノード定義は解析できない", () => {
    // 実際のMermaidツールで閉じ括弧が抜けた構文はエラーになる
    const mermaidWithBrokenSyntax = `erDiagram
  A {
    int id PK
  B {
    int id PK
  }
`;
    const result = convertMermaidToERData(mermaidWithBrokenSyntax);
    // 正常な構文のBのみ検出される（Aは閉じ括弧が抜けているため無視される）
    expect(result.nodes.length).toBe(1);
    expect(result.nodes[0].name).toBe("B");
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

  it("複数エッジが正しく処理される（同じテーブル間の複数リレーション）", () => {
    const mermaidWithMultipleEdges = `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : includes
    CUSTOMER {
        string id
        string name
        string email
    }
    ORDER {
        string id
        date orderDate
        string status
    }
    PRODUCT {
        string id
        string name
        float price
    }
    ORDER_ITEM {
        int quantity
        float price
    }
`;

    const result = convertMermaidToERData(mermaidWithMultipleEdges);

    // 4つのユニークなテーブルが正しくパースされること（重複排除後）
    const uniqueNodeNames = new Set(result.nodes.map((n) => n.name));
    expect(uniqueNodeNames.size).toBe(4);
    expect(Array.from(uniqueNodeNames)).toEqual(
      expect.arrayContaining(["CUSTOMER", "ORDER", "PRODUCT", "ORDER_ITEM"])
    );

    // 3つのエッジが全て作成されること（重複や上書きがないこと）
    expect(result.edges).toHaveLength(3);

    // 各エッジのsource, target, labelが正しいこと
    const edgeRelations = result.edges.map((e) => ({
      source: e.source,
      target: e.target,
      label: e.data?.label,
    }));

    expect(edgeRelations).toEqual(
      expect.arrayContaining([
        { source: "CUSTOMER", target: "ORDER", label: "places" },
        { source: "ORDER", target: "ORDER_ITEM", label: "contains" },
        { source: "PRODUCT", target: "ORDER_ITEM", label: "includes" },
      ])
    );

    // エッジIDがユニークであること
    const edgeIds = result.edges.map((e) => e.id);
    const uniqueIds = new Set(edgeIds);
    expect(uniqueIds.size).toBe(edgeIds.length); // 重複がないことを確認
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
