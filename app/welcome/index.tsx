import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Image from "@/components/ui/Image";
import { global } from "@/constants/Styles";
import useLang from "@/hooks/useLang";
import useTheme from "@/hooks/useTheme";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Welcome() {
    const { f } = useLang();
    const router = useRouter();
    const { color, theme } = useTheme();
    const darkLogo = require(`../../assets/images/logo-0-dark.svg`);
    const lightLogo = require(`../../assets/images/logo-0.svg`);
    const darkLandscape = require(`../../assets/images/landscape-dark.svg`);
    const lightLandscape = require(`../../assets/images/landscape.svg`);

    const goToImport = () => {
        router.navigate("/welcome/recovery");
    };
    const goToCreate = () => {
        router.navigate({
            pathname: "/pin",
            params: {
                next: "/activate"
            }
        });
    };

    return (
        <SafeAreaView style={[{ backgroundColor: color(0) }, global.container]}>
            <Image
                style={s.logo}
                source={theme === "dark" ? darkLogo : lightLogo}
            />
            <Image
                style={s.img}
                source={theme === "dark" ? darkLandscape : lightLandscape}
            />

            <ThemedView style={s.texts}>
                <ThemedText style={s.text}>{f("welcome1")}</ThemedText>
                <ThemedText style={s.text}>{f("welcome2")}</ThemedText>
                <ThemedText style={s.text}>{f("welcome3")}</ThemedText>
            </ThemedView>

            <ThemedView style={s.buttons}>
                <Button
                    mode="contained"
                    buttonColor={color(3)}
                    style={s.btn}
                    onPress={goToImport}
                >
                    {f("importAccount")}
                </Button>
                <Button
                    mode="contained"
                    buttonColor={color(4)}
                    style={s.btn}
                    onPress={goToCreate}
                >
                    {f("createAccount")}
                </Button>
            </ThemedView>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    logo: {
        width: "100%",
        aspectRatio: 198 / 60,

        padding: 20,
        marginTop: "20%"
    },
    img: {
        height: "30%",
        aspectRatio: 544 / 232,
        marginTop: "20%"
    },
    texts: {
        marginVertical: "10%"
    },
    text: {
        fontSize: 12,
        textAlign: "center"
    },
    buttons: {
        display: "flex",
        flexDirection: "column",

        width: "80%"
    },
    btn: {
        margin: 5
    }
});
