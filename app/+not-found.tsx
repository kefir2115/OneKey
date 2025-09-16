import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Button from "@/components/ui/Button";
import { Stack, useRouter } from "expo-router";
import { StyleSheet } from "react-native";

export default function NotFound() {
    const nav = useRouter();

    return (
        <ThemedView style={s.view}>
            <Stack.Screen
                name="Not Found"
                options={{ headerShown: false }}
            />
            <ThemedText style={s.title}>Looks like this page doesn&apos;t exist!</ThemedText>
            {/* <Image style={s.img} source={require("../assets/images/not-found.svg")} alt="image not found"/> */}
            <Button
                style={s.btn}
                onClick={() => nav.navigate("/welcome")}
            >
                Go back
            </Button>
        </ThemedView>
    );
}

const s = StyleSheet.create({
    title: {
        fontSize: 20,
        textAlign: "center"
    },
    img: {
        width: 400,
        height: 400,
        alignSelf: "center",
        color: "black",

        transform: [{ scale: 1.5 }]
    },
    btn: {
        marginBottom: 35
    },
    view: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100%"
    }
});
