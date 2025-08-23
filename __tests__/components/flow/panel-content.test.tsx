import { screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { ContributionPanelContent } from "@/components/ui/contribution-panel";
import { PanelContent } from "@/features/flowchart/components/panel/flow-panel";
import { render } from "../../test-utils";

vi.mock("next/navigation", () => ({
  usePathname: () => "/flow-chart",
}));

describe("PanelContent", () => {
  const defaultProps = {
    onAddNode: vi.fn(),
    onGenerateCode: vi.fn(),
    onImportMermaid: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("表示", () => {
    test("タイトルが正しく表示される", () => {
      render(<PanelContent {...defaultProps} />);

      expect(screen.getByText("Mermaid フローチャート エディター")).toBeInTheDocument();
    });

    test("ヒントテキストが表示される", () => {
      render(<PanelContent {...defaultProps} />);

      expect(screen.getByText(/ヒント: ノードをダブルクリックで編集/)).toBeInTheDocument();
    });

    test("すべてのボタンが表示される", () => {
      render(<PanelContent {...defaultProps} />);

      expect(screen.getByText("ノード追加")).toBeInTheDocument();
      expect(screen.getByText("コード生成")).toBeInTheDocument();
      expect(screen.getByText("インポート")).toBeInTheDocument();
    });
  });

  describe("ボタンの動作", () => {
    test("ノード追加ボタンクリックでonAddNodeが呼ばれる", () => {
      render(<PanelContent {...defaultProps} />);

      const addButton = screen.getByText("ノード追加");
      fireEvent.click(addButton);

      expect(defaultProps.onAddNode).toHaveBeenCalledTimes(1);
    });

    test("コード生成ボタンクリックでonGenerateCodeが呼ばれる", () => {
      render(<PanelContent {...defaultProps} />);

      const generateButton = screen.getByText("コード生成");
      fireEvent.click(generateButton);

      expect(defaultProps.onGenerateCode).toHaveBeenCalledTimes(1);
    });

    test("インポートボタンクリックでモーダルが開く", () => {
      render(<PanelContent {...defaultProps} />);

      const importButton = screen.getByText("インポート");
      fireEvent.click(importButton);

      // モーダルが開いていることを確認（ImportModalコンポーネント内のテキストで判定）
      expect(screen.getByText("Mermaidコードインポート")).toBeInTheDocument();
    });

    test("Mermaidコードを入力してインポートできる", () => {
      render(<PanelContent {...defaultProps} />);

      // モーダルを開く
      const importButton = screen.getByText("インポート");
      fireEvent.click(importButton);

      // テキストエリアに有効なMermaidコードを入力
      const textarea = screen.getByPlaceholderText(/例:/);
      const validMermaidCode = `flowchart TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Process]
    B -->|No| D[End]
    C --> D`;

      fireEvent.change(textarea, { target: { value: validMermaidCode } });

      // モーダル内のインポートボタンをクリック（getAllByTextで取得し、モーダル内のものを選択）
      const importButtons = screen.getAllByText("インポート");
      const modalImportButton = importButtons[1]; // モーダル内のボタンは2番目
      fireEvent.click(modalImportButton);

      // onImportMermaidが呼ばれることを確認
      expect(defaultProps.onImportMermaid).toHaveBeenCalledTimes(1);
    });

    test("不正なMermaidコードでエラーが表示される", () => {
      render(<PanelContent {...defaultProps} />);

      // モーダルを開く
      const importButton = screen.getByText("インポート");
      fireEvent.click(importButton);

      // テキストエリアに無効なコードを入力
      const textarea = screen.getByPlaceholderText(/例:/);
      fireEvent.change(textarea, { target: { value: "invalid mermaid code" } });

      // モーダル内のインポートボタンをクリック
      const importButtons = screen.getAllByText("インポート");
      const modalImportButton = importButtons[1]; // モーダル内のボタンは2番目
      fireEvent.click(modalImportButton);

      // エラーメッセージが表示されることを確認
      expect(screen.getByText(/有効なMermaidコードが見つかりませんでした/)).toBeInTheDocument();
      // onImportMermaidが呼ばれないことを確認
      expect(defaultProps.onImportMermaid).not.toHaveBeenCalled();
    });
  });

  describe("GitHubリンク", () => {
    test("GitHubリンクが正しいURLを持つ", () => {
      render(<ContributionPanelContent />);

      const githubLink = screen.getByRole("link");

      expect(githubLink).toHaveAttribute("href", "https://github.com/illionillion/mermaid-editor");
      expect(githubLink).toHaveAttribute("target", "_blank");
      expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("アクセシビリティ", () => {
    test("ボタンが適切なaria-labelを持つ", () => {
      render(<PanelContent {...defaultProps} />);

      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });

    test("GitHubリンクが適切な属性を持つ", () => {
      render(<ContributionPanelContent />);

      const githubLink = screen.getByRole("link");

      expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("レスポンシブデザイン", () => {
    test("ボタンが適切に配置される", () => {
      render(<PanelContent {...defaultProps} />);

      const addButton = screen.getByText("ノード追加");
      const generateButton = screen.getByText("コード生成");

      expect(addButton).toBeInTheDocument();
      expect(generateButton).toBeInTheDocument();
    });
  });

  describe("複数回クリック", () => {
    test("ノード追加ボタンを複数回クリックできる", () => {
      render(<PanelContent {...defaultProps} />);

      const addButton = screen.getByText("ノード追加");

      fireEvent.click(addButton);
      fireEvent.click(addButton);
      fireEvent.click(addButton);

      expect(defaultProps.onAddNode).toHaveBeenCalledTimes(3);
    });

    test("コード生成ボタンを複数回クリックできる", () => {
      render(<PanelContent {...defaultProps} />);

      const generateButton = screen.getByText("コード生成");

      fireEvent.click(generateButton);
      fireEvent.click(generateButton);

      expect(defaultProps.onGenerateCode).toHaveBeenCalledTimes(2);
    });
  });
});
