import { Todo } from "@/types/todo";
import { create } from "zustand";

interface TodoStore {
  // State
  todos: Todo[],
  isLoading: boolean,
  error: string | null,

  // Actions
  fetchTodos: () => Promise<void>;
  addTodo: (text: string) => Promise<void>;
  updateTodo: (id: string, data: { text?: string; completed?: boolean }) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;

  // Helper actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  getTodoStats: () => { total: number; active: number; completed: number };
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  // Initial state
  todos: [],
  isLoading: false,
  error: null,

  // Set loading state
  setLoading: (loading: boolean) => set({ isLoading: loading }),

  // Set error state
  setError: (error: string | null) => set({ error }),

  // FETCH - Get all todos from database
  fetchTodos: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/todos');
      const result = await response.json();

      if (result.success) {
        set({ todos: result.data || [], isLoading: false });
      } else {
        set({ todos: [], error: result.error || 'Failed to fetch todos', isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to fetch todos', isLoading: false });
      console.error('Fetch todos error:', error);
    }
  },

  // CREATE
  addTodo: async (text: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text })
      });
      const result = await response.json();

      if (result.success) {
        const newTodo = result.data;
        set((state) => ({
          todos: [newTodo, ...state.todos],
          isLoading: false
        }));
      } else {
        set({ error: result.error || 'Failed to add todo', isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to add todo', isLoading: false });
      console.error('Add todo error:', error);
    }
  },

  // DELETE - Delete todo from database
  deleteTodo: async (id: string) => {
    set({ isLoading: true, error: null });

    const originalTodos = get().todos;
    set((state) => ({
      todos: state.todos.filter(todo => todo.id !== id)
    }));

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (result.success) {
        set({ isLoading: false });
      } else {
        set({ todos: originalTodos, error: result.error || 'Failed to delete todo', isLoading: false });
      }
    } catch (error) {
      set({ todos: originalTodos, error: 'Failed to delete todo', isLoading: false });
      console.error('Delete todo error:', error);
    }
  },

  // UPDATE toggle
  toggleTodo: async (id: string) => {
    const todo = get().todos.find(t => t.id === id);
    if (todo) {
      await get().updateTodo(id, { completed: !todo.completed });
    }
  },

  // UPDATE - update todo in database
  updateTodo: async (id: string, data: { text?: string; completed?: boolean }) => {
    set({ isLoading: true, error: null });

    const originalTodos = get().todos;
    set((state) => ({
      todos: state.todos.map(todo => todo.id === id ? { ...todo, ...data } : todo)
    }));

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();

      if (result.success) {
        const updatedTodo = result.data;
        set((state) => ({
          todos: state.todos.map(todo =>
            todo.id === id ? updatedTodo : todo
          ),
          isLoading: false
        }));
      } else {
        set({ todos: originalTodos, error: result.error || 'Failed to update todo', isLoading: false });
      }
    } catch (error) {
      set({ todos: originalTodos, error: 'Failed to update todo', isLoading: false });
      console.error('Update todo error:', error);
    }
  },

  // COMPUTED VALUE
  getTodoStats: () => {
    const { todos } = get();
    const todosArray = Array.isArray(todos) ? todos : [];
    return {
      total: todosArray.length,
      active: todosArray.filter(todo => !todo.completed).length,
      completed: todosArray.filter(todo => todo.completed).length
    };
  }
}));