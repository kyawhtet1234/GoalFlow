"use client";

import { useCallback, useState } from "react";
import { useTasks } from "@/hooks/use-tasks";
import { useCategories } from "@/hooks/use-categories";
import { useSalesGoal } from "@/hooks/use-sales-goal";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/Logo";
import { DailySummary } from "@/components/DailySummary";
import { DailySalesGoal } from "@/components/DailySalesGoal";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { MotivationalMessage } from "@/components/MotivationalMessage";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CategoryManager } from "@/components/CategoryManager";
import { Settings } from "lucide-react";
import { CategorySummary } from "@/components/CategorySummary";
import { CompletedHistory } from "@/components/CompletedHistory";

export default function Home() {
  const { tasks, addTask, toggleTask, deleteTask, setTasks, isLoaded: tasksLoaded } = useTasks();
  const { categories, addCategory, editCategory, deleteCategory, isLoaded: categoriesLoaded } = useCategories();
  const { salesGoal, todaysSales, updateSalesGoal, addSales, isLoaded: salesLoaded } = useSalesGoal();
  const { toast } = useToast();
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  
  const isLoaded = tasksLoaded && categoriesLoaded && salesLoaded;

  const handleToggleTask = useCallback(
    (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (task && !task.completed) {
        const completionMessages = [
          "Great job!",
          "You're on a roll!",
          "One step closer!",
          "Done and dusted!",
          "Awesome!",
        ];
        const message =
          completionMessages[
            Math.floor(Math.random() * completionMessages.length)
          ];
        toast({
          title: "Task Completed!",
          description: message,
        });
      }
      toggleTask(id);
    },
    [tasks, toggleTask, toast]
  );

  const handleDeleteTask = useCallback(
    (id: string) => {
      const taskToDelete = tasks.find(t => t.id === id);
      if (taskToDelete?.recurrenceId) {
        // This is a recurring task, delete all instances.
         setTasks(prevTasks => prevTasks.filter(task => task.recurrenceId !== taskToDelete.recurrenceId));
      } else {
        deleteTask(id);
      }
    },
    [tasks, deleteTask, setTasks]
  );

  const handleDeleteCategory = (categoryId: string) => {
    // Remove categoryId from tasks that have it
    setTasks(prevTasks => prevTasks.map(task => 
      task.categoryId === categoryId ? { ...task, categoryId: null } : task
    ));
    deleteCategory(categoryId);
  };

  return (
    <main className="container mx-auto max-w-4xl p-4 md:p-8">
      <header className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Logo />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
            GoalFlow
          </h1>
        </div>
        <Button variant="outline" size="icon" onClick={() => setIsCategoryManagerOpen(true)}>
          <Settings className="h-5 w-5" />
          <span className="sr-only">Manage Categories</span>
        </Button>
      </header>

      <CategoryManager 
        isOpen={isCategoryManagerOpen}
        onOpenChange={setIsCategoryManagerOpen}
        categories={categories}
        addCategory={addCategory}
        editCategory={editCategory}
        deleteCategory={handleDeleteCategory}
      />

      <div className="space-y-8">
        <MotivationalMessage />
        
        <div className="grid lg:grid-cols-2 gap-8">
          <DailySummary tasks={tasks} />
          <DailySalesGoal 
            salesGoal={salesGoal}
            todaysSales={todaysSales}
            updateSalesGoal={updateSalesGoal}
            addSales={addSales}
            isLoaded={isLoaded}
          />
        </div>

        <CategorySummary tasks={tasks} categories={categories} isLoaded={isLoaded} />

        <TaskForm addTask={addTask} categories={categories} />
        
        {isLoaded ? (
          <>
            <TaskList
              tasks={tasks}
              categories={categories}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
            />
            <CompletedHistory
              tasks={tasks}
              categories={categories}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
            />
          </>
        ) : (
           <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
           </div>
        )}
      </div>

      <footer className="text-center mt-12 text-sm text-muted-foreground">
        <p>Achieve more, one task at a time.</p>
      </footer>
    </main>
  );
}
