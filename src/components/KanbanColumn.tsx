import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Issue } from "@/types/issue";
import { SortableIssueCard } from "./SortableIssueCard";

interface KanbanColumnProps {
  id: string;
  title: string;
  issues: Issue[];
  onIssueClick: (issue: Issue) => void;
  colorClass: string;
}

export const KanbanColumn = ({
  id,
  title,
  issues,
  onIssueClick,
  colorClass,
}: KanbanColumnProps) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div className={`${colorClass} rounded-t-xl p-4 border-b`}>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground">{title}</h2>
          <span className="text-sm font-medium text-muted-foreground bg-card px-2 py-1 rounded-md">
            {issues.length}
          </span>
        </div>
      </div>

      {/* Column Content */}
      <div
        ref={setNodeRef}
        className="flex-1 p-4 bg-card/50 rounded-b-xl overflow-y-auto min-h-[600px]"
      >
        <SortableContext items={issues.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {issues.map((issue) => (
            <SortableIssueCard key={issue.id} issue={issue} onIssueClick={onIssueClick} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};
