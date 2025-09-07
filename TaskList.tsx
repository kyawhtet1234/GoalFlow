"use client";

import type { Task } from "@/hooks/use-tasks";
import type { Category } from "@/hooks/use-categories";
import { TaskItem } from "@/components/TaskItem";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { isSameDay, startOfToday } from "date-fns";

interface TaskListProps {
  tasks: Task[];
  categories: Category[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export function TaskList({ tasks, categories, onToggleTask, onDeleteTask }: TaskListProps) {
  const today = startOfToday();
  const pendingTasks = tasks.filter((task) => !task.completed).sort((a,b) => (a.deadline && b.deadline) ? new Date(a.deadline).getTime() - new Date(b.deadline).getTime() : a.deadline ? -1 : b.deadline ? 1 : 0);
  const todaysCompletedTasks = tasks.filter((task) => task.completed && task.completedAt && isSameDay(new Date(task.completedAt), today));
  
  const getCategory = (categoryId: string | null) => {
    return categories.find(c => c.id === categoryId);
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>To-Do</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingTasks.length > 0 ? (
            <ul className="space-y-4">
              {pendingTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  category={getCategory(task.categoryId)}
                  onToggle={onToggleTask}
                  onDelete={onDeleteTask}
                />
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              All tasks for today completed. Add a new one!
            </p>
          )}
        </CardContent>
      </Card>

      {todaysCompletedTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Completed Today</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {todaysCompletedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  category={getCategory(task.categoryId)}
                  onToggle={onToggleTask}
                  onDelete={onDeleteTask}
                />
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
