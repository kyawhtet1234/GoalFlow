"use client";

import { useState, useEffect, useCallback } from 'react';
import { addDays, format, getDay, isAfter, startOfDay } from 'date-fns';

export type Recurrence = {
  type: 'none' | 'daily' | 'weekly';
  days?: number[]; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
};

export type Task = {
  id: string;
  description: string;
  deadline: string | null;
  completed: boolean;
  categoryId: string | null;
  completedAt: string | null;
  recurrence: Recurrence;
  // This is the original ID for recurring tasks to link them together
  recurrenceId?: string; 
};

const STORAGE_KEY = 'goalflow-tasks';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem(STORAGE_KEY);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Failed to load tasks from local storage", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (error) {
        console.error("Failed to save tasks to local storage", error);
      }
    }
  }, [tasks, isLoaded]);

  const addTask = useCallback((description: string, deadline: Date | undefined, categoryId: string | null, recurrence: Recurrence) => {
    if (recurrence.type === 'none') {
        const newTask: Task = {
            id: crypto.randomUUID(),
            description,
            deadline: deadline ? deadline.toISOString() : null,
            completed: false,
            categoryId,
            completedAt: null,
            recurrence: { type: 'none' },
        };
        setTasks(prevTasks => [...prevTasks, newTask]);
    } else {
        const newTasks: Task[] = [];
        const today = startOfDay(new Date());
        const recurrenceId = crypto.randomUUID();

        for (let i = 0; i < 7; i++) { // Create tasks for the next 7 days
            const futureDate = addDays(today, i);
            const dayOfWeek = getDay(futureDate);

            let shouldCreate = false;
            if (recurrence.type === 'daily') {
                shouldCreate = true;
            } else if (recurrence.type === 'weekly' && recurrence.days?.includes(dayOfWeek)) {
                shouldCreate = true;
            }
            
            // For recurring tasks, don't create for past dates if a deadline was somehow selected
            if (deadline && isAfter(deadline, futureDate)) {
              shouldCreate = false;
            }

            if(shouldCreate) {
                const newTask: Task = {
                    id: crypto.randomUUID(),
                    recurrenceId: recurrenceId,
                    description,
                    deadline: futureDate.toISOString(),
                    completed: false,
                    categoryId,
                    completedAt: null,
                    recurrence: recurrence
                };
                newTasks.push(newTask);
            }
        }
        setTasks(prevTasks => [...prevTasks, ...newTasks]);
    }
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date().toISOString() : null } : task
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  }, []);

  return { tasks, addTask, toggleTask, deleteTask, setTasks, isLoaded };
}
