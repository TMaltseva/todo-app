import { renderHook, act, waitFor } from '@testing-library/react';
import { useTodos } from '../hooks/useTodos';
import { localStorageMock } from '../setupTests';

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

const originalError = console.error;
beforeAll(() => {
  console.error = (): void => {};
});

afterAll(() => {
  console.error = originalError;
});

describe('useTodos', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should initialize with empty todos after loading', async () => {
    const { result } = renderHook(() => useTodos());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.allTodos).toEqual([]);
    expect(result.current.stats.total).toBe(0);
    expect(result.current.stats.active).toBe(0);
    expect(result.current.stats.completed).toBe(0);
  });

  test('should add todo successfully', async () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      jest.advanceTimersByTime(100);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.addTodo('Test todo');
      jest.advanceTimersByTime(100);
    });

    expect(result.current.stats.total).toBe(1);
  });

  test('should save new todo to localStorage', async () => {
    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.addTodo('Test localStorage');
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'todos-app-v2',
      expect.stringContaining('"text":"Test localStorage"')
    );
  });

  test('should persist todo deletion', async () => {
    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.addTodo('To be deleted');
    });

    expect(result.current.stats.total).toBe(1);

    const todoId = result.current.allTodos[0].id;
    act(() => {
      result.current.deleteTodo(todoId);
    });

    expect(result.current.stats.total).toBe(0);

    const { result: newResult } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(newResult.current.isLoading).toBe(false);
    });

    expect(newResult.current.stats.total).toBe(0);
    expect(newResult.current.allTodos).toEqual([]);
  });

  test('should toggle todo', async () => {
    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.addTodo('Test todo');
    });

    const todoId = result.current.allTodos[0].id;

    act(() => {
      result.current.toggleTodo(todoId);
    });

    expect(result.current.allTodos[0].completed).toBe(true);
    expect(result.current.stats.completed).toBe(1);
    expect(result.current.stats.active).toBe(0);
  });

  test('should delete todo', async () => {
    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.addTodo('Test todo');
    });

    const todoId = result.current.allTodos[0].id;

    act(() => {
      result.current.deleteTodo(todoId);
    });

    expect(result.current.stats.total).toBe(0);
    expect(result.current.allTodos).toEqual([]);
  });

  test('should clear completed todos', async () => {
    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.addTodo('Active todo');
    });

    await waitFor(() => {
      expect(result.current.stats.total).toBe(1);
    });

    act(() => {
      result.current.addTodo('Will be completed');
    });

    await waitFor(() => {
      expect(result.current.stats.total).toBe(2);
    });

    const todoToComplete = result.current.allTodos.find(
      (todo) => todo.text === 'Will be completed'
    );

    act(() => {
      result.current.toggleTodo(todoToComplete!.id);
    });

    act(() => {
      result.current.clearCompleted();
    });

    expect(result.current.stats.total).toBe(1);
    expect(result.current.stats.completed).toBe(0);

    const remainingTodo = result.current.allTodos.find(
      (todo) => todo.text === 'Active todo'
    );
    expect(remainingTodo).toBeDefined();
    expect(remainingTodo!.completed).toBe(false);
  });
});
