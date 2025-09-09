import { load } from '@/components/utils/Config';
import * as FileSystem from 'expo-file-system';
import { useEffect, useState } from 'react';

export class Config {
    seed: string = "";

    constructor(obj: {[key: string]: any}) {
        this.seed = obj.seed;
    }

    string(): string {
        return JSON.stringify(
            {
                seed: this.seed
            }
        );
    }
}

const FILE = FileSystem.documentDirectory + "seed.b64"
let config: Config = new Config({seed: ""});

export default function useConfig() {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        load(() => {
            setLoaded(true);
        });
    }, []);

    return loaded;
}