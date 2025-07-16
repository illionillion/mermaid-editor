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
    data: { label: 'Start' },
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

  // 初期ノードにhandleLabelChangeを追加
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onLabelChange: handleLabelChange,
        },
      }))
    );
  }, [handleLabelChange, setNodes]);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onConnectStart = useCallback((_: any, params: any) => {
    connectingNodeId.current = params.nodeId;
  }, []);

  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!connectingNodeId.current) return;

      const targetIsPane = (event.target as Element)?.classList?.contains('react-flow__pane');

      if (targetIsPane) {
        // エッジの終点がペイン（空の領域）の場合、新しいノードを作成
        const position = screenToFlowPosition({
          x: (event as MouseEvent).clientX,
          y: (event as MouseEvent).clientY,
        });

        const newNode: Node = {
          id: nodeId.toString(),
          type: 'editableNode',
          position,
          data: { 
            label: `Node ${nodeId}`,
            onLabelChange: handleLabelChange,
          },
        };

        setNodes((nds) => nds.concat(newNode));
        
        // 新しいノードへのエッジを作成
        const newEdge: Edge = {
          id: `${connectingNodeId.current}-${nodeId}`,
          source: connectingNodeId.current,
          target: nodeId.toString(),
        };
        setEdges((eds) => [...eds, newEdge]);

        setNodeId(nodeId + 1);
      }

      connectingNodeId.current = null;
    },
    [nodeId, setNodes, setEdges, screenToFlowPosition, handleLabelChange]
  );

  const addNode = useCallback(() => {
    const newNode: Node = {
      id: nodeId.toString(),
      type: 'editableNode',
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: { 
        label: `Node ${nodeId}`,
        onLabelChange: handleLabelChange,
      },
    };
    setNodes((nds) => nds.concat(newNode));
    setNodeId(nodeId + 1);
  }, [nodeId, setNodes, handleLabelChange]);

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
