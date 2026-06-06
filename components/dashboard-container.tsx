"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useTodoStore } from "@/lib/todo-store";
import AddTodoForm from "@/components/add-todo-form";
import TodoStats from "@/components/todo-stats";
import TodoItem from "@/components/todo-item";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DashboardContainerProps {
  user: {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
  };
}

export default function DashboardContainer({ user }: DashboardContainerProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const todos = useTodoStore((state) => state.todos);
  const fetchTodos = useTodoStore((state) => state.fetchTodos);
  const isLoading = useTodoStore((state) => state.isLoading);
  const error = useTodoStore((state) => state.error);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await authClient.signOut();
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  // Initials for avatar
  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)
    : user.email.substring(0, 2).toUpperCase();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white/80 border border-zinc-200 rounded-2xl p-6 shadow-sm backdrop-blur-md gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
            {initials}
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900">{user.name || "User"}</h2>
            <p className="text-sm text-zinc-500">{user.email}</p>
          </div>
        </div>
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
          isLoading={isLoggingOut}
        >
          Sign Out
        </Button>
      </div>

      {/* Main Todo Card */}
      <Card className="border-zinc-200/80 bg-white/80 shadow-lg backdrop-blur-md">
        <CardHeader className="text-center sm:text-left">
          <CardTitle className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            My Tasks
          </CardTitle>
          <CardDescription className="text-zinc-500">
            Create, update, and organize your daily items securely
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Todo */}
          <AddTodoForm />

          {/* Stats Bar */}
          <TodoStats />

          {/* Filter & Controls */}
          <div className="flex flex-wrap justify-between items-center gap-3 border-t border-zinc-200/60 pt-6">
            <div className="flex gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filter === "all"
                    ? "bg-indigo-600 text-white shadow"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("active")}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filter === "active"
                    ? "bg-indigo-600 text-white shadow"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filter === "completed"
                    ? "bg-indigo-600 text-white shadow"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                Completed
              </button>
            </div>

            <Badge variant="outline" className="border-zinc-200 text-zinc-500 py-1 px-3">
              Showing {filteredTodos.length} of {todos.length}
            </Badge>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              ⚠️ Error: {error}
            </div>
          )}

          {/* Todo List Container */}
          <div className="space-y-3 pt-2">
            {isLoading && todos.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-zinc-500 gap-3">
                <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Loading your tasks...</span>
              </div>
            ) : filteredTodos.length === 0 ? (
              <div className="text-center py-12 bg-zinc-50 border border-dashed border-zinc-200 rounded-xl text-zinc-500">
                ✨ No {filter !== "all" ? `${filter} ` : ""}tasks found.
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredTodos.map((todo) => (
                  <TodoItem key={todo.id} todo={todo} />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
