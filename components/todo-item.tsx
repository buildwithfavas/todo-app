"use client";

import { useTodoStore } from "@/lib/todo-store";
import { Todo } from "@/types/todo";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Check, Edit2, Trash2, X } from "lucide-react";

export default function TodoItem({ todo }: { todo: Todo }) {
  const deleteTodo = useTodoStore((state) => state.deleteTodo);
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const updateTodo = useTodoStore((state) => state.updateTodo);

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSaveEdit = () => {
    if (editText.trim()) {
      updateTodo(todo.id, { text: editText.trim() });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  return (
    <div
      className={`group flex items-center gap-4 p-4 border rounded-xl transition-all duration-200 ${
        todo.completed
          ? "bg-zinc-50/50 border-zinc-200/60 opacity-70"
          : "bg-white border-zinc-200 hover:border-zinc-300 shadow-sm"
      }`}
    >
      {/* Checkbox Wrapper */}
      <button
        onClick={() => toggleTodo(todo.id)}
        className={`flex items-center justify-center w-6 h-6 rounded-md border-2 transition-all duration-200 shrink-0 ${
          todo.completed
            ? "bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/20 shadow-md scale-105"
            : "border-zinc-300 hover:border-indigo-500 bg-white"
        }`}
      >
        {todo.completed && <Check className="w-4 h-4 stroke-[3]" />}
      </button>

      {/* Todo Text */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <Input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
            className="w-full h-9 border-zinc-200 bg-white text-zinc-900 focus:ring-indigo-500"
            autoFocus
          />
        ) : (
          <span
            className={`block truncate text-sm transition-all duration-200 ${
              todo.completed
                ? "line-through text-zinc-400"
                : "text-zinc-800"
            }`}
          >
            {todo.text}
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1">
        {isEditing ? (
          <>
            <button
              onClick={handleSaveEdit}
              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Save"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancelEdit}
              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            {!todo.completed && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => deleteTodo(todo.id)}
              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
