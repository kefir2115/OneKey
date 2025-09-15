import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Header } from "@/components/ui/Header";
import Image from "@/components/ui/Image";
import { Colors } from "@/constants/Colors";
import { global } from "@/constants/Styles";
import useTheme from "@/hooks/useTheme";
import { Screen } from "expo-router/build/views/Screen";
import { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const check = require("../../assets/images/icons/check.svg");
const warn = require("../../assets/images/warning.svg");
const warnDark = require("../../assets/images/warning-dark.svg");

export default function LogoutSubmit() {
    const { color, theme } = useTheme();

    const [confirm, setConfirm] = useState(false);

    const accept = () => {
        setConfirm(!confirm);
    };

    return (
        <>
            <Screen
                name="Logout Submit"
                options={{ headerShown: false }}
            />
            <Header title="Back" />
            <SafeAreaView style={global.container}>
                <ThemedView style={[global.container, { width: "100%" }]}>
                    <Image
                        source={theme === "dark" ? warnDark : warn}
                        style={style.img}
                    />
                    <ThemedText style={style.text}>
                        Upewnij się, że masz kopię swoich fraz odzyskiwania. Nie będziesz mógł ich odzyskać po wylogowaniu.
                    </ThemedText>
                    <TouchableOpacity
                        style={[style.btn, { backgroundColor: color(confirm ? 0 : 3), borderColor: color(!confirm ? 0 : 3) }]}
                        onPress={accept}
                    >
                        {!confirm && <ThemedText style={{ color: Colors.dark[1], fontFamily: "PoppinsBold" }}>OK</ThemedText>}
                        {confirm && (
                            <Image
                                source={check}
                                style={style.check}
                            />
                        )}
                    </TouchableOpacity>
                </ThemedView>
                <TouchableOpacity style={[style.btn, { backgroundColor: color(confirm ? 5 : 2) }]}>
                    <ThemedText style={{ color: Colors.dark[1], fontFamily: "PoppinsBold" }}>Wyloguj</ThemedText>
                </TouchableOpacity>
            </SafeAreaView>
        </>
    );
}

const style = StyleSheet.create({
    img: {
        width: "50%",
        aspectRatio: 1
    },
    check: {
        height: "60%",
        aspectRatio: 1
    },
    text: {
        fontFamily: "PoppinsMedium",
        width: "70%",
        textAlign: "center",
        fontSize: 18
    },
    btn: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",

        marginVertical: 5,
        marginTop: "15%",
        borderRadius: 30,
        width: "80%",
        height: 50,

        borderColor: "#0000",
        borderWidth: 2,
        borderStyle: "solid"
    }
});
