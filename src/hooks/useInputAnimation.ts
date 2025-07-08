import { useCallback, useRef } from 'react';
import { TODO_CONFIG } from '../configs/configs';

export const useInputAnimation = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const triggerErrorAnimation = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.style.animation = 'none';
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.style.animation = '';
        }
      }, TODO_CONFIG.DEBOUNCE_DELAY);
    }
  }, []);

  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const blurInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.blur();
    }
  }, []);

  return {
    inputRef,
    triggerErrorAnimation,
    focusInput,
    blurInput
  };
};
