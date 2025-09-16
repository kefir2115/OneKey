import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Header } from "@/components/ui/Header";
import Image from "@/components/ui/Image";
import { Colors } from "@/constants/Colors";
import { global } from "@/constants/Styles";
import useConfig from "@/hooks/useConfig";
import useLang from "@/hooks/useLang";
import useTheme from "@/hooks/useTheme";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { Card, Divider, Modal, Portal, Snackbar, Switch } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const back = require("../../assets/images/icons/back.svg");
const lock = require("../../assets/images/icons/lock.svg");
const copyl = require("../../assets/images/icons/copy.svg");
const copyDark = require("../../assets/images/icons/copy-dark.svg");

export default function Settings() {
    const { f } = useLang();
    const config = useConfig();
    const router = useRouter();
    const { color, theme, update } = useTheme();
    const [darkMode, setDarkMode] = useState(config.theme === 0);
    const [expertMode, setExpertMode] = useState(false);
    const [bioAuth, setBioAuth] = useState(config.biometric);
    const [snackBar, setSnackBar] = useState(false);
    const [recovery, setRecovery] = useState(false);

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

    const viewRecovery = () => {
        setRecovery(true);
    };
    const copyPhrase = () => {
        copyClipboard(config.phrase);
    };
    const goToLogoutSubmit = () => {
        config.save();
        router.navigate("/settings/logoutSubmit");
    };
    const goToOrgs = () => {
        config.save();
        router.navigate("/settings/organisations");
    };
    const goToRemoveAccount = () => {
        config.save();
        router.navigate("/settings/deleteAccount");
    };

    const containerStyle = { backgroundColor: color(0), padding: 20, borderRadius: 20, width: "80%", alignSelf: "center" };
    const Arrow = () => (
        <Image
            style={{ aspectRatio: 0.5, width: 10, margin: 20, transform: [{ rotate: "180deg" }] }}
            source={back}
        />
    );

    return (
        <>
            <Header title={f("backToMap")} />
            <SafeAreaView style={[global.container, { backgroundColor: color(0) }]}>
                <Card style={[styles.card, { backgroundColor: color(0) }]}>
                    <Card.Content>
                        <Item
                            title={f("appUse")}
                            right={() => Arrow()}
                        />
                        <Divider style={[styles.divider, { backgroundColor: color(2) }]} />
                        <Item
                            onClick={goToOrgs}
                            title={f("organisations")}
                            right={() => Arrow()}
                        />
                        <Divider style={[styles.divider, { backgroundColor: color(2) }]} />
                        <Item
                            title={f("darkMode")}
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
                            title={f("expertMode")}
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
                            title={f("bioAuth")}
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
                        <Item
                            title={f("deleteAccount")}
                            right={() => Arrow()}
                            onClick={goToRemoveAccount}
                        />
                        {expertMode && (
                            <>
                                <Divider style={[styles.divider, { backgroundColor: color(2) }]} />
                                <ThemedText>{f("accAddress")}</ThemedText>
                                <CopyField
                                    value={config.seed}
                                    copy={copyClipboard}
                                />
                                <ThemedText>{f("installId")}</ThemedText>
                                <CopyField
                                    value={"abcd"}
                                    copy={copyClipboard}
                                />
                            </>
                        )}
                        <ThemedText style={styles.watermark}>One Key by Caruma v 1.0.0</ThemedText>
                    </Card.Content>
                </Card>
                <ThemedView style={styles.btns}>
                    <TouchableOpacity
                        style={[styles.btn, { backgroundColor: color(4) }]}
                        onPress={viewRecovery}
                    >
                        <ThemedText style={{ color: Colors.dark[1], fontFamily: "PoppinsBold" }}>{f("showRecPhrase")}</ThemedText>
                        <Image
                            style={{ width: 15, marginLeft: "5%" }}
                            source={lock}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.btn, { backgroundColor: color(5) }]}
                        onPress={goToLogoutSubmit}
                    >
                        <ThemedText style={{ color: Colors.dark[1], fontFamily: "PoppinsBold" }}>{f("logOut")}</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </SafeAreaView>
            <Snackbar
                visible={snackBar}
                onDismiss={() => setSnackBar(false)}
                style={{ backgroundColor: color(4) }}
                duration={Snackbar.DURATION_SHORT}
            >
                {f("valueClipboard")}
            </Snackbar>
            <Portal>
                <Modal
                    visible={recovery}
                    onDismiss={() => setRecovery(false)}
                    contentContainerStyle={containerStyle as any}
                >
                    <ThemedText>{f("yourRecPhrase")}</ThemedText>
                    <ThemedText style={[styles.phrase, { borderColor: color(1) }]}>{config.phrase}</ThemedText>
                    <TouchableOpacity
                        style={styles.btn2}
                        onPress={copyPhrase}
                    >
                        <ThemedText>{f("copy")}</ThemedText>
                        <Image
                            source={theme === "light" ? copyl : copyDark}
                            style={styles.copy}
                        />
                    </TouchableOpacity>
                </Modal>
            </Portal>
        </>
    );
}
export function CopyField({ value, copy, style }: { value: string; copy?: (value: string) => void; style?: StyleProp<ViewStyle> }) {
    const { color, theme } = useTheme();
    return (
        <TouchableOpacity
            onPress={() => copy?.(value)}
            style={[styles.seed, { backgroundColor: color(2) }, style]}
        >
            <ThemedText
                numberOfLines={1}
                style={[styles.seedText, { color: color(4), textOverflow: "ellipsis" }]}
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
export function Item({
    style,
    title,
    right,
    onClick
}: {
    style?: StyleProp<ViewStyle>;
    title: string;
    right: () => React.JSX.Element;
    onClick?: () => void;
}) {
    return (
        <TouchableOpacity
            style={[style, styles.item]}
            onPress={onClick}
        >
            <ThemedText style={{ fontSize: 12 }}>{title}</ThemedText>
            {right()}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
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
    },
    phrase: {
        borderWidth: 1,
        borderStyle: "dashed",
        padding: "5%",
        borderRadius: 20
    },
    btn2: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    copy: {
        width: "8%",
        aspectRatio: 1,
        marginHorizontal: 10,
        margin: 5
    }
});
