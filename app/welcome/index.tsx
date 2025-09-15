import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Image from "@/components/ui/Image";
import { global } from "@/constants/Styles";
import useTheme from "@/hooks/useTheme";
import { Screen } from "expo-router/build/views/Screen";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Welcome() {
    const { color, theme } = useTheme();
    const darkLogo = require(`../../assets/images/logo-0-dark.svg`);
    const lightLogo = require(`../../assets/images/logo-0.svg`);
    const darkLandscape = require(`../../assets/images/landscape-dark.svg`);
    const lightLandscape = require(`../../assets/images/landscape.svg`);

    return (
        <SafeAreaView style={[{ backgroundColor: color(0) }, global.container]}>
            <Screen
                name="Welcome"
                options={{ headerShown: false }}
            />
            <Image
                style={s.logo}
                source={theme === "dark" ? darkLogo : lightLogo}
            />
            <Image
                style={s.img}
                source={theme === "dark" ? darkLandscape : lightLandscape}
            />

            <ThemedView style={s.texts}>
                <ThemedText style={s.text}>Jeżeli posiadasz już konto i frazę</ThemedText>
                <ThemedText style={s.text}>odzyskiwania - naciśni &quot;Importuj konto&quot;.</ThemedText>
                <ThemedText style={s.text}>Jeżeli nie - &quot;Stwórz konto&quot;</ThemedText>
            </ThemedView>

            <ThemedView style={s.buttons}>
                <Button
                    mode="contained"
                    buttonColor={color(3)}
                    style={s.btn}
                >
                    Importuj konto
                </Button>
                <Button
                    mode="contained"
                    buttonColor={color(4)}
                    style={s.btn}
                >
                    Stwórz konto
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
