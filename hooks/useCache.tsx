import { Device, Key, Organisation } from '@/components/utils/Api';
import * as FileSystem from 'expo-file-system';
import { createContext, useContext, useEffect, useState } from 'react';

export interface CacheProviderProps {
    children: any;
}
export type Language = 'en' | 'pl';

export class Cache {
    data = {
        devices: [] as Device[],
        orgs: [] as Organisation[],
        keys: [] as Key[]
    };

    loaded: boolean = false;

    string(): string {
        return JSON.stringify({
            data: this.data
        });
    }
    load(callback?: (c: Cache) => void) {
        if (FILE.exists) {
            const o = JSON.parse(FILE.textSync());

            this.data = o.data;
            this.loaded = true;

            if (callback) callback(this);
        } else {
            this.loaded = true;
            if (callback) callback(this);

            return;
        }
    }
    save() {
        if (this.loaded) FILE.write(this.string());
    }
}

const CacheContext = createContext<Cache | undefined>(undefined);

const FILE = new FileSystem.File(FileSystem.Paths.cache, '.cache.txt');

export function CacheProvider({ children }: CacheProviderProps) {
    const [cache, setCache] = useState<Cache | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const instance = new Cache();
        instance.load((loadedCache) => {
            setCache(loadedCache);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (cache) {
            cache.save();
        }
    }, [cache]);

    if (loading || !cache) {
        return null;
    }

    return <CacheContext.Provider value={cache}>{children}</CacheContext.Provider>;
}

export default function useCache() {
    const context = useContext(CacheContext);
    if (!context) throw new Error('No cache provider found!');
    return context;
}
