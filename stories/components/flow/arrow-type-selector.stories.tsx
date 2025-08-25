import type { Meta } from "@storybook/react-vite";
import { useState } from "react";
import { ArrowTypeSelector } from "@/features/flowchart/components/edge/arrow-type-selector";
import type { MermaidArrowType } from "@/features/flowchart/types/types";

const meta: Meta<typeof ArrowTypeSelector> = {
  title: "components/flow/ArrowTypeSelector",
  component: ArrowTypeSelector,
};
export default meta;

export const Default = {
  render: () => {
    const [arrow, setArrow] = useState<MermaidArrowType>("arrow");
    return <ArrowTypeSelector currentArrowType={arrow} onArrowTypeChange={setArrow} />;
  },
};
