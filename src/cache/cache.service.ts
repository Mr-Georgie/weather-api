import { Inject, Injectable } from "@nestjs/common";
import { Cacheable } from "cacheable";

@Injectable()
export class CacheService<T> {
    constructor(@Inject("CACHE_INSTANCE") private readonly cache: Cacheable) {}

    async get(key: string): Promise<T> {
        return await this.cache.get(key);
    }

    async set(key: string, value: T, ttl?: number | string): Promise<void> {
        await this.cache.set(key, value, ttl);
    }

    async delete(key: string): Promise<void> {
        await this.cache.delete(key);
    }
}
