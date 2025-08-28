/* global expect */
// Storybook Test Runner 設定例
import { toMatchImageSnapshot } from "jest-image-snapshot";

const VIEWPORT = { width: 1280, height: 800 };

export default {
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  async preVisit(page) {
    // 画面幅を明示的に指定
    await page.setViewportSize(VIEWPORT);
  },
  async postVisit(page, context) {
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot({
      customSnapshotsDir: "__image_snapshots__",
      customSnapshotIdentifier: context.id,
      //   failureThreshold: 0.01, // 1%まで許容
      //   failureThresholdType: "percent",
    });
  },
};
