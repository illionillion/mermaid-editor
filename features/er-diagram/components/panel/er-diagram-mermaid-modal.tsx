import { DownloadIcon } from "@yamada-ui/lucide";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  HStack,
  Text,
  Button,
} from "@yamada-ui/react";
import { FC } from "react";
import { CopyButton, MermaidHighlight } from "@/components/ui";

export interface ERDiagramMermaidModalProps {
  open: boolean;
  onClose: () => void;
  code: string;
  onDownload: () => void;
}

export const ERDiagramMermaidModal: FC<ERDiagramMermaidModalProps> = ({
  open,
  onClose,
  code,
  onDownload,
}) => {
  return (
    <Modal open={open} onClose={onClose} size="2xl">
      <ModalHeader>
        <HStack
          justify={{ base: "space-between", md: "flex-start" }}
          display={{ base: "flex", md: "inline-flex" }}
          flexWrap="wrap"
          alignItems="center"
        >
          <Text>生成されたMermaidコード</Text>
          <Button
            startIcon={<DownloadIcon />}
            colorScheme="blue"
            size="sm"
            onClick={onDownload}
            ml={{ base: 0, md: "auto" }}
          >
            ダウンロード
          </Button>
        </HStack>
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody pb={6} position="relative">
        <CopyButton value={code} position="absolute" top={2} right={6} zIndex={1} />
        <MermaidHighlight code={code} />
      </ModalBody>
    </Modal>
  );
};
