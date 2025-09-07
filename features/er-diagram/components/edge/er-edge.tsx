import type { EdgeProps } from "@xyflow/react";
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from "@xyflow/react";
import { Box } from "@yamada-ui/react";
import type { ErCardinality } from "@/features/er-diagram/types";
import { ErEditableEdge } from "./er-editable-edge";

interface ErEdgeProps extends EdgeProps {
  data?: {
    label?: string;
    cardinality?: ErCardinality;
    onLabelChange?: (edgeId: string, newLabel: string) => void;
    onCardinalityChange?: (edgeId: string, cardinality: ErCardinality) => void;
    onDelete?: (edgeId: string) => void;
  };
}

export function ErEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
}: ErEdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} />
      <EdgeLabelRenderer>
        <Box
          position="absolute"
          transform={`translate(-50%, -50%) translate(${labelX}px,${labelY}px)`}
          pointerEvents="all"
          className="nodrag nopan"
        >
          <ErEditableEdge
            id={id}
            label={data?.label || "relation"}
            cardinality={data?.cardinality || "one-to-many"}
            onLabelChange={data?.onLabelChange || (() => {})}
            onCardinalityChange={data?.onCardinalityChange || (() => {})}
            onDelete={data?.onDelete || (() => {})}
          />
        </Box>
      </EdgeLabelRenderer>
    </>
  );
}
