import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Issue } from "@/types/issue";
import { IssueCard } from "./IssueCard";

interface SortableIssueCardProps {
  issue: Issue;
  onIssueClick: (issue: Issue) => void;
}

export const SortableIssueCard = ({ issue, onIssueClick }: SortableIssueCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: issue.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <IssueCard issue={issue} onClick={() => onIssueClick(issue)} />
    </div>
  );
};
