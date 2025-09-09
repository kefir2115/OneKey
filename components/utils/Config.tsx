import * as FileSystem from 'expo-file-system';
import generate from './Seed';

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

export function load(callback?: (config: Config) => void) {
    FileSystem.getInfoAsync(FILE).then(f => {
        if(!f.exists) {
            config = new Config({ seed: generate() })

            if(callback) callback(config);
            save();
            
            return;
        }
        FileSystem.readAsStringAsync(FILE, { encoding: "utf8" }).then(res => {
            if(callback) callback(config = new Config(JSON.parse(res)));
        });
    })
}

export function save(callback?: () => void) {
    FileSystem.writeAsStringAsync(FILE, config.string(), { encoding: "utf8" }).then(callback);
}

export function get(): Config {
    return config;
}