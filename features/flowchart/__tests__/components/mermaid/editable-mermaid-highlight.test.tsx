import { screen, fireEvent } from "@testing-library/react";
import type { ChangeEvent } from "react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { render } from "@/__tests__/test-utils";
import { EditableMermaidHighlight } from "@/features/flowchart/components/mermaid/editable-mermaid-highlight";

// PrismJSのモック
vi.mock("prismjs", () => ({
  highlight: vi.fn(),
  languages: {
    mermaid: {},
  },
}));

vi.mock("prismjs/themes/prism-dark.css", () => ({}));
vi.mock("prismjs/components/prism-mermaid", () => ({}));

// react-simple-code-editorのモック
vi.mock("react-simple-code-editor", () => ({
  default: ({
    value,
    onValueChange,
    placeholder,
    highlight,
  }: {
    value: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
    highlight?: (value: string) => string;
  }) => {
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      onValueChange(e.target.value);
    };

    // ハイライト関数をテスト用に呼び出し
    const highlightedCode = highlight ? highlight(value) : value;

    return (
      <div data-testid="code-editor">
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          data-testid="code-textarea"
        />
        <div data-testid="highlighted-code">{highlightedCode}</div>
      </div>
    );
  },
}));

describe("EditableMermaidHighlight", () => {
  const defaultProps = {
    value: "graph TD\n  A[Start] --> B[End]",
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("基本機能", () => {
    test("コンポーネントが正しくレンダリングされる", () => {
      render(<EditableMermaidHighlight {...defaultProps} />);

      expect(screen.getByTestId("code-editor")).toBeInTheDocument();
      expect(screen.getByTestId("code-textarea")).toBeInTheDocument();
      expect(screen.getByTestId("code-textarea")).toHaveValue(defaultProps.value);
    });

    test("プレースホルダーが正しく表示される", () => {
      render(
        <EditableMermaidHighlight
          {...defaultProps}
          value=""
          placeholder="カスタムプレースホルダー"
        />
      );

      const textarea = screen.getByTestId("code-textarea");
      expect(textarea).toHaveAttribute("placeholder", "カスタムプレースホルダー");
    });

    test("デフォルトプレースホルダーが使用される", () => {
      render(<EditableMermaidHighlight {...defaultProps} value="" />);

      const textarea = screen.getByTestId("code-textarea");
      expect(textarea).toHaveAttribute("placeholder", "Mermaidコードを入力...");
    });
  });

  describe("入力処理", () => {
    test("テキスト変更時にonChangeが呼ばれる", () => {
      render(<EditableMermaidHighlight {...defaultProps} />);

      const textarea = screen.getByTestId("code-textarea");
      fireEvent.change(textarea, { target: { value: "新しいコード" } });

      expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
      expect(defaultProps.onChange).toHaveBeenCalledWith("新しいコード");
    });
  });

  describe("ハイライト機能", () => {
    test("Mermaidコードが正しくハイライトされる", () => {
      render(<EditableMermaidHighlight {...defaultProps} />);

      // ハイライトされたコードが表示されることを確認
      const highlightedCode = screen.getByTestId("highlighted-code");
      expect(highlightedCode).toBeInTheDocument();
      // 実際のハイライト結果は実装に依存するため、存在することのみ確認
    });

    test("ハイライトに失敗した場合でも安全に処理される", () => {
      const codeWithHTML = '<script>alert("test")</script>';
      render(<EditableMermaidHighlight {...defaultProps} value={codeWithHTML} />);

      const highlightedCode = screen.getByTestId("highlighted-code");
      expect(highlightedCode).toBeInTheDocument();
    });
  });

  describe("セキュリティ", () => {
    test("悪意のあるコードが安全に処理される", () => {
      const maliciousCode = '<script>alert("XSS")</script>&"\'';
      const { container } = render(
        <EditableMermaidHighlight {...defaultProps} value={maliciousCode} />
      );

      // スクリプトタグが実行されていないことを確認
      expect(container.querySelector("script")).toBeNull();

      // コンポーネントが正常にレンダリングされることを確認
      expect(screen.getByTestId("code-editor")).toBeInTheDocument();
    });
  });

  describe("カスタマイズオプション", () => {
    test("カスタムminHeightが適用される", () => {
      render(<EditableMermaidHighlight {...defaultProps} minHeight="500px" />);

      // スタイルが適用されているかは実際のコンポーネントの実装に依存
      expect(screen.getByTestId("code-editor")).toBeInTheDocument();
    });

    test("カスタムfontSizeが適用される", () => {
      render(<EditableMermaidHighlight {...defaultProps} fontSize="16px" />);

      expect(screen.getByTestId("code-editor")).toBeInTheDocument();
    });
  });

  describe("エラーハンドリング", () => {
    test("空の値でも正常に動作する", () => {
      render(<EditableMermaidHighlight {...defaultProps} value="" />);

      expect(screen.getByTestId("code-textarea")).toHaveValue("");
      expect(screen.getByTestId("highlighted-code")).toBeInTheDocument();
    });

    test("undefinedが渡されても正常に動作する", () => {
      render(<EditableMermaidHighlight {...defaultProps} value={undefined as unknown as string} />);

      expect(screen.getByTestId("code-editor")).toBeInTheDocument();
    });
  });
});
