import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface UrlStateOptions {
  defaultValue?: any;
  serialize?: (value: any) => string;
  deserialize?: (value: string) => any;
  replace?: boolean;
}

/**
 * Custom hook for managing state that syncs with URL search parameters
 * Enables deep linking and shareable filtered views
 */
export function useUrlState<T>(
  key: string,
  options: UrlStateOptions = {}
): [T, (value: T) => void] {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    defaultValue,
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    replace = false,
  } = options;

  // Initialize state from URL or default value
  const [state, setState] = useState<T>(() => {
    const urlValue = searchParams.get(key);
    if (urlValue) {
      try {
        return deserialize(urlValue);
      } catch (error) {
        console.warn(`Failed to deserialize URL parameter "${key}":`, error);
        return defaultValue;
      }
    }
    return defaultValue;
  });

  // Update URL when state changes
  const updateState = useCallback(
    (newValue: T) => {
      setState(newValue);

      // Create new URLSearchParams
      const params = new URLSearchParams(searchParams.toString());

      if (
        newValue === defaultValue ||
        newValue === null ||
        newValue === undefined
      ) {
        // Remove parameter if it's the default value
        params.delete(key);
      } else {
        try {
          params.set(key, serialize(newValue));
        } catch (error) {
          console.warn(
            `Failed to serialize value for URL parameter "${key}":`,
            error
          );
          return;
        }
      }

      // Update URL
      const newUrl = params.toString()
        ? `?${params.toString()}`
        : window.location.pathname;

      if (replace) {
        router.replace(newUrl);
      } else {
        router.push(newUrl);
      }
    },
    [key, defaultValue, serialize, searchParams, router, replace]
  );

  // Sync state with URL changes
  useEffect(() => {
    const urlValue = searchParams.get(key);
    if (urlValue) {
      try {
        const deserializedValue = deserialize(urlValue);
        setState(deserializedValue);
      } catch (error) {
        console.warn(`Failed to deserialize URL parameter "${key}":`, error);
      }
    } else if (defaultValue !== undefined) {
      setState(defaultValue);
    }
  }, [searchParams, key, deserialize, defaultValue]);

  return [state, updateState];
}

/**
 * Hook specifically for managing search and filter state in URL
 */
export function useSearchUrlState() {
  const [query, setQuery] = useUrlState<string>("q", {
    defaultValue: "",
    serialize: (value: string) => encodeURIComponent(value),
    deserialize: (value: string) => decodeURIComponent(value),
    replace: true,
  });

  const [filters, setFilters] = useUrlState<{
    categories: string[];
    technologies: string[];
    featured: boolean | null;
    hasLiveDemo: boolean | null;
    hasGithub: boolean | null;
  }>("filters", {
    defaultValue: {
      categories: [],
      technologies: [],
      featured: null,
      hasLiveDemo: null,
      hasGithub: null,
    },
    replace: true,
  });

  return {
    query,
    setQuery,
    filters,
    setFilters,
  };
}
