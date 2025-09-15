import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Header } from "@/components/ui/Header";
import Image from "@/components/ui/Image";
import { global } from "@/constants/Styles";
import useTheme from "@/hooks/useTheme";
import { setStringAsync } from "expo-clipboard";
import { useRouter } from "expo-router";
import { Screen } from "expo-router/build/views/Screen";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CopyField } from "../settings";

const back = require("../../assets/images/icons/back.svg");
const qr = require("../../assets/images/icons/qr.svg");
const qrDark = require("../../assets/images/icons/qr-dark.svg");

const copy = require("../../assets/images/icons/copy.svg");
const copyDark = require("../../assets/images/icons/copy-dark.svg");

const active = require("../../assets/images/icons/check.svg");
const disconnected = require("../../assets/images/icons/xmark.svg");
const idle = require("../../assets/images/icons/idle.svg");
const inactive = require("../../assets/images/icons/key-inactive.svg");

export default function Devices() {
    const router = useRouter();
    const { color, theme } = useTheme();

    return (
        <>
            <Screen
                name="Devices"
                options={{ headerHidden: true }}
            />
            <Header
                title="Your devices"
                content={
                    <Image
                        style={{ aspectRatio: 1, width: "15%", margin: 20 }}
                        source={theme === "dark" ? qr : qrDark}
                    />
                }
            />
            <SafeAreaView style={global.container}>
                {Device(0)}
                {Device(1)}
                {Device(2)}
                {Device(3)}
                {Device(0)}
            </SafeAreaView>
        </>
    );
}

function Device(status: number) {
    const { color, theme } = useTheme();
    return (
        <ThemedView style={s.device}>
            <ThemedView style={{ flex: 1 }}>
                <ThemedText style={s.deviceTitle}>Device</ThemedText>
                <ThemedText style={s.deviceCategory}>Device category</ThemedText>
                <CopyField
                    style={{ width: "70%", marginHorizontal: "3%", margin: "2%" }}
                    value="abuwd"
                    copy={setStringAsync}
                />
            </ThemedView>
            <ThemedView style={{ width: "40%" }}>
                <ThemedView style={[s.deviceStatusBox, { backgroundColor: color(3) }]}>
                    <Image
                        style={{ aspectRatio: 1, width: "18%", marginHorizontal: 5 }}
                        source={status === 0 ? active : status === 1 ? disconnected : status === 2 ? idle : inactive}
                    />
                    <ThemedText style={s.deviceStatus}>
                        {status === 0 ? "active" : status === 1 ? "disconnected" : status === 2 ? "inactive" : "key inactive"}
                    </ThemedText>
                </ThemedView>
                <ThemedView style={[{ backgroundColor: color(4) }, s.deviceDistance]}>
                    <ThemedText style={s.distanceInside}>25.5m</ThemedText>
                </ThemedView>
            </ThemedView>
        </ThemedView>
    );
}

const s = StyleSheet.create({
    device: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",

        borderRadius: 15,
        overflow: "hidden",
        marginHorizontal: 10,
        margin: 10,

        width: "90%",
        elevation: 5
    },
    deviceTitle: {
        fontSize: 20,
        margin: "3%"
    },
    deviceCategory: {
        fontSize: 14,
        opacity: 0.7,
        marginHorizontal: "3%"
    },
    deviceStatusBox: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",

        padding: 5
    },
    deviceStatus: {
        fontSize: 14
    },
    deviceDistance: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: 1
    },
    distanceInside: {
        fontFamily: "PoppinsBold",
        fontSize: 20
    }
});
