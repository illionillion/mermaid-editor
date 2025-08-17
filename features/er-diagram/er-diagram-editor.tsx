"use client";
import {
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  OnConnectStartParams,
  OnConnectEnd,
  useReactFlow,
} from "@xyflow/react";
import type { NodeTypes, Node } from "@xyflow/react";
import { Box, FC, useToken } from "@yamada-ui/react";
import { useCallback, useState, useRef } from "react";
import {
  createNewERTableNode,
  createNewEREdge,
  calculateNodePosition,
  parseConnectingNodeId,
} from "./er-diagram-helpers";
import { ERDiagramPanel } from "./er-diagram-panel";
import type { ERColumn } from "./er-table-content";
import type { ERTableNodeProps } from "./er-table-node";
import { ERTableNode } from "./er-table-node";

const nodeTypes = {
  erTable: ERTableNode,
} as NodeTypes;

export type ERDiagramNodeData = {
  id: string;
  name: string;
  columns: Array<{
    name: string;
    type: string;
    pk: boolean;
    nn: boolean;
    defaultValue: string;
  }>;
};

export const ERDiagramEditor: FC = () => {
  const connectingNodeId = useRef<string | null>(null);
  const { screenToFlowPosition } = useReactFlow();
  // ノード幅はテーマtokenから取得
  const sizeToken = useToken("sizes", "5xl") ?? "320";
  const nodeWidth = sizeToken.endsWith("rem")
    ? parseFloat(sizeToken) * 16
    : parseInt(sizeToken, 10);
  // 1行の高さ（px）
  const rowHeight = 32;
  // ヘッダー部の高さ（px）
  const headerHeight = 48;
  const initialNodes: Node<ERTableNodeProps>[] = [
    {
      id: "1",
      type: "erTable",
      position: { x: 100, y: 100 },
      data: {
        name: "ユーザー",
        columns: [
          { name: "id", type: "int", pk: true, nn: true, defaultValue: "auto_increment" },
          { name: "name", type: "varchar(255)", pk: false, nn: false, defaultValue: "" },
        ],
        onNameChange: () => {},
        onColumnsChange: () => {},
      },
    },
  ];
  const initialEdges: Edge[] = [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeId, setNodeId] = useState(2);

  // ノード追加
  const handleAddTable = useCallback(() => {
    const newNode = createNewERTableNode(
      nodeId,
      { x: 100 + nodeId * 40, y: 100 + nodeId * 40 },
      {
        onNameChange: (name: string) => {
          setNodes((nds) =>
            nds.map((n) => (n.id === nodeId.toString() ? { ...n, data: { ...n.data, name } } : n))
          );
        },
        onColumnsChange: (columns: ERColumn[]) => {
          setNodes((nds) =>
            nds.map((n) =>
              n.id === nodeId.toString() ? { ...n, data: { ...n.data, columns } } : n
            )
          );
        },
      }
    );
    setNodes((nds) => [...nds, newNode]);
    setNodeId((id) => id + 1);
  }, [nodeId, setNodes]);
  // エッジからノード作成
  const onConnectStart = useCallback(
    (_: MouseEvent | TouchEvent | null, params: OnConnectStartParams) => {
      connectingNodeId.current = `${params.nodeId}-${params.handleType}`;
    },
    []
  );

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      if (!connectingNodeId.current) return;
      // 既存ノードやハンドルにドロップした場合は新ノード作成しない
      const target = (event && (event.target as Element)) || null;
      if (!target || !target.classList.contains("react-flow__pane")) {
        connectingNodeId.current = null;
        return;
      }
      // pane上にドロップされた場合のみ新ノード作成
      const { sourceNodeId, handleType } = parseConnectingNodeId(connectingNodeId.current);
      // sourceNodeの行数を取得
      const sourceNode = nodes.find((n) => n.id === sourceNodeId);
      const sourceRowCount =
        sourceNode && Array.isArray(sourceNode.data.columns) ? sourceNode.data.columns.length : 1;
      // マウス/タッチ位置取得
      let clientX: number, clientY: number;
      if (event instanceof TouchEvent && event.changedTouches.length > 0) {
        clientX = event.changedTouches[0].clientX;
        clientY = event.changedTouches[0].clientY;
      } else {
        const mouseEvent = event as MouseEvent;
        clientX = mouseEvent.clientX;
        clientY = mouseEvent.clientY;
      }
      const mousePosition = screenToFlowPosition({ x: clientX, y: clientY });
      // ノード高さは行数×rowHeight+headerHeight
      const nodeHeight = sourceRowCount * rowHeight + headerHeight;
      const newPosition = calculateNodePosition(mousePosition, nodeWidth, nodeHeight);
      const newNode = createNewERTableNode(
        nodeId,
        {
          x: newPosition.x,
          y: newPosition.y,
        },
        {
          onNameChange: (name: string) => {
            setNodes((nds) =>
              nds.map((n) => (n.id === nodeId.toString() ? { ...n, data: { ...n.data, name } } : n))
            );
          },
          onColumnsChange: (columns: ERColumn[]) => {
            setNodes((nds) =>
              nds.map((n) =>
                n.id === nodeId.toString() ? { ...n, data: { ...n.data, columns } } : n
              )
            );
          },
        }
      );
      setNodes((nds) => [...nds, newNode]);
      const newEdge = createNewEREdge(sourceNodeId, nodeId.toString(), handleType);
      setEdges((eds) => [...eds, newEdge]);
      setNodeId((id) => id + 1);
      connectingNodeId.current = null;
    },
    [nodeId, setNodes, setEdges, screenToFlowPosition, nodes]
  );

  // ノード編集用のonNameChange/onColumnsChangeを各ノードに付与
  const nodesWithHandlers: Node<ERTableNodeProps>[] = nodes.map((node) => {
    if (node.type !== "erTable") return node as Node<ERTableNodeProps>;
    return {
      ...node,
      data: {
        ...node.data,
        onNameChange: (name: string) => {
          setNodes((nds) =>
            nds.map((n) => (n.id === node.id ? { ...n, data: { ...n.data, name } } : n))
          );
        },
        onColumnsChange: (columns: ERColumn[]) => {
          setNodes((nds) =>
            nds.map((n) => (n.id === node.id ? { ...n, data: { ...n.data, columns } } : n))
          );
        },
      },
    };
  });

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <Box h="100vh" w="full">
      <ERDiagramPanel onAddTable={handleAddTable} />
      <ReactFlow
        nodes={nodesWithHandlers}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        nodeTypes={nodeTypes}
        fitView
      >
        <MiniMap />
        <Controls />
      </ReactFlow>
    </Box>
  );
};
