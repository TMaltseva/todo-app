import { useState, useCallback } from 'react';
import { TODO_CONFIG } from '../configs/configs';

interface UseInputSubmitProps {
  onAddTodo: (value: string) => void;
  validateInput: (value: string) => boolean;
  triggerErrorAnimation: () => void;
}

export const useInputSubmit = ({
  onAddTodo,
  validateInput,
  triggerErrorAnimation
}: UseInputSubmitProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (value: string): Promise<boolean> => {
      if (!validateInput(value)) {
        triggerErrorAnimation();

        return false;
      }

      setIsLoading(true);

      try {
        await new Promise((resolve) =>
          setTimeout(resolve, TODO_CONFIG.DEBOUNCE_DELAY)
        );

        onAddTodo(value.trim());

        return true;
      } catch (err) {
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [onAddTodo, validateInput, triggerErrorAnimation]
  );

  return {
    isLoading,
    handleSubmit
  };
};
