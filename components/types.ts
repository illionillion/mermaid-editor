import { Node, Edge } from '@xyflow/react';

export interface MermaidNode extends Node {
  data: {
    label: string;
    onLabelChange?: (nodeId: string, newLabel: string) => void;
  };
}

export interface MermaidEdge extends Edge {
  // 将来的に独自のエッジプロパティを追加する場合
}

export interface FlowState {
  nodes: MermaidNode[];
  edges: MermaidEdge[];
  nodeId: number;
}
