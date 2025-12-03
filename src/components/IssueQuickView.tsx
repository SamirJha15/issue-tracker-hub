import { Issue } from "@/types/issue";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  User,
  Building2,
  Tag,
  Clock,
  FileText,
  Edit,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect } from "react";

interface IssueQuickViewProps {
  issue: Issue | null;
  open: boolean;
  onClose: () => void;
  onUpdate?: (issueId: string, updates: Partial<Issue>) => void;
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

export const IssueQuickView = ({ issue, open, onClose, onUpdate }: IssueQuickViewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [assignedStaff, setAssignedStaff] = useState("");
  const [showReassignDialog, setShowReassignDialog] = useState(false);
  const [reassignDepartment, setReassignDepartment] = useState("");
  const [reassignReason, setReassignReason] = useState("");
  
  // Local state for displaying updated values
  const [currentAssignee, setCurrentAssignee] = useState("");
  const [currentOffice, setCurrentOffice] = useState("");

  // Sync state when issue changes or dialog opens
  useEffect(() => {
    if (issue) {
      setCurrentAssignee(issue.assignee);
      setCurrentOffice(issue.office);
    }
    // Reset edit mode when dialog closes or issue changes
    if (!open) {
      setIsEditing(false);
      setAssignedStaff("");
      setShowReassignDialog(false);
      setReassignDepartment("");
      setReassignReason("");
    }
  }, [issue?.id, open]); // Reset when issue changes or dialog opens

  if (!issue) return null;

  // Extract department from office field
  const getDepartment = (office: string) => {
    // Handle cases like "Kadamba Hostel - Carpentry"
    if (office.includes(" - ")) {
      return office.split(" - ")[1];
    }
    return office;
  };

  const currentDepartment = getDepartment(currentOffice);
  const availableStaff = departmentStaff[currentDepartment] || [];

  const handleEdit = () => {
    setIsEditing(true);
    setAssignedStaff(currentAssignee);
  };

  const handleSaveEdit = () => {
    // Update the assignee with the selected staff
    setCurrentAssignee(assignedStaff);
    console.log("Updated assigned staff:", assignedStaff);
    
    // Persist the change to parent component
    if (onUpdate && issue) {
      onUpdate(issue.id, { assignee: assignedStaff });
    }
    
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setAssignedStaff(currentAssignee);
  };

  const handleReassignConfirm = () => {
    // Update the office/department
    setCurrentOffice(reassignDepartment);
    console.log("Reassigning to department:", reassignDepartment);
    console.log("Reason:", reassignReason);
    
    // Persist the change to parent component
    if (onUpdate && issue) {
      onUpdate(issue.id, { office: reassignDepartment });
    }
    
    setShowReassignDialog(false);
    setReassignDepartment("");
    setReassignReason("");
    setIsEditing(false);
  };

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
              <div className="pl-5 flex items-center gap-3">
                <div className="text-foreground">{currentOffice}</div>
                {isEditing && availableStaff.length > 0 && (
                  <Select value={assignedStaff} onValueChange={setAssignedStaff}>
                    <SelectTrigger className="w-[180px] h-8">
                      <SelectValue placeholder="Assigned Staff" />
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

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground font-medium">Assignee</span>
              </div>
              <div className="pl-5 text-foreground">{currentAssignee}</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground font-medium">Updated</span>
              </div>
              <div className="pl-5 flex items-center justify-between gap-2">
                <div className="text-foreground">{issue.updated}</div>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowReassignDialog(true)}
                    className="flex items-center gap-2 h-8"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Reassign Ticket
                  </Button>
                )}
              </div>
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
        </div>
      </DialogContent>

      {/* Reassignment Dialog */}
      <Dialog open={showReassignDialog} onOpenChange={setShowReassignDialog}>
        <DialogContent className="sm:max-w-md">
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
    </Dialog>
  );
};
