import { Todo } from '@/types';
import { TODO_CONFIG } from '../configs/configs';

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
  const stored = localStorage.getItem(TODO_CONFIG.STORAGE_KEY);
  if (!stored) return [];

  const parsed: unknown = JSON.parse(stored);

  if (!Array.isArray(parsed)) {
    throw new Error('Invalid todos format in localStorage');
  }

  return parsed
    .filter((item) => isValidStoredTodo(item))
    .map(
      (todo: StoredTodo): Todo => ({
        ...todo,
        createdAt: new Date(todo.createdAt)
      })
    )
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const saveTodos = (todos: Todo[]): void => {
  const todosToStore = todos.map((todo) => ({
    ...todo,
    createdAt: todo.createdAt.toISOString()
  }));

  localStorage.setItem(TODO_CONFIG.STORAGE_KEY, JSON.stringify(todosToStore));
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};
