import { useState, useEffect, useCallback, useRef } from "react";

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  onLoadMore: () => void;
  threshold?: number;
  rootMargin?: string;
}

interface UseInfiniteScrollReturn {
  loadMore: () => void;
  isLoading: boolean;
  observerRef: React.RefObject<HTMLDivElement | null>;
}

export function useInfiniteScroll({
  hasMore,
  onLoadMore,
  threshold = 0.1,
  rootMargin = "100px",
}: UseInfiniteScrollOptions): UseInfiniteScrollReturn {
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);
  const observerInstanceRef = useRef<IntersectionObserver | null>(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      await onLoadMore();
    } finally {
      // Add a small delay to prevent rapid successive calls
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  }, [isLoading, hasMore, onLoadMore]);

  useEffect(() => {
    const observerElement = observerRef.current;

    if (!observerElement || !hasMore) {
      return;
    }

    // Clean up existing observer
    if (observerInstanceRef.current) {
      observerInstanceRef.current.disconnect();
    }

    // Create new observer
    observerInstanceRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observerInstanceRef.current.observe(observerElement);

    return () => {
      if (observerInstanceRef.current) {
        observerInstanceRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, loadMore, threshold, rootMargin]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (observerInstanceRef.current) {
        observerInstanceRef.current.disconnect();
      }
    };
  }, []);

  return {
    loadMore,
    isLoading,
    observerRef,
  };
}

export default useInfiniteScroll;
