import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Button from "@/components/ui/Button";
import { Header } from "@/components/ui/Header";
import {
    getForegroundPermissionsAsync,
    hasServicesEnabledAsync,
    LocationPermissionResponse,
    requestForegroundPermissionsAsync
} from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Loading from "../loading";

export default function LocationInfo() {
    const router = useRouter();

    const [permission, setPermission] = useState<LocationPermissionResponse | null>(null);
    const [serviceAvailable, setServiceAvailable] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const service = await hasServicesEnabledAsync();
            const permission = await getForegroundPermissionsAsync();

            setServiceAvailable(service);
            setPermission(permission);
            setLoading(false);
        })();
    });

    const request = () => {
        requestForegroundPermissionsAsync().then((e) => {
            if (e.granted) router.back();
        });
    };

    return (
        <>
            <Header title={"Back"} />
            {loading && <Loading subtitle="Loading..." />}
            <SafeAreaView>
                <ThemedText style={style.title}>Location issues</ThemedText>
                {!serviceAvailable && (
                    <ThemedView style={style.card}>
                        <ThemedText>
                            Looks like you have your location service disabled. It is required for app to work correctly.
                        </ThemedText>
                    </ThemedView>
                )}
                {(!permission || !permission.granted) && (
                    <ThemedView style={style.card}>
                        <ThemedText>You have to allow to use your location in order for app to work correctly.</ThemedText>
                        <Button
                            style={style.btn}
                            onClick={request}
                        >
                            Enable
                        </Button>
                    </ThemedView>
                )}
            </SafeAreaView>
        </>
    );
}

const style = StyleSheet.create({
    title: {
        fontSize: 18,
        fontFamily: "PoppinsMedium"
    },
    card: {
        elevation: 10
    },
    btn: {
        elevation: 5
    }
});
