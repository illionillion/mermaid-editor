"use client";

import {
  ChevronDownIcon,
  DownloadIcon,
  ArrowUpIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ArrowDownIcon,
} from "@yamada-ui/lucide";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  HStack,
  Text,
  Button,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Component,
  IconProps,
} from "@yamada-ui/react";
import { useCallback, useState, useMemo } from "react";
import { generateMermaidCode } from "../../utils/mermaid";
import { FlowData } from "../flow/flow-helpers";
import { CopyButton } from "../ui";
import { MermaidHighlight } from "./mermaid-highlight";

interface DownloadModalProps {
  open: boolean;
  onClose: () => void;
  flowData: FlowData;
}

type GraphType = "TD" | "LR" | "RL" | "BT";
type GraphTypeWithArrow = {
  type: GraphType;
  arrow: Component<"svg", IconProps>;
};
const graphType: GraphTypeWithArrow[] = [
  { type: "TD", arrow: ArrowDownIcon },
  { type: "LR", arrow: ArrowRightIcon },
  { type: "RL", arrow: ArrowLeftIcon },
  { type: "BT", arrow: ArrowUpIcon },
];

export function DownloadModal({ open, onClose, flowData }: DownloadModalProps) {
  const [currentGraphType, setCurrentGraphType] = useState<GraphType>("TD");

  // 現在選択されている方向でMermaidコードを生成
  const currentMermaidCode = useMemo(() => {
    return generateMermaidCode(flowData, currentGraphType);
  }, [flowData, currentGraphType]);

  const downloadMermaidCode = useCallback(() => {
    const element = document.createElement("a");
    const file = new Blob([currentMermaidCode], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "flowchart.mmd";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }, [currentMermaidCode]);

  const { open: openMenu, onOpen: onOpenMenu, onClose: onCloseMenu } = useDisclosure();

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

          <Menu open={openMenu} onOpen={onOpenMenu} onClose={onCloseMenu}>
            <MenuButton size="sm" as={Button} rightIcon={<ChevronDownIcon fontSize="xl" />}>
              {currentGraphType}
            </MenuButton>

            <MenuList>
              {graphType.map((graph) => (
                <MenuItem
                  key={graph.type}
                  icon={<graph.arrow />}
                  bgColor={graph.type === currentGraphType ? "primary.50" : "transparent"}
                  onClick={() => setCurrentGraphType(graph.type)}
                >
                  {graph.type}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </HStack>
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody pb={6} position="relative">
        {/* コピーボタン */}
        <CopyButton value={currentMermaidCode} position="absolute" top={2} right={6} zIndex={1} />
        <MermaidHighlight code={currentMermaidCode} />
      </ModalBody>
    </Modal>
  );
}
