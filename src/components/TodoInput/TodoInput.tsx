import React, { useState, KeyboardEvent, useCallback, useEffect } from 'react';
import { TODO_CONFIG } from '../../configs/configs';
import { useInputValidation } from '../../hooks/useInputValidation';
import { useInputAnimation } from '../../hooks/useInputAnimation';
import { useInputSubmit } from '../../hooks/useInputSubmit';
import styles from './TodoInput.module.css';

interface TodoInputProps {
  onAddTodo: (value: string) => void;
}

export const TodoInput = React.memo<TodoInputProps>(({ onAddTodo }) => {
  const [value, setValue] = useState('');

  const { error, validateInput, validatePaste, handleInputChange, clearError } =
    useInputValidation();

  const { inputRef, triggerErrorAnimation, focusInput, blurInput } =
    useInputAnimation();

  const { isLoading, handleSubmit } = useInputSubmit({
    onAddTodo,
    validateInput,
    triggerErrorAnimation
  });

  useEffect(() => {
    focusInput();
  }, [focusInput]);

  const handleKeyDown = useCallback(
    async (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !isLoading) {
        e.preventDefault();
        const success = await handleSubmit(value);
        if (success) {
          setValue('');
          clearError();
        }
      }
      if (e.key === 'Escape') {
        setValue('');
        clearError();
        blurInput();
      }
    },
    [value, isLoading, handleSubmit, clearError, blurInput]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      handleInputChange(newValue);
    },
    [handleInputChange]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      const pastedText = e.clipboardData.getData('text');
      if (!validatePaste(pastedText)) {
        e.preventDefault();
      }
    },
    [validatePaste]
  );

  const handleButtonClick = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      if (!isLoading) {
        const success = await handleSubmit(value);
        if (success) {
          setValue('');
          clearError();
        }
      }
    },
    [value, isLoading, handleSubmit, clearError]
  );

  const canSubmit = value.trim().length > 0 && !isLoading;

  return (
    <div className={`${styles.inputContainer} ${error ? styles.error : ''}`}>
      <input
        ref={inputRef}
        className={styles.input}
        type="text"
        placeholder="What needs to be done?"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        disabled={isLoading}
        autoComplete="off"
        maxLength={TODO_CONFIG.MAX_LENGTH}
        aria-label="Add new todo"
        aria-describedby={error ? 'error-message' : undefined}
      />

      <button
        type="button"
        className={`${styles.addButton} ${canSubmit ? styles.active : ''}`}
        onClick={handleButtonClick}
        disabled={!canSubmit}
        aria-label="Add task"
      >
        {isLoading ? (
          <span className={styles.spinner} aria-hidden="true">
            ⟳
          </span>
        ) : (
          <span aria-hidden="true">+</span>
        )}
      </button>

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

      {!error && !isLoading && (
        <div className={styles.inputHint}>
          Press Enter to add, Escape to clear
        </div>
      )}
    </div>
  );
});
