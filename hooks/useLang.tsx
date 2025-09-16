import { createContext, useContext, useEffect, useState } from "react";
import useConfig from "./useConfig";

export type Map = { [key: string]: string };

export class Lang {
    gates = "";
    open = "";
    noService = "";
    noPermission = "";
    search = "";
    allow = "";
    noResults = "";
    results = "";
    actionRequired = "";

    qrScan = "";
    loading = "";
    back = "";
    backToMap = "";

    pinInsert = "";
    pinRepeat = "";
    pinInvalid = "";
    pinTries = "";

    deleteAccount = "";
    deleteAccountMsg = "";

    appUse = "";
    organisations = "";
    darkMode = "";
    expertMode = "";
    bioAuth = "";

    accAddress = "";
    installId = "";
    showRecPhrase = "";
    logOut = "";
    valueClipboard = "";
    yourRecPhrase = "";
    copy = "";

    logoutMsg = "";

    constructor(l: Lang) {
        this.changeSelf(l);
    }

    changeSelf(l: Lang) {
        Object.keys(l).forEach((k) => {
            (this as any)[k] = (l as any)[k];
        });
    }
}

const LANG = {
    en: new Lang({
        gates: "Available gates",
        open: "Open",
        noService: "Looks like you have your location service disabled. It is required for app to work correctly.",
        noPermission: "You have to allow to use your location in order for app to work correctly.",
        search: "Search gates",
        allow: "Allow",
        noResults: "No results!",
        results: 'Search results for "%s"',
        actionRequired: "Action required!",

        qrScan: "Scan the QR code!",

        loading: "Loading...",
        back: "Back",
        backToMap: "Back to map",

        pinInsert: "insert pin",
        pinRepeat: "repeat pin",
        pinInvalid: "Invalid PIN",
        pinTries: "You have %s tries left.",

        deleteAccount: "Delete Account",
        deleteAccountMsg: "Account deletion is irreversible. You won't be able to open gates nor use this account.",

        appUse: "How to use app?",
        organisations: "List of available organisations",
        darkMode: "Dark mode",
        expertMode: "Expert mode",
        bioAuth: "Biometric authorization",

        accAddress: "Account address",
        installId: "Installation ID",
        showRecPhrase: "Show recovery phrase",
        logOut: "Log out",
        valueClipboard: "Copied to clipboard!",
        yourRecPhrase: "Your recovery phrase",
        copy: "Copy",

        logoutMsg: "Make sure you have a copy of your recovery phrases. You won't be able to log in without them."
    } as Lang),
    pl: new Lang({
        gates: "Dostępne wejścia",
        open: "Otwórz",
        noService: "Wygląda na to, że masz wyłączoną lokalizację. Jest ona niezbędna do korzystania z aplikacji.",
        noPermission: "Musisz zezwolić na używanie twojej lokalizacji, aby aplikacja mogła działać poprawnie.",
        search: "Wyszukaj wejścia",
        allow: "Zezwól",
        noResults: "Brak wyników!",
        results: 'Wyniki wyszukiwania dla "%s"',
        actionRequired: "Wymagana akcja!",

        qrScan: "Zeskanuj kod QR!",

        loading: "Ładowanie...",
        back: "Powrót",
        backToMap: "Powrót do mapy",

        pinInsert: "wpisz pin",
        pinRepeat: "powtórz pin",
        pinInvalid: "Nieprawidłowy PIN",
        pinTries: "Pozostałe próby: %s",

        deleteAccount: "Usuń konto",
        deleteAccountMsg: "Usunięcie konta jest nieodwracalne. Po usunięciu nie będziesz w stanie otwierać bram ani używać tego konta.",

        appUse: "Jak używać aplikacji?",
        organisations: "Lista dostępnych organizacji",
        darkMode: "Ciemny motyw",
        expertMode: "Tryb experta",
        bioAuth: "Autoryzacja biometryczne",

        accAddress: "Adres konta",
        installId: "ID instalacji",
        showRecPhrase: "Pokaż frazę odzyskiwania",
        logOut: "Wyloguj się",
        valueClipboard: "Skopiowano do schowka",
        yourRecPhrase: "Twoja fraza odzyskiwania",
        copy: "Kopiuj",

        logoutMsg: "Upewnij się, że masz kopię swoich fraz odzyskiwania. Nie będziesz mógł ich odzyskać po wylogowaniu."
    } as Lang)
};

type LangContextType = {
    lang: Lang;
    forceUpdate: () => void;
    f: (str: string, ...args: string[]) => string;
};

const LangContext = createContext<LangContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: any }) {
    const config = useConfig();
    const [lang, setLang] = useState<Lang>(LANG[config.language]);

    useEffect(() => {
        setLang(LANG[config.language]);
    }, [config.language]);

    const forceUpdate = () => {
        setLang(LANG[config.language]);
    };

    const f = (str: string, ...args: string[]) => {
        const res: string = (lang as any)[str] || "";
        if (args.length === 0) return res;

        return res.split("%s").reduce((p, c, i, a) => p + args[i - 1] + c);
    };

    return <LangContext.Provider value={{ lang, forceUpdate, f }}>{children}</LangContext.Provider>;
}

export default function useLang() {
    const c = useContext(LangContext);
    if (!c) throw new Error("No language provider found!");
    return c;
}
