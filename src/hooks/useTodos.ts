import { useState, useEffect, useCallback, useMemo } from 'react';
import { Todo, FilterType, TodoStats } from '@/types';
import { loadTodos, saveTodos, generateId } from '../utils/utils';
import { TODO_CONFIG } from '../configs/configs';

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

        await new Promise((resolve) =>
          setTimeout(resolve, TODO_CONFIG.DEBOUNCE_DELAY)
        );

        const loadedTodos = loadTodos();
        setTodos(loadedTodos);
      } catch (err) {
        setError('Failed to load your tasks. Please refresh the page.');
        setTodos([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialTodos();
  }, []);

  const addTodo = useCallback(
    (text: string) => {
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

        const updatedTodos = [newTodo, ...todos];
        saveTodos(updatedTodos);
        setTodos(updatedTodos);
        setError(null);
      } catch (err) {
        setError('Failed to add task. Please try again.');
      }
    },
    [todos]
  );

  const toggleTodo = useCallback(
    (id: string) => {
      try {
        const updatedTodos = todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        saveTodos(updatedTodos);
        setTodos(updatedTodos);
        setError(null);
      } catch (err) {
        setError('Failed to update task. Please try again.');
      }
    },
    [todos]
  );

  const deleteTodo = useCallback(
    (id: string) => {
      try {
        const newTodos = todos.filter((todo) => todo.id !== id);
        saveTodos(newTodos);
        setTodos(newTodos);
        setError(null);
      } catch (err) {
        setError('Failed to delete task. Please try again.');
      }
    },
    [todos]
  );

  const clearCompleted = useCallback(() => {
    const completedCount = todos.filter((todo) => todo.completed).length;
    if (completedCount === 0) return;

    try {
      const updatedTodos = todos.filter((todo) => !todo.completed);
      saveTodos(updatedTodos);
      setTodos(updatedTodos);
      setError(null);
    } catch (err) {
      setError('Failed to clear completed tasks. Please try again.');
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
    setFilter,
    clearError
  };
};
