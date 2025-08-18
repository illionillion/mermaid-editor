import { Background, Controls, MiniMap } from "@xyflow/react";
import { FC } from "@yamada-ui/react";
import { ReactNode } from "react";
import { ContributionPanel } from "../ui/contribution-panel";

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
