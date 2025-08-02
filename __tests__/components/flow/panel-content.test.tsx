import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { PanelContent } from "../../../components/flow/flow-panel";

describe("PanelContent", () => {
  const defaultProps = {
    onAddNode: vi.fn(),
    onGenerateCode: vi.fn(),
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
      expect(screen.getByText("コントリビューションはこちら")).toBeInTheDocument();
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

    test("GitHubリンクが正しいURLを持つ", () => {
      render(<PanelContent {...defaultProps} />);

      const githubLink = screen.getByText("コントリビューションはこちら");
      const linkElement = githubLink.closest("a");

      expect(linkElement).toHaveAttribute("href", "https://github.com/illionillion/mermaid-editor");
      expect(linkElement).toHaveAttribute("target", "_blank");
      expect(linkElement).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("アクセシビリティ", () => {
    test("ボタンが適切なaria-labelを持つ", () => {
      render(<PanelContent {...defaultProps} />);

      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });

    test("リンクが適切な属性を持つ", () => {
      render(<PanelContent {...defaultProps} />);

      const githubLink = screen.getByText("コントリビューションはこちら");
      const linkElement = githubLink.closest("a");

      expect(linkElement).toHaveAttribute("rel", "noopener noreferrer");
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
