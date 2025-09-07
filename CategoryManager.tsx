"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Edit, Plus, Check, X } from "lucide-react";
import type { Category } from "@/hooks/use-categories";

interface CategoryManagerProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    categories: Category[];
    addCategory: (name: string) => void;
    editCategory: (id: string, newName: string) => void;
    deleteCategory: (id: string) => void;
}

export function CategoryManager({ 
    isOpen, 
    onOpenChange,
    categories,
    addCategory,
    editCategory,
    deleteCategory
}: CategoryManagerProps) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName);
      setNewCategoryName("");
    }
  };

  const startEditing = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
  };

  const cancelEditing = () => {
    setEditingCategoryId(null);
    setEditingCategoryName("");
  };

  const handleEditCategory = () => {
    if (editingCategoryId && editingCategoryName.trim()) {
      editCategory(editingCategoryId, editingCategoryName);
      cancelEditing();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
          <DialogDescription>
            Add, edit, or delete your task categories.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="new-category">Add New Category</Label>
                <div className="flex gap-2">
                    <Input 
                        id="new-category"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="e.g. Fitness"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                    />
                    <Button onClick={handleAddCategory} size="icon">
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">Add Category</span>
                    </Button>
                </div>
            </div>
            <div className="space-y-2">
                <Label>Existing Categories</Label>
                <div className="space-y-2 rounded-md border p-2 max-h-60 overflow-y-auto">
                    {categories.map((category) => (
                        <div key={category.id} className="flex items-center justify-between gap-2 p-2 rounded-md hover:bg-muted/50">
                            {editingCategoryId === category.id ? (
                                <Input 
                                    value={editingCategoryName}
                                    onChange={(e) => setEditingCategoryName(e.target.value)}
                                    className="h-8"
                                    onKeyDown={(e) => e.key === 'Enter' && handleEditCategory()}
                                    autoFocus
                                />
                            ) : (
                                <span className="flex-1 truncate">{category.name}</span>
                            )}
                            <div className="flex items-center gap-1">
                                {editingCategoryId === category.id ? (
                                    <>
                                        <Button variant="ghost" size="icon" onClick={handleEditCategory} className="h-8 w-8 text-green-600 hover:text-green-700">
                                            <Check className="h-4 w-4" />
                                            <span className="sr-only">Save</span>
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={cancelEditing} className="h-8 w-8">
                                            <X className="h-4 w-4" />
                                            <span className="sr-only">Cancel</span>
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button variant="ghost" size="icon" onClick={() => startEditing(category)} className="h-8 w-8">
                                            <Edit className="h-4 w-4" />
                                            <span className="sr-only">Edit</span>
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => deleteCategory(category.id)} className="h-8 w-8 text-destructive hover:text-destructive/80">
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Delete</span>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                    {categories.length === 0 && <p className="text-sm text-muted-foreground text-center p-4">No categories yet.</p>}
                </div>
            </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
