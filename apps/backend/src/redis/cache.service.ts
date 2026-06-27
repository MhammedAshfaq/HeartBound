import { Injectable, Inject, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.provider';

interface CacheEntry<T> {
  data: T;
  savedAt: number;
}

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly activeRevalidations = new Map<string, Promise<any>>();

  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis
  ) {}

  /**
   * Retrieves a typed value from Redis cache.
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const val = await this.redis.get(key);
      if (!val) return null;
      const entry = JSON.parse(val) as CacheEntry<T>;
      return entry.data;
    } catch (error) {
      this.logger.error(`Error reading cache key "${key}":`, error);
      return null;
    }
  }

  // Standard TTL constants (in seconds)
  private readonly SHORT_TTL = 300;      // 5 minutes
  private readonly LONG_TTL = 86400;     // 24 hours

  /**
   * Stores a value in Redis cache with a custom TTL (in seconds).
   */
  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    try {
      const entry: CacheEntry<any> = {
        data: value,
        savedAt: Date.now(),
      };
      const serialized = JSON.stringify(entry);
      if (ttlSeconds) {
        await this.redis.set(key, serialized, 'EX', ttlSeconds);
      } else {
        await this.redis.set(key, serialized);
      }
    } catch (error) {
      this.logger.error(`Error setting cache key "${key}":`, error);
    }
  }

  /**
   * Stores a value in Redis cache with a short TTL (5 minutes).
   */
  async setShort(key: string, value: any): Promise<void> {
    return this.set(key, value, this.SHORT_TTL);
  }

  /**
   * Stores a value in Redis cache with a long TTL (24 hours).
   */
  async setLong(key: string, value: any): Promise<void> {
    return this.set(key, value, this.LONG_TTL);
  }

  /**
   * Stores a value in Redis cache with a custom TTL (in seconds).
   * This is an alias for set() to explicitly indicate custom TTL usage.
   */
  async setCustom(key: string, value: any, ttlSeconds: number): Promise<void> {
    return this.set(key, value, ttlSeconds);
  }

  /**
   * Standard Cache-Aside pattern with short TTL (5 minutes).
   */
  async getOrSetShort<T>(key: string, factory: () => Promise<T>): Promise<T> {
    try {
      const cached = await this.get<T>(key);
      if (cached !== null) return cached;

      const data = await factory();
      await this.setShort(key, data);
      return data;
    } catch (error) {
      this.logger.error(`Error in getOrSetShort for key "${key}":`, error);
      return factory();
    }
  }

  /**
   * Standard Cache-Aside pattern with long TTL (24 hours).
   */
  async getOrSetLong<T>(key: string, factory: () => Promise<T>): Promise<T> {
    try {
      const cached = await this.get<T>(key);
      if (cached !== null) return cached;
      const data = await factory();
      await this.setLong(key, data);
      return data;
    } catch (error) {
      this.logger.error(`Error in getOrSetLong for key "${key}":`, error);
      return factory();
    }
  }

  /**
   * Deletes a cache entry from Redis.
   */
  async delete(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      this.logger.error(`Error deleting cache key "${key}":`, error);
    }
  }

  /**
   * Stale-While-Revalidate caching strategy with short & long TTL.
   * 
   * @param key Cache key in Redis
   * @param factory DB query fallback function to get fresh data
   * @param options TTL config: shortTtl (freshness period) and longTtl (overall storage period)
   */
  async getOrSetSWR<T>(
    key: string,
    factory: () => Promise<T>,
    options: { shortTtl: number; longTtl: number }
  ): Promise<T> {
    const { shortTtl, longTtl } = options;
    try {
      const val = await this.redis.get(key);
      if (!val) {
        // Cache miss: retrieve and store synchronously
        this.logger.log(`Cache miss for "${key}". Fetching fresh data.`);
        const data = await factory();
        await this.set(key, data, longTtl);
        return data;
      }

      const entry = JSON.parse(val) as CacheEntry<T>;
      const ageSeconds = (Date.now() - entry.savedAt) / 1000;

      // 1. Fresh cache hit
      if (ageSeconds <= shortTtl) {
        return entry.data;
      }

      // 2. Stale cache hit: serve stale data immediately and trigger revalidation in background
      if (!this.activeRevalidations.has(key)) {
        this.logger.log(`Cache stale for "${key}" (age: ${Math.round(ageSeconds)}s). Triggering background revalidation.`);
        const revalidationPromise = factory()
          .then(async (freshData) => {
            await this.set(key, freshData, longTtl);
            this.logger.log(`Background revalidation successful for "${key}".`);
          })
          .catch((error) => {
            this.logger.error(`Background revalidation failed for "${key}":`, error);
          })
          .finally(() => {
            this.activeRevalidations.delete(key);
          });
        this.activeRevalidations.set(key, revalidationPromise);
      }

      return entry.data;
    } catch (error) {
      this.logger.error(`Error in getOrSetSWR for key "${key}", falling back to query:`, error);
      return factory();
    }
  }
}
