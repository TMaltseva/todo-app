import React, { useState, KeyboardEvent, useCallback } from 'react';
import styles from './TodoInput.module.css';

interface TodoInputProps {
  onAddTodo: (value: string) => void;
}

export const TodoInput = React.memo<TodoInputProps>(({ onAddTodo }) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = useCallback(() => {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      setError('Task cannot be empty');

      return;
    }
    onAddTodo(trimmedValue);
    setValue('');
    setError('');
  }, [value, onAddTodo]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div className={styles.inputContainer}>
      <input
        className={`${styles.input} ${error ? styles.error : ''}`}
        type="text"
        placeholder="What needs to be done?"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setError('');
        }}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
});
