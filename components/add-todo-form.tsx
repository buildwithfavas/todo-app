"use client";

import { useTodoStore } from "@/lib/todo-store";
import { KeyboardEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddTodoForm() {
  const [input, setInput] = useState("");
  const addTodo = useTodoStore((state) => state.addTodo);
  const isLoading = useTodoStore((state) => state.isLoading);

  const handleSubmit = () => {
    if (input.trim()) {
      addTodo(input.trim());
      setInput("");
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        type="text"
        placeholder="Create a new task..."
        className="flex-1 border-zinc-800 bg-zinc-950/40 text-white placeholder:text-zinc-500 focus:ring-indigo-500"
        disabled={isLoading}
      />
      <Button
        onClick={handleSubmit}
        disabled={!input.trim()}
        isLoading={isLoading}
        variant="gradient"
        className="px-5 shadow-sm"
      >
        Add
      </Button>
    </div>
  );
}
