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
    const handleToggle = useCallback(() => {
      onToggle(todo.id);
    }, [onToggle, todo.id]);

    const handleDelete = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(todo.id);
      },
      [onDelete, todo.id]
    );

    return (
      <li
        className={`${styles.item} ${todo.completed ? styles.completed : ''}`}
        onClick={handleToggle}
      >
        <input
          className={styles.toggle}
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          aria-label={
            todo.completed
              ? `Mark "${todo.text}" as not completed`
              : `Mark "${todo.text}" as completed`
          }
        />
        <label className={styles.label}>{todo.text}</label>
        <button
          className={styles.destroy}
          onClick={handleDelete}
          aria-label={`Delete "${todo.text}"`}
        />
      </li>
    );
  }
);
