"use client";

import { useState, useEffect, useCallback } from 'react';

export type Category = {
  id: string;
  name: string;
};

const STORAGE_KEY = 'goalflow-categories';

const defaultCategories: Category[] = [
    { id: 'work', name: 'Work' },
    { id: 'personal', name: 'Personal' },
    { id: 'health', name: 'Health' },
];

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedCategories = localStorage.getItem(STORAGE_KEY);
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      } else {
        setCategories(defaultCategories);
      }
    } catch (error) {
      console.error("Failed to load categories from local storage", error);
      setCategories(defaultCategories);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
      } catch (error) {
        console.error("Failed to save categories to local storage", error);
      }
    }
  }, [categories, isLoaded]);

  const addCategory = useCallback((name: string) => {
    if (name.trim() === '') return;
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name,
    };
    setCategories(prev => [...prev, newCategory]);
  }, []);

  const editCategory = useCallback((id: string, newName: string) => {
    if (newName.trim() === '') return;
    setCategories(prev =>
      prev.map(cat => (cat.id === id ? { ...cat, name: newName } : cat))
    );
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
  }, []);

  return { categories, addCategory, editCategory, deleteCategory, isLoaded };
}
