// Lazy loading utilities for heavy components

import React, { Suspense, ComponentType, LazyExoticComponent } from "react";

// Generic lazy loading wrapper with error boundary
export interface LazyComponentOptions {
  fallback?: React.ComponentType;
  errorFallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  preload?: boolean;
  timeout?: number;
}

// Default loading fallback
const DefaultLoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

// Default error fallback
const DefaultErrorFallback: React.FC<{ error: Error; retry: () => void }> = ({
  error,
  retry,
}) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <div className="text-red-600 mb-4">
      <svg
        className="w-12 h-12 mx-auto mb-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
      <p className="text-sm font-medium">Failed to load component</p>
    </div>
    <button
      onClick={retry}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
    >
      Retry
    </button>
    {process.env.NODE_ENV === "development" && (
      <details className="mt-4 text-xs text-gray-600">
        <summary>Error Details</summary>
        <pre className="mt-2 p-2 bg-gray-100 rounded text-left overflow-auto">
          {error.message}
        </pre>
      </details>
    )}
  </div>
);

// Enhanced lazy component creator with error handling and preloading
export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: LazyComponentOptions = {}
): LazyExoticComponent<T> {
  const {
    fallback = DefaultLoadingFallback,
    errorFallback = DefaultErrorFallback,
    preload = false,
    timeout = 10000,
  } = options;

  // Create lazy component with timeout
  const LazyComponent = React.lazy(() => {
    const importPromise = importFunc();

    // Add timeout to prevent hanging
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Component loading timeout")), timeout);
    });

    return Promise.race([importPromise, timeoutPromise]);
  });

  // Preload if requested
  if (preload && typeof window !== "undefined") {
    // Preload on idle or after a short delay
    const preloadComponent = () => {
      importFunc().catch(console.error);
    };

    if ("requestIdleCallback" in window) {
      requestIdleCallback(preloadComponent);
    } else {
      setTimeout(preloadComponent, 100);
    }
  }

  // Return wrapped component with error boundary
  return LazyComponent;
}

// Lazy loading wrapper component with error boundary
interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ComponentType;
  errorFallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({
  children,
  fallback = DefaultLoadingFallback,
  errorFallback = DefaultErrorFallback,
}) => {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const retry = React.useCallback(() => {
    setHasError(false);
    setError(null);
  }, []);

  React.useEffect(() => {
    if (hasError) {
      console.error("LazyWrapper error:", error);
    }
  }, [hasError, error]);

  if (hasError && error) {
    const ErrorComponent = errorFallback;
    return <ErrorComponent error={error} retry={retry} />;
  }

  return (
    <Suspense fallback={<fallback />}>
      <ErrorBoundary
        onError={(error) => {
          setHasError(true);
          setError(error);
        }}
      >
        {children}
      </ErrorBoundary>
    </Suspense>
  );
};

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: (error: Error) => void },
  { hasError: boolean }
> {
  constructor(props: {
    children: React.ReactNode;
    onError: (error: Error) => void;
  }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError(error);
  }

  render() {
    if (this.state.hasError) {
      return null; // Let parent handle error display
    }

    return this.props.children;
  }
}

// Intersection Observer based lazy loading for images and components
export interface IntersectionLazyOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  fallback?: React.ComponentType;
}

export const useIntersectionLazy = (
  options: IntersectionLazyOptions = {}
): [React.RefObject<HTMLDivElement>, boolean] => {
  const { threshold = 0.1, rootMargin = "50px", triggerOnce = true } = options;

  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const element = ref.current;
    if (
      !element ||
      typeof window === "undefined" ||
      !("IntersectionObserver" in window)
    ) {
      setIsVisible(true); // Fallback to always visible
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isVisible];
};

// Lazy image component with intersection observer
interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  threshold?: number;
  rootMargin?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder,
  className = "",
  threshold = 0.1,
  rootMargin = "50px",
  ...props
}) => {
  const [ref, isVisible] = useIntersectionLazy({ threshold, rootMargin });
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  const handleLoad = () => setIsLoaded(true);
  const handleError = () => setHasError(true);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {isVisible && (
        <>
          <img
            {...props}
            src={src}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className={`transition-opacity duration-300 ${
              isLoaded ? "opacity-100" : "opacity-0"
            } ${className}`}
            loading="lazy"
          />
          {!isLoaded && !hasError && placeholder && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              {typeof placeholder === "string" ? (
                <img src={placeholder} alt="" className="opacity-50" />
              ) : (
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
              )}
            </div>
          )}
          {hasError && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <svg
                  className="w-8 h-8 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-xs">Failed to load</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Preload utilities
export const preloadComponent = <T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
): Promise<{ default: T }> => {
  return importFunc();
};

export const preloadRoute = (href: string): void => {
  if (typeof window !== "undefined") {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = href;
    document.head.appendChild(link);
  }
};

// Batch preloading for multiple components
export const preloadComponents = async <T extends ComponentType<any>>(
  importFuncs: Array<() => Promise<{ default: T }>>
): Promise<Array<{ default: T }>> => {
  try {
    return await Promise.all(importFuncs.map((importFunc) => importFunc()));
  } catch (error) {
    console.error("Failed to preload components:", error);
    return [];
  }
};

// Resource priority hints
export const addResourceHints = (
  resources: Array<{ href: string; as: string; type?: string }>
): void => {
  if (typeof window === "undefined") return;

  resources.forEach(({ href, as, type }) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    document.head.appendChild(link);
  });
};

// Critical resource preloading
export const preloadCriticalResources = (): void => {
  if (typeof window === "undefined") return;

  const criticalResources = [
    { href: "/fonts/space-mono-regular.woff2", as: "font", type: "font/woff2" },
    { href: "/fonts/space-mono-bold.woff2", as: "font", type: "font/woff2" },
    { href: "/images/hero-bg.webp", as: "image" },
    { href: "/images/profile.webp", as: "image" },
  ];

  addResourceHints(criticalResources);
};
