import { useCallback, useMemo, useRef, useEffect } from 'react';

/**
 * Custom hook for performance optimization utilities
 */
export const usePerformance = () => {
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(Date.now());

  useEffect(() => {
    renderCountRef.current += 1;
    lastRenderTimeRef.current = Date.now();
  });

  /**
   * Debounce function to limit rapid function calls
   */
  const useDebounce = useCallback(<T extends (...args: unknown[]) => void>(
    func: T,
    delay: number
  ) => {
    const timeoutRef = useRef<NodeJS.Timeout>();

    return useCallback((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => func(...args), delay);
    }, [func, delay]);
  }, []);

  /**
   * Throttle function to limit function calls to once per interval
   */
  const useThrottle = useCallback(<T extends (...args: unknown[]) => void>(
    func: T,
    limit: number
  ) => {
    const inThrottleRef = useRef(false);

    return useCallback((...args: Parameters<T>) => {
      if (!inThrottleRef.current) {
        func(...args);
        inThrottleRef.current = true;
        setTimeout(() => {
          inThrottleRef.current = false;
        }, limit);
      }
    }, [func, limit]);
  }, []);

  /**
   * Memoized value that only recalculates when dependencies change
   */
  const useMemoizedValue = useCallback(<T>(
    factory: () => T,
    deps: React.DependencyList
  ) => {
    return useMemo(factory, deps);
  }, []);

  /**
   * Performance metrics for debugging
   */
  const getPerformanceMetrics = useCallback(() => {
    return {
      renderCount: renderCountRef.current,
      lastRenderTime: lastRenderTimeRef.current,
      timeSinceLastRender: Date.now() - lastRenderTimeRef.current,
    };
  }, []);

  return {
    useDebounce,
    useThrottle,
    useMemoizedValue,
    getPerformanceMetrics,
  };
};

/**
 * Hook for lazy loading images with intersection observer
 */
export const useLazyImage = (src: string, options?: IntersectionObserverInit) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver>();

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          img.src = src;
          observerRef.current?.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observerRef.current.observe(img);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [src, options]);

  return imgRef;
};

/**
 * Hook for measuring component render performance
 */
export const useRenderPerformance = (componentName: string) => {
  const renderStartTime = useRef<number>();
  const renderCount = useRef(0);

  useEffect(() => {
    renderStartTime.current = performance.now();
    renderCount.current += 1;
  });

  useEffect(() => {
    if (renderStartTime.current) {
      const renderTime = performance.now() - renderStartTime.current;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} render #${renderCount.current}: ${renderTime.toFixed(2)}ms`);
      }
    }
  });

  return {
    renderCount: renderCount.current,
  };
};
