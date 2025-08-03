"use client";

import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Connection,
  OnConnectStartParams,
  OnConnectEnd,
} from "@xyflow/react";
import { Box, useDisclosure, useToken } from "@yamada-ui/react";
import { useCallback, useState, useRef, useEffect } from "react";
import { generateMermaidCode, ParsedMermaidData } from "../../utils/mermaid";
import { DownloadModal } from "../mermaid";
import { MermaidArrowType } from "../types/types";
import { ContributionPanel } from "./contribution-panel";
import { edgeTypes } from "./edge-types";
import {
  calculateNodePosition,
  createNewNode,
  createNewEdge,
  parseConnectingNodeId,
  FlowData,
} from "./flow-helpers";
import { FlowPanel } from "./flow-panel";
import { nodeTypes } from "./node-types";

// レイアウト定数
const LAYOUT_CONSTANTS = {
  LEVEL_HEIGHT: 150, // レベル間の縦幅
  NODE_SPACING: 250, // 同レベル内のノード間隔（横方向）
  CENTER_OFFSET: 300, // 中央揃えのためのオフセット
  VERTICAL_OFFSET: 50, // 上部からの初期オフセット
} as const;

const initialNodes: Node[] = [
  {
    id: "1",
    type: "editableNode",
    position: { x: 250, y: 5 },
    data: {
      label: "Start",
      // 表示名と変数名を持ちたい
      variableName: "startNode",
      // ノードの形状タイプ
      shapeType: "rectangle",
      // 削除機能は後でuseEffectで追加される
    },
  },
];

const initialEdges: Edge[] = [];

export function FlowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeId, setNodeId] = useState(2);
  const { open, onOpen, onClose } = useDisclosure();
  const [mermaidCode, setMermaidCode] = useState("");
  const connectingNodeId = useRef<string | null>(null);
  const { screenToFlowPosition } = useReactFlow();

  // ノードサイズをトークンから取得（フォールバック値あり）
  const nodeWidthToken = useToken("sizes", "xs");
  const nodeHeightToken = useToken("sizes", "6xs");

  // 文字列から数値に変換（pxを取り除いて数値化）
  const parseSize = (sizeStr: string | undefined, fallback: number): number => {
    if (!sizeStr) return fallback;
    const numValue = parseFloat(sizeStr.replace("px", "").replace("rem", ""));
    return isNaN(numValue) ? fallback : sizeStr.includes("rem") ? numValue * 16 : numValue;
  };

  const nodeWidth = parseSize(nodeWidthToken, 80); // フォールバック: 80px
  const nodeHeight = parseSize(nodeHeightToken, 48); // フォールバック: 48px

  // ノードラベル変更のハンドラー
  const handleLabelChange = useCallback(
    (nodeId: string, newLabel: string) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, label: newLabel } } : node
        )
      );
    },
    [setNodes]
  );

  // ノード変数名変更のハンドラー
  const handleVariableNameChange = useCallback(
    (nodeId: string, newVariableName: string) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, variableName: newVariableName } }
            : node
        )
      );
    },
    [setNodes]
  );

  // ノード形状変更のハンドラー
  const handleShapeTypeChange = useCallback(
    (nodeId: string, newShapeType: string) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, shapeType: newShapeType } } : node
        )
      );
    },
    [setNodes]
  );

  // ノード削除のハンドラー
  const handleNodeDelete = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    },
    [setNodes, setEdges]
  );

  // エッジラベル変更のハンドラー
  const handleEdgeLabelChange = useCallback(
    (edgeId: string, newLabel: string) => {
      setEdges((eds) =>
        eds.map((edge) =>
          edge.id === edgeId ? { ...edge, data: { ...edge.data, label: newLabel } } : edge
        )
      );
    },
    [setEdges]
  );

  // エッジ削除のハンドラー
  const handleEdgeDelete = useCallback(
    (edgeId: string) => {
      setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
    },
    [setEdges]
  );

  // エッジ矢印タイプ変更のハンドラー
  const handleEdgeArrowTypeChange = useCallback(
    (edgeId: string, arrowType: MermaidArrowType) => {
      setEdges((eds) =>
        eds.map((edge) =>
          edge.id === edgeId ? { ...edge, data: { ...edge.data, arrowType } } : edge
        )
      );
    },
    [setEdges]
  );

  // 初期ノードにhandleLabelChangeとhandleNodeDeleteを追加
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onLabelChange: handleLabelChange,
          onVariableNameChange: handleVariableNameChange,
          onShapeTypeChange: handleShapeTypeChange,
          onDelete: handleNodeDelete,
        },
      }))
    );
  }, [
    handleLabelChange,
    handleVariableNameChange,
    handleShapeTypeChange,
    handleNodeDelete,
    setNodes,
  ]);

  // エッジにハンドラーを追加
  useEffect(() => {
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        type: "editableEdge",
        data: {
          ...edge.data,
          onLabelChange: handleEdgeLabelChange,
          onArrowTypeChange: handleEdgeArrowTypeChange,
          onDelete: handleEdgeDelete,
        },
      }))
    );
  }, [handleEdgeLabelChange, handleEdgeArrowTypeChange, handleEdgeDelete, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        type: "editableEdge",
        data: {
          label: "",
          arrowType: "arrow" as MermaidArrowType,
          onLabelChange: handleEdgeLabelChange,
          onArrowTypeChange: handleEdgeArrowTypeChange,
          onDelete: handleEdgeDelete,
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
      // 既存のノードに接続された場合、フラグを設定
      connectingNodeId.current = "connected";
    },
    [setEdges, handleEdgeLabelChange, handleEdgeArrowTypeChange, handleEdgeDelete]
  );

  const onConnectStart = useCallback(
    (_: MouseEvent | TouchEvent | null, params: OnConnectStartParams) => {
      connectingNodeId.current = params.nodeId;
      // ハンドルタイプも保存
      connectingNodeId.current = `${params.nodeId}-${params.handleType}`;
    },
    []
  );

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      if (!connectingNodeId.current) return;

      // 既存のノードに接続された場合は新しいノードを作成しない
      if (connectingNodeId.current === "connected") {
        connectingNodeId.current = null;
        return;
      }

      const targetIsPane = (event?.target as Element)?.classList?.contains("react-flow__pane");

      if (targetIsPane && event) {
        // 接続情報を解析
        const { sourceNodeId, handleType } = parseConnectingNodeId(connectingNodeId.current);

        // 元のノードの位置を取得
        const sourceNode = nodes.find((node) => node.id === sourceNodeId);
        if (!sourceNode) return;

        // マウス位置を取得
        const mousePosition = screenToFlowPosition({
          x: (event as MouseEvent).clientX,
          y: (event as MouseEvent).clientY,
        });

        // 新しいノードの位置はマウス位置を使用
        const newPosition = calculateNodePosition(mousePosition, nodeWidth, nodeHeight);

        const newNode = createNewNode(nodeId, newPosition, {
          onLabelChange: handleLabelChange,
          onVariableNameChange: handleVariableNameChange,
          onShapeTypeChange: handleShapeTypeChange,
          onDelete: handleNodeDelete,
        });

        setNodes((nds) => nds.concat(newNode));

        // 新しいノードへのエッジを作成（方向を考慮）
        const newEdge = createNewEdge(sourceNodeId, nodeId.toString(), handleType, {
          onLabelChange: handleEdgeLabelChange,
          onArrowTypeChange: handleEdgeArrowTypeChange,
          onDelete: handleEdgeDelete,
        });
        setEdges((eds) => [...eds, newEdge]);

        setNodeId(nodeId + 1);
      }

      connectingNodeId.current = null;
    },
    [
      nodeId,
      setNodes,
      setEdges,
      screenToFlowPosition,
      handleLabelChange,
      handleVariableNameChange,
      handleShapeTypeChange,
      handleNodeDelete,
      handleEdgeLabelChange,
      handleEdgeArrowTypeChange,
      handleEdgeDelete,
      nodes,
      nodeWidth,
      nodeHeight,
    ]
  );

  const addNode = useCallback(() => {
    const newNode = createNewNode(
      nodeId,
      { x: Math.random() * 500, y: Math.random() * 500 },
      {
        onLabelChange: handleLabelChange,
        onVariableNameChange: handleVariableNameChange,
        onShapeTypeChange: handleShapeTypeChange,
        onDelete: handleNodeDelete,
      }
    );
    setNodes((nds) => nds.concat(newNode));
    setNodeId(nodeId + 1);
  }, [
    nodeId,
    setNodes,
    handleLabelChange,
    handleVariableNameChange,
    handleShapeTypeChange,
    handleNodeDelete,
  ]);

  const generateMermaidCodeCallback = useCallback(() => {
    const flowData: FlowData = { nodes, edges };
    const code = generateMermaidCode(flowData);
    setMermaidCode(code);
    onOpen();
  }, [nodes, edges, onOpen]);

  const handleImportMermaid = useCallback(
    (data: ParsedMermaidData) => {
      // ノードの階層構造を分析してレイアウトを決定
      const layoutNodes = (
        nodes: ParsedMermaidData["nodes"],
        edges: ParsedMermaidData["edges"]
      ) => {
        // ルートノード（入力エッジがないノード）を見つける
        const hasIncomingEdge = new Set(edges.map((edge) => edge.target));
        const rootNodes = nodes.filter((node) => !hasIncomingEdge.has(node.id));

        // 各ノードのレベル（階層）を計算
        const levels = new Map<string, number>();
        const visited = new Set<string>();

        const calculateLevel = (nodeId: string, level: number = 0): void => {
          if (visited.has(nodeId)) return;
          visited.add(nodeId);

          const currentLevel = levels.get(nodeId) ?? 0;
          levels.set(nodeId, Math.max(currentLevel, level));

          // 子ノードのレベルを計算
          const outgoingEdges = edges.filter((edge) => edge.source === nodeId);
          outgoingEdges.forEach((edge) => {
            calculateLevel(edge.target, level + 1);
          });
        };

        // ルートノードから階層を計算
        rootNodes.forEach((node) => calculateLevel(node.id, 0));

        // 残りのノードも処理（循環参照などがある場合）
        nodes.forEach((node) => {
          if (!levels.has(node.id)) {
            levels.set(node.id, 0);
          }
        });

        // レベルごとにノードをグループ化
        const nodesByLevel = new Map<number, string[]>();
        levels.forEach((level, nodeId) => {
          if (!nodesByLevel.has(level)) {
            nodesByLevel.set(level, []);
          }
          nodesByLevel.get(level)!.push(nodeId);
        });

        // 位置を計算
        const positions = new Map<string, { x: number; y: number }>();

        nodesByLevel.forEach((nodeIds, level) => {
          const levelWidth = nodeIds.length * LAYOUT_CONSTANTS.NODE_SPACING;
          const startX = -levelWidth / 2; // 中央揃え

          nodeIds.forEach((nodeId, index) => {
            positions.set(nodeId, {
              x: startX + index * LAYOUT_CONSTANTS.NODE_SPACING + LAYOUT_CONSTANTS.CENTER_OFFSET, // 左から右へノード配置（中央揃え）
              y: level * LAYOUT_CONSTANTS.LEVEL_HEIGHT + LAYOUT_CONSTANTS.VERTICAL_OFFSET, // 上から下へレベル配置
            });
          });
        });

        return positions;
      };

      const positions = layoutNodes(data.nodes, data.edges);

      // ParsedMermaidNodeをReactFlowのNode型に変換
      const convertedNodes: Node[] = data.nodes.map((parsedNode) => ({
        id: parsedNode.id,
        type: "editableNode",
        position: positions.get(parsedNode.id) || { x: 250, y: 50 }, // フォールバック位置
        data: {
          label: parsedNode.label,
          variableName: parsedNode.variableName,
          shapeType: parsedNode.shapeType,
          onLabelChange: handleLabelChange,
          onVariableNameChange: handleVariableNameChange,
          onShapeTypeChange: handleShapeTypeChange,
          onDelete: handleNodeDelete,
        },
      }));

      // ParsedMermaidEdgeをReactFlowのEdge型に変換
      const convertedEdges: Edge[] = data.edges.map((parsedEdge) => ({
        id: parsedEdge.id,
        source: parsedEdge.source,
        target: parsedEdge.target,
        type: "editableEdge",
        data: {
          label: parsedEdge.label,
          arrowType: parsedEdge.arrowType,
          onLabelChange: handleEdgeLabelChange,
          onArrowTypeChange: handleEdgeArrowTypeChange,
          onDelete: handleEdgeDelete,
        },
      }));

      setNodes(convertedNodes);
      setEdges(convertedEdges);

      // インポートしたノードの数だけnodeIdをインクリメント
      setNodeId(nodeId + data.nodes.length);
    },
    [
      setNodes,
      setEdges,
      nodeId,
      handleLabelChange,
      handleVariableNameChange,
      handleShapeTypeChange,
      handleNodeDelete,
      handleEdgeLabelChange,
      handleEdgeArrowTypeChange,
      handleEdgeDelete,
    ]
  );

  return (
    <Box h="100vh" w="full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        proOptions={{ hideAttribution: true }}
        fitView
      >
        <Controls />
        <Background />
        <FlowPanel
          onAddNode={addNode}
          onGenerateCode={generateMermaidCodeCallback}
          onImportMermaid={handleImportMermaid}
        />
        <ContributionPanel />
      </ReactFlow>

      <DownloadModal open={open} onClose={onClose} mermaidCode={mermaidCode} />
    </Box>
  );
}
