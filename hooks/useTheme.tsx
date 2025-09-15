import { Colors } from "@/constants/Colors";
import { createContext, useContext, useEffect, useState } from "react";
import { ColorSchemeName, useColorScheme } from "react-native";
import useConfig from "./useConfig";

type ContextType = {
    theme: ColorSchemeName;
    update: () => void;
    color: (n: number) => string;
};

const ThemeContext = createContext<ContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: any }) {
    const col = useColorScheme();
    const config = useConfig();
    const [theme, setTheme] = useState<ColorSchemeName>(col);

    function update() {
        setTheme((t) => (config.theme === 0 ? "dark" : "light")); // TODO: read from settings (if auto then assign)
    }
    function color(n: number) {
        return Colors[theme as "light" | "dark"][n];
    }

    useEffect(() => {
        update();
    }, [config.loaded]);

    return <ThemeContext.Provider value={{ theme, update, color }}>{children}</ThemeContext.Provider>;
}

export default function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("No theme provider found!");
    return context;
}
