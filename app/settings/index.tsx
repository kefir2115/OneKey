import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Header } from "@/components/ui/Header";
import Image from "@/components/ui/Image";
import { Colors } from "@/constants/Colors";
import { global } from "@/constants/Styles";
import useConfig from "@/hooks/useConfig";
import useTheme from "@/hooks/useTheme";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { Screen } from "expo-router/build/views/Screen";
import { useState } from "react";
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { Card, Divider, Snackbar, Switch } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const back = require("../../assets/images/icons/back.svg");
const lock = require("../../assets/images/icons/lock.svg");
const copyl = require("../../assets/images/icons/copy.svg");
const copyDark = require("../../assets/images/icons/copy-dark.svg");

export default function Settings() {
    const config = useConfig();
    const router = useRouter();
    const { color, theme, update } = useTheme();
    const [darkMode, setDarkMode] = useState(config.theme === 0);
    const [expertMode, setExpertMode] = useState(false);
    const [bioAuth, setBioAuth] = useState(config.biometric);
    const [snackBar, setSnackBar] = useState(false);

    const toggleDarkMode = () => {
        config.theme = darkMode ? 1 : 0;
        config.save();
        update();

        setDarkMode(!darkMode);
    };
    const toggleExpertMode = () => setExpertMode(!expertMode);
    const toggleBioAuth = () => {
        config.biometric = bioAuth;
        config.save();
        setBioAuth(!bioAuth);
    };

    const copyClipboard = (value: string) => {
        Clipboard.setStringAsync(config.seed).then(() => {
            setSnackBar(true);
        });
    };

    return (
        <>
            <Screen
                name="Settings"
                options={{ headerShown: false }}
            />
            <Header title="Back to map" />
            <SafeAreaView style={[global.container, { backgroundColor: color(0) }]}>
                <Card style={[s.card, { backgroundColor: color(0) }]}>
                    <Card.Content>
                        <Item
                            title={"How to use app?"}
                            right={() => (
                                <Image
                                    style={{ aspectRatio: 0.5, width: 10, margin: 20, transform: [{ rotate: "180deg" }] }}
                                    source={back}
                                />
                            )}
                        />
                        <Divider style={[s.divider, { backgroundColor: color(2) }]} />
                        <Item
                            title={"List of available organisations"}
                            right={() => (
                                <Image
                                    style={{ aspectRatio: 0.5, width: 10, margin: 20, transform: [{ rotate: "180deg" }] }}
                                    source={back}
                                />
                            )}
                        />
                        <Divider style={[s.divider, { backgroundColor: color(2) }]} />
                        <Item
                            title={"Dark mode"}
                            right={() => (
                                <Switch
                                    value={darkMode}
                                    onChange={toggleDarkMode}
                                    thumbColor={color(darkMode ? 3 : 2)}
                                    trackColor={{
                                        true: color(3) + "aa",
                                        false: color(2) + "aa"
                                    }}
                                />
                            )}
                        />
                        <Item
                            title={"Expert Mode"}
                            right={() => (
                                <Switch
                                    value={expertMode}
                                    onChange={toggleExpertMode}
                                    thumbColor={color(expertMode ? 3 : 2)}
                                    trackColor={{
                                        true: color(3) + "aa",
                                        false: color(2) + "aa"
                                    }}
                                />
                            )}
                        />
                        <Item
                            title={"Biometric Authorization"}
                            right={() => (
                                <Switch
                                    value={bioAuth}
                                    onChange={toggleBioAuth}
                                    thumbColor={color(bioAuth ? 3 : 2)}
                                    trackColor={{
                                        true: color(3) + "aa",
                                        false: color(2) + "aa"
                                    }}
                                />
                            )}
                        />
                        {expertMode && (
                            <>
                                <Divider style={[s.divider, { backgroundColor: color(2) }]} />
                                <ThemedText>Account Address</ThemedText>
                                <CopyField
                                    value={config.seed}
                                    copy={copyClipboard}
                                />
                                <ThemedText>Installation ID</ThemedText>
                                <CopyField
                                    value={"abcd"}
                                    copy={copyClipboard}
                                />
                            </>
                        )}
                        <ThemedText style={s.watermark}>One Key by Caruma v 1.0.0</ThemedText>
                    </Card.Content>
                </Card>
                <ThemedView style={s.btns}>
                    <TouchableOpacity style={[s.btn, { backgroundColor: color(4) }]}>
                        <ThemedText style={{ color: Colors.dark[1], fontFamily: "PoppinsBold" }}>Show recovery phrase</ThemedText>
                        <Image
                            style={{ width: 15, marginLeft: "5%" }}
                            source={lock}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={[s.btn, { backgroundColor: color(5) }]}>
                        <ThemedText style={{ color: Colors.dark[1], fontFamily: "PoppinsBold" }}>Log out</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </SafeAreaView>
            <Snackbar
                visible={snackBar}
                onDismiss={() => setSnackBar(false)}
                style={{ backgroundColor: color(4) }}
                duration={Snackbar.DURATION_SHORT}
            >
                Value copied to clipboard!
            </Snackbar>
        </>
    );
}
export function CopyField({ value, copy, style }: { value: string; copy?: (value: string) => void; style?: StyleProp<ViewStyle> }) {
    const { color, theme } = useTheme();
    return (
        <TouchableOpacity
            onPress={() => copy?.(value)}
            style={[s.seed, { backgroundColor: color(2) }, style]}
        >
            <ThemedText
                numberOfLines={1}
                style={[s.seedText, { color: color(4), textOverflow: "ellipsis" }]}
            >
                {value}
            </ThemedText>
            <Image
                source={theme === "dark" ? copyDark : copyl}
                style={{ width: 15, marginLeft: 10 }}
            />
        </TouchableOpacity>
    );
}
export function Item({ style, title, right }: { style?: StyleProp<ViewStyle>; title: string; right: () => React.JSX.Element }) {
    return (
        <ThemedView style={[style, s.item]}>
            <ThemedText style={{ fontSize: 12 }}>{title}</ThemedText>
            {right()}
        </ThemedView>
    );
}

const s = StyleSheet.create({
    seed: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 40,
        width: "100%",

        paddingHorizontal: 15,

        borderRadius: 20
    },
    seedText: {
        fontSize: 12,
        textAlign: "center",
        flex: 1
    },
    card: {
        width: "90%"
    },
    item: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"

        // margin: 5
    },
    divider: {
        height: 1,
        width: "90%",
        alignSelf: "center"
    },
    btns: {
        position: "absolute",
        bottom: "5%",
        width: "80%"
    },
    btn: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",

        marginVertical: 5,
        borderRadius: 30,
        height: 50
    },
    watermark: {
        fontSize: 10,
        opacity: 0.7,
        textAlign: "center",
        margin: 10
    }
});
