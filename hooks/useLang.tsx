import { createContext, useContext, useEffect, useState } from "react";
import useConfig from "./useConfig";

export type Map = {[key: string]: string};

export class Lang {
    lockList = "";
    settings = "";
    home = "";
    authLine1 = "";
    authLine2 = "";
    language = "";
    theme = "";
    themes = "";

    constructor(l: Lang) {
        this.changeSelf(l);
    }

    changeSelf(l: Lang) {
        Object.keys(l).forEach(k => {
            (this as any)[k] = (l as any)[k];
        });
    }
}

const LANG = {
    en: new Lang({
        lockList: "Your lock list",
        settings: "Settings",
        home: 'Home',
        authLine1: "Looks like you are not authorized",
        authLine2: "Contact with admin to verify yourself",
        language: "Language",
        theme: "Theme",
        themes: "Auto,Dark,Light",
    } as Lang),
    pl: new Lang({
        lockList: "Lista twoich zamków",
        settings: "Ustawienia",
        home: "Główna",
        authLine1: "Wygląda na to, że nie jesteś zweryfikowany",
        authLine2: "Skontaktuj się z administratorem",
        language: "Język",
        theme: "Motyw",
        themes: "Automatyczny,Ciemny,Jasny",
    } as Lang),
}

type LangContextType = {
    lang: Lang;
    forceUpdate: () => void;
};

const LangContext = createContext<LangContextType | undefined>(undefined);

export function LanguageProvider({children}: {children: any}) {
    const config = useConfig();
    const [lang, setLang] = useState<Lang>(LANG[config.language]);

    useEffect(() => {
        setLang(LANG[config.language]);
    }, [config.language]);

    const forceUpdate = () => {
        setLang(LANG[config.language]);
    };

    return <LangContext.Provider value={{lang, forceUpdate}}>
        {children}
    </LangContext.Provider>
}

export default function useLang() {
    const c = useContext(LangContext);
    if(!c) throw new Error("No language provider found!");
    return c;
}