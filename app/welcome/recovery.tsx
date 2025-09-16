import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Header } from "@/components/ui/Header";
import Image from "@/components/ui/Image";
import TextArea from "@/components/ui/TextArea";
import { Colors } from "@/constants/Colors";
import { global } from "@/constants/Styles";
import useTheme from "@/hooks/useTheme";
import { getStringAsync } from "expo-clipboard";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Button, Card } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const check = require("../../assets/images/icons/check.svg");
const xmark = require("../../assets/images/icons/xmark.svg");

const logo = require("../../assets/images/logo-0.svg");
const logoDark = require("../../assets/images/logo-0-dark.svg");

const copy = require("../../assets/images/icons/copy.svg");
const copyDark = require("../../assets/images/icons/copy-dark.svg");

export default function Recovery() {
    const { color, theme } = useTheme();
    const [isValid, setValid] = useState(false);
    const [value, setValue] = useState("");

    const setFromClipboard = () => {
        getStringAsync().then((v) => setValue(v));
    };

    useEffect(() => {
        const split = value.split(" ");
        setValid(split.length === 15);
    }, [value]);

    return (
        <>
            <Header title="Back" />
            <SafeAreaView style={global.container}>
                <Image
                    source={theme === "dark" ? logoDark : logo}
                    style={style.logo}
                />
                <Card style={[style.card, { backgroundColor: color(0) }]}>
                    <Card.Content>
                        <ThemedText>Wprowadź frazę odzyskiwania konta i naciśnij &quot;kontynuuj&quot;</ThemedText>
                        <TextArea
                            containerStyle={style.textArea}
                            value={value}
                            onChangeText={setValue}
                        >
                            <TouchableOpacity
                                style={[{ backgroundColor: color(2) }, style.clipBox]}
                                onPress={setFromClipboard}
                            >
                                <ThemedText style={style.clipText}>Wklej ze schowka</ThemedText>
                                <Image
                                    source={theme === "dark" ? copyDark : copy}
                                    style={style.copyIcon}
                                />
                            </TouchableOpacity>
                        </TextArea>
                        <ThemedView style={[style.infoBox, { borderColor: isValid ? color(3) : "#ce7777ff" }]}>
                            <Image
                                source={isValid ? check : xmark}
                                style={style.info}
                            />
                            <ThemedText style={style.infoText}>Fraza jest {isValid ? "" : "nie"}poprawna</ThemedText>
                        </ThemedView>
                    </Card.Content>
                    <Card.Actions>
                        <Button
                            mode="contained"
                            style={{ backgroundColor: color(isValid ? 3 : 2) }}
                            labelStyle={{ fontFamily: "PoppinsBold" }}
                            textColor={isValid ? Colors.dark[1] : Colors.dark[0] + "9a"}
                        >
                            Kontynuuj
                        </Button>
                    </Card.Actions>
                </Card>
            </SafeAreaView>
        </>
    );
}

const style = StyleSheet.create({
    logo: {
        width: "60%",
        aspectRatio: 198 / 60
    },
    card: {
        margin: "auto"
    },
    textArea: {
        marginVertical: 10
    },
    clipBox: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",

        margin: 10,
        padding: 5,
        borderRadius: 20
    },
    clipText: {
        textAlign: "center"
    },
    copyIcon: {
        width: 20,
        aspectRatio: 1,
        marginHorizontal: 10
    },
    infoBox: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",

        // borderRadius: 20,
        paddingHorizontal: 10,
        width: "auto",
        alignSelf: "center",

        borderBottomWidth: 1,
        borderStyle: "solid"
    },
    info: {
        width: 20,
        aspectRatio: 1,
        margin: 5,
        marginRight: 10
    },
    infoText: {
        fontSize: 12,
        fontFamily: "PoppinsLight"
    }
});
