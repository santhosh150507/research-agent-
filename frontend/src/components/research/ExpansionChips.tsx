"use client";

import { useState } from "react";
import { ExpandedQuery } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Edit2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpansionChipsProps {
  queries: ExpandedQuery[];
  onChange: (queries: ExpandedQuery[]) => void;
}

export function ExpansionChips({ queries, onChange }: ExpansionChipsProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newValue, setNewValue] = useState("");

  if (!queries || queries.length === 0) return null;

  const handleRemove = (id: string) => {
    onChange(queries.filter((q) => q.id !== id));
  };

  const startEdit = (q: ExpandedQuery) => {
    setEditingId(q.id);
    setEditValue(q.text);
  };

  const saveEdit = () => {
    if (editingId && editValue.trim()) {
      onChange(
        queries.map((q) => (q.id === editingId ? { ...q, text: editValue.trim() } : q))
      );
    }
    setEditingId(null);
  };

  const saveNew = () => {
    if (newValue.trim()) {
      onChange([
        ...queries,
        { id: `user-${Date.now()}`, text: newValue.trim(), type: "user" },
      ]);
    }
    setIsAdding(false);
    setNewValue("");
  };

  const getTypeColor = (type: ExpandedQuery["type"]) => {
    switch (type) {
      case "synonym": return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
      case "related": return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800";
      case "method": return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800";
      case "user": return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Query Expansion</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 px-2 text-xs" 
          onClick={() => setIsAdding(true)}
          disabled={isAdding}
        >
          <Plus className="h-3 w-3 mr-1" /> Add Query
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {queries.map((q) => (
          <div key={q.id} className="flex items-center">
            {editingId === q.id ? (
              <div className="flex items-center gap-1 rounded-full border px-2 py-0.5 bg-background">
                <Input
                  className="h-6 w-40 border-0 bg-transparent px-1 py-0 text-xs shadow-none focus-visible:ring-0"
                  value={editValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditValue(e.target.value)}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && saveEdit()}
                  autoFocus
                />
                <Button variant="ghost" size="icon" className="h-4 w-4 shrink-0" onClick={saveEdit}>
                  <Check className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <Badge 
                variant="outline" 
                className={cn("px-2 py-1 pr-1 font-normal flex items-center gap-1 group", getTypeColor(q.type))}
              >
                <span>{q.text}</span>
                <span className="text-[10px] opacity-70 ml-1 uppercase">{q.type}</span>
                <button 
                  onClick={() => startEdit(q)}
                  className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/10 rounded-full p-0.5"
                >
                  <Edit2 className="h-2.5 w-2.5" />
                </button>
                <button 
                  onClick={() => handleRemove(q.id)}
                  className="ml-0 opacity-50 hover:opacity-100 hover:bg-black/10 rounded-full p-0.5 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        ))}
        
        {isAdding && (
          <div className="flex items-center gap-1 rounded-full border border-dashed border-primary px-2 py-0.5 bg-background">
            <Input
              className="h-6 w-40 border-0 bg-transparent px-1 py-0 text-xs shadow-none focus-visible:ring-0"
              placeholder="New query..."
              value={newValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewValue(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && saveNew()}
              autoFocus
            />
            <Button variant="ghost" size="icon" className="h-4 w-4 shrink-0" onClick={saveNew}>
              <Check className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-4 w-4 shrink-0" onClick={() => setIsAdding(false)}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        These queries will be executed in parallel with your main topic to retrieve a comprehensive set of papers.
      </p>
    </div>
  );
}
