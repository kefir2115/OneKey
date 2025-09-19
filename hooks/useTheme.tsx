import { Colors } from '@/constants/Colors';
import { createContext, useContext, useEffect, useState } from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native';

type ContextType = {
    theme: ColorSchemeName;
    update: () => void;
    color: (n: number) => string;
};

const ThemeContext = createContext<ContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: any }) {
    const col = useColorScheme();
    const [theme, setTheme] = useState<ColorSchemeName>(col);

    function update() {
        setTheme((t) => col);
    }
    function color(n: number) {
        return Colors[theme as 'light' | 'dark'][n];
    }

    useEffect(() => {
        update();
    }, [col]);

    return <ThemeContext.Provider value={{ theme, update, color }}>{children}</ThemeContext.Provider>;
}

export default function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('No theme provider found!');
    return context;
}
