import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { FlowEditor } from "../components/flow";

export default function Home() {
  return (
    <ReactFlowProvider>
      <FlowEditor />
    </ReactFlowProvider>
  );
}
