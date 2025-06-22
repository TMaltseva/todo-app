import React from 'react';
import { Todo } from '@/types';
import { TodoItem } from '../TodoItem/TodoItem';
import styles from './TodoList.module.css';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoList = React.memo<TodoListProps>(
  ({ todos, onToggle, onDelete }) => {
    if (todos.length === 0) {
      return null;
    }

    return (
      <ul className={styles.list}>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </ul>
    );
  }
);
