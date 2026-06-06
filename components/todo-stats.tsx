"use client";

import { useTodoStore } from "@/lib/todo-store";
import { Card } from "@/components/ui/card";

export default function TodoStats() {
  const getTodoStats = useTodoStore((state) => state.getTodoStats);
  const stats = getTodoStats();

  return (
    <div className="grid grid-cols-3 gap-3">
      <Card className="flex flex-col items-center justify-center p-3 border-zinc-800 bg-zinc-950/20 text-center rounded-xl shadow-inner">
        <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Total</span>
        <span className="text-xl font-extrabold text-white mt-1">{stats.total}</span>
      </Card>
      <Card className="flex flex-col items-center justify-center p-3 border-zinc-800 bg-zinc-950/20 text-center rounded-xl shadow-inner">
        <span className="text-indigo-400 text-xs font-semibold uppercase tracking-wider">Active</span>
        <span className="text-xl font-extrabold text-indigo-400 mt-1">{stats.active}</span>
      </Card>
      <Card className="flex flex-col items-center justify-center p-3 border-zinc-800 bg-zinc-950/20 text-center rounded-xl shadow-inner">
        <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Done</span>
        <span className="text-xl font-extrabold text-emerald-400 mt-1">{stats.completed}</span>
      </Card>
    </div>
  );
}
