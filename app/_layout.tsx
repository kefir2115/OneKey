import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-get-random-values';
import 'react-native-reanimated';

import { globalTheme } from '@/constants/Styles';
import { CacheProvider } from '@/hooks/useCache';
import { ConfigProvider } from '@/hooks/useConfig';
import { LanguageProvider } from '@/hooks/useLang';
import { ThemeProvider } from '@/hooks/useTheme';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
    duration: 1000,
    fade: true
});

export default function RootLayout() {
    const [loaded] = useFonts({
        PoppinsBlack: require('../assets/fonts/Poppins-Black.ttf'),
        PoppinsBold: require('../assets/fonts/Poppins-Bold.ttf'),
        PoppinsLight: require('../assets/fonts/Poppins-Light.ttf'),
        PoppinsMedium: require('../assets/fonts/Poppins-Medium.ttf'),
        PoppinsRegular: require('../assets/fonts/Poppins-Regular.ttf'),
        PoppinsThin: require('../assets/fonts/Poppins-Thin.ttf')
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <Providers>
            <Stack>
                <Stack.Screen
                    name="index"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="map/index"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="devices/open"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="settings/deleteAccount"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="settings/organisations"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="map/scanner"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="devices/info"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="recovery/index"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="settings/logoutSubmit"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="loading/index"
                    options={{ headerShown: false, presentation: 'containedModal' }}
                />
                <Stack.Screen
                    name="devices/index"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="settings/index"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="activate/index"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="pin/index"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="welcome/index"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="+not-found"
                    options={{ headerShown: false }}
                />
            </Stack>
            <StatusBar style="auto" />
        </Providers>
    );
}

function Providers({ children }: { children: any }) {
    return (
        <ConfigProvider>
            <CacheProvider>
                <ThemeProvider>
                    <LanguageProvider>
                        <PaperProvider theme={globalTheme}>
                            <SafeAreaProvider>{children}</SafeAreaProvider>
                        </PaperProvider>
                    </LanguageProvider>
                </ThemeProvider>
            </CacheProvider>
        </ConfigProvider>
    );
}
