/**
 * Performance Utilities Module
 * Contains reusable utilities for optimizing application performance
 */

// Performance optimization: Debounce function to limit execution frequency
function createDebounce(delay) {
  let timeoutId = null;
  let lastCall = 0;

  return function debounced(fn) {
    return function (...args) {
      const now = Date.now();
      const timeSinceLastCall = now - lastCall;

      if (timeSinceLastCall >= delay) {
        // Execute immediately if enough time has passed
        lastCall = now;
        fn.apply(this, args);
      } else {
        // Schedule execution after remaining delay
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          lastCall = Date.now();
          fn.apply(this, args);
        }, delay - timeSinceLastCall);
      }
    };
  };
}

// Performance optimization: Throttle function to limit execution rate
function createThrottle(delay) {
  let lastCall = 0;
  let timeoutId = null;

  return function throttled(fn) {
    return function (...args) {
      const now = Date.now();

      if (now - lastCall >= delay) {
        // Execute immediately if enough time has passed
        lastCall = now;
        fn.apply(this, args);
      } else if (!timeoutId) {
        // Schedule execution at the next allowed time
        timeoutId = setTimeout(() => {
          lastCall = Date.now();
          fn.apply(this, args);
          timeoutId = null;
        }, delay - (now - lastCall));
      }
    };
  };
}

// Performance optimization: Simple LRU cache for frequently accessed values
function createCache(maxSize = 100) {
  const cache = new Map();
  return {
    get(key) { return cache.get(key); },
    set(key, value) {
      if (cache.size >= maxSize && !cache.has(key)) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }
      cache.set(key, value);
    },
    has(key) { return cache.has(key); },
    clear() { cache.clear(); },
    size() { return cache.size; }
  };
}

// Performance optimization: DOM element cache for querySelector results
// Caches frequently accessed elements to avoid repeated DOM traversals
const domElementCache = new Map();
const clearDOMCache = () => domElementCache.clear();
const getCachedElement = (selector) => {
  if (!domElementCache.has(selector)) {
    const el = document.querySelector(selector);
    if (el) domElementCache.set(selector, el);
    return el;
  }
  return domElementCache.get(selector);
};
const getCachedElements = (selector) => {
  const cacheKey = `__all_${selector}`;
  if (!domElementCache.has(cacheKey)) {
    const els = Array.from(document.querySelectorAll(selector));
    if (els.length > 0) domElementCache.set(cacheKey, els);
    return els;
  }
  return domElementCache.get(cacheKey);
};

// Performance optimization: LaTeX compilation result cache
// Caches expensive LaTeX compilation results to avoid recompiling identical content
// Key: content hash or file path, Value: { success, pdfPath, timestamp }
const latexCompilationCache = createCache(50); // Cache up to 50 recent compilations

// Performance optimization: Loading indicator management for async operations
// Shows visual feedback during long-running tasks (LaTeX compilation, file ops, etc.)
const loadingIndicators = new Map();
const createLoadingIndicator = (containerId, message = 'Loading…') => {
  if (!containerId) return null;
  const container = document.getElementById(containerId);
  if (!container) return null;

  const id = `loading-${Date.now()}`;
  const loader = document.createElement('div');
  loader.id = id;
  loader.className = 'loading-spinner';
  loader.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:8px;padding:16px;color:#666;font-size:14px;background:#f5f5f5;border-radius:4px;margin:8px 0;';

  const spinner = document.createElement('span');
  spinner.textContent = '⏳';

  const text = document.createElement('span');
  text.textContent = message;

  loader.appendChild(spinner);
  loader.appendChild(text);
  container.appendChild(loader);

  loadingIndicators.set(containerId, id);
  return id;
};
const removeLoadingIndicator = (containerId) => {
  if (!containerId) return;
  const indicatorId = loadingIndicators.get(containerId);
  if (indicatorId) {
    const indicator = document.getElementById(indicatorId);
    if (indicator) indicator.remove();
    loadingIndicators.delete(containerId);
  }
};

// Export all utilities
if (typeof window !== 'undefined') {
  // Browser environment
  window.PerformanceUtils = {
    createDebounce,
    createThrottle,
    createCache,
    domElementCache,
    clearDOMCache,
    getCachedElement,
    getCachedElements,
    latexCompilationCache,
    loadingIndicators,
    createLoadingIndicator,
    removeLoadingIndicator
  };
} else if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment (for testing)
  module.exports = {
    createDebounce,
    createThrottle,
    createCache,
    domElementCache,
    clearDOMCache,
    getCachedElement,
    getCachedElements,
    latexCompilationCache,
    loadingIndicators,
    createLoadingIndicator,
    removeLoadingIndicator
  };
}