import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { within } from "@storybook/testing-library";
import { userEvent } from "@vitest/browser/context";
import { ContributionPanel } from "../../../components/ui/contribution-panel";

const meta: Meta<typeof ContributionPanel> = {
  title: "components/ui/ContributionPanel",
  component: ContributionPanel,
};

export default meta;

type Story = StoryObj<typeof ContributionPanel>;

export const Default: Story = {
  render: () => <ContributionPanel />,
};

export const Opened: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // ボタンをクリックしてパネルを開く
    const button = await canvas.getByRole("button");
    await userEvent.click(button);
  },
  render: () => <ContributionPanel />,
};
