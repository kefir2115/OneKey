import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Header } from "@/components/ui/Header";
import Image from "@/components/ui/Image";
import { global } from "@/constants/Styles";
import useLang from "@/hooks/useLang";
import useTheme from "@/hooks/useTheme";
import { setStringAsync } from "expo-clipboard";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const online = require("../../assets/images/icons/check.svg");
const offline = require("../../assets/images/icons/xmark.svg");

const copyl = require("../../assets/images/icons/copy.svg");
const copyDark = require("../../assets/images/icons/copy-dark.svg");

export default function Organisations() {
    const { f } = useLang();
    const { color } = useTheme();
    return (
        <>
            <Header title={f("back")} />
            <SafeAreaView style={[global.container, { backgroundColor: color(0) }]}>
                <ThemedText style={item.title}>{f("organisations")}</ThemedText>
                <ScrollView style={{ marginTop: 20, flex: 1 }}>
                    <Organisation
                        name="Caruma"
                        status="on"
                        secret="dwadnwaodiawiofnaidm"
                    />
                </ScrollView>
            </SafeAreaView>
        </>
    );
}

function Organisation({ status, name, secret }: { status: "on" | "off"; name: string; secret: string }) {
    const { theme } = useTheme();

    const copy = () => {
        setStringAsync(secret);
    };

    return (
        <ThemedView style={item.container}>
            <Image
                source={status === "on" ? online : offline}
                style={item.status}
            />
            <ThemedText style={item.name}>{name}</ThemedText>
            <TouchableOpacity
                onPress={copy}
                style={item.btn}
            >
                <ThemedText
                    style={item.value}
                    numberOfLines={1}
                >
                    {secret}
                </ThemedText>
                <Image
                    source={theme === "light" ? copyl : copyDark}
                    style={item.copy}
                />
            </TouchableOpacity>
        </ThemedView>
    );
}

const item = StyleSheet.create({
    title: {
        fontSize: 20,
        lineHeight: 26,
        fontFamily: "PoppinsLight"
    },
    container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "90%",
        alignItems: "center",
        padding: 15,
        elevation: 5,
        alignSelf: "center",
        borderRadius: 10
    },
    status: {
        width: "10%",
        aspectRatio: 1
    },
    name: {},
    btn: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "30%",
        borderRadius: 5,
        padding: 5,
        backgroundColor: "#00000021"
    },
    value: {
        textOverflow: "ellipsis",
        width: "80%"
    },
    copy: {
        width: "20%",
        aspectRatio: 1
    }
});
