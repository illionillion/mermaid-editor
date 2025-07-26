import { Node, Edge } from "@xyflow/react";

export interface MermaidNode extends Node {
  data: {
    label: string;
    onLabelChange?: (nodeId: string, newLabel: string) => void;
  };
}

export interface MermaidEdge extends Edge {
  data?: {
    label?: string;
  };
}

export interface FlowState {
  nodes: MermaidNode[];
  edges: MermaidEdge[];
  nodeId: number;
}
