"use client";

import * as React from "react";
import { format, isSameDay, startOfToday } from "date-fns";
import type { Task } from "@/hooks/use-tasks";
import type { Category } from "@/hooks/use-categories";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { TaskItem } from "./TaskItem";

interface CompletedHistoryProps {
  tasks: Task[];
  categories: Category[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export function CompletedHistory({ tasks, categories, onToggleTask, onDeleteTask }: CompletedHistoryProps) {
  const today = startOfToday();
  const getCategory = (categoryId: string | null) => {
    return categories.find(c => c.id === categoryId);
  }

  const completedHistory = React.useMemo(() => {
    const history: Record<string, Task[]> = {};
    tasks
      .filter(task => task.completed && task.completedAt && !isSameDay(new Date(task.completedAt), today))
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
      .forEach(task => {
        const dateKey = format(new Date(task.completedAt!), "yyyy-MM-dd");
        if (!history[dateKey]) {
          history[dateKey] = [];
        }
        history[dateKey].push(task);
      });
    return history;
  }, [tasks, today]);

  const historyDates = Object.keys(completedHistory);

  if (historyDates.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Completed History</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          {historyDates.map(date => (
            <AccordionItem value={date} key={date}>
              <AccordionTrigger>{format(new Date(date), "PPP")} ({completedHistory[date].length} tasks)</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-4 pt-2">
                  {completedHistory[date].map(task => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      category={getCategory(task.categoryId)}
                      onToggle={onToggleTask}
                      onDelete={onDeleteTask}
                    />
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
