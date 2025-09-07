import { Background, Controls, MiniMap } from "@xyflow/react";
import type { FC } from "@yamada-ui/react";
import type { ReactNode } from "react";
import { ContributionPanel } from "@/components/ui/contribution-panel";

interface FlowLayoutProps {
  children: ReactNode;
}

export const FlowLayout: FC<FlowLayoutProps> = ({ children }) => {
  return (
    <>
      <Controls />
      <MiniMap />
      <Background />
      {children}
      <ContributionPanel />
    </>
  );
};
