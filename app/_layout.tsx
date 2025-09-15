import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { ConfigProvider } from "@/hooks/useConfig";
import { LanguageProvider } from "@/hooks/useLang";
import { ThemeProvider } from "@/hooks/useTheme";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
    duration: 1000,
    fade: true
});

export default function RootLayout() {
    const [loaded] = useFonts({
        PoppinsBlack: require("../assets/fonts/Poppins-Black.ttf"),
        PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
        PoppinsLight: require("../assets/fonts/Poppins-Light.ttf"),
        PoppinsMedium: require("../assets/fonts/Poppins-Medium.ttf"),
        PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
        PoppinsThin: require("../assets/fonts/Poppins-Thin.ttf")
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hide();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }
    /**
     * TODO: (widoki)
     *  info o konkretnym urzadzeniu
     *  mapy
     */

    return (
        <ConfigProvider>
            <ThemeProvider>
                <LanguageProvider>
                    <PaperProvider>
                        <Stack>
                            <Stack.Screen
                                name="map/index"
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="base"
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="map/scanner"
                                options={{ headerShown: false, presentation: "containedModal" }}
                            />
                            <Stack.Screen
                                name="map/locationInfo"
                                options={{ headerShown: false, presentation: "containedModal" }}
                            />
                            <Stack.Screen
                                name="devices/info"
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="welcome/recovery"
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="settings/logoutSubmit"
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="loading/index"
                                options={{ headerShown: false, presentation: "containedModal" }}
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
                    </PaperProvider>
                </LanguageProvider>
            </ThemeProvider>
        </ConfigProvider>
    );
}
