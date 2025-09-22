import { Colors } from '@/constants/Colors';
import { createContext, useContext, useEffect, useState } from 'react';
import { Appearance, ColorSchemeName, useColorScheme } from 'react-native';

type ContextType = {
    theme: ColorSchemeName;
    color: (n: number) => string;
};

const ThemeContext = createContext<ContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: any }) {
    const col = useColorScheme();
    const [theme, setTheme] = useState<ColorSchemeName>(col);

    function color(n: number) {
        return Colors[theme as 'light' | 'dark'][n];
    }

    useEffect(() => {
        const listener = Appearance.addChangeListener(({ colorScheme }) => {
            setTheme(colorScheme === 'dark' ? 'dark' : 'light');
        });
        return () => listener.remove();
    }, []);

    return <ThemeContext.Provider value={{ theme, color }}>{children}</ThemeContext.Provider>;
}

export default function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('No theme provider found!');
    return context;
}
