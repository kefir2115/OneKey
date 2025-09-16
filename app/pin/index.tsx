import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Header } from "@/components/ui/Header";
import { global } from "@/constants/Styles";
import useConfig from "@/hooks/useConfig";
import useLang from "@/hooks/useLang";
import useTheme from "@/hooks/useTheme";
import { FontAwesome } from "@expo/vector-icons";
import * as Crypto from "expo-crypto";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Button, Dialog, Portal, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const back = require("../../assets/images/icons/back.svg");

export default function Pin() {
    const { f } = useLang();
    const config = useConfig();
    const router = useRouter();
    const params = useLocalSearchParams();
    const prevPin = params.pin ? (params.pin as string).split(",") : [];
    const { color } = useTheme();
    const [nums, setNums] = useState<number[]>([]);
    const [dialog, setDialog] = useState(false);
    const [tries, setTries] = useState(3);

    const buttons = [1, 2, 3, 4, 5, 6, 7, 8, 9, "arrow", 0];

    useEffect(() => {
        if (nums.length === 4 && prevPin.length === 4) {
            const isCorrect = nums.filter((n, i) => prevPin[i] === String(n)).length === 4;

            if (!isCorrect) {
                setNums([]);
                showDialog();
                setTries((t) => --t);
            } else {
                Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nums.join(",")).then((sha) => {
                    config.pin = sha;
                    config.save();

                    router.navigate("/activate");
                });
            }
        }
        if (nums.length === 4 && prevPin.length === 0) {
            router.navigate({
                pathname: "/pin",
                params: {
                    pin: nums.join(",")
                }
            });
            setNums([]);
            setTries(3);
        }
    }, [nums]);

    const handleClick = (n: number) => {
        if (n === -1) setNums((array) => [...array.slice(0, -1)]);
        else if (nums.length < 4) {
            setNums((array) => [...array, n]);
        }
    };

    const createButton = (value: string, n: number) => {
        return (
            <TouchableOpacity
                key={n}
                style={[s.pinView, { borderColor: color(1) }]}
                onPress={() => handleClick(n)}
            >
                {value === "arrow" && (
                    <FontAwesome
                        name="arrow-left"
                        size={30}
                        color={color(1)}
                    />
                )}
                {value !== "arrow" && <ThemedText style={s.pinText}>{value}</ThemedText>}
            </TouchableOpacity>
        );
    };

    const hideDialog = () => {
        setDialog(false);
        if (tries === 0) {
            router.navigate("/pin");
        }
    };
    const showDialog = () => setDialog(true);

    return (
        <>
            <Header title={f("back")} />
            <SafeAreaView style={[{ backgroundColor: color(0) }, global.container]}>
                <ThemedText style={s.insert}>{prevPin.length === 0 ? f("pinInsert") : f("pinRepeat")}</ThemedText>
                <ThemedView style={s.circles}>
                    {Array(4)
                        .fill(0)
                        .map((n, i) => (
                            <FontAwesome
                                key={i}
                                name={!nums[i] ? "circle-thin" : "circle"}
                                size={25}
                                color={color(1)}
                                style={{ margin: 8 }}
                            />
                        ))}
                </ThemedView>
                <ThemedView style={s.pinContainer}>
                    {buttons.map((d, idx) => createButton(String(d), typeof d === "string" ? -1 : d))}
                    <ThemedView style={[s.pinView, { borderWidth: 0 }]}></ThemedView>
                </ThemedView>
            </SafeAreaView>
            <Portal>
                <Dialog
                    visible={dialog}
                    onDismiss={hideDialog}
                >
                    <Dialog.Title>{f("pinInvalid")}</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium">{f("pinTries", String(tries))}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialog}>Done</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
    );
}
const s = StyleSheet.create({
    insert: {
        fontSize: 40,
        lineHeight: 60,
        fontFamily: "PoppinsLight"
    },
    circles: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        margin: "10%"
    },
    pinContainer: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",

        width: "70%"
    },
    pinView: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "25%",
        aspectRatio: 1,

        margin: 5,

        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 100
    },
    pinText: {
        margin: "auto",
        fontSize: 30
    }
});
