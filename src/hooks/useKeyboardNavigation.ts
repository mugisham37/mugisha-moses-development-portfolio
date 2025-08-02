import { useState, useCallback, useEffect } from "react";

interface UseKeyboardNavigationOptions {
  itemCount: number;
  onSelect?: (index: number) => void;
  loop?: boolean;
  disabled?: boolean;
}

interface UseKeyboardNavigationReturn {
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  resetFocus: () => void;
}

export function useKeyboardNavigation({
  itemCount,
  onSelect,
  loop = true,
  disabled = false,
}: UseKeyboardNavigationOptions): UseKeyboardNavigationReturn {
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const resetFocus = useCallback(() => {
    setFocusedIndex(-1);
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled || itemCount === 0) return;

      switch (event.key) {
        case "ArrowDown":
        case "ArrowRight":
          event.preventDefault();
          setFocusedIndex((prev) => {
            if (prev === -1) return 0;
            if (prev >= itemCount - 1) {
              return loop ? 0 : prev;
            }
            return prev + 1;
          });
          break;

        case "ArrowUp":
        case "ArrowLeft":
          event.preventDefault();
          setFocusedIndex((prev) => {
            if (prev === -1) return itemCount - 1;
            if (prev <= 0) {
              return loop ? itemCount - 1 : 0;
            }
            return prev - 1;
          });
          break;

        case "Home":
          event.preventDefault();
          setFocusedIndex(0);
          break;

        case "End":
          event.preventDefault();
          setFocusedIndex(itemCount - 1);
          break;

        case "Enter":
        case " ":
          event.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < itemCount && onSelect) {
            onSelect(focusedIndex);
          }
          break;

        case "Escape":
          event.preventDefault();
          resetFocus();
          break;

        default:
          // Handle number keys for direct navigation
          if (event.key >= "1" && event.key <= "9") {
            const index = parseInt(event.key) - 1;
            if (index < itemCount) {
              event.preventDefault();
              setFocusedIndex(index);
            }
          }
          break;
      }
    },
    [disabled, itemCount, focusedIndex, onSelect, loop, resetFocus]
  );

  // Reset focus when item count changes
  useEffect(() => {
    if (focusedIndex >= itemCount) {
      setFocusedIndex(itemCount > 0 ? itemCount - 1 : -1);
    }
  }, [itemCount, focusedIndex]);

  // Reset focus when disabled
  useEffect(() => {
    if (disabled) {
      setFocusedIndex(-1);
    }
  }, [disabled]);

  return {
    focusedIndex,
    setFocusedIndex,
    handleKeyDown,
    resetFocus,
  };
}

export default useKeyboardNavigation;
