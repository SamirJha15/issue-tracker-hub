export type Priority = "High" | "Normal" | "Low";
export type Status = "Backlog" | "In Progress" | "Review" | "Done";

export interface Issue {
  id: string;
  subject: string;
  office: string;
  tracker: string;
  author: string;
  assignee: string;
  priority: Priority;
  status: Status;
  created: string;
  updated: string;
  description?: string;
}
