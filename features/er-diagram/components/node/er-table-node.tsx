import { Handle, Position } from "@xyflow/react";
import type { ERColumn } from "./er-table-content";
import { ERTableContent } from "./er-table-content";

// ReactFlowノードラッパーとしてpropsをそのままContentに渡すだけ
export type ERTableNodeProps = {
  name: string;
  columns: ERColumn[];
  onNameChange: (name: string) => void;
  onColumnsChange: (columns: ERColumn[]) => void;
};

// React Flowノード用: props.dataにERTableNodePropsが入る
export function ERTableNode(props: { data: ERTableNodeProps }) {
  return (
    <>
      <ERTableContent {...props.data} />
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}
