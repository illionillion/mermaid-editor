import { screen, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { render } from "@/__tests__/test-utils";
import { ContributionPanel, ContributionPanelContent } from "@/components/ui/contribution-panel";

/**
 * ContributionPanelコンポーネントのテストスイート
 * @description パネル表示、メニュー操作、外部リンク、アクセシビリティを検証
 */
describe("ContributionPanel", () => {
  // ReactFlowのPanelをモック
  vi.mock("@xyflow/react", () => ({
    Panel: ({ children, position }: { children: React.ReactNode; position: string }) => (
      <div data-testid="react-flow-panel" data-position={position}>
        {children}
      </div>
    ),
  }));

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("基本表示", () => {
    test("ContributionPanelが正しく表示される", () => {
      render(<ContributionPanel />);

      expect(screen.getByTestId("react-flow-panel")).toBeInTheDocument();
      expect(screen.getByTestId("react-flow-panel")).toHaveAttribute("data-position", "top-right");
    });

    test("ContributionPanelContentが内部でレンダリングされる", () => {
      render(<ContributionPanel />);

      // メニューボタンが表示されることで間接的に確認
      expect(
        screen.getByRole("button", { name: "コントリビューションメニュー" })
      ).toBeInTheDocument();
    });
  });

  describe("ContributionPanelContent", () => {
    test("メニューボタンが正しく表示される", () => {
      render(<ContributionPanelContent />);

      const menuButton = screen.getByRole("button", { name: "コントリビューションメニュー" });
      expect(menuButton).toBeInTheDocument();
    });

    test("メニューを開くとメニューアイテムが表示される", async () => {
      const { user } = render(<ContributionPanelContent />);

      const menuButton = screen.getByRole("button", { name: "コントリビューションメニュー" });
      await user.click(menuButton);

      // メニューアイテムが表示されるまで待つ
      await waitFor(() => {
        expect(screen.getByRole("menuitem", { name: "リポジトリを見る" })).toBeInTheDocument();
        expect(screen.getByRole("menuitem", { name: "Issueを作成" })).toBeInTheDocument();
      });
    });
  });

  describe("外部リンク", () => {
    test("GitHubリポジトリリンクが正しい属性を持つ", async () => {
      const { user } = render(<ContributionPanelContent />);

      // メニューを開く
      const menuButton = screen.getByRole("button", { name: "コントリビューションメニュー" });
      await user.click(menuButton);

      // リポジトリリンクの属性を確認
      const repoLink = await screen.findByRole("menuitem", { name: "リポジトリを見る" });
      expect(repoLink).toHaveAttribute("href", "https://github.com/illionillion/mermaid-editor");
      expect(repoLink).toHaveAttribute("target", "_blank");
      expect(repoLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    test("Issue作成リンクが正しい属性を持つ", async () => {
      const { user } = render(<ContributionPanelContent />);

      // メニューを開く
      const menuButton = screen.getByRole("button", { name: "コントリビューションメニュー" });
      await user.click(menuButton);

      // Issueリンクの属性を確認
      const issueLink = await screen.findByRole("menuitem", { name: "Issueを作成" });
      expect(issueLink).toHaveAttribute(
        "href",
        "https://github.com/illionillion/mermaid-editor/issues/new/choose"
      );
      expect(issueLink).toHaveAttribute("target", "_blank");
      expect(issueLink).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("アクセシビリティ", () => {
    test("メニューボタンが適切なaria-labelを持つ", () => {
      render(<ContributionPanelContent />);

      const menuButton = screen.getByRole("button", { name: "コントリビューションメニュー" });
      expect(menuButton).toHaveAttribute("aria-label", "コントリビューションメニュー");
    });

    test("メニューアイテムが適切なroleを持つ", async () => {
      const { user } = render(<ContributionPanelContent />);

      await user.click(screen.getByRole("button", { name: "コントリビューションメニュー" }));

      await waitFor(() => {
        expect(screen.getByRole("menuitem", { name: "リポジトリを見る" })).toBeInTheDocument();
        expect(screen.getByRole("menuitem", { name: "Issueを作成" })).toBeInTheDocument();
      });
    });

    test("キーボード操作でメニューを開ける", async () => {
      const { user } = render(<ContributionPanelContent />);

      const menuButton = screen.getByRole("button", { name: "コントリビューションメニュー" });
      menuButton.focus();

      // Enterキーでメニューを開く
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(screen.getByRole("menuitem", { name: "リポジトリを見る" })).toBeInTheDocument();
      });
    });

    test("Escキーでメニューを閉じられる", async () => {
      const { user } = render(<ContributionPanelContent />);

      // メニューを開く
      await user.click(screen.getByRole("button", { name: "コントリビューションメニュー" }));

      // メニューが開かれることを確認
      await waitFor(() => {
        expect(screen.getByRole("menuitem", { name: "リポジトリを見る" })).toBeInTheDocument();
      });

      // Escキーでメニューを閉じる
      await user.keyboard("{Escape}");

      // メニューが閉じられることを確認
      await waitFor(() => {
        expect(
          screen.queryByRole("menuitem", { name: "リポジトリを見る" })
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("メニューの操作", () => {
    test("メニューを開いて閉じることができる", async () => {
      const { user } = render(<ContributionPanelContent />);

      const menuButton = screen.getByRole("button", { name: "コントリビューションメニュー" });

      // メニューを開く
      await user.click(menuButton);
      await waitFor(() => {
        expect(screen.getByRole("menuitem", { name: "リポジトリを見る" })).toBeInTheDocument();
      });

      // 再度ボタンをクリックしてメニューを閉じる
      await user.click(menuButton);
      await waitFor(() => {
        expect(
          screen.queryByRole("menuitem", { name: "リポジトリを見る" })
        ).not.toBeInTheDocument();
      });
    });

    test("メニュー外をクリックしてメニューを閉じることができる", async () => {
      const { user } = render(
        <div>
          <ContributionPanelContent />
          <div data-testid="outside-element">外部要素</div>
        </div>
      );

      // メニューを開く
      await user.click(screen.getByRole("button", { name: "コントリビューションメニュー" }));
      await waitFor(() => {
        expect(screen.getByRole("menuitem", { name: "リポジトリを見る" })).toBeInTheDocument();
      });

      // 外部要素をクリック
      await user.click(screen.getByTestId("outside-element"));

      // メニューが閉じられることを確認
      await waitFor(() => {
        expect(
          screen.queryByRole("menuitem", { name: "リポジトリを見る" })
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("スタイルとテーマ", () => {
    test("メニューボタンが適切なスタイルプロパティを持つ", () => {
      render(<ContributionPanelContent />);

      const menuButton = screen.getByRole("button", { name: "コントリビューションメニュー" });
      expect(menuButton).toBeInTheDocument();
      // Yamada UIのスタイルが適用されているかは内部実装なので、
      // ボタンが正常にレンダリングされることで間接的に確認
    });

    test("アイコンが正しく表示される", () => {
      render(<ContributionPanelContent />);

      // GithubIcon、CodeIcon、CircleDotIconが使用されているが、
      // モックされた環境では実際のSVGアイコンの確認は困難
      // ボタンとメニューアイテムが正常に表示されることで間接的に確認
      expect(
        screen.getByRole("button", { name: "コントリビューションメニュー" })
      ).toBeInTheDocument();
    });
  });

  describe("再レンダリング", () => {
    test("コンポーネントの再レンダリングが正常に動作する", () => {
      const { rerender } = render(<ContributionPanelContent />);

      expect(
        screen.getByRole("button", { name: "コントリビューションメニュー" })
      ).toBeInTheDocument();

      rerender(<ContributionPanelContent />);

      expect(
        screen.getByRole("button", { name: "コントリビューションメニュー" })
      ).toBeInTheDocument();
    });

    test("Panelコンポーネントとの統合が維持される", () => {
      const { rerender } = render(<ContributionPanel />);

      expect(screen.getByTestId("react-flow-panel")).toBeInTheDocument();
      expect(screen.getByTestId("react-flow-panel")).toHaveAttribute("data-position", "top-right");

      rerender(<ContributionPanel />);

      expect(screen.getByTestId("react-flow-panel")).toBeInTheDocument();
      expect(screen.getByTestId("react-flow-panel")).toHaveAttribute("data-position", "top-right");
    });
  });

  describe("エラーハンドリング", () => {
    test("外部リンクが無効でもコンポーネントが壊れない", async () => {
      const { user } = render(<ContributionPanelContent />);

      // メニューを開いてリンクをクリックしてもエラーが発生しないことを確認
      await user.click(screen.getByRole("button", { name: "コントリビューションメニュー" }));

      const repoLink = await screen.findByRole("menuitem", { name: "リポジトリを見る" });

      // リンクが存在することを確認（実際のナビゲーションはテストしない）
      expect(repoLink).toBeInTheDocument();
      expect(repoLink).toHaveAttribute("href");
    });

    test("メニューの開閉状態が適切に管理される", async () => {
      const { user } = render(<ContributionPanelContent />);

      // 複数回の開閉操作でも正常に動作する
      const menuButton = screen.getByRole("button", { name: "コントリビューションメニュー" });

      for (let i = 0; i < 3; i++) {
        // メニューを開く
        await user.click(menuButton);
        await waitFor(() => {
          expect(screen.getByRole("menuitem", { name: "リポジトリを見る" })).toBeInTheDocument();
        });

        // メニューを閉じる
        await user.click(menuButton);
        await waitFor(() => {
          expect(
            screen.queryByRole("menuitem", { name: "リポジトリを見る" })
          ).not.toBeInTheDocument();
        });
      }
    });
  });

  describe("統合テスト", () => {
    test("FlowLayoutとの統合", () => {
      // FlowLayoutから使用される場合のテスト
      const MockFlowLayout = () => (
        <div data-testid="flow-layout">
          <div data-testid="flow-content">フロー内容</div>
          <ContributionPanel />
        </div>
      );

      render(<MockFlowLayout />);

      expect(screen.getByTestId("flow-layout")).toBeInTheDocument();
      expect(screen.getByTestId("flow-content")).toBeInTheDocument();
      expect(screen.getByTestId("react-flow-panel")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "コントリビューションメニュー" })
      ).toBeInTheDocument();
    });

    test("複数のContributionPanelが同時に存在する場合", () => {
      render(
        <div>
          <ContributionPanel />
          <ContributionPanel />
        </div>
      );

      const menuButtons = screen.getAllByRole("button", { name: "コントリビューションメニュー" });
      expect(menuButtons).toHaveLength(2);

      const panels = screen.getAllByTestId("react-flow-panel");
      expect(panels).toHaveLength(2);
    });
  });
});
