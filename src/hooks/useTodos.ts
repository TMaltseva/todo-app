import { useState, useEffect, useCallback, useMemo } from 'react';
import { Todo, FilterType, TodoStats } from '@/types';
import { loadTodos, saveTodos, generateId } from '../utils/storage';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialTodos = async () => {
      try {
        setIsLoading(true);
        setError(null);

        await new Promise((resolve) => setTimeout(resolve, 100));

        const loadedTodos = loadTodos();
        setTodos(loadedTodos);
      } catch (err) {
        console.error('Failed to load todos:', err);
        setError('Failed to load your tasks. Please refresh the page.');
        setTodos([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialTodos();
  }, []);

  useEffect(() => {
    if (!isLoading && todos.length >= 0) {
      try {
        saveTodos(todos);
        setError(null);
      } catch (err) {
        console.error('Failed to save todos:', err);
        setError('Failed to save your changes. Please try again.');
      }
    }
  }, [todos, isLoading]);

  const addTodo = useCallback((text: string) => {
    if (!text.trim()) {
      setError('Task cannot be empty');

      return;
    }

    try {
      const newTodo: Todo = {
        id: generateId(),
        text: text.trim(),
        completed: false,
        createdAt: new Date()
      };

      setTodos((prev) => [newTodo, ...prev]);
      setError(null);
    } catch (err) {
      console.error('Failed to add todo:', err);
      setError('Failed to add task. Please try again.');
    }
  }, []);

  const toggleTodo = useCallback((id: string) => {
    try {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
      setError(null);
    } catch (err) {
      console.error('Failed to toggle todo:', err);
      setError('Failed to update task. Please try again.');
    }
  }, []);

  const deleteTodo = useCallback((id: string) => {
    try {
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      setError(null);
    } catch (err) {
      console.error('Failed to delete todo:', err);
      setError('Failed to delete task. Please try again.');
    }
  }, []);

  const clearCompleted = useCallback(() => {
    try {
      const completedCount = todos.filter((todo) => todo.completed).length;
      if (completedCount === 0) return;

      setTodos((prev) => prev.filter((todo) => !todo.completed));
      setError(null);
    } catch (err) {
      console.error('Failed to clear completed todos:', err);
      setError('Failed to clear completed tasks. Please try again.');
    }
  }, [todos]);

  const toggleAll = useCallback(() => {
    try {
      const allCompleted =
        todos.length > 0 && todos.every((todo) => todo.completed);
      setTodos((prev) =>
        prev.map((todo) => ({ ...todo, completed: !allCompleted }))
      );
      setError(null);
    } catch (err) {
      console.error('Failed to toggle all todos:', err);
      setError('Failed to update all tasks. Please try again.');
    }
  }, [todos]);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const stats: TodoStats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((todo) => todo.completed).length;
    const active = total - completed;

    return {
      total,
      active,
      completed
    };
  }, [todos]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    todos: filteredTodos,
    allTodos: todos,
    filter,
    stats,
    isLoading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    toggleAll,
    setFilter,
    clearError
  };
};
