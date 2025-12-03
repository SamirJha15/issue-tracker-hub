import { Issue } from "@/types/issue";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  User,
  Building2,
  Tag,
  Clock,
  FileText,
} from "lucide-react";

interface IssueQuickViewProps {
  issue: Issue | null;
  open: boolean;
  onClose: () => void;
}

const priorityColors = {
  High: "bg-destructive hover:bg-destructive/90",
  Normal: "bg-orange-500 hover:bg-orange-600", 
  Low: "bg-green-500 hover:bg-green-600",
};

const statusColors = {
  Backlog: "bg-muted-foreground",
  "In Progress": "bg-primary",
  Review: "bg-purple-500",
  Done: "bg-green-600",
};

export const IssueQuickView = ({ issue, open, onClose }: IssueQuickViewProps) => {
  if (!issue) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-4">
          <div className="flex items-start justify-between">
            <DialogTitle className="flex items-center gap-3 text-lg">
              <span className="font-mono text-primary hover:text-primary/80 cursor-pointer transition-colors">
                {issue.id}
              </span>
              <Badge className={`${priorityColors[issue.priority]} text-white text-xs`}>
                {issue.priority}
              </Badge>
              <Badge 
                variant="secondary" 
                className={`${statusColors[issue.status]} text-white border-0 text-xs`}
              >
                {issue.status}
              </Badge>
            </DialogTitle>
          </div>
          <h2 className="text-base font-semibold text-left text-foreground leading-relaxed">
            {issue.subject}
          </h2>
        </DialogHeader>

        <div className="space-y-4">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Tag className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground font-medium">Tracker</span>
              </div>
              <div className="pl-5 text-foreground">{issue.tracker}</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building2 className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground font-medium">Office</span>
              </div>
              <div className="pl-5 text-foreground">{issue.office}</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground font-medium">Assignee</span>
              </div>
              <div className="pl-5 text-foreground">{issue.assignee}</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground font-medium">Updated</span>
              </div>
              <div className="pl-5 text-foreground">{issue.updated}</div>
            </div>
          </div>

          <Separator />

          {/* Description Preview */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-foreground">Description</span>
            </div>
            <div className="text-sm text-foreground leading-relaxed bg-muted/50 p-3 rounded-md">
              {issue.description ? (
                <p className="line-clamp-4">
                  {issue.description}
                </p>
              ) : (
                <p className="text-muted-foreground italic">No description provided.</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Quick Actions */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-muted-foreground">
              Created by <span className="font-medium text-foreground">{issue.author}</span> • {issue.created}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
