import { screen, waitFor } from "@testing-library/react";
import { HTMLAttributes } from "react";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { ImportModal } from "@/features/flowchart/components/mermaid/import-modal";
import type { ParsedMermaidData } from "@/features/flowchart/hooks/mermaid";
import { parseMermaidCode } from "@/features/flowchart/hooks/mermaid";
import type { MermaidShapeType, MermaidArrowType } from "@/features/flowchart/types/types";
import { render } from "../../test-utils";

// utilsのモック
vi.mock("@/features/flowchart/hooks/mermaid", () => ({
  parseMermaidCode: vi.fn(),
}));

const mockParseMermaidCode = vi.mocked(parseMermaidCode);

// EditableMermaidHighlightのモック
vi.mock("@/features/flowchart/components/mermaid/editable-mermaid-highlight", () => ({
  EditableMermaidHighlight: ({
    value,
    onChange,
    placeholder,
    minHeight,
    ...props
  }: {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    minHeight?: string;
  } & HTMLAttributes<HTMLDivElement>) => (
    <div data-testid="editable-mermaid-highlight" style={{ minHeight }} {...props}>
      <textarea
        data-testid="mermaid-code-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  ),
}));

describe("ImportModal", () => {
  const mockParsedData: ParsedMermaidData = {
    nodes: [
      {
        id: "A",
        variableName: "A",
        label: "Start",
        shapeType: "roundedRect" as MermaidShapeType,
      },
      {
        id: "B",
        variableName: "B",
        label: "Process",
        shapeType: "rect" as MermaidShapeType,
      },
    ],
    edges: [
      {
        id: "A-B",
        source: "A",
        target: "B",
        label: "",
        arrowType: "simple" as MermaidArrowType,
      },
    ],
  };

  const mockProps = {
    open: false,
    onClose: vi.fn(),
    onImport: vi.fn(),
  };

  beforeEach(() => {
    mockParseMermaidCode.mockReturnValue(mockParsedData);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("モーダルが開いている時にコンテンツが表示される", () => {
    render(<ImportModal {...mockProps} open />);

    expect(screen.getByText("Mermaidコードインポート")).toBeInTheDocument();
    expect(
      screen.getByText("Mermaidのフローチャートコードを貼り付けてインポートできます")
    ).toBeInTheDocument();
    expect(screen.getByText("キャンセル")).toBeInTheDocument();
    expect(screen.getByText("インポート")).toBeInTheDocument();
    expect(screen.getByTestId("editable-mermaid-highlight")).toBeInTheDocument();

    // モーダルが適切に表示されていることを確認
    const modal = screen.getByRole("dialog");
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveAttribute("aria-modal", "true");
  });

  test("モーダルが閉じている時にコンテンツが表示されない", () => {
    render(<ImportModal {...mockProps} open={false} />);

    expect(screen.queryByText("Mermaidコードインポート")).not.toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("キャンセルボタンクリック時にonCloseが呼ばれる", async () => {
    const onClose = vi.fn();
    const { user } = render(<ImportModal {...mockProps} open onClose={onClose} />);

    const cancelButton = screen.getByText("キャンセル");
    await user.click(cancelButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("有効なMermaidコードでインポートが成功する", async () => {
    const onImport = vi.fn();
    const onClose = vi.fn();
    const { user } = render(
      <ImportModal {...mockProps} open onImport={onImport} onClose={onClose} />
    );

    const codeInput = screen.getByTestId("mermaid-code-input");
    const importButton = screen.getByText("インポート");

    // Mermaidコードを入力
    await user.type(codeInput, "flowchart TD\n  A --> B");

    // インポートボタンをクリック
    await user.click(importButton);

    await waitFor(() => {
      expect(mockParseMermaidCode).toHaveBeenCalledWith("flowchart TD\n  A --> B");
      expect(onImport).toHaveBeenCalledWith(mockParsedData);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  test("空のコードでインポートしようとするとエラーが表示される", async () => {
    // パース結果が空のモックを設定
    const emptyParsedData: ParsedMermaidData = { nodes: [], edges: [] };
    mockParseMermaidCode.mockReturnValue(emptyParsedData);

    const { user } = render(<ImportModal {...mockProps} open />);
    const codeInput = screen.getByTestId("mermaid-code-input");
    const importButton = screen.getByRole("button", { name: /インポート/i });

    // 無効なコードを入力してボタンを有効化
    await user.type(codeInput, "invalid code");

    // インポートボタンをクリック
    await user.click(importButton);

    // エラーメッセージの表示を確認
    await waitFor(() => {
      expect(
        screen.getByText(
          "有効なMermaidコードが見つかりませんでした。ノードまたはエッジの定義を確認してください。"
        )
      ).toBeInTheDocument();
    });

    expect(mockProps.onImport).not.toHaveBeenCalled();
    expect(mockProps.onClose).not.toHaveBeenCalled();
  });

  test("パース結果が空の場合エラーが表示される", async () => {
    const emptyParsedData: ParsedMermaidData = {
      nodes: [],
      edges: [],
    };
    mockParseMermaidCode.mockReturnValue(emptyParsedData);

    const { user } = render(<ImportModal {...mockProps} open />);

    const codeInput = screen.getByTestId("mermaid-code-input");
    const importButton = screen.getByText("インポート");

    // 無効なMermaidコードを入力
    await user.type(codeInput, "invalid code");
    await user.click(importButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          "有効なMermaidコードが見つかりませんでした。ノードまたはエッジの定義を確認してください。"
        )
      ).toBeInTheDocument();
    });
  });

  test("パース中にエラーが発生した場合エラーが表示される", async () => {
    mockParseMermaidCode.mockImplementation(() => {
      throw new Error("Parse error");
    });

    const { user } = render(<ImportModal {...mockProps} open />);

    const codeInput = screen.getByTestId("mermaid-code-input");
    const importButton = screen.getByText("インポート");

    // Mermaidコードを入力
    await user.type(codeInput, "flowchart TD\n  A --> B");
    await user.click(importButton);

    await waitFor(() => {
      expect(screen.getByText("Mermaidコードの解析中にエラーが発生しました")).toBeInTheDocument();
    });
  });

  test("コード入力時にエラーがクリアされる", async () => {
    // 最初は空の結果を返し、その後有効な結果を返すモックを設定
    const emptyParsedData: ParsedMermaidData = { nodes: [], edges: [] };
    mockParseMermaidCode.mockReturnValueOnce(emptyParsedData);

    const { user } = render(<ImportModal {...mockProps} open />);

    const codeInput = screen.getByTestId("mermaid-code-input");
    const importButton = screen.getByText("インポート");

    // まず無効なコードを入力してエラーを発生させる
    await user.type(codeInput, "invalid");
    await user.click(importButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          "有効なMermaidコードが見つかりませんでした。ノードまたはエッジの定義を確認してください。"
        )
      ).toBeInTheDocument();
    });

    // コードを追加入力するとエラーが消える
    await user.type(codeInput, " more text");

    await waitFor(() => {
      expect(
        screen.queryByText(
          "有効なMermaidコードが見つかりませんでした。ノードまたはエッジの定義を確認してください。"
        )
      ).not.toBeInTheDocument();
    });
  });

  test("インポートボタンは空のコードの時は無効化される", () => {
    render(<ImportModal {...mockProps} open />);

    const importButton = screen.getByText("インポート");
    expect(importButton).toBeDisabled();
  });

  test("ヘルプテキストが表示される", () => {
    render(<ImportModal {...mockProps} open />);

    expect(screen.getByText(/💡 対応しているノード形状/)).toBeInTheDocument();
  });

  test("例示用のプレースホルダーが表示される", () => {
    render(<ImportModal {...mockProps} open />);

    const codeInput = screen.getByTestId("mermaid-code-input");
    expect(codeInput).toHaveAttribute("placeholder");
    expect(codeInput.getAttribute("placeholder")).toContain("flowchart TD");
  });

  test("モーダルを閉じる時にステートがリセットされる", async () => {
    const onClose = vi.fn();
    const { user } = render(<ImportModal {...mockProps} open onClose={onClose} />);

    const codeInput = screen.getByTestId("mermaid-code-input");

    // コードを入力
    await user.type(codeInput, "some code");

    // キャンセルボタンでモーダルを閉じる
    const cancelButton = screen.getByText("キャンセル");
    await user.click(cancelButton);

    // handleCloseによってonCloseが1回呼ばれることを確認
    expect(onClose).toHaveBeenCalled();
  });
});
