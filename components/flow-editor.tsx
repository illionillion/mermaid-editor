'use client';

import { ReactFlow, Node, Edge, addEdge, Controls, Background, useNodesState, useEdgesState, useReactFlow } from '@xyflow/react';
import { Box, useDisclosure } from '@yamada-ui/react';
import { useCallback, useState, useRef, useEffect } from 'react';
import { nodeTypes } from './node-types';
import { FlowPanel } from './flow-panel';
import { DownloadModal } from './download-modal';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'editableNode',
    position: { x: 250, y: 5 },
    data: { 
        label: 'Start',
        // 表示名と変数名を持ちたい
        variableName: 'start',
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
  const [mermaidCode, setMermaidCode] = useState('');
  const connectingNodeId = useRef<string | null>(null);
  const { screenToFlowPosition } = useReactFlow();

  // ノードラベル変更のハンドラー
  const handleLabelChange = useCallback((nodeId: string, newLabel: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, label: newLabel } }
          : node
      )
    );
  }, [setNodes]);

  // ノード削除のハンドラー
  const handleNodeDelete = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  }, [setNodes, setEdges]);

  // 初期ノードにhandleLabelChangeとhandleNodeDeleteを追加
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onLabelChange: handleLabelChange,
          onDelete: handleNodeDelete,
        },
      }))
    );
  }, [handleLabelChange, handleNodeDelete, setNodes]);

  const onConnect = useCallback(
    (params: any) => {
      setEdges((eds) => addEdge(params, eds));
      // 既存のノードに接続された場合、フラグを設定
      connectingNodeId.current = 'connected';
    },
    [setEdges]
  );

  const onConnectStart = useCallback((_: any, params: any) => {
    connectingNodeId.current = params.nodeId;
    // ハンドルタイプも保存
    connectingNodeId.current = `${params.nodeId}-${params.handleType}`;
  }, []);

  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!connectingNodeId.current) return;
      
      // 既存のノードに接続された場合は新しいノードを作成しない
      if (connectingNodeId.current === 'connected') {
        connectingNodeId.current = null;
        return;
      }

      const targetIsPane = (event.target as Element)?.classList?.contains('react-flow__pane');

      if (targetIsPane) {
        // 接続情報を解析
        const [sourceNodeId, handleType] = connectingNodeId.current.split('-');
        
        // 元のノードの位置を取得
        const sourceNode = nodes.find(node => node.id === sourceNodeId);
        if (!sourceNode) return;

        // マウス位置を取得
        const mousePosition = screenToFlowPosition({
          x: (event as MouseEvent).clientX,
          y: (event as MouseEvent).clientY,
        });

        // 新しいノードの位置はマウス位置を使用
        const newPosition = {
          x: mousePosition.x - 60, // ノード幅の半分を引いて中央に配置
          y: mousePosition.y - 20, // ノード高さの半分を引いて中央に配置
        };

        const newNode: Node = {
          id: nodeId.toString(),
          type: 'editableNode',
          position: newPosition,
          data: { 
            label: `Node ${nodeId}`,
            onLabelChange: handleLabelChange,
            onDelete: handleNodeDelete,
          },
        };

        setNodes((nds) => nds.concat(newNode));
        
        // 新しいノードへのエッジを作成（方向を考慮）
        const newEdge: Edge = {
          id: `${sourceNodeId}-${nodeId}`,
          source: handleType === 'source' ? sourceNodeId : nodeId.toString(),
          target: handleType === 'source' ? nodeId.toString() : sourceNodeId,
        };
        setEdges((eds) => [...eds, newEdge]);

        setNodeId(nodeId + 1);
      }

      connectingNodeId.current = null;
    },
    [nodeId, setNodes, setEdges, screenToFlowPosition, handleLabelChange, nodes]
  );

  const addNode = useCallback(() => {
    const newNode: Node = {
      id: nodeId.toString(),
      type: 'editableNode',
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: { 
        label: `Node ${nodeId}`,
        onLabelChange: handleLabelChange,
        onDelete: handleNodeDelete,
      },
    };
    setNodes((nds) => nds.concat(newNode));
    setNodeId(nodeId + 1);
  }, [nodeId, setNodes, handleLabelChange, handleNodeDelete]);

  const generateMermaidCode = useCallback(() => {
    let code = 'flowchart TD\n';
    
    // ノードの定義
    nodes.forEach((node) => {
      code += `    ${node.id}[${node.data.label}]\n`;
    });
    
    // エッジの定義
    edges.forEach((edge) => {
      code += `    ${edge.source} --> ${edge.target}\n`;
    });
    
    setMermaidCode(code);
    onOpen();
  }, [nodes, edges, onOpen]);

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
        fitView
      >
        <Controls />
        <Background />
        <FlowPanel onAddNode={addNode} onGenerateCode={generateMermaidCode} />
      </ReactFlow>

      <DownloadModal 
        open={open} 
        onClose={onClose} 
        mermaidCode={mermaidCode} 
      />
    </Box>
  );
}
