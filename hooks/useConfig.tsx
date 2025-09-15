import generate from "@/components/utils/Seed";
import * as FileSystem from "expo-file-system";
import { createContext, useContext, useEffect, useState } from "react";

export interface ConfigProviderProps {
    children: any;
}
export type Language = "en" | "pl";

export class Config {
    seed: string = "";
    language: Language = "en";
    theme: number = 0;
    pin: string = "";
    biometric: boolean = false;

    loaded: boolean = false;

    constructor(obj: { [key: string]: any }) {
        if (obj === null) return;
        this.seed = !obj.seed || obj.seed.length === 0 ? generate() : obj.seed;
        this.language = !obj.language || obj.language.length === 0 ? "en" : obj.language;
        this.theme = !obj.theme ? 0 : obj.theme;
        this.pin = !obj.pin ? "" : obj.pin;
        this.biometric = !obj.biometric ? false : obj.biometric;
    }

    string(): string {
        return JSON.stringify({
            seed: this.seed || generate(),
            language: this.language || "en",
            theme: this.theme || 0,
            pin: this.pin,
            biometric: this.biometric
        });
    }
    load(callback?: (c: Config) => void) {
        FileSystem.getInfoAsync(FILE).then((f) => {
            if (!f.exists) {
                this.seed = generate();
                this.loaded = true;
                if (callback) callback(this);

                return;
            }
            FileSystem.readAsStringAsync(FILE, { encoding: "utf8" }).then((res) => {
                const o = new Config(JSON.parse(res));

                this.seed = o.seed;
                this.language = o.language;
                this.theme = o.theme;
                this.pin = o.pin;
                this.biometric = o.biometric;
                this.loaded = true;

                if (callback) callback(this);
            });
        });
    }
    save() {
        if (this.loaded) FileSystem.writeAsStringAsync(FILE, this.string(), { encoding: "utf8" });
    }
}

const ConfigContext = createContext<Config | undefined>(undefined);

const FILE = FileSystem.documentDirectory + "config.txt";

export function ConfigProvider({ children }: ConfigProviderProps) {
    const [config, setConfig] = useState<Config | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cfg = new Config({ seed: "" });
        cfg.load((loadedCfg) => {
            setConfig(new Config(loadedCfg));
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (config) {
            config.save();
        }
    }, [config]);

    if (loading || !config) {
        return null; // or a splash screen, loader, etc.
    }

    return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
}

export default function useConfig() {
    const c = useContext(ConfigContext);
    if (!c) throw new Error("No config provider found!");
    return c;
}
