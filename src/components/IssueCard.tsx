import { Issue, Status } from "@/types/issue";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, User, Building2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface IssueCardProps {
  issue: Issue;
  onClick: () => void;
  onStatusChange?: (newStatus: Status) => void;
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

const allStatuses: Status[] = ["Backlog", "In Progress", "Review", "Done"];

export const IssueCard = ({ issue, onClick, onStatusChange }: IssueCardProps) => {
  const handleClick = () => {
    console.log('IssueCard clicked:', issue.id);
    onClick();
  };

  const handleStatusChange = (newStatus: Status, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Status change:', issue.id, 'to', newStatus);
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
  };

  // Get all statuses except the current one
  const availableStatuses = allStatuses.filter(status => status !== issue.status);

  return (
    <Card
      className={`p-4 mb-3 hover:shadow-md transition-all duration-200 border-l-4 ${
        statusBorderColors[issue.status]
      } bg-card select-none cursor-pointer`}
      onClick={handleClick}
    >
      <div className="space-y-3">
        {/* Header with ID and Priority */}
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-semibold text-foreground">{issue.id}</span>
          <div className="flex items-center gap-2">
            <Badge className={`text-xs ${priorityColors[issue.priority]}`}>
              {issue.priority}
            </Badge>
            {/* Dropdown Menu for Status Change */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 rounded-full hover:bg-accent"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Move to</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {availableStatuses.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={(e) => handleStatusChange(status, e)}
                    className="cursor-pointer"
                  >
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
