import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Header } from "@/components/ui/Header";
import Image from "@/components/ui/Image";
import { global } from "@/constants/Styles";
import useConfig from "@/hooks/useConfig";
import useTheme from "@/hooks/useTheme";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Card, Button as PaperButton, Snackbar } from "react-native-paper";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";

const back = require("../../assets/images/icons/back.svg");
const copy = require("../../assets/images/icons/copy.svg");
const copyDark = require("../../assets/images/icons/copy-dark.svg");

export default function Activate() {
    const config = useConfig();
    const router = useRouter();
    const { color, theme } = useTheme();

    const [authorized, setAuthorized] = useState(false);
    const [snackBar, setSnackBar] = useState(false);

    const copySeed = () => {
        Clipboard.setStringAsync(config.seed).then(() => {
            setSnackBar(true);
        });
    };

    return (
        <>
            <Header title="Activate account" />
            <SafeAreaView style={[{ backgroundColor: color(0) }, global.container]}>
                <ThemedView style={s.subtitleContainer}>
                    <ThemedText style={s.subtitle}>
                        To activate your account, please go to an organisation employee and scan your QRcode. After scanning press
                        &apos;Activate&apos; button.
                    </ThemedText>
                </ThemedView>
                <ThemedView style={s.qr}>
                    <QRCode
                        value={config.seed}
                        quietZone={6}
                        size={200}
                    />
                </ThemedView>
                <TouchableOpacity
                    onPress={copySeed}
                    style={[s.seed, { backgroundColor: color(2) }]}
                >
                    <ThemedText style={[s.seedText, { color: color(4) }]}>{config.seed}</ThemedText>
                    <Image
                        source={theme === "dark" ? copyDark : copy}
                        style={{ width: 15, marginLeft: 10 }}
                    />
                </TouchableOpacity>
                <Card style={[s.seedContainer, { backgroundColor: color(0) }]}>
                    <Card.Title
                        title="Your secret password"
                        titleStyle={[s.seedTitle, { color: color(1) }]}
                    />
                    <Card.Content>
                        <ThemedText style={s.seedSubtitle}>
                            Save your seed in a safe place. Loosing it might cause problems with account recovery. You can also find it in
                            settings after this step.
                        </ThemedText>
                    </Card.Content>
                </Card>
                <PaperButton
                    mode="contained"
                    disabled={!authorized}
                    style={[s.activateBtn, { backgroundColor: authorized ? color(4) : color(2) }]}
                >
                    Activate
                </PaperButton>
            </SafeAreaView>
            <Snackbar
                visible={snackBar}
                onDismiss={() => setSnackBar(false)}
                style={{ backgroundColor: color(4) }}
                duration={Snackbar.DURATION_SHORT}
            >
                Seed copied to clipboard!
            </Snackbar>
        </>
    );
}

const s = StyleSheet.create({
    subtitleContainer: {
        width: "80%"
    },
    subtitle: {
        fontSize: 12,
        lineHeight: 16,
        textAlign: "center"
    },
    qr: {
        marginTop: "10%",
        marginBottom: "5%"
    },
    seed: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 40,
        width: "80%",

        paddingHorizontal: 15,

        borderRadius: 20
    },
    seedText: {
        fontSize: 12,
        textAlign: "center",
        flex: 1
    },
    seedContainer: {
        // marginHorizontal: "10%",
        margin: "auto"
    },
    seedTitle: {
        fontSize: 18,
        lineHeight: 20,
        fontFamily: "PoppinsRegular"
    },
    seedSubtitle: {
        fontSize: 12,
        lineHeight: 16
    },
    activateBtn: {
        width: "90%",
        margin: "auto"
    }
});
