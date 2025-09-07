"use client";

import { format } from "date-fns";
import { Calendar, Trash2, Tag } from "lucide-react";
import type { Task } from "@/hooks/use-tasks";
import type { Category } from "@/hooks/use-categories";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "./ui/badge";

interface TaskItemProps {
  task: Task;
  category: Category | undefined;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, category, onToggle, onDelete }: TaskItemProps) {
  const isOverdue = task.deadline && !task.completed && new Date(task.deadline) < new Date(new Date().toDateString());

  return (
    <li
      className={cn(
        "transition-opacity",
        task.completed && "opacity-60"
      )}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="flex items-start gap-4 p-4">
          <Checkbox
            id={`task-${task.id}`}
            checked={task.completed}
            onCheckedChange={() => onToggle(task.id)}
            aria-label={`Mark task '${task.description}' as ${
              task.completed ? "incomplete" : "complete"
            }`}
            className="h-6 w-6 mt-1"
          />
          <div className="flex-grow grid gap-2">
            <label
              htmlFor={`task-${task.id}`}
              className={cn(
                "font-medium cursor-pointer transition-all",
                task.completed && "line-through text-muted-foreground"
              )}
            >
              {task.description}
            </label>
            <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
              {task.deadline && (
                <div
                  className={cn(
                    "flex items-center",
                    isOverdue && "text-destructive"
                  )}
                >
                  <Calendar className="mr-1.5 h-3.5 w-3.5" />
                  <span>{format(new Date(task.deadline), "MMM d, yyyy")}</span>
                  {isOverdue && <Badge variant="destructive" className="ml-2">Overdue</Badge>}
                </div>
              )}
              {category && (
                 <div className="flex items-center">
                    <Tag className="mr-1.5 h-3.5 w-3.5" />
                    <Badge variant="secondary">{category.name}</Badge>
                 </div>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task.id)}
            aria-label={`Delete task '${task.description}'`}
            className="text-muted-foreground hover:text-destructive shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </li>
  );
}
