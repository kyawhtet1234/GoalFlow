"use client";

import { useState, useEffect, useCallback } from 'react';

const GOAL_STORAGE_KEY = 'goalflow-sales-goal';
const SALES_STORAGE_KEY = 'goalflow-todays-sales';

type TodaysSales = {
  amount: number;
  date: string;
};

export function useSalesGoal() {
  const [salesGoal, setSalesGoal] = useState<number>(1000);
  const [todaysSales, setTodaysSales] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const getTodayString = () => new Date().toISOString().split('T')[0];

  useEffect(() => {
    try {
      // Load sales goal
      const storedGoal = localStorage.getItem(GOAL_STORAGE_KEY);
      if (storedGoal) {
        setSalesGoal(JSON.parse(storedGoal));
      }

      // Load today's sales and reset if it's a new day
      const storedSales = localStorage.getItem(SALES_STORAGE_KEY);
      if (storedSales) {
        const salesData: TodaysSales = JSON.parse(storedSales);
        if (salesData.date === getTodayString()) {
          setTodaysSales(salesData.amount);
        } else {
          // It's a new day, so reset sales
          localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify({ amount: 0, date: getTodayString() }));
        }
      } else {
         localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify({ amount: 0, date: getTodayString() }));
      }

    } catch (error) {
      console.error("Failed to load sales data from local storage", error);
    }
    setIsLoaded(true);
  }, []);

  const updateSalesGoal = useCallback((newGoal: number) => {
    setSalesGoal(newGoal);
    try {
      localStorage.setItem(GOAL_STORAGE_KEY, JSON.stringify(newGoal));
    } catch (error) {
      console.error("Failed to save sales goal", error);
    }
  }, []);

  const addSales = useCallback((amount: number) => {
    const newTotalSales = todaysSales + amount;
    setTodaysSales(newTotalSales);
    try {
        const salesData: TodaysSales = {
            amount: newTotalSales,
            date: getTodayString()
        };
      localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(salesData));
    } catch (error) {
      console.error("Failed to save today's sales", error);
    }
  }, [todaysSales]);

  return { salesGoal, todaysSales, updateSalesGoal, addSales, isLoaded };
}
