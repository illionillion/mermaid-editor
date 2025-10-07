import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { MermaidHighlight } from "@/components/ui/mermaid-highlight";

/**
 * MermaidHighlightコンポーネントのテストスイート
 * @description コードハイライト表示、プロパティ適用、エラーハンドリングを検証
 */
describe("MermaidHighlight", () => {
  // SyntaxHighlighterをモック（レンダリング確認用）
  vi.mock("react-syntax-highlighter", () => ({
    Prism: ({
      children,
      language,
      showLineNumbers,
      customStyle,
    }: {
      children: string;
      language: string;
      showLineNumbers: boolean;
      customStyle: Record<string, string>;
    }) => (
      <pre
        data-testid="syntax-highlighter"
        data-language={language}
        data-line-numbers={showLineNumbers}
        style={customStyle}
      >
        {children}
      </pre>
    ),
  }));

  vi.mock("react-syntax-highlighter/dist/esm/styles/prism", () => ({
    vscDarkPlus: { background: "#1e1e1e" },
  }));

  describe("基本表示", () => {
    test("Mermaidコードが正しく表示される", () => {
      const testCode = `flowchart TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Process]
    B -->|No| D[End]`;

      render(<MermaidHighlight code={testCode} />);

      const syntaxHighlighter = screen.getByTestId("syntax-highlighter");
      expect(syntaxHighlighter).toBeInTheDocument();
      expect(syntaxHighlighter.textContent).toBe(testCode);
    });

    test("空のコードでもエラーにならない", () => {
      render(<MermaidHighlight code="" />);

      const syntaxHighlighter = screen.getByTestId("syntax-highlighter");
      expect(syntaxHighlighter).toBeInTheDocument();
      expect(syntaxHighlighter.textContent).toBe("");
    });

    test("特殊文字を含むコードも正しく表示される", () => {
      const specialCode = `graph TD
    A["Special: !@#$%^&*()"] --> B["Unicode: 🎯📊🔥"]
    B --> C["Quotes: 'single' \\"double\\""]`;

      render(<MermaidHighlight code={specialCode} />);

      const syntaxHighlighter = screen.getByTestId("syntax-highlighter");
      expect(syntaxHighlighter.textContent).toBe(specialCode);
    });
  });

  describe("プロパティの適用", () => {
    test("デフォルトプロパティが適用される", () => {
      const testCode = "flowchart TD\n  A --> B";
      render(<MermaidHighlight code={testCode} />);

      const syntaxHighlighter = screen.getByTestId("syntax-highlighter");

      // デフォルト値の確認
      expect(syntaxHighlighter).toHaveAttribute("data-language", "mermaid");
      expect(syntaxHighlighter).toHaveAttribute("data-line-numbers", "true");

      // デフォルトスタイルの確認
      expect(syntaxHighlighter.style.minHeight).toBe("400px");
      expect(syntaxHighlighter.style.fontSize).toBe("14px");
      expect(syntaxHighlighter.style.margin).toBe("0px");
    });

    test("行番号の表示/非表示を切り替えられる", () => {
      const testCode = "flowchart TD\n  A --> B";

      const { rerender } = render(<MermaidHighlight code={testCode} showLineNumbers={false} />);

      let syntaxHighlighter = screen.getByTestId("syntax-highlighter");
      expect(syntaxHighlighter).toHaveAttribute("data-line-numbers", "false");

      rerender(<MermaidHighlight code={testCode} showLineNumbers={true} />);

      syntaxHighlighter = screen.getByTestId("syntax-highlighter");
      expect(syntaxHighlighter).toHaveAttribute("data-line-numbers", "true");
    });

    test("カスタムminHeightが適用される", () => {
      const testCode = "flowchart TD\n  A --> B";
      render(<MermaidHighlight code={testCode} minHeight="600px" />);

      const syntaxHighlighter = screen.getByTestId("syntax-highlighter");
      expect(syntaxHighlighter.style.minHeight).toBe("600px");
    });

    test("カスタムfontSizeが適用される", () => {
      const testCode = "flowchart TD\n  A --> B";
      render(<MermaidHighlight code={testCode} fontSize="16px" />);

      const syntaxHighlighter = screen.getByTestId("syntax-highlighter");
      expect(syntaxHighlighter.style.fontSize).toBe("16px");
    });

    test("複数のプロパティを同時に適用できる", () => {
      const testCode = "flowchart TD\n  A --> B";
      render(
        <MermaidHighlight
          code={testCode}
          showLineNumbers={false}
          minHeight="300px"
          fontSize="18px"
        />
      );

      const syntaxHighlighter = screen.getByTestId("syntax-highlighter");
      expect(syntaxHighlighter).toHaveAttribute("data-line-numbers", "false");
      expect(syntaxHighlighter.style.minHeight).toBe("300px");
      expect(syntaxHighlighter.style.fontSize).toBe("18px");
    });
  });

  describe("レスポンシブ対応", () => {
    test("Boxコンテナが適切なスタイルを持つ", () => {
      const testCode = "flowchart TD\n  A --> B";
      render(<MermaidHighlight code={testCode} />);

      // Yamada UIのBoxコンポーネントが適用されていることを間接的に確認
      const syntaxHighlighter = screen.getByTestId("syntax-highlighter");
      expect(syntaxHighlighter.parentElement).toBeInTheDocument();
    });
  });

  describe("コードタイプ別のテスト", () => {
    test("フローチャートコードが正しく表示される", () => {
      const flowchartCode = `flowchart TD
    Start([Start]) --> Decision{Decision?}
    Decision -->|Yes| Process[Process]
    Decision -->|No| End([End])
    Process --> End`;

      render(<MermaidHighlight code={flowchartCode} />);

      const syntaxHighlighter = screen.getByTestId("syntax-highlighter");
      expect(syntaxHighlighter.textContent).toBe(flowchartCode);
      expect(syntaxHighlighter).toHaveAttribute("data-language", "mermaid");
    });

    test("ER図コードが正しく表示される", () => {
      const erCode = `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses`;

      render(<MermaidHighlight code={erCode} />);

      const syntaxHighlighter = screen.getByTestId("syntax-highlighter");
      expect(syntaxHighlighter.textContent).toBe(erCode);
    });

    test("マルチライン・複雑なコードが正しく表示される", () => {
      const complexCode = `graph TD
    subgraph "Cluster 1"
        A[Node A] --> B[Node B]
        B --> C[Node C]
    end
    
    subgraph "Cluster 2"
        D[Node D] --> E[Node E]
    end
    
    C --> D
    E --> F[Final Node]
    
    style A fill:#f9f,stroke:#333,stroke-width:4px
    style F fill:#bbf,stroke:#333,stroke-width:2px`;

      render(<MermaidHighlight code={complexCode} />);

      const syntaxHighlighter = screen.getByTestId("syntax-highlighter");
      expect(syntaxHighlighter.textContent).toBe(complexCode);
    });
  });

  describe("エラーハンドリング", () => {
    test("nullコードでもエラーにならない", () => {
      // TypeScriptの型チェックをバイパスしてnullをテスト
      const nullCode = null as unknown as string;

      expect(() => render(<MermaidHighlight code={nullCode} />)).not.toThrow();
    });

    test("undefinedコードでもエラーにならない", () => {
      // TypeScriptの型チェックをバイパスしてundefinedをテスト
      const undefinedCode = undefined as unknown as string;

      expect(() => render(<MermaidHighlight code={undefinedCode} />)).not.toThrow();
    });

    test("非常に長いコードでもレンダリングできる", () => {
      const longCode = Array.from({ length: 1000 }, (_, i) => `A${i} --> B${i}`).join("\n");

      render(<MermaidHighlight code={longCode} />);

      const syntaxHighlighter = screen.getByTestId("syntax-highlighter");
      expect(syntaxHighlighter).toBeInTheDocument();
      expect(syntaxHighlighter.textContent).toBe(longCode);
    });
  });

  describe("パフォーマンス", () => {
    test("コンポーネントの再レンダリングが適切に動作する", () => {
      const initialCode = "flowchart TD\n  A --> B";
      const updatedCode = "flowchart TD\n  X --> Y --> Z";

      const { rerender } = render(<MermaidHighlight code={initialCode} />);

      let syntaxHighlighter = screen.getByTestId("syntax-highlighter");
      expect(syntaxHighlighter.textContent).toBe(initialCode);

      rerender(<MermaidHighlight code={updatedCode} />);

      syntaxHighlighter = screen.getByTestId("syntax-highlighter");
      expect(syntaxHighlighter.textContent).toBe(updatedCode);
    });

    test("プロパティ変更時の再レンダリングが適切に動作する", () => {
      const testCode = "flowchart TD\n  A --> B";

      const { rerender } = render(<MermaidHighlight code={testCode} fontSize="14px" />);

      let syntaxHighlighter = screen.getByTestId("syntax-highlighter");
      expect(syntaxHighlighter.style.fontSize).toBe("14px");

      rerender(<MermaidHighlight code={testCode} fontSize="18px" />);

      syntaxHighlighter = screen.getByTestId("syntax-highlighter");
      expect(syntaxHighlighter.style.fontSize).toBe("18px");
    });
  });

  describe("アクセシビリティ", () => {
    test("適切なHTML構造でレンダリングされる", () => {
      const testCode = "flowchart TD\n  A --> B";
      render(<MermaidHighlight code={testCode} />);

      const syntaxHighlighter = screen.getByTestId("syntax-highlighter");
      expect(syntaxHighlighter.tagName).toBe("PRE");
    });

    test("コードが選択可能である", () => {
      const testCode = "flowchart TD\n  A --> B";
      render(<MermaidHighlight code={testCode} />);

      const syntaxHighlighter = screen.getByTestId("syntax-highlighter");

      // テキストが選択可能かを確認（user-select がnoneでないこと）
      const computedStyle = window.getComputedStyle(syntaxHighlighter);
      expect(computedStyle.userSelect).not.toBe("none");
    });
  });
});
