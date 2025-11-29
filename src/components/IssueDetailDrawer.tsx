import { Issue } from "@/types/issue";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  User,
  Building2,
  FileText,
  AlertCircle,
  Tag,
  Edit,
  Clock,
} from "lucide-react";

interface IssueDetailDrawerProps {
  issue: Issue | null;
  open: boolean;
  onClose: () => void;
}

const priorityColors = {
  High: "bg-priority-high text-white",
  Normal: "bg-priority-normal text-white",
  Low: "bg-priority-low text-white",
};

export const IssueDetailDrawer = ({ issue, open, onClose }: IssueDetailDrawerProps) => {
  if (!issue) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3">
            <span className="text-2xl font-bold text-primary">{issue.id}</span>
            <Badge className={`${priorityColors[issue.priority]}`}>{issue.priority}</Badge>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Subject */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">{issue.subject}</h2>
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span className="font-medium">Description</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed pl-6">
              {issue.description || "No description provided."}
            </p>
          </div>

          <Separator />

          {/* Details Grid */}
          <div className="grid grid-cols-1 gap-4">
            {/* Office */}
            <div className="flex items-start gap-3">
              <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">Office</div>
                <div className="text-sm font-medium text-foreground">{issue.office}</div>
              </div>
            </div>

            {/* Tracker */}
            <div className="flex items-start gap-3">
              <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">Tracker</div>
                <div className="text-sm font-medium text-foreground">{issue.tracker}</div>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-start gap-3">
              <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">Status</div>
                <Badge variant="secondary" className="text-sm">
                  {issue.status}
                </Badge>
              </div>
            </div>

            {/* Author */}
            <div className="flex items-start gap-3">
              <User className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">Author</div>
                <div className="text-sm font-medium text-foreground">{issue.author}</div>
              </div>
            </div>

            {/* Assignee */}
            <div className="flex items-start gap-3">
              <User className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">Assignee</div>
                <div className="text-sm font-medium text-foreground">{issue.assignee}</div>
              </div>
            </div>

            {/* Created */}
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">Created</div>
                <div className="text-sm font-medium text-foreground">{issue.created}</div>
              </div>
            </div>

            {/* Updated */}
            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">Updated</div>
                <div className="text-sm font-medium text-foreground">{issue.updated}</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Activity Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="font-medium">Activity</span>
            </div>
            <div className="pl-6 text-sm text-muted-foreground">
              No recent activity
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="default" className="flex-1">
              <Edit className="h-4 w-4 mr-2" />
              Edit Issue
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
