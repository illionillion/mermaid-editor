import { screen } from "@testing-library/react";
import type { HTMLAttributes } from "react";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@/__tests__/test-utils";
import { DownloadModal } from "@/features/flowchart/components/mermaid/download-modal";
import type { FlowData } from "@/features/flowchart/hooks/flow-helpers";
import { generateMermaidCode } from "@/features/flowchart/hooks/mermaid";

// グローバルオブジェクトの設定
Object.defineProperty(global, "URL", {
  value: {
    createObjectURL: vi.fn(),
    revokeObjectURL: vi.fn(),
  },
  writable: true,
});

// utilsのモック
vi.mock("@/features/flowchart/hooks/mermaid", () => ({
  generateMermaidCode: vi.fn(),
}));

const mockGenerateMermaidCode = vi.mocked(generateMermaidCode);

// MermaidHighlightのモック
vi.mock("@/components/ui/mermaid-highlight", () => ({
  MermaidHighlight: ({ code }: { code: string }) => (
    <div data-testid="mermaid-highlight">{code}</div>
  ),
}));

// CopyButtonのモック
vi.mock("@/components/ui/copy-button", () => ({
  CopyButton: ({ value, ...props }: { value: string } & HTMLAttributes<HTMLButtonElement>) => (
    <button data-testid="copy-button" data-value={value} {...props}>
      コピー
    </button>
  ),
}));

describe("DownloadModal", () => {
  const mockFlowData: FlowData = {
    nodes: [
      {
        id: "1",
        type: "default",
        position: { x: 0, y: 0 },
        data: { label: "Node A" },
      },
      {
        id: "2",
        type: "default",
        position: { x: 100, y: 100 },
        data: { label: "Node B" },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        data: {},
      },
    ],
  };

  const mockProps = {
    open: false, // デフォルトは閉じている状態
    onClose: vi.fn(),
    flowData: mockFlowData,
  };

  beforeEach(() => {
    mockGenerateMermaidCode.mockReturnValue("flowchart TD\n  A --> B");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("モーダルが開いている時にコンテンツが表示される", () => {
    render(<DownloadModal {...mockProps} open />);

    expect(screen.getByText("生成されたMermaidコード")).toBeInTheDocument();
    expect(screen.getByText("ダウンロード")).toBeInTheDocument();
    expect(screen.getByTestId("mermaid-highlight")).toBeInTheDocument();
    expect(screen.getByTestId("copy-button")).toBeInTheDocument();

    // モーダルが適切に表示されていることを確認
    const modal = screen.getByRole("dialog");
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveAttribute("aria-modal", "true");
  });

  test("モーダルが閉じている時にコンテンツが表示されない", () => {
    render(<DownloadModal {...mockProps} open={false} />);

    expect(screen.queryByText("生成されたMermaidコード")).not.toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("閉じるボタンがクリックされた時にonCloseが呼ばれる", async () => {
    const onClose = vi.fn();
    const { user } = render(<DownloadModal {...mockProps} open onClose={onClose} />);

    const closeButton = screen.getByRole("button", { name: /close modal/i });
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("MermaidHighlightコンポーネントに正しいコードが渡される", () => {
    render(<DownloadModal {...mockProps} open />);

    const highlight = screen.getByTestId("mermaid-highlight");
    expect(highlight.textContent).toMatch(/flowchart TD[\s\S]*A --> B/);
  });

  test("コピーボタンに正しいMermaidコードが渡される", () => {
    render(<DownloadModal {...mockProps} open />);

    const copyButton = screen.getByTestId("copy-button");
    expect(copyButton).toHaveAttribute("data-value", "flowchart TD\n  A --> B");
  });

  test("generateMermaidCodeが適切なパラメータで呼ばれる", () => {
    render(<DownloadModal {...mockProps} open />);

    // 初期レンダリング時にTDで呼ばれる
    expect(mockGenerateMermaidCode).toHaveBeenCalledWith(mockFlowData, "TD");
  });

  test("空のflowDataでもエラーが発生しない", () => {
    const emptyFlowData: FlowData = {
      nodes: [],
      edges: [],
    };

    expect(() => {
      render(<DownloadModal {...mockProps} flowData={emptyFlowData} open />);
    }).not.toThrow();

    expect(screen.getByText("生成されたMermaidコード")).toBeInTheDocument();
  });
});
