import { useState, useMemo } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { Issue, Status } from "@/types/issue";
import { mockIssues } from "@/data/mockIssues";
import { KanbanColumn } from "@/components/KanbanColumn";
import { IssueCard } from "@/components/IssueCard";
import { IssueQuickView } from "@/components/IssueQuickView";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, User } from "lucide-react";

const Index = () => {
  const [issues, setIssues] = useState<Issue[]>(mockIssues);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");

  // Extract unique departments from issues
  const departments = useMemo(() => {
    const deptSet = new Set(issues.map((issue) => issue.office));
    return Array.from(deptSet).sort();
  }, [issues]);

  const columns: { id: Status; title: string; colorClass: string }[] = [
    { id: "Backlog", title: "Backlog", colorClass: "bg-column-backlog" },
    { id: "In Progress", title: "In Progress", colorClass: "bg-column-progress" },
    { id: "Review", title: "Review", colorClass: "bg-column-review" },
    { id: "Done", title: "Done", colorClass: "bg-column-done" },
  ];

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      searchQuery === "" ||
      issue.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.office.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment =
      selectedDepartment === "all" || issue.office === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const getIssuesByStatus = (status: Status) => {
    return filteredIssues.filter((issue) => issue.status === status);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeIssue = issues.find((issue) => issue.id === active.id);
    
    // Check if dropping over a column or another issue
    let targetStatus: Status | undefined;
    
    // First check if dropping directly on a column
    const overColumn = columns.find((col) => col.id === over.id);
    if (overColumn) {
      targetStatus = overColumn.id;
    } else {
      // If not, check if dropping on another issue and get that issue's status
      const overIssue = issues.find((issue) => issue.id === over.id);
      if (overIssue) {
        targetStatus = overIssue.status;
      }
    }

    if (activeIssue && targetStatus && activeIssue.status !== targetStatus) {
      setIssues((prevIssues) =>
        prevIssues.map((issue) =>
          issue.id === activeIssue.id ? { ...issue, status: targetStatus } : issue
        )
      );
    }
  };

  const handleIssueClick = (issue: Issue) => {
    console.log('Issue clicked:', issue.id);
    setSelectedIssue(issue);
    setQuickViewOpen(true);
  };

  const handleStatusChange = (issueId: string, newStatus: Status) => {
    console.log('Status change:', issueId, 'to', newStatus);
    setIssues((prevIssues) =>
      prevIssues.map((issue) =>
        issue.id === issueId ? { ...issue, status: newStatus } : issue
      )
    );
  };

  const handleIssueUpdate = (issueId: string, updates: Partial<Issue>) => {
    console.log('Issue update:', issueId, updates);
    setIssues((prevIssues) =>
      prevIssues.map((issue) =>
        issue.id === issueId ? { ...issue, ...updates } : issue
      )
    );
    // Update selected issue to reflect changes
    if (selectedIssue && selectedIssue.id === issueId) {
      setSelectedIssue({ ...selectedIssue, ...updates });
    }
  };

  const activeIssue = activeId ? issues.find((issue) => issue.id === activeId) : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h1 className="text-2xl font-bold text-foreground">Issue Manager</h1>
            <div className="flex items-center gap-3 flex-1 max-w-3xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search issues..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>admin@college.edu</span>
            </div>
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="container mx-auto px-6 py-8">
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {columns.map((column) => (
              <div key={column.id} className="flex-shrink-0 w-80">
                <KanbanColumn
                  id={column.id}
                  title={column.title}
                  issues={getIssuesByStatus(column.id)}
                  onIssueClick={handleIssueClick}
                  onStatusChange={handleStatusChange}
                  colorClass={column.colorClass}
                />
              </div>
            ))}
          </div>
          <DragOverlay>
            {activeIssue ? (
              <IssueCard issue={activeIssue} onClick={() => {}} />
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>

      {/* Issue Quick View Popup */}
      <IssueQuickView
        issue={selectedIssue}
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
        onUpdate={handleIssueUpdate}
      />
    </div>
  );
};

export default Index;
