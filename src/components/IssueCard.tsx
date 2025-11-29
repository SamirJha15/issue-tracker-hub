import { Issue } from "@/types/issue";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, User, Building2 } from "lucide-react";

interface IssueCardProps {
  issue: Issue;
  onClick: () => void;
}

const priorityColors = {
  High: "bg-priority-high text-white",
  Normal: "bg-priority-normal text-white",
  Low: "bg-priority-low text-white",
};

const statusBorderColors = {
  Backlog: "border-l-status-new",
  "In Progress": "border-l-status-progress",
  Review: "border-l-status-review",
  Done: "border-l-status-done",
};

export const IssueCard = ({ issue, onClick }: IssueCardProps) => {
  return (
    <Card
      className={`p-4 mb-3 cursor-pointer hover:shadow-md transition-all duration-200 border-l-4 ${
        statusBorderColors[issue.status]
      } bg-card`}
      onClick={onClick}
    >
      <div className="space-y-3">
        {/* Header with ID and Priority */}
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-semibold text-foreground">{issue.id}</span>
          <Badge className={`text-xs ${priorityColors[issue.priority]}`}>
            {issue.priority}
          </Badge>
        </div>

        {/* Subject */}
        <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
          {issue.subject}
        </h3>

        {/* Office */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Building2 className="h-3 w-3" />
          <span className="line-clamp-1">{issue.office}</span>
        </div>

        {/* Footer with assignee and dates */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-1.5">
            <User className="h-3 w-3" />
            <span className="line-clamp-1">{issue.assignee}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            <span className="whitespace-nowrap">{issue.updated.split(" ")[0]}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
