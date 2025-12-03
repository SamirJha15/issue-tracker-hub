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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  User,
  Building2,
  FileText,
  AlertCircle,
  Tag,
  Clock,
  Edit,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";

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

// Staff members by department
const departmentStaff: Record<string, string[]> = {
  Carpentry: ["Mukesh", "Suresh", "Ramesh", "Kamlesh"],
  Plumber: ["Thakur Balaji Singh", "Rakesh Kumar", "Vijay Singh"],
  Electrical: ["Bhaskar Prasad M", "Anil Kumar", "Santosh"],
  "Telephone/Intercom": ["Bhaskar Prasad M", "Mohan Lal"],
};

// All departments for reassignment
const departments = [
  "Carpentry",
  "Plumber", 
  "Electrical",
  "Telephone/Intercom",
  "Quarters Related",
  "Kadamba Hostel - Carpentry",
  "Transport",
  "Civil",
  "Horticulture",
];

export const IssueDetailDrawer = ({ issue, open, onClose }: IssueDetailDrawerProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [assignedStaff, setAssignedStaff] = useState("");
  const [showReassignDialog, setShowReassignDialog] = useState(false);
  const [reassignDepartment, setReassignDepartment] = useState("");
  const [reassignReason, setReassignReason] = useState("");

  if (!issue) return null;

  // Extract department from office field
  const getDepartment = (office: string) => {
    // Handle cases like "Kadamba Hostel - Carpentry"
    if (office.includes(" - ")) {
      return office.split(" - ")[1];
    }
    return office;
  };

  const currentDepartment = getDepartment(issue.office);
  const availableStaff = departmentStaff[currentDepartment] || [];

  const handleEdit = () => {
    setIsEditing(true);
    setAssignedStaff(issue.assignee);
  };

  const handleSaveEdit = () => {
    // Here you would typically update the issue with the new assigned staff
    console.log("Updated assigned staff:", assignedStaff);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setAssignedStaff(issue.assignee);
  };

  const handleReassignConfirm = () => {
    // Here you would typically update the issue with the new department
    console.log("Reassigning to department:", reassignDepartment);
    console.log("Reason:", reassignReason);
    setShowReassignDialog(false);
    setReassignDepartment("");
    setReassignReason("");
  };

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
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium text-foreground">{issue.office}</div>
                  {isEditing && availableStaff.length > 0 && (
                    <Select value={assignedStaff} onValueChange={setAssignedStaff}>
                      <SelectTrigger className="w-[180px] h-8">
                        <SelectValue placeholder="Select staff" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableStaff.map((staff) => (
                          <SelectItem key={staff} value={staff}>
                            {staff}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
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
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-foreground">{issue.updated}</div>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowReassignDialog(true)}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Reassign Ticket
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Created By Info with Edit Button */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Created by <span className="font-medium text-foreground">{issue.author}</span>
            </div>
            {!isEditing ? (
              <Button
                size="sm"
                variant="outline"
                onClick={handleEdit}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveEdit}>
                  Save Changes
                </Button>
              </div>
            )}
          </div>

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
        </div>
      </SheetContent>

      {/* Reassignment Dialog */}
      <Dialog open={showReassignDialog} onOpenChange={setShowReassignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reassign Ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={reassignDepartment} onValueChange={setReassignDepartment}>
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Reassignment</Label>
              <Input
                id="reason"
                placeholder="e.g., Incorrectly assigned to plumber instead of electrician"
                value={reassignReason}
                onChange={(e) => setReassignReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReassignDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleReassignConfirm}
              disabled={!reassignDepartment || !reassignReason}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
};
