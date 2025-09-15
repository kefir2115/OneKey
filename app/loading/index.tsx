import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { global } from "@/constants/Styles";
import useTheme from "@/hooks/useTheme";
import { useLocalSearchParams } from "expo-router";
import { Screen } from "expo-router/build/views/Screen";
import LottieView from "lottie-react-native";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const loader = require("../../assets/images/loader.json");

export interface LoadingProps {
    subtitle?: string;
    address?: {
        street?: string;
        code?: string;
    };
}

export default function Loading(prop: LoadingProps) {
    const { color } = useTheme();
    const props = useLocalSearchParams();
    const [subtitle, setSubtitle] = useState(props.subtitle || prop.subtitle || "Loading...");
    const [address, setAddress] = useState(
        props.street || props.code
            ? {
                  street: (props.street as string) || prop.address?.street || "Street",
                  code: (props.code as string) || prop.address?.code || "Postal Code"
              }
            : null
    );

    return (
        <>
            <Screen
                name="Loading"
                options={{ headerShown: false }}
            />
            <SafeAreaView style={[global.container, { backgroundColor: color(0) }]}>
                <LottieView
                    source={loader}
                    autoPlay
                    loop
                    style={style.spinner}
                />
                <ThemedText style={style.subtitle}>{subtitle}</ThemedText>
                {address && (
                    <ThemedView style={style.address}>
                        <ThemedText style={style.street}>{address.street}</ThemedText>
                        <ThemedText style={style.code}>{address.code}</ThemedText>
                    </ThemedView>
                )}
            </SafeAreaView>
        </>
    );
}

const style = StyleSheet.create({
    spinner: {
        width: "50%",
        aspectRatio: 1,
        transform: [{ scale: 2 }]
    },
    subtitle: {
        fontFamily: "PoppinsBold"
    },
    address: {
        position: "absolute",
        bottom: 0,
        margin: "5%",
        padding: "10%",
        elevation: 10,
        width: "90%",
        borderRadius: 20
    },
    street: {
        textAlign: "center",
        fontFamily: "PoppinsMedium",
        fontSize: 20
    },
    code: {
        textAlign: "center",
        opacity: 0.7
    }
});
