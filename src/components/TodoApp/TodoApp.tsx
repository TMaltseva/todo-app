import React from 'react';
import { useTodos } from '../../hooks/useTodos';
import { TodoInput } from '../TodoInput/TodoInput';
import { TodoList } from '../TodoList/TodoList';
import { TodoFilters } from '../TodoFilters/TodoFilters';
import styles from './TodoApp.module.css';

export const TodoApp: React.FC = () => {
  const {
    todos,
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
  } = useTodos();

  const hasCompleted = stats.completed > 0;
  const hasTodos = stats.total > 0;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>todos</h1>
      </header>

      {error && (
        <div className={styles.errorBanner} role="alert">
          {error}
          <button onClick={clearError} className={styles.closeError}>
            ×
          </button>
        </div>
      )}

      <TodoInput onAddTodo={addTodo} />

      {isLoading && <div className={styles.loading}>Loading your tasks...</div>}

      {hasTodos && (
        <>
          <section className={styles.main}>
            <TodoList
              todos={todos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          </section>

          <footer className={styles.footer}>
            <span className={styles.todoCount}>
              <strong>{stats.active}</strong> item
              {stats.active !== 1 ? 's' : ''} left
            </span>

            <TodoFilters currentFilter={filter} onFilterChange={setFilter} />

            <button
              className={styles.clearCompleted}
              onClick={clearCompleted}
              disabled={!hasCompleted}
            >
              Clear completed
            </button>
          </footer>
        </>
      )}

      {!hasTodos && (
        <div className={styles.empty}>Start by adding a new task above</div>
      )}
    </div>
  );
};
