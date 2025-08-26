import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, vi , it } from "vitest";
import { ErCardinalitySelector } from "../components/edge/er-cardinality-selector";
import { ER_CARDINALITY_DISPLAY_LABELS } from "../types";

describe("ErCardinalitySelector", () => {
  it("現在のカーディナリティが表示される", () => {
    render(<ErCardinalitySelector current="one-to-one" onChange={() => {}} />);
    expect(screen.getByRole("button")).toHaveTextContent(
      ER_CARDINALITY_DISPLAY_LABELS["one-to-one"]
    );
  });

  it("メニューから全てのカーディナリティを選択できる", async () => {
    const handleChange = vi.fn();
    render(<ErCardinalitySelector current="one-to-one" onChange={handleChange} />);
    await userEvent.click(screen.getByRole("button"));
    const menuList = screen.getByRole("menu", { hidden: true });
    expect(menuList).toBeInTheDocument();
    for (const [type, label] of Object.entries(ER_CARDINALITY_DISPLAY_LABELS)) {
      const menuItems = within(menuList).queryAllByRole("menuitem", { hidden: true });
      const menuItem = menuItems.find((el) => el.textContent?.includes(label));
      expect(menuItem).toBeInTheDocument();
      await userEvent.click(menuItem!);
      expect(handleChange).toHaveBeenCalledWith(type);
    }
  });
});
