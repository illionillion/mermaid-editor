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
  tags: ["vrt"],
  render: () => {
    const [arrow, setArrow] = useState<MermaidArrowType>("arrow");
    return <ArrowTypeSelector currentArrowType={arrow} onArrowTypeChange={setArrow} />;
  },
};
