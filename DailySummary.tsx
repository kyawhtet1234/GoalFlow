"use client";

import type { Task } from "@/hooks/use-tasks";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface DailySummaryProps {
  tasks: Task[];
}

export function DailySummary({ tasks }: DailySummaryProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const remainingTasks = totalTasks - completedTasks;

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Your Daily Progress</CardTitle>
        <CardDescription>
          You've completed {completedTasks} of {totalTasks} tasks today. Keep it up!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progress} aria-label={`${Math.round(progress)}% of tasks complete`} />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{completedTasks} Completed</span>
          <span>{remainingTasks} Remaining</span>
        </div>
      </CardContent>
    </Card>
  );
}
