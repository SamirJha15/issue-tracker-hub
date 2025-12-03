import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Issue, Status } from "@/types/issue";
import { IssueCard } from "./IssueCard";
import { useRef } from "react";

interface SortableIssueCardProps {
  issue: Issue;
  onIssueClick: (issue: Issue) => void;
  onStatusChange?: (issueId: string, newStatus: Status) => void;
}

export const SortableIssueCard = ({ issue, onIssueClick, onStatusChange }: SortableIssueCardProps) => {
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);
  const hasMoved = useRef(false);
  
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: issue.id,
    data: {
      type: "issue",
      issue,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handlePointerDown = () => {
    hasMoved.current = false;
  };

  const handlePointerMove = () => {
    hasMoved.current = true;
  };

  const handlePointerUp = () => {
    // Use a small delay to ensure drag operations complete
    clickTimeout.current = setTimeout(() => {
      if (!hasMoved.current && !isDragging) {
        console.log('Click detected for issue:', issue.id);
        onIssueClick(issue);
      }
      hasMoved.current = false;
    }, 50);
  };

  const handleStatusChange = (newStatus: Status) => {
    if (onStatusChange) {
      onStatusChange(issue.id, newStatus);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <IssueCard 
        issue={issue} 
        onClick={() => {}} 
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};
