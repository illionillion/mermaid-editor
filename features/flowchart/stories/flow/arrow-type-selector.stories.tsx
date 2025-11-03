import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { ArrowTypeSelector } from "@/features/flowchart/components/edge/arrow-type-selector";
import type { MermaidArrowType } from "@/features/flowchart/types/types";

const meta: Meta<typeof ArrowTypeSelector> = {
  title: "components/flow/ArrowTypeSelector",
  component: ArrowTypeSelector,
};
export default meta;

type Story = StoryObj<typeof ArrowTypeSelector>;

export const Default: Story = {
  render: () => {
    const [arrow, setArrow] = useState<MermaidArrowType>("arrow");
    return <ArrowTypeSelector currentArrowType={arrow} onArrowTypeChange={setArrow} />;
  },
  // VRT を取りたい Story には tags または parameters.vrt = true を付与できます。
  // ここでは "vrt" タグを付けて opt-in しています。
  parameters: {
    tags: ["vrt"],
  },
};
