import React, {
  useState,
  KeyboardEvent,
  useCallback,
  useRef,
  useEffect
} from 'react';
import styles from './TodoInput.module.css';

interface TodoInputProps {
  onAddTodo: (value: string) => void;
}

export const TodoInput = React.memo<TodoInputProps>(({ onAddTodo }) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      setError('Task cannot be empty');
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.style.animation = 'none';
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.style.animation = '';
          }
        }, 100);
      }

      return;
    }

    if (trimmedValue.length > 500) {
      setError('Task is too long (max 500 characters)');

      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      onAddTodo(trimmedValue);
      setValue('');
      setError('');
    } catch (err) {
      setError('Failed to add task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [value, onAddTodo]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !isLoading) {
        e.preventDefault();
        handleSubmit();
      }
      if (e.key === 'Escape') {
        setValue('');
        setError('');
        if (inputRef.current) {
          inputRef.current.blur();
        }
      }
    },
    [handleSubmit, isLoading]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);

      if (error) {
        setError('');
      }

      if (newValue.length > 450) {
        setError(`${500 - newValue.length} characters remaining`);
      }
    },
    [error]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      const pastedText = e.clipboardData.getData('text');
      if (pastedText.length > 500) {
        e.preventDefault();
        setError('Pasted text is too long (max 500 characters)');
      }
    },
    []
  );

  return (
    <div className={`${styles.inputContainer} ${error ? styles.error : ''}`}>
      <input
        ref={inputRef}
        className={`${styles.input} ${
          error && !error.includes('remaining') ? styles.error : ''
        }`}
        type="text"
        placeholder="What needs to be done?"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        disabled={isLoading}
        autoComplete="off"
        maxLength={500}
        aria-label="Add new todo"
        aria-describedby={error ? 'error-message' : undefined}
      />

      {error && (
        <div
          id="error-message"
          className={`${styles.errorMessage} ${
            error.includes('remaining') ? styles.warningMessage : ''
          }`}
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}

      {isLoading && (
        <div className={styles.loadingIndicator}>Adding task...</div>
      )}

      {!error && !isLoading && (
        <div className={styles.inputHint}>
          Press Enter to add, Escape to clear
        </div>
      )}
    </div>
  );
});
