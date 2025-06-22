import { Todo } from '@/types';

const STORAGE_KEY = 'todos';

interface StoredTodo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

const isValidStoredTodo = (obj: unknown): obj is StoredTodo => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as StoredTodo).id === 'string' &&
    typeof (obj as StoredTodo).text === 'string' &&
    typeof (obj as StoredTodo).completed === 'boolean' &&
    typeof (obj as StoredTodo).createdAt === 'string'
  );
};

export const loadTodos = (): Todo[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      console.warn('Invalid todos format in localStorage');

      return [];
    }

    return parsed
      .filter((item) => isValidStoredTodo(item))
      .map(
        (todo: StoredTodo): Todo => ({
          ...todo,
          createdAt: new Date(todo.createdAt)
        })
      );
  } catch (error) {
    console.error('Failed to load todos from localStorage:', error);

    return [];
  }
};

export const saveTodos = (todos: Todo[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Failed to save todos to localStorage:', error);
  }
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};
