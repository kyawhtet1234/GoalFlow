"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Check } from "lucide-react";

interface DailySalesGoalProps {
    salesGoal: number;
    todaysSales: number;
    updateSalesGoal: (goal: number) => void;
    addSales: (amount: number) => void;
    isLoaded: boolean;
}

export function DailySalesGoal({ salesGoal, todaysSales, updateSalesGoal, addSales, isLoaded }: DailySalesGoalProps) {
  const [salesToAdd, setSalesToAdd] = useState("");
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState(salesGoal.toString());

  const progress = salesGoal > 0 ? (todaysSales / salesGoal) * 100 : 0;
  const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MMK', minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const handleAddSales = () => {
    const amount = parseFloat(salesToAdd);
    if (!isNaN(amount) && amount > 0) {
      addSales(amount);
      setSalesToAdd("");
    }
  };

  const handleUpdateGoal = () => {
    const goalAmount = parseInt(newGoal, 10);
    if (!isNaN(goalAmount) && goalAmount > 0) {
      updateSalesGoal(goalAmount);
      setIsEditingGoal(false);
    }
  }

  if (!isLoaded) return null;

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
            <div>
                <CardTitle>Daily Sales Goal</CardTitle>
                <CardDescription>
                    Your progress towards your daily sales target.
                </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsEditingGoal(!isEditingGoal)} className="h-8 w-8 flex-shrink-0">
                {isEditingGoal ? <Check className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                <span className="sr-only">{isEditingGoal ? "Save Goal" : "Edit Goal"}</span>
            </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditingGoal ? (
            <div className="flex flex-col sm:flex-row gap-2">
                <Input
                    type="number"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUpdateGoal()}
                    placeholder="Set your goal"
                />
                <Button onClick={handleUpdateGoal} className="flex-shrink-0">Set Goal</Button>
            </div>
        ) : (
            <>
                <Progress value={progress} aria-label={`${Math.round(progress)}% of sales goal complete`} />
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{currencyFormatter.format(todaysSales)}</span>
                    <span>Goal: {currencyFormatter.format(salesGoal)}</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <div className="relative flex-grow">
                        <Input
                            type="number"
                            placeholder="Add sales amount"
                            value={salesToAdd}
                            onChange={(e) => setSalesToAdd(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddSales()}
                        />
                    </div>
                    <Button onClick={handleAddSales} className="flex-shrink-0">Add</Button>
                </div>
            </>
        )}
      </CardContent>
    </Card>
  );
}
