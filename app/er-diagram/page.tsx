import { ERDiagramEditor } from "@/features/er-diagram/er-diagram-editor";

export const metadata = {
  title: "Mermmaid ER図エディター",
  description: "ER図を編集・可視化する",
};

export default function ERDiagramPage() {
  return <ERDiagramEditor />;
}
