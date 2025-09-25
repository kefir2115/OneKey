import * as FileSystem from 'expo-file-system';
import { createContext, useContext, useEffect, useState } from 'react';

export interface ConfigProviderProps {
    children: any;
}
export type Language = 'en' | 'pl';

export class Config {
    language: Language = 'en';
    theme: number = 0;
    pin: string = '';
    biometric: boolean = false;
    account: any = {};
    shortcuts: { address: string; name: string }[] = [];

    loaded: boolean = false;

    constructor(obj: { [key: string]: any }) {
        if (obj === null) return;
        this.language = !obj.language || obj.language.length === 0 ? 'en' : obj.language;
        this.theme = !obj.theme ? 0 : obj.theme;
        this.pin = !obj.pin ? '' : obj.pin;
        this.biometric = !obj.biometric ? false : obj.biometric;
        this.account = obj.account || {};
        this.shortcuts = obj.shortcuts || [];
    }

    string(): string {
        return JSON.stringify({
            language: this.language || 'en',
            theme: this.theme || 0,
            pin: this.pin,
            biometric: this.biometric,
            account: this.account,
            shortcuts: this.shortcuts
        });
    }
    load(callback?: (c: Config) => void) {
        try {
            if (FILE.exists) {
                const o = new Config(JSON.parse(FILE.textSync()));

                this.language = o.language;
                this.theme = o.theme;
                this.pin = o.pin;
                this.biometric = o.biometric;
                this.account = o.account;
                this.shortcuts = o.shortcuts;

                this.loaded = true;

                if (callback) callback(this);
            } else {
                this.loaded = true;
                if (callback) callback(this);

                return;
            }
        } catch (err) {
            console.log(err);

            this.loaded = true;
            if (callback) callback(this);
        }
    }
    save() {
        if (this.loaded) FILE.write(this.string());
    }
}

const ConfigContext = createContext<Config | undefined>(undefined);

const FILE = new FileSystem.File(FileSystem.Paths.document, 'config.txt');

export function ConfigProvider({ children }: ConfigProviderProps) {
    const [config, setConfig] = useState<Config | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const instance = new Config({ seed: '' });
        instance.load((loadedCfg) => {
            setConfig(loadedCfg);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (config) {
            config.save();
        }
    }, [config]);

    if (loading || !config) {
        return null;
    }

    return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
}

export default function useConfig() {
    const context = useContext(ConfigContext);
    if (!context) throw new Error('No config provider found!');
    return context;
}
