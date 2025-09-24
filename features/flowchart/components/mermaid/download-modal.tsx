"use client";

import {
  ChevronDownIcon,
  DownloadIcon,
  ArrowUpIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ArrowDownIcon,
} from "@yamada-ui/lucide";
import type { Component, IconProps, FC } from "@yamada-ui/react";
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
} from "@yamada-ui/react";
import { useCallback, useState, useMemo } from "react";
import { CopyButton, MermaidHighlight } from "@/components/ui";
import type { FlowData } from "../../hooks/flow-helpers";
import { generateMermaidCode } from "../../hooks/mermaid";
import type { GraphType } from "../../types/";

interface DownloadModalProps {
  open: boolean;
  onClose: () => void;
  flowData: FlowData;
}

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

export const DownloadModal: FC<DownloadModalProps> = ({ open, onClose, flowData }) => {
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
            onClick={downloadMermaidCode}
            ml={{ base: 0, md: "auto" }}
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
        <CopyButton value={currentMermaidCode} position="absolute" top={2} right={6} zIndex={1} />
        <MermaidHighlight code={currentMermaidCode} />
      </ModalBody>
    </Modal>
  );
};
