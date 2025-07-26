'use client';

import { Modal, ModalHeader, ModalBody, ModalCloseButton, HStack, Text, Button } from '@yamada-ui/react';
import { DownloadIcon } from '@yamada-ui/lucide';
import { useCallback } from 'react';
import { CopyButton } from '../ui';
import { MermaidHighlight } from './mermaid-highlight';

interface DownloadModalProps {
  open: boolean;
  onClose: () => void;
  mermaidCode: string;
}

export function DownloadModal({ open, onClose, mermaidCode }: DownloadModalProps) {
  const downloadMermaidCode = useCallback(() => {
    const element = document.createElement('a');
    const file = new Blob([mermaidCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'flowchart.mmd';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }, [mermaidCode]);

  return (
    <Modal open={open} onClose={onClose} size="2xl">
      <ModalHeader>
        <HStack justify="space-between">
          <Text>生成されたMermaidコード</Text>
          <Button
            startIcon={<DownloadIcon />}
            colorScheme="blue"
            size="sm"
            onClick={downloadMermaidCode}
          >
            ダウンロード
          </Button>
        </HStack>
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody pb={6} position="relative">
        {/* コピーボタン */}
        <CopyButton value={mermaidCode} position="absolute" top={2} right={6} zIndex={1} />
        <MermaidHighlight code={mermaidCode} />
      </ModalBody>
    </Modal>
  );
}
