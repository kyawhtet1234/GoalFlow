"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Tag, Repeat } from "lucide-react";
import type { Category } from "@/hooks/use-categories";
import type { Recurrence } from "@/hooks/use-tasks";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "./ui/checkbox";

const RECURRENCE_TYPE = {
  NONE: 'none',
  DAILY: 'daily',
  WEEKLY: 'weekly',
} as const;

const weekDays = [
  { id: 1, label: "Mon" },
  { id: 2, label: "Tue" },
  { id: 3, label: "Wed" },
  { id: 4, label: "Thu" },
  { id: 5, label: "Fri" },
  { id: 6, label: "Sat" },
  { id: 0, label: "Sun" },
];

const formSchema = z.object({
  description: z.string().min(3, {
    message: "Task must be at least 3 characters.",
  }),
  deadline: z.date().optional(),
  categoryId: z.string().nullable(),
  recurrenceType: z.string(),
  recurrenceDays: z.array(z.number()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TaskFormProps {
  addTask: (description: string, deadline: Date | undefined, categoryId: string | null, recurrence: Recurrence) => void;
  categories: Category[];
}

const NO_CATEGORY_VALUE = "none";

export function TaskForm({ addTask, categories }: TaskFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      categoryId: null,
      recurrenceType: RECURRENCE_TYPE.NONE,
      recurrenceDays: [],
    },
  });

  const recurrenceType = form.watch("recurrenceType");

  function onSubmit(values: FormValues) {
    const categoryId = values.categoryId === NO_CATEGORY_VALUE ? null : values.categoryId;
    const recurrence: Recurrence = {
      type: values.recurrenceType as Recurrence['type'],
      days: values.recurrenceType === RECURRENCE_TYPE.WEEKLY ? values.recurrenceDays : undefined,
    }
    addTask(values.description, values.deadline, categoryId, recurrence);
    form.reset();
    form.setValue("categoryId", null);
    form.setValue("recurrenceType", RECURRENCE_TYPE.NONE);
    form.setValue("recurrenceDays", []);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a New Task</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="What's your next goal?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="recurrenceType"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <Repeat className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Select recurrence" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={RECURRENCE_TYPE.NONE}>This Day Only</SelectItem>
                        <SelectItem value={RECURRENCE_TYPE.DAILY}>Everyday</SelectItem>
                        <SelectItem value={RECURRENCE_TYPE.WEEKLY}>Selected Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {recurrenceType === RECURRENCE_TYPE.NONE && (
                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date(new Date().toDateString())}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
              )}

               <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value ?? NO_CATEGORY_VALUE}>
                      <FormControl>
                        <SelectTrigger>
                          <Tag className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={NO_CATEGORY_VALUE}>No Category</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            {recurrenceType === RECURRENCE_TYPE.WEEKLY && (
              <FormField
                control={form.control}
                name="recurrenceDays"
                render={() => (
                  <FormItem>
                     <div className="mb-4">
                        <FormLabel className="text-base">Repeat on</FormLabel>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        {weekDays.map((day) => (
                          <FormField
                            key={day.id}
                            control={form.control}
                            name="recurrenceDays"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={day.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(day.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value ?? []), day.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== day.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {day.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                  </FormItem>
                )}
              />
            )}
             <div className="flex justify-end pt-4">
              <Button type="submit" variant="default" className="bg-accent hover:bg-accent/90 w-full md:w-auto">
                <Plus className="h-4 w-4" />
                <span className="ml-2">Add Task</span>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
