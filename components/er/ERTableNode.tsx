import { Handle, Position } from "@xyflow/react";
import { Box } from "@yamada-ui/react";
import { ERColumn, ERTableContent } from "./ERTableContent";

// ReactFlowノードラッパーとしてpropsをそのままContentに渡すだけ
export type ERTableNodeProps = {
  name: string;
  columns: ERColumn[];
  onNameChange: (name: string) => void;
  onColumnsChange: (columns: ERColumn[]) => void;
};

export function ERTableNode(props: ERTableNodeProps) {
  return (
    <Box borderWidth={1} borderRadius="md" p={3} bg="white" minW="320px" boxShadow="md">
      <ERTableContent {...props} />
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </Box>
  );
}
