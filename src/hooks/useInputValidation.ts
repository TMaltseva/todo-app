import { useState, useCallback } from 'react';
import { TODO_CONFIG } from '../configs/configs';

export const useInputValidation = () => {
  const [error, setError] = useState('');

  const validateInput = useCallback((value: string): boolean => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      setError('Task cannot be empty');

      return false;
    }

    if (trimmedValue.length > TODO_CONFIG.MAX_LENGTH) {
      setError(`Task is too long (max ${TODO_CONFIG.MAX_LENGTH} characters)`);

      return false;
    }

    setError('');

    return true;
  }, []);

  const validatePaste = useCallback((pastedText: string): boolean => {
    if (pastedText.length > TODO_CONFIG.MAX_LENGTH) {
      setError(
        `Pasted text is too long (max ${TODO_CONFIG.MAX_LENGTH} characters)`
      );

      return false;
    }

    return true;
  }, []);

  const handleInputChange = useCallback((value: string) => {
    if (value.length > 450) {
      setError(`${TODO_CONFIG.MAX_LENGTH - value.length} characters remaining`);
    } else {
      setError('');
    }
  }, []);

  const clearError = useCallback(() => {
    setError('');
  }, []);

  return {
    error,
    validateInput,
    validatePaste,
    handleInputChange,
    clearError
  };
};
