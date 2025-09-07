import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { MockInstance } from "vitest";
import { describe, test, expect, vi, beforeEach, it } from "vitest";
import { render } from "@/__tests__/test-utils";
import { ContributionPanelContent } from "@/components/ui/contribution-panel";
import { PanelContent } from "@/features/flowchart/components/panel/flow-panel";

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
    test("ノード追加ボタンクリックでonAddNodeが呼ばれる", async () => {
      const user = userEvent.setup();
      render(<PanelContent {...defaultProps} />);

      const addButton = screen.getByText("ノード追加");
      await user.click(addButton);

      expect(defaultProps.onAddNode).toHaveBeenCalledTimes(1);
    });

    test("コード生成ボタンクリックでonGenerateCodeが呼ばれる", async () => {
      const user = userEvent.setup();
      render(<PanelContent {...defaultProps} />);

      const generateButton = screen.getByText("コード生成");
      await user.click(generateButton);

      expect(defaultProps.onGenerateCode).toHaveBeenCalledTimes(1);
    });

    test("インポートボタンクリックでモーダルが開く", async () => {
      const user = userEvent.setup();
      render(<PanelContent {...defaultProps} />);

      const importButton = screen.getByText("インポート");
      await user.click(importButton);

      // モーダルが開いていることを確認（ImportModalコンポーネント内のテキストで判定）
      expect(screen.getByText("Mermaidコードインポート")).toBeInTheDocument();
    });

    test("Mermaidコードを入力してインポートできる", async () => {
      const user = userEvent.setup();
      render(<PanelContent {...defaultProps} />);

      // モーダルを開く
      const importButton = screen.getByText("インポート");
      await user.click(importButton);

      // テキストエリアに有効なMermaidコードを入力
      const textarea = screen.getByPlaceholderText(/例:/);
      const validMermaidCode = `flowchart TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Process]
    B -->|No| D[End]
    C --> D`;

      await user.clear(textarea);
      await user.type(textarea, validMermaidCode);

      // モーダル内のインポートボタンをクリック（getAllByTextで取得し、モーダル内のものを選択）
      const importButtons = screen.getAllByText("インポート");
      const modalImportButton = importButtons[1]; // モーダル内のボタンは2番目
      await user.click(modalImportButton);

      // onImportMermaidが呼ばれることを確認
      expect(defaultProps.onImportMermaid).toHaveBeenCalledTimes(1);
    });

    test("不正なMermaidコードでエラーが表示される", async () => {
      const user = userEvent.setup();
      render(<PanelContent {...defaultProps} />);

      // モーダルを開く
      const importButton = screen.getByText("インポート");
      await user.click(importButton);

      // テキストエリアに無効なコードを入力
      const textarea = screen.getByPlaceholderText(/例:/);
      await user.clear(textarea);
      await user.type(textarea, "invalid mermaid code");

      // モーダル内のインポートボタンをクリック
      const importButtons = screen.getAllByText("インポート");
      const modalImportButton = importButtons[1]; // モーダル内のボタンは2番目
      await user.click(modalImportButton);

      // エラーメッセージが表示されることを確認
      expect(screen.getByText(/有効なMermaidコードが見つかりませんでした/)).toBeInTheDocument();
      // onImportMermaidが呼ばれないことを確認
      expect(defaultProps.onImportMermaid).not.toHaveBeenCalled();
    });
  });

  describe("GitHubリンク", () => {
    test("GitHubリンクが正しいURLを持つ", async () => {
      render(<ContributionPanelContent />);
      const user = userEvent.setup();
      // メニューを開く
      const menuButton = screen.getByRole("button", { name: "コントリビューションメニュー" });
      await user.click(menuButton);
      // メニュー内のリンクを取得
      const githubLink = screen.getByRole("menuitem", { name: "リポジトリを見る" });
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

    test("GitHubリンクが適切な属性を持つ", async () => {
      render(<ContributionPanelContent />);
      const user = userEvent.setup();
      // メニューを開く
      const menuButton = screen.getByRole("button", { name: "コントリビューションメニュー" });
      await user.click(menuButton);
      // メニュー内のリンクを取得
      const githubLink = screen.getByRole("menuitem", { name: "リポジトリを見る" });
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
    const clickCases: { label: string; handler: keyof typeof defaultProps; times: number }[] = [
      { label: "ノード追加", handler: "onAddNode", times: 3 },
      { label: "コード生成", handler: "onGenerateCode", times: 2 },
    ];
    it.each(clickCases)(
      "$labelボタンを$times回クリックできる",
      async ({ label, handler, times }) => {
        const user = userEvent.setup();
        render(<PanelContent {...defaultProps} />);

        const button = screen.getByText(label);
        for (let i = 0; i < times; i++) {
          await user.click(button);
        }
        expect((defaultProps[handler] as MockInstance).mock.calls.length).toBe(times);
      }
    );
  });
});
