import { Node, Edge } from "@xyflow/react";

export interface MermaidNode extends Node {
  data: {
    label: string;
    onLabelChange?: (nodeId: string, newLabel: string) => void;
  };
}

export type MermaidEdge = Edge;

export interface FlowState {
  nodes: MermaidNode[];
  edges: MermaidEdge[];
  nodeId: number;
}
