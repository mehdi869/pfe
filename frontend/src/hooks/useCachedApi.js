import { useState, useEffect, useCallback, useRef } from 'react';
import { cacheService } from '../utils/cacheService';

export const useCachedApi = (
  apiFunction,
  cacheKey,
  dependencies = [],
  options = {}
) => {
  const {
    ttl = 5 * 60 * 1000, // 5 minutes
    fallbackData = null,
    forceRefresh = false,
    onError = null,
    onSuccess = null,
    retryAttempts = 3,
    retryDelay = 1000
  } = options;

  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  
  const retryCountRef = useRef(0);
  const abortControllerRef = useRef(null);

  const fetchData = useCallback(async (skipCache = false) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      // Try cache first
      if (!skipCache && !forceRefresh) {
        const cachedResult = cacheService.getWithMetadata(cacheKey);
        if (cachedResult && cachedResult.data !== null) {
          setData(cachedResult.data);
          setLastFetch(cachedResult.metadata.timestamp);
          setLoading(false);
          retryCountRef.current = 0;
          return cachedResult.data;
        }
      }

      // Fetch from API
      const result = await apiFunction({ 
        signal: abortControllerRef.current.signal 
      });
      
      // Cache the result
      cacheService.set(cacheKey, result, ttl);
      setData(result);
      setLastFetch(Date.now());
      retryCountRef.current = 0;

      if (onSuccess) onSuccess(result);
      
      return result;
    } catch (err) {
      if (err.name === 'AbortError') {
        return; // Request was cancelled, don't update state
      }

      console.error('API fetch failed:', err);
      setError(err);

      // Retry logic
      if (retryCountRef.current < retryAttempts) {
        retryCountRef.current++;
        console.log(`Retrying... Attempt ${retryCountRef.current}/${retryAttempts}`);
        
        setTimeout(() => {
          fetchData(skipCache);
        }, retryDelay * retryCountRef.current);
        return;
      }

      if (onError) onError(err);
      
      // Try to use cached data as fallback (even if expired)
      const fallbackCache = cacheService.getWithMetadata(cacheKey);
      if (fallbackCache && fallbackCache.metadata) {
        setData(fallbackCache.data || fallbackData);
        setLastFetch(fallbackCache.metadata.timestamp);
        console.warn('Using stale cached data due to API error:', err);
      } else {
        setData(fallbackData);
      }
    } finally {
      setLoading(false);
    }
  }, [apiFunction, cacheKey, ttl, forceRefresh, onError, onSuccess, retryAttempts, retryDelay, fallbackData]);

  const refresh = useCallback(() => {
    retryCountRef.current = 0; // Reset retry count
    return fetchData(true);
  }, [fetchData]);

  const clearCache = useCallback(() => {
    cacheService.delete(cacheKey);
  }, [cacheKey]);

  // Check if data is stale
  const isStale = useCallback(() => {
    const cached = cacheService.getWithMetadata(cacheKey);
    if (!cached) return true;
    
    const staleTreshold = ttl * 0.8; // Consider stale at 80% of TTL
    return cached.metadata.age > staleTreshold;
  }, [cacheKey, ttl]);

  useEffect(() => {
    fetchData();
    
    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, dependencies);

  return {
    data,
    loading,
    error,
    refresh,
    clearCache,
    isStale: isStale(),
    lastFetch,
    retryCount: retryCountRef.current
  };
};