"use client";

import * as React from "react";
import type { Task } from "@/hooks/use-tasks";
import type { Category } from "@/hooks/use-categories";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";
import { Skeleton } from "./ui/skeleton";

interface CategorySummaryProps {
  tasks: Task[];
  categories: Category[];
  isLoaded: boolean;
}

const chartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const UNCATEGORIZED = { id: "uncategorized", name: "Uncategorized" };

export function CategorySummary({ tasks, categories, isLoaded }: CategorySummaryProps) {
  const chartData = React.useMemo(() => {
    if (!isLoaded) return [];
    
    const allCategories = [...categories, UNCATEGORIZED];

    return allCategories.map(category => {
      const categoryTasks = tasks.filter(task => (task.categoryId ?? 'uncategorized') === category.id);
      const completedTasks = categoryTasks.filter(task => task.completed).length;
      return {
        category: category.name,
        completed: completedTasks,
        id: category.id
      };
    }).filter(data => data.completed > 0); // Only show categories with completed tasks

  }, [tasks, categories, isLoaded]);

  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {};
    chartData.forEach((data, index) => {
        config[data.category] = {
            label: data.category,
            color: chartColors[index % chartColors.length],
        }
    });
    return config;
  }, [chartData]);


  if (!isLoaded) {
    return <Skeleton className="h-80 w-full" />
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Completions by Category</CardTitle>
        <CardDescription>
          A breakdown of your completed tasks.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center pb-0">
        {chartData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="completed"
                nameKey="category"
                innerRadius={60}
                strokeWidth={5}
                labelLine={false}
                label={({
                  payload,
                  ...props
                }) => {
                  return (
                    <text
                      cx={props.cx}
                      cy={props.cy}
                      x={props.x}
                      y={props.y}
                      textAnchor={props.textAnchor}
                      dominantBaseline={props.dominantBaseline}
                      fill="hsla(var(--foreground))"
                      className="text-sm fill-foreground"
                    >
                      {`${payload.category} (${payload.completed})`}
                    </text>
                  )
                }}
              >
                 {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="category" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              />
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-8">
            <p className="text-muted-foreground">No completed tasks yet.</p>
            <p className="text-sm text-muted-foreground">Complete a task to see your progress here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
