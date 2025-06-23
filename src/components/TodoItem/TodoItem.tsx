import React, { useCallback } from 'react';
import { Todo } from '@/types';
import styles from './TodoItem.module.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem = React.memo<TodoItemProps>(
  ({ todo, onToggle, onDelete }) => {
    const handleToggle = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        onToggle(todo.id);
      },
      [onToggle, todo.id]
    );

    const handleLabelClick = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        onToggle(todo.id);
      },
      [onToggle, todo.id]
    );

    const handleDelete = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        onDelete(todo.id);
      },
      [onDelete, todo.id]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle(todo.id);
        }
        if (e.key === 'Delete' || e.key === 'Backspace') {
          e.preventDefault();
          onDelete(todo.id);
        }
      },
      [onToggle, onDelete, todo.id]
    );

    return (
      <li
        className={`${styles.item} ${todo.completed ? styles.completed : ''}`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label={`Todo: ${todo.text}`}
      >
        <input
          className={styles.toggle}
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          id={`todo-${todo.id}`}
          aria-label={
            todo.completed
              ? `Mark "${todo.text}" as not completed`
              : `Mark "${todo.text}" as completed`
          }
        />

        <label
          htmlFor={`todo-${todo.id}`}
          className={styles.label}
          onClick={handleLabelClick}
        >
          {todo.text}
        </label>

        <button
          className={styles.destroy}
          onClick={handleDelete}
          aria-label={`Delete "${todo.text}"`}
          tabIndex={0}
        />
      </li>
    );
  }
);
