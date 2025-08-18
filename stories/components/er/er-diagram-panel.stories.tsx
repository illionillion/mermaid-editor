import { ERDiagramPanel } from "../../../features/er-diagram/components/panel/er-diagram-panel";

export default {
  title: "ER/ERDiagramPanel",
  component: ERDiagramPanel,
};

export const Default = () => <ERDiagramPanel onAddTable={() => alert("テーブル追加")} />;
