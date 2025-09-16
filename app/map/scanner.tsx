import { ThemedText } from "@/components/ThemedText";
import { HeaderTransparent } from "@/components/ui/Header";
import { global } from "@/constants/Styles";
import useLang from "@/hooks/useLang";
import { BarcodeScanningResult, CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import Loading from "../loading";

export default function Scanner() {
    const { f } = useLang();
    const { width, height } = useWindowDimensions();
    const [permission, requestPermission] = useCameraPermissions();
    const router = useRouter();

    const [codeResult, setCodeResult] = useState("");

    if (!permission) return <Loading subtitle="Loading..." />;

    if (!permission.granted) {
        requestPermission().then((p) => {
            if (!p.granted) router.back();
        });
        return <Loading subtitle="Loading..." />;
    }

    const qrScanned = (e: BarcodeScanningResult) => {
        if (e.type === "qr" && e.data !== codeResult) {
            setCodeResult(e.data);
        }
    };

    const rectWidth = width * 0.7;
    const rectHeight = rectWidth;
    const left = (width - rectWidth) / 2;
    const top = (height - rectHeight) / 2;
    const r = (rectWidth / 100) * 10;

    const path = `
        M0 0 H${width} V${height} H0 Z
        M${left + r} ${top}
        H${left + rectWidth - r}
        A${r} ${r} 0 0 1 ${left + rectWidth} ${top + r}
        V${top + rectHeight - r}
        A${r} ${r} 0 0 1 ${left + rectWidth - r} ${top + rectHeight}
        H${left + r}
        A${r} ${r} 0 0 1 ${left} ${top + rectHeight - r}
        V${top + r}
        A${r} ${r} 0 0 1 ${left + r} ${top}
        Z
    `;

    return (
        <View style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFill}
                onBarcodeScanned={qrScanned}
            />
            <View
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
            >
                <Svg
                    width={width}
                    height={height}
                >
                    <Path
                        d={path}
                        fill="#00000099"
                        fillRule="evenodd"
                    />
                </Svg>
            </View>
            <SafeAreaView style={global.container}>
                <HeaderTransparent title={"Back"} />
                <ThemedText style={styles.text}>{f("qrScan")}</ThemedText>
                <ThemedText style={styles.text}>{codeResult}</ThemedText>
            </SafeAreaView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black"
    },
    text: {
        top: "10%",

        fontSize: 25,
        lineHeight: 30,
        fontFamily: "PoppinsMedium",
        color: "#fff"
    }
});
