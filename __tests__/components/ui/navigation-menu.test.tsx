import { screen, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { render } from "@/__tests__/test-utils";
import { NavigationMenu } from "@/components/ui/navigation-menu";

/**
 * NavigationMenuコンポーネントのテストスイート
 * @description ナビゲーション動作、アクセシビリティ、ルーティングを検証
 *
 * Next.jsルーターのモック設定:
 * - next/navigationとnext/linkをテスト用にモック
 * - usePathname, useRouter, Linkコンポーネントの動作をシミュレート
 */
const mockUsePathname = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: string;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("NavigationMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePathname.mockReturnValue("/flow-chart");
  });

  describe("基本表示", () => {
    test("フローチャートページでメニューが正しく表示される", async () => {
      mockUsePathname.mockReturnValue("/flow-chart");
      const { user } = render(<NavigationMenu />);

      // メニューボタンに現在のページが表示される
      expect(screen.getByRole("button", { name: "フローチャートエディタ" })).toBeInTheDocument();

      // メニューを開く
      await user.click(screen.getByRole("button", { name: "フローチャートエディタ" }));

      // ER図エディタのメニューアイテムが表示される
      await waitFor(() => {
        expect(screen.getByRole("menuitem", { name: "ER図エディタ" })).toBeInTheDocument();
      });
    });

    test("ER図ページでメニューが正しく表示される", async () => {
      mockUsePathname.mockReturnValue("/er-diagram");
      const { user } = render(<NavigationMenu />);

      // メニューボタンに現在のページが表示される
      expect(screen.getByRole("button", { name: "ER図エディタ" })).toBeInTheDocument();

      // メニューを開く
      await user.click(screen.getByRole("button", { name: "ER図エディタ" }));

      // フローチャートエディタのメニューアイテムが表示される
      await waitFor(() => {
        expect(
          screen.getByRole("menuitem", { name: "フローチャートエディタ" })
        ).toBeInTheDocument();
      });
    });

    test("ルートページ（/）でフローチャートが選択される", () => {
      mockUsePathname.mockReturnValue("/");
      render(<NavigationMenu />);

      // ルートページではフローチャートエディタが選択されている
      expect(screen.getByRole("button", { name: "フローチャートエディタ" })).toBeInTheDocument();
    });

    test("未知のパスでデフォルト表示になる", () => {
      mockUsePathname.mockReturnValue("/unknown-path");
      render(<NavigationMenu />);

      // 未知のパスではデフォルトメッセージが表示される
      expect(screen.getByRole("button", { name: "エディタを選択" })).toBeInTheDocument();
    });
  });

  describe("ナビゲーション動作", () => {
    test("メニューを開いて他のページに移動できる", async () => {
      mockUsePathname.mockReturnValue("/flow-chart");
      const { user } = render(<NavigationMenu />);

      // メニューを開く
      const menuButton = screen.getByRole("button", { name: "フローチャートエディタ" });
      await user.click(menuButton);

      // メニューアイテムが表示されるまで待つ
      const erDiagramItem = await screen.findByRole("menuitem", { name: "ER図エディタ" });
      expect(erDiagramItem).toBeInTheDocument();
      expect(erDiagramItem).toHaveAttribute("href", "/er-diagram");
    });

    test("サブパスでも正しく認識される", async () => {
      mockUsePathname.mockReturnValue("/flow-chart/some-sub-path");
      const { user } = render(<NavigationMenu />);

      // サブパスでもフローチャートエディタとして認識される
      expect(screen.getByRole("button", { name: "フローチャートエディタ" })).toBeInTheDocument();

      // メニューを開く
      await user.click(screen.getByRole("button", { name: "フローチャートエディタ" }));

      // ER図エディタのメニューアイテムが表示される
      await waitFor(() => {
        expect(screen.getByRole("menuitem", { name: "ER図エディタ" })).toBeInTheDocument();
      });
    });

    test("現在のページは他のメニューアイテムに表示されない", async () => {
      mockUsePathname.mockReturnValue("/er-diagram");
      const { user } = render(<NavigationMenu />);

      // メニューを開く
      await user.click(screen.getByRole("button", { name: "ER図エディタ" }));

      // 現在のページ（ER図エディタ）はメニューアイテムに表示されない
      await waitFor(() => {
        expect(screen.queryByRole("menuitem", { name: "ER図エディタ" })).not.toBeInTheDocument();
        expect(
          screen.getByRole("menuitem", { name: "フローチャートエディタ" })
        ).toBeInTheDocument();
      });
    });
  });

  describe("アクセシビリティ", () => {
    test("メニューボタンが適切なroleを持つ", () => {
      mockUsePathname.mockReturnValue("/flow-chart");
      render(<NavigationMenu />);

      const menuButton = screen.getByRole("button", { name: "フローチャートエディタ" });
      expect(menuButton).toBeInTheDocument();
    });

    test("メニューアイテムが適切なroleを持つ", async () => {
      mockUsePathname.mockReturnValue("/flow-chart");
      const { user } = render(<NavigationMenu />);

      // メニューを開く
      await user.click(screen.getByRole("button", { name: "フローチャートエディタ" }));

      // メニューアイテムのroleを確認
      const menuItem = await screen.findByRole("menuitem", { name: "ER図エディタ" });
      expect(menuItem).toBeInTheDocument();
    });

    test("キーボード操作でメニューを開ける", async () => {
      mockUsePathname.mockReturnValue("/flow-chart");
      const { user } = render(<NavigationMenu />);

      const menuButton = screen.getByRole("button", { name: "フローチャートエディタ" });
      menuButton.focus();

      // Enterキーでメニューを開く
      await user.keyboard("{Enter}");

      // メニューが開かれることを確認
      await waitFor(() => {
        expect(screen.getByRole("menuitem", { name: "ER図エディタ" })).toBeInTheDocument();
      });
    });

    test("Escキーでメニューを閉じられる", async () => {
      mockUsePathname.mockReturnValue("/flow-chart");
      const { user } = render(<NavigationMenu />);

      // メニューを開く
      await user.click(screen.getByRole("button", { name: "フローチャートエディタ" }));

      // メニューが開かれることを確認
      await waitFor(() => {
        expect(screen.getByRole("menuitem", { name: "ER図エディタ" })).toBeInTheDocument();
      });

      // Escキーでメニューを閉じる
      await user.keyboard("{Escape}");

      // メニューが閉じられることを確認
      await waitFor(() => {
        expect(screen.queryByRole("menuitem", { name: "ER図エディタ" })).not.toBeInTheDocument();
      });
    });
  });

  describe("レスポンシブ対応", () => {
    test("適切なスタイルプロパティが設定されている", () => {
      mockUsePathname.mockReturnValue("/flow-chart");
      render(<NavigationMenu />);

      const menuButton = screen.getByRole("button", { name: "フローチャートエディタ" });
      expect(menuButton).toBeInTheDocument();
      // Yamada UIのレスポンシブプロパティが適用されているかは内部実装なので、
      // コンポーネントが正常にレンダリングされることで間接的に確認
    });
  });

  describe("エラーハンドリング", () => {
    test("usePathnameがnullを返してもエラーにならない", () => {
      mockUsePathname.mockReturnValue(null);

      expect(() => render(<NavigationMenu />)).not.toThrow();
      expect(screen.getByRole("button", { name: "エディタを選択" })).toBeInTheDocument();
    });

    test("usePathnameが空文字を返してもエラーにならない", () => {
      mockUsePathname.mockReturnValue("");

      expect(() => render(<NavigationMenu />)).not.toThrow();
      expect(screen.getByRole("button", { name: "エディタを選択" })).toBeInTheDocument();
    });

    test("予期しないパスでもエラーにならない", async () => {
      mockUsePathname.mockReturnValue("/some/weird/path/that/does/not/exist");
      const { user } = render(<NavigationMenu />);

      expect(screen.getByRole("button", { name: "エディタを選択" })).toBeInTheDocument();

      // メニューを開いても正常に動作する
      await user.click(screen.getByRole("button", { name: "エディタを選択" }));

      // 全てのメニューアイテムが表示される（現在のページがないため）
      await waitFor(() => {
        expect(
          screen.getByRole("menuitem", { name: "フローチャートエディタ" })
        ).toBeInTheDocument();
        expect(screen.getByRole("menuitem", { name: "ER図エディタ" })).toBeInTheDocument();
      });
    });
  });

  describe("定数の整合性", () => {
    test("NAV_ITEMSの全ての項目が適切に処理される", async () => {
      // 各パスでテストして、適切に他の項目が表示されることを確認
      const testCases = [
        {
          path: "/flow-chart",
          expectedButton: "フローチャートエディタ",
          expectedMenuItem: "ER図エディタ",
        },
        {
          path: "/er-diagram",
          expectedButton: "ER図エディタ",
          expectedMenuItem: "フローチャートエディタ",
        },
      ];

      for (const testCase of testCases) {
        mockUsePathname.mockReturnValue(testCase.path);
        const { user, unmount } = render(<NavigationMenu />);

        expect(screen.getByRole("button", { name: testCase.expectedButton })).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: testCase.expectedButton }));

        await waitFor(() => {
          expect(
            screen.getByRole("menuitem", { name: testCase.expectedMenuItem })
          ).toBeInTheDocument();
        });

        unmount();
      }
    });
  });
});
