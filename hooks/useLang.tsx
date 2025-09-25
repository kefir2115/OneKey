import { createContext, useContext, useEffect, useState } from 'react';
import useConfig from './useConfig';

import en from '../assets/languages/en.json';
import pl from '../assets/languages/pl.json';

const languages = {
    en: en,
    pl: pl
};

type LangContextType = {
    lang: any;
    forceUpdate: () => void;
    t: (str: string, ...args: string[]) => string;
};

const LangContext = createContext<LangContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: any }) {
    const config = useConfig();
    const [lang, setLang] = useState<any>(languages[config.language]);

    useEffect(() => {
        setLang(languages[config.language]);
    }, [config.language]);

    const forceUpdate = () => {
        setLang(languages[config.language]);
    };

    const t = (str: string, ...args: string[]) => {
        const res: string = (lang as any)[str] || '';
        if (args.length === 0) return res;

        return res.split('%s').reduce((prev, current, index) => prev + args[index - 1] + current);
    };

    return <LangContext.Provider value={{ lang, forceUpdate, t }}>{children}</LangContext.Provider>;
}

export default function useLang() {
    const context = useContext(LangContext);
    if (!context) throw new Error('No language provider found!');
    return context;
}
