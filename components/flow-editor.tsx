'use client';

import { ReactFlow, Node, Edge, addEdge, Controls, Background, useNodesState, useEdgesState, useReactFlow } from '@xyflow/react';
import { Box, useDisclosure, useToken } from '@yamada-ui/react';
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
        variableName: 'startNode',
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

  // ノードサイズをトークンから取得（フォールバック値あり）
  const nodeWidthToken = useToken("sizes", "xs");
  const nodeHeightToken = useToken("sizes", "6xs");
  
  // 文字列から数値に変換（pxを取り除いて数値化）
  const parseSize = (sizeStr: string | undefined, fallback: number): number => {
    if (!sizeStr) return fallback;
    const numValue = parseFloat(sizeStr.replace('px', '').replace('rem', ''));
    return isNaN(numValue) ? fallback : (sizeStr.includes('rem') ? numValue * 16 : numValue);
  };
  
  const nodeWidth = parseSize(nodeWidthToken, 80); // フォールバック: 80px
  const nodeHeight = parseSize(nodeHeightToken, 48); // フォールバック: 48px

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

  // ノード変数名変更のハンドラー
  const handleVariableNameChange = useCallback((nodeId: string, newVariableName: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, variableName: newVariableName } }
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
          onVariableNameChange: handleVariableNameChange,
          onDelete: handleNodeDelete,
        },
      }))
    );
  }, [handleLabelChange, handleVariableNameChange, handleNodeDelete, setNodes]);

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
          x: mousePosition.x - nodeWidth / 2, // ノード幅の半分を引いて中央に配置
          y: mousePosition.y - nodeHeight / 2, // ノード高さの半分を引いて中央に配置
        };

        const newNode: Node = {
          id: nodeId.toString(),
          type: 'editableNode',
          position: newPosition,
          data: { 
            label: `Node ${nodeId}`,
            variableName: `node${nodeId}`,
            onLabelChange: handleLabelChange,
            onVariableNameChange: handleVariableNameChange,
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
    [nodeId, setNodes, setEdges, screenToFlowPosition, handleLabelChange, nodes, nodeWidth, nodeHeight]
  );

  const addNode = useCallback(() => {
    const newNode: Node = {
      id: nodeId.toString(),
      type: 'editableNode',
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: { 
        label: `Node ${nodeId}`,
        variableName: `node${nodeId}`,
        onLabelChange: handleLabelChange,
        onVariableNameChange: handleVariableNameChange,
        onDelete: handleNodeDelete,
      },
    };
    setNodes((nds) => nds.concat(newNode));
    setNodeId(nodeId + 1);
  }, [nodeId, setNodes, handleLabelChange, handleVariableNameChange, handleNodeDelete]);

  const generateMermaidCode = useCallback(() => {
    let code = 'flowchart TD\n';
    
    // Mermaidの予約語リスト
    const reservedWords = new Set([
      'end', 'start', 'subgraph', 'class', 'classDef', 'click', 'style',
      'linkStyle', 'direction', 'flowchart', 'graph', 'if', 'else', 'elseif',
      'while', 'for', 'function', 'return', 'break', 'continue'
    ]);

    // 安全な変数名を生成する関数
    const getSafeVariableName = (variableName: string): string => {
      // 空文字チェック
      if (!variableName || variableName.trim() === '') {
        return 'node_unnamed';
      }

      let safeName = variableName.trim();
      
      // 予約語チェック
      if (reservedWords.has(safeName.toLowerCase())) {
        safeName = `node_${safeName}`;
      }
      
      // 先頭が数字の場合はアンダースコアを追加
      if (/^[0-9]/.test(safeName)) {
        safeName = `_${safeName}`;
      }
      
      // スペースやタブなどの空白文字のみアンダースコアに変換
      // 日本語文字（ひらがな、カタカナ、漢字）は保持
      safeName = safeName.replace(/\s+/g, '_');
      
      // 特殊記号のみ変換（日本語文字は保持）
      safeName = safeName.replace(/[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '_');
      
      return safeName;
    };

    // ノードの定義
    nodes.forEach((node) => {
      const variableName = (node.data.variableName as string) || `node${node.id}`;
      const safeVariableName = getSafeVariableName(variableName);
      code += `    ${safeVariableName}[${node.data.label}]\n`;
    });
    
    // エッジの定義
    edges.forEach((edge) => {
      // ノードIDから変数名を取得
      const sourceNode = nodes.find(node => node.id === edge.source);
      const targetNode = nodes.find(node => node.id === edge.target);
      
      if (sourceNode && targetNode) {
        const sourceVariableName = getSafeVariableName((sourceNode.data.variableName as string) || `node${sourceNode.id}`);
        const targetVariableName = getSafeVariableName((targetNode.data.variableName as string) || `node${targetNode.id}`);
        code += `    ${sourceVariableName} --> ${targetVariableName}\n`;
      }
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
