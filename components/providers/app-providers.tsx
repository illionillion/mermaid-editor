"use client";

import { ReactFlowProvider } from "@xyflow/react";
import { UIProvider } from "@yamada-ui/react";
import type { ReactNode } from "react";
import "@xyflow/react/dist/style.css";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <UIProvider>
      <ReactFlowProvider>{children}</ReactFlowProvider>
    </UIProvider>
  );
}
