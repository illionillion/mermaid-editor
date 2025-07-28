import { Node, Edge } from "@xyflow/react";

export type MermaidArrowType = 
  | "arrow"           // -->
  | "thick"           // ==>
  | "dotted"          // -.->
  | "dotted-thick"    // =.=>
  | "invisible"       // ~~~
  | "bidirectional"   // <-->
  | "bidirectional-thick"; // <==>

export interface MermaidNode extends Node {
  data: {
    label: string;
    onLabelChange?: (nodeId: string, newLabel: string) => void;
  };
}

export interface MermaidEdge extends Edge {
  data?: {
    label?: string;
    arrowType?: MermaidArrowType;
  };
}

export interface FlowState {
  nodes: MermaidNode[];
  edges: MermaidEdge[];
  nodeId: number;
}
