import { test, expect } from "@playwright/test";

test.describe("NavigationMenu", () => {
  test("初期表示でフローチャートが選択されている", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: "フローチャートエディタ" })).toBeVisible();
    await page.getByRole("button", { name: "フローチャートエディタ" }).click();
    await expect(page.getByRole("menuitem", { name: "ER図エディタ" })).toBeVisible();
  });

  test("ER図エディタに遷移できる", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "フローチャートエディタ" }).click();
    await page.getByRole("menuitem", { name: "ER図エディタ" }).click();
    await expect(page).toHaveURL(/\/er-diagram\/?$/);
    await expect(page.getByRole("button", { name: "ER図エディタ" })).toBeVisible();
  });

  test("フローチャートに戻れる", async ({ page }) => {
    await page.goto("/er-diagram");
    await page.getByRole("button", { name: "ER図エディタ" }).click();
    await page.getByRole("menuitem", { name: "フローチャートエディタ" }).click();
    await expect(page).toHaveURL(/\/flow-chart\/?$/);
    await expect(page.getByRole("button", { name: "フローチャートエディタ" })).toBeVisible();
  });
});
