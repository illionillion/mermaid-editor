import { ReactFlowProvider } from "@xyflow/react";
import { FC, UIProvider } from "@yamada-ui/react";
import type { ReactNode } from "react";
import "@xyflow/react/dist/style.css";

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: FC<AppProvidersProps> = ({ children }) => {
  return (
    <UIProvider>
      <ReactFlowProvider>{children}</ReactFlowProvider>
    </UIProvider>
  );
};
