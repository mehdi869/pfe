class CacheService {
  constructor() {
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes default
    this.maxCacheSize = 50; // Maximum number of cache entries
  }

  set(key, data, ttl = this.defaultTTL) {
    try {
      const cacheEntry = {
        data,
        timestamp: Date.now(),
        ttl,
        version: '1.0' // For cache invalidation when structure changes
      };
      
      localStorage.setItem(`cache_${key}`, JSON.stringify(cacheEntry));
      this.cleanupOldEntries();
    } catch (error) {
      console.warn('Failed to cache data:', error);
      // If quota exceeded, clear old entries and try again
      if (error.name === 'QuotaExceededError') {
        this.clearExpired();
        try {
          localStorage.setItem(`cache_${key}`, JSON.stringify(cacheEntry));
        } catch (retryError) {
          console.error('Cache storage completely full:', retryError);
        }
      }
    }
  }

  get(key) {
    try {
      const cached = localStorage.getItem(`cache_${key}`);
      if (!cached) return null;

      const cacheEntry = JSON.parse(cached);
      
      // Check if cache is expired
      if (Date.now() - cacheEntry.timestamp > cacheEntry.ttl) {
        this.delete(key);
        return null;
      }

      return cacheEntry.data;
    } catch (error) {
      console.warn('Failed to read cache:', error);
      this.delete(key);
      return null;
    }
  }

  delete(key) {
    localStorage.removeItem(`cache_${key}`);
  }

  clear() {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('cache_'));
    keys.forEach(key => localStorage.removeItem(key));
  }

  // FIXED: More efficient cleanup with better error handling
  cleanupOldEntries() {
    try {
      const cacheKeys = [];
      
      // Single pass through localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('cache_')) {
          try {
            const data = JSON.parse(localStorage.getItem(key));
            cacheKeys.push({
              key,
              timestamp: data.timestamp || 0
            });
          } catch (parseError) {
            // Remove corrupted cache entry
            localStorage.removeItem(key);
          }
        }
      }

      // Sort by timestamp (newest first)
      cacheKeys.sort((a, b) => b.timestamp - a.timestamp);

      // Remove excess entries
      if (cacheKeys.length > this.maxCacheSize) {
        cacheKeys.slice(this.maxCacheSize).forEach(({ key }) => {
          localStorage.removeItem(key);
        });
      }
    } catch (error) {
      console.warn('Failed to cleanup cache entries:', error);
    }
  }

  // NEW: Clear only expired entries
  clearExpired() {
    try {
      const now = Date.now();
      const keysToRemove = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('cache_')) {
          try {
            const data = JSON.parse(localStorage.getItem(key));
            if (now - data.timestamp > data.ttl) {
              keysToRemove.push(key);
            }
          } catch (parseError) {
            keysToRemove.push(key); // Remove corrupted entries
          }
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));
      return keysToRemove.length;
    } catch (error) {
      console.warn('Failed to clear expired cache:', error);
      return 0;
    }
  }

  // FIXED: Better error handling in getInfo
  getInfo() {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('cache_'));
      const entries = [];
      let totalSize = 0;

      keys.forEach(key => {
        try {
          const item = localStorage.getItem(key);
          const data = JSON.parse(item);
          const size = item.length;
          
          entries.push({
            key: key.replace('cache_', ''),
            size,
            age: Date.now() - data.timestamp,
            ttl: data.ttl,
            expired: Date.now() - data.timestamp > data.ttl
          });
          
          totalSize += size;
        } catch (parseError) {
          // Skip corrupted entries
          console.warn(`Corrupted cache entry: ${key}`);
        }
      });

      return {
        totalEntries: entries.length,
        totalSize,
        entries
      };
    } catch (error) {
      console.warn('Failed to get cache info:', error);
      return { totalEntries: 0, totalSize: 0, entries: [] };
    }
  }

  // NEW: Check if a key exists and is valid
  has(key) {
    return this.get(key) !== null;
  }

  // NEW: Get cache entry with metadata
  getWithMetadata(key) {
    try {
      const cached = localStorage.getItem(`cache_${key}`);
      if (!cached) return null;

      const cacheEntry = JSON.parse(cached);
      const now = Date.now();
      const age = now - cacheEntry.timestamp;
      const isExpired = age > cacheEntry.ttl;

      return {
        data: isExpired ? null : cacheEntry.data,
        metadata: {
          timestamp: cacheEntry.timestamp,
          age,
          ttl: cacheEntry.ttl,
          isExpired,
          version: cacheEntry.version
        }
      };
    } catch (error) {
      console.warn('Failed to read cache with metadata:', error);
      return null;
    }
  }
}

export const cacheService = new CacheService();